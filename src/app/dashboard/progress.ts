import { CANONICAL_BADGES } from "@/lib/badges";

export type LessonResult = {
  lessonId: number;
  answered: string;
  correct: boolean;
  score: number;
  xp: number;
  completedAt: string;
  totalExercises?: number;
  correctExercises?: number;
  firstAttemptCorrect?: number;
  bonusXp?: number;
  heartsRemaining?: number;
  completed?: boolean;
  isRepeat?: boolean;
  baseRewardXp?: number;
};

export type LessonSessionResult = {
  lessonId: number;
  answered: string;
  score: number;
  xpEarned: number;
  bonusXp: number;
  totalExercises: number;
  correctExercises: number;
  firstAttemptCorrect?: number;
  heartsRemaining: number;
  completedAt: string;
};

export type UserProgress = {
  xp: number;
  streak: number;
  hearts: number;
  completedLessons: number[];
  unlockedLessons: number[];
  badges: string[];
  lastLesson: LessonResult | null;
  lastStudyDate: string | null;
  cultureConnectionClaimed?: boolean;
};

const PROGRESS_PREFIX = "laras.progress.";
const UNSYNCED_PREFIX = "laras.progress.unsynced.";

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  hearts: 3,
  completedLessons: [],
  unlockedLessons: [1],
  badges: [],
  lastLesson: null,
  lastStudyDate: null,
  cultureConnectionClaimed: false,
};

function progressKey(email: string) {
  return `${PROGRESS_PREFIX}${email.toLowerCase()}`;
}

function unsyncedKey(email: string) {
  return `${UNSYNCED_PREFIX}${email.toLowerCase()}`;
}

export function readProgress(email: string): UserProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = window.localStorage.getItem(progressKey(email));
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const today = new Date().toISOString().slice(0, 10);
    const isNewDay = Boolean(parsed.lastStudyDate && parsed.lastStudyDate < today);
    const hearts = isNewDay
      ? 3
      : (typeof parsed.hearts === "number" && parsed.hearts > 0 ? parsed.hearts : 3);

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      hearts,
      completedLessons: parsed.completedLessons ?? [],
      unlockedLessons: parsed.unlockedLessons ?? [1],
      badges: parsed.badges ?? [],
      lastLesson: parsed.lastLesson ?? null,
      lastStudyDate: parsed.lastStudyDate ?? null,
      cultureConnectionClaimed: Boolean(parsed.cultureConnectionClaimed),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

/**
 * Merge local and remote progress using anti-regression rules.
 * Neither XP, completed lessons, unlocked lessons, nor badges will ever regress.
 */
export function mergeClientProgress(
  local: UserProgress,
  remote: Partial<UserProgress>
): UserProgress {
  const completedLessons = Array.from(
    new Set([...(local.completedLessons || []), ...(remote.completedLessons || [])])
  ).sort((a, b) => a - b);

  const unlockedLessons = Array.from(
    new Set([...(local.unlockedLessons || [1]), ...(remote.unlockedLessons || [1]), 1])
  ).sort((a, b) => a - b);

  const badges = Array.from(
    new Set([...(local.badges || []), ...(remote.badges || [])])
  );

  const xp = Math.max(Number(local.xp || 0), Number(remote.xp || 0));
  const streak = Math.max(Number(local.streak || 0), Number(remote.streak || 0));
  const rawHearts = typeof remote.hearts === "number" ? remote.hearts : local.hearts;
  const hearts = rawHearts > 0 ? rawHearts : 3;

  let lastLesson = local.lastLesson || remote.lastLesson || null;
  if (local.lastLesson && remote.lastLesson) {
    const localTime = new Date(local.lastLesson.completedAt || 0).getTime();
    const remoteTime = new Date((remote.lastLesson as LessonResult).completedAt || 0).getTime();
    const remoteHasMetrics = (remote.lastLesson as LessonResult).totalExercises !== undefined;
    if (remoteTime > localTime && remoteHasMetrics) {
      lastLesson = remote.lastLesson as LessonResult;
    } else {
      lastLesson = local.lastLesson;
    }
  }

  const lastStudyDate = remote.lastStudyDate || local.lastStudyDate || null;
  const cultureConnectionClaimed = Boolean(local.cultureConnectionClaimed || remote.cultureConnectionClaimed);

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
  };
}

const hydratedEmails = new Set<string>();

export function isEmailHydrated(email: string): boolean {
  if (typeof window === "undefined" || !email) return false;
  return hydratedEmails.has(email.toLowerCase());
}

