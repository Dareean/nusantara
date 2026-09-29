"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";

export default function ProfilPage() {
  const router = useRouter();
  const [dailyGoalIndex, setDailyGoalIndex] = useState(1);
  const goals = ["3 Menit / Hari (Santai)", "5 Menit / Hari (Serius)", "10 Menit / Hari (Ambisius)"];
  const [reminderActive, setReminderActive] = useState(true);
  const [audioAutoplay, setAudioAutoplay] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Terakhir disinkronkan: Baru saja");

  const cycleDailyGoal = () => {
    setDailyGoalIndex((prev) => (prev + 1) % goals.length);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus("Terakhir disinkronkan: Baru saja (100% aman)");
    }, 1200);
  };

  const handleLogout = () => {
    // local logout: clear session saved by client-side auth
    try {
      void import("../../auth/authClient").then((m) => m.logout());
    } catch (e) {
      /* ignore */
    }
    router.push("/auth");
  };

  return (
    <>
      <TopBar
        title="Profil & Pengaturan"
        subtitle="Kelola Preferensi Belajar & Arsip Budaya"
      />
      <main className="relative pt-20 px-4 lg:px-8 w-full min-h-screen overflow-x-clip">
        <div className="w-full max-w-6xl mx-auto pb-16 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-2 text-primary text-label-md tracking-wider uppercase font-bold">
                <span className="material-symbols-outlined text-[20px]">
                  manage_accounts
                </span>
                <span>Setelan Akun &amp; Arsip Budaya</span>
              </div>
              <h1 className="text-display-lg text-on-surface font-extrabold tracking-tight">
                Profil &amp; Pengaturan Akun
              </h1>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Kelola preferensi belajar, sinkronisasi kemajuan adat, dan
                transparansi kurasi budaya Kaili.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full shadow-xs text-secondary text-label-md border border-outline-variant/20 font-bold">
                <span className="w-2 h-2 rounded-full bg-secondary-container float-lift"></span>
                <span>Supabase Cloud Aktif</span>
              </div>
              <button
                type="button"
                onClick={handleManualSync}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md rounded-full shadow-xs transition-all cursor-pointer font-semibold border border-outline-variant/20"
              >
                <span className={`material-symbols-outlined text-primary text-[18px] ${isSyncing ? "animate-spin" : ""}`}>
                  sync
                </span>
                <span>{isSyncing ? "Sinkronisasi..." : "Sinkron Data"}</span>
              </button>
            </div>
          </div>

          {/* Master Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Identity & Gamification Footprint */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Identity Card */}
              <div className="relative bg-surface-container-lowest rounded-2xl p-6 shadow-xs overflow-hidden border border-outline-variant/30">
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden p-1 bg-surface-container-highest shadow-md">
                      <img
                        alt="Rani Maharani Avatar"
                        className="w-full h-full object-cover rounded-full"
                        src="https://lh3.googleusercontent.com/aida/AEtjO1Vhf8Tpf1UP_r76LEL-9Olxy-KamrRKdvbuw_IdSOUdsPnutS-ucQSUNrUwCmvv79RwssCekEhlPat9dql81M0_w3TdFVqc0hENXtxegKWhP1UapZD9OlTcn4MiCZZPhuf7VNtyofbbQ8ByHlCDXGq8phTykzER2D0OKlgZrlUIKLycgNPOKpSjSCeQYrau-XCBnFjpIEDXwO8PKFKpjzvu77uKgmWMakGwQ2PeNYy_zuHKKvm8sSrmGaG3"
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md font-bold text-xs"
                      title="Level 3 Penjelajah"
                    >
                      <span className="material-symbols-outlined text-xs">
                        stars
                      </span>
                      <span>Lvl 3</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <h2 className="text-headline-md text-on-surface font-extrabold tracking-tight">
                      Rani Maharani
                    </h2>
                    <span
                      className="material-symbols-outlined text-primary text-[20px]"
                      title="Akun Terverifikasi Adat"
                    >
                      verified
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mt-0.5">
                    @ranimaharani • Mahasiswi Univ. Tadulako, Palu
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary-fixed rounded-full text-on-secondary-fixed">
                    <span className="material-symbols-outlined text-secondary text-sm">
                      local_police
                    </span>
                    <span className="text-label-md font-bold">
                      Penjelajah Budaya Kaili (Level 3)
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-lg text-on-surface-variant text-label-sm">
                    <span className="material-symbols-outlined text-primary text-sm">
                      location_on
                    </span>
                    <span>Sulawesi Tengah • Sejak Sept 2026</span>
                  </div>
                </div>
              </div>

              {/* Stats Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {/* Total XP */}
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex items-center justify-between border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">
                        emoji_events
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-headline-sm text-on-surface font-bold">
                        1.420 XP
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        XP Budaya Terkumpul
                      </span>
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex items-center justify-between border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">
                        local_fire_department
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-headline-sm text-primary font-bold">
                        7 Hari
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Konsistensi Ritme Belajar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chapters */}
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex items-center justify-between border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">
                        auto_stories
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-headline-sm text-on-surface font-bold">
                        2 Bab Tuntas
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Dialek Kaili Ledo Selesai
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passport Quick Banner */}
              <div className="relative bg-primary text-on-primary rounded-2xl p-5 shadow-md overflow-hidden flex flex-col gap-2">
                <div className="flex items-center justify-between z-10">
                  <span className="text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                    Paspor Budaya Kaili
                  </span>
                  <span className="material-symbols-outlined text-primary-fixed text-[20px]">
                    verified_user
                  </span>
                </div>
                <div className="z-10 flex flex-col">
                  <h3 className="text-headline-sm font-bold text-on-primary leading-tight">
                    4 dari 12 Lencana Adat
                  </h3>
                  <p className="text-body-sm text-primary-fixed-dim">
                    Terakhir didapat: Lencana Tenun Donggala &amp; Filosofi
                    Sapaan Ledo.
                  </p>
                </div>
                <div className="w-full bg-on-primary/20 h-2 rounded-full overflow-hidden mt-1 z-10">
                  <div
                    className="bg-secondary-container h-full rounded-full transition-all duration-500"
                    style={{ width: "33.3%" }}
                  ></div>
                </div>
                <Link
                  href="/dashboard/paspor"
                  className="mt-2 inline-flex items-center gap-1 text-on-primary text-label-md font-bold hover:underline z-10"
                >
                  <span>Buka Paspor Lengkap</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: Settings Sections */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* SECTION 1: Preferensi Belajar */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      tune
                    </span>
                    <h2 className="text-headline-sm text-on-surface font-bold">
                      Preferensi Belajar
                    </h2>
                  </div>
                  <span className="text-label-sm text-on-surface-variant font-medium">
                    Personalisasi Sesi
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Daily Target */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors gap-3">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-[26px] mt-0.5">
                        timer
                      </span>
                      <div className="flex flex-col">
                        <span className="text-title-md text-on-surface font-bold">
                          Target Belajar Harian
                        </span>
                        <span className="text-body-md text-on-surface-variant">
                          {goals[dailyGoalIndex]}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={cycleDailyGoal}
                      className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container-high text-primary text-label-md font-bold rounded-full shadow-xs transition-all self-start sm:self-auto shrink-0 cursor-pointer border border-outline-variant/20"
                    >
                      Ubah Target
                    </button>
                  </div>

                  {/* Reminder Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-tertiary text-[26px] mt-0.5">
                        notifications_active
                      </span>
                      <div className="flex flex-col">
                        <span className="text-title-md text-on-surface font-bold">
                          Pengingat Harian (Web Push)
                        </span>
                        <span className="text-body-md text-on-surface-variant">
                          {reminderActive
                            ? "Aktif • Pukul 19:30 WITA (Senja Lembah Palu)"
                            : "Dinonaktifkan"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReminderActive(!reminderActive)}
                      className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                        reminderActive ? "bg-primary" : "bg-surface-variant"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-on-primary rounded-full shadow-xs transform transition-transform ${
                          reminderActive ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Audio Autoplay Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-[26px] mt-0.5">
                        volume_up
                      </span>
                      <div className="flex flex-col">
                        <span className="text-title-md text-on-surface font-bold">
                          Audio &amp; Fonetik Otomatis
                        </span>
                        <span className="text-body-md text-on-surface-variant">
                          {audioAutoplay
                            ? "Autoplay Audio Penutur Asli Tetua Kaili Aktif"
                            : "Putar Manual Saja"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudioAutoplay(!audioAutoplay)}
                      className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                        audioAutoplay ? "bg-primary" : "bg-surface-variant"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-on-primary rounded-full shadow-xs transform transition-transform ${
                          audioAutoplay ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Budaya & Wilayah Riset */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      travel_explore
                    </span>
                    <h2 className="text-headline-sm text-on-surface font-bold">
                      Budaya &amp; Wilayah Riset
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-label-sm font-semibold">
                    Fase 1 Eksplorasi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-2 border border-outline-variant/20">
                    <div className="flex flex-col gap-1">
                      <span className="text-label-sm text-secondary font-bold uppercase tracking-wider">
                        Wilayah Budaya Aktif
                      </span>
                      <h4 className="text-title-md text-on-surface font-bold">
                        Sulawesi Tengah (Suku Kaili)
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        Kawasan Lembah Palu, Sigi, &amp; pesisir Donggala.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-md text-primary text-label-sm w-fit shadow-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Pilot Riset Aktif</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-2 border border-outline-variant/20">
                    <div className="flex flex-col gap-1">
                      <span className="text-label-sm text-outline font-bold uppercase tracking-wider">
                        Dialek Utama
                      </span>
                      <h4 className="text-title-md text-on-surface font-bold">
                        Kaili Ledo (Lembah Palu)
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        Dialek Kaili Tara, Rai, &amp; Da&apos;a tersedia di Level
                        4.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high rounded-md text-on-surface-variant text-label-sm w-fit font-medium">
                      <span className="material-symbols-outlined text-[14px]">
                        lock
                      </span>
                      <span>Dialek Tara &amp; Da&apos;a (Terkunci)</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Integritas Data Adat */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[22px]">
                      gavel
                    </span>
                    <h2 className="text-headline-sm text-on-surface font-bold">
                      Integritas Data Adat &amp; Sumber Kurasi
                    </h2>
                  </div>
                  <span className="text-label-sm text-tertiary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      verified
                    </span>
                    Ethics Verified
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container-low gap-3 border border-outline-variant/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[22px]">
                          account_balance
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-title-md text-on-surface font-bold">
                          Sumber &amp; Dewan Kurator
                        </span>
                        <span className="text-body-md text-on-surface-variant">
                          Dewan Adat Palu &amp; Balai Bahasa Provinsi Sulawesi
                          Tengah
                        </span>
                        <span className="text-label-sm text-on-surface-variant/80 mt-1 font-mono">
                          Dokumen: 142/KRS-ADAT/PLU/2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[22px]">
                        verified_user
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-title-md text-on-surface font-bold">
                          Prinsip Tanpa Fabrikasi Budaya
                        </span>
                        <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-md text-label-sm font-bold">
                          100% Validasi Manusia
                        </span>
                      </div>
                      <p className="text-body-md text-on-surface-variant leading-relaxed">
                        Jaminan kurasi bebas halusinasi AI pada seluruh kosa
                        kata, sapaan kesantunan (Tabe), filosofi motif Tenun
                        Donggala, dan sejarah Souraja.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Sync & Logout */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      cloud_done
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-title-md text-on-surface font-bold">
                        Cloud Sync
                      </span>
                      <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                    </div>
                    <span className="text-body-sm text-on-surface-variant">
                      {syncStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-label-md font-bold transition-all cursor-pointer"
                  >
                    Keluar Akun
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
