"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Check,
  CheckCircle2,
  Compass,
  Crown,
  Flame,
  Lock,
  MapPin,
  Play,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { getCachedSessionSync, getSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "../progress";
import { CANONICAL_BADGES, type CanonicalBadge } from "@/lib/badges";

// Daftar Seluruh Cap Paspor Resmi (Termasuk Skenario Terpadu)
const ALL_PASSPORT_STAMPS = [
  ...CANONICAL_BADGES,
  {
    id: "tamu-sopan-lembah-palu",
    title: "Tamu Sopan Lembah Palu",
    lessonId: 4,
    detail: "Menuntaskan Skenario Upacara Adat Souraja dengan harmoni sempurna.",
    rewardXp: 30,
    tone: "primary" as const,
  },
];

const STAMP_ICONS: Record<number, typeof Award> = {
  1: Award,
  2: ShieldCheck,
  3: Compass,
  4: Crown,
};

function getTravelerTitle(level: number): string {
  if (level >= 5) return "Tetua Kehormatan Nusantara";
  if (level >= 4) return "Duta Kehormatan Souraja";
  if (level >= 3) return "Penjaga Tutur Santun";
  if (level >= 2) return "Penjelajah Tradisi Kaili";
  return "Penjelajah Muda";
}

export default function AchievementPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [userName, setUserName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cached = getCachedSessionSync();
    if (cached) {
      setUserName(cached.name || cached.email?.split("@")[0] || "Penjelajah Budaya");
      setProgress(readProgress(cached.email));
      setIsLoaded(true);
    }
    getSession().then(async (session) => {
      if (!session) {
        setIsLoaded(true);
        return;
      }
      setUserName(session.name || session.email?.split("@")[0] || "Penjelajah Budaya");
      const local = readProgress(session.email);
      setProgress(local);
      setIsLoaded(true);
      const remote = await loadProgress(session.email);
      setProgress(remote);
    });

    const onProgressUpdated = () => {
      const sess = getCachedSessionSync();
      if (sess?.email) {
        setProgress(readProgress(sess.email));
      }
    };

    window.addEventListener("laras-progress-updated", onProgressUpdated);
    return () => window.removeEventListener("laras-progress-updated", onProgressUpdated);
  }, []);

  const level = Math.floor(progress.xp / 100) + 1;
  const travelerTitle = getTravelerTitle(level);

  // Hitung jumlah stempel yang sudah terbuka
  const unlockedStamps = ALL_PASSPORT_STAMPS.filter((item) => {
    return (
      progress.badges.includes(item.title) ||
      progress.badges.some((b) => b.toLowerCase().includes(item.title.toLowerCase())) ||
      progress.completedLessons.includes(item.lessonId)
    );
  });

  const completionPercent = Math.round((unlockedStamps.length / ALL_PASSPORT_STAMPS.length) * 100);

  return (
    <main className="min-h-screen bg-surface px-4 py-6 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* 1. PRESTIGIOUS PASSPORT BOOK COVER (Karakter Paspor Penjelajah Asli) */}
        <section
          style={{
            background: "linear-gradient(135deg, #3d1306 0%, #652410 50%, #220702 100%)",
            color: "#ffffff",
          }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#8e3c23]"
        >
          {/* Watermark Ornamen Tradisi */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full border-8 border-white/5 pointer-events-none" />
          <div className="absolute right-8 top-8 w-28 h-28 rounded-full border-4 border-dashed border-white/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffcbbd]">
                <Compass className="w-3.5 h-3.5" />
                <span>Paspor Penjelajah Budaya • Dokumen Resmi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Buku Paspor {userName || "Penjelajah"}
              </h1>
              <p className="text-xs sm:text-sm text-[#f6d5ca] font-medium max-w-lg leading-relaxed">
                Gelar Adat: <strong className="text-white font-extrabold">{travelerTitle}</strong>. Setiap cap di bawah ini adalah rekaman sah keahlian budaya yang telah kamu buktikan.
              </p>
            </div>

            {/* Total XP Medallion */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 p-4 rounded-2xl bg-black/40 backdrop-blur-xs border border-white/15 min-w-[140px]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ffcbbd] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                Total Kemahiran
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
                {isLoaded ? `${progress.xp} XP` : "-- XP"}
              </span>
            </div>
          </div>

          {/* Quick HUD Chips di dalam Paspor */}
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-2.5 text-xs font-extrabold text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Level {isLoaded ? level : "--"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/10">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              {isLoaded ? `${progress.streak} Hari Beruntun` : "--"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/10">
              <Award className="w-3.5 h-3.5 text-emerald-300" />
              {isLoaded ? `${unlockedStamps.length} dari ${ALL_PASSPORT_STAMPS.length} Cap Tersemat` : "--"}
            </span>
          </div>
        </section>

        {/* 2. PROGRESS KOLEKSI CAP (Trophy Showcase Bar) */}
        <section className="rounded-2xl bg-surface-container-lowest p-5 border-2 border-outline-variant/30 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              Progres Koleksi Cap Unit 1 (Sulawesi Tengah)
            </span>
            <span className="text-primary font-extrabold">{completionPercent}% Lengkap</span>
          </div>
          <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-amber-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </section>

        {/* Empty State Edukatif jika 0 Cap */}
        {isLoaded && unlockedStamps.length === 0 && (
          <div className="rounded-3xl border-2 border-primary/20 bg-primary-fixed/20 p-6 text-center flex flex-col items-center gap-3">
            <p className="text-sm font-extrabold text-on-surface">
              Kamu belum memiliki Cap Paspor. Selesaikan Pelajaran 1 di Beranda untuk mematri cap pertamamu!
            </p>
            <Link
              href="/dashboard/latihan/1"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-black text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition"
            >
              <span>Mulai Pelajaran 1</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </Link>
          </div>
        )}

        {/* 3. SHOWCASE CAP PASPOR (Grid Stempel Cap Fisik & Prestasi Koleksi) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-on-surface tracking-tight">
              Koleksi Cap Paspor Budaya
            </h2>
            <span className="text-xs text-on-surface-variant font-bold">
              {unlockedStamps.length} Terbuka • {ALL_PASSPORT_STAMPS.length - unlockedStamps.length} Terkunci
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ALL_PASSPORT_STAMPS.map((item, index) => {
              const Icon = STAMP_ICONS[item.lessonId] ?? Award;
              const isUnlocked =
                progress.badges.includes(item.title) ||
                progress.badges.some((b) => b.toLowerCase().includes(item.title.toLowerCase())) ||
                progress.completedLessons.includes(item.lessonId);

              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-3xl p-5 border-2 transition-all flex flex-col justify-between gap-4 ${
                    isUnlocked
                      ? "bg-surface-container-lowest border-primary/30 shadow-md ring-1 ring-primary/20"
                      : "bg-surface-container-low/50 border-outline-variant/30 opacity-75"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Cap Stempel Paspor (Faux-Stamp Circle / Wax Seal) */}
                    <div
                      className={`relative w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border-2 transition-transform duration-300 ${
                        isUnlocked
                          ? "bg-linear-to-br from-primary-fixed to-surface-container-lowest border-primary text-primary shadow-inner scale-100 rotate-[-2deg]"
                          : "bg-surface-container-high border-outline-variant/40 text-outline grayscale"
                      }`}
                    >
                      {/* Lingkaran Stempel Putus-Putus Khas Paspor */}
                      <div className="absolute inset-1 rounded-xl border border-dashed border-current opacity-40 pointer-events-none" />
                      {isUnlocked ? (
                        <Icon className="w-8 h-8 stroke-[2.2]" />
                      ) : (
                        <Lock className="w-6 h-6 stroke-[2]" />
                      )}
                    </div>

                    {/* Konten & Gelar Stempel */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                          Cap #{index + 1}
                        </span>
                        <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          +{item.rewardXp} XP
                        </span>
                      </div>

                      <h3 className="text-base font-black text-on-surface tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>

                  {/* Pita Status Stempel */}
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Lembah Palu, Kaili
                    </span>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 text-xs font-black">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Terpatri di Paspor</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-outline text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Belum Diraih</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol Aksi Kembali */}
        <div className="flex justify-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-extrabold text-xs uppercase tracking-wider transition shadow-xs"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
