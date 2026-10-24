import { GameSession } from "./types";
import { sampleKailiLesson } from "./mockData";
import { MIGRATED_BUILTIN_SESSIONS } from "./migratedLessons";

export const laloveMusicLesson: GameSession = {
  id: "SES-LALOVE-002",
  title: "Anatomi Alat Musik Tradisional Lalove",
  chapter: "Bab 6: Kesenian & Musik Sakral",
  subEthnic: "Suku Kaili • Lembah Palu & Sigi",
  streakDays: 7,
  xpReward: 40,
  culturalSourceCard: {
    institution: "Komunitas Musik Tradisional & Balai Pelestarian Kebudayaan XVIII",
    informant: "Pelestari Kesenian Tradisional Kaili",
    registrationCode: "SULTENG-MSK-2024/LL-01",
    verifiedDate: "Tahap Kurasi Musik Tradisional 2024",
    summary:
      "Materi organologi instrumen Lalove dan Gimba disusun dari studi dokumentasi musik sakral Balia sebagai data percontohan.",
    status: "Draft — dalam proses validasi",
  },
  questions: [
    {
      id: "Q1-LALOVE-HOTSPOT",
      type: "visual",
      title: "Identifikasi Instrumen Lalove",
      badge: "Organologi & Akustik",
      prompt: "Alat Musik Tradisional Apakah Ini?",
      imageUrl: "/media/presets/lalove.webp",
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
      curatorNote:
        "Lalove adalah suling sakral bambu tipis khas suku Kaili yang digunakan mengiringi tarian pemanggil roh dalam upacara Balia.",
    },
    {
      id: "Q2-LALOVE-FUNGSI",
      type: "audio",
      title: "Dwitunggal Lalove & Gimba",
      badge: "Fungsi Ritual Adat",
      prompt: "Dengarkan dan Pahami: Lalove dimainkan berdampingan dengan instrumen apa?",
      term: "Lalove & Gimba",
      ipa: "[la-lo-ve]",
      options: [
        { id: "opt-f-1", title: "Gendang Gimba", isCorrect: true },
        { id: "opt-f-2", title: "Gong Kuningan", isCorrect: false },
        { id: "opt-f-3", title: "Sasando Rote", isCorrect: false },
        { id: "opt-f-4", title: "Kolintang Kayu", isCorrect: false },
      ],
      curatorNote:
        "Lalove dan Gimba adalah dwitunggal instrumen sakral Kaili: Lalove memandu melodi doa, sedangkan Gimba mengendalikan tempo trance penari Balia.",
    },
  ],
};

export const DEFAULT_SESSIONS: GameSession[] = [
  ...MIGRATED_BUILTIN_SESSIONS,
  laloveMusicLesson,
  sampleKailiLesson,
];


const STORAGE_KEY = "laras_game_sessions_v2";
const SERVER_CACHE_KEY = "laras_server_sessions_cache";
const DELETED_KEY = "laras_deleted_session_ids";

/**
 * Membaca daftar sesi aktif dengan pola gabungan:
 * - Sumber utama: server (published) dari cache server
 * - Sumber lokal/offline: localStorage user
 * - Prioritas lokal untuk draft aktif agar perubahan status langsung tercermin
 * - Memfilter sesi yang telah dihapus
 */
export function getStoredSessions(): GameSession[] {
  if (typeof window === "undefined") {
    return DEFAULT_SESSIONS;
  }

  try {
    let deletedSet = new Set<string>();
    try {
      const rawDeleted = localStorage.getItem(DELETED_KEY);
      if (rawDeleted) {
        const parsed = JSON.parse(rawDeleted);
        if (Array.isArray(parsed)) deletedSet = new Set(parsed);
      }
    } catch {}

    // 1. Baca sesi lokal (draft/offline)
    let localSessions: GameSession[] = [];
    const rawLocal = localStorage.getItem(STORAGE_KEY);
    if (rawLocal) {
      try {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localSessions = parsed;
        }
      } catch {
        // ignore JSON error
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SESSIONS));
      localSessions = DEFAULT_SESSIONS;
    }

    // 2. Baca cache server (published sessions)
    let serverSessions: GameSession[] = [];
    const rawServer = localStorage.getItem(SERVER_CACHE_KEY);
    if (rawServer) {
      try {
        const parsedServer = JSON.parse(rawServer);
        if (Array.isArray(parsedServer)) {
          serverSessions = parsedServer;
        }
      } catch {
        // ignore
      }
    }

    // 3. Gabungkan dan deduplikasi berdasarkan id.
    // Urutan prioritas: Default -> Server -> Local (perubahan lokal/draft terbaru menang)
    const map = new Map<string, GameSession>();

    DEFAULT_SESSIONS.forEach((s) => map.set(s.id, s));
    serverSessions.forEach((s) => map.set(s.id, s));
    localSessions.forEach((s) => map.set(s.id, s));

    const merged = Array.from(map.values()).filter((s) => !deletedSet.has(s.id));
    return merged.length > 0 ? merged : DEFAULT_SESSIONS.filter((s) => !deletedSet.has(s.id));
  } catch {
    return DEFAULT_SESSIONS;
  }
}

/**
 * Menyimpan array sesi ke localStorage lokal
 */
export function saveStoredSessions(sessions: GameSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error("Gagal menyimpan sessions ke localStorage", err);
  }
}

/**
 * Menyimpan satu sesi secara lokal dan memicu sinkronisasi latar belakang jika memungkinkan
 */
