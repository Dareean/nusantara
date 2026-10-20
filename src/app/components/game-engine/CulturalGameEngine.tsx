"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Heart,
  Flame,
  Volume2,
  AudioWaveform,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  Play,
  ShieldCheck,
  Landmark,
  BadgeCheck,
  MessageSquare,
  HelpCircle,
  Undo2,
} from "lucide-react";
import { GameSession, GameQuestion, QuestionOption, MatchingPair } from "./types";

interface CulturalGameEngineProps {
  session: GameSession;
  onComplete?: (result: { xp: number; accuracy: number }) => void;
  onExitHref?: string;
}

export default function CulturalGameEngine({
  session,
  onComplete,
  onExitHref = "/dashboard",
}: CulturalGameEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<number>(1);
  const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
  const [hearts, setHearts] = useState(3);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // States for Word Builder (Layar 4)
  const [chosenWordTiles, setChosenWordTiles] = useState<string[]>([]);

  // States for Matching (Layar 5)
  const [selectedLeftMatch, setSelectedLeftMatch] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<string[]>([]);

  const totalQuestions = session.questions.length;
  const currentQ: GameQuestion = session.questions[currentIdx];
  const progressPercent = Math.round(
    ((currentIdx + (feedbackState !== "idle" ? 1 : 0)) / totalQuestions) * 100
  );

  // Audio Play Simulation
  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2200);
  };

  // Submit Answer
  const handleCheckAnswer = () => {
    if (feedbackState !== "idle") return;

    // Handle Word Builder
    if (currentQ.type === "word_builder") {
      const targetStr = (currentQ.targetSentence || []).join(" ");
      const userStr = chosenWordTiles.join(" ");
      const isCorrect = targetStr.toLowerCase() === userStr.toLowerCase();

      if (isCorrect) {
        setFeedbackState("correct");
        setCorrectAnswersCount((prev) => prev + 1);
      } else {
        setFeedbackState("wrong");
        setHearts((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // Handle Matching
    if (currentQ.type === "matching") {
      const allMatched =
        currentQ.matchingPairs &&
        completedMatches.length === currentQ.matchingPairs.length;
      if (allMatched) {
        setFeedbackState("correct");
        setCorrectAnswersCount((prev) => prev + 1);
      } else {
        setFeedbackState("wrong");
        setHearts((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // Handle Standard Options (visual, audio, roleplay)
    if (!selectedOptionId) return;
    const chosenOption = currentQ.options?.find((o) => o.id === selectedOptionId);
    const isCorrect = chosenOption?.isCorrect ?? false;

    if (isCorrect) {
      setFeedbackState("correct");
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setFeedbackState("wrong");
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };

  // Advance to Next Question
  const handleNextQuestion = () => {
    if (hearts <= 0) return;

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setFeedbackState("idle");
      setActiveHotspotId(1);
      setChosenWordTiles([]);
      setSelectedLeftMatch(null);
      setCompletedMatches([]);
    } else {
      setIsFinished(true);
      const accuracy = Math.round((correctAnswersCount / totalQuestions) * 100);
      onComplete?.({ xp: session.xpReward, accuracy });
    }
  };

  // Handle Learn Skip/Next (Layar 1 has no score deduction)
  const handleLearnContinue = () => {
    handleNextQuestion();
  };

  // Reset
  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setFeedbackState("idle");
    setHearts(3);
    setCorrectAnswersCount(0);
    setIsFinished(false);
    setActiveHotspotId(1);
    setChosenWordTiles([]);
    setSelectedLeftMatch(null);
    setCompletedMatches([]);
  };

  // Matching logic
  const handleMatchSelect = (type: "left" | "right", id: string) => {
    if (feedbackState !== "idle") return;

    if (type === "left") {
      setSelectedLeftMatch(id);
    } else if (type === "right" && selectedLeftMatch) {
      if (selectedLeftMatch === id) {
        // Matched correctly!
        setCompletedMatches((prev) => [...prev, id]);
        setSelectedLeftMatch(null);
      } else {
        // Mismatched
        setHearts((prev) => Math.max(0, prev - 1));
        setSelectedLeftMatch(null);
      }
    }
  };

  const isVisualMode =
    currentQ.type === "visual" ||
    currentQ.type === "hotspot" ||
    Boolean(currentQ.imageUrl && currentQ.type !== "learn");

  const selectedHotspot = currentQ.hotspots?.find((h) => h.id === activeHotspotId);
  const correctOption = currentQ.options?.find((o) => o.isCorrect);

  // Determine if check button should be active
  let isCheckActive = false;
  if (currentQ.type === "word_builder") {
    isCheckActive = chosenWordTiles.length > 0;
  } else if (currentQ.type === "matching") {
    isCheckActive =
      Boolean(currentQ.matchingPairs) &&
      completedMatches.length === (currentQ.matchingPairs?.length || 0);
  } else {
    isCheckActive = Boolean(selectedOptionId);
  }

  // -------------------------------------------------------------
  // VIEW: GAME OVER (Hearts = 0)
  // -------------------------------------------------------------
  if (hearts <= 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface antialiased">
        <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-xl border-2 border-outline-variant/30 text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-error-container text-error flex items-center justify-center shadow-inner">
            <Heart className="w-10 h-10 fill-current" />
          </div>

          <h2 className="text-2xl font-black text-on-surface">
            Nyawa Kamu Habis!
          </h2>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Tetap semangat! Pelajari kembali materi ini dan coba lagi dari awal.
          </p>

          <div className="w-full pt-4 flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-bold shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Coba Lagi</span>
            </button>
            <Link
              href={onExitHref}
              className="w-full py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-center transition-colors text-sm"
            >
              Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: VICTORY / LESSON COMPLETE + CULTURAL SOURCE CARD
  // -------------------------------------------------------------
  if (isFinished) {
    const accuracy = Math.round((correctAnswersCount / (totalQuestions - 1 || 1)) * 100);
    const sourceCard = session.culturalSourceCard || {
      institution: "Dewan Adat Kaili (LAK) & Balai Pelestarian Kebudayaan XVIII",
      informant: "Pemangku Adat Kaili Ledo (Lembah Palu)",
      registrationCode: "SULTENG-BBS-2024/KL-01",
      verifiedDate: "Tahap Kurasi Etnolinguistik 2024",
      summary:
        "Materi kosakata, tata busana adat, dan etika tutur dalam sesi ini dikurasi berdasarkan korpus budaya asli sebagai data percontohan.",
      status: "Draft — dalam proses validasi",
    };

    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 lg:p-8 text-on-surface antialiased">
        <div className="w-full max-w-xl bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-outline-variant/30 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="relative my-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-secondary-container to-secondary-fixed flex items-center justify-center shadow-lg ring-4 ring-secondary-fixed-dim">
              <Trophy className="w-10 h-10 text-surface-container-lowest" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1.5 rounded-full shadow-md">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Pelajaran Tuntas!
            </h1>
            <p className="text-body-sm sm:text-body-md text-on-surface-variant mt-1">
              Kamu telah menyelesaikan 6 tahapan alur belajar <strong>{session.title}</strong>.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="p-3 rounded-2xl bg-surface-container flex flex-col items-center border border-outline-variant/20">
              <span className="text-[10px] uppercase font-extrabold text-on-surface-variant">XP</span>
              <span className="text-xl font-black text-primary mt-0.5">+{session.xpReward}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-container flex flex-col items-center border border-outline-variant/20">
              <span className="text-[10px] uppercase font-extrabold text-on-surface-variant">Akurasi</span>
              <span className="text-xl font-black text-secondary mt-0.5">{accuracy}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-container flex flex-col items-center border border-outline-variant/20">
              <span className="text-[10px] uppercase font-extrabold text-on-surface-variant">Streak</span>
              <span className="text-xl font-black text-tertiary mt-0.5">{session.streakDays + 1} Hari</span>
            </div>
          </div>

          {/* CULTURAL SOURCE CARD (Validasi Keaslian Materi) */}
          <div className="w-full text-left p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-secondary font-black text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Cultural Source Card</span>
                {sourceCard.status && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container text-[9px] font-black tracking-widest">
                    DATA DEMO
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-outline font-bold">
                {sourceCard.registrationCode}
              </span>
            </div>

            <p className="text-body-xs text-on-surface-variant leading-relaxed">
              {sourceCard.summary}
            </p>

            <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-on-surface-variant">
              <span>Lembaga / Narahubung: <strong>{sourceCard.institution}</strong>{sourceCard.informant ? ` • ${sourceCard.informant}` : ""}</span>
              <span className="text-secondary font-bold">
                {sourceCard.status || "Draft — dalam proses validasi"}
              </span>
            </div>
            {sourceCard.status && (
              <p className="text-[10px] text-outline italic">
                {sourceCard.status}
              </p>
            )}
          </div>

          <div className="w-full pt-1 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/paspor"
              className="flex-1 py-3.5 rounded-2xl bg-secondary text-on-secondary font-black uppercase tracking-wider shadow-[0_4px_0_0_#653e00] hover:bg-secondary-container active:translate-y-0.5 text-center text-sm"
            >
              Buka Paspor Budaya
            </Link>
            <Link
              href={onExitHref}
              className="flex-1 py-3.5 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 text-center text-sm"
            >
              Lanjut Belajar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: MAIN ACTIVE GAMEPLAY
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased font-sans select-none">
      {/* ── TOP HUD (HEADER) ── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md z-40 flex items-center justify-between px-4 lg:px-8 border-b border-outline-variant/20">
        <Link
          href={onExitHref}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          title="Keluar"
        >
          <X className="w-6 h-6" />
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xl mx-4 sm:mx-8">
          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* HUD Items: Streak & Hearts */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-sm font-bold text-on-surface">
            <Flame className="w-4 h-4 text-primary fill-current" />
            <span>{session.streakDays}</span>
          </div>
          <div className="flex items-center gap-1 bg-error-container/40 px-3.5 py-1 rounded-full border border-error/20">
            <Heart className="w-5 h-5 text-error fill-current" />
            <span className="text-sm text-error font-extrabold">{hearts}/3</span>
          </div>
        </div>
      </header>

      {/* ── MAIN VIEWPORT (MENDUKUNG 6 TAHAP ALUR PEDAGOGIS) ── */}
      <main className="pt-20 pb-36 flex-1 flex flex-col items-center justify-center p-4">
        {/* ======================================================== */}
        {/* TAHAP 1: LAYAR 1 (LEARN - PENGENALAN TANPA BEBAN)        */}
        {/* ======================================================== */}
        {currentQ.type === "learn" && (
          <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border-2 border-outline-variant/30 shadow-sm text-center flex flex-col items-center gap-5">
            <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
              Tahap 1: Pengenalan Tanpa Beban
            </span>

            {currentQ.imageUrl && (
              <div className="w-full h-52 rounded-2xl overflow-hidden bg-surface-container-high/40 border border-outline-variant/20 flex items-center justify-center">
                <img
                  src={currentQ.imageUrl}
                  alt={currentQ.term || "Pengenalan"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <span className="text-3xl font-black text-primary tracking-tight">
                {currentQ.term || "Tabe"}
              </span>
              {currentQ.ipa && (
                <span className="text-sm font-normal text-on-surface-variant ml-2">
                  {currentQ.ipa}
                </span>
              )}
              {currentQ.meaning && (
                <p className="text-lg font-bold text-on-surface mt-1">
                  Artinya: &ldquo;{currentQ.meaning}&rdquo;
                </p>
              )}
            </div>

            {/* Audio Tap Button */}
            <button
              type="button"
              onClick={handlePlayAudio}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-on-primary font-bold shadow-md hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            >
              {isPlayingAudio ? (
                <AudioWaveform className="w-6 h-6 animate-pulse" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
              <span>{isPlayingAudio ? "Memutar Suara..." : "Dengarkan Pelafalan Asli"}</span>
            </button>

            {currentQ.curatorNote && (
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-md bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                {currentQ.curatorNote}
              </p>
            )}

            <button
              type="button"
              onClick={handleLearnContinue}
              className="w-full py-4 rounded-2xl bg-secondary text-on-secondary font-black uppercase tracking-wider shadow-[0_4px_0_0_#653e00] hover:bg-secondary-container active:translate-y-0.5 transition-all text-sm mt-2"
            >
              Paham, Lanjut ke Latihan
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAHAP 2: LAYAR 2 (PRACTICE VISUAL - GAMBAR / HOTSPOT)     */}
        {/* ======================================================== */}
        {isVisualMode && currentQ.type !== "learn" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-6 lg:gap-10">
            {/* Visual Card */}
            <div className="w-full md:w-7/12 bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border-2 border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-on-surface text-center tracking-tight mb-4">
                  {currentQ.prompt || "Baju Adat Apakah Ini?"}
                </h2>

                <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-surface-container-high/40 flex items-center justify-center border border-outline-variant/20">
                  {currentQ.imageUrl ? (
                    <img
                      src={currentQ.imageUrl}
                      alt={currentQ.prompt}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-on-surface-variant font-bold text-sm">[Gambar Objek]</div>
                  )}

                  {currentQ.hotspots?.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveHotspotId(spot.id)}
                      style={{ top: spot.top, left: spot.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-transform cursor-pointer ${
                        activeHotspotId === spot.id
                          ? "bg-primary text-on-primary ring-4 ring-primary-fixed scale-110 shadow-lg z-20"
                          : "bg-surface-container-lowest text-on-surface ring-2 ring-outline-variant hover:scale-105 z-10"
                      }`}
                    >
                      {spot.id}
                    </button>
                  ))}
                </div>

                {selectedHotspot && currentQ.hotspots && currentQ.hotspots.length > 0 && (
                  <p className="text-center text-xs text-on-surface-variant font-semibold mt-2.5">
                    Titik {selectedHotspot.id}: <span className="text-primary font-bold">{selectedHotspot.name}</span> — {selectedHotspot.description}
                  </p>
                )}
              </div>

              <div className="w-32 h-1 bg-outline-variant/50 rounded-full mx-auto mt-4" />
            </div>

            {/* Options List */}
            <div className="w-full md:w-5/12 flex flex-col justify-center">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3.5 w-full">
                {currentQ.options?.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isLocked = feedbackState !== "idle";

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`w-full py-4 px-4 sm:px-6 rounded-2xl text-center md:text-left font-black text-base sm:text-lg transition-all border-2 cursor-pointer shadow-[0_3px_0_0_#e0bfb7] active:translate-y-0.5 ${
                        isSelected
                          ? "border-primary bg-primary-fixed/30 text-primary shadow-[0_3px_0_0_#ca4a28] ring-2 ring-primary"
                          : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary/60 hover:bg-surface-container-low"
                      } ${isLocked ? "cursor-default" : ""}`}
                    >
                      <span className="block truncate">{opt.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILIHAN GANDA UMUM (MULTIPLE CHOICE TANPA GAMBAR)        */}
        {/* ======================================================== */}
        {currentQ.type === "multiple_choice" && !isVisualMode && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border-2 border-outline-variant/30 shadow-sm mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-on-surface text-center tracking-tight">
                {currentQ.prompt}
              </h2>
              {currentQ.subPrompt && (
                <p className="text-center text-sm text-on-surface-variant font-medium mt-2">
                  {currentQ.subPrompt}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3.5 w-full">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isLocked = feedbackState !== "idle";

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full py-4 px-6 rounded-2xl text-left font-black text-base sm:text-lg transition-all border-2 cursor-pointer shadow-[0_3px_0_0_#e0bfb7] active:translate-y-0.5 ${
                      isSelected
                        ? "border-primary bg-primary-fixed/30 text-primary shadow-[0_3px_0_0_#ca4a28] ring-2 ring-primary"
                        : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary/60 hover:bg-surface-container-low"
                    } ${isLocked ? "cursor-default" : ""}`}
                  >
                    <span className="block">{opt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAHAP 3: LAYAR 3 (PRACTICE AUDIO - GELOMBANG SUARA)       */}
        {/* ======================================================== */}
        {currentQ.type === "audio" && (
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-black text-on-surface text-center tracking-tight mb-6 max-w-xl">
              {currentQ.prompt || "Dengarkan audio berikut dan pilih arti yang tepat:"}
            </h2>

            {/* Kotak Gelombang Suara */}
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-7 border-2 border-outline-variant/30 shadow-sm flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-lg sm:text-xl font-black text-on-surface">
                  Gelombang Suara
                </span>

                <div className="flex items-center gap-1.5 h-6">
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-6 animate-pulse" : "h-3"}`} />
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-8" : "h-4"}`} />
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-4" : "h-2"}`} />
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-7 animate-pulse" : "h-5"}`} />
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-5" : "h-3"}`} />
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-7" : "h-6"}`} />
                  <span className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isPlayingAudio ? "h-4" : "h-3"}`} />
                  <span className="w-1.5 h-2 rounded-full bg-outline-variant" />
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlayAudio}
                className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                title="Putar Suara"
              >
                {isPlayingAudio ? (
                  <AudioWaveform className="w-7 h-7 animate-pulse" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-0.5" />
                )}
              </button>
            </div>

            <div className="w-56 h-1 bg-outline-variant/50 rounded-full my-8" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isLocked = feedbackState !== "idle";

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`py-4 px-4 rounded-2xl text-center font-black text-base sm:text-lg transition-all border-2 cursor-pointer shadow-[0_3px_0_0_#e0bfb7] active:translate-y-0.5 ${
                      isSelected
                        ? "border-primary bg-primary-fixed/30 text-primary shadow-[0_3px_0_0_#ca4a28] ring-2 ring-primary"
                        : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary/60 hover:bg-surface-container-low"
                    } ${isLocked ? "cursor-default" : ""}`}
                  >
                    <span className="block truncate">{opt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAHAP 4: LAYAR 4 (WORD BUILDER - SUSUN KEPINGAN KATA)     */}
        {/* ======================================================== */}
        {currentQ.type === "word_builder" && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
                Tahap 4: Susun Kepingan Kata
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-3">
                {currentQ.prompt}
              </h2>
            </div>

            {/* Target Slot Area */}
            <div className="w-full min-h-[72px] p-4 rounded-2xl bg-surface-container-lowest border-2 border-dashed border-outline-variant/60 flex items-center justify-center gap-2 flex-wrap shadow-inner">
              {chosenWordTiles.length === 0 ? (
                <span className="text-body-sm text-on-surface-variant font-medium">
                  Tap kepingan kata di bawah untuk menyusun kalimat...
                </span>
              ) : (
                chosenWordTiles.map((word, wIdx) => (
                  <button
                    key={`${word}-${wIdx}`}
                    type="button"
                    onClick={() => {
                      if (feedbackState !== "idle") return;
                      setChosenWordTiles((prev) => prev.filter((_, i) => i !== wIdx));
                    }}
                    className="px-4 py-2 rounded-xl bg-primary-fixed text-on-primary-fixed font-black text-base shadow-sm hover:bg-error-container hover:text-error transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{word}</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))
              )}
            </div>

            {/* Source Pool of Word Tiles */}
            <div className="flex items-center justify-center gap-3 flex-wrap w-full">
              {currentQ.wordTiles?.map((tile, tIdx) => {
                const isUsed = chosenWordTiles.includes(tile);
                return (
                  <button
                    key={`${tile}-${tIdx}`}
                    type="button"
                    disabled={isUsed || feedbackState !== "idle"}
                    onClick={() => {
                      if (isUsed || feedbackState !== "idle") return;
                      setChosenWordTiles((prev) => [...prev, tile]);
                    }}
                    className={`px-5 py-3 rounded-2xl font-black text-lg transition-all border-2 shadow-[0_3px_0_0_#e0bfb7] ${
                      isUsed
                        ? "bg-surface-container text-on-surface-variant/30 border-transparent shadow-none cursor-not-allowed"
                        : "bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:border-primary active:translate-y-0.5 cursor-pointer"
                    }`}
                  >
                    {tile}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAHAP 5: LAYAR 5 (MATCHING - PASANG ATRIBUT BUDAYA)      */}
        {/* ======================================================== */}
        {currentQ.type === "matching" && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
                Tahap 5: Jodohkan Pasangan Atribut
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-3">
                {currentQ.prompt}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Left Column */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block text-center mb-1">
                  Istilah Adat
                </span>
                {currentQ.matchingPairs?.map((pair) => {
                  const isMatched = completedMatches.includes(pair.id);
                  const isSelected = selectedLeftMatch === pair.id;

                  return (
                    <button
                      key={`left-${pair.id}`}
                      type="button"
                      disabled={isMatched || feedbackState !== "idle"}
                      onClick={() => handleMatchSelect("left", pair.id)}
                      className={`w-full p-4 rounded-2xl font-bold text-center border-2 transition-all shadow-sm ${
                        isMatched
                          ? "bg-[#d7f7c2] border-[#58a700] text-[#1b5e20] shadow-none cursor-default"
                          : isSelected
                          ? "bg-primary-fixed border-primary text-primary ring-2 ring-primary"
                          : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:border-primary cursor-pointer"
                      }`}
                    >
                      {pair.left}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block text-center mb-1">
                  Makna / Fungsi
                </span>
                {currentQ.matchingPairs?.map((pair) => {
                  const isMatched = completedMatches.includes(pair.id);

                  return (
                    <button
                      key={`right-${pair.id}`}
                      type="button"
                      disabled={isMatched || feedbackState !== "idle"}
                      onClick={() => handleMatchSelect("right", pair.id)}
                      className={`w-full p-4 rounded-2xl font-bold text-center border-2 transition-all shadow-sm ${
                        isMatched
                          ? "bg-[#d7f7c2] border-[#58a700] text-[#1b5e20] shadow-none cursor-default"
                          : selectedLeftMatch
                          ? "bg-surface-container-lowest border-primary/50 text-on-surface hover:bg-primary-fixed/20 cursor-pointer"
                          : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:border-primary cursor-pointer"
                      }`}
                    >
                      {pair.right}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAHAP 6: LAYAR 6 (ROLEPLAY - SIMULASI PERISTIWA NYATA)    */}
        {/* ======================================================== */}
        {currentQ.type === "roleplay" && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
                Tahap 6: Tantangan Skenario Nyata
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-2">
                {currentQ.prompt || "Simulasi Adat di Souraja"}
              </h2>
            </div>

            {/* Context & NPC Chat Bubble */}
            <div className="w-full p-5 rounded-3xl bg-surface-container-lowest border-2 border-outline-variant/30 shadow-sm space-y-4">
              {currentQ.scenarioContext && (
                <p className="text-xs text-on-surface-variant italic border-b border-outline-variant/20 pb-2">
                  📍 {currentQ.scenarioContext}
                </p>
              )}

              {/* NPC Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface-container-low border border-outline-variant/20 max-w-md">
                  <span className="text-[10px] font-bold text-secondary uppercase block mb-0.5">
                    Tetua Adat Kaili (Magau)
                  </span>
                  <p className="text-sm font-semibold text-on-surface leading-snug">
                    &ldquo;{currentQ.npcDialogue || "Nalompa mai kami, ananda..."}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* User Dialogue Choices */}
            <div className="w-full space-y-3">
              <span className="text-xs font-bold text-on-surface-variant block text-center">
                Pilih respon santun yang paling sesuai:
              </span>
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isLocked = feedbackState !== "idle";

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full p-4 rounded-2xl text-left font-bold text-sm sm:text-base transition-all border-2 cursor-pointer shadow-[0_3px_0_0_#e0bfb7] active:translate-y-0.5 ${
                      isSelected
                        ? "border-primary bg-primary-fixed/30 text-primary shadow-[0_3px_0_0_#ca4a28] ring-2 ring-primary"
                        : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary/60 hover:bg-surface-container-low"
                    } ${isLocked ? "cursor-default" : ""}`}
                  >
                    <span className="block">{opt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── BOTTOM DRAWER / ACTION BAR (HANYA MUNCUL DI TAHAP PRACTICE) ── */}
      {currentQ.type !== "learn" && (
        <footer
          className={`fixed bottom-0 left-0 right-0 p-4 lg:px-8 border-t transition-all duration-300 z-50 ${
            feedbackState === "idle"
              ? "bg-surface/95 backdrop-blur-md border-outline-variant/30"
              : feedbackState === "correct"
              ? "bg-[#d7f7c2] border-[#58a700]/40 text-[#1b5e20]"
              : "bg-[#ffdfe0] border-[#ea2b2b]/40 text-[#b71c1c]"
          }`}
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full text-center sm:text-left">
              {feedbackState === "idle" && (
                <span className="text-body-sm text-on-surface-variant font-medium hidden sm:inline">
                  Selesaikan jawaban di atas lalu klik Periksa.
                </span>
              )}

              {feedbackState === "correct" && (
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#58a700] shrink-0" />
                  <div>
                    <h4 className="text-lg font-black text-[#58a700] leading-none">
                      Luar Biasa! Benar
                    </h4>
                    {currentQ.curatorNote && (
                      <p className="text-xs text-[#2e7d32] mt-1 font-semibold line-clamp-2">
                        {currentQ.curatorNote}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {feedbackState === "wrong" && (
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <XCircle className="w-7 h-7 text-[#ea2b2b] shrink-0" />
                  <div>
                    <h4 className="text-lg font-black text-[#ea2b2b] leading-none">
                      Kurang Tepat (-1 Nyawa)
                    </h4>
                    {currentQ.curatorNote && (
                      <p className="text-xs text-[#c62828] mt-1 font-bold">
                        {currentQ.curatorNote}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full sm:w-auto shrink-0">
              {feedbackState === "idle" ? (
                <button
                  type="button"
                  disabled={!isCheckActive}
                  onClick={handleCheckAnswer}
                  className={`w-full sm:w-56 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-[0_4px_0_0_#881f00] active:translate-y-0.5 ${
                    isCheckActive
                      ? "bg-primary text-on-primary hover:bg-primary-container cursor-pointer"
                      : "bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed shadow-none"
                  }`}
                >
                  <span>Periksa</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className={`w-full sm:w-56 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
                    feedbackState === "correct"
                      ? "bg-[#58a700] text-white shadow-[0_4px_0_0_#387700]"
                      : "bg-[#ea2b2b] text-white shadow-[0_4px_0_0_#9f1a1a]"
                  }`}
                >
                  <span>{currentIdx + 1 === totalQuestions ? "Selesai & Lihat Reward" : "Lanjut"}</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
