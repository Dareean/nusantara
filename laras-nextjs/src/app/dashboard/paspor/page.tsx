"use client";

import { useState } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";

export default function PasporBudayaPage() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title: "Paspor Budaya Kaili - Rani Maharani",
            text: "Saya telah menyelesaikan 75% kompetensi Budaya Kaili (Bahasa Ledo & Busana Nggembe) di LARAS Nusantara!",
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    }
  };

  return (
    <>
      <TopBar
        title="Paspor Budaya"
        subtitle="Portofolio Digital Prestasi Adat Nusantara"
      />
      <main className="relative pt-20 px-4 lg:px-8 w-full min-h-screen overflow-x-clip">
        <div className="w-full max-w-6xl mx-auto pb-16 flex flex-col gap-8">
          {/* Top Passport Master Header */}
          <section className="relative w-full rounded-3xl bg-surface-container-lowest shadow-[0_4px_24px_-4px_rgba(224,90,54,0.08)] overflow-hidden p-6 lg:p-8 border border-outline-variant/30">
            {/* Subtle Gradient Glow */}
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
            <div className="absolute right-48 bottom-0 w-64 h-64 rounded-full bg-tertiary/5 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-6">
              {/* Category / Eyebrow */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary-fixed text-primary">
                    <span className="material-symbols-outlined text-[16px]">
                      verified
                    </span>
                  </span>
                  <span className="text-label-sm text-primary uppercase font-bold tracking-wider">
                    DOKUMEN RESMI BELAJAR • PASPOR BUDAYA NUSANTARA
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-label-sm text-on-surface-variant font-mono">
                    SERIAL: KLI-ST-2024-089
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary float-lift"></span>
                  <span className="text-label-sm text-on-surface-variant font-semibold">
                    Sinkronisasi Terakhir: Hari ini, 09:42 WITA
                  </span>
                </div>
              </div>

              {/* User Profile Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Avatar & Details */}
                <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative">
                    <img
                      alt="Rani Maharani avatar"
                      className="w-24 h-24 rounded-2xl object-cover shadow-[0_4px_12px_rgba(168,50,17,0.18)] ring-4 ring-primary/20"
                      src="https://lh3.googleusercontent.com/aida/AEtjO1Vhf8Tpf1UP_r76LEL-9Olxy-KamrRKdvbuw_IdSOUdsPnutS-ucQSUNrUwCmvv79RwssCekEhlPat9dql81M0_w3TdFVqc0hENXtxegKWhP1UapZD9OlTcn4MiCZZPhuf7VNtyofbbQ8ByHlCDXGq8phTykzER2D0OKlgZrlUIKLycgNPOKpSjSCeQYrau-XCBnFjpIEDXwO8PKFKpjzvu77uKgmWMakGwQ2PeNYy_zuHKKvm8sSrmGaG3"
                    />
                    <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-label-sm shadow-[0_2px_0_0_#653e00] font-bold">
                      LVL 3
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-headline-lg text-on-surface tracking-tight font-extrabold">
                        Rani Maharani
                      </h1>
                      <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-md font-bold">
                        Suku Kaili • Sulawesi Tengah
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface-variant">
                      Mahasiswi Universitas Tadulako, Palu • Konsentrasi
                      Pelestari Muda Ledo
                    </p>

                    {/* Progress Pills */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center gap-1 bg-secondary-fixed px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-secondary text-[18px]">
                          bolt
                        </span>
                        <span className="text-label-md text-on-secondary-fixed font-bold">
                          520 Total XP
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          military_tech
                        </span>
                        <span className="text-label-md text-on-surface font-bold">
                          Penjelajah Budaya Kaili (75%)
                        </span>
                      </div>
                      <span className="text-body-sm text-on-surface-variant">
                        3 dari 4 modul per track selesai
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Share & Verification */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full sm:w-auto lg:w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {copied ? "check" : "share"}
                    </span>
                    <span>
                      {copied
                        ? "Tautan Disalin ke Clipboard!"
                        : "Bagikan Paspor Budaya (IG / WA) ↗"}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2 rounded-xl w-full sm:w-auto lg:w-full justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[24px]">
                        qr_code_2
                      </span>
                      <div className="flex flex-col">
                        <span className="text-label-sm font-bold text-on-surface">
                          ID Verifikasi Terenkripsi
                        </span>
                        <span className="text-body-sm text-on-surface-variant font-mono">
                          LARAS-PLU-992-04
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dual-Track Competency Matrix */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Track A: Bahasa */}
            <div className="flex flex-col rounded-3xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/30 justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">
                        record_voice_over
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-label-sm text-primary font-bold uppercase tracking-wider">
                        TRACK A • VERNACULAR
                      </span>
                      <h2 className="text-headline-md text-on-surface font-bold">
                        Kemahiran Bahasa Kaili (Ledo)
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center bg-primary-fixed px-3 py-1 rounded-full">
                    <span className="text-label-md text-on-primary-fixed font-bold">
                      75% Selesai
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-on-surface-variant text-label-sm">
                    <span className="font-bold">Kemajuan Capaian</span>
                    <span className="font-bold text-primary">
                      3 dari 4 Sub-kompetensi Tuntas
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface font-bold">
                          Kosa Kata Dasar (Basic Vocabulary)
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Istilah keseharian, angka, dan kata benda inti Ledo
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold">
                      Tuntas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface font-bold">
                          Sapaan &amp; Adab Sopan Santun
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Konsep &ldquo;Tabe&rdquo;, etika bertamu, dan
                          penghormatan tetua
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold">
                      Tuntas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface font-bold">
                          Menyimak &amp; Pelafalan Vokal
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Diftong khusus, ritme ujaran lembah Palu &amp;
                          Donggala
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold">
                      Tuntas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-variant/40 opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">
                          lock
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface-variant font-bold">
                          Percakapan Kontekstual Pasar &amp; Souraja
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Simulasi tawar menawar di Pasar Inpres &amp; balai adat
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-bold">
                      Terkunci (Bab 5)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                <span className="text-body-sm text-on-surface-variant">
                  XP Diperoleh:{" "}
                  <strong className="text-primary font-bold">
                    280 / 350 XP
                  </strong>
                </span>
                <Link
                  href="/dashboard/latihan"
                  className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-md font-bold hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                >
                  Ulas Latihan Track A →
                </Link>
              </div>
            </div>

            {/* Track B: Busana */}
            <div className="flex flex-col rounded-3xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/30 justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">
                        checkroom
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-label-sm text-tertiary font-bold uppercase tracking-wider">
                        TRACK B • MATERIAL HERITAGE
                      </span>
                      <h2 className="text-headline-md text-on-surface font-bold">
                        Pemahaman Busana Adat Kaili
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center bg-tertiary-fixed px-3 py-1 rounded-full">
                    <span className="text-label-md text-on-tertiary-fixed font-bold">
                      75% Selesai
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-on-surface-variant text-label-sm">
                    <span className="font-bold">Kemajuan Capaian</span>
                    <span className="font-bold text-tertiary">
                      3 dari 4 Artefak Dipelajari
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-tertiary rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface font-bold">
                          Identifikasi Busana (Baju Nggembe)
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Bentuk segi empat, lengan longgar, dan estetika feminin
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold">
                      Tuntas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface font-bold">
                          Anatomi &amp; Bagian (Motif &amp; Sampa)
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Pemasangan selempang Sampa, gelang duni, dan manik dada
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold">
                      Tuntas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface font-bold">
                          Makna Simbolis &amp; Nilai Filosofis
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Keseimbangan kosmis Kaili, kehormatan, dan hierarki
                          tenun
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold">
                      Tuntas
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-variant/40 opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">
                          lock
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-label-lg text-on-surface-variant font-bold">
                          Busana Ritual &amp; Upacara Khusus
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Koleksi baju Baloso pria &amp; busana upacara Balia
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-bold">
                      Terkunci (Bab 6)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                <span className="text-body-sm text-on-surface-variant">
                  XP Diperoleh:{" "}
                  <strong className="text-tertiary font-bold">
                    240 / 300 XP
                  </strong>
                </span>
                <Link
                  href="/dashboard/latihan/busana"
                  className="px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-md font-bold hover:bg-tertiary hover:text-on-tertiary transition-all cursor-pointer"
                >
                  Ulas Artefak Track B →
                </Link>
              </div>
            </div>
          </section>

          {/* Badge Shelf */}
          <section className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    military_tech
                  </span>
                  <h2 className="text-headline-md text-on-surface font-bold">
                    Koleksi Lencana Budaya Kaili
                  </h2>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Pencapaian mikro &amp; artefak kehormatan yang terverifikasi
                  secara digital
                </p>
              </div>
              <span className="text-label-md text-secondary font-bold bg-secondary-fixed px-3 py-1 rounded-full">
                3 Dibuka / 1 Terkunci
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Badge 1 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-container-lowest shadow-xs hover:-translate-y-1 transition-transform border border-outline-variant/30">
                <div className="w-20 h-20 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-[0_4px_0_0_#ffb95f] mb-4">
                  <span className="material-symbols-outlined text-[40px]">
                    emoji_events
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-label-sm font-bold uppercase mb-1">
                  Emas • Terbuka
                </span>
                <h3 className="text-title-md text-on-surface font-bold">
                  Penjelajah Bahasa
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Menyelesaikan 3 modul percakapan dasar dialek Ledo.
                </p>
                <div className="mt-4 pt-2 w-full flex items-center justify-center gap-1 text-secondary text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>Diperoleh 14 Okt 2024</span>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-container-lowest shadow-xs hover:-translate-y-1 transition-transform border border-outline-variant/30">
                <div className="w-20 h-20 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-[0_4px_0_0_#ffb95f] mb-4">
                  <span className="material-symbols-outlined text-[40px]">
                    styler
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-label-sm font-bold uppercase mb-1">
                  Emas • Terbuka
                </span>
                <h3 className="text-title-md text-on-surface font-bold">
                  Busana Tradisional
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Ahli identifikasi Baju Nggembe &amp; filosofi motif tenun
                  Sampa.
                </p>
                <div className="mt-4 pt-2 w-full flex items-center justify-center gap-1 text-secondary text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>Diperoleh 18 Okt 2024</span>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-container-lowest shadow-xs hover:-translate-y-1 transition-transform border border-outline-variant/30">
                <div className="w-20 h-20 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-[0_4px_0_0_#ffb95f] mb-4">
                  <span className="material-symbols-outlined text-[40px]">
                    local_fire_department
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-label-sm font-bold uppercase mb-1">
                  Emas • Terbuka
                </span>
                <h3 className="text-title-md text-on-surface font-bold">
                  Pemula Kaili
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Konsistensi belajar dengan streak 6 hari berturut-turut tanpa
                  jeda.
                </p>
                <div className="mt-4 pt-2 w-full flex items-center justify-center gap-1 text-secondary text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>Diperoleh Kemarin</span>
                </div>
              </div>

              {/* Badge 4 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-container-low opacity-80 hover:opacity-100 transition-opacity border border-outline-variant/20">
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-[36px]">
                    lock
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-label-sm font-bold uppercase mb-1">
                  Terkunci
                </span>
                <h3 className="text-title-md text-on-surface font-bold">
                  Master Budaya Kaili
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Tuntaskan Bab Final (Ritual Adat &amp; Studi Kasus Souraja).
                </p>
                <div className="mt-4 pt-2 w-full flex items-center justify-center gap-1 text-outline text-label-sm font-medium">
                  <span>Perlu 1 Bab Lagi</span>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Trust Banner */}
          <div className="w-full rounded-3xl bg-surface-container-high p-6 lg:p-8 flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-3xl">
                <span className="text-label-sm text-primary font-bold uppercase tracking-wider">
                  INISIATIF NUSANTARA — MENJAGA SEBELUM SIRNA
                </span>
                <p className="text-body-md text-on-surface leading-relaxed">
                  Menjaga warisan budaya lewat kebiasaan harian generasi muda.
                  Setiap kosa kata dan filosofi busana adat yang kamu pelajari
                  menjaga identitas Kaili tetap hidup dalam memori kolektif
                  Indonesia.
                </p>
              </div>
              <Link
                href="/dashboard/culture-connection"
                className="whitespace-nowrap px-6 py-3 rounded-full bg-surface-container-lowest text-primary font-label-lg font-bold shadow-xs hover:bg-primary-fixed transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Lanjut ke Scenario Studio</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  shield
                </span>
                <span>Didukung oleh Mitra Kebudayaan Terverifikasi:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-label-sm font-semibold">
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/20">
                  Lembaga Adat Kaili (LAK)
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/20">
                  Balai Bahasa Sulawesi Tengah
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/20">
                  Dewan Kesenian Palu
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
