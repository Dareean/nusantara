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
} from "lucide-react";
import { getSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, type UserProgress } from "../progress";

const learningTracks = [
  { title: "Bahasa Ledo", progress: 82, tag: "Active" },
  { title: "Adab & sapaan", progress: 100, tag: "Done" },
  { title: "Busana adat", progress: 35, tag: "Next" },
];

const achievements = [
  { title: "Pionir Salam", detail: "3 sesi sapaan selesai", Icon: Award },
  { title: "Penjaga Adab", detail: "12 ekspresi hormat dikuasai", Icon: BadgeCheck },
  { title: "Petualang Budaya", detail: "5 quest diselesaikan", Icon: Sparkles },
  { title: "Riset Ledo", detail: "1 mini challenge selesai", Icon: GraduationCap },
];

export default function ProfilPage() {
  const [userName, setUserName] = useState("Pelajar LARAS");
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    getSession().then(async (session) => {
      if (!session) return;
      setUserName(session.name);
      setProgress(await loadProgress(session.email));
    });
  }, []);

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
                      {track.tag}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${track.title === "Adab & sapaan" && progress.completedLessons.includes(1) ? 100 : track.progress}%` }}
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
              {achievements.map((item) => {
                const { Icon } = item;
                return (
                  <div key={item.title} className="rounded-[18px] bg-surface-container p-3 ring-1 ring-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-on-surface">{item.title}</p>
                        <p className="text-[11px] text-on-surface-variant">{item.detail}</p>
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
