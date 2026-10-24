import {
  isUnitUnlocked,
  isLessonUnlocked,
  getSectionProgress,
  isUnitCompleted,
  UNITS,
  SECTIONS,
} from "../src/lib/curriculum";
import { lessons, getLessonById } from "../src/lib/lessons";
import { getNextLessonsToUnlock } from "../src/app/dashboard/progress";

function runRegression() {
  console.log("=== REGRESSION TEST START ===");

  // 1. Total lessons
  if (lessons.length !== 17) {
    throw new Error(`Expected 17 lessons, got ${lessons.length}`);
  }
  console.log("✓ Total lessons: 17");

  // 2. Audio URL count check
  const lessonsWithAudio = lessons.filter((l) => l.questions.some((q) => Boolean(q.audioUrl)));
  if (lessonsWithAudio.length !== 2) {
    throw new Error(`Expected exactly 2 lessons with audio, got ${lessonsWithAudio.length}`);
  }
  const totalAudioQuestions = lessons.flatMap((l) => l.questions).filter((q) => Boolean(q.audioUrl));
  if (totalAudioQuestions.length !== 10) {
    throw new Error(`Expected exactly 10 questions with audio, got ${totalAudioQuestions.length}`);
  }
  console.log("✓ Audio check: Exactly 10 questions across Lesson 16 and 17 have audioUrl, 0 elsewhere");

  // 3. Lessons 1-15 integrity
  for (let id = 1; id <= 15; id++) {
    const l = getLessonById(id);
    if (!l) throw new Error(`Missing lesson ${id}`);
    if (l.questions.some((q) => q.audioUrl)) {
      throw new Error(`Lesson ${id} unexpectedly has audioUrl!`);
    }
  }
  console.log("✓ Lessons 1-15 verified intact without any audioUrl");

  // 4. Akun lama (completed 1-6)
  const oldUserCompleted = [1, 2, 3, 4, 5, 6];
  if (!isUnitUnlocked(3, oldUserCompleted)) {
    throw new Error("Regression! Unit 3 is locked for user with completedLessons [1..6]!");
  }
  console.log("✓ Old user: Unit 3 is unlocked after completing 1-6");

  const sec1Progress = getSectionProgress(1, oldUserCompleted);
  // Section 1 has units 1, 2, 3 (lessonIds: [1,2,3], [4,5,6], [7,8] -> 8 core lessons).
  // 6 completed / 8 = 0.75
  if (sec1Progress !== 6 / 8) {
    throw new Error(`Expected section 1 progress to be 0.75, got ${sec1Progress}`);
  }
  console.log(`✓ Section 1 progress: ${Math.round(sec1Progress * 100)}% (6/8 core lessons, unchanged)`);

  if (!isLessonUnlocked(7, oldUserCompleted)) {
    throw new Error("Regression! Lesson 7 should be unlocked for user with completedLessons [1..6]!");
  }
  console.log("✓ Lesson 7 is unlocked for user after lesson 6");

  if (!isLessonUnlocked(16, oldUserCompleted)) {
    throw new Error("Lesson 16 should be unlocked for user after lesson 6!");
  }
  console.log("✓ Lesson 16 is unlocked for user after lesson 6");

  if (isLessonUnlocked(17, oldUserCompleted)) {
    throw new Error("Lesson 17 should be LOCKED before lesson 16 is completed!");
  }
  console.log("✓ Lesson 17 is locked before lesson 16 is completed");

  // 5. Akun menyelesaikan 16
  const after16 = [...oldUserCompleted, 16];
  if (!isLessonUnlocked(17, after16)) {
    throw new Error("Lesson 17 should be unlocked after completing lesson 16!");
  }
  console.log("✓ Lesson 17 unlocks immediately after lesson 16 is completed");

  // 6. getNextLessonsToUnlock rules
  const unlockAfter6 = getNextLessonsToUnlock(6);
  if (!unlockAfter6.includes(7) || !unlockAfter6.includes(16)) {
    throw new Error(`getNextLessonsToUnlock(6) must return [7, 16], got: ${JSON.stringify(unlockAfter6)}`);
  }
  console.log("✓ getNextLessonsToUnlock(6) unlocks [7, 16] simultaneously");

  const unlockAfter16 = getNextLessonsToUnlock(16);
  if (unlockAfter16.length !== 1 || unlockAfter16[0] !== 17) {
    throw new Error(`getNextLessonsToUnlock(16) must return [17], got: ${JSON.stringify(unlockAfter16)}`);
  }
  console.log("✓ getNextLessonsToUnlock(16) unlocks [17]");

  const unlockAfter17 = getNextLessonsToUnlock(17);
  if (unlockAfter17.length !== 0) {
    throw new Error(`getNextLessonsToUnlock(17) must return [], got: ${JSON.stringify(unlockAfter17)}`);
  }
  console.log("✓ getNextLessonsToUnlock(17) returns empty array (does not search for ID 18)");

  console.log("=== ALL REGRESSION TESTS PASSED ===");
}

runRegression();
