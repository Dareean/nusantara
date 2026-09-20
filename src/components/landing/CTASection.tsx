"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#FAF9F6] border-t border-[#E7E2D8]">
      <div className="mx-auto max-w-[1000px]">
        {/* Solemn quote banner */}
        <div className="text-center max-w-[760px] mx-auto mb-16">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8522E] block mb-3">
            03 / ESTAFET KEBUDAYAAN
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1815] leading-tight mb-5">
            Mata rantai peradaban hanya sekuat
            <br />
            <span className="italic text-[#A8522E]">generasi berikutnya yang menyambutnya.</span>
          </h2>
          <p className="text-base text-[#524E48] leading-relaxed">
            Apakah Anda seorang pemuda yang ingin berguru langsung kepada maestro adat,
            atau seorang keluarga pemilik pengetahuan yang ingin warisannya tetap hidup?
          </p>
        </div>

        {/* Dual Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Path 1: For Apprentices / Learners */}
          <div className="p-8 bg-white border border-[#E7E2D8] rounded-sm flex flex-col justify-between hover:border-[#1A1815] transition-all">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B655C]">
                JALUR 01 — CALON PENERUS (MAGANG)
              </span>
              <h3 className="font-display text-2xl text-[#1A1815]">
                Berguru Langsung ke Maestro
              </h3>
              <p className="text-sm text-[#524E48] leading-relaxed">
                Pilih pengetahuan yang terancam punah. Ikuti kurikulum silabus DNA,
                ajukan diri menjadi murid magang, dan pelajari tata cara adat langsung dari sumbernya.
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/knowledge"
                className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-[#A8522E] text-white text-xs font-mono uppercase tracking-widest rounded hover:bg-[#8C4425] transition-colors"
              >
                Cari Maestro & Ajukan Magang →
              </Link>
            </div>
          </div>

          {/* Path 2: For Cultural Holders & Communities */}
          <div className="p-8 bg-[#F4F1EA] border border-[#E7E2D8] rounded-sm flex flex-col justify-between hover:border-[#1A1815] transition-all">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B655C]">
                JALUR 02 — PEMILIK PENGETAHUAN (HOLDER)
              </span>
              <h3 className="font-display text-2xl text-[#1A1815]">
                Rekam & Lindungi Hak Adat
              </h3>
              <p className="text-sm text-[#524E48] leading-relaxed">
                Dokumentasikan ingatan, teknik, dan pantangan dengan panduan wawancara
                etnografis. Anda memegang kendali penuh atas privasi dan hak siar pengetahuan.
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/capture"
                className="inline-block w-full sm:w-auto text-center px-6 py-3 border border-[#1A1815] text-[#1A1815] text-xs font-mono uppercase tracking-widest rounded hover:bg-[#1A1815] hover:text-[#FAF9F6] transition-colors"
              >
                Mulai Rekam Ingatan Adat →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
