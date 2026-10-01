import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/app/auth/serverAuth";

type ProgressPayload = {
  email?: unknown;
  progress?: unknown;
};

async function authenticatedEmail(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  return session?.email ?? null;
}

export async function GET(req: NextRequest) {
  const email = await authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await createAdminClient()
    .from("user_progress")
    .select("progress")
    .eq("email", email)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ progress: data?.progress ?? null });
}

export async function PUT(req: NextRequest) {
  const email = await authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as ProgressPayload;
  if (body.email !== email || !body.progress || typeof body.progress !== "object") {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  const { error } = await createAdminClient().from("user_progress").upsert(
    { email, progress: body.progress, updated_at: new Date().toISOString() },
    { onConflict: "email" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}