export type SectionId = 1 | 2 | 3;
export type UnitId = 1 | 2 | 3 | 4 | 5 | 6;

export type Section = {
  id: SectionId;
  title: string;
  subtitle: string;
  stage: string;
  unitIds: UnitId[];
};

export type UnitStatus = "LIVE" | "DATA_DEMO";

export type Unit = {
  id: UnitId;
  sectionId: SectionId;
  label: string;
  title: string;
  subtitle: string;
  themeColor: string;
  shadowColor: string;
  closingBadge: string;
  badgeDetail: string;
  status: UnitStatus;
  statusLabel?: string;
  sourceCitation: string;
  lessonIds: number[];
  prerequisiteUnitId?: UnitId;
  verificationNotes?: string[];
};

export const SECTIONS: Section[] = [
  {
    id: 1,
    title: "Section 1 — Fondasi",
    subtitle: "Pintu masuk belajar bahasa, sapaan santun, bilangan, waktu, dan adab dasar Kaili Ledo.",
    stage: "Tahap Belajar 1: Fondasi",
    unitIds: [1, 2, 3],
  },
  {
    id: 2,
    title: "Section 2 — Hidup dalam Adat",
    subtitle: "Mendalami busana adat dan etika bertamu di pelataran serta ruang Souraja.",
    stage: "Tahap Belajar 2: Hidup dalam Adat",
    unitIds: [4, 5],
  },
  {
    id: 3,
    title: "Section 3 — Menjadi Bagian Komunitas",
    subtitle: "Menghayati filosofi persaudaraan Nosarara Nosabatutu dan tradisi syukur Padungku.",
    stage: "Tahap Belajar 3: Menjadi Bagian Komunitas",
    unitIds: [6],
  },
];

export const UNITS: Record<UnitId, Unit> = {
  1: {
    id: 1,
    sectionId: 1,
    label: "SECTION 1, UNIT 1",
    title: "Salam, Sapaan & Busana Kaili",
    subtitle: "Pintu masuk belajar bahasa santun dan busana adat Kaili Ledo.",
    themeColor: "#58cc02",
    shadowColor: "#46a302",
    closingBadge: "Tamu Sopan",
    badgeDetail: "Menuntaskan pelajaran salam santun, busana Nggembe, dan adab bertamu Souraja.",
    status: "LIVE",
    sourceCitation: "Dewan Adat Kaili (LAK) & Balai Pelestarian Kebudayaan Wilayah XVIII",
    lessonIds: [1, 2, 3],
  },
  2: {
    id: 2,
    sectionId: 1,
    label: "SECTION 1, UNIT 2",
    title: "Kosakata Sehari-hari",
    subtitle: "Menguasai kosakata bilangan, waktu, alam, dan alat perjalanan Kaili Ledo.",
    themeColor: "#1cb0f6",
    shadowColor: "#1899d6",
    closingBadge: "Penjelajah Kosakata",
    badgeDetail: "Menguasai kosakata hitungan, waktu, dan alat perjalanan Kaili Ledo.",
    status: "LIVE",
    sourceCitation: "Rujukan Modul Bahasa Daerah Kaili (Aslitah) — Sitasi Resmi",
    lessonIds: [4, 5, 6],
    prerequisiteUnitId: 1,
    verificationNotes: [
      "Motoro, Oto, Kapudara, Sakaya, dan Sapeda dikenalkan hanya sebagai kelompok kosakata transportasi — tidak ditambahkan arti per kata di luar rujukan.",
    ],
  },
  3: {
    id: 3,
    sectionId: 1,
    label: "SECTION 1, UNIT 3",
    title: "Sapaan Lanjutan",
    subtitle: "Menyapa dan menanyakan kabar dengan hormat memakai Tabe, Pue, dan Ngge.",
    themeColor: "#ff9600",
    shadowColor: "#d97f00",
    closingBadge: "Penyapa Hormat",
    badgeDetail: "Menerapkan sapaan santun lanjutan dan menanyakan kabar dengan tata krama hormat.",
    status: "LIVE",
    sourceCitation: "Rujukan Modul Bahasa Daerah Kaili (Aslitah) — Sitasi Resmi",
    lessonIds: [7, 8],
    prerequisiteUnitId: 2,
    verificationNotes: [
      "Bentuk baku Kaili Ledo dari ungkapan menanyakan kabar 'Komi mambura kareba' — WAJIB diverifikasi sebelum dipakai sebagai fakta final.",
      "Ngge dikenalkan hanya sebagai sapaan dalam daftar materi unit ini — tidak ditambahkan arti di luar rujukan.",
    ],
  },
  4: {
    id: 4,
    sectionId: 2,
    label: "SECTION 2, UNIT 4",
    title: "Busana Adat Lanjutan",
    subtitle: "Memadukan busana adat dan mengenali istilah busana Kaili.",
    themeColor: "#ce82ff",
    shadowColor: "#a855f7",
    closingBadge: "Pemadu Busana",
    badgeDetail: "Mengenali perpaduan Baju Nggembe, Buya Sabe, serta istilah busana adat.",
    status: "DATA_DEMO",
    statusLabel: "DATA DEMO • Draf dalam proses validasi",
    sourceCitation: "DATA DEMO — Draf kurasi awal untuk pengujian prototipe, belum tervalidasi dewan adat.",
    lessonIds: [9, 10],
    prerequisiteUnitId: 3,
    verificationNotes: [
      "Siga (ikat kepala adat laki-laki) — PERLU VALIDASI, belum boleh dipakai sebagai fakta final.",
      "Pua Kora — PERLU VALIDASI; dikenalkan hanya sebagai istilah, bentuk, bahan, dan fungsinya tidak dideskripsikan sebagai fakta.",
      "Seluruh Unit 4 berstatus DATA DEMO, draf dalam proses validasi.",
    ],
  },
  5: {
    id: 5,
    sectionId: 2,
    label: "SECTION 2, UNIT 5",
    title: "Etika Bertamu Lanjutan",
    subtitle: "Bertamu dengan adab melintas yang hormat dan membaca ruang di Souraja.",
    themeColor: "#00cd9c",
    shadowColor: "#00a77f",
    closingBadge: "Penjaga Adab Bertamu",
    badgeDetail: "Menguasai tata gerak melintas di depan tetua dan etika zona ruang Souraja.",
    status: "DATA_DEMO",
    statusLabel: "DATA DEMO • Draf dalam proses validasi",
    sourceCitation: "DATA DEMO — Draf kurasi awal untuk pengujian prototipe, belum tervalidasi dewan adat.",
    lessonIds: [11, 12],
    prerequisiteUnitId: 4,
    verificationNotes: [
      "Seluruh Unit 5 berstatus DATA DEMO, draf dalam proses validasi.",
      "Adab melintas dan membaca ruang Souraja disajikan sebagai model simulasi edukasi.",
    ],
  },
  6: {
    id: 6,
    sectionId: 3,
    label: "SECTION 3, UNIT 6",
    title: "Nilai & Tradisi Komunal",
    subtitle: "Menghayati nilai Nosarara Nosabatutu dan tradisi gotong royong Padungku.",
    themeColor: "#ff4b4b",
    shadowColor: "#d93838",
    closingBadge: "Penjaga Nosarara",
    badgeDetail: "Menghayati filosofi persaudaraan satu ikatan dan kearifan syukur bersama Padungku.",
    status: "DATA_DEMO",
    statusLabel: "DATA DEMO • Draf dalam proses validasi",
    sourceCitation: "DATA DEMO — Draf kurasi awal untuk pengujian prototipe, belum tervalidasi dewan adat.",
    lessonIds: [13, 14, 15],
    prerequisiteUnitId: 5,
    verificationNotes: [
      "Tahapan, sesaji, tokoh, dan tanggal Padungku — TIDAK dibahas dan TIDAK dikarang; hanya makna umumnya (syukur, kebersamaan, berbagi hasil panen) yang dipakai.",
      "Seluruh Unit 6 berstatus DATA DEMO, draf dalam proses validasi.",
    ],
  },
};

