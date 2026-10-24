import { GameSession } from "./types";

export const migratedLesson1: GameSession = {
  id: "1",
  title: "Salam & Adab Tabe",
  chapter: "Pelajaran 1 • Kaili Ledo",
  subEthnic: "Kaili Ledo • Lembah Palu",
  streakDays: 3,
  xpReward: 20,
  status: "published",
  culturalSourceCard: {
    institution: "Dewan Adat Kaili (LAK) & Balai Pelestarian Kebudayaan Wilayah XVIII",
    informant: "Tokoh Adat Kaili Ledo (Lembah Palu)",
    registrationCode: "SULTENG-BBS-2024/KL-01",
    verifiedDate: "Oktober 2024",
    summary:
      "Materi etika tutur dan salam santun Tabe didasarkan pada tata krama pergaulan masyarakat Kaili Ledo.",
    status: "Draft — dalam proses validasi",
  },
  questions: [
    {
      id: "tabe-choice",
      type: "multiple_choice",
      title: "Sapaan Beranda",
      prompt: "Kamu melewati tetua di beranda. Apa tindakan yang paling sesuai?",
      subPrompt: "Pilihlah satu tindakan santun menurut adab Kaili Ledo.",
      badge: "Etika Tutur",
      options: [
        {
          id: "tabe",
          label: "A",
          title: "Mengucapkan Tabe sambil menunduk",
          subtitle: "Permisi dengan gesture merendah.",
          isCorrect: true,
        },
        {
          id: "walk",
          label: "B",
          title: "Langsung lewat tanpa menyapa",
          subtitle: "Berjalan biasa tanpa kontak adab.",
          isCorrect: false,
        },
        {
          id: "wave",
          label: "C",
          title: "Melambaikan tangan dari jauh",
          subtitle: "Gerakan santai dari kejauhan.",
          isCorrect: false,
        },
      ],
      curatorNote:
        "Tabe menyampaikan permisi dan hormat, terutama saat melewati orang yang dituakan.",
    },
    {
      id: "tabe-fact",
      type: "true_false",
      title: "Konteks Penggunaan Tabe",
      prompt: "Mitos atau fakta? Tabe hanya digunakan untuk mengucapkan selamat tinggal.",
      statement: "Tabe hanya digunakan untuk mengucapkan selamat tinggal.",
      answerBoolean: false,
      badge: "Mitos & Fakta",
      curatorNote:
        "Tabe dapat digunakan untuk meminta izin, menyapa, atau melewati seseorang dengan hormat.",
    },
    {
      id: "tabe-match",
      type: "match",
      title: "Jodohkan Ungkapan",
      prompt: "Pasangkan ungkapan dengan konteksnya yang tepat.",
      badge: "Jodohkan Pasangan",
      pairs: [
        { left: "Tabe", right: "Permisi atau hormat" },
        { left: "Pue", right: "Tokoh yang dituakan" },
      ],
      curatorNote:
        "Memahami hubungan kata dan konteks membantu memilih sapaan yang tidak keliru.",
    },
    {
      id: "tabe-order",
      type: "order",
      title: "Urutan Bertamu",
      prompt: "Susun langkah bertamu yang santun berikut ini.",
      badge: "Susun Langkah",
      items: ["Menunggu ruang", "Mengucapkan Tabe", "Menyampaikan tujuan"],
      curatorNote:
        "Urutan yang tenang memberi ruang bagi tuan rumah sebelum percakapan dimulai.",
    },
    {
      id: "tabe-scenario",
      type: "scenario",
      title: "Skenario Bertamu ke Souraja",
      prompt: "Jalankan misi singkat bertamu ke Souraja.",
      badge: "Skenario Sikap",
      steps: [
        {
          prompt: "Tetua sedang berbicara. Apa langkahmu?",
          choices: [
            { label: "Menunggu di sisi tangga", score: 1, feedback: "Cukup tenang dan sabar." },
            { label: "Mengucapkan Tabe sambil menunduk", score: 2, feedback: "Sangat santun dan tepat adab." },
          ],
        },
        {
          prompt: "Tetua menoleh. Bagaimana kamu membuka percakapan?",
          choices: [
            { label: "Tabe pue, nalompa mai kami", score: 2, feedback: "Bagus sekali! Memakai sapaan adat Kaili." },
            { label: "Halo, kami datang", score: 1, feedback: "Terlalu kasual untuk tetua adat." },
          ],
        },
        {
          prompt: "Kamu dipersilakan mendekat. Apa gesturemu?",
          choices: [
            { label: "Menunduk ringan dengan tangan kanan merendah", score: 2, feedback: "Sempurna! Gestur khas Kaili yang penuh hormat." },
            { label: "Melambaikan tangan dari jauh", score: 0, feedback: "Kurang pantas di hadapan tetua adat." },
          ],
        },
      ],
      passingScore: 5,
      curatorNote:
        "Adab bukan hanya kata, tetapi juga waktu, nada, dan gesture saat bertamu.",
    },
  ],
};

