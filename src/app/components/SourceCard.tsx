"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import type { CulturalSource } from "@/lib/lessons";

interface SourceCardProps {
  source?: CulturalSource;
  className?: string;
}

export default function SourceCard({ source, className = "" }: SourceCardProps) {
  if (!source) return null;

  return (
    <div
      className={`w-full text-left p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5 ${className}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-secondary font-black text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Cultural Source Card</span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container text-[9px] font-black tracking-widest">
            DATA DEMO
          </span>
        </div>
        <span className="text-[10px] font-mono text-outline font-bold">
          {source.registrationCode}
        </span>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        {source.summary}
      </p>

      <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-on-surface-variant">
        <span>
          Lembaga: <strong>{source.institution}</strong>
          {source.informant ? ` • ${source.informant}` : ""}
        </span>
        <span className="text-secondary font-bold">
          {source.status || "Draft — dalam proses validasi"}
        </span>
      </div>
      <p className="text-[10px] text-outline italic">
        Draft — dalam proses validasi
      </p>
    </div>
  );
}
