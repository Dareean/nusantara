"use client";

import Link from "next/link";
import TopBar from "../../components/TopBar";
import { Award, BadgeCheck, Sparkles, GraduationCap, Play } from "lucide-react";

const achievements = [
  {
    title: "Pionir Salam",
    detail: "Menyelesaikan 3 sesi sapaan dengan benar.",
    Icon: Award,
    tone: "primary",
  },
  {
    title: "Penjaga Adab",
    detail: "Menguasai ungkapan hormat dan etik percakapan.",
    Icon: BadgeCheck,
    tone: "secondary",
  },
  {
    title: "Petualang Budaya",
    detail: "Menyelesaikan 5 quest dalam 7 hari berturut-turut.",
    Icon: Sparkles,
    tone: "tertiary",
  },
  {
    title: "Pejuang Ledo",
    detail: "Konsisten belajar bahasa dan kosakata dasar Kaili.",
    Icon: GraduationCap,
    tone: "primary",
  },
];

export default function AchievementPage() {
  return (
    <>
      <TopBar title="Achievement" subtitle="Prestasi belajar dan progress budaya" />

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
                <div className="text-lg font-black text-[#3e2115]">480</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">Level 3</span>
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">5 hari streak</span>
              <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-bold text-[#492617]">4 badge</span>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Quest selesai</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">14</h2>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Badge aktif</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">4/8</h2>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Misi hari ini</p>
              <h2 className="mt-2 text-2xl font-black text-on-surface">2</h2>
            </div>
          </section>

          <section className="space-y-3">
            {achievements.map((item, index) => {
              const { Icon } = item;
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
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-on-surface">{item.title}</h3>
                        <p className="text-xs text-on-surface-variant">{item.detail}</p>
                      </div>
                    </div>

                    <span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-on-surface-variant">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <div className="flex justify-center pt-1">
            <Link
              href="/dashboard/belajar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d120d] px-4 py-2.5 text-sm font-extrabold text-[#fff7f1] shadow-[0_4px_0_0_#4a2214] transition-all hover:translate-y-[-1px]"
            >
              <Play className="w-4 h-4 fill-current" />
              Kembali ke quest
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