export function saveProgress(email: string, progress: UserProgress) {
  if (typeof window === "undefined" || !email) return;

  // Immediately persist to local storage for instant responsiveness
  window.localStorage.setItem(progressKey(email), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("laras-progress-updated"));

  // Background server sync with anti-regression guarantee
  (async () => {
    // Client MUST NOT send PUT before server hydration has succeeded
    if (!hydratedEmails.has(email.toLowerCase())) {
      try {
        await loadProgress(email);
      } catch {
        // Hydration failed / offline: keep in local storage
        return;
      }
    }

    const latestLocal = readProgress(email);
    const progressToSend = mergeClientProgress(latestLocal, progress);

    const sendPut = async () => {
      return await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, progress: progressToSend }),
      });
    };

    try {
      let resp = await sendPut();

      // If unauthorized (401), try to re-validate session once and retry
      if (resp.status === 401) {
        try {
          await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
          resp = await sendPut();
        } catch {
          // ignore session revalidation error
        }
      }

      if (resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as {
          ok?: boolean;
          synced?: boolean;
          source?: string;
          progress?: Partial<UserProgress>;
        };
        if (data.synced === false) {
          // If server fell back to local store without database sync, keep in unsynced queue
          window.localStorage.setItem(unsyncedKey(email), JSON.stringify(progressToSend));
        } else {
          window.localStorage.removeItem(unsyncedKey(email));
        }
        if (data.progress) {
          const merged = mergeClientProgress(progressToSend, data.progress);
          window.localStorage.setItem(progressKey(email), JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent("laras-progress-updated"));
        }
      } else {
        // Server returned non-200: save in unsynced queue so progress is not lost
        window.localStorage.setItem(unsyncedKey(email), JSON.stringify(progressToSend));
      }
    } catch {
      // Network failure / offline: keep in unsynced queue
      window.localStorage.setItem(unsyncedKey(email), JSON.stringify(progressToSend));
    }
  })();
}

export async function loadProgress(email: string): Promise<UserProgress> {
  const local = readProgress(email);
  if (typeof window === "undefined" || !email) return local;

  try {
    // 1. Always fetch from server database FIRST as Single Source of Truth
    const response = await fetch("/api/progress", { credentials: "include", cache: "no-store" });
    if (response.ok) {
      const body = (await response.json()) as {
        ok?: boolean;
        synced?: boolean;
        source?: string;
        progress?: Partial<UserProgress> | null;
      };

      if (body.progress) {
        hydratedEmails.add(email.toLowerCase());

        // Merge anti-regressively: database data takes precedence over empty local
        const merged = mergeClientProgress(local, body.progress);
        window.localStorage.setItem(progressKey(email), JSON.stringify(merged));

        // 2. Safely inspect unsynced queue (discard empty/0 payloads)
        const unsyncedRaw = window.localStorage.getItem(unsyncedKey(email));
        if (unsyncedRaw) {
          try {
            const unsyncedData = JSON.parse(unsyncedRaw) as Partial<UserProgress>;
            const isUnsyncedEmpty =
              (!unsyncedData.xp || unsyncedData.xp === 0) &&
              (!unsyncedData.completedLessons || unsyncedData.completedLessons.length === 0);

            if (
              isUnsyncedEmpty ||
              (merged.xp >= Number(unsyncedData.xp || 0) &&
                merged.completedLessons.length >= (unsyncedData.completedLessons?.length || 0))
            ) {
              // Server is already equal or newer, discard stale unsynced queue
              window.localStorage.removeItem(unsyncedKey(email));
            } else {
              // Unsynced queue has strictly higher progress: flush to server
              const toFlush = mergeClientProgress(merged, unsyncedData);
              const flushResp = await fetch("/api/progress", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, progress: toFlush }),
              });
              if (flushResp.ok) {
                window.localStorage.removeItem(unsyncedKey(email));
              }
            }
          } catch {
            window.localStorage.removeItem(unsyncedKey(email));
          }
        }

        window.dispatchEvent(new CustomEvent("laras-progress-updated"));
        return merged;
      }
    }
    return local;
  } catch {
    return local;
  }
}

export function getNextLessonsToUnlock(completedLessonId: number): number[] {
  if (completedLessonId === 6) {
    // Selesai Pelajaran 6 membuka Pelajaran 7 (inti) dan 16 (pengayaan) sekaligus
    return [7, 16];
  }
  if (completedLessonId === 16) {
    // Selesai Pelajaran 16 membuka Pelajaran 17
    return [17];
  }
  if (completedLessonId === 17) {
    // Selesai Pelajaran 17 tidak membuka apa pun (jangan mencari ID 18)
    return [];
  }
  if (completedLessonId === 15) {
    return [];
  }
  return [completedLessonId + 1];
}

