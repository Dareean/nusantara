"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CulturalGameEngine from "../../../components/game-engine/CulturalGameEngine";
import { getStoredSessions, syncSessionsFromServer } from "../../../components/game-engine/sessionStore";
import { sampleKailiLesson } from "../../../components/game-engine/mockData";
import { GameSession } from "../../../components/game-engine/types";
import { getSession } from "../../../auth/authClient";
import { readProgress, recordLessonSession, saveProgress } from "../../progress";

function DynamicLessonInner({ lessonId }: { lessonId: string }) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1" || searchParams.get("preview") === "true";
  const startParam = searchParams.get("start");
  const initialIndex = startParam !== null ? Math.max(0, parseInt(startParam, 10)) : 0;

  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    getSession().then((sess) => {
      if (sess) setSessionEmail(sess.email);
    });
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const resolveSession = async () => {
      setIsLoading(true);
      const localSessions = getStoredSessions();
      let found = localSessions.find((s) => s.id === lessonId);

      // Sesi draft tidak boleh diakses murid biasa (kecuali mode pratinjau admin)
      if (found && !isPreview && found.status === "draft") {
        found = undefined;
      }

      if (found) {
        if (!isCancelled) {
          setSession(found);
          setIsLoading(false);
        }
        return;
      }

      // Bila tidak ada di cache lokal, sinkronisasi ke server
      try {
        const updated = await syncSessionsFromServer();
        const serverFound = updated.find((s) => s.id === lessonId);
        if (serverFound && (isPreview || serverFound.status !== "draft")) {
          if (!isCancelled) {
            setSession(serverFound);
            setIsLoading(false);
          }
          return;
        }
      } catch {
        // ignore network error
      }

      if (!isCancelled) {
        setSession(null);
        setIsLoading(false);
      }
    };

    resolveSession();
    return () => {
      isCancelled = true;
    };
  }, [lessonId, isPreview]);

  const handleComplete = (result: { xp: number; accuracy: number }) => {
    // Mode pratinjau: simulasi permainan read-only, tidak mengubah database/progres
    if (isPreview || !sessionEmail || !session) return;

    // Check if session ID maps to a numeric lesson from lessons.ts
    const numericLessonId = parseInt(session.id.replace("lesson-", ""), 10);
    const totalExercises = session.questions.length || 1;
    const correctExercises = Math.round((result.accuracy / 100) * totalExercises);

    if (!isNaN(numericLessonId) && numericLessonId > 0) {
      recordLessonSession(sessionEmail, {
        lessonId: numericLessonId,
        answered: "engine-session",
        score: result.accuracy,
        xpEarned: Math.round((result.accuracy / 100) * result.xp),
        bonusXp: result.accuracy >= 70 ? 20 : 0,
        totalExercises,
        correctExercises,
        heartsRemaining: 3,
        completedAt: new Date().toISOString(),
      });
    } else {
      // Custom builder session: update XP safely in progress with dated dailyXpLog
      const cur = readProgress(sessionEmail);
      const earnedXp = Math.round((result.accuracy / 100) * (result.xp || session.xpReward || 30)) || result.xp || session.xpReward || 30;
      const today = new Date().toISOString().slice(0, 10);
      const curDailyXp = cur.dailyXpLog?.[today] || 0;
      saveProgress(sessionEmail, {
        ...cur,
        xp: cur.xp + earnedXp,
        lastStudyDate: today,
        dailyXpLog: {
          ...(cur.dailyXpLog || {}),
          [today]: curDailyXp + earnedXp,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-8 text-on-surface-variant font-bold">
        Memuat sesi permainan...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-3xl font-black">
            !
          </div>
          <h2 className="text-xl font-black text-on-surface">Pelajaran Tidak Ditemukan</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Sesi belajar ini tidak tersedia, berstatus draf, atau telah dihapus oleh pengajar/kurator.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-black text-sm hover:brightness-105 active:scale-95 transition"
          >
            Kembali ke Beranda Belajar
          </a>
        </div>
      </div>
    );
  }

  return (
    <CulturalGameEngine
      session={session}
      onComplete={handleComplete}
      onExitHref={isPreview ? "/admin" : "/dashboard"}
      isPreview={isPreview}
      initialQuestionIndex={initialIndex}
    />
  );
}

export default function DynamicLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center p-8 text-on-surface-variant font-bold">Memuat sesi permainan...</div>}>
      <DynamicLessonInner lessonId={resolvedParams.lessonId} />
    </Suspense>
  );
}
