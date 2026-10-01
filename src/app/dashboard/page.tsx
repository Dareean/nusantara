"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Flame,
  Gift,
  Heart,
  Lock,
  MapPin,
  Play,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "./progress";

type PathNode = {
  id: number;
  title: string;
  subtitle: string;
  type: "lesson" | "chest" | "review";
  href: string;
  xp: number;
};

type NodeStatus = "completed" | "active" | "locked";

const pathNodes: PathNode[] = [
  { id: 1, title: "Salam & Adab Tabe", subtitle: "Kaili Ledo", type: "lesson", href: "/dashboard/latihan/1", xp: 20 },
  { id: 2, title: "Sapaan Orang Tua & Kerabat", subtitle: "Kosakata sopan", type: "lesson", href: "/dashboard/latihan/2", xp: 25 },
  { id: 3, title: "Peti Budaya", subtitle: "Reward Bab 1", type: "chest", href: "/dashboard/paspor", xp: 0 },
  { id: 4, title: "Kenali Baju Nggembe", subtitle: "Busana adat", type: "lesson", href: "/dashboard/latihan/3", xp: 30 },
  { id: 5, title: "Skenario Souraja", subtitle: "Culture Connection", type: "review", href: "/dashboard/culture-connection", xp: 30 },
  { id: 6, title: "Lencana Tamu Sopan", subtitle: "Penutup bab", type: "review", href: "/dashboard/paspor", xp: 50 },
];

function getNodeStatus(node: PathNode, progress: UserProgress): NodeStatus {
  if (node.id === 1) return progress.completedLessons.includes(1) ? "completed" : "active";
  if (node.id === 2) {
    if (progress.completedLessons.includes(2)) return "completed";
    return progress.unlockedLessons.includes(2) ? "active" : "locked";
  }
  if (node.id === 3) return progress.completedLessons.includes(2) ? "completed" : "locked";
  if (node.id === 4) {
    if (progress.completedLessons.includes(3)) return "completed";
    return progress.unlockedLessons.includes(3) ? "active" : "locked";
  }
  if (node.id === 5) return progress.unlockedLessons.includes(4) ? "active" : "locked";
  return progress.unlockedLessons.includes(5) ? "active" : "locked";
}

function nodeIcon(node: PathNode, status: NodeStatus) {
  if (status === "locked") return <Lock className="h-5 w-5" />;
  if (status === "completed") return <Check className="h-6 w-6 stroke-[3]" />;
  if (node.type === "chest") return <Gift className="h-6 w-6" />;
  if (node.type === "review") return <Sparkles className="h-6 w-6" />;
  return <Star className="h-6 w-6 fill-current" />;
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

  const nodes = pathNodes.map((node) => ({ ...node, status: getNodeStatus(node, progress) }));
  const activeNode = nodes.find((node) => node.status === "active") ?? nodes[nodes.length - 1];
  const completedCount = progress.completedLessons.length;
  const dailyXp = Math.min(progress.xp, 50);

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section>
          <header className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Unit 1 • Sulawesi Tengah</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Jalur belajar Kaili</h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-on-surface-variant">Satu misi kecil setiap hari. Pelajari bahasanya, rasakan konteksnya.</p>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-secondary-fixed px-3 py-2 text-sm font-black text-on-secondary-fixed sm:flex">
              <MapPin className="h-4 w-4" />
              Kaili
            </div>
          </header>

          <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-on-primary shadow-[0_6px_0_0_#881f00] sm:p-8">
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-fixed">Lanjutkan misi</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{activeNode.title}</h2>
              <p className="mt-2 text-sm font-semibold text-primary-fixed">{activeNode.subtitle} • {activeNode.xp > 0 ? `+${activeNode.xp} XP` : "Reward"}</p>
              <Link href={activeNode.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface px-5 py-3 text-sm font-black text-primary shadow-[0_3px_0_0_#ffdbd1] transition hover:bg-surface-container">
                <Play className="h-4 w-4 fill-current" />
                Mulai misi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-primary-container/60" />
            <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-primary-container/30" />
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant">Progress bab</p>
                <h2 className="mt-1 text-xl font-black">Salam, sapaan &amp; busana</h2>
              </div>
              <span className="text-sm font-black text-primary">{completedCount}/3 selesai</span>
            </div>

            <div className="relative space-y-3">
              <div className="absolute bottom-7 left-6 top-7 w-0.5 bg-outline-variant/40" aria-hidden="true" />
              {nodes.map((node) => (
                <div key={node.id} className="relative flex items-center gap-4">
                  <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 ${node.status === "active" ? "border-primary bg-primary text-on-primary shadow-[0_4px_0_0_#881f00]" : node.status === "completed" ? "border-secondary bg-secondary-fixed text-on-secondary-fixed" : "border-surface-container-high bg-surface-container text-outline"}`}>
                    {nodeIcon(node, node.status)}
                  </div>
                  <div className={`flex min-w-0 flex-1 items-center justify-between gap-4 rounded-2xl px-4 py-3 ${node.status === "active" ? "bg-primary-fixed/30 ring-1 ring-primary/20" : "bg-surface-container-low"}`}>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-black ${node.status === "locked" ? "text-on-surface-variant" : "text-on-surface"}`}>{node.title}</p>
                      <p className="mt-0.5 truncate text-xs font-medium text-on-surface-variant">{node.subtitle}</p>
                    </div>
                    {node.status === "locked" ? (
                      <span className="shrink-0 text-xs font-black text-outline">Terkunci</span>
                    ) : (
                      <Link href={node.href} className="shrink-0 text-xs font-black text-primary hover:underline">{node.status === "completed" ? "Ulangi" : "Mulai"}</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4 xl:pt-16">
          <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Hari ini</h2>
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-5 text-3xl font-black text-on-surface">{progress.streak} <span className="text-sm text-on-surface-variant">hari streak</span></p>
            <div className="mt-5 flex items-center justify-between text-xs font-bold text-on-surface-variant"><span>Target XP</span><span>{dailyXp}/50</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-secondary" style={{ width: `${dailyXp * 2}%` }} /></div>
          </section>

          <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
            <div className="flex items-center justify-between"><h2 className="font-black">Status</h2><Zap className="h-5 w-5 text-secondary" /></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-container-low p-3"><Heart className="h-4 w-4 text-error" /><p className="mt-2 text-lg font-black">{progress.hearts}</p><p className="text-xs font-bold text-on-surface-variant">hearts</p></div>
              <div className="rounded-2xl bg-surface-container-low p-3"><Trophy className="h-4 w-4 text-secondary" /><p className="mt-2 text-lg font-black">{progress.xp}</p><p className="text-xs font-bold text-on-surface-variant">total XP</p></div>
            </div>
          </section>

          <Link href="/dashboard/paspor" className="flex items-center justify-between rounded-3xl bg-secondary-fixed p-5 text-on-secondary-fixed transition hover:brightness-95">
            <div><p className="text-xs font-black uppercase tracking-[0.14em]">Reward berikutnya</p><p className="mt-1 font-black">Tamu Sopan</p><p className="mt-1 text-xs font-semibold">Buka Paspor Budaya</p></div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
