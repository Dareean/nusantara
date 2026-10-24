import { NextRequest, NextResponse } from "next/server";
import { getSession, isAdminEmail, isJuryReadOnly } from "@/app/auth/serverAuth";
import { setEntryPublishStatus } from "@/lib/content/serverContent";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email) || Boolean(session?.isAdmin);
  const isJury = isJuryReadOnly(session);
  return { session, email, isAdmin, isJury };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin, isJury } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya admin yang dapat mengubah status publikasi entri" }, { status: 403 });
  }
  if (isJury) {
    return NextResponse.json(
      { error: "Mode Juri hanya memiliki akses baca (read-only)." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const updated = await setEntryPublishStatus(id, "draft");
  if (!updated) {
    return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, status: updated.status, id: updated.id });
}
