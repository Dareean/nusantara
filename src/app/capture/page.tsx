"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const GUIDED_QUESTIONS = [
  {
    category: "Teknik Kinetik & Proses",
    code: "01",
    instruction: "Catat langkah demi langkah gerak tangan, peralatan, dan takaran yang tidak tertulis.",
    questions: [
      "Bagaimana proses pembuatan atau pelaksanaan tradisi ini dari awal hingga selesai?",
      "Alat khusus dan bahan alami apa saja yang wajib digunakan dan tidak boleh digantikan mesin?",
      "Berapa lama waktu yang dibutuhkan untuk menyelesaikan satu karya atau siklus ritual?",
    ],
  },
  {
    category: "Material Alam & Musim",
    code: "02",
    instruction: "Bahan organik dari hutan, sungai, atau tanah yang menentukan keaslian.",
    questions: [
      "Dari mana bahan baku diambil, dan apakah ada musim atau waktu tertentu untuk memanennya?",
      "Bagaimana cara mengolah bahan mentah sebelum siap digunakan?",
    ],
  },
  {
    category: "Makna Filosofis & Simbol",
    code: "03",
    instruction: "Pesan batin, doa, dan relasi kosmologi leluhur.",
    questions: [
      "Apa makna filosofis atau doa sakral yang terkandung di balik motif, bait, atau gerak ini?",
      "Apakah ada tingkatan sosial atau fase hidup tertentu yang berhak mengenakannya?",
    ],
  },
  {
    category: "Pantangan & Tabu Adat",
    code: "04",
    instruction: "Batasan sakral yang jika dilanggar diyakini membawa musibah atau rusaknya nilai tradisi.",
    questions: [
      "Apakah ada pantangan hari, larangan ucapan, atau larangan perilaku saat mengerjakan tradisi ini?",
      "Siapa saja yang dilarang menyentuh atau melakukan proses ini menurut hukum adat?",
    ],
  },
  {
    category: "Silsilah Guru & Sanad",
    code: "05",
    instruction: "Garis keturunan ilmu untuk menjamin keaslian transmisi.",
    questions: [
      "Dari siapa narasumber pertama kali mempelajari ilmu ini? Kapan dan di mana?",
      "Siapa saja murid atau penerus yang saat ini aktif belajar bersama narasumber?",
    ],
  },
];

const CONSENT_LEVELS = [
  {
    id: "public",
    title: "Terbuka untuk Publik (Public Archive)",
    description: "Dapat diakses dan dipelajari oleh seluruh masyarakat luas untuk edukasi umum.",
  },
  {
    id: "community",
    title: "Khusus Komunitas Adat (Community Only)",
    description: "Hanya dapat diakses oleh anggota masyarakat adat dan keturunan sah.",
  },
  {
    id: "apprentice",
    title: "Khusus Murid Bersumpah (Apprentice Only)",
    description: "Hanya dibuka untuk calon penerus yang telah diverifikasi dan disetujui maestro.",
  },
  {
    id: "restricted",
    title: "Terbatas / Sakral Penuh (Sacred Restricted)",
    description: "Hanya mencatat metadata keberadaan; detail rahasia adat tidak dipublikasikan ke publik.",
  },
];

type InterviewStep = "info" | "consent" | "interview" | "review" | "complete";

