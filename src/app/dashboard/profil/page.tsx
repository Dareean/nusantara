"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import {
  Settings,
  Award,
  BadgeCheck,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Flame,
  Lock,
} from "lucide-react";
import { getSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, BADGE_DEFINITIONS, type UserProgress } from "../progress";
import type { LucideIcon } from "lucide-react";

/** Learning tracks derived from the 3 lessons in Unit 1. */
function buildLearningTracks(progress: UserProgress) {
  const tracks = [
    {
      title: "Salam & Adab Tabe",
      lessonId: 1,
      totalLessons: 1,
    },
    {
      title: "Busana Adat Kaili",
      lessonId: 2,
      totalLessons: 1,
    },
    {
      title: "Skenario Souraja",
      lessonId: 3,
      totalLessons: 1,
    },
  ];

  return tracks.map((track) => {
    const completed = progress.completedLessons.includes(track.lessonId);
    const unlocked = progress.unlockedLessons.includes(track.lessonId);
    const progressPercent = completed ? 100 : 0;
    const tag: "Done" | "Active" | "Next" = completed
      ? "Done"
      : unlocked
        ? "Active"
        : "Next";

    return { ...track, progress: progressPercent, tag };
  });
}

const badgeIcons: Record<string, LucideIcon> = {
  "Pionir Salam": Award,
  "Penjaga Busana": BadgeCheck,
  "Tamu Sopan": ShieldCheck,
  "Penjaga Adab": Sparkles,
  "Petualang Budaya": Flame,
  "Pejuang Ledo": GraduationCap,
};

export default function ProfilPage() {
  const [userName, setUserName] = useState("Pelajar LARAS");
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getSession().then(async (session) => {
      if (!session) return;
      setEmail(session.email);
      setUserName(session.name);
      setProgress(await loadProgress(session.email));
    });
  }, []);

  useEffect(() => {
    if (!email) return;
    const refresh = () => setProgress(readProgress(email));
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, [email]);

  const learningTracks = buildLearningTracks(progress);

  return (
    <>
      <TopBar title="Profile" subtitle="Jalur belajar dan achievement" />

      <main className="relative min-h-screen w-full px-3 pb-20 pt-20 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-black text-on-primary ring-2 ring-primary/20"
                >
                  {userName.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-on-surface">{userName}</h1>
                  <p className="text-sm text-on-surface-variant">{userName.toLowerCase().replaceAll(" ", "_")} • Sulawesi Tengah</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/pengaturan"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-container px-4 py-2.5 text-sm font-bold text-on-surface ring-1 ring-outline-variant/25 transition hover:bg-surface-container-high"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">XP</div>
              <div className="mt-2 text-2xl font-black text-on-surface">{progress.xp}</div>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Level</div>
              <div className="mt-2 text-2xl font-black text-on-surface">{Math.floor(progress.xp / 100) + 1}</div>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Streak</div>
              <div className="mt-2 text-2xl font-black text-on-surface">{progress.streak} hari</div>
            </div>
          </section>

          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-on-surface">Jalur belajar</h2>
              <Link href="/dashboard/belajar" className="text-sm font-bold text-primary">Lihat path</Link>
            </div>

            <div className="space-y-3">
              {learningTracks.map((track) => (
                <div key={track.title} className="rounded-[18px] bg-surface-container p-3 ring-1 ring-outline-variant/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-extrabold text-on-surface">{track.title}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${
                        track.tag === "Done"
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : track.tag === "Active"
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {track.tag === "Done" ? "Selesai" : track.tag === "Active" ? "Aktif" : "Terkunci"}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${track.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    Progress {track.progress}%
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-on-surface">Achievement</h2>
              <Link href="/dashboard/paspor" className="text-sm font-bold text-primary">Lihat semua</Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {BADGE_DEFINITIONS.map((badge) => {
                const unlocked = progress.badges.includes(badge.name);
                const Icon = badgeIcons[badge.name] ?? Award;
                return (
                  <div key={badge.name} className={`rounded-[18px] bg-surface-container p-3 ring-1 ring-outline-variant/20 transition-opacity ${unlocked ? "" : "opacity-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${unlocked ? "bg-primary-fixed text-primary" : "bg-surface-container-high text-outline"}`}>
                        {unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-on-surface">{badge.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{unlocked ? badge.description : badge.criteria}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
