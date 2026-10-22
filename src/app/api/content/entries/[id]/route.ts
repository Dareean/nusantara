import { NextRequest, NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/app/auth/serverAuth";
import {
  upsertContentEntry,
  deleteContentEntry,
} from "@/lib/content/serverContent";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email);
  return { session, email, isAdmin };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya admin yang dapat mengubah entri korpus" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { kind, payload, status } = body || {};

    if (!payload) {
      return NextResponse.json(
        { error: "Payload tidak valid: payload wajib disertakan" },
        { status: 400 }
      );
    }

    const saved = await upsertContentEntry({
      id,
      kind: kind || "budaya",
      payload,
      status: status === "draft" ? "draft" : "published",
    });

    return NextResponse.json({ ok: true, entry: saved });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui entri";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya admin yang dapat menghapus entri korpus" }, { status: 403 });
  }

  const { id } = await params;
  await deleteContentEntry(id);

  return NextResponse.json({ ok: true, deletedId: id });
}
