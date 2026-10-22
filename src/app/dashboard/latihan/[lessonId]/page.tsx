"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Compass, Heart, Lock, RotateCcw, Volume2, XCircle } from "lucide-react";
import SourceCard from "../../../components/SourceCard";
import { getSession } from "../../../auth/authClient";
import { loadProgress, recordLessonSession } from "../../progress";
import {
  getLessonById,
  type ChoiceQuestionData,
  type HotspotQuestionData,
  type Lesson,
  type MatchQuestionData,
  type OrderQuestionData,
  type Question,
  type ScenarioQuestionData,
  type TrueFalseQuestionData,
} from "../../../../lib/lessons";

type SessionScreen = "loading" | "intro" | "exercise" | "feedback" | "gameover";

function isAnswerCorrect(question: Question, answer: string, scenarioScore: number) {
  if (question.type === "choice") return answer === (question.data as ChoiceQuestionData).answer;
  if (question.type === "truefalse") return answer === String((question.data as TrueFalseQuestionData).answer);
  if (question.type === "hotspot") return answer === (question.data as HotspotQuestionData).answer;
  if (question.type === "order") return answer === (question.data as OrderQuestionData).answer.join("|");
  if (question.type === "match") return answer === (question.data as MatchQuestionData).pairs.map((pair) => `${pair.left}:${pair.right}`).join("|");
  return scenarioScore >= (question.data as ScenarioQuestionData).passingScore;
}

