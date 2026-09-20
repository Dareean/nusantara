import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getKnowledgeSortedByRisk } from "@/lib/data/seed";
import type { RiskLevel } from "@/types/database";

const RISK_BADGE: Record<
  RiskLevel,
  { label: string; bg: string; text: string; border: string }
> = {
  critical: {
    label: "KRITIS",
    bg: "bg-[#FDF2F0]",
    text: "text-[#C23B22]",
    border: "border-[#F8D5D0]",
  },
  high: {
    label: "TINGGI",
    bg: "bg-[#FEF6EE]",
    text: "text-[#D98A3D]",
    border: "border-[#FADFCA]",
  },
  warning: {
    label: "WASPADA",
    bg: "bg-[#FEFCE8]",
    text: "text-[#B8860B]",
    border: "border-[#FEF08A]",
  },
  healthy: {
    label: "TERJAGA",
    bg: "bg-[#F0F7F1]",
    text: "text-[#4E7A51]",
    border: "border-[#D1E7D4]",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  craft: "Kriya Tekstil & Tenun",
  language: "Bahasa Daerah",
  music: "Musik Tradisional",
  culinary: "Kuliner Leluhur",
  ritual: "Upacara & Daur Hidup",
  oral_story: "Tradisi Tutur",
  other: "Kearifan Lokal",
};

export default function KnowledgeListingPage() {
  const items = getKnowledgeSortedByRisk();

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 px-6 bg-[#FAF9F6]">
        <div className="mx-auto max-w-[1180px]">
          {/* Header */}
          <div className="mb-14 pb-8 border-b border-[#E7E2D8]">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8522E] block mb-2">
              ARSIP UTAMA PENGETAHUAN BUDAYA
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-[#1A1815] mb-4">
              Indeks Pengetahuan di Ambang Punah
            </h1>
            <p className="text-base text-[#524E48] max-w-[680px] leading-relaxed">
              Setiap catatan di bawah ini adalah sebuah ekosistem kearifan
              yang hanya hidup di ingatan segelintir maestro sepuh.
              Ketika mereka tiada tanpa murid, pengetahuan tersebut musnah selamanya.
            </p>
          </div>

          {/* Archival Ledger */}
          <div className="border border-[#E7E2D8] bg-white rounded-sm overflow-hidden shadow-xs">
            <div className="px-6 py-4 bg-[#FAF9F6] border-b border-[#E7E2D8] flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B655C]">
                REGISTER ENTITAS BUDAYA AKTIF
              </span>
              <span className="text-xs font-mono text-[#6B655C]">
                Total: {items.length} Pengetahuan Terpantau
              </span>
            </div>

            <div className="divide-y divide-[#E7E2D8]">
              {items.map((item, idx) => {
                const risk = item.risk?.risk_level ?? "warning";
                const badge = RISK_BADGE[risk];

                return (
                  <div
                    key={item.id}
                    className="p-6 sm:p-7 hover:bg-[#FAF9F6] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-[#A8522E] font-semibold mt-1">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-xs font-mono text-[#6B655C]">
                            {item.region}
                          </span>
                          <span className="text-xs text-[#6B655C]">·</span>
                          <span className="text-xs font-mono text-[#6B655C]">
                            {CATEGORY_LABELS[item.category ?? "craft"] ?? item.category}
                          </span>
                        </div>

                        <h2 className="font-display text-2xl text-[#1A1815]">
                          <Link
                            href={`/knowledge/${item.id}`}
                            className="hover:text-[#A8522E] transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h2>

                        <p className="text-sm text-[#524E48] max-w-[700px] leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E7E2D8]/60 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-display text-[#1A1815]">
                          {item.risk?.known_practitioners ?? 0} Praktisi
                        </div>
                        <div className="text-[10px] font-mono text-[#6B655C]">
                          {item.risk?.apprentice_count ?? 0} Murid Aktif
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/knowledge/${item.id}`}
                          className="px-4 py-2.5 bg-[#1A1815] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#A8522E] transition-colors"
                        >
                          Buka DNA
                        </Link>
                        <Link
                          href={`/knowledge/${item.id}/learn`}
                          className="px-4 py-2.5 border border-[#E7E2D8] text-xs font-mono uppercase tracking-wider text-[#1A1815] hover:border-[#1A1815] rounded transition-colors hidden sm:inline-block"
                        >
                          Silabus
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
