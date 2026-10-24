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

  const [session, setSession] = useState<GameSession>(sampleKailiLesson);
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    getSession().then((sess) => {
      if (sess) setSessionEmail(sess.email);
    });
  }, []);

  useEffect(() => {
    const sessions = getStoredSessions();
    const found = sessions.find((s) => s.id === lessonId);
    if (found) {
      setSession(found);
    } else {
      syncSessionsFromServer().then((updated) => {
        const serverFound = updated.find((s) => s.id === lessonId);
        if (serverFound) {
          setSession(serverFound);
        }
      }).catch(() => {});
    }
  }, [lessonId]);

  const handleComplete = (result: { xp: number; accuracy: number }) => {
    // Mode pratinjau: simulasi permainan read-only, tidak mengubah database/progres
    if (isPreview || !sessionEmail) return;

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
      // Custom builder session: update XP safely in progress
      const cur = readProgress(sessionEmail);
      const earnedXp = Math.round((result.accuracy / 100) * (result.xp || session.xpReward || 30)) || result.xp || session.xpReward || 30;
      saveProgress(sessionEmail, {
        ...cur,
        xp: cur.xp + earnedXp,
        lastStudyDate: new Date().toISOString().slice(0, 10),
      });
    }
  };

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
