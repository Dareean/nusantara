"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  Heart,
  Lock,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import SourceCard from "../../../components/SourceCard";
import { getSession } from "../../../auth/authClient";
import { loadProgress, readProgress, recordLessonSession, saveProgress } from "../../progress";
import { isLessonUnlocked } from "@/lib/curriculum";
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
import { getStoredSessions, syncSessionsFromServer } from "../../../components/game-engine/sessionStore";
import { gameSessionToLesson } from "../../../components/game-engine/lessonAdapter";

type SessionScreen = "loading" | "intro" | "exercise" | "feedback" | "gameover" | "summary";

function isAnswerCorrect(question: Question, answer: string, scenarioScore: number) {
  if (question.type === "choice") return answer === (question.data as ChoiceQuestionData).answer;
  if (question.type === "truefalse") return answer === String((question.data as TrueFalseQuestionData).answer);
  if (question.type === "hotspot") return answer === (question.data as HotspotQuestionData).answer;
  if (question.type === "order") return answer === (question.data as OrderQuestionData).answer.join("|");
  if (question.type === "match") {
    const data = question.data as MatchQuestionData;
    const expected = data.pairs.map((p) => `${p.left}:${p.right}`).sort().join("|");
    const actual = answer.split("|").sort().join("|");
    return actual === expected;
  }
  return scenarioScore >= (question.data as ScenarioQuestionData).passingScore;
}

