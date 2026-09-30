"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Search,
  BookOpen,
  BadgeCheck,
  Timer,
  Info,
  ChevronDown,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  History,
  Landmark,
  PlusCircle,
  X,
  AudioWaveform,
} from "lucide-react";

interface CulturalEntry {
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

const initialEntries: CulturalEntry[] = [
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
    gating: "blocked",
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

export default function AdminPage() {
  const [entries, setEntries] = useState<CulturalEntry[]>(initialEntries);
  const [filterTab, setFilterTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CulturalEntry | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // New entry form state
  const [newTerm, setNewTerm] = useState("");
  const [newCategory, setNewCategory] = useState("Bahasa & Dialek (Ledo/Tara/Da'a)");
  const [newChapter, setNewChapter] = useState("Bab 1: Sapaan Harian");
  const [newInformant, setNewInformant] = useState("");

  const filteredEntries = entries.filter((entry) => {
    if (filterTab === "verified" && entry.status !== "verified") return false;
    if (filterTab === "pending" && entry.status !== "pending") return false;
    if (filterTab === "disputed" && entry.status !== "disputed") return false;
    if (filterTab === "draft" && entry.status !== "draft") return false;

    if (categoryFilter !== "all") {
      if (categoryFilter === "bahasa" && entry.type !== "Bahasa") return false;
      if (categoryFilter === "busana" && entry.type !== "Busana" && entry.type !== "Perhiasan") return false;
      if (categoryFilter === "tenun" && entry.type !== "Kriya") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTerm = entry.term.toLowerCase().includes(q);
      const matchSource = entry.source.toLowerCase().includes(q);
      const matchInformant = entry.informant.toLowerCase().includes(q);
      const matchChapter = entry.chapter.toLowerCase().includes(q);
      return matchTerm || matchSource || matchInformant || matchChapter;
    }

    return true;
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm) return;

    const newId = `ENT-00${entries.length + 1}`;
    const entry: CulturalEntry = {
      id: newId,
      term: newTerm,
      type: newCategory.includes("Bahasa") ? "Bahasa" : "Busana",
      category: newCategory,
      chapter: newChapter,
      module: "Modul Baru",
      source: "Pengajuan Kurator",
      informant: newInformant || "Menunggu Sidang Adat",
      status: "draft",
      gating: "blocked",
      icon: "draft",
    };

    setEntries([entry, ...entries]);
    setIsModalOpen(false);
    setNewTerm("");
    setNewInformant("");
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: "verified" | "pending" | "disputed" | "draft",
    newGating: "published" | "blocked" | "educational_note"
  ) => {
    setEntries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, gating: newGating } : item
      )
    );
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry({ ...selectedEntry, status: newStatus, gating: newGating });
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <img
              alt="LARAS Logo"
              className="h-9 w-auto object-contain"
              src="/logo/logo_laras.png"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-primary tracking-tight font-bold">
                LARAS CMS
              </span>
              <span className="text-[10px] text-secondary font-bold tracking-wider uppercase -mt-0.5">
                Panel Kurasi Budaya
              </span>
            </div>
          </Link>
          <span className="hidden sm:inline-block text-outline-variant">•</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Dewan Kurator Adat Wilayah XVIII</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Dashboard Murid</span>
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30">
            <img
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Vhf8Tpf1UP_r76LEL-9Olxy-KamrRKdvbuw_IdSOUdsPnutS-ucQSUNrUwCmvv79RwssCekEhlPat9dql81M0_w3TdFVqc0hENXtxegKWhP1UapZD9OlTcn4MiCZZPhuf7VNtyofbbQ8ByHlCDXGq8phTykzER2D0OKlgZrlUIKLycgNPOKpSjSCeQYrau-XCBnFjpIEDXwO8PKFKpjzvu77uKgmWMakGwQ2PeNYy_zuHKKvm8sSrmGaG3"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-label-md font-bold text-on-surface leading-tight">
                Drs. Rusdi M.Pd.
              </span>
              <span className="text-[11px] text-on-surface-variant leading-none">
                Kurator Adat Kaili
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-clip">
        {/* Hard Rule Advisory Banner */}
        <div className="rounded-2xl bg-surface-container-high p-4 sm:p-5 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
                  Hard Rule: Otentisitas Kaili
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-label-sm text-on-surface-variant font-semibold">
                  Protokol Kurasi Adat #P-17
                </span>
              </div>
              <p className="text-body-sm text-on-surface mt-0.5 font-medium leading-relaxed">
                Seluruh entri berstatus{" "}
                <span className="text-error font-bold bg-error-container/40 px-1.5 py-0.5 rounded">
                  Draft
                </span>{" "}
                atau{" "}
                <span className="text-secondary font-bold bg-secondary-fixed/50 px-1.5 py-0.5 rounded">
                  Menunggu Verifikasi
                </span>{" "}
                otomatis diblokir dari antarmuka murid demi menjaga prinsip{" "}
                <em>&ldquo;No Cultural Fabrication&rdquo;</em>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-label-sm px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold">
              Balai Pelestarian Kebudayaan Wilayah XVIII
            </span>
          </div>
        </div>

        {/* Panel Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-on-surface-variant text-label-md">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <span className="uppercase tracking-wider text-primary font-bold">
                Sistem Verifikasi &amp; Sumber Konten Budaya
              </span>
              <span className="text-outline">•</span>
              <span className="text-secondary font-semibold">
                Central Sulawesi Corpus v2.4
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface tracking-tight font-extrabold">
              Verifikasi Sumber Adat Kaili
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Memastikan seluruh materi bahasa lokal (Ledo, Tara, Da&apos;a) dan tata busana adat
              tervalidasi secara faktual oleh Dewan Adat serta Balai Bahasa sebelum dirilis ke
              aplikasi murid.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30">
              <Sparkles className="w-5 h-5 text-tertiary" />
              <div className="flex flex-col">
                <span className="text-label-sm text-on-surface-variant leading-none">
                  Wilayah Riset
                </span>
                <span className="text-label-md text-on-surface font-bold">
                  Sulawesi Tengah • Lembah Palu
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-label-lg font-bold transition-transform active:translate-y-0.5 shadow-[0_3px_0_0_#881f00] cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ Tambah Entri Budaya</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                Total Konten Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-display-lg text-3xl font-extrabold text-on-surface tracking-tight">
                {entries.length}
              </span>
              <span className="text-body-sm text-on-surface-variant">Entri Korpus</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-body-sm">
              <span className="text-secondary font-bold">+6 entri</span>
              <span className="text-on-surface-variant">bulan ini dari ekspedisi Kulawi</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Card 2: Terverifikasi */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                Terverifikasi (Verified)
              </span>
              <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <BadgeCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-display-lg text-3xl font-extrabold text-secondary tracking-tight">
                {entries.filter((e) => e.status === "verified").length}
              </span>
              <span className="text-label-md px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                {Math.round(
                  (entries.filter((e) => e.status === "verified").length / entries.length) * 100
                )}
                %
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-body-sm text-on-surface-variant">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span>Disahkan Tetua Adat &amp; BPK XVIII</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: "81%" }} />
            </div>
          </div>

