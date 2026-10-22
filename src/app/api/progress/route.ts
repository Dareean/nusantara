import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/app/auth/serverAuth";

export type StoredProgress = {
  xp: number;
  streak: number;
  hearts: number;
  completedLessons: number[];
  unlockedLessons: number[];
  badges: string[];
  lastLesson: unknown;
  lastStudyDate: string | null;
};

type ProgressPayload = {
  email?: unknown;
  progress?: Partial<StoredProgress>;
};

const PROGRESS_STORE_PATH = path.join(process.cwd(), "laras_user_progress.json");

function getLocalProgress(email: string): StoredProgress | null {
  try {
    if (!fs.existsSync(PROGRESS_STORE_PATH)) return null;
    const raw = fs.readFileSync(PROGRESS_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed[email.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

function saveLocalProgress(email: string, progress: StoredProgress) {
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

function authenticatedEmail(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  return session?.email ?? null;
}

export function mergeProgressAntiRegression(
  serverData: Partial<StoredProgress> | null | undefined,
  incoming: Partial<StoredProgress>
): StoredProgress {
  const serverXp = Number(serverData?.xp || 0);
  const incomingXp = Number(incoming?.xp || 0);

  const serverCompleted = Array.isArray(serverData?.completedLessons) ? serverData.completedLessons : [];
  const incomingCompleted = Array.isArray(incoming?.completedLessons) ? incoming.completedLessons : [];

  const serverUnlocked = Array.isArray(serverData?.unlockedLessons) ? serverData.unlockedLessons : [1];
  const incomingUnlocked = Array.isArray(incoming?.unlockedLessons) ? incoming.unlockedLessons : [1];

  const serverBadges = Array.isArray(serverData?.badges) ? serverData.badges : [];
  const incomingBadges = Array.isArray(incoming?.badges) ? incoming.badges : [];

  const serverStreak = Number(serverData?.streak || 0);
  const incomingStreak = Number(incoming?.streak || 0);

  // 1. completedLessons: Union of server ∪ client
  const completedSet = new Set<number>([...serverCompleted, ...incomingCompleted]);
  const completedLessons = Array.from(completedSet).sort((a, b) => a - b);

  // 2. unlockedLessons: Union of server ∪ client (at least [1])
  const unlockedSet = new Set<number>([...serverUnlocked, ...incomingUnlocked, 1]);
  const unlockedLessons = Array.from(unlockedSet).sort((a, b) => a - b);

  // 3. badges: Union of server ∪ client
  const badgesSet = new Set<string>([...serverBadges, ...incomingBadges]);
  const badges = Array.from(badgesSet);

  // 4. xp: Highest value (never regresses)
  const xp = Math.max(serverXp, incomingXp);

  // 5. streak: Highest value (never regresses)
  const streak = Math.max(serverStreak, incomingStreak);

  // Stale/empty payload check (e.g. fresh browser sending default 0s)
  const incomingIsDefaultOrEmpty = incomingXp === 0 && incomingCompleted.length === 0 && !incoming.lastLesson;

  const hearts = !incomingIsDefaultOrEmpty && typeof incoming.hearts === "number"
    ? incoming.hearts
    : (typeof serverData?.hearts === "number" ? serverData.hearts : 3);

  const lastLesson = (!incomingIsDefaultOrEmpty && incoming.lastLesson)
    ? incoming.lastLesson
    : (serverData?.lastLesson ?? null);

  const lastStudyDate = (!incomingIsDefaultOrEmpty && incoming.lastStudyDate)
    ? incoming.lastStudyDate
    : (serverData?.lastStudyDate ?? null);

  return {
    xp,
    streak,
    hearts,
    completedLessons,
    unlockedLessons,
    badges,
    lastLesson,
    lastStudyDate,
  };
}

export async function GET(req: NextRequest) {
  const email = authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data, error } = await createAdminClient()
      .from("user_progress")
      .select("progress, updated_at")
      .eq("email", email)
      .maybeSingle();

    if (!error && data?.progress) {
      return NextResponse.json({
        ok: true,
        synced: true,
        source: "database",
        updatedAt: data.updated_at,
        progress: data.progress,
      });
    }
    if (error) {
      console.warn("Supabase user_progress query returned error:", error.message);
    }
  } catch (err) {
    console.warn("Supabase user_progress tidak terjangkau, menggunakan store lokal:", err);
  }

  const local = getLocalProgress(email);
  return NextResponse.json({
    ok: true,
    synced: false,
    source: "fallback_local",
    progress: local,
  });
}

export async function PUT(req: NextRequest) {
  const email = authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as ProgressPayload;
  if (!body.progress || typeof body.progress !== "object") {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  // Retrieve existing server progress for anti-regression merging (prioritize database)
  let serverProgress: StoredProgress | null = null;
  let remoteFetchError: string | null = null;
  try {
    const { data, error } = await createAdminClient()
      .from("user_progress")
      .select("progress, updated_at")
      .eq("email", email)
      .maybeSingle();

    if (!error && data?.progress) {
      serverProgress = data.progress as StoredProgress;
    } else if (error) {
      remoteFetchError = error.message;
      console.warn("Supabase check error during PUT:", error.message);
    }
  } catch (err) {
    remoteFetchError = err instanceof Error ? err.message : String(err);
    console.warn("Supabase fetch exception during PUT:", err);
  }

  // CRITICAL PROTECTION:
  // If database query failed with error, do NOT proceed with blind upsert to avoid wiping data
  if (remoteFetchError) {
    return NextResponse.json(
      {
        ok: false,
        synced: false,
        source: "database_error",
        error: `Gagal membaca data dari database Supabase: ${remoteFetchError}`,
      },
      { status: 500 }
    );
  }

  if (!serverProgress) {
    serverProgress = getLocalProgress(email);
  }

  // Guard against empty incoming payload wiping non-empty database data
  const incomingXp = Number(body.progress?.xp || 0);
  const incomingCompleted = Array.isArray(body.progress?.completedLessons) ? body.progress.completedLessons : [];
  if (serverProgress && (serverProgress.xp > 0 || serverProgress.completedLessons.length > 0)) {
    if (incomingXp === 0 && incomingCompleted.length === 0) {
      console.warn(`[PUT /api/progress] Menolak overwrite kosong untuk ${email}, mempertahankan progres server`);
      return NextResponse.json({
        ok: true,
        synced: true,
        source: "database_protected",
        progress: serverProgress,
      });
    }
  }

  // Perform robust anti-regression union
  const mergedProgress = mergeProgressAntiRegression(serverProgress, body.progress);

  // Always save locally as disaster-recovery backup
  saveLocalProgress(email, mergedProgress);

  // Upsert to Supabase user_progress table
  try {
    const { error: upsertError } = await createAdminClient().from("user_progress").upsert(
      { email, progress: mergedProgress, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );

    if (upsertError) {
      console.warn("Supabase upsert progress error:", upsertError.message);
      return NextResponse.json(
        {
          ok: false,
          synced: false,
          source: "fallback_local",
          error: `Gagal menyimpan ke database Supabase: ${upsertError.message}`,
          progress: mergedProgress,
        },
        { status: 500 }
      );
    }

    // Success in Supabase database
    return NextResponse.json({
      ok: true,
      synced: true,
      source: "database",
      progress: mergedProgress,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("Supabase tidak terjangkau:", msg);
    return NextResponse.json(
      {
        ok: false,
        synced: false,
        source: "fallback_local",
        error: `Supabase tidak terjangkau: ${msg}`,
        progress: mergedProgress,
      },
      { status: 500 }
    );
  }
}