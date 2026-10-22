"use client";

import { useEffect, useState } from "react";
import CulturalGameEngine from "../../components/game-engine/CulturalGameEngine";
import { lessonToGameSession } from "../../components/game-engine/lessonAdapter";
import { lessons } from "../../../lib/lessons";
import { getSession } from "../../auth/authClient";
import { recordLessonSession } from "../progress";

export default function LatihanPage() {
  const [sessionEmail, setSessionEmail] = useState("");
  const session = lessonToGameSession(lessons[0]);

  useEffect(() => {
    getSession().then((sess) => {
      if (sess) setSessionEmail(sess.email);
    });
  }, []);

  const handleComplete = (result: { xp: number; accuracy: number }) => {
    if (!sessionEmail) return;
    const totalExercises = session.questions.length || 1;
    const correctExercises = Math.round((result.accuracy / 100) * totalExercises);
    recordLessonSession(sessionEmail, {
      lessonId: 1,
      answered: "engine-latihan",
      score: result.accuracy,
      xpEarned: Math.round((result.accuracy / 100) * result.xp),
      bonusXp: result.accuracy >= 70 ? (lessons[0].rewardXp || 20) : 0,
      totalExercises,
      correctExercises,
      heartsRemaining: 3,
      completedAt: new Date().toISOString(),
    });
  };

  return (
    <CulturalGameEngine
      session={session}
      onComplete={handleComplete}
      onExitHref="/dashboard"
    />
  );
}
