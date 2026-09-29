"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stepTitles: Record<number, string> = {
  1: "Langkah 1 dari 5 • Kenali LARAS",
  2: "Langkah 2 dari 5 • Personalisasi Belajar",
  3: "Langkah 3 dari 5 • Pilih Budaya Nusantara",
  4: "Langkah 4 dari 5 • Target Ritme Harian",
  5: "Langkah 5 dari 5 • Mulai Perjalanan",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [interest, setInterest] = useState<"bahasa" | "busana" | "keduanya">(
    "keduanya"
  );
  const [pace, setPace] = useState<"santai" | "serius" | "ambisius">("serius");

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-surface relative">
      <div className="flex flex-col w-full max-w-2xl mx-auto py-6 sm:py-10">
        {/* Top Progress Indicator */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-4 mb-6 border border-outline-variant/30">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-label-sm font-bold">
                {currentStep}
              </div>
              <span className="text-label-lg text-on-surface font-bold">
                {stepTitles[currentStep]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold shadow-xs">
                <span className="material-symbols-outlined text-[14px]">
                  bolt
                </span>
                <span>&lt; 1 Menit</span>
              </span>
            </div>
          </div>

          {/* Segmented Bar */}
          <div className="grid grid-cols-5 gap-1.5 h-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-full rounded-full transition-all duration-300 ${
                  s <= currentStep ? "bg-primary" : "bg-surface-container-highest"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 sm:p-8 overflow-hidden relative border border-outline-variant/30">
          {/* STEP 1: Welcome */}
          {currentStep === 1 && (
            <div className="flex flex-col">
              <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-6 shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt="Selamat Datang di LARAS"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkOZOv0GDEWk4IMFp792zU39KD8AYSpgq8ccW7iXA5xFmh437opfrrBhzmV4eGyuqMMYoMcFuT5E8WQy2LoKHTUNUc23QVrC1WZkV21cKjeZCShE7t-9nfRBlmoourVAgUrLEtWXOlRvYZR5kl7YNb84BGRvAVvkyQHjyqUHRKKAtnk1SVK7c3ayugUpWP_I8l07BQbqX_8aH8l82NzsLjKTm9ruqggo0N2DVRyGqyIAmgsEG71Y6vNQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent flex flex-col justify-end p-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-bold self-start mb-1 shadow-xs">
                    <span className="material-symbols-outlined text-[13px]">
                      auto_awesome
                    </span>
                    Kultur Interaktif Generasi Baru
                  </span>
                  <p className="text-headline-md text-on-primary font-bold">
                    Learn the Language. Wear the Culture.
                  </p>
                </div>
              </div>

              <div className="text-left mb-6">
                <h2 className="text-headline-lg text-on-surface tracking-tight font-extrabold mb-1">
                  Selamat Datang di <span className="text-primary font-black">LARAS</span>!
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  Kuasai bahasa daerah Nusantara beriringan dengan filosofi
                  busana adat otentik dalam modul interaktif cuma 5 menit setiap
                  hari.
                </p>
              </div>

              {/* Bento Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="bg-surface-container-low rounded-xl p-3 flex sm:flex-col items-center sm:items-start gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      record_voice_over
                    </span>
                  </div>
                  <div>
                    <p className="text-label-lg text-on-surface font-bold">
                      Audio Native
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Pelafalan otentik penutur asli
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-3 flex sm:flex-col items-center sm:items-start gap-2">
                  <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      styler
                    </span>
                  </div>
                  <div>
                    <p className="text-label-lg text-on-surface font-bold">
                      Busana &amp; Tenun
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Filosofi ornamen &amp; tata busana
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-3 flex sm:flex-col items-center sm:items-start gap-2">
                  <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      local_fire_department
                    </span>
                  </div>
                  <div>
                    <p className="text-label-lg text-on-surface font-bold">
                      Streak &amp; Level
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      Buka Paspor Budaya tiap bab
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToStep(2)}
                className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>Mulai Setup Kilat (45 Detik)</span>
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {/* STEP 2: Domain Focus */}
          {currentStep === 2 && (
            <div className="flex flex-col">
              <div className="mb-6 text-left">
                <span className="text-label-sm text-primary uppercase tracking-wider font-bold">
                  Langkah 2 / 5
                </span>
                <h2 className="text-headline-lg text-on-surface font-extrabold mt-1">
                  Apa fokus utama belajarmu?
                </h2>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Kami sesuaikan rasio latihan kosakata dan eksplorasi artefak
                  kultural di berandamu.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {/* Bahasa */}
                <div
                  onClick={() => setInterest("bahasa")}
                  className={`cursor-pointer transition-all p-4 rounded-xl flex items-center justify-between border ${
                    interest === "bahasa"
                      ? "bg-primary-fixed/30 border-primary ring-2 ring-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[26px]">
                        translate
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-title-md text-on-surface font-bold">
                        Bahasa Daerah
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Kosa kata tematik, percakapan sehari-hari, pelafalan audio
                        native.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 ${
                      interest === "bahasa"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  </div>
                </div>

                {/* Busana */}
                <div
                  onClick={() => setInterest("busana")}
                  className={`cursor-pointer transition-all p-4 rounded-xl flex items-center justify-between border ${
                    interest === "busana"
                      ? "bg-primary-fixed/30 border-primary ring-2 ring-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                      <span className="material-symbols-outlined text-[26px]">
                        checkroom
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-title-md text-on-surface font-bold">
                        Busana Adat
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Makna motif tenun, anatomi busana adat &amp; etika
                        pemakaian.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 ${
                      interest === "busana"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  </div>
                </div>

                {/* Keduanya */}
                <div
                  onClick={() => setInterest("keduanya")}
                  className={`cursor-pointer transition-all p-4 rounded-xl flex items-center justify-between border ${
                    interest === "keduanya"
                      ? "bg-primary-fixed/30 border-primary ring-2 ring-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                      <span className="material-symbols-outlined text-[26px]">
                        auto_awesome
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-title-md text-on-surface font-bold">
                          Keduanya (Culture Connection)
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-label-sm font-bold">
                          Rekomendasi Utama
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Skenario terpadu: bertutur sopan sembari memahami
                        filosofi busana.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 ${
                      interest === "keduanya"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="py-3 px-5 rounded-full bg-surface-container text-on-surface-variant font-label-lg hover:bg-surface-container-high transition-all flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="py-3 px-8 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Lanjut: Pilih Wilayah</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Region Selection */}
          {currentStep === 3 && (
            <div className="flex flex-col">
              <div className="mb-6 text-left">
                <span className="text-label-sm text-primary uppercase tracking-wider font-bold">
                  Langkah 3 / 5
                </span>
                <h2 className="text-headline-lg text-on-surface font-extrabold mt-1">
                  Pilih Budaya Daerah Perjalananmu
                </h2>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Pilih etnis awal pembelajaranmu. Kamu bebas berpindah wilayah
                  kapan saja di masa mendatang.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {/* Active: Kaili */}
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border-2 border-primary bg-gradient-to-r from-primary-fixed/20 via-surface-container-lowest to-surface-container-lowest">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-xs">
                        <img
                          className="w-full h-full object-cover"
                          alt="Suku Kaili"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvFLvRF65loMr_Vczn19v_1F3Z73sE1BylGOZ0bDTh4uBktuj2TGd3sxPbtWoGpu9k5OXH9z4CU0g9TBNAwMmLvd0mT66jSfeMjrsBP6H0PHZJqbsFaSjAwODjlu-Luey63YVKrh4BawxtIKHgL2iiP0N9CK7lbHU-R-QgIy_NVo-FvBwiHxFswYtmycPNU7WeoczfqDsa9001ySZNvNDuvDqolG7dHFLZDCB9bdOtYDRydxRWrQ6HMg"
                        />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-title-md text-on-surface font-bold">
                            Sulawesi Tengah — Suku Kaili
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
                            Tersedia • 6 Bab
                          </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">
                          Dialek Ledo &amp; Tara • Baju Nggembe &amp; Tenun Donggala
                        </p>
                        <p className="text-label-sm text-secondary font-semibold mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            verified
                          </span>
                          Terakreditasi Balai Bahasa Prov. Sulteng
                        </p>
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 self-end sm:self-center">
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                    </span>
                  </div>
                </div>

                {/* Minangkabau */}
                <div className="bg-surface-container-low opacity-60 rounded-xl p-4 flex items-center justify-between border border-outline-variant/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[24px]">
                        museum
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-title-md text-on-surface font-bold">
                          Sumatera Barat — Minangkabau
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">
                          Riset Kurikulum
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Baso Minang Halus • Suntiang &amp; Songket Pandai Sikek
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    lock
                  </span>
                </div>

                {/* Jawa Mataram */}
                <div className="bg-surface-container-low opacity-60 rounded-xl p-4 flex items-center justify-between border border-outline-variant/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[24px]">
                        temple_buddhist
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-title-md text-on-surface font-bold">
                          DI Yogyakarta — Jawa Mataram
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">
                          Riset Kurikulum
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Unggah-ungguh Basa Krama • Surjan &amp; Jarik Sidomukti
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    lock
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="py-3 px-5 rounded-full bg-surface-container text-on-surface-variant font-label-lg hover:bg-surface-container-high transition-all flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="py-3 px-8 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Lanjut: Target Harian</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pace Selection */}
          {currentStep === 4 && (
            <div className="flex flex-col">
              <div className="mb-6 text-left">
                <span className="text-label-sm text-primary uppercase tracking-wider font-bold">
                  Langkah 4 / 5
                </span>
                <h2 className="text-headline-lg text-on-surface font-extrabold mt-1">
                  Tentukan Target Harianmu
                </h2>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Kunci penguasaan bahasa daerah adalah konsistensi ritme, bukan
                  durasi maraton yang melelahkan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {/* Santai */}
                <div
                  onClick={() => setPace("santai")}
                  className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between text-left transition-all border ${
                    pace === "santai"
                      ? "bg-primary-fixed/20 border-primary ring-2 ring-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface mb-3">
                      <span className="material-symbols-outlined text-[20px]">
                        self_improvement
                      </span>
                    </div>
                    <h3 className="text-title-md text-on-surface font-bold">
                      Santai
                    </h3>
                    <p className="text-label-md text-secondary font-bold mt-0.5">
                      3 Menit / Hari
                    </p>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      1 pelajaran mikro. Cocok bagi yang sangat sibuk.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center justify-between text-on-surface-variant text-label-sm">
                    <span>+10 XP / hari</span>
                    <span
                      className={`material-symbols-outlined text-[18px] text-primary ${
                        pace === "santai" ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      check_circle
                    </span>
                  </div>
                </div>

                {/* Serius */}
                <div
                  onClick={() => setPace("serius")}
                  className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between text-left transition-all relative overflow-hidden border ${
                    pace === "serius"
                      ? "bg-primary-fixed/20 border-primary ring-2 ring-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div className="absolute -right-6 top-3 bg-primary text-on-primary text-[10px] font-bold px-7 py-0.5 rotate-45 uppercase tracking-tighter">
                    Favorit
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary mb-3">
                      <span className="material-symbols-outlined text-[20px]">
                        trending_up
                      </span>
                    </div>
                    <h3 className="text-title-md text-on-surface font-bold">
                      Serius
                    </h3>
                    <p className="text-label-md text-primary font-bold mt-0.5">
                      5 Menit / Hari
                    </p>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      2 pelajaran interaktif + 1 kuis audio santai.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center justify-between text-on-surface-variant text-label-sm">
                    <span className="text-primary font-bold">+25 XP / hari</span>
                    <span
                      className={`material-symbols-outlined text-[18px] text-primary ${
                        pace === "serius" ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      check_circle
                    </span>
                  </div>
                </div>

                {/* Ambisius */}
                <div
                  onClick={() => setPace("ambisius")}
                  className={`cursor-pointer p-4 rounded-xl flex flex-col justify-between text-left transition-all border ${
                    pace === "ambisius"
                      ? "bg-primary-fixed/20 border-primary ring-2 ring-primary"
                      : "bg-surface-container-low hover:bg-surface-container border-transparent"
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface mb-3">
                      <span className="material-symbols-outlined text-[20px]">
                        psychology
                      </span>
                    </div>
                    <h3 className="text-title-md text-on-surface font-bold">
                      Ambisius
                    </h3>
                    <p className="text-label-md text-secondary font-bold mt-0.5">
                      10 Menit / Hari
                    </p>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      4 pelajaran + ujian skenario simulasi kultural.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center justify-between text-on-surface-variant text-label-sm">
                    <span>+50 XP / hari</span>
                    <span
                      className={`material-symbols-outlined text-[18px] text-primary ${
                        pace === "ambisius" ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      check_circle
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="py-3 px-5 rounded-full bg-surface-container text-on-surface-variant font-label-lg hover:bg-surface-container-high transition-all flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(5)}
                  className="py-3 px-8 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Lanjut: Konfirmasi</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Ready to launch */}
          {currentStep === 5 && (
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-primary-fixed/40 via-surface-container-low to-secondary-fixed/30 rounded-xl p-6 mb-6 text-center relative overflow-hidden border border-outline-variant/30">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-bold mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">
                    verified_user
                  </span>
                  Profil Pembelajar Siap!
                </div>
                <h2 className="text-headline-lg text-on-surface font-extrabold tracking-tight mb-2">
                  Petualangan Kaili Menantimu!
                </h2>
                <p className="text-body-md text-on-surface-variant max-w-md mx-auto mb-4">
                  Kurikulum harianmu telah dipersonalisasi. Selesaikan
                  pelajaran pertamamu hari ini untuk menyalakan{" "}
                  <strong className="text-primary">Streak Hari ke-1</strong>!
                </p>

                <div className="bg-surface-container-lowest max-w-sm mx-auto rounded-xl p-3 flex items-center justify-between shadow-xs border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[20px]">
                        local_fire_department
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-label-lg text-on-surface font-bold">
                        Bonus Streak Day 1
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        +50 XP Selamat Datang
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-label-md font-bold">
                    Tersedia
                  </span>
                </div>
              </div>

              {/* Summary Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                <div className="bg-surface-container-low rounded-xl p-3 text-center">
                  <span className="text-label-sm text-on-surface-variant block">
                    Wilayah
                  </span>
                  <span className="text-label-lg text-primary font-bold block mt-0.5">
                    Suku Kaili
                  </span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 text-center">
                  <span className="text-label-sm text-on-surface-variant block">
                    Fokus
                  </span>
                  <span className="text-label-lg text-on-surface font-bold block mt-0.5 capitalize">
                    {interest}
                  </span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 text-center">
                  <span className="text-label-sm text-on-surface-variant block">
                    Komitmen
                  </span>
                  <span className="text-label-lg text-on-surface font-bold block mt-0.5">
                    {pace === "santai"
                      ? "3 Mnt/Hari"
                      : pace === "serius"
                      ? "5 Mnt/Hari"
                      : "10 Mnt/Hari"}
                  </span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 text-center">
                  <span className="text-label-sm text-on-surface-variant block">
                    Modul Awal
                  </span>
                  <span className="text-label-lg text-secondary font-bold block mt-0.5 truncate">
                    Bab 1: Sapaan
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/latihan")}
                  className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-base"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    play_circle
                  </span>
                  <span>Mulai Pelajaran Pertama Sekarang (Bab 1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-2.5 px-4 text-on-surface-variant hover:text-on-surface text-label-md transition-all text-center cursor-pointer font-medium"
                >
                  Lewati dan jelajahi Beranda dulu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center flex items-center justify-center gap-4 flex-wrap text-on-surface-variant text-label-sm opacity-80">
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Tanpa Registrasi Rumit
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              verified
            </span>
            Didukung Komunitas Adat Kaili
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>
            100% Gratis Akses Dasar
          </span>
        </div>
      </div>
    </main>
  );
}
