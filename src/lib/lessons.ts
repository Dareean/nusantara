export type QuestionType =
  | "choice"
  | "truefalse"
  | "match"
  | "order"
  | "hotspot"
  | "scenario";

export type ChoiceQuestionData = {
  options: { id: string; label: string }[];
  answer: string;
};

export type TrueFalseQuestionData = {
  statement: string;
  answer: boolean;
};

export type MatchQuestionData = {
  pairs: { left: string; right: string }[];
};

export type OrderQuestionData = {
  items: string[];
  answer: string[];
};

export type HotspotQuestionData = {
  imageUrl?: string;
  imageCaption?: string;
  hotspots: {
    id: string;
    label: string;
    description: string;
    top?: string;
    left?: string;
  }[];
  answer: string;
};

export type ScenarioQuestionData = {
  steps: {
    prompt: string;
    choices: { id: string; label: string; score: number }[];
  }[];
  passingScore: number;
};

export type QuestionData =
  | ChoiceQuestionData
  | TrueFalseQuestionData
  | MatchQuestionData
  | OrderQuestionData
  | HotspotQuestionData
  | ScenarioQuestionData;

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  data: QuestionData;
  why: string;
  penjelasan?: string;
  xp: number;
  audioUrl?: string;
};

export type CulturalSource = {
  institution: string;
  informant: string;
  registrationCode: string;
  verifiedDate: string;
  summary: string;
  status?: string;
};

export type Lesson = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  objective?: string;
  concepts?: string[];
  region: string;
  intro: string;
  rewardXp: number;
  badge: string;
  source?: CulturalSource;
  questions: Question[];
};

