import { cn } from "@/lib/utils/cn";
import type { RiskLevel } from "@/types/database";

const RISK_BADGE: Record<
  RiskLevel,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  critical: {
    label: "KRITIS",
    bg: "bg-[#FDF2F0]",
    text: "text-[#C23B22]",
    border: "border-[#F8D5D0]",
    desc: "Ambang kepunahan langsung dalam 1 generasi",
  },
  high: {
    label: "RISIKO TINGGI",
    bg: "bg-[#FEF6EE]",
    text: "text-[#D98A3D]",
    border: "border-[#FADFCA]",
    desc: "Penurunan praktisi drastis, butuh intervensi",
  },
  warning: {
    label: "WASPADA",
    bg: "bg-[#FEFCE8]",
    text: "text-[#B8860B]",
    border: "border-[#FEF08A]",
    desc: "Regenerasi melambat secara signifikan",
  },
  healthy: {
    label: "TERJAGA",
    bg: "bg-[#F0F7F1]",
    text: "text-[#4E7A51]",
    border: "border-[#D1E7D4]",
    desc: "Memiliki ekosistem regenerasi aktif",
  },
};

interface RiskIndicatorProps {
  riskLevel: RiskLevel;
  practitioners: number;
  apprentices: number;
  documentationPct: number;
  impactItems?: string[];
}

export default function RiskIndicator({
  riskLevel,
  practitioners,
  apprentices,
  documentationPct,
  impactItems = [],
}: RiskIndicatorProps) {
  const badge = RISK_BADGE[riskLevel];

  return (
    <div className="border border-[#E7E2D8] bg-[#FAF9F6] rounded-sm p-6 space-y-6">
      {/* Top Status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#6B655C]">
            STATUS ANCAMAN KEPUNAHAN
          </span>
          <span
            className={cn(
              "text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase tracking-wider",
              badge.bg,
              badge.text,
              badge.border
            )}
          >
            {badge.label}
          </span>
        </div>
        <p className="text-xs text-[#524E48] font-medium leading-snug">
          {badge.desc}
        </p>
      </div>

      {/* Vital Statistics List */}
      <div className="space-y-3 py-4 border-y border-[#E7E2D8]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#6B655C]">
            Praktisi Hidup
          </span>
          <span className="font-display text-lg text-[#1A1815]">
            {practitioners} Orang
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#6B655C]">
            Murid / Magang Aktif
          </span>
          <span className="font-display text-lg text-[#1A1815]">
            {apprentices} Orang
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#6B655C]">
            DNA Terdokumentasi
          </span>
          <span className="font-display text-lg text-[#1A1815]">
            {documentationPct}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[10px] font-mono text-[#6B655C] mb-1.5">
          <span>KELENGKAPAN ARSIP</span>
          <span>{documentationPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#E7E2D8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#A8522E] rounded-full"
            style={{ width: `${Math.min(documentationPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Loss Impact */}
      {impactItems.length > 0 && (
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C23B22] block mb-2">
            KONSEKUENSI JIKA LENYAP
          </span>
          <div className="space-y-1.5">
            {impactItems.map((item) => (
              <div
                key={item}
                className="text-xs text-[#524E48] flex items-start gap-2"
              >
                <span className="text-[#C23B22] font-mono mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
