"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";

export default function PerayaanSelesaiPage() {
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudio = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 4000);
    }
  };

  return (
    <>
      <TopBar
        title="Pelajaran Selesai!"
        subtitle="Prestasi Pembelajaran Adat Hari Ini"
      />
      <main className="relative pt-20 px-4 lg:px-8 w-full min-h-screen overflow-hidden">
        <div className="relative w-full max-w-5xl mx-auto py-8">
          {/* Ambient Glows */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 sm:w-56 md:w-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute top-1/3 -right-8 w-24 h-24 sm:w-48 md:w-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div className="relative bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden p-6 lg:p-10 border border-outline-variant/30">
            {/* Hero Celebration Banner */}
            <div className="relative z-10 w-full rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-high/60 p-6 lg:p-10 overflow-hidden text-center flex flex-col items-center border border-outline-variant/20">
              <div className="inline-flex max-w-full items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-surface-container-lowest shadow-xs mb-4">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  verified
                </span>
                <span className="text-label-sm sm:text-label-md text-secondary uppercase tracking-widest font-bold text-center">
                  Pelajaran Tuntas • Bab 2: Sapaan Sehari-hari (Tabe)
                </span>
              </div>

              {/* Medal / Trophy Icon */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-secondary-container to-secondary-fixed flex items-center justify-center shadow-lg relative z-10 ring-4 ring-secondary-fixed-dim">
                  <span className="material-symbols-outlined text-surface-container-lowest text-[46px] sm:text-[54px]">
                    military_tech
                  </span>
                </div>
                <div className="absolute -top-2 -right-3 bg-surface-container-lowest rounded-full p-1 sm:p-2 shadow-md float-lift">
                  <span className="material-symbols-outlined text-secondary-container text-[18px] sm:text-[20px] leading-none">
                    auto_awesome
                  </span>
                </div>
                <div className="absolute -bottom-1 -left-3 bg-surface-container-lowest rounded-full p-2 shadow-md">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    local_fire_department
                  </span>
                </div>
              </div>

              <h1 className="text-3xl leading-9 sm:text-[36px] sm:leading-11 text-on-surface font-extrabold tracking-tight mt-2">
                Luar Biasa, Rani!
              </h1>
              <p className="text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
                Kamu telah menyelesaikan{" "}
                <strong className="text-on-surface">
                  Pelajaran 3: Sapaan Sehari-hari (Tabe)
                </strong>
                . Kosa kata dan adab tutur Kaili kini semakin melekat dalam
                keseharianmu!
              </p>

              <div className="flex max-w-full flex-wrap items-center justify-center gap-2 px-3 sm:px-4 py-1.5 mt-4 rounded-full bg-surface-container shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-sm">
                    temple_buddhist
                  </span>
                  <span className="text-label-sm text-primary font-bold">
                    Suku Kaili, Sulawesi Tengah
                  </span>
                </div>
                <span className="text-outline-variant font-label-sm">•</span>
                <span className="text-label-sm text-on-surface-variant">
                  Kosa Kata Baru:{" "}
                  <strong className="text-on-surface">Tabe, Ngge, Pue</strong>
                </span>
              </div>
            </div>

            {/* 3 Metric Cards Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              {/* Card 1: XP */}
              <div className="relative bg-surface-container-low rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between text-center transition-transform hover:-translate-y-1 duration-200 border border-outline-variant/20">
                <div className="w-full flex items-center justify-between">
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                    Kemahiran Bahasa
                  </span>
                  <span className="material-symbols-outlined text-secondary-container text-[20px]">
                    stars
                  </span>
                </div>
                <div className="my-4 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed rounded-full shadow-xs">
                    <span className="material-symbols-outlined text-secondary-container text-xl">
                      add
                    </span>
                    <span className="text-headline-md sm:text-headline-lg font-extrabold">20 XP</span>
                  </div>
                  <span className="text-headline-sm text-on-surface font-bold mt-2">
                    Skor Kemahiran Bahasa
                  </span>
                </div>
                <div className="w-full bg-surface-container-lowest/80 rounded-xl p-2.5">
                  <span className="text-body-sm text-on-surface-variant">
                    Total XP terkumpul:
                  </span>
                  <span className="text-label-lg text-primary font-extrabold ml-1">
                    500 XP
                  </span>
                </div>
              </div>

              {/* Card 2: Streak */}
              <div className="relative bg-surface-container-low rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between text-center transition-transform hover:-translate-y-1 duration-200 border border-outline-variant/20">
                <div className="w-full flex items-center justify-between">
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                    Ritme Harian
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    local_fire_department
                  </span>
                </div>
                <div className="my-4 flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-headline-md sm:text-headline-lg text-primary font-extrabold">
                      7 Hari Beruntun!
                    </span>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Konsistensi luar biasa! Api belajarmu kian membara di Palu.
                  </p>
                </div>
                <div className="w-full bg-surface-container-lowest/80 rounded-xl p-2.5">
                  <div className="flex items-center justify-between px-1">
                    {["S", "S", "R", "K", "J", "S", "M"].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span
                          className={`text-label-sm ${
                            idx === 6
                              ? "text-primary font-bold"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {day}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            idx === 6
                              ? "bg-primary text-on-primary shadow-xs"
                              : "bg-primary-container text-on-primary-container"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            local_fire_department
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Paspor Budaya Progress */}
              <div className="relative bg-surface-container-low rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between text-center transition-transform hover:-translate-y-1 duration-200 border border-outline-variant/20">
                <div className="w-full flex items-center justify-between">
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                    Paspor Budaya
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-[20px]">
                    verified_user
                  </span>
                </div>
                <div className="my-4 flex flex-col items-center w-full">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full mb-1">
                    <span className="material-symbols-outlined text-sm">
                      history_edu
                    </span>
                    <span className="text-label-sm font-bold">
                      Cap Adab &amp; Nilai
                    </span>
                  </div>
                  <span className="text-title-md text-on-surface font-bold leading-tight">
                    Sapaan &amp; Adab Sopan Santun (Tabe)
                  </span>
                  <span className="text-label-sm text-secondary font-bold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>{" "}
                    Terverifikasi
                  </span>
                </div>
                <div className="w-full bg-surface-container-lowest/80 rounded-xl p-2.5 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-label-sm text-on-surface-variant truncate">
                      Gelar Penjelajah Budaya Kaili
                    </span>
                    <span className="text-label-sm text-primary font-extrabold">
                      +5% (70%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary-container h-full rounded-full transition-all duration-1000"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Replay Bar */}
            <div className="w-full p-4 rounded-2xl bg-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    {isPlayingAudio ? "graphic_eq" : "volume_up"}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-title-md text-on-surface font-bold">
                      Dengarkan Ulang Pelafalan Sakral:
                    </span>
                    <span className="text-title-md text-primary font-bold italic">
                      &ldquo;Tabe pue, nalompa mai kami&rdquo;
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant text-body-sm mt-0.5">
                    <span className="material-symbols-outlined text-sm">
                      record_voice_over
                    </span>
                    <span>
                      Penutur Asli: Tetua Adat Banawa • Dialek Kaili Ledo
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAudio}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface font-label-lg rounded-xl shadow-xs hover:bg-surface-container-low transition-all cursor-pointer font-bold whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">
                  {isPlayingAudio ? "pause" : "play_arrow"}
                </span>
                <span>
                  {isPlayingAudio ? "Memutar... (0:02)" : "Putar Audio (0:04)"}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-label-lg text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors text-center cursor-pointer font-bold"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/dashboard/belajar"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-label-lg bg-primary text-on-primary shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all cursor-pointer font-bold"
              >
                <span>Lanjut Pelajaran Berikutnya</span>
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Bottom info */}
            <div className="mt-8 pt-4 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-label-sm flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  menu_book
                </span>
                <span>Modul 2 dari 8 • Kebudayaan Lembah Palu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary-container">
                    workspace_premium
                  </span>
                  Lencana &ldquo;Penyapa Kaili&rdquo; Tersemat
                </span>
                <span>•</span>
                <span>Laras Nusantara ID: LR-KL-2024</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