export const migratedLesson2: GameSession = {
  id: "2",
  title: "Kenali Baju Nggembe",
  chapter: "Pelajaran 2 • Busana adat",
  subEthnic: "Kaili • Donggala",
  streakDays: 5,
  xpReward: 25,
  status: "published",
  culturalSourceCard: {
    institution: "Komunitas Pelestari Tenun & Busana Tradisional Kaili",
    informant: "Pemerhati Busana Adat Kaili & Tenun Donggala",
    registrationCode: "SULTENG-BSN-2024/KL-02",
    verifiedDate: "November 2024",
    summary:
      "Karakteristik busana Baju Nggembe dan Buya Sabe dikurasi dari dokumentasi etnografi busana adat Sulawesi Tengah.",
    status: "Draft — dalam proses validasi",
  },
  questions: [
    {
      id: "nggembe-choice",
      type: "multiple_choice",
      title: "Pilihan Busana Tamu",
      prompt: "Busana mana yang paling selaras untuk menghadiri pernikahan adat sebagai tamu?",
      badge: "Tata Busana",
      options: [
        {
          id: "formal",
          label: "A",
          title: "Baju Nggembe dan Buya Sabe",
          subtitle: "Busana upacara resmi adat Kaili.",
          isCorrect: true,
        },
        {
          id: "work",
          label: "B",
          title: "Pakaian kerja sehari-hari",
          subtitle: "Terlalu kasual untuk hajatan adat.",
          isCorrect: false,
        },
        {
          id: "loud",
          label: "C",
          title: "Aksesori paling mencolok",
          subtitle: "Menarik perhatian berlebih dari pengantin.",
          isCorrect: false,
        },
      ],
      curatorNote:
        "Tamu menjaga keselarasan dengan acara dan tidak mengambil fokus dari prosesi utama.",
    },
    {
      id: "nggembe-fact",
      type: "true_false",
      title: "Asal Kain Buya Sabe",
      prompt: "Mitos atau fakta? Buya Sabe adalah kain tenun Donggala yang dapat melengkapi busana adat.",
      statement: "Buya Sabe adalah kain tenun Donggala yang dapat melengkapi busana adat.",
      answerBoolean: true,
      badge: "Kriya Tenun",
      curatorNote:
        "Buya Sabe dikenal sebagai kain tenun Donggala yang menjadi bagian penting dari konteks busana.",
    },
    {
      id: "nggembe-hotspot",
      type: "hotspot",
      title: "Anatomi Baju Nggembe",
      prompt: "Temukan bagian busana yang berkaitan dengan kain tenun utama.",
      badge: "Anatomi Busana",
      imageUrl: "/media/presets/baju_nggembe.webp",
      imageCaption: "Busana Adat Kaili: Baju Nggembe & Buya Sabe",
      hotspots: [
        {
          id: 1,
          name: "Kerah persegi",
          title: "Kerah persegi",
          description: "Bagian leher yang memberi ruang pada aksesori.",
          top: "28%",
          left: "50%",
        },
        {
          id: 2,
          name: "Lengan menggantung",
          title: "Lengan menggantung",
          description: "Bagian lengan dengan gerak yang lebih terbuka.",
          top: "35%",
          left: "20%",
        },
        {
          id: 3,
          name: "Buya Sabe",
          title: "Buya Sabe",
          description: "Kain tenun utama yang melengkapi tampilan.",
          top: "72%",
          left: "50%",
        },
      ],
      options: [
        { id: "1", label: "A", title: "Kerah persegi", isCorrect: false },
        { id: "2", label: "B", title: "Lengan menggantung", isCorrect: false },
        { id: "3", label: "C", title: "Buya Sabe", isCorrect: true },
      ],
      curatorNote:
        "Mengenali lokasi dan fungsi kain membantu membaca anatomi busana secara utuh.",
    },
    {
      id: "nggembe-order",
      type: "order",
      title: "Cara Mengamati Busana",
      prompt: "Susun cara mengamati busana adat dengan teliti.",
      badge: "Apresiasi Kriya",
      items: ["Amati bentuk", "Baca bahan", "Hubungkan dengan acara"],
      curatorNote:
        "Busana dibaca dari bentuk, bahan, lalu konteks pemakaiannya.",
    },
    {
      id: "nggembe-match",
      type: "match",
      title: "Pasangan Detail Busana",
      prompt: "Pasangkan detail busana dengan maknanya.",
      badge: "Jodohkan Pasangan",
      pairs: [
        { left: "Buya Sabe", right: "Tenun Donggala" },
        { left: "Kerah persegi", right: "Ruang untuk aksesori" },
      ],
      curatorNote:
        "Pasangan yang tepat menghubungkan istilah busana dengan fungsi dan asalnya.",
    },
  ],
};

