import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E2D8] bg-[#FAF9F6] py-16 px-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#E7E2D8]">
          {/* Colophon & Purpose */}
          <div className="md:col-span-6 space-y-4">
            <span className="font-display text-2xl tracking-tight font-semibold text-[#1A1815]">
              NUSANTARA
            </span>
            <p className="text-xs font-mono tracking-wider uppercase text-[#6B655C]">
              BEFORE IT&apos;S GONE · ARSIP TRANSMISI PENGETAHUAN BUDAYA
            </p>
            <p className="text-sm text-[#524E48] max-w-[440px] leading-relaxed">
              Didedikasikan untuk para penjaga tradisi Nusantara yang teguh merawat
              kearifan leluhur di pelosok negeri. Budaya tidak boleh padam hanya
              karena zaman bergerak terlalu cepat.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#1A1815] font-semibold block">
              NAVIGASI ARSIP
            </span>
            <ul className="space-y-2 text-xs font-mono text-[#6B655C]">
              <li>
                <Link href="/knowledge" className="hover:text-[#A8522E] transition-colors">
                  Indeks Pengetahuan di Ambang Punah
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#A8522E] transition-colors">
                  Radar Risiko & Sebaran Wilayah
                </Link>
              </li>
              <li>
                <Link href="/capture" className="hover:text-[#A8522E] transition-colors">
                  Formulir Rekam Ingatan Lapangan
                </Link>
              </li>
              <li>
                <Link href="/knowledge/sekomandi" className="hover:text-[#A8522E] transition-colors">
                  Studi Kasus: Tenun Sekomandi
                </Link>
              </li>
            </ul>
          </div>

          {/* Protokol & Etika */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#1A1815] font-semibold block">
              ETIKA & RESTU ADAT
            </span>
            <p className="text-xs text-[#6B655C] leading-relaxed">
              Seluruh rekaman pengetahuan dilindungi protokol Cultural Consent.
              Hak kepemilikan komunal dan hukum adat tetap berada di tangan
              komunitas pemilik pengetahuan.
            </p>
            <div className="text-[11px] font-mono text-[#A8522E] pt-2">
              Kepatuhan Deklarasi PBB tentang Hak-Hak Masyarakat Adat (UNDRIP)
            </div>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B655C]">
          <div>
            © {new Date().getFullYear()} Nusantara Platform · Lomba Aplikasi Berbasis Web Nasional (Munas IX Unima)
          </div>
          <div className="flex items-center gap-4">
            <span>Standar Preservasi Digital Berbasis Etnografi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
