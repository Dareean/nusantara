import { GameSession } from "./types";
import { sampleKailiLesson } from "./mockData";

export const laloveMusicLesson: GameSession = {
  id: "SES-LALOVE-002",
  title: "Anatomi Alat Musik Tradisional Lalove",
  chapter: "Bab 6: Kesenian & Musik Sakral",
  subEthnic: "Suku Kaili • Lembah Palu & Sigi",
  streakDays: 7,
  xpReward: 40,
  questions: [
    {
      id: "Q1-LALOVE-HOTSPOT",
      type: "visual",
      prompt: "Alat Musik Tradisional Apakah Ini?",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA99tfPQRBVVtMXXGtMtlKHgSxSjzzIEGUQGQbCarbRHI1jOaWURL5jr78aETTdEhKke8meFtOLrl9X0gx8vyxYCiS_yWrOeXkOUZ1l6z-OZ9K_9GFLXs0kDKCI-H__0pXaAtrjs16Xh5R8JEJlxgMqWV9yn9Zs-IQGuEuCZYhHdOEtTgzumKJOZvzIf5Og5pyYLmjHu-GWCGUjVZ-gm5-qoCX3Gifqgzkkpof_6fw2F7JHtuIPKb9Nzw",
      hotspots: [
        {
          id: 1,
          name: "Sumbat Tiup (Pui-Pui)",
          title: "Pangkal Tiup",
          description: "Tempat peniup mengalirkan nafas sirkular tanpa henti.",
          top: "20%",
          left: "30%",
        },
        {
          id: 2,
          name: "Lubang Laras Nada (Ino)",
          title: "Lubang Nada",
          description: "4-6 lubang nada ritual adat Balia.",
          top: "50%",
          left: "52%",
        },
      ],
      options: [
        { id: "opt-lalove-1", title: "Suling Lalove", isCorrect: true },
        { id: "opt-lalove-2", title: "Gendang Gimba", isCorrect: false },
        { id: "opt-lalove-3", title: "Sasando", isCorrect: false },
        { id: "opt-lalove-4", title: "Salonde", isCorrect: false },
      ],
      curatorNote: "Lalove adalah suling sakral bambu tipis khas suku Kaili yang digunakan mengiringi tarian pemanggil roh dalam upacara Balia.",
    },
    {
      id: "Q2-LALOVE-FUNGSI",
      type: "audio",
      prompt: "Dengarkan dan Pahami: Lalove dimainkan berdampingan dengan instrumen apa?",
      term: "Lalove & Gimba",
      ipa: "[la-lo-ve]",
      options: [
        { id: "opt-f-1", title: "Gendang Gimba", isCorrect: true },
        { id: "opt-f-2", title: "Gong Kuningan", isCorrect: false },
        { id: "opt-f-3", title: "Sasando Rote", isCorrect: false },
        { id: "opt-f-4", title: "Kolintang Kayu", isCorrect: false },
      ],
      curatorNote: "Lalove dan Gimba adalah dwitunggal instrumen sakral Kaili: Lalove memandu melodi doa, sedangkan Gimba mengendalikan tempo trance penari Balia.",
    },
  ],
};

const DEFAULT_SESSIONS: GameSession[] = [sampleKailiLesson, laloveMusicLesson];

const STORAGE_KEY = "laras_game_sessions_v2";

export function getStoredSessions(): GameSession[] {
  if (typeof window === "undefined") {
    return DEFAULT_SESSIONS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SESSIONS));
      return DEFAULT_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SESSIONS;
  } catch {
    return DEFAULT_SESSIONS;
  }
}

export function saveStoredSessions(sessions: GameSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error("Gagal menyimpan sessions ke localStorage", err);
  }
}

export function saveSingleSession(session: GameSession): GameSession[] {
  const current = getStoredSessions();
  const exists = current.some((s) => s.id === session.id);
  const updated = exists
    ? current.map((s) => (s.id === session.id ? session : s))
    : [session, ...current];
  saveStoredSessions(updated);
  return updated;
}
