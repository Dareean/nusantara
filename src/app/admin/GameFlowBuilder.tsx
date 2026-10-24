"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Music,
  HelpCircle,
  X,
  ExternalLink,
  Layers,
  MapPin,
  Flame,
  Download,
  Upload,
  Volume2,
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
  XCircle,
  FileCheck,
  Sparkles,
  GripVertical,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ArrowRight,
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
  syncSessionsFromServer,
} from "../components/game-engine/sessionStore";
import CulturalGameEngine from "../components/game-engine/CulturalGameEngine";

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

const QUESTION_TYPE_GALLERY: {
  type: QuestionType;
  name: string;
  badge: string;
  description: string;
  Icon: typeof ListChecks;
}[] = [
  {
    type: "multiple_choice",
    name: "Pilihan Ganda",
    badge: "Opsi Tunggal",
    description: "Pemain memilih satu jawaban paling tepat dari beberapa opsi pilihan.",
    Icon: ListChecks,
  },
  {
    type: "true_false",
    name: "Benar / Salah",
    badge: "Fakta & Mitos",
    description: "Pemain menentukan apakah pernyataan bernilai fakta/benar atau mitos/salah.",
    Icon: CheckSquare,
  },
  {
    type: "match",
    name: "Jodohkan Pasangan",
    badge: "Dua Kolom",
    description: "Pemain mengetuk pasangan kiri–kanan yang cocok.",
    Icon: ArrowLeftRight,
  },
  {
    type: "order",
    name: "Susun Urutan",
    badge: "Urutan Langkah",
    description: "Pemain menyusun item ke dalam urutan langkah yang tepat.",
    Icon: ListOrdered,
  },
  {
    type: "hotspot",
    name: "Hotspot Visual",
    badge: "Eksplorasi Gambar",
    description: "Pemain menjelajahi gambar artefak dan mengetuk titik penanda adat.",
    Icon: Crosshair,
  },
  {
    type: "scenario",
    name: "Skenario Bercabang",
    badge: "Simulasi Adab",
    description: "Pemain menentukan keputusan sikap bertahap dengan penilaian skor adab.",
    Icon: GitBranch,
  },
];

