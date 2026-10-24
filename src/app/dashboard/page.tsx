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
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react";
import { getCachedSessionSync, getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "./progress";
import { getStoredSessions, syncSessionsFromServer } from "../components/game-engine/sessionStore";

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

const BUILTIN_SESSION_IDS = new Set(["SES-KL-MASTER-001", "SES-LALOVE-002", "1", "2", "3"]);

type NodeStatus = "completed" | "active" | "locked";

const pathNodes: PathNode[] = [
  { id: 1, title: "Salam & Adab Tabe", subtitle: "Pelajaran 1 • Kaili Ledo", type: "lesson", href: "/dashboard/latihan/1", xp: 20, offset: "center" },
  { id: 2, title: "Kenali Baju Nggembe", subtitle: "Pelajaran 2 • Busana adat", type: "lesson", href: "/dashboard/latihan/2", xp: 25, offset: "left" },
  { id: 3, title: "Peti Budaya", subtitle: "Reward Bab 1", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "center" },
  { id: 4, title: "Skenario Souraja", subtitle: "Pelajaran 3 • Rumah adat", type: "lesson", href: "/dashboard/latihan/3", xp: 30, offset: "right" },
  { id: 5, title: "Culture Connection: Upacara Adat", subtitle: "Simulasi • Pernikahan adat Kaili", type: "review", href: "/dashboard/culture-connection", xp: 30, offset: "center" },
  { id: 6, title: "Cap Paspor Tamu Sopan", subtitle: "Penutup Bab 1", type: "review", href: "/dashboard/paspor", xp: 50, offset: "left" },
];

function getNodeStatus(node: PathNode, progress: UserProgress): NodeStatus {
  if (node.id === 1) return progress.completedLessons.includes(1) ? "completed" : "active";
  if (node.id === 2) return progress.completedLessons.includes(2) ? "completed" : progress.unlockedLessons.includes(2) ? "active" : "locked";
  if (node.id === 3) return progress.completedLessons.includes(2) ? "completed" : progress.completedLessons.includes(1) ? "active" : "locked";
  if (node.id === 4) return progress.completedLessons.includes(3) ? "completed" : progress.unlockedLessons.includes(3) ? "active" : "locked";
  if (node.id === 5) return progress.completedLessons.includes(4) ? "completed" : progress.unlockedLessons.includes(4) ? "active" : "locked";
  return progress.badges.includes("Tamu Sopan") || progress.completedLessons.includes(4)
    ? "completed"
    : progress.unlockedLessons.includes(5)
      ? "active"
      : "locked";
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

// Offset horizontal meliuk simetris kiri–kanan berirama tanpa drift diagonal
const SINE_OFFSETS_DESKTOP = [0, 40, 70, 40, 0, -40, -70, -40];
const SINE_OFFSETS_MOBILE = [0, 24, 42, 24, 0, -24, -42, -24];

/**
 * Konversi rangkaian titik tengah node menjadi segmen kurva Bézier kubik Catmull-Rom mulus.
 * Menghasilkan kurva C1 kontinu tanpa sudut patah di setiap node.
 */
function getCatmullRomSegments(pts: { x: number; y: number }[]): string[] {
  if (pts.length < 2) return [];
  const segments: string[] = [];

  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];

    const p0 = i > 0 ? pts[i - 1] : { x: p1.x - (p2.x - p1.x) * 0.5, y: p1.y - (p2.y - p1.y) * 0.5 };
    const p3 = i < pts.length - 2 ? pts[i + 2] : { x: p2.x + (p2.x - p1.x) * 0.5, y: p2.y + (p2.y - p1.y) * 0.5 };

    const k = 1 / 6;
    const cp1x = p1.x + (p2.x - p0.x) * k;
    const cp1y = p1.y + (p2.y - p0.y) * k;
    const cp2x = p2.x - (p3.x - p1.x) * k;
    const cp2y = p2.y - (p3.y - p1.y) * k;

    segments.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }
  return segments;
}


