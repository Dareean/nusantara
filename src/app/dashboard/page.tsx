"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
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
  Lightbulb,
  MessageSquare,
  Sparkles,
  Volume2,
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

export const UNIT_THEMES: Record<
  number,
  {
    label: string;
    title: string;
    bgColor: string;
    shadowColor: string;
  }
> = {
  1: {
    label: "SECTION 1, UNIT 1",
    title: "Salam, Sapaan & Busana Kaili",
    bgColor: "#58cc02", // Duolingo vibrant green (persis Gambar 2)
    shadowColor: "#46a302",
  },
  2: {
    label: "SECTION 1, UNIT 2",
    title: "Tenun Donggala & Kerajinan Sutra",
    bgColor: "#1cb0f6", // Duolingo sky blue
    shadowColor: "#1899d6",
  },
  3: {
    label: "SECTION 1, UNIT 3",
    title: "Upacara Adat Souraja & Diplomasi Tutur",
    bgColor: "#ff9600", // Duolingo warm orange
    shadowColor: "#d97f00",
  },
  4: {
    label: "SECTION 2, UNIT 1",
    title: "Arsitektur Tongkonan & Adab Toraja",
    bgColor: "#ce82ff", // Duolingo purple
    shadowColor: "#a855f7",
  },
};

export type DialogueLine = {
  speaker: string;
  avatar: string;
  role: string;
  kaili: string;
  indonesia: string;
};

export type UnitGuidebook = {
  label: string;
  title: string;
  subtitle: string;
  keyPhrases: {
    term: string;
    meaning: string;
    context: string;
    phonetic?: string;
  }[];
  dialogue: DialogueLine[];
  quickTips: {
    icon: string;
    title: string;
    tip: string;
  }[];
};

