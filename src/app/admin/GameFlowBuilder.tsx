"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Music,
  HelpCircle,
  X,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Copy,
  CheckSquare,
  ArrowLeftRight,
  ListOrdered,
  Crosshair,
  GitBranch,
  ListChecks,
  AlertCircle,
  GripVertical,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Globe,
  Lock,
  Search,
  BookOpen,
  Sparkles,
  MoreVertical,
  Check,
  MapPin,
} from "lucide-react";
import {
  GameSession,
  GameQuestion,
  QuestionOption,
  HotspotItem,
  QuestionType,
  MatchPairItem,
  ScenarioStep,
  ScenarioChoice,
} from "../components/game-engine/types";
import {
  getStoredSessions,
  saveSingleSession,
  saveSingleSessionToServer,
  deleteSessionFromServer,
} from "../components/game-engine/sessionStore";

// =====================================================================
// PRESET & GALLERY CONSTANTS
// =====================================================================
const IMAGE_PRESETS = [
  {
    name: "Alat Musik Suling Lalove",
    url: "/media/presets/lalove.webp",
    type: "hotspot",
  },
  {
    name: "Busana Tradisional Baju Nggembe",
    url: "/media/presets/baju_nggembe.webp",
    type: "hotspot",
  },
  {
    name: "Gestur Sikap Adat Tabe",
    url: "/media/presets/sikap_tabe.webp",
    type: "multiple_choice",
  },
  {
    name: "Pelataran Arsitektur Souraja",
    url: "/media/presets/souraja.webp",
    type: "hotspot",
  },
  {
    name: "Instrumen Gendang Gimba",
    url: "/media/presets/gimba.webp",
    type: "hotspot",
  },
];

export const QUESTION_TYPE_GALLERY: {
  type: QuestionType;
  name: string;
  badge: string;
  howToAnswer: string;
  exampleMini: string;
  description: string;
  Icon: typeof ListChecks;
}[] = [
  {
    type: "multiple_choice",
    name: "Pilihan Ganda",
    badge: "Opsi Tunggal",
    howToAnswer: "Murid memilih satu jawaban paling tepat dari pilihan yang tersedia.",
    exampleMini: "A. Jawaban Benar ✓  |  B. Pengecoh",
    description: "Cocok untuk menguji pemahaman konsep, kuis kosakata, dan makna adat.",
    Icon: ListChecks,
  },
  {
    type: "true_false",
    name: "Benar / Salah",
    badge: "Fakta & Mitos",
    howToAnswer: "Murid menentukan apakah pernyataan bernilai Benar/Fakta atau Salah/Mitos.",
    exampleMini: "Benar [✓] atau Salah [✗]",
    description: "Sangat baik untuk meluruskan mitos budaya atau menguji fakta singkat adat.",
    Icon: CheckSquare,
  },
  {
    type: "match",
    name: "Jodohkan Pasangan",
    badge: "Dua Kolom",
    howToAnswer: "Murid mengetuk dan menghubungkan pasangan kata adat dengan maknanya.",
    exampleMini: "Tabe ➔ Permisi  |  Pue ➔ Tetua",
    description: "Ideal untuk kosa kata, nama alat musik dengan fungsinya, atau istilah busana.",
    Icon: ArrowLeftRight,
  },
  {
    type: "order",
    name: "Susun Urutan",
    badge: "Urutan Langkah",
    howToAnswer: "Murid menyusun langkah-langkah ke dalam urutan yang tepat dari atas ke bawah.",
    exampleMini: "1. Salam ➔ 2. Duduk ➔ 3. Bicara",
    description: "Tepat untuk tata krama bertamu, prosesi upacara adat, dan tahapan laku santun.",
    Icon: ListOrdered,
  },
  {
    type: "hotspot",
    name: "Hotspot Visual",
    badge: "Eksplorasi Gambar",
    howToAnswer: "Murid menjelajahi gambar artefak dan mengetuk titik penanda adat yang ditanyakan.",
    exampleMini: "Titik ① Tiupan ➔ Titik ② Lubang nada",
    description: "Eksplorasi visual instrumen musik, bagian baju adat, dan arsitektur Souraja.",
    Icon: Crosshair,
  },
  {
    type: "scenario",
    name: "Skenario Bercabang",
    badge: "Simulasi Adab",
    howToAnswer: "Murid menghadapi situasi bertamu dan memilih keputusan sikap yang paling santun.",
    exampleMini: "Situasi ➔ Keputusan Sikap (+2 Poin)",
    description: "Simulasi etika pergaulan adat nyata dengan bobot skor adab pada tiap pilihan.",
    Icon: GitBranch,
  },
];

// =====================================================================
// VALIDATION LOGIC (PERSIS STANDAR RONDE 5)
// =====================================================================
export function validateQuestion(q: GameQuestion): string[] {
  const errs: string[] = [];
  if (!q.prompt || !q.prompt.trim()) {
    errs.push("Pertanyaan / Instruksi utama belum diisi");
  }

  if (q.type === "multiple_choice" || q.type === "audio") {
    const opts = q.options || [];
    if (opts.length < 2) {
      errs.push("Pilihan ganda memerlukan minimal 2 opsi jawaban");
    }
    const hasCorrect = opts.some((o) => o.isCorrect);
    if (!hasCorrect) {
      errs.push("Belum ada kunci jawaban benar yang ditandai");
    }
  } else if (q.type === "true_false") {
    if (q.answerBoolean === undefined) {
      errs.push("Kunci jawaban Benar/Salah belum ditentukan");
    }
  } else if (q.type === "match" || q.type === "matching") {
    const pairs = q.pairs || q.matchingPairs || [];
    if (pairs.length < 2) {
      errs.push("Jodohkan pasangan memerlukan minimal 2 pasangan");
    }
    const hasEmpty = pairs.some(
      (p) => !p.left?.trim() || !p.right?.trim()
    );
    if (hasEmpty) {
      errs.push("Ada pasangan yang kolom kiri atau kanannya masih kosong");
    }
  } else if (q.type === "order" || q.type === "word_builder") {
    const items = q.items || q.targetSentence || [];
    if (items.length < 3) {
      errs.push("Susun urutan memerlukan minimal 3 item");
    }
    const hasEmpty = items.some((it) => !it?.trim());
    if (hasEmpty) {
      errs.push("Ada item urutan yang masih kosong");
    }
  } else if (q.type === "hotspot" || q.type === "visual") {
    if (!q.imageUrl || !q.imageUrl.trim()) {
      errs.push("Gambar artefak belum dipilih atau diunggah");
    }
    const spots = q.hotspots || [];
    if (spots.length < 1) {
      errs.push("Hotspot visual memerlukan minimal 1 titik penanda");
    }
    const opts = q.options || [];
    const hasCorrect = opts.some((o) => o.isCorrect) || spots.length > 0;
    if (!hasCorrect) {
      errs.push("Kunci jawaban titik hotspot belum dipilih");
    }
  } else if (q.type === "scenario" || q.type === "roleplay") {
    const steps = q.steps || [];
    if (steps.length < 1) {
      errs.push("Skenario memerlukan minimal 1 langkah situasi");
    }
    steps.forEach((step, sIdx) => {
      if (!step.prompt?.trim()) {
        errs.push(`Langkah ${sIdx + 1} belum memiliki teks situasi/dialog`);
      }
      if (!step.choices || step.choices.length < 1) {
        errs.push(`Langkah ${sIdx + 1} belum memiliki pilihan tindakan`);
      } else {
        const hasScored = step.choices.some((c) => c.score > 0);
        if (!hasScored) {
          errs.push(`Langkah ${sIdx + 1} harus memiliki minimal 1 pilihan dengan skor > 0`);
        }
      }
    });
  }

  return errs;
}

