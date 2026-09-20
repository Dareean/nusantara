"use client";

const STEPS = [
  {
    step: "01",
    phase: "FROM MEMORY",
    label: "Rekam dari Ingatan",
    description:
      "Wawancara etnografis terarah menggali memori langsung dari maestro sepuh. Tidak sekadar mencatat 'apa', melainkan gerak kinetik tangan, takaran rasa, dan ingatan lisan sebelum terlupakan.",
    takeaway: "Bukan artikel ensiklopedia statis, melainkan data hidup.",
  },
  {
    step: "02",
    phase: "TO KNOWLEDGE",
    label: "Urai Menjadi DNA",
    description:
      "Pengetahuan diurai ke dalam 6 komponen inti: Teknik & Proses, Material Alam, Makna Filosofis, Cerita Asal, Silsilah Tokoh, serta Pantangan & Tabu Adat yang wajib dihormati.",
    takeaway: "Memisahkan inti keahlian dari mitos tanpa mencabut akarnya.",
  },
  {
    step: "03",
    phase: "TO SKILL",
    label: "Transmisi ke Tangan",
    description:
      "Pengetahuan budaya tidak bisa dipelajari hanya dengan membaca. Nusantara menghubungkan calon penerus terpilih dengan pemegang tradisi untuk magang langsung di bawah bimbingan adat.",
    takeaway: "Keahlian hidup dalam sentuhan tangan, bukan layar.",
  },
  {
    step: "04",
    phase: "TO GENERATION",
    label: "Silsilah Tak Terputus",
    description:
      "Setiap murid yang terverifikasi dan mendapat restu maestro dicatat ke dalam Garis Silsilah Pengetahuan (Lineage). Mereka resmi menjadi mata rantai baru penjaga peradaban.",
    takeaway: "Risiko kepunahan turun. Rantai transmisi berlanjut.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 bg-[#1A1815] text-[#FAF9F6]">
      <div className="mx-auto max-w-[1180px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-20">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#D98A3D] block mb-3">
            02 / METODOLOGI TRANSMISI
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F6] leading-tight">
            Dari Ingatan Menjadi Kemahiran Hidup
          </h2>
          <p className="mt-4 text-base text-[#9C958A] leading-relaxed">
            Menyelamatkan budaya bukan berarti membekukannya di lemari kaca.
            Nusantara membangun protokol 4 tahap agar pengetahuan berpindah
            dari generasi tua ke tangan generasi muda.
          </p>
        </div>

        {/* Transmission Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between p-6 sm:p-7 rounded-sm bg-[#24211D] border border-white/10 hover:border-[#A8522E] transition-all duration-300"
            >
              <div>
                {/* Step index & Phase tag */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <span className="font-display text-2xl text-[#D98A3D] font-light">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#9C958A]">
                    {item.phase}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl text-[#FAF9F6] mb-3">
                  {item.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#9C958A] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Takeaway footer note */}
              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono text-[#E7E2D8]/80 italic">
                  &ldquo;{item.takeaway}&rdquo;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cultural Ethics & Consent Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-sm bg-[#221F1B] border border-[#A8522E]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D98A3D]">
              PROTOKOL PERSETUJUAN ADAT (CULTURAL CONSENT)
            </span>
            <h4 className="font-display text-lg text-[#FAF9F6]">
              Pengetahuan suci dan rahasia adat tidak disebarkan sembarangan
            </h4>
            <p className="text-xs text-[#9C958A] max-w-[680px]">
              Setiap komunitas adat memiliki hak mutlak menentukan tingkat akses: Terbuka untuk Umum, Khusus Komunitas, Hanya untuk Calon Magang Bersumpah, atau Tertutup Penuh.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-block px-4 py-2 border border-white/20 text-white text-xs font-mono uppercase tracking-wider rounded">
              5 Tingkat Proteksi Adat
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