export default function CapturePage() {
  const [step, setStep] = useState<InterviewStep>("info");
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [holderName, setHolderName] = useState("");
  const [holderAge, setHolderAge] = useState("");
  const [region, setRegion] = useState("");
  const [selectedConsent, setSelectedConsent] = useState("public");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentCategory, setCurrentCategory] = useState(0);

  function handleAnswerChange(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const totalQuestions = GUIDED_QUESTIONS.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );
  const answeredCount = Object.values(answers).filter((v) => v.trim()).length;

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 px-6 bg-[#FAF9F6]">
        <div className="mx-auto max-w-[820px]">
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-[#E7E2D8]">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8522E] block mb-2">
              PROTOKOL PENDOKUMENTASIAN LAPANGAN
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-[#1A1815] mb-3">
              Rekam Ingatan & Rekonstruksi DNA Pengetahuan
            </h1>
            <p className="text-sm text-[#524E48] leading-relaxed">
              Panduan wawancara etnografis untuk merekam langsung keahlian dari para pemegang
              tradisi sepuh, lengkap dengan proteksi hak adat dan persetujuan komunal.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-12 text-xs font-mono uppercase tracking-wider text-[#6B655C] pb-4 border-b border-[#E7E2D8]">
            <div className="flex items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded border", step === "info" ? "bg-[#1A1815] text-white border-[#1A1815]" : "bg-[#F2EDE4] text-[#1A1815]")}>
                01
              </span>
              <span className="hidden sm:inline">Data Tradisi</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded border", step === "consent" ? "bg-[#1A1815] text-white border-[#1A1815]" : "bg-[#F2EDE4] text-[#1A1815]")}>
                02
              </span>
              <span className="hidden sm:inline">Restu Adat</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded border", step === "interview" ? "bg-[#1A1815] text-white border-[#1A1815]" : "bg-[#F2EDE4] text-[#1A1815]")}>
                03
              </span>
              <span className="hidden sm:inline">Wawancara DNA</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded border", step === "review" ? "bg-[#1A1815] text-white border-[#1A1815]" : "bg-[#F2EDE4] text-[#1A1815]")}>
                04
              </span>
              <span className="hidden sm:inline">Verifikasi</span>
            </div>
          </div>

          {/* Step 1: Info */}
          {step === "info" && (
            <div className="space-y-6 bg-white p-8 border border-[#E7E2D8] rounded-sm">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#1A1815] mb-2 font-semibold">
                  Nama Pengetahuan Budaya / Tradisi *
                </label>
                <input
                  type="text"
                  value={knowledgeTitle}
                  onChange={(e) => setKnowledgeTitle(e.target.value)}
                  placeholder="mis. Tenun Sekomandi, Sintuvu, Kulcapi Simalungun"
                  className="w-full px-4 py-3 border border-[#E7E2D8] rounded bg-[#FAF9F6] text-sm text-[#1A1815] focus:outline-none focus:border-[#A8522E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#1A1815] mb-2 font-semibold">
                    Nama Maestro / Narasumber Utama *
                  </label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="mis. Mama Ina Pagi"
                    className="w-full px-4 py-3 border border-[#E7E2D8] rounded bg-[#FAF9F6] text-sm text-[#1A1815] focus:outline-none focus:border-[#A8522E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#1A1815] mb-2 font-semibold">
                    Perkiraan Usia Narasumber
                  </label>
                  <input
                    type="text"
                    value={holderAge}
                    onChange={(e) => setHolderAge(e.target.value)}
                    placeholder="mis. 78 Tahun"
                    className="w-full px-4 py-3 border border-[#E7E2D8] rounded bg-[#FAF9F6] text-sm text-[#1A1815] focus:outline-none focus:border-[#A8522E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#1A1815] mb-2 font-semibold">
                  Wilayah / Kampung Adat
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="mis. Desa Kalumpang, Kabupaten Mamuju, Sulawesi Barat"
                  className="w-full px-4 py-3 border border-[#E7E2D8] rounded bg-[#FAF9F6] text-sm text-[#1A1815] focus:outline-none focus:border-[#A8522E]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep("consent")}
                  disabled={!knowledgeTitle.trim() || !holderName.trim()}
                  className="px-6 py-3 bg-[#1A1815] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#A8522E] transition-colors disabled:opacity-40"
                >
                  Lanjut ke Protokol Restu Adat →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Consent */}
          {step === "consent" && (
            <div className="space-y-6 bg-white p-8 border border-[#E7E2D8] rounded-sm">
              <div className="mb-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#A8522E] block mb-1">
                  ETIKA HAK KEKAYAAN KOMUNAL
                </span>
                <h3 className="font-display text-2xl text-[#1A1815]">
                  Tingkat Keterbukaan & Restu Adat (Cultural Consent)
                </h3>
                <p className="text-xs text-[#6B655C] mt-1 leading-relaxed">
                  Pilih batasan akses yang disetujui oleh narasumber dan pemuka adat setempat.
                </p>
              </div>

              <div className="space-y-3">
                {CONSENT_LEVELS.map((consent) => (
                  <label
                    key={consent.id}
                    className={cn(
                      "block p-5 border rounded-sm cursor-pointer transition-colors",
                      selectedConsent === consent.id
                        ? "border-[#A8522E] bg-[#FAF0EB]/40"
                        : "border-[#E7E2D8] hover:bg-[#FAF9F6]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="consent"
                        value={consent.id}
                        checked={selectedConsent === consent.id}
                        onChange={(e) => setSelectedConsent(e.target.value)}
                        className="mt-1 accent-[#A8522E]"
                      />
                      <div>
                        <div className="font-display text-base text-[#1A1815] font-medium">
                          {consent.title}
                        </div>
                        <p className="text-xs text-[#524E48] mt-1 leading-relaxed">
                          {consent.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep("info")}
                  className="text-xs font-mono uppercase tracking-wider text-[#6B655C] hover:text-[#1A1815]"
                >
                  ← Kembali
                </button>
                <button
                  onClick={() => setStep("interview")}
                  className="px-6 py-3 bg-[#A8522E] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#8C4425] transition-colors"
                >
                  Mulai Wawancara DNA Lapangan →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Interview */}
          {step === "interview" && (
            <div className="space-y-6">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 pb-2">
                {GUIDED_QUESTIONS.map((cat, i) => (
                  <button
                    key={cat.code}
                    onClick={() => setCurrentCategory(i)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-mono rounded border transition-colors",
                      currentCategory === i
                        ? "border-[#A8522E] bg-[#A8522E] text-white font-medium"
                        : "border-[#E7E2D8] bg-white text-[#6B655C] hover:text-[#1A1815]"
                    )}
                  >
                    {cat.code}. {cat.category}
                  </button>
                ))}
              </div>

              <div className="bg-white p-8 border border-[#E7E2D8] rounded-sm space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#A8522E] block mb-1">
                    DIMENSI {GUIDED_QUESTIONS[currentCategory].code}
                  </span>
                  <h3 className="font-display text-2xl text-[#1A1815]">
                    {GUIDED_QUESTIONS[currentCategory].category}
                  </h3>
                  <p className="text-xs text-[#6B655C] mt-1 italic">
                    Catatan kurator: {GUIDED_QUESTIONS[currentCategory].instruction}
                  </p>
                </div>

                <div className="space-y-5">
                  {GUIDED_QUESTIONS[currentCategory].questions.map((q, qi) => {
                    const key = `${currentCategory}-${qi}`;
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm text-[#1A1815] font-medium">
                          {q}
                        </label>
                        <textarea
                          rows={3}
                          value={answers[key] || ""}
                          onChange={(e) => handleAnswerChange(key, e.target.value)}
                          placeholder="Ketik transkripsi lisan narasumber secara apa adanya..."
                          className="w-full px-4 py-3 border border-[#E7E2D8] rounded bg-[#FAF9F6] text-sm text-[#1A1815] focus:outline-none focus:border-[#A8522E] resize-none"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#E7E2D8]">
                  <button
                    onClick={() => {
                      if (currentCategory > 0) {
                        setCurrentCategory(currentCategory - 1);
                      } else {
                        setStep("consent");
                      }
                    }}
                    className="text-xs font-mono uppercase tracking-wider text-[#6B655C] hover:text-[#1A1815]"
                  >
                    ← Sebelumnya
                  </button>
                  <span className="text-xs font-mono text-[#6B655C]">
                    {answeredCount}/{totalQuestions} Pertanyaan Terisi
                  </span>
                  <button
                    onClick={() => {
                      if (currentCategory < GUIDED_QUESTIONS.length - 1) {
                        setCurrentCategory(currentCategory + 1);
                      } else {
                        setStep("review");
                      }
                    }}
                    className="px-6 py-3 bg-[#1A1815] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#A8522E] transition-colors"
                  >
                    {currentCategory < GUIDED_QUESTIONS.length - 1
                      ? "Dimensi Selanjutnya →"
                      : "Periksa Lembar Wawancara →"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === "review" && (
            <div className="bg-white p-8 border border-[#E7E2D8] rounded-sm space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#A8522E] block mb-1">
                  KONFIRMASI AKHIR
                </span>
                <h3 className="font-display text-2xl text-[#1A1815]">
                  Lembar Rekaman Etnografi
                </h3>
              </div>

              <div className="p-4 bg-[#FAF9F6] border border-[#E7E2D8] rounded text-xs font-mono space-y-1 text-[#524E48]">
                <div>TRADISI: <span className="text-[#1A1815] font-semibold">{knowledgeTitle}</span></div>
                <div>NARASUMBER: <span className="text-[#1A1815] font-semibold">{holderName} ({holderAge || "Usia tidak tercatat"})</span></div>
                <div>LOKASI: <span className="text-[#1A1815] font-semibold">{region || "Nusantara"}</span></div>
                <div>RESTU ADAT: <span className="text-[#A8522E] font-semibold uppercase">{selectedConsent}</span></div>
              </div>

              <div className="space-y-4">
                {GUIDED_QUESTIONS.map((cat, ci) => (
                  <div key={cat.code} className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-[#A8522E] font-semibold">
                      {cat.code}. {cat.category}
                    </h4>
                    {cat.questions.map((q, qi) => {
                      const ans = answers[`${ci}-${qi}`];
                      return (
                        <div key={qi} className="text-xs pl-3 border-l-2 border-[#E7E2D8] py-1">
                          <div className="text-[#6B655C]">{q}</div>
                          <div className="text-[#1A1815] mt-0.5">
                            {ans?.trim() || <span className="text-[#9C958A] italic">Belum diisi</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#E7E2D8]">
                <button
                  onClick={() => setStep("interview")}
                  className="text-xs font-mono uppercase tracking-wider text-[#6B655C] hover:text-[#1A1815]"
                >
                  ← Sunting Jawaban
                </button>
                <button
                  onClick={() => setStep("complete")}
                  className="px-7 py-3.5 bg-[#A8522E] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded hover:bg-[#8C4425] transition-colors"
                >
                  Simpan ke Arsip Transmisi Hidup
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === "complete" && (
            <div className="text-center py-16 bg-white border border-[#E7E2D8] rounded-sm p-8 space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#FAF0EB] border border-[#F2D1C2] text-[#A8522E] font-mono text-xl flex items-center justify-center mx-auto">
                ✓
              </div>
              <h2 className="font-display text-3xl text-[#1A1815]">
                Rekaman Lapangan Berhasil Diarsipkan
              </h2>
              <p className="text-sm text-[#524E48] max-w-[500px] mx-auto leading-relaxed">
                Terima kasih atas kontribusi Anda dalam menjaga mata rantai budaya.
                Data wawancara akan diurai oleh tim kurasi menjadi Knowledge DNA
                dan diselaraskan dengan izin adat yang dipilih.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <Link
                  href="/knowledge"
                  className="px-6 py-3 bg-[#1A1815] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#A8522E] transition-colors"
                >
                  Lihat Indeks Pengetahuan
                </Link>
                <button
                  onClick={() => {
                    setStep("info");
                    setKnowledgeTitle("");
                    setHolderName("");
                    setHolderAge("");
                    setRegion("");
                    setAnswers({});
                    setCurrentCategory(0);
                  }}
                  className="px-6 py-3 border border-[#E7E2D8] text-[#1A1815] text-xs font-mono uppercase tracking-wider rounded hover:border-[#1A1815] transition-colors"
                >
                  Rekam Tradisi Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
