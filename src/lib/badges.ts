export type CanonicalBadge = {
  id: string;
  title: string;
  lessonId: number;
  detail: string;
  rewardXp: number;
  tone: "primary" | "secondary" | "tertiary";
};

export const CANONICAL_BADGES: CanonicalBadge[] = [
  {
    id: "pionir-salam",
    title: "Pionir Salam",
    lessonId: 1,
    detail: "Menyelesaikan Pelajaran 1: Salam & Adab Tabe dengan santun.",
    rewardXp: 20,
    tone: "primary",
  },
  {
    id: "penjaga-busana",
    title: "Penjaga Busana",
    lessonId: 2,
    detail: "Menyelesaikan Pelajaran 2: Kenali Baju Nggembe dan Buya Sabe.",
    rewardXp: 25,
    tone: "secondary",
  },
  {
    id: "tamu-sopan",
    title: "Tamu Sopan",
    lessonId: 3,
    detail: "Menyelesaikan Pelajaran 3: Skenario Souraja (adab tutur & gesture).",
    rewardXp: 30,
    tone: "tertiary",
  },
];

export function getBadgeByLessonId(lessonId: number): CanonicalBadge | undefined {
  return CANONICAL_BADGES.find((b) => b.lessonId === lessonId);
}

export function getBadgeByTitle(title: string): CanonicalBadge | undefined {
  return CANONICAL_BADGES.find((b) => b.title.toLowerCase() === title.toLowerCase());
}
