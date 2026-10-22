import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import { ensureOAuthUser, createSessionForUser, isAdminEmail } from "@/app/auth/serverAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const rawTarget = req.nextUrl.searchParams.get("redirect") || "/dashboard";

    if (!session?.user?.email) {
      console.warn("OAuth sync: No active NextAuth session found.");
      return NextResponse.redirect(new URL("/auth?error=OAuthFailed", req.url));
    }

    const email = session.user.email.toLowerCase().trim();
    const name = session.user.name || email.split("@")[0];
    const isAdmin = isAdminEmail(email);

    // Pastikan user terdaftar di store
    ensureOAuthUser({ email, name });

    // Inisialisasi record user_progress di Supabase jika pengguna baru pertama kali login
    try {
      const adminClient = createAdminClient();
      const { data } = await adminClient
        .from("user_progress")
        .select("progress")
        .eq("email", email)
        .maybeSingle();

      if (!data?.progress) {
        const initialProgress = {
          xp: 0,
          streak: 0,
          hearts: 3,
          completedLessons: [],
          unlockedLessons: [1],
          badges: [],
          lastLesson: null,
          lastStudyDate: null,
        };
        await adminClient.from("user_progress").upsert({
          email,
          progress: initialProgress,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Inisialisasi user_progress di Supabase:", err);
    }

    // Buat token sesi LARAS (stateless HMAC-SHA256)
    const sessionId = createSessionForUser({ email, name });

    // Tentukan URL tujuan yang aman
    let destination = rawTarget.startsWith("/") && !rawTarget.startsWith("//") ? rawTarget : "/dashboard";
    if (destination.startsWith("/admin") && !isAdmin) {
      destination = "/dashboard";
    }

    const redirectUrl = new URL(destination, req.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set cookie laras_session
    response.cookies.set("laras_session", sessionId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("OAuth sync error:", err);
    return NextResponse.redirect(new URL("/auth?error=OAuthError", req.url));
  }
}
