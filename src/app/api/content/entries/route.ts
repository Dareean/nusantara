import { NextRequest, NextResponse } from "next/server";
import { getSession, isAdminEmail, isJuryReadOnly } from "@/app/auth/serverAuth";
import {
  getContentEntries,
  upsertContentEntry,
} from "@/lib/content/serverContent";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email) || Boolean(session?.isAdmin);
  const isJury = isJuryReadOnly(session);
  return { session, email, isAdmin, isJury };
}

// GET /api/content/entries
export async function GET(req: NextRequest) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const wantsAll = searchParams.get("all") === "1" || searchParams.get("all") === "true";

  if (wantsAll && !isAdmin) {
    return NextResponse.json({ error: "Forbidden: Akses admin diperlukan" }, { status: 403 });
  }

  const entries = await getContentEntries({ all: wantsAll && isAdmin });
  return NextResponse.json(entries);
}

// POST /api/content/entries
export async function POST(req: NextRequest) {
  const { email, isAdmin, isJury } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya admin yang dapat menambah korpus budaya" }, { status: 403 });
  }
  if (isJury) {
    return NextResponse.json(
      { error: "Mode Juri hanya memiliki akses baca (read-only)." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { id, kind, payload, status } = body || {};

    if (!id || !payload) {
      return NextResponse.json(
        { error: "Payload tidak valid: id dan payload wajib disertakan" },
        { status: 400 }
      );
    }

    const saved = await upsertContentEntry({
      id,
      kind: kind || "budaya",
      payload,
      status: status === "draft" ? "draft" : "published",
    });

    return NextResponse.json({ ok: true, entry: saved }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memproses entri";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