/**
 * Cek apakah sebuah unit terbuka berdasarkan pelajaran yang sudah diselesaikan.
 * Aturan: Unit berikutnya terbuka setelah unit sebelumnya selesai sepenuhnya.
 */
export function isUnitUnlocked(unitId: UnitId, completedLessons: number[]): boolean {
  if (unitId === 1) return true;
  const unit = UNITS[unitId];
  if (!unit || !unit.prerequisiteUnitId) return true;
  
  const prereqUnit = UNITS[unit.prerequisiteUnitId];
  if (!prereqUnit) return true;
  
  // Prereq unit harus selesai semua pelajarannya
  return prereqUnit.lessonIds.every((id) => completedLessons.includes(id));
}

/**
 * Cek apakah sebuah pelajaran terbuka.
 * Aturan:
 * 1. Unit harus sudah terbuka.
 * 2. Di dalam unit, Pelajaran 1 unit tersebut terbuka jika unit terbuka.
 * 3. Pelajaran berikutnya terbuka jika pelajaran sebelumnya di unit tersebut sudah selesai.
 */
export function isLessonUnlocked(
  lessonId: number,
  completedLessons: number[],
  unlockedLessons: number[] = [1]
): boolean {
  if (lessonId === 1) return true;
  if (unlockedLessons.includes(lessonId)) return true;
  if (completedLessons.includes(lessonId)) return true;

  // Cari unit dari lesson ini
  const unit = Object.values(UNITS).find((u) => u.lessonIds.includes(lessonId));
  if (!unit) return false;

  // Cek apakah unit sudah terbuka
  if (!isUnitUnlocked(unit.id, completedLessons)) return false;

  const idxInUnit = unit.lessonIds.indexOf(lessonId);
  if (idxInUnit === 0) {
    // Pelajaran pertama di unit ini: otomatis terbuka jika unit terbuka
    return true;
  }

  // Pelajaran ke-N terbuka jika pelajaran (N-1) sudah selesai
  const prevLessonId = unit.lessonIds[idxInUnit - 1];
  return completedLessons.includes(prevLessonId);
}

/**
 * Menghitung progres unit (0 sampai 1)
 */
export function getUnitProgress(unitId: UnitId, completedLessons: number[]): number {
  const unit = UNITS[unitId];
  if (!unit || unit.lessonIds.length === 0) return 0;
  const completedCount = unit.lessonIds.filter((id) => completedLessons.includes(id)).length;
  return completedCount / unit.lessonIds.length;
}

/**
 * Cek apakah unit sudah tuntas sepenuhnya
 */
export function isUnitCompleted(unitId: UnitId, completedLessons: number[]): boolean {
  const unit = UNITS[unitId];
  if (!unit) return false;
  return unit.lessonIds.every((id) => completedLessons.includes(id));
}

/**
 * Menghitung progres section (0 sampai 1)
 */
export function getSectionProgress(sectionId: SectionId, completedLessons: number[]): number {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return 0;
  const allLessonIds = section.unitIds.flatMap((uid) => UNITS[uid]?.lessonIds || []);
  if (allLessonIds.length === 0) return 0;
  const completedCount = allLessonIds.filter((id) => completedLessons.includes(id)).length;
  return completedCount / allLessonIds.length;
}
