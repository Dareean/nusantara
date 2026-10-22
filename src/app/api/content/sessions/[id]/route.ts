import { NextRequest, NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/app/auth/serverAuth";
import {
  getContentSessionById,
  upsertContentSession,
  deleteContentSession,
} from "@/lib/content/serverContent";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email);
  return { session, email, isAdmin };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const found = await getContentSessionById(id);
  if (!found) {
    return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
  }

  if (found.status === "draft" && !isAdmin) {
    return NextResponse.json({ error: "Forbidden: Sesi draft hanya dapat diakses admin" }, { status: 403 });
  }

  return NextResponse.json({
    id: found.id,
    title: found.title,
    payload: found.payload,
    status: found.status,
    version: found.version,
    updatedAt: found.updated_at,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya kurator/admin yang dapat mengubah sesi" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { title, payload, status } = body || {};

    if (!payload || !Array.isArray(payload.questions)) {
      return NextResponse.json(
        { error: "Payload tidak valid: payload.questions (array) wajib disertakan" },
        { status: 400 }
      );
    }

    const saved = await upsertContentSession({
      id,
      title: title || payload.title || id,
      payload,
      status: status === "draft" ? "draft" : "published",
      created_by: email,
    });

    return NextResponse.json({
      ok: true,
      session: {
        id: saved.id,
        title: saved.title,
        payload: saved.payload,
        status: saved.status,
        version: saved.version,
        updatedAt: saved.updated_at,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui sesi";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya kurator/admin yang dapat menghapus sesi" }, { status: 403 });
  }

  const { id } = await params;
  await deleteContentSession(id);

  return NextResponse.json({ ok: true, deletedId: id });
}
