"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Flame, Gift, Heart, Lock, MapPin, Play, Shield, Sparkles, Star, Trophy, X, Zap } from "lucide-react";
import { getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, ensureDailyQuests, dismissStreakNotification, type UserProgress } from "./progress";

type PathNode = {
  id: number;
  title: string;
  subtitle: string;
  type: "lesson" | "chest" | "review";
  href: string;
  xp: number;
  offset: "left" | "center" | "right";
};

type NodeStatus = "completed" | "active" | "locked";

const pathNodes: PathNode[] = [
  { id: 1, title: "Salam & Adab Tabe", subtitle: "Pelajaran 1 • Kaili Ledo", type: "lesson", href: "/dashboard/latihan/1", xp: 20, offset: "center" },
  { id: 2, title: "Kenali Baju Nggembe", subtitle: "Pelajaran 2 • Busana adat", type: "lesson", href: "/dashboard/latihan/2", xp: 25, offset: "left" },
  { id: 3, title: "Peti Budaya", subtitle: "Reward Bab 1", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "center" },
  { id: 4, title: "Skenario Souraja", subtitle: "Pelajaran 3 • Simulasi bertamu", type: "lesson", href: "/dashboard/latihan/3", xp: 30, offset: "right" },
  { id: 5, title: "Culture Connection", subtitle: "Simulasi Interaktif Mandiri", type: "review", href: "/dashboard/culture-connection", xp: 30, offset: "center" },
  { id: 6, title: "Lencana Tamu Sopan", subtitle: "Penutup Bab 1", type: "review", href: "/dashboard/paspor", xp: 50, offset: "left" },
];

function getNodeStatus(node: PathNode, progress: UserProgress): NodeStatus {
  const allLessonsDone = [1, 2, 3].every((id) => progress.completedLessons.includes(id));
  if (node.id === 1) return progress.completedLessons.includes(1) ? "completed" : "active";
  if (node.id === 2) return progress.completedLessons.includes(2) ? "completed" : progress.unlockedLessons.includes(2) ? "active" : "locked";
  if (node.id === 3) return progress.completedLessons.includes(2) ? "completed" : "locked";
  if (node.id === 4) return progress.completedLessons.includes(3) ? "completed" : progress.unlockedLessons.includes(3) ? "active" : "locked";
  // Culture Connection: optional, unlocks after all 3 lessons
  if (node.id === 5) return progress.completedLessons.includes(99) ? "completed" : allLessonsDone ? "active" : "locked";
  // Final badge node: unlocks after all 3 lessons (does NOT require CC)
  if (node.id === 6) return (progress.badges.includes("Tamu Sopan") || progress.badges.includes("Penjaga Adab")) && allLessonsDone ? "completed" : allLessonsDone ? "active" : "locked";
  return allLessonsDone ? "active" : "locked";
}

