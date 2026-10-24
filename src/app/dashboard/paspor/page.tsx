"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, BadgeCheck, Compass, Play } from "lucide-react";
import { getCachedSessionSync, getSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "../progress";
import { CANONICAL_BADGES, type CanonicalBadge } from "@/lib/badges";

const BADGE_ICONS: Record<number, typeof Award> = {
  1: Award,
  2: BadgeCheck,
  3: Compass,
};

export default function AchievementPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [userEmail, setUserEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cached = getCachedSessionSync();
    let email = cached?.email || "";
    if (cached) {
      setUserEmail(cached.email);
      setProgress(readProgress(cached.email));
      setIsLoaded(true);
    }
    getSession().then(async (session) => {
      if (!session) {
        setIsLoaded(true);
        return;
      }
      email = session.email;
      setUserEmail(email);
      // Read local first for immediate render
      const local = readProgress(email);
      setProgress(local);
      setIsLoaded(true);
      // Load remote and update state
      const remote = await loadProgress(email);
      setProgress(remote);
    });

    const onProgressUpdated = () => {
      if (email) {
        setProgress(readProgress(email));
      }
    };

    window.addEventListener("laras-progress-updated", onProgressUpdated);
    return () => window.removeEventListener("laras-progress-updated", onProgressUpdated);
  }, []);

  return (
    <main className="relative min-h-screen w-full px-3 pb-20 pt-4 sm:pt-6 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] bg-gradient-to-br from-[#fff3e8] via-[#f9dfc9] to-[#f0ae7d] p-4 shadow-[0_12px_22px_-16px_rgba(168,50,17,0.28)] ring-1 ring-[#f0c9a7] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">Paspor</p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-[#351d13] sm:text-3xl">
                  Kamu sedang naik level
                </h1>
              </div>

              <div className="rounded-full bg-white/80 px-3 py-2 shadow-sm ring-1 ring-white/60 min-w-[70px]">
                <div className="text-[9px] uppercase tracking-[0.12em] text-[#6f422e]">Total XP</div>
                {isLoaded ? (
                  <div className="text-lg font-black text-[#3e2115]">{progress.xp}</div>
                ) : (
                  <div className="h-6 w-12 rounded bg-[#3e2115]/15 animate-pulse mt-0.5" />
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">
                {isLoaded ? `Level ${Math.floor(progress.xp / 100) + 1}` : "Level --"}
              </span>
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">
                {isLoaded ? `${progress.streak} hari beruntun` : "-- hari beruntun"}
              </span>
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">
                {isLoaded ? `${progress.badges.length} Cap Paspor` : "-- Cap Paspor"}
              </span>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Pelajaran selesai</p>
              {isLoaded ? (
                <h2 className="mt-2 text-2xl font-black text-on-surface">{progress.completedLessons.length}</h2>
              ) : (
                <div className="mt-2 h-8 w-12 rounded bg-surface-container-high animate-pulse" />
              )}
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Cap Paspor aktif</p>
              {isLoaded ? (
                <h2 className="mt-2 text-2xl font-black text-on-surface">
                  {progress.badges.length}/{CANONICAL_BADGES.length}
                </h2>
              ) : (
                <div className="mt-2 h-8 w-16 rounded bg-surface-container-high animate-pulse" />
              )}
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Target Harian</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">1 Pelajaran</h2>
            </div>
          </section>

          {/* Empty State Edukatif (jika belum ada Cap Paspor) */}
          {isLoaded && progress.badges.length === 0 && (
            <div className="rounded-3xl border-2 border-primary/20 bg-primary-fixed/20 p-5 sm:p-6 text-center flex flex-col items-center gap-3">
              <p className="text-sm font-extrabold text-on-surface">
                Kamu belum punya Cap Paspor. Selesaikan Unit 1 untuk mendapat Cap Paspor pertamamu.
              </p>
              <Link
                href="/dashboard/latihan/1"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-black text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition"
              >
                <span>Mulai Unit 1</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          )}

          <section className="space-y-3">
            {CANONICAL_BADGES.map((item: CanonicalBadge) => {
              const Icon = BADGE_ICONS[item.lessonId] ?? Award;
              const isUnlocked =
                progress.badges.includes(item.title) ||
                progress.completedLessons.includes(item.lessonId);

              return (
                <div
                  key={item.title}
                  className="rounded-[22px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                          item.tone === "primary"
                            ? "bg-primary-fixed text-primary"
                            : item.tone === "secondary"
                              ? "bg-secondary-fixed text-secondary"
                              : "bg-tertiary-fixed text-tertiary"
                        } ${!isUnlocked ? "opacity-60 grayscale" : ""}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-on-surface">{item.title}</h3>
                          <span className="text-[11px] font-bold text-primary">+{item.rewardXp} XP</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{item.detail}</p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                        isUnlocked
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {isUnlocked ? "Terbuka" : "Terkunci"}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <div className="flex justify-center pt-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d120d] px-4 py-2.5 text-sm font-extrabold text-[#fff7f1] shadow-[0_4px_0_0_#4a2214] transition-all hover:translate-y-[-1px]"
            >
              <Play className="w-4 h-4 fill-current" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
    </main>
  );
}