export function validateQuestion(q: GameQuestion): string[] {
  const errs: string[] = [];
  if (!q.prompt || !q.prompt.trim()) {
    errs.push("Pertanyaan / Instruksi Utama belum diisi");
  }

  if (q.type === "multiple_choice" || q.type === "audio") {
    const opts = q.options || [];
    if (opts.length < 2) {
      errs.push("Pilihan ganda memerlukan minimal 2 opsi");
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
      errs.push("Jodohkan Pasangan memerlukan minimal 2 pasangan");
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
      errs.push("Susun Urutan memerlukan minimal 3 item");
    }
    const hasEmpty = items.some((it) => !it?.trim());
    if (hasEmpty) {
      errs.push("Ada item urutan yang masih kosong");
    }
  } else if (q.type === "hotspot" || q.type === "visual") {
    if (!q.imageUrl || !q.imageUrl.trim()) {
      errs.push("Gambar artefak belum dipilih/diunggah");
    }
    const spots = q.hotspots || [];
    if (spots.length < 1) {
      errs.push("Hotspot memerlukan minimal 1 titik penanda");
    }
    const opts = q.options || [];
    const hasCorrect = opts.some((o) => o.isCorrect) || spots.length > 0;
    if (!hasCorrect) {
      errs.push("Kunci jawaban titik hotspot belum dipilih");
    }
  } else if (q.type === "scenario" || q.type === "roleplay") {
    const steps = q.steps || [];
    if (steps.length < 1) {
      errs.push("Skenario memerlukan minimal 1 langkah");
    }
    steps.forEach((step, sIdx) => {
      if (!step.prompt?.trim()) {
        errs.push(`Langkah ${sIdx + 1} belum memiliki teks situasi/dialog`);
      }
      if (!step.choices || step.choices.length < 1) {
        errs.push(`Langkah ${sIdx + 1} belum memiliki pilihan`);
      } else {
        const hasScored = step.choices.some((c) => c.score > 0);
        if (!hasScored) {
          errs.push(`Langkah ${sIdx + 1} harus memiliki minimal 1 pilihan berskor > 0`);
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

export default function GameFlowBuilder() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewStartIdx, setPreviewStartIdx] = useState<number>(0);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isPublishSummaryOpen, setIsPublishSummaryOpen] = useState(false);
  const [draggedQIdx, setDraggedQIdx] = useState<number | null>(null);
  const [dragOverQIdx, setDragOverQIdx] = useState<number | null>(null);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"published" | "draft">("published");
  const [isTypeGalleryOpen, setIsTypeGalleryOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [saveState, setSaveState] = useState<{
    status: "idle" | "saving" | "saved" | "failed_local";
    message: string;
  }>({ status: "idle", message: "" });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const isInitialMount = useRef(true);

  // Load sessions from store on mount and sync with server
  useEffect(() => {
    const list = getStoredSessions();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setActiveSession(list[0]);
      setSessionStatus(list[0].status || "published");
    }

    // Ambil seluruh sesi termasuk draft dari server untuk pengelola konten
    fetch("/api/content/sessions?all=1", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((serverData) => {
        if (Array.isArray(serverData) && serverData.length > 0) {
          const map = new Map<string, GameSession>();
          list.forEach((s) => map.set(s.id, s));
          serverData.forEach((row: { id: string; title: string; payload: GameSession; status: "draft" | "published" }) => {
            if (row.payload && row.id) {
              map.set(row.id, {
                ...row.payload,
                id: row.id,
                title: row.title || row.payload.title,
                status: row.status || row.payload.status || "published",
              });
            }
          });
          const combined = Array.from(map.values());
          setSessions(combined);
        }
      })
      .catch(() => {});
  }, []);

  // Autosave draft to local sessionStore with debounced timer
  // PERBAIKAN 4 (Riset UX Quizizz/Rise): Autosave HANYA menyentuh draf dan tidak pernah menerbitkan!
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!activeSession) return;

    const timer = setTimeout(() => {
      // Pertahankan status saat ini (jika draf tetap draf; jika terbit tetap terbit). Autosave tidak pernah mengubah draf menjadi terbit.
      const currentOrDraftStatus = activeSession.status === "published" ? "published" : "draft";
      saveSingleSession({ ...activeSession, status: currentOrDraftStatus });
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setLastSavedTime(`${hh}:${mm}`);
    }, 800);

    return () => clearTimeout(timer);
  }, [activeSession, sessionStatus]);

  // Handle open preview with chosen start question index
  const handleOpenPreview = (startIdx: number = 0) => {
    if (!activeSession) return;
    // Simpan draf ke store terlebih dahulu agar rute pemain membaca data mutakhir
    saveSingleSession({ ...activeSession, status: activeSession.status || "draft" });
    setPreviewStartIdx(startIdx);
    setIsPreviewOpen(true);
  };

  // Drag and drop reordering handler (array-based order, NN/g Rise pattern)
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

  // Jump to specific invalid field on question (NN/g Kahoot checklist pattern)
  const jumpToInvalidField = (qIdx: number, errors: string[]) => {
    setSelectedQuestionIdx(qIdx);
    const firstErr = errors[0] || "";
    let targetId = "field-prompt";
    if (firstErr.includes("Instruksi") || firstErr.includes("Pertanyaan")) {
      targetId = "field-prompt";
    } else if (firstErr.includes("Pilihan ganda") || firstErr.includes("kunci jawaban") || firstErr.includes("opsi")) {
      targetId = "field-options";
    } else if (firstErr.includes("Benar/Salah")) {
      targetId = "field-truefalse";
    } else if (firstErr.includes("pasangan") || firstErr.includes("Jodohkan")) {
      targetId = "field-match-pairs";
    } else if (firstErr.includes("urutan") || firstErr.includes("Susun")) {
      targetId = "field-order-items";
    } else if (firstErr.includes("Hotspot") || firstErr.includes("titik") || firstErr.includes("Gambar")) {
      targetId = "field-hotspot";
    } else if (firstErr.includes("Skenario") || firstErr.includes("Langkah") || firstErr.includes("skor")) {
      targetId = "field-scenario";
    }
    setFocusedFieldId(targetId);
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.();
      }
    }, 60);
    setTimeout(() => {
      setFocusedFieldId(null);
    }, 2200);
  };

  // Switch active session
  const handleSelectSession = (id: string) => {
    const found = sessions.find((s) => s.id === id);
    if (found) {
      setActiveSessionId(id);
      setActiveSession(found);
      setSessionStatus(found.status || "published");
      setSelectedQuestionIdx(0);
    }
  };

  // Create new session
  const handleCreateNewSession = () => {
    const newId = `SES-CUSTOM-${Date.now().toString().slice(-4)}`;
    const newSession: GameSession = {
      id: newId,
      title: "Sesi Pembelajaran Kustom Baru",
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
          prompt: "Pilihlah sapaan yang santun saat melintasi tetua adat di beranda:",
          badge: "Tata Krama",
          options: [
            {
              id: "opt-1",
              label: "A",
              title: "Mengucapkan Tabe sambil menunduk",
              isCorrect: true,
            },
            {
              id: "opt-2",
              label: "B",
              title: "Langsung lewat tanpa menyapa",
              isCorrect: false,
            },
          ],
          curatorNote: "Tabe mencerminkan penghormatan luhur kepada sesama manusia.",
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
  };

  // Duplicate current active session
  const handleDuplicateSession = () => {
    if (!activeSession) return;
    const newId = `SES-CUSTOM-${Date.now().toString().slice(-4)}`;
    const duplicated: GameSession = {
      ...JSON.parse(JSON.stringify(activeSession)),
      id: newId,
      title: `${activeSession.title} (Salinan)`,
      status: "draft",
    };

    const updated = [duplicated, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setActiveSession(duplicated);
    setSessionStatus("draft");
    setSelectedQuestionIdx(0);
    saveSingleSession(duplicated);
  };

  // Delete active session
  const handleDeleteSession = () => {
    if (sessions.length <= 1 || !activeSession) {
      alert("Tidak dapat menghapus sesi terakhir.");
      return;
    }
    const confirmDelete = window.confirm(
      `Apakah kamu yakin ingin menghapus sesi "${activeSession.title}"?`
    );
    if (!confirmDelete) return;

    const remaining = sessions.filter((s) => s.id !== activeSession.id);
    setSessions(remaining);
    setActiveSessionId(remaining[0].id);
    setActiveSession(remaining[0]);
    setSessionStatus(remaining[0].status || "published");
    setSelectedQuestionIdx(0);
  };

  // Add question with chosen type from Gallery
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
          items: ["Menunggu ruang", "Mengucapkan Tabe", "Menyampaikan tujuan"],
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
                { label: "Menunggu dengan tenang di sisi tangga", score: 1, feedback: "Sabar dan menghargai percakapan." },
                { label: "Mengucapkan Tabe sambil menunduk ringan", score: 2, feedback: "Sangat santun dan tepat waktu." },
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
  };

  // Reorder question Up / Down
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

  // Duplicate question
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

  // Delete question
  const handleDeleteQuestion = (idx: number) => {
    if (!activeSession || activeSession.questions.length <= 1) return;
    const updatedQuestions = activeSession.questions.filter((_, i) => i !== idx);
    const updatedSession = { ...activeSession, questions: updatedQuestions };
    setActiveSession(updatedSession);
    setSelectedQuestionIdx(Math.max(0, idx - 1));
  };

  // Validation results
  const publishValidation = useMemo(
    () => validateSessionForPublish(activeSession),
    [activeSession]
  );

  // Save / Publish current active session
  const handleSaveOrPublish = async (targetStatus: "published" | "draft") => {
    if (!activeSession) return;

    // If publishing, enforce validation checklist!
    if (targetStatus === "published" && !publishValidation.isValid) {
      alert(
        `Tidak dapat menerbitkan! Masih terdapat ${publishValidation.errors.length} masalah yang harus diperbaiki sesuai Checklist Terbit.`
      );
      return;
    }

    setSaveState({ status: "saving", message: "Menyimpan ke server..." });
    setSessionStatus(targetStatus);

    const updatedWithStatus: GameSession = {
      ...activeSession,
      status: targetStatus,
    };

    const res = await saveSingleSessionToServer(updatedWithStatus, targetStatus);
    if (res.success) {
      setSaveState({
        status: "saved",
        message: `Tersimpan di server v${res.version ?? 1} (${
          targetStatus === "published" ? "Terbit — tampil untuk murid" : "Draf — hanya admin"
        })`,
      });
      setActiveSession(updatedWithStatus);
      setSessions((prev) =>
        prev.map((s) => (s.id === updatedWithStatus.id ? updatedWithStatus : s))
      );
    } else {
      setSaveState({
        status: "failed_local",
        message: `Gagal ke server — tersimpan lokal sebagai draf (${res.error || "offline"})`,
      });
    }

    setTimeout(() => {
      setSaveState({ status: "idle", message: "" });
    }, 3500);
  };

  // Upload image or audio file
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
        const updated = [...activeSession.questions];
        updated[selectedQuestionIdx] = {
          ...currentQ,
          [field]: data.url,
        };
        setActiveSession({ ...activeSession, questions: updated });
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || "Gagal mengunggah media");
      }
    } catch (err) {
      alert("Gagal mengunggah media: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploadingMedia(false);
    }
  };

  // Export active session as JSON
  const handleExportJson = () => {
    if (!activeSession) return;
    try {
      const dataStr = JSON.stringify(activeSession, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeSession.id || "session"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengekspor JSON:", err);
    }
  };

  if (!activeSession) {
    return <div className="p-8 text-center text-on-surface-variant font-bold">Memuat data sesi game...</div>;
  }

  const currentQ = activeSession.questions[selectedQuestionIdx] || activeSession.questions[0];

  const getTypeBadgeInfo = (t: QuestionType) => {
    switch (t) {
      case "match":
      case "matching":
        return { label: "Jodohkan", bg: "bg-purple-100 text-purple-900", Icon: ArrowLeftRight };
      case "order":
      case "word_builder":
        return { label: "Urutan", bg: "bg-teal-100 text-teal-900", Icon: ListOrdered };
      case "true_false":
        return { label: "Benar/Salah", bg: "bg-amber-100 text-amber-900", Icon: CheckSquare };
      case "scenario":
      case "roleplay":
        return { label: "Skenario", bg: "bg-sky-100 text-sky-900", Icon: GitBranch };
      case "hotspot":
      case "visual":
        return { label: "Hotspot", bg: "bg-rose-100 text-rose-900", Icon: Crosshair };
      case "multiple_choice":
      default:
        return { label: "Pilihan Ganda", bg: "bg-blue-100 text-blue-900", Icon: ListChecks };
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
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
      {/* HEADER PERSISTEN (KANAN ATAS & VISIBILITY OF STATUS)     */}
      {/* ======================================================== */}
      <div className="sticky top-0 z-30 p-3 sm:p-4 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Kiri: Judul Sesi & Status Sesi (Selalu Terlihat) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center font-black text-xs shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-on-surface truncate max-w-[280px] sm:max-w-[420px]">
                {activeSession.title || "Sesi Tanpa Judul"}
              </h2>
              {/* Status Sesi Persisten */}
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                  activeSession.status === "published"
                    ? "bg-secondary-fixed text-on-secondary-fixed border border-secondary/30"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {activeSession.status === "published" ? "Terbit • Murid" : "Draf • Hanya Admin"}
              </span>
            </div>
            {/* Status Simpan Persisten & Status Kelengkapan Checklist */}
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 font-semibold">
                <span className={`w-2 h-2 rounded-full ${lastSavedTime ? "bg-emerald-500" : "bg-outline/50"}`} />
                <span>{lastSavedTime ? `Tersimpan otomatis • ${lastSavedTime}` : "Menunggu perubahan draf..."}</span>
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsPublishSummaryOpen(true)}
                className={`text-[10px] font-black flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:underline cursor-pointer ${
                  publishValidation.isValid ? "text-emerald-800 bg-emerald-100/60" : "text-amber-800 bg-amber-100/60"
                }`}
                title="Buka ringkasan checklist seluruh sesi"
              >
                {publishValidation.isValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>✓ Semua {activeSession.questions.length} Soal Lengkap</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>⚠ {publishValidation.errors.length} Masalah Kelengkapan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Kanan Atas: Aksi Persisten (Pratinjau, Simpan Draf, Terbitkan) */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Pratinjau Murid dengan Pilihan Mulai */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => handleOpenPreview(selectedQuestionIdx)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-on-secondary text-[12px] font-black shadow-xs hover:bg-secondary-container active:scale-95 transition-all cursor-pointer"
              title="Mainkan sesi persis seperti murid (read-only)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Murid</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <div className="hidden group-hover:flex flex-col absolute right-0 top-full mt-1 w-52 p-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl z-40 text-left">
              <button
                type="button"
                onClick={() => handleOpenPreview(selectedQuestionIdx)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-between cursor-pointer"
              >
                <span>Mulai dari Soal Ini</span>
                <span className="text-[10px] text-primary font-black">#{selectedQuestionIdx + 1}</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenPreview(0)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-between cursor-pointer"
              >
                <span>Mulai dari Awal</span>
                <span className="text-[10px] text-on-surface-variant font-medium">#1</span>
              </button>
            </div>
          </div>

          {/* Simpan Draf */}
          <button
            type="button"
            disabled={saveState.status === "saving"}
            onClick={() => handleSaveOrPublish("draft")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold border border-outline-variant/30 transition-colors cursor-pointer"
            title="Simpan perubahan sebagai draf khusus admin"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draf</span>
          </button>

          {/* Terbitkan (Aksi Eksplisit -> Membuka Ringkasan Checklist Kahoot/Quizizz) */}
          <button
            type="button"
            onClick={() => setIsPublishSummaryOpen(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12px] font-black shadow-xs active:scale-95 transition-all cursor-pointer ${
              !publishValidation.isValid
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-primary text-on-primary hover:bg-primary-container"
            }`}
            title="Periksa ringkasan checklist dan terbitkan ke murid"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Terbitkan</span>
          </button>
        </div>
      </div>

      {/* Main 2-Panel Layout: Left (Session Settings & Question List) + Right (Editor & Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ======================================================== */}
        {/* PANEL KIRI: PENGATURAN SESI & DAFTAR SOAL (4 COLUMNS)   */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-3.5">
          {/* KARTU 1: PENGATURAN SESI (DIPISAH DARI DAFTAR SOAL) */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-[11px] uppercase font-black tracking-wider text-primary">
                Pengaturan Sesi
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  sessionStatus === "published"
                    ? "bg-secondary-fixed text-on-secondary-fixed"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {sessionStatus === "published" ? "Terbit • Murid" : "Draf • Admin"}
              </span>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant block mb-1">
                Pilih Sesi Pembelajaran
              </label>
              <select
                value={activeSessionId}
                onChange={(e) => handleSelectSession(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-body-sm font-semibold border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.questions.length} Soal) • {s.status === "draft" ? "Draf" : "Terbit"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-1 text-body-sm">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant">Judul Sesi</label>
                <input
                  type="text"
                  value={activeSession.title || ""}
                  onChange={(e) => setActiveSession({ ...activeSession, title: e.target.value })}
                  className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface font-bold border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status Publikasi Sesi: Terbit vs Draf */}
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                  Status Sesi
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setSessionStatus("published")}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      sessionStatus === "published"
                        ? "bg-secondary text-on-secondary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Terbit — tampil untuk murid
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionStatus("draft")}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      sessionStatus === "draft"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Draf — hanya admin
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                  {sessionStatus === "published"
                    ? "✓ Sesi ini dapat dimainkan langsung oleh murid melalui roadmap & jalur belajar."
                    : "🔒 Sesi ini disembunyikan dari murid dan hanya dapat disunting oleh admin."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant">Bab</label>
                  <input
                    type="text"
                    value={activeSession.chapter || ""}
                    onChange={(e) => setActiveSession({ ...activeSession, chapter: e.target.value })}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant">XP Reward</label>
                  <input
                    type="number"
                    value={activeSession.xpReward ?? 30}
                    onChange={(e) => setActiveSession({ ...activeSession, xpReward: Number(e.target.value) })}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Sesi Action Buttons: Duplikat & Hapus */}
              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={handleDuplicateSession}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Duplikat Sesi Lengkap"
                >
                  <Copy className="w-3.5 h-3.5 text-primary" />
                  <span>Duplikat Sesi</span>
                </button>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDeleteSession}
                    className="py-1.5 px-2.5 rounded-lg text-error hover:bg-error-container/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Hapus Sesi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* KARTU 2: DAFTAR SOAL SESI DENGAN DRAG HANDLE, REORDER, & STATUS KELENGKAPAN */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
              <div>
                <span className="text-[11px] uppercase font-black tracking-wider text-primary">
                  Outline Soal ({activeSession.questions.length})
                </span>
                <p className="text-[10px] text-on-surface-variant">
                  Tarik handel ⋮⋮ atau gunakan panah untuk susun urutan
                </p>
              </div>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  publishValidation.isValid
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {publishValidation.isValid
                  ? "✓ Lengkap"
                  : `${publishValidation.errors.length} Perlu Cek`}
              </span>
            </div>

            {/* List Soal dengan Drag Handle & Indikator ✓ / ⚠ */}
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {activeSession.questions.map((q, idx) => {
                const isSelected = selectedQuestionIdx === idx;
                const { label: typeLabel, bg: typeBg, Icon: TypeIcon } = getTypeBadgeInfo(q.type);
                const qErrors = validateQuestion(q);
                const hasError = qErrors.length > 0;
                const isDragging = draggedQIdx === idx;
                const isDragOver = dragOverQIdx === idx;

                return (
                  <div
                    key={q.id || idx}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", String(idx));
                      setDraggedQIdx(idx);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverQIdx !== idx) setDragOverQIdx(idx);
                    }}
                    onDragLeave={() => {
                      if (dragOverQIdx === idx) setDragOverQIdx(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropReorder(draggedQIdx, idx);
                    }}
                    onDragEnd={() => {
                      setDraggedQIdx(null);
                      setDragOverQIdx(null);
                    }}
                    onClick={() => setSelectedQuestionIdx(idx)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-1.5 text-left relative ${
                      isDragging ? "opacity-40 border-dashed border-primary" : ""
                    } ${isDragOver ? "border-t-2 border-primary bg-primary/5" : ""} ${
                      isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-outline-variant/20"
                    }`}
                  >
                    {/* Drag Handle & Info Utama */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {/* Drag Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container-high shrink-0"
                        title="Tarik untuk memindahkan urutan soal"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="w-3.5 h-3.5 text-on-surface-variant/70" />
                      </div>

                      {/* Nomor Soal */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                          isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {idx + 1}
                      </div>

                      {/* Status Icon: ✓ Lengkap vs ⚠ Kurang (Klik untuk melompat ke field yang kurang) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasError) {
                            jumpToInvalidField(idx, qErrors);
                          } else {
                            setSelectedQuestionIdx(idx);
                          }
                        }}
                        className="p-0.5 rounded hover:bg-surface-container shrink-0 cursor-pointer"
                        title={
                          hasError
                            ? `⚠ Kurang: ${qErrors.join(", ")} (Klik untuk langsung perbaiki)`
                            : "✓ Soal lengkap dan valid"
                        }
                      >
                        {hasError ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>

                      {/* Badge Tipe + Cuplikan Pertanyaan (Recognition rather than recall) */}
                      <div className="truncate min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[8px] px-1 py-0.2 rounded font-black uppercase shrink-0 flex items-center gap-0.5 ${typeBg}`}
                          >
                            <TypeIcon className="w-2.5 h-2.5" />
                            <span>{typeLabel}</span>
                          </span>
                          <span className="text-[11px] font-bold text-on-surface truncate">
                            {q.title || `Soal ${idx + 1}`}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant truncate font-medium mt-0.5">
                          {q.prompt || "(Belum ada pertanyaan)"}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Aksesibilitas: Naik/Turun, Duplikat, Hapus */}
                    <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleReorderQuestion(idx, idx - 1)}
                        className="p-1 rounded text-outline hover:text-on-surface disabled:opacity-20 transition-colors cursor-pointer"
                        title="Pindahkan Soal ke Atas"
                        aria-label="Pindahkan Soal ke Atas"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === activeSession.questions.length - 1}
                        onClick={() => handleReorderQuestion(idx, idx + 1)}
                        className="p-1 rounded text-outline hover:text-on-surface disabled:opacity-20 transition-colors cursor-pointer"
                        title="Pindahkan Soal ke Bawah"
                        aria-label="Pindahkan Soal ke Bawah"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateQuestion(idx)}
                        className="p-1 rounded text-outline hover:text-primary transition-colors cursor-pointer"
                        title="Duplikat Soal"
                        aria-label="Duplikat Soal"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {activeSession.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(idx)}
                          className="p-1 rounded text-outline hover:text-error transition-colors cursor-pointer"
                          title="Hapus Soal"
                          aria-label="Hapus Soal"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Soal Button -> Opens Gallery Modal */}
            <div className="pt-3 mt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setIsTypeGalleryOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-primary text-on-primary text-[12px] font-black hover:bg-primary-container flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Soal Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL KANAN: EDITOR SOAL KHUSUS PER TIPE (8 COLUMNS)     */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden">
          {/* Header Action Bar */}
          <div className="p-3.5 sm:p-4 bg-surface-container-lowest border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-black text-xs shrink-0">
                {selectedQuestionIdx + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-black text-on-surface truncate">
                  Edit Soal #{selectedQuestionIdx + 1}: {currentQ.title || `Soal ${selectedQuestionIdx + 1}`}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                  <span className="font-semibold">Tipe: {getTypeBadgeInfo(currentQ.type).label}</span>
                  {lastSavedTime && (
                    <span className="text-secondary font-medium">
                      • Tersimpan • {lastSavedTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi di Header Editor */}
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold border border-outline-variant/30 transition-colors cursor-pointer"
                title={`Unduh ${activeSession.id}.json`}
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleCreateNewSession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold border border-outline-variant/30 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sesi Baru</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenPreview(selectedQuestionIdx)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary text-[12px] font-black shadow-xs hover:bg-secondary-container active:scale-95 transition-all cursor-pointer"
                title="Mainkan sesi ini persis seperti murid (read-only)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Soal Ini</span>
              </button>

              <button
                type="button"
                disabled={saveState.status === "saving"}
                onClick={() => handleSaveOrPublish("draft")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold border border-outline-variant/30 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Draf</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPublishSummaryOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12px] font-black shadow-xs active:scale-95 transition-all cursor-pointer ${
                  !publishValidation.isValid
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
                title="Buka ringkasan checklist sebelum menerbitkan"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terbitkan</span>
              </button>
            </div>
          </div>

          {/* CHECKLIST TERBIT (VALIDASI PERSISTEN) */}
          <div className="px-4 py-2.5 bg-surface-container-low/70 border-b border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileCheck
                className={`w-4 h-4 ${
                  publishValidation.isValid ? "text-secondary" : "text-amber-600"
                }`}
              />
              <span className="text-xs font-bold text-on-surface">
                Checklist Terbit:{" "}
                {publishValidation.isValid ? (
                  <span className="text-secondary font-black">
                    ✓ Lengkap &amp; Siap Diterbitkan ke Murid
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold">
                    {publishValidation.errors.length} masalah ditemukan sebelum bisa terbit
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {!publishValidation.isValid && (
                <>
                  {publishValidation.errors.slice(0, 3).map((err, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => jumpToInvalidField(err.questionIdx, [err.message])}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Klik untuk langsung melompat ke field yang perlu diperbaiki"
                    >
                      <span>Soal #{err.questionIdx + 1}: {err.message}</span>
                    </button>
                  ))}
                </>
              )}
              <button
                type="button"
                onClick={() => setIsPublishSummaryOpen(true)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-bold border border-outline-variant/20 cursor-pointer"
              >
                Lihat Ringkasan Checklist →
              </button>
            </div>
          </div>

          {/* Editor Form Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* TIPE FORMAT SWITCHER PER SOAL */}
            <div>
              <label className="text-[11px] uppercase font-black tracking-wider text-on-surface-variant block mb-1.5">
                Tipe Format Soal
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/20">
                {QUESTION_TYPE_GALLERY.map((g) => {
                  const isActive = currentQ.type === g.type;
                  const { Icon: GIcon } = g;

                  return (
                    <button
                      key={g.type}
                      type="button"
                      onClick={() => {
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = {
                          ...currentQ,
                          type: g.type,
                          // Setup defaults if empty
                          pairs:
                            g.type === "match"
                              ? currentQ.pairs || [
                                  { left: "Tabe", right: "Permisi atau salam santun" },
                                  { left: "Pue", right: "Tokoh yang dituakan" },
                                ]
                              : currentQ.pairs,
                          items:
                            g.type === "order"
                              ? currentQ.items || ["Langkah 1", "Langkah 2", "Langkah 3"]
                              : currentQ.items,
                          statement:
                            g.type === "true_false"
                              ? currentQ.statement || currentQ.prompt
                              : currentQ.statement,
                          answerBoolean:
                            g.type === "true_false"
                              ? currentQ.answerBoolean ?? true
                              : currentQ.answerBoolean,
                          steps:
                            g.type === "scenario"
                              ? currentQ.steps || [
                                  {
                                    prompt: "Situasi interaksi di rumah Souraja...",
                                    choices: [
                                      { label: "Pilihan Santun", score: 2, feedback: "Sangat baik" },
                                      { label: "Pilihan Biasa", score: 1, feedback: "Cukup baik" },
                                    ],
                                  },
                                ]
                              : currentQ.steps,
                          hotspots:
                            g.type === "hotspot"
                              ? currentQ.hotspots || [
                                  {
                                    id: 1,
                                    name: "Titik Fokus A",
                                    title: "Detail Bagian",
                                    description: "Penjelasan ornamen adat.",
                                    top: "30%",
                                    left: "40%",
                                  },
                                ]
                              : currentQ.hotspots,
                          imageUrl:
                            g.type === "hotspot"
                              ? currentQ.imageUrl || IMAGE_PRESETS[0].url
                              : currentQ.imageUrl,
                        };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-on-primary shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <GIcon className="w-4 h-4" />
                      <span className="truncate">{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nama Soal (untuk admin) & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm font-bold text-on-surface">
                  Nama Soal (untuk admin)
                </label>
                <input
                  type="text"
                  value={currentQ.title || ""}
                  onChange={(e) => {
                    const updated = [...activeSession.questions];
                    updated[selectedQuestionIdx] = { ...currentQ, title: e.target.value };
                    setActiveSession({ ...activeSession, questions: updated });
                  }}
                  className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Soal 01 - Salam Beranda"
                />
              </div>

              <div>
                <label className="text-label-sm font-bold text-on-surface">Badge Kategori</label>
                <input
                  type="text"
                  value={currentQ.badge || ""}
                  onChange={(e) => {
                    const updated = [...activeSession.questions];
                    updated[selectedQuestionIdx] = { ...currentQ, badge: e.target.value };
                    setActiveSession({ ...activeSession, questions: updated });
                  }}
                  className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Etika Tutur Kaili"
                />
              </div>
            </div>

            {/* Pertanyaan / Instruksi Utama */}
            <div
              id="field-prompt"
              className={`p-2 rounded-xl transition-all duration-300 ${
                focusedFieldId === "field-prompt"
                  ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                  : ""
              }`}
            >
              <label className="text-label-sm font-bold text-on-surface">
                Pertanyaan / Instruksi Utama <span className="text-error">*</span>
              </label>
              <textarea
                rows={2}
                value={currentQ.prompt || ""}
                onChange={(e) => {
                  const updated = [...activeSession.questions];
                  updated[selectedQuestionIdx] = { ...currentQ, prompt: e.target.value };
                  setActiveSession({ ...activeSession, questions: updated });
                }}
                className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none font-semibold"
                placeholder="Tuliskan pertanyaan instruksi untuk murid..."
              />
            </div>

            {/* ======================================================== */}
            {/* EDITOR KHUSUS 1: MATCH (JODOHKAN PASANGAN)               */}
            {/* ======================================================== */}
            {(currentQ.type === "match" || currentQ.type === "matching") && (
              <div
                id="field-match-pairs"
                className={`p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3 transition-all duration-300 ${
                  focusedFieldId === "field-match-pairs"
                    ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-label-md font-black text-on-surface flex items-center gap-1.5">
                      <ArrowLeftRight className="w-4 h-4 text-purple-700" />
                      <span>Editor Pasangan Jodohkan (Minimal 2 Pasangan)</span>
                    </span>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Kolom kanan akan diacak otomatis oleh sistem saat murid bermain.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const pairs = currentQ.pairs || [];
                      const updatedPairs = [
                        ...pairs,
                        { left: `Istilah ${pairs.length + 1}`, right: `Arti ${pairs.length + 1}` },
                      ];
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, pairs: updatedPairs };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    className="text-label-xs px-3 py-1.5 rounded-full bg-purple-600 text-white font-bold flex items-center gap-1 cursor-pointer hover:bg-purple-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Pasangan</span>
                  </button>
                </div>

                <div className="space-y-2 mt-2">
                  {(currentQ.pairs || []).map((pair, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-1 flex items-center justify-center font-black text-xs text-primary">
                        {pIdx + 1}
                      </div>
                      <div className="sm:col-span-5">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant block mb-0.5">
                          Kolom Kiri (Ungkapan / Istilah)
                        </label>
                        <input
                          type="text"
                          value={pair.left || ""}
                          onChange={(e) => {
                            const pairs = [...(currentQ.pairs || [])];
                            pairs[pIdx] = { ...pair, left: e.target.value };
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = { ...currentQ, pairs };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-surface-container-low text-body-xs font-bold border border-outline-variant/20"
                          placeholder="Ungkapan / Istilah..."
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant block mb-0.5">
                          Kolom Kanan (Konteks / Arti yang Cocok)
                        </label>
                        <input
                          type="text"
                          value={pair.right || ""}
                          onChange={(e) => {
                            const pairs = [...(currentQ.pairs || [])];
                            pairs[pIdx] = { ...pair, right: e.target.value };
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = { ...currentQ, pairs };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-surface-container-low text-body-xs font-bold border border-outline-variant/20"
                          placeholder="Konteks / Arti..."
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-center">
                        {(currentQ.pairs?.length || 0) > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const pairs = (currentQ.pairs || []).filter((_, i) => i !== pIdx);
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, pairs };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="p-1 rounded text-outline hover:text-error cursor-pointer"
                            title="Hapus Pasangan Ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* EDITOR KHUSUS 2: ORDER (SUSUN URUTAN)                    */}
            {/* ======================================================== */}
            {(currentQ.type === "order" || currentQ.type === "word_builder") && (
              <div
                id="field-order-items"
                className={`p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3 transition-all duration-300 ${
                  focusedFieldId === "field-order-items"
                    ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-label-md font-black text-on-surface flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-teal-700" />
                      <span>Editor Susun Urutan Benar (Minimal 3 Item)</span>
                    </span>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Susun di sini sesuai urutan BENAR (1 → 2 → 3). Sistem akan mengacaknya saat murid bermain.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const items = currentQ.items || [];
                      const updatedItems = [...items, `Langkah ${items.length + 1}`];
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, items: updatedItems };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    className="text-label-xs px-3 py-1.5 rounded-full bg-teal-600 text-white font-bold flex items-center gap-1 cursor-pointer hover:bg-teal-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Item</span>
                  </button>
                </div>

                <div className="space-y-2 mt-2">
                  {(currentQ.items || []).map((item, itIdx) => (
                    <div
                      key={itIdx}
                      className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-black text-xs flex items-center justify-center shrink-0">
                        {itIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const items = [...(currentQ.items || [])];
                          items[itIdx] = e.target.value;
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = { ...currentQ, items };
                          setActiveSession({ ...activeSession, questions: updated });
                        }}
                        className="flex-1 p-2 rounded-lg bg-surface-container-low text-body-xs font-bold border border-outline-variant/20"
                        placeholder={`Deskripsi langkah ke-${itIdx + 1}...`}
                      />

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={itIdx === 0}
                          onClick={() => {
                            const items = [...(currentQ.items || [])];
                            const [m] = items.splice(itIdx, 1);
                            items.splice(itIdx - 1, 0, m);
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = { ...currentQ, items };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-20 cursor-pointer"
                          title="Naikkan Urutan"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={itIdx === (currentQ.items?.length || 0) - 1}
                          onClick={() => {
                            const items = [...(currentQ.items || [])];
                            const [m] = items.splice(itIdx, 1);
                            items.splice(itIdx + 1, 0, m);
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = { ...currentQ, items };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-20 cursor-pointer"
                          title="Turunkan Urutan"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {(currentQ.items?.length || 0) > 3 && (
                          <button
                            type="button"
                            onClick={() => {
                              const items = (currentQ.items || []).filter((_, i) => i !== itIdx);
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, items };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="p-1.5 text-outline hover:text-error cursor-pointer"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* EDITOR KHUSUS 3: TRUE_FALSE (BENAR / SALAH)              */}
            {/* ======================================================== */}
            {currentQ.type === "true_false" && (
              <div
                id="field-truefalse"
                className={`p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3 transition-all duration-300 ${
                  focusedFieldId === "field-truefalse"
                    ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                    : ""
                }`}
              >
                <span className="text-label-md font-black text-on-surface flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span>Editor Kunci Benar / Salah</span>
                </span>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                    Pernyataan yang dinilai:
                  </label>
                  <input
                    type="text"
                    value={currentQ.statement || currentQ.prompt || ""}
                    onChange={(e) => {
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, statement: e.target.value };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    className="w-full p-2.5 rounded-xl bg-surface-container-lowest text-body-sm font-semibold border border-outline-variant/20"
                    placeholder="Tuliskan pernyataan yang akan dinilai murid..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1.5">
                    Kunci Jawaban yang Benar:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = { ...currentQ, answerBoolean: true };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        currentQ.answerBoolean === true
                          ? "border-secondary bg-secondary-fixed/30 text-on-surface ring-2 ring-secondary"
                          : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span>Fakta / Benar (True)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = { ...currentQ, answerBoolean: false };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        currentQ.answerBoolean === false
                          ? "border-error bg-error-container/30 text-on-surface ring-2 ring-error"
                          : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant"
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-error" />
                      <span>Mitos / Salah (False)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* EDITOR KHUSUS 4: SCENARIO (SKENARIO BERCABANG)           */}
            {/* ======================================================== */}
            {(currentQ.type === "scenario" || currentQ.type === "roleplay") && (
              <div
                id="field-scenario"
                className={`p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-4 transition-all duration-300 ${
                  focusedFieldId === "field-scenario"
                    ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-label-md font-black text-on-surface flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-sky-700" />
                      <span>Editor Langkah Skenario &amp; Pilihan Berskor</span>
                    </span>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Setiap langkah dapat memiliki pilihan dengan nilai skor adab (2 = sangat santun, 1 = cukup, 0 = kurang).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const steps = currentQ.steps || [];
                      const newStep: ScenarioStep = {
                        prompt: `Situasi / dialog langkah ke-${steps.length + 1}...`,
                        choices: [
                          { label: "Tindakan Santun", score: 2, feedback: "Sangat baik" },
                          { label: "Tindakan Biasa", score: 1, feedback: "Cukup baik" },
                        ],
                      };
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, steps: [...steps, newStep] };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    className="text-label-xs px-3 py-1.5 rounded-full bg-sky-600 text-white font-bold flex items-center gap-1 cursor-pointer hover:bg-sky-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Langkah</span>
                  </button>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {(currentQ.steps || []).map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-primary uppercase">
                          Langkah {sIdx + 1}
                        </span>
                        {(currentQ.steps?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const steps = (currentQ.steps || []).filter((_, i) => i !== sIdx);
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, steps };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="text-outline hover:text-error p-1 cursor-pointer"
                            title="Hapus Langkah Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
                          Situasi / Dialog Tetua:
                        </label>
                        <input
                          type="text"
                          value={step.prompt || ""}
                          onChange={(e) => {
                            const steps = [...(currentQ.steps || [])];
                            steps[sIdx] = { ...step, prompt: e.target.value };
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = { ...currentQ, steps };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          className="w-full p-2 rounded-lg bg-surface-container-low text-body-xs font-bold border border-outline-variant/20"
                          placeholder="Misal: Tetua mempersilakan masuk..."
                        />
                      </div>

                      {/* Choices per step */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-on-surface-variant">
                            Pilihan Keputusan &amp; Skor:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const steps = [...(currentQ.steps || [])];
                              const choices = steps[sIdx].choices || [];
                              choices.push({
                                label: `Pilihan ${choices.length + 1}`,
                                score: 1,
                                feedback: "Respons pilihan...",
                              });
                              steps[sIdx] = { ...step, choices };
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, steps };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="text-[10px] text-sky-700 font-bold hover:underline cursor-pointer"
                          >
                            + Tambah Pilihan
                          </button>
                        </div>

                        {step.choices.map((choice, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={choice.label}
                              onChange={(e) => {
                                const steps = [...(currentQ.steps || [])];
                                steps[sIdx].choices[cIdx].label = e.target.value;
                                const updated = [...activeSession.questions];
                                updated[selectedQuestionIdx] = { ...currentQ, steps };
                                setActiveSession({ ...activeSession, questions: updated });
                              }}
                              className="flex-1 p-1.5 rounded-md bg-surface-container-lowest text-body-xs font-semibold border border-outline-variant/20"
                              placeholder="Teks pilihan keputusan..."
                            />

                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-on-surface-variant font-bold">Skor:</span>
                              <input
                                type="number"
                                min={0}
                                max={5}
                                value={choice.score}
                                onChange={(e) => {
                                  const steps = [...(currentQ.steps || [])];
                                  steps[sIdx].choices[cIdx].score = Number(e.target.value);
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = { ...currentQ, steps };
                                  setActiveSession({ ...activeSession, questions: updated });
                                }}
                                className="w-12 p-1.5 rounded-md bg-surface-container-lowest text-body-xs text-center font-black border border-outline-variant/20"
                              />
                            </div>

                            {step.choices.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const steps = [...(currentQ.steps || [])];
                                  steps[sIdx].choices = steps[sIdx].choices.filter((_, i) => i !== cIdx);
                                  const updated = [...activeSession.questions];
                                  updated[selectedQuestionIdx] = { ...currentQ, steps };
                                  setActiveSession({ ...activeSession, questions: updated });
                                }}
                                className="p-1 text-outline hover:text-error cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* EDITOR KHUSUS 5: HOTSPOT VISUAL                          */}
            {/* ======================================================== */}
            {(currentQ.type === "hotspot" || currentQ.type === "visual") && (
              <div
                id="field-hotspot"
                className={`p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-4 transition-all duration-300 ${
                  focusedFieldId === "field-hotspot"
                    ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-secondary" />
                    <span className="text-label-md font-black text-on-surface">
                      Pengaturan Gambar &amp; Titik Hotspot
                    </span>
                  </div>
                  <span className="text-label-xs text-on-surface-variant font-medium">
                    (Alat Musik, Busana, Senjata, Souraja, dll)
                  </span>
                </div>

                {/* Preset Picker */}
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant block mb-1">
                    Pilih Preset Gambar:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = {
                            ...currentQ,
                            imageUrl: p.url,
                            term: p.name,
                          };
                          setActiveSession({ ...activeSession, questions: updated });
                        }}
                        className={`text-label-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          currentQ.imageUrl === p.url
                            ? "bg-secondary text-on-secondary border-secondary font-bold"
                            : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-high"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant">URL Gambar</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={currentQ.imageUrl || ""}
                      onChange={(e) => {
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = { ...currentQ, imageUrl: e.target.value };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className="flex-1 p-2 rounded-lg bg-surface-container-lowest text-body-xs font-mono border border-outline-variant/20"
                      placeholder="/media/presets/lalove.webp atau https://..."
                    />
                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold border border-outline-variant/30 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>{uploadingMedia ? "Mengunggah..." : "Unggah Gambar"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingMedia}
                        onChange={(e) => handleUploadFile(e, "imageUrl")}
                      />
                    </label>
                  </div>
                </div>

                {/* Hotspots List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-label-xs font-black text-on-surface uppercase">
                      Daftar Titik Penanda (Hotspots):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const spots = currentQ.hotspots || [];
                        const nextId = spots.length + 1;
                        const newSpot: HotspotItem = {
                          id: nextId,
                          name: `Bagian ${nextId}`,
                          title: `Titik Ornamen ${nextId}`,
                          description: "Keterangan materi untuk titik ini.",
                          top: `${20 + nextId * 15}%`,
                          left: `${30 + nextId * 10}%`,
                        };
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = { ...currentQ, hotspots: [...spots, newSpot] };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className="text-label-xs px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Tambah Titik</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentQ.hotspots?.map((spot, spotIdx) => (
                      <div
                        key={spot.id}
                        className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
                      >
                        <div className="md:col-span-1 flex items-center justify-center font-black text-xs text-primary">
                          {spot.id}
                        </div>
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={spot.name || ""}
                            onChange={(e) => {
                              const spots = [...(currentQ.hotspots || [])];
                              spots[spotIdx] = { ...spot, name: e.target.value };
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, hotspots: spots };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="w-full p-1.5 rounded-lg bg-surface-container-low text-body-xs font-bold border border-outline-variant/20"
                            placeholder="Nama Titik..."
                          />
                        </div>
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            value={spot.description || ""}
                            onChange={(e) => {
                              const spots = [...(currentQ.hotspots || [])];
                              spots[spotIdx] = { ...spot, description: e.target.value };
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, hotspots: spots };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="w-full p-1.5 rounded-lg bg-surface-container-low text-body-xs border border-outline-variant/20"
                            placeholder="Deskripsi makna adat..."
                          />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-1">
                          <input
                            type="text"
                            value={spot.top || ""}
                            onChange={(e) => {
                              const spots = [...(currentQ.hotspots || [])];
                              spots[spotIdx] = { ...spot, top: e.target.value };
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, hotspots: spots };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="w-12 p-1 rounded-lg bg-surface-container-low text-body-xs text-center border border-outline-variant/20"
                            placeholder="top%"
                          />
                          <input
                            type="text"
                            value={spot.left || ""}
                            onChange={(e) => {
                              const spots = [...(currentQ.hotspots || [])];
                              spots[spotIdx] = { ...spot, left: e.target.value };
                              const updated = [...activeSession.questions];
                              updated[selectedQuestionIdx] = { ...currentQ, hotspots: spots };
                              setActiveSession({ ...activeSession, questions: updated });
                            }}
                            className="w-12 p-1 rounded-lg bg-surface-container-low text-body-xs text-center border border-outline-variant/20"
                            placeholder="left%"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* EDITOR KHUSUS 6: MULTIPLE CHOICE (PILIHAN GANDA)         */}
            {/* ======================================================== */}
            {(currentQ.type === "multiple_choice" || currentQ.type === "audio") && (
              <div
                id="field-options"
                className={`p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3 transition-all duration-300 ${
                  focusedFieldId === "field-options"
                    ? "ring-4 ring-amber-400 bg-amber-50/60 shadow-md"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-label-md font-black text-on-surface flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-blue-700" />
                      <span>Pilihan Jawaban (Tandai Radio untuk Jawaban Benar)</span>
                    </span>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Pilihan ganda memerlukan minimal 2 opsi dengan 1 kunci jawaban benar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const opts = currentQ.options || [];
                      const letters = ["A", "B", "C", "D", "E"];
                      const nextLabel = letters[opts.length] || `Opt ${opts.length + 1}`;
                      const newOpt: QuestionOption = {
                        id: `opt-${Date.now()}`,
                        label: nextLabel,
                        title: `Opsi Jawaban ${nextLabel}`,
                        isCorrect: false,
                      };
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, options: [...opts, newOpt] };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    className="text-label-xs px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Opsi</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {currentQ.options?.map((opt, optIdx) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        opt.isCorrect
                          ? "bg-secondary-fixed/20 border-secondary ring-1 ring-secondary"
                          : "bg-surface-container-lowest border-outline-variant/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`correct-option-${currentQ.id}`}
                        checked={Boolean(opt.isCorrect)}
                        onChange={() => {
                          const opts = (currentQ.options || []).map((o, i) => ({
                            ...o,
                            isCorrect: i === optIdx,
                          }));
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = { ...currentQ, options: opts };
                          setActiveSession({ ...activeSession, questions: updated });
                        }}
                        className="w-4 h-4 text-primary cursor-pointer"
                        title="Tandai sebagai jawaban benar"
                      />

                      <span className="font-black text-sm text-primary w-5">{opt.label || `${optIdx + 1}`}.</span>

                      <input
                        type="text"
                        value={opt.title || ""}
                        onChange={(e) => {
                          const opts = [...(currentQ.options || [])];
                          opts[optIdx] = { ...opt, title: e.target.value };
                          const updated = [...activeSession.questions];
                          updated[selectedQuestionIdx] = { ...currentQ, options: opts };
                          setActiveSession({ ...activeSession, questions: updated });
                        }}
                        className="flex-1 p-1.5 rounded-lg bg-surface-container-low text-body-xs font-bold border border-outline-variant/20"
                        placeholder="Teks opsi jawaban..."
                      />

                      {(currentQ.options?.length || 0) > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const opts = (currentQ.options || []).filter((_, i) => i !== optIdx);
                            const updated = [...activeSession.questions];
                            updated[selectedQuestionIdx] = { ...currentQ, options: opts };
                            setActiveSession({ ...activeSession, questions: updated });
                          }}
                          className="text-outline hover:text-error p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rekaman Suara / Audio Narasumber */}
            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-secondary" />
                  <span className="text-label-md font-black text-on-surface">
                    Audio / Suara Penutur Asli (Opsional)
                  </span>
                </div>
                <span className="text-label-xs text-on-surface-variant font-medium">
                  (mp3, wav, ogg)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant block mb-1">
                    Unggah File Audio
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold border border-outline-variant/30 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-secondary" />
                    <span>{uploadingMedia ? "Mengunggah..." : "Pilih File Audio"}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      disabled={uploadingMedia}
                      onChange={(e) => handleUploadFile(e, "audioUrl")}
                    />
                  </label>
                </div>

                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant block mb-1">
                    URL File Audio
                  </label>
                  <input
                    type="text"
                    value={currentQ.audioUrl || ""}
                    onChange={(e) => {
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, audioUrl: e.target.value };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    placeholder="/uploads/audio.mp3 atau https://..."
                    className="w-full p-2 rounded-xl bg-surface-container-lowest text-body-xs font-mono border border-outline-variant/20"
                  />
                </div>
              </div>

              {currentQ.audioUrl && (
                <div className="pt-2 flex items-center gap-3 bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                  <audio controls src={currentQ.audioUrl} className="h-8 max-w-full" />
                  <span className="text-[11px] text-on-surface-variant truncate">
                    Suara terpasang ({currentQ.audioUrl.split("/").pop()})
                  </span>
                </div>
              )}
            </div>

            {/* Catatan Edukatif / Penjelasan Materi (Drawer saat menjawab) */}
            <div>
              <label className="text-label-sm font-bold text-on-surface">
                Catatan Edukatif / Penjelasan Materi (Muncul di Drawer Saat Murid Menjawab)
              </label>
              <textarea
                rows={2}
                value={currentQ.curatorNote || ""}
                onChange={(e) => {
                  const updated = [...activeSession.questions];
                  updated[selectedQuestionIdx] = { ...currentQ, curatorNote: e.target.value };
                  setActiveSession({ ...activeSession, questions: updated });
                }}
                className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Penjelasan konteks adat Kaili untuk pemahaman murid..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: GALERI PILIHAN TIPE SOAL (+ TAMBAH SOAL)          */}
      {/* ======================================================== */}
      {isTypeGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border-2 border-outline-variant/30 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="text-lg font-black text-on-surface">
                  Pilih Format Soal Baru
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  Setiap tipe soal dilengkapi interaksi engine khusus yang dirancang sesuai pedagogi adat.
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
                    className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low text-left transition-all group flex flex-col justify-between gap-3 cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <CIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-on-surface group-hover:text-primary transition-colors">
                        {card.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-snug mt-1 font-medium">
                        {card.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RINGKASAN CHECKLIST SELURUH SESI (POLA KAHOOT)     */}
      {/* ======================================================== */}
      {isPublishSummaryOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-primary">
                  Question Checklist • Standar Kurasi
                </span>
                <h3 className="text-base sm:text-lg font-black text-on-surface">
                  Ringkasan Kesiapan Publikasi Sesi
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  {activeSession.title} ({activeSession.questions.length} Soal) • Bab: {activeSession.chapter || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishSummaryOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Summary Banner */}
            <div className="px-5 py-3 border-b border-outline-variant/20 bg-surface-container-low">
              {publishValidation.isValid ? (
                <div className="flex items-center gap-2.5 text-emerald-800 bg-emerald-100/80 p-3 rounded-2xl border border-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black">
                      Semua {activeSession.questions.length} Soal Lengkap &amp; Tervalidasi
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Seluruh kunci jawaban, pasangan, dan opsi telah terverifikasi. Sesi siap diterbitkan ke murid.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-amber-900 bg-amber-100/80 p-3 rounded-2xl border border-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black">
                      Ditemukan {publishValidation.errors.length} Masalah Kelengkapan
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Sesi belum bisa diterbitkan ke murid sebelum seluruh soal dilengkapi kunci jawaban dan opsinya.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Checklist per Soal */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1">
              {activeSession.questions.map((q, idx) => {
                const qErrs = validateQuestion(q);
                const isComplete = qErrs.length === 0;
                const { label: typeLabel, bg: typeBg } = getTypeBadgeInfo(q.type);

                return (
                  <div
                    key={q.id || idx}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isComplete
                        ? "bg-surface-container-lowest border-outline-variant/20"
                        : "bg-amber-50/50 border-amber-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="pt-0.5">
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
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${typeBg}`}>
                            {typeLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                          {q.prompt || "(Belum ada pertanyaan)"}
                        </p>
                        {!isComplete && (
                          <ul className="mt-1.5 space-y-0.5">
                            {qErrs.map((err, eIdx) => (
                              <li key={eIdx} className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-amber-600" />
                                <span>{err}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      {!isComplete ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsPublishSummaryOpen(false);
                            jumpToInvalidField(idx, qErrs);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                        >
                          <span>Perbaiki Soal Ini</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                          ✓ Siap
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  setIsPublishSummaryOpen(false);
                  await handleSaveOrPublish("draft");
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/30 cursor-pointer"
              >
                Simpan sebagai Draf Saja
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsPublishSummaryOpen(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!publishValidation.isValid || saveState.status === "saving"}
                  onClick={async () => {
                    setIsPublishSummaryOpen(false);
                    await handleSaveOrPublish("published");
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    !publishValidation.isValid
                      ? "bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed shadow-none"
                      : "bg-primary text-on-primary hover:bg-primary-container active:scale-95"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Konfirmasi Terbitkan ke Murid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PRATINJAU SEBAGAI MURID (RUTE PEMAIN SAMA + FRAME) */}
      {/* ======================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          {/* Top Control Bar with Device Switcher (Kahoot & Rise pattern) */}
          <div className="w-full max-w-5xl mb-2 flex items-center justify-between px-4 py-2 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/30 shadow-lg text-on-surface">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs font-black truncate">
                Pratinjau Murid: {activeSession.title}
              </span>
              <span className="text-[10px] text-on-surface-variant hidden sm:inline shrink-0">
                (Mulai dari Soal #{previewStartIdx + 1})
              </span>
            </div>

            {/* Device Switcher (Desktop, Tablet, Mobile) */}
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/20">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  previewDevice === "desktop"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Tampilan Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden md:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  previewDevice === "tablet"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Tampilan Tablet"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden md:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  previewDevice === "mobile"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Tampilan Ponsel"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden md:inline">Ponsel</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/dashboard/belajar/${activeSession.id}?preview=1&start=${previewStartIdx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-[11px] font-bold text-on-surface flex items-center gap-1 transition-colors"
                title="Buka rute pemain di tab baru"
              >
                <span>Tab Baru</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Device Frame Viewport Container (Rute Pemain Nyata) */}
          <div
            className={`w-full transition-all duration-300 flex items-center justify-center overflow-hidden ${
              previewDevice === "mobile"
                ? "max-w-[400px] h-[840px] max-h-[88vh] rounded-[38px] border-[8px] border-surface-container-highest shadow-2xl bg-surface"
                : previewDevice === "tablet"
                ? "max-w-[768px] h-[86vh] rounded-3xl border-[6px] border-surface-container-highest shadow-2xl bg-surface"
                : "max-w-5xl h-[88vh] rounded-2xl border-2 border-outline-variant/30 shadow-2xl bg-surface"
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
      )}
    </div>
  );
}
