"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";

export default function CultureConnectionPage() {
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      router.push("/dashboard/paspor");
    }, 1200);
  };

  return (
    <>
      <TopBar
        title="Culture Connection Studio"
        subtitle="Simulasi Peristiwa Kontekstual Adat"
      />
      <main className="relative pt-20 px-4 lg:px-8 w-full min-h-screen overflow-x-clip">
        <div className="w-full max-w-6xl mx-auto pb-16 flex flex-col gap-6">
          {/* Top Banner / Scenario Sub-header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  SIGNATURE CHALLENGE • SKENARIO TERPADU
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
                  <span className="material-symbols-outlined text-sm">
                    navigation
                  </span>
                  Lembah Palu • 3 Tahapan Keputusan
                </span>
              </div>
              <h1 className="text-headline-lg text-on-surface tracking-tight font-extrabold mt-1">
                Menghadiri Upacara Adat Pernikahan di Palu
              </h1>
              <p className="text-body-md text-on-surface-variant max-w-3xl">
                Tantangan Terpadu: Gabungan Diplomasi Bahasa Sapaan &amp; Tata
                Busana Adat Kaili.
              </p>
            </div>

            {/* Live Readiness Meter */}
            <div className="flex items-center gap-4 self-start md:self-auto bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant/20">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    className="stroke-surface-container-highest"
                    cx="24"
                    cy="24"
                    fill="transparent"
                    r="20"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="stroke-primary"
                    cx="24"
                    cy="24"
                    fill="transparent"
                    r="20"
                    strokeDasharray="125.66"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                </svg>
                <span className="absolute text-label-md text-primary font-bold">
                  100%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                  Tingkat Harmoni
                </span>
                <span className="text-title-md text-on-surface font-extrabold">
                  3/3 Sempurna
                </span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Cultural Scenario & Context */}
            <section className="lg:col-span-5 flex flex-col gap-4">
              {/* Scenario Brief Card */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      import_contacts
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
                      Latar Peristiwa
                    </span>
                    <span className="text-title-md text-on-surface font-bold">
                      Pernikahan Kerabat di Souraja
                    </span>
                  </div>
                </div>

                <p className="text-body-md text-on-surface leading-relaxed">
                  Kamu diundang mewakili keluargamu menghadiri upacara
                  pernikahan adat Kaili di Palu Barat. Satukan bahasa sapaan yang
                  santun dan busana adat yang serasi untuk menghormati dewan
                  pemangku adat.
                </p>

                {/* Etiquette Tips Mini Box */}
                <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                  <div className="flex items-center gap-1.5 text-primary text-label-md font-bold">
                    <span className="material-symbols-outlined text-sm">
                      verified_user
                    </span>
                    Adab Utama Kaili (Kabilasa &amp; Maradika)
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Dalam tradisi Ledo, ketenangan tutur kata dan keselarasan
                    warna kain tenun mencerminkan silsilah kehormatan dan adab
                    menghargai sang tuan rumah (Pue Rumah).
                  </p>
                </div>
              </div>

              {/* Atmospheric Venue Canvas Card */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-xs overflow-hidden flex flex-col border border-outline-variant/30">
                <div className="relative w-full h-72 overflow-hidden group">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Souraja Rumah Adat Kaili"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnqzf4AUY4GtDvGFESMzw5vK14-0xCr_-CqqKyHzgObssX2HonjZALyMHyv39OWxApYxC7Qh-I_QL8HUz0P49aJ6BzYjxVwjXJHDsRyqGQ94Fcy6GzwgtD7xsDzDMpUvUCL8cjccCPgdt2Y3tLKFkDkPWH3ofPYJMVw67VqH8tQ8M2Lij3qg990UKy62hGgrC7qGw0SSgnFIpN5YHUA0es_BtlcATm5jgXKQfrCE10dXoeDE-lLZQMbw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="inline-flex items-center gap-1 text-secondary-fixed text-label-sm uppercase tracking-wider mb-1 font-bold">
                      <span className="material-symbols-outlined text-sm">
                        pin_drop
                      </span>
                      Palu Barat, Sulawesi Tengah
                    </span>
                    <span className="text-title-md text-white font-bold leading-snug">
                      Souraja (Rumah Adat Kaili)
                    </span>
                    <span className="text-body-sm text-neutral-300">
                      Momen Kedatangan Tamu Kehormatan &amp; Dewan Pemangku Adat
                    </span>
                  </div>
                </div>

                {/* Ambient Audio Interactive Button */}
                <div className="p-4 flex flex-col gap-2 bg-surface-container-lowest">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-full bg-tertiary-fixed text-on-tertiary-fixed transition-all hover:bg-tertiary-fixed-dim cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[24px] text-tertiary">
                        {isPlayingAudio ? "graphic_eq" : "volume_up"}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-label-md font-bold">
                          Dengarkan Suasana Lalove &amp; Ganda
                        </span>
                        <span className="text-body-sm text-on-tertiary-fixed-variant">
                          {isPlayingAudio
                            ? "Sedang memutar audio instrumen tradisi Kaili..."
                            : "Gamelan tiup bambu & kendang sakral adat"}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px]">
                      {isPlayingAudio ? "pause" : "play_arrow"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Cultural Authority Validation */}
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    verified
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Otoritas Validasi Adat
                  </span>
                  <span className="text-label-md text-on-surface font-bold">
                    Diverifikasi oleh Dewan Kesenian Palu &amp; Lembaga Adat
                    Kaili
                  </span>
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: 3-Step Interactive Decision Panel */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Step 1: Speech Selection */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col gap-4 relative overflow-hidden border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-label-md font-bold">
                      1
                    </span>
                    <div className="flex flex-col">
                      <span className="text-label-sm text-secondary uppercase font-bold tracking-wider">
                        Tahap 1 • Sapaan Adat
                      </span>
                      <span className="text-title-md text-on-surface font-bold">
                        Diplomasi Tutur Saat Tiba
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Selesai
                  </span>
                </div>

                <p className="text-body-md text-on-surface-variant">
                  Saat melangkah masuk ke rumah adat dan menyapa para tetua adat
                  di muka serambi:
                </p>

                <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 shadow-[0_3px_0_0_#ca4a28] border border-outline-variant/20">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
                        title="Dengarkan Pelafalan Asli"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          volume_up
                        </span>
                      </button>
                      <div className="flex flex-col">
                        <span className="text-headline-md text-primary tracking-tight font-bold">
                          &ldquo;Tabe pue, nalompa mai kami&rdquo;
                        </span>
                        <span className="text-body-sm text-on-surface-variant italic mt-0.5">
                          (Hormat kami para tetua adat, kami datang menghadap
                          dengan niat tulus &amp; damai)
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-label-sm font-bold shrink-0">
                      Pilihan Santun Tertinggi ✓
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center gap-2 text-on-surface mt-1 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      auto_awesome
                    </span>
                    <span className="text-body-sm">
                      <strong>Konteks Ledo:</strong> Kata{" "}
                      <em>&ldquo;Tabe&rdquo;</em> adalah gestur kerendahan hati
                      tertinggi kepada <em>Pue</em> (tokoh adat/penjaga
                      kehormatan rumah).
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Attire Synchronization */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col gap-4 relative overflow-hidden border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-label-md font-bold">
                      2
                    </span>
                    <div className="flex flex-col">
                      <span className="text-label-sm text-secondary uppercase font-bold tracking-wider">
                        Tahap 2 • Tata Busana
                      </span>
                      <span className="text-title-md text-on-surface font-bold">
                        Pilihan Busana Tamu Kehormatan
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Selesai
                  </span>
                </div>

                <p className="text-body-md text-on-surface-variant">
                  Pilihan busana resmi untuk acara adat perkawinan keluarga
                  terpandang Kaili:
                </p>

                <div className="bg-surface-container-low p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-[0_3px_0_0_#ca4a28] border border-outline-variant/20">
                  <div className="w-full md:w-36 h-36 rounded-xl overflow-hidden shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Baju Nggembe & Buya Sabe Resmi"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGGe6e5vP1nGlX2ZvT-UWV9U5KAgLs72Sx27pc9mWuqPe01VmMKmx0DY8XbKA_r787_92pwgfiNumLz4-iEx6Nq6vvyfNc4N2LM7ruBRvLAOih6SWFuROZCbgCyVmTQAuyl2CMFa2elMsDv2JbxdEeaCSXjUqCi9G3Wj0aeNXHmvef-hwkOzESw41KdPVLaaSgxbbKPPlqGPfNa2_DJN29ozR1Xvy4rPWtQLsRBJj8QzLNr5yBMJcbaQ"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-title-md text-on-surface font-bold leading-snug">
                      Baju Nggembe Merah Terakota + Sarung Tenun Donggala (Buya
                      Sabe)
                    </h3>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-body-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        shield_with_heart
                      </span>
                      <span>
                        Aksesoris: <strong>Sampa (Kalung Dada) Kuningan Resmi</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface text-label-sm font-semibold">
                        Donggala Weave
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface text-label-sm font-semibold">
                        Sampa Brass
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
                        Resmi &amp; Beradab
                      </span>
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-bold">
                        Sesuai Kaidah Adat (Benar ✓)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Synthesis */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col gap-4 relative overflow-hidden border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary text-label-md font-bold">
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="text-label-sm text-tertiary uppercase font-bold tracking-wider">
                        Tahap 3 • Sintesis Filosofi
                      </span>
                      <span className="text-title-md text-on-surface font-bold">
                        Mengapa Kombinasi Ini Tepat?
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">
                      psychology
                    </span>
                    Refleksi Budaya
                  </span>
                </div>

                <div className="bg-surface-container p-5 rounded-xl flex flex-col gap-3 border border-outline-variant/20">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px] shrink-0">
                      format_quote
                    </span>
                    <p className="text-body-lg text-on-surface leading-relaxed">
                      Kata <strong>&ldquo;Tabe&rdquo;</strong> membuka adab luhur
                      dengan merendahkan hati, sementara{" "}
                      <strong>Baju Nggembe terakota</strong> menyiratkan martabat
                      keluarga tamu undangan tanpa mengaburkan keagungan mempelai
                      utama yang mengenakan busana keemasan bertingkat.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-on-surface-variant text-body-sm flex-wrap gap-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">
                        workspace_premium
                      </span>
                      Nilai Kearifan:{" "}
                      <em>Katura (Keseimbangan Penghormatan Sosial)</em>
                    </span>
                    <span className="text-tertiary text-label-md font-bold">
                      Skor Pemahaman: 10/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Scenario Completion Summary & Claim Bar */}
              <div className="bg-surface-container-highest p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/30">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[32px]">
                      military_tech
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-headline-sm text-on-surface font-extrabold">
                        Skenario Sempurna!
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-label-sm font-bold">
                        100% Harmoni
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-body-sm flex-wrap">
                      <span className="inline-flex items-center gap-1 text-label-md text-secondary font-bold">
                        <span className="material-symbols-outlined text-sm">
                          bolt
                        </span>
                        +50 XP Kemahiran
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-label-md text-tertiary font-bold">
                        <span className="material-symbols-outlined text-sm">
                          verified
                        </span>
                        Cap Paspor Adat &ldquo;Lembah Palu&rdquo;
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full md:w-auto px-8 py-3.5 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow-[0_4px_0_0_#881f00] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#881f00] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {isClaiming ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        refresh
                      </span>
                      <span>Menyimpan ke Paspor...</span>
                    </>
                  ) : (
                    <>
                      <span>Klaim Hadiah &amp; Simpan ke Paspor</span>
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
