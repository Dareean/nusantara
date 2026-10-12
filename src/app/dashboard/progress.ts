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

export type DailyQuest = {
  id: string;
  title: string;
  target: number;
  progress: number;
  xpBonus: number;
  completed: boolean;
};

export type DailyQuestsState = {
  date: string;
  quests: DailyQuest[];
  comboClaimed: boolean;
};

export type QuestDefinition = {
  id: string;
  title: string;
  target: number;
  xpBonus: number;
};

export const QUEST_POOL: QuestDefinition[] = [
  { id: "quest_lesson_2", title: "Selesaikan 2 lesson hari ini", target: 2, xpBonus: 20 },
  { id: "quest_xp_100", title: "Kumpulkan 100 XP hari ini", target: 100, xpBonus: 20 },
  { id: "quest_arcade_1", title: "Mainkan Arcade 1 kali", target: 1, xpBonus: 15 },
  { id: "quest_correct_15", title: "Jawab 15 soal dengan benar", target: 15, xpBonus: 20 },
  { id: "quest_culture_1", title: "Selesaikan 1 skenario Culture Connection", target: 1, xpBonus: 25 },
];

export function getDailyQuestDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function generateDailyQuestsForDate(dateStr: string): DailyQuest[] {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dayIndex = Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / (1000 * 60 * 60 * 24));
  const startIndex = Math.abs(dayIndex) % QUEST_POOL.length;

  const selected: DailyQuest[] = [];
  for (let i = 0; i < 3; i++) {
    const def = QUEST_POOL[(startIndex + i) % QUEST_POOL.length];
    selected.push({
      id: def.id,
      title: def.title,
      target: def.target,
      progress: 0,
      xpBonus: def.xpBonus,
      completed: false,
    });
  }
  return selected;
}

export function ensureDailyQuests(progress: UserProgress, todayStr: string = getDailyQuestDateKey()): UserProgress {
  if (
    !progress.dailyQuests ||
    progress.dailyQuests.date !== todayStr ||
    !Array.isArray(progress.dailyQuests.quests) ||
    progress.dailyQuests.quests.length !== 3
  ) {
    return {
      ...progress,
      dailyQuests: {
        date: todayStr,
        quests: generateDailyQuestsForDate(todayStr),
        comboClaimed: false,
      },
    };
  }
  return progress;
}

export type QuestDelta = {
  lessonsCompleted?: number;
  xpGained?: number;
  arcadePlayed?: number;
  correctAnswers?: number;
  cultureCompleted?: number;
};

export function applyQuestDelta(
  progress: UserProgress,
  delta: QuestDelta,
  todayStr: string = getDailyQuestDateKey()
): UserProgress {
  const current = ensureDailyQuests(progress, todayStr);
  if (!current.dailyQuests) return current;

  let bonusXp = 0;
  const updatedQuests = current.dailyQuests.quests.map((q) => {
    let inc = 0;
    if (q.id === "quest_lesson_2" && delta.lessonsCompleted) inc = delta.lessonsCompleted;
    if (q.id === "quest_xp_100" && delta.xpGained) inc = delta.xpGained;
    if (q.id === "quest_arcade_1" && delta.arcadePlayed) inc = delta.arcadePlayed;
    if (q.id === "quest_correct_15" && delta.correctAnswers) inc = delta.correctAnswers;
    if (q.id === "quest_culture_1" && delta.cultureCompleted) inc = delta.cultureCompleted;

    const newProgress = Math.min(q.target, q.progress + inc);
    const justCompleted = !q.completed && newProgress >= q.target;
    if (justCompleted) {
      bonusXp += q.xpBonus;
    }

    return {
      ...q,
      progress: newProgress,
      completed: q.completed || justCompleted,
    };
  });

  let comboClaimed = current.dailyQuests.comboClaimed ?? false;
  if (!comboClaimed && updatedQuests.every((q) => q.completed)) {
    comboClaimed = true;
    bonusXp += 30; // Bonus kombo: selesaikan ketiganya → +30 XP tambahan.
  }

  return {
    ...current,
    xp: current.xp + bonusXp,
    dailyQuests: {
      date: todayStr,
      quests: updatedQuests,
      comboClaimed,
    },
  };
}

export type StreakNotification = {
  type: "freeze_used" | "freeze_earned";
  message: string;
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
  dailyQuests?: DailyQuestsState;
  streakFreezes?: number;
  streakNotification?: StreakNotification | null;
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
  streakFreezes: 0,
  streakNotification: null,
  dailyQuests: {
    date: getDailyQuestDateKey(),
    quests: generateDailyQuestsForDate(getDailyQuestDateKey()),
    comboClaimed: false,
  },
};

export type StreakEvaluation = {
  streak: number;
  streakFreezes: number;
  notification: StreakNotification | null;
};

