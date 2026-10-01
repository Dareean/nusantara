"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Heart,
  Star,
  BookOpen,
  Shirt,
  Sparkles,
  Gift,
  Lock,
  Check,
  Play,
  ArrowRight,
  Trophy,
  Volume2,
} from "lucide-react";
import { getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "./progress";

interface PathNode {
  id: number;
  title: string;
  subtitle: string;
  type: "lesson" | "attire" | "chest" | "review";
  status: "completed" | "active" | "locked";
  offset: "center" | "left" | "right";
  href: string;
  xp: number;
}

const pathNodes: PathNode[] = [
  {
    id: 1,
    title: "Salam & Adab Tabe",
    subtitle: "Pelajaran 1 • Kaili Ledo",
    type: "lesson",
    status: "completed",
    offset: "center",
    href: "/dashboard/latihan/1",
    xp: 15,
  },
  {
    id: 2,
    title: "Sapaan Orang Tua & Kerabat",
    subtitle: "Pelajaran 2 • Kosakata Sopan",
    type: "lesson",
    status: "completed",
    offset: "left",
    href: "/dashboard/latihan/2",
    xp: 15,
  },
  {
    id: 3,
    title: "Peti Budaya: Kosakata Rahasia",
    subtitle: "Hadiah Milestone Bab 1",
    type: "chest",
    status: "completed",
    offset: "center",
    href: "/dashboard/paspor",
    xp: 25,
  },
  {
    id: 4,
    title: "Kenali Anatomi Baju Nggembe",
    subtitle: "Pelajaran 3 • Busana Adat",
    type: "attire",
    status: "active",
    offset: "right",
    href: "/dashboard/latihan/3",
    xp: 20,
  },
  {
    id: 5,
    title: "Skenario Souraja Adat",
    subtitle: "Pelajaran 4 • Culture Connection",
    type: "review",
    status: "locked",
    offset: "center",
    href: "/dashboard/latihan/3",
    xp: 30,
  },
  {
    id: 6,
    title: "Ujian Kelulusan Bab 1",
    subtitle: "Pelajaran 5 • Lencana Paspor",
    type: "lesson",
    status: "locked",
    offset: "left",
    href: "/dashboard/evaluasi",
    xp: 50,
  },
];

export default function DashboardPage() {
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    let email = "";
    getSession().then(async (session) => {
      email = session?.email ?? "";
      if (email) setProgress(await loadProgress(email));
    });
    const refresh = () => {
      if (email) setProgress(readProgress(email));
    };
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, []);

  const getNodeStatus = (node: PathNode): PathNode["status"] => {
    if (node.id === 1) return progress.completedLessons.includes(1) ? "completed" : "active";
    if (node.id === 2) {
      if (progress.completedLessons.includes(2)) return "completed";
      return progress.unlockedLessons.includes(2) ? "active" : "locked";
    }
    if (node.id === 3) return progress.completedLessons.includes(2) ? "completed" : "locked";
    if (node.id === 4) return progress.unlockedLessons.includes(3) ? "active" : "locked";
    if (node.id === 5) return progress.unlockedLessons.includes(4) ? "active" : "locked";
    return progress.unlockedLessons.includes(5) ? "active" : "locked";
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col xl:flex-row justify-center max-w-7xl mx-auto">
      {/* ── CENTRAL COLUMN: Duolingo Snake Learning Path ── */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col items-center">
        {/* Sticky Unit Header Banner */}
        <div className="w-full bg-primary text-on-primary rounded-3xl p-5 mb-8 shadow-[0_5px_0_0_#881f00] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-primary-fixed block">
              Unit 1 • Sulawesi Tengah
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
              Salam, Sapaan &amp; Busana Kaili
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-primary-fixed mt-1">
              Kuasai adab bertutur santun dan filosofi Baju Nggembe.
            </p>
          </div>
          <Link
            href="/dashboard/culture-connection"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface text-primary font-black text-xs uppercase tracking-wider shadow-[0_3px_0_0_#ffdbd1] hover:bg-surface-container active:translate-y-0.5 transition-all shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan</span>
          </Link>
        </div>

        {/* Learning Path Nodes (Snake / Zigzag) */}
        <div className="w-full flex flex-col items-center space-y-7 relative pb-28">
          {pathNodes.map((node) => {
            const currentNode = { ...node, status: getNodeStatus(node) };
            const isCompleted = currentNode.status === "completed";
            const isActive = currentNode.status === "active";
            const isLocked = currentNode.status === "locked";

            // Horizontal alignment offset to create the Duolingo S-curve
            const offsetClass =
              node.offset === "left"
                ? "-translate-x-12 sm:-translate-x-16"
                : node.offset === "right"
                ? "translate-x-12 sm:translate-x-16"
                : "translate-x-0";

            return (
              <div
                key={node.id}
                className={`relative flex flex-col items-center ${offsetClass} transition-transform`}
              >
                {/* Active Floating Speech Bubble */}
                {isActive && (
                  <div className="absolute -top-12 z-20 animate-bounce">
                    <div className="bg-surface-container-lowest border-2 border-primary/30 px-3.5 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5 font-black text-xs text-primary uppercase tracking-wider whitespace-nowrap">
                      <span>MULAI!</span>
                      <Play className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                )}

                {/* The 3D Tactile Node Button */}
                <button
                  onClick={() => setSelectedNode(currentNode)}
                  disabled={isLocked}
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all cursor-pointer select-none active:translate-y-1 ${
                    isActive
                      ? "bg-primary text-on-primary shadow-[0_6px_0_0_#881f00] ring-8 ring-primary/20 scale-105 active:shadow-[0_2px_0_0_#881f00]"
                      : isCompleted
                      ? "bg-secondary-container text-on-secondary-container shadow-[0_5px_0_0_#684000] active:shadow-[0_2px_0_0_#684000]"
                      : "bg-surface-container-high text-outline shadow-[0_5px_0_0_#c0b8c4] active:shadow-[0_2px_0_0_#c0b8c4]"
                  }`}
                  aria-label={node.title}
                >
                  {node.type === "chest" ? (
                    <Gift className="w-9 h-9" />
                  ) : node.type === "attire" ? (
                    <Shirt className="w-9 h-9" />
                  ) : isCompleted ? (
                    <Check className="w-10 h-10 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="w-8 h-8" />
                  ) : (
                    <Star className="w-9 h-9 fill-current" />
                  )}
                </button>

                {/* Tiny node label */}
                <span className="text-[11px] font-black text-on-surface-variant mt-2 text-center max-w-[120px] line-clamp-1">
                  {node.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Modal Popover when Node is Clicked (Duolingo Style Card) */}
        {selectedNode && (
          <div className="fixed inset-x-4 bottom-20 md:bottom-8 max-w-md mx-auto z-50 bg-surface-container-lowest border-2 border-outline-variant/40 rounded-3xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  {selectedNode.subtitle}
                </span>
                <h3 className="text-lg font-black text-on-surface mt-0.5">
                  {selectedNode.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-black text-xs shrink-0">
                +{selectedNode.xp} XP
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={selectedNode.href}
                className="flex-1 text-center py-3 px-4 rounded-2xl bg-primary text-on-primary font-black text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <span>{selectedNode.status === "completed" ? "Latih Ulang" : "Mulai Belajar"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setSelectedNode(null)}
                className="py-3 px-4 rounded-2xl bg-surface-container text-on-surface font-black text-sm uppercase tracking-wider hover:bg-surface-container-high active:translate-y-1 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN: Duolingo Gamification Stats & Quest Sidebar ── */}
      <aside className="w-full xl:w-80 px-4 py-6 md:py-8 flex flex-col gap-6 shrink-0 border-t-2 xl:border-t-0 xl:border-l-2 border-outline-variant/20">
        {/* Top Status Indicators (Flame, XP, Hearts) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant/30 shadow-sm">
          {/* Region */}
          <div className="flex items-center gap-1.5 text-xs font-black text-on-surface">
            <span className="text-base">🏝️</span>
            <span>KAILI</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1 text-primary font-black text-sm">
            <Flame className="w-5 h-5 fill-current" />
            <span>{progress.streak}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1 text-secondary font-black text-sm">
            <Zap className="w-5 h-5 fill-current" />
            <span>{progress.xp}</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1 text-error font-black text-sm">
            <Heart className="w-5 h-5 fill-current" />
            <span>{progress.hearts}</span>
          </div>
        </div>

        {/* Daily Quests Box */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant/30 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-on-surface tracking-tight">
              Target Harian
            </h3>
            <Link
              href="/dashboard/paspor"
              className="text-xs font-black uppercase tracking-wider text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Quest 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" />
                Dapatkan 50 XP hari ini
              </span>
              <span className="text-on-surface-variant font-mono">{Math.min(progress.xp, 50)}/50</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: `${Math.min(progress.xp * 2, 100)}%` }} />
            </div>
          </div>

          {/* Quest 2 */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/20">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                Selesaikan 1 sesi audio Tabe
              </span>
              <span className="text-primary font-black">SELESAI ✓</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Mini Cultural Artifact Spotlight */}
        <div className="bg-surface-container-lowest border-2 border-outline-variant/30 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h3 className="font-black text-base text-on-surface tracking-tight">
              Artefak Terbuka
            </h3>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary text-2xl shrink-0">
              👔
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm text-on-surface truncate">
                Baju Nggembe &amp; Buya Sabe
              </p>
              <p className="text-xs text-on-surface-variant font-medium">
                Pakaian resmi putri Kaili
              </p>
            </div>
          </div>
        </div>

        {/* Paspor Budaya Shortcut */}
        <div className="bg-gradient-to-br from-primary/10 via-surface-container-low to-secondary/10 border-2 border-primary/20 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-on-surface">Paspor Budaya</h4>
              <p className="text-xs text-on-surface-variant font-semibold">Tingkat 1: Penutur Muda</p>
            </div>
          </div>
          <Link
            href="/dashboard/paspor"
            className="p-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-primary hover:bg-surface-container transition-all"
            aria-label="Buka Paspor Budaya"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
