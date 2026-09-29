"use client";

import { useState } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";

export default function JalurBelajarPage() {
  const [filter, setFilter] = useState<"semua" | "bahasa" | "busana" | "scenario">(
    "semua"
  );

  return (
    <>
      <TopBar
        title="Jalur Belajar"
        subtitle="Kurikulum Terpadu Bahasa & Budaya Kaili"
      />
      <main className="relative pt-20 px-4 lg:px-8 w-full min-h-screen overflow-x-clip">
        <div className="w-full max-w-5xl mx-auto pb-16">
          {/* Top Decorative Ambient Glow */}
          <div className="relative">
            <div className="absolute -top-10 -left-12 w-72 h-72 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-48 -right-12 w-80 h-80 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
          </div>

          {/* Section Header & Summary Card */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  auto_stories
                </span>
                <span className="text-label-md text-primary font-bold tracking-wide uppercase">
                  Kurikulum Etnolinguistik &amp; Tradisi
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-label-md">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  verified_user
                </span>
                <span>Terakreditasi Balai Bahasa Sulteng</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-display-lg text-on-surface font-extrabold tracking-tight">
                  Jalur Belajar Kebudayaan Kaili
                </h1>
                <p className="text-body-lg text-on-surface-variant mt-1 max-w-2xl">
                  Kurikulum terpadu bahasa daerah, busana tradisional, dan tata
                  krama adat Sulawesi Tengah.
                </p>
              </div>

              {/* Stats Card */}
              <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-2xl shadow-xs border border-outline-variant/30">
                <div className="flex flex-col pr-3">
                  <span className="text-label-sm text-on-surface-variant uppercase">
                    Total XP
                  </span>
                  <span className="text-headline-sm text-primary font-extrabold">
                    480 XP
                  </span>
                </div>
                <div className="w-px h-8 bg-surface-variant"></div>
                <div className="flex flex-col pl-3">
                  <span className="text-label-sm text-on-surface-variant uppercase">
                    Sertifikasi
                  </span>
                  <span className="text-headline-sm text-tertiary font-extrabold">
                    Level 3
                  </span>
                </div>
              </div>
            </div>

            {/* High Impact Progress Summary Banner */}
            <div className="relative bg-surface-container-lowest rounded-2xl p-5 lg:p-6 shadow-xs border border-outline-variant/30 overflow-hidden mt-2">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-title-md text-on-surface font-bold">
                    Bab 2 dari 6 Aktif
                  </span>
                  <span className="text-on-surface-variant text-body-sm">•</span>
                  <span className="text-label-lg text-primary font-extrabold">
                    34% Keseluruhan
                  </span>
                  <span className="text-on-surface-variant text-body-sm">•</span>
                  <span className="text-body-md text-on-surface-variant">
                    5/18 Sub-bab Bahasa
                  </span>
                  <span className="text-on-surface-variant text-body-sm">•</span>
                  <span className="text-body-md text-on-surface-variant">
                    2/6 Artefak Busana
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary float-lift"></span>
                  <span>Est. 14 Menit ke Bab 3</span>
                </div>
              </div>

              {/* Segmented Dual-Track Mastery Bar */}
              <div className="w-full bg-surface-container-high h-3.5 rounded-full overflow-hidden flex p-0.5 gap-0.5">
                <div
                  className="bg-primary rounded-full transition-all duration-700 h-full"
                  style={{ width: "24%" }}
                  title="Kemajuan Bahasa: 24%"
                ></div>
                <div
                  className="bg-tertiary-container rounded-full transition-all duration-700 h-full"
                  style={{ width: "10%" }}
                  title="Kemajuan Busana: 10%"
                ></div>
                <div className="bg-surface-variant/40 rounded-full h-full flex-1"></div>
              </div>

              <div className="flex items-center justify-between mt-2 text-label-sm text-on-surface-variant flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                    Bahasa Ledo
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>{" "}
                    Busana &amp; Filosofi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-surface-variant"></span>{" "}
                    Terkunci
                  </span>
                </div>
                <span className="font-bold text-on-surface">
                  Target Harian: 2/3 Selesai
                </span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-2">
              <button
                onClick={() => setFilter("semua")}
                className={`px-4 py-2 rounded-full text-label-md font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filter === "semua"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                Semua Modul
              </button>
              <button
                onClick={() => setFilter("bahasa")}
                className={`px-4 py-2 rounded-full text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  filter === "bahasa"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  chat
                </span>
                Bahasa Daerah
              </button>
              <button
                onClick={() => setFilter("busana")}
                className={`px-4 py-2 rounded-full text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  filter === "busana"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  checkroom
                </span>
                Busana Adat
              </button>
              <button
                onClick={() => setFilter("scenario")}
                className={`px-4 py-2 rounded-full text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  filter === "scenario"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  diamond
                </span>
                Culture Connection
              </button>
            </div>
          </div>

          {/* MAIN PROGRESSION PATH CANVAS */}
          <div className="relative flex flex-col gap-8">
            {/* Vertical Connecting Path Thread */}
            <div className="absolute left-8 lg:left-10 top-12 bottom-12 w-1 -ml-0.5 pointer-events-none hidden sm:block">
              <div className="h-[280px] w-full bg-primary-container"></div>
              <div className="h-[120px] w-full border-l-4 border-dashed border-primary"></div>
              <div className="h-full w-full border-l-4 border-dashed border-surface-variant"></div>
            </div>

            {/* CHAPTER 1: Selesai */}
            {(filter === "semua" || filter === "bahasa") && (
              <div className="relative flex items-start gap-4 sm:gap-6 group">
                <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-secondary text-[32px]">
                    workspace_premium
                  </span>
                  <span className="absolute -bottom-2 text-label-sm bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">
                    BAB 1
                  </span>
                </div>

                <div className="flex-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 shadow-xs hover:shadow-md transition-shadow border border-outline-variant/30">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-label-sm text-on-secondary-fixed font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                        SELESAI (100%)
                      </span>
                      <span className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                        3/3 Pelajaran • Dialek Ledo
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-label-md text-secondary font-extrabold bg-secondary-fixed/50 px-3 py-1 rounded-full w-fit">
                      <span className="material-symbols-outlined text-[16px]">
                        bolt
                      </span>
                      +60 XP Diperoleh
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-8">
                      <h3 className="text-headline-md text-on-surface font-bold">
                        Bab 1: Mengenal Awal Budaya Kaili
                      </h3>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        Pengantar kebudayaan Kaili, letak geografis Lembah Palu,
                        sistem kekerabatan, dan fonologi dialek Ledo-Tara.
                      </p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-label-sm">
                          ✓ Sapaan Ledo
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-label-sm">
                          ✓ Letak Souraja
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-label-sm">
                          ✓ 12 Kosa Kata Inti
                        </span>
                      </div>
                    </div>
                    <div className="lg:col-span-4 flex lg:justify-end">
                      <Link
                        href="/dashboard/latihan"
                        className="w-full lg:w-auto px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface text-label-lg font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          history
                        </span>
                        Tinjau Kembali
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 2: AKTIF (HERO INTERACTIVE CARD) */}
            {(filter === "semua" || filter === "bahasa") && (
              <div className="relative flex items-start gap-4 sm:gap-6">
                <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary-fixed">
                  <span className="material-symbols-outlined text-on-primary text-[32px] float-lift">
                    local_fire_department
                  </span>
                  <span className="absolute -bottom-2 text-label-sm bg-on-background text-surface rounded-full px-2 py-0.5 font-bold shadow-xs">
                    BAB 2
                  </span>
                </div>

                <div className="flex-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 shadow-md border-2 border-primary relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-xs">
                        <span className="material-symbols-outlined text-[16px]">
                          radar
                        </span>
                        Fokus Saat Ini
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold">
                        Pelajaran 3 dari 5
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-label-md font-extrabold">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      <span>10 Mnt Hari Ini</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-headline-lg text-on-surface font-extrabold">
                        Bab 2: Sapaan &amp; Adab Sopan Santun
                      </h3>
                      <p className="text-body-md text-on-surface-variant mt-1 max-w-2xl">
                        Ungkapan salam, tata krama bertegur sapa dengan kata
                        keramat <strong className="text-primary">&ldquo;Tabe&rdquo;</strong>,
                        penghormatan kepada tetua adat, dan etika bertamu di
                        teras Souraja.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Link
                        href="/dashboard/latihan"
                        className="w-full lg:w-auto px-6 py-3 bg-primary-container text-on-primary-container font-label-lg font-extrabold rounded-full shadow-[0_4px_0_0_#881f00] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Lanjutkan Bab 2 (+25 XP)</span>
                        <span className="material-symbols-outlined text-[20px]">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Sub-lessons */}
                  <div className="mt-6 pt-4 bg-surface-container-low/70 -mx-5 lg:-mx-6 -mb-5 lg:-mb-6 p-5 lg:p-6 rounded-b-3xl border-t border-surface-container">
                    <span className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider block mb-3">
                      Rangkaian Sub-Pelajaran:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {/* Sub 2.1 */}
                      <Link
                        href="/dashboard/latihan"
                        className="bg-surface-container-lowest p-3 rounded-xl flex md:flex-col items-center md:items-start justify-between gap-2 shadow-xs hover:scale-[1.02] transition-transform cursor-pointer border border-outline-variant/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[14px] font-bold">
                              check
                            </span>
                          </span>
                          <span className="text-label-sm text-on-surface-variant font-bold">
                            2.1
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-label-md text-on-surface font-bold leading-tight">
                            Kosakata Dasar Sapaan
                          </span>
                          <span className="text-label-sm text-secondary font-bold mt-1">
                            Selesai (+15 XP)
                          </span>
                        </div>
                      </Link>

                      {/* Sub 2.2 */}
                      <Link
                        href="/dashboard/latihan"
                        className="bg-surface-container-lowest p-3 rounded-xl flex md:flex-col items-center md:items-start justify-between gap-2 shadow-xs hover:scale-[1.02] transition-transform cursor-pointer border border-outline-variant/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[14px] font-bold">
                              check
                            </span>
                          </span>
                          <span className="text-label-sm text-on-surface-variant font-bold">
                            2.2
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-label-md text-on-surface font-bold leading-tight">
                            Menyimak &amp; Pelafalan
                          </span>
                          <span className="text-label-sm text-secondary font-bold mt-1">
                            Selesai (+15 XP)
                          </span>
                        </div>
                      </Link>

                      {/* Sub 2.3 Active */}
                      <Link
                        href="/dashboard/latihan"
                        className="bg-surface-container-lowest p-3 rounded-xl flex md:flex-col items-center md:items-start justify-between gap-2 shadow-md ring-2 ring-primary bg-primary-fixed/20 hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">
                              play_arrow
                            </span>
                          </span>
                          <span className="text-label-sm text-primary font-extrabold">
                            2.3 • AKTIF
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-label-md text-primary font-extrabold leading-tight">
                            Mengucapkan Rasa Syukur
                          </span>
                          <span className="text-label-sm text-on-primary-fixed-variant font-extrabold mt-1">
                            Mulai Sekarang 🔥
                          </span>
                        </div>
                      </Link>

                      {/* Sub 2.4 */}
                      <div className="bg-surface-container-high/60 p-3 rounded-xl flex md:flex-col items-center md:items-start justify-between gap-2 opacity-75">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">
                              lock
                            </span>
                          </span>
                          <span className="text-label-sm text-on-surface-variant font-bold">
                            2.4
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-label-md text-on-surface-variant font-bold leading-tight">
                            Percakapan Souraja
                          </span>
                          <span className="text-label-sm text-on-surface-variant mt-1">
                            Terkunci
                          </span>
                        </div>
                      </div>

                      {/* Sub 2.5 */}
                      <div className="bg-surface-container-high/60 p-3 rounded-xl flex md:flex-col items-center md:items-start justify-between gap-2 opacity-75">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">
                              lock
                            </span>
                          </span>
                          <span className="text-label-sm text-on-surface-variant font-bold">
                            2.5
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-label-md text-on-surface-variant font-bold leading-tight">
                            Uji Kontekstual
                          </span>
                          <span className="text-label-sm text-on-surface-variant mt-1">
                            Evaluasi Bab
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 3: Terkunci */}
            {(filter === "semua" || filter === "bahasa") && (
              <div className="relative flex items-start gap-4 sm:gap-6 opacity-85 hover:opacity-100 transition-opacity">
                <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-container-high flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-on-surface-variant text-[28px]">
                    lock
                  </span>
                  <span className="absolute -bottom-2 text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full font-bold">
                    BAB 3
                  </span>
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 shadow-xs border border-outline-variant/30">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          lock
                        </span>
                        TERKUNCI
                      </span>
                      <span className="text-label-sm text-on-surface-variant">
                        Modul Bahasa Ledo &amp; Agraris
                      </span>
                    </div>
                    <span className="text-label-sm text-primary font-bold">
                      Syarat: Selesaikan Bab 2
                    </span>
                  </div>
                  <h3 className="text-headline-md text-on-surface font-bold">
                    Bab 3: Kosakata Kehidupan, Ladang &amp; Alam
                  </h3>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    Istilah agraris lembah Palu, flora-fauna khas, nama-nama
                    perkakas dapur tradisional, dan istilah cuaca kearifan lokal.
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 4: Busana Adat Kaili */}
            {(filter === "semua" || filter === "busana") && (
              <div className="relative flex items-start gap-4 sm:gap-6">
                <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary-container/30 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-secondary text-[32px]">
                    checkroom
                  </span>
                  <span className="absolute -bottom-2 text-label-sm bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">
                    BAB 4
                  </span>
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 shadow-xs border border-outline-variant/30 overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-extrabold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          palette
                        </span>
                        Busana Adat &amp; Filosofi Tekstil
                      </span>
                      <span className="text-label-sm text-on-surface-variant">
                        Materi Visual &amp; Fisik
                      </span>
                    </div>
                    <span className="text-label-sm text-secondary font-bold">
                      Akses Khusus
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-8">
                      <h3 className="text-headline-md text-on-surface font-bold">
                        Bab 4: Busana Adat Kaili: Baju Nggembe &amp; Buya Sabe
                      </h3>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        Identifikasi struktur busana wanita Kaili, anatomi
                        selendang <em>Sampa</em>, perhiasan dada <em>Dali Duo</em>,
                        dan motif tenun sutra Buya Sabe khas Donggala.
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <div className="flex items-center gap-1 text-secondary text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[16px]">
                            inventory_2
                          </span>
                          Hadiah Artefak: 3D Baju Nggembe
                        </div>
                        <span className="text-on-surface-variant text-body-sm">
                          •
                        </span>
                        <span className="text-label-sm text-on-surface-variant font-bold">
                          +80 XP Paspor
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center gap-3 justify-end">
                      <div className="w-full lg:w-48 h-24 rounded-xl bg-surface-container-high overflow-hidden relative shadow-inner">
                        <img
                          className="w-full h-full object-cover opacity-80"
                          alt="Tenun Donggala"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD87Z16lCOY60G9mPlWyjvF4SILglPNxVSVNieiPs0ZVxBHFwddiGUke26EWXmcq_YUVsVEB6f9EkKO04IfqKDY8LPLkqg4HAFakzeMiYUuD8bKBboBV02vYpTLeVRIV5-VIMRZ6jVohWhkJqdiTFOHnIjNAD50p1jfOmV0IXrLDzqRElWgMDJPEDhvCtXg0z-lc_msCpPOZ_bHv1cifqcCVH17O-DAIBJK9VQWJi0_AP8D9gmLFUbrA"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 to-transparent flex items-end p-2">
                          <span className="text-on-primary text-label-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>{" "}
                            Galeri Tekstil
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/dashboard/latihan/busana"
                        className="w-full lg:w-auto px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-label-md font-bold hover:bg-secondary-container transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Eksplorasi Sekarang</span>
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 5: Terkunci */}
            {(filter === "semua" || filter === "busana") && (
              <div className="relative flex items-start gap-4 sm:gap-6 opacity-85 hover:opacity-100 transition-opacity">
                <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-container-high flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-on-surface-variant text-[28px]">
                    lock
                  </span>
                  <span className="absolute -bottom-2 text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full font-bold">
                    BAB 5
                  </span>
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 shadow-xs border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-label-sm font-bold">
                      TERKUNCI
                    </span>
                    <span className="text-label-sm text-on-surface-variant font-bold">
                      +90 XP
                    </span>
                  </div>
                  <h3 className="text-headline-md text-on-surface font-bold">
                    Bab 5: Filosofi Warna &amp; Tata Ritual Adat
                  </h3>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    Simbolisme warna ungu bangsawan, merah keberanian, kuning
                    tetua, serta etika berbusana dalam upacara perkawinan adat
                    hingga upacara duka cita Kaili.
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 6: Culture Connection Final */}
            {(filter === "semua" || filter === "scenario") && (
              <div className="relative flex items-start gap-4 sm:gap-6">
                <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-lg shadow-tertiary/25 ring-4 ring-tertiary-fixed">
                  <span className="material-symbols-outlined text-[32px]">
                    diamond
                  </span>
                  <span className="absolute -bottom-2 text-label-sm bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full font-bold">
                    FINAL
                  </span>
                </div>

                <div className="flex-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 shadow-md relative overflow-hidden border border-outline-variant/30">
                  <div className="absolute -right-16 -top-16 w-56 h-56 bg-tertiary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-extrabold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          theater_comedy
                        </span>
                        Culture Connection • Skenario Terpadu
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
                        Cap Paspor Langka
                      </span>
                    </div>
                    <span className="text-label-md text-tertiary font-extrabold">
                      Ujian Imersi Praktis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-8">
                      <h3 className="text-headline-md text-on-surface font-bold">
                        Bab 6: Simulasi Upacara Perkawinan di Souraja Palu
                      </h3>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        Uji keterampilan komprehensif Anda dalam simulasi
                        percakapan interaktif: memilih sapaan yang tepat kepada
                        tetua, membaca isyarat busana tetamu, dan mempraktikkan
                        etika adat.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">
                              mic
                            </span>
                          </span>
                          <span className="text-label-sm text-on-surface font-bold">
                            Tantangan Suara Interaktif
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[18px]">
                              military_tech
                            </span>
                          </span>
                          <span className="text-label-sm text-on-surface font-bold">
                            100 XP + Cap Souraja Emas
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex lg:justify-end">
                      <Link
                        href="/dashboard/culture-connection"
                        className="w-full lg:w-auto px-6 py-3 rounded-full bg-tertiary text-on-tertiary text-label-lg font-bold hover:bg-tertiary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Buka Studio Simulasi</span>
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FINAL TROPHY MILESTONE */}
            <div className="relative flex items-start gap-4 sm:gap-6 mt-2">
              <div className="relative z-10 shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-lg ring-4 ring-secondary-fixed-dim">
                <span className="material-symbols-outlined text-[32px]">
                  emoji_events
                </span>
              </div>

              <div className="flex-1 bg-surface-container-low rounded-3xl p-5 lg:p-6 shadow-xs border border-outline-variant/30">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-secondary-fixed-dim/40 shrink-0 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[32px]">
                        card_membership
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-headline-sm text-on-surface font-extrabold">
                          Milestone Akhir: Gelar Kehormatan &ldquo;Sahabat Budaya Kaili&rdquo;
                        </span>
                        <span className="px-2 py-0.5 bg-secondary text-on-secondary text-label-sm font-bold rounded">
                          Resmi
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-1">
                        Lengkapi seluruh bab kurikulum untuk mengunduh Sertifikat
                        Digital ber-QR Code dari Dewan Adat dan lencana fisik
                        edisi terbatas.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full lg:w-auto">
                    <div className="px-4 py-2 bg-surface-container-lowest rounded-xl flex items-center justify-center gap-2 text-secondary text-label-md font-bold border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[18px]">
                        lock_clock
                      </span>
                      Progress: 34%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Verification Pill */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-center text-on-surface-variant text-label-md bg-surface-container-lowest py-3 px-6 rounded-full shadow-xs mx-auto max-w-2xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              verified
            </span>
            <span>
              Kurikulum diverifikasi oleh{" "}
              <strong className="text-on-surface">Lembaga Adat Kaili</strong> &amp;{" "}
              <strong className="text-on-surface">
                Balai Bahasa Sulawesi Tengah
              </strong>
              .
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
