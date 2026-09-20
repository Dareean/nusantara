"use client";

import Link from "next/link";
import Image from "next/image";
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

export default function RiskFeedSection() {
  const items = getKnowledgeSortedByRisk();
  const featured = items[0]; // Tenun Sekomandi

  return (
    <section id="knowledge-at-risk" className="py-20 md:py-28 px-6 bg-[#FAF9F6]">
      <div className="mx-auto max-w-[1180px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E7E2D8]">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8522E] block mb-2">
              01 / INDEKS RISIKO KEPUNAHAN
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1815]">
              Daftar Merah Pengetahuan Nusantara
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#6B655C] max-w-[420px] leading-relaxed">
            Data real-time jumlah maestro yang tersisa, murid yang sedang belajar,
            serta persentase DNA pengetahuan yang berhasil direkonstruksi.
          </p>
        </div>

        {/* Featured Case Study: Sekomandi Spotlight */}
        {featured && (
          <div className="mb-14 border border-[#E7E2D8] bg-[#F4F1EA] rounded-sm p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative aspect-[4/3] rounded overflow-hidden border border-[#E7E2D8] bg-[#1A1815]">
                <Image
                  src="/images/sekomandi_archive.jpg"
                  alt="Detail motif Tenun Sekomandi dan catatan lapangan"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#FAF9F6]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#1A1815] border border-[#E7E2D8]">
                  ARSIP DOKUMEN LAPANGAN
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                      RISK_BADGE[featured.risk?.risk_level ?? "critical"].bg
                    } ${RISK_BADGE[featured.risk?.risk_level ?? "critical"].text} ${
                      RISK_BADGE[featured.risk?.risk_level ?? "critical"].border
                    }`}
                  >
                    STATUS: {RISK_BADGE[featured.risk?.risk_level ?? "critical"].label}
                  </span>
                  <span className="text-xs font-mono text-[#6B655C]">
                    LOKASI: {featured.region}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl text-[#1A1815]">
                  {featured.title}
                </h3>

                <p className="text-sm text-[#524E48] leading-relaxed">
                  {featured.summary ||
                    "Kain tenun ikat purba dengan motif sakral Pote Sekang. Memerlukan perendaman lumpur rawa selama berminggu-minggu dan bahan pewarna alami dari akar mengkudu hutan lindung Kalumpang."}
                </p>

                {/* Vital Statistics Row */}
                <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#E7E2D8]/70 text-center sm:text-left">
                  <div>
                    <div className="text-xl sm:text-2xl font-display text-[#C23B22]">
                      {featured.risk?.known_practitioners ?? 2} Orang
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B655C]">
                      Praktisi Hidup
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-display text-[#1A1815]">
                      {featured.risk?.apprentice_count ?? 1} Murid
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B655C]">
                      Magang Aktif
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-display text-[#1A1815]">
                      {featured.risk?.documentation_pct ?? 35}%
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B655C]">
                      DNA Terdokumentasi
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={`/knowledge/${featured.id}`}
                    className="px-5 py-2.5 bg-[#A8522E] text-white text-xs uppercase tracking-widest font-medium rounded hover:bg-[#8C4425] transition-colors"
                  >
                    Buka DNA & Garis Silsilah →
                  </Link>
                  <Link
                    href={`/knowledge/${featured.id}/mentor`}
                    className="text-xs font-mono uppercase tracking-wider text-[#1A1815] hover:text-[#A8522E] transition-colors underline underline-offset-4"
                  >
                    Daftar Sebagai Calon Magang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archival Ledger Table */}
        <div className="border border-[#E7E2D8] bg-white rounded-sm overflow-hidden shadow-xs">
          <div className="px-6 py-4 bg-[#FAF9F6] border-b border-[#E7E2D8] flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B655C]">
              REGISTER PENGETAHUAN BUDAYA TERVERIFIKASI
            </span>
            <span className="text-xs font-mono text-[#6B655C]">
              {items.length} Entitas Terdata
            </span>
          </div>

          <div className="divide-y divide-[#E7E2D8]">
            {items.map((item, idx) => {
              const risk = item.risk?.risk_level ?? "warning";
              const badge = RISK_BADGE[risk];

              return (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 hover:bg-[#FAF9F6] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono text-[#A8522E] mt-1 font-semibold">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs text-[#6B655C] font-mono">
                          {item.region} · {item.category}
                        </span>
                      </div>
                      <h4 className="font-display text-lg text-[#1A1815]">
                        <Link
                          href={`/knowledge/${item.id}`}
                          className="hover:text-[#A8522E] transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#6B655C] mt-1 max-w-[600px] line-clamp-1">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* Status numbers & action */}
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-[#E7E2D8]/60">
                    <div className="text-right">
                      <div className="text-sm font-display text-[#1A1815]">
                        {item.risk?.known_practitioners ?? 0} Praktisi
                      </div>
                      <div className="text-[10px] font-mono text-[#6B655C]">
                        {item.risk?.apprentice_count ?? 0} Magang
                      </div>
                    </div>

                    <Link
                      href={`/knowledge/${item.id}`}
                      className="px-4 py-2 border border-[#E7E2D8] hover:border-[#1A1815] text-xs font-mono uppercase tracking-wider text-[#1A1815] hover:bg-[#1A1815] hover:text-white rounded transition-colors shrink-0"
                    >
                      Urai DNA →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View all footer */}
        <div className="text-center mt-10">
          <Link
            href="/knowledge"
            className="text-xs uppercase font-mono tracking-widest text-[#A8522E] hover:text-[#8C4425] transition-colors underline underline-offset-4"
          >
            Lihat Seluruh Arsip dan Kategori Pengetahuan →
          </Link>
        </div>
      </div>
    </section>
  );
}
