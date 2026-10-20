import { GameSession } from "./types";

export const sampleKailiLesson: GameSession = {
  id: "SES-KL-MASTER-001",
  title: "Master Lesson: Adab Tutur & Busana Adat Kaili",
  chapter: "Bab 1: Sapaan Harian & Kehormatan",
  subEthnic: "Bahasa Kaili Ledo • Lembah Palu",
  streakDays: 6,
  xpReward: 50,
  culturalSourceCard: {
    institution: "Dewan Adat Kaili (LAK) & Balai Pelestarian Kebudayaan XVIII",
    informant: "Pemangku Adat Kaili Ledo (Lembah Palu)",
    registrationCode: "SULTENG-BBS-2024/KL-01",
    verifiedDate: "Tahap Kurasi Etnolinguistik 2024",
    summary:
      "Materi kata sapaan Tabe, frasa penyambutan, dan busana adat Baju Nggembe dikurasi dari dokumentasi budaya Kaili Ledo sebagai data percontohan.",
    status: "Draft — dalam proses validasi",
  },
  questions: [
    // -------------------------------------------------------------
    // LAYAR 1 (LEARN - Pengenalan Tanpa Beban)
    // -------------------------------------------------------------
    {
      id: "STAGE-1-LEARN",
      type: "learn",
      title: "Layar 1: Pengenalan",
      prompt: "Kenali Kosakata Adat: Tabe",
      term: "Tabe",
      ipa: "[ta-be]",
      meaning: "Permisi / Mohon Maaf / Hormat",
      speakerInfo: "Penutur Asli: Kak Rusdi (38 thn), Palu Barat",
      audioDuration: "0:04",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7N2RFcBe-VYBGKMVs4RI4fFK_WSAUDavo27MijrqUn0YQFka80Yn6NkLi6NvGUbK_bJsS8bxcs28vXZzzSYuCH3Ml0J8fP_QUR9cO8O6P4uj6LPVZiMDbqT-WEq9WNuQpc2RkTZjx2GyyDWs9peP4G71dL_BEyEljdiyuWO1T87OOfAPwt55ywofq5wU-uIHzArEIeZvJHOo2j8vTDtd7ZuvboUHGas1ryZWxBpc6twFUkXuBoN1i4Q",
      imageCaption: "Sikap tubuh merunduk dengan tangan kanan terentang saat melintas di hadapan tetua.",
      curatorNote: "Ucapkan 'Tabe' sambil sedikit membungkukkan badan ketika melintas di depan tetua adat atau meminta izin berbicara dalam musyawarah.",
    },

    // -------------------------------------------------------------
    // LAYAR 2 (PRACTICE MUDAH - Reseptif & Visual)
    // -------------------------------------------------------------
    {
      id: "STAGE-2-VISUAL",
      type: "visual",
      title: "Layar 2: Uji Visual",
      prompt: "Baju Adat Apakah Ini?",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj2iA59wILAhgAw8HMAnmW9QdcqFfX57-hJxYVwmDa_TIIWaSw-Kc4eFO1rMzFSmUSWaCsR1mc9aG9AJN89VtVyZUXli2LW4NjVz3ml-5uq6E744sPk8UgPKxuJphS95np5CSgkykg5fgy3_LgLXvhj3CMceZH2EGLapdsSBHrbHSm9m9oAxEaEgaUxuV8LZqHldRPHobtxIN-TmnBfXDHI9TU7nC_212k-oXusVst0GcUGaQ4ma_Ysw",
      hotspots: [
        {
          id: 1,
          name: "Kerah Persegi Dada",
          title: "Leher Lebar",
          description: "Pola segi empat tanpa kancing leher khas iklim tropis Lembah Palu.",
          top: "22%",
          left: "50%",
        },
        {
          id: 2,
          name: "Lengan Melebar Menggantung",
          title: "Lengan Longgar",
          description: "Melambangkan keterbukaan budi pekerti wanita Kaili menyambut tamu adat.",
          top: "38%",
          left: "26%",
        },
      ],
      options: [
        { id: "opt-vis-1", title: "Baju Nggembe", isCorrect: true },
        { id: "opt-vis-2", title: "Baju Bodo", isCorrect: false },
        { id: "opt-vis-3", title: "Kebaya Encim", isCorrect: false },
        { id: "opt-vis-4", title: "Baju Kurung", isCorrect: false },
      ],
      curatorNote: "Tepat! Baju Nggembe adalah blus upacara wanita suku Kaili berpotongan segi empat longgar tanpa kancing penutup leher.",
    },

    // -------------------------------------------------------------
    // LAYAR 3 (PRACTICE MUDAH - Reseptif & Audio Match)
    // -------------------------------------------------------------
    {
      id: "STAGE-3-AUDIO",
      type: "audio",
      title: "Layar 3: Uji Audio",
      prompt: "Dengarkan dan Pahami arti salam kehormatan berikut:",
      term: "Tabe",
      options: [
        { id: "opt-aud-1", title: "Permisi / Hormat", isCorrect: true },
        { id: "opt-aud-2", title: "Sampai Jumpa", isCorrect: false },
        { id: "opt-aud-3", title: "Terima Kasih", isCorrect: false },
        { id: "opt-aud-4", title: "Selamat Datang", isCorrect: false },
      ],
      curatorNote: "'Tabe' adalah sapaan santun paling luhur dalam tata krama bertamu dan bertegur sapa masyarakat Kaili.",
    },

    // -------------------------------------------------------------
    // LAYAR 4 (PRACTICE MENENGAH - Word Builder)
    // -------------------------------------------------------------
    {
      id: "STAGE-4-WORD-BUILDER",
      type: "word_builder",
      title: "Layar 4: Susun Kepingan Kata",
      prompt: "Susun kalimat penyambutan tamu kehormatan: 'Selamat Datang (Kami Menyambutmu)'",
      targetSentence: ["Nalompa", "mai", "kami"],
      wordTiles: ["kami", "Tabe", "Nalompa", "mai", "Pue"],
      curatorNote: "'Nalompa mai kami' adalah frasa sakral dialek Kaili Ledo & Tara saat tuan rumah menyambut kedatangan tamu agung dengan tangan terbuka.",
    },

    // -------------------------------------------------------------
    // LAYAR 5 (PRACTICE MENENGAH - Mix & Match Atribut Busana)
    // -------------------------------------------------------------
    {
      id: "STAGE-5-MATCHING",
      type: "matching",
      title: "Layar 5: Jodohkan Pasangan",
      prompt: "Pasangkan atribut busana adat Kaili dengan fungsinya yang tepat:",
      matchingPairs: [
        {
          id: "pair-1",
          left: "Baju Nggembe",
          right: "Blus Upacara Putri",
        },
        {
          id: "pair-2",
          left: "Buya Sabe",
          right: "Sarung Tenun Sutra",
        },
        {
          id: "pair-3",
          left: "Sampa / Dali",
          right: "Kalung Susun Kuningan",
        },
      ],
      curatorNote: "Sempurna! Perpaduan Baju Nggembe, sarung tenun sutra Buya Sabe Donggala, dan kalung Sampa adalah kelengkapan busana adat perempuan Kaili saat perhelatan resmi.",
    },

    // -------------------------------------------------------------
    // LAYAR 6 (CONNECT - Simulasi Sosial / Mini Roleplay)
    // -------------------------------------------------------------
    {
      id: "STAGE-6-ROLEPLAY",
      type: "roleplay",
      title: "Layar 6: Skenario Nyata di Souraja",
      prompt: "Simulasi Adat di Rumah Tradisional Souraja",
      scenarioContext: "Kamu tiba di pelataran rumah panggung Souraja untuk menghadiri upacara adat dan disambut oleh Tetua Adat Kaili.",
      npcDialogue: "Nalompa mai kami, ananda...",
      options: [
        {
          id: "opt-rp-1",
          title: "Tabe Pue, terima kasih atas sambutan hangat tetua adat.",
          isCorrect: true,
        },
        {
          id: "opt-rp-2",
          title: "Halo paman, saya mau jalan-jalan foto di Souraja.",
          isCorrect: false,
        },
        {
          id: "opt-rp-3",
          title: "Sama-sama, saya buru-buru mau pulang setelah ini.",
          isCorrect: false,
        },
      ],
      curatorNote: "Luar biasa diplomasi adatmu! Menggunakan sapaan kehormatan 'Tabe Pue' mencerminkan tata krama bertamu yang menjunjung tinggi martabat tetua Souraja.",
    },
  ],
};
