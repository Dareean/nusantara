"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Compass,
  ArrowRight,
  BadgeCheck,
  Zap,
} from "lucide-react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = (searchParams && searchParams.get("redirect")) || "/dashboard";
  const modeParam = searchParams ? searchParams.get("mode") : null;

  const [authMode, setAuthMode] = useState<"login" | "register">(
    modeParam === "daftar" ? "register" : "login"
  );

  useEffect(() => {
    if (modeParam === "daftar") {
      setAuthMode("register");
    } else if (modeParam === "masuk") {
      setAuthMode("login");
    }
  }, [modeParam]);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      if (authMode === "register") {
        const { register } = await import("./authClient");
        await register(name.trim(), email.trim(), password);
      } else {
        const { login } = await import("./authClient");
        await login(email.trim(), password);
      }
      router.push(redirectTo);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan autentikasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setAuthMode("login");
    setEmail("demo@gmail.com");
    setPassword("demo123");
    setErrorMessage("");
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-gradient-to-br from-[#6f1700] via-[#942b0e] to-[#450e00] text-on-surface antialiased">
      {/* ── TABIR LATAR (Motif Tenun Kaili & Siluet Budaya) ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="tabir-kaili" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 0 L48 24 L24 48 L0 24 Z" fill="none" stroke="#ffdbd1" strokeWidth="1" />
            <path
              d="M24 8 L40 24 L24 40 L8 24 Z"
              fill="none"
              stroke="#ffddb8"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <circle cx="24" cy="24" r="2.5" fill="#ffdbd1" />
            <path d="M0 0 L8 8 M48 0 L40 8 M48 48 L40 40 M0 48 L8 40" stroke="#ffdbd1" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tabir-kaili)" />
      </svg>

      {/* Ambient Radial Highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-secondary-fixed/15 blur-3xl pointer-events-none" />

      {/* ── BAR ATAS MINIMAL (× di kiri, Pill Mode di kanan) ── */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between shrink-0">
        {/* Tombol Tutup / Kembali */}
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="h-10 w-10 rounded-full bg-black/30 hover:bg-black/45 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 shadow-sm"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {/* Pill Ganti Mode (Chunky Faux-3D Tegas) */}
        <button
          type="button"
          onClick={() => {
            setAuthMode(authMode === "login" ? "register" : "login");
            setErrorMessage("");
          }}
          className="h-9 px-4 rounded-full bg-white text-primary text-xs font-black uppercase tracking-wider shadow-[0_3px_0_0_#d8bfb7] hover:bg-surface-container active:translate-y-[2px] active:shadow-[0_1px_0_0_#d8bfb7] transition-all cursor-pointer flex items-center justify-center"
        >
          <span>{authMode === "login" ? "Daftar" : "Masuk"}</span>
        </button>
      </header>

      {/* ── PANEL FORM TERPUSAT (Kompak, Tegas, Tanpa Scroll) ── */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-2 sm:py-3">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[390px] rounded-3xl bg-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] border-2 border-white/80 motion-reduce:animate-none motion-reduce:transition-none"
        >
          {/* Header Panel Form */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2 flex items-center justify-center">
              <Image
                alt="Logo LARAS"
                src="/logo/logo_laras.png"
                width={44}
                height={44}
                className="h-10 w-auto object-contain drop-shadow-xs select-none"
                priority
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-on-surface">
              {authMode === "login" ? "Tabe, selamat datang" : "Tabe, mari mulai"}
            </h1>
            <p className="mt-0.5 text-xs text-on-surface-variant font-medium leading-normal">
              {authMode === "login"
                ? "Lanjutkan petualangan belajar dan rawat streak harianmu."
                : "Buat akun gratis dan kumpulkan paspor budaya pertamamu."}
            </p>
          </div>

          {/* Pesan Kesalahan Global */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-3 rounded-xl border border-error/30 bg-error-container/70 px-3.5 py-2 text-xs font-bold text-on-error-container"
            >
              {errorMessage}
            </div>
          )}

          {/* Formulir */}
          <form onSubmit={handleSubmit} className="mt-3.5 flex flex-col gap-2.5">
            {authMode === "register" && (
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="userName">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                  <input
                    id="userName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkapmu"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline/60 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all border border-outline-variant/50"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="userEmail">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                <input
                  id="userEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline/60 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all border border-outline-variant/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="userPassword">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                <input
                  id="userPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full h-10 pl-9 pr-9 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline/60 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all border border-outline-variant/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  className="absolute right-2.5 text-outline hover:text-on-surface flex items-center justify-center p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authMode === "register" && (
              <div className="p-2 rounded-xl bg-primary-fixed/25 flex items-center gap-2 border border-primary/20">
                <Compass className="text-primary w-3.5 h-3.5 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-black text-on-primary-fixed-variant truncate">
                    Suku Kaili (Ledo &amp; Tara)
                  </span>
                  <span className="text-[9px] text-on-surface-variant font-medium leading-none">
                    Lembah Palu &amp; Donggala • Bawaan
                  </span>
                </div>
              </div>
            )}

            {/* Tombol Submit Chunky Faux-3D Tegas */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1.5 w-full h-11 px-5 rounded-2xl bg-primary text-on-primary font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-[2px] active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed select-none"
            >
              <span>
                {isSubmitting
                  ? "MEMPROSES..."
                  : authMode === "login"
                  ? "MASUK"
                  : "DAFTAR SEKARANG"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Chip Demo Juri / Tamu (Kompak) */}
          {authMode === "login" && (
            <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant">
                Untuk penilai &amp; tamu:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="h-7 px-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-[11px] font-black shadow-[0_2px_0_0_#653e00] hover:brightness-95 active:translate-y-[1px] active:shadow-[0_1px_0_0_#653e00] transition-all cursor-pointer flex items-center gap-1 select-none"
              >
                <Zap className="w-3 h-3" />
                <span>Isi akun demo</span>
              </button>
            </div>
          )}

          {/* Tautan Bawah Ganti Mode */}
          <div className="mt-2.5 text-center text-xs text-on-surface-variant font-medium">
            {authMode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setErrorMessage("");
                  }}
                  className="text-primary font-black hover:underline cursor-pointer"
                >
                  Daftar
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErrorMessage("");
                  }}
                  className="text-primary font-black hover:underline cursor-pointer"
                >
                  Masuk
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer Minimal Tenang */}
      <footer className="relative z-10 w-full py-2 text-center text-[10px] text-white/70 font-medium shrink-0">
        <div className="flex items-center justify-center gap-1.5">
          <BadgeCheck className="w-3.5 h-3.5 text-secondary-fixed" />
          <span>LARAS Nusantara • Munas IX Permikomnas 2026</span>
        </div>
      </footer>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-primary">
          <div className="text-sm font-bold text-white">Memuat...</div>
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
