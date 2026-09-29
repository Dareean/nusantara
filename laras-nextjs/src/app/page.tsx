"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSpeech, setSelectedSpeech] = useState<"A" | "B">("A");

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="LARAS Brand"
              className="h-9 w-auto object-contain"
              src="/logo/logo_laras.png"
            />
            <div className="flex flex-col">
              <span className="text-headline-sm text-primary font-extrabold tracking-tight leading-none">
                LARAS
              </span>
              <span className="text-label-sm text-secondary tracking-wider uppercase mt-0.5">
                NUSANTARA — BEFORE IT&apos;S GONE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-primary font-bold transition-colors"
            >
              Beranda
            </Link>
            <a
              href="#fitur"
              className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Fitur
            </a>
            <a
              href="#culture-connection"
              className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Budaya Kaili
            </a>
            <Link
              href="/dashboard/paspor"
              className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Paspor Budaya
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="hidden sm:inline-flex text-label-lg text-on-surface hover:text-primary transition-colors font-semibold"
            >
              Masuk
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-on-primary font-label-lg rounded-full shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all"
            >
              Mulai Belajar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
        {/* Top Decorative Ambient Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-20 -left-20 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* 1. HERO SECTION */}
          <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & Conversions */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-4 z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed shadow-xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary float-lift"></span>
                  <span className="text-label-md tracking-wider uppercase font-bold">
                    Inisiatif Pelestarian Nusantara • Pilot Sulawesi Tengah
                  </span>
                </div>

                <h1 className="text-display-lg text-on-surface text-balance font-extrabold">
                  Belajar Bahasanya. <br />
                  <span className="text-primary font-extrabold relative inline-block">
                    Kenali Busana Adatnya.
                    <svg
                      className="absolute left-0 -bottom-2 w-full h-3 text-primary/30"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 200 12"
                    >
                      <path
                        d="M2 9.5C50 2.5 150 2 198 9.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="4"
                      ></path>
                    </svg>
                  </span>
                </h1>

                <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Ubah wawasan budaya pasif menjadi kebiasaan interaktif 5 menit
                  sehari. Pelajari bahasa daerah Kaili dan keanggunan busana adat
                  secara terpadu melalui gamifikasi modern berstandar
                  etnolinguistik.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-on-primary font-label-lg rounded-full shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all cursor-pointer"
                  >
                    <span>Coba Demo Sekarang (Gratis)</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/paspor"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-surface-container-lowest text-on-surface font-label-lg rounded-full shadow-xs hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/30"
                  >
                    <span>Lihat Paspor Budaya</span>
                    <span className="material-symbols-outlined text-[18px]">
                      east
                    </span>
                  </Link>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-on-surface-variant text-label-md">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      check_circle
                    </span>
                    <span>Tanpa Iklan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      verified
                    </span>
                    <span>Terverifikasi Lembaga Adat Kaili</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      auto_stories
                    </span>
                    <span>Berbasis Riset Kebudayaan</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Dual Visual Card Experience */}
              <div className="lg:col-span-5 relative flex justify-center mt-8 lg:mt-0">
                <div className="absolute inset-0 bg-primary-fixed/30 rounded-3xl -rotate-2 transform scale-105 pointer-events-none"></div>

                <div className="relative w-full max-w-md space-y-4">
                  {/* Floating Gamification Badges */}
                  <div className="absolute -top-4 -left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-secondary-fixed rounded-full shadow-md float-lift">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      local_fire_department
                    </span>
                    <span className="text-label-md text-on-secondary-fixed font-bold">
                      6-Day Streak!
                    </span>
                  </div>
                  <div className="absolute -top-5 -right-3 z-30 flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary-container text-on-secondary-container rounded-full shadow-md">
                    <span className="material-symbols-outlined text-[18px]">
                      stars
                    </span>
                    <span className="text-label-md font-bold">+15 XP Didapat</span>
                  </div>

                  {/* Card 1: Vernacular Lesson Node ("Tabe") */}
                  <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-lg relative z-20 border border-outline-variant/20">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-label-sm tracking-widest uppercase text-primary font-bold">
                        Kosakata Hari Ini • Kaili Ledo
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                        Level 1 • Adab
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between bg-surface-container-low p-4 rounded-xl">
                      <div>
                        <div className="text-headline-lg text-primary font-black tracking-tight">
                          &ldquo;Tabe&rdquo;
                        </div>
                        <div className="text-body-sm text-on-surface-variant italic">
                          Permisi / Maaf / Menghormati yang Lebih Tua
                        </div>
                      </div>

                      <button
                        onClick={handlePlayAudio}
                        aria-label="Putar audio pengucapan Tabe"
                        className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_3px_0_0_#881f00] active:translate-y-0.5 hover:bg-primary-container transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          {isPlayingAudio ? "graphic_eq" : "volume_up"}
                        </span>
                      </button>
                    </div>

                    {/* Phonetic Waveform */}
                    <div className="mt-3 flex items-center gap-2 h-6 px-1">
                      <span className="text-label-sm text-on-surface-variant w-16">
                        Pelafalan:
                      </span>
                      <div className="flex-1 flex items-center gap-1.5 h-4">
                        <span className={`w-1.5 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6 float-lift" : "h-3"}`}></span>
                        <span className={`w-1.5 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-8" : "h-5"}`}></span>
                        <span className={`w-1.5 bg-secondary rounded-full transition-all ${isPlayingAudio ? "h-4" : "h-2"}`}></span>
                        <span className={`w-1.5 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-7 float-lift" : "h-6"}`}></span>
                        <span className={`w-1.5 bg-tertiary rounded-full transition-all ${isPlayingAudio ? "h-5" : "h-4"}`}></span>
                        <span className={`w-1.5 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-3" : "h-2"}`}></span>
                      </div>
                      <span className="text-label-sm text-secondary font-semibold">
                        Aksentuasi Lembut
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Traditional Attire Interactive Specimen */}
                  <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-lg relative z-10 -mt-2 border border-outline-variant/20">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-label-sm tracking-widest uppercase text-secondary font-bold">
                        Busana Adat • Anatomi Simbolis
                      </span>
                      <span className="text-label-sm text-primary flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[16px]">
                          touch_app
                        </span>{" "}
                        Interaktif
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden mt-2 group">
                      <img
                        className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        alt="Baju Nggembe & Tenun Donggala"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0wc12lfraVntrLpXtAiP6XWN1UTQV5CVYi55kxAFliAY8yxQWB3VoAk9oSJvYT4ZBWhf7FW0IPkAm28sucnsOJO_PZ2WiOtvSs9yA4_Ddiy_ezlmzUZXfhi_5ljoIfYgTjasTZ_59K-LrcLLCIyInouL3Cpb4GI0zgY2qWzSJ-bMIpS1iUVa-bN1nmi2XO8AT_U8yxkLNUtgJx2cGAnhAGvhLdbfr69_SS-Z3y2ND4y7CtYGJOS0TTA"
                      />
                      {/* Interactive Pin 1 */}
                      <button className="absolute top-8 left-1/3 transform -translate-x-1/2 w-7 h-7 bg-primary text-on-primary rounded-full shadow-md flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform">
                        1
                      </button>
                      {/* Interactive Pin 2 */}
                      <button className="absolute bottom-6 right-1/4 transform translate-x-1/2 w-7 h-7 bg-secondary text-on-secondary rounded-full shadow-md flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform">
                        2
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/60 to-transparent text-inverse-on-surface">
                        <div className="text-headline-sm font-bold">
                          Baju Nggembe &amp; Sarung Buya Sabe
                        </div>
                        <div className="text-body-sm text-surface-container-high">
                          Simbol keluhuran budi, kesopanan, dan status perempuan
                          Kaili.
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          palette
                        </span>
                        <span className="text-label-md text-on-surface">
                          Tenun Donggala: Corak Subolang
                        </span>
                      </div>
                      <span className="text-label-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">
                        Koleksi Terbuka
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 2. VALUE PILLARS SECTION */}
        <section id="fitur" className="w-full bg-surface-container-lowest py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed mb-3">
                <span className="material-symbols-outlined text-[16px]">
                  psychology
                </span>
                <span className="text-label-md tracking-wider uppercase font-bold">
                  Metode Belajar Terintegrasi
                </span>
              </div>
              <h2 className="text-headline-lg md:text-display-lg text-on-surface font-extrabold">
                Mengapa Belajar Budaya dengan LARAS?
              </h2>
              <p className="text-body-lg text-on-surface-variant mt-3">
                Menjembatani nilai leluhur Nusantara dengan pendekatan gamifikasi
                generasi masa kini. Tanpa hafalan kaku, penuh rasa ingin tahu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-surface-container-low rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md mb-4">
                    <span className="material-symbols-outlined text-[32px]">
                      bolt
                    </span>
                  </div>
                  <div className="text-label-sm text-primary font-bold uppercase tracking-wider mb-1">
                    Ritmenya Ringan
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-2 font-bold">
                    Pembelajaran Mikro Harian
                  </h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Cukup 3–5 menit per hari. Gamifikasi streak, tantangan cepat,
                    dan XP yang menjaga semangat belajar tetap menyala di sela
                    kesibukan Anda.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-surface-container-lowest p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-on-surface mb-2">
                    <span>Target Harian</span>
                    <span className="text-primary font-bold">15/15 Menit • 100%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-full"></div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-center">
                    <div>
                      <span className="block text-[10px] text-on-surface-variant">SEN</span>
                      <span className="font-bold text-xs text-primary">✓</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-on-surface-variant">SEL</span>
                      <span className="font-bold text-xs text-primary">✓</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-on-surface-variant">RAB</span>
                      <span className="font-bold text-xs text-primary">✓</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-on-surface-variant">KAM</span>
                      <span className="font-bold text-xs text-primary">✓</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-on-surface-variant">JUM</span>
                      <span className="font-bold text-xs text-secondary">•</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-surface-container-low rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-md mb-4">
                    <span className="material-symbols-outlined text-[32px]">
                      apparel
                    </span>
                  </div>
                  <div className="text-label-sm text-secondary font-bold uppercase tracking-wider mb-1">
                    Eksplorasi Kontekstual
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-2 font-bold">
                    Busana &amp; Makna Filosofis
                  </h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Bukan sekadar foto pajangan museum. Kenali anatomi, fungsi
                    sosial, dan filosofi pakaian adat langsung dari kurasi sumber
                    terpercaya.
                  </p>
                </div>
                <div className="mt-6 relative rounded-xl overflow-hidden shadow-xs">
                  <img
                    className="w-full h-28 object-cover"
                    alt="Donggala Loom Artisan"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9T0I_cvvSWyOYK9WzJTAjZ_iTXsFnjLaxnGSJcD_TWMsDolxShp1vgLdxryx2gE-m-eNiInfXz0wdJRsL9lEfQnyz9M0k2kOcd2LXY5Nsk6xdYUbPKdlVckdgs12aJ9knJGOa0FYBfN_gjd4muAMybmjq--qzKmyVtpGJr5Gob3HOtG_8yRnwn6cbAMZ4ChmLpLySPAuEMayL6FvbU5aiVeKkuj59FfwJC8yZZMl7htg1zC-Gw1KLmw"
                  />
                  <div className="p-3 bg-surface-container-lowest flex items-center justify-between">
                    <span className="text-label-md text-on-surface font-semibold">
                      Filosofi Sambolo (Destar Adat)
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">
                      Kearifan
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-surface-container-low rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-md mb-4">
                    <span className="material-symbols-outlined text-[32px]">
                      badge
                    </span>
                  </div>
                  <div className="text-label-sm text-tertiary font-bold uppercase tracking-wider mb-1">
                    Pengakuan Kredibel
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-2 font-bold">
                    Paspor Budaya Pribadi
                  </h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Portofolio digital pencapaian budaya Anda. Raih lencana
                    kehormatan terverifikasi untuk setiap bahasa dan busana yang
                    dikuasai secara presisi.
                  </p>
                </div>
                <div className="mt-6 bg-surface-container-lowest p-4 rounded-xl shadow-xs flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-on-primary text-headline-sm shadow-md">
                    🏛️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-label-lg text-on-surface font-bold truncate">
                      Penutur Kaili Pratama
                    </div>
                    <div className="text-body-sm text-on-surface-variant">
                      Lencana Etnolinguistik #0421
                    </div>
                    <span className="inline-block mt-1 text-[11px] font-bold text-tertiary">
                      Terverifikasi Dewan Kesenian
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SIGNATURE DIFFERENTIATOR BANNER: CULTURE CONNECTION */}
        <section
          id="culture-connection"
          className="max-w-7xl mx-auto px-6 py-20 w-full"
        >
          <div className="relative bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-outline-variant/30">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary text-label-md font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">
                    hub
                  </span>
                  <span>FITUR EKSKLUSIF LARAS</span>
                </div>
                <h2 className="text-headline-lg md:text-display-lg text-on-surface font-extrabold leading-tight">
                  Culture Connection: <br />
                  <span className="text-primary">
                    Skenario Terpadu Bahasa &amp; Busana
                  </span>
                </h2>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  Bahasa dan busana adat tidak pernah berdiri sendiri dalam
                  peradaban Nusantara. Di LARAS, Anda mempraktikkan tata krama
                  bertutur (etika bahasa) berpadu serasi dengan tata busana yang
                  sesuai dengan suasana adat aslinya.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="text-body-md text-on-surface">
                      <strong>Simulasi Peristiwa Kontekstual:</strong> Simulasi
                      prosesi adat di Souraja (Rumah Besar Kaili) hingga upacara
                      pernikahan Palu.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="text-body-md text-on-surface">
                      <strong>Skor Harmoni Budaya Real-time:</strong> Pelajari
                      apakah pilihan tutur kata selaras dengan busana dan derajat
                      keakraban lawan bicara.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/dashboard/culture-connection"
                    className="inline-flex items-center gap-1 text-label-lg text-primary hover:text-primary-container font-bold transition-colors"
                  >
                    <span>Eksplorasi Skenario Souraja Kaili</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_right_alt
                    </span>
                  </Link>
                </div>
              </div>

              {/* Simulation Interactive Card */}
              <div className="lg:col-span-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-2xl relative border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[28px]">
                        temple_buddhist
                      </span>
                      <div>
                        <h4 className="text-title-md text-on-surface font-bold">
                          Simulasi: Menghadiri Upacara Adat di Souraja
                        </h4>
                        <span className="text-xs text-on-surface-variant">
                          Lembah Palu • Tingkat Lanjut
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-label-sm text-on-surface-variant uppercase font-semibold">
                        Harmoni Budaya
                      </span>
                      <span className="text-headline-sm text-primary font-black">
                        {selectedSpeech === "A" ? "100% Sempurna" : "65% Kurang Selaras"}
                      </span>
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div className="mt-4 space-y-2">
                    <span className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
                      Langkah 1: Sapaan pada Tetua Adat
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setSelectedSpeech("A")}
                        className={`w-full text-left p-3 rounded-xl flex items-center justify-between font-label-md cursor-pointer transition-all ${
                          selectedSpeech === "A"
                            ? "bg-primary-fixed text-on-primary-fixed font-bold ring-2 ring-primary"
                            : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                            A
                          </span>
                          <span>
                            &ldquo;Tabe puang, mamposi komi...&rdquo; (Sangat Sopan &amp; Santun)
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          check_circle
                        </span>
                      </button>

                      <button
                        onClick={() => setSelectedSpeech("B")}
                        className={`w-full text-left p-3 rounded-xl flex items-center justify-between font-body-sm cursor-pointer transition-all ${
                          selectedSpeech === "B"
                            ? "bg-primary-fixed/60 text-on-primary-fixed font-bold ring-2 ring-primary"
                            : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-xs font-bold">
                            B
                          </span>
                          <span>
                            &ldquo;Naku ria hau...&rdquo; (Informal / Sesama Teman Sebaya)
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant italic">
                          Kurang Pas
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="mt-4 space-y-2">
                    <span className="text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
                      Langkah 2: Kelengkapan Busana
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-lg object-cover"
                          alt="Baju Koje"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9aoZnW928FC3A8yJo9zsATQN-kskOLhgpsgF5gFBCiitKLY1OVmvtyCR96LyPUQ2G4RK60U_nJofvrBLPB8XGzlupoxFx8hpc58wCfZkziGj-ORiLSEomW6RHzky_4U47HdEdmdi8YUZZec1qBKgl78gI0SupZ0UeW00UtEWsuZwnSiWCe-OaFObYAJsrjHKjoHTnSh4RMccx_NjZ-elohrictvePbw-SKaVxXo-uEwFGHcRGF8gjyw"
                        />
                        <div className="min-w-0">
                          <div className="text-label-md text-on-surface font-bold truncate">
                            Baju Koje &amp; Puruka
                          </div>
                          <div className="text-[11px] text-primary font-bold">
                            Pakaian Resmi Pria Kaili
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-lg object-cover"
                          alt="Sambolo"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpczz6sCaPVJXEzlLQJCDJCnnCFPOyycA0Oyfj_oFAEjdzDFLkapQdLfk6kBTWFl_v_j9982WTA9X7i3udlC5fbIek2ywIXk10nV1vhsjBoG-CLIpwv2RjWYKfe0YvlTrWHfL8uxvcwg7zK38_ckdejXDKY_BJ9fXaW2V8RArT2hmNmdVY6FuXuIuoUiU0AzKzVM-cRBpF9oH4Dq8LxU7xkLL15L9jpmb2VUMJz8_ma8XnvZFl3bS3Ew"
                        />
                        <div className="min-w-0">
                          <div className="text-label-md text-on-surface font-bold truncate">
                            Sambolo (Ikat Kepala)
                          </div>
                          <div className="text-[11px] text-secondary font-bold">
                            Kelengkapan Adat Utama
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-secondary-fixed/50 flex items-center justify-between text-on-secondary-fixed">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        military_tech
                      </span>
                      <span className="text-label-sm">
                        Bonus Prestasi: <strong>Paham Tata Nilai Kaili Ledo</strong>
                      </span>
                    </div>
                    <span className="text-headline-sm font-extrabold text-secondary">
                      +30 XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SOCIAL PROOF & EXPANSION */}
        <section className="w-full bg-surface py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold mb-6">
                Dikembangkan Bersama Kurator &amp; Pemangku Adat Resmi
              </span>

              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow transition-shadow border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    local_library
                  </span>
                  <div className="text-left">
                    <div className="text-label-lg text-on-surface font-bold">
                      Balai Bahasa
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Provinsi Sulawesi Tengah
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow transition-shadow border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[28px]">
                    gavel
                  </span>
                  <div className="text-left">
                    <div className="text-label-lg text-on-surface font-bold">
                      Lembaga Adat Kaili
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Otoritas Budaya &amp; Tradisi
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow transition-shadow border border-outline-variant/20">
                  <span className="material-symbols-outlined text-tertiary text-[28px]">
                    palette
                  </span>
                  <div className="text-left">
                    <div className="text-label-lg text-on-surface font-bold">
                      Dewan Kesenian Palu
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Pelestarian Seni Rupa &amp; Tenun
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Map Banner */}
            <div className="mt-16 bg-surface-container-low rounded-3xl p-8 relative overflow-hidden border border-outline-variant/20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-label-sm uppercase tracking-widest text-primary font-bold">
                    Peta Jalan Nusantara
                  </span>
                  <h3 className="text-headline-lg text-on-surface font-extrabold">
                    Start Local. <br />
                    <span className="text-secondary font-black">
                      Build for Nusantara.
                    </span>
                  </h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Sulawesi Tengah adalah titik awal ekspedisi kebudayaan kami.
                    LARAS dirancang untuk mencakup ribuan dialek dan filosofi
                    busana dari Sabang sampai Merauke sebelum hilang tertelan
                    zaman.
                  </p>

                  <div className="flex items-center gap-6 pt-3">
                    <div>
                      <span className="block text-headline-md text-primary font-bold">
                        1/718
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Bahasa Daerah Aktif
                      </span>
                    </div>
                    <div className="w-px h-8 bg-outline-variant"></div>
                    <div>
                      <span className="block text-headline-md text-secondary font-bold">
                        120+
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Koleksi Busana Adat Terdata
                      </span>
                    </div>
                    <div className="w-px h-8 bg-outline-variant"></div>
                    <div>
                      <span className="block text-headline-md text-tertiary font-bold">
                        100%
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Akses Terbuka Generasi Muda
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div
                    className="w-full h-64 bg-cover bg-center rounded-2xl shadow-inner relative flex items-end p-4"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5EJeEUkcivhmJwcmErWdNztfJyorduAZ47wUvuD_y7dsHzHuX7hXTbU5ZY5Pi87mvGonrEZ8X_SYGBUvI4u3Nr4kXDX-CyesBgEUcWVHNPfm6LWT3yUufhgC15A3uJb1cANirLll0_zIXsLpf-LFAJsTHUOA8HWbWSzssuFH-IH8iGpf74wS8nweP2J1Oyaj8231bofBG5HOaKyZyU07dZJBLQRbw_BNVO5oIpg0sO9XvFD9z0d2zbw')`,
                    }}
                  >
                    <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
                        <span className="text-label-md text-on-surface font-semibold">
                          Pusat Budaya: Kota Palu &amp; Donggala (Kaili Ledo, Tara, Rai)
                        </span>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        Zona Aktif Pilot
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Launch CTA */}
            <div className="mt-16 bg-primary text-on-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="space-y-1 z-10 text-center md:text-left">
                <h4 className="text-headline-lg font-bold">
                  Siap Menjaga Warisan Nusantara Tetap Hidup?
                </h4>
                <p className="text-body-md text-primary-fixed">
                  Ambil peran Anda hari ini. Mulai modul bahasa Kaili pertama
                  dalam 3 menit.
                </p>
              </div>
              <Link
                href="/onboarding"
                className="z-10 inline-flex items-center gap-2 px-8 py-3.5 bg-surface text-primary font-label-lg rounded-full shadow-[0_4px_0_0_#ffdbd1] hover:bg-surface-container active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap font-bold"
              >
                <span>Buka Modul Gratis</span>
                <span className="material-symbols-outlined text-[20px]">
                  rocket_launch
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low mt-16 py-8 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-on-surface-variant text-body-sm">
          <div className="flex items-center gap-2">
            <span className="text-headline-sm text-primary font-bold">
              LARAS
            </span>
            <span>
              — Melestarikan kekayaan bahasa dan warisan budaya Nusantara
              sebelum punah.
            </span>
          </div>
          <div>
            © 2024 LARAS (Nusantara — Before It&apos;s Gone). Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
