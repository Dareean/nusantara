import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { DEFAULT_ARCADE_QUESTIONS, type ArcadeQuestion } from "@/lib/services/arcadeService";

export async function GET() {
  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json({
      data: DEFAULT_ARCADE_QUESTIONS,
      source: "local_fallback",
      message: "Supabase belum terkonfigurasi. Menggunakan data cadangan lokal.",
    });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("arcade_questions")
      .select("id, question, hint, category, options, correct_index, lore")
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        data: DEFAULT_ARCADE_QUESTIONS,
        source: "local_fallback",
        error: error?.message,
      });
    }

    const mapped: ArcadeQuestion[] = data.map((item) => ({
      id: item.id,
      question: item.question,
      hint: item.hint || "",
      category: item.category,
      options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || "[]"),
      correctIndex: item.correct_index,
      lore: item.lore || "",
    }));

    return NextResponse.json({ data: mapped, source: "supabase" });
  } catch (err) {
    return NextResponse.json({
      data: DEFAULT_ARCADE_QUESTIONS,
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
    const body = await req.json();
    const { question, hint, category, options, correctIndex, lore } = body;

    if (!question || !category || !Array.isArray(options)) {
      return NextResponse.json({ error: "Data soal tidak lengkap." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("arcade_questions")
      .insert({
        question,
        hint: hint || "",
        category,
        options,
        correct_index: typeof correctIndex === "number" ? correctIndex : 0,
        lore: lore || "",
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
