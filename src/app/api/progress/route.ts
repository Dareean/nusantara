import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession, isJuryReadOnly } from "@/app/auth/serverAuth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

export type StoredProgress = {
  xp: number;
  streak: number;
  hearts: number;
  completedLessons: number[];
  unlockedLessons: number[];
  badges: string[];
  lastLesson: unknown;
  lastStudyDate: string | null;
  cultureConnectionClaimed?: boolean;
  dailyXpLog?: Record<string, number>;
};

export const INITIAL_EMPTY_PROGRESS: StoredProgress = {
  xp: 0,
  streak: 0,
  hearts: 3,
  completedLessons: [],
  unlockedLessons: [1],
  badges: [],
  lastLesson: null,
  lastStudyDate: null,
  cultureConnectionClaimed: false,
  dailyXpLog: {},
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

async function authenticatedEmail(req: NextRequest): Promise<string | null> {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  if (session?.email) return session.email.toLowerCase().trim();

  try {
    const nextSession = await getServerSession(authOptions);
    if (nextSession?.user?.email) {
      return nextSession.user.email.toLowerCase().trim();
    }
  } catch {}

  return null;
}

function mergeProgressAntiRegression(
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

  let lastLesson = serverData?.lastLesson ?? null;
  if (incoming.lastLesson) {
    if (!serverData?.lastLesson) {
      lastLesson = incoming.lastLesson;
    } else {
      const incomingTime = new Date((incoming.lastLesson as { completedAt?: string })?.completedAt || 0).getTime();
      const serverTime = new Date((serverData.lastLesson as { completedAt?: string })?.completedAt || 0).getTime();
      if (incomingTime >= serverTime) {
        lastLesson = incoming.lastLesson;
      }
    }
  }

  const lastStudyDate = (!incomingIsDefaultOrEmpty && incoming.lastStudyDate)
    ? incoming.lastStudyDate
    : (serverData?.lastStudyDate ?? null);

  const cultureConnectionClaimed = Boolean(serverData?.cultureConnectionClaimed || incoming.cultureConnectionClaimed);

  const serverDaily = (serverData as { dailyXpLog?: Record<string, number> })?.dailyXpLog || {};
  const incomingDaily = (incoming as { dailyXpLog?: Record<string, number> })?.dailyXpLog || {};
  const mergedDailyLog: Record<string, number> = { ...serverDaily };
  for (const [d, val] of Object.entries(incomingDaily)) {
    mergedDailyLog[d] = Math.max(mergedDailyLog[d] || 0, Number(val) || 0);
  }

  const authPayload = (serverData as Record<string, unknown>)?._auth || (incoming as Record<string, unknown>)?._auth;

  return {
    xp,
    streak,
    hearts,
    completedLessons,
    unlockedLessons,
    badges,
    lastLesson,
    lastStudyDate,
    cultureConnectionClaimed,
    dailyXpLog: mergedDailyLog,
    ...(authPayload ? { _auth: authPayload } : {}),
  };
}

export async function GET(req: NextRequest) {
  const email = await authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
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

    // Bila pengguna belum memiliki progres di Supabase (pengguna baru),
    // otomatis inisialisasi baris progres bersih (0 XP, 0 streak, 3 hearts, dll.) ke Supabase!
    if (!error && !data) {
      const initial = { ...INITIAL_EMPTY_PROGRESS };
      const { error: insertError } = await adminClient.from("user_progress").upsert({
        email,
        progress: initial,
        updated_at: new Date().toISOString(),
      });

      if (!insertError) {
        saveLocalProgress(email, initial);
        return NextResponse.json({
          ok: true,
          synced: true,
          source: "database_init",
          progress: initial,
        });
      }
    }

    if (error) {
      console.warn(`[SYNC GET] Supabase query returned error: ${error.message} (code: ${error.code || 'N/A'})`);
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[SYNC GET] Supabase tidak terjangkau (${errMsg}), menggunakan store lokal.`);
  }

  const local = getLocalProgress(email);
  return NextResponse.json({
    ok: true,
    synced: false,
    source: "fallback_local",
    progress: local || { ...INITIAL_EMPTY_PROGRESS },
  });
}

export async function PUT(req: NextRequest) {
  const email = await authenticatedEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Jury read-only guard
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  if (isJuryReadOnly(session)) {
    return NextResponse.json(
      { error: "Mode demo juri: hanya lihat" },
      { status: 403 }
    );
  }

  const body = (await req.json()) as ProgressPayload;
  if (!body.progress || typeof body.progress !== "object") {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  // Retrieve existing server progress for anti-regression merging (prioritize database)
  let serverProgress: StoredProgress | null = null;
  let remoteFetchError: string | null = null;
  let isNetworkError = false;

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
      const lower = error.message.toLowerCase();
      if (
        lower.includes("fetch failed") ||
        lower.includes("enotfound") ||
        lower.includes("econnrefused") ||
        lower.includes("network") ||
        lower.includes("connect")
      ) {
        isNetworkError = true;
      }
      console.warn(`[SYNC PUT] Supabase read error: ${error.message} (isNetworkError: ${isNetworkError})`);
    }
  } catch (err) {
    remoteFetchError = err instanceof Error ? err.message : String(err);
    isNetworkError = true;
    console.warn(`[SYNC PUT] Supabase unreachable (network/offline): ${remoteFetchError}`);
  }

  // If remote returned an actual database-level error (not network offline), guard against data loss
  if (remoteFetchError && !isNetworkError) {
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
        synced: !isNetworkError,
        source: isNetworkError ? "fallback_local" : "database_protected",
        progress: serverProgress,
      });
    }
  }

  // Perform robust anti-regression union
  const mergedProgress = mergeProgressAntiRegression(serverProgress, body.progress);

  // Always save locally as disaster-recovery backup
  saveLocalProgress(email, mergedProgress);

  // If network was unreachable during read, respond with fallback_local (data saved safely locally)
  if (isNetworkError) {
    return NextResponse.json({
      ok: true,
      synced: false,
      source: "fallback_local",
      progress: mergedProgress,
    });
  }

  // Upsert to Supabase user_progress table
  try {
    const { error: upsertError } = await createAdminClient().from("user_progress").upsert(
      { email, progress: mergedProgress, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );

    if (upsertError) {
      console.warn(`[SYNC PUT] Supabase upsert error: ${upsertError.message}`);
      return NextResponse.json(
        {
          ok: true,
          synced: false,
          source: "fallback_local",
          progress: mergedProgress,
        }
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
    console.warn(`[SYNC PUT] Supabase write unreachable: ${msg}`);
    return NextResponse.json({
      ok: true,
      synced: false,
      source: "fallback_local",
      progress: mergedProgress,
    });
  }
}