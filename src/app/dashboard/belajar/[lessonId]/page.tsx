"use client";

import { use, useEffect, useState } from "react";
import CulturalGameEngine from "../../../components/game-engine/CulturalGameEngine";
import { getStoredSessions, syncSessionsFromServer } from "../../../components/game-engine/sessionStore";
import { sampleKailiLesson } from "../../../components/game-engine/mockData";
import { GameSession } from "../../../components/game-engine/types";
import { getSession } from "../../../auth/authClient";
import { readProgress, recordLessonSession, saveProgress } from "../../progress";

export default function DynamicLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const [session, setSession] = useState<GameSession>(sampleKailiLesson);
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    getSession().then((sess) => {
      if (sess) setSessionEmail(sess.email);
    });
  }, []);

  useEffect(() => {
    const sessions = getStoredSessions();
    const found = sessions.find((s) => s.id === resolvedParams.lessonId);
    if (found) {
      setSession(found);
    } else {
      syncSessionsFromServer().then((updated) => {
        const serverFound = updated.find((s) => s.id === resolvedParams.lessonId);
        if (serverFound) {
          setSession(serverFound);
        }
      }).catch(() => {});
    }
  }, [resolvedParams.lessonId]);

  const handleComplete = (result: { xp: number; accuracy: number }) => {
    if (!sessionEmail) return;

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
      onExitHref="/dashboard"
    />
  );
}
