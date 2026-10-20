"use client";

import { use, useEffect, useState } from "react";
import CulturalGameEngine from "../../../components/game-engine/CulturalGameEngine";
import { getStoredSessions } from "../../../components/game-engine/sessionStore";
import { sampleKailiLesson } from "../../../components/game-engine/mockData";
import { GameSession } from "../../../components/game-engine/types";

export default function DynamicLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const [session, setSession] = useState<GameSession>(sampleKailiLesson);

  useEffect(() => {
    const sessions = getStoredSessions();
    const found = sessions.find((s) => s.id === resolvedParams.lessonId);
    if (found) {
      setSession(found);
    }
  }, [resolvedParams.lessonId]);

  return (
    <CulturalGameEngine
      session={session}
      onExitHref="/dashboard/belajar"
    />
  );
}
