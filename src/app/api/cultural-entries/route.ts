import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { DEFAULT_CULTURAL_ENTRIES, type CulturalEntry } from "@/lib/services/culturalService";

export async function GET() {
  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json({
      data: DEFAULT_CULTURAL_ENTRIES,
      source: "local_fallback",
    });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("cultural_entries")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        data: DEFAULT_CULTURAL_ENTRIES,
        source: "local_fallback",
        error: error?.message,
      });
    }

    return NextResponse.json({ data, source: "supabase" });
  } catch (err) {
    return NextResponse.json({
      data: DEFAULT_CULTURAL_ENTRIES,
      source: "local_fallback",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum terkonfigurasi di environment." },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json()) as CulturalEntry;
    const { id, term, type, category, ipa, chapter, module, source, informant, status, gating, thumbnail, icon } = body;

    if (!term || !type || !category) {
      return NextResponse.json({ error: "Field wajib tidak lengkap." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const entryId = id || `ENT-${Date.now().toString().slice(-4)}`;

    const { data, error } = await supabase
      .from("cultural_entries")
      .upsert({
        id: entryId,
        term,
        type,
        category,
        ipa: ipa || null,
        chapter: chapter || "",
        module: module || "",
        source: source || "",
        informant: informant || "",
        status: status || "verified",
        gating: gating || "published",
        thumbnail: thumbnail || null,
        icon: icon || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
