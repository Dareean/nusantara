export type LessonResult = {
  lessonId: number;
  answered: string;
  correct: boolean;
  score: number;
  xp: number;
  completedAt: string;
  totalExercises?: number;
  correctExercises?: number;
  bonusXp?: number;
  heartsRemaining?: number;
  completed?: boolean;
};

export type LessonSessionResult = {
  lessonId: number;
  answered: string;
  score: number;
  xpEarned: number;
  bonusXp: number;
  totalExercises: number;
  correctExercises: number;
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
};

const PROGRESS_PREFIX = "laras.progress.";

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  hearts: 3,
  completedLessons: [],
  unlockedLessons: [1],
  badges: [],
  lastLesson: null,
  lastStudyDate: null,
};

function progressKey(email: string) {
  return `${PROGRESS_PREFIX}${email.toLowerCase()}`;
}

export function readProgress(email: string): UserProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = window.localStorage.getItem(progressKey(email));
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedLessons: parsed.completedLessons ?? [],
      unlockedLessons: parsed.unlockedLessons ?? [1],
      badges: parsed.badges ?? [],
      lastLesson: parsed.lastLesson ?? null,
      lastStudyDate: parsed.lastStudyDate ?? null,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(email: string, progress: UserProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(progressKey(email), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("laras-progress-updated"));
  void fetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, progress }),
  }).catch(() => {
    // Keep the local cache when Supabase is unavailable.
  });
}

export async function loadProgress(email: string): Promise<UserProgress> {
  const local = readProgress(email);
  if (typeof window === "undefined") return local;

  try {
    const response = await fetch("/api/progress", { credentials: "include", cache: "no-store" });
    if (!response.ok) return local;
    const body = (await response.json()) as { progress?: Partial<UserProgress> | null };
    if (!body.progress) return local;
    const remote: UserProgress = {
      ...DEFAULT_PROGRESS,
      ...body.progress,
      completedLessons: body.progress.completedLessons ?? [],
      unlockedLessons: body.progress.unlockedLessons ?? [1],
      badges: body.progress.badges ?? [],
      lastLesson: body.progress.lastLesson ?? null,
      lastStudyDate: body.progress.lastStudyDate ?? null,
    };
    window.localStorage.setItem(progressKey(email), JSON.stringify(remote));
    return remote;
  } catch {
    return local;
  }
}

export function recordLessonResult(email: string, result: LessonResult) {
  const current = readProgress(email);
  const alreadyCompleted = current.completedLessons.includes(result.lessonId);
  const today = result.completedAt.slice(0, 10);
  const previousDate = current.lastStudyDate;
  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const streak = previousDate === today
    ? current.streak
    : previousDate === yesterdayKey
      ? current.streak + 1
      : 1;
  const completedLessons = result.correct && !alreadyCompleted
    ? [...current.completedLessons, result.lessonId]
    : current.completedLessons;
  const unlockedLessons = result.correct && !alreadyCompleted
    ? Array.from(new Set([...current.unlockedLessons, result.lessonId + 1]))
    : current.unlockedLessons;
  const next: UserProgress = {
    ...current,
    xp: current.xp + (result.correct && !alreadyCompleted ? result.xp : 0),
    streak,
    hearts: result.correct || alreadyCompleted ? current.hearts : Math.max(0, current.hearts - 1),
    completedLessons,
    unlockedLessons,
    badges: result.correct && result.lessonId === 1 && !current.badges.includes("Pionir Salam")
      ? [...current.badges, "Pionir Salam"]
      : current.badges,
    lastLesson: result,
    lastStudyDate: today,
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
  const streak = previousDate === today
    ? current.streak
    : previousDate === yesterdayKey
      ? current.streak + 1
      : 1;
  const lessonResult: LessonResult = {
    lessonId: result.lessonId,
    answered: result.answered,
    correct: result.correctExercises === result.totalExercises,
    score: result.score,
    xp: result.xpEarned,
    bonusXp: result.bonusXp,
    totalExercises: result.totalExercises,
    correctExercises: result.correctExercises,
    heartsRemaining: result.heartsRemaining,
    completed: true,
    completedAt: result.completedAt,
  };
  const next: UserProgress = {
    ...current,
    xp: alreadyCompleted ? current.xp : current.xp + result.xpEarned + result.bonusXp,
    streak,
    hearts: result.heartsRemaining,
    completedLessons: alreadyCompleted ? current.completedLessons : [...current.completedLessons, result.lessonId],
    unlockedLessons: alreadyCompleted
      ? current.unlockedLessons
      : Array.from(new Set([...current.unlockedLessons, result.lessonId + 1])),
    badges: result.lessonId === 1 && !current.badges.includes("Pionir Salam")
      ? [...current.badges, "Pionir Salam"]
      : current.badges,
    lastLesson: lessonResult,
    lastStudyDate: today,
  };
  saveProgress(email, next);
  return next;
}