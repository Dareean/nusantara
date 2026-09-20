"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { KnowledgeDnaNode, DnaNodeType } from "@/types/database";

const DNA_SECTIONS: {
  type: DnaNodeType;
  code: string;
  label: string;
  description: string;
}[] = [
  {
    type: "technique",
    code: "01",
    label: "Teknik & Proses Pembuatan",
    description: "Langkah-langkah kinetik dan tahapan pengerjaan dari awal hingga akhir",
  },
  {
    type: "knowledge_fact",
    code: "02",
    label: "Material Alam & Pengetahuan Dasar",
    description: "Bahan-bahan organik, musim pemanenan, dan takaran tradisional",
  },
  {
    type: "meaning",
    code: "03",
    label: "Makna Filosofis & Simbolisme",
    description: "Kosmologi, filosofi kehidupan, dan doa di balik setiap motif dan gerak",
  },
  {
    type: "warning",
    code: "04",
    label: "Pantangan, Tabu & Aturan Adat",
    description: "Larangan sakral yang wajib dipatuhi agar keseimbangan tidak rusak",
  },
  {
    type: "story",
    code: "05",
    label: "Mitos & Sejarah Lisan",
    description: "Asal-usul leluhur, cerita rakyat, dan narasi tutur turun-temurun",
  },
  {
    type: "people",
    code: "06",
    label: "Silsilah Maestro & Praktisi",
    description: "Para pemegang pengetahuan dan rantai guru-murid yang tercatat",
  },
  {
    type: "variation",
    code: "07",
    label: "Variasi & Dialek Kriya",
    description: "Perbedaan gaya antarkampung dan adaptasi zaman",
  },
  {
    type: "terminology",
    code: "08",
    label: "Glosarium & Bahasa Ibu",
    description: "Istilah asli dalam bahasa daerah yang tidak memiliki padanan langsung",
  },
];

interface DnaAccordionProps {
  grouped: Record<DnaNodeType, KnowledgeDnaNode[]>;
}

export default function DnaAccordion({ grouped }: DnaAccordionProps) {
  const [openSection, setOpenSection] = useState<DnaNodeType | null>("technique");

  const activeSections = DNA_SECTIONS.filter(
    (s) => grouped[s.type] && grouped[s.type].length > 0
  );

  if (activeSections.length === 0) {
    return (
      <div className="border border-[#E7E2D8] bg-[#FAF9F6] rounded-sm p-12 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B655C] block mb-2">
          ARSIP BELUM TERSTRUKTUR
        </span>
        <p className="text-sm text-[#524E48]">
          DNA pengetahuan untuk entitas ini sedang dalam tahap transkripsi dan verifikasi kurator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeSections.map((section) => {
        const isOpen = openSection === section.type;
        const nodes = grouped[section.type];
        const isWarning = section.type === "warning";

        return (
          <div
            key={section.type}
            className={cn(
              "border rounded-sm overflow-hidden transition-colors",
              isWarning
                ? "border-[#FADFCA] bg-[#FFFDFB]"
                : "border-[#E7E2D8] bg-white",
              isOpen && !isWarning && "border-[#1A1815]/40"
            )}
          >
            {/* Accordion header */}
            <button
              onClick={() => setOpenSection(isOpen ? null : section.type)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-5 text-left transition-colors",
                isOpen
                  ? isWarning
                    ? "bg-[#FEF6EE]/60"
                    : "bg-[#F9F8F5]"
                  : "hover:bg-[#FAF9F6]"
              )}
            >
              <div className="flex items-start sm:items-center gap-4">
                <span
                  className={cn(
                    "text-xs font-mono font-semibold px-2 py-0.5 rounded border shrink-0 mt-0.5 sm:mt-0",
                    isWarning
                      ? "bg-[#FDF2F0] text-[#C23B22] border-[#F8D5D0]"
                      : "bg-[#F2EDE4] text-[#1A1815] border-[#E7E2D8]"
                  )}
                >
                  {section.code}
                </span>
                <div>
                  <h3 className="font-display text-lg sm:text-xl text-[#1A1815] leading-snug">
                    {section.label}
                  </h3>
                  <p className="text-xs text-[#6B655C] mt-0.5 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-[11px] font-mono text-[#6B655C] hidden sm:inline">
                  {nodes.length} Entri
                </span>
                <span
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full border border-[#E7E2D8] text-xs transition-transform duration-200",
                    isOpen && "rotate-180 bg-[#1A1815] text-white border-[#1A1815]"
                  )}
                >
                  ↓
                </span>
              </div>
            </button>

            {/* Accordion content */}
            {isOpen && (
              <div className="px-6 py-6 border-t border-[#E7E2D8]/60 divide-y divide-[#E7E2D8]/60">
                {nodes.map((node, i) => (
                  <div key={node.id} className={cn("py-5 first:pt-0 last:pb-0 space-y-2")}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="font-display text-base text-[#1A1815] font-medium">
                        {node.title}
                      </h4>
                      {isWarning && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C23B22] font-semibold">
                          LARANGAN SAKRAL
                        </span>
                      )}
                    </div>
                    {node.content && (
                      <p className="text-sm text-[#524E48] leading-relaxed whitespace-pre-line">
                        {node.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
