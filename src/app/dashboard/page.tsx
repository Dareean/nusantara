"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Flame,
  Gamepad2,
  Gift,
  Heart,
  Landmark,
  Lock,
  MapPin,
  Play,
  Shirt,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "./progress";
import { getStoredSessions } from "../components/game-engine/sessionStore";

type PathNode = {
  id: number | string;
  title: string;
  subtitle: string;
  type: "lesson" | "chest" | "review";
  href: string;
  xp: number;
  offset: "left" | "center" | "right";
  status?: NodeStatus;
};

const BUILTIN_SESSION_IDS = new Set(["SES-KL-MASTER-001", "SES-LALOVE-002"]);

type NodeStatus = "completed" | "active" | "locked";

const pathNodes: PathNode[] = [
  { id: 1, title: "Salam & Adab Tabe", subtitle: "Pelajaran 1 • Kaili Ledo", type: "lesson", href: "/dashboard/latihan/1", xp: 20, offset: "center" },
  { id: 2, title: "Kenali Baju Nggembe", subtitle: "Pelajaran 2 • Busana adat", type: "lesson", href: "/dashboard/latihan/2", xp: 25, offset: "left" },
  { id: 3, title: "Peti Budaya", subtitle: "Reward Bab 1", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "center" },
  { id: 4, title: "Skenario Souraja", subtitle: "Pelajaran 3 • Rumah adat", type: "lesson", href: "/dashboard/latihan/3", xp: 30, offset: "right" },
  { id: 5, title: "Culture Connection: Upacara Adat", subtitle: "Simulasi • Pernikahan adat Kaili", type: "review", href: "/dashboard/culture-connection", xp: 30, offset: "center" },
  { id: 6, title: "Lencana Tamu Sopan", subtitle: "Penutup Bab 1", type: "review", href: "/dashboard/paspor", xp: 50, offset: "left" },
];

function getNodeStatus(node: PathNode, progress: UserProgress): NodeStatus {
  if (node.id === 1) return progress.completedLessons.includes(1) ? "completed" : "active";
  if (node.id === 2) return progress.completedLessons.includes(2) ? "completed" : progress.unlockedLessons.includes(2) ? "active" : "locked";
  if (node.id === 3) return progress.completedLessons.includes(2) ? "completed" : progress.completedLessons.includes(1) ? "active" : "locked";
  if (node.id === 4) return progress.completedLessons.includes(3) ? "completed" : progress.unlockedLessons.includes(3) ? "active" : "locked";
  if (node.id === 5) return progress.unlockedLessons.includes(4) ? "active" : "locked";
  return progress.unlockedLessons.includes(5) ? "active" : "locked";
}

function NodeIcon({ node, status }: { node: PathNode; status: NodeStatus }) {
  if (status === "completed") {
    return <Check className="h-8 w-8 stroke-[3.5] text-on-primary" />;
  }
  if (status === "locked") {
    return <Lock className="h-7 w-7 text-outline" />;
  }
  // status === "active"
  if (String(node.id).startsWith("curator-")) {
    return <Gamepad2 className="h-8 w-8 text-on-primary" />;
  }
  if (node.id === 1) {
    return <BookOpen className="h-8 w-8 text-on-primary" />;
  }
  if (node.id === 2) {
    return <Shirt className="h-8 w-8 text-on-primary" />;
  }
  if (node.id === 3 || node.type === "chest") {
    return <Gift className="h-8 w-8 text-on-primary" />;
  }
  if (node.id === 4) {
    return <Landmark className="h-8 w-8 text-on-primary" />;
  }
  if (node.id === 5) {
    return <Star className="h-8 w-8 fill-current text-on-primary" />;
  }
  if (node.id === 6 || node.type === "review") {
    return <Award className="h-8 w-8 text-on-primary" />;
  }
  return <Star className="h-8 w-8 fill-current text-on-primary" />;
}

