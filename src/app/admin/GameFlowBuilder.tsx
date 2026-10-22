"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { GameSession, GameQuestion, QuestionOption, HotspotItem } from "../components/game-engine/types";
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

export default function GameFlowBuilder() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<"published" | "draft">("published");
  const [saveState, setSaveState] = useState<{
    status: "idle" | "saving" | "saved" | "failed_local";
    message: string;
  }>({ status: "idle", message: "" });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Load sessions from store on mount and sync with server
  useEffect(() => {
    const list = getStoredSessions();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setActiveSession(list[0]);
    }

    // Ambil seluruh sesi termasuk draft dari server untuk pengelola konten
    fetch("/api/content/sessions?all=1", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((serverData) => {
        if (Array.isArray(serverData) && serverData.length > 0) {
          const map = new Map<string, GameSession>();
          list.forEach((s) => map.set(s.id, s));
          serverData.forEach((row: { id: string; title: string; payload: GameSession }) => {
            if (row.payload && row.id) {
              map.set(row.id, { ...row.payload, id: row.id, title: row.title || row.payload.title });
            }
          });
          const combined = Array.from(map.values());
          setSessions(combined);
        }
      })
      .catch(() => {});
  }, []);

  // Switch active session
  const handleSelectSession = (id: string) => {
    const found = sessions.find((s) => s.id === id);
    if (found) {
      setActiveSessionId(id);
      setActiveSession(found);
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
      questions: [
        {
          id: `Q1-${Date.now()}`,
          type: "hotspot",
          title: "Pertanyaan 01",
          prompt: "Eksplorasi Instrumen Budaya: Manakah bagian utama yang memiliki peran ritual penting?",
          subPrompt: "Ketuk titik hotspot pada artefak, lalu tentukan jawaban yang benar.",
          badge: "Eksplorasi Visual",
          category: "Artefak & Seni",
          term: "Instrumen Kustom",
          imageUrl: IMAGE_PRESETS[0].url,
          imageCaption: "Dokumentasi arsip artefak kebudayaan Nusantara.",
          hotspots: [
            {
              id: 1,
              name: "Bagian Atas / Pangkal",
              title: "Struktur Pangkal",
              description: "Bagian pangkal instrumen bernilai sakral.",
              tag: "Akustik",
              top: "25%",
              left: "40%",
            },
            {
              id: 2,
              name: "Bagian Tengah / Laras",
              title: "Pusat Resonansi",
              description: "Area yang memproduksi tangga nada utama.",
              tag: "Inti Nada",
              top: "55%",
              left: "50%",
            },
          ],
          options: [
            {
              id: "opt-1",
              label: "A",
              title: "Bagian Atas / Pangkal",
              subtitle: "Pangkal instrumen.",
              isCorrect: false,
            },
            {
              id: "opt-2",
              label: "B",
              title: "Bagian Tengah / Laras",
              subtitle: "Pusat modulasi bunyi.",
              badge: "Kunci Jawaban",
              isCorrect: true,
            },
          ],
          curatorNote: "Penetapan jawaban ini merujuk pada catatan etnomusikologi tetua adat.",
        },
      ],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setActiveSession(newSession);
    setSelectedQuestionIdx(0);
    saveSingleSession(newSession);
  };

  // Add question to active session
  const handleAddQuestion = (type: "hotspot" | "multiple_choice") => {
    if (!activeSession) return;

    const newQ: GameQuestion = {
      id: `Q-${Date.now().toString().slice(-4)}`,
      type,
      title: `Pertanyaan 0${activeSession.questions.length + 1}`,
      prompt:
        type === "hotspot"
          ? "Manakah bagian instrumen/artefak yang memiliki nilai filosofis tinggi?"
          : "Apa makna ungkapan atau tata krama adat berikut ini?",
      subPrompt: "Pilihlah satu opsi yang paling mencerminkan adab luhur masyarakat Kaili.",
      badge: type === "hotspot" ? "Hotspot Visual" : "Tata Krama & Bahasa",
      category: "Materi Budaya",
      term: type === "hotspot" ? "Artefak Adat" : "Istilah Kaili",
      imageUrl: type === "hotspot" ? IMAGE_PRESETS[0].url : IMAGE_PRESETS[2].url,
      imageCaption: "Arsip dokumentasi materi pembelajaran.",
      hotspots:
        type === "hotspot"
          ? [
              {
                id: 1,
                name: "Titik Fokus A",
                title: "Detail Ornamen",
                description: "Deskripsi bagian ornamen adat.",
                tag: "Fokus 1",
                top: "30%",
                left: "40%",
              },
              {
                id: 2,
                name: "Titik Fokus B",
                title: "Struktur Utama",
                description: "Deskripsi bagian struktur utama.",
                tag: "Fokus 2",
                top: "65%",
                left: "60%",
              },
            ]
          : undefined,
      options: [
        {
          id: `opt-${Date.now()}-1`,
          label: "A",
          title: "Opsi Jawaban Pertama",
          subtitle: "Penjelasan opsi pertama.",
          badge: "Kunci Jawaban",
          isCorrect: true,
        },
        {
          id: `opt-${Date.now()}-2`,
          label: "B",
          title: "Opsi Jawaban Kedua",
          subtitle: "Penjelasan opsi kedua.",
          isCorrect: false,
        },
      ],
      curatorNote: "Catatan edukatif: Konteks materi ini bersumber dari dokumentasi budaya Kaili.",
    };

    const updatedSession = {
      ...activeSession,
      questions: [...activeSession.questions, newQ],
    };

    setActiveSession(updatedSession);
    setSelectedQuestionIdx(updatedSession.questions.length - 1);
  };

  // Delete question
  const handleDeleteQuestion = (idx: number) => {
    if (!activeSession || activeSession.questions.length <= 1) return;
    const updatedQuestions = activeSession.questions.filter((_, i) => i !== idx);
    const updatedSession = { ...activeSession, questions: updatedQuestions };
    setActiveSession(updatedSession);
    setSelectedQuestionIdx(Math.max(0, idx - 1));
  };

  // Save current active session to server API with honest status feedback
  const handleSave = async () => {
    if (!activeSession) return;
    setSaveState({ status: "saving", message: "Menyimpan ke server..." });

    const res = await saveSingleSessionToServer(activeSession, sessionStatus);
    if (res.success) {
      setSaveState({
        status: "saved",
        message: `Tersimpan di server v${res.version ?? 1} (${sessionStatus === "published" ? "Terbit" : "Draf"})`,
      });
      setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? activeSession : s)));
    } else {
      setSaveState({
        status: "failed_local",
        message: `Gagal ke server — tersimpan lokal sebagai draf cadangan (${res.error || "offline"})`,
      });
    }

    setTimeout(() => {
      setSaveState({ status: "idle", message: "" });
    }, 3500);
  };

  // Upload image or audio file to /api/content/media/upload
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
    return <div className="p-8 text-center text-on-surface-variant">Memuat data sesi game...</div>;
  }

  const currentQ = activeSession.questions[selectedQuestionIdx] || activeSession.questions[0];

  return (
    <div className="space-y-4">
      {/* Honest Toast Alert */}
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

      {/* Main 2-Panel Layout: Left (Session & Questions list) + Right (Question Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Panel Kiri: ±320px on desktop (lg:col-span-4 / xl:col-span-4) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-3.5">
          {/* Card 1: Paket Sesi & Metadata Ringkas */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3">
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant block mb-1">
                Pilih Paket Sesi
              </label>
              <select
                value={activeSessionId}
                onChange={(e) => handleSelectSession(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-sm font-semibold border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.questions.length} Soal)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-outline-variant/20 text-body-sm">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant">Judul Sesi</label>
                <input
                  type="text"
                  value={activeSession.title || ""}
                  onChange={(e) => setActiveSession({ ...activeSession, title: e.target.value })}
                  className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status Publikasi: Published vs Draft */}
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                  Status Publikasi Sesi
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setSessionStatus("published")}
                    className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      sessionStatus === "published"
                        ? "bg-secondary text-on-secondary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Terbit (Murid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionStatus("draft")}
                    className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      sessionStatus === "draft"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Draf (Admin)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant">Bab</label>
                  <input
                    type="text"
                    value={activeSession.chapter || ""}
                    onChange={(e) => setActiveSession({ ...activeSession, chapter: e.target.value })}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant">XP Reward</label>
                  <input
                    type="number"
                    value={activeSession.xpReward ?? 30}
                    onChange={(e) => setActiveSession({ ...activeSession, xpReward: Number(e.target.value) })}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Daftar Soal Sesi Aktif */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">
                Daftar Soal Sesi ({activeSession.questions.length})
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">Pilih untuk mengedit</span>
            </div>

            {/* Scrollable vertical list */}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {activeSession.questions.map((q, idx) => {
                const isSelected = selectedQuestionIdx === idx;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionIdx(idx)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2.5 text-left ${
                      isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-outline-variant/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-on-surface truncate">
                            {q.title || `Soal ${idx + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                              q.type === "hotspot"
                                ? "bg-secondary-fixed text-on-secondary-fixed"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {q.type === "hotspot" ? "Hotspot" : "Pilihan Ganda"}
                          </span>
                          <span className="text-[11px] text-on-surface-variant truncate">
                            {q.prompt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeSession.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(idx);
                        }}
                        className="p-1 rounded text-outline hover:text-error hover:bg-error-container/30 transition-colors shrink-0 cursor-pointer"
                        title="Hapus Soal Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => handleAddQuestion("hotspot")}
                className="py-2 px-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-[12px] font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hotspot</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddQuestion("multiple_choice")}
                className="py-2 px-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed text-[12px] font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pilihan Ganda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Editor Soal Terpilih (lg:col-span-8) */}
        <div className="lg:col-span-8 xl:col-span-8 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden">
          {/* Header Action Bar di Atas Panel Kanan */}
          <div className="p-3.5 sm:p-4 bg-surface-container-lowest border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                {selectedQuestionIdx + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">
                  Edit Soal #{selectedQuestionIdx + 1}: {currentQ.title || `Soal ${selectedQuestionIdx + 1}`}
                </h3>
                <span className="text-[11px] text-on-surface-variant">
                  {currentQ.type === "hotspot" ? "Format Hotspot Visual" : "Format Pilihan Ganda / Audio"}
                </span>
              </div>
            </div>

            {/* Tombol Aksi Sesi Game */}
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold border border-outline-variant/30 transition-colors cursor-pointer"
                title={`Unduh ${activeSession.id}.json`}
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleCreateNewSession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold border border-outline-variant/30 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sesi Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-[12px] font-bold shadow-xs hover:bg-secondary-container active:scale-95 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Uji Coba Game</span>
              </button>

              <button
                type="button"
                disabled={saveState.status === "saving"}
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer ${
                  saveState.status === "saving"
                    ? "bg-surface-container-highest text-on-surface-variant cursor-wait"
                    : saveState.status === "saved"
                    ? "bg-secondary text-on-secondary hover:bg-secondary-container"
                    : saveState.status === "failed_local"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                {saveState.status === "saving" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke Server...</span>
                  </>
                ) : saveState.status === "saved" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersimpan di Server</span>
                  </>
                ) : saveState.status === "failed_local" ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Tersimpan Lokal</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Alur Sesi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Editor Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Format Soal Switcher */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant block mb-1.5">
                Tipe Format Soal
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => {
                    const updatedQuestions = [...activeSession.questions];
                    updatedQuestions[selectedQuestionIdx] = {
                      ...currentQ,
                      type: "hotspot",
                      imageUrl: currentQ.imageUrl || IMAGE_PRESETS[0].url,
                      hotspots: currentQ.hotspots || [
                        {
                          id: 1,
                          name: "Titik Hotspot A",
                          title: "Bagian Kustom",
                          description: "Penjelasan detail bagian.",
                          tag: "Ornamen",
                          top: "30%",
                          left: "40%",
                        },
                      ],
                    };
                    setActiveSession({ ...activeSession, questions: updatedQuestions });
                  }}
                  className={`py-2 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    currentQ.type === "hotspot" || currentQ.type === "visual"
                      ? "bg-secondary text-on-secondary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Format 1: Hotspot Gambar Adat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updatedQuestions = [...activeSession.questions];
                    updatedQuestions[selectedQuestionIdx] = {
                      ...currentQ,
                      type: "audio",
                    };
                    setActiveSession({ ...activeSession, questions: updatedQuestions });
                  }}
                  className={`py-2 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    currentQ.type === "audio" || currentQ.type === "multiple_choice"
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Format 2: Pilihan Ganda &amp; Audio</span>
                </button>
              </div>
            </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label-sm font-bold text-on-surface">Judul Soal</label>
                <input
                  type="text"
                  value={currentQ.title || ""}
                  onChange={(e) => {
                    const updated = [...activeSession.questions];
                    updated[selectedQuestionIdx] = { ...currentQ, title: e.target.value };
                    setActiveSession({ ...activeSession, questions: updated });
                  }}
                  className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Pertanyaan 01"
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
                  placeholder="Misal: Organologi Musik Adat"
                />
              </div>
            </div>

            <div>
              <label className="text-label-sm font-bold text-on-surface">Pertanyaan / Instruksi Utama</label>
              <textarea
                rows={2}
                value={currentQ.prompt || ""}
                onChange={(e) => {
                  const updated = [...activeSession.questions];
                  updated[selectedQuestionIdx] = { ...currentQ, prompt: e.target.value };
                  setActiveSession({ ...activeSession, questions: updated });
                }}
                className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Tuliskan pertanyaan untuk pemelajar adat..."
              />
            </div>

            {/* If Hotspot: Media Image & Hotspots Editor */}
            {currentQ.type === "hotspot" && (
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-secondary" />
                    <span className="text-label-md font-extrabold text-on-surface">
                      Pengaturan Gambar &amp; Titik Hotspot Visual
                    </span>
                  </div>
                  <span className="text-label-xs text-on-surface-variant font-medium">
                    (Bisa untuk Alat Musik, Busana, Senjata, Souraja, dll)
                  </span>
                </div>

                {/* Preset Picker */}
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant block mb-1">
                    Pilih Preset Gambar Cepat:
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
                  <label className="text-label-xs font-bold text-on-surface-variant">URL Gambar Kustom</label>
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
                    <span className="text-label-xs font-extrabold text-on-surface uppercase">
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
                          tag: "Akustik / Struktur",
                          top: `${20 + nextId * 15}%`,
                          left: `${30 + nextId * 10}%`,
                        };
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = { ...currentQ, hotspots: [...spots, newSpot] };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className="text-label-xs px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Titik Hotspot</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentQ.hotspots?.map((spot, spotIdx) => (
                      <div
                        key={spot.id}
                        className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                      >
                        <div className="md:col-span-1 flex items-center justify-center">
                          <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-black text-xs flex items-center justify-center">
                            {spot.id}
                          </span>
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
                            placeholder="Nama Titik (misal: Lubang Nada)"
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

            {/* Options Editor */}
            <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-extrabold text-on-surface">
                  Pilihan Jawaban (Tandai Radio untuk Kunci Jawaban Benar)
                </span>
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
                      subtitle: "Keterangan opsi...",
                      isCorrect: false,
                    };
                    const updated = [...activeSession.questions];
                    updated[selectedQuestionIdx] = { ...currentQ, options: [...opts, newOpt] };
                    setActiveSession({ ...activeSession, questions: updated });
                  }}
                  className="text-label-xs px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Opsi</span>
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
                      title="Klik untuk jadikan jawaban benar"
                    />

                    <span className="font-black text-sm text-primary w-5">{opt.label}.</span>

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

                    <input
                      type="text"
                      value={opt.subtitle || ""}
                      onChange={(e) => {
                        const opts = [...(currentQ.options || [])];
                        opts[optIdx] = { ...opt, subtitle: e.target.value };
                        const updated = [...activeSession.questions];
                        updated[selectedQuestionIdx] = { ...currentQ, options: opts };
                        setActiveSession({ ...activeSession, questions: updated });
                      }}
                      className="flex-1 p-1.5 rounded-lg bg-surface-container-low text-body-xs border border-outline-variant/20"
                      placeholder="Subteks penjelasan opsi..."
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
                        className="text-outline hover:text-error p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Pipeline (Rekaman Narasumber) */}
            <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-secondary" />
                  <span className="text-label-md font-extrabold text-on-surface">
                    Rekaman Suara / Audio Narasumber (Opsional)
                  </span>
                </div>
                <span className="text-label-xs text-on-surface-variant font-medium">
                  (Format: mp3, wav, m4a, ogg • Terhubung ke Engine Pemutar Suara)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant block mb-1">
                    Unggah File Audio Narasumber
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold border border-outline-variant/30 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-secondary" />
                    <span>{uploadingMedia ? "Mengunggah..." : "Pilih File Rekaman Suara"}</span>
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
                    placeholder="/uploads/suara.mp3 atau https://..."
                    className="w-full p-2 rounded-lg bg-surface-container-lowest text-body-xs font-mono border border-outline-variant/20"
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

            {/* Curator Note (Lore on check) */}
            <div>
              <label className="text-label-sm font-bold text-on-surface">
                Catatan Edukatif / Penjelasan Materi (Muncul di Drawer saat Murid Menjawab)
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
                placeholder="Penjelasan konteks materi adat Kaili untuk jawaban ini..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ── MODAL / DRAWER PREVIEW GAME LIVE (Phone Frame) ── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center sm:justify-end p-2 sm:p-4">
          <div className="w-full sm:w-auto h-full max-h-[96vh] flex flex-col items-center justify-center animate-in slide-in-from-right-4 duration-300">
            {/* Phone Bezel Container (±410px) */}
            <div className="w-full max-w-[410px] h-[840px] max-h-[92vh] bg-surface rounded-[36px] shadow-2xl border-[8px] border-surface-container-highest flex flex-col relative overflow-hidden ring-1 ring-outline-variant/30">
              {/* Phone Top Notch / Header Bar */}
              <div className="shrink-0 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 border-b border-outline-variant/20 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[12px] font-bold text-on-surface truncate">
                    Preview: {activeSession.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
                  title="Tutup Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Engine Container with Internal Scroll */}
              <div className="flex-1 overflow-y-auto bg-surface">
                <CulturalGameEngine
                  session={activeSession}
                  onExitHref="/admin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
