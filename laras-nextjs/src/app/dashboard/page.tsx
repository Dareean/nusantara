"use client";

import { useState } from "react";
import Link from "next/link";
import TopBar from "../components/TopBar";

export default function DashboardHome() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  return (
    <>
      <TopBar />
      <main className="relative pt-20 px-4 lg:px-8 w-full min-h-screen">
        <div className="w-full max-w-[1400px] mx-auto py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* LEFT 2/3 COLUMN: Main Flow */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Welcome Header */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm uppercase tracking-wider font-bold">
                    Lembah Palu • Ledo
                  </span>
                  <span className="text-on-surface-variant text-body-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    Pembaruan Silabus Musim Ini
                  </span>
                </div>
                <h1 className="text-headline-lg text-on-surface tracking-tight font-extrabold">
                  Tabe, Rani! <span className="inline-block float-lift">👋</span>{" "}
                  Selamat pagi dari Lembah Palu.
                </h1>
                <p className="text-body-md text-on-surface-variant max-w-2xl">
                  Lanjutkan langkahmu menjaga warisan Kaili hari ini. 1
                  pelajaran lagi menuju target harian dan mempertahankan api
                  belajarmu!
                </p>
              </div>

              {/* Main Continue Hero Card (Terracotta Dimension Arcade Card) */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container via-primary to-[#782006] text-on-primary-container p-6 lg:p-8 shadow-[0_12px_32px_-8px_rgba(168,50,17,0.35)]">
                {/* Kaili Geometric Textile Watermark */}
                <svg
                  className="absolute -right-8 -bottom-10 w-72 h-72 text-on-primary-container opacity-10 pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 100 100"
                >
                  <polygon points="50,0 100,50 50,100 0,50"></polygon>
                  <polygon
                    fill="none"
                    points="50,15 85,50 50,85 15,50"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></polygon>
                  <circle cx="50" cy="50" r="10"></circle>
                  <line
                    stroke="currentColor"
                    strokeWidth="2"
                    x1="0"
                    x2="100"
                    y1="0"
                    y2="100"
                  ></line>
                  <line
                    stroke="currentColor"
                    strokeWidth="2"
                    x1="100"
                    x2="0"
                    y1="100"
                    y2="0"
                  ></line>
                </svg>

                <div className="relative z-10 flex flex-col justify-between h-full gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 bg-on-primary-container/20 backdrop-blur-md px-3 py-1 rounded-full text-label-sm text-on-primary tracking-wide font-bold">
                      <span className="material-symbols-outlined text-sm">
                        play_circle
                      </span>
                      SEDANG BERJALAN • BAB 2: SAPAAN SEHARI-HARI
                    </span>
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-label-sm text-primary-fixed">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          timer
                        </span>{" "}
                        3-5 Menit
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-secondary-fixed">
                        <span className="material-symbols-outlined text-xs">
                          bolt
                        </span>{" "}
                        +20 XP
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 max-w-xl">
                    <h2 className="text-headline-md text-on-primary leading-tight font-extrabold">
                      Pelajaran 3/5: Mengucapkan Rasa Syukur &amp; Hormat
                      (&ldquo;Tabe&rdquo;)
                    </h2>
                    <p className="text-body-md text-primary-fixed opacity-95">
                      Pelajari artikulasi intonasi santun serta gesture
                      membungkuk adat Kaili saat menyapa tetua adat dan kerabat di
                      teras Souraja.
                    </p>
                  </div>

                  {/* Lesson Progress Bar */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex justify-between items-center text-label-sm text-on-primary/90">
                      <span>Kemajuan Bab Ini</span>
                      <span className="font-bold">3 dari 5 Selesai (60%)</span>
                    </div>
                    <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-secondary-fixed rounded-full shadow-[0_0_8px_rgba(255,221,184,0.8)]"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/dashboard/latihan"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-lowest text-primary rounded-full font-label-lg shadow-[0_4px_0_0_#ebe6f1] active:translate-y-0.5 active:shadow-[0_2px_0_0_#ebe6f1] transition-all hover:bg-surface-bright cursor-pointer font-bold"
                    >
                      <span>Lanjutkan Belajar Sekarang</span>
                      <span className="material-symbols-outlined text-title-md">
                        arrow_forward
                      </span>
                    </Link>
                    <span className="text-body-sm text-on-primary/80">
                      Terakhir dipelajari 18 jam lalu
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlights & Modules Grid (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Busana Adat */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all border border-outline-variant/30">
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt="Baju Nggembe & Tenun Donggala"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGlm4Py7anVmA35JrYc8fYf9EsjKTLQ4HjSryQY5pCeaZQLikRI9Ta2MnRixb02W4sr2y3nY9jmNI92mE4ufhhSmzDj4ajiUUDVrw7AUOi2PnESnPQSSqoXKwJ9aQXaq-BCO5J6hgawHHMQxm8ns9NWFuA7BNxL7An4568BMcDEoUvlAIkp1z-1ZWJAQCNMvun6iMuKOsf151zWddvxXGimo5KwrBq7es6CwF4FNOrDK4nVx2uXrFf7w"
                      />
                      <div className="absolute top-2 left-2 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-label-sm text-primary font-bold flex items-center gap-1 shadow-xs">
                        <span className="material-symbols-outlined text-xs text-primary">
                          checkroom
                        </span>
                        Busana Adat
                      </div>
                      <div className="absolute bottom-2 right-2 bg-inverse-surface/85 backdrop-blur-md px-2 py-0.5 rounded text-inverse-on-surface text-label-sm">
                        4 Modul Tersedia
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-label-sm text-secondary font-bold uppercase tracking-wider">
                        Sorotan Budaya Hari Ini
                      </span>
                      <h3 className="text-headline-sm text-on-surface font-bold leading-snug">
                        Mengenal Baju Nggembe &amp; Tenun Donggala
                      </h3>
                      <p className="text-body-sm text-on-surface-variant line-clamp-2">
                        Busana kebesaran putri Kaili bersiluet longgar yang
                        melambangkan keanggunan, marwah, dan adab sopan santun
                        perempuan tanah Kaili.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-surface-container mt-2">
                    <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-tertiary">
                        palette
                      </span>{" "}
                      Tenun Sutra Buya Bomba
                    </span>
                    <Link
                      href="/dashboard/latihan/busana"
                      className="inline-flex items-center gap-1 text-label-md text-primary hover:text-primary-container font-bold transition-colors cursor-pointer"
                    >
                      <span>Eksplorasi Busana</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Card 2: Quick Vocabulary Challenge */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all border border-outline-variant/30">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          translate
                        </span>
                        Bahasa Kaili Ledo
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          bolt
                        </span>{" "}
                        +10 XP
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Tantangan Kosa Kata Cepat
                        </span>
                        <button
                          onClick={handlePlayAudio}
                          className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Dengarkan pengucapan penutur asli"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isPlayingAudio ? "graphic_eq" : "volume_up"}
                          </span>
                        </button>
                      </div>

                      <p className="text-display-lg text-primary tracking-tight font-extrabold">
                        &ldquo;Nalompa Mai Kami&rdquo;
                      </p>

                      <div className="flex items-start gap-1 text-on-surface-variant pt-1">
                        <span className="material-symbols-outlined text-sm text-secondary pt-0.5">
                          format_quote
                        </span>
                        <p className="text-body-md italic text-on-surface">
                          &ldquo;Kami datang menghadap dengan niat tulus dan
                          damai.&rdquo;
                        </p>
                      </div>
                    </div>

                    <p className="text-body-sm text-on-surface-variant">
                      Ungkapan sakral saat memasuki pekarangan adat atau menyapa
                      tokoh tetua desa dalam upacara adat Balia.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-surface-container mt-2">
                    <span className="text-label-sm text-on-surface-variant">
                      Kuis Mikro 30 Detik
                    </span>
                    <Link
                      href="/dashboard/latihan"
                      className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-label-md shadow-[0_3px_0_0_#881f00] active:translate-y-0.5 active:shadow-[0_1px_0_0_#881f00] transition-all cursor-pointer font-bold"
                    >
                      Uji Hafalan
                    </Link>
                  </div>
                </div>
              </div>

              {/* "Jalur Belajar Anda" Horizontal Flow Preview */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-headline-sm">
                      timeline
                    </span>
                    <div>
                      <h3 className="text-headline-sm text-on-surface font-bold">
                        Jalur Belajar Anda
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Kurikulum Terakreditasi Balai Pelestarian Kebudayaan
                        Wilayah XVIII
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/belajar"
                    className="text-label-md text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Seluruh Jalur Belajar</span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </div>

                {/* Horizontal Stepper */}
                <div className="relative py-3 px-2 overflow-x-auto">
                  <div className="absolute top-[38px] left-8 right-8 h-1 bg-surface-variant rounded-full"></div>
                  <div className="absolute top-[38px] left-8 w-[28%] h-1 bg-primary rounded-full"></div>

                  <div className="flex items-center justify-between min-w-[580px] relative z-10">
                    {/* Step 1: Completed */}
                    <Link
                      href="/dashboard/belajar"
                      className="flex flex-col items-center text-center gap-1 w-28 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_0_0_#881f00] cursor-pointer">
                        <span className="material-symbols-outlined text-title-md font-bold">
                          check
                        </span>
                      </div>
                      <span className="text-label-sm text-on-surface font-bold">
                        Bab 1
                      </span>
                      <span className="text-body-sm text-on-surface-variant leading-tight">
                        Mengenal Awal
                      </span>
                      <span className="text-[10px] text-primary font-bold">
                        Selesai 100%
                      </span>
                    </Link>

                    {/* Step 2: Active */}
                    <Link
                      href="/dashboard/latihan"
                      className="flex flex-col items-center text-center gap-1 w-28 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center ring-4 ring-secondary-fixed shadow-[0_4px_0_0_#684000] float-lift cursor-pointer">
                        <span className="material-symbols-outlined text-headline-sm">
                          local_fire_department
                        </span>
                      </div>
                      <span className="text-label-sm text-secondary font-bold">
                        Bab 2 (Aktif)
                      </span>
                      <span className="text-body-sm text-on-surface font-bold leading-tight">
                        Sapaan &amp; Adab
                      </span>
                      <span className="text-[10px] text-secondary font-bold">
                        60% Tuntas
                      </span>
                    </Link>

                    {/* Step 3: Locked */}
                    <div className="flex flex-col items-center text-center gap-1 w-28 opacity-65">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-title-md">
                          lock
                        </span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant font-bold">
                        Bab 3
                      </span>
                      <span className="text-body-sm text-on-surface-variant leading-tight">
                        Kosa Kata Rumah
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        Terkunci
                      </span>
                    </div>

                    {/* Step 4: Locked */}
                    <div className="flex flex-col items-center text-center gap-1 w-28 opacity-65">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-title-md">
                          lock
                        </span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant font-bold">
                        Bab 4
                      </span>
                      <span className="text-body-sm text-on-surface-variant leading-tight">
                        Busana Nggembe
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        Terkunci
                      </span>
                    </div>

                    {/* Step 5: Master */}
                    <div className="flex flex-col items-center text-center gap-1 w-28 opacity-50">
                      <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-title-md">
                          stars
                        </span>
                      </div>
                      <span className="text-label-sm text-tertiary font-bold">
                        Bab 5
                      </span>
                      <span className="text-body-sm text-on-surface-variant leading-tight">
                        Ujian Penjelajah
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        Piala Adat
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arcade Quick Launch Banner */}
              <div className="bg-gradient-to-r from-secondary-container via-secondary to-[#523300] rounded-2xl p-5 text-on-secondary flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/20 flex items-center justify-center text-on-secondary text-[28px]">
                    🕹️
                  </div>
                  <div>
                    <h4 className="text-headline-sm font-bold text-white">
                      Warm Heritage Arcade
                    </h4>
                    <p className="text-body-sm text-white/90">
                      Tantangan retro mini-games untuk mengasah kosakata Kaili
                      secara seru &amp; adiktif!
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/arcade"
                  className="px-5 py-2.5 bg-surface-container-lowest text-on-surface font-label-md font-bold rounded-full shadow-md hover:bg-surface-container transition-all whitespace-nowrap cursor-pointer"
                >
                  Mainkan Arcade
                </Link>
              </div>
            </div>

            {/* RIGHT 1/3 SIDEBAR WIDGETS */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* 1. Daily Goal Widget */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-headline-sm text-on-surface font-bold">
                    Target Harian
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      local_fire_department
                    </span>
                    6 Hari Beruntun
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-surface-container-low p-3.5 rounded-xl">
                  {/* Radial Progress Ring */}
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-surface-variant"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      ></path>
                      <path
                        className="text-primary transition-all duration-500"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="50, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      ></path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-title-md text-primary font-extrabold leading-none">
                        50%
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        1/2 Bab
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-label-md text-on-surface font-bold">
                      1 Pelajaran Lagi!
                    </span>
                    <p className="text-body-sm text-on-surface-variant">
                      Selesaikan sesi ini untuk klaim bonus streak.
                    </p>
                    <div className="pt-1 flex items-center gap-1 text-label-sm text-secondary font-bold">
                      <span className="material-symbols-outlined text-xs">
                        stars
                      </span>
                      <span>+20 XP Bonus Harian</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant text-body-sm px-1">
                  <span>
                    Target: <strong>2 pelajaran / hari</strong>
                  </span>
                  <Link
                    href="/dashboard/profil"
                    className="text-primary text-label-sm font-bold hover:underline"
                  >
                    Ubah Target
                  </Link>
                </div>
              </div>

              {/* 2. Mini Paspor Budaya Snapshot */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">
                        menu_book
                      </span>
                    </div>
                    <div>
                      <h3 className="text-headline-sm text-on-surface font-bold">
                        Paspor Budaya
                      </h3>
                      <p className="text-label-sm text-on-surface-variant">
                        Sulawesi Tengah • Kaili
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary text-label-sm font-bold">
                    Lv. 3
                  </span>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center text-label-sm">
                    <span className="text-on-surface font-bold">
                      Penjelajah Adat Kaili
                    </span>
                    <span className="text-tertiary font-extrabold">
                      75% Kemahiran
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "45%" }}
                      title="Bahasa Kaili: 45%"
                    ></div>
                    <div
                      className="h-full bg-tertiary"
                      style={{ width: "30%" }}
                      title="Busana & Tradisi: 30%"
                    ></div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                      Bahasa (3/4 Bab)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>{" "}
                      Adat (3/4 Bab)
                    </span>
                  </div>
                </div>

                {/* Badges showcase */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Lencana Terbuka (3)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-high/60 gap-1 group hover:bg-surface-container-high transition-colors">
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">
                          record_voice_over
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface font-bold leading-tight">
                        Penutur Awal
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-high/60 gap-1 group hover:bg-surface-container-high transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">
                          checkroom
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface font-bold leading-tight">
                        Adat Busana
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-high/60 gap-1 group hover:bg-surface-container-high transition-colors">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">
                          fort
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface font-bold leading-tight">
                        Souraja Scout
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard/paspor"
                  className="w-full py-2 bg-surface-container-low text-primary hover:bg-surface-container text-label-md font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Buka Paspor Lengkap</span>
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </Link>
              </div>

              {/* 3. Tahukah Kamu Card */}
              <div className="bg-gradient-to-br from-surface-container-low to-surface-container rounded-2xl p-5 shadow-xs flex flex-col gap-2 border border-outline-variant/30">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[22px]">
                    lightbulb
                  </span>
                  <h4 className="text-headline-sm text-on-surface font-bold">
                    Tahukah Kamu?
                  </h4>
                </div>
                <p className="text-body-md text-on-surface leading-relaxed">
                  &ldquo;Dalam tata krama suku Kaili, kata <strong>&lsquo;Tabe&rsquo;</strong> bukan
                  sekadar berarti &lsquo;permisi&rsquo;, melainkan wujud kerendahan hati
                  terdalam dan permohonan doa restu dari penutur kepada lawan
                  bicaranya.&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-surface-variant/50">
                  <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-xs text-primary">
                      verified
                    </span>
                    <span>Balai Bahasa Sulteng • Terverifikasi</span>
                  </div>
                  <button
                    className="text-primary hover:text-primary-container p-1 cursor-pointer"
                    title="Bagikan Wawasan"
                  >
                    <span className="material-symbols-outlined text-sm">
                      share
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
