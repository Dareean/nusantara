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
  verificationNotes?: string[];
};

export type Lesson = {
  id: number;
  unitId?: number;
  sectionId?: number;
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
  // ==========================================
  // SECTION 1 — FONDASI (UNIT 1)
  // ==========================================
  {
    id: 1,
    unitId: 1,
    sectionId: 1,
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
    unitId: 1,
    sectionId: 1,
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
    unitId: 1,
    sectionId: 1,
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

  // ==========================================
  // SECTION 1 — FONDASI (UNIT 2)
  // Rujukan: Modul Bahasa Daerah Kaili (Aslitah)
  // ==========================================
  {
    id: 4,
    unitId: 2,
    sectionId: 1,
    slug: "bilangan-satu-sampai-sepuluh",
    title: "Bilangan Satu sampai Sepuluh",
    subtitle: "Menguasai kosakata hitungan dasar Kaili Ledo",
    objective: "Setelah pelajaran ini, kamu bisa berhitung satu sampai sepuluh dalam bahasa Kaili Ledo.",
    concepts: [
      "Kosakata bilangan dasar: Sa (1), Roa (2), Tolu (3), Pata (4), Lima (5)",
      "Kosakata bilangan lanjutan: Ono (6), Pitu (7), Valu (8), Siyo (9), Sapulu (10)",
      "Penerapan bilangan saat berbelanja dan menyebut jumlah barang di pasar tradisional",
    ],
    region: "Kaili Ledo • Sulawesi Tengah",
    intro: "Mengenal angka adalah bekal utama saat bertransaksi dan berinteraksi sehari-hari di tanah Kaili.",
    rewardXp: 30,
    badge: "Penghitung Andal",
    source: {
      institution: "Rujukan Modul Bahasa Daerah Kaili (Aslitah)",
      informant: "Penyusun Modul Bahasa Daerah Kaili",
      registrationCode: "ASLITAH-BDK-BILANGAN",
      verifiedDate: "Rujukan Modul Resmi",
      summary: "Kosakata bilangan satu sampai sepuluh Kaili Ledo bersumber dari Modul Bahasa Daerah Kaili (Aslitah).",
      status: "Rujukan Aslitah — Tervalidasi Buku Modul",
    },
    questions: [
      {
        id: "u2-p1-choice",
        type: "choice",
        prompt: "Apakah kata bahasa Kaili Ledo untuk angka dua (2)?",
        data: {
          options: [
            { id: "roa", label: "Roa" },
            { id: "tolu", label: "Tolu" },
            { id: "pata", label: "Pata" },
          ],
          answer: "roa",
        },
        why: "Dalam bahasa Kaili Ledo, angka dua disebut Roa.",
        xp: 5,
      },
      {
        id: "u2-p1-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Kata 'Sapulu' dalam bahasa Kaili Ledo berarti sepuluh (10).",
        data: { statement: "Kata 'Sapulu' bermakna sepuluh.", answer: true },
        why: "Sapulu merupakan kata baku Kaili Ledo untuk bilangan sepuluh.",
        xp: 5,
      },
      {
        id: "u2-p1-match",
        type: "match",
        prompt: "Pasangkan bilangan Kaili Ledo dengan angka yang tepat.",
        data: {
          pairs: [
            { left: "Sa", right: "1 (Satu)" },
            { left: "Tolu", right: "3 (Tiga)" },
            { left: "Lima", right: "5 (Lima)" },
          ],
        },
        why: "Memasangkan angka membantu mengingat deret hitung secara akurat.",
        xp: 5,
      },
      {
        id: "u2-p1-order",
        type: "order",
        prompt: "Susun urutan hitungan bilangan dari satu sampai tiga.",
        data: {
          items: ["Sa", "Roa", "Tolu"],
          answer: ["Sa", "Roa", "Tolu"],
        },
        why: "Urutan hitungan satu, dua, tiga dalam Kaili Ledo adalah Sa, Roa, lalu Tolu.",
        xp: 5,
      },
      {
        id: "u2-p1-hotspot",
        type: "hotspot",
        prompt: "Pilih posisi kartu bilangan yang menunjukkan angka 5 (Lima).",
        data: {
          imageUrl: "/media/presets/bilangan_kaili.webp",
          imageCaption: "Papan Belajar Bilangan Kaili Ledo: 1 sampai 10",
          hotspots: [
            { id: "pos-sa", label: "Sa (1)", description: "Bilangan satu", top: "30%", left: "20%" },
            { id: "pos-lima", label: "Lima (5)", description: "Bilangan lima", top: "30%", left: "50%" },
            { id: "pos-sapulu", label: "Sapulu (10)", description: "Bilangan sepuluh", top: "30%", left: "80%" },
          ],
          answer: "pos-lima",
        },
        why: "Posisi tengah menunjukkan kartu bilangan Lima yang bermakna lima.",
        xp: 5,
      },
      {
        id: "u2-p1-scenario",
        type: "scenario",
        prompt: "Kamu membeli kue tradisional di pasar Palu. Penjual menanyakan jumlah yang kamu inginkan.",
        data: {
          steps: [
            {
              prompt: "Penjual bertanya berapa kue yang ingin dibeli. Kamu ingin memesan dua.",
              choices: [
                { id: "c-roa", label: "Kupori roa, Tabe", score: 2 },
                { id: "c-ono", label: "Kupori ono", score: 1 },
              ],
            },
            {
              prompt: "Penjual mengonfirmasi apakah kamu ingin menambah satu kue lagi.",
              choices: [
                { id: "c-sa", label: "Tambah sa, tarima kasi", score: 2 },
                { id: "c-sapulu", label: "Tambah sapulu", score: 0 },
              ],
            },
            {
              prompt: "Total kue sekarang tiga. Kata bilangan apa yang kamu sebutkan untuk memastikan?",
              choices: [
                { id: "c-tolu", label: "Tolu", score: 2 },
                { id: "c-pata", label: "Pata", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Menggunakan bilangan dengan tepat dan santun melancarkan interaksi sehari-hari.",
        xp: 5,
      },
    ],
  },
  {
    id: 5,
    unitId: 2,
    sectionId: 1,
    slug: "waktu-pagi-malam-besok-lusa-tahun",
    title: "Waktu: Pagi, Malam, Besok, Lusa, Tahun",
    subtitle: "Mengenal penanda waktu dan hari dalam Kaili Ledo",
    objective: "Setelah pelajaran ini, kamu bisa menyebutkan pembagian waktu dan rencana hari dalam bahasa Kaili Ledo.",
    concepts: [
      "Penanda waktu harian: Ndokona (pagi), Nempa (siang), Bengi (malam)",
      "Penanda pergantian hari: Mamiang (besok), Randoa (lusa)",
      "Penanda rentang waktu panjang: Pae (tahun)",
    ],
    region: "Kaili Ledo • Lembah Palu",
    intro: "Masyarakat Kaili menggunakan pembagian waktu yang selaras dengan ritme alam dan perjumpaan sosial.",
    rewardXp: 30,
    badge: "Penjaga Waktu",
    source: {
      institution: "Rujukan Modul Bahasa Daerah Kaili (Aslitah)",
      informant: "Penyusun Modul Bahasa Daerah Kaili",
      registrationCode: "ASLITAH-BDK-WAKTU",
      verifiedDate: "Rujukan Modul Resmi",
      summary: "Kosakata penanda waktu Kaili Ledo bersumber dari Modul Bahasa Daerah Kaili (Aslitah).",
      status: "Rujukan Aslitah — Tervalidasi Buku Modul",
    },
    questions: [
      {
        id: "u2-p2-choice",
        type: "choice",
        prompt: "Ungkapan waktu apa yang digunakan untuk menyatakan 'pagi hari'?",
        data: {
          options: [
            { id: "ndokona", label: "Ndokona" },
            { id: "bengi", label: "Bengi" },
            { id: "randoa", label: "Randoa" },
          ],
          answer: "ndokona",
        },
        why: "Ndokona adalah kata bahasa Kaili Ledo untuk pagi hari.",
        xp: 5,
      },
      {
        id: "u2-p2-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Kata 'Mamiang' bermakna besok dalam bahasa Kaili Ledo.",
        data: { statement: "Mamiang berarti besok.", answer: true },
        why: "Mamiang digunakan untuk merujuk pada hari esok.",
        xp: 5,
      },
      {
        id: "u2-p2-match",
        type: "match",
        prompt: "Pasangkan istilah waktu Kaili dengan artinya dalam bahasa Indonesia.",
        data: {
          pairs: [
            { left: "Bengi", right: "Malam" },
            { left: "Randoa", right: "Lusa" },
            { left: "Pae", right: "Tahun" },
          ],
        },
        why: "Memasangkan istilah waktu mengasah ketepatan pemahaman penanggalan.",
        xp: 5,
      },
      {
        id: "u2-p2-order",
        type: "order",
        prompt: "Susun urutan waktu dari pagi hingga esok hari.",
        data: {
          items: ["Ndokona (Pagi)", "Bengi (Malam)", "Mamiang (Besok)"],
          answer: ["Ndokona (Pagi)", "Bengi (Malam)", "Mamiang (Besok)"],
        },
        why: "Alur waktu berjalan dari pagi (Ndokona), malam (Bengi), menuju esok (Mamiang).",
        xp: 5,
      },
      {
        id: "u2-p2-hotspot",
        type: "hotspot",
        prompt: "Tentukan ikon yang melambangkan suasana 'Bengi' (malam).",
        data: {
          imageUrl: "/media/presets/waktu_kaili.webp",
          imageCaption: "Siklus Waktu Tradisional Kaili Ledo",
          hotspots: [
            { id: "sun-pagi", label: "Fajar (Ndokona)", description: "Matahari terbit", top: "25%", left: "20%" },
            { id: "moon-bengi", label: "Bulan (Bengi)", description: "Suasana malam hari", top: "25%", left: "50%" },
            { id: "cal-pae", label: "Musim (Pae)", description: "Pergantian tahunan", top: "25%", left: "80%" },
          ],
          answer: "moon-bengi",
        },
        why: "Ikon bulan di tengah melambangkan waktu Bengi (malam).",
        xp: 5,
      },
      {
        id: "u2-p2-scenario",
        type: "scenario",
        prompt: "Tetangga mengajakmu bertamu ke rumah kerabat. Kamu harus mengatur janji waktu.",
        data: {
          steps: [
            {
              prompt: "Tetangga menanyakan kapan waktu luangmu besok.",
              choices: [
                { id: "sc-mamiang-ndokona", label: "Mamiang ndokona (Besok pagi)", score: 2 },
                { id: "sc-pae", label: "Pae mai", score: 0 },
              ],
            },
            {
              prompt: "Ternyata esok pagi tuan rumah sedang ke ladang. Beliau mengusulkan lusa.",
              choices: [
                { id: "sc-randoa", label: "Io, randoa roa (Iya, lusa sangat baik)", score: 2 },
                { id: "sc-bengi", label: "Bengi daku", score: 1 },
              ],
            },
            {
              prompt: "Pertemuan disepakati lusa malam. Bagaimana konfirmasi akhirmu?",
              choices: [
                { id: "sc-randoa-bengi", label: "Randoa bengi, Tabe", score: 2 },
                { id: "sc-nempa", label: "Nempa", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Kombinasi kata hari dan waktu membuat kesepakatan menjadi jelas dan beretika.",
        xp: 5,
      },
    ],
  },
  {
    id: 6,
    unitId: 2,
    sectionId: 1,
    slug: "alam-dan-alat-perjalanan",
    title: "Alam dan Alat Perjalanan",
    subtitle: "Mengenal lanskap alam dan ragam sarana transportasi",
    objective: "Setelah pelajaran ini, kamu mengenali kosakata alam sekitar serta kelompok kosakata transportasi masyarakat Kaili.",
    concepts: [
      "Kosakata bentang alam: Banua, Vatu, Uve",
      "Kelompok kosakata transportasi dalam rujukan Aslitah: Motoro, Oto, Kapudara, Sakaya, Sapeda",
      "Catatan rujukan: Kelompok kosakata transportasi dikenalkan sebagai kesatuan tanpa menambah tafsir per kata di luar buku sumber",
    ],
    region: "Kaili Ledo • Sulawesi Tengah",
    intro: "Masyarakat lembah Palu hidup di antara teluk dan pegunungan, mengembangkan istilah bentang alam serta sarana perjalanan.",
    rewardXp: 30,
    badge: "Penjelajah Kosakata",
    source: {
      institution: "Rujukan Modul Bahasa Daerah Kaili (Aslitah)",
      informant: "Penyusun Modul Bahasa Daerah Kaili",
      registrationCode: "ASLITAH-BDK-ALAM-TRANSPORTASI",
      verifiedDate: "Rujukan Modul Resmi",
      summary: "Kosakata alam dan kelompok alat perjalanan bersumber dari Modul Bahasa Daerah Kaili (Aslitah).",
      status: "Rujukan Aslitah — Tervalidasi Buku Modul",
      verificationNotes: [
        "Motoro, Oto, Kapudara, Sakaya, dan Sapeda dikenalkan hanya sebagai kelompok kosakata transportasi — tidak ditambahkan arti per kata di luar rujukan.",
      ],
    },
    questions: [
      {
        id: "u2-p3-choice",
        type: "choice",
        prompt: "Manakah di bawah ini yang termasuk dalam kelompok kosakata transportasi pada rujukan Aslitah?",
        data: {
          options: [
            { id: "transport-group", label: "Motoro, Oto, Kapudara, Sakaya, Sapeda" },
            { id: "clothing-group", label: "Baju Nggembe, Buya Sabe, Siga" },
            { id: "greeting-group", label: "Tabe, Pue, Ngge" },
          ],
          answer: "transport-group",
        },
        why: "Motoro, Oto, Kapudara, Sakaya, dan Sapeda tercatat sebagai kelompok alat perjalanan dalam modul rujukan.",
        xp: 5,
      },
      {
        id: "u2-p3-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Kelompok kata Motoro, Oto, Sakaya, dan Sapeda merujuk pada sarana mobilitas perjalanan.",
        data: { statement: "Kelompok kata tersebut merupakan sarana perjalanan.", answer: true },
        why: "Seluruh kata tersebut tercantum dalam kelompok alat transportasi pada materi rujukan.",
        xp: 5,
      },
      {
        id: "u2-p3-match",
        type: "match",
        prompt: "Pasangkan kategori kosakata dengan contoh kata rujukan yang tepat.",
        data: {
          pairs: [
            { left: "Alat Perjalanan Air", right: "Sakaya" },
            { left: "Alat Perjalanan Darat", right: "Motoro & Oto" },
            { left: "Alat Perjalanan Udara", right: "Kapudara" },
          ],
        },
        why: "Memasangkan kelompok sarana memudahkan identifikasi ruang pergerakan.",
        xp: 5,
      },
      {
        id: "u2-p3-order",
        type: "order",
        prompt: "Susun alur perjalanan dari pesisir menuju perbukitan.",
        data: {
          items: ["Menepi dari Sakaya di pesisir", "Melintas jalan darat dengan Oto", "Berjalan santun menuju perkampungan"],
          answer: ["Menepi dari Sakaya di pesisir", "Melintas jalan darat dengan Oto", "Berjalan santun menuju perkampungan"],
        },
        why: "Perjalanan di lembah Palu bertransisi dari jalur teluk menuju daratan perkampungan.",
        xp: 5,
      },
      {
        id: "u2-p3-hotspot",
        type: "hotspot",
        prompt: "Pilih ikon transportasi air tradisional (Sakaya) di tepian Teluk Palu.",
        data: {
          imageUrl: "/media/presets/transportasi_kaili.webp",
          imageCaption: "Lanskap Teluk Palu dan Sarana Mobilitas",
          hotspots: [
            { id: "hotspot-sakaya", label: "Sakaya", description: "Perahu di perairan teluk", top: "60%", left: "30%" },
            { id: "hotspot-oto", label: "Oto", description: "Kendaraan darat di jalan pesisir", top: "50%", left: "65%" },
            { id: "hotspot-kapudara", label: "Kapudara", description: "Wahana udara di atas lembah", top: "15%", left: "50%" },
          ],
          answer: "hotspot-sakaya",
        },
        why: "Sakaya adalah sarana transportasi perairan yang berlabuh di tepian teluk.",
        xp: 5,
      },
      {
        id: "u2-p3-scenario",
        type: "scenario",
        prompt: "Kamu merencanakan kunjungan belajar ke desa tenun di seberang teluk.",
        data: {
          steps: [
            {
              prompt: "Rekan bertanya moda apa yang digunakan untuk menyeberangi perairan teluk.",
              choices: [
                { id: "sc-sakaya", label: "Menggunakan Sakaya melintasi teluk", score: 2 },
                { id: "sc-sapeda", label: "Menggunakan Sapeda di air", score: 0 },
              ],
            },
            {
              prompt: "Setelah tiba di dermaga penyeberangan, bagaimana melanjutkan ke desa di kaki gunung?",
              choices: [
                { id: "sc-oto", label: "Melanjutkan dengan Oto / jalan darat", score: 2 },
                { id: "sc-kapudara", label: "Menunggu Kapudara mendarat", score: 0 },
              ],
            },
            {
              prompt: "Tiba di tujuan, apa sikap pertama saat turun dari kendaraan di depan warga?",
              choices: [
                { id: "sc-tabe-turun", label: "Menyapa warga sekitar dengan Tabe", score: 2 },
                { id: "sc-langsung", label: "Langsung pergi tanpa menyapa", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Mengenali sarana perjalanan sekaligus menjaga adab kedatangan mencerminkan tamu yang berbudi.",
        xp: 5,
      },
    ],
  },

  // ==========================================
  // SECTION 1 — FONDASI (UNIT 3)
  // Rujukan: Modul Bahasa Daerah Kaili (Aslitah)
  // ==========================================
  {
    id: 7,
    unitId: 3,
    sectionId: 1,
    slug: "menanyakan-kabar-dengan-hormat",
    title: "Menanyakan Kabar dengan Hormat",
    subtitle: "Ungkapan santun menanyakan keadaan sesama",
    objective: "Setelah pelajaran ini, kamu bisa menanyakan dan membalas kabar secara santun dalam budaya tutur Kaili.",
    concepts: [
      "Sapaan menanyakan kabar sehari-hari: 'Kareba?' dan jawaban 'Kareba roa'",
      "Bentuk sapaan formal bersyarat: 'Komi mambura kareba' (Catatan: wajib verifikasi bentuk baku)",
      "Adab mendengarkan jawaban kabar dengan kontak mata teduh dan penuh perhatian",
    ],
    region: "Kaili Ledo • Lembah Palu",
    intro: "Menanyakan kabar dalam adat Kaili bukan sekadar basa-basi, melainkan doa kebaikan dan perhatian tulus.",
    rewardXp: 30,
    badge: "Penyapa Santun",
    source: {
      institution: "Rujukan Modul Bahasa Daerah Kaili (Aslitah)",
      informant: "Penyusun Modul Bahasa Daerah Kaili",
      registrationCode: "ASLITAH-BDK-SAPAAN-KABAR",
      verifiedDate: "Rujukan Modul Resmi",
      summary: "Materi ungkapan menanyakan kabar bersumber dari Modul Bahasa Daerah Kaili (Aslitah).",
      status: "Rujukan Aslitah — Perlu Verifikasi Bentuk Baku Formal",
      verificationNotes: [
        "Bentuk baku Kaili Ledo dari ungkapan menanyakan kabar 'Komi mambura kareba' — WAJIB diverifikasi sebelum dipakai sebagai fakta final.",
      ],
    },
    questions: [
      {
        id: "u3-p1-choice",
        type: "choice",
        prompt: "Apa jawaban yang tepat dan hangat saat seseorang menyapamu dengan 'Kareba?'",
        data: {
          options: [
            { id: "kareba-roa", label: "Kareba roa (Kabar baik sekali)" },
            { id: "tabe-saja", label: "Tabe" },
            { id: "sombu", label: "Sombu" },
          ],
          answer: "kareba-roa",
        },
        why: "'Kareba roa' bermakna kabar sangat baik atau sehat walafiat.",
        xp: 5,
      },
      {
        id: "u3-p1-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Ungkapan formal 'Komi mambura kareba' masih memerlukan verifikasi bentuk baku oleh penutur jati.",
        data: { statement: "Ungkapan tersebut memerlukan verifikasi bentuk baku.", answer: true },
        why: "Sesuai catatan integritas, ungkapan formal ini berstatus wajib diverifikasi sebelum menjadi standar final.",
        xp: 5,
      },
      {
        id: "u3-p1-match",
        type: "match",
        prompt: "Pasangkan pertanyaan kabar dengan maknanya.",
        data: {
          pairs: [
            { left: "Kareba?", right: "Bagaimana kabarmu?" },
            { left: "Kareba roa", right: "Kabar sangat baik" },
            { left: "Tarima kasi", right: "Terima kasih" },
          ],
        },
        why: "Kesesuaian tanya dan jawab menjaga kelancaran diplomasi tutur.",
        xp: 5,
      },
      {
        id: "u3-p1-order",
        type: "order",
        prompt: "Susun urutan bertegur sapa saat berpapasan dengan tetua.",
        data: {
          items: ["Ucapkan salam Tabe", "Tanyakan kabar dengan santun", "Dengarkan jawaban dengan saksama"],
          answer: ["Ucapkan salam Tabe", "Tanyakan kabar dengan santun", "Dengarkan jawaban dengan saksama"],
        },
        why: "Dimulai dari permisi hormat (Tabe), bertanya kabar, lalu menyimak penuh perhatian.",
        xp: 5,
      },
      {
        id: "u3-p1-hotspot",
        type: "hotspot",
        prompt: "Pilih tokoh dalam dialog yang sedang memberikan respons 'Kareba roa'.",
        data: {
          imageUrl: "/media/presets/dialog_sapaan.webp",
          imageCaption: "Perjumpaan Warga di Serambi Banua",
          hotspots: [
            { id: "penyapa", label: "Tamu yang menyapa", description: "Mengucapkan sapaan", top: "45%", left: "25%" },
            { id: "penjawab", label: "Tuan rumah yang tersenyum", description: "Menjawab kabar baik (Kareba roa)", top: "45%", left: "70%" },
          ],
          answer: "penjawab",
        },
        why: "Tuan rumah yang tersenyum ramah memberikan respons kabar baik.",
        xp: 5,
      },
      {
        id: "u3-p1-scenario",
        type: "scenario",
        prompt: "Kamu berkunjung ke rumah tetua adat di sore hari.",
        data: {
          steps: [
            {
              prompt: "Bagaimana kamu menyapa tetua yang sedang duduk di beranda?",
              choices: [
                { id: "sc-tabe-pue", label: "Tabe Pue, kareba?", score: 2 },
                { id: "sc-halo", label: "Halo apa kabar", score: 1 },
              ],
            },
            {
              prompt: "Tetua menjawab: 'Kareba roa, nalompa mai komi'. Apa sikapmu selanjutnya?",
              choices: [
                { id: "sc-duduk-santun", label: "Menunduk hormat dan duduk di tempat yang dipersilakan", score: 2 },
                { id: "sc-berdiri-kaku", label: "Berdiri mematung tanpa bersuara", score: 1 },
              ],
            },
            {
              prompt: "Sebelum memulai pembicaraan utama, apa ucapan penghormatanmu?",
              choices: [
                { id: "sc-tarima-kasi", label: "Tarima kasi banyak Pue", score: 2 },
                { id: "sc-langsung-tanya", label: "Langsung meminta urusan cepat selesai", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Adab tutur membuka pintu keramahan dan penerimaan dalam silaturahmi Kaili.",
        xp: 5,
      },
    ],
  },
  {
    id: 8,
    unitId: 3,
    sectionId: 1,
    slug: "tabe-pue-dan-ngge",
    title: "Tabe, Pue, dan Ngge",
    subtitle: "Tiga pilar sapaan penghormatan tutur Kaili",
    objective: "Setelah pelajaran ini, kamu bisa membedakan peran sapaan Tabe, Pue, dan Ngge sesuai daftar materi rujukan.",
    concepts: [
      "Tabe sebagai partikel pembuka permisi dan tanda hormat universal",
      "Pue sebagai sebutan penghormatan kepada orang yang dituakan atau memiliki kedudukan adat",
      "Ngge dikenalkan sebagai sapaan dalam daftar materi unit ini sesuai rujukan modul Aslitah tanpa tafsir tambahan",
    ],
    region: "Kaili Ledo • Lembah Palu",
    intro: "Ketepatan memilih kata sapaan mencerminkan kehalusan budi pekerti seseorang di mata masyarakat adat.",
    rewardXp: 30,
    badge: "Penyapa Hormat",
    source: {
      institution: "Rujukan Modul Bahasa Daerah Kaili (Aslitah)",
      informant: "Penyusun Modul Bahasa Daerah Kaili",
      registrationCode: "ASLITAH-BDK-TABE-PUE-NGGE",
      verifiedDate: "Rujukan Modul Resmi",
      summary: "Materi sapaan Tabe, Pue, dan Ngge bersumber dari Modul Bahasa Daerah Kaili (Aslitah).",
      status: "Rujukan Aslitah — Tervalidasi Buku Modul",
      verificationNotes: [
        "Ngge dikenalkan hanya sebagai sapaan dalam daftar materi unit ini — tidak ditambahkan arti di luar rujukan.",
      ],
    },
    questions: [
      {
        id: "u3-p2-choice",
        type: "choice",
        prompt: "Sebutan kehormatan manakah yang ditujukan kepada tokoh atau tetua yang dituakan?",
        data: {
          options: [
            { id: "pue", label: "Pue" },
            { id: "sakaya", label: "Sakaya" },
            { id: "mamiang", label: "Mamiang" },
          ],
          answer: "pue",
        },
        why: "Pue adalah sebutan penghormatan luhur untuk orang yang dituakan.",
        xp: 5,
      },
      {
        id: "u3-p2-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Kata 'Ngge' dikenalkan sebagai salah satu sapaan dalam daftar materi rujukan Aslitah.",
        data: { statement: "Ngge tercatat sebagai sapaan dalam materi rujukan.", answer: true },
        why: "Ngge tercantum dalam daftar materi sapaan pada modul bahasa daerah rujukan.",
        xp: 5,
      },
      {
        id: "u3-p2-match",
        type: "match",
        prompt: "Pasangkan istilah sapaan dengan peran tutur yang tepat.",
        data: {
          pairs: [
            { left: "Tabe", right: "Permisi dan hormat" },
            { left: "Pue", right: "Sebutan tetua yang dihormati" },
            { left: "Ngge", right: "Sapaan dalam rujukan materi" },
          ],
        },
        why: "Ketepatan pasangan kata menegaskan fungsi sosial dari masing-masing sapaan.",
        xp: 5,
      },
      {
        id: "u3-p2-order",
        type: "order",
        prompt: "Susun kalimat sapaan hormat ketika hendak lewat di depan tetua.",
        data: {
          items: ["Tabe", "Pue", "Nalompa mai kami"],
          answer: ["Tabe", "Pue", "Nalompa mai kami"],
        },
        why: "Struktur sapaan diawali partikel santun Tabe, diikuti sebutan penghormatan Pue.",
        xp: 5,
      },
      {
        id: "u3-p2-hotspot",
        type: "hotspot",
        prompt: "Pilih tokoh tetua adat yang disapa dengan sebutan 'Pue'.",
        data: {
          imageUrl: "/media/presets/tetua_souraja.webp",
          imageCaption: "Musyawarah Bersama Tetua Adat Kaili",
          hotspots: [
            { id: "pemuda", label: "Generasi muda", description: "Pihak yang menyampaikan salam hormat", top: "50%", left: "20%" },
            { id: "tetua-pue", label: "Tetua Adat (Pue)", description: "Tokoh yang dituakan dan dihormati", top: "45%", left: "65%" },
          ],
          answer: "tetua-pue",
        },
        why: "Tetua adat di sisi kanan merupakan sosok yang disapa dengan sebutan hormat Pue.",
        xp: 5,
      },
      {
        id: "u3-p2-scenario",
        type: "scenario",
        prompt: "Kamu menghadiri musyawarah warga dan ingin menyampaikan izin keluar sebentar.",
        data: {
          steps: [
            {
              prompt: "Bagaimana cara meminta izin di tengah pembicaraan para tetua?",
              choices: [
                { id: "sc-tabe-pue-izin", label: "Tabe Pue, izin melangkah sejenak", score: 2 },
                { id: "sc-keluar-aja", label: "Langsung berdiri dan beranjak pergi", score: 0 },
              ],
            },
            {
              prompt: "Tetua mengangguk memberi izin. Bagaimana posisi tubuhmu saat melangkah?",
              choices: [
                { id: "sc-tunduk-tangan", label: "Menundukkan badan dan mengarahkan tangan kanan ke bawah", score: 2 },
                { id: "sc-tegak", label: "Berjalan tegap dengan langkah cepat", score: 1 },
              ],
            },
            {
              prompt: "Setelah melewati barisan tetua, apa yang kamu lakukan?",
              choices: [
                { id: "sc-langkah-halus", label: "Melanjutkan langkah dengan tenang tanpa suara berisik", score: 2 },
                { id: "sc-lari", label: "Berlari kecil", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Menjaga adab tutur dan gerak di ruang adat memperlihatkan kedewasaan bersikap.",
        xp: 5,
      },
    ],
  },

  // ==========================================
  // SECTION 2 — HIDUP DALAM ADAT (UNIT 4)
  // Status: DATA DEMO, draf dalam proses validasi
  // ==========================================
  {
    id: 9,
    unitId: 4,
    sectionId: 2,
    slug: "memadukan-baju-nggembe-dan-buya-sabe",
    title: "Memadukan Baju Nggembe dan Buya Sabe",
    subtitle: "Harmoni warna, bahan, dan proporsi busana wanita",
    objective: "Setelah pelajaran ini, kamu memahami prinsip keselarasan memadukan atasan Baju Nggembe dan bawahan sarung Buya Sabe.",
    concepts: [
      "Prinsip keselarasan warna antara kain atasan sutra dan motif sarung tenun",
      "Konteks perhelatan: perbedaan busana untuk upacara resmi versus perayaan keluarga",
      "Peran aksesori pendukung yang memperkuat keanggunan tanpa kesan berlebihan",
    ],
    region: "Kaili • Donggala (DATA DEMO)",
    intro: "Memadukan busana adat menuntut kepekaan rasa agar tercipta harmoni yang mencerminkan martabat pemakainya.",
    rewardXp: 30,
    badge: "Penata Busana",
    source: {
      institution: "Draf Kurasi Internal (DATA DEMO)",
      informant: "Pemerhati Busana Tradisional",
      registrationCode: "DEMO-BSN-PADUAN",
      verifiedDate: "Draf Proses Validasi",
      summary: "Data demo pembelajaran keselarasan busana Baju Nggembe dan Buya Sabe.",
      status: "DATA DEMO — draf dalam proses validasi",
    },
    questions: [
      {
        id: "u4-p1-choice",
        type: "choice",
        prompt: "Kain bawahan tradisional manakah yang berpasangan serasi dengan Baju Nggembe?",
        data: {
          options: [
            { id: "buya-sabe", label: "Buya Sabe (sarung tenun sutra)" },
            { id: "celana-jeans", label: "Celana modern santai" },
            { id: "kain-polos", label: "Kain sintetis tanpa motif" },
          ],
          answer: "buya-sabe",
        },
        why: "Buya Sabe adalah pasangan sarung tenun khas yang melengkapi keanggunan Baju Nggembe.",
        xp: 5,
      },
      {
        id: "u4-p1-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Materi pemaduan busana ini disajikan sebagai prototipe DATA DEMO yang masih dalam proses validasi.",
        data: { statement: "Materi ini berstatus DATA DEMO dalam proses validasi.", answer: true },
        why: "Unit 4 secara transparan ditandai sebagai data demo edukasi yang menanti validasi dewan adat.",
        xp: 5,
      },
      {
        id: "u4-p1-match",
        type: "match",
        prompt: "Pasangkan unsur busana dengan perannya dalam perpaduan adat.",
        data: {
          pairs: [
            { left: "Baju Nggembe", right: "Atasan longgar kerah persegi" },
            { left: "Buya Sabe", right: "Sarung tenun sutra Donggala" },
            { left: "Pending / Sabuk", right: "Pengikat pinggang pelengkap" },
          ],
        },
        why: "Kombinasi atasan, sarung, dan ikat pinggang menciptakan siluet busana adat yang paripurna.",
        xp: 5,
      },
      {
        id: "u4-p1-order",
        type: "order",
        prompt: "Susun langkah mengenakan paduan busana adat yang rapi.",
        data: {
          items: ["Mengenakan sarung tenun Buya Sabe", "Mengenakan atasan Baju Nggembe", "Menyematkan aksesori pelengkap"],
          answer: ["Mengenakan sarung tenun Buya Sabe", "Mengenakan atasan Baju Nggembe", "Menyematkan aksesori pelengkap"],
        },
        why: "Sarung tenun dirapikan terlebih dahulu sebelum atasan dan aksesori disematkan.",
        xp: 5,
      },
      {
        id: "u4-p1-hotspot",
        type: "hotspot",
        prompt: "Pilih bagian sarung tenun Buya Sabe pada peragaan busana adat.",
        data: {
          imageUrl: "/media/presets/peragaan_nggembe.webp",
          imageCaption: "Perpaduan Busana Adat Kaili Lengkap",
          hotspots: [
            { id: "hotspot-atasan", label: "Baju Nggembe", description: "Baju kurung longgar", top: "35%", left: "50%" },
            { id: "hotspot-sarung", label: "Buya Sabe", description: "Sarung tenun sutra berombak", top: "75%", left: "50%" },
          ],
          answer: "hotspot-sarung",
        },
        why: "Area bawah menunjukkan kain tenun Buya Sabe yang membalut anggun.",
        xp: 5,
      },
      {
        id: "u4-p1-scenario",
        type: "scenario",
        prompt: "Kamu diminta membantu memilih busana untuk perwakilan tamu pada resepsi adat.",
        data: {
          steps: [
            {
              prompt: "Warna atasan Baju Nggembe bernuansa cerah. Bagaimana memilih Buya Sabe yang cocok?",
              choices: [
                { id: "sc-selaras", label: "Memilih motif tenun dengan aksen warna yang senada dan selaras", score: 2 },
                { id: "sc-kontras-tajam", label: "Memilih motif yang bertabrakan mencolok", score: 1 },
              ],
            },
            {
              prompt: "Bagaimana pengaturan panjang sarung tenun Buya Sabe?",
              choices: [
                { id: "sc-mata-kaki", label: "Menjulur anggun hingga batas mata kaki secara proporsional", score: 2 },
                { id: "sc-terlalu-pendek", label: "Ditarik terlalu tinggi di atas betis", score: 0 },
              ],
            },
            {
              prompt: "Apa sentuhan akhir sebelum melangkah ke lokasi acara?",
              choices: [
                { id: "sc-cek-kerapian", label: "Memeriksa kerapian lipatan kain dan kenyamanan melangkah", score: 2 },
                { id: "sc-abaikan", label: "Langsung berangkat tanpa bercermin", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Kerapian dan keselarasan busana mencerminkan penghormatan kepada tuan rumah dan tamu agung.",
        xp: 5,
      },
    ],
  },
  {
    id: 10,
    unitId: 4,
    sectionId: 2,
    slug: "mengenal-istilah-siga-dan-pua-kora-masih-perlu-validasi",
    title: "Mengenal Istilah Siga dan Pua Kora, Masih Perlu Validasi",
    subtitle: "Mengenal istilah busana pria dengan status kurasi transparan",
    objective: "Setelah pelajaran ini, kamu mengenali istilah Siga dan Pua Kora dengan pemahaman status keabsahan yang jujur.",
    concepts: [
      "Istilah Siga yang secara umum dikenal sebagai penutup/ikat kepala adat laki-laki",
      "Istilah Pua Kora yang dikenalkan sebatas lema nama tanpa tafsir bentuk fiktif",
      "Pentingnya verifikasi otoritatif dari tetua adat sebelum istilah dipakai sebagai fakta final",
    ],
    region: "Kaili • Sulawesi Tengah (DATA DEMO)",
    intro: "Belajar budaya berarti menghargai proses riset; jika suatu istilah belum tervalidasi final, kita mencatatnya dengan jujur.",
    rewardXp: 30,
    badge: "Pemadu Busana",
    source: {
      institution: "Draf Kurasi Internal (DATA DEMO)",
      informant: "Draf Catatan Terminologi Adat",
      registrationCode: "DEMO-BSN-SIGA-PUAKORA",
      verifiedDate: "Draf Proses Validasi",
      summary: "Pengenalan istilah Siga dan Pua Kora dengan penandaan status validasi terbuka.",
      status: "DATA DEMO — draf dalam proses validasi",
      verificationNotes: [
        "Siga (ikat kepala adat laki-laki) — PERLU VALIDASI, belum boleh dipakai sebagai fakta final.",
        "Pua Kora — PERLU VALIDASI; dikenalkan hanya sebagai istilah, bentuk, bahan, dan fungsinya tidak dideskripsikan sebagai fakta.",
      ],
    },
    questions: [
      {
        id: "u4-p2-choice",
        type: "choice",
        prompt: "Istilah manakah yang merujuk pada ikat kepala adat laki-laki Kaili (berstatus perlu validasi)?",
        data: {
          options: [
            { id: "siga", label: "Siga" },
            { id: "baju-nggembe", label: "Baju Nggembe" },
            { id: "buya-sabe", label: "Buya Sabe" },
          ],
          answer: "siga",
        },
        why: "Siga secara umum dikenal sebagai ikat kepala pria, dengan catatan masih dalam proses validasi mendalam.",
        xp: 5,
      },
      {
        id: "u4-p2-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Istilah 'Pua Kora' dalam materi ini telah diverifikasi bentuk, bahan, dan fungsinya oleh dewan adat.",
        data: { statement: "Pua Kora telah diverifikasi lengkap.", answer: false },
        why: "Pua Kora dikenalkan hanya sebagai istilah yang masih memerlukan riset dan validasi dewan adat.",
        xp: 5,
      },
      {
        id: "u4-p2-match",
        type: "match",
        prompt: "Pasangkan istilah busana pria dengan status kurasi yang sebenarnya.",
        data: {
          pairs: [
            { left: "Siga", right: "Ikat kepala (Perlu Validasi)" },
            { left: "Pua Kora", right: "Istilah draf (Perlu Validasi)" },
            { left: "Baju Koje", right: "Kemeja adat pria berkerah tegak" },
          ],
        },
        why: "Membedakan istilah terverifikasi dan istilah draf adalah wujud integritas akademik.",
        xp: 5,
      },
      {
        id: "u4-p2-order",
        type: "order",
        prompt: "Susun alur penelaahan istilah budaya sebelum dijadikan materi resmi.",
        data: {
          items: ["Pencatatan istilah awal di lapangan", "Uji publik dan konfirmasi ke tetua adat", "Penerbitan status tervalidasi resmi"],
          answer: ["Pencatatan istilah awal di lapangan", "Uji publik dan konfirmasi ke tetua adat", "Penerbitan status tervalidasi resmi"],
        },
        why: "Validasi budaya menuntut konfirmasi langsung kepada pemangku adat sebelum disahkan.",
        xp: 5,
      },
      {
        id: "u4-p2-hotspot",
        type: "hotspot",
        prompt: "Pilih posisi penempatan aksesori penutup kepala adat pria (Siga).",
        data: {
          imageUrl: "/media/presets/busana_pria_kaili.webp",
          imageCaption: "Anatomi Busana Tradisional Pria Kaili",
          hotspots: [
            { id: "hotspot-siga", label: "Kepala (Siga)", description: "Ikat kepala penanda kehormatan", top: "18%", left: "50%" },
            { id: "hotspot-baju-koje", label: "Tubuh (Baju Koje)", description: "Kemeja berkerah tegak", top: "45%", left: "50%" },
          ],
          answer: "hotspot-siga",
        },
        why: "Siga dikenakan melingkar di kepala dengan lipatan khas segitiga.",
        xp: 5,
      },
      {
        id: "u4-p2-scenario",
        type: "scenario",
        prompt: "Sebagai kurator muda, kamu mendapati pertanyaan pengunjung tentang istilah Pua Kora.",
        data: {
          steps: [
            {
              prompt: "Bagaimana caramu menjelaskan istilah Pua Kora yang belum tervalidasi?",
              choices: [
                { id: "sc-jujur", label: "Menyampaikan bahwa istilah ini berstatus draf riset dan menanti validasi tetua", score: 2 },
                { id: "sc-karang", label: "Mengarang cerita fungsi gaib agar terdengar menarik", score: 0 },
              ],
            },
            {
              prompt: "Pengunjung menanyakan tentang Siga. Apa informasi yang tepat kamu berikan?",
              choices: [
                { id: "sc-siga-info", label: "Siga adalah ikat kepala pria Kaili yang sarat simbol kehormatan", score: 2 },
                { id: "sc-siga-salah", label: "Siga adalah alas kaki", score: 0 },
              ],
            },
            {
              prompt: "Pengunjung mengapresiasi keterbukaan status data demo ini. Apa penutupmu?",
              choices: [
                { id: "sc-ajak-riset", label: "Mengajak bersama-sama menjaga keaslian riset tradisi", score: 2 },
                { id: "sc-diam", label: "Mengabaikan tanggapan pengunjung", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Kejujuran data membangun kepercayaan publik terhadap pelestarian warisan leluhur.",
        xp: 5,
      },
    ],
  },

  // ==========================================
  // SECTION 2 — HIDUP DALAM ADAT (UNIT 5)
  // Status: DATA DEMO, draf dalam proses validasi
  // ==========================================
  {
    id: 11,
    unitId: 5,
    sectionId: 2,
    slug: "adab-melintas-di-depan-tetua",
    title: "Adab Melintas di Depan Tetua",
    subtitle: "Tata gestur tubuh dan kerendahan hati saat berjalan",
    objective: "Setelah pelajaran ini, kamu mempraktikkan adab tubuh merendah dan langkah tenang saat lewat di depan tetua adat.",
    concepts: [
      "Posisi tubuh: menundukkan kepala dan membungkukkan pundak sekitar 30 derajat",
      "Ayun tangan: menurunkan tangan kanan ke arah bawah dengan telapak terbuka santun",
      "Tempo langkah: berjalan tenang tanpa menimbulkan derap suara hentakan kaki",
    ],
    region: "Kaili • Lembah Palu (DATA DEMO)",
    intro: "Dalam adat Kaili, tubuh berbicara sebelum lisan berucap; gerak melintas mencerminkan rasa hormat yang mendalam.",
    rewardXp: 30,
    badge: "Penyantun Gerak",
    source: {
      institution: "Draf Kurasi Internal (DATA DEMO)",
      informant: "Pemerhati Etika Budaya",
      registrationCode: "DEMO-ETK-MELINTAS",
      verifiedDate: "Draf Proses Validasi",
      summary: "Data demo simulasi tata krama melintas di hadapan orang yang dituakan.",
      status: "DATA DEMO — draf dalam proses validasi",
    },
    questions: [
      {
        id: "u5-p1-choice",
        type: "choice",
        prompt: "Bagaimana posisi tangan kanan yang beradab saat melintas di depan tetua yang sedang duduk?",
        data: {
          options: [
            { id: "tangan-bawah", label: "Diarahkan lurus ke bawah dengan santun" },
            { id: "tangan-pinggang", label: "Berkacak pinggang" },
            { id: "tangan-saku", label: "Dimasukkan ke dalam saku baju" },
          ],
          answer: "tangan-bawah",
        },
        why: "Menurunkan tangan kanan ke bawah adalah gestur memohon ruang melintas dengan hormat.",
        xp: 5,
      },
      {
        id: "u5-p1-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Saat melintas di depan tetua, kita dianjurkan berjalan cepat sambil berbisik kencang.",
        data: { statement: "Melintas di depan tetua dianjurkan berjalan cepat.", answer: false },
        why: "Langkah harus tenang dan terukur, bukan tergesa-gesa atau menimbulkan kegaduhan.",
        xp: 5,
      },
      {
        id: "u5-p1-match",
        type: "match",
        prompt: "Pasangkan bagian gestur tubuh dengan makna etikanya.",
        data: {
          pairs: [
            { left: "Badan membungkuk", right: "Merendahkan ego di hadapan tetua" },
            { left: "Tangan kanan merendah", right: "Membuka jalan dengan permisi" },
            { left: "Ucap kata Tabe", right: "Menyampaikan salam kesantunan lisan" },
          ],
        },
        why: "Harmoni tubuh dan tutur kata membentuk etika bertamu yang sempurna.",
        xp: 5,
      },
      {
        id: "u5-p1-order",
        type: "order",
        prompt: "Susun urutan tindakan saat kamu harus melintas di depan majelis tetua.",
        data: {
          items: ["Memperlambat langkah saat mendekat", "Membungkukkan badan dan merendahkan tangan", "Mengucapkan kata Tabe dengan nada lembut"],
          answer: ["Memperlambat langkah saat mendekat", "Membungkukkan badan dan merendahkan tangan", "Mengucapkan kata Tabe dengan nada lembut"],
        },
        why: "Urutan dimulai dari mengatur tempo, mengambil postur hormat, lalu mengucap permisi santun.",
        xp: 5,
      },
      {
        id: "u5-p1-hotspot",
        type: "hotspot",
        prompt: "Tentukan arah gestur tangan kanan yang benar saat melintas.",
        data: {
          imageUrl: "/media/presets/gestur_melintas.webp",
          imageCaption: "Peragaan Sikap Melintas di Hadapan Tetua Kaili",
          hotspots: [
            { id: "hotspot-tangan-bawah", label: "Tangan merendah", description: "Tangan mengarah santun ke lantai", top: "65%", left: "45%" },
            { id: "hotspot-pandangan", label: "Pandangan teduh", description: "Mata menatap lantai dengan rendah hati", top: "25%", left: "45%" },
          ],
          answer: "hotspot-tangan-bawah",
        },
        why: "Tangan kanan yang merendah ke bawah adalah simbol penghormatan fisik yang paling utama.",
        xp: 5,
      },
      {
        id: "u5-p1-scenario",
        type: "scenario",
        prompt: "Kamu sedang membawa berkas penting dan harus melewati lorong pertemuan tetua adat.",
        data: {
          steps: [
            {
              prompt: "Tetua sedang tekun bermusyawarah di sisi kanan lorong. Apa keputusanmu?",
              choices: [
                { id: "sc-tunggu-jeda", label: "Menunggu jeda bicara sebentar sebelum melintas", score: 2 },
                { id: "sc-terobos", label: "Langsung berlari menerobos di tengah-tengah mereka", score: 0 },
              ],
            },
            {
              prompt: "Saat ada celah ruang, bagaimana caramu melangkah lewat?",
              choices: [
                { id: "sc-tunduk-lewat", label: "Menunduk hormat, mengucap 'Tabe Pue', dan melangkah halus", score: 2 },
                { id: "sc-lewat-biasa", label: "Lewat biasa tanpa menoleh", score: 1 },
              ],
            },
            {
              prompt: "Seorang tetua tersenyum dan mengangguk kepadamu. Apa responsmu?",
              choices: [
                { id: "sc-balas-senyum", label: "Membalas anggukan dengan tatapan teduh penuh terima kasih", score: 2 },
                { id: "sc-melotot", label: "Menatap tajam", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Kepekaan membaca situasi membuat kehadiran tamu selalu disambut hangat.",
        xp: 5,
      },
    ],
  },
  {
    id: 12,
    unitId: 5,
    sectionId: 2,
    slug: "ruang-di-souraja-serambi-dan-ruang-dalam",
    title: "Ruang di Souraja: Serambi dan Ruang Dalam",
    subtitle: "Membaca zonasi arsitektur dan tata adab Banua Oge",
    objective: "Setelah pelajaran ini, kamu memahami batas ruang serambi tamu (Gandaria) dan ruang dalam di rumah adat Souraja.",
    concepts: [
      "Gandaria (serambi depan) sebagai ruang penerimaan umum dan perjumpaan awal tamu",
      "Ruang dalam (lontona) sebagai zona privat keluarga dan musyawarah inti pemangku adat",
      "Prinsip izin: tamu tidak melangkah masuk ke ruang dalam sebelum dipersilakan oleh tetua",
    ],
    region: "Palu Barat • Sulawesi Tengah (DATA DEMO)",
    intro: "Rumah adat Banua Oge (Souraja) bukan sekadar bangunan panggung megah, melainkan peta tata krama kehidupan masyarakat Kaili.",
    rewardXp: 30,
    badge: "Penjaga Adab Bertamu",
    source: {
      institution: "Draf Kurasi Internal (DATA DEMO)",
      informant: "Pemerhati Arsitektur Cagar Budaya",
      registrationCode: "DEMO-ARC-SOURAJA-ZONA",
      verifiedDate: "Draf Proses Validasi",
      summary: "Data demo edukasi zonasi ruang publik dan privat di rumah adat Souraja.",
      status: "DATA DEMO — draf dalam proses validasi",
    },
    questions: [
      {
        id: "u5-p2-choice",
        type: "choice",
        prompt: "Di bagian manakah seorang tamu menunggu sambutan awal saat tiba di Souraja?",
        data: {
          options: [
            { id: "gandaria", label: "Gandaria (serambi depan)" },
            { id: "kamar-tidur", label: "Bilik tidur tetua" },
            { id: "dapur-belakang", label: "Dapur belakang" },
          ],
          answer: "gandaria",
        },
        why: "Gandaria adalah serambi depan tempat menerima tamu dan menunggu izin tuan rumah.",
        xp: 5,
      },
      {
        id: "u5-p2-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Tamu diperbolehkan langsung melangkah ke ruang dalam tanpa menunggu dipersilakan.",
        data: { statement: "Tamu boleh langsung masuk tanpa izin.", answer: false },
        why: "Ruang dalam bersifat privat dan sakral, wajib menunggu izin tuan rumah sebelum memasukinya.",
        xp: 5,
      },
      {
        id: "u5-p2-match",
        type: "match",
        prompt: "Pasangkan bagian ruang Souraja dengan fungsinya yang tepat.",
        data: {
          pairs: [
            { left: "Anak Tangga", right: "Batas transisi membersihkan niat kedatangan" },
            { left: "Gandaria (Serambi)", right: "Penerimaan tamu dan salam awal" },
            { left: "Ruang Dalam", right: "Musyawarah kekeluargaan dan kehormatan" },
          ],
        },
        why: "Memahami batas ruang membantu menjaga kepatutan beretika di rumah adat.",
        xp: 5,
      },
      {
        id: "u5-p2-order",
        type: "order",
        prompt: "Susun alur pergerakan bertamu di Souraja dari bawah hingga masuk.",
        data: {
          items: ["Menaiki tangga dengan tenang", "Duduk di Gandaria menunggu tuan rumah", "Memasuki ruang dalam setelah dipersilakan"],
          answer: ["Menaiki tangga dengan tenang", "Duduk di Gandaria menunggu tuan rumah", "Memasuki ruang dalam setelah dipersilakan"],
        },
        why: "Alur bertamu diatur berjenjang dari pelataran, serambi depan, hingga ruang dalam.",
        xp: 5,
      },
      {
        id: "u5-p2-hotspot",
        type: "hotspot",
        prompt: "Pilih serambi depan (Gandaria) pada denah struktur arsitektur Souraja.",
        data: {
          imageUrl: "/media/presets/denah_souraja.webp",
          imageCaption: "Denah Zonasi Tata Ruang Souraja (Banua Oge)",
          hotspots: [
            { id: "hotspot-gandaria", label: "Gandaria", description: "Serambi tamu depan beratap panggung", top: "40%", left: "75%" },
            { id: "hotspot-dalam", label: "Ruang Dalam", description: "Area inti keluarga", top: "40%", left: "35%" },
          ],
          answer: "hotspot-gandaria",
        },
        why: "Gandaria berada di bagian depan panggung sebagai serambi penyambutan.",
        xp: 5,
      },
      {
        id: "u5-p2-scenario",
        type: "scenario",
        prompt: "Kamu mengantarkan surat kehormatan adat ke kediaman Souraja.",
        data: {
          steps: [
            {
              prompt: "Tiba di atas anak tangga serambi, apa tindakan pertamamu?",
              choices: [
                { id: "sc-duduk-gandaria", label: "Mengucapkan salam Tabe dan duduk dengan tenang di Gandaria", score: 2 },
                { id: "sc-buka-pintu", label: "Langsung membuka pintu ruang dalam", score: 0 },
              ],
            },
            {
              prompt: "Tuan rumah keluar ke serambi dan menyapa: 'Nalompa mai komi'. Apa responsmu?",
              choices: [
                { id: "sc-balas-hormat", label: "Menjawab dengan hormat dan menyampaikan maksud kedatangan", score: 2 },
                { id: "sc-langsung-masuk", label: "Langsung nyelonong masuk tanpa bicara", score: 0 },
              ],
            },
            {
              prompt: "Tuan rumah mempersilakan masuk ke ruang dalam untuk penyerahan surat.",
              choices: [
                { id: "sc-masuk-santun", label: "Melangkah masuk dengan menunduk ringan dan melepas alas kaki", score: 2 },
                { id: "sc-tolak-kasar", label: "Menolak dengan suara keras", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Ketaatan pada tata ruang adat mencerminkan adab tamu yang berbudi luhur.",
        xp: 5,
      },
    ],
  },

  // ==========================================
  // SECTION 3 — MENJADI BAGIAN KOMUNITAS (UNIT 6)
  // Status: DATA DEMO, draf dalam proses validasi
  // ==========================================
  {
    id: 13,
    unitId: 6,
    sectionId: 3,
    slug: "nosarara-nosabatutu-kita-bersaudara-kita-bersatu",
    title: "Nosarara Nosabatutu: Kita Bersaudara, Kita Bersatu",
    subtitle: "Menghayati falsafah persatuan dan tali persaudaraan",
    objective: "Setelah pelajaran ini, kamu memahami makna semboyan luhur Nosarara Nosabatutu sebagai pengikat kerukunan masyarakat Kaili.",
    concepts: [
      "Makna kata: Nosarara bermakna satu darah / bersaudara sejiwa",
      "Makna kata: Nosabatutu bermakna bersatu padu dalam satu ikatan teguh",
      "Falsafah persaudaraan ini melampaui perbedaan latar belakang untuk menciptakan perdamaian abadi",
    ],
    region: "Sulawesi Tengah (DATA DEMO)",
    intro: "Nosarara Nosabatutu adalah jiwa pemersatu yang mengajarkan bahwa dalam persaudaraan, duka satu adalah duka bersama.",
    rewardXp: 30,
    badge: "Pilar Persaudaraan",
    source: {
      institution: "Draf Kurasi Falsafah (DATA DEMO)",
      informant: "Pemerhati Kearifan Lokal",
      registrationCode: "DEMO-FLS-NOSARARA",
      verifiedDate: "Draf Proses Validasi",
      summary: "Data demo pembelajaran falsafah persaudaraan Kaili Nosarara Nosabatutu.",
      status: "DATA DEMO — draf dalam proses validasi",
    },
    questions: [
      {
        id: "u6-p1-choice",
        type: "choice",
        prompt: "Apa arti dari semboyan luhur suku Kaili 'Nosarara Nosabatutu'?",
        data: {
          options: [
            { id: "arti-nosarara", label: "Kita bersaudara, kita bersatu" },
            { id: "arti-perang", label: "Berlomba menjadi yang terkuat" },
            { id: "arti-dagang", label: "Berdagang ke negeri seberang" },
          ],
          answer: "arti-nosarara",
        },
        why: "Nosarara Nosabatutu berarti kita bersaudara dan kita bersatu dalam satu ikatan teguh.",
        xp: 5,
      },
      {
        id: "u6-p1-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Falsafah Nosarara Nosabatutu hanya berlaku untuk keluarga sedarah saja.",
        data: { statement: "Falsafah ini hanya untuk keluarga sedarah.", answer: false },
        why: "Falsafah ini menjadi payung persatuan bagi seluruh masyarakat dan pendatang di tanah Kaili.",
        xp: 5,
      },
      {
        id: "u6-p1-match",
        type: "match",
        prompt: "Pasangkan unsur kata dengan makna filosofisnya.",
        data: {
          pairs: [
            { left: "Nosarara", right: "Bersaudara / Satu pertalian darah" },
            { left: "Nosabatutu", right: "Bersatu padu / Satu tekad bersama" },
            { left: "Lembah Palu", right: "Ruang hidup bersama yang rukun" },
          ],
        },
        why: "Setiap kata merangkum nilai luhur perdamaian antargolongan.",
        xp: 5,
      },
      {
        id: "u6-p1-order",
        type: "order",
        prompt: "Susun alur penyelesaian kesalahpahaman berdasarkan semangat Nosarara.",
        data: {
          items: ["Duduk bersama dengan hati tenang", "Mengedepankan rasa persaudaraan", "Mencapai kesepakatan damai untuk bersatu"],
          answer: ["Duduk bersama dengan hati tenang", "Mengedepankan rasa persaudaraan", "Mencapai kesepakatan damai untuk bersatu"],
        },
        why: "Musyawarah adat mengutamakan persaudaraan sebelum merumuskan solusi bersama.",
        xp: 5,
      },
      {
        id: "u6-p1-hotspot",
        type: "hotspot",
        prompt: "Pilih simbol jabat erat persaudaraan pada relief Tugu Perdamaian Nosarara.",
        data: {
          imageUrl: "/media/presets/monumen_nosarara.webp",
          imageCaption: "Monumen Persaudaraan Nosarara Nosabatutu di Perbukitan Palu",
          hotspots: [
            { id: "hotspot-gong", label: "Gong Perdamaian", description: "Simbol harmoni antarbangsa", top: "35%", left: "50%" },
            { id: "hotspot-ikatan", label: "Tali Persaudaraan", description: "Simbol ikatan Nosarara", top: "70%", left: "50%" },
          ],
          answer: "hotspot-gong",
        },
        why: "Gong perdamaian di puncak monumen melambangkan persatuan dan tekad hidup rukun bersama.",
        xp: 5,
      },
      {
        id: "u6-p1-scenario",
        type: "scenario",
        prompt: "Dua kelompok warga pemuda mengalami perbedaan pendapat mengenai jadwal penggunaan lapangan desa.",
        data: {
          steps: [
            {
              prompt: "Sebagai penengah muda, prinsip apa yang pertama kamu ingatkan kepada mereka?",
              choices: [
                { id: "sc-ingatkan-nosarara", label: "Mengingatkan bahwa kita semua adalah saudara (Nosarara Nosabatutu)", score: 2 },
                { id: "sc-dukung-satu", label: "Membela pihak teman dekat saja", score: 0 },
              ],
            },
            {
              prompt: "Bagaimana cara mengajak mereka mencari jalan tengah?",
              choices: [
                { id: "sc-musyawarah-giliran", label: "Mengatur jadwal bersama secara adil dan bergantian", score: 2 },
                { id: "sc-tutup-lapangan", label: "Melarang kedua pihak berolahraga", score: 1 },
              ],
            },
            {
              prompt: "Setelah jadwal disepakati, bagaimana menutup musyawarah?",
              choices: [
                { id: "sc-jabat-tangan", label: "Saling berjabat tangan dan membersihkan lapangan bersama", score: 2 },
                { id: "sc-bubar-dingin", label: "Pergi tanpa saling tatap", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Semangat persaudaraan mengubah potensi konflik menjadi kekuatan gotong royong.",
        xp: 5,
      },
    ],
  },
  {
    id: 14,
    unitId: 6,
    sectionId: 3,
    slug: "padungku-syukur-kebersamaan-dan-berbagi",
    title: "Padungku: Syukur, Kebersamaan, dan Berbagi",
    subtitle: "Tradisi perayaan syukur panen dan keramahtamahan warga",
    objective: "Setelah pelajaran ini, kamu memahami esensi perayaan Padungku sebagai wujud syukur hasil panen dan saling berbagi makanan.",
    concepts: [
      "Makna utama Padungku: ungkapan syukur atas limpahan rezeki hasil bumi",
      "Nilai kebersamaan: membuka pintu rumah bagi kerabat, tetangga, dan tamu untuk bersantap bersama",
      "Catatan integritas: materi fokus pada nilai syukur dan gotong royong tanpa mengarang detail ritual atau tanggal khusus",
    ],
    region: "Kaili • Sulawesi Tengah (DATA DEMO)",
    intro: "Padungku adalah pesta syukur pascapanen, saat aroma masakan bambu menguar dan pintu rumah terbuka menyambut siapa saja.",
    rewardXp: 30,
    badge: "Penyemai Syukur",
    source: {
      institution: "Draf Kurasi Tradisi (DATA DEMO)",
      informant: "Pemerhati Tradisi Komunal",
      registrationCode: "DEMO-TRD-PADUNGKU",
      verifiedDate: "Draf Proses Validasi",
      summary: "Data demo pembelajaran makna umum tradisi syukur Padungku.",
      status: "DATA DEMO — draf dalam proses validasi",
      verificationNotes: [
        "Tahapan, sesaji, tokoh, dan tanggal Padungku — TIDAK dibahas dan TIDAK dikarang dalam file ini; hanya makna umumnya (syukur, kebersamaan, berbagi hasil panen) yang dipakai.",
      ],
    },
    questions: [
      {
        id: "u6-p2-choice",
        type: "choice",
        prompt: "Apakah nilai pokok yang dirayakan dalam tradisi komunal Padungku?",
        data: {
          options: [
            { id: "syukur-panen", label: "Rasa syukur panen, kebersamaan, dan saling berbagi" },
            { id: "lomba-senjata", label: "Adu kekuatan fisik antardesa" },
            { id: "perdagangan-emas", label: "Pasar lelang perhiasan" },
          ],
          answer: "syukur-panen",
        },
        why: "Padungku adalah tradisi ungkapan rasa syukur atas hasil panen dengan menjalin kebersamaan.",
        xp: 5,
      },
      {
        id: "u6-p2-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Tradisi Padungku dirayakan dengan menutup pintu rumah rapat-rapat agar makanan tidak habis.",
        data: { statement: "Padungku dirayakan dengan menutup pintu rumah rapat-rapat.", answer: false },
        why: "Sebaliknya, warga dengan lapang hati membuka pintu dan mengundang tetangga serta tamu untuk bersantap bersama.",
        xp: 5,
      },
      {
        id: "u6-p2-match",
        type: "match",
        prompt: "Pasangkan pilar perayaan Padungku dengan wujud tindakannya.",
        data: {
          pairs: [
            { left: "Syukur", right: "Menghargai berkah rezeki hasil bumi" },
            { left: "Kebersamaan", right: "Memasak dan berkumpul bersama warga" },
            { left: "Berbagi", right: "Menyuguhkan hidangan bagi tamu dan kerabat" },
          ],
        },
        why: "Tiga pilar ini menjadikan perayaan panen bermakna sosial mendalam.",
        xp: 5,
      },
      {
        id: "u6-p2-order",
        type: "order",
        prompt: "Susun alur perayaan Padungku di lingkungan kampung.",
        data: {
          items: ["Memanen hasil bumi secara bergotong royong", "Mengolah hidangan khas bersama di halaman", "Membuka jamuan makan bersama bagi seluruh tamu"],
          answer: ["Memanen hasil bumi secara bergotong royong", "Mengolah hidangan khas bersama di halaman", "Membuka jamuan makan bersama bagi seluruh tamu"],
        },
        why: "Proses panen, gotong royong dapur, berlanjut ke pesta jamuan syukur bersama.",
        xp: 5,
      },
      {
        id: "u6-p2-hotspot",
        type: "hotspot",
        prompt: "Pilih hidangan nasi bambu tradisional di atas perapian perayaan Padungku.",
        data: {
          imageUrl: "/media/presets/perayaan_padungku.webp",
          imageCaption: "Suasana Memasak Bersama dalam Tradisi Padungku",
          hotspots: [
            { id: "hotspot-masak-bambu", label: "Masakan Bambu", description: "Bambu berisi beras dimasak di perapian", top: "55%", left: "40%" },
            { id: "hotspot-meja-jamuan", label: "Meja Jamuan", description: "Tempat berkumpulnya tamu", top: "40%", left: "80%" },
          ],
          answer: "hotspot-masak-bambu",
        },
        why: "Bambu bakar berisi beras ketan merupakan hidangan khas perayaan panen yang dimasak bersama.",
        xp: 5,
      },
      {
        id: "u6-p2-scenario",
        type: "scenario",
        prompt: "Kamu kebetulan melintasi desa yang sedang menggelar perayaan Padungku dan diajak mampir oleh warga.",
        data: {
          steps: [
            {
              prompt: "Warga menyapamu dari halaman rumah: 'Mampir makan bersama kami!'. Apa respons santunmu?",
              choices: [
                { id: "sc-terima-ajakan", label: "Tersenyum, mengucap 'Tabe roa', dan menyambut ajakan dengan rendah hati", score: 2 },
                { id: "sc-tolak-curiga", label: "Menolak dengan tatapan curiga", score: 0 },
              ],
            },
            {
              prompt: "Di meja makan, tuan rumah menyajikan hidangan panen. Bagaimana adab makanmu?",
              choices: [
                { id: "sc-cicip-puji", label: "Mencicipi hidangan secukupnya dan memuji kelezatan masakan tuan rumah", score: 2 },
                { id: "sc-buang-makanan", label: "Menyisakan makanan dalam jumlah banyak", score: 0 },
              ],
            },
            {
              prompt: "Saat hendak pamit melanjutkan perjalanan, apa yang kamu sampaikan?",
              choices: [
                { id: "sc-doa-syukur", label: "Berterima kasih hangat dan mendoakan keberkahan rezeki bagi keluarga tuan rumah", score: 2 },
                { id: "sc-pamit-cepat", label: "Melompat pergi tanpa bersalaman", score: 0 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Menghargai undangan syukur adalah bentuk penghormatan tertinggi kepada kebaikan warga.",
        xp: 5,
      },
    ],
  },
  {
    id: 15,
    unitId: 6,
    sectionId: 3,
    slug: "hidup-nosarara-sehari-hari",
    title: "Hidup Nosarara Sehari-hari",
    subtitle: "Penerapan gotong royong dan kepedulian di tengah komunitas",
    objective: "Setelah pelajaran ini, kamu bisa menerapkan nilai Nosarara dalam tindakan gotong royong dan tolong-menolong di kehidupan nyata.",
    concepts: [
      "Sikap tolong-menolong tanpa memandang perbedaan suku, agama, dan golongan",
      "Semangat kerja bakti (gotong royong) merawat fasilitas umum dan lingkungan desa",
      "Menjaga tutur kata agar senantiasa menyejukkan suasana dan memperkokoh persatuan",
    ],
    region: "Kaili • Sulawesi Tengah (DATA DEMO)",
    intro: "Kearifan adat tidak berhenti pada upacara, melainkan hidup dalam tindakan nyata saat kita saling meringankan beban sesama.",
    rewardXp: 30,
    badge: "Penjaga Nosarara",
    source: {
      institution: "Draf Kurasi Komunitas (DATA DEMO)",
      informant: "Penggerak Komunitas Pemuda",
      registrationCode: "DEMO-KOM-HIDUP-NOSARARA",
      verifiedDate: "Draf Proses Validasi",
      summary: "Data demo pembelajaran penerapan nilai Nosarara dalam gotong royong harian.",
      status: "DATA DEMO — draf dalam proses validasi",
    },
    questions: [
      {
        id: "u6-p3-choice",
        type: "choice",
        prompt: "Manakah tindakan nyata yang paling mencerminkan penerapan semangat Nosarara sehari-hari?",
        data: {
          options: [
            { id: "gotong-royong", label: "Ikut kerja bakti membersihkan lingkungan dan membantu tetangga yang kesusahan" },
            { id: "hanya-keluarga", label: "Hanya peduli pada kenyamanan rumah sendiri" },
            { id: "kompetisi-egois", label: "Bersaing tidak sehat untuk menjatuhkan rekan" },
          ],
          answer: "gotong-royong",
        },
        why: "Nosarara hidup melalui gotong royong nyata yang meringankan beban sesama.",
        xp: 5,
      },
      {
        id: "u6-p3-truefalse",
        type: "truefalse",
        prompt: "Mitos atau fakta? Membantu warga yang berbeda suku tetap sejalan dengan falsafah Nosarara Nosabatutu.",
        data: { statement: "Membantu warga beda suku sejalan dengan Nosarara.", answer: true },
        why: "Nosarara merangkul segenap umat manusia dalam persaudaraan yang tulus.",
        xp: 5,
      },
      {
        id: "u6-p3-match",
        type: "match",
        prompt: "Pasangkan situasi sosial dengan wujud tindakan persaudaraan yang sesuai.",
        data: {
          pairs: [
            { left: "Tetangga sakit", right: "Menjenguk dan membawakan makanan" },
            { left: "Jalan desa rusak", right: "Gotong royong memperbaiki bersama" },
            { left: "Ada perselisihan", right: "Mendamaikan dengan kepala dingin" },
          ],
        },
        why: "Tindakan tolong-menolong mempererat tali silaturahmi komunitas.",
        xp: 5,
      },
      {
        id: "u6-p3-order",
        type: "order",
        prompt: "Susun tahapan menggerakkan kegiatan kerja bakti pemuda desa.",
        data: {
          items: ["Musyawarah menentukan titik kerja bakti", "Membagi tugas secara adil dan riang", "Menikmati makan bersama seusai bekerja"],
          answer: ["Musyawarah menentukan titik kerja bakti", "Membagi tugas secara adil dan riang", "Menikmati makan bersama seusai bekerja"],
        },
        why: "Gotong royong diawali musyawarah mufakat, pelaksanaan bersama, dan ditutup kegembiraan persaudaraan.",
        xp: 5,
      },
      {
        id: "u6-p3-hotspot",
        type: "hotspot",
        prompt: "Pilih titik pos ronda desa tempat warga berkumpul menjaga keamanan bersama.",
        data: {
          imageUrl: "/media/presets/desa_kaili.webp",
          imageCaption: "Kehidupan Guyub Rukun di Desa Kaili",
          hotspots: [
            { id: "hotspot-pos-ronda", label: "Pos Ronda", description: "Pusat koordinasi keamanan warga", top: "55%", left: "25%" },
            { id: "hotspot-balai-desa", label: "Balai Warga", description: "Ruang musyawarah komunal", top: "45%", left: "70%" },
          ],
          answer: "hotspot-pos-ronda",
        },
        why: "Pos ronda menjadi simbol kepedulian gotong royong menjaga ketenteraman kampung.",
        xp: 5,
      },
      {
        id: "u6-p3-scenario",
        type: "scenario",
        prompt: "Sebuah keluarga pendatang baru saja pindah ke lingkungan RT-mu.",
        data: {
          steps: [
            {
              prompt: "Bagaimana sikapmu menyambut tetangga baru tersebut?",
              choices: [
                { id: "sc-sapa-tetangga-baru", label: "Menyapa dengan hangat, membawakan buah tangan, dan memperkenalkan lingkungan", score: 2 },
                { id: "sc-acuh", label: "Membiarkan mereka kebingungan sendirian", score: 0 },
              ],
            },
            {
              prompt: "Ketika rumah mereka membutuhkan bantuan saat menata barang berat, apa yang kamu lakukan?",
              choices: [
                { id: "sc-ajak-teman-bantu", label: "Mengajak pemuda sekitar untuk membantu mengangkat barang bersama-sama", score: 2 },
                { id: "sc-tonton-saja", label: "Menonton dari jauh tanpa menawarkan bantuan", score: 0 },
              ],
            },
            {
              prompt: "Keluarga baru itu terharu dan merasa diterima. Nilai apa yang telah berhasil kamu hidupkan?",
              choices: [
                { id: "sc-hidupkan-nosarara", label: "Nosarara Nosabatutu: kita semua adalah saudara satu keluarga", score: 2 },
                { id: "sc-kebetulan", label: "Sekadar mengisi waktu luang", score: 1 },
              ],
            },
          ],
          passingScore: 5,
        },
        why: "Menyambut sesama dengan keterbukaan hati adalah bukti nyata kearifan budaya nusantara.",
        xp: 5,
      },
    ],
  },
];

export function getLessonById(lessonId: number): Lesson | null {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getLessonsByUnitId(unitId: number): Lesson[] {
  return lessons.filter((lesson) => lesson.unitId === unitId);
}

export function getLessonsBySectionId(sectionId: number): Lesson[] {
  return lessons.filter((lesson) => lesson.sectionId === sectionId);
}
