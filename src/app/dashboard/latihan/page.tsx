"use client";

import CulturalGameEngine from "../../components/game-engine/CulturalGameEngine";
import { lessonToGameSession } from "../../components/game-engine/lessonAdapter";
import { lessons } from "../../../lib/lessons";

export default function LatihanPage() {
  const session = lessonToGameSession(lessons[0]);

  return (
    <CulturalGameEngine
      session={session}
      onExitHref="/dashboard"
    />
  );
}
