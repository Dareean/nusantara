import { NextRequest, NextResponse } from "next/server";
import { getSession, isAdminEmail } from "@/app/auth/serverAuth";
import { setSessionPublishStatus } from "@/lib/content/serverContent";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email);
  return { session, email, isAdmin };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya admin yang dapat mempublikasikan sesi" }, { status: 403 });
  }

  const { id } = await params;
  const updated = await setSessionPublishStatus(id, "published");
  if (!updated) {
    return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    status: updated.status,
    id: updated.id,
    updatedAt: updated.updated_at,
  });
}
