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
  Sparkles,
  Image as ImageIcon,
  Music,
  HelpCircle,
  X,
  ExternalLink,
  Layers,
  MapPin,
  Flame,
  Download,
} from "lucide-react";
import { GameSession, GameQuestion, QuestionOption, HotspotItem } from "../components/game-engine/types";
import { getStoredSessions, saveSingleSession } from "../components/game-engine/sessionStore";
import CulturalGameEngine from "../components/game-engine/CulturalGameEngine";

const IMAGE_PRESETS = [
  {
    name: "Alat Musik Suling Lalove",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA99tfPQRBVVtMXXGtMtlKHgSxSjzzIEGUQGQbCarbRHI1jOaWURL5jr78aETTdEhKke8meFtOLrl9X0gx8vyxYCiS_yWrOeXkOUZ1l6z-OZ9K_9GFLXs0kDKCI-H__0pXaAtrjs16Xh5R8JEJlxgMqWV9yn9Zs-IQGuEuCZYhHdOEtTgzumKJOZvzIf5Og5pyYLmjHu-GWCGUjVZ-gm5-qoCX3Gifqgzkkpof_6fw2F7JHtuIPKb9Nzw",
    type: "hotspot",
  },
  {
    name: "Busana Tradisional Baju Nggembe",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj2iA59wILAhgAw8HMAnmW9QdcqFfX57-hJxYVwmDa_TIIWaSw-Kc4eFO1rMzFSmUSWaCsR1mc9aG9AJN89VtVyZUXli2LW4NjVz3ml-5uq6E744sPk8UgPKxuJphS95np5CSgkykg5fgy3_LgLXvhj3CMceZH2EGLapdsSBHrbHSm9m9oAxEaEgaUxuV8LZqHldRPHobtxIN-TmnBfXDHI9TU7nC_212k-oXusVst0GcUGaQ4ma_Ysw",
    type: "hotspot",
  },
  {
    name: "Gestur Sikap Adat Tabe",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7N2RFcBe-VYBGKMVs4RI4fFK_WSAUDavo27MijrqUn0YQFka80Yn6NkLi6NvGUbK_bJsS8bxcs28vXZzzSYuCH3Ml0J8fP_QUR9cO8O6P4uj6LPVZiMDbqT-WEq9WNuQpc2RkTZjx2GyyDWs9peP4G71dL_BEyEljdiyuWO1T87OOfAPwt55ywofq5wU-uIHzArEIeZvJHOo2j8vTDtd7ZuvboUHGas1ryZWxBpc6twFUkXuBoN1i4Q",
    type: "multiple_choice",
  },
  {
    name: "Pelataran Arsitektur Souraja",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3GhtQRWPzykvIVNWr2V35NhJTe_dCVIIrRtyBVfZEEj3XqYhEOJv_SEbk1PTWX0c31bxzkMEw4gOh7sN-WlcJNaV67h505nMT6eV4hEBOjXkJ6KJwhuR9O1EtZUS6Z3a5-anWincRSwsEM6Cd1eIcoTaILOCLMI3NIxB7VqVikEobrcT0CoVvKVVkAc_aFxEbqVUD4ypGJjz4ltJB0RE8BCXz7x3pKJC2QF3wSnftvmW7hDh7y67iQ",
    type: "hotspot",
  },
];

