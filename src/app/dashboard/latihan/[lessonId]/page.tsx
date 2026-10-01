"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Heart, Lock, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { getSession } from "../../../auth/authClient";
import { loadProgress, recordLessonSession } from "../../progress";
import { getLessonById, type ChoiceQuestionData, type Lesson } from "../../../../lib/lessons";

type SessionScreen = "loading" | "intro" | "exercise" | "feedback" | "gameover";

export default function LessonSessionPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [screen, setScreen] = useState<SessionScreen>("loading");
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionEmail, setSessionEmail] = useState("");

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
      setSessionEmail(session.email);
      const currentProgress = await loadProgress(session.email);
      if (!currentProgress.unlockedLessons.includes(lessonId)) {
        router.replace("/dashboard");
        return;
      }
      setLesson(currentLesson);
      setScreen("intro");
    });
  }, [params.lessonId, router]);

  if (screen === "loading" || !lesson) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Memuat misi...</div>;
  }

  const choiceQuestion = lesson.questions.find((question) => question.type === "choice");
  const choiceData = choiceQuestion?.data as ChoiceQuestionData | undefined;

  const startSession = () => {
    setSelectedAnswer("");
    setIsCorrect(null);
    setHearts(3);
    setScreen("exercise");
  };

  const checkAnswer = () => {
    if (!choiceQuestion || !choiceData || !selectedAnswer) return;
    const correct = selectedAnswer === choiceData.answer;
    setIsCorrect(correct);
    if (!correct) {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        setScreen("gameover");
        return;
      }
    }
    setScreen("feedback");
  };

  const retrySession = () => startSession();

  const continueAfterFeedback = () => {
    if (isCorrect && choiceQuestion) {
      recordLessonSession(sessionEmail, {
        lessonId: lesson.id,
        answered: selectedAnswer,
        score: 100,
        xpEarned: choiceQuestion.xp,
        bonusXp: lesson.rewardXp,
        totalExercises: 1,
        correctExercises: 1,
        heartsRemaining: hearts,
        completedAt: new Date().toISOString(),
      });
      router.push(`/dashboard/evaluasi?lesson=${lesson.id}`);
      return;
    }
    setSelectedAnswer("");
    setIsCorrect(null);
    setScreen("exercise");
  };

  return (
    <main className="min-h-screen bg-background text-on-surface px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-surface">
            <ArrowLeft className="h-5 w-5" />
            Keluar sesi
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-error-container px-3 py-1.5 text-sm font-black text-on-error-container">
            <Heart className="h-4 w-4 fill-current" />
            {hearts}/3
          </div>
        </header>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-high">
            <div className={`h-full rounded-full bg-primary transition-all ${screen === "intro" ? "w-0" : "w-1/5"}`} />
          </div>
          <span className="text-xs font-black text-on-surface-variant">1 dari 5</span>
        </div>

        {screen === "intro" && (
          <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/30 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-primary">Bab {lesson.id} • {lesson.region}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-lg font-bold text-on-surface-variant">{lesson.subtitle}</p>
            <div className="mt-8 rounded-2xl bg-primary-fixed/30 p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Tahukah kamu?</p>
              <p className="mt-2 text-lg font-semibold leading-relaxed text-on-surface">{lesson.intro}</p>
            </div>
            <p className="mt-5 text-sm text-on-surface-variant">Sesi ini berisi 5 exercise. Jawaban salah mengurangi satu heart.</p>
            <button type="button" onClick={startSession} className="mt-8 w-full rounded-full bg-primary px-6 py-4 text-base font-black text-on-primary shadow-[0_4px_0_0_#881f00] transition hover:bg-primary-container">
              Mulai sesi
            </button>
          </section>
        )}

        {(screen === "exercise" || screen === "feedback") && choiceQuestion && choiceData && (
          <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/30 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{lesson.title}</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{choiceQuestion.prompt}</h1>
            <div className="mt-8 space-y-3">
              {choiceData.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={screen === "feedback"}
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${selectedAnswer === option.id ? "border-primary bg-primary-fixed/30 ring-2 ring-primary" : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container"}`}
                >
                  <span className="font-bold">{option.label}</span>
                  {screen === "feedback" && option.id === choiceData.answer && <CheckCircle2 className="h-5 w-5 text-secondary" />}
                  {screen === "feedback" && option.id === selectedAnswer && option.id !== choiceData.answer && <XCircle className="h-5 w-5 text-error" />}
                </button>
              ))}
            </div>

            {screen === "feedback" && (
              <div className={`mt-6 rounded-2xl p-4 ${isCorrect ? "bg-secondary-fixed/40 text-on-secondary-fixed" : "bg-error-container/60 text-on-error-container"}`}>
                <div className="flex items-center gap-2 font-black">
                  {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  {isCorrect ? "Pilihan tepat" : "Belum tepat"}
                </div>
                <p className="mt-2 text-sm font-semibold">{choiceQuestion.why}</p>
              </div>
            )}

            <button
              type="button"
              disabled={!selectedAnswer}
              onClick={screen === "exercise" ? checkAnswer : continueAfterFeedback}
              className="mt-8 w-full rounded-full bg-primary px-6 py-4 text-base font-black text-on-primary shadow-[0_4px_0_0_#881f00] transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
            >
              {screen === "exercise" ? "Periksa" : "Lanjut"}
            </button>
          </section>
        )}

        {screen === "gameover" && (
          <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 text-center shadow-xl ring-1 ring-outline-variant/30 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-error">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black">Hearts habis</h1>
            <p className="mt-2 text-on-surface-variant">Ulangi sesi ini dan perhatikan konteks sebelum memilih tindakan.</p>
            <button type="button" onClick={retrySession} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-on-primary shadow-[0_4px_0_0_#881f00]">
              <RotateCcw className="h-5 w-5" />
              Coba lagi
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
