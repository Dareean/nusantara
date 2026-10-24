"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  Check,
  Flame,
  Gamepad2,
  Gift,
  Heart,
  Landmark,
  Lock,
  MapPin,
  Play,
  Shirt,
  Star,
  Trophy,
  Zap,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { getCachedSessionSync, getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "./progress";
import { getStoredSessions, syncSessionsFromServer } from "../components/game-engine/sessionStore";
import {
  UNITS,
  SECTIONS,
  isUnitUnlocked,
  isLessonUnlocked,
  isUnitCompleted,
  getUnitProgress,
  type UnitId,
} from "@/lib/curriculum";
import { CANONICAL_BADGES } from "@/lib/badges";

export type NodeStatus = "completed" | "active" | "locked";

export type PathNode = {
  id: number | string;
  unitId: UnitId;
  lessonId?: number;
  title: string;
  subtitle: string;
  type: "lesson" | "chest" | "review";
  href: string;
  xp: number;
  offset: "left" | "center" | "right";
  prereqLessonId?: number;
  badgeTitle?: string;
  status?: NodeStatus;
  isEnrichment?: boolean;
};

const BUILTIN_SESSION_IDS = new Set(["SES-KL-MASTER-001", "SES-LALOVE-002", "1", "2", "3"]);

export const UNIT_THEMES: Record<
  number,
  {
    label: string;
    title: string;
    bgColor: string;
    shadowColor: string;
  }
> = {
  1: {
    label: "BAGIAN 1, UNIT 1",
    title: "Salam, Sapaan & Busana Kaili",
    bgColor: "#58cc02", // Duolingo vibrant green
    shadowColor: "#46a302",
  },
  2: {
    label: "BAGIAN 1, UNIT 2",
    title: "Kosakata Sehari-hari",
    bgColor: "#1cb0f6", // Duolingo sky blue
    shadowColor: "#1899d6",
  },
  3: {
    label: "BAGIAN 1, UNIT 3",
    title: "Sapaan Lanjutan",
    bgColor: "#ff9600", // Duolingo warm orange
    shadowColor: "#d97f00",
  },
  4: {
    label: "BAGIAN 2, UNIT 4",
    title: "Busana Adat Lanjutan",
    bgColor: "#ce82ff", // Duolingo purple
    shadowColor: "#a855f7",
  },
  5: {
    label: "BAGIAN 2, UNIT 5",
    title: "Etika Bertamu Lanjutan",
    bgColor: "#00cd9c", // Duolingo teal
    shadowColor: "#00a77f",
  },
  6: {
    label: "BAGIAN 3, UNIT 6",
    title: "Nilai & Tradisi Komunal",
    bgColor: "#ff4b4b", // Duolingo red
    shadowColor: "#d93838",
  },
};

export const UNIT_NODES: Record<UnitId, PathNode[]> = {
  1: [
    { id: 1, unitId: 1, lessonId: 1, title: "Salam & Adab Tabe", subtitle: "Pelajaran 1 • Kaili Ledo", type: "lesson", href: "/dashboard/latihan/1", xp: 20, offset: "center" },
    { id: 2, unitId: 1, lessonId: 2, title: "Kenali Baju Nggembe", subtitle: "Pelajaran 2 • Busana adat", type: "lesson", href: "/dashboard/latihan/2", xp: 25, offset: "left" },
    { id: "chest-1", unitId: 1, prereqLessonId: 2, title: "Peti Budaya", subtitle: "Hadiah Unit 1", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "center" },
    { id: 3, unitId: 1, lessonId: 3, title: "Skenario Souraja", subtitle: "Pelajaran 3 • Rumah adat", type: "lesson", href: "/dashboard/latihan/3", xp: 30, offset: "right" },
    { id: "cc-1", unitId: 1, prereqLessonId: 3, title: "Culture Connection: Upacara Adat", subtitle: "Simulasi • Pernikahan adat Kaili", type: "review", href: "/dashboard/culture-connection", xp: 30, offset: "center" },
    { id: "badge-1", unitId: 1, prereqLessonId: 3, badgeTitle: "Tamu Sopan", title: "Cap Paspor Tamu Sopan", subtitle: "Penutup Unit 1", type: "review", href: "/dashboard/paspor", xp: 50, offset: "left" },
  ],
  2: [
    { id: 4, unitId: 2, lessonId: 4, title: "Bilangan Satu sampai Sepuluh", subtitle: "Pelajaran 4 • Hitungan Kaili", type: "lesson", href: "/dashboard/latihan/4", xp: 30, offset: "center" },
    { id: 5, unitId: 2, lessonId: 5, title: "Waktu: Pagi, Malam, Besok, Lusa, Tahun", subtitle: "Pelajaran 5 • Waktu Kaili", type: "lesson", href: "/dashboard/latihan/5", xp: 30, offset: "left" },
    { id: "chest-2", unitId: 2, prereqLessonId: 5, title: "Peti Kosakata", subtitle: "Hadiah Kosakata", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "center" },
    { id: 6, unitId: 2, lessonId: 6, title: "Alam dan Alat Perjalanan", subtitle: "Pelajaran 6 • Kosakata transportasi", type: "lesson", href: "/dashboard/latihan/6", xp: 30, offset: "right" },
    { id: 16, unitId: 2, lessonId: 16, title: "Latihan Mendengar 1", subtitle: "Pelajaran 16 • Pengayaan", isEnrichment: true, type: "lesson", href: "/dashboard/latihan/16", xp: 25, offset: "center" },
    { id: 17, unitId: 2, lessonId: 17, title: "Latihan Mendengar 2", subtitle: "Pelajaran 17 • Pengayaan", isEnrichment: true, type: "lesson", href: "/dashboard/latihan/17", xp: 25, offset: "left" },
    { id: "badge-2", unitId: 2, prereqLessonId: 6, badgeTitle: "Penjelajah Kosakata", title: "Cap Paspor Penjelajah Kosakata", subtitle: "Penutup Unit 2", type: "review", href: "/dashboard/paspor", xp: 30, offset: "right" },
  ],
  3: [
    { id: 7, unitId: 3, lessonId: 7, title: "Menanyakan Kabar dengan Hormat", subtitle: "Pelajaran 7 • Sapaan santun", type: "lesson", href: "/dashboard/latihan/7", xp: 30, offset: "center" },
    { id: "chest-3", unitId: 3, prereqLessonId: 7, title: "Peti Tutur Santun", subtitle: "Hadiah Adab Bertutur", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "left" },
    { id: 8, unitId: 3, lessonId: 8, title: "Tabe, Pue, dan Ngge", subtitle: "Pelajaran 8 • Partikel hormat", type: "lesson", href: "/dashboard/latihan/8", xp: 30, offset: "right" },
    { id: "badge-3", unitId: 3, prereqLessonId: 8, badgeTitle: "Penyapa Hormat", title: "Cap Paspor Penyapa Hormat", subtitle: "Penutup Unit 3", type: "review", href: "/dashboard/paspor", xp: 30, offset: "center" },
  ],
  4: [
    { id: 9, unitId: 4, lessonId: 9, title: "Memadukan Baju Nggembe dan Buya Sabe", subtitle: "Pelajaran 9 • Busana adat", type: "lesson", href: "/dashboard/latihan/9", xp: 30, offset: "center" },
    { id: "chest-4", unitId: 4, prereqLessonId: 9, title: "Peti Tenun Pusaka", subtitle: "Hadiah Buya Sabe", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "right" },
    { id: 10, unitId: 4, lessonId: 10, title: "Mengenal Istilah Siga dan Pua Kora", subtitle: "Pelajaran 10 • Ikat kepala adat", type: "lesson", href: "/dashboard/latihan/10", xp: 30, offset: "left" },
    { id: "badge-4", unitId: 4, prereqLessonId: 10, badgeTitle: "Pemadu Busana", title: "Cap Paspor Pemadu Busana", subtitle: "Penutup Unit 4", type: "review", href: "/dashboard/paspor", xp: 30, offset: "center" },
  ],
  5: [
    { id: 11, unitId: 5, lessonId: 11, title: "Adab Melintas di Depan Tetua", subtitle: "Pelajaran 11 • Tata gerak santun", type: "lesson", href: "/dashboard/latihan/11", xp: 30, offset: "center" },
    { id: "chest-5", unitId: 5, prereqLessonId: 11, title: "Peti Adab Souraja", subtitle: "Hadiah Serambi Tetua", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "left" },
    { id: 12, unitId: 5, lessonId: 12, title: "Ruang di Souraja: Serambi dan Ruang Dalam", subtitle: "Pelajaran 12 • Zona rumah panggung", type: "lesson", href: "/dashboard/latihan/12", xp: 30, offset: "right" },
    { id: "badge-5", unitId: 5, prereqLessonId: 12, badgeTitle: "Penjaga Adab Bertamu", title: "Cap Paspor Penjaga Adab Bertamu", subtitle: "Penutup Unit 5", type: "review", href: "/dashboard/paspor", xp: 30, offset: "center" },
  ],
  6: [
    { id: 13, unitId: 6, lessonId: 13, title: "Nosarara Nosabatutu: Bersaudara Bersatu", subtitle: "Pelajaran 13 • Falsafah persaudaraan", type: "lesson", href: "/dashboard/latihan/13", xp: 30, offset: "center" },
    { id: 14, unitId: 6, lessonId: 14, title: "Padungku: Syukur, Kebersamaan, Berbagi", subtitle: "Pelajaran 14 • Tradisi syukur panen", type: "lesson", href: "/dashboard/latihan/14", xp: 30, offset: "right" },
    { id: "chest-6", unitId: 6, prereqLessonId: 14, title: "Peti Gotong Royong", subtitle: "Hadiah Nilai Komunitas", type: "chest", href: "/dashboard/paspor", xp: 0, offset: "left" },
    { id: 15, unitId: 6, lessonId: 15, title: "Hidup Nosarara Sehari-hari", subtitle: "Pelajaran 15 • Aksi nyata kebersamaan", type: "lesson", href: "/dashboard/latihan/15", xp: 30, offset: "right" },
    { id: "badge-6", unitId: 6, prereqLessonId: 15, badgeTitle: "Penjaga Nosarara", title: "Cap Paspor Penjaga Nosarara", subtitle: "Penutup Unit 6", type: "review", href: "/dashboard/paspor", xp: 30, offset: "center" },
  ],
};

export type DialogueLine = {
  speaker: string;
  avatar: string;
  role: string;
  kaili: string;
  indonesia: string;
};

export type UnitGuidebook = {
  label: string;
  title: string;
  subtitle: string;
  keyPhrases: {
    term: string;
    meaning: string;
    context: string;
    phonetic?: string;
  }[];
  dialogue: DialogueLine[];
  quickTips: {
    icon: string;
    title: string;
    tip: string;
  }[];
};

export const UNIT_GUIDEBOOKS: Record<number, UnitGuidebook> = {
  1: {
    label: "BAGIAN 1, UNIT 1",
    title: "Salam, Sapaan & Busana Kaili",
    subtitle: "Dengarkan pelafalan frasa santun dan intip obrolan sehari-hari warga lembah Palu!",
    keyPhrases: [
      { term: "Tabe", meaning: "Permisi / Maaf ya", context: "Kunci utama kesopanan saat melintas atau menyapa.", phonetic: "ta-be" },
      { term: "Ndokona", meaning: "Selamat pagi!", context: "Dipakai sejak fajar terbit hingga menjelang tengah hari.", phonetic: "ndo-ko-na" },
      { term: "Nempa", meaning: "Selamat siang!", context: "Sapaan hangat saat matahari sedang terik di atas kepala.", phonetic: "nem-pa" },
      { term: "Kareba?", meaning: "Gimana kabarmu?", context: "Menanyakan kabar teman atau tetangga secara akrab.", phonetic: "ka-re-ba" },
      { term: "Kareba roa", meaning: "Kabar baik sekali!", context: "Jawaban mantap kalau kamu sehat walafiat.", phonetic: "ka-re-ba ro-a" },
      { term: "Tarima kasi", meaning: "Terima kasih banyak", context: "Ungkapan rasa senang setelah dibantu atau dijamu.", phonetic: "ta-ri-ma ka-si" },
    ],
    dialogue: [
      { speaker: "Rafi", avatar: "🙋‍♂️", role: "Pelajar Pendatang", kaili: "Tabe, Ndokona! Kareba?", indonesia: "Permisi, selamat pagi! Gimana kabarmu?" },
      { speaker: "Ibu Nur", avatar: "🧕", role: "Warga Asli Palu", kaili: "Ndokona roa! Kareba roa, alhamdulillah.", indonesia: "Pagi juga! Kabar sangat baik, alhamdulillah." },
      { speaker: "Rafi", avatar: "🙋‍♂️", role: "Pelajar Pendatang", kaili: "Tarima kasi, Ibu Nur!", indonesia: "Terima kasih banyak, Bu Nur!" },
      { speaker: "Ibu Nur", avatar: "🧕", role: "Warga Asli Palu", kaili: "Io, sama-sama!", indonesia: "Iya, sama-sama ya!" },
    ],
    quickTips: [
      { icon: "💡", title: "Aturan Emas Kata 'Tabe'", tip: "Di tanah Kaili, kata 'Tabe' itu seperti sihir kesopanan. Selalu tundukkan badan sedikit saat berucap, lawan bicara pasti langsung tersenyum ramah kepadamu!" },
      { icon: "👔", title: "Busana Pria: Baju Koje & Siga", tip: "Kemeja lengan panjang berkerah tegak berpadu sarung tenun sutra Donggala. Di kepalanya terpasang 'Siga', ikat kepala segitiga simbol kehormatan pria Kaili." },
      { icon: "👗", title: "Busana Wanita: Baju Nggembe", tip: "Baju kurung segi empat longgar berbahan sutra yang sangat adem untuk cuaca pesisir Teluk Palu, dipadu sarung tenun Buya Sabe." },
    ],
  },
  2: {
    label: "BAGIAN 1, UNIT 2",
    title: "Kosakata Sehari-hari",
    subtitle: "Kuasai bilangan satu sampai sepuluh, waktu, alam, dan sebutan transportasi harian.",
    keyPhrases: [
      { term: "Sa", meaning: "Satu (1)", context: "Bilangan pembuka dalam hitungan Kaili Ledo.", phonetic: "sa" },
      { term: "Roa", meaning: "Dua (2)", context: "Bilangan dua; juga bermakna 'teman' atau 'sangat'.", phonetic: "ro-a" },
      { term: "Tolu", meaning: "Tiga (3)", context: "Bilangan tiga.", phonetic: "to-lu" },
      { term: "Pata", meaning: "Empat (4)", context: "Bilangan empat.", phonetic: "pa-ta" },
      { term: "Lima", meaning: "Lima (5)", context: "Bilangan lima.", phonetic: "li-ma" },
      { term: "Sapulu", meaning: "Sepuluh (10)", context: "Bilangan genap sepuluh.", phonetic: "sa-pu-lu" },
      { term: "Kambengi", meaning: "Malam", context: "Waktu setelah matahari terbenam.", phonetic: "kam-be-ngi" },
      { term: "Raba", meaning: "Besok", context: "Hari esok.", phonetic: "ra-ba" },
      { term: "Sanggani", meaning: "Lusa", context: "Dua hari mendatang.", phonetic: "sang-ga-ni" },
    ],
    dialogue: [
      { speaker: "Rafi", avatar: "🙋‍♂️", role: "Pembeli", kaili: "Tabe, piga ntolu kelapa?", indonesia: "Permisi, berapa harga tiga butir kelapa?" },
      { speaker: "Paman Pasar", avatar: "👨‍🌾", role: "Pedagang Pasar Masomba", kaili: "Tolu kelapa, sapulu ribu rupiah.", indonesia: "Tiga butir kelapa, sepuluh ribu rupiah." },
      { speaker: "Rafi", avatar: "🙋‍♂️", role: "Pembeli", kaili: "Tarima kasi roa!", indonesia: "Terima kasih banyak ya!" },
    ],
    quickTips: [
      { icon: "🔢", title: "Ritme Menghitung 1 Sampai 5", tip: "Ingat urutannya: Sa (1), Roa (2), Tolu (3), Pata (4), Lima (5). Angka ini sangat sering terpakai saat menanyakan jumlah di warung." },
      { icon: "🌅", title: "Menyebut Waktu Pertemuan", tip: "Jika ada janji esok hari, ucapkan 'Raba'. Untuk lusa, gunakan 'Sanggani'." },
    ],
  },
  3: {
    label: "BAGIAN 1, UNIT 3",
    title: "Sapaan Lanjutan",
    subtitle: "Praktik menyapa dengan sebutan Pue, partikel Tabe, dan menanyakan kabar secara terhormat.",
    keyPhrases: [
      { term: "Tabe roa", meaning: "Permisi yang sangat hormat", context: "Digunakan saat meminta izin kepada tokoh adat atau tetua.", phonetic: "ta-be ro-a" },
      { term: "Pue", meaning: "Tuan / Yang Dituakan / Penghormatan", context: "Panggilan mulia untuk orang yang lebih tua atau dituakan.", phonetic: "pu-e" },
      { term: "Ngge", meaning: "Partikel sapaan / sahutan santun", context: "Dipakai untuk menyambut atau mengiyakan tuturan dengan santun.", phonetic: "ng-ge" },
      { term: "Komi mambura kareba?", meaning: "Bagaimana kabar Anda?", context: "Ungkapan santun menanyakan kabar dalam pergaulan Kaili Ledo.", phonetic: "ko-mi mam-bu-ra ka-re-ba" },
    ],
    dialogue: [
      { speaker: "Pemuda", avatar: "🙋‍♂️", role: "Warga Muda", kaili: "Tabe roa, Pue. Komi mambura kareba?", indonesia: "Permisi hormat, Yang Dituakan. Bagaimana kabar Anda hari ini?" },
      { speaker: "Tetua Adat", avatar: "👴", role: "Pemangku Adat", kaili: "Ngge, kareba roa! Silakan duduk.", indonesia: "Iya santun, kabar sangat baik! Silakan duduk bersama kami." },
    ],
    quickTips: [
      { icon: "👑", title: "Penghormatan Sebutan 'Pue'", tip: "Gunakan sebutan 'Pue' kepada tetua atau tokoh adat untuk menunjukkan adab budi pekerti yang luhur." },
      { icon: "🤝", title: "Intonasi Bicara Rendah Hati", tip: "Ketika mengucap 'Tabe roa', turunkan nada suara satu oktaf sebagai simbol kerendahan hati." },
    ],
  },
  4: {
    label: "BAGIAN 2, UNIT 4",
    title: "Busana Adat Lanjutan",
    subtitle: "Mengenal sarung tenun Buya Sabe Donggala, motif Buya Bomba, serta ikat kepala Siga.",
    keyPhrases: [
      { term: "Buya Sabe", meaning: "Sarung tenun sutra Donggala", context: "Sarung pusaka tenun tangan untuk upacara resmi.", phonetic: "bu-ya sa-be" },
      { term: "Buya Bomba", meaning: "Tenun motif kuncup bunga", context: "Motif khas lambang keterbukaan dan keanggunan.", phonetic: "bu-ya bom-ba" },
      { term: "Siga", meaning: "Ikat kepala segitiga adat pria", context: "Simbol keteguhan dan kehormatan laki-laki Kaili.", phonetic: "si-ga" },
      { term: "Pua Kora", meaning: "Istilah perlengkapan adat", context: "Istilah ornamen busana adat yang sedang dalam proses verifikasi.", phonetic: "pu-a ko-ra" },
    ],
    dialogue: [
      { speaker: "Maestro Tenun", avatar: "👵", role: "Penenun Donggala", kaili: "Ini Buya Bomba benang sutra asli, ditenun dengan sabar.", indonesia: "Ini Buya Bomba dari benang sutra pilihan, ditenun dengan ketelitian berbulan-bulan." },
      { speaker: "Pengunjung", avatar: "🙋‍♂️", role: "Pecinta Budaya", kaili: "Warnanya cerah berpadu dengan Baju Nggembe!", indonesia: "Perpaduan warnanya sangat serasi dengan Baju Nggembe!" },
    ],
    quickTips: [
      { icon: "🧵", title: "Harmoni Warna Pesisir", tip: "Baju Nggembe kuning kunyit atau merah marun berpadu sempurna dengan motif sarung Buya Sabe gelap bersulam emas." },
      { icon: "✨", title: "Lipatan Siga Tegak", tip: "Ujung lipatan Siga pria yang tegak melambangkan pendirian yang kokoh dan tanggung jawab moral." },
    ],
  },
  5: {
    label: "BAGIAN 2, UNIT 5",
    title: "Etika Bertamu Lanjutan",
    subtitle: "Tata gerak melintas di depan tetua dan etika zona ruang rumah panggung Souraja.",
    keyPhrases: [
      { term: "Tabe roa", meaning: "Permisi lewat di hadapan tetua", context: "Diuapkan sambil membungkukkan badan saat melintas.", phonetic: "ta-be ro-a" },
      { term: "Gandaria", meaning: "Serambi tamu depan Souraja", context: "Ruang terbuka menyambut tamu sebelum dipersilakan masuk.", phonetic: "gan-da-ri-a" },
      { term: "Lolonga", meaning: "Lorong / jalur tengah", context: "Jalur penghubung serambi depan dengan ruang musyawarah.", phonetic: "lo-long-a" },
    ],
    dialogue: [
      { speaker: "Tamu", avatar: "🙋‍♂️", role: "Tamu Santun", kaili: "Tabe roa... (tangan kanan menjulur ke bawah)", indonesia: "Permisi lewat... (badan membungkuk hormat di depan para tetua)." },
      { speaker: "Tetua", avatar: "👴", role: "Tuan Rumah Souraja", kaili: "Iyo roa, mari masuk ke Gandaria.", indonesia: "Iya nak, silakan naik dan istirahat di serambi depan." },
    ],
    quickTips: [
      { icon: "🚶‍♂️", title: "Gerak Melintas Santun", tip: "Condongkan bahu ke depan, julurkan tangan kanan ke arah bawah, dan langkahkan kaki dengan tenang tanpa hentakan." },
      { icon: "🏛️", title: "Adab Serambi Gandaria", tip: "Tamu tidak langsung melangkah ke ruang dalam keluarga Souraja sebelum dipersilakan duduk di serambi Gandaria." },
    ],
  },
  6: {
    label: "BAGIAN 3, UNIT 6",
    title: "Nilai & Tradisi Komunal",
    subtitle: "Menghayati falsafah persaudaraan Nosarara Nosabatutu dan pesta syukur panen Padungku.",
    keyPhrases: [
      { term: "Nosarara Nosabatutu", meaning: "Kita Bersaudara, Kita Bersatu", context: "Falsafah agung persatuan masyarakat Sulawesi Tengah.", phonetic: "no-sa-ra-ra no-sa-ba-tu-tu" },
      { term: "Padungku", meaning: "Pesta syukur panen bersama", context: "Tradisi silaturahmi memasak dan berbagi hasil panen ke tetangga.", phonetic: "pa-dung-ku" },
      { term: "Sintuwu Maroso", meaning: "Persatuan yang kokoh erat", context: "Semangat kebersamaan yang tak lekang oleh zaman.", phonetic: "sin-tu-wu ma-ro-so" },
    ],
    dialogue: [
      { speaker: "Warga", avatar: "👩‍🌾", role: "Tuan Rumah Padungku", kaili: "Mari makan bersama, ini rezeki panen kita!", indonesia: "Mari singgah makan bersama keluarga kami, ini wujud syukur panen melimpah!" },
      { speaker: "Tamu", avatar: "🙋‍♂️", role: "Sahabat Komunitas", kaili: "Nosarara Nosabatutu! Terima kasih atas kehangatannya.", indonesia: "Kita semua bersaudara satu ikatan! Terima kasih atas kebaikan hatinya." },
    ],
    quickTips: [
      { icon: "🌾", title: "Filosofi Berbagi Padungku", tip: "Pesta panen Padungku bukan sekadar makan-makan, melainkan perekat silaturahmi antarwarga tanpa membeda-bedakan latar belakang." },
      { icon: "❤️", title: "Menghidupkan Nosarara Tiap Hari", tip: "Gotong royong membersihkan parit dan saling menjenguk tetangga sakit adalah wujud nyata menghidupkan Nosarara." },
    ],
  },
};

function getNodeStatus(node: PathNode, progress: UserProgress): NodeStatus {
  // If unit itself is locked, all its nodes are locked
  if (!isUnitUnlocked(node.unitId, progress.completedLessons)) {
    return "locked";
  }

  // 1. Tipe Lesson
  if (node.type === "lesson" && typeof node.lessonId === "number") {
    if (progress.completedLessons.includes(node.lessonId)) {
      return "completed";
    }
    const unlocked = isLessonUnlocked(
      node.lessonId,
      progress.completedLessons,
      progress.unlockedLessons
    );
    return unlocked ? "active" : "locked";
  }

  // 2. Tipe Chest (Peti Reward)
  if (node.type === "chest") {
    if (node.prereqLessonId && progress.completedLessons.includes(node.prereqLessonId)) {
      return "completed";
    }
    return "locked";
  }

  // 3. Tipe Review / Milestone Badge
  if (node.type === "review") {
    // Prasyarat pelajaran HARUS sudah selesai terlebih dahulu
    if (node.prereqLessonId && !progress.completedLessons.includes(node.prereqLessonId)) {
      return "locked";
    }
    if (node.id === "cc-1" && progress.cultureConnectionClaimed) {
      return "completed";
    }
    if (node.badgeTitle && progress.badges.includes(node.badgeTitle)) {
      return "completed";
    }
    if (node.prereqLessonId && progress.completedLessons.includes(node.prereqLessonId)) {
      return "active";
    }
    return "locked";
  }

  return "locked";
}

function NodeIcon({ node, status = "locked" }: { node: PathNode; status?: NodeStatus }) {
  if (status === "completed") {
    return <Check className="h-8 w-8 stroke-[3.5] text-on-primary" />;
  }
  if (status === "locked") {
    return <Lock className="h-7 w-7 text-outline" />;
  }
  // status === "active"
  if (String(node.id).startsWith("curator-")) {
    return <Gamepad2 className="h-8 w-8 text-on-primary" />;
  }
  if (node.type === "chest") {
    return <Gift className="h-8 w-8 text-on-primary" />;
  }
  if (node.type === "review" || String(node.id).startsWith("badge-")) {
    return <Award className="h-8 w-8 text-on-primary" />;
  }
  if (node.lessonId === 1 || node.lessonId === 7 || node.lessonId === 8) {
    return <BookOpen className="h-8 w-8 text-on-primary" />;
  }
  if (node.lessonId === 2 || node.lessonId === 9 || node.lessonId === 10) {
    return <Shirt className="h-8 w-8 text-on-primary" />;
  }
  if (node.lessonId === 3 || node.lessonId === 11 || node.lessonId === 12) {
    return <Landmark className="h-8 w-8 text-on-primary" />;
  }
  if (node.lessonId === 16 || node.lessonId === 17) {
    return <Volume2 className="h-8 w-8 text-on-primary" />;
  }
  return <Star className="h-8 w-8 fill-current text-on-primary" />;
}

// Offset horizontal meliuk simetris kiri–kanan berirama
const SINE_OFFSETS_DESKTOP = [0, 40, 70, 40, 0, -40, -70, -40];
const SINE_OFFSETS_MOBILE = [0, 24, 42, 24, 0, -24, -42, -24];

function getCatmullRomSegments(pts: { x: number; y: number }[]): string[] {
  if (pts.length < 2) return [];
  const segments: string[] = [];

  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];

    const p0 = i > 0 ? pts[i - 1] : { x: p1.x - (p2.x - p1.x) * 0.5, y: p1.y - (p2.y - p1.y) * 0.5 };
    const p3 = i < pts.length - 2 ? pts[i + 2] : { x: p2.x + (p2.x - p1.x) * 0.5, y: p2.y + (p2.y - p1.y) * 0.5 };

    const k = 1 / 6;
    const cp1x = p1.x + (p2.x - p0.x) * k;
    const cp1y = p1.y + (p2.y - p0.y) * k;
    const cp2x = p2.x - (p3.x - p1.x) * k;
    const cp2y = p2.y - (p3.y - p1.y) * k;

    segments.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }
  return segments;
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [curatorNodes, setCuratorNodes] = useState<PathNode[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionTitles, setSessionTitles] = useState<Record<string, { title: string; xp: number }>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleUnitId, setVisibleUnitId] = useState<number>(1);
  const [guidebookUnit, setGuidebookUnit] = useState<number | null>(null);
  const [guidebookTab, setGuidebookTab] = useState<"frasa" | "dialog" | "tips" | "korpus">("frasa");
  const [corpusEntries, setCorpusEntries] = useState<Array<{
    id: string;
    term: string;
    type: string;
    category: string;
    ipa?: string;
    chapter: string;
    module: string;
    source: string;
    informant?: string;
    status: "verified" | "pending" | "disputed" | "draft";
  }>>([]);

  const reloadCorpusEntries = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("laras_cms_entries");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCorpusEntries(parsed);
          return;
        }
      }
    } catch {}

    fetch("/api/content/entries", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setCorpusEntries(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    reloadCorpusEntries();
    window.addEventListener("storage", reloadCorpusEntries);
    return () => window.removeEventListener("storage", reloadCorpusEntries);
  }, []);

  useEffect(() => {
    if (guidebookUnit !== null) {
      reloadCorpusEntries();
    }
  }, [guidebookUnit]);

  const unitVerifiedEntries = useMemo(() => {
    if (guidebookUnit === null) return [];
    const unitNum = guidebookUnit;
    return corpusEntries.filter((entry) => {
      if (entry.status !== "verified") return false;
      const ch = (entry.chapter || "").toLowerCase();
      const mod = (entry.module || "").toLowerCase();
      return ch.includes(`bab ${unitNum}`) || mod.includes(`modul ${unitNum}`);
    });
  }, [corpusEntries, guidebookUnit]);
  const [playingTerm, setPlayingTerm] = useState<string | null>(null);
  const [playingNativeAudio, setPlayingNativeAudio] = useState<string | null>(null);
  const nativeAudioRef = useRef<HTMLAudioElement | null>(null);

  const playNativeAudio = (id: "yaku" | "sampesuvu", src: string) => {
    if (typeof window === "undefined") return;
    try {
      if (nativeAudioRef.current) {
        nativeAudioRef.current.pause();
        nativeAudioRef.current.currentTime = 0;
      }
      if (playingNativeAudio === id) {
        setPlayingNativeAudio(null);
        return;
      }
      const audio = new Audio(src);
      nativeAudioRef.current = audio;
      setPlayingNativeAudio(id);
      audio.onended = () => {
        setPlayingNativeAudio(null);
      };
      audio.onerror = () => {
        setPlayingNativeAudio(null);
      };
      audio.play().catch((err) => {
        console.warn("Gagal memutar rekaman asli:", err);
        setPlayingNativeAudio(null);
      });
    } catch {
      setPlayingNativeAudio(null);
    }
  };

  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 0.85;
        utterance.onstart = () => setPlayingTerm(text);
        utterance.onend = () => setPlayingTerm(null);
        utterance.onerror = () => setPlayingTerm(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setPlayingTerm(null);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 240);

      // Deteksi unit yang sedang aktif di viewport atas
      const unitIds: UnitId[] = [1, 2, 3, 4, 5, 6];
      for (const uId of unitIds) {
        const el = document.getElementById(`unit-section-${uId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 120) {
            setVisibleUnitId(uId);
            break;
          }
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const cached = getCachedSessionSync();
    let activeEmail = cached?.email || "";
    if (cached) {
      setEmail(cached.email);
      setUserName(cached.name || "");
      setProgress(readProgress(cached.email));
      const seen = typeof window !== "undefined" && window.localStorage.getItem(`laras.onboarding.${cached.email}`) === "done";
      setHasSeenOnboarding(seen);
      setIsLoaded(true);
    }

    getSession().then(async (session) => {
      if (!session) {
        setIsLoaded(true);
        return;
      }
      activeEmail = session.email;
      setEmail(session.email);
      setUserName(session.name || "");
      const seen = typeof window !== "undefined" && window.localStorage.getItem(`laras.onboarding.${session.email}`) === "done";
      setHasSeenOnboarding(seen);
      const local = readProgress(session.email);
      setProgress(local);
      setIsLoaded(true);
      const remote = await loadProgress(session.email);
      setProgress(remote);
    });

    const onProgressUpdated = () => {
      if (activeEmail) {
        setProgress(readProgress(activeEmail));
      }
    };
    window.addEventListener("laras-progress-updated", onProgressUpdated);

    const updateNodes = () => {
      try {
        const stored = getStoredSessions();
        const custom = stored.filter((s) => !BUILTIN_SESSION_IDS.has(s.id) && s.status !== "draft");
        const offsets: ("right" | "center" | "left")[] = ["right", "center", "left"];
        const dynamic: PathNode[] = custom.map((s, idx) => ({
          id: `curator-${s.id}`,
          unitId: 1,
          title: s.title || "Sesi Kurator",
          subtitle: "Sesi Kurator • Game Engine",
          href: `/dashboard/belajar/${s.id}`,
          type: "lesson",
          xp: s.xpReward || 30,
          offset: offsets[idx % offsets.length],
          status: "active",
        }));
        setCuratorNodes(dynamic);

        const titleMap: Record<string, { title: string; xp: number }> = {};
        stored.forEach((s) => {
          if (["1", "2", "3"].includes(s.id)) {
            titleMap[s.id] = { title: s.title, xp: s.xpReward || 30 };
          }
        });
        setSessionTitles(titleMap);
      } catch (err) {
        console.error("Gagal membaca sesi kurator:", err);
      }
    };

    updateNodes();
    window.addEventListener("laras-sessions-updated", updateNodes);

    syncSessionsFromServer().catch(() => {});
    return () => {
      window.removeEventListener("laras-progress-updated", onProgressUpdated);
      window.removeEventListener("laras-sessions-updated", updateNodes);
    };
  }, []);

  useEffect(() => {
    if (!email) return;
    const refresh = () => setProgress(readProgress(email));
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, [email]);

  const handleDismissOnboarding = () => {
    if (typeof window !== "undefined") {
      const key = email ? `laras.onboarding.${email}` : "laras.onboarding.default";
      window.localStorage.setItem(key, "done");
    }
    setHasSeenOnboarding(true);
  };

  const handleStartTour = () => {
    setTourStep(1);
  };

  useEffect(() => {
    const onStartTour = () => {
      handleStartTour();
    };
    window.addEventListener("laras-start-tour", onStartTour);
    return () => window.removeEventListener("laras-start-tour", onStartTour);
  }, []);

  const handleCloseTour = () => {
    handleDismissOnboarding();
    setTourStep(null);
  };

  const handleStartFirstLesson = () => {
    handleDismissOnboarding();
    setTourStep(null);
    window.location.href = "/dashboard/latihan/1";
  };

  // Komputasi status & posisi node untuk seluruh 6 Unit
  const containerWidth = isMobile ? 320 : 480;
  const centerX = containerWidth / 2;
  const stepY = 104;
  const startY = 56;
  const offsets = isMobile ? SINE_OFFSETS_MOBILE : SINE_OFFSETS_DESKTOP;

  const unitRoadmaps = useMemo(() => {
    const result: Record<
      number,
      {
        nodes: (PathNode & { x: number; y: number; offsetVal: number })[];
        fullPathD: string;
        progressPathD: string;
        totalHeight: number;
      }
    > = {};

    let globalOffsetIndex = 0;

    ([1, 2, 3, 4, 5, 6] as UnitId[]).forEach((unitId) => {
      const baseList = UNIT_NODES[unitId] || [];
      const nodesWithStatus = baseList.map((node) => {
        let title = node.title;
        let xp = node.xp;
        if (node.id === 1 && sessionTitles["1"]) {
          title = sessionTitles["1"].title;
          xp = sessionTitles["1"].xp;
        } else if (node.id === 2 && sessionTitles["2"]) {
          title = sessionTitles["2"].title;
          xp = sessionTitles["2"].xp;
        } else if (node.id === 3 && sessionTitles["3"]) {
          title = sessionTitles["3"].title;
          xp = sessionTitles["3"].xp;
        }
        return {
          ...node,
          title,
          xp,
          status: getNodeStatus(node, progress),
        };
      });

      const positioned = nodesWithStatus.map((node, i) => {
        const offset = offsets[globalOffsetIndex % offsets.length];
        globalOffsetIndex++;
        const x = centerX + offset;
        const y = startY + i * stepY;
        return {
          ...node,
          x,
          y,
          offsetVal: offset,
        };
      });

      const pts = positioned.map((n) => ({ x: n.x, y: n.y }));
      const segments = getCatmullRomSegments(pts);
      const fullPathD =
        pts.length >= 2
          ? `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ` + segments.join(" ")
          : "";

      // Jalur warna progress hanya bergerak berurutan dari awal
      // Begitu bertemu node 'locked', jalur warna tidak boleh melompati atau menembus gembok
      let progressLimit = 0;
      for (let i = 0; i < positioned.length; i++) {
        const s = positioned[i].status;
        if (s === "completed") {
          progressLimit = i;
        } else if (s === "active") {
          progressLimit = i;
          break; // Berhenti di node aktif
        } else {
          // Node terkunci (locked): hentikan jalur progress
          break;
        }
      }
      progressLimit = Math.max(0, Math.min(segments.length, progressLimit));

      const progressSegs = segments.slice(0, progressLimit);
      const progressPathD =
        progressSegs.length > 0
          ? `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ` + progressSegs.join(" ")
          : "";

      const totalHeight =
        positioned.length > 0 ? positioned[positioned.length - 1].y + 60 : 400;

      result[unitId] = {
        nodes: positioned,
        fullPathD,
        progressPathD,
        totalHeight,
      };
    });

    return result;
  }, [progress, sessionTitles, isMobile, offsets, centerX]);

  // Cari Node Aktif secara Global (Lintas Seluruh 6 Unit)
  const allNodesFlat = useMemo(() => {
    return ([1, 2, 3, 4, 5, 6] as UnitId[]).flatMap(
      (uId) => unitRoadmaps[uId]?.nodes || []
    );
  }, [unitRoadmaps]);

  // P5: Prioritaskan pelajaran inti terlebih dahulu, pengayaan jika seluruh inti aktif tidak ada
  const activeNode =
    allNodesFlat.find((n) => n.status === "active" && !n.isEnrichment) ||
    allNodesFlat.find((n) => n.status === "active") ||
    allNodesFlat[allNodesFlat.length - 1] ||
    unitRoadmaps[1]?.nodes[0];

  const activeUnitId = activeNode?.unitId || (visibleUnitId as UnitId) || 1;
  const currentUnitTheme = UNIT_THEMES[visibleUnitId] || UNIT_THEMES[1];
  const activeUnitTheme = UNIT_THEMES[activeUnitId] || UNIT_THEMES[1];

  const todayStr = new Date().toISOString().slice(0, 10);
  const dailyXpToday = progress.dailyXpLog?.[todayStr] || 0;
  const dailyXp = Math.min(dailyXpToday, 50);
  const all15Completed = progress.completedLessons.length >= 15;
  const activeUnitProgress = getUnitProgress(activeUnitId, progress.completedLessons);

  // Cari Cap Paspor berikutnya yang belum diraih
  const nextBadge = useMemo(() => {
    return CANONICAL_BADGES.find((b) => b.isUnitCloser && !progress.badges.includes(b.title));
  }, [progress.badges]);

  return (
    <main className="min-h-screen bg-surface px-4 py-4 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 3-Zone Layout: Left Sidebar (Fixed) | Center Scroll | Right Rail (Sticky) */}
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] items-start">
          {/* Kolom Tengah (Terpusat, Maksimal 560px) */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[560px]">

              {/* 1. UNIT HEADER BANNER (Sticky Saat Scroll ala Duolingo) */}
              <div className="sticky top-20 z-20 pt-2 pb-4 bg-surface/95 backdrop-blur-sm -mt-2">
                <div
                  onClick={() => {
                    const el = document.getElementById(`unit-section-${visibleUnitId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else {
                      scrollToTop();
                    }
                  }}
                  style={{
                    backgroundColor: currentUnitTheme.bgColor,
                    boxShadow: `0 4px 0 0 ${currentUnitTheme.shadowColor}`,
                  }}
                  className="rounded-2xl px-5 py-4 text-white flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer select-none"
                  title="Klik untuk ke posisi unit ini"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/90">
                      <span>{currentUnitTheme.label}</span>
                      {UNITS[visibleUnitId as UnitId]?.status === "DATA_DEMO" && (
                        <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-bold">
                          DATA DEMO
                        </span>
                      )}
                    </div>
                    <h1 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5 truncate">
                      {currentUnitTheme.title}
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuidebookUnit(visibleUnitId);
                    }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: `0 3px 0 0 ${currentUnitTheme.shadowColor}`,
                    }}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-white/40 text-white font-black text-xs uppercase tracking-wider hover:bg-white/30 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
                    title={`Buku Panduan Unit ${visibleUnitId}`}
                  >
                    <BookOpen className="w-4 h-4 stroke-[2.5]" />
                    <span>PANDUAN</span>
                  </button>
                </div>
              </div>

              {/* 2. SATU KARTU DOMINAN (Hanya Satu Tombol Utama di Atas Layar) */}
              {!isLoaded ? (
                <section className="relative overflow-hidden rounded-3xl bg-surface-container-high px-5 py-5 mb-8 animate-pulse border-2 border-outline-variant/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-outline-variant/50" />
                      <div className="h-5 w-48 rounded bg-outline-variant/60" />
                      <div className="h-3 w-64 rounded bg-outline-variant/40" />
                    </div>
                    <div className="h-10 w-28 rounded-full bg-outline-variant/50" />
                  </div>
                </section>
              ) : progress.completedLessons.length === 0 ? (
                /* Pengguna Baru: Kartu Pelajaran Pertama */
                <section className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest p-5 sm:p-6 shadow-md mb-8 transition-all">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
                            Unit 1 • Sulawesi Tengah
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md shrink-0">
                            <MapPin className="h-3 w-3 text-primary" />
                            Kaili
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 fill-current" />
                            <span>Pelajaran Pertama</span>
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                          Salam &amp; Adab Tabe
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-semibold leading-relaxed">
                          Tujuan: Setelah pelajaran ini, kamu bisa menyapa dan mempraktikkan adab santun Tabe dalam budaya Kaili.
                        </p>
                        <p className="mt-1 text-xs text-primary font-bold">
                          ±3 menit · 5 soal · +20 XP
                        </p>
                      </div>

                      {!hasSeenOnboarding && (
                        <button
                          type="button"
                          onClick={handleDismissOnboarding}
                          className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
                          title="Tutup Panduan"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {!hasSeenOnboarding && (
                      <p className="text-xs text-on-surface-variant font-medium pt-2 border-t border-outline-variant/20">
                        Selamat datang di LARAS, {userName || "Sahabat Budaya"}! Ini peta belajarmu. Tekan Mulai Pelajaran untuk langsung membuka soal pertama.
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <Link
                        href="/dashboard/latihan/1"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Mulai Pelajaran</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      {!hasSeenOnboarding && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={handleStartTour}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs transition cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-primary" />
                            <span>Panduan singkat</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDismissOnboarding}
                            className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                          >
                            Lewati
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ) : all15Completed ? (
                /* Pengguna yang Sudah Menuntaskan Seluruh 6 Unit */
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-container px-5 py-4 text-on-primary shadow-[0_5px_0_0_#881f00] mb-8">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary-fixed">
                        Seluruh 6 Unit Tuntas • Sempurna
                      </p>
                      <h2 className="text-lg font-black tracking-tight truncate mt-0.5">
                        Selamat! Kamu Penjaga Nosarara Sejati
                      </h2>
                      <p className="text-xs font-semibold text-primary-fixed/90 truncate">
                        Koleksi Paspor Lengkap • 15 Pelajaran Selesai
                      </p>
                    </div>
                    <Link
                      href="/dashboard/paspor"
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-surface px-5 py-2.5 text-xs font-black text-primary shadow-[0_2px_0_0_#ffdbd1] transition hover:bg-surface-container"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Buka Paspor</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-primary-container/40 pointer-events-none" />
                </section>
              ) : (
                /* Pengguna yang Sedang Berprogres: Kartu Lanjutkan Unit Aktif */
                <section className="relative overflow-hidden rounded-3xl bg-primary px-5 py-4 text-on-primary shadow-[0_5px_0_0_#881f00] mb-8">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary-fixed">
                        {activeUnitTheme.label} • Lanjutkan dari terakhir · {Math.round(activeUnitProgress * 100)}%
                      </p>
                      <h2 className="text-lg font-black tracking-tight truncate mt-0.5">
                        {activeNode.title}
                      </h2>
                      <p className="text-xs font-semibold text-primary-fixed/90 truncate">
                        {activeNode.subtitle} • +{activeNode.xp} XP
                      </p>
                    </div>
                    <Link
                      href={activeNode.href}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-surface px-5 py-2.5 text-xs font-black text-primary shadow-[0_2px_0_0_#ffdbd1] transition hover:bg-surface-container active:translate-y-0.5 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Lanjutkan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-primary-container/40 pointer-events-none" />
                </section>
              )}

              {/* 3. CONTINUOUS ROADMAP (MODEL A + BANNER PEMISAH UNIT) */}
              <div id="tour-roadmap" className="w-full space-y-12">
                {([1, 2, 3, 4, 5, 6] as UnitId[]).map((unitId) => {
                  const unit = UNITS[unitId];
                  const unitTheme = UNIT_THEMES[unitId] || UNIT_THEMES[1];
                  const isUnlocked = isUnitUnlocked(unitId, progress.completedLessons);
                  const isCompleted = isUnitCompleted(unitId, progress.completedLessons);
                  const roadmapData = unitRoadmaps[unitId];
                  if (!roadmapData) return null;

                  return (
                    <div
                      key={`unit-sec-${unitId}`}
                      id={`unit-section-${unitId}`}
                      className="w-full scroll-mt-28"
                    >
                      {/* Showcase Suara Asli Penutur di bagian paling atas Unit 1 */}
                      {unitId === 1 && (
                        <div className="mb-6 rounded-3xl bg-surface-container-lowest border-2 border-primary/20 p-4 sm:p-5 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <Volume2 className="h-3.5 w-3.5 stroke-[2.5]" />
                                </span>
                                <h3 className="text-base font-black tracking-tight text-on-surface">
                                  Suara Asli Penutur
                                </h3>
                                <span className="rounded-full bg-secondary-fixed/50 px-2 py-0.5 text-[10px] font-black text-on-secondary-fixed border border-secondary/30">
                                  Rekaman Asli
                                </span>
                              </div>
                              <p className="mt-1 text-xs font-semibold text-primary">
                                Rekaman penutur asli Kaili — Claudya (Tim Buras)
                              </p>
                              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                                Kata-kata ini kamu latih lebih lanjut di Latihan Mendengar, Unit 2.
                              </p>
                            </div>
                          </div>

                          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Tombol Yaku */}
                            <button
                              type="button"
                              onClick={() => playNativeAudio("yaku", "/audio/latihan-mendengar-1/yaku.mp3")}
                              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                playingNativeAudio === "yaku"
                                  ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                                  : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30 hover:border-primary/40"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                                  playingNativeAudio === "yaku"
                                    ? "bg-primary text-on-primary animate-pulse"
                                    : "bg-primary/10 text-primary"
                                }`}>
                                  <Volume2 className="h-4 w-4 stroke-[2.5]" />
                                </span>
                                <div className="text-left">
                                  <span className="text-sm font-black text-on-surface block">
                                    &ldquo;Yaku&rdquo;
                                  </span>
                                  <span className="text-[10px] font-medium text-on-surface-variant">
                                    Rekaman Asli • ±2 dtk
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-primary uppercase tracking-wider">
                                {playingNativeAudio === "yaku" ? "Memutar..." : "Putar"}
                              </span>
                            </button>

                            {/* Tombol Sampesuvu */}
                            <button
                              type="button"
                              onClick={() => playNativeAudio("sampesuvu", "/audio/latihan-mendengar-2/sampesuvu.mp3")}
                              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                playingNativeAudio === "sampesuvu"
                                  ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                                  : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30 hover:border-primary/40"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                                  playingNativeAudio === "sampesuvu"
                                    ? "bg-primary text-on-primary animate-pulse"
                                    : "bg-primary/10 text-primary"
                                }`}>
                                  <Volume2 className="h-4 w-4 stroke-[2.5]" />
                                </span>
                                <div className="text-left">
                                  <span className="text-sm font-black text-on-surface block">
                                    &ldquo;Sampesuvu&rdquo;
                                  </span>
                                  <span className="text-[10px] font-medium text-on-surface-variant">
                                    Rekaman Asli • ±2 dtk
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-primary uppercase tracking-wider">
                                {playingNativeAudio === "sampesuvu" ? "Memutar..." : "Putar"}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Banner Pemisah Unit hanya untuk Unit 2-6 (Unit 1 sudah memiliki Banner di atas) */}
                      {unitId > 1 && (
                        <div
                          style={{
                            backgroundColor: isUnlocked ? unitTheme.bgColor : "#6b7280",
                            boxShadow: `0 4px 0 0 ${isUnlocked ? unitTheme.shadowColor : "#4b5563"}`,
                          }}
                          className={`rounded-2xl px-5 py-4 text-white flex items-center justify-between gap-4 transition-all duration-300 select-none mb-6 mt-10 ${
                            !isUnlocked ? "opacity-90 grayscale-[0.2]" : ""
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap text-[11px] font-black uppercase tracking-[0.14em] text-white/90">
                              <span>{unit.label}</span>
                              {unit.status === "DATA_DEMO" && (
                                <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-extrabold">
                                  DATA DEMO
                                </span>
                              )}
                              {!isUnlocked && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/30 text-white text-[10px] font-extrabold">
                                  <Lock className="w-3 h-3" />
                                  Terkunci
                                </span>
                              )}
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-extrabold">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  Tuntas
                                </span>
                              )}
                            </div>
                            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                              {unit.title}
                            </h2>
                            <p className="text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
                              {isUnlocked
                                ? unit.subtitle
                                : `Selesaikan Unit ${unitId - 1} terlebih dahulu untuk membuka`}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setGuidebookUnit(unitId)}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              boxShadow: `0 3px 0 0 ${isUnlocked ? unitTheme.shadowColor : "#4b5563"}`,
                            }}
                            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border-2 border-white/40 text-white font-black text-xs uppercase tracking-wider hover:bg-white/30 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
                            title={`Buku Panduan Unit ${unitId}`}
                          >
                            <BookOpen className="w-4 h-4 stroke-[2.5]" />
                            <span className="hidden sm:inline">PANDUAN</span>
                          </button>
                        </div>
                      )}

                      {/* Roadmap Canvas untuk Unit ini */}
                      <div
                        className="relative mx-auto transition-all duration-300 rounded-3xl"
                        style={{
                          width: `${containerWidth}px`,
                          height: `${roadmapData.totalHeight}px`,
                        }}
                      >
                        {/* SVG Jalur Catmull-Rom Mulus */}
                        <svg
                          className="absolute inset-0 pointer-events-none z-0"
                          viewBox={`0 0 ${containerWidth} ${roadmapData.totalHeight}`}
                          style={{
                            width: `${containerWidth}px`,
                            height: `${roadmapData.totalHeight}px`,
                          }}
                        >
                          {roadmapData.fullPathD && (
                            <path
                              d={roadmapData.fullPathD}
                              fill="none"
                              stroke="#d8c7be"
                              strokeWidth={7}
                              strokeDasharray="8 9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                          {isUnlocked && roadmapData.progressPathD && (
                            <path
                              d={roadmapData.progressPathD}
                              fill="none"
                              stroke={unitTheme.shadowColor}
                              strokeWidth={7}
                              strokeDasharray="8 9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>

                        {/* Node-node Lingkaran Faux-3D */}
                        {roadmapData.nodes.map((node) => {
                          const isActive = node.status === "active";
                          const isPrimaryActive = node.id === activeNode?.id;
                          const isLocked = node.status === "locked";
                          const isCompleted = node.status === "completed";

                          return (
                            <div
                              key={String(node.id)}
                              style={{ left: `${node.x}px`, top: `${node.y}px` }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                              onMouseEnter={() => setHoveredNodeId(node.id)}
                              onMouseLeave={() => setHoveredNodeId(null)}
                              onFocus={() => setHoveredNodeId(node.id)}
                              onBlur={() => setHoveredNodeId(null)}
                            >
                              {/* Balon Mengambang "MULAI" */}
                              {isPrimaryActive && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 animate-bounce motion-reduce:animate-none">
                                  <div
                                    style={{
                                      backgroundColor: unitTheme.bgColor,
                                      boxShadow: `0 3px 0 0 ${unitTheme.shadowColor}`,
                                    }}
                                    className="relative px-3 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider whitespace-nowrap flex items-center gap-1 select-none"
                                  >
                                    <span>MULAI</span>
                                    <span
                                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px]"
                                      style={{ borderTopColor: unitTheme.bgColor }}
                                      aria-hidden="true"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Cincin Progres Aktif */}
                              {isPrimaryActive && (
                                <svg
                                  className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] -rotate-90 pointer-events-none"
                                  viewBox="0 0 100 100"
                                >
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke={unitTheme.bgColor}
                                    strokeOpacity="0.25"
                                    strokeWidth="5"
                                  />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke={unitTheme.bgColor}
                                    className="transition-all duration-500"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray={276.46}
                                    strokeDashoffset={276.46 * (1 - activeUnitProgress)}
                                  />
                                </svg>
                              )}

                              {/* Tombol Node */}
                              {isLocked ? (
                                <div
                                  tabIndex={0}
                                  aria-label={`${node.title} (Terkunci)`}
                                  className="flex h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] items-center justify-center rounded-full bg-surface-container-high text-outline shadow-[0_5px_0_0_#c0b8c4] cursor-not-allowed select-none border-4 border-surface"
                                >
                                  <NodeIcon node={node} status={node.status} />
                                </div>
                              ) : (
                                <div className="relative">
                                  <Link
                                    id={node.id === 1 ? "tour-first-lesson" : undefined}
                                    href={node.href}
                                    aria-label={`${node.title} (${isCompleted ? "Selesai" : "Mulai"})`}
                                    style={{
                                      backgroundColor: isCompleted
                                        ? unitTheme.bgColor
                                        : unitTheme.bgColor,
                                      boxShadow: isCompleted
                                        ? `0 5px 0 0 ${unitTheme.shadowColor}`
                                        : `0 6px 0 0 ${unitTheme.shadowColor}`,
                                    }}
                                    className={`flex h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] items-center justify-center rounded-full border-4 border-surface text-white transition-all select-none active:translate-y-[2px] hover:brightness-105 ${
                                      node.id === 1 && progress.completedLessons.length === 0
                                        ? "ring-4 ring-primary-fixed-dim/80 ring-offset-2 animate-pulse motion-reduce:animate-none"
                                        : ""
                                    }`}
                                  >
                                    <NodeIcon node={node} status={node.status} />
                                  </Link>
                                </div>
                              )}

                              {/* Visible Pill for Touch / Mobile / Accessibility */}
                              {node.isEnrichment ? (
                                <div className="mt-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-black text-[10px] whitespace-nowrap shadow-2xs select-none">
                                  P.{node.id} • Pengayaan
                                </div>
                              ) : node.type === "lesson" && typeof node.id === "number" ? (
                                <div className="mt-1 px-1.5 py-0.2 rounded-full text-on-surface-variant font-bold text-[10px] whitespace-nowrap select-none opacity-75">
                                  Pelajaran {node.id}
                                </div>
                              ) : null}

                              {/* Tooltip Hover / Focus */}
                              <div
                                className={`absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 z-30 transition-all duration-200 pointer-events-none ${
                                  hoveredNodeId === node.id
                                    ? "opacity-100 translate-y-0 scale-100"
                                    : "opacity-0 translate-y-1 scale-95"
                                }`}
                              >
                                <div className="w-56 sm:w-64 rounded-2xl bg-surface-container-lowest p-3.5 shadow-xl border-2 border-outline-variant/40 text-center flex flex-col items-center">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    {isCompleted && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        Selesai ✓
                                      </span>
                                    )}
                                    {isActive && (
                                      <span
                                        style={{ backgroundColor: unitTheme.bgColor }}
                                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                                      >
                                        Misi Aktif
                                      </span>
                                    )}
                                    {isLocked && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high text-outline">
                                        Terkunci
                                      </span>
                                    )}
                                    {node.subtitle?.includes("Pengayaan") && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30">
                                        Pengayaan
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-black text-on-surface line-clamp-1">
                                    {node.title}
                                  </p>
                                  <p className="text-xs font-semibold text-on-surface-variant mt-0.5">
                                    {node.subtitle} • +{node.xp} XP
                                  </p>
                                  <p className="text-[11px] font-bold mt-2 pt-2 border-t border-outline-variant/20 w-full text-center">
                                    {isActive && (
                                      <span
                                        style={{ color: unitTheme.bgColor }}
                                        className="font-black"
                                      >
                                        Klik untuk mulai materi →
                                      </span>
                                    )}
                                    {isCompleted && (
                                      <span className="text-on-surface-variant">
                                        Klik untuk mengulang materi
                                      </span>
                                    )}
                                    {isLocked && (
                                      <span className="text-outline">
                                        Selesaikan pelajaran sebelumnya
                                      </span>
                                    )}
                                  </p>
                                  <span
                                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-surface-container-lowest"
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Sesi Kurator Kustom (Jika Ada) */}
                {curatorNodes.length > 0 && (
                  <div className="w-full pt-6 border-t-2 border-dashed border-outline-variant/40">
                    <div className="rounded-2xl px-5 py-4 bg-surface-container-high border-2 border-outline-variant/30 text-on-surface flex items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          Sesi Tambahan
                        </span>
                        <h3 className="text-base font-black text-on-surface">Materi Kurator Mandiri</h3>
                      </div>
                      <Gamepad2 className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      {curatorNodes.map((cNode) => (
                        <Link
                          key={String(cNode.id)}
                          href={cNode.href}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary/20 hover:border-primary shadow-xs transition w-full max-w-md"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Gamepad2 className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-on-surface truncate">{cNode.title}</h4>
                            <p className="text-xs text-on-surface-variant font-medium">{cNode.subtitle} • +{cNode.xp} XP</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Rail Kanan Sticky */}
          <aside className="space-y-4 xl:sticky xl:top-24 self-start w-full">
            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
              <div className="flex items-center justify-between">
                <h2 className="font-black">Hari ini</h2>
                <Flame className="h-5 w-5 text-primary" />
              </div>
              {isLoaded ? (
                <p className="mt-5 text-3xl font-black">
                  {progress.streak} <span className="text-sm text-on-surface-variant">hari beruntun</span>
                </p>
              ) : (
                <div className="mt-5 h-9 w-28 rounded bg-surface-container-high animate-pulse" />
              )}
              <div className="mt-5 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>Target Harian</span>
                <span>{isLoaded ? `${dailyXp}/50 XP` : "--/50 XP"}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className={`h-full rounded-full bg-secondary transition-all ${!isLoaded ? "animate-pulse bg-outline-variant/50" : ""}`}
                  style={{ width: isLoaded ? `${dailyXp * 2}%` : "30%" }}
                />
              </div>
            </section>

            <section className="rounded-3xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/25">
              <div className="flex items-center justify-between">
                <h2 className="font-black">Status</h2>
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface-container-low p-3 flex flex-col justify-between">
                  <div>
                    <Heart className="h-4 w-4 text-error" />
                    {isLoaded ? (
                      <p className="mt-2 text-lg font-black">{progress.hearts}/3</p>
                    ) : (
                      <div className="mt-2 h-6 w-8 rounded bg-surface-container-high animate-pulse" />
                    )}
                    <p className="text-xs font-bold text-on-surface-variant">nyawa</p>
                  </div>
                  <p className="mt-1 text-[10px] text-on-surface-variant leading-tight">Terisi penuh kembali setiap hari baru</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-3">
                  <Trophy className="h-4 w-4 text-secondary" />
                  {isLoaded ? (
                    <p className="mt-2 text-lg font-black">{progress.xp}</p>
                  ) : (
                    <div className="mt-2 h-6 w-12 rounded bg-surface-container-high animate-pulse" />
                  )}
                  <p className="text-xs font-bold text-on-surface-variant">total XP</p>
                </div>
              </div>
            </section>

            <Link
              href="/dashboard/paspor"
              className="flex items-center justify-between rounded-3xl bg-secondary-fixed p-5 text-on-secondary-fixed transition hover:brightness-95"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em]">Cap Paspor berikutnya</p>
                <p className="mt-1 font-black">{nextBadge ? nextBadge.title : "Koleksi Lengkap"}</p>
                <p className="mt-1 text-xs font-semibold">Buka Paspor</p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </aside>
        </div>

        {/* Strip Logo Munas IX & Permikomnas untuk Mobile */}
        <div className="mt-12 pt-6 border-t border-outline-variant/30 flex md:hidden flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white shadow-xs border border-outline-variant/30">
            <img
              src="/logo-munas-ix.png"
              alt="Logo Munas IX PERMIKOMNAS"
              className="h-8 w-8 object-contain"
            />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
            Munas IX • PERMIKOMNAS RI
          </span>
        </div>
      </div>

      {/* Tur Mini Panduan */}
      {tourStep !== null && (
        <>
          <div
            onClick={handleCloseTour}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 pointer-events-auto"
          />

          <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-50 max-w-md w-auto rounded-3xl bg-surface-container-lowest p-5 sm:p-6 shadow-2xl border-2 border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary">
                Langkah {tourStep} dari 3
              </span>
              <button
                type="button"
                onClick={handleCloseTour}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Tutup Panduan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {tourStep === 1 && (
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight">Peta Belajar</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                  Ini jalur belajarmu. Pelajaran terbuka satu per satu — mulai dari Unit 1 hingga Unit 6.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {tourStep === 2 && (
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight">Menjawab Soal</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                  Tekan pelajaran untuk masuk sesi dan menjawab soal. Jawaban yang tepat memberimu XP; nyawa berkurang kalau salah, dan terisi lagi keesokan hari.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourStep(3)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {tourStep === 3 && (
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight">Paspor Budaya</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                  Cap Paspor dari pelajaran yang kamu selesaikan terkumpul di Paspor Budaya. Cek isinya kapan saja dari sini.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition underline cursor-pointer"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={handleStartFirstLesson}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-on-primary font-black text-xs uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>Mulai Pelajaran</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tombol Balik ke Atas */}
      {showScrollTop && (
        <div className="pointer-events-none fixed left-0 md:left-64 right-0 bottom-20 md:bottom-8 z-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-[560px] flex justify-end">
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest border-2 border-outline-variant/60 text-on-surface font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#d1d5db] dark:shadow-[0_4px_0_0_#374151] hover:bg-surface-container hover:border-primary/50 hover:text-primary active:translate-y-1 active:shadow-none transition-all cursor-pointer group animate-in fade-in zoom-in-95 duration-200"
                    aria-label="Kembali ke atas"
                    title="Kembali ke atas"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                      Ke Atas
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buku Panduan Unit Standar Modern */}
      {guidebookUnit !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[88vh] bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Bersih */}
            <div className="px-6 py-5 border-b border-outline-variant/20 bg-surface flex items-start justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor }}
                  />
                  <span>{(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).label} • Panduan Unit</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-1.5">
                  {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).title}
                </h2>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5 leading-relaxed">
                  {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGuidebookUnit(null)}
                className="shrink-0 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition active:scale-95 cursor-pointer"
                aria-label="Tutup Panduan Unit"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigasi Segmen */}
            <div className="px-6 pt-3.5 pb-2 bg-surface shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 p-1 rounded-2xl bg-surface-container-high text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => setGuidebookTab("frasa")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    guidebookTab === "frasa"
                      ? "bg-surface text-primary shadow-xs font-black"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Frasa &amp; Suara</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuidebookTab("dialog")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    guidebookTab === "dialog"
                      ? "bg-surface text-primary shadow-xs font-black"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Percakapan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuidebookTab("tips")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    guidebookTab === "tips"
                      ? "bg-surface text-primary shadow-xs font-black"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tips Budaya</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuidebookTab("korpus")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    guidebookTab === "korpus"
                      ? "bg-surface text-primary shadow-xs font-black"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Korpus Adat</span>
                  {unitVerifiedEntries.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                      {unitVerifiedEntries.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Konten Panduan Unit */}
            <div className="overflow-y-auto px-6 py-4 space-y-4 text-on-surface">
              {/* Keterangan Pembeda Suara Mesin Pembantu */}
              <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30 flex items-start gap-2.5 text-xs text-on-surface-variant">
                <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-[10px] font-black uppercase tracking-wider text-outline shrink-0 mt-0.5">
                  Suara Mesin Pembantu
                </span>
                <p className="text-[11px] leading-relaxed">
                  Pelafalan di panduan ini disimulasikan oleh <strong>suara mesin pembantu</strong> (TTS browser). Rekaman suara penutur asli manusia tersedia di kartu <strong>Suara Asli Penutur</strong> (Unit 1) dan modul <strong>Latihan Mendengar (Unit 2)</strong>.
                </p>
              </div>

              {guidebookTab === "frasa" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant mb-1">
                    <span>Tekan tombol audio atau baris untuk mendengarkan pelafalan (suara mesin pembantu):</span>
                    <span className="font-extrabold text-primary">
                      {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).keyPhrases.length} Frasa
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).keyPhrases.map((phrase, idx) => {
                      const isPlaying = playingTerm === phrase.term;
                      return (
                        <div
                          key={idx}
                          onClick={() => playAudio(phrase.term)}
                          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group shadow-2xs ${
                            isPlaying
                              ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                              : "bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/30 hover:border-primary/40"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudio(phrase.term);
                            }}
                            className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center transition active:scale-90 ${
                              isPlaying
                                ? "bg-primary text-on-primary animate-pulse"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary"
                            }`}
                            title="Dengarkan Suara (Suara Mesin Pembantu)"
                          >
                            <Volume2 className="w-5 h-5 stroke-[2.5]" />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-on-surface group-hover:text-primary transition-colors">
                                {phrase.term}
                              </span>
                              {phrase.phonetic && (
                                <span className="text-xs font-mono text-outline font-medium">
                                  /{phrase.phonetic}/
                                </span>
                              )}
                              <span className="text-xs font-bold text-primary">
                                • {phrase.meaning}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant font-medium mt-0.5 leading-relaxed">
                              {phrase.context}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {guidebookTab === "dialog" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-on-surface-variant">
                    Simulasi percakapan nyata dalam budaya Kaili (suara mesin pembantu):
                  </div>

                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
                    {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).dialogue.map((line, idx) => {
                      const isLeft = idx % 2 === 0;
                      const isPlaying = playingTerm === line.kaili;
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${isLeft ? "justify-start" : "justify-end flex-row-reverse"}`}
                        >
                          <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-lg shrink-0 shadow-xs">
                            {line.avatar}
                          </div>

                          <div
                            className={`max-w-[80%] rounded-2xl p-3.5 shadow-2xs border ${
                              isLeft
                                ? "bg-surface-container border-outline-variant/40 rounded-tl-xs"
                                : "bg-primary-fixed/30 border-primary/30 rounded-tr-xs"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
                                {line.speaker} • {line.role}
                              </span>
                              <button
                                type="button"
                                onClick={() => playAudio(line.kaili)}
                                className="p-1 rounded-full text-primary hover:bg-primary/10 transition active:scale-90 cursor-pointer"
                                title="Putar dialog (Suara Mesin Pembantu)"
                              >
                                <Volume2 className={`w-3.5 h-3.5 stroke-[2.5] ${isPlaying ? "animate-pulse text-secondary" : ""}`} />
                              </button>
                            </div>
                            <p className="text-sm font-extrabold text-on-surface tracking-tight">
                              &ldquo;{line.kaili}&rdquo;
                            </p>
                            <p className="text-xs font-semibold text-on-surface-variant mt-1 italic">
                              &ldquo;{line.indonesia}&rdquo;
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {guidebookTab === "tips" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-on-surface-variant">
                    Rahasia adat dan kunci penting untuk unit ini:
                  </div>

                  <div className="space-y-2.5">
                    {(UNIT_GUIDEBOOKS[guidebookUnit] || UNIT_GUIDEBOOKS[1]).quickTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-3.5 shadow-2xs hover:border-primary/40 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                          {tip.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-on-surface tracking-tight">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                            {tip.tip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {guidebookTab === "korpus" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant mb-1">
                    <span>Entri korpus budaya terverifikasi untuk unit ini:</span>
                    <span className="font-extrabold text-primary">
                      {unitVerifiedEntries.length} Entri Terverifikasi
                    </span>
                  </div>

                  {unitVerifiedEntries.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                      <BookOpen className="w-8 h-8 text-on-surface-variant/40 mx-auto" />
                      <p className="text-sm font-bold text-on-surface">Belum Ada Entri Korpus Terverifikasi</p>
                      <p className="text-xs text-on-surface-variant">
                        Entri korpus adat untuk bab ini sedang dalam proses kurasi oleh dewan adat.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {unitVerifiedEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs hover:border-primary/40 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base sm:text-lg font-black text-on-surface">
                                  {entry.term}
                                </h3>
                                {entry.ipa && (
                                  <span className="text-xs font-mono text-outline font-medium">
                                    {entry.ipa}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  Terverifikasi
                                </span>
                              </div>
                              <p className="text-xs font-bold text-primary mt-0.5">
                                {entry.type} • {entry.category}
                              </p>
                            </div>

                            {entry.term && (
                              <button
                                type="button"
                                onClick={() => playAudio(entry.term)}
                                className="w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition active:scale-90 shrink-0 cursor-pointer"
                                title="Dengarkan Pelafalan (Suara Mesin Pembantu)"
                              >
                                <Volume2 className="w-4 h-4 stroke-[2.5]" />
                              </button>
                            )}
                          </div>

                          <div className="text-xs text-on-surface-variant space-y-1 pt-2 border-t border-outline-variant/20">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-bold text-on-surface">Target Bab &amp; Modul:</span>
                              <span className="font-semibold text-primary">{entry.chapter} • {entry.module}</span>
                            </div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-bold text-on-surface">Sumber Adat:</span>
                              <span>{entry.source}</span>
                            </div>
                            {entry.informant && (
                              <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="font-bold text-on-surface">Informan / Registrasi:</span>
                                <span className="text-[11px] font-mono">{entry.informant}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-surface border-t border-outline-variant/20 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs font-medium text-on-surface-variant hidden sm:inline">
                Siap mempraktikkan materi ini di latihan?
              </span>
              <button
                type="button"
                onClick={() => setGuidebookUnit(null)}
                style={{
                  backgroundColor: (UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).bgColor,
                  boxShadow: `0 3px 0 0 ${(UNIT_THEMES[guidebookUnit] || UNIT_THEMES[1]).shadowColor}`,
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
              >
                Mengerti, Lanjutkan Belajar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
