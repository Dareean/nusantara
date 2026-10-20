"use client";

import CulturalGameEngine from "../../components/game-engine/CulturalGameEngine";
import { sampleKailiLesson } from "../../components/game-engine/mockData";

export default function LatihanPage() {
  return (
    <CulturalGameEngine
      session={sampleKailiLesson}
      onExitHref="/dashboard"
    />
  );
}
