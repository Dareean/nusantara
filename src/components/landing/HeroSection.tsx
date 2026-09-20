"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-6 border-b border-[#E7E2D8]">
      <div className="mx-auto max-w-[1180px]">
        {/* Archival metadata ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-[#E7E2D8]/70 text-[11px] font-mono uppercase tracking-widest text-[#6B655C]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#A8522E]" />
            <span>KONSINYASI DOKUMENTER: TRANSMISI PENGETAHUAN HIDUP</span>
          </div>
          <div>INISIATIF REGENERASI MAESTRO TRADISIONAL</div>
          <div className="hidden sm:block">STATUS: AMBANG KEPUNAHAN</div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Provocative Statement & Mission */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block px-3 py-1 bg-[#F2EDE4] rounded text-[11px] font-mono uppercase tracking-wider text-[#6B655C]">
              PERTANYAAN ZAMAN INI
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1A1815] leading-[1.08] tracking-tight">
              What if tomorrow,
              <br />
              <span className="italic font-normal text-[#A8522E]">
                nobody remembers how?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#524E48] leading-relaxed max-w-[560px]">
              Pengetahuan budaya tidak hilang saat artefaknya tersimpan di lemari museum.
              Budaya punah saat sepasang tangan terakhir berhenti menenun, memahat,
              atau melantunkan mantra — tanpa ada seorang murid pun yang mewarisinya.
            </p>

            {/* Stark facts panel */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-[#E7E2D8]">
              <div>
                <div className="font-display text-2xl sm:text-3xl text-[#1A1815]">742</div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B655C] mt-1 font-mono">
                  Tradisi Kritis
                </div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl text-[#C23B22]">12%</div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B655C] mt-1 font-mono">
                  Punya Penerus
                </div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl text-[#1A1815]">01</div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B655C] mt-1 font-mono">
                  Misi: Jangan Putus
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="#knowledge-at-risk"
                className="px-7 py-3.5 bg-[#A8522E] text-white rounded text-xs uppercase tracking-widest font-medium hover:bg-[#8C4425] transition-all text-center shadow-sm"
              >
                Lihat Tradisi di Ambang Punah →
              </Link>
              <Link
                href="/capture"
                className="px-6 py-3.5 border border-[#1A1815] text-[#1A1815] rounded text-xs uppercase tracking-widest font-medium hover:bg-[#1A1815] hover:text-[#FAF9F6] transition-all text-center"
              >
                Rekam Pengetahuan Maestro
              </Link>
            </div>
          </div>

          {/* Right Column: High-art Archival Documentary Image */}
          <div className="lg:col-span-5">
            <div className="relative border border-[#E7E2D8] bg-[#F4F1EA] p-3 shadow-sm rounded-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#1A1815]">
                <Image
                  src="/images/hero_artisan.jpg"
                  alt="Mama Ina Pagi menenun Sekomandi di alat tenun tradisional"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover object-center grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C23B22] animate-ping" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/90">
                      ARSIP LAPANGAN #004 · SULAWESI BARAT
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-white font-normal">
                    Mama Ina Pagi (78 Tahun)
                  </h3>
                  <p className="text-xs text-white/80 font-light mt-0.5 leading-snug">
                    Satu dari dua penenun tertua yang masih menguasai teknik pewarnaan lumpur purba Sekomandi.
                  </p>
                </div>
              </div>

              {/* Archival caption card below image */}
              <div className="pt-3 px-1 flex items-center justify-between text-[11px] font-mono text-[#6B655C]">
                <span>LOKASI: KALUMPANG, MAMUJU</span>
                <span className="text-[#C23B22] font-semibold">STATUS: HANYA 2 PRAKTISI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
