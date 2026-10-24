import fs from "fs";
import path from "path";
import { GameSession } from "@/app/components/game-engine/types";
import { sampleKailiLesson } from "@/app/components/game-engine/mockData";
import { laloveMusicLesson } from "@/app/components/game-engine/sessionStore";
import { MIGRATED_BUILTIN_SESSIONS } from "@/app/components/game-engine/migratedLessons";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContentSessionRecord = {
  id: string;
  title: string;
  payload: GameSession;
  status: "draft" | "published";
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type ContentEntryRecord = {
  id: string;
  kind: string;
  payload: Record<string, unknown>;
  status: "draft" | "published";
  updated_at: string;
};

const STORE_FILENAME = path.join(process.cwd(), "laras_content_store.json");

// In-memory caches backed by persistent JSON file store
const memorySessions = new Map<string, ContentSessionRecord>();
const memoryEntries = new Map<string, ContentEntryRecord>();

function loadLocalStore() {
  try {
    if (!fs.existsSync(STORE_FILENAME)) {
      seedInitialMemory();
      saveLocalStore();
      return;
    }
    const raw = fs.readFileSync(STORE_FILENAME, "utf8");
    if (!raw.trim()) {
      seedInitialMemory();
      saveLocalStore();
      return;
    }
    const parsed = JSON.parse(raw);
    if (parsed.sessions && typeof parsed.sessions === "object") {
      Object.values(parsed.sessions).forEach((s: unknown) => {
        const item = s as ContentSessionRecord;
        if (item && item.id) memorySessions.set(item.id, item);
      });
    }
    if (parsed.entries && typeof parsed.entries === "object") {
      Object.values(parsed.entries).forEach((e: unknown) => {
        const item = e as ContentEntryRecord;
        if (item && item.id) memoryEntries.set(item.id, item);
      });
    }
  } catch (err) {
    console.warn("Gagal membaca laras_content_store.json:", err);
  }

  // Ensure default sessions are always present
  seedInitialMemory();
}

function saveLocalStore() {
  try {
    const payload = {
      sessions: Object.fromEntries(memorySessions.entries()),
      entries: Object.fromEntries(memoryEntries.entries()),
    };
    const tmp = STORE_FILENAME + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf8");
    fs.renameSync(tmp, STORE_FILENAME);
  } catch (err) {
    console.warn("Gagal menyimpan laras_content_store.json:", err);
  }
}

function seedInitialMemory() {
  const now = new Date().toISOString();

  // Seed MIGRATED_BUILTIN_SESSIONS: 1, 2, 3 (idempotent, never overwrite if existing)
  MIGRATED_BUILTIN_SESSIONS.forEach((session) => {
    if (!memorySessions.has(session.id)) {
      memorySessions.set(session.id, {
        id: session.id,
        title: session.title,
        payload: session,
        status: "published",
        version: 1,
        created_by: "system@laras.id",
        created_at: now,
        updated_at: now,
      });
    }
  });

  // Seed DEFAULT_SESSIONS: SES-KL-MASTER-001 & SES-LALOVE-002
  if (!memorySessions.has(sampleKailiLesson.id)) {
    memorySessions.set(sampleKailiLesson.id, {
      id: sampleKailiLesson.id,
      title: sampleKailiLesson.title,
      payload: sampleKailiLesson,
      status: "published",
      version: 1,
      created_by: "system@laras.id",
      created_at: now,
      updated_at: now,
    });
  }

  if (!memorySessions.has(laloveMusicLesson.id)) {
    memorySessions.set(laloveMusicLesson.id, {
      id: laloveMusicLesson.id,
      title: laloveMusicLesson.title,
      payload: laloveMusicLesson,
      status: "published",
      version: 1,
      created_by: "system@laras.id",
      created_at: now,
      updated_at: now,
    });
  }
}


// Initialize on module load
loadLocalStore();

// =============================================================================
// CONTENT SESSIONS
// =============================================================================

export async function getContentSessions(options: { all?: boolean } = {}): Promise<ContentSessionRecord[]> {
  const { all = false } = options;

  // 1. Try Supabase
  try {
    let query = createAdminClient()
      .from("content_sessions")
      .select("id, title, payload, status, version, created_by, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (!all) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      // Sync into local memory/store
      data.forEach((row) => {
        memorySessions.set(row.id, {
          id: row.id,
          title: row.title,
          payload: row.payload as GameSession,
          status: row.status as "draft" | "published",
          version: row.version,
          created_by: row.created_by,
          created_at: row.created_at,
          updated_at: row.updated_at,
        });
      });
      saveLocalStore();

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        payload: row.payload as GameSession,
        status: row.status as "draft" | "published",
        version: row.version,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    }
  } catch (err) {
    // Supabase unavailable / offline fallback
    console.warn("Supabase content_sessions tidak dapat diakses, memakai cadangan lokal:", err);
  }

  // 2. Local fallback
  const list = Array.from(memorySessions.values());
  const filtered = all ? list : list.filter((s) => s.status === "published");
  return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function getContentSessionById(id: string): Promise<ContentSessionRecord | null> {
  try {
    const { data, error } = await createAdminClient()
      .from("content_sessions")
      .select("id, title, payload, status, version, created_by, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      const rec: ContentSessionRecord = {
        id: data.id,
        title: data.title,
        payload: data.payload as GameSession,
        status: data.status as "draft" | "published",
        version: data.version,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      memorySessions.set(rec.id, rec);
      saveLocalStore();
      return rec;
    }
  } catch {
    // fallback
  }

  return memorySessions.get(id) || null;
}

export async function upsertContentSession(params: {
  id: string;
  title: string;
  payload: GameSession;
  status?: "draft" | "published";
  created_by?: string;
}): Promise<ContentSessionRecord> {
  const { id, title, payload, status, created_by } = params;

  if (!id || !title || !payload || !Array.isArray(payload.questions)) {
    throw new Error("Payload tidak valid: id, title, dan payload.questions (array) wajib diisi");
  }

  const existing = memorySessions.get(id);
  const now = new Date().toISOString();
  const nextVersion = existing ? (existing.version || 1) + 1 : 1;
  const targetStatus = status || existing?.status || "published";

  const record: ContentSessionRecord = {
    id,
    title,
    payload,
    status: targetStatus,
    version: nextVersion,
    created_by: created_by || existing?.created_by || "admin@laras.id",
    created_at: existing?.created_at || now,
    updated_at: now,
  };

  // Save to memory and local file store
  memorySessions.set(id, record);
  saveLocalStore();

  // Sync to Supabase
  try {
    await createAdminClient()
      .from("content_sessions")
      .upsert(
        {
          id: record.id,
          title: record.title,
          payload: record.payload,
          status: record.status,
          version: record.version,
          created_by: record.created_by,
          created_at: record.created_at,
          updated_at: record.updated_at,
        },
        { onConflict: "id" }
      );
  } catch (err) {
    console.warn("Gagal sinkron content_sessions ke Supabase (tersimpan di server store):", err);
  }

  return record;
}

export async function deleteContentSession(id: string): Promise<boolean> {
  memorySessions.delete(id);
  saveLocalStore();

  try {
    await createAdminClient().from("content_sessions").delete().eq("id", id);
  } catch (err) {
    console.warn("Gagal menghapus content_sessions di Supabase:", err);
  }

  return true;
}

export async function setSessionPublishStatus(
  id: string,
  status: "draft" | "published"
): Promise<ContentSessionRecord | null> {
  const existing = memorySessions.get(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: ContentSessionRecord = {
    ...existing,
    status,
    updated_at: now,
  };

  memorySessions.set(id, updated);
  saveLocalStore();

  try {
    await createAdminClient()
      .from("content_sessions")
      .update({ status, updated_at: now })
      .eq("id", id);
  } catch (err) {
    console.warn("Gagal update status di Supabase:", err);
  }

  return updated;
}

// =============================================================================
// CONTENT ENTRIES (KORPUS CMS)
// =============================================================================

export async function getContentEntries(options: { all?: boolean } = {}): Promise<ContentEntryRecord[]> {
  const { all = false } = options;

  try {
    let query = createAdminClient()
      .from("content_entries")
      .select("id, kind, payload, status, updated_at")
      .order("updated_at", { ascending: false });

    if (!all) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        memoryEntries.set(row.id, {
          id: row.id,
          kind: row.kind,
          payload: row.payload as Record<string, unknown>,
          status: row.status as "draft" | "published",
          updated_at: row.updated_at,
        });
      });
      saveLocalStore();

      return data.map((row) => ({
        id: row.id,
        kind: row.kind,
        payload: row.payload as Record<string, unknown>,
        status: row.status as "draft" | "published",
        updated_at: row.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Supabase content_entries tidak dapat diakses, memakai cadangan lokal:", err);
  }

  const list = Array.from(memoryEntries.values());
  const filtered = all ? list : list.filter((e) => e.status === "published");
  return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function upsertContentEntry(params: {
  id: string;
  kind?: string;
  payload: Record<string, unknown>;
  status?: "draft" | "published";
}): Promise<ContentEntryRecord> {
  const { id, kind = "budaya", payload, status = "published" } = params;

  if (!id || !payload) {
    throw new Error("Payload entri tidak valid: id dan payload wajib diisi");
  }

  const now = new Date().toISOString();
  const record: ContentEntryRecord = {
    id,
    kind,
    payload,
    status,
    updated_at: now,
  };

  memoryEntries.set(id, record);
  saveLocalStore();

  try {
    await createAdminClient()
      .from("content_entries")
      .upsert(
        {
          id: record.id,
          kind: record.kind,
          payload: record.payload,
          status: record.status,
          updated_at: record.updated_at,
        },
        { onConflict: "id" }
      );
  } catch (err) {
    console.warn("Gagal sinkron content_entries ke Supabase:", err);
  }

  return record;
}

export async function deleteContentEntry(id: string): Promise<boolean> {
  memoryEntries.delete(id);
  saveLocalStore();

  try {
    await createAdminClient().from("content_entries").delete().eq("id", id);
  } catch (err) {
    console.warn("Gagal menghapus content_entries di Supabase:", err);
  }

  return true;
}

export async function setEntryPublishStatus(
  id: string,
  status: "draft" | "published"
): Promise<ContentEntryRecord | null> {
  const existing = memoryEntries.get(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: ContentEntryRecord = {
    ...existing,
    status,
    updated_at: now,
  };

  memoryEntries.set(id, updated);
  saveLocalStore();

  try {
    await createAdminClient()
      .from("content_entries")
      .update({ status, updated_at: now })
      .eq("id", id);
  } catch (err) {
    console.warn("Gagal update status entri di Supabase:", err);
  }

  return updated;
}