export const migratedLesson3: GameSession = {
  id: "3",
  title: "Skenario Souraja",
  chapter: "Pelajaran 3 • Rumah adat",
  subEthnic: "Palu Barat • Sulawesi Tengah",
  streakDays: 7,
  xpReward: 30,
  status: "published",
  culturalSourceCard: {
    institution: "Pengelola Cagar Budaya Banua Oge (Souraja) & Disbud Sulteng",
    informant: "Pemandu Cagar Budaya Souraja Palu Barat",
    registrationCode: "SULTENG-CGB-2024/KL-03",
    verifiedDate: "Desember 2024",
    summary:
      "Skenario adab bertamu dan tata ruang Banua Oge disusun sesuai protokol adat penerimaan tamu Souraja.",
    status: "Draft — dalam proses validasi",
  },
  questions: [
    {
      id: "souraja-choice",
      type: "multiple_choice",
      title: "Ketibaan di Beranda",
      prompt: "Saat tiba di beranda, apa yang kamu lakukan lebih dulu?",
      badge: "Tata Ruang Adat",
      options: [
        {
          id: "wait",
          label: "A",
          title: "Menunggu ruang untuk menyapa",
          subtitle: "Melihat situasi sebelum berbicara.",
          isCorrect: true,
        },
        {
          id: "enter",
          label: "B",
          title: "Langsung masuk",
          subtitle: "Melangkah sebelum dipersilakan.",
          isCorrect: false,
        },
        {
          id: "call",
          label: "C",
          title: "Memanggil dari jauh",
          subtitle: "Bersuara keras dari luar.",
          isCorrect: false,
        },
      ],
      curatorNote:
        "Memberi ruang menunjukkan bahwa kamu membaca situasi sebelum bertindak.",
    },
    {
      id: "souraja-fact",
      type: "true_false",
      title: "Sapaan & Gesture",
      prompt: "Mitos atau fakta? Sapaan dan gesture memiliki peran yang sama pentingnya dalam situasi adat.",
      statement: "Sapaan dan gesture memiliki peran yang sama pentingnya dalam situasi adat.",
      answerBoolean: true,
      badge: "Adab Kaili",
      curatorNote:
        "Makna sapaan diperkuat oleh cara tubuh dan timing saat menyampaikannya.",
    },
    {
      id: "souraja-hotspot",
      type: "hotspot",
      title: "Tata Ruang Banua Oge",
      prompt: "Temukan titik yang menjadi ruang kedatangan tamu.",
      badge: "Arsitektur Souraja",
      imageUrl: "/media/presets/souraja.webp",
      imageCaption: "Pelataran & Struktur Arsitektur Adat Souraja (Banua Oge), Kaili",
      hotspots: [
        {
          id: 1,
          name: "Anak tangga",
          title: "Anak tangga",
          description: "Ruang transisi sebelum masuk.",
          top: "76%",
          left: "64%",
        },
        {
          id: 2,
          name: "Serambi",
          title: "Serambi",
          description: "Ruang menyapa dan menerima tamu.",
          top: "56%",
          left: "50%",
        },
        {
          id: 3,
          name: "Ruang dalam",
          title: "Ruang dalam",
          description: "Area yang dimasuki setelah dipersilakan.",
          top: "52%",
          left: "32%",
        },
      ],
      options: [
        { id: "1", label: "A", title: "Anak tangga", isCorrect: false },
        { id: "2", label: "B", title: "Serambi", isCorrect: true },
        { id: "3", label: "C", title: "Ruang dalam", isCorrect: false },
      ],
      curatorNote:
        "Membaca ruang membantu menentukan kapan dan di mana sapaan dilakukan.",
    },
    {
      id: "souraja-match",
      type: "match",
      title: "Tindakan dan Tujuan Sosial",
      prompt: "Pasangkan tindakan dengan tujuan sosialnya.",
      badge: "Jodohkan Pasangan",
      pairs: [
        { left: "Menunggu", right: "Memberi ruang" },
        { left: "Tabe", right: "Meminta izin" },
      ],
      curatorNote:
        "Setiap tindakan kecil menyampaikan niat dan posisi sosial dalam situasi bertamu.",
    },
    {
      id: "souraja-scenario",
      type: "scenario",
      title: "Tiga Keputusan di Souraja",
      prompt: "Selesaikan tiga keputusan saat menghadiri upacara di Souraja.",
      badge: "Simulasi Souraja",
      steps: [
        {
          prompt: "Tetua sedang berbicara. Apa tindakanmu?",
          choices: [
            { label: "Menunggu di sisi tangga", score: 1, feedback: "Cukup sabar dan memperhatikan keadaan." },
            { label: "Ucapkan Tabe pue sambil menunduk", score: 2, feedback: "Sangat beradab dan santun." },
          ],
        },
        {
          prompt: "Kamu hadir sebagai tamu kehormatan. Apa yang dikenakan?",
          choices: [
            { label: "Baju Nggembe dan Buya Sabe", score: 2, feedback: "Busana yang sangat pantas untuk tamu kehormatan." },
            { label: "Pakaian sehari-hari", score: 1, feedback: "Kurang khidmat untuk upacara adat." },
          ],
        },
        {
          prompt: "Tuan rumah mempersilakanmu duduk. Apa responsmu?",
          choices: [
            { label: "Menunduk ringan dan berterima kasih", score: 2, feedback: "Tata krama paripurna." },
            { label: "Mengangguk singkat", score: 1, feedback: "Cukup sopan." },
          ],
        },
      ],
      passingScore: 5,
      curatorNote:
        "Kearifan budaya dipraktikkan melalui rangkaian keputusan, bukan hafalan satu jawaban.",
    },
  ],
};

export const MIGRATED_BUILTIN_SESSIONS: GameSession[] = [
  migratedLesson1,
  migratedLesson2,
  migratedLesson3,
];
