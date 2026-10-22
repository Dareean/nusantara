export interface CulturalEntry {
  id: string;
  term: string;
  type: string;
  category: string;
  ipa?: string;
  chapter: string;
  module: string;
  source: string;
  informant: string;
  status: "verified" | "pending" | "disputed" | "draft";
  gating: "published" | "blocked" | "educational_note";
  thumbnail?: string;
  icon?: string;
}

export const DEFAULT_CULTURAL_ENTRIES: CulturalEntry[] = [
  {
    id: "ENT-001",
    term: "Tabe",
    type: "Bahasa",
    category: "Sapaan Hormat",
    ipa: "/ta.be/",
    chapter: "Bab 1: Sapaan Harian",
    module: "Modul 1.2: Tata Krama Bertamu",
    source: "Dewan Adat Kaili & Balai Bahasa Sulteng",
    informant: "Magau Palu • Reg: BBS-2023-A01",
    status: "verified",
    gating: "published",
    icon: "forum",
  },
  {
    id: "ENT-002",
    term: "Baju Nggembe",
    type: "Busana",
    category: "Blus Upacara Wanita",
    chapter: "Bab 3: Ragam Busana",
    module: "Modul 3.1: Anatomi Baju Nggembe",
    source: "Museum Negeri Sulawesi Tengah",
    informant: "No. Registrasi: 1984/CL-02 • Kurator: Hj. Siti Rahma",
    status: "verified",
    gating: "published",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDj2iA59wILAhgAw8HMAnmW9QdcqFfX57-hJxYVwmDa_TIIWaSw-Kc4eFO1rMzFSmUSWaCsR1mc9aG9AJN89VtVyZUXli2LW4NjVz3ml-5uq6E744sPk8UgPKxuJphS95np5CSgkykg5fgy3_LgLXvhj3CMceZH2EGLapdsSBHrbHSm9m9oAxEaEgaUxuV8LZqHldRPHobtxIN-TmnBfXDHI9TU7nC_212k-oXusVst0GcUGaQ4ma_Ysw",
  },
  {
    id: "ENT-003",
    term: "Buya Sabe (Kain Subi)",
    type: "Kriya",
    category: "Tenun Sutra Donggala",
    chapter: "Bab 3: Ragam Busana",
    module: "Modul 3.3: Motif Tenun & Filosofi",
    source: "Sentra Tenun Banawa Donggala",
    informant: "Ibu Masdiana (Penemu Motif Subi 1978)",
    status: "verified",
    gating: "published",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6SMOqiqdgy9jy0GKWVKDYKpLIIR8vpAH6cCdG2xUvlPd7kqApdh7wkPc1Xh6ceQ6FGr_t2IBREowE7IJXBuYWhiMG5CltqdAk0tPathcRH6_zaaG_M-mTqZLwgrSLCNPnqoXbVCzQw5qsnz5VNDlpgsWW9Ppt3UC398BAzyGGbl3hndvSZppnRz2ds0ECQssa_YUJuDSige6OCD9Ls_FZtRq0g3N9GjWN5mTEOpJ03oas0toLFlH-7Q",
  },
  {
    id: "ENT-004",
    term: "Nalompa Mai Kami",
    type: "Bahasa",
    category: "Frasa Penyambutan (Kaili Tara)",
    chapter: "Bab 5: Upacara Adat",
    module: "Modul 5.1: Sambutan Tamu Kehormatan",
    source: "Tetua Adat Biromaru: Bpk. H. Rusdi",
    informant: "Lampiran Audio #AUD-991 • 12 Feb 2025",
    status: "pending",
    gating: "published",
    icon: "record_voice_over",
  },
  {
    id: "ENT-005",
    term: "Sampa / Dali Kuningan",
    type: "Perhiasan",
    category: "Kalung Adat Kaili",
    chapter: "Bab 4: Tata Rias & Hiasan Adat",
    module: "Modul 4.2: Aksesoris Pengantin Putri",
    source: "Dewan Kebudayaan Sigi & LAK Donggala",
    informant: "Perbedaan terminologi penamaan daerah",
    status: "disputed",
    gating: "educational_note",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA99tfPQRBVVtMXXGtMtlKHgSxSjzzIEGUQGQbCarbRHI1jOaWURL5jr78aETTdEhKke8meFtOLrl9X0gx8vyxYCiS_yWrOeXkOUZ1l6z-OZ9K_9GFLXs0kDKCI-H__0pXaAtrjs16Xh5R8JEJlxgMqWV9yn9Zs-IQGuEuCZYhHdOEtTgzumKJOZvzIf5Og5pyYLmjHu-GWCGUjVZ-gm5-qoCX3Gifqgzkkpof_6fw2F7JHtuIPKb9Nzw",
  },
  {
    id: "ENT-006",
    term: "Kore-Kore (Syair Ratapan)",
    type: "Sastra Lisan",
    category: "Suku Kaili Da'a",
    chapter: "Bab 7: Sastra Tutur",
    module: "Modul 7.4: Tradisi Nyanyian Duka",
    source: "Peneliti Etnografi Independen (Taweli)",
    informant: "Belum melampirkan izin tetua adat",
    status: "draft",
    gating: "blocked",
    icon: "draft",
  },
];

export async function fetchCulturalEntries(): Promise<CulturalEntry[]> {
  try {
    const res = await fetch("/api/cultural-entries", { cache: "no-store" });
    if (!res.ok) return DEFAULT_CULTURAL_ENTRIES;
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return DEFAULT_CULTURAL_ENTRIES;
  } catch (err) {
    console.warn("Gagal mengambil data entri budaya, menggunakan data lokal:", err);
    return DEFAULT_CULTURAL_ENTRIES;
  }
}