export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [curatorNodes, setCuratorNodes] = useState<PathNode[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionTitles, setSessionTitles] = useState<Record<string, { title: string; xp: number }>>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const cached = getCachedSessionSync();
    let activeEmail = cached?.email || "";
    if (cached) {
      setEmail(cached.email);
      setUserName(cached.name || "");
      setProgress(readProgress(cached.email));
      const seen = typeof window !== "undefined" && window.localStorage.getItem(`laras.onboarding.${cached.email}`) === "done";
      setHasSeenOnboarding(seen);
      setIsLoaded(true);
    }

    getSession().then(async (session) => {
      if (!session) {
        setIsLoaded(true);
        return;
      }
      activeEmail = session.email;
      setEmail(session.email);
      setUserName(session.name || "");
      const seen = typeof window !== "undefined" && window.localStorage.getItem(`laras.onboarding.${session.email}`) === "done";
      setHasSeenOnboarding(seen);
      // Immediate local render
      const local = readProgress(session.email);
      setProgress(local);
      setIsLoaded(true);
      // Remote sync and anti-regression update
      const remote = await loadProgress(session.email);
      setProgress(remote);
    });

    const onProgressUpdated = () => {
      if (activeEmail) {
        setProgress(readProgress(activeEmail));
      }
    };
    window.addEventListener("laras-progress-updated", onProgressUpdated);

    const updateNodes = () => {
      try {
        const stored = getStoredSessions();
        // Hide draft sessions from student roadmap
        const custom = stored.filter((s) => !BUILTIN_SESSION_IDS.has(s.id) && s.status !== "draft");
        const offsets: ("right" | "center" | "left")[] = ["right", "center", "left"];
        const dynamic: PathNode[] = custom.map((s, idx) => ({
          id: `curator-${s.id}`,
          title: s.title || "Sesi Kurator",
          subtitle: "Sesi Kurator • Game Engine",
          href: `/dashboard/belajar/${s.id}`,
          type: "lesson",
          xp: s.xpReward || 30,
          offset: offsets[idx % offsets.length],
          status: "active",
        }));
        setCuratorNodes(dynamic);

        // Track title & xp updates for migrated sessions 1, 2, 3
        const titleMap: Record<string, { title: string; xp: number }> = {};
        stored.forEach((s) => {
          if (["1", "2", "3"].includes(s.id)) {
            titleMap[s.id] = { title: s.title, xp: s.xpReward || 30 };
          }
        });
        setSessionTitles(titleMap);
      } catch (err) {
        console.error("Gagal membaca sesi kurator:", err);
      }
    };

    updateNodes();
    window.addEventListener("laras-sessions-updated", updateNodes);

    syncSessionsFromServer().catch(() => {});
    return () => {
      window.removeEventListener("laras-progress-updated", onProgressUpdated);
      window.removeEventListener("laras-sessions-updated", updateNodes);
    };
  }, []);

  useEffect(() => {
    if (!email) return;
    const refresh = () => setProgress(readProgress(email));
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, [email]);

  const handleDismissOnboarding = () => {
    if (typeof window !== "undefined") {
      const key = email ? `laras.onboarding.${email}` : "laras.onboarding.default";
      window.localStorage.setItem(key, "done");
    }
    setHasSeenOnboarding(true);
  };

  const handleStartTour = () => {
    setTourStep(1);
  };

  const handleCloseTour = () => {
    handleDismissOnboarding();
    setTourStep(null);
  };

  const handleStartFirstLesson = () => {
    handleDismissOnboarding();
    setTourStep(null);
    window.location.href = "/dashboard/latihan/1";
  };

  useEffect(() => {
    const startTourHandler = () => {
      setTourStep(1);
    };
    window.addEventListener("laras-start-tour", startTourHandler);
    return () => window.removeEventListener("laras-start-tour", startTourHandler);
  }, []);

  useEffect(() => {
    if (tourStep === null) return;
    const timer = setTimeout(() => {
      if (tourStep === 1) {
        const el = document.getElementById("tour-roadmap");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (tourStep === 2) {
        const el = document.getElementById("tour-first-lesson");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (tourStep === 3) {
        const el =
          document.getElementById("tour-paspor-nav") ||
          document.getElementById("tour-paspor-mobile");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [tourStep]);

  const baseNodes = pathNodes.map((node) => {
    let title = node.title;
    let xp = node.xp;
    if (node.id === 1 && sessionTitles["1"]) {
      title = sessionTitles["1"].title;
      xp = sessionTitles["1"].xp;
    } else if (node.id === 2 && sessionTitles["2"]) {
      title = sessionTitles["2"].title;
      xp = sessionTitles["2"].xp;
    } else if (node.id === 4 && sessionTitles["3"]) {
      title = sessionTitles["3"].title;
      xp = sessionTitles["3"].xp;
    }
    return {
      ...node,
      title,
      xp,
      status: getNodeStatus(node, progress),
    };
  });
  const dynamicNodes = curatorNodes.map((node) => ({ ...node, status: "active" as NodeStatus }));
  const nodes = [...baseNodes, ...dynamicNodes];

  const activeNode = nodes.find((node) => node.status === "active") ?? nodes[nodes.length - 1];
  const dailyXp = Math.min(progress.xp, 50);

  // Perhitungan layout sinusoidal jalur & geometri berirama konsisten
  const containerWidth = isMobile ? 320 : 480;
  const centerX = containerWidth / 2;
  const stepY = 104; // Jarak vertikal seragam konsisten (96-112px)
  const startY = 68;
  const offsets = isMobile ? SINE_OFFSETS_MOBILE : SINE_OFFSETS_DESKTOP;

  // Node rujukan untuk artefak budaya (Souraja / Bab 1)
  const sourajaIdx = nodes.findIndex(
    (n) => n.id === 4 || n.title.toLowerCase().includes("souraja")
  );
  const cultureNodeIdx = sourajaIdx !== -1 ? sourajaIdx : 3;

  // Hitung koordinat final setiap node secara dinamis
  const mobileCardGap = isMobile ? 64 : 0;
  const nodesWithCoords = nodes.map((node, i) => {
    const offset = offsets[i % offsets.length];
    const x = centerX + offset;
    const extraY = isMobile && i > cultureNodeIdx ? mobileCardGap : 0;
    const y = startY + i * stepY + extraY;
    return {
      ...node,
      x,
      y,
      offsetVal: offset,
    };
  });

  const totalRoadmapHeight =
    nodesWithCoords.length > 0
      ? nodesWithCoords[nodesWithCoords.length - 1].y + 64
      : 700;

  // Satu kurva mulus utuh melewati semua titik tengah node
  const pts = nodesWithCoords.map((n) => ({ x: n.x, y: n.y }));
  const segments = getCatmullRomSegments(pts);
  const fullPathD =
    pts.length >= 2
      ? `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ` + segments.join(" ")
      : "";

  // Lapisan progres: dari awal sampai node aktif / node terakhir selesai
  const activeIdx = nodes.findIndex((node) => node.status === "active");
  const lastCompIdx = nodes.map((n) => n.status).lastIndexOf("completed");
  let progressLimit = 0;
  if (lastCompIdx >= 0) {
    progressLimit = activeIdx > lastCompIdx ? activeIdx : lastCompIdx + 1;
  } else if (activeIdx > 0) {
    progressLimit = activeIdx;
  }
  progressLimit = Math.max(0, Math.min(segments.length, progressLimit));

  const progressSegments = segments.slice(0, progressLimit);
  const progressPathD =
    progressSegments.length > 0
      ? `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ` + progressSegments.join(" ")
      : "";

  const cultureNode = nodesWithCoords[cultureNodeIdx] || nodesWithCoords[0];
  const cultureNodeY = cultureNode ? cultureNode.y : startY + 3 * stepY;
  const cultureOffset = cultureNode ? cultureNode.offsetVal : 40;
  // Pada desktop: jika offset positif (geser kanan), kartu diletakkan di sisi kiri; jika negatif, di kanan
  const cardLeft =
    cultureOffset >= 0
      ? cultureNode.x - 38 - 14 - 170
      : cultureNode.x + 38 + 14;

  const completedBaseCount = progress.completedLessons.filter((id) => [1, 2, 3].includes(id)).length;
  const isUnit1Complete = completedBaseCount >= 3 && progress.completedLessons.includes(4);
  const progressRatio = Math.min(1, Math.max(0, completedBaseCount / 3));

  return (
    <main className="min-h-screen bg-surface px-4 py-4 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 3-Zone Layout: Left Sidebar (Fixed) | Center Scroll (max-w-[560px]) | Right Rail (Sticky) */}
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] items-start">
          {/* Kolom Tengah (Terpusat, Maksimal 560px) */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[560px]">
              {/* Sticky Unit Banner — Berfungsi sebagai Header Bab Utama yang Elegan */}
              <div className="sticky top-20 z-20 pt-1 pb-4 bg-surface/90 backdrop-blur-md">
                <div className="rounded-2xl bg-surface-container-lowest p-4 sm:p-5 border-2 border-outline-variant/30 shadow-[0_4px_0_0_#e8ded8] flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-[0.16em] text-primary truncate">
                        Unit 1 • Sulawesi Tengah
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md shrink-0">
                        <MapPin className="h-3 w-3 text-primary" />
                        Kaili
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-on-surface truncate">
                      Salam, Sapaan &amp; Busana Kaili
                    </h1>
                    <p className="text-xs text-on-surface-variant font-medium mt-1 truncate hidden sm:block">
                      Satu misi kecil setiap hari. Pelajari bahasanya, rasakan konteksnya.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTourStep(1)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition shadow-xs cursor-pointer"
                      title="Buka Panduan Belajar"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      <span className="hidden sm:inline">Panduan</span>
                    </button>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black shadow-xs min-h-[28px]">
                      {isLoaded ? (
                        `${completedBaseCount}/3 selesai`
                      ) : (
                        <span className="inline-block w-10 h-3 rounded bg-primary/20 animate-pulse" />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. STRIP KEADAAN (Selalu Terlihat, Termasuk Saat Nilainya 0) */}
              <div className="mb-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 border-l-4 border-l-primary shadow-xs p-3 transition hover:border-primary/40">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Sapaan Pengguna */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-black shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span>Halo, {userName || "Sahabat Budaya"}</span>
                  </div>

                  {/* Level */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-high text-on-surface font-bold shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    <span>Level {Math.floor((progress?.xp || 0) / 100) + 1}</span>
                  </div>

                  {/* XP */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-200 font-bold shrink-0">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>
                      {progress?.xp || 0} XP{" "}
                      <span className="text-[10px] font-semibold text-on-surface-variant">
                        (poin pengalaman)
                      </span>
                    </span>
                  </div>

                  {/* Hari Beruntun */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-800 dark:text-orange-200 font-bold shrink-0">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span>Hari beruntun: {progress?.streak || 0}</span>
                  </div>

                  {/* Target Hari Ini */}
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold shrink-0 ${
                      completedBaseCount > 0
                        ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    <Check
                      className={`w-3.5 h-3.5 ${
                        completedBaseCount > 0
                          ? "text-emerald-600 stroke-[3]"
                          : "text-outline"
                      }`}
                    />
                    <span>
                      Target hari ini: {completedBaseCount > 0 ? 1 : 0} dari 1 pelajaran
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. SATU KARTU DOMINAN (Hanya Satu Tombol Utama di Layar Ini) */}
              {!isLoaded ? (
                <section className="relative overflow-hidden rounded-3xl bg-surface-container-high px-5 py-5 mb-8 animate-pulse border-2 border-outline-variant/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-outline-variant/50" />
                      <div className="h-5 w-48 rounded bg-outline-variant/60" />
                      <div className="h-3 w-64 rounded bg-outline-variant/40" />
                    </div>
                    <div className="h-10 w-28 rounded-full bg-outline-variant/50" />
                  </div>
                </section>
              ) : progress.completedLessons.length === 0 ? (
                /* Pengguna Baru: Kartu Pelajaran Pertama */
                <section className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest p-5 sm:p-6 shadow-md mb-8 transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>Pelajaran 1 • Baru</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                          Salam &amp; Adab Tabe
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-semibold leading-relaxed">
                          Tujuan: Setelah pelajaran ini, kamu bisa menyapa dan mempraktikkan adab santun Tabe dalam budaya Kaili.
                        </p>
                        <p className="mt-1 text-xs text-primary font-bold">
                          ±3 menit · 5 soal · +20 XP
                        </p>
                      </div>

                      {!hasSeenOnboarding && (
                        <button
                          type="button"
                          onClick={handleDismissOnboarding}
                          className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
                          title="Tutup Panduan"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {!hasSeenOnboarding && (
                      <p className="text-xs text-on-surface-variant font-medium pt-2 border-t border-outline-variant/20">
                        Selamat datang di LARAS, {userName || "Sahabat Budaya"}! Ini peta belajarmu. Tekan Mulai Pelajaran untuk langsung membuka soal pertama.
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {/* SATU TOMBOL DOMINAN */}
                      <Link
                        href="/dashboard/latihan/1"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Mulai Pelajaran</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      {!hasSeenOnboarding && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={handleStartTour}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs transition cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-primary" />
                            <span>Panduan singkat</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDismissOnboarding}
                            className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                          >
                            Lewati
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ) : isUnit1Complete ? (
                /* Pengguna yang Sudah Menyelesaikan Seluruh Bab 1 */
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-container px-5 py-4 text-on-primary shadow-[0_5px_0_0_#881f00] mb-8">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary-fixed">
                        Unit 1 Tuntas • Sempurna
                      </p>
                      <h2 className="text-lg font-black tracking-tight truncate mt-0.5">
                        Selamat! Semua Misi Selesai
                      </h2>
                      <p className="text-xs font-semibold text-primary-fixed/90 truncate">
                        Pernikahan adat selesai &amp; Cap Paspor diterima • +30 XP
                      </p>
                    </div>
                    <Link
                      href="/dashboard/paspor"
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-surface px-5 py-2.5 text-xs font-black text-primary shadow-[0_2px_0_0_#ffdbd1] transition hover:bg-surface-container"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Buka Paspor</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-primary-container/40 pointer-events-none" />
                </section>
              ) : (
                /* Pengguna yang Sedang Berprogres: Kartu Lanjutkan */
                <section className="relative overflow-hidden rounded-3xl bg-primary px-5 py-4 text-on-primary shadow-[0_5px_0_0_#881f00] mb-8">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary-fixed">
                        Lanjutkan dari terakhir: {activeNode.title} · {Math.round(progressRatio * 100)}%
                      </p>
                      <h2 className="text-lg font-black tracking-tight truncate mt-0.5">
                        {activeNode.title}
                      </h2>
                      <p className="text-xs font-semibold text-primary-fixed/90 truncate">
                        {activeNode.subtitle} • +{activeNode.xp} XP
                      </p>
                    </div>
                    {/* SATU TOMBOL DOMINAN */}
                    <Link
                      href={activeNode.href}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-surface px-5 py-2.5 text-xs font-black text-primary shadow-[0_2px_0_0_#ffdbd1] transition hover:bg-surface-container"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Lanjutkan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-primary-container/40 pointer-events-none" />
                </section>
              )}

              {/* Roadmap Canvas: Jalur Sinusoidal + Node Lingkaran Faux-3D */}
              <div
                id="tour-roadmap"
                className={`relative mx-auto transition-all duration-300 rounded-3xl ${
                  tourStep === 1 ? "ring-4 ring-primary ring-offset-4 bg-primary-fixed/10" : ""
                }`}
                style={{ width: `${containerWidth}px`, height: `${totalRoadmapHeight}px` }}
              >
                {/* Jalur SVG Kurva Bézier Mulus (2 Lapis: Rel Dasar & Lapisan Progres) */}
                <svg
                  className="absolute inset-0 pointer-events-none z-0"
                  viewBox={`0 0 ${containerWidth} ${totalRoadmapHeight}`}
                  style={{ width: `${containerWidth}px`, height: `${totalRoadmapHeight}px` }}
                >
                  {/* Rel Dasar: Seluruh Jalur Mulus Putus-putus Warna Netral Terang */}
                  {fullPathD && (
                    <path
                      d={fullPathD}
                      fill="none"
                      stroke="#d8c7be"
                      strokeWidth={7}
                      strokeDasharray="8 9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {/* Lapisan Progres: Mengikuti Kurva yang Sama Sampai Node Aktif/Selesai */}
                  {progressPathD && (
                    <path
                      d={progressPathD}
                      fill="none"
                      stroke="#881f00"
                      strokeWidth={7}
                      strokeDasharray="8 9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>

                {/* Node-Node Lingkaran Faux-3D */}
                {!isLoaded
                  ? nodesWithCoords.map((node) => {
                      return (
                        <div
                          key={`skel-${node.id}`}
                          style={{ left: `${node.x}px`, top: `${node.y}px` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                        >
                          <div className="h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] rounded-full bg-surface-container-high animate-pulse border-4 border-surface shadow-[0_5px_0_0_#d8c7be]" />
                        </div>
                      );
                    })
                  : nodesWithCoords.map((node) => {
                  const isActive = node.status === "active";
                  const isPrimaryActive = node.id === activeNode.id;
                  const isLocked = node.status === "locked";
                  const isCompleted = node.status === "completed";

                  return (
                    <div
                      key={node.id}
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
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
                        <div className="relative">
                          {/* Penanda "Mulai di sini" (Hanya untuk pelajaran pertama sebelum selesai) */}
                          {node.id === 1 && progress.completedLessons.length === 0 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap animate-bounce motion-reduce:animate-none">
                              <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 ring-2 ring-surface">
                                <Sparkles className="w-3 h-3 fill-current" />
                                Mulai di sini
                              </span>
                              <span className="block mx-auto w-0 h-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-primary" />
                            </div>
                          )}
                          <Link
                            id={node.id === 1 ? "tour-first-lesson" : undefined}
                            href={node.href}
                            aria-label={`${node.title} (${isCompleted ? "Selesai" : "Mulai"})`}
                            className={`flex h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] items-center justify-center rounded-full border-4 border-surface transition-all select-none active:translate-y-[2px] ${
                              isCompleted
                                ? "bg-primary text-on-primary shadow-[0_5px_0_0_#881f00] hover:brightness-105 active:shadow-[0_3px_0_0_#881f00]"
                                : "bg-primary text-on-primary shadow-[0_6px_0_0_#881f00] hover:brightness-105 active:shadow-[0_4px_0_0_#881f00]"
                            } ${
                              node.id === 1 && progress.completedLessons.length === 0
                                ? "ring-4 ring-primary-fixed-dim/80 ring-offset-2 animate-pulse motion-reduce:animate-none"
                                : ""
                            } ${
                              tourStep === 2 && node.id === 1
                                ? "ring-4 ring-secondary ring-offset-4 scale-105 z-30"
                                : ""
                            }`}
                          >
                            <NodeIcon node={node} status={node.status} />
                          </Link>
                        </div>
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

              {/* 3. KONTEN INFORMASI: JELAJAHI BUDAYA (PENGAYAAN — DI BAWAH PETA) */}
              <section className="mt-10 pt-6 border-t border-outline-variant/30 w-full">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Jelajahi Budaya</span>
                  </div>
                  <h2 className="text-lg font-black text-on-surface">Khazanah &amp; Konteks Kaili</h2>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5 leading-relaxed">
                    Materi pengayaan wawasan budaya. Membaca konten ini tidak memberi penyelesaian pelajaran dan tidak memberi XP.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface-container-lowest border-2 border-outline-variant/30 overflow-hidden shadow-xs flex flex-col">
                    <div className="relative h-28 w-full bg-surface-container-high overflow-hidden">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnqzf4AUY4GtDvGFESMzw5vK14-0xCr_-CqqKyHzgObssX2HonjZALyMHyv39OWxApYxC7Qh-I_QL8HUz0P49aJ6BzYjxVwjXJHDsRyqGQ94Fcy6GzwgtD7xsDzDMpUvUCL8cjccCPgdt2Y3tLKFkDkPWH3ofPYJMVw67VqH8tQ8M2Lij3qg990UKy62hGgrC7qGw0SSgnFIpN5YHUA0es_BtlcATm5jgXKQfrCE10dXoeDE-lLZQMbw"
                        alt="Souraja Rumah Adat Kaili"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-black text-white uppercase tracking-wider">
                        Rumah Adat
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-black text-on-surface">Souraja (Banua Oge)</h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                          Pusat tata krama, musyawarah adat, dan tempat bertamu masyarakat bangsawan Kaili Ledo di Palu Barat.
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-bold text-outline">Pengayaan materi • Tanpa XP</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-surface-container-lowest border-2 border-outline-variant/30 overflow-hidden shadow-xs flex flex-col">
                    <div className="relative h-28 w-full bg-surface-container-high overflow-hidden">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL3GhtQRWPzykvIVNWr2V35NhJTe_dCVIIrRtyBVfZEEj3XqYhEOJv_SEbk1PTWX0c31bxzkMEw4gOh7sN-WlcJNaV67h505nMT6eV4hEBOjXkJ6KJwhuR9O1EtZUS6Z3a5-anWincRSwsEM6Cd1eIcoTaILOCLMI3NIxB7VqVikEobrcT0CoVvKVVkAc_aFxEbqVUD4ypGJjz4ltJB0RE8BCXz7x3pKJC2QF3wSnftvmW7hDh7y67iQ"
                        alt="Pelataran Souraja"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-black text-white uppercase tracking-wider">
                        Adab Bertamu
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-black text-on-surface">Pelataran &amp; Adab Tangga</h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                          Tata cara mengucap Tabe dan menundukkan gesture sebelum menginjakkan kaki ke ruang utama Banua Oge.
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-bold text-outline">Pengayaan materi • Tanpa XP</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Rail Kanan Sticky: tetap diam saat konten tengah discroll */}
          <aside className="space-y-4 xl:sticky xl:top-24 self-start w-full">
            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
              <div className="flex items-center justify-between">
                <h2 className="font-black">Hari ini</h2>
                <Flame className="h-5 w-5 text-primary" />
              </div>
              {isLoaded ? (
                <p className="mt-5 text-3xl font-black">
                  {progress.streak} <span className="text-sm text-on-surface-variant">hari beruntun</span>
                </p>
              ) : (
                <div className="mt-5 h-9 w-28 rounded bg-surface-container-high animate-pulse" />
              )}
              <div className="mt-5 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>Target XP</span>
                <span>{isLoaded ? `${dailyXp}/50` : "--/50"}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className={`h-full rounded-full bg-secondary transition-all ${!isLoaded ? "animate-pulse bg-outline-variant/50" : ""}`}
                  style={{ width: isLoaded ? `${dailyXp * 2}%` : "30%" }}
                />
              </div>
            </section>

            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
              <div className="flex items-center justify-between">
                <h2 className="font-black">Status</h2>
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface-container-low p-3 flex flex-col justify-between">
                  <div>
                    <Heart className="h-4 w-4 text-error" />
                    {isLoaded ? (
                      <p className="mt-2 text-lg font-black">{progress.hearts}/3</p>
                    ) : (
                      <div className="mt-2 h-6 w-8 rounded bg-surface-container-high animate-pulse" />
                    )}
                    <p className="text-xs font-bold text-on-surface-variant">nyawa</p>
                  </div>
                  <p className="mt-1 text-[10px] text-on-surface-variant leading-tight">Terisi penuh kembali setiap hari baru</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <Trophy className="h-4 w-4 text-secondary" />
                  {isLoaded ? (
                    <p className="mt-2 text-lg font-black">{progress.xp}</p>
                  ) : (
                    <div className="mt-2 h-6 w-12 rounded bg-surface-container-high animate-pulse" />
                  )}
                  <p className="text-xs font-bold text-on-surface-variant">total XP</p>
                </div>
              </div>
            </section>

            <Link
              href="/dashboard/paspor"
              className="flex items-center justify-between rounded-3xl bg-secondary-fixed p-5 text-on-secondary-fixed transition hover:brightness-95"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em]">Cap Paspor berikutnya</p>
                <p className="mt-1 font-black">Tamu Sopan</p>
                <p className="mt-1 text-xs font-semibold">Buka Paspor</p>
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
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
            Munas IX • PERMIKOMNAS RI
          </span>
        </div>
      </div>

      {/* ── TUR MINI PANDUAN PENGGUNA (3 LANGKAH) ── */}
      {tourStep !== null && (
        <>
          {/* Subtle Dimmed Backdrop */}
          <div
            onClick={handleCloseTour}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 pointer-events-auto"
          />

          {/* Floating Tour Card */}
          <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-50 max-w-md w-auto rounded-3xl bg-surface-container-lowest p-5 sm:p-6 shadow-2xl border-2 border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
            {/* Header: Step Pill + Close Button */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary">
                Langkah {tourStep} dari 3
              </span>
              <button
                type="button"
                onClick={handleCloseTour}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Tutup Panduan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content for each step */}
            {tourStep === 1 && (
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight">Peta Belajar</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                  Ini jalur belajarmu. Pelajaran terbuka satu per satu — mulai dari yang paling atas.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {tourStep === 2 && (
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight">Menjawab Soal</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                  Tekan pelajaran untuk masuk sesi dan menjawab soal. Jawaban yang tepat memberimu XP; nyawa berkurang kalau salah, dan terisi lagi keesokan hari.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourStep(3)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {tourStep === 3 && (
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight">Paspor Budaya</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                  Cap Paspor dari pelajaran yang kamu selesaikan terkumpul di Paspor Budaya. Cek isinya kapan saja dari sini.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={handleStartFirstLesson}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-on-primary font-black text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>Mulai Pelajaran</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
