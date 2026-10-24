import { lessons } from "../src/lib/lessons";
import { SECTIONS, UNITS, isUnitUnlocked, isLessonUnlocked, getSectionProgress } from "../src/lib/curriculum";
import { CANONICAL_BADGES, getUnitClosingBadge } from "../src/lib/badges";

console.log("=== START VERIFIKASI KURIKULUM & SISTEM LARAS ===");

const results: Record<string, any> = {};

// 1. Verifikasi Nama Section 3
const section3 = SECTIONS.find((s) => s.id === 3);
results.section3Title = section3?.title;
results.section3Stage = section3?.stage;
results.section3Match = section3?.title === "Section 3 — Menjadi Bagian Komunitas";

// 2. Verifikasi lessons.ts
results.totalLessons = lessons.length;
results.lessonIds = lessons.map((l) => l.id);
results.isSequential1to15 = lessons.every((l, idx) => l.id === idx + 1);

const expectedQuestionTypes = ["choice", "truefalse", "match", "order", "hotspot", "scenario"];

const newLessonsDetails = lessons.filter((l) => l.id >= 4).map((l) => {
  const types = l.questions.map((q) => q.type);
  const hasAll6Types = expectedQuestionTypes.every((t) => types.includes(t as any)) && l.questions.length === 6;
  const eachHasWhy = l.questions.every((q) => typeof q.why === "string" && q.why.trim().length > 0);
  const eachHasKey = l.questions.every((q) => {
    const d = q.data as any;
    if (q.type === "choice") return typeof d.answer === "string";
    if (q.type === "truefalse") return typeof d.answer === "boolean";
    if (q.type === "match") return Array.isArray(d.pairs) && d.pairs.length > 0;
    if (q.type === "order") return Array.isArray(d.answer) && d.answer.length > 0;
    if (q.type === "hotspot") return typeof d.answer === "string";
    if (q.type === "scenario") return typeof d.passingScore === "number";
    return false;
  });
  const eachXp5 = l.questions.every((q) => q.xp === 5);
  const totalQuestionXp = l.questions.reduce((sum, q) => sum + q.xp, 0);

  return {
    id: l.id,
    unitId: l.unitId,
    title: l.title,
    rewardXp: l.rewardXp,
    questionCount: l.questions.length,
    hasAll6Types,
    eachHasWhy,
    eachHasKey,
    eachXp5,
    totalQuestionXp,
  };
});
results.newLessonsDetails = newLessonsDetails;

// 3. Verifikasi badges.ts
const expectedBadges = [
  { unitId: 1, title: "Tamu Sopan" },
  { unitId: 2, title: "Penjelajah Kosakata" },
  { unitId: 3, title: "Penyapa Hormat" },
  { unitId: 4, title: "Pemadu Busana" },
  { unitId: 5, title: "Penjaga Adab Bertamu" },
  { unitId: 6, title: "Penjaga Nosarara" },
];

results.closingBadgesCheck = expectedBadges.map((eb) => {
  const b = getUnitClosingBadge(eb.unitId);
  return {
    unitId: eb.unitId,
    expectedTitle: eb.title,
    actualTitle: b?.title,
    match: b?.title === eb.title,
    isUnitCloser: b?.isUnitCloser,
  };
});

// 4. Verifikasi curriculum.ts (Unlock logic & backward compatibility)
// Skenario A: Pemain baru (belum ada completedLessons)
const pBaruU1 = isUnitUnlocked(1, []);
const pBaruU2 = isUnitUnlocked(2, []);
const pBaruL1 = isLessonUnlocked(1, [], [1]);
const pBaruL2 = isLessonUnlocked(2, [], [1]);

// Skenario B: Pemain lama yang sudah tamat Bab 1 (Pelajaran 1, 2, 3 selesai)
const pLamaLessons = [1, 2, 3];
const pLamaU1 = isUnitUnlocked(1, pLamaLessons);
const pLamaU2 = isUnitUnlocked(2, pLamaLessons); // Harusnya terbuka
const pLamaU3 = isUnitUnlocked(3, pLamaLessons); // Masih terkunci karena Unit 2 belum selesai
const pLamaL1 = isLessonUnlocked(1, pLamaLessons);
const pLamaL2 = isLessonUnlocked(2, pLamaLessons);
const pLamaL3 = isLessonUnlocked(3, pLamaLessons);
const pLamaL4 = isLessonUnlocked(4, pLamaLessons); // Pelajaran 1 di Unit 2 harusnya TERBUKA
const pLamaL5 = isLessonUnlocked(5, pLamaLessons); // Terkunci sampai L4 selesai

// Skenario C: Pemain menyelesaikan L4
const pLamaPlusL4 = [1, 2, 3, 4];
const pLamaL5AfterL4 = isLessonUnlocked(5, pLamaPlusL4); // Terbuka

// Skenario D: Pemain menyelesaikan seluruh Unit 2 (L1-6 selesai)
const pAllU2 = [1, 2, 3, 4, 5, 6];
const pU3AfterU2 = isUnitUnlocked(3, pAllU2); // Harusnya terbuka
const pL7AfterU2 = isLessonUnlocked(7, pAllU2); // L7 (Pelajaran 1 di U3) terbuka

results.unlockLogic = {
  pBaru: { U1: pBaruU1, U2: pBaruU2, L1: pBaruL1, L2: pBaruL2 },
  pLamaTamatBab1: { U1: pLamaU1, U2: pLamaU2, U3: pLamaU3, L1: pLamaL1, L2: pLamaL2, L3: pLamaL3, L4: pLamaL4, L5: pLamaL5 },
  pLamaPlusL4: { L5: pLamaL5AfterL4 },
  pAllU2: { U3: pU3AfterU2, L7: pL7AfterU2 },
};

// Section Progress calculation
results.sectionProgress = {
  sec1_empty: getSectionProgress(1, []),
  sec1_pLama: getSectionProgress(1, [1, 2, 3]), // 3 dari 8 pelajaran = 37.5%
  sec1_full: getSectionProgress(1, [1, 2, 3, 4, 5, 6, 7, 8]), // 100%
};

// 5. Verifikasi DATA DEMO dan PERLU VERIFIKASI di data
results.unitStatusCheck = {
  unit1: UNITS[1].status,
  unit2: UNITS[2].status,
  unit3: UNITS[3].status,
  unit4: { status: UNITS[4].status, notes: UNITS[4].verificationNotes },
  unit5: { status: UNITS[5].status, notes: UNITS[5].verificationNotes },
  unit6: { status: UNITS[6].status, notes: UNITS[6].verificationNotes },
};

// 6. Verifikasi Pelajaran 1-3 Live tidak regresi
const p1 = lessons.find((l) => l.id === 1);
const p2 = lessons.find((l) => l.id === 2);
const p3 = lessons.find((l) => l.id === 3);

results.liveLessonsCheck = {
  p1: { title: p1?.title, slug: p1?.slug, questionCount: p1?.questions.length, rewardXp: p1?.rewardXp },
  p2: { title: p2?.title, slug: p2?.slug, questionCount: p2?.questions.length, rewardXp: p2?.rewardXp },
  p3: { title: p3?.title, slug: p3?.slug, questionCount: p3?.questions.length, rewardXp: p3?.rewardXp },
};

console.log(JSON.stringify(results, null, 2));
