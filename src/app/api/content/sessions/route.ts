import { NextRequest, NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/app/auth/serverAuth";
import {
  getContentSessions,
  upsertContentSession,
} from "@/lib/content/serverContent";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email);
  return { session, email, isAdmin };
}

// GET /api/content/sessions
// User biasa: hanya sesi published
// Admin (?all=1): seluruh sesi (draft + published)
export async function GET(req: NextRequest) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const wantsAll = searchParams.get("all") === "1" || searchParams.get("all") === "true";

  if (wantsAll && !isAdmin) {
    return NextResponse.json({ error: "Forbidden: Akses admin diperlukan untuk melihat semua status" }, { status: 403 });
  }

  const sessions = await getContentSessions({ all: wantsAll && isAdmin });
  const mapped = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    payload: s.payload,
    status: s.status,
    version: s.version,
    createdBy: s.created_by,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));

  return NextResponse.json(mapped);
}

// POST /api/content/sessions
// Khusus admin: buat atau upsert sesi baru
export async function POST(req: NextRequest) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya kurator/admin yang dapat menambah sesi" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, title, payload, status } = body || {};

    if (!id || !title || !payload || !Array.isArray(payload.questions)) {
      return NextResponse.json(
        { error: "Payload tidak valid: id, title, dan payload.questions (array) wajib disertakan" },
        { status: 400 }
      );
    }

    const saved = await upsertContentSession({
      id,
      title,
      payload,
      status: status === "draft" ? "draft" : "published",
      created_by: email,
    });

    return NextResponse.json(
      {
        ok: true,
        session: {
          id: saved.id,
          title: saved.title,
          payload: saved.payload,
          status: saved.status,
          version: saved.version,
          updatedAt: saved.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memproses sesi";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
