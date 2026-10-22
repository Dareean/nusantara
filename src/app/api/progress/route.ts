import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/app/auth/serverAuth";

type ProgressPayload = {
  email?: unknown;
  progress?: unknown;
};

const PROGRESS_STORE_PATH = path.join(process.cwd(), "laras_user_progress.json");

function getLocalProgress(email: string): Record<string, unknown> | null {
  try {
    if (!fs.existsSync(PROGRESS_STORE_PATH)) return null;
    const raw = fs.readFileSync(PROGRESS_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed[email.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

function saveLocalProgress(email: string, progress: unknown) {
  try {
    let current: Record<string, unknown> = {};
    if (fs.existsSync(PROGRESS_STORE_PATH)) {
      try {
        current = JSON.parse(fs.readFileSync(PROGRESS_STORE_PATH, "utf8"));
      } catch {}
    }
    current[email.toLowerCase()] = progress;
    const tmp = PROGRESS_STORE_PATH + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(current, null, 2), "utf8");
    fs.renameSync(tmp, PROGRESS_STORE_PATH);
  } catch (err) {
    console.warn("Gagal menyimpan ke laras_user_progress.json:", err);
  }
}

async function authenticatedEmail(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  return session?.email ?? null;
}

export async function GET(req: NextRequest) {
  const email = await authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data, error } = await createAdminClient()
      .from("user_progress")
      .select("progress")
      .eq("email", email)
      .maybeSingle();

    if (!error && data?.progress) {
      return NextResponse.json({ progress: data.progress });
    }
  } catch (err) {
    console.warn("Supabase user_progress tidak terjangkau, menggunakan store lokal:", err);
  }

  const local = getLocalProgress(email);
  return NextResponse.json({ progress: local });
}

export async function PUT(req: NextRequest) {
  const email = await authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as ProgressPayload;
  if (body.email !== email || !body.progress || typeof body.progress !== "object") {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  // Always save locally for offline / fallback resilience
  saveLocalProgress(email, body.progress);

  try {
    const { error } = await createAdminClient().from("user_progress").upsert(
      { email, progress: body.progress, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );

    if (error) {
      console.warn("Supabase upsert progress error (tetap tersimpan di local store):", error.message);
    }
  } catch (err) {
    console.warn("Supabase tidak terjangkau (tetap tersimpan di local store):", err);
  }

  return NextResponse.json({ ok: true });
}