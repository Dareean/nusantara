"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import { Award, BadgeCheck, Compass, Play } from "lucide-react";
import { getSession } from "../../auth/authClient";
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

  useEffect(() => {
    let email = "";
    getSession().then(async (session) => {
      if (!session) return;
      email = session.email;
      setUserEmail(email);
      // Read local first for immediate render
      setProgress(readProgress(email));
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
    <>
      

      <main className="relative min-h-screen w-full px-3 pb-20 pt-20 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] bg-gradient-to-br from-[#fff3e8] via-[#f9dfc9] to-[#f0ae7d] p-4 shadow-[0_12px_22px_-16px_rgba(168,50,17,0.28)] ring-1 ring-[#f0c9a7] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">Achievement</p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-[#351d13] sm:text-3xl">
                  Kamu sedang naik level
                </h1>
              </div>

              <div className="rounded-full bg-white/80 px-3 py-2 shadow-sm ring-1 ring-white/60">
                <div className="text-[9px] uppercase tracking-[0.12em] text-[#6f422e]">Total XP</div>
                <div className="text-lg font-black text-[#3e2115]">{progress.xp}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">
                Level {Math.floor(progress.xp / 100) + 1}
              </span>
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">
                {progress.streak} hari streak
              </span>
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">
                {progress.badges.length} badge
              </span>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Quest selesai</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">{progress.completedLessons.length}</h2>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Badge aktif</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">
                {progress.badges.length}/{CANONICAL_BADGES.length}
              </h2>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Misi hari ini</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">2</h2>
            </div>
          </section>

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
              Kembali ke Roadmap
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