export function saveSingleSession(session: GameSession): GameSession[] {
  // Jika sebelumnya ada di deleted list, hapus dari blacklist
  try {
    const rawDeleted = localStorage.getItem(DELETED_KEY);
    if (rawDeleted) {
      const parsed = JSON.parse(rawDeleted);
      if (Array.isArray(parsed) && parsed.includes(session.id)) {
        localStorage.setItem(DELETED_KEY, JSON.stringify(parsed.filter((id) => id !== session.id)));
      }
    }
  } catch {}

  // Jika disimpan sebagai draft, pastikan dihapus dari SERVER_CACHE_KEY agar murid tidak melihatnya
  if (session.status === "draft") {
    try {
      const rawServer = localStorage.getItem(SERVER_CACHE_KEY);
      if (rawServer) {
        const list = JSON.parse(rawServer);
        if (Array.isArray(list)) {
          localStorage.setItem(SERVER_CACHE_KEY, JSON.stringify(list.filter((s: GameSession) => s.id !== session.id)));
        }
      }
    } catch {}
  }

  const current = getStoredSessions();
  const exists = current.some((s) => s.id === session.id);
  const updated = exists
    ? current.map((s) => (s.id === session.id ? session : s))
    : [session, ...current];
  saveStoredSessions(updated);
  return updated;
}

/**
 * Sinkronisasi sesi dari server (hanya sesi published untuk murid).
 * Memperbarui SERVER_CACHE_KEY dan memicu event 'laras-sessions-updated'.
 */
export async function syncSessionsFromServer(): Promise<GameSession[]> {
  if (typeof window === "undefined") return DEFAULT_SESSIONS;

  try {
    const res = await fetch("/api/content/sessions", {
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const publishedSessions: GameSession[] = data
          .map((item: { payload?: GameSession } | GameSession) => {
            return (item as { payload?: GameSession }).payload || (item as GameSession);
          })
          .filter((s): s is GameSession => Boolean(s && s.id && Array.isArray(s.questions)));

        localStorage.setItem(SERVER_CACHE_KEY, JSON.stringify(publishedSessions));
        window.dispatchEvent(
          new CustomEvent("laras-sessions-updated", { detail: publishedSessions })
        );
        return getStoredSessions();
      }
    }
  } catch (err) {
    // Offline / API down: tetap fallback ke getStoredSessions()
    console.warn("Gagal sinkron sesi dari server, menggunakan cache lokal:", err);
  }

  return getStoredSessions();
}

export type SaveServerResult = {
  success: boolean;
  version?: number;
  fallbackLocal: boolean;
  error?: string;
};

/**
 * Simpan sesi ke server via API admin (/api/content/sessions).
 * Selalu menyimpan ke localStorage terlebih dahulu sebagai draf cadangan/offline.
 */
export async function saveSingleSessionToServer(
  session: GameSession,
  status: "draft" | "published" = "published"
): Promise<SaveServerResult> {
  // 1. Simpan lokal sebagai cadangan wajib
  saveSingleSession(session);

  // 2. Kirim ke API server
  try {
    const res = await fetch("/api/content/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: session.id,
        title: session.title,
        payload: session,
        status,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const version = data.session?.version ?? 1;

      // Perbarui cache server lokal jika published
      if (status === "published") {
        await syncSessionsFromServer().catch(() => {});
      } else {
        // Jika disimpan sebagai draft, pastikan dihapus dari SERVER_CACHE_KEY agar murid tidak melihatnya
        try {
          const rawServer = localStorage.getItem(SERVER_CACHE_KEY);
          if (rawServer) {
            const list = JSON.parse(rawServer);
            if (Array.isArray(list)) {
              const cleaned = list.filter((s: GameSession) => s.id !== session.id);
              localStorage.setItem(SERVER_CACHE_KEY, JSON.stringify(cleaned));
            }
          }
        } catch {
          // ignore
        }
      }

      window.dispatchEvent(new CustomEvent("laras-sessions-updated"));
      return { success: true, version, fallbackLocal: false };
    } else {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.error || `Server menolak dengan status ${res.status}`;
      return { success: false, fallbackLocal: true, error: msg };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Koneksi ke server gagal";
    return { success: false, fallbackLocal: true, error: msg };
  }
}

/**
 * Mengubah status publish sesi di server
 */
export async function setSessionPublishStatusOnServer(
  id: string,
  publish: boolean
): Promise<{ ok: boolean; error?: string }> {
  const endpoint = `/api/content/sessions/${encodeURIComponent(id)}/${publish ? "publish" : "unpublish"}`;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      await syncSessionsFromServer().catch(() => {});
      window.dispatchEvent(new CustomEvent("laras-sessions-updated"));
      return { ok: true };
    } else {
      const errJson = await res.json().catch(() => ({}));
      return { ok: false, error: errJson.error || "Gagal mengubah status publish" };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Jaringan bermasalah" };
  }
}

/**
 * Menghapus sesi dari server dan lokal
 */
export async function deleteSessionFromServer(id: string): Promise<boolean> {
  // Tandai di blacklist penghapusan
  try {
    const rawDeleted = localStorage.getItem(DELETED_KEY);
    const deletedList: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
    if (!deletedList.includes(id)) {
      deletedList.push(id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deletedList));
    }
  } catch {}

  // Hapus lokal
  const current = getStoredSessions().filter((s) => s.id !== id);
  saveStoredSessions(current);

  // Hapus dari server cache
  try {
    const rawServer = localStorage.getItem(SERVER_CACHE_KEY);
    if (rawServer) {
      const list = JSON.parse(rawServer);
      if (Array.isArray(list)) {
        localStorage.setItem(SERVER_CACHE_KEY, JSON.stringify(list.filter((s: GameSession) => s.id !== id)));
      }
    }
  } catch {
    // ignore
  }

  // Kirim delete ke API
  try {
    await fetch(`/api/content/sessions/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent("laras-sessions-updated"));
  return true;
}