export function recordLessonResult(email: string, result: LessonResult) {
  const current = readProgress(email);
  const alreadyCompleted = current.completedLessons.includes(result.lessonId);
  const today = result.completedAt.slice(0, 10);
  const previousDate = current.lastStudyDate;
  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const streak =
    previousDate === today
      ? current.streak
      : previousDate === yesterdayKey
        ? current.streak + 1
        : 1;

  const completedLessons =
    result.correct && !alreadyCompleted
      ? [...current.completedLessons, result.lessonId]
      : current.completedLessons;

  const newlyUnlocked = getNextLessonsToUnlock(result.lessonId);
  const unlockedLessons =
    result.correct && !alreadyCompleted
      ? Array.from(new Set([...current.unlockedLessons, ...newlyUnlocked]))
      : current.unlockedLessons;

  // Canonical badge for completed lesson
  const badgeObj = CANONICAL_BADGES.find((b) => b.lessonId === result.lessonId);
  const badgeTitle = badgeObj?.title || (result.answered === "culture-connection" ? "Tamu Sopan" : undefined);

  let badges = current.badges;
  if (result.correct && badgeTitle && !badges.includes(badgeTitle)) {
    badges = [...badges, badgeTitle];
  }

  // Culture Connection claim can only be awarded once
  const isCultureConnection = result.answered === "culture-connection";
  const ccAlreadyClaimed = Boolean(current.cultureConnectionClaimed || alreadyCompleted);
  const xpToAdd = isCultureConnection
    ? (result.correct && !ccAlreadyClaimed ? result.xp : 0)
    : (result.correct && !alreadyCompleted ? result.xp : 0);

  const next: UserProgress = {
    ...current,
    xp: current.xp + xpToAdd,
    streak,
    hearts: result.correct || alreadyCompleted ? current.hearts : Math.max(0, current.hearts - 1),
    completedLessons: isCultureConnection
      ? completedLessons
      : completedLessons,
    unlockedLessons: isCultureConnection
      ? unlockedLessons
      : unlockedLessons,
    badges,
    lastLesson: result,
    lastStudyDate: today,
    cultureConnectionClaimed: Boolean(current.cultureConnectionClaimed || isCultureConnection),
  };
  saveProgress(email, next);
  return next;
}

export function recordLessonSession(email: string, result: LessonSessionResult) {
  const current = readProgress(email);
  const alreadyCompleted = current.completedLessons.includes(result.lessonId);
  const today = result.completedAt.slice(0, 10);
  const previousDate = current.lastStudyDate;
  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const streak =
    previousDate === today
      ? current.streak
      : previousDate === yesterdayKey
        ? current.streak + 1
        : Math.max(1, current.streak);

  const isTuntas = result.correctExercises === result.totalExercises;
  // Single source of truth: hearts remaining from the session is persisted directly
  const finalHearts = Math.max(0, result.heartsRemaining);

  const lessonResult: LessonResult = {
    lessonId: result.lessonId,
    answered: result.answered,
    correct: isTuntas,
    score: result.score,
    xp: alreadyCompleted ? 0 : result.xpEarned,
    bonusXp: alreadyCompleted ? 0 : result.bonusXp,
    baseRewardXp: result.xpEarned,
    totalExercises: result.totalExercises,
    correctExercises: result.correctExercises,
    firstAttemptCorrect: result.firstAttemptCorrect !== undefined ? result.firstAttemptCorrect : result.correctExercises,
    heartsRemaining: finalHearts,
    completed: true,
    completedAt: result.completedAt,
    isRepeat: alreadyCompleted,
  };

  // Canonical badge for completed lesson
  const badgeObj = CANONICAL_BADGES.find((b) => b.lessonId === result.lessonId);
  const badgeTitle = badgeObj?.title;

  let badges = current.badges;
  if (badgeTitle && !badges.includes(badgeTitle)) {
    badges = [...badges, badgeTitle];
  }

  const next: UserProgress = {
    ...current,
    xp: alreadyCompleted ? current.xp : current.xp + result.xpEarned + result.bonusXp,
    streak,
    hearts: finalHearts,
    completedLessons: alreadyCompleted
      ? current.completedLessons
      : [...current.completedLessons, result.lessonId],
    unlockedLessons: alreadyCompleted
      ? current.unlockedLessons
      : Array.from(new Set([...current.unlockedLessons, ...getNextLessonsToUnlock(result.lessonId)])),
    badges,
    lastLesson: lessonResult,
    lastStudyDate: today,
  };
  saveProgress(email, next);
  return next;
}