function shuffleArray<T>(items: readonly T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);
  const [sessionAttempt, setSessionAttempt] = useState(0);

  // MATCH state
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Array<{ left: string; right: string }>>([]);

  // ORDER state
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  useEffect(() => {
    const lessonIdStr = String(params.lessonId);
    const lessonIdNum = Number(params.lessonId);

    const loadSessionLesson = (): Lesson | null => {
      const stored = getStoredSessions();
      const foundSession = stored.find(
        (s) =>
          s.id === lessonIdStr ||
          s.id === `lesson-${lessonIdStr}` ||
          (lessonIdNum > 0 && Number(s.id) === lessonIdNum)
      );
      if (foundSession) {
        return gameSessionToLesson(foundSession);
      }
      if (!isNaN(lessonIdNum) && lessonIdNum > 0) {
        return getLessonById(lessonIdNum);
      }
      return null;
    };

    const initialLesson = loadSessionLesson();
    if (!initialLesson) {
      router.replace("/dashboard");
      return;
    }

    getSession().then(async (session) => {
      if (!session) {
        router.replace(`/auth?redirect=/dashboard/latihan/${lessonIdStr}`);
        return;
      }
      const currentProgress = await loadProgress(session.email);
      const unlocked = isLessonUnlocked(
        initialLesson.id,
        currentProgress.completedLessons,
        currentProgress.unlockedLessons
      );
      if (!unlocked) {
        router.replace("/dashboard");
        return;
      }
      setSessionEmail(session.email);
      setHearts(currentProgress.hearts > 0 ? currentProgress.hearts : 3);
      setLesson(initialLesson);
      setQuestionOrder(initialLesson.questions.map((q) => q.id));
      setQuestionIndex(0);
      setScreen("exercise");

      // Background sync from server (if published updates exist)
      syncSessionsFromServer().then((updatedList) => {
        const serverSession = updatedList.find(
          (s) =>
            s.id === lessonIdStr ||
            s.id === `lesson-${lessonIdStr}` ||
            (lessonIdNum > 0 && Number(s.id) === lessonIdNum)
        );
        if (serverSession) {
          setLesson(gameSessionToLesson(serverSession));
        }
      }).catch(() => {});
    });
  }, [params.lessonId, router]);

  const [missedHistory, setMissedHistory] = useState<
    Array<{ id: string; prompt: string; correctAnswerText: string; explanation: string }>
  >([]);


  const questionMap = useMemo(
    () => new Map(lesson?.questions.map((question) => [question.id, question]) ?? []),
    [lesson]
  );
  const currentQuestion = questionMap.get(questionOrder[questionIndex]);
  const totalExercises = lesson?.questions.length ?? 0;

  const shuffledChoiceOptions = useMemo(() => {
    if (!currentQuestion || currentQuestion.type !== "choice") return [];
    const options = (currentQuestion.data as ChoiceQuestionData).options;
    return shuffleArray(options);
  }, [currentQuestion?.id, questionIndex, sessionAttempt]);

  const shuffledMatchRight = useMemo(() => {
    if (!currentQuestion || currentQuestion.type !== "match") return [];
    const data = currentQuestion.data as MatchQuestionData;
    return shuffleArray(data.pairs.map((p) => p.right));
  }, [currentQuestion?.id, sessionAttempt]);

  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.type === "match") {
      setMatchSelectedLeft(null);
      setMatchSelectedRight(null);
      setMatchedPairs([]);
      setSelectedAnswer("");
    } else if (currentQuestion.type === "order") {
      const data = currentQuestion.data as OrderQuestionData;
      const initial = [...data.items].reverse();
      setOrderedItems(initial);
      setSelectedAnswer(initial.join("|"));
    }
  }, [currentQuestion?.id, questionIndex, sessionAttempt]);

  const resetSession = () => {
    if (!lesson) return;
    setSessionAttempt((prev) => prev + 1);
    setQuestionOrder(lesson.questions.map((question) => question.id));
    setQuestionIndex(0);
    setWrongQuestionIds([]);
    setIsRetryRound(false);
    if (sessionEmail) {
      const prog = readProgress(sessionEmail);
      setHearts(prog.hearts > 0 ? prog.hearts : 3);
    } else {
      setHearts(3);
    }
    setSelectedAnswer("");
    setIsCorrect(null);
    setCorrectQuestionIds([]);
    setCorrectCount(0);
    setFirstAttemptCorrectCount(0);
    setEarnedXp(0);
    setScenarioStep(0);
    setScenarioScore(0);
    setMatchSelectedLeft(null);
    setMatchSelectedRight(null);
    setMatchedPairs([]);
    setMissedHistory([]);
    setScreen("exercise");
  };

  const getReadableCorrectAnswer = (q: Question | undefined): string => {
    if (!q) return "";
    if (q.type === "choice") {
      const data = q.data as ChoiceQuestionData;
      const opt = data.options.find((o) => o.id === data.answer);
      return opt ? opt.label : data.answer;
    }
    if (q.type === "truefalse") {
      const data = q.data as TrueFalseQuestionData;
      const isBenarSalah =
        q.prompt.toLowerCase().includes("benar") ||
        q.prompt.toLowerCase().includes("salah") ||
        data.statement.toLowerCase().includes("adalah");
      if (isBenarSalah) {
        return data.answer ? "Benar" : "Salah";
      }
      return data.answer ? "Fakta" : "Mitos";
    }
    if (q.type === "match") {
      const data = q.data as MatchQuestionData;
      return data.pairs.map((p) => `${p.left} = ${p.right}`).join(", ");
    }
    if (q.type === "order") {
      const data = q.data as OrderQuestionData;
      return data.answer.join(" → ");
    }
    if (q.type === "hotspot") {
      const data = q.data as HotspotQuestionData;
      const spot = data.hotspots.find((h) => h.id === data.answer);
      return spot ? spot.label : data.answer;
    }
    if (q.type === "scenario") {
      const data = q.data as ScenarioQuestionData;
      const step = data.steps[scenarioStep];
      if (!step) return "Sikap santun dan hormat";
      const best = [...step.choices].sort((a, b) => b.score - a.score)[0];
      return best ? best.label : "Sikap santun dan hormat";
    }
    return "";
  };

  const finishSession = () => {
    if (!lesson || !sessionEmail) return;
    const lessonXp = lesson.rewardXp;
    recordLessonSession(sessionEmail, {
      lessonId: lesson.id,
      answered: "lesson-session",
      score: Math.round((firstAttemptCorrectCount / Math.max(1, totalExercises)) * 100),
      xpEarned: lessonXp,
      bonusXp: 0,
      totalExercises,
      correctExercises: correctCount,
      firstAttemptCorrect: firstAttemptCorrectCount,
      heartsRemaining: hearts,
      completedAt: new Date().toISOString(),
    });
    setScreen("summary");
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
      const exerciseComplete =
        currentQuestion.type !== "scenario" ||
        scenarioStep === (currentQuestion.data as ScenarioQuestionData).steps.length - 1;
      if (exerciseComplete && !correctQuestionIds.includes(currentQuestion.id)) {
        setCorrectQuestionIds((ids) => [...ids, currentQuestion.id]);
        setCorrectCount((count) => count + 1);
        if (!isRetryRound) {
          setFirstAttemptCorrectCount((count) => count + 1);
        }
        setEarnedXp((xp) => xp + currentQuestion.xp);
      }
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (sessionEmail) {
        const prog = readProgress(sessionEmail);
        saveProgress(sessionEmail, { ...prog, hearts: nextHearts });
      }
      if (!isRetryRound && !wrongQuestionIds.includes(currentQuestion.id)) {
        setWrongQuestionIds((ids) => [...ids, currentQuestion.id]);
      }
      const readableAns = getReadableCorrectAnswer(currentQuestion);
      setMissedHistory((prev) => {
        if (prev.some((item) => item.id === currentQuestion.id)) return prev;
        return [
          ...prev,
          {
            id: currentQuestion.id,
            prompt: currentQuestion.prompt,
            correctAnswerText: readableAns,
            explanation: currentQuestion.penjelasan || currentQuestion.why,
          },
        ];
      });
      if (nextHearts <= 0) {
        setScreen("gameover");
        return;
      }
    }
    setScreen("feedback");
  };

  const continueAfterFeedback = () => {
    if (
      currentQuestion?.type === "scenario" &&
      scenarioStep < (currentQuestion.data as ScenarioQuestionData).steps.length - 1
    ) {
      setScenarioStep((step) => step + 1);
      setSelectedAnswer("");
      setIsCorrect(null);
      setScreen("exercise");
      return;
    }
    moveToNextQuestion();
  };

  const getCorrectAnswerForChoice = (q: Question | undefined): string | null => {
    if (!q) return null;
    if (q.type === "choice") return (q.data as ChoiceQuestionData).answer;
    if (q.type === "truefalse") return String((q.data as TrueFalseQuestionData).answer);
    if (q.type === "scenario") {
      const data = q.data as ScenarioQuestionData;
      const step = data.steps[scenarioStep];
      if (!step) return null;
      const best = [...step.choices].sort((a, b) => b.score - a.score)[0];
      return best ? best.id : null;
    }
    return null;
  };

  const renderChoices = (options: { id: string; label: string }[]) => {
    const correctAnswerId = getCorrectAnswerForChoice(currentQuestion);

    return (
      <div className="mt-8 space-y-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isThisCorrect = option.id === correctAnswerId;
          const showAsCorrect = screen === "feedback" && isThisCorrect;
          const showAsWrong = screen === "feedback" && isSelected && !isCorrect;

          let btnClass = "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container";
          if (screen === "feedback") {
            if (showAsCorrect) {
              btnClass = "border-secondary bg-secondary-fixed/30 ring-2 ring-secondary text-on-surface";
            } else if (showAsWrong) {
              btnClass = "border-error bg-error-container/40 ring-2 ring-error text-on-error-container";
            }
          } else if (isSelected) {
            btnClass = "border-primary bg-primary-fixed/30 ring-2 ring-primary";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={screen === "feedback"}
              onClick={() => setSelectedAnswer(option.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${btnClass}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">{option.label}</span>
                {screen === "feedback" && showAsCorrect && !isCorrect && (
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-black text-on-secondary">
                    Jawaban benar
                  </span>
                )}
              </div>
              {screen === "feedback" && (
                showAsCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                ) : showAsWrong ? (
                  <XCircle className="h-5 w-5 text-error shrink-0" />
                ) : null
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // MATCH EXERCISE
  const handleMatchLeftClick = (left: string) => {
    if (screen === "feedback") return;
    if (matchedPairs.some((p) => p.left === left)) return;

    if (matchSelectedRight) {
      // Complete pair attempt
      const data = currentQuestion?.data as MatchQuestionData;
      const valid = data.pairs.some((p) => p.left === left && p.right === matchSelectedRight);
      if (valid) {
        const next = [...matchedPairs, { left, right: matchSelectedRight }];
        setMatchedPairs(next);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
        if (next.length === data.pairs.length) {
          setSelectedAnswer(next.map((p) => `${p.left}:${p.right}`).sort().join("|"));
        }
      } else {
        setMatchSelectedLeft(left);
        setMatchSelectedRight(null);
      }
    } else {
      setMatchSelectedLeft(matchSelectedLeft === left ? null : left);
    }
  };

  const handleMatchRightClick = (right: string) => {
    if (screen === "feedback") return;
    if (matchedPairs.some((p) => p.right === right)) return;

    if (matchSelectedLeft) {
      // Complete pair attempt
      const data = currentQuestion?.data as MatchQuestionData;
      const valid = data.pairs.some((p) => p.left === matchSelectedLeft && p.right === right);
      if (valid) {
        const next = [...matchedPairs, { left: matchSelectedLeft, right }];
        setMatchedPairs(next);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
        if (next.length === data.pairs.length) {
          setSelectedAnswer(next.map((p) => `${p.left}:${p.right}`).sort().join("|"));
        }
      } else {
        setMatchSelectedRight(right);
        setMatchSelectedLeft(null);
      }
    } else {
      setMatchSelectedRight(matchSelectedRight === right ? null : right);
    }
  };

  const renderMatchExercise = (data: MatchQuestionData) => {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-xs text-on-surface-variant font-medium">
          Ketuk satu ungkapan di kolom kiri, lalu ketuk arti/konteksnya di kolom kanan untuk menjodohkan.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Kolom Kiri */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-primary">Ungkapan</span>
            {data.pairs.map((p) => {
              const isMatched = matchedPairs.some((m) => m.left === p.left);
              const isSelected = matchSelectedLeft === p.left;

              let style = "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface";
              if (isMatched) {
                style = "border-secondary bg-secondary-fixed/40 text-on-surface ring-1 ring-secondary";
              } else if (isSelected) {
                style = "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary font-black";
              }

              return (
                <button
                  key={p.left}
                  type="button"
                  disabled={screen === "feedback" || isMatched}
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
            <span className="text-xs font-black uppercase tracking-wider text-secondary">Konteks / Arti</span>
            {shuffledMatchRight.map((rightText) => {
              const isMatched = matchedPairs.some((m) => m.right === rightText);
              const isSelected = matchSelectedRight === rightText;

              let style = "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface";
              if (isMatched) {
                style = "border-secondary bg-secondary-fixed/40 text-on-surface ring-1 ring-secondary";
              } else if (isSelected) {
                style = "border-primary bg-primary-fixed/30 ring-2 ring-primary text-primary font-black";
              }

              return (
                <button
                  key={rightText}
                  type="button"
                  disabled={screen === "feedback" || isMatched}
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

        {matchedPairs.length === data.pairs.length && screen !== "feedback" && (
          <div className="p-3 bg-secondary-fixed/30 border border-secondary/30 rounded-xl flex items-center gap-2 text-xs font-bold text-secondary">
            <CheckCircle2 className="h-4 w-4" />
            <span>Semua pasangan telah terhubung! Tekan tombol Periksa di bawah.</span>
          </div>
        )}
      </div>
    );
  };

  // ORDER EXERCISE
  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    if (screen === "feedback") return;
    const next = [...orderedItems];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedItems(next);
    setSelectedAnswer(next.join("|"));
  };

  const renderOrderExercise = (data: OrderQuestionData) => {
    return (
      <div className="mt-8 space-y-3">
        <p className="text-xs text-on-surface-variant font-medium">
          Susun urutan yang tepat dengan menekan tombol naik (↑) atau turun (↓).
        </p>

        <div className="space-y-2.5">
          {orderedItems.map((item, index) => {
            const isTargetCorrect = screen === "feedback" && data.answer[index] === item;
            let borderStyle = "border-outline-variant/30 bg-surface-container-low";
            if (screen === "feedback") {
              borderStyle = isTargetCorrect
                ? "border-secondary bg-secondary-fixed/30 ring-1 ring-secondary"
                : "border-error bg-error-container/30 ring-1 ring-error";
            }

            return (
              <div
                key={item}
                className={`flex items-center justify-between rounded-2xl border p-4 transition ${borderStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-fixed text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <span className="font-bold text-on-surface text-sm">{item}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={screen === "feedback" || index === 0}
                    onClick={() => moveOrderItem(index, index - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    aria-label="Geser ke atas"
                  >
                    <ArrowUp className="h-4 w-4 text-on-surface" />
                  </button>
                  <button
                    type="button"
                    disabled={screen === "feedback" || index === orderedItems.length - 1}
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

        {screen === "feedback" && !isCorrect && (
          <div className="mt-3 p-3 bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface">
            <span className="font-black text-secondary">Urutan yang tepat: </span>
            {data.answer.map((ans, i) => `${i + 1}. ${ans}`).join(" → ")}
          </div>
        )}
      </div>
    );
  };

  const renderHotspotExercise = (data: HotspotQuestionData) => {
    const selectedSpot = data.hotspots.find((s) => s.id === selectedAnswer);

    return (
      <div className="mt-6 flex flex-col gap-4">
        {/* Hotspot Image Container with Interactive Pins */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-surface-container-high via-surface-container-low to-surface-container-high flex items-center justify-center border-2 border-outline-variant/30 shadow-inner group">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A83B10_1px,transparent_1px)] [background-size:16px_16px]" />
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.imageCaption || currentQuestion?.prompt}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div className="text-on-surface-variant font-bold text-sm flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span>Diagram Artefak Adat</span>
            </div>
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
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isSelected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
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
    if (currentQuestion.type === "choice") return renderChoices(shuffledChoiceOptions);
    if (currentQuestion.type === "truefalse") {
      const tfData = currentQuestion.data as TrueFalseQuestionData;
      const isBenarSalah =
        currentQuestion.prompt.toLowerCase().includes("benar") ||
        currentQuestion.prompt.toLowerCase().includes("salah") ||
        tfData.statement.toLowerCase().includes("adalah");
      return renderChoices([
        { id: "true", label: isBenarSalah ? "Benar" : "Fakta" },
        { id: "false", label: isBenarSalah ? "Salah" : "Mitos" },
      ]);
    }
    if (currentQuestion.type === "hotspot") return renderHotspotExercise(currentQuestion.data as HotspotQuestionData);
    if (currentQuestion.type === "match") return renderMatchExercise(currentQuestion.data as MatchQuestionData);
    if (currentQuestion.type === "order") return renderOrderExercise(currentQuestion.data as OrderQuestionData);
    const data = currentQuestion.data as ScenarioQuestionData;
    return renderChoices(data.steps[scenarioStep].choices);
  };

  if (screen === "loading" || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant font-bold">
        Memuat misi...
      </div>
    );
  }

  // Retry calculations
  const retryTotal = isRetryRound ? Math.max(1, questionOrder.length - totalExercises) : 0;
  const retryCurrent = isRetryRound ? Math.min(questionIndex - totalExercises + 1, retryTotal) : 0;

  const counterText =
    isRetryRound
      ? `Pengulangan • Soal ${retryCurrent} dari ${retryTotal} yang diulang`
      : `Soal ${Math.min(questionIndex + 1, totalExercises)} dari ${totalExercises}`;

  // Progress Bar calculation taking scenario sub-steps into account
  let progressPercent = 0;
  if (totalExercises > 0) {
    if (isRetryRound) {
      const stepBonus = screen === "feedback" && isCorrect ? 1 : 0;
      progressPercent = Math.min(100, Math.max(0, ((retryCurrent - 1 + stepBonus) / retryTotal) * 100));
    } else {
      let currentUnit = questionIndex;
      if (currentQuestion?.type === "scenario") {
        const scenarioSteps = (currentQuestion.data as ScenarioQuestionData).steps.length;
        currentUnit += scenarioStep / scenarioSteps;
        if (screen === "feedback" && isCorrect && scenarioStep === scenarioSteps - 1) {
          currentUnit += 1 / scenarioSteps;
        }
      } else if (screen === "feedback" && isCorrect) {
        currentUnit += 1;
      }
      progressPercent = Math.min(100, Math.max(0, (currentUnit / totalExercises) * 100));
    }
  }

  return (
    <main className="min-h-screen bg-background text-on-surface pb-28 sm:pb-32">
      {screen !== "summary" && (
        <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-md border-b border-outline-variant/15 px-4 py-3 sm:px-6 [@media(orientation:landscape)_and_(max-height:450px)]:pl-14 transition-all">
          <div className="mx-auto max-w-3xl">
            <header className="flex items-center justify-between gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Keluar</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed/50 px-3 py-1.5 text-xs font-black text-on-secondary-fixed">
                  <Zap className="h-4 w-4 text-secondary fill-current" />
                  <span>+{earnedXp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-error-container px-3 py-1.5 text-xs font-black text-on-error-container">
                  <Heart className="h-4 w-4 fill-current text-error" />
                  <span>{hearts}/3</span>
                </div>
              </div>
            </header>

            {/* Progress Bar & Question Counter */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-on-surface-variant whitespace-nowrap">
                {counterText}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 pt-8 sm:pt-10 sm:px-6 [@media(orientation:landscape)_and_(max-height:450px)]:pl-14">
        {(screen === "exercise" || screen === "feedback") && currentQuestion && (
          <section className="my-4 sm:my-8 scroll-mt-28 rounded-3xl bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/30 sm:p-10">
            {/* Objective Banner */}
            <div className="mb-4 rounded-2xl bg-primary-fixed/20 p-3 sm:p-3.5 border border-primary/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-black text-primary uppercase tracking-wider block">Tujuan Pelajaran</span>
                <p className="text-on-surface font-semibold mt-0.5">
                  {lesson.objective || `Setelah pelajaran ini, kamu bisa memahami ${lesson.title.toLowerCase()}.`}
                </p>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
              Soal {Math.min(questionIndex + 1, totalExercises)} dari {totalExercises}
            </p>
            {currentQuestion.audioUrl && (
              <div className="mt-3 flex items-center gap-2">
                <audio id={`audio-${currentQuestion.id}`} src={currentQuestion.audioUrl} preload="auto" />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`audio-${currentQuestion.id}`) as HTMLAudioElement | null;
                    if (el) {
                      el.currentTime = 0;
                      el.play().catch((e) => console.warn("Gagal memutar audio:", e));
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-primary/20"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Dengarkan Audio</span>
                </button>
              </div>
            )}
            <h1 className="mt-3 text-2xl font-black tracking-tight leading-snug sm:text-3xl">{currentQuestion.prompt}</h1>
            {renderExercise()}

            {screen === "feedback" && (
              <div
                className={`mt-6 rounded-2xl p-4 sm:p-5 border-2 ${
                  isCorrect
                    ? "bg-[#d7f7c2]/80 border-[#58a700]/50 text-[#1b5e20]"
                    : "bg-[#ffdfe0]/80 border-[#ea2b2b]/50 text-[#b71c1c]"
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-[#58a700] shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-[#ea2b2b] shrink-0" />
                  )}
                  <span>
                    {isCorrect
                      ? `Benar! Kamu mendapat ${currentQuestion.xp} XP.`
                      : "Kurang tepat."}
                  </span>
                </div>

                {!isCorrect && (
                  <div className="mt-2 text-sm font-black text-on-surface">
                    Jawaban yang benar:{" "}
                    <span className="text-[#881f00] font-extrabold underline decoration-primary/40">
                      {getReadableCorrectAnswer(currentQuestion)}
                    </span>
                  </div>
                )}

                <p className="mt-2 text-xs sm:text-sm font-semibold leading-relaxed">
                  {currentQuestion.penjelasan || currentQuestion.why}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={!selectedAnswer}
              onClick={screen === "exercise" ? checkAnswer : continueAfterFeedback}
              className="mt-8 w-full rounded-full bg-primary px-6 py-4 text-base font-black text-on-primary shadow-[0_4px_0_0_#881f00] transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {screen === "exercise" ? "Periksa" : "Berikutnya"}
            </button>
          </section>
        )}

        {screen === "summary" && (
          <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/30 sm:p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-primary shadow-sm mb-4">
              <Trophy className="h-8 w-8" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              Ringkasan Pelajaran Selesai
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              {lesson.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-on-surface-variant font-medium">
              {lesson.region} • Sesi pembelajaran berhasil diselesaikan
            </p>

            {/* Metrik: XP, Akurasi, Nyawa */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-left">
              <div className="rounded-2xl bg-surface-container p-3 sm:p-4 ring-1 ring-outline-variant/20">
                <span className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">XP Didapat</span>
                <div className="mt-1 flex items-center gap-1.5 text-lg sm:text-xl font-black text-primary">
                  <Zap className="w-4 h-4 text-secondary fill-current" />
                  <span>+{lesson.rewardXp} XP</span>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-container p-3 sm:p-4 ring-1 ring-outline-variant/20">
                <span className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">Akurasi</span>
                <div className="mt-1 text-lg sm:text-xl font-black text-secondary">
                  {Math.round((firstAttemptCorrectCount / Math.max(1, totalExercises)) * 100)}%
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {firstAttemptCorrectCount}/{totalExercises} soal tepat
                </span>
              </div>
              <div className="rounded-2xl bg-surface-container p-3 sm:p-4 ring-1 ring-outline-variant/20">
                <span className="text-[10px] uppercase font-black tracking-wider text-on-surface-variant">Sisa Nyawa</span>
                <div className="mt-1 flex items-center gap-1 text-lg sm:text-xl font-black text-error">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{hearts}/3</span>
                </div>
              </div>
            </div>

            {/* Konsep yang Dipelajari */}
            <div className="mt-6 rounded-2xl bg-surface-container-low p-4 sm:p-5 text-left border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-2.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-on-surface">
                  Konsep yang Dipelajari
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-on-surface-variant">
                {(lesson.concepts && lesson.concepts.length > 0
                  ? lesson.concepts
                  : [
                      lesson.objective || lesson.intro,
                      "Penerapan sapaan dan adab santun dalam konteks adat",
                      "Praktik membaca situasi sebelum bertindak",
                    ]
                ).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="font-medium text-on-surface">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evaluasi Soal yang Pernah Salah */}
            <div className="mt-4 rounded-2xl bg-surface-container-low p-4 sm:p-5 text-left border border-outline-variant/20">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-on-surface mb-2.5">
                Tinjauan Soal
              </h3>
              {missedHistory.length === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary-fixed/30 text-on-secondary-fixed text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  <span>Sempurna! Semua soal kamu jawab dengan tepat pada percobaan pertama.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-on-surface-variant font-medium">
                    Soal yang sempat keliru dan jawaban benarnya:
                  </p>
                  {missedHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs space-y-1"
                    >
                      <p className="font-bold text-on-surface">{item.prompt}</p>
                      <p className="text-secondary font-extrabold">
                        Jawaban yang benar: <span className="underline">{item.correctAnswerText}</span>
                      </p>
                      <p className="text-[11px] text-on-surface-variant font-medium">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SATU TOMBOL DOMINAN: Lanjutkan */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-6 w-full py-3.5 sm:py-4 rounded-full bg-primary text-on-primary font-black text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {screen === "gameover" && (
          <section className="my-auto rounded-3xl bg-surface-container-lowest p-6 text-center shadow-xl ring-1 ring-outline-variant/30 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-error">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black">Nyawa Habis</h1>
            <p className="mt-2 text-on-surface-variant">
              Ulangi sesi ini dan perhatikan konteks sebelum memilih tindakan.
            </p>
            <button
              type="button"
              onClick={resetSession}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-on-primary shadow-[0_4px_0_0_#881f00] cursor-pointer"
            >
              <RotateCcw className="h-5 w-5" />
              Coba Lagi
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
