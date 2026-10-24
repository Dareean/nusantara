"use client";

import { useState, useMemo, useEffect } from "react";
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
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Trophy,
  Zap,
  Play,
  ShieldCheck,
  Landmark,
  BadgeCheck,
  MessageSquare,
  HelpCircle,
  Undo2,
  Compass,
  Sparkles,
} from "lucide-react";
import {
  GameSession,
  GameQuestion,
  QuestionOption,
  MatchingPair,
  MatchPairItem,
  ScenarioStep,
} from "./types";

interface CulturalGameEngineProps {
  session: GameSession;
  onComplete?: (result: { xp: number; accuracy: number; heartsRemaining: number }) => void;
  onExitHref?: string;
  onExit?: () => void;
  isPreview?: boolean;
  initialQuestionIndex?: number;
}

function shuffleArray<T>(items: readonly T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function CulturalGameEngine({
  session,
  onComplete,
  onExitHref = "/dashboard",
  onExit,
  isPreview = false,
  initialQuestionIndex = 0,
}: CulturalGameEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(() => {
    const maxIdx = Math.max(0, (session.questions?.length || 1) - 1);
    return Math.min(Math.max(0, initialQuestionIndex || 0), maxIdx);
  });

  useEffect(() => {
    if (initialQuestionIndex !== undefined) {
      const maxIdx = Math.max(0, (session.questions?.length || 1) - 1);
      setCurrentIdx(Math.min(Math.max(0, initialQuestionIndex), maxIdx));
    }
  }, [initialQuestionIndex, session.questions?.length]);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<number>(1);
  const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
  const [hearts, setHearts] = useState(3);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // MATCH states (Ronde 4 interaction)
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<MatchPairItem[]>([]);

  // ORDER states (Ronde 4 interaction)
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  // SCENARIO states
  const [scenarioStepIdx, setScenarioStepIdx] = useState<number>(0);
  const [scenarioTotalScore, setScenarioTotalScore] = useState<number>(0);
  const [selectedScenarioChoiceIdx, setSelectedScenarioChoiceIdx] = useState<number | null>(null);

  // Legacy Word Builder states
  const [chosenWordTiles, setChosenWordTiles] = useState<string[]>([]);
  // Legacy Matching states
  const [selectedLeftMatch, setSelectedLeftMatch] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<string[]>([]);

  const totalQuestions = session.questions.length || 1;
  const currentQ: GameQuestion = session.questions[currentIdx] || {
    id: "empty",
    type: "multiple_choice",
    prompt: "Belum ada soal",
    curatorNote: "",
  };

  // Memoized shuffled items for current question
  const currentPairs: MatchPairItem[] = useMemo(() => {
    if (currentQ.type === "match" && currentQ.pairs && currentQ.pairs.length > 0) {
      return currentQ.pairs;
    }
    if (currentQ.type === "matching" && currentQ.matchingPairs && currentQ.matchingPairs.length > 0) {
      return currentQ.matchingPairs.map((p) => ({ left: p.left, right: p.right }));
    }
    return [];
  }, [currentQ]);

  const shuffledMatchRight = useMemo(() => {
    if (currentPairs.length === 0) return [];
    return shuffleArray(currentPairs.map((p) => p.right));
  }, [currentPairs, currentIdx]);

  // Reset state on step / question change
  useEffect(() => {
    setSelectedOptionId(null);
    setFeedbackState("idle");
    setMatchSelectedLeft(null);
    setMatchSelectedRight(null);
    setMatchedPairs([]);
    setSelectedLeftMatch(null);
    setCompletedMatches([]);
    setScenarioStepIdx(0);
    setScenarioTotalScore(0);
    setSelectedScenarioChoiceIdx(null);
    setChosenWordTiles([]);

    // Initialize ORDER items initially reversed or shuffled
    if (currentQ.type === "order" && currentQ.items && currentQ.items.length > 0) {
      const itemsCopy = [...currentQ.items];
      if (itemsCopy.length > 1) {
        const reversed = [...itemsCopy].reverse();
        setOrderedItems(reversed);
      } else {
        setOrderedItems(itemsCopy);
      }
    } else if (currentQ.type === "word_builder" && currentQ.targetSentence) {
      setOrderedItems([...currentQ.targetSentence].reverse());
    }
  }, [currentIdx, currentQ.id]);

  const progressPercent = Math.round(
    ((currentIdx + (feedbackState !== "idle" ? 1 : 0)) / totalQuestions) * 100
  );

  // Audio Play
  const handlePlayAudio = () => {
    if (!currentQ.audioUrl) return;
    try {
      setIsPlayingAudio(true);
      const audio = new Audio(currentQ.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      audio.play().catch((err) => {
        console.warn("Gagal memutar audio:", err);
        setIsPlayingAudio(false);
      });
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // ── MATCH INTERACTION HANDLERS ──
  const handleMatchLeftClick = (left: string) => {
    if (feedbackState !== "idle") return;
    if (matchedPairs.some((p) => p.left === left)) return;

    if (matchSelectedRight) {
      const isValid = currentPairs.some(
        (p) => p.left === left && p.right === matchSelectedRight
      );
      if (isValid) {
        const next = [...matchedPairs, { left, right: matchSelectedRight }];
        setMatchedPairs(next);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
      } else {
        setMatchSelectedLeft(left);
        setMatchSelectedRight(null);
      }
    } else {
      setMatchSelectedLeft(matchSelectedLeft === left ? null : left);
    }
  };

  const handleMatchRightClick = (right: string) => {
    if (feedbackState !== "idle") return;
    if (matchedPairs.some((p) => p.right === right)) return;

    if (matchSelectedLeft) {
      const isValid = currentPairs.some(
        (p) => p.left === matchSelectedLeft && p.right === right
      );
      if (isValid) {
        const next = [...matchedPairs, { left: matchSelectedLeft, right }];
        setMatchedPairs(next);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
      } else {
        setMatchSelectedRight(right);
        setMatchSelectedLeft(null);
      }
    } else {
      setMatchSelectedRight(matchSelectedRight === right ? null : right);
    }
  };

  // ── ORDER INTERACTION HANDLER ──
  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    if (feedbackState !== "idle") return;
    const next = [...orderedItems];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedItems(next);
  };

  // ── CHECK BUTTON READINESS DETERMINATION ──
  let isCheckActive = false;
  if (currentQ.type === "match") {
    isCheckActive =
      currentPairs.length > 0 && matchedPairs.length === currentPairs.length;
  } else if (currentQ.type === "order") {
    isCheckActive = orderedItems.length > 0;
  } else if (currentQ.type === "true_false") {
    isCheckActive = selectedOptionId !== null;
  } else if (currentQ.type === "scenario") {
    isCheckActive = selectedScenarioChoiceIdx !== null;
  } else if (currentQ.type === "word_builder") {
    isCheckActive = chosenWordTiles.length > 0;
  } else if (currentQ.type === "matching") {
    isCheckActive =
      Boolean(currentQ.matchingPairs) &&
      completedMatches.length === (currentQ.matchingPairs?.length || 0);
  } else {
    isCheckActive = Boolean(selectedOptionId);
  }

  // ── CHECK ANSWER LOGIC ──
  const handleCheckAnswer = () => {
    if (feedbackState !== "idle") return;

    // MATCH Check
    if (currentQ.type === "match") {
      const allMatched =
        currentPairs.length > 0 && matchedPairs.length === currentPairs.length;
      if (allMatched) {
        setFeedbackState("correct");
        setCorrectAnswersCount((prev) => prev + 1);
      } else {
        setFeedbackState("wrong");
        setHearts((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // ORDER Check
    if (currentQ.type === "order") {
      const expected = (currentQ.items || []).join("|");
      const actual = orderedItems.join("|");
      const isCorrect = expected === actual;
      if (isCorrect) {
        setFeedbackState("correct");
        setCorrectAnswersCount((prev) => prev + 1);
      } else {
        setFeedbackState("wrong");
        setHearts((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // TRUE_FALSE Check
    if (currentQ.type === "true_false") {
      const userAns = selectedOptionId === "true";
      const correctAns = Boolean(currentQ.answerBoolean);
      const isCorrect = userAns === correctAns;
      if (isCorrect) {
        setFeedbackState("correct");
        setCorrectAnswersCount((prev) => prev + 1);
      } else {
        setFeedbackState("wrong");
        setHearts((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // SCENARIO Check
    if (currentQ.type === "scenario") {
      const steps = currentQ.steps || [];
      const currentStep = steps[scenarioStepIdx];
      if (!currentStep || selectedScenarioChoiceIdx === null) return;
      const choice = currentStep.choices[selectedScenarioChoiceIdx];
      const stepScore = choice?.score ?? 0;
      const nextTotalScore = scenarioTotalScore + stepScore;
      setScenarioTotalScore(nextTotalScore);

      const isLastStep = scenarioStepIdx >= steps.length - 1;
      if (isLastStep) {
        const passing =
          currentQ.passingScore ?? Math.ceil(steps.length * 1.5);
        const passed = nextTotalScore >= passing;
        if (passed) {
          setFeedbackState("correct");
          setCorrectAnswersCount((prev) => prev + 1);
        } else {
          setFeedbackState("wrong");
          setHearts((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Intermediary step: reward good score
        if (stepScore > 0) {
          setFeedbackState("correct");
        } else {
          setFeedbackState("wrong");
          setHearts((prev) => Math.max(0, prev - 1));
        }
      }
      return;
    }

    // Word Builder (legacy)
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

    // Standard Options (multiple_choice, visual, hotspot, audio, roleplay)
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

  // ── ADVANCE TO NEXT QUESTION / STEP ──
  const handleNextQuestion = () => {
    if (currentQ.type === "scenario") {
      const steps = currentQ.steps || [];
      if (scenarioStepIdx < steps.length - 1) {
        setScenarioStepIdx((prev) => prev + 1);
        setSelectedScenarioChoiceIdx(null);
        setFeedbackState("idle");
        return;
      }
    }

    if (hearts <= 0) return;

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const accuracy = Math.round((correctAnswersCount / totalQuestions) * 100);
      onComplete?.({
        xp: session.xpReward || 30,
        accuracy,
        heartsRemaining: hearts,
      });
    }
  };

  // Retry
  const handleRetry = () => {
    setCurrentIdx(0);
    setHearts(3);
    setCorrectAnswersCount(0);
    setIsFinished(false);
    setSelectedOptionId(null);
    setFeedbackState("idle");
  };

  // -------------------------------------------------------------
  // VIEW: GAME OVER
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
            {isPreview
              ? "Pratinjau sesi selesai karena nyawa habis. Coba lagi untuk meninjau alur jawaban yang benar."
              : "Tetap semangat! Pelajari kembali materi ini dan coba lagi dari awal."}
          </p>

          <div className="w-full pt-4 flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-bold shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Coba Lagi</span>
            </button>
            {onExit ? (
              <button
                type="button"
                onClick={onExit}
                className="w-full py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-center transition-colors text-sm cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            ) : (
              <Link
                href={onExitHref}
                className="w-full py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-center transition-colors text-sm"
              >
                Kembali
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: VICTORY / LESSON COMPLETE
  // -------------------------------------------------------------
  if (isFinished) {
    const accuracy = Math.round(
      (correctAnswersCount / Math.max(1, totalQuestions)) * 100
    );
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
          {isPreview && (
            <div className="w-full bg-secondary-fixed/50 border border-secondary text-on-secondary-fixed px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
              Pratinjau Selesai • Progres tidak ditulis ke akun
            </div>
          )}

          <div className="relative my-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-secondary-container to-secondary-fixed flex items-center justify-center shadow-lg ring-4 ring-secondary-fixed-dim">
              <Trophy className="w-10 h-10 text-surface-container-lowest" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1.5 rounded-full shadow-md">
              <Zap className="w-4 h-4 text-secondary" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Pelajaran Tuntas!
            </h1>
            <p className="text-body-sm sm:text-body-md text-on-surface-variant mt-1">
              Kamu telah menyelesaikan sesi <strong>{session.title}</strong> ({totalQuestions} tantangan).
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
              <span className="text-[10px] uppercase font-extrabold text-on-surface-variant">Sisa Nyawa</span>
              <span className="text-xl font-black text-error mt-0.5">{hearts}/3</span>
            </div>
          </div>

          {/* CULTURAL SOURCE CARD */}
          <div className="w-full text-left p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-secondary font-black text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Cultural Source Card</span>
              </div>
              <span className="text-[10px] font-mono text-outline font-bold">
                {sourceCard.registrationCode}
              </span>
            </div>

            <p className="text-body-xs text-on-surface-variant leading-relaxed">
              {sourceCard.summary}
            </p>

            <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-on-surface-variant">
              <span>Lembaga: <strong>{sourceCard.institution}</strong></span>
              <span className="text-secondary font-bold">
                {sourceCard.status || "Draft — dalam proses validasi"}
              </span>
            </div>
          </div>

          <div className="w-full pt-1 flex flex-col sm:flex-row gap-3">
            {onExit ? (
              <button
                type="button"
                onClick={onExit}
                className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 text-center text-sm cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            ) : (
              <Link
                href={onExitHref}
                className="flex-1 py-3.5 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 text-center text-sm"
              >
                Lanjutkan
              </Link>
            )}
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
      {/* ── TOP HUD CONTAINER (STICKY, ZERO OVERLAP) ── */}
      <div className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 shadow-xs">
        {/* Preview Banner */}
        {isPreview && (
          <div className="bg-amber-500/15 border-b border-amber-500/25 text-amber-950 px-3 py-1.5 flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse shrink-0" />
              <span className="text-[11px] font-black truncate">
                Mode Pratinjau (Simulasi) • Soal #{currentIdx + 1}/{totalQuestions}
              </span>
            </div>
            {onExit ? (
              <button
                type="button"
                onClick={onExit}
                className="px-2.5 py-0.5 rounded-lg bg-amber-800 text-white text-[10px] font-bold hover:bg-amber-900 cursor-pointer shrink-0 ml-2 shadow-2xs"
              >
                Tutup
              </button>
            ) : (
              <Link
                href={onExitHref}
                className="px-2.5 py-0.5 rounded-lg bg-amber-800 text-white text-[10px] font-bold hover:bg-amber-900 shrink-0 ml-2 shadow-2xs"
              >
                Keluar
              </Link>
            )}
          </div>
        )}

        {/* Top HUD (Exit, Progress Bar, Hearts) */}
        <header className="h-14 flex items-center justify-between px-3 sm:px-6">
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
            title="Keluar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar & Question Counter */}
          <div className="flex-1 max-w-md mx-3 sm:mx-6">
            <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-on-surface-variant">
              <span>
                Soal {Math.min(currentIdx + 1, totalQuestions)} dari {totalQuestions}
              </span>
              {isPreview && (
                <span className="text-[10px] uppercase font-black tracking-wider text-secondary">
                  Simulasi
                </span>
              )}
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Hearts & Streak */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-surface-container px-2.5 py-0.5 rounded-full text-xs font-bold text-on-surface">
              <Flame className="w-3.5 h-3.5 text-primary fill-current" />
              <span>{session.streakDays || 3}</span>
            </div>
            <div className="flex items-center gap-1 bg-error-container/40 px-2.5 py-0.5 rounded-full border border-error/20">
              <Heart className="w-4 h-4 text-error fill-current" />
              <span className="text-xs text-error font-extrabold">{hearts}/3</span>
            </div>
          </div>
        </header>
      </div>

      {/* ── MAIN VIEWPORT ── */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-5 pb-32 max-w-xl mx-auto w-full">
        {/* ======================================================== */}
        {/* 1. MATCH (JODOHKAN PASANGAN DUA KOLOM - RONDE 4)          */}
        {/* ======================================================== */}
        {currentQ.type === "match" && (
          <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-3 py-1 rounded-full border border-secondary/30">
                Jodohkan Pasangan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-2.5">
                {currentQ.prompt}
              </h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Ketuk satu ungkapan di kolom kiri, lalu ketuk konteks/artinya di kolom kanan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Kolom Kiri */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-primary block text-center">
                  Ungkapan
                </span>
                {currentPairs.map((p) => {
                  const isMatched = matchedPairs.some((m) => m.left === p.left);
                  const isSelected = matchSelectedLeft === p.left;

                  let style =
                    "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface";
                  if (isMatched) {
                    style =
                      "border-secondary bg-secondary-fixed/40 text-on-surface ring-1 ring-secondary";
                  } else if (isSelected) {
                    style =
                      "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary font-black";
                  }

                  return (
                    <button
                      key={p.left}
                      type="button"
                      disabled={feedbackState !== "idle" || isMatched}
                      onClick={() => handleMatchLeftClick(p.left)}
                      className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition flex items-center justify-between cursor-pointer disabled:cursor-default ${style}`}
                    >
                      <span>{p.left}</span>
                      {isMatched && <Check className="h-4 w-4 text-secondary stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-secondary block text-center">
                  Konteks / Arti
                </span>
                {shuffledMatchRight.map((rightText) => {
                  const isMatched = matchedPairs.some((m) => m.right === rightText);
                  const isSelected = matchSelectedRight === rightText;

                  let style =
                    "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface";
                  if (isMatched) {
                    style =
                      "border-secondary bg-secondary-fixed/40 text-on-surface ring-1 ring-secondary";
                  } else if (isSelected) {
                    style =
                      "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary font-black";
                  }

                  return (
                    <button
                      key={rightText}
                      type="button"
                      disabled={feedbackState !== "idle" || isMatched}
                      onClick={() => handleMatchRightClick(rightText)}
                      className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition flex items-center justify-between cursor-pointer disabled:cursor-default ${style}`}
                    >
                      <span className="text-xs sm:text-sm">{rightText}</span>
                      {isMatched && <Check className="h-4 w-4 text-secondary stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {matchedPairs.length === currentPairs.length && feedbackState === "idle" && (
              <div className="p-3 bg-secondary-fixed/30 border border-secondary/30 rounded-xl flex items-center gap-2 text-xs font-bold text-secondary">
                <CheckCircle2 className="h-4 w-4" />
                <span>Semua pasangan telah terhubung! Tekan tombol Periksa di bawah.</span>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ORDER (SUSUN URUTAN NAIK/TURUN - RONDE 4)              */}
        {/* ======================================================== */}
        {currentQ.type === "order" && (
          <div className="w-full max-w-xl mx-auto space-y-4">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-3 py-1 rounded-full border border-secondary/30">
                Susun Urutan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-2.5">
                {currentQ.prompt}
              </h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Susun urutan yang tepat dengan menekan tombol naik (↑) atau turun (↓).
              </p>
            </div>

            <div className="space-y-2.5 mt-4">
              {orderedItems.map((item, index) => {
                const targetItems = currentQ.items || [];
                const isTargetCorrect =
                  feedbackState === "correct" && targetItems[index] === item;

                let borderStyle = "border-outline-variant/30 bg-surface-container-low";
                if (feedbackState === "correct") {
                  borderStyle = "border-secondary bg-secondary-fixed/30 ring-1 ring-secondary";
                } else if (feedbackState === "wrong") {
                  borderStyle = isTargetCorrect
                    ? "border-secondary bg-secondary-fixed/30 ring-1 ring-secondary"
                    : "border-error bg-error-container/30 ring-1 ring-error";
                }

                return (
                  <div
                    key={`${item}-${index}`}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition ${borderStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-fixed text-xs font-black text-primary">
                        {index + 1}
                      </span>
                      <span className="font-bold text-on-surface text-sm sm:text-base">
                        {item}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={feedbackState !== "idle" || index === 0}
                        onClick={() => moveOrderItem(index, index - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        aria-label="Geser ke atas"
                      >
                        <ArrowUp className="h-4 w-4 text-on-surface" />
                      </button>
                      <button
                        type="button"
                        disabled={
                          feedbackState !== "idle" || index === orderedItems.length - 1
                        }
                        onClick={() => moveOrderItem(index, index + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        aria-label="Geser ke bawah"
                      >
                        <ArrowDown className="h-4 w-4 text-on-surface" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {feedbackState === "wrong" && currentQ.items && (
              <div className="mt-3 p-3 bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface">
                <span className="font-black text-secondary">Urutan yang tepat: </span>
                {currentQ.items.map((ans, i) => `${i + 1}. ${ans}`).join(" → ")}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. TRUE / FALSE (BENAR / SALAH TOGGLE)                   */}
        {/* ======================================================== */}
        {currentQ.type === "true_false" && (
          <div className="w-full max-w-xl mx-auto space-y-5">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-3 py-1 rounded-full border border-secondary/30">
                Benar / Salah
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-2.5">
                {currentQ.prompt}
              </h2>
              {currentQ.statement && currentQ.statement !== currentQ.prompt && (
                <div className="mt-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-sm font-semibold text-on-surface italic">
                  &ldquo;{currentQ.statement}&rdquo;
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { id: "true", label: "Fakta / Benar" },
                { id: "false", label: "Mitos / Salah" },
              ].map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isLocked = feedbackState !== "idle";
                const isThisCorrect =
                  String(Boolean(currentQ.answerBoolean)) === opt.id;
                const showAsCorrect = isLocked && isThisCorrect;
                const showAsWrong = isLocked && isSelected && !isThisCorrect;

                let btnStyle =
                  "border-outline-variant/30 bg-surface-container-lowest hover:border-primary/60";
                if (showAsCorrect) {
                  btnStyle =
                    "border-secondary bg-secondary-fixed/30 ring-2 ring-secondary text-on-surface";
                } else if (showAsWrong) {
                  btnStyle =
                    "border-error bg-error-container/40 ring-2 ring-error text-on-error-container";
                } else if (isSelected) {
                  btnStyle =
                    "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary font-black";
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-6 rounded-3xl border-2 text-center font-black text-base sm:text-lg transition-all shadow-[0_3px_0_0_#e0bfb7] cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {showAsCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-secondary mx-auto mt-2" />
                    )}
                    {showAsWrong && (
                      <XCircle className="w-5 h-5 text-error mx-auto mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. SCENARIO (SKENARIO BERCABANG BERTINGKAT)               */}
        {/* ======================================================== */}
        {currentQ.type === "scenario" && (
          <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed/50 px-3 py-1 rounded-full border border-secondary/30">
                Skenario Sikap &amp; Adab
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-2.5">
                {currentQ.prompt}
              </h2>
            </div>

            {(() => {
              const steps = currentQ.steps || [];
              const step = steps[scenarioStepIdx] || {
                prompt: currentQ.prompt,
                choices: [],
              };

              return (
                <div className="space-y-4 mt-2">
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-black text-xs shrink-0">
                      {scenarioStepIdx + 1}/{steps.length}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                        Langkah {scenarioStepIdx + 1}
                      </span>
                      <p className="text-sm sm:text-base font-bold text-on-surface mt-0.5">
                        {step.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {step.choices.map((choice, cIdx) => {
                      const isSelected = selectedScenarioChoiceIdx === cIdx;
                      const isLocked = feedbackState !== "idle";

                      let style =
                        "border-outline-variant/30 bg-surface-container-lowest hover:border-primary/60";
                      if (isSelected) {
                        style =
                          "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary font-black";
                      }

                      return (
                        <button
                          key={cIdx}
                          type="button"
                          disabled={isLocked}
                          onClick={() => setSelectedScenarioChoiceIdx(cIdx)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${style}`}
                        >
                          <span className="text-sm sm:text-base font-bold">
                            {choice.label}
                          </span>
                          {choice.feedback && feedbackState !== "idle" && (
                            <span className="text-xs text-on-surface-variant font-medium ml-2">
                              (+{choice.score} skor)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. HOTSPOT VISUAL                                        */}
        {/* ======================================================== */}
        {currentQ.type === "hotspot" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-6">
            <div className="w-full md:w-7/12 bg-surface-container-lowest rounded-3xl p-5 border-2 border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-on-surface text-center tracking-tight mb-3">
                  {currentQ.prompt}
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

                  {currentQ.hotspots?.map((spot) => {
                    const isSelected =
                      selectedOptionId === String(spot.id) ||
                      selectedOptionId === spot.name;

                    return (
                      <button
                        key={spot.id}
                        type="button"
                        disabled={feedbackState !== "idle"}
                        onClick={() => {
                          setActiveHotspotId(spot.id);
                          setSelectedOptionId(String(spot.id));
                        }}
                        style={{ top: spot.top, left: spot.left }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-transform cursor-pointer ${
                          isSelected || activeHotspotId === spot.id
                            ? "bg-primary text-on-primary ring-4 ring-primary-fixed scale-110 shadow-lg z-20"
                            : "bg-surface-container-lowest text-on-surface ring-2 ring-outline-variant hover:scale-105 z-10"
                        }`}
                      >
                        {spot.id}
                      </button>
                    );
                  })}
                </div>

                {currentQ.imageCaption && (
                  <p className="text-center text-[11px] text-on-surface-variant font-medium mt-2">
                    {currentQ.imageCaption}
                  </p>
                )}
              </div>
            </div>

            {/* Hotspot Option Buttons */}
            <div className="w-full md:w-5/12 flex flex-col justify-center">
              <div className="space-y-3 w-full">
                {currentQ.options?.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isLocked = feedbackState !== "idle";

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        const numeric = Number(opt.id);
                        if (!isNaN(numeric)) setActiveHotspotId(numeric);
                      }}
                      className={`w-full py-3.5 px-4 rounded-2xl text-left font-black text-sm sm:text-base transition-all border-2 cursor-pointer shadow-[0_3px_0_0_#e0bfb7] ${
                        isSelected
                          ? "border-primary bg-primary-fixed/30 text-primary shadow-[0_3px_0_0_#ca4a28] ring-2 ring-primary"
                          : "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary/60"
                      }`}
                    >
                      <span>{opt.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. MULTIPLE CHOICE (STANDARD PILIHAN GANDA)              */}
        {/* ======================================================== */}
        {(currentQ.type === "multiple_choice" || currentQ.type === "audio") && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full bg-surface-container-lowest rounded-3xl p-5 sm:p-7 border-2 border-outline-variant/30 shadow-xs mb-4 text-center">
              <h2 className="text-lg sm:text-xl font-black text-on-surface tracking-tight">
                {currentQ.prompt}
              </h2>
              {currentQ.subPrompt && (
                <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1.5">
                  {currentQ.subPrompt}
                </p>
              )}

              {/* Audio button if audioUrl present */}
              {currentQ.audioUrl && (
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-primary/20"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>{isPlayingAudio ? "Memutar..." : "Putar Audio Rekaman"}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 w-full">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isLocked = feedbackState !== "idle";
                const isThisCorrect = isLocked && opt.isCorrect;
                const isThisWrong = isLocked && isSelected && !opt.isCorrect;

                let btnStyle =
                  "border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-primary/60";
                if (isThisCorrect) {
                  btnStyle =
                    "border-secondary bg-secondary-fixed/30 ring-2 ring-secondary text-on-surface";
                } else if (isThisWrong) {
                  btnStyle =
                    "border-error bg-error-container/40 ring-2 ring-error text-on-error-container";
                } else if (isSelected) {
                  btnStyle =
                    "border-primary bg-primary-fixed/30 text-primary ring-2 ring-primary";
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full py-3 px-4 sm:py-3.5 sm:px-5 rounded-2xl text-left font-bold text-sm sm:text-base transition-all border-2 cursor-pointer shadow-[0_3px_0_0_#e0bfb7] ${btnStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {opt.label && (
                          <span className="text-primary mr-1">{opt.label}.</span>
                        )}
                        <span>{opt.title}</span>
                      </div>
                      {isThisCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                      )}
                      {isThisWrong && (
                        <XCircle className="h-5 w-5 text-error shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. LEGACY TYPES (LEARN, VISUAL, ROLEPLAY)                */}
        {/* ======================================================== */}
        {currentQ.type === "learn" && (
          <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border-2 border-outline-variant/30 shadow-sm text-center flex flex-col items-center gap-5">
            <span className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
              Pengenalan Materi
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
                {currentQ.term || currentQ.prompt}
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

            {currentQ.curatorNote && (
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-md bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                {currentQ.curatorNote}
              </p>
            )}

            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl bg-secondary text-on-secondary font-black uppercase tracking-wider shadow-[0_4px_0_0_#653e00] hover:bg-secondary-container active:translate-y-0.5 transition-all text-sm mt-2 cursor-pointer"
            >
              Paham, Lanjut ke Latihan
            </button>
          </div>
        )}
      </main>

      {/* ── BOTTOM DRAWER / ACTION BAR ── */}
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
                    {currentQ.options?.find((o) => o.isCorrect) && (
                      <p className="text-xs text-on-surface font-extrabold mt-1">
                        Jawaban yang benar:{" "}
                        <span className="text-[#881f00] underline">
                          {currentQ.options.find((o) => o.isCorrect)?.title}
                        </span>
                      </p>
                    )}
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
                  <span>
                    {currentQ.type === "scenario" &&
                    (currentQ.steps?.length || 0) > 1 &&
                    scenarioStepIdx < (currentQ.steps?.length || 0) - 1
                      ? "Berikutnya"
                      : currentIdx + 1 === totalQuestions
                      ? "Lanjutkan"
                      : "Berikutnya"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </footer>
      )}

      {/* ── MODAL: KONFIRMASI KELUAR PELAJARAN (RESPONSIF LANSKAP & POTRET) ── */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-surface-container-lowest p-5 sm:p-6 shadow-2xl ring-1 ring-outline-variant/30 max-h-[90dvh] overflow-y-auto flex flex-col items-center text-center [@media(max-height:450px)]:py-3 [@media(max-height:450px)]:px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-error-container text-error flex items-center justify-center shrink-0 [@media(max-height:450px)]:w-10 [@media(max-height:450px)]:h-10">
              <X className="w-7 h-7 sm:w-8 sm:h-8 [@media(max-height:450px)]:w-5 [@media(max-height:450px)]:h-5" />
            </div>
            <h2 className="mt-3 text-lg sm:text-xl font-black text-on-surface [@media(max-height:450px)]:mt-1.5 [@media(max-height:450px)]:text-base">
              Keluar Pelajaran?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-on-surface-variant font-medium [@media(max-height:450px)]:mt-0.5 [@media(max-height:450px)]:text-xs">
              Progres latihan ini akan hilang jika kamu keluar sekarang.
            </p>
            <div className="mt-5 w-full flex flex-col sm:flex-row gap-2 sm:gap-3 [@media(max-height:450px)]:mt-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="w-full py-2.5 sm:py-3 rounded-full bg-surface-container text-on-surface font-extrabold text-xs sm:text-sm hover:bg-surface-container-high transition cursor-pointer"
              >
                Lanjutkan Belajar
              </button>
              {onExit ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowExitModal(false);
                    onExit();
                  }}
                  className="w-full py-2.5 sm:py-3 rounded-full bg-error text-on-error font-extrabold text-xs sm:text-sm shadow-[0_3px_0_0_#93000a] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                >
                  Keluar
                </button>
              ) : (
                <Link
                  href={onExitHref}
                  className="w-full py-2.5 sm:py-3 rounded-full bg-error text-on-error font-extrabold text-xs sm:text-sm shadow-[0_3px_0_0_#93000a] hover:brightness-105 active:translate-y-0.5 transition text-center inline-flex items-center justify-center"
                >
                  Keluar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