export function evaluateStreak(
  current: UserProgress,
  today: string = getDailyQuestDateKey()
): StreakEvaluation {
  const previousDate = current.lastStudyDate;
  let freezes = Math.min(3, Math.max(0, current.streakFreezes ?? 0));
  let streak = current.streak;
  let notification = current.streakNotification ?? null;

  if (!previousDate) {
    return {
      streak: 1,
      streakFreezes: freezes,
      notification,
    };
  }

  if (previousDate === today) {
    return {
      streak: current.streak,
      streakFreezes: freezes,
      notification,
    };
  }

  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const twoDaysAgo = new Date(`${today}T12:00:00`);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoKey = twoDaysAgo.toISOString().slice(0, 10);

  if (previousDate === yesterdayKey) {
    // Normal consecutive day: streak + 1
    const newStreak = current.streak + 1;
    streak = newStreak;
    // Milestone kelipatan 7 hari (7, 14, 21, ...)
    if (newStreak > 0 && newStreak % 7 === 0 && newStreak !== current.streak) {
      if (freezes < 3) {
        freezes = Math.min(3, freezes + 1);
        notification = {
          type: "freeze_earned",
          message: "Kamu mendapatkan 1 Streak Freeze!",
        };
      }
    }
  } else if (previousDate === twoDaysAgoKey) {
    // Bolos 1 hari
    if (freezes > 0) {
      freezes = Math.max(0, freezes - 1);
      streak = current.streak; // Dipertahankan, tidak reset
      notification = {
        type: "freeze_used",
        message: "Streak Freeze digunakan! Streak-mu terselamatkan.",
      };
    } else {
      // Tanpa freeze: streak reset ke 0
      streak = 0;
    }
  } else {
    // Bolos > 2 hari lalu: streak reset (freeze tidak menutupi)
    streak = 0;
  }

  return {
    streak,
    streakFreezes: freezes,
    notification,
  };
}

export function ensureStreakFreezeState(
  progress: UserProgress,
  today: string = getDailyQuestDateKey()
): UserProgress {
  if (!progress.lastStudyDate || progress.lastStudyDate === today) {
    return progress;
  }

  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (progress.lastStudyDate === yesterdayKey) {
    return progress;
  }

  const twoDaysAgo = new Date(`${today}T12:00:00`);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoKey = twoDaysAgo.toISOString().slice(0, 10);

  const currentFreezes = Math.min(3, Math.max(0, progress.streakFreezes ?? 0));

  if (progress.lastStudyDate === twoDaysAgoKey) {
    if (currentFreezes > 0) {
      return {
        ...progress,
        streakFreezes: currentFreezes - 1,
        lastStudyDate: yesterdayKey, // mark yesterday as preserved by freeze
        streakNotification: {
          type: "freeze_used",
          message: "Streak Freeze digunakan! Streak-mu terselamatkan.",
        },
      };
    } else {
      // Tanpa freeze: streak reset ke 0
      return {
        ...progress,
        streak: 0,
      };
    }
  }

  // > 2 hari lalu: streak reset
  if (progress.streak > 0) {
    return {
      ...progress,
      streak: 0,
    };
  }

  return progress;
}

export function dismissStreakNotification(email: string) {
  const current = readProgress(email);
  if (!current.streakNotification) return;
  const updated: UserProgress = {
    ...current,
    streakNotification: null,
  };
  saveProgress(email, updated);
}

/** All badges and their unlock criteria. */
export const BADGE_DEFINITIONS: { name: string; description: string; criteria: string }[] = [
  { name: "Pionir Salam", description: "Menyelesaikan pelajaran Salam & Adab Tabe.", criteria: "Selesaikan Pelajaran 1" },
  { name: "Penjaga Busana", description: "Menguasai busana adat Kaili Nggembe & Buya Sabe.", criteria: "Selesaikan Pelajaran 2" },
  { name: "Tamu Sopan", description: "Menuntaskan skenario bertamu di Souraja.", criteria: "Selesaikan Pelajaran 3" },
  { name: "Penjaga Adab", description: "Menguasai seluruh pelajaran dalam Unit 1.", criteria: "Selesaikan Pelajaran 1, 2, dan 3" },
  { name: "Petualang Budaya", description: "Konsisten belajar 3 hari berturut-turut.", criteria: "Raih streak 3 hari" },
  { name: "Pejuang Ledo", description: "Mengumpulkan 50 XP dan menyelesaikan minimal 1 pelajaran.", criteria: "Kumpulkan ≥50 XP + 1 lesson" },
];

/** Evaluate which badges should be awarded based on current progress state. */
function evaluateBadges(progress: UserProgress): string[] {
  const earned = new Set(progress.badges);

  if (progress.completedLessons.includes(1)) earned.add("Pionir Salam");
  if (progress.completedLessons.includes(2)) earned.add("Penjaga Busana");
  if (progress.completedLessons.includes(3)) earned.add("Tamu Sopan");
  if ([1, 2, 3].every((id) => progress.completedLessons.includes(id))) earned.add("Penjaga Adab");
  if (progress.streak >= 3) earned.add("Petualang Budaya");
  if (progress.xp >= 50 && progress.completedLessons.length >= 1) earned.add("Pejuang Ledo");

  return Array.from(earned);
}

function progressKey(email: string) {
  return `${PROGRESS_PREFIX}${email.toLowerCase()}`;
}

