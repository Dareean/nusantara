"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  Flame,
  Zap,
  Volume2,
  AudioWaveform,
  CheckCircle2,
  ArrowRight,
  Landmark,
} from "lucide-react";

export default function LandingPage() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [attireMatched, setAttireMatched] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  // Parallax ref for Medan Budaya section
  const refMedan = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: refMedan,
    offset: ["start end", "end start"],
  });

  // Scroll listener for floating header CTA (past hero ~550px)
  const { scrollY } = useScroll();
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowFloatingCta(latest > 550);
    });
  }, [scrollY]);

  // Parallax transform layers (Far: slow, Mid: medium, Near: largest)
  const yFar = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const yMid = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const yNear = useTransform(scrollYProgress, [0, 1], [58, -58]);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed pt-20">
      {/* ── Top Navigation Bar (Fixed stay on scroll) ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md border-b-2 border-outline-variant/30 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <img
              alt="LARAS"
              className="h-13 sm:h-15 w-auto object-contain transition-transform group-hover:scale-105"
              src="/logo/logo_laras.png"
            />
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
              LARAS
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth?mode=masuk"
              className="hidden sm:inline-flex px-5 py-2.5 rounded-2xl border-2 border-outline-variant text-on-surface font-extrabold text-sm uppercase tracking-wider hover:bg-surface-container active:translate-y-0.5 transition-all shadow-[0_2px_0_0_#e0bfb7]"
            >
              Masuk
            </Link>

            {/* Static CTA (When hero is visible) */}
            {!showFloatingCta && (
              <Link
                href="/auth?mode=daftar"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-black text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-1 active:shadow-none transition-all"
              >
                Mulai
              </Link>
            )}

            {/* Floating CTA (Appears smoothly after scrolling past hero) */}
            <AnimatePresence>
              {showFloatingCta && (
                <motion.div
                  initial={{ opacity: 0, x: 16, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 16, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="motion-reduce:animate-none motion-reduce:transition-none"
                >
                  <Link
                    href="/auth?mode=daftar"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-[2px] active:shadow-[0_2px_0_0_#881f00] transition-all"
                  >
                    <span>Mulai Belajar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Untouched LCP & Animation) ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Mascot / Interactive 3D Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center order-2 lg:order-1"
          >
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Pulsing ring background */}
              <div className="absolute inset-0 rounded-full bg-secondary-fixed/40 animate-pulse" />
              <div className="absolute inset-6 rounded-full bg-surface-container border-4 border-secondary/20" />

              {/* Floating Gamification Badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -left-4 z-20 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-lg border-2 border-primary/20 flex items-center gap-2 motion-reduce:animate-none"
              >
                <Flame className="text-primary w-5 h-5" />
                <span className="font-black text-primary text-sm">7 HARI STREAK</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 -right-4 z-20 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-lg border-2 border-secondary/20 flex items-center gap-2 motion-reduce:animate-none"
              >
                <Zap className="text-secondary w-5 h-5" />
                <span className="font-black text-secondary text-sm">+20 XP</span>
              </motion.div>

              {/* Mascot Center Card */}
              <div className="relative z-10 w-56 h-56 rounded-3xl bg-surface-container-lowest border-4 border-outline-variant/40 shadow-xl flex flex-col items-center justify-center p-6 text-center">
                <span className="text-6xl mb-2 select-none animate-bounce">🦜</span>
                <span className="font-black text-on-surface text-lg leading-tight">
                  Tarsius &amp; Maleo
                </span>
                <span className="text-xs font-bold text-on-surface-variant mt-1">
                  Teman Belajar Budayamu
                </span>
              </div>
            </div>
          </motion.div>

          {/* Value Prop & Big Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 text-center lg:text-left order-1 lg:order-2 flex flex-col items-center lg:items-start"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.15]">
              Cara seru, gratis, &amp; efektif belajar bahasa daerah.
            </h1>
            <p className="mt-5 text-lg text-on-surface-variant font-semibold max-w-md">
              Kuasai bahasa Kaili dan kenali busana adat Nusantara dalam 3 menit sehari.
            </p>

            <div className="mt-8 flex flex-col w-full sm:w-80 gap-3">
              <Link
                href="/auth?mode=daftar"
                className="w-full text-center py-4 px-6 rounded-2xl bg-primary text-on-primary font-black text-base uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-[2px] active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2"
              >
                <span>Mulai Belajar</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth?mode=masuk"
                className="w-full text-center py-3.5 px-6 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant text-primary font-black text-base uppercase tracking-wider shadow-[0_4px_0_0_#e0bfb7] hover:bg-surface-container active:translate-y-[2px] active:shadow-[0_2px_0_0_#e0bfb7] transition-all"
              >
                Saya Sudah Punya Akun
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature 1: Belajar Seperti Game (Smooth Fade-Up Reveal) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface-container-low/40 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Visual Box */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="md:col-span-6 flex justify-center motion-reduce:animate-none motion-reduce:transition-none"
            >
              <div className="w-full max-w-sm bg-surface-container-lowest border-2 border-outline-variant/40 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-primary">
                    Pelajaran 1 • Kaili Ledo
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed font-black text-xs text-on-secondary-fixed">
                    Latihan Kata
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-2xl p-5 border-2 border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-on-surface">&ldquo;Tabe&rdquo;</p>
                    <p className="text-sm font-semibold text-on-surface-variant mt-1">
                      Permisi / Maaf sopan
                    </p>
                  </div>
                  <button
                    onClick={handlePlayAudio}
                    aria-label="Putar audio pengucapan"
                    className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_0_0_#881f00] active:translate-y-1 active:shadow-none hover:bg-primary-container transition-all cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <AudioWaveform className="w-7 h-7 animate-pulse" />
                    ) : (
                      <Volume2 className="w-7 h-7" />
                    )}
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-primary-fixed/40 rounded-xl text-xs font-bold text-on-primary-fixed">
                  <CheckCircle2 className="text-primary w-4 h-4 shrink-0" />
                  <span>Aksen santun kepada orang tua &amp; kerabat</span>
                </div>
              </div>
            </motion.div>

            {/* Text Copy */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="md:col-span-6 text-center md:text-left motion-reduce:animate-none motion-reduce:transition-none"
            >
              <span className="text-secondary font-black tracking-wider text-sm uppercase">
                Gamifikasi Murni
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-on-surface mt-2 tracking-tight">
                Belajar bahasa rasanya seperti main game.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed">
                Tantangan kuis kilat, audio penutur asli, dan perolehan XP harian.
                Cukup 3 menit sehari agar konsisten tanpa merasa terbebani.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature 2: Medan Budaya (Parallax Stage: 3-Layered Cultural Objects) ── */}
      <section
        ref={refMedan}
        className="relative border-t-2 border-outline-variant/30 py-24 bg-surface overflow-hidden"
      >
        {/* Latar Motif Tenun Kaili (SVG Berulang Opasitas Rendah) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="medan-kaili" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M28 0 L56 28 L28 56 L0 28 Z" fill="none" stroke="#ca4a28" strokeWidth="1" />
              <path
                d="M28 10 L46 28 L28 46 L10 28 Z"
                fill="none"
                stroke="#fea619"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle cx="28" cy="28" r="2.5" fill="#ca4a28" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medan-kaili)" />
        </svg>

        {/* ── PARALLAX LAYER 1: JAUH (Far Depth: Slow, Smaller, Opacity ~40%) ── */}
        <motion.div
          style={{ y: yFar }}
          className="absolute inset-0 pointer-events-none hidden sm:block motion-reduce:transform-none"
          aria-hidden="true"
        >
          {/* Objek 1: Belah Ketupat Subi Tenun (Kiri Atas) */}
          <div className="absolute left-6 top-8 opacity-40">
            <svg viewBox="0 0 48 48" className="w-9 h-9 text-secondary fill-none stroke-current stroke-2">
              <path d="M24 4 L44 24 L24 44 L4 24 Z" />
              <circle cx="24" cy="24" r="3" fill="currentColor" />
            </svg>
          </div>
          {/* Objek 2: Bunga Terong Kaili (Kanan Tengah) */}
          <div className="absolute right-8 top-1/2 opacity-35">
            <svg viewBox="0 0 32 32" className="w-8 h-8 text-primary fill-none stroke-current stroke-2">
              <circle cx="16" cy="16" r="4" fill="currentColor" />
              <path d="M16 2 L16 10 M16 22 L16 30 M2 16 L10 16 M22 16 L30 16" />
            </svg>
          </div>
          {/* Objek 3: Gendang Gimba (Kiri Bawah) */}
          <div className="absolute left-10 bottom-10 opacity-35">
            <svg viewBox="0 0 40 40" className="w-8 h-8 text-secondary fill-current">
              <circle cx="20" cy="20" r="16" fill="#ffe0b2" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="6" fill="currentColor" />
            </svg>
          </div>
        </motion.div>

        {/* ── PARALLAX LAYER 2: TENGAH (Mid Depth: Medium, Opacity ~70%) ── */}
        <motion.div
          style={{ y: yMid }}
          className="absolute inset-0 pointer-events-none motion-reduce:transform-none"
          aria-hidden="true"
        >
          {/* Objek 4: Mahkota Siga Tradisional Kaili (Kiri Atas) */}
          <div className="absolute left-4 sm:left-14 top-20 opacity-70">
            <svg viewBox="0 0 54 36" className="w-12 h-8 text-secondary fill-current">
              <path d="M2 28 C16 32 38 32 52 28 L48 10 L36 18 L27 4 L18 18 L6 10 Z" />
              <circle cx="27" cy="4" r="2.5" fill="#fea619" />
            </svg>
          </div>
          {/* Objek 5: Kristal XP Budaya (Kanan Atas) */}
          <div className="absolute right-6 sm:right-16 top-16 opacity-75">
            <svg viewBox="0 0 36 36" className="w-10 h-10 text-secondary-container fill-current">
              <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" />
              <polygon points="18,6 28,12 28,24 18,30 8,24 8,12" fill="#fff" opacity="0.45" />
            </svg>
          </div>
          {/* Objek 6: Nyawa Hati Adat (Kanan Bawah) */}
          <div className="absolute right-4 sm:right-20 bottom-16 opacity-70">
            <svg viewBox="0 0 36 36" className="w-9 h-9 text-error fill-current">
              <path d="M18 31 C18 31 4 21 4 11 C4 6 8 3 13 3 C16 3 17.5 5 18 6 C18.5 5 20 3 23 3 C28 3 32 6 32 11 C32 21 18 31 18 31 Z" />
            </svg>
          </div>
        </motion.div>

        {/* ── PARALLAX LAYER 3: DEKAT (Near Depth: Largest Range & Micro-Float) ── */}
        <motion.div
          style={{ y: yNear }}
          className="absolute inset-0 pointer-events-none motion-reduce:transform-none"
          aria-hidden="true"
        >
          {/* Objek 7: Miniatur Atap Souraja (Kanan Bawah dengan denyut halus) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-2 sm:right-8 bottom-8 opacity-90 hidden sm:block motion-reduce:animate-none"
          >
            <svg viewBox="0 0 64 48" className="w-16 h-12 text-primary/80 fill-current drop-shadow-sm">
              <path d="M4 36 L32 14 L60 36 Z" />
              <path d="M14 26 L32 10 L50 26 Z" />
              <path d="M22 18 L32 4 L42 18 Z" />
              <path d="M32 4 L32 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="10" y="36" width="4" height="10" rx="1" />
              <rect x="50" y="36" width="4" height="10" rx="1" />
            </svg>
          </motion.div>
          {/* Objek 8: Lencana Penutur Sopan (Kiri Bawah dengan denyut halus) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute left-2 sm:left-10 bottom-24 opacity-85 hidden sm:block motion-reduce:animate-none"
          >
            <svg viewBox="0 0 44 44" className="w-13 h-13 text-primary drop-shadow-sm">
              <circle cx="22" cy="22" r="18" fill="#ffdbd1" stroke="currentColor" strokeWidth="3" />
              <path d="M14 22 L19 27 L30 16" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Konten Utama Section Parallax */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Text Copy */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="md:col-span-6 text-center md:text-left order-2 md:order-1 motion-reduce:animate-none motion-reduce:transition-none"
            >
              <span className="text-primary font-black tracking-wider text-sm uppercase">
                Fitur Khas LARAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-on-surface mt-2 tracking-tight">
                Bukan cuma kata, kenali juga busana adatnya.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed">
                Bahasa bersanding erat dengan busana. Pasangkan Sambolo dan Baju
                Koje sesuai konteks acara adat untuk raih skor harmoni budaya penuh.
              </p>
            </motion.div>

            {/* Interactive Attire Puzzle */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="md:col-span-6 flex justify-center order-1 md:order-2 motion-reduce:animate-none motion-reduce:transition-none"
            >
              <div className="w-full max-w-sm bg-surface-container-lowest border-2 border-outline-variant/40 rounded-3xl p-6 shadow-xl text-center backdrop-blur-xs">
                <div className="text-xs uppercase tracking-wider font-extrabold text-secondary mb-3">
                  Uji Cocok Pasang Busana
                </div>

                <div className="bg-surface-container-low rounded-2xl p-4 border-2 border-outline-variant/20 mb-4">
                  <div className="text-5xl mb-2">
                    {attireMatched ? "✨ 👔 🪢" : "👔 ❓"}
                  </div>
                  <p className="font-extrabold text-sm text-on-surface">
                    {attireMatched
                      ? "Harmoni 100%! Baju Koje + Sambolo"
                      : "Pilih pelengkap kepala untuk Baju Koje"}
                  </p>
                </div>

                <button
                  onClick={() => setAttireMatched(!attireMatched)}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${
                    attireMatched
                      ? "bg-secondary text-on-secondary shadow-[0_4px_0_0_#653e00]"
                      : "bg-surface-container border-2 border-outline-variant text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {attireMatched ? "✓ Pasangan Sempurna" : "Coba Pasang Sambolo"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature 3: Paspor Budaya (Smooth Fade-Up Reveal) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface-container-low/40 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Visual Badge Card */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="md:col-span-6 flex justify-center motion-reduce:animate-none motion-reduce:transition-none"
            >
              <div className="w-full max-w-sm bg-surface-container-lowest border-2 border-outline-variant/40 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-on-primary shadow-md">
                    <Landmark className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-on-surface">
                      Paspor Budaya
                    </h3>
                    <p className="text-xs font-bold text-primary">
                      Lencana Penutur Tingkat 1
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 border-t-2 border-surface-container pt-4 text-xs font-semibold text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Dialek Terkuasai:</span>
                    <strong className="text-on-surface">Kaili Ledo (Palu)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Busana Teridentifikasi:</span>
                    <strong className="text-on-surface">Baju Nggembe &amp; Koje</strong>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href="/dashboard/paspor"
                    className="block w-full text-center py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-xs font-black uppercase tracking-wider text-on-surface transition-all"
                  >
                    Buka Paspor Digital →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Text Copy */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="md:col-span-6 text-center md:text-left motion-reduce:animate-none motion-reduce:transition-none"
            >
              <span className="text-tertiary font-black tracking-wider text-sm uppercase">
                Bukti Pencapaian
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-on-surface mt-2 tracking-tight">
                Koleksi lencana resmi di Paspor Budaya.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed">
                Tiap modul yang kamu selesaikan menghasilkan stempel digital yang
                terverifikasi. Pantau terus kemajuan dan portofolio kulturalmu.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA Section (Smooth Fade-Up Reveal) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto px-6 flex flex-col items-center motion-reduce:animate-none motion-reduce:transition-none"
        >
          <span className="text-5xl mb-4">🚀</span>
          <h2 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Mulai petualangan budayamu hari ini.
          </h2>
          <p className="mt-4 text-lg text-on-surface-variant font-medium">
            Gratis selamanya, menyenangkan, dan melestarikan warisan Nusantara.
          </p>

          <Link
            href="/auth?mode=daftar"
            className="mt-8 w-full sm:w-72 text-center py-4 px-8 rounded-2xl bg-primary text-on-primary font-black text-base uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-[2px] active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2"
          >
            <span>Mulai Belajar Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer Lengkap & Bermartabat (Munas IX & Permikomnas) ── */}
      <footer className="relative bg-gradient-to-b from-[#2a0e06] via-[#1f0a04] to-[#140602] text-[#f7eee9] antialiased">
        {/* 1. Pita Tenun di Tepi Atas Footer (Selendang Budaya) */}
        <div className="h-3 w-full bg-[#3c1409] relative overflow-hidden opacity-90 border-b border-primary/20">
          <svg
            className="w-full h-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="footer-selendang" width="28" height="12" patternUnits="userSpaceOnUse">
                <path d="M14 0 L28 6 L14 12 L0 6 Z" fill="none" stroke="#fea619" strokeWidth="1" />
                <circle cx="14" cy="6" r="1.5" fill="#ffdbd1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-selendang)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          {/* 2. Strip Resmi Logo Munas IX & Permikomnas */}
          <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#e0bfb7] text-center sm:text-left">
              Diselenggarakan dalam rangka:
            </span>
            <div className="flex items-center gap-5 p-3 sm:px-6 rounded-2xl bg-white shadow-md">
              <img
                src="/logo-munas-landscape.png"
                alt="Logo Munas IX PERMIKOMNAS"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <img
                src="/logo-permikomnas.png"
                alt="Logo Permikomnas RI"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* 3. Badan Footer 4 Kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-white/10">
            {/* Kolom 1: Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3.5">
                <img
                  alt="LARAS"
                  className="h-13 sm:h-14 w-auto object-contain"
                  src="/logo/logo_laras.png"
                />
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  LARAS
                </span>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-secondary-fixed">
                Nusantara Before It&apos;s Gone
              </span>
              <p className="mt-1 text-xs text-[#d8c3bc] leading-relaxed">
                Platform belajar budaya Kaili lewat permainan — bahasa, busana, dan adab, sebelum semuanya hilang.
              </p>
            </div>

            {/* Kolom 2: Jelajahi */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-secondary-fixed">
                Jelajahi
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#d8c3bc]">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=masuk" className="hover:text-white transition-colors">
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=daftar" className="hover:text-white transition-colors">
                    Daftar
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/paspor" className="hover:text-white transition-colors">
                    Paspor Budaya
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Pelajaran */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-secondary-fixed">
                Pelajaran
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#d8c3bc]">
                <li>
                  <Link href="/auth?mode=masuk" className="hover:text-white transition-colors">
                    Salam &amp; Adab Tabe
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=masuk" className="hover:text-white transition-colors">
                    Kenali Baju Nggembe
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=masuk" className="hover:text-white transition-colors">
                    Skenario Souraja
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Tim & Penyelenggara */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-secondary-fixed">
                Karya
              </span>
              <div className="flex flex-col gap-1 text-xs text-[#d8c3bc] leading-relaxed">
                <span className="font-extrabold text-white">Buras Team</span>
                <span>Universitas Tadulako — Palu, Sulawesi Tengah</span>
                <span className="mt-1 text-[11px] text-[#bda69f]">
                  Dibangun untuk Lomba Aplikasi Berbasis Website — Munas IX PERMIKOMNAS di UNIMA.
                </span>
              </div>
            </div>
          </div>

          {/* 4. Baris Dasar & Kejujuran Konten */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#a89088]">
            <p className="font-medium">
              © 2026 LARAS — Nusantara Before It&apos;s Gone.
            </p>
            <p className="text-[11px] max-w-md text-[#957e77]">
              Konten budaya pada aplikasi ini berstatus data demo dan sedang dalam proses validasi bersama narasumber budaya.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
