/**
 * Seed data for Nusantara: Before It's Gone
 *
 * Contains 6 knowledge entries with risk snapshots, DNA nodes,
 * learning paths, lineage entries, and cultural holder profiles.
 *
 * Primary case study: Tenun Sekomandi (Sulawesi Tengah)
 */

import type {
  Knowledge,
  KnowledgeCurrentRisk,
  KnowledgeWithRisk,
  KnowledgeDnaNode,
  KnowledgeRiskImpactItem,
  KnowledgeLineageEntry,
  LearningPath,
  LearningPathStep,
  HolderWithProfile,
  Apprenticeship,
} from "@/types/database";

// =============================================================
// KNOWLEDGE ENTRIES
// =============================================================

export const knowledgeEntries: Knowledge[] = [
  {
    id: "k-001",
    title: "Tenun Sekomandi",
    category: "craft",
    region: "Sigi, Sulawesi Tengah",
    summary:
      "Kain tenun tradisional suku Kaili yang menggunakan pewarna alami dari kulit kayu dan akar tumbuhan. Setiap motif menyimpan makna filosofis tentang hubungan manusia dengan alam dan komunitas.",
    cover_media_url: null,
    consent_level: "public",
    organization_id: null,
    created_by: "u-holder-001",
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-09-15T00:00:00Z",
  },
  {
    id: "k-002",
    title: "Bahasa Kulawi",
    category: "language",
    region: "Kulawi, Sulawesi Tengah",
    summary:
      "Bahasa daerah yang dituturkan oleh komunitas Kulawi di pedalaman Sulawesi Tengah. Memiliki sistem bunyi dan kosakata unik yang tidak ditemukan di bahasa Kaili lainnya.",
    cover_media_url: null,
    consent_level: "public",
    organization_id: null,
    created_by: "u-holder-002",
    created_at: "2026-08-05T00:00:00Z",
    updated_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "k-003",
    title: "Musik Kakula",
    category: "music",
    region: "Palu, Sulawesi Tengah",
    summary:
      "Alat musik perkusi tradisional dari bambu yang dimainkan dalam upacara adat dan ritual panen. Teknik pembuatan dan cara memainkannya hanya dikuasai oleh segelintir maestro.",
    cover_media_url: null,
    consent_level: "public",
    organization_id: null,
    created_by: "u-holder-003",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-09-12T00:00:00Z",
  },
  {
    id: "k-004",
    title: "Kaledo — Sup Tulang Tradisional",
    category: "culinary",
    region: "Donggala, Sulawesi Tengah",
    summary:
      "Sup tulang sapi khas Sulawesi Tengah yang menjadi makanan wajib dalam perayaan adat. Resep otentik menggunakan rempah lokal yang semakin sulit ditemukan.",
    cover_media_url: null,
    consent_level: "public",
    organization_id: null,
    created_by: null,
    created_at: "2026-08-12T00:00:00Z",
    updated_at: "2026-09-14T00:00:00Z",
  },
  {
    id: "k-005",
    title: "Ritual Balia",
    category: "ritual",
    region: "Kaili, Sulawesi Tengah",
    summary:
      "Ritual penyembuhan tradisional suku Kaili yang menggabungkan tarian, nyanyian, dan pengobatan herbal. Dipimpin oleh seorang Sando (dukun) yang telah melalui proses inisiasi panjang.",
    cover_media_url: null,
    consent_level: "community_only",
    organization_id: null,
    created_by: "u-holder-004",
    created_at: "2026-08-15T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "k-006",
    title: "Cerita Rakyat To Manuru",
    category: "oral_story",
    region: "Parigi Moutong, Sulawesi Tengah",
    summary:
      "Epos lisan tentang asal-usul masyarakat Kaili yang diturunkan secara verbal selama berabad-abad. Mengandung kosmologi, hukum adat, dan nilai-nilai kehidupan bermasyarakat.",
    cover_media_url: null,
    consent_level: "public",
    organization_id: null,
    created_by: null,
    created_at: "2026-08-20T00:00:00Z",
    updated_at: "2026-09-08T00:00:00Z",
  },
];

// =============================================================
// RISK SNAPSHOTS (current)
// =============================================================

