"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/knowledge", label: "Indeks Pengetahuan" },
  { href: "/dashboard", label: "Radar Risiko" },
  { href: "/capture", label: "Rekam Ingatan" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E2D8]">
      <div className="mx-auto max-w-[1180px] px-6 flex items-center justify-between h-18">
        {/* Brand & Archival Register */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-baseline gap-2.5 group">
            <span className="font-display text-2xl tracking-tight font-semibold text-[#1A1815] group-hover:text-[#A8522E] transition-colors">
              NUSANTARA
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-[#6B655C] border-l border-[#D8D2C7] pl-2.5 hidden sm:inline-block">
              Before It&apos;s Gone
            </span>
          </Link>
        </div>

        {/* Live Risk Status Banner */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EB] border border-[#F2D1C2] text-[11px] text-[#8C3A1E] font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C23B22] animate-pulse" />
          <span>STATUS: 6 Tradisi Dalam Pantauan Kritis</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-wider text-[#6B655C] hover:text-[#1A1815] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-[#E7E2D8]" />

          <Link
            href="/capture"
            className="text-xs uppercase tracking-wider px-4 py-2 bg-[#1A1815] text-[#FAF9F6] rounded hover:bg-[#A8522E] transition-colors font-medium"
          >
            + Dokumentasikan
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-[#1A1815]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Navigasi"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-[#E7E2D8] bg-[#FAF9F6]",
          mobileOpen ? "max-h-80 py-4" : "max-h-0 py-0"
        )}
      >
        <div className="px-6 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-[#6B655C] hover:text-[#1A1815] py-1 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E7E2D8] flex flex-col gap-2">
            <Link
              href="/capture"
              className="text-center text-xs uppercase tracking-wider px-4 py-2.5 bg-[#1A1815] text-[#FAF9F6] rounded hover:bg-[#A8522E] font-medium"
              onClick={() => setMobileOpen(false)}
            >
              + Dokumentasikan Tradisi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
