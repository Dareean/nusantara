"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
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
  Gamepad2,
  LayoutDashboard,
  ChevronRight,
  Filter,
  FileText,
  LogOut,
  Trash2,
  Eye,
} from "lucide-react";
import GameFlowBuilder from "./GameFlowBuilder";
import { getStoredSessions } from "../components/game-engine/sessionStore";
import { logout } from "../auth/authClient";

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
      "/media/presets/baju_nggembe.webp",
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
      "/media/presets/gimba.webp",
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
      "/media/presets/lalove.webp",
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

const CMS_STORAGE_KEY = "laras_cms_entries";

function loadCmsEntries(): CulturalEntry[] {
  if (typeof window === "undefined") return initialEntries;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return initialEntries;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn("Gagal membaca laras_cms_entries dari localStorage:", err);
  }
  return initialEntries;
}

export default function AdminPage() {
  const [entries, setEntries] = useState<CulturalEntry[]>(initialEntries);
  const [isMounted, setIsMounted] = useState(false);
  const [adminTab, setAdminTab] = useState<"summary" | "builder" | "corpus">("summary");
  const [sessionCount, setSessionCount] = useState<number>(4);
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; isJury?: boolean }>({
    name: "Admin LARAS",
    role: "Administrator",
    isJury: false,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Gagal logout:", err);
    }
    window.location.href = "/auth";
  };

  // Load entries from localStorage and sync with server API
  useEffect(() => {
    // Ambil sesi admin aktif
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res?.ok && res.session?.name) {
          const isJury = Boolean(res.session.isJury);
          setAdminUser({
            name: res.session.name,
            role: isJury ? "Mode Juri" : res.session.isAdmin ? "Administrator" : "Pengelola Konten",
            isJury,
          });
        }
      })
      .catch(() => {});
    try {
      const raw = localStorage.getItem(CMS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch (err) {
      console.warn("Gagal membaca laras_cms_entries dari localStorage:", err);
    }
    setIsMounted(true);

    // Sync from server API
    fetch("/api/content/entries?all=1", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((serverEntries) => {
        if (Array.isArray(serverEntries) && serverEntries.length > 0) {
          const map = new Map<string, CulturalEntry>();
          initialEntries.forEach((e) => map.set(e.id, e));
          const raw = localStorage.getItem(CMS_STORAGE_KEY);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) parsed.forEach((e: CulturalEntry) => map.set(e.id, e));
            } catch {}
          }
          serverEntries.forEach((row: { id: string; payload: CulturalEntry }) => {
            if (row.payload && row.id) {
              map.set(row.id, { ...(row.payload as CulturalEntry), id: row.id });
            }
          });
          setEntries(Array.from(map.values()));
        }
      })
      .catch(() => {});
  }, []);

  // Sync entries to localStorage only after mounted
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.warn("Gagal menyimpan laras_cms_entries ke localStorage:", err);
    }
  }, [entries, isMounted]);

  // Read stored sessions count
  useEffect(() => {
    try {
      const list = getStoredSessions();
      setSessionCount(list.length);
    } catch {
      setSessionCount(4);
    }
  }, [adminTab]);

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
    const termClean = newTerm.trim();
    if (!termClean) return;

    const newId = `ENT-00${entries.length + 1}`;
    const entry: CulturalEntry = {
      id: newId,
      term: termClean,
      type: newCategory.includes("Bahasa") ? "Bahasa" : "Busana",
      category: newCategory,
      chapter: newChapter,
      module: "Modul Baru",
      source: "Pengajuan Admin",
      informant: newInformant.trim() || "Menunggu Tinjauan",
      status: "draft",
      gating: "blocked",
      icon: "draft",
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Gagal simpan laras_cms_entries:", err);
    }

    // Sync ke API server
    fetch("/api/content/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: entry.id,
        kind: entry.type,
        payload: entry,
        status: "draft",
      }),
    }).catch(() => {});

    setFilterTab("all");
    setSearchQuery("");
    setIsModalOpen(false);
    setNewTerm("");
    setNewInformant("");
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: "verified" | "pending" | "disputed" | "draft",
    newGating: "published" | "blocked" | "educational_note"
  ) => {
    const target = entries.find((item) => item.id === id);
    if (!target) return;
    const mod: CulturalEntry = { ...target, status: newStatus, gating: newGating };
    const nextEntries = entries.map((item) => (item.id === id ? mod : item));

    setEntries(nextEntries);
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry(mod);
    }

    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(nextEntries));
    } catch (err) {
      console.warn("Gagal simpan laras_cms_entries:", err);
    }

    fetch(`/api/content/entries/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        payload: mod,
        status: newGating === "published" ? "published" : "draft",
      }),
    }).catch((err) => {
      console.error("Gagal sinkron status entri ke server:", err);
    });
  };

  const handleDeleteEntry = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Yakin ingin menghapus entri korpus ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    const nextEntries = entries.filter((item) => item.id !== id);
    setEntries(nextEntries);
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }

    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(nextEntries));
    } catch (err) {
      console.warn("Gagal simpan laras_cms_entries:", err);
    }

    try {
      await fetch(`/api/content/entries/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Gagal menghapus entri di server:", err);
    }
  };

  // Stats calculation
  const verifiedCount = entries.filter((e) => e.status === "verified").length;
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const draftCount = entries.filter((e) => e.status === "draft").length;
  const disputedCount = entries.filter((e) => e.status === "disputed").length;
  const pendingOrDraftQueue = entries.filter((e) => e.status === "pending" || e.status === "draft").slice(0, 5);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex text-on-surface font-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Backdrop for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* ── 1. SIDEBAR KIRI TETAP (±240px, selalu jelas & terbaca) ── */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 bg-surface-container-low border-r border-outline-variant/30 flex flex-col justify-between transition-transform md:translate-x-0 w-60 shrink-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Atas: Logo + Info CMS */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <img
                alt="LARAS Logo"
                className="h-8 w-auto object-contain shrink-0"
                src="/logo/logo_laras.png"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-primary tracking-tight font-black leading-tight text-base truncate">
                  LARAS CMS
                </span>
                <span className="text-[10px] text-secondary font-bold tracking-wider uppercase -mt-0.5 truncate">
                  Panel Admin
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 px-2 py-1 rounded-md bg-secondary-fixed/50 text-[10px] text-on-secondary-fixed font-bold border border-secondary-fixed">
            Pengelola Konten
          </div>

          {/* Menu Navigasi Vertikal */}
          <nav className="mt-4 space-y-1">
            <button
              type="button"
              onClick={() => {
                setAdminTab("summary");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-all text-left cursor-pointer ${
                adminTab === "summary"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              title="Ringkasan"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Ringkasan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAdminTab("builder");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-all text-left cursor-pointer ${
                adminTab === "builder"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              title="Penyusun Alur & Soal"
            >
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Penyusun Alur &amp; Soal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAdminTab("corpus");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all text-left cursor-pointer ${
                adminTab === "corpus"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              title="Korpus Budaya"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="truncate">Korpus Budaya</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  adminTab === "corpus"
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {entries.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Bawah Sidebar: Tombol Navigasi & Keluar */}
        <div className="p-3 border-t border-outline-variant/30 space-y-1">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[12px] font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
            title="Kembali ke Dashboard Murid"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">← Dashboard Murid</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[12px] font-bold text-error hover:bg-error-container/30 transition-all cursor-pointer"
            title="Keluar / Logout Akun"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="truncate">Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE AREA (Topbar + Area Konten) ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. TOPBAR RAMPING (±56px) */}
        <header className="sticky top-0 z-20 h-14 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-4 lg:px-6">
          {/* Kiri: Mobile hamburger + Judul Seksi Aktif + Subjudul */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-on-surface hover:bg-surface-container cursor-pointer shrink-0"
              title="Buka Menu"
            >
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-on-surface tracking-tight truncate leading-tight">
              {adminTab === "summary" && "Ringkasan Konten"}
              {adminTab === "builder" && "Penyusun Alur Game & Soal"}
              {adminTab === "corpus" && "Korpus Budaya Kaili"}
            </h1>
            <p className="text-[11px] text-on-surface-variant truncate hidden sm:block">
              {adminTab === "summary" && "Ikhtisar status korpus, sesi game, dan publikasi modul"}
              {adminTab === "builder" && "Rancang urutan permainan, format hotspot visual, dan audio adat"}
              {adminTab === "corpus" && "Kelola istilah vernakular Kaili, busana & dokumentasi materi"}
            </p>
          </div>
        </div>

        {/* Kanan: Aksi Global + Chip Profil Admin */}
        <div className="flex items-center gap-3 shrink-0">
            {adminUser.isJury && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black shadow-xs">
                <Eye className="w-3.5 h-3.5 text-amber-800" />
                <span>Mode Juri — Hanya Lihat</span>
              </span>
            )}

            {adminTab === "corpus" && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[12px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Tambah Entri Budaya</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30">
              <img
                alt="Admin Profile"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-primary-fixed"
                src="/media/presets/avatar_admin.webp"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[12px] font-bold text-on-surface leading-tight">
                  {adminUser.name || "Admin LARAS"}
                </span>
                <span className="text-[10px] text-on-surface-variant leading-none">
                  {adminUser.role || "Administrator"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 text-xs font-bold transition-all cursor-pointer"
                title="Keluar / Logout Akun"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </header>

        {/* 3. AREA KONTEN (Densitas alat kerja, latar abu krem sangat muda) */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto min-h-[calc(100vh-56px)] bg-surface/50">
          {/* ── SEKSI 1: RINGKASAN ── */}
          {adminTab === "summary" && (
            <div className="space-y-4 max-w-6xl mx-auto">
              {/* Baris 4 Kartu Statistik Kecil Sejajar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Stat 1: Total Entri Korpus */}
                <div
                  onClick={() => setAdminTab("corpus")}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Total Entri Korpus
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface group-hover:text-primary transition-colors">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-on-surface tracking-tight">
                      {entries.length}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Entri</span>
                  </div>
                  <span className="text-[11px] text-secondary font-semibold mt-1">
                    {verifiedCount} terverifikasi
                  </span>
                </div>

                {/* Stat 2: Menunggu Tinjauan */}
                <div
                  onClick={() => {
                    setFilterTab("pending");
                    setAdminTab("corpus");
                  }}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Menunggu Tinjauan
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-on-primary-fixed">
                      <Timer className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-primary tracking-tight">
                      {pendingCount}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Perlu Tinjauan</span>
                  </div>
                  <span className="text-[11px] text-primary font-semibold mt-1">
                    Perlu tinjauan admin
                  </span>
                </div>

                {/* Stat 3: Draf */}
                <div
                  onClick={() => {
                    setFilterTab("draft");
                    setAdminTab("corpus");
                  }}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Draf
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-on-surface tracking-tight">
                      {draftCount}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Terkunci</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-semibold mt-1">
                    Draf konten lokal
                  </span>
                </div>

                {/* Stat 4: Jumlah Sesi Game */}
                <div
                  onClick={() => setAdminTab("builder")}
                  className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Jumlah Sesi Game
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-secondary-fixed/40 flex items-center justify-center text-on-secondary-fixed">
                      <Gamepad2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-secondary tracking-tight">
                      {sessionCount}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Paket Alur</span>
                  </div>
                  <span className="text-[11px] text-secondary font-semibold mt-1">
                    Siap dimainkan di app
                  </span>
                </div>
              </div>

              {/* Spanduk Prinsip Konten LARAS */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-container-high border border-outline-variant/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-primary font-black">
                        Prinsip Konten LARAS
                      </span>
                      <span className="inline-block w-1 h-1 rounded-full bg-primary" />
                      <span className="text-[11px] text-on-surface-variant font-semibold">
                        Panduan Integritas Konten
                      </span>
                    </div>
                    <p className="text-[12px] text-on-surface mt-0.5 leading-snug">
                      Konten berstatus draf tidak tampil ke murid. Seluruh konten budaya di aplikasi ini berstatus data demo dan sedang dalam proses validasi bersama narasumber budaya; jangan pernah menampilkan status validasi yang belum terjadi.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold shrink-0">
                  Kebijakan Internal
                </span>
              </div>

              {/* Antrean Tinjauan Konten (Maks 5 item berstatus pending/draft) */}
              <div className="p-4 sm:p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/20">
                  <div>
                    <h2 className="text-[15px] font-bold text-on-surface tracking-tight">
                      Antrean Tinjauan Konten
                    </h2>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">
                      Entri berstatus draf atau menunggu tinjauan sebelum dapat diterbitkan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterTab("pending");
                      setAdminTab("corpus");
                    }}
                    className="text-[12px] text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Semua di Korpus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Penanda Data Demo Persisten (Bagian 3) */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-medium border border-outline-variant/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Data contoh (demo) — belum tervalidasi narasumber</span>
                </div>

                {pendingOrDraftQueue.length === 0 ? (
                  <div className="py-6 text-center text-on-surface-variant text-[13px]">
                    Semua entri telah ditinjau.
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant/20">
                    {pendingOrDraftQueue.map((entry) => (
                      <div
                        key={entry.id}
                        className="py-2.5 flex items-center justify-between gap-3 hover:bg-surface-container-low/40 px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/20">
                            {entry.thumbnail ? (
                              <img
                                src={entry.thumbnail}
                                alt={entry.term}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="text-primary w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-on-surface truncate">
                                {entry.term}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-surface-container-high text-on-surface-variant font-bold">
                                {entry.type} • {entry.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                              {entry.source} • {entry.informant}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {entry.status === "pending" && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">
                              Menunggu Tinjauan
                            </span>
                          )}
                          {entry.status === "draft" && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-bold">
                              Draf
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedEntry(entry)}
                            className="px-2.5 py-1 rounded-md bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-container transition-colors cursor-pointer"
                          >
                            Tinjau
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Catatan Validasi (Bagian 2.5) */}
              <div className="p-4 sm:p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-[13px] font-bold text-on-surface">
                    Catatan Validasi
                  </h3>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Validasi narasumber budaya sedang berjalan. Entri yang belum tervalidasi tampil ke murid dengan label data demo.
                </p>
              </div>
            </div>
          )}

          {/* ── SEKSI 2: PENYUSUN ALUR & SOAL ── */}
          {adminTab === "builder" && (
            <div className="max-w-7xl mx-auto">
              <GameFlowBuilder />
            </div>
          )}

          {/* ── SEKSI 3: KORPUS BUDAYA ── */}
          {adminTab === "corpus" && (
            <div className="space-y-3.5 max-w-7xl mx-auto">
              {/* Content Management Matrix Table Card */}
              <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs overflow-hidden">
                {/* Toolbar & Filters (Padat, 1 baris responsif) */}
                <div className="p-3 sm:p-4 border-b border-outline-variant/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  {/* Status Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                    <button
                      type="button"
                      onClick={() => setFilterTab("all")}
                      className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer ${
                        filterTab === "all"
                          ? "bg-primary text-on-primary font-bold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      Semua ({entries.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("verified")}
                      className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer ${
                        filterTab === "verified"
                          ? "bg-secondary text-on-secondary font-bold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      Terverifikasi ({verifiedCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("pending")}
                      className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer ${
                        filterTab === "pending"
                          ? "bg-primary text-on-primary font-bold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      Menunggu Tinjauan ({pendingCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("disputed")}
                      className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer ${
                        filterTab === "disputed"
                          ? "bg-tertiary text-on-tertiary font-bold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      Disputed ({disputedCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("draft")}
                      className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer ${
                        filterTab === "draft"
                          ? "bg-surface-container-highest text-on-surface font-bold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      Draf ({draftCount})
                    </button>
                  </div>

                  {/* Search, Category Filter, and Add Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full sm:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Cari materi / narasumber..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-[12px] focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
                      />
                    </div>

                    <div className="relative w-full sm:w-44">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full pl-2.5 pr-7 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-[12px] focus:outline-none appearance-none cursor-pointer border border-outline-variant/20 font-medium"
                      >
                        <option value="all">Semua Kategori</option>
                        <option value="bahasa">Kosakata &amp; Bahasa</option>
                        <option value="busana">Busana &amp; Rias Adat</option>
                        <option value="tenun">Tenun &amp; Kriya</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5 pointer-events-none" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Entri Baru</span>
                    </button>
                  </div>
                </div>

                {/* Penanda Data Demo Persisten (Bagian 3) */}
                <div className="mx-3 sm:mx-4 mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-medium border border-outline-variant/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Data contoh (demo) — belum tervalidasi narasumber</span>
                </div>

                {/* Table Data Dense */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-[11px] uppercase tracking-wider text-on-surface-variant font-bold border-b border-outline-variant/20">
                        <th className="py-2.5 px-3 lg:px-4">Istilah &amp; Kategori</th>
                        <th className="py-2.5 px-3">Bab &amp; Modul</th>
                        <th className="py-2.5 px-3">Sumber &amp; Informan</th>
                        <th className="py-2.5 px-3 text-center">Status Konten</th>
                        <th className="py-2.5 px-3 text-center">Akses Murid (Gating)</th>
                        <th className="py-2.5 px-3 lg:px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 text-[13px]">
                      {filteredEntries.map((entry) => (
                        <tr
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                        >
                          {/* Column 1: Istilah */}
                          <td className="py-2.5 px-3 lg:px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/20">
                                {entry.thumbnail ? (
                                  <img
                                    src={entry.thumbnail}
                                    alt={entry.term}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <BookOpen className="text-primary w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-on-surface truncate">
                                    {entry.term}
                                  </span>
                                  {entry.ipa && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsPlayingAudio(true);
                                        setTimeout(() => setIsPlayingAudio(false), 1500);
                                      }}
                                      className="text-tertiary hover:text-tertiary-container cursor-pointer"
                                      title="Dengarkan Fonetik"
                                    >
                                      {isPlayingAudio ? (
                                        <AudioWaveform className="w-3.5 h-3.5 animate-pulse" />
                                      ) : (
                                        <Volume2 className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary-fixed text-on-primary-fixed font-semibold">
                                    {entry.type} • {entry.category}
                                  </span>
                                  {entry.ipa && (
                                    <span className="text-[11px] text-on-surface-variant font-mono">
                                      {entry.ipa}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Bab & Modul */}
                          <td className="py-2.5 px-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface text-[12px]">
                                {entry.chapter}
                              </span>
                              <span className="text-[11px] text-on-surface-variant">
                                {entry.module}
                              </span>
                            </div>
                          </td>

                          {/* Column 3: Sumber & Informan */}
                          <td className="py-2.5 px-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-on-surface text-[12px] truncate max-w-[200px]">
                                {entry.source}
                              </span>
                              <span className="text-[11px] text-on-surface-variant truncate max-w-[200px]">
                                {entry.informant}
                              </span>
                            </div>
                          </td>

                          {/* Column 4: Status Verifikasi */}
                          <td className="py-2.5 px-3 text-center">
                            {entry.status === "verified" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Terverifikasi</span>
                              </span>
                            )}
                            {entry.status === "pending" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                                <Timer className="w-3 h-3" />
                                <span>Menunggu</span>
                              </span>
                            )}
                            {entry.status === "disputed" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Disputed</span>
                              </span>
                            )}
                            {entry.status === "draft" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                                <Lock className="w-3 h-3" />
                                <span>Draf</span>
                              </span>
                            )}
                          </td>

                          {/* Column 5: Gating Status */}
                          <td className="py-2.5 px-3 text-center">
                            {entry.gating === "published" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-on-secondary-fixed text-[11px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                <span>Tayang di App</span>
                              </span>
                            )}
                            {entry.gating === "blocked" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-error-container text-on-error-container text-[11px] font-bold">
                                <Lock className="w-3 h-3" />
                                <span>Ditahan</span>
                              </span>
                            )}
                            {entry.gating === "educational_note" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-tertiary-fixed/50 text-on-tertiary-fixed text-[11px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                                <span>Catatan Varian</span>
                              </span>
                            )}
                          </td>

                          {/* Column 6: Aksi */}
                          <td className="py-2.5 px-3 lg:px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEntry(entry);
                                }}
                                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Tinjau
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteEntry(entry.id, e)}
                                className="p-1 rounded-md hover:bg-red-50 text-outline hover:text-red-700 transition-colors cursor-pointer"
                                title="Hapus entri korpus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-on-surface-variant border-t border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span>
                      Menampilkan <strong>{filteredEntries.length}</strong> dari{" "}
                      <strong>{entries.length}</strong> entri korpus adat
                    </span>
                    <span className="text-outline">•</span>
                    <span className="text-primary font-semibold">
                      Sync DB Balai Bahasa Sulteng: Aktif
                    </span>
                  </div>
                  <div>
                    <span>Tersimpan di LocalStorage (laras_cms_entries)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL: TAMBAH ENTRI BUDAYA BARU ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-2xl p-5 sm:p-6 flex flex-col gap-4 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-on-surface">
                    Tambah Entri Budaya Baru
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Sesuai standar validasi kearifan lokal Sulawesi Tengah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} noValidate className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] text-on-surface-variant uppercase font-bold mb-1">
                  Entri Vernakular / Istilah Kaili
                </label>
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Contoh: Salonde, Palapi, Baju Nggembe..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-[13px] focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-on-surface-variant uppercase font-bold mb-1">
                    Kategori Kebudayaan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-[12px] focus:outline-none border border-outline-variant/30 cursor-pointer"
                  >
                    <option>Bahasa &amp; Dialek (Ledo/Tara/Da&apos;a)</option>
                    <option>Busana &amp; Tata Rias Adat</option>
                    <option>Tenun &amp; Kriya Tradisional</option>
                    <option>Ritual &amp; Nilai Sintuvu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant uppercase font-bold mb-1">
                    Target Bab Modul
                  </label>
                  <select
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-[12px] focus:outline-none border border-outline-variant/30 cursor-pointer"
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
                <label className="block text-[11px] text-on-surface-variant uppercase font-bold mb-1">
                  Narasumber / Informan Materi
                </label>
                <input
                  type="text"
                  value={newInformant}
                  onChange={(e) => setNewInformant(e.target.value)}
                  placeholder="Nama informan / asal lembaga / referensi materi..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-[12px] focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant uppercase font-bold mb-1">
                  Unggah Rekaman Fonetik / Bukti Visual
                </label>
                <div className="border border-dashed border-outline-variant rounded-lg p-4 text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <AudioWaveform className="w-6 h-6 text-primary mx-auto" />
                  <p className="text-[12px] text-on-surface font-semibold mt-1">
                    Seret audio WAV/MP3 atau Foto Resolusi Tinggi
                  </p>
                  <p className="text-[10px] text-outline mt-0.5">
                    Disarankan memiliki persetujuan narasumber (Informed Consent)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-[12px] text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[12px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  Simpan sebagai Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL / DRAWER: DETAIL & AUDIT VERIFIKASI ── */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest shadow-2xl p-5 sm:p-6 flex flex-col gap-4 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                  Detail &amp; Peninjauan Konten Budaya
                </span>
                <h3 className="font-extrabold text-xl text-on-surface mt-0.5">
                  {selectedEntry.term}
                </h3>
                <span className="text-[12px] text-on-surface-variant">
                  {selectedEntry.chapter} • {selectedEntry.module}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 text-[12px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    Klasifikasi
                  </span>
                  <p className="font-semibold text-on-surface">
                    {selectedEntry.type} ({selectedEntry.category})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    Status Saat Ini
                  </span>
                  <p className="font-bold capitalize text-primary">
                    {selectedEntry.status}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Narasumber &amp; Lembaga Rujukan
                </span>
                <p className="font-semibold text-on-surface">
                  {selectedEntry.source}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {selectedEntry.informant}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Kebijakan Gating Murid (Akses Pembelajaran)
                </span>
                <p className="text-[11px] text-on-surface mt-0.5">
                  {selectedEntry.gating === "published" && (
                    <span className="text-secondary font-bold">
                      ✓ Tayang Penuh: Murid dapat mengakses materi ini di Jalur Belajar dan Latihan Interaktif.
                    </span>
                  )}
                  {selectedEntry.gating === "blocked" && (
                    <span className="text-error font-bold">
                      🔒 Terkunci: Murid tidak dapat melihat entri ini sebelum status diterbitkan oleh admin.
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

            {/* Quick Actions Decision */}
            <div>
              <span className="text-[11px] uppercase font-bold text-on-surface-variant mb-2 block">
                Ubah Status Konten &amp; Transisi
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "draft", "blocked")
                  }
                  className={`py-2 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedEntry.status === "draft"
                      ? "bg-surface-container-highest text-on-surface ring-2 ring-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Draf</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "pending", "blocked")
                  }
                  className={`py-2 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedEntry.status === "pending"
                      ? "bg-primary text-on-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-primary-fixed/50 text-on-primary-fixed hover:bg-primary-fixed"
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>Menunggu</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "disputed", "educational_note")
                  }
                  className={`py-2 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedEntry.status === "disputed"
                      ? "bg-tertiary text-on-tertiary ring-2 ring-tertiary/40 shadow-xs"
                      : "bg-tertiary-fixed/50 text-on-tertiary-fixed hover:bg-tertiary-fixed"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Catatan Varian</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedEntry.id, "verified", "published")
                  }
                  className={`py-2 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    selectedEntry.status === "verified"
                      ? "bg-secondary text-on-secondary ring-2 ring-secondary/40 shadow-xs"
                      : "bg-secondary-fixed/50 text-on-secondary-fixed hover:bg-secondary-fixed"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terverifikasi</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => handleDeleteEntry(selectedEntry.id)}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Entri</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-[12px] transition-all shadow-xs cursor-pointer"
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