          {/* Card 3: Menunggu Review */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                Menunggu Review
              </span>
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <Timer className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-display-lg text-3xl font-extrabold text-primary tracking-tight">
                {entries.filter((e) => e.status === "pending").length}
              </span>
              <span className="text-body-sm text-on-surface-variant">Perlu Sidang Adat</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-body-sm text-primary font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-primary float-lift" />
              <span>Rekaman audio fonetik baru</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "35%" }} />
            </div>
          </div>

          {/* Card 4: Disputed / Catatan Varian */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                Disputed (Catatan Varian)
              </span>
              <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-display-lg text-3xl font-extrabold text-tertiary tracking-tight">
                {entries.filter((e) => e.status === "disputed").length}
              </span>
              <span className="text-body-sm text-on-surface-variant">Dialek Varian</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-body-sm text-on-surface-variant">
              <Info className="w-4 h-4 text-tertiary" />
              <span>Memerlukan catatan komparatif</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
        </div>

        {/* Content Management Matrix Table */}
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
          {/* Toolbar & Filters */}
          <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-all ${
                  filterTab === "all"
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                Semua Konten ({entries.length})
              </button>
              <button
                onClick={() => setFilterTab("verified")}
                className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-all ${
                  filterTab === "verified"
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                Terverifikasi{" "}
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                  {entries.filter((e) => e.status === "verified").length}
                </span>
              </button>
              <button
                onClick={() => setFilterTab("pending")}
                className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-all ${
                  filterTab === "pending"
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                Menunggu Tinjauan{" "}
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                  {entries.filter((e) => e.status === "pending").length}
                </span>
              </button>
              <button
                onClick={() => setFilterTab("disputed")}
                className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-all ${
                  filterTab === "disputed"
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                Disputed{" "}
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                  {entries.filter((e) => e.status === "disputed").length}
                </span>
              </button>
              <button
                onClick={() => setFilterTab("draft")}
                className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-all ${
                  filterTab === "draft"
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                Draft{" "}
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                  {entries.filter((e) => e.status === "draft").length}
                </span>
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari materi / dialek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
                />
              </div>

              <div className="relative w-full sm:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-body-sm focus:outline-none appearance-none cursor-pointer border border-outline-variant/20"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="bahasa">Kosakata &amp; Bahasa</option>
                  <option value="busana">Busana &amp; Rias Adat</option>
                  <option value="tenun">Tenun &amp; Kriya</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-label-md text-on-surface-variant font-bold border-b border-outline-variant/20">
                  <th className="py-3 px-4 lg:px-6">Entri Budaya &amp; Tipe</th>
                  <th className="py-3 px-4">Bab &amp; Modul</th>
                  <th className="py-3 px-4">Sumber &amp; Informan Adat</th>
                  <th className="py-3 px-4 text-center">Status Verifikasi</th>
                  <th className="py-3 px-4 text-center">Akses Murid (Gating)</th>
                  <th className="py-3 px-4 lg:px-6 text-right">Aksi Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    {/* Column 1: Entri Budaya */}
                    <td className="py-4 px-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/20">
                          {entry.thumbnail ? (
                            <img
                              src={entry.thumbnail}
                              alt={entry.term}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="text-primary w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-headline-sm text-on-surface font-bold">
                              {entry.term}
                            </span>
                            {entry.ipa && (
                              <button
                                onClick={() => {
                                  setIsPlayingAudio(true);
                                  setTimeout(() => setIsPlayingAudio(false), 1500);
                                }}
                                className="text-tertiary hover:text-tertiary-container cursor-pointer"
                                title="Dengarkan Fonetik"
                              >
                                {isPlayingAudio ? (
                                  <AudioWaveform className="w-4 h-4 animate-pulse" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">
                              {entry.type} • {entry.category}
                            </span>
                            {entry.ipa && (
                              <span className="text-body-sm text-on-surface-variant font-mono">
                                IPA: {entry.ipa}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Bab & Modul */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-title-md font-bold text-on-surface">
                          {entry.chapter}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          {entry.module}
                        </span>
                      </div>
                    </td>

                    {/* Column 3: Sumber & Informan */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-body-md font-semibold text-on-surface">
                          {entry.source}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          {entry.informant}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Status Verifikasi */}
                    <td className="py-4 px-4 text-center">
                      {entry.status === "verified" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified ✓</span>
                        </span>
                      )}
                      {entry.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold shadow-sm float-lift">
                          <Timer className="w-3.5 h-3.5" />
                          <span>Pending Review ⏳</span>
                        </span>
                      )}
                      {entry.status === "disputed" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold shadow-sm">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Disputed ⚠️</span>
                        </span>
                      )}
                      {entry.status === "draft" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-bold shadow-sm">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Draft 🔒</span>
                        </span>
                      )}
                    </td>

                    {/* Column 5: Gating Status */}
                    <td className="py-4 px-4 text-center">
                      {entry.gating === "published" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface text-label-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-secondary" />
                          <span>Tayang di App</span>
                        </div>
                      )}
                      {entry.gating === "blocked" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-label-sm font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Ditahan / Blocked</span>
                        </div>
                      )}
                      {entry.gating === "educational_note" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-label-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span>Tayang dg Catatan</span>
                        </div>
                      )}
                    </td>

                    {/* Column 6: Aksi */}
                    <td className="py-4 px-4 lg:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed text-label-md font-bold hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          Tinjau
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm text-on-surface-variant border-t border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span>
                Menampilkan <strong>{filteredEntries.length}</strong> dari{" "}
                <strong>{entries.length}</strong> Entri Korpus Adat
              </span>
              <span className="text-outline">•</span>
              <span className="text-primary font-semibold">
                Sync DB Balai Bahasa Sulteng: Aktif
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-label-sm text-on-surface-variant">Halaman 1 dari 1</span>
            </div>
          </div>
        </div>

        {/* Provenance Ledger & Elder Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Verification Ledger */}
          <div className="lg:col-span-2 rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-title-md font-bold text-on-surface">
                      Catatan Sidang Validasi Adat Terbaru
                    </h2>
                    <span className="text-body-sm text-on-surface-variant">
                      Lembaga Adat Kaili (LAK) Wilayah Palu Barat
                    </span>
                  </div>
                </div>
                <span className="text-label-sm text-secondary font-bold">Risalah Pleno</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start justify-between gap-4 border border-outline-variant/20">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-label-md font-bold text-on-surface">
                        Pemberian Status Sah: Frasa &ldquo;Tabe&rdquo; &amp; &ldquo;Nggembe&rdquo;
                      </p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Telah disahkan dalam sidang pleno kurasi ke-12 bersama BPK Wilayah XVIII
                        dan perwakilan 5 sub-etnis Kaili.
                      </p>
                    </div>
                  </div>
                  <span className="text-label-sm text-outline shrink-0">14 Feb 2025</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start justify-between gap-4 border border-outline-variant/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-tertiary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-label-md font-bold text-on-surface">
                        Catatan Edukatif Disematkan pada Istilah &ldquo;Sampa&rdquo;
                      </p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Ketetapan varian: Di wilayah Donggala disebut &ldquo;Dali&rdquo;, sedangkan di
                        Sigi disebut &ldquo;Sampa&rdquo;. Keduanya diakui sah berdampingan.
                      </p>
                    </div>
                  </div>
                  <span className="text-label-sm text-outline shrink-0">11 Feb 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Informant */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <Landmark className="w-5 h-5" />
                </div>
                <h2 className="text-title-md font-bold text-on-surface">Pusat Narahubung Tetua</h2>
              </div>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Punya keraguan data dialek atau dokumentasi foto lama? Hubungi dewan tetua adat
                yang terdaftar pada sistem LARAS.
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="text-primary w-4 h-4" />
                    <span className="text-label-md text-on-surface font-semibold">
                      Dewan Adat Kaili (LAK)
                    </span>
                  </div>
                  <span className="text-label-sm text-secondary font-bold">Aktif • Palu</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <Landmark className="text-tertiary w-4 h-4" />
                    <span className="text-label-md text-on-surface font-semibold">
                      Balai Pelestarian Wil. XVIII
                    </span>
                  </div>
                  <span className="text-label-sm text-secondary font-bold">Terhubung</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Menghubungkan ke Saluran Tetua Adat Kaili...")}
              className="mt-6 w-full py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-bold transition-all text-center"
            >
              Hubungi Hotline Kurator Adat
            </button>
          </div>
        </div>
      </main>

      {/* Add New Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest shadow-2xl p-6 sm:p-8 flex flex-col gap-5 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold">
                    Tambah Entri Budaya Baru
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Sesuai standar validasi kearifan lokal Sulteng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant uppercase font-bold mb-1">
                  Entri Vernakular / Istilah Kaili
                </label>
                <input
                  type="text"
                  required
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Contoh: Salonde, Palapi, Baju Nggembe..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm text-on-surface-variant uppercase font-bold mb-1">
                    Kategori Kebudayaan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none border border-outline-variant/30 cursor-pointer"
                  >
                    <option>Bahasa &amp; Dialek (Ledo/Tara/Da&apos;a)</option>
                    <option>Busana &amp; Tata Rias Adat</option>
                    <option>Tenun &amp; Kriya Tradisional</option>
                    <option>Ritual &amp; Nilai Sintuvu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant uppercase font-bold mb-1">
                    Target Bab Modul
                  </label>
                  <select
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none border border-outline-variant/30 cursor-pointer"
                  >
                    <option>Bab 1: Sapaan Harian</option>
                    <option>Bab 2: Kekeluargaan</option>
                    <option>Bab 3: Ragam Busana</option>
                    <option>Bab 4: Tata Rias &amp; Hiasan</option>
                    <option>Bab 5: Upacara &amp; Sintuvu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant uppercase font-bold mb-1">
                  Narasumber / Informan Validasi Adat
                </label>
                <input
                  type="text"
                  value={newInformant}
                  onChange={(e) => setNewInformant(e.target.value)}
                  placeholder="Nama Tetua Adat / Asal Lembaga / No. Arsip BPK"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant uppercase font-bold mb-1">
                  Unggah Rekaman Fonetik / Bukti Visual Adat
                </label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <AudioWaveform className="w-9 h-9 text-primary mx-auto" />
                  <p className="text-body-sm text-on-surface font-semibold mt-1">
                    Seret audio WAV/MP3 atau Foto Resolusi Tinggi
                  </p>
                  <p className="text-label-sm text-outline mt-0.5">
                    Wajib memiliki persetujuan narasumber (Informed Consent)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-label-md font-bold transition-all shadow-[0_2px_0_0_#881f00]"
                >
                  Simpan sebagai Draf Terkunci
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Verification Drawer / Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-surface-container-lowest shadow-2xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-label-sm uppercase tracking-wider font-bold text-primary">
                  Audit Verifikasi Konten Budaya
                </span>
                <h3 className="font-headline-lg text-2xl text-on-surface font-extrabold mt-0.5">
                  {selectedEntry.term}
                </h3>
                <span className="text-body-sm text-on-surface-variant">
                  {selectedEntry.chapter} • {selectedEntry.module}
                </span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-label-sm text-on-surface-variant font-bold uppercase">
                    Klasifikasi
                  </span>
                  <p className="text-body-md font-semibold text-on-surface">
                    {selectedEntry.type} ({selectedEntry.category})
                  </p>
                </div>
                <div>
                  <span className="text-label-sm text-on-surface-variant font-bold uppercase">
                    Status Saat Ini
                  </span>
                  <p className="text-body-md font-bold capitalize text-primary">
                    {selectedEntry.status}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-label-sm text-on-surface-variant font-bold uppercase">
                  Narasumber &amp; Validasi Lembaga
                </span>
                <p className="text-body-md font-semibold text-on-surface">
                  {selectedEntry.source}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  {selectedEntry.informant}
                </p>
              </div>

              <div>
                <span className="text-label-sm text-on-surface-variant font-bold uppercase">
                  Kebijakan Gating Murid (Akses Pembelajaran)
                </span>
                <p className="text-body-sm text-on-surface mt-0.5">
                  {selectedEntry.gating === "published" && (
                    <span className="text-secondary font-bold">
                      ✓ Tayang Penuh: Murid dapat mengakses materi ini di Jalur Belajar dan Latihan Interaktif.
                    </span>
                  )}
                  {selectedEntry.gating === "blocked" && (
                    <span className="text-error font-bold">
                      🔒 Terkunci Total: Murid tidak dapat melihat entri ini hingga sidang pleno adat selesai.
                    </span>
                  )}
                  {selectedEntry.gating === "educational_note" && (
                    <span className="text-tertiary font-bold">
                      ℹ Tayang dengan Catatan: Varian dialek ditampilkan transparan agar murid memahami konteks wilayah.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <span className="text-label-sm uppercase font-bold text-on-surface-variant mb-2 block">
                Ubah Keputusan Sidang Pleno
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "verified", "published")
                  }
                  className="py-2.5 px-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-label-sm hover:bg-secondary hover:text-on-secondary transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sahkan (Verified)</span>
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "disputed", "educational_note")
                  }
                  className="py-2.5 px-3 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-bold text-label-sm hover:bg-tertiary hover:text-on-tertiary transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Varian Dialek</span>
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "draft", "blocked")
                  }
                  className="py-2.5 px-3 rounded-xl bg-error-container text-on-error-container font-bold text-label-sm hover:bg-error hover:text-on-error transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Tahan (Block)</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-label-md transition-all shadow-[0_2px_0_0_#881f00]"
              >
                Selesai Tinjauan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
