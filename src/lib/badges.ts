export type CanonicalBadge = {
  id: string;
  title: string;
  lessonId: number;
  unitId?: number;
  detail: string;
  rewardXp: number;
  tone: "primary" | "secondary" | "tertiary" | "accent";
  isUnitCloser?: boolean;
};

export const CANONICAL_BADGES: CanonicalBadge[] = [
  // Lencana Pelajaran Awal (Milestone)
  {
    id: "pionir-salam",
    title: "Pionir Salam",
    lessonId: 1,
    unitId: 1,
    detail: "Menyelesaikan Pelajaran 1: Salam & Adab Tabe dengan santun.",
    rewardXp: 20,
    tone: "primary",
  },
  {
    id: "penjaga-busana",
    title: "Penjaga Busana",
    lessonId: 2,
    unitId: 1,
    detail: "Menyelesaikan Pelajaran 2: Kenali Baju Nggembe dan Buya Sabe.",
    rewardXp: 25,
    tone: "secondary",
  },

  // 6 LENCANA PENUTUP UNIT (Sesuai Kurikulum Resmi LARAS)
  {
    id: "tamu-sopan",
    title: "Tamu Sopan",
    lessonId: 3,
    unitId: 1,
    detail: "Lencana Penutup Unit 1: Menguasai salam, sapaan santun, dan adab bertamu Souraja.",
    rewardXp: 30,
    tone: "tertiary",
    isUnitCloser: true,
  },
  {
    id: "penjelajah-kosakata",
    title: "Penjelajah Kosakata",
    lessonId: 6,
    unitId: 2,
    detail: "Lencana Penutup Unit 2: Menguasai kosakata bilangan, waktu, alam, dan transportasi Kaili Ledo.",
    rewardXp: 30,
    tone: "primary",
    isUnitCloser: true,
  },
  {
    id: "penyapa-hormat",
    title: "Penyapa Hormat",
    lessonId: 8,
    unitId: 3,
    detail: "Lencana Penutup Unit 3: Menyapa dan menanyakan kabar dengan hormat memakai Tabe, Pue, dan Ngge.",
    rewardXp: 30,
    tone: "secondary",
    isUnitCloser: true,
  },
  {
    id: "pemadu-busana",
    title: "Pemadu Busana",
    lessonId: 10,
    unitId: 4,
    detail: "Lencana Penutup Unit 4: Memadukan Baju Nggembe, Buya Sabe, serta memahami istilah busana adat.",
    rewardXp: 30,
    tone: "accent",
    isUnitCloser: true,
  },
  {
    id: "penjaga-adab-bertamu",
    title: "Penjaga Adab Bertamu",
    lessonId: 12,
    unitId: 5,
    detail: "Lencana Penutup Unit 5: Mempraktikkan adab melintas di depan tetua dan membaca ruang di Souraja.",
    rewardXp: 30,
    tone: "tertiary",
    isUnitCloser: true,
  },
  {
    id: "penjaga-nosarara",
    title: "Penjaga Nosarara",
    lessonId: 15,
    unitId: 6,
    detail: "Lencana Penutup Unit 6: Menghayati filosofi persaudaraan Nosarara Nosabatutu dan tradisi gotong royong Padungku.",
    rewardXp: 30,
    tone: "primary",
    isUnitCloser: true,
  },
];

export function getBadgeByLessonId(lessonId: number): CanonicalBadge | undefined {
  return CANONICAL_BADGES.find((b) => b.lessonId === lessonId);
}

export function getBadgeByTitle(title: string): CanonicalBadge | undefined {
  return CANONICAL_BADGES.find((b) => b.title.toLowerCase() === title.toLowerCase());
}

export function getUnitClosingBadge(unitId: number): CanonicalBadge | undefined {
  return CANONICAL_BADGES.find((b) => b.unitId === unitId && b.isUnitCloser);
}
