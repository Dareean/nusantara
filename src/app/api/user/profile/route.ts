import { NextRequest, NextResponse } from "next/server";
import {
  getSession,
  getUserProfile,
  updateUserProfile,
  createSessionForUser,
  isAdminEmail,
} from "@/app/auth/serverAuth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

async function getAuthenticatedUser(req: NextRequest) {
  const cookie = req.cookies.get("laras_session")?.value;
  let session = getSession(cookie);

  if (!session) {
    try {
      const nextSession = await getServerSession(authOptions);
      if (nextSession?.user?.email) {
        const email = nextSession.user.email.toLowerCase().trim();
        const name = nextSession.user.name || email.split("@")[0];
        const newSessionId = createSessionForUser({ email, name });
        session = getSession(newSessionId);
      }
    } catch {}
  }

  return session;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Sesi tidak ditemukan / belum login" }, { status: 401 });
    }

    const profile = await getUserProfile(session.email);
    return NextResponse.json({
      ok: true,
      profile: {
        ...profile,
        isAdmin: isAdminEmail(session.email),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Sesi tidak ditemukan / belum login" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, avatarUrl, currentPassword, newPassword } = body;

    const result = await updateUserProfile(session.email, {
      name,
      avatarUrl,
      currentPassword,
      newPassword,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Gagal memperbarui profil" }, { status: 400 });
    }

    // Perbarui token sesi aktif (laras_session) dengan data yang baru
    const newSessionId = createSessionForUser({
      email: session.email,
      name: result.user?.name || session.name,
      avatarUrl: result.user?.avatarUrl || session.avatarUrl,
    });

    const res = NextResponse.json({
      ok: true,
      message: "Profil berhasil diperbarui",
      session: {
        email: session.email,
        name: result.user?.name || session.name,
        avatarUrl: result.user?.avatarUrl || session.avatarUrl || "",
        isAdmin: isAdminEmail(session.email),
      },
    });

    res.cookies.set("laras_session", newSessionId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
