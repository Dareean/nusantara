import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSession, isAdminEmail } from "@/app/auth/serverAuth";
import { createAdminClient } from "@/lib/supabase/admin";

function getAuth(req: NextRequest) {
  const sessionId = req.cookies.get("laras_session")?.value;
  const session = getSession(sessionId);
  const email = session?.email ?? null;
  const isAdmin = isAdminEmail(email);
  return { session, email, isAdmin };
}

export async function POST(req: NextRequest) {
  const { email, isAdmin } = getAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Hanya admin yang dapat mengunggah media" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File media tidak ditemukan dalam form-data" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const ext = path.extname(file.name || "").toLowerCase() || ".bin";
    const cleanBase = path.basename(file.name || "upload", ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueHash = crypto.randomBytes(4).toString("hex");
    const safeFilename = `${cleanBase}_${Date.now()}_${uniqueHash}${ext}`;

    // 1. Attempt upload to Supabase Storage bucket 'content-media'
    try {
      const supabase = createAdminClient();
      // Ensure bucket exists (or try upload)
      await supabase.storage.createBucket("content-media", { public: true }).catch(() => {});

      const { error: uploadError } = await supabase.storage
        .from("content-media")
        .upload(safeFilename, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("content-media").getPublicUrl(safeFilename);
        if (urlData?.publicUrl) {
          return NextResponse.json({
            ok: true,
            url: urlData.publicUrl,
            filename: safeFilename,
            storage: "supabase",
          });
        }
      } else {
        console.warn("Supabase Storage upload gagal, memakai penyimpanan lokal:", uploadError.message);
      }
    } catch (err) {
      console.warn("Supabase Storage tidak dapat dijangkau, beralih ke penyimpanan lokal:", err);
    }

    // 2. Fallback to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localFilePath = path.join(uploadsDir, safeFilename);
    fs.writeFileSync(localFilePath, buffer);

    const localUrl = `/uploads/${safeFilename}`;
    return NextResponse.json({
      ok: true,
      url: localUrl,
      filename: safeFilename,
      storage: "local",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengunggah media";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