export default function GameFlowBuilder() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Load sessions from store on mount
  useEffect(() => {
    const list = getStoredSessions();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setActiveSession(list[0]);
    }
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
      category: "Kurasi Adat",
      term: type === "hotspot" ? "Artefak Adat" : "Istilah Kaili",
      imageUrl: type === "hotspot" ? IMAGE_PRESETS[0].url : IMAGE_PRESETS[2].url,
      imageCaption: "Arsip dokumentasi resmi kurator adat.",
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
      curatorNote: "Catatan edukatif kurator adat: Konteks pemakaian ini disahkan oleh Dewan Adat.",
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

  // Save current active session
  const handleSave = () => {
    if (!activeSession) return;
    saveSingleSession(activeSession);
    setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? activeSession : s)));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
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
    <div className="space-y-6">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-secondary text-on-secondary rounded-2xl shadow-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-label-md font-bold">Alur Game Berhasil Disimpan &amp; Siap Dimainkan!</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-primary text-label-md font-bold mb-1">
            <Gamepad2 className="w-5 h-5" />
            <span className="uppercase tracking-wider">CMS Game Flow &amp; Question Builder</span>
          </div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            Atur Alur Game &amp; Variasi Soal Suka-Suka
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Admin bebas menentukan urutan tipe soal (Hotspot Visual Alat Musik / Busana / Arsitektur, Pilihan Ganda &amp; Audio, dsb.).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-bold border border-outline-variant/30 transition-all cursor-pointer"
            title={`Unduh ${activeSession.id}.json`}
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleCreateNewSession}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Sesi Baru</span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-label-md font-bold shadow-[0_3px_0_0_#653e00] hover:bg-secondary-container active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Uji Coba Game (Preview)</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-label-md font-bold shadow-[0_3px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Alur Sesi</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Session Selector & Questions Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sessions List & Question Sequence Timeline (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Session Card Settings */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
            <label className="text-label-xs uppercase font-extrabold text-on-surface-variant tracking-wider">
              Pilih Paket Sesi Pembelajaran
            </label>
            <select
              value={activeSessionId}
              onChange={(e) => handleSelectSession(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-sm font-semibold border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.questions.length} Soal)
                </option>
              ))}
            </select>

            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <div>
                <label className="text-label-xs font-bold text-on-surface-variant">Judul Sesi</label>
                <input
                  type="text"
                  value={activeSession.title}
                  onChange={(e) => setActiveSession({ ...activeSession, title: e.target.value })}
                  className="w-full mt-1 p-2 rounded-lg bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant">Bab</label>
                  <input
                    type="text"
                    value={activeSession.chapter}
                    onChange={(e) => setActiveSession({ ...activeSession, chapter: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20"
                  />
                </div>
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant">XP Reward</label>
                  <input
                    type="number"
                    value={activeSession.xpReward}
                    onChange={(e) => setActiveSession({ ...activeSession, xpReward: Number(e.target.value) })}
                    className="w-full mt-1 p-2 rounded-lg bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question Sequence List (Timeline) */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-label-xs uppercase font-extrabold text-on-surface-variant tracking-wider">
                Alur Urutan Soal ({activeSession.questions.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAddQuestion("hotspot")}
                  className="text-label-xs px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  title="Tambah Soal Hotspot Visual"
                >
                  <Plus className="w-3 h-3" />
                  <span>Hotspot</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("multiple_choice")}
                  className="text-label-xs px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  title="Tambah Soal Pilihan Ganda & Audio"
                >
                  <Plus className="w-3 h-3" />
                  <span>Pilihan Ganda</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {activeSession.questions.map((q, idx) => {
                const isSelected = selectedQuestionIdx === idx;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionIdx(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-primary-fixed/20 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-outline-variant/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-label-sm font-bold text-on-surface truncate">
                            {q.title || `Soal ${idx + 1}`}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                              q.type === "hotspot"
                                ? "bg-secondary-fixed text-on-secondary-fixed"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {q.type === "hotspot" ? "Hotspot Visual" : "Pilihan Ganda"}
                          </span>
                        </div>
                        <p className="text-body-xs text-on-surface-variant truncate mt-0.5">
                          {q.prompt}
                        </p>
                      </div>
                    </div>

                    {activeSession.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(idx);
                        }}
                        className="p-1 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                        title="Hapus Soal Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Active Question Customizer Form (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                {selectedQuestionIdx + 1}
              </span>
              <h3 className="text-title-md font-bold text-on-surface">
                Kustomisasi Soal #{selectedQuestionIdx + 1}
              </h3>
            </div>

            {/* Type Switcher */}
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full border border-outline-variant/20">
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
                className={`px-3 py-1.5 rounded-full text-label-xs font-bold transition-all ${
                  currentQ.type === "hotspot" || currentQ.type === "visual"
                    ? "bg-secondary text-on-secondary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Format 1: Gambar Adat (Baju / Alat Musik / Objek)
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
                className={`px-3 py-1.5 rounded-full text-label-xs font-bold transition-all ${
                  currentQ.type === "audio" || currentQ.type === "multiple_choice"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Format 2: Dengarkan &amp; Pahami (Gelombang Suara)
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
                  value={currentQ.title}
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
                value={currentQ.prompt}
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
                  <input
                    type="text"
                    value={currentQ.imageUrl || ""}
                    onChange={(e) => {
                      const updated = [...activeSession.questions];
                      updated[selectedQuestionIdx] = { ...currentQ, imageUrl: e.target.value };
                      setActiveSession({ ...activeSession, questions: updated });
                    }}
                    className="w-full mt-1 p-2 rounded-lg bg-surface-container-lowest text-body-xs font-mono border border-outline-variant/20"
                    placeholder="https://domain.com/foto-alat-musik.jpg"
                  />
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
                          description: "Keterangan kurator adat untuk titik ini.",
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
                            value={spot.name}
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
                            value={spot.description}
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
                            value={spot.top}
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
                            value={spot.left}
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
                      checked={opt.isCorrect}
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
                      value={opt.title}
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

            {/* Curator Note (Lore on check) */}
            <div>
              <label className="text-label-sm font-bold text-on-surface">
                Catatan Edukatif / Lore Kurator Adat (Muncul di Drawer saat Murid Menjawab)
              </label>
              <textarea
                rows={2}
                value={currentQ.curatorNote}
                onChange={(e) => {
                  const updated = [...activeSession.questions];
                  updated[selectedQuestionIdx] = { ...currentQ, curatorNote: e.target.value };
                  setActiveSession({ ...activeSession, questions: updated });
                }}
                className="w-full mt-1 p-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Penjelasan keabsahan adat Kaili untuk jawaban ini..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL PREVIEW GAME LIVE ── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-background rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col relative">
            <div className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md px-6 py-3 border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-label-sm uppercase font-bold text-primary">
                  Live Test-Run: {activeSession.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2">
              <CulturalGameEngine
                session={activeSession}
                onExitHref="/admin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
