import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getKnowledgeSortedByRisk } from "@/lib/data/seed";
import type { RiskLevel } from "@/types/database";

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; bg: string; dot: string; text: string; desc: string }
> = {
  critical: {
    label: "KRITIS (CRITICAL)",
    bg: "bg-[#C23B22]",
    dot: "bg-[#C23B22]",
    text: "text-[#C23B22]",
    desc: "Praktisi ≤ 2 orang, tanpa regenerasi aman",
  },
  high: {
    label: "RISIKO TINGGI",
    bg: "bg-[#D98A3D]",
    dot: "bg-[#D98A3D]",
    text: "text-[#D98A3D]",
    desc: "Praktisi 3-5 orang, dokumentasi minim",
  },
  warning: {
    label: "WASPADA",
    bg: "bg-[#B8860B]",
    dot: "bg-[#B8860B]",
    text: "text-[#B8860B]",
    desc: "Penurunan minat generasi muda terdeteksi",
  },
  healthy: {
    label: "TERJAGA (SEHAT)",
    bg: "bg-[#4E7A51]",
    dot: "bg-[#4E7A51]",
    text: "text-[#4E7A51]",
    desc: "Regenerasi aktif dan komunitas mandiri",
  },
};

export default function DashboardPage() {
  const items = getKnowledgeSortedByRisk();

  const counts: Record<RiskLevel, number> = {
    critical: 0,
    high: 0,
    warning: 0,
    healthy: 0,
  };

  for (const item of items) {
    const level = item.risk?.risk_level ?? "warning";
    counts[level]++;
  }

  const totalKnowledge = items.length;
  const totalPractitioners = items.reduce(
    (acc, i) => acc + (i.risk?.known_practitioners ?? 0),
    0
  );
  const totalApprentices = items.reduce(
    (acc, i) => acc + (i.risk?.apprentice_count ?? 0),
    0
  );

  const riskLevels: RiskLevel[] = ["critical", "high", "warning", "healthy"];

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 px-6 bg-[#FAF9F6]">
        <div className="mx-auto max-w-[1180px]">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-[#E7E2D8]">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8522E] block mb-2">
              MONITORING STATUS KEPUNAHAN
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-[#1A1815] mb-3">
              Cultural Risk Radar (Pusat Pantau)
            </h1>
            <p className="text-base text-[#524E48] max-w-[650px] leading-relaxed">
              Pemantauan distribusi risiko kepunahan budaya di seluruh Nusantara
              berdasarkan rasio praktisi aktif terhadap murid penerus.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
            <div className="bg-white border border-[#E7E2D8] p-6 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B655C] mb-2">
                ENTITAS TERPANTAU
              </div>
              <div className="font-display text-3xl sm:text-4xl text-[#1A1815]">
                {totalKnowledge}
              </div>
              <div className="text-xs text-[#6B655C] mt-2">
                Sistem pengetahuan terstruktur
              </div>
            </div>

            <div className="bg-white border border-[#E7E2D8] p-6 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B655C] mb-2">
                TOTAL MAESTRO / PRAKTISI
              </div>
              <div className="font-display text-3xl sm:text-4xl text-[#C23B22]">
                {totalPractitioners}
              </div>
              <div className="text-xs text-[#6B655C] mt-2">
                Orang sepuh yang memegang ilmu
              </div>
            </div>

            <div className="bg-white border border-[#E7E2D8] p-6 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B655C] mb-2">
                MURID / CALON PENERUS
              </div>
              <div className="font-display text-3xl sm:text-4xl text-[#4E7A51]">
                {totalApprentices}
              </div>
              <div className="text-xs text-[#6B655C] mt-2">
                Sedang menempuh magang aktif
              </div>
            </div>
          </div>

          {/* 4 Horizontal Bands (design.md §5.3) */}
          <div className="mb-14">
            <h2 className="font-display text-2xl text-[#1A1815] mb-6">
              Distribusi Spektrum Risiko
            </h2>

            <div className="space-y-4">
              {riskLevels.map((level) => {
                const config = RISK_CONFIG[level];
                const pct =
                  totalKnowledge > 0
                    ? Math.round((counts[level] / totalKnowledge) * 100)
                    : 0;

                return (
                  <div
                    key={level}
                    className="p-5 bg-white border border-[#E7E2D8] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start md:items-center gap-4 min-w-[260px]">
                      <span className={`w-2.5 h-2.5 rounded-full mt-1.5 md:mt-0 ${config.dot}`} />
                      <div>
                        <div className="font-mono text-xs font-semibold text-[#1A1815] tracking-wider">
                          {config.label}
                        </div>
                        <div className="text-xs text-[#6B655C] mt-0.5">
                          {config.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-[500px]">
                      <div className="w-full h-2 bg-[#E7E2D8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.bg}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 shrink-0 md:text-right">
                      <span className="font-display text-xl text-[#1A1815]">
                        {counts[level]} Entitas
                      </span>
                      <span className="text-xs font-mono text-[#6B655C]">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ledger of All Tracked Items */}
          <div>
            <h2 className="font-display text-2xl text-[#1A1815] mb-6">
              Daftar Terpantau Lengkap
            </h2>

            <div className="border border-[#E7E2D8] bg-white rounded-sm divide-y divide-[#E7E2D8]">
              {items.map((item) => {
                const level = item.risk?.risk_level ?? "warning";
                const config = RISK_CONFIG[level];

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 hover:bg-[#FAF9F6] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      <div>
                        <Link
                          href={`/knowledge/${item.id}`}
                          className="font-display text-base text-[#1A1815] hover:text-[#A8522E] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="text-xs text-[#6B655C] font-mono">
                          {item.region}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-mono text-[#524E48]">
                      <div>
                        Praktisi:{" "}
                        <span className="text-[#1A1815] font-semibold">
                          {item.risk?.known_practitioners ?? 0}
                        </span>
                      </div>
                      <div>
                        Dokumentasi:{" "}
                        <span className="text-[#1A1815] font-semibold">
                          {item.risk?.documentation_pct ?? 0}%
                        </span>
                      </div>
                      <Link
                        href={`/knowledge/${item.id}`}
                        className="text-[#A8522E] underline underline-offset-2"
                      >
                        Buka Arsip →
                      </Link>
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