const AMPLITUDE_DESKTOP = [0, 56, 88, 56, 0, -56, -88, -56];
const AMPLITUDE_MOBILE = [0, 22, 35, 22, 0, -22, -35, -22];

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [email, setEmail] = useState("");
  const [curatorNodes, setCuratorNodes] = useState<PathNode[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    getSession().then(async (session) => {
      if (!session) return;
      setEmail(session.email);
      setProgress(await loadProgress(session.email));
    });

    try {
      const stored = getStoredSessions();
      const custom = stored.filter((s) => !BUILTIN_SESSION_IDS.has(s.id));
      const offsets: ("right" | "center" | "left")[] = ["right", "center", "left"];
      const dynamic: PathNode[] = custom.map((s, idx) => ({
        id: `curator-${s.id}`,
        title: s.title || "Sesi Kurator",
        subtitle: "Sesi Kurator • Game Engine",
        type: "lesson",
        href: `/dashboard/belajar/${s.id}`,
        xp: s.xpReward || 30,
        offset: offsets[idx % offsets.length],
        status: "active",
      }));
      setCuratorNodes(dynamic);
    } catch (err) {
      console.error("Gagal membaca sesi kurator:", err);
    }
  }, []);

  useEffect(() => {
    if (!email) return;
    const refresh = () => setProgress(readProgress(email));
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, [email]);

  const baseNodes = pathNodes.map((node) => ({ ...node, status: getNodeStatus(node, progress) }));
  const dynamicNodes = curatorNodes.map((node) => ({ ...node, status: "active" as NodeStatus }));
  const nodes = [...baseNodes, ...dynamicNodes];
  const activeNode = nodes.find((node) => node.status === "active") ?? nodes[nodes.length - 1];
  const dailyXp = Math.min(progress.xp, 50);

  // Perhitungan layout sinusoidal jalur & koordinat node
  const containerWidth = isMobile ? 320 : 440;
  const centerX = containerWidth / 2;
  const stepY = 124;
  const startY = 64;
  const offsets = isMobile ? AMPLITUDE_MOBILE : AMPLITUDE_DESKTOP;
  const totalRoadmapHeight = startY + nodes.length * stepY + 40;

  const activeIndex = nodes.findIndex((node) => node.status === "active");
  const effectiveActiveIdx = activeIndex !== -1 ? activeIndex : 0;
  const activeNodeY = startY + effectiveActiveIdx * stepY;
  const activeOffset = offsets[effectiveActiveIdx % offsets.length];
  const progressRatio = Math.min(1, Math.max(0, progress.completedLessons.length / 3));

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Unit */}
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Unit 1 • Sulawesi Tengah</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Salam, Sapaan &amp; Busana Kaili</h1>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">Satu misi kecil setiap hari. Pelajari bahasanya, rasakan konteksnya.</p>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-secondary-fixed px-3 py-2 text-sm font-black text-on-secondary-fixed sm:flex">
            <MapPin className="h-4 w-4" />
            Kaili
          </div>
        </header>

        {/* 3-Zone Layout: Left Sidebar (Fixed) | Center Scroll (max-w-[560px]) | Right Rail (Sticky) */}
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] items-start">
          {/* Kolom Tengah (Terpusat, Maksimal 560px) */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[560px]">
              {/* Sticky Unit Banner */}
              <div className="sticky top-0 z-30 pt-1 pb-3 bg-surface/90 backdrop-blur-md">
                <div className="rounded-2xl bg-surface-container-lowest p-4 sm:p-5 border-2 border-outline-variant/30 shadow-[0_4px_0_0_#e8ded8] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary truncate">
                      Unit 1 • SULAWESI TENGAH
                    </p>
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-on-surface truncate mt-0.5">
                      Salam, Sapaan &amp; Busana Kaili
                    </h2>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black">
                      {progress.completedLessons.length}/3 selesai
                    </span>
                  </div>
                </div>
              </div>

              {/* Tablet & Mobile Accent Card: tampil di bawah banner unit di layar < lg */}
              <div className="lg:hidden mb-4 rounded-2xl overflow-hidden bg-surface-container-lowest border-2 border-outline-variant/30 shadow-xs flex items-center gap-3 p-2.5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnqzf4AUY4GtDvGFESMzw5vK14-0xCr_-CqqKyHzgObssX2HonjZALyMHyv39OWxApYxC7Qh-I_QL8HUz0P49aJ6BzYjxVwjXJHDsRyqGQ94Fcy6GzwgtD7xsDzDMpUvUCL8cjccCPgdt2Y3tLKFkDkPWH3ofPYJMVw67VqH8tQ8M2Lij3qg990UKy62hGgrC7qGw0SSgnFIpN5YHUA0es_BtlcATm5jgXKQfrCE10dXoeDE-lLZQMbw"
                  alt="Souraja Rumah Adat Kaili"
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-primary uppercase tracking-wider">
                    Artefak Budaya
                  </span>
                  <p className="text-xs font-black text-on-surface truncate">
                    Souraja — rumah adat Kaili
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate">
                    Pusat adab &amp; diplomasi Banua Oge
                  </p>
                </div>
              </div>

              {/* Misi Berikutnya Hero Banner */}
              <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-5 text-on-primary shadow-[0_6px_0_0_#881f00] sm:px-8 mb-6">
                <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-fixed">Misi berikutnya</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">{activeNode.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-primary-fixed">{activeNode.subtitle} • +{activeNode.xp} XP</p>
                  </div>
                  <Link
                    href={activeNode.href}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-surface px-5 py-3 text-sm font-black text-primary shadow-[0_3px_0_0_#ffdbd1] transition hover:bg-surface-container"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Mulai misi
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary-container/50" />
              </section>

              {/* Roadmap Canvas: Jalur Sinusoidal + Node Lingkaran Faux-3D */}
              <div
                className="relative mx-auto"
                style={{ width: `${containerWidth}px`, height: `${totalRoadmapHeight}px` }}
              >
                {/* Jalur SVG Melengkung Halus Melewati Titik Pusat Setiap Node */}
                <svg
                  className="absolute inset-0 pointer-events-none z-0"
                  viewBox={`0 0 ${containerWidth} ${totalRoadmapHeight}`}
                  style={{ width: `${containerWidth}px`, height: `${totalRoadmapHeight}px` }}
                >
                  {nodes.slice(0, -1).map((_, i) => {
                    const x1 = centerX + offsets[i % offsets.length];
                    const y1 = startY + i * stepY;
                    const x2 = centerX + offsets[(i + 1) % offsets.length];
                    const y2 = startY + (i + 1) * stepY;
                    const cy1 = y1 + stepY * 0.5;
                    const cy2 = y2 - stepY * 0.5;
                    const d = `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
                    const isSegmentCompleted = nodes[i].status === "completed" && nodes[i + 1].status === "completed";

                    return (
                      <path
                        key={`seg-${i}`}
                        d={d}
                        fill="none"
                        stroke={isSegmentCompleted ? "#881f00" : "#d8c7be"}
                        strokeWidth={isSegmentCompleted ? 5 : 4}
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {/* Desktop Accent Card (sejajar dengan node active) */}
                <div
                  style={{ top: `${Math.max(20, activeNodeY - 40)}px` }}
                  className={`absolute z-10 hidden lg:flex flex-col w-[170px] xl:w-[190px] rounded-2xl overflow-hidden bg-surface-container-lowest border-2 border-outline-variant/30 shadow-md ${
                    activeOffset > 0 ? "-left-44 xl:-left-48" : "-right-44 xl:-right-48"
                  }`}
                >
                  <div className="relative h-24 w-full overflow-hidden bg-surface-container-high">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnqzf4AUY4GtDvGFESMzw5vK14-0xCr_-CqqKyHzgObssX2HonjZALyMHyv39OWxApYxC7Qh-I_QL8HUz0P49aJ6BzYjxVwjXJHDsRyqGQ94Fcy6GzwgtD7xsDzDMpUvUCL8cjccCPgdt2Y3tLKFkDkPWH3ofPYJMVw67VqH8tQ8M2Lij3qg990UKy62hGgrC7qGw0SSgnFIpN5YHUA0es_BtlcATm5jgXKQfrCE10dXoeDE-lLZQMbw"
                      alt="Souraja Rumah Adat Kaili"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-black text-white uppercase tracking-wider">
                      Kultur Kaili
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-black text-on-surface leading-tight">
                      Souraja — rumah adat Kaili
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 line-clamp-1">
                      Pusat adab &amp; diplomasi Banua Oge
                    </p>
                  </div>
                </div>

                {/* Node-Node Lingkaran Faux-3D */}
                {nodes.map((node, i) => {
                  const isActive = node.status === "active";
                  const isPrimaryActive = node.id === activeNode.id;
                  const isLocked = node.status === "locked";
                  const isCompleted = node.status === "completed";

                  const x = centerX + offsets[i % offsets.length];
                  const y = startY + i * stepY;

                  return (
                    <div
                      key={node.id}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onFocus={() => setHoveredNodeId(node.id)}
                      onBlur={() => setHoveredNodeId(null)}
                    >
                      {/* Active Gelembung "MULAI" yang memantul halus */}
                      {isPrimaryActive && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 animate-bounce motion-reduce:animate-none">
                          <div className="relative px-3 py-1 rounded-full bg-primary text-on-primary text-[11px] font-black uppercase tracking-wider shadow-[0_3px_0_0_#881f00] whitespace-nowrap flex items-center gap-1 select-none">
                            <span>MULAI</span>
                            <span
                              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-primary"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      )}

                      {/* Active Cincin Progres SVG */}
                      {isPrimaryActive && (
                        <svg
                          className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] -rotate-90 pointer-events-none"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            className="stroke-primary/20"
                            strokeWidth="5"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            className="stroke-primary transition-all duration-500"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={276.46}
                            strokeDashoffset={276.46 * (1 - progressRatio)}
                          />
                        </svg>
                      )}

                      {/* Chunky Faux-3D Button / Container */}
                      {isLocked ? (
                        <div
                          tabIndex={0}
                          aria-label={`${node.title} (Terkunci)`}
                          className="flex h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] items-center justify-center rounded-full bg-surface-container-high text-outline shadow-[0_5px_0_0_#c0b8c4] cursor-not-allowed select-none border-4 border-surface"
                        >
                          <NodeIcon node={node} status={node.status} />
                        </div>
                      ) : (
                        <Link
                          href={node.href}
                          aria-label={`${node.title} (${isCompleted ? "Selesai" : "Mulai"})`}
                          className={`flex h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] items-center justify-center rounded-full border-4 border-surface transition-all select-none active:translate-y-[2px] ${
                            isCompleted
                              ? "bg-primary text-on-primary shadow-[0_5px_0_0_#881f00] hover:brightness-105 active:shadow-[0_3px_0_0_#881f00]"
                              : "bg-primary text-on-primary shadow-[0_6px_0_0_#881f00] hover:brightness-105 active:shadow-[0_4px_0_0_#881f00]"
                          }`}
                        >
                          <NodeIcon node={node} status={node.status} />
                        </Link>
                      )}

                      {/* Tooltip Hover / Focus Popover */}
                      <div
                        className={`absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 z-30 transition-all duration-200 pointer-events-none ${
                          hoveredNodeId === node.id
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-1 scale-95"
                        }`}
                      >
                        <div className="w-56 sm:w-64 rounded-2xl bg-surface-container-lowest p-3.5 shadow-xl border-2 border-outline-variant/40 text-center flex flex-col items-center">
                          <div className="flex items-center gap-1.5 mb-1">
                            {isCompleted && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                Selesai ✓
                              </span>
                            )}
                            {isActive && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-on-primary">
                                Misi Aktif
                              </span>
                            )}
                            {isLocked && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high text-outline">
                                Terkunci
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-black text-on-surface line-clamp-1">{node.title}</p>
                          <p className="text-xs font-semibold text-on-surface-variant mt-0.5">
                            {node.subtitle} • +{node.xp} XP
                          </p>
                          <p className="text-[11px] font-bold mt-2 pt-2 border-t border-outline-variant/20 w-full text-center">
                            {isActive && <span className="text-primary font-black">Klik untuk mulai materi →</span>}
                            {isCompleted && <span className="text-on-surface-variant">Klik untuk mengulang materi</span>}
                            {isLocked && <span className="text-outline">Selesaikan pelajaran sebelumnya</span>}
                          </p>
                          <span
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-surface-container-lowest"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rail Kanan Sticky: tetap diam saat konten tengah discroll */}
          <aside className="space-y-4 xl:sticky xl:top-6 self-start w-full">
            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
              <div className="flex items-center justify-between">
                <h2 className="font-black">Hari ini</h2>
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-5 text-3xl font-black">
                {progress.streak} <span className="text-sm text-on-surface-variant">hari streak</span>
              </p>
              <div className="mt-5 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>Target XP</span>
                <span>{dailyXp}/50</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${dailyXp * 2}%` }} />
              </div>
            </section>

            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
              <div className="flex items-center justify-between">
                <h2 className="font-black">Status</h2>
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <Heart className="h-4 w-4 text-error" />
                  <p className="mt-2 text-lg font-black">{progress.hearts}</p>
                  <p className="text-xs font-bold text-on-surface-variant">hearts</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <Trophy className="h-4 w-4 text-secondary" />
                  <p className="mt-2 text-lg font-black">{progress.xp}</p>
                  <p className="text-xs font-bold text-on-surface-variant">total XP</p>
                </div>
              </div>
            </section>

            <Link
              href="/dashboard/paspor"
              className="flex items-center justify-between rounded-3xl bg-secondary-fixed p-5 text-on-secondary-fixed transition hover:brightness-95"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em]">Reward berikutnya</p>
                <p className="mt-1 font-black">Tamu Sopan</p>
                <p className="mt-1 text-xs font-semibold">Buka Paspor Budaya</p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </aside>
        </div>

        {/* Strip Logo Munas IX & Permikomnas untuk Mobile (Sidebar tidak tampil di < md) */}
        <div className="mt-12 pt-6 border-t border-outline-variant/30 flex md:hidden flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white shadow-xs border border-outline-variant/30">
            <img
              src="/logo-munas-ix.png"
              alt="Logo Munas IX PERMIKOMNAS"
              className="h-8 w-8 object-contain"
            />
            <img
              src="/logo-permikomnas.png"
              alt="Logo Permikomnas RI"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
            Munas IX • PERMIKOMNAS RI
          </span>
        </div>
      </div>
    </main>
  );
}