export const riskSnapshots: KnowledgeCurrentRisk[] = [
  {
    knowledge_id: "k-001",
    known_practitioners: 2,
    apprentice_count: 0,
    documentation_pct: 15,
    risk_level: "critical",
    computed_at: "2026-09-15T00:00:00Z",
  },
  {
    knowledge_id: "k-002",
    known_practitioners: 1,
    apprentice_count: 0,
    documentation_pct: 5,
    risk_level: "critical",
    computed_at: "2026-09-10T00:00:00Z",
  },
  {
    knowledge_id: "k-003",
    known_practitioners: 3,
    apprentice_count: 1,
    documentation_pct: 20,
    risk_level: "high",
    computed_at: "2026-09-12T00:00:00Z",
  },
  {
    knowledge_id: "k-004",
    known_practitioners: 12,
    apprentice_count: 5,
    documentation_pct: 40,
    risk_level: "warning",
    computed_at: "2026-09-14T00:00:00Z",
  },
  {
    knowledge_id: "k-005",
    known_practitioners: 1,
    apprentice_count: 0,
    documentation_pct: 10,
    risk_level: "critical",
    computed_at: "2026-09-01T00:00:00Z",
  },
  {
    knowledge_id: "k-006",
    known_practitioners: 4,
    apprentice_count: 2,
    documentation_pct: 30,
    risk_level: "high",
    computed_at: "2026-09-08T00:00:00Z",
  },
];

// =============================================================
// RISK IMPACT ITEMS (what is lost if this knowledge disappears)
// =============================================================

export const riskImpactItems: KnowledgeRiskImpactItem[] = [
  { id: "ri-001", knowledge_id: "k-001", item_label: "Technique" },
  { id: "ri-002", knowledge_id: "k-001", item_label: "Terminology" },
  { id: "ri-003", knowledge_id: "k-001", item_label: "Oral history" },
  { id: "ri-004", knowledge_id: "k-001", item_label: "Philosophy" },
  { id: "ri-005", knowledge_id: "k-001", item_label: "Variation" },
  { id: "ri-006", knowledge_id: "k-002", item_label: "Terminology" },
  { id: "ri-007", knowledge_id: "k-002", item_label: "Oral history" },
  { id: "ri-008", knowledge_id: "k-002", item_label: "Context" },
  { id: "ri-009", knowledge_id: "k-003", item_label: "Technique" },
  { id: "ri-010", knowledge_id: "k-003", item_label: "Variation" },
  { id: "ri-011", knowledge_id: "k-005", item_label: "Technique" },
  { id: "ri-012", knowledge_id: "k-005", item_label: "Philosophy" },
  { id: "ri-013", knowledge_id: "k-005", item_label: "Context" },
];

// =============================================================
// KNOWLEDGE DNA — TENUN SEKOMANDI (complete case study)
// =============================================================