export const lessons: Lesson[] = [
  {
    id: 1,
    slug: "salam-adab-tabe",
    title: "Salam & Adab Tabe",
    subtitle: "Belajar membuka percakapan dengan hormat",
    objective: "Setelah pelajaran ini, kamu bisa menyapa dan mempraktikkan adab santun Tabe dalam budaya Kaili.",
    concepts: [
      "Makna partikel santun Tabe (permisi dan hormat)",
      "Sebutan penghormatan Pue untuk orang yang dituakan",
      "Tata krama bertamu: tenang, mengucap salam, dan merendahkan gesture",
    ],
    region: "Kaili Ledo • Lembah Palu",
    intro: "Tabe adalah cara meminta ruang dan menunjukkan hormat sebelum melangkah atau berbicara.",
    rewardXp: 20,
    badge: "Pionir Salam",
    source: {
      institution: "Dewan Adat Kaili (LAK) & Balai Pelestarian Kebudayaan Wilayah XVIII",
      informant: "Tokoh Adat Kaili Ledo (Lembah Palu)",
      registrationCode: "SULTENG-BBS-2024/KL-01",
      verifiedDate: "Oktober 2024",
      summary: "Materi etika tutur dan salam santun Tabe didasarkan pada tata krama pergaulan masyarakat Kaili Ledo.",
      status: "Draft — dalam proses validasi",
    },
    questions: [
      {
        id: "tabe-choice",
        type: "choice",
        prompt: "Kamu melewati tetua di beranda. Apa tindakan yang paling sesuai?",
        data: {
          options: [
            { id: "tabe", label: "Mengucapkan Tabe sambil menunduk" },
            { id: "walk", label: "Langsung lewat tanpa menyapa" },
            { id: "wave", label: "Melambaikan tangan dari jauh" },
          ],
          answer: "tabe",
        },
        why: "Tabe menyampaikan permisi dan hormat, terutama saat melewati orang yang dituakan.",
        xp: 5,
      },
      {
        id: "tabe-fact",
        type: "truefalse",
        prompt: "Mitos atau fakta? Tabe hanya digunakan untuk mengucapkan selamat tinggal.",
        data: { statement: "Tabe hanya digunakan untuk mengucapkan selamat tinggal.", answer: false },
        why: "Tabe dapat digunakan untuk meminta izin, menyapa, atau melewati seseorang dengan hormat.",
        xp: 5,
      },
      {
        id: "tabe-match",
        type: "match",
        prompt: "Pasangkan ungkapan dengan konteksnya.",
        data: {
          pairs: [
            { left: "Tabe", right: "Permisi atau hormat" },
            { left: "Pue", right: "Tokoh yang dituakan" },
          ],
        },
        why: "Memahami hubungan kata dan konteks membantu memilih sapaan yang tidak keliru.",
        xp: 5,
      },
      {
        id: "tabe-order",
        type: "order",
        prompt: "Susun langkah bertamu yang santun.",
        data: {
          items: ["Menunggu ruang", "Mengucapkan Tabe", "Menyampaikan tujuan"],
          answer: ["Menunggu ruang", "Mengucapkan Tabe", "Menyampaikan tujuan"],
        },
        why: "Urutan yang tenang memberi ruang bagi tuan rumah sebelum percakapan dimulai.",
        xp: 5,
      },
      {
        id: "tabe-scenario",
        type: "scenario",
        prompt: "Jalankan misi singkat bertamu ke Souraja.",
        data: {
          steps: [
            {
              prompt: "Tetua sedang berbicara. Apa langkahmu?",
              choices: [
                { id: "wait", label: "Menunggu di sisi tangga", score: 1 },
                { id: "tabe", label: "Mengucapkan Tabe sambil menunduk", score: 2 },
              ],
            },
            {
              prompt: "Tetua menoleh. Bagaimana kamu membuka percakapan?",
              choices: [
                { id: "formal", label: "Tabe pue, nalompa mai kami", score: 2 },
                { id: "casual", label: "Halo, kami datang", score: 1 },
              ],
            },
            {
              prompt: "Kamu dipersilakan mendekat. Apa gesturemu?",
              choices: [
                { id: "lower", label: "Menunduk ringan dengan tangan kanan merendah", score: 2 },
                { id: "wave", label: "Melambaikan tangan dari jauh", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Adab bukan hanya kata, tetapi juga waktu, nada, dan gesture saat bertamu.",
        xp: 5,
      },
    ],
  },
  {
    id: 2,
    slug: "busana-baju-nggembe",
    title: "Kenali Baju Nggembe",
    subtitle: "Temukan bentuk, bahan, dan konteks busana",
    objective: "Setelah pelajaran ini, kamu bisa mengenali Baju Nggembe, Buya Sabe, dan etika berbusana adat Kaili.",
    concepts: [
      "Baju Nggembe sebagai busana atasan khas wanita Kaili",
      "Kain tenun Buya Sabe khas Donggala",
      "Prinsip keselarasan busana tamu dalam perhelatan adat",
    ],
    region: "Kaili • Donggala",
    intro: "Baju Nggembe dan Buya Sabe mengajarkan cara membaca bentuk busana sekaligus konteks pemakaiannya.",
    rewardXp: 25,
    badge: "Penjaga Busana",
    source: {
      institution: "Komunitas Pelestari Tenun & Busana Tradisional Kaili",
      informant: "Pemerhati Busana Adat Kaili & Tenun Donggala",
      registrationCode: "SULTENG-BSN-2024/KL-02",
      verifiedDate: "November 2024",
      summary: "Karakteristik busana Baju Nggembe dan Buya Sabe dikurasi dari dokumentasi etnografi busana adat Sulawesi Tengah.",
      status: "Draft — dalam proses validasi",
    },
    questions: [
      {
        id: "nggembe-choice",
        type: "choice",
        prompt: "Busana mana yang paling selaras untuk menghadiri pernikahan adat sebagai tamu?",
        data: {
          options: [
            { id: "formal", label: "Baju Nggembe dan Buya Sabe" },
            { id: "work", label: "Pakaian kerja sehari-hari" },
            { id: "loud", label: "Aksesori paling mencolok" },
          ],
          answer: "formal",
        },
        why: "Tamu menjaga keselarasan dengan acara dan tidak mengambil fokus dari prosesi utama.",
        xp: 5,
      },
      {
        id: "nggembe-fact",
        type: "truefalse",
        prompt: "Mitos atau fakta? Buya Sabe adalah kain tenun Donggala yang dapat melengkapi busana adat.",
        data: { statement: "Buya Sabe adalah kain tenun Donggala.", answer: true },
        why: "Buya Sabe dikenal sebagai kain tenun Donggala yang menjadi bagian penting dari konteks busana.",
        xp: 5,
      },
      {
        id: "nggembe-hotspot",
        type: "hotspot",
        prompt: "Temukan bagian busana yang berkaitan dengan kain tenun utama.",
        data: {
          imageUrl: "/media/presets/baju_nggembe.webp",
          imageCaption: "Busana Adat Kaili: Baju Nggembe & Buya Sabe",
          hotspots: [
            { id: "neck", label: "Kerah persegi", description: "Bagian leher yang memberi ruang pada aksesori.", top: "28%", left: "50%" },
            { id: "sleeve", label: "Lengan menggantung", description: "Bagian lengan dengan gerak yang lebih terbuka.", top: "35%", left: "20%" },
            { id: "weave", label: "Buya Sabe", description: "Kain tenun utama yang melengkapi tampilan.", top: "72%", left: "50%" },
          ],
          answer: "weave",
        },
        why: "Mengenali lokasi dan fungsi kain membantu membaca anatomi busana secara utuh.",
        xp: 5,
      },
      {
        id: "nggembe-order",
        type: "order",
        prompt: "Susun cara mengamati busana dengan teliti.",
        data: {
          items: ["Amati bentuk", "Baca bahan", "Hubungkan dengan acara"],
          answer: ["Amati bentuk", "Baca bahan", "Hubungkan dengan acara"],
        },
        why: "Busana dibaca dari bentuk, bahan, lalu konteks pemakaiannya.",
        xp: 5,
      },
      {
        id: "nggembe-match",
        type: "match",
        prompt: "Pasangkan detail busana dengan maknanya.",
        data: {
          pairs: [
            { left: "Buya Sabe", right: "Tenun Donggala" },
            { left: "Kerah persegi", right: "Ruang untuk aksesori" },
          ],
        },
        why: "Pasangan yang tepat menghubungkan istilah busana dengan fungsi dan asalnya.",
        xp: 5,
      },
    ],
  },
  {
    id: 3,
    slug: "skenario-souraja",
    title: "Skenario Souraja",
    subtitle: "Satukan bahasa, gesture, dan busana",
    objective: "Setelah pelajaran ini, kamu bisa memahami tata ruang Souraja dan adab bertamu di rumah adat Kaili.",
    concepts: [
      "Struktur Banua Oge (Souraja) sebagai ruang diplomasi adat",
      "Keseimbangan antara sapaan Tabe dan gesture fisik",
      "Etika melangkah perlahan di pelataran tetua",
    ],
    region: "Palu Barat • Sulawesi Tengah",
    intro: "Dalam skenario ini kamu tidak hanya mengingat istilah, tetapi memilih sikap yang tepat sebagai tamu.",
    rewardXp: 30,
    badge: "Tamu Sopan",
    source: {
      institution: "Pengelola Cagar Budaya Banua Oge (Souraja) & Disbud Sulteng",
      informant: "Pemandu Cagar Budaya Souraja Palu Barat",
      registrationCode: "SULTENG-CGB-2024/KL-03",
      verifiedDate: "Desember 2024",
      summary: "Skenario adab bertamu dan tata ruang Banua Oge disusun sesuai protokol adat penerimaan tamu Souraja.",
      status: "Draft — dalam proses validasi",
    },
    questions: [
      {
        id: "souraja-choice",
        type: "choice",
        prompt: "Saat tiba di beranda, apa yang kamu lakukan lebih dulu?",
        data: {
          options: [
            { id: "wait", label: "Menunggu ruang untuk menyapa" },
            { id: "enter", label: "Langsung masuk" },
            { id: "call", label: "Memanggil dari jauh" },
          ],
          answer: "wait",
        },
        why: "Memberi ruang menunjukkan bahwa kamu membaca situasi sebelum bertindak.",
        xp: 5,
      },
      {
        id: "souraja-fact",
        type: "truefalse",
        prompt: "Mitos atau fakta? Sapaan dan gesture memiliki peran yang sama pentingnya dalam situasi adat.",
        data: { statement: "Sapaan dan gesture sama-sama penting.", answer: true },
        why: "Makna sapaan diperkuat oleh cara tubuh dan timing saat menyampaikannya.",
        xp: 5,
      },
      {
        id: "souraja-hotspot",
        type: "hotspot",
        prompt: "Temukan titik yang menjadi ruang kedatangan tamu.",
        data: {
          imageUrl: "/media/presets/souraja.webp",
          imageCaption: "Pelataran & Struktur Arsitektur Adat Souraja (Banua Oge), Kaili",
          hotspots: [
            { id: "stairs", label: "Anak tangga", description: "Ruang transisi sebelum masuk.", top: "76%", left: "64%" },
            { id: "porch", label: "Serambi", description: "Ruang menyapa dan menerima tamu.", top: "56%", left: "50%" },
            { id: "inner", label: "Ruang dalam", description: "Area yang dimasuki setelah dipersilakan.", top: "52%", left: "32%" },
          ],
          answer: "porch",
        },
        why: "Membaca ruang membantu menentukan kapan dan di mana sapaan dilakukan.",
        xp: 5,
      },
      {
        id: "souraja-match",
        type: "match",
        prompt: "Pasangkan tindakan dengan tujuan sosialnya.",
        data: {
          pairs: [
            { left: "Menunggu", right: "Memberi ruang" },
            { left: "Tabe", right: "Meminta izin" },
          ],
        },
        why: "Setiap tindakan kecil menyampaikan niat dan posisi sosial dalam situasi bertamu.",
        xp: 5,
      },
      {
        id: "souraja-scenario",
        type: "scenario",
        prompt: "Selesaikan tiga keputusan saat menghadiri upacara di Souraja.",
        data: {
          steps: [
            {
              prompt: "Tetua sedang berbicara. Apa tindakanmu?",
              choices: [
                { id: "wait", label: "Menunggu di sisi tangga", score: 1 },
                { id: "tabe", label: "Ucapkan Tabe pue sambil menunduk", score: 2 },
              ],
            },
            {
              prompt: "Kamu hadir sebagai tamu kehormatan. Apa yang dikenakan?",
              choices: [
                { id: "nggembe", label: "Baju Nggembe dan Buya Sabe", score: 2 },
                { id: "plain", label: "Pakaian sehari-hari", score: 1 },
              ],
            },
            {
              prompt: "Tuan rumah mempersilakanmu duduk. Apa responsmu?",
              choices: [
                { id: "lower", label: "Menunduk ringan dan berterima kasih", score: 2 },
                { id: "nod", label: "Mengangguk singkat", score: 1 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Kearifan budaya dipraktikkan melalui rangkaian keputusan, bukan hafalan satu jawaban.",
        xp: 5,
      },
    ],
  },
];

export function getLessonById(lessonId: number) {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null;
}