export function validateSessionForPublish(session: GameSession | null) {
  if (!session) return { isValid: false, errors: [] };
  const allErrors: {
    questionIdx: number;
    questionId: string;
    questionTitle: string;
    message: string;
  }[] = [];

  session.questions.forEach((q, idx) => {
    const qErrors = validateQuestion(q);
    qErrors.forEach((msg) => {
      allErrors.push({
        questionIdx: idx,
        questionId: q.id,
        questionTitle: q.title || `Soal ${idx + 1}`,
        message: msg,
      });
    });
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function GameFlowBuilder() {
  // Navigation & View Mode: "list" (Layar 0) | "builder" (Layar 1-4)
  const [viewMode, setViewMode] = useState<"list" | "builder">("list");
  // Steps: 1 Atur Pelajaran | 2 Isi Soal | 3 Coba sebagai Murid | 4 Terbitkan
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1, 2]);

  // Session Data & State
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"published" | "draft">("published");

  // Layar 0 Filter & Search State
  const [listFilter, setListFilter] = useState<"all" | "published" | "draft">("all");
  const [listSearch, setListSearch] = useState<string>("");

  const publishedCount = useMemo(
    () => sessions.filter((s) => s.status === "published").length,
    [sessions]
  );
  const draftCount = useMemo(
    () => sessions.filter((s) => s.status === "draft").length,
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const isDraft = s.status === "draft";
      const isPublished = s.status === "published";
      if (listFilter === "published" && !isPublished) return false;
      if (listFilter === "draft" && !isDraft) return false;

      if (!listSearch.trim()) return true;
      const q = listSearch.toLowerCase();
      const titleMatch = (s.title || "").toLowerCase().includes(q);
      const chapterMatch = (s.chapter || "").toLowerCase().includes(q);
      const subMatch = (s.subEthnic || "").toLowerCase().includes(q);
      return titleMatch || chapterMatch || subMatch;
    });
  }, [sessions, listFilter, listSearch]);

  const handleUpdateSessionStatus = async (newStatus: "draft" | "published") => {
    if (!activeSession) return;
    setSessionStatus(newStatus);
    const updated: GameSession = { ...activeSession, status: newStatus };
    setActiveSession(updated);
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? updated : s))
    );
    saveSingleSession(updated);
    await saveSingleSessionToServer(updated, newStatus);
  };

  // Question selection & Editor
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [mobileView, setMobileView] = useState<"list" | "editor">("list");
  const [draggedQIdx, setDraggedQIdx] = useState<number | null>(null);
  const [dragOverQIdx, setDragOverQIdx] = useState<number | null>(null);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);

  // Accordions & Modals
  const [advancedSessionOpen, setAdvancedSessionOpen] = useState(false);
  const [advancedQuestionOpen, setAdvancedQuestionOpen] = useState(false);
  const [isTypeGalleryOpen, setIsTypeGalleryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<GameSession | null>(null);
  const [deleteQuestionConfirmIdx, setDeleteQuestionConfirmIdx] = useState<number | null>(null);
  const [changeTypeConfirm, setChangeTypeConfirm] = useState<QuestionType | null>(null);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState(false);
  const [publishExplanationOpen, setPublishExplanationOpen] = useState(false);

  // Preview State
  const [previewStartIdx, setPreviewStartIdx] = useState<number>(0);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");

  // Autosave & Server State
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [saveState, setSaveState] = useState<{
    status: "idle" | "saving" | "saved" | "failed_local";
    message: string;
  }>({ status: "idle", message: "" });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const isInitialMount = useRef(true);
  const lastSavedSnapshot = useRef<string>("");

  // -------------------------------------------------------------------
  // INITIAL LOAD & PERSISTENCE
  // -------------------------------------------------------------------
  useEffect(() => {
    const list = getStoredSessions();
    setSessions(list);

    // Initial check for session ID from URL or first session
    let targetSessionId = "";
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSid = urlParams.get("session") || "";
      const urlStep = parseInt(urlParams.get("step") || "0", 10);
      const urlMode = urlParams.get("mode");

      if (urlSid && list.some((s) => s.id === urlSid)) {
        targetSessionId = urlSid;
      } else if (list.length > 0) {
        targetSessionId = list[0].id;
      }

      if (urlStep >= 1 && urlStep <= 4) {
        setCurrentStep(urlStep as 1 | 2 | 3 | 4);
        setVisitedSteps((prev) => Array.from(new Set([...prev, urlStep])));
      }

      if (urlMode === "builder" || urlSid) {
        setViewMode("builder");
      }
    } else if (list.length > 0) {
      targetSessionId = list[0].id;
    }

    if (targetSessionId) {
      const found = list.find((s) => s.id === targetSessionId);
      if (found) {
        lastSavedSnapshot.current = JSON.stringify(found);
        setActiveSessionId(found.id);
        setActiveSession(found);
        setSessionStatus(found.status || "published");
      }
    }

    // Sync with server sessions
    fetch("/api/content/sessions?all=1", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((serverData) => {
        if (Array.isArray(serverData) && serverData.length > 0) {
          const map = new Map<string, GameSession>();
          list.forEach((s) => {
            const normalizedStatus: "draft" | "published" = s.status === "draft" ? "draft" : "published";
            map.set(s.id, { ...s, status: normalizedStatus });
          });
          serverData.forEach(
            (row: {
              id: string;
              title: string;
              payload: GameSession;
              status: "draft" | "published";
            }) => {
              if (row.payload && row.id) {
                const existing = map.get(row.id);
                const status = (existing && existing.status === "draft")
                  ? "draft"
                  : (row.status === "draft" ? "draft" : "published");

                map.set(row.id, {
                  ...row.payload,
                  id: row.id,
                  title: row.title || row.payload.title,
                  status,
                });
              }
            }
          );
          const combined = Array.from(map.values());
          setSessions(combined);

          // If activeSession was loaded, update with merged server content
          if (targetSessionId && map.has(targetSessionId)) {
            const merged = map.get(targetSessionId)!;
            lastSavedSnapshot.current = JSON.stringify(merged);
            setActiveSession(merged);
            setSessionStatus(merged.status || "published");
          }
        }
      })
      .catch(() => {});
  }, []);

  // Update step and sync to URL / localStorage
  const handleSetStep = (step: 1 | 2 | 3 | 4) => {
    setCurrentStep(step);
    setVisitedSteps((prev) => Array.from(new Set([...prev, step])));
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("step", String(step));
        if (activeSessionId) {
          url.searchParams.set("session", activeSessionId);
          url.searchParams.set("mode", "builder");
        }
        window.history.replaceState({}, "", url.toString());
        localStorage.setItem(`laras_cms_step_${activeSessionId}`, String(step));
      } catch {}
    }
  };

  // -------------------------------------------------------------------
  // AUTOSAVE LOGIC (DRAFTS ONLY, DOES NOT PUBLISH)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!activeSession) return;

    // Hanya simpan jika terdapat perbedaan nyata pada sesi (bukan sekadar membuka editor)
    const currentStr = JSON.stringify(activeSession);
    if (lastSavedSnapshot.current && currentStr === lastSavedSnapshot.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastSavedSnapshot.current = currentStr;
      const currentOrDraftStatus =
        activeSession.status === "published" ? "published" : "draft";
      saveSingleSession({ ...activeSession, status: currentOrDraftStatus });
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setLastSavedTime(`${hh}:${mm}`);
    }, 800);

    return () => clearTimeout(timer);
  }, [activeSession, sessionStatus]);

  // -------------------------------------------------------------------
  // NAVIGATION & SESSION HANDLERS
  // -------------------------------------------------------------------
  const handleOpenBuilder = (sessionId: string, initialStep: 1 | 2 | 3 | 4 = 2) => {
    const s = sessions.find((item) => item.id === sessionId);
    if (s) {
      lastSavedSnapshot.current = JSON.stringify(s);
      setActiveSessionId(s.id);
      setActiveSession(s);
      setSessionStatus(s.status || "published");
      setSelectedQuestionIdx(0);
      setViewMode("builder");
      handleSetStep(initialStep);
    }
  };

  const handleCreateNewLesson = () => {
    const newId = `SES-CUSTOM-${Date.now().toString().slice(-4)}`;
    const newSession: GameSession = {
      id: newId,
      title: "Pelajaran Baru Tanpa Judul",
      chapter: "Bab Baru: Eksplorasi Adat",
      subEthnic: "Kaili Ledo • Lembah Palu",
      streakDays: 5,
      xpReward: 30,
      status: "draft",
      questions: [
        {
          id: `Q1-${Date.now()}`,
          type: "multiple_choice",
          title: "Pertanyaan 01",
          prompt: "Tuliskan pertanyaan pertama untuk murid di sini:",
          badge: "Tata Krama",
          options: [
            {
              id: "opt-1",
              label: "A",
              title: "Pilihan Jawaban Pertama (Kunci Benar)",
              isCorrect: true,
            },
            {
              id: "opt-2",
              label: "B",
              title: "Pilihan Jawaban Kedua (Pengecoh)",
              isCorrect: false,
            },
          ],
          curatorNote: "Tuliskan penjelasan singkat kenapa jawaban ini benar.",
        },
      ],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setActiveSession(newSession);
    setSessionStatus("draft");
    setSelectedQuestionIdx(0);
    saveSingleSession(newSession);

    // Buka builder langsung di Layar 1 (Atur Pelajaran)
    setViewMode("builder");
    handleSetStep(1);
  };

  const handleDuplicateSession = (targetSession?: GameSession) => {
    const s = targetSession || activeSession;
    if (!s) return;
    const newId = `SES-CUSTOM-${Date.now().toString().slice(-4)}`;
    const duplicated: GameSession = {
      ...JSON.parse(JSON.stringify(s)),
      id: newId,
      title: `${s.title} (Salinan)`,
      status: "draft",
    };

    const updated = [duplicated, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setActiveSession(duplicated);
    setSessionStatus("draft");
    setSelectedQuestionIdx(0);
    saveSingleSession(duplicated);

    setViewMode("builder");
    handleSetStep(1);
  };

  const handleDeleteSessionConfirmed = async () => {
    if (!deleteConfirmSession) return;
    if (sessions.length <= 1) {
      alert("Tidak dapat menghapus pelajaran terakhir.");
      setDeleteConfirmSession(null);
      return;
    }

    const sessionToDeleteId = deleteConfirmSession.id;
    const remaining = sessions.filter((s) => s.id !== sessionToDeleteId);
    setSessions(remaining);
    setDeleteConfirmSession(null);

    await deleteSessionFromServer(sessionToDeleteId);

    if (activeSessionId === sessionToDeleteId) {
      setActiveSessionId(remaining[0].id);
      setActiveSession(remaining[0]);
      setSessionStatus(remaining[0].status || "published");
      setSelectedQuestionIdx(0);
      setViewMode("list");
    }
  };

  const handleExportJson = (target?: GameSession) => {
    const s = target || activeSession;
    if (!s) return;
    try {
      const dataStr = JSON.stringify(s, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${s.id || "pelajaran"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengekspor JSON:", err);
    }
  };

  // -------------------------------------------------------------------
  // PUBLISH LOGIC (Layar 4)
  // -------------------------------------------------------------------
  const publishValidation = useMemo(
    () => validateSessionForPublish(activeSession),
    [activeSession]
  );

  const handlePublishSession = async () => {
    if (!activeSession) return;

    if (!publishValidation.isValid) {
      alert(
        `Tidak dapat menerbitkan! Masih terdapat ${publishValidation.errors.length} masalah yang harus diperbaiki.`
      );
      return;
    }

    setSaveState({ status: "saving", message: "Menerbitkan ke murid..." });
    setSessionStatus("published");

    const updatedWithStatus: GameSession = {
      ...activeSession,
      status: "published",
    };

    const res = await saveSingleSessionToServer(updatedWithStatus, "published");
    if (res.success) {
      setSaveState({
        status: "saved",
        message: "Pelajaran berhasil diterbitkan ke murid!",
      });
      setActiveSession(updatedWithStatus);
      setSessions((prev) =>
        prev.map((s) => (s.id === updatedWithStatus.id ? updatedWithStatus : s))
      );
      setPublishSuccessMessage(true);
    } else {
      setSaveState({
        status: "failed_local",
        message: `Gagal ke server — tersimpan lokal (${res.error || "offline"})`,
      });
    }

    setTimeout(() => {
      setSaveState({ status: "idle", message: "" });
    }, 3500);
  };

  // Jump to invalid field on question (Kahoot checklist jump)
  const jumpToInvalidField = (qIdx: number, errors: string[]) => {
    handleSetStep(2);
    setSelectedQuestionIdx(qIdx);
    setMobileView("editor");

    const firstErr = errors[0] || "";
    let targetId = "field-prompt";
    if (firstErr.includes("Instruksi") || firstErr.includes("Pertanyaan")) {
      targetId = "field-prompt";
    } else if (
      firstErr.includes("Pilihan ganda") ||
      firstErr.includes("kunci jawaban") ||
      firstErr.includes("opsi")
    ) {
      targetId = "field-options";
    } else if (firstErr.includes("Benar/Salah")) {
      targetId = "field-truefalse";
    } else if (firstErr.includes("pasangan") || firstErr.includes("Jodohkan")) {
      targetId = "field-match-pairs";
    } else if (firstErr.includes("urutan") || firstErr.includes("Susun")) {
      targetId = "field-order-items";
    } else if (
      firstErr.includes("Hotspot") ||
      firstErr.includes("titik") ||
      firstErr.includes("Gambar")
    ) {
      targetId = "field-hotspot";
    } else if (
      firstErr.includes("Skenario") ||
      firstErr.includes("Langkah") ||
      firstErr.includes("skor")
    ) {
      targetId = "field-scenario";
    }

    setFocusedFieldId(targetId);
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.();
      }
    }, 120);

    setTimeout(() => {
      setFocusedFieldId(null);
    }, 2500);
  };

  // -------------------------------------------------------------------
  // QUESTION HANDLERS
  // -------------------------------------------------------------------
  const handleAddQuestionFromGallery = (type: QuestionType) => {
    if (!activeSession) return;
    setIsTypeGalleryOpen(false);

    let newQ: GameQuestion;
    const qCount = activeSession.questions.length + 1;
    const baseId = `Q-${Date.now().toString().slice(-5)}`;

    switch (type) {
      case "match":
        newQ = {
          id: baseId,
          type: "match",
          title: `Soal ${qCount}: Jodohkan Pasangan`,
          prompt: "Pasangkan istilah adat dengan maknanya yang tepat:",
          badge: "Jodohkan Pasangan",
          pairs: [
            { left: "Tabe", right: "Permisi atau salam santun" },
            { left: "Pue", right: "Tokoh yang dituakan" },
          ],
          curatorNote: "Memahami hubungan istilah dan maknanya melatih ketepatan bertutur.",
        };
        break;

      case "order":
        newQ = {
          id: baseId,
          type: "order",
          title: `Soal ${qCount}: Susun Urutan`,
          prompt: "Susun langkah bertamu yang santun ke dalam urutan yang tepat:",
          badge: "Susun Langkah",
          items: ["Menunggu di serambi", "Mengucapkan Tabe", "Menyampaikan maksud"],
          curatorNote: "Urutan yang tertata mencerminkan ketenangan budi pekerti.",
        };
        break;

      case "true_false":
        newQ = {
          id: baseId,
          type: "true_false",
          title: `Soal ${qCount}: Benar atau Salah`,
          prompt: "Tentukan apakah pernyataan berikut bernilai fakta atau mitos:",
          statement: "Tabe hanya boleh diucapkan saat berpamitan pulang.",
          answerBoolean: false,
          badge: "Mitos & Fakta",
          curatorNote: "Tabe dapat digunakan untuk menyapa, meminta izin, maupun melintas.",
        };
        break;

      case "scenario":
        newQ = {
          id: baseId,
          type: "scenario",
          title: `Soal ${qCount}: Skenario Bertamu`,
          prompt: "Tentukan keputusan sikapmu saat bertamu di Souraja:",
          badge: "Skenario Adab",
          steps: [
            {
              prompt: "Tetua sedang berbicara dengan tamunya di serambi. Apa tindakanmu?",
              choices: [
                {
                  label: "Menunggu dengan tenang di sisi tangga",
                  score: 1,
                  feedback: "Sabar dan menghargai percakapan.",
                },
                {
                  label: "Mengucapkan Tabe sambil menunduk ringan",
                  score: 2,
                  feedback: "Sangat santun dan tepat waktu.",
                },
              ],
            },
          ],
          passingScore: 2,
          curatorNote: "Sikap tenang dan penuh rasa hormat adalah kunci bertamu di rumah adat.",
        };
        break;

      case "hotspot":
        newQ = {
          id: baseId,
          type: "hotspot",
          title: `Soal ${qCount}: Hotspot Gambar`,
          prompt: "Temukan bagian artefak yang memiliki fungsi sakral berikut:",
          badge: "Hotspot Visual",
          imageUrl: IMAGE_PRESETS[0].url,
          imageCaption: "Artefak kebudayaan Nusantara.",
          hotspots: [
            {
              id: 1,
              name: "Pangkal Tiup",
              title: "Pangkal Tiup",
              description: "Bagian saluran udara instrumen.",
              top: "25%",
              left: "40%",
            },
            {
              id: 2,
              name: "Lubang Laras",
              title: "Lubang Laras",
              description: "Pusat nada instrumen.",
              top: "55%",
              left: "50%",
            },
          ],
          options: [
            { id: "1", label: "A", title: "Pangkal Tiup", isCorrect: false },
            { id: "2", label: "B", title: "Lubang Laras", isCorrect: true },
          ],
          curatorNote: "Penetapan jawaban merujuk pada catatan etnomusikologi tetua adat.",
        };
        break;

      case "multiple_choice":
      default:
        newQ = {
          id: baseId,
          type: "multiple_choice",
          title: `Soal ${qCount}: Pilihan Ganda`,
          prompt: "Apa makna tata krama adat berikut ini?",
          badge: "Pilihan Ganda",
          options: [
            {
              id: "opt-1",
              label: "A",
              title: "Makna Pertama (Jawaban Benar)",
              isCorrect: true,
            },
            {
              id: "opt-2",
              label: "B",
              title: "Makna Kedua (Pengecoh)",
              isCorrect: false,
            },
          ],
          curatorNote: "Catatan edukatif untuk panduan pemelajar adat.",
        };
        break;
    }

    const updatedSession = {
      ...activeSession,
      questions: [...activeSession.questions, newQ],
    };

    setActiveSession(updatedSession);
    setSelectedQuestionIdx(updatedSession.questions.length - 1);
    setMobileView("editor");
  };

  const handleDuplicateQuestion = (idx: number) => {
    if (!activeSession) return;
    const targetQ = activeSession.questions[idx];
    const cloned: GameQuestion = {
      ...JSON.parse(JSON.stringify(targetQ)),
      id: `Q-${Date.now().toString().slice(-5)}`,
      title: `${targetQ.title || `Soal ${idx + 1}`} (Salinan)`,
    };

    const list = [...activeSession.questions];
    list.splice(idx + 1, 0, cloned);
    const updatedSession = { ...activeSession, questions: list };
    setActiveSession(updatedSession);
    setSelectedQuestionIdx(idx + 1);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!activeSession || activeSession.questions.length <= 1) return;
    const updatedQuestions = activeSession.questions.filter((_, i) => i !== idx);
    const updatedSession = { ...activeSession, questions: updatedQuestions };
    setActiveSession(updatedSession);
    setSelectedQuestionIdx(Math.max(0, idx - 1));
    setDeleteQuestionConfirmIdx(null);
  };

  const handleReorderQuestion = (fromIdx: number, toIdx: number) => {
    if (!activeSession) return;
    if (toIdx < 0 || toIdx >= activeSession.questions.length) return;

    const list = [...activeSession.questions];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);

    const updatedSession = { ...activeSession, questions: list };
    setActiveSession(updatedSession);
    setSelectedQuestionIdx(toIdx);
  };

  const handleDropReorder = (fromIdx: number | null, toIdx: number) => {
    if (fromIdx === null || fromIdx === toIdx || !activeSession) return;
    const list = [...activeSession.questions];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    const updatedSession = { ...activeSession, questions: list };
    setActiveSession(updatedSession);
    setSelectedQuestionIdx(toIdx);
    setDraggedQIdx(null);
    setDragOverQIdx(null);
  };

  const handleConfirmChangeType = (newType: QuestionType) => {
    if (!activeSession) return;
    const currentQ = activeSession.questions[selectedQuestionIdx];
    if (!currentQ) return;

    let updatedQ: GameQuestion = {
      ...currentQ,
      type: newType,
    };

    // Bersihkan opsi lama yang tidak kompatibel agar skema tetap valid
    if (newType === "multiple_choice") {
      updatedQ.options = [
        { id: "opt-1", label: "A", title: "Jawaban Benar", isCorrect: true },
        { id: "opt-2", label: "B", title: "Pengecoh", isCorrect: false },
      ];
    } else if (newType === "true_false") {
      updatedQ.statement = updatedQ.prompt || "Pernyataan fakta adat";
      updatedQ.answerBoolean = true;
    } else if (newType === "match") {
      updatedQ.pairs = [
        { left: "Istilah A", right: "Makna A" },
        { left: "Istilah B", right: "Makna B" },
      ];
    } else if (newType === "order") {
      updatedQ.items = ["Langkah 1", "Langkah 2", "Langkah 3"];
    } else if (newType === "hotspot") {
      updatedQ.hotspots = [
        {
          id: 1,
          name: "Titik Utama",
          title: "Titik Utama",
          description: "Deskripsi bagian artefak",
          top: "35%",
          left: "45%",
        },
      ];
      updatedQ.options = [
        { id: "1", label: "A", title: "Titik Utama", isCorrect: true },
      ];
    } else if (newType === "scenario") {
      updatedQ.steps = [
        {
          prompt: "Situasi yang dialami:",
          choices: [
            { label: "Sikap ramah", score: 2, feedback: "Sangat santun" },
            { label: "Sikap biasa", score: 1, feedback: "Cukup baik" },
          ],
        },
      ];
    }

    const updated = [...activeSession.questions];
    updated[selectedQuestionIdx] = updatedQ;
    setActiveSession({ ...activeSession, questions: updated });
    setChangeTypeConfirm(null);
  };

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageUrl" | "audioUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file || !activeSession) return;

    setUploadingMedia(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/content/media/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        const targetQ = activeSession.questions[selectedQuestionIdx];
        if (targetQ) {
          const updated = [...activeSession.questions];
          updated[selectedQuestionIdx] = {
            ...targetQ,
            [field]: data.url,
          };
          setActiveSession({ ...activeSession, questions: updated });
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || "Gagal mengunggah media");
      }
    } catch (err) {
      alert(
        "Gagal mengunggah media: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setUploadingMedia(false);
    }
  };

  // Helper type badge
  const getTypeBadgeInfo = (t: QuestionType) => {
    switch (t) {
      case "match":
      case "matching":
        return {
          label: "Jodohkan Pasangan",
          bg: "bg-purple-100 text-purple-900 border-purple-200",
          Icon: ArrowLeftRight,
        };
      case "order":
      case "word_builder":
        return {
          label: "Susun Urutan",
          bg: "bg-teal-100 text-teal-900 border-teal-200",
          Icon: ListOrdered,
        };
      case "true_false":
        return {
          label: "Benar / Salah",
          bg: "bg-amber-100 text-amber-900 border-amber-200",
          Icon: CheckSquare,
        };
      case "scenario":
      case "roleplay":
        return {
          label: "Skenario Bercabang",
          bg: "bg-sky-100 text-sky-900 border-sky-200",
          Icon: GitBranch,
        };
      case "hotspot":
      case "visual":
        return {
          label: "Hotspot Visual",
          bg: "bg-rose-100 text-rose-900 border-rose-200",
          Icon: Crosshair,
        };
      case "multiple_choice":
      default:
        return {
          label: "Pilihan Ganda",
          bg: "bg-blue-100 text-blue-900 border-blue-200",
          Icon: ListChecks,
        };
    }
  };

  // Current selected question reference
  const currentQ =
    activeSession && activeSession.questions.length > 0
      ? activeSession.questions[selectedQuestionIdx] ||
        activeSession.questions[0]
      : null;

  const currentQErrors = currentQ ? validateQuestion(currentQ) : [];
  const isCurrentQComplete = currentQErrors.length === 0;

  // =====================================================================
  // VIEW 1: DAFTAR PELAJARAN (LAYAR 0 / PINTU MASUK CMS)
  // =====================================================================
  // VIEW 1: DAFTAR PELAJARAN (LAYAR 0 / PINTU MASUK CMS)
  // =====================================================================
  if (viewMode === "list") {
    return (
      <div className="space-y-5 animate-in fade-in duration-200">
        {/* Header Daftar Pelajaran */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary-fixed/50 px-2.5 py-0.5 rounded-full">
                Pintu Masuk CMS
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Penyusun Alur Game &amp; Soal Budaya
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-on-surface mt-1">
              Daftar Pelajaran Budaya
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Kelola kurikulum adat, susun soal interaktif, dan terbitkan materi ke peta belajar murid.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/30 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Buka panduan admin"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Panduan</span>
            </button>

            <button
              type="button"
              onClick={handleCreateNewLesson}
              className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary text-xs sm:text-sm font-black shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Pelajaran Baru</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Filter Status & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/25 shadow-2xs">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setListFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                listFilter === "all"
                  ? "bg-primary text-on-primary shadow-2xs"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Semua ({sessions.length})
            </button>
            <button
              type="button"
              onClick={() => setListFilter("published")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                listFilter === "published"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Terbit ({publishedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setListFilter("draft")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                listFilter === "draft"
                  ? "bg-amber-700 text-white shadow-2xs"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Draf ({draftCount})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Cari judul pelajaran, bab, atau suku..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-surface-container-low text-xs font-medium text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {listSearch && (
              <button
                type="button"
                onClick={() => setListSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Keadaan Kosong */}
        {sessions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-surface-container-lowest border-2 border-dashed border-outline-variant/40 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed/40 text-primary mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-black text-on-surface">
                Belum ada pelajaran
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Tekan tombol <strong>+ Pelajaran Baru</strong> di atas untuk membuat pelajaran pertama bagi murid.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNewLesson}
              className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-black text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pelajaran Pertama</span>
            </button>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <Search className="w-8 h-8 text-on-surface-variant mx-auto opacity-50" />
            <p className="text-xs font-bold text-on-surface">
              Tidak ada pelajaran yang cocok dengan pencarian &quot;{listSearch}&quot;
            </p>
            <button
              type="button"
              onClick={() => {
                setListSearch("");
                setListFilter("all");
              }}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => {
              const validation = validateSessionForPublish(session);
              const isPublished = session.status === "published";

              return (
                <div
                  key={session.id}
                  className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-xs hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group space-y-3.5"
                >
                  <div className="space-y-2.5">
                    {/* Top Bar: Status Badge (Emerald/Amber) & Chapter Tag */}
                    <div className="flex items-center justify-between gap-2">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span>Terbit • Murid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs shrink-0">
                          <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Draf • Admin</span>
                        </span>
                      )}

                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-on-surface-variant/80 bg-surface-container-low px-2 py-0.5 rounded-lg truncate max-w-[170px]"
                        title={session.chapter || "Tanpa Bab"}
                      >
                        <BookOpen className="w-3 h-3 text-primary/70 shrink-0" />
                        <span className="truncate">{session.chapter || "Tanpa Bab"}</span>
                      </span>
                    </div>

                    {/* Judul & Lokasi Adat */}
                    <div className="space-y-0.5 pt-0.5">
                      <h3
                        className="text-base font-black text-on-surface group-hover:text-primary transition-colors line-clamp-1"
                        title={session.title}
                      >
                        {session.title || "Pelajaran Tanpa Judul"}
                      </h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-on-surface-variant/70 shrink-0" />
                        <span className="truncate">
                          {session.subEthnic || "Kaili Ledo • Lembah Palu"}
                        </span>
                      </p>
                    </div>

                    {/* Stats & Completeness Bar */}
                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-outline-variant/15">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-on-surface bg-surface-container px-2 py-0.5 rounded-md text-[11px]">
                          {session.questions.length} Soal
                        </span>
                        {validation.isValid ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Lengkap</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold text-[11px] flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>{validation.errors.length} Kurang</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-black text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-md shrink-0">
                        +{session.xpReward || 20} XP
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenBuilder(session.id, 2)}
                      className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary text-xs font-black hover:bg-primary-container active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah Soal</span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenBuilder(session.id, 3)}
                        className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Coba sebagai murid (Pratinjau)"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenBuilder(session.id, 1)}
                        className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Atur Judul, Bab & Status"
                      >
                        <Layers className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateSession(session)}
                        className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Duplikat pelajaran"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmSession(session)}
                        className="p-2 rounded-xl bg-surface-container hover:bg-red-50 text-on-surface-variant hover:text-red-700 transition-colors cursor-pointer"
                        title="Hapus pelajaran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Bantuan/Panduan */}
        {isGuideOpen && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-on-surface">
                    Panduan Admin Penyusun Game
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-on-surface font-medium leading-relaxed">
                <div className="p-3 rounded-2xl bg-primary-fixed/20 border border-primary/20">
                  <h4 className="font-black text-primary text-sm mb-1">
                    4 Langkah Alur Kerja CMS
                  </h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li><strong>Atur Pelajaran:</strong> Tentukan nama pelajaran, bab materi, dan status draf/terbit.</li>
                    <li><strong>Isi Soal:</strong> Tambah tipe soal yang diinginkan, tulis pertanyaan, dan tandai kunci jawaban.</li>
                    <li><strong>Coba sebagai Murid:</strong> Mainkan langsung di bingkai ponsel tanpa merusak progres murid.</li>
                    <li><strong>Terbitkan:</strong> Periksa checklist kelengkapan dan terbitkan ke peta belajar murid.</li>
                  </ol>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="font-black text-on-surface text-sm">
                    Tanya Jawab Singkat (FAQ)
                  </h4>
                  <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                    <p className="font-black text-primary">Kenapa tombol Terbitkan tidak bisa ditekan?</p>
                    <p className="text-on-surface-variant">Karena masih ada soal yang belum memiliki kunci jawaban atau pertanyaan yang lengkap. Periksa daftar checklist di Langkah 4.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                    <p className="font-black text-primary">Bedanya Draf dan Terbit apa?</p>
                    <p className="text-on-surface-variant">Draf hanya terlihat oleh admin untuk disunting. Terbit akan langsung muncul dan dapat dimainkan oleh semua murid di peta belajar.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                    <p className="font-black text-primary">Apakah saya harus menekan tombol Simpan?</p>
                    <p className="text-on-surface-variant">Tidak perlu. Semua tulisan dan perubahan tersimpan otomatis setiap beberapa detik. Cek indikator waktu tersimpan di bagian atas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Pelajaran */}
        {deleteConfirmSession && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-on-surface">
                  Hapus Pelajaran Ini?
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Apakah Anda yakin ingin menghapus pelajaran{" "}
                  <strong>&quot;{deleteConfirmSession.title}&quot;</strong>? Seluruh soal di dalamnya akan dihapus.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSession(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSessionConfirmed}
                  className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-xs font-black text-white cursor-pointer"
                >
                  Ya, Hapus Pelajaran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =====================================================================
  // VIEW 2: BUILDER BERBASIS 4 LANGKAH
  // =====================================================================
  if (!activeSession) {
    return (
      <div className="p-12 text-center text-on-surface-variant font-bold">
        Memuat data pelajaran...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast Alert Autosave/Sync */}
      {saveState.status !== "idle" && (
        <div
          className={`fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border animate-in fade-in slide-in-from-top-2 duration-200 ${
            saveState.status === "saved"
              ? "bg-secondary text-on-secondary border-secondary-container"
              : saveState.status === "failed_local"
              ? "bg-amber-700 text-white border-amber-800"
              : "bg-surface-container-highest text-on-surface border-outline-variant/30"
          }`}
        >
          {saveState.status === "saved" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : saveState.status === "failed_local" ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
          )}
          <span className="text-label-sm font-bold">{saveState.message}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* HEADER RINGKAS PERSISTEN (SEMUA LAYAR)                   */}
      {/* ======================================================== */}
      <div className="sticky top-0 z-40 p-3 sm:p-4 rounded-3xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Kiri: Tombol Kembali ke Daftar & Info Pelajaran */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/20 transition-colors shrink-0 cursor-pointer"
            title="Kembali ke Daftar Pelajaran"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar Pelajaran</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-on-surface truncate max-w-[240px] sm:max-w-[360px]">
                {activeSession.title || "Pelajaran Tanpa Judul"}
              </h2>
              {activeSession.status === "published" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Terbit • Murid</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs shrink-0">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Draf • Admin</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5">
              <span className="flex items-center gap-1 font-semibold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    lastSavedTime ? "bg-emerald-500" : "bg-outline/50"
                  }`}
                />
                <span>
                  {lastSavedTime
                    ? `Tersimpan otomatis • ${lastSavedTime}`
                    : "Menunggu perubahan..."}
                </span>
              </span>
              <span>•</span>
              <span className="font-medium truncate">
                {activeSession.questions.length} Soal • {activeSession.chapter || "Tanpa Bab"}
              </span>
            </div>
          </div>
        </div>

        {/* Kanan: Tombol Bantuan / Panduan */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
            title="Buka panduan penyusun"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="hidden md:inline">Bantuan</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEPPER TETAP 4 LANGKAH (RANCANGAN 1)                   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-xs">
        {[
          { step: 1, title: "1. Atur Pelajaran", desc: "Judul, bab & status" },
          { step: 2, title: "2. Isi Soal", desc: "Daftar & konten soal" },
          { step: 3, title: "3. Coba sebagai Murid", desc: "Pratinjau rute murid" },
          { step: 4, title: "4. Terbitkan", desc: "Checklist & publikasi" },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isVisited = visitedSteps.includes(item.step);

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => handleSetStep(item.step as 1 | 2 | 3 | 4)}
              className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-center ${
                isActive
                  ? "bg-primary text-on-primary shadow-xs font-black ring-2 ring-primary/20"
                  : isVisited
                  ? "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                  : "bg-transparent text-on-surface-variant/60 hover:text-on-surface"
              }`}
            >
              <span className="text-xs font-black block truncate">
                {item.title}
              </span>
              <span
                className={`text-[10px] block truncate ${
                  isActive ? "text-on-primary/80" : "text-on-surface-variant/70"
                }`}
              >
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* LAYAR 1: ATUR PELAJARAN (RANCANGAN 2)                   */}
      {/* ======================================================== */}
      {currentStep === 1 && (
        <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-full">
                Langkah 1 dari 4
              </span>
              <h2 className="text-lg font-black text-on-surface mt-2">
                Atur Informasi Pelajaran
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Tentukan nama materi dan bab yang akan dilihat oleh murid saat memilih pelajaran di peta belajar.
              </p>
            </div>

            {/* Pemilih Pelajaran / Sesi Lain */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <label className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant block">
                  Sedang Mengedit Pelajaran:
                </label>
                <select
                  value={activeSessionId}
                  onChange={(e) => handleOpenBuilder(e.target.value, 1)}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-bold border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.questions.length} Soal) •{" "}
                      {s.status === "draft" ? "Draf" : "Terbit"}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleCreateNewLesson}
                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface shrink-0 flex items-center gap-1.5 border border-outline-variant/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Pelajaran Baru</span>
              </button>
            </div>

            {/* Form Inti Saja */}
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-black text-on-surface block mb-1">
                  Judul Pelajaran
                </label>
                <input
                  type="text"
                  value={activeSession.title || ""}
                  onChange={(e) =>
                    setActiveSession({ ...activeSession, title: e.target.value })
                  }
                  placeholder="Misal: Salam & Adab Tabe"
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low text-sm font-bold text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Nama ini yang dilihat murid di peta belajar.
                </p>
              </div>

              <div>
                <label className="text-xs font-black text-on-surface block mb-1">
                  Bab Pembelajaran
                </label>
                <input
                  type="text"
                  value={activeSession.chapter || ""}
                  onChange={(e) =>
                    setActiveSession({ ...activeSession, chapter: e.target.value })
                  }
                  placeholder="Misal: Bab 1: Sapaan Harian & Kehormatan"
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low text-sm font-bold text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Kelompok materi di roadmap belajar murid.
                </p>
              </div>

              {/* Status Publikasi sebagai 2 Kartu Besar */}
              <div>
                <label className="text-xs font-black text-on-surface block mb-2">
                  Status Pelajaran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdateSessionStatus("draft")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                      sessionStatus === "draft"
                        ? "border-amber-500 bg-amber-50/70 shadow-xs"
                        : "border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-on-surface">
                        Draf — hanya admin
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                        Hanya saya yang bisa lihat, murid belum bisa memainkan.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateSessionStatus("published")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                      sessionStatus === "published"
                        ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                        : "border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-on-surface">
                        Terbit — tampil untuk murid
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                        Murid bisa memainkan pelajaran ini di peta belajar.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Accordion Pengaturan Lanjutan */}
              <div className="border-t border-outline-variant/20 pt-3">
                <button
                  type="button"
                  onClick={() => setAdvancedSessionOpen(!advancedSessionOpen)}
                  className="w-full flex items-center justify-between py-2 text-xs font-black text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <span>Pengaturan lanjutan</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      advancedSessionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {advancedSessionOpen && (
                  <div className="space-y-4 pt-2 pb-1 animate-in fade-in duration-150">
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                        Poin XP untuk sesi ini (opsional)
                      </label>
                      <input
                        type="number"
                        value={activeSession.xpReward ?? 20}
                        onChange={(e) =>
                          setActiveSession({
                            ...activeSession,
                            xpReward: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                        Sub-Etnis / Wilayah Adat (opsional)
                      </label>
                      <input
                        type="text"
                        value={activeSession.subEthnic || ""}
                        onChange={(e) =>
                          setActiveSession({
                            ...activeSession,
                            subEthnic: e.target.value,
                          })
                        }
                        placeholder="Misal: Kaili Ledo • Lembah Palu"
                        className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateSession()}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplikat Pelajaran</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportJson()}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Export JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmSession(activeSession)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 ml-auto flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Pelajaran</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAYAR 2: ISI SOAL (RANCANGAN 3)                         */}
      {/* ======================================================== */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start animate-in fade-in duration-150">
          {/* Kolom Kiri: Daftar Kartu Soal */}
          <div
            className={`lg:col-span-4 space-y-3 ${
              mobileView === "editor" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="text-[11px] uppercase font-black tracking-wider text-primary">
                  Daftar Soal ({activeSession.questions.length})
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold">
                  Seret ≡ untuk urutan
                </span>
              </div>

              {/* Daftar Soal */}
              <div className="space-y-2 max-h-[62vh] overflow-y-auto pr-1">
                {activeSession.questions.map((q, idx) => {
                  const isSelected = selectedQuestionIdx === idx;
                  const qErrors = validateQuestion(q);
                  const isComplete = qErrors.length === 0;
                  const { label: typeLabel, bg: typeBg, Icon: TIcon } = getTypeBadgeInfo(q.type);

                  return (
                    <div
                      key={q.id || idx}
                      draggable
                      onDragStart={() => setDraggedQIdx(idx)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverQIdx(idx);
                      }}
                      onDragEnd={() => {
                        if (draggedQIdx !== null && dragOverQIdx !== null) {
                          handleDropReorder(draggedQIdx, dragOverQIdx);
                        }
                      }}
                      onClick={() => {
                        setSelectedQuestionIdx(idx);
                        setMobileView("editor");
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 group ${
                        isSelected
                          ? "bg-primary-fixed/30 border-primary shadow-xs ring-1 ring-primary/20"
                          : "bg-surface-container-low hover:bg-surface-container border-outline-variant/20"
                      }`}
                    >
                      {/* Pegangan Drag & Nomor */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-on-surface-variant/50 group-hover:text-primary cursor-grab shrink-0">
                          <GripVertical className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-black text-on-surface-variant shrink-0">
                          #{idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${typeBg}`}
                            >
                              {typeLabel}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-on-surface truncate max-w-[170px] sm:max-w-[210px] mt-0.5">
                            {q.prompt || "(Belum ada pertanyaan)"}
                          </p>
                        </div>
                      </div>

                      {/* Status Kelengkapan & Reorder Arrows */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isComplete ? (
                          <span
                            className="p-1 rounded-full text-emerald-600 bg-emerald-100/60"
                            title="Soal ini lengkap"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        ) : (
                          <span
                            className="p-1 rounded-full text-amber-700 bg-amber-100"
                            title={`Belum lengkap: ${qErrors.join(", ")}`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        )}

                        <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorderQuestion(idx, idx - 1);
                            }}
                            className="p-0.5 hover:text-primary disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === activeSession.questions.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorderQuestion(idx, idx + 1);
                            }}
                            className="p-0.5 hover:text-primary disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tombol Besar + Soal Baru */}
              <button
                type="button"
                onClick={() => setIsTypeGalleryOpen(true)}
                className="w-full py-3 rounded-2xl bg-primary text-on-primary text-xs font-black shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Soal Baru</span>
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Editor Soal (SATU Kolom) */}
          <div
            className={`lg:col-span-8 space-y-4 ${
              mobileView === "list" ? "hidden lg:block" : "block"
            }`}
          >
            {currentQ ? (
              <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-5">
                {/* Header Editor: Status Kelengkapan & Tombol Pratinjau Soal Ini */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    {/* Tombol Kembali ke Daftar di Mobile */}
                    <button
                      type="button"
                      onClick={() => setMobileView("list")}
                      className="lg:hidden p-1.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Daftar Soal</span>
                    </button>

                    <span className="text-xs font-black text-on-surface">
                      Soal #{selectedQuestionIdx + 1}
                    </span>

                    {/* Status Kelengkapan */}
                    {isCurrentQComplete ? (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Soal ini lengkap ✓</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => jumpToInvalidField(selectedQuestionIdx, currentQErrors)}
                        className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 hover:underline cursor-pointer"
                        title="Klik untuk melompat ke bagian yang kurang"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kurang: {currentQErrors[0]}</span>
                      </button>
                    )}
                  </div>

                  {/* Tombol Pratinjau Soal Ini */}
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewStartIdx(selectedQuestionIdx);
                      handleSetStep(3);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary-container active:scale-95 transition-all cursor-pointer shadow-xs"
                    title="Coba soal ini sebagai murid"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Soal Ini</span>
                  </button>
                </div>

                {/* ── BAGIAN A: TIPE SOAL ── */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant">
                      Format Soal:
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                        getTypeBadgeInfo(currentQ.type).bg
                      }`}
                    >
                      {getTypeBadgeInfo(currentQ.type).label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTypeGalleryOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-primary border border-outline-variant/30 transition-all cursor-pointer"
                  >
                    Ganti Format Soal
                  </button>
                </div>

                {/* ── BAGIAN B: PERTANYAAN / INSTRUKSI UTAMA ── */}
                <div id="field-prompt">
                  <label className="text-xs font-black text-on-surface block mb-1">
                    Pertanyaan / Instruksi Utama
                  </label>
                  <textarea
                    rows={3}
                    value={currentQ.prompt || ""}
                    onChange={(e) => {
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = {
                        ...currentQ,
                        prompt: e.target.value,
                      };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    placeholder="Tuliskan pertanyaan seperti bertanya langsung ke murid..."
                    className={`w-full p-3.5 rounded-2xl bg-surface-container-low text-sm font-semibold text-on-surface border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                      focusedFieldId === "field-prompt"
                        ? "ring-2 ring-amber-500 border-amber-500 animate-pulse"
                        : "border-outline-variant/20"
                    }`}
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Tulis seperti bertanya langsung ke murid.
                  </p>
                </div>

                {/* ── BAGIAN C: MEDIA (OPSIONAL) ── */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-on-surface">
                        Media Ilustrasi (Boleh Kosong)
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        Opsional — murid tetap bisa menjawab walau tanpa gambar atau audio.
                      </p>
                    </div>

                    {currentQ.imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = {
                            ...currentQ,
                            imageUrl: "",
                          };
                          setActiveSession({ ...activeSession, questions: updated });
                        }}
                        className="text-[11px] font-bold text-red-700 hover:underline cursor-pointer"
                      >
                        Hapus Media
                      </button>
                    )}
                  </div>

                  {currentQ.imageUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface">
                        <img
                          src={currentQ.imageUrl}
                          alt="Ilustrasi Soal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-on-surface truncate">
                          {currentQ.imageUrl}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          Gambar aktif untuk soal ini
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-on-surface border border-outline-variant/30 cursor-pointer flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                        <span>{uploadingMedia ? "Mengunggah..." : "Unggah Gambar"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadFile(e, "imageUrl")}
                          disabled={uploadingMedia}
                        />
                      </label>

                      <span className="text-[11px] text-on-surface-variant">atau pilih preset:</span>
                      <div className="flex flex-wrap gap-1">
                        {IMAGE_PRESETS.slice(0, 3).map((p, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = {
                                ...currentQ,
                                imageUrl: p.url,
                              };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="px-2 py-1 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-[11px] font-bold text-on-surface border border-outline-variant/20 cursor-pointer truncate max-w-[140px]"
                          >
                            {p.name.split(" ")[0]} {p.name.split(" ")[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── BAGIAN D: JAWABAN (EDITOR PER TIPE DARI RONDE 5) ── */}
                <div className="space-y-3 pt-1">
                  {/* Tipe 1: Pilihan Ganda */}
                  {currentQ.type === "multiple_choice" && (
                    <div id="field-options" className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-on-surface block">
                          Pilihan Jawaban &amp; Kunci Benar
                        </label>
                        <p className="text-[11px] text-on-surface-variant">
                          Tandai satu jawaban yang benar sebagai kunci jawaban murid.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {(currentQ.options || []).map((opt, oIdx) => (
                          <div
                            key={opt.id || oIdx}
                            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                              opt.isCorrect
                                ? "bg-emerald-50/70 border-emerald-400"
                                : "bg-surface-container-low border-outline-variant/20"
                            }`}
                          >
                            {/* Radio Kunci Benar */}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedOpts = (currentQ.options || []).map(
                                  (o, idx) => ({
                                    ...o,
                                    isCorrect: idx === oIdx,
                                  })
                                );
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = {
                                  ...currentQ,
                                  options: updatedOpts,
                                };
                                setActiveSession({
                                  ...activeSession,
                                  questions: updated,
                                });
                              }}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer ${
                                opt.isCorrect
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-outline hover:border-emerald-600"
                              }`}
                              title={
                                opt.isCorrect
                                  ? "Kunci Benar"
                                  : "Jadikan Kunci Benar"
                              }
                            >
                              {opt.isCorrect && (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                            </button>

                            <input
                              type="text"
                              value={opt.title || ""}
                              onChange={(e) => {
                                const updatedOpts = [...(currentQ.options || [])];
                                updatedOpts[oIdx] = {
                                  ...opt,
                                  title: e.target.value,
                                };
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = {
                                  ...currentQ,
                                  options: updatedOpts,
                                };
                                setActiveSession({
                                  ...activeSession,
                                  questions: updated,
                                });
                              }}
                              placeholder={`Tulis pilihan jawaban ${String.fromCharCode(65 + oIdx)}...`}
                              className="flex-1 bg-transparent text-xs font-bold text-on-surface focus:outline-none"
                            />

                            <button
                              type="button"
                              disabled={(currentQ.options || []).length <= 2}
                              onClick={() => {
                                const updatedOpts = (currentQ.options || []).filter(
                                  (_, idx) => idx !== oIdx
                                );
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = {
                                  ...currentQ,
                                  options: updatedOpts,
                                };
                                setActiveSession({
                                  ...activeSession,
                                  questions: updated,
                                });
                              }}
                              className="text-on-surface-variant hover:text-red-700 disabled:opacity-20 cursor-pointer p-1"
                              title="Hapus opsi ini"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentOpts = currentQ.options || [];
                          const nextChar = String.fromCharCode(65 + currentOpts.length);
                          const updatedOpts = [
                            ...currentOpts,
                            {
                              id: `opt-${Date.now()}`,
                              label: nextChar,
                              title: `Pilihan Jawaban ${nextChar}`,
                              isCorrect: false,
                            },
                          ];
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = {
                            ...currentQ,
                            options: updatedOpts,
                          };
                          setActiveSession({
                            ...activeSession,
                            questions: updated,
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Opsi Pilihan</span>
                      </button>
                    </div>
                  )}

                  {/* Tipe 2: Benar / Salah */}
                  {currentQ.type === "true_false" && (
                    <div id="field-truefalse" className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-on-surface block">
                          Pernyataan &amp; Kunci Benar/Salah
                        </label>
                        <p className="text-[11px] text-on-surface-variant">
                          Tentukan apakah pernyataan di atas bernilai Benar atau Salah.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = {
                              ...currentQ,
                              answerBoolean: true,
                            };
                            setActiveSession({
                              ...activeSession,
                              questions: updated,
                            });
                          }}
                          className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer font-black text-sm ${
                            currentQ.answerBoolean === true
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs"
                              : "border-outline-variant/30 bg-surface-container-low text-on-surface hover:bg-surface-container"
                          }`}
                        >
                          ✓ BENAR (FAKTA)
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = {
                              ...currentQ,
                              answerBoolean: false,
                            };
                            setActiveSession({
                              ...activeSession,
                              questions: updated,
                            });
                          }}
                          className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer font-black text-sm ${
                            currentQ.answerBoolean === false
                              ? "border-rose-600 bg-rose-50 text-rose-900 shadow-xs"
                              : "border-outline-variant/30 bg-surface-container-low text-on-surface hover:bg-surface-container"
                          }`}
                        >
                          ✗ SALAH (MITOS)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tipe 3: Jodohkan Pasangan */}
                  {(currentQ.type === "match" || currentQ.type === "matching") && (
                    <div id="field-match-pairs" className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-on-surface block">
                          Pasangan Istilah &amp; Makna (Minimal 2 Pasang)
                        </label>
                        <p className="text-[11px] text-on-surface-variant">
                          Minimal 2 pasangan. Murid akan menghubungkan kolom kiri dengan kanan.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {((currentQ.pairs || currentQ.matchingPairs || [])).map(
                          (pair, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-2"
                            >
                              <span className="text-xs font-black text-on-surface-variant w-5">
                                #{pIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={pair.left || ""}
                                onChange={(e) => {
                                  const currentPairs = [
                                    ...(currentQ.pairs || currentQ.matchingPairs || []),
                                  ];
                                  currentPairs[pIdx] = {
                                    ...pair,
                                    left: e.target.value,
                                  };
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = {
                                    ...currentQ,
                                    pairs: currentPairs,
                                  };
                                  setActiveSession({
                                    ...activeSession,
                                    questions: updated,
                                  });
                                }}
                                placeholder="Kata / Istilah Kiri"
                                className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                              />
                              <ArrowRight className="w-4 h-4 text-on-surface-variant shrink-0" />
                              <input
                                type="text"
                                value={pair.right || ""}
                                onChange={(e) => {
                                  const currentPairs = [
                                    ...(currentQ.pairs || currentQ.matchingPairs || []),
                                  ];
                                  currentPairs[pIdx] = {
                                    ...pair,
                                    right: e.target.value,
                                  };
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = {
                                    ...currentQ,
                                    pairs: currentPairs,
                                  };
                                  setActiveSession({
                                    ...activeSession,
                                    questions: updated,
                                  });
                                }}
                                placeholder="Arti / Pasangan Kanan"
                                className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                              />
                              <button
                                type="button"
                                disabled={
                                  (currentQ.pairs || currentQ.matchingPairs || []).length <= 2
                                }
                                onClick={() => {
                                  const filtered = (
                                    currentQ.pairs || currentQ.matchingPairs || []
                                  ).filter((_, idx) => idx !== pIdx);
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = {
                                    ...currentQ,
                                    pairs: filtered,
                                  };
                                  setActiveSession({
                                    ...activeSession,
                                    questions: updated,
                                  });
                                }}
                                className="text-on-surface-variant hover:text-red-700 disabled:opacity-20 cursor-pointer p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentPairs =
                            currentQ.pairs || currentQ.matchingPairs || [];
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = {
                            ...currentQ,
                            pairs: [
                              ...currentPairs,
                              { left: "Istilah Baru", right: "Arti Baru" },
                            ],
                          };
                          setActiveSession({
                            ...activeSession,
                            questions: updated,
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Pasangan</span>
                      </button>
                    </div>
                  )}

                  {/* Tipe 4: Susun Urutan */}
                  {(currentQ.type === "order" || currentQ.type === "word_builder") && (
                    <div id="field-order-items" className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-on-surface block">
                          Urutan Langkah yang Benar (Minimal 3 Item)
                        </label>
                        <p className="text-[11px] text-on-surface-variant">
                          Minimal 3 item. Tuliskan dalam urutan yang tepat dari atas ke bawah. Engine akan mengacaknya untuk murid.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {(currentQ.items || currentQ.targetSentence || []).map(
                          (item, itIdx) => (
                            <div
                              key={itIdx}
                              className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-2"
                            >
                              <span className="text-xs font-black text-primary w-5">
                                #{itIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={item || ""}
                                onChange={(e) => {
                                  const currentItems = [
                                    ...(currentQ.items || currentQ.targetSentence || []),
                                  ];
                                  currentItems[itIdx] = e.target.value;
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = {
                                    ...currentQ,
                                    items: currentItems,
                                  };
                                  setActiveSession({
                                    ...activeSession,
                                    questions: updated,
                                  });
                                }}
                                placeholder={`Tuliskan langkah ke-${itIdx + 1}...`}
                                className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                              />
                              <button
                                type="button"
                                disabled={
                                  (currentQ.items || currentQ.targetSentence || []).length <= 3
                                }
                                onClick={() => {
                                  const filtered = (
                                    currentQ.items || currentQ.targetSentence || []
                                  ).filter((_, idx) => idx !== itIdx);
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = {
                                    ...currentQ,
                                    items: filtered,
                                  };
                                  setActiveSession({
                                    ...activeSession,
                                    questions: updated,
                                  });
                                }}
                                className="text-on-surface-variant hover:text-red-700 disabled:opacity-20 cursor-pointer p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentItems =
                            currentQ.items || currentQ.targetSentence || [];
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = {
                            ...currentQ,
                            items: [
                              ...currentItems,
                              `Langkah ${currentItems.length + 1}`,
                            ],
                          };
                          setActiveSession({
                            ...activeSession,
                            questions: updated,
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Langkah Urutan</span>
                      </button>
                    </div>
                  )}

                  {/* Tipe 5: Hotspot Visual */}
                  {(currentQ.type === "hotspot" || currentQ.type === "visual") && (
                    <div id="field-hotspot" className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-on-surface block">
                          Titik Penanda Hotspot Gambar
                        </label>
                        <p className="text-[11px] text-on-surface-variant">
                          Pilih gambar artefak, lalu klik gambar untuk menambahkan titik penanda adat.
                        </p>
                      </div>

                      {/* Gambar Interaktif Hotspot */}
                      <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden border-2 border-outline-variant/30 bg-surface">
                        {currentQ.imageUrl ? (
                          <>
                            <img
                              src={currentQ.imageUrl}
                              alt="Artefak"
                              className="w-full h-full object-contain cursor-crosshair"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                                const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                                const spots = currentQ.hotspots || [];
                                const newSpot: HotspotItem = {
                                  id: spots.length + 1,
                                  name: `Titik #${spots.length + 1}`,
                                  title: `Titik #${spots.length + 1}`,
                                  description: `Bagian artefak #${spots.length + 1}`,
                                  top: `${Math.round(clickY)}%`,
                                  left: `${Math.round(clickX)}%`,
                                };
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = {
                                  ...currentQ,
                                  hotspots: [...spots, newSpot],
                                  options: [
                                    ...(currentQ.options || []),
                                    {
                                      id: String(newSpot.id),
                                      label: String.fromCharCode(65 + spots.length),
                                      title: newSpot.title,
                                      isCorrect: spots.length === 0,
                                    },
                                  ],
                                };
                                setActiveSession({
                                  ...activeSession,
                                  questions: updated,
                                });
                              }}
                            />
                            {(currentQ.hotspots || []).map((spot, sIdx) => (
                              <div
                                key={spot.id || sIdx}
                                style={{ top: spot.top, left: spot.left }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-primary text-on-primary font-black text-xs flex items-center justify-center border-2 border-white shadow-lg pointer-events-none"
                              >
                                {sIdx + 1}
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant text-xs font-bold p-4 text-center">
                            <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                            <span>Pilih gambar di bagian Media di atas terlebih dahulu.</span>
                          </div>
                        )}
                      </div>

                      {/* Daftar Titik */}
                      <div className="space-y-2">
                        {(currentQ.hotspots || []).map((spot, sIdx) => {
                          const isKeyCorrect = (currentQ.options || []).some(
                            (o) => String(o.id) === String(spot.id) && o.isCorrect
                          );

                          return (
                            <div
                              key={spot.id || sIdx}
                              className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-black text-xs flex items-center justify-center shrink-0">
                                  {sIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={spot.title || spot.name || ""}
                                  onChange={(e) => {
                                    const spots = [...(currentQ.hotspots || [])];
                                    spots[sIdx] = {
                                      ...spot,
                                      title: e.target.value,
                                      name: e.target.value,
                                    };
                                    const updated = [...activeSession.questions];
                                    updated[selectedQuestionIdx] = {
                                      ...currentQ,
                                      hotspots: spots,
                                    };
                                    setActiveSession({
                                      ...activeSession,
                                      questions: updated,
                                    });
                                  }}
                                  placeholder="Nama bagian artefak"
                                  className="px-3 py-1 rounded-xl bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                                />
                                <span className="text-[10px] text-on-surface-variant">
                                  ({spot.left}, {spot.top})
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const opts = (currentQ.options || []).map((o) => ({
                                      ...o,
                                      isCorrect: String(o.id) === String(spot.id),
                                    }));
                                    const updated = [...activeSession.questions];
                                    updated[selectedQuestionIdx] = {
                                      ...currentQ,
                                      options: opts,
                                    };
                                    setActiveSession({
                                      ...activeSession,
                                      questions: updated,
                                    });
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                                    isKeyCorrect
                                      ? "bg-emerald-600 text-white"
                                      : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                                  }`}
                                >
                                  {isKeyCorrect ? "✓ Kunci Benar" : "Jadikan Kunci"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const spots = (currentQ.hotspots || []).filter(
                                      (_, idx) => idx !== sIdx
                                    );
                                    const opts = (currentQ.options || []).filter(
                                      (o) => String(o.id) !== String(spot.id)
                                    );
                                    const updated = [...activeSession.questions];
                                    updated[selectedQuestionIdx] = {
                                      ...currentQ,
                                      hotspots: spots,
                                      options: opts,
                                    };
                                    setActiveSession({
                                      ...activeSession,
                                      questions: updated,
                                    });
                                  }}
                                  className="text-on-surface-variant hover:text-red-700 cursor-pointer p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tipe 6: Skenario Bercabang */}
                  {(currentQ.type === "scenario" || currentQ.type === "roleplay") && (
                    <div id="field-scenario" className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-on-surface block">
                          Langkah Situasi Adab &amp; Pilihan Tindakan
                        </label>
                        <p className="text-[11px] text-on-surface-variant">
                          Tuliskan situasi dialog dan pilihan sikap yang dapat diambil murid beserta skor adabnya.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {(currentQ.steps || []).map((step, stIdx) => (
                          <div
                            key={stIdx}
                            className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-primary">
                                Langkah {stIdx + 1}
                              </span>
                              <button
                                type="button"
                                disabled={(currentQ.steps || []).length <= 1}
                                onClick={() => {
                                  const steps = (currentQ.steps || []).filter(
                                    (_, idx) => idx !== stIdx
                                  );
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = {
                                    ...currentQ,
                                    steps,
                                  };
                                  setActiveSession({
                                    ...activeSession,
                                    questions: updated,
                                  });
                                }}
                                className="text-on-surface-variant hover:text-red-700 disabled:opacity-20 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={step.prompt || ""}
                              onChange={(e) => {
                                const steps = [...(currentQ.steps || [])];
                                steps[stIdx] = { ...step, prompt: e.target.value };
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = {
                                  ...currentQ,
                                  steps,
                                };
                                setActiveSession({
                                  ...activeSession,
                                  questions: updated,
                                });
                              }}
                              placeholder="Deskripsi situasi adat (misal: Tetua sedang menyapa di tangga...)"
                              className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                            />

                            {/* Pilihan Tindakan */}
                            <div className="space-y-2">
                              {(step.choices || []).map((ch, chIdx) => (
                                <div
                                  key={chIdx}
                                  className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={ch.label || ""}
                                    onChange={(e) => {
                                      const steps = [...(currentQ.steps || [])];
                                      const choices = [...(step.choices || [])];
                                      choices[chIdx] = { ...ch, label: e.target.value };
                                      steps[stIdx] = { ...step, choices };
                                      const updated = [...activeSession.questions];
                                      updated[selectedQuestionIdx] = {
                                        ...currentQ,
                                        steps,
                                      };
                                      setActiveSession({
                                        ...activeSession,
                                        questions: updated,
                                      });
                                    }}
                                    placeholder="Pilihan sikap murid"
                                    className="flex-1 bg-transparent text-xs font-bold text-on-surface focus:outline-none"
                                  />
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span className="text-[10px] text-on-surface-variant">
                                      Skor:
                                    </span>
                                    <input
                                      type="number"
                                      value={ch.score ?? 1}
                                      onChange={(e) => {
                                        const steps = [...(currentQ.steps || [])];
                                        const choices = [...(step.choices || [])];
                                        choices[chIdx] = {
                                          ...ch,
                                          score: parseInt(e.target.value, 10) || 0,
                                        };
                                        steps[stIdx] = { ...step, choices };
                                        const updated = [...activeSession.questions];
                                        updated[selectedQuestionIdx] = {
                                          ...currentQ,
                                          steps,
                                        };
                                        setActiveSession({
                                          ...activeSession,
                                          questions: updated,
                                        });
                                      }}
                                      className="w-12 px-1.5 py-0.5 rounded-lg bg-surface-container text-xs font-black text-center text-on-surface"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    disabled={(step.choices || []).length <= 1}
                                    onClick={() => {
                                      const steps = [...(currentQ.steps || [])];
                                      const choices = (step.choices || []).filter(
                                        (_, idx) => idx !== chIdx
                                      );
                                      steps[stIdx] = { ...step, choices };
                                      const updated = [...activeSession.questions];
                                      updated[selectedQuestionIdx] = {
                                        ...currentQ,
                                        steps,
                                      };
                                      setActiveSession({
                                        ...activeSession,
                                        questions: updated,
                                      });
                                    }}
                                    className="text-on-surface-variant hover:text-red-700 disabled:opacity-20 cursor-pointer p-0.5"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const steps = [...(currentQ.steps || [])];
                                const choices = [
                                  ...(step.choices || []),
                                  {
                                    label: "Pilihan sikap baru",
                                    score: 1,
                                    feedback: "Cukup baik",
                                  },
                                ];
                                steps[stIdx] = { ...step, choices };
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = {
                                  ...currentQ,
                                  steps,
                                };
                                setActiveSession({
                                  ...activeSession,
                                  questions: updated,
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-bold text-on-surface flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambah Pilihan Sikap</span>
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const steps = [
                            ...(currentQ.steps || []),
                            {
                              prompt: "Situasi kelanjutan:",
                              choices: [
                                {
                                  label: "Pilihan sikap santun",
                                  score: 2,
                                  feedback: "Sangat baik",
                                },
                              ],
                            },
                          ];
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = { ...currentQ, steps };
                          setActiveSession({ ...activeSession, questions: updated });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Langkah Skenario</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* ── BAGIAN E: PENJELASAN SETELAH MENJAWAB (OPSIONAL) ── */}
                <div>
                  <label className="text-xs font-black text-on-surface block mb-1">
                    Penjelasan Setelah Menjawab (Boleh Kosong)
                  </label>
                  <textarea
                    rows={2}
                    value={currentQ.curatorNote || ""}
                    onChange={(e) => {
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = {
                        ...currentQ,
                        curatorNote: e.target.value,
                      };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    placeholder="Tuliskan catatan edukatif atau kenapa jawaban ini benar..."
                    className="w-full p-3 rounded-2xl bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Yang dibaca murid setelah menjawab — kenapa jawaban itu benar atau salah.
                  </p>
                </div>

                {/* ── BAGIAN F: ACCORDION PENGATURAN LANJUTAN SOAL ── */}
                <div className="border-t border-outline-variant/20 pt-3">
                  <button
                    type="button"
                    onClick={() => setAdvancedQuestionOpen(!advancedQuestionOpen)}
                    className="w-full flex items-center justify-between py-2 text-xs font-black text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span>Pengaturan lanjutan soal</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        advancedQuestionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {advancedQuestionOpen && (
                    <div className="space-y-4 pt-2 pb-1 animate-in fade-in duration-150">
                      <div>
                        <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                          Nama Soal (untuk admin)
                        </label>
                        <input
                          type="text"
                          value={currentQ.title || ""}
                          onChange={(e) => {
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = {
                              ...currentQ,
                              title: e.target.value,
                            };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          placeholder="Misal: Sapaan Beranda Adat"
                          className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                          Label Kategori (Badge)
                        </label>
                        <input
                          type="text"
                          value={currentQ.badge || ""}
                          onChange={(e) => {
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = {
                              ...currentQ,
                              badge: e.target.value,
                            };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          placeholder="Misal: Etika Tutur"
                          className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/20 focus:outline-none"
                        />
                      </div>

                      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestion(selectedQuestionIdx)}
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplikat Soal Ini</span>
                        </button>

                        <button
                          type="button"
                          disabled={activeSession.questions.length <= 1}
                          onClick={() => setDeleteQuestionConfirmIdx(selectedQuestionIdx)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 disabled:opacity-20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Soal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-bold">
                Pilih atau tambahkan soal untuk mulai menyunting.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAYAR 3: COBA SEBAGAI MURID (RANCANGAN 4)               */}
      {/* ======================================================== */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-150">
          {/* Banner Tetap Edukatif */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-secondary-fixed/40 border border-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-black text-on-surface">
                  Ini pratinjau — jawaban di sini tidak tersimpan dan tidak mengubah progres murid.
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Memainkan pelajaran &quot;{activeSession.title}&quot; mulai dari Soal #{previewStartIdx + 1}.
                </p>
              </div>
            </div>

            {/* Toggle Bingkai & Tombol Kembali Mengedit */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  title="Bingkai Ponsel"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-[10px]">HP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  title="Tampilan Layar Lebar"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Layar Penuh</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSetStep(2)}
                className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-black text-on-surface border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kembali Mengedit</span>
              </button>
            </div>
          </div>

          {/* Device Frame Viewport Container (Rute Pemain Murid Nyata) */}
          <div className="flex items-center justify-center p-2">
            <div
              className={`w-full transition-all duration-300 flex items-center justify-center overflow-hidden bg-surface ${
                previewDevice === "mobile"
                  ? "max-w-[390px] h-[780px] max-h-[82vh] rounded-[42px] border-[10px] border-surface-container-highest shadow-2xl"
                  : "max-w-4xl h-[82vh] rounded-3xl border-2 border-outline-variant/30 shadow-2xl"
              }`}
            >
              <iframe
                key={`preview-${activeSession.id}-${previewStartIdx}`}
                src={`/dashboard/belajar/${activeSession.id}?preview=1&start=${previewStartIdx}`}
                className="w-full h-full border-0 bg-surface rounded-[inherit]"
                title="Pratinjau Rute Pemain Murid"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAYAR 4: TERBITKAN (RANCANGAN 5)                        */}
      {/* ======================================================== */}
      {currentStep === 4 && (
        <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-150">
          {/* Ringkasan Pelajaran */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-full">
                Langkah 4 dari 4
              </span>
              <h2 className="text-lg font-black text-on-surface mt-2">
                Pemeriksaan &amp; Publikasi ke Murid
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Pastikan seluruh syarat kelengkapan terpenuhi sebelum menerbitkan pelajaran ke peta belajar murid.
              </p>
            </div>

            {/* Kartu Ringkasan Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Judul Pelajaran
                </span>
                <span className="text-xs font-black text-on-surface block truncate">
                  {activeSession.title}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Bab
                </span>
                <span className="text-xs font-black text-on-surface block truncate">
                  {activeSession.chapter || "-"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Jumlah Soal
                </span>
                <span className="text-xs font-black text-on-surface block">
                  {activeSession.questions.length} Soal
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Status Saat Ini
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    activeSession.status === "published"
                      ? "bg-secondary-fixed text-on-secondary-fixed"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {activeSession.status === "published" ? "Terbit" : "Draf"}
                </span>
              </div>
            </div>

            {/* Status Checklist Banner */}
            <div className="pt-1">
              {publishValidation.isValid ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black">
                      Semua syarat terpenuhi. Anda dapat menerbitkan sesi ini ke murid.
                    </h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Seluruh {activeSession.questions.length} soal telah memiliki instruksi dan kunci jawaban yang lengkap.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black">
                      Belum memenuhi syarat terbit: Masih ada {publishValidation.errors.length} masalah kelengkapan.
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Lengkapi butir checklist bertanda merah di bawah sebelum dapat menerbitkan pelajaran ini.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Daftar Rinci Butir Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black text-on-surface">
                Daftar Kelengkapan Tiap Soal:
              </h4>

              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {activeSession.questions.map((q, idx) => {
                  const qErrs = validateQuestion(q);
                  const isComplete = qErrs.length === 0;
                  const { label: typeLabel } = getTypeBadgeInfo(q.type);

                  return (
                    <div
                      key={q.id || idx}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isComplete
                          ? "bg-surface-container-low border-outline-variant/20"
                          : "bg-amber-50/60 border-amber-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="pt-0.5 shrink-0">
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-on-surface">
                              Soal #{idx + 1}: {q.title || `Soal ${idx + 1}`}
                            </span>
                            <span className="text-[9px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.2 rounded">
                              {typeLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            {q.prompt || "(Belum ada pertanyaan)"}
                          </p>

                          {!isComplete && (
                            <ul className="mt-1 space-y-0.5">
                              {qErrs.map((err, eIdx) => (
                                <li
                                  key={eIdx}
                                  className="text-[11px] font-bold text-amber-900 flex items-center gap-1"
                                >
                                  <span className="w-1 h-1 rounded-full bg-amber-600 shrink-0" />
                                  <span>{err}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Tombol Perbaiki */}
                      {!isComplete ? (
                        <button
                          type="button"
                          onClick={() => jumpToInvalidField(idx, qErrs)}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-center shadow-xs transition-colors"
                        >
                          <span>Perbaiki</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg shrink-0 self-end sm:self-center">
                          ✓ Siap
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kotak Penjelasan Draf vs Terbit (Accordion) */}
            <div className="border-t border-outline-variant/20 pt-3">
              <button
                type="button"
                onClick={() => setPublishExplanationOpen(!publishExplanationOpen)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span>Apa bedanya Draf dan Terbit?</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    publishExplanationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {publishExplanationOpen && (
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant space-y-2 leading-relaxed animate-in fade-in duration-150">
                  <p>
                    <strong>Draf:</strong> Pelajaran disimpan dengan aman untuk disunting sewaktu-waktu. Murid di peta belajar <em>tidak akan melihat</em> pelajaran berstatus draf.
                  </p>
                  <p>
                    <strong>Terbit:</strong> Pelajaran telah lulus checklist dan langsung tampil di roadmap belajar murid. Murid dapat langsung mengerjakan dan mendapatkan poin XP adat.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tampilan Sukses Setelah Terbit */}
          {publishSuccessMessage && (
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 shadow-md text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-emerald-950">
                  Pelajaran Berhasil Diterbitkan!
                </h3>
                <p className="text-xs text-emerald-800">
                  Perubahan Anda sudah tersimpan dan kini aktif di peta belajar murid.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/dashboard/belajar"
                  target="_blank"
                  className="px-5 py-2 rounded-2xl bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs hover:bg-emerald-800 cursor-pointer"
                >
                  <span>Lihat di Peta Belajar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="px-5 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/30 cursor-pointer"
                >
                  Kembali ke Daftar Pelajaran
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* BAR AKSI BAWAH MENEMPEL (STICKY ACTION BAR - SEMUA LAYAR)*/}
      {/* ======================================================== */}
      <div className="sticky bottom-0 z-40 p-3 sm:p-4 rounded-3xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/30 shadow-lg flex items-center justify-between gap-3">
        {/* Tombol Kiri: Kembali */}
        <div>
          {currentStep === 1 ? (
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/20 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>‹ Kembali ke Daftar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSetStep((currentStep - 1) as 1 | 2 | 3 | 4)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/20 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                ‹ Kembali:{" "}
                {currentStep === 2
                  ? "Atur Pelajaran"
                  : currentStep === 3
                  ? "Isi Soal"
                  : "Coba sebagai Murid"}
              </span>
            </button>
          )}
        </div>

        {/* Tombol Kanan: Langkah Berikutnya atau Terbitkan */}
        <div className="flex flex-col items-end">
          {currentStep === 1 && (
            <button
              type="button"
              onClick={() => handleSetStep(2)}
              className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary text-xs sm:text-sm font-black shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjut: Isi Soal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={() => {
                setPreviewStartIdx(selectedQuestionIdx);
                handleSetStep(3);
              }}
              className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary text-xs sm:text-sm font-black shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjut: Coba sebagai Murid</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={() => handleSetStep(4)}
              className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary text-xs sm:text-sm font-black shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjut: Terbitkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-end">
              <button
                type="button"
                disabled={!publishValidation.isValid || saveState.status === "saving"}
                onClick={handlePublishSession}
                className={`px-7 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                  !publishValidation.isValid
                    ? "bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed shadow-none"
                    : "bg-primary text-on-primary hover:bg-primary-container active:scale-95"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {activeSession.status === "published"
                    ? "Terbitkan Ulang Perubahan"
                    : "Terbitkan ke Murid"}
                </span>
              </button>

              {!publishValidation.isValid && (
                <span className="text-[10px] font-bold text-amber-800 mt-1">
                  Masih ada {publishValidation.errors.length} soal yang belum lengkap.
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: GALERI PILIHAN TIPE SOAL (+ TAMBAH SOAL)          */}
      {/* ======================================================== */}
      {isTypeGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="text-lg font-black text-on-surface">
                  Pilih Format Soal Baru
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  Pilih cara murid berinteraksi dengan materi adat Kaili.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTypeGalleryOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {QUESTION_TYPE_GALLERY.map((card) => {
                const { Icon: CIcon } = card;

                return (
                  <button
                    key={card.type}
                    type="button"
                    onClick={() => handleAddQuestionFromGallery(card.type)}
                    className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low hover:border-primary hover:bg-surface-container text-left transition-all group flex flex-col justify-between gap-3 cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <CIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full">
                        {card.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-on-surface group-hover:text-primary transition-colors">
                        {card.name}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant leading-snug font-medium">
                        {card.howToAnswer}
                      </p>
                      <div className="text-[10px] text-primary font-bold bg-primary-fixed/30 px-2 py-0.5 rounded-md inline-block">
                        Contoh: {card.exampleMini}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: KONFIRMASI HAPUS SOAL                             */}
      {/* ======================================================== */}
      {deleteQuestionConfirmIdx !== null && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 p-5 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-on-surface">
                Hapus Soal Ini?
              </h3>
              <p className="text-xs text-on-surface-variant">
                Soal #{deleteQuestionConfirmIdx + 1} akan dihapus dari pelajaran ini.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteQuestionConfirmIdx(null)}
                className="flex-1 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(deleteQuestionConfirmIdx)}
                className="flex-1 py-2 rounded-xl bg-red-700 text-xs font-black text-white cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