function NodeIcon({ node, status }: { node: PathNode; status: NodeStatus }) {
  if (status === "locked") return <Lock className="h-7 w-7" />;
  if (status === "completed") return <Check className="h-8 w-8 stroke-[3]" />;
  if (node.type === "chest") return <Gift className="h-8 w-8" />;
  if (node.type === "review") return <Sparkles className="h-8 w-8" />;
  return <Star className="h-8 w-8 fill-current" />;
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getSession().then(async (session) => {
      if (!session) return;
      setEmail(session.email);
      setProgress(await loadProgress(session.email));
    });
  }, []);

  useEffect(() => {
    if (!email) return;
    const refresh = () => setProgress(readProgress(email));
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, [email]);

  const handleDismissNotification = () => {
    if (!email) return;
    dismissStreakNotification(email);
    setProgress((prev) => ({ ...prev, streakNotification: null }));
  };

  const nodes = pathNodes.map((node) => ({ ...node, status: getNodeStatus(node, progress) }));
  const activeNode = nodes.find((node) => node.status === "active") ?? nodes[nodes.length - 1];
  const dailyXp = Math.min(progress.xp, 50);

  const dailyQuests = ensureDailyQuests(progress).dailyQuests!;

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Unit 1 • Sulawesi Tengah</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Salam, Sapaan &amp; Busana Kaili</h1>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">Satu misi kecil setiap hari. Pelajari bahasanya, rasakan konteksnya.</p>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-secondary-fixed px-3 py-2 text-sm font-black text-on-secondary-fixed sm:flex"><MapPin className="h-4 w-4" />Kaili</div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-5 text-on-primary shadow-[0_6px_0_0_#881f00] sm:px-8">
            <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-fixed">Misi berikutnya</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">{activeNode.title}</h2>
                <p className="mt-1 text-sm font-semibold text-primary-fixed">{activeNode.subtitle} • +{activeNode.xp} XP</p>
              </div>
              <Link href={activeNode.href} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-surface px-5 py-3 text-sm font-black text-primary shadow-[0_3px_0_0_#ffdbd1] transition hover:bg-surface-container"><Play className="h-4 w-4 fill-current" />Mulai misi<ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary-container/50" />
          </section>

          <section className="xl:row-span-2 xl:col-start-1 xl:row-start-2">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant">Roadmap bab</p><h2 className="mt-1 text-xl font-black">Perjalananmu</h2></div>
              <span className="text-sm font-black text-primary">{progress.completedLessons.length}/3 selesai</span>
            </div>

            <div className="relative mx-auto flex min-h-[660px] max-w-2xl flex-col items-center gap-8 overflow-hidden py-8">
              <div className="absolute bottom-10 left-1/2 top-10 w-2 -translate-x-1/2 rounded-full bg-secondary-fixed" aria-hidden="true" />
              {nodes.map((node) => {
                const isActive = node.status === "active";
                const isLocked = node.status === "locked";
                const offset = node.offset === "left" ? "-translate-x-20 sm:-translate-x-28" : node.offset === "right" ? "translate-x-20 sm:translate-x-28" : "translate-x-0";
                return (
                  <div key={node.id} className={`relative z-10 flex flex-col items-center ${offset}`}>
                    {isActive && <span className="absolute -top-9 rounded-full bg-surface-container-lowest px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary shadow-sm ring-1 ring-primary/20">Mulai di sini</span>}
                    {isLocked ? (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-surface bg-surface-container-high text-outline shadow-[0_5px_0_0_#c0b8c4]"><NodeIcon node={node} status={node.status} /></div>
                    ) : (
                      <Link href={node.href} aria-label={node.title} className={`flex h-20 w-20 items-center justify-center rounded-full border-8 border-surface transition-transform hover:scale-105 ${isActive ? "bg-primary text-on-primary shadow-[0_6px_0_0_#881f00] ring-8 ring-primary/15" : "bg-secondary-fixed text-on-secondary-fixed shadow-[0_5px_0_0_#9a6400]"}`}><NodeIcon node={node} status={node.status} /></Link>
                    )}
                    <div className="mt-2 text-center">
                      <p className={`max-w-[170px] text-sm font-black ${isLocked ? "text-on-surface-variant" : "text-on-surface"}`}>{node.title}</p>
                      <p className="mt-0.5 text-xs font-medium text-on-surface-variant">{isLocked ? "Terkunci" : node.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4 xl:col-start-2 xl:row-start-1">
            {/* Streak Notification Banner */}
            {progress.streakNotification && (
              <div
                className={`flex items-start justify-between gap-3 rounded-3xl p-4 ring-1 transition-all ${
                  progress.streakNotification.type === "freeze_used"
                    ? "bg-cyan-500/10 text-cyan-950 dark:text-cyan-100 ring-cyan-500/30"
                    : "bg-amber-500/10 text-amber-950 dark:text-amber-100 ring-amber-500/30"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                    progress.streakNotification.type === "freeze_used"
                      ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-300"
                  }`}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black leading-snug">
                      {progress.streakNotification.message}
                    </p>
                    <p className="mt-1 text-[11px] font-medium opacity-80">
                      {progress.streakNotification.type === "freeze_used"
                        ? "Streak-mu aman dan dipertahankan. Terus belajar setiap hari!"
                        : "Milestone streak tercapai! Maksimal 3 freeze tersimpan."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismissNotification}
                  className="shrink-0 rounded-xl p-1 text-on-surface-variant hover:bg-surface-container transition"
                  title="Tutup notifikasi"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Daily Quests Card */}
            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-on-surface">Misi Harian</h2>
                    <p className="text-[10px] font-bold text-on-surface-variant">Reset setiap 00:00</p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-black text-primary">
                  {dailyQuests.quests.filter((q) => q.completed).length}/3 Selesai
                </span>
              </div>

              {/* Combo Banner */}
              <div className={`mt-3 rounded-2xl p-2.5 text-xs transition-all ${
                dailyQuests.comboClaimed
                  ? "bg-secondary-fixed text-on-secondary-fixed font-black"
                  : "bg-surface-container-low text-on-surface-variant font-bold ring-1 ring-outline-variant/20"
              }`}>
                {dailyQuests.comboClaimed ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                    <span>Kombo 3/3 Selesai (+30 XP Bonus!)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>Kombo 3 Misi:</span>
                    <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-black text-primary text-[10px]">+30 XP</span>
                  </div>
                )}
              </div>

              {/* Quests List */}
              <div className="mt-3 space-y-2.5">
                {dailyQuests.quests.map((quest) => {
                  const percent = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                  return (
                    <div
                      key={quest.id}
                      className={`rounded-2xl p-3 ring-1 transition-all ${
                        quest.completed
                          ? "bg-secondary-fixed/20 ring-secondary-fixed/50"
                          : "bg-surface-container-low ring-outline-variant/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black leading-snug text-on-surface">
                            {quest.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-on-surface-variant">
                            <span>Progress</span>
                            <span>{quest.progress}/{quest.target}</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                quest.completed ? "bg-secondary" : "bg-primary"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <div className="shrink-0 pt-0.5">
                          {quest.completed ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
                              <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-black text-primary ring-1 ring-primary/20">
                              +{quest.xpBonus} XP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-sm text-on-surface">Hari ini</h2>
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-3xl font-black">
                  {progress.streak} <span className="text-sm font-bold text-on-surface-variant">hari streak</span>
                </p>
                <div
                  className="flex items-center gap-1.5 rounded-2xl bg-surface-container-low px-3 py-1.5 ring-1 ring-outline-variant/20"
                  title={`Streak Freeze: ${progress.streakFreezes ?? 0}/3 tersimpan`}
                >
                  <Shield className={`h-4 w-4 ${((progress.streakFreezes ?? 0) > 0) ? "text-secondary" : "text-on-surface-variant/40"}`} />
                  <span className="text-xs font-black text-on-surface">
                    {progress.streakFreezes ?? 0}
                    <span className="text-[10px] font-bold text-on-surface-variant">/3</span>
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>Target XP</span>
                <span>{dailyXp}/50</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${dailyXp * 2}%` }} />
              </div>
            </section>
            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25"><div className="flex items-center justify-between"><h2 className="font-black">Status</h2><Zap className="h-5 w-5 text-secondary" /></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-surface-container-low p-3"><Heart className="h-4 w-4 text-error" /><p className="mt-2 text-lg font-black">{progress.hearts}</p><p className="text-xs font-bold text-on-surface-variant">hearts</p></div><div className="rounded-2xl bg-surface-container-low p-3"><Trophy className="h-4 w-4 text-secondary" /><p className="mt-2 text-lg font-black">{progress.xp}</p><p className="text-xs font-bold text-on-surface-variant">total XP</p></div></div></section>
            <Link href="/dashboard/paspor" className="flex items-center justify-between rounded-3xl bg-secondary-fixed p-5 text-on-secondary-fixed transition hover:brightness-95"><div><p className="text-xs font-black uppercase tracking-[0.14em]">Reward berikutnya</p><p className="mt-1 font-black">Tamu Sopan</p><p className="mt-1 text-xs font-semibold">Buka Paspor Budaya</p></div><ArrowRight className="h-5 w-5" /></Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
