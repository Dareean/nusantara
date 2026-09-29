"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LatihanBahasaPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("A");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioPlay = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  const handleContinue = () => {
    if (!isAnswerChecked) {
      setIsAnswerChecked(true);
    } else {
      router.push("/dashboard/evaluasi");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-4 lg:px-8">
        <Link
          href="/dashboard/belajar"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        {/* Lives / Hearts */}
        <div className="flex items-center gap-1 bg-error-container/40 px-3.5 py-1 rounded-full border border-error/20">
          <span className="material-symbols-outlined text-error text-[20px] fill-current">
            favorite
          </span>
          <span className="text-label-lg text-error font-bold">3/3</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-10 flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-5xl mx-auto bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[640px] relative border border-outline-variant/30">
          {/* Sub Header */}
          <div className="px-6 py-3.5 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/belajar"
                className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-label-md uppercase tracking-wider font-semibold"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
                <span>Keluar Latihan</span>
              </Link>
              <div className="h-4 w-px bg-outline-variant"></div>
              <div className="flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-label-sm font-bold">
                <span className="material-symbols-outlined text-[16px]">
                  location_on
                </span>
                <span>Bahasa Kaili Ledo • Lembah Palu</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-surface-container-highest px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  local_fire_department
                </span>
                <span className="text-label-md text-on-surface font-bold">
                  6 Hari Streak
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-label-sm text-on-surface-variant uppercase font-medium">
                  Bab 2 : Sapaan Kaili
                </span>
                <span className="text-label-sm text-primary font-bold">
                  (Soal 3/5)
                </span>
              </div>
            </div>
          </div>

          {/* Grid: Context & Question */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
            {/* Left Context Column */}
            <div className="lg:col-span-5 p-6 lg:p-8 bg-surface-container-low/40 flex flex-col justify-between relative overflow-hidden border-r border-surface-container">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">
                      verified
                    </span>
                    Etika &amp; Tata Krama
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Kategori: Adat Ledo
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-xs flex flex-col gap-3 border border-outline-variant/20">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-display-lg font-black text-primary tracking-tight">
                        Tabe
                      </span>
                      <span className="ml-2 text-headline-sm text-on-surface-variant font-normal">
                        [ta-be]
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAudioPlay}
                      className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isPlayingAudio ? "graphic_eq" : "volume_up"}
                      </span>
                    </button>
                  </div>

                  <div className="mt-1">
                    <div className="flex items-center justify-between text-on-surface-variant text-label-sm mb-1.5 font-medium">
                      <span>Pelafalan Asli Penutur Lokal</span>
                      <span className="text-primary font-bold">0:04</span>
                    </div>
                    <div className="flex items-center gap-1.5 h-6 px-3 rounded-lg bg-surface-container">
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-5 float-lift" : "h-3"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6" : "h-4"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-3" : "h-2"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6 float-lift" : "h-5"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-4" : "h-3"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6" : "h-6"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-5" : "h-4"}`}></span>
                      <span className="w-1 h-3 rounded-full bg-outline-variant"></span>
                      <span className="w-1 h-5 rounded-full bg-outline-variant"></span>
                      <span className="w-1 h-2 rounded-full bg-outline-variant"></span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2 italic">
                      Penutur: Kak Rusdi (38 thn), Palu Barat
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Evidence */}
              <div className="mt-6 relative z-10">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-xs">
                  <img
                    className="w-full h-full object-cover"
                    alt="Gestur Tabe Kaili"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7N2RFcBe-VYBGKMVs4RI4fFK_WSAUDavo27MijrqUn0YQFka80Yn6NkLi6NvGUbK_bJsS8bxcs28vXZzzSYuCH3Ml0J8fP_QUR9cO8O6P4uj6LPVZiMDbqT-WEq9WNuQpc2RkTZjx2GyyDWs9peP4G71dL_BEyEljdiyuWO1T87OOfAPwt55ywofq5wU-uIHzArEIeZvJHOo2j8vTDtd7ZuvboUHGas1ryZWxBpc6twFUkXuBoN1i4Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex items-end p-4">
                    <p className="text-body-sm text-inverse-on-surface leading-tight">
                      Sikap tubuh merunduk dengan tangan kanan terentang ke bawah
                      saat melintas di hadapan tetua.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Question & Options Column */}
            <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <span className="material-symbols-outlined text-[20px]">
                    help
                  </span>
                  <span className="text-label-md uppercase tracking-wider font-bold">
                    Pertanyaan 03
                  </span>
                </div>

                <h2 className="text-headline-lg text-on-surface tracking-tight font-extrabold leading-snug">
                  Apa arti dan konteks penggunaan kata{" "}
                  <span className="text-primary italic">&ldquo;Tabe&rdquo;</span>{" "}
                  yang paling tepat dalam masyarakat Kaili?
                </h2>
                <p className="text-body-md text-on-surface-variant mt-1 mb-6">
                  Pilihlah satu jawaban yang paling mencerminkan tata krama luhur
                  dan fungsi sosialnya.
                </p>

                {/* Options Group */}
                <div className="space-y-3">
                  {/* Option A (Correct) */}
                  <div
                    onClick={() => setSelectedOption("A")}
                    className={`cursor-pointer p-4 rounded-2xl transition-all flex items-start gap-4 border ${
                      selectedOption === "A"
                        ? "bg-primary-fixed/20 border-primary ring-2 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-transparent"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm ${
                        selectedOption === "A"
                          ? "bg-primary text-on-primary shadow-xs"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {selectedOption === "A" ? (
                        <span className="material-symbols-outlined text-[18px]">
                          check
                        </span>
                      ) : (
                        "A"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span className="text-title-md text-on-surface font-bold">
                          A. Permisi / Hormat
                        </span>
                        <span className="text-label-sm bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold uppercase">
                          Pilihan Santun Tertinggi
                        </span>
                      </div>
                      <p className="text-body-md text-on-surface-variant">
                        Diucapkan saat menyapa, lewat di depan orang tua, atau
                        meminta izin berpartisipasi dalam musyawarah adat.
                      </p>
                    </div>
                  </div>

                  {/* Option B */}
                  <div
                    onClick={() => setSelectedOption("B")}
                    className={`cursor-pointer p-4 rounded-2xl transition-all flex items-start gap-4 border ${
                      selectedOption === "B"
                        ? "bg-primary-fixed/20 border-primary ring-2 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-transparent"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm ${
                        selectedOption === "B"
                          ? "bg-primary text-on-primary shadow-xs"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      B
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-title-md text-on-surface font-bold block mb-1">
                        Sampai jumpa besok pagi
                      </span>
                      <p className="text-body-md text-on-surface-variant">
                        Ungkapan perpisahan santai antar rekan sebaya menjelang
                        istirahat malam.
                      </p>
                    </div>
                  </div>

                  {/* Option C */}
                  <div
                    onClick={() => setSelectedOption("C")}
                    className={`cursor-pointer p-4 rounded-2xl transition-all flex items-start gap-4 border ${
                      selectedOption === "C"
                        ? "bg-primary-fixed/20 border-primary ring-2 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-transparent"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm ${
                        selectedOption === "C"
                          ? "bg-primary text-on-primary shadow-xs"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      C
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-title-md text-on-surface font-bold block mb-1">
                        Terima kasih atas hidangannya
                      </span>
                      <p className="text-body-md text-on-surface-variant">
                        Ungkapan rasa syukur formal sehabis jamuan makan bersama
                        dalam upacara syukuran.
                      </p>
                    </div>
                  </div>

                  {/* Option D */}
                  <div
                    onClick={() => setSelectedOption("D")}
                    className={`cursor-pointer p-4 rounded-2xl transition-all flex items-start gap-4 border ${
                      selectedOption === "D"
                        ? "bg-primary-fixed/20 border-primary ring-2 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-transparent"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm ${
                        selectedOption === "D"
                          ? "bg-primary text-on-primary shadow-xs"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      D
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-title-md text-on-surface font-bold block mb-1">
                        Permintaan maaf atas kesalahan besar
                      </span>
                      <p className="text-body-md text-on-surface-variant">
                        Bentuk pertobatan adat resmi saat dijatuhi sanksi Givu
                        oleh dewa adat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-on-surface-variant text-label-sm">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    lightbulb
                  </span>
                  Tips: Perhatikan gestur fisik saat kata ini diucapkan.
                </span>
                <button
                  type="button"
                  className="hover:text-on-surface transition-colors cursor-pointer"
                >
                  Laporkan Masalah
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Evaluation Banner Drawer */}
          <div className="p-5 lg:p-6 bg-surface-container-lowest shadow-[0_-8px_24px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-4 z-20 border-t border-surface-container">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[28px]">
                  check_circle
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-title-md text-primary font-bold">
                    Tepat Sekali! (+15 XP)
                  </h3>
                  <span className="inline-flex items-center gap-1 text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[14px]">
                      menu_book
                    </span>
                    Balai Bahasa Sulteng
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant max-w-2xl leading-relaxed">
                  Dalam tata krama Kaili, kata <strong>&ldquo;Tabe&rdquo;</strong>{" "}
                  diiringi sikap tubuh merendah sebagai penghormatan luhur kepada
                  sesama dan orang yang dituakan, melambangkan kerendahan hati.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full md:w-auto px-8 py-3.5 bg-primary text-on-primary rounded-full font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>Lanjut ke Evaluasi Jawaban</span>
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