export const tenunDnaNodes: KnowledgeDnaNode[] = [
  // Technique
  {
    id: "dna-t-001", knowledge_id: "k-001", node_type: "technique",
    title: "Memintal Benang",
    content: "Kapas dipetik dari pohon kapas lokal, dibersihkan dari biji, lalu dipintal menggunakan alat pemintal tradisional (balida). Proses ini membutuhkan ketelitian tinggi untuk menghasilkan benang yang seragam ketebalannya.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-t-002", knowledge_id: "k-001", node_type: "technique",
    title: "Pewarnaan Alami",
    content: "Warna merah dari kulit kayu nunu, coklat dari kulit kayu jambu hutan, hitam dari lumpur sawah yang difermentasi, dan kuning dari kunyit. Setiap proses pewarnaan membutuhkan perendaman 3-7 hari.",
    order_index: 1, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-t-003", knowledge_id: "k-001", node_type: "technique",
    title: "Proses Menenun",
    content: "Menggunakan alat tenun tradisional (balida nunu) yang terdiri dari rangka kayu, sisir pemisah benang, dan pedal. Pola motif dibentuk dengan teknik ikat sebelum penenunan dimulai.",
    order_index: 2, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // Knowledge Facts
  {
    id: "dna-k-001", knowledge_id: "k-001", node_type: "knowledge_fact",
    title: "Jenis Kapas Lokal",
    content: "Kapas yang digunakan adalah varietas lokal (Gossypium arboreum) yang tumbuh liar di hutan sekunder. Berbeda dari kapas industri, serat kapas lokal lebih pendek tapi lebih kuat dan tahan lama.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-k-002", knowledge_id: "k-001", node_type: "knowledge_fact",
    title: "Musim Pembuatan",
    content: "Tenun Sekomandi secara tradisional dibuat pada musim kemarau (Juni–September) karena proses penjemuran benang dan kain membutuhkan sinar matahari yang konsisten.",
    order_index: 1, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // Meaning
  {
    id: "dna-m-001", knowledge_id: "k-001", node_type: "meaning",
    title: "Motif Bomba (Bunga)",
    content: "Melambangkan kesuburan dan kebahagiaan. Digunakan dalam kain pengantin dan upacara kelahiran. Jumlah kelopak bunga menandakan status sosial pemilik.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-m-002", knowledge_id: "k-001", node_type: "meaning",
    title: "Motif Buaya (Voyo)",
    content: "Simbol penjaga sungai dan kekuatan. Hanya boleh dipakai oleh keturunan bangsawan (Madika). Motif ini memiliki pantangan — tidak boleh ditenun saat ada anggota keluarga yang sakit.",
    order_index: 1, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // Story
  {
    id: "dna-s-001", knowledge_id: "k-001", node_type: "story",
    title: "Asal-usul Tenun Sekomandi",
    content: "Menurut tradisi lisan, teknik tenun ini pertama kali diajarkan oleh Sese nTadu (Ibu Langit) kepada seorang perempuan bernama Ndina yang tinggal di kaki gunung Nokilalaki. Ndina kemudian mengajarkannya ke seluruh perkampungan di lembah Palu.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // People
  {
    id: "dna-p-001", knowledge_id: "k-001", node_type: "people",
    title: "Mama Ina Pagi",
    content: "Praktisi utama Tenun Sekomandi yang masih aktif. Berusia 78 tahun, telah menenun sejak usia 12 tahun. Tinggal di Desa Raranggonau, Kecamatan Sigi Biromaru.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-p-002", knowledge_id: "k-001", node_type: "people",
    title: "Mama Halima",
    content: "Murid langsung dari almarhum Mama Siti, generasi sebelumnya. Menguasai teknik pewarnaan alami yang semakin langka. Berusia 65 tahun, tinggal di Desa Kalukubula.",
    order_index: 1, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // Variations
  {
    id: "dna-v-001", knowledge_id: "k-001", node_type: "variation",
    title: "Sekomandi Pesisir",
    content: "Variasi dari wilayah pesisir Donggala yang menggunakan motif gelombang dan ikan. Pewarnaan cenderung lebih terang karena pengaruh budaya perdagangan maritim.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-v-002", knowledge_id: "k-001", node_type: "variation",
    title: "Sekomandi Upacara",
    content: "Kain tenun khusus untuk ritual adat dengan motif yang lebih kompleks dan warna dominan merah-hitam. Hanya boleh ditenun oleh perempuan yang sudah menikah.",
    order_index: 1, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // Warnings
  {
    id: "dna-w-001", knowledge_id: "k-001", node_type: "warning",
    title: "Pantangan Motif Voyo",
    content: "Motif buaya (Voyo) tidak boleh ditenun oleh sembarang orang. Harus ada izin dari tetua adat. Pelanggaran dianggap bisa mendatangkan musibah bagi penenun.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },

  // Terminology
  {
    id: "dna-term-001", knowledge_id: "k-001", node_type: "terminology",
    title: "Balida",
    content: "Alat pemintal benang tradisional yang terbuat dari kayu.",
    order_index: 0, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "dna-term-002", knowledge_id: "k-001", node_type: "terminology",
    title: "Nunu",
    content: "Pohon beringin lokal yang kulitnya digunakan sebagai sumber pewarna merah.",
    order_index: 1, parent_node_id: null, created_at: "2026-08-01T00:00:00Z",
  },
];

// =============================================================
// KNOWLEDGE LINEAGE — TENUN SEKOMANDI
// =============================================================

export const tenunLineage: KnowledgeLineageEntry[] = [
  {
    id: "lin-001", knowledge_id: "k-001",
    person_name: "Ndina (legenda)", person_user_id: null,
    era_label: "Abad ke-17", role_description: "Penerima pertama dari Sese nTadu",
    order_index: 0,
  },
  {
    id: "lin-002", knowledge_id: "k-001",
    person_name: "Mama Bola", person_user_id: null,
    era_label: "~1920-an", role_description: "Maestro tenun era kolonial, memperkenalkan motif Bomba",
    order_index: 1,
  },
  {
    id: "lin-003", knowledge_id: "k-001",
    person_name: "Mama Siti", person_user_id: null,
    era_label: "1955 – 2018", role_description: "Murid Mama Bola, mengajarkan ke generasi berikutnya",
    order_index: 2,
  },
  {
    id: "lin-004", knowledge_id: "k-001",
    person_name: "Mama Ina Pagi", person_user_id: "u-holder-001",
    era_label: "1948 – sekarang", role_description: "Praktisi aktif, murid Mama Siti",
    order_index: 3,
  },
  {
    id: "lin-005", knowledge_id: "k-001",
    person_name: "Mama Halima", person_user_id: "u-holder-005",
    era_label: "1961 – sekarang", role_description: "Praktisi aktif, spesialis pewarnaan alami",
    order_index: 4,
  },
];

// =============================================================
// LEARNING PATH — TENUN SEKOMANDI
// =============================================================

export const tenunLearningPath: LearningPath = {
  id: "lp-001",
  knowledge_id: "k-001",
  title: "Belajar Tenun Sekomandi",
  description: "Perjalanan belajar menenun kain Sekomandi dari dasar hingga menghasilkan kain pertama Anda.",
  created_at: "2026-08-01T00:00:00Z",
};

export const tenunLearningSteps: LearningPathStep[] = [
  {
    id: "lps-001", learning_path_id: "lp-001", step_number: 1,
    title: "Kenali Bahan & Alat",
    description: "Pelajari jenis kapas lokal, alat pemintal (balida), dan alat tenun tradisional. Pahami mengapa bahan lokal penting untuk kualitas dan makna kain.",
    related_dna_node_id: "dna-k-001",
  },
  {
    id: "lps-002", learning_path_id: "lp-001", step_number: 2,
    title: "Pahami Makna Motif",
    description: "Setiap motif memiliki cerita dan pantangan. Sebelum menenun, Anda harus memahami apa yang Anda ciptakan dan mengapa.",
    related_dna_node_id: "dna-m-001",
  },
  {
    id: "lps-003", learning_path_id: "lp-001", step_number: 3,
    title: "Belajar Memintal",
    description: "Praktik langsung menggunakan alat pemintal tradisional. Hasilkan benang yang seragam ketebalannya — ini fondasi dari kain yang baik.",
    related_dna_node_id: "dna-t-001",
  },
  {
    id: "lps-004", learning_path_id: "lp-001", step_number: 4,
    title: "Teknik Pewarnaan Alami",
    description: "Kumpulkan dan olah bahan pewarna: kulit nunu untuk merah, kunyit untuk kuning, lumpur fermentasi untuk hitam. Praktikkan perendaman 3-7 hari.",
    related_dna_node_id: "dna-t-002",
  },
  {
    id: "lps-005", learning_path_id: "lp-001", step_number: 5,
    title: "Menenun Kain Pertama",
    description: "Dengan bimbingan mentor, tenun kain pertama Anda menggunakan motif dasar Bomba. Proses ini biasanya membutuhkan 2-4 minggu untuk satu helai kain.",
    related_dna_node_id: "dna-t-003",
  },
];

// =============================================================
// CULTURAL HOLDERS
// =============================================================

export const culturalHolders: HolderWithProfile[] = [
  {
    id: "u-holder-001",
    auth_user_id: null,
    full_name: "Mama Ina Pagi",
    email: "inapagi@example.com",
    role: "holder",
    avatar_url: null,
    location_city: "Biromaru",
    location_region: "Sulawesi Tengah",
    languages: ["Bahasa Indonesia", "Kaili"],
    bio: "Penenun Sekomandi sejak usia 12 tahun. Murid langsung dari almarhum Mama Siti.",
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
    profile: {
      user_id: "u-holder-001",
      expertise_summary: "Tenun Sekomandi — menguasai seluruh proses dari memintal hingga menenun, termasuk motif upacara",
      years_of_practice: 66,
      availability: "Bisa ditemui langsung di Desa Raranggonau, Sigi. Tidak menggunakan telepon.",
      teaching_methods: ["in-person"],
      verified: true,
      created_at: "2026-08-01T00:00:00Z",
    },
  },
  {
    id: "u-holder-002",
    auth_user_id: null,
    full_name: "Pak Ahmad Dg. Masara",
    email: "ahmaddg@example.com",
    role: "holder",
    avatar_url: null,
    location_city: "Kulawi",
    location_region: "Sulawesi Tengah",
    languages: ["Bahasa Indonesia", "Kulawi", "Kaili"],
    bio: "Penutur aktif bahasa Kulawi dan pengajar bahasa daerah di sekolah lokal.",
    created_at: "2026-08-05T00:00:00Z",
    updated_at: "2026-08-05T00:00:00Z",
    profile: {
      user_id: "u-holder-002",
      expertise_summary: "Bahasa Kulawi — tata bahasa, kosakata, sastra lisan, dan lagu tradisional dalam bahasa Kulawi",
      years_of_practice: 40,
      availability: "Senin–Jumat setelah jam 14:00. Bisa video call.",
      teaching_methods: ["in-person", "video-call"],
      verified: true,
      created_at: "2026-08-05T00:00:00Z",
    },
  },
  {
    id: "u-holder-003",
    auth_user_id: null,
    full_name: "Pak Rustam",
    email: "rustam@example.com",
    role: "holder",
    avatar_url: null,
    location_city: "Palu",
    location_region: "Sulawesi Tengah",
    languages: ["Bahasa Indonesia", "Kaili"],
    bio: "Maestro Kakula, pembuat dan pemain alat musik bambu tradisional.",
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
    profile: {
      user_id: "u-holder-003",
      expertise_summary: "Musik Kakula — pembuatan alat dari bambu, teknik bermain, dan lagu-lagu tradisional",
      years_of_practice: 35,
      availability: "Akhir pekan. Bisa workshop kelompok.",
      teaching_methods: ["in-person", "workshop"],
      verified: true,
      created_at: "2026-08-10T00:00:00Z",
    },
  },
  {
    id: "u-holder-005",
    auth_user_id: null,
    full_name: "Mama Halima",
    email: "halima@example.com",
    role: "holder",
    avatar_url: null,
    location_city: "Kalukubula",
    location_region: "Sulawesi Tengah",
    languages: ["Bahasa Indonesia", "Kaili"],
    bio: "Spesialis pewarnaan alami kain tenun Sekomandi. Menguasai formula pewarna dari tumbuhan hutan.",
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
    profile: {
      user_id: "u-holder-005",
      expertise_summary: "Tenun Sekomandi — spesialis pewarnaan alami dari kulit kayu, akar, dan lumpur fermentasi",
      years_of_practice: 45,
      availability: "Bisa ditemui di rumah. Telepon via keluarga.",
      teaching_methods: ["in-person"],
      verified: true,
      created_at: "2026-08-01T00:00:00Z",
    },
  },
];

// =============================================================
// HELPER: Get combined knowledge + risk
// =============================================================

export function getKnowledgeWithRisk(): KnowledgeWithRisk[] {
  return knowledgeEntries.map((k) => ({
    ...k,
    risk: riskSnapshots.find((r) => r.knowledge_id === k.id) || null,
  }));
}

export function getKnowledgeById(id: string): KnowledgeWithRisk | null {
  const k = knowledgeEntries.find((e) => e.id === id);
  if (!k) return null;
  return {
    ...k,
    risk: riskSnapshots.find((r) => r.knowledge_id === k.id) || null,
  };
}

export function getDnaNodesByKnowledgeId(knowledgeId: string): KnowledgeDnaNode[] {
  return tenunDnaNodes.filter((n) => n.knowledge_id === knowledgeId);
}

export function getLineageByKnowledgeId(knowledgeId: string): KnowledgeLineageEntry[] {
  return tenunLineage
    .filter((l) => l.knowledge_id === knowledgeId)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getRiskImpactItems(knowledgeId: string): KnowledgeRiskImpactItem[] {
  return riskImpactItems.filter((i) => i.knowledge_id === knowledgeId);
}

export function getLearningPathByKnowledgeId(knowledgeId: string): LearningPath | null {
  if (knowledgeId === "k-001") return tenunLearningPath;
  return null;
}

export function getLearningSteps(pathId: string): LearningPathStep[] {
  if (pathId === "lp-001") return tenunLearningSteps;
  return [];
}

export function getHoldersByKnowledgeId(knowledgeId: string): HolderWithProfile[] {
  if (knowledgeId === "k-001") {
    return culturalHolders.filter((h) =>
      h.id === "u-holder-001" || h.id === "u-holder-005"
    );
  }
  if (knowledgeId === "k-002") {
    return culturalHolders.filter((h) => h.id === "u-holder-002");
  }
  if (knowledgeId === "k-003") {
    return culturalHolders.filter((h) => h.id === "u-holder-003");
  }
  return [];
}

/**
 * Sort knowledge by risk severity (Critical first)
 */
const RISK_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  warning: 2,
  healthy: 3,
};

export function getKnowledgeSortedByRisk(): KnowledgeWithRisk[] {
  return getKnowledgeWithRisk().sort((a, b) => {
    const aOrder = RISK_ORDER[a.risk?.risk_level || "healthy"] ?? 4;
    const bOrder = RISK_ORDER[b.risk?.risk_level || "healthy"] ?? 4;
    return aOrder - bOrder;
  });
}