export default function LessonSessionPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sessionEmail, setSessionEmail] = useState("");
  const [screen, setScreen] = useState<SessionScreen>("loading");
  const [hearts, setHearts] = useState(3);
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [isRetryRound, setIsRetryRound] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctQuestionIds, setCorrectQuestionIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);

  useEffect(() => {
    const lessonId = Number(params.lessonId);
    const currentLesson = getLessonById(lessonId);
    if (!currentLesson) {
      router.replace("/dashboard");
      return;
    }

    getSession().then(async (session) => {
      if (!session) {
        router.replace(`/auth?redirect=/dashboard/latihan/${lessonId}`);
        return;
      }
      const currentProgress = await loadProgress(session.email);
      if (!currentProgress.unlockedLessons.includes(lessonId)) {
        router.replace("/dashboard");
        return;
      }
      setSessionEmail(session.email);
      setLesson(currentLesson);
      setScreen("intro");
    });
  }, [params.lessonId, router]);

  const questionMap = useMemo(
    () => new Map(lesson?.questions.map((question) => [question.id, question]) ?? []),
    [lesson]
  );
  const currentQuestion = questionMap.get(questionOrder[questionIndex]);
  const totalExercises = lesson?.questions.length ?? 0;

  const resetSession = () => {
    if (!lesson) return;
    setQuestionOrder(lesson.questions.map((question) => question.id));
    setQuestionIndex(0);
    setWrongQuestionIds([]);
    setIsRetryRound(false);
    setHearts(3);
    setSelectedAnswer("");
    setIsCorrect(null);
    setCorrectQuestionIds([]);
    setCorrectCount(0);
    setEarnedXp(0);
    setScenarioStep(0);
    setScenarioScore(0);
    setScreen("exercise");
  };

  const finishSession = () => {
    if (!lesson || !sessionEmail) return;
    const lessonXp = lesson.rewardXp;
    recordLessonSession(sessionEmail, {
      lessonId: lesson.id,
      answered: "lesson-session",
      score: Math.round((correctCount / totalExercises) * 100),
      xpEarned: lessonXp,
      bonusXp: 0,
      totalExercises,
      correctExercises: correctCount,
      heartsRemaining: hearts,
      completedAt: new Date().toISOString(),
    });
    router.push(`/dashboard/evaluasi?lesson=${lesson.id}`);
  };

  const moveToNextQuestion = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < questionOrder.length) {
      setQuestionIndex(nextIndex);
      setSelectedAnswer("");
      setIsCorrect(null);
      setScenarioStep(0);
      setScenarioScore(0);
      setScreen("exercise");
      return;
    }

    if (!isRetryRound && wrongQuestionIds.length > 0) {
      setQuestionOrder((order) => [...order, ...wrongQuestionIds]);
      setQuestionIndex(nextIndex);
      setWrongQuestionIds([]);
      setIsRetryRound(true);
      setSelectedAnswer("");
      setIsCorrect(null);
      setScenarioStep(0);
      setScenarioScore(0);
      setScreen("exercise");
      return;
    }

    finishSession();
  };

  const checkAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return;
    let correct = isAnswerCorrect(currentQuestion, selectedAnswer, scenarioScore);

    if (currentQuestion.type === "scenario") {
      const data = currentQuestion.data as ScenarioQuestionData;
      const choice = data.steps[scenarioStep].choices.find((item) => item.id === selectedAnswer);
      if (!choice) return;
      const nextScore = scenarioScore + choice.score;
      setScenarioScore(nextScore);
      correct = scenarioStep === data.steps.length - 1 ? nextScore >= data.passingScore : choice.score > 0;
    }

    setIsCorrect(correct);
    if (correct) {
      const exerciseComplete = currentQuestion.type !== "scenario" || scenarioStep === (currentQuestion.data as ScenarioQuestionData).steps.length - 1;
      if (exerciseComplete && !correctQuestionIds.includes(currentQuestion.id)) {
        setCorrectQuestionIds((ids) => [...ids, currentQuestion.id]);
        setCorrectCount((count) => count + 1);
        setEarnedXp((xp) => xp + currentQuestion.xp);
      }
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (!isRetryRound && !wrongQuestionIds.includes(currentQuestion.id)) {
        setWrongQuestionIds((ids) => [...ids, currentQuestion.id]);
      }
      if (nextHearts <= 0) {
        setScreen("gameover");
        return;
      }
    }
    setScreen("feedback");
  };

  const continueAfterFeedback = () => {
    if (currentQuestion?.type === "scenario" && scenarioStep < (currentQuestion.data as ScenarioQuestionData).steps.length - 1) {
      setScenarioStep((step) => step + 1);
      setSelectedAnswer("");
      setIsCorrect(null);
      setScreen("exercise");
      return;
    }
    moveToNextQuestion();
  };

  const renderChoices = (options: { id: string; label: string }[]) => (
    <div className="mt-8 space-y-3">
      {options.map((option) => (
        <button key={option.id} type="button" disabled={screen === "feedback"} onClick={() => setSelectedAnswer(option.id)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${selectedAnswer === option.id ? "border-primary bg-primary-fixed/30 ring-2 ring-primary" : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container"}`}>
          <span className="font-bold">{option.label}</span>
          {screen === "feedback" && option.id === selectedAnswer && (isCorrect ? <CheckCircle2 className="h-5 w-5 text-secondary" /> : <XCircle className="h-5 w-5 text-error" />)}
        </button>
      ))}
    </div>
  );

  const renderHotspotExercise = (data: HotspotQuestionData) => {
    const selectedSpot = data.hotspots.find((s) => s.id === selectedAnswer);

    return (
      <div className="mt-6 flex flex-col gap-4">
        {/* Hotspot Image Container with Interactive Pins */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-surface-container-high/40 flex items-center justify-center border-2 border-outline-variant/30 shadow-inner group">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.imageCaption || currentQuestion?.prompt}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div className="text-on-surface-variant font-bold text-sm">[Gambar Artefak Adat]</div>
          )}

          {/* Interactive Clickable Pins */}
          {data.hotspots.map((spot, idx) => {
            const isSelected = selectedAnswer === spot.id;
            const isCorrectSpot = screen === "feedback" && spot.id === data.answer;
            const isWrongSelected = screen === "feedback" && isSelected && !isCorrect;

            return (
              <button
                key={spot.id}
                type="button"
                disabled={screen === "feedback"}
                onClick={() => setSelectedAnswer(spot.id)}
                style={{ top: spot.top || "50%", left: spot.left || "50%" }}
                aria-label={`Titik ${idx + 1}: ${spot.label}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer flex items-center justify-center rounded-full font-black text-xs shadow-lg ${
                  isCorrectSpot
                    ? "w-9 h-9 bg-secondary text-on-secondary ring-4 ring-secondary-fixed scale-125 z-30"
                    : isWrongSelected
                    ? "w-9 h-9 bg-error text-on-error ring-4 ring-error-container scale-110 z-30"
                    : isSelected
                    ? "w-9 h-9 bg-primary text-on-primary ring-4 ring-primary-fixed scale-125 z-20 shadow-primary/40 shadow-xl"
                    : "w-8 h-8 bg-surface-container-lowest/90 text-primary backdrop-blur-xs ring-2 ring-primary/40 hover:scale-110 hover:bg-white z-10"
                }`}
              >
                {screen === "feedback" && isCorrectSpot ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : screen === "feedback" && isWrongSelected ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>
            );
          })}

          {/* Image Caption Pill */}
          {data.imageCaption && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-xl px-3 py-1 text-[11px] text-white/90 font-medium text-center pointer-events-none">
              {data.imageCaption}
            </div>
          )}
        </div>

        {/* Selected Hotspot Description Banner */}
        {selectedSpot ? (
          <div className="p-3.5 rounded-xl bg-primary-fixed/20 border border-primary/30 flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-primary">{selectedSpot.label}</span>
              <p className="text-on-surface-variant font-medium mt-0.5">{selectedSpot.description}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant text-center font-medium italic">
            Ketuk salah satu titik pada gambar atau pilih opsi di bawah untuk menentukan jawaban.
          </p>
        )}

        {/* Option Buttons (Synchronized with pins) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {data.hotspots.map((spot, idx) => {
            const isSelected = selectedAnswer === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                disabled={screen === "feedback"}
                onClick={() => setSelectedAnswer(spot.id)}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary"
                    : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isSelected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                }`}>
                  {idx + 1}
                </span>
                <span className="font-bold text-xs truncate">{spot.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderExercise = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.type === "choice") return renderChoices((currentQuestion.data as ChoiceQuestionData).options);
    if (currentQuestion.type === "truefalse") return renderChoices([{ id: "true", label: "Fakta" }, { id: "false", label: "Mitos" }]);
    if (currentQuestion.type === "hotspot") return renderHotspotExercise(currentQuestion.data as HotspotQuestionData);
    if (currentQuestion.type === "match") {
      const data = currentQuestion.data as MatchQuestionData;
      return renderChoices([{ id: data.pairs.map((pair) => `${pair.left}:${pair.right}`).join("|"), label: data.pairs.map((pair) => `${pair.left} -> ${pair.right}`).join(" • ") }]);
    }
    if (currentQuestion.type === "order") {
      const data = currentQuestion.data as OrderQuestionData;
      return renderChoices([{ id: data.answer.join("|"), label: data.items.join(" -> ") }]);
    }
    const data = currentQuestion.data as ScenarioQuestionData;
    return renderChoices(data.steps[scenarioStep].choices);
  };

  if (screen === "loading" || !lesson) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Memuat misi...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-on-surface px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-surface"><ArrowLeft className="h-5 w-5" />Keluar sesi</Link>
          <div className="flex items-center gap-2 rounded-full bg-error-container px-3 py-1.5 text-sm font-black text-on-error-container"><Heart className="h-4 w-4 fill-current" />{hearts}/3</div>
        </header>
        <div className="mt-6 flex items-center gap-3"><div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${screen === "intro" ? 0 : ((questionIndex + 1) / Math.max(questionOrder.length, totalExercises)) * 100}%` }} /></div><span className="text-xs font-black text-on-surface-variant">{screen === "intro" ? 0 : questionIndex + 1} dari {totalExercises}</span></div>

        {screen === "intro" && <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/30 sm:p-10"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary"><Compass className="h-7 w-7" /></div><p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-primary">Bab {lesson.id} • {lesson.region}</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{lesson.title}</h1><p className="mt-2 text-lg font-bold text-on-surface-variant">{lesson.subtitle}</p><div className="mt-8 rounded-2xl bg-primary-fixed/30 p-5"><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Tahukah kamu?</p><p className="mt-2 text-lg font-semibold leading-relaxed text-on-surface">{lesson.intro}</p></div>{lesson.source && <div className="mt-6"><SourceCard source={lesson.source} /></div>}<p className="mt-5 text-sm text-on-surface-variant">Sesi ini berisi {totalExercises} exercise. Jawaban salah mengurangi satu heart dan akan diulang sekali di akhir.</p><button type="button" onClick={resetSession} className="mt-8 w-full rounded-full bg-primary px-6 py-4 text-base font-black text-on-primary shadow-[0_4px_0_0_#881f00] transition hover:bg-primary-container">Mulai sesi</button></section>}

        {(screen === "exercise" || screen === "feedback") && currentQuestion && <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/30 sm:p-10"><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Exercise {questionIndex + 1} • {currentQuestion.type}</p>{currentQuestion.audioUrl && <div className="mt-3 flex items-center gap-2"><audio id={`audio-${currentQuestion.id}`} src={currentQuestion.audioUrl} preload="auto" /><button type="button" onClick={() => { const el = document.getElementById(`audio-${currentQuestion.id}`) as HTMLAudioElement | null; if (el) { el.currentTime = 0; el.play().catch((e) => console.warn("Gagal memutar audio:", e)); } }} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-primary/20"><Volume2 className="h-4 w-4" /><span>Dengarkan Audio</span></button></div>}<h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{currentQuestion.prompt}</h1>{renderExercise()}{screen === "feedback" && <div className={`mt-6 rounded-2xl p-4 ${isCorrect ? "bg-secondary-fixed/40 text-on-secondary-fixed" : "bg-error-container/60 text-on-error-container"}`}><div className="flex items-center gap-2 font-black">{isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}{isCorrect ? "Jawaban tepat" : "Belum tepat"}</div><p className="mt-2 text-sm font-semibold">{currentQuestion.why}</p></div>}<button type="button" disabled={!selectedAnswer} onClick={screen === "exercise" ? checkAnswer : continueAfterFeedback} className="mt-8 w-full rounded-full bg-primary px-6 py-4 text-base font-black text-on-primary shadow-[0_4px_0_0_#881f00] transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50">{screen === "exercise" ? "Periksa" : "Lanjut"}</button></section>}

        {screen === "gameover" && <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 text-center shadow-xl ring-1 ring-outline-variant/30 sm:p-10"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-error"><Lock className="h-8 w-8" /></div><h1 className="mt-6 text-3xl font-black">Hearts habis</h1><p className="mt-2 text-on-surface-variant">Ulangi sesi ini dan perhatikan konteks sebelum memilih tindakan.</p><button type="button" onClick={resetSession} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-on-primary shadow-[0_4px_0_0_#881f00]"><RotateCcw className="h-5 w-5" />Coba lagi</button></section>}
      </div>
    </main>
  );
}