export const UNIT_GUIDEBOOKS: Record<number, UnitGuidebook> = {
  1: {
    label: "SECTION 1, UNIT 1",
    title: "Salam, Sapaan & Busana Kaili",
    subtitle: "Dengarkan pelafalan frasa santun dan intip obrolan sehari-hari warga lembah Palu!",
    keyPhrases: [
      {
        term: "Tabe",
        meaning: "Permisi / Maaf ya",
        context: "Kunci utama kesopanan saat melintas atau menyapa.",
        phonetic: "ta-be",
      },
      {
        term: "Ndokona",
        meaning: "Selamat pagi!",
        context: "Dipakai sejak fajar terbit hingga menjelang tengah hari.",
        phonetic: "ndo-ko-na",
      },
      {
        term: "Nempa",
        meaning: "Selamat siang!",
        context: "Sapaan hangat saat matahari sedang terik di atas kepala.",
        phonetic: "nem-pa",
      },
      {
        term: "Kareba?",
        meaning: "Gimana kabarmu?",
        context: "Menanyakan kabar teman atau tetangga secara akrab.",
        phonetic: "ka-re-ba",
      },
      {
        term: "Kareba roa",
        meaning: "Kabar baik sekali!",
        context: "Jawaban mantap kalau kamu sehat walafiat.",
        phonetic: "ka-re-ba ro-a",
      },
      {
        term: "Tarima kasi",
        meaning: "Terima kasih banyak",
        context: "Ungkapan rasa senang setelah dibantu atau dijamu.",
        phonetic: "ta-ri-ma ka-si",
      },
    ],
    dialogue: [
      {
        speaker: "Rafi",
        avatar: "🙋‍♂️",
        role: "Pelajar Pendatang",
        kaili: "Tabe, Ndokona! Kareba?",
        indonesia: "Permisi, selamat pagi! Gimana kabarmu?",
      },
      {
        speaker: "Ibu Nur",
        avatar: "🧕",
        role: "Warga Asli Palu",
        kaili: "Ndokona roa! Kareba roa, alhamdulillah.",
        indonesia: "Pagi juga! Kabar sangat baik, alhamdulillah.",
      },
      {
        speaker: "Rafi",
        avatar: "🙋‍♂️",
        role: "Pelajar Pendatang",
        kaili: "Tarima kasi, Ibu Nur!",
        indonesia: "Terima kasih banyak, Bu Nur!",
      },
      {
        speaker: "Ibu Nur",
        avatar: "🧕",
        role: "Warga Asli Palu",
        kaili: "Io, sama-sama!",
        indonesia: "Iya, sama-sama ya!",
      },
    ],
    quickTips: [
      {
        icon: "💡",
        title: "Aturan Emas Kata 'Tabe'",
        tip: "Di tanah Kaili, kata 'Tabe' itu seperti sihir kesopanan. Selalu tundukkan badan sedikit saat berucap, lawan bicara pasti langsung tersenyum ramah kepadamu!",
      },
      {
        icon: "👔",
        title: "Busana Pria: Baju Koje & Siga",
        tip: "Kemeja lengan panjang berkerah tegak berpadu sarung tenun sutra Donggala. Di kepalanya terpasang 'Siga', ikat kepala segitiga simbol kehormatan pria Kaili.",
      },
      {
        icon: "👗",
        title: "Busana Wanita: Baju Sampua",
        tip: "Baju kurung sutra longgar yang sangat adem untuk cuaca pesisir Teluk Palu. Dipadukan sarung tenun motif bunga melati yang anggun.",
      },
    ],
  },
  2: {
    label: "SECTION 1, UNIT 2",
    title: "Tenun Donggala & Kerajinan Sutra",
    subtitle: "Ragam motif tenun dan filosofi benang sutra pesisir.",
    keyPhrases: [
      { term: "Buya Sabe", meaning: "Sarung tenun sutra Donggala", context: "Sarung sutra pusaka untuk pesta adat dan tamu agung.", phonetic: "bu-ya sa-be" },
      { term: "Buya Bomba", meaning: "Tenun motif kuncup bunga", context: "Motif sakral lambang kebaikan budi pekerti.", phonetic: "bu-ya bom-ba" },
    ],
    dialogue: [
      {
        speaker: "Penenun",
        avatar: "👵",
        role: "Maestro Tenun",
        kaili: "Ini Buya Bomba, ditenun berbulan-bulan.",
        indonesia: "Ini Buya Bomba, ditenun dengan sabar berbulan-bulan.",
      },
    ],
    quickTips: [
      {
        icon: "🧵",
        title: "Menenun Pakai ATBM",
        tip: "Tenun Donggala dibuat tanpa mesin modern. Setiap helai benang adalah doa ketelitian dan kebanggaan pesisir.",
      },
    ],
  },
  3: {
    label: "SECTION 1, UNIT 3",
    title: "Upacara Adat Souraja & Diplomasi Tutur",
    subtitle: "Tata krama bertamu ke rumah panggung raja Kaili.",
    keyPhrases: [
      { term: "Souraja", meaning: "Istana Kayu / Rumah Besar Kaili", context: "Pusat adat dan musyawarah tetua Palu.", phonetic: "sou-ra-ja" },
      { term: "Gandaria", meaning: "Serambi tamu depan", context: "Tempat menunggu izin sebelum masuk ke dalam rumah.", phonetic: "gan-da-ri-a" },
    ],
    dialogue: [
      {
        speaker: "Tetua Adat",
        avatar: "👴",
        role: "Pemangku Adat",
        kaili: "Tabe, silakan duduk di Gandaria.",
        indonesia: "Permisi, silakan duduk dengan nyaman di serambi depan.",
      },
    ],
    quickTips: [
      {
        icon: "🏛️",
        title: "Adab Tangga Pertama",
        tip: "Lepas alas kaki di anak tangga paling bawah sebelum naik ke lantai kayu Souraja.",
      },
    ],
  },
  4: {
    label: "SECTION 2, UNIT 1",
    title: "Arsitektur Tongkonan & Adab Toraja",
    subtitle: "Eksplorasi budaya rumpun Sulawesi berikutnya.",
    keyPhrases: [
      { term: "Kurre Sumanga'", meaning: "Terima kasih banyak", context: "Ungkapan rasa hormat dan terima kasih mendalam.", phonetic: "kur-re su-ma-nga" },
    ],
    dialogue: [],
    quickTips: [
      {
        icon: "🏠",
        title: "Falsafah Tongkonan",
        tip: "Rumah adat adalah pusat musyawarah dan pemersatu marga keluarga besar.",
      },
    ],
  },
};

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [guidebookUnit, setGuidebookUnit] = useState<number | null>(null);
  const [guidebookTab, setGuidebookTab] = useState<"frasa" | "dialog" | "tips">("frasa");
  const [playingTerm, setPlayingTerm] = useState<string | null>(null);

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 0.85;
        utterance.onstart = () => setPlayingTerm(text);
        utterance.onend = () => setPlayingTerm(null);
        utterance.onerror = () => setPlayingTerm(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setPlayingTerm(null);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 240);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const currentUnitId = 1;
  const currentUnitTheme = UNIT_THEMES[currentUnitId] || UNIT_THEMES[1];

  return (
    <main className="min-h-screen bg-surface px-4 py-4 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 3-Zone Layout: Left Sidebar (Fixed) | Center Scroll (max-w-[560px]) | Right Rail (Sticky) */}
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] items-start">
          {/* Kolom Tengah (Terpusat, Maksimal 560px) */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[560px]">



              {/* Unit Header Banner Ala Duolingo (Sticky Saat Scroll) */}
              <div className="sticky top-20 z-20 pt-2 pb-4 bg-surface/95 backdrop-blur-sm -mt-2">
                <div
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    scrollToTop();
                  }}
                  style={{
                    backgroundColor: currentUnitTheme.bgColor,
                    boxShadow: `0 4px 0 0 ${currentUnitTheme.shadowColor}`,
                  }}
                  className="rounded-2xl px-5 py-4 text-white flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer select-none"
                  title="Klik untuk kembali ke atas"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/90">
                      <span>{currentUnitTheme.label}</span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5 truncate">
                      {currentUnitTheme.title}
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuidebookUnit(currentUnitId);
                    }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: `0 3px 0 0 ${currentUnitTheme.shadowColor}`,
                    }}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-white/40 text-white font-black text-xs uppercase tracking-wider hover:bg-white/30 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
                    title="Buku Panduan Unit"
                  >
                    <BookOpen className="w-4 h-4 stroke-[2.5]" />
                    <span>PANDUAN</span>
                  </button>
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
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
                            Unit 1 • Sulawesi Tengah
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md shrink-0">
                            <MapPin className="h-3 w-3 text-primary" />
                            Kaili
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 fill-current" />
                            <span>Pelajaran Pertama</span>
                          </span>
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
                        Unit 1: Sulawesi Tengah • Lanjutkan dari terakhir: {activeNode.title} · {Math.round(progressRatio * 100)}%
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

      {/* Tombol Balik ke Atas (Floating Tepat di Samping Jalur Soal) */}
      {showScrollTop && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 md:bottom-8 z-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-[560px] flex justify-end pr-2 sm:pr-4">
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest border-2 border-outline-variant/60 text-on-surface font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#d1d5db] dark:shadow-[0_4px_0_0_#374151] hover:bg-surface-container hover:border-primary/50 hover:text-primary active:translate-y-1 active:shadow-none transition-all cursor-pointer group animate-in fade-in zoom-in-95 duration-200"
                    aria-label="Kembali ke atas"
                    title="Kembali ke atas"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                      Ke Atas
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buku Panduan Unit Ala Duolingo Guidebook */}
      {guidebookUnit !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-3xl border-2 border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header dengan Tema Unit */}
            <div
              style={{
                backgroundColor: (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor,
              }}
              className="px-6 py-5 text-white flex items-start justify-between gap-4 border-b-4 border-black/10 shrink-0"
            >
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-widest backdrop-blur-xs">
                  <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).label}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                  {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).title}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1 leading-relaxed">
                  {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGuidebookUnit(null)}
                className="shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-95 transition cursor-pointer"
                aria-label="Tutup Panduan Unit"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Tab Navigasi Tactile */}
            <div className="flex items-center gap-2 px-5 sm:px-6 py-3 border-b border-outline-variant/20 bg-surface-container-lowest overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setGuidebookTab("frasa")}
                style={{
                  backgroundColor: guidebookTab === "frasa" ? (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor : undefined,
                  boxShadow: guidebookTab === "frasa" ? `0 3px 0 0 ${(UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).shadowColor}` : undefined,
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  guidebookTab === "frasa"
                    ? "text-white active:translate-y-0.5"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Frasa &amp; Suara</span>
              </button>

              <button
                type="button"
                onClick={() => setGuidebookTab("dialog")}
                style={{
                  backgroundColor: guidebookTab === "dialog" ? (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor : undefined,
                  boxShadow: guidebookTab === "dialog" ? `0 3px 0 0 ${(UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).shadowColor}` : undefined,
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  guidebookTab === "dialog"
                    ? "text-white active:translate-y-0.5"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Contoh Obrolan</span>
              </button>

              <button
                type="button"
                onClick={() => setGuidebookTab("tips")}
                style={{
                  backgroundColor: guidebookTab === "tips" ? (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor : undefined,
                  boxShadow: guidebookTab === "tips" ? `0 3px 0 0 ${(UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).shadowColor}` : undefined,
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  guidebookTab === "tips"
                    ? "text-white active:translate-y-0.5"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tips Kilat</span>
              </button>
            </div>

            {/* Konten Panduan Unit (Scrollable) */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-on-surface">
              {/* TAB 1: FRASA & SUARA (SOUNDBOARD) */}
              {guidebookTab === "frasa" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                    <span>Ketuk kartu atau tombol speaker untuk mendengar lafal aslinya:</span>
                    <span className="font-extrabold text-primary">
                      {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).keyPhrases.length} Frasa
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).keyPhrases.map((phrase, idx) => {
                      const isPlaying = playingTerm === phrase.term;
                      return (
                        <div
                          key={idx}
                          onClick={() => playAudio(phrase.term)}
                          style={{
                            borderColor: isPlaying ? (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor : undefined,
                          }}
                          className={`p-4 rounded-3xl bg-surface-container border-2 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:border-primary/60 active:translate-y-0.5 ${
                            isPlaying ? "ring-2 ring-primary/30 bg-primary/5" : "border-outline-variant/40"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-on-surface tracking-tight">
                                {phrase.term}
                              </span>
                              {phrase.phonetic && (
                                <span className="text-[11px] font-mono text-outline font-semibold">
                                  /{phrase.phonetic}/
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-primary mt-0.5">
                              {phrase.meaning}
                            </div>
                            <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-snug">
                              {phrase.context}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudio(phrase.term);
                            }}
                            style={{
                              backgroundColor: isPlaying ? (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor : undefined,
                              boxShadow: isPlaying
                                ? `0 3px 0 0 ${(UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).shadowColor}`
                                : "0 3px 0 0 #d1d5db",
                            }}
                            className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center border-2 border-outline-variant/40 transition-all active:scale-90 ${
                              isPlaying
                                ? "text-white animate-pulse"
                                : "bg-surface-container-high text-primary hover:bg-primary hover:text-white"
                            }`}
                            title="Dengarkan Suara"
                          >
                            <Volume2 className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CONTOH OBROLAN (COMIC CHAT BUBBLES) */}
              {guidebookTab === "dialog" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-on-surface-variant">
                    Simulasi percakapan nyata saat menyapa warga di lembah Palu:
                  </div>

                  <div className="space-y-3 p-4 rounded-3xl bg-surface-container-lowest border-2 border-outline-variant/30">
                    {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).dialogue.map((line, idx) => {
                      const isLeft = idx % 2 === 0;
                      const isPlaying = playingTerm === line.kaili;
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${isLeft ? "justify-start" : "justify-end flex-row-reverse"}`}
                        >
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-2xl bg-surface-container-high border-2 border-outline-variant/40 flex items-center justify-center text-xl shrink-0 shadow-xs">
                            {line.avatar}
                          </div>

                          {/* Speech Bubble */}
                          <div
                            className={`max-w-[80%] rounded-3xl p-4 shadow-sm border-2 ${
                              isLeft
                                ? "bg-surface-container border-outline-variant/40 rounded-tl-sm"
                                : "bg-primary-fixed/30 border-primary/30 rounded-tr-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
                                {line.speaker} • {line.role}
                              </span>
                              <button
                                type="button"
                                onClick={() => playAudio(line.kaili)}
                                className="p-1 rounded-full text-primary hover:bg-primary/10 transition active:scale-90 cursor-pointer"
                                title="Putar dialog"
                              >
                                <Volume2 className={`w-3.5 h-3.5 stroke-[2.5] ${isPlaying ? "animate-pulse text-secondary" : ""}`} />
                              </button>
                            </div>
                            <p className="text-sm font-extrabold text-on-surface tracking-tight">
                              &ldquo;{line.kaili}&rdquo;
                            </p>
                            <p className="text-xs font-semibold text-on-surface-variant mt-1 italic">
                              &ldquo;{line.indonesia}&rdquo;
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: TIPS KILAT (GAME RULES & FASHION) */}
              {guidebookTab === "tips" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-on-surface-variant">
                    Rahasia adat dan kunci penting untuk lulus kuis unit ini:
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).quickTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-3xl bg-surface-container border-2 border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors"
                      >
                        <div>
                          <div className="text-3xl mb-2">{tip.icon}</div>
                          <h4 className="text-sm font-black text-on-surface tracking-tight">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant font-medium mt-1.5 leading-relaxed">
                            {tip.tip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 sm:p-5 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs font-bold text-on-surface-variant hidden sm:inline">
                Siap mempraktikkan materi ini di latihan?
              </span>
              <button
                type="button"
                onClick={() => setGuidebookUnit(null)}
                style={{
                  backgroundColor: (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor,
                  boxShadow: `0 3px 0 0 ${(UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).shadowColor}`,
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
              >
                Mengerti, Lanjutkan Belajar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