export function readProgress(email: string): UserProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = window.localStorage.getItem(progressKey(email));
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const progress: UserProgress = {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedLessons: parsed.completedLessons ?? [],
      unlockedLessons: parsed.unlockedLessons ?? [1],
      badges: parsed.badges ?? [],
      lastLesson: parsed.lastLesson ?? null,
      lastStudyDate: parsed.lastStudyDate ?? null,
      streakFreezes: parsed.streakFreezes ?? 0,
      streakNotification: parsed.streakNotification ?? null,
      dailyQuests: parsed.dailyQuests,
    };
    const withQuests = ensureDailyQuests(progress);
    const withStreak = ensureStreakFreezeState(withQuests);
    if (
      withStreak.streak !== progress.streak ||
      withStreak.streakFreezes !== progress.streakFreezes ||
      withStreak.lastStudyDate !== progress.lastStudyDate ||
      withStreak.streakNotification !== progress.streakNotification
    ) {
      window.localStorage.setItem(progressKey(email), JSON.stringify(withStreak));
      void fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, progress: withStreak }),
      }).catch(() => {});
    }
    return withStreak;
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
      streakFreezes: body.progress.streakFreezes ?? 0,
      streakNotification: body.progress.streakNotification ?? null,
      dailyQuests: body.progress.dailyQuests,
    };
    const ensured = ensureStreakFreezeState(ensureDailyQuests(remote));
    window.localStorage.setItem(progressKey(email), JSON.stringify(ensured));
    return ensured;
  } catch {
    return local;
  }
}

export function recordLessonResult(email: string, result: LessonResult) {
  const current = readProgress(email);
  const alreadyCompleted = current.completedLessons.includes(result.lessonId);
  const today = result.completedAt.slice(0, 10);
  const streakResult = evaluateStreak(current, today);

  const completedLessons = result.correct && !alreadyCompleted
    ? [...current.completedLessons, result.lessonId]
    : current.completedLessons;
  const unlockedLessons = result.correct && !alreadyCompleted
    ? Array.from(new Set([...current.unlockedLessons, result.lessonId + 1]))
    : current.unlockedLessons;
  const draft: UserProgress = {
    ...current,
    xp: current.xp + (result.correct && !alreadyCompleted ? result.xp : 0),
    streak: streakResult.streak,
    streakFreezes: streakResult.streakFreezes,
    streakNotification: streakResult.notification,
    hearts: result.correct || alreadyCompleted ? current.hearts : Math.max(0, current.hearts - 1),
    completedLessons,
    unlockedLessons,
    badges: current.badges,
    lastLesson: result,
    lastStudyDate: today,
  };
  const isCulture = result.answered === "culture-connection" || result.lessonId === 99;
  const withQuests = applyQuestDelta(draft, {
    lessonsCompleted: isCulture ? 0 : 1,
    xpGained: result.correct && !alreadyCompleted ? result.xp : 0,
    cultureCompleted: isCulture ? 1 : 0,
    correctAnswers: result.correct ? (result.correctExercises ?? 1) : 0,
  }, today);
  withQuests.badges = evaluateBadges(withQuests);
  saveProgress(email, withQuests);
  return withQuests;
}

export function recordLessonSession(email: string, result: LessonSessionResult) {
  const current = readProgress(email);
  const alreadyCompleted = current.completedLessons.includes(result.lessonId);
  const today = result.completedAt.slice(0, 10);
  const streakResult = evaluateStreak(current, today);

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
  const draft: UserProgress = {
    ...current,
    xp: alreadyCompleted ? current.xp : current.xp + result.xpEarned + result.bonusXp,
    streak: streakResult.streak,
    streakFreezes: streakResult.streakFreezes,
    streakNotification: streakResult.notification,
    hearts: result.heartsRemaining,
    completedLessons: alreadyCompleted ? current.completedLessons : [...current.completedLessons, result.lessonId],
    unlockedLessons: alreadyCompleted
      ? current.unlockedLessons
      : Array.from(new Set([...current.unlockedLessons, result.lessonId + 1])),
    badges: current.badges,
    lastLesson: lessonResult,
    lastStudyDate: today,
  };
  const withQuests = applyQuestDelta(draft, {
    lessonsCompleted: 1,
    xpGained: alreadyCompleted ? 0 : (result.xpEarned + result.bonusXp),
    correctAnswers: result.correctExercises,
  }, today);
  withQuests.badges = evaluateBadges(withQuests);
  saveProgress(email, withQuests);
  return withQuests;
}

/** Record XP from arcade sessions into the main progress. */
export function recordArcadeXp(email: string, arcadeXp: number) {
  const current = readProgress(email);
  const today = new Date().toISOString().slice(0, 10);
  const streakResult = evaluateStreak(current, today);

  const draft: UserProgress = {
    ...current,
    xp: current.xp + arcadeXp,
    streak: streakResult.streak,
    streakFreezes: streakResult.streakFreezes,
    streakNotification: streakResult.notification,
    lastStudyDate: today,
  };
  const withQuests = applyQuestDelta(draft, {
    arcadePlayed: 1,
    xpGained: arcadeXp,
  }, today);
  withQuests.badges = evaluateBadges(withQuests);
  saveProgress(email, withQuests);
  return withQuests;
}