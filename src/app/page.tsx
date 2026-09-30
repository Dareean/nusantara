"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Flame,
  Sparkles,
  Volume2,
  AudioWaveform,
  CheckCircle2,
  ArrowRight,
  Landmark,
} from "lucide-react";

export default function LandingPage() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [attireMatched, setAttireMatched] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* ── Top Navigation Bar (Duolingo Style: Clean & Direct) ── */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b-2 border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              alt="LARAS"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              src="/logo/logo_laras.png"
            />
            <span className="text-2xl font-black tracking-tight text-primary">
              LARAS
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden sm:inline-flex px-5 py-2.5 rounded-2xl border-2 border-outline-variant text-on-surface font-extrabold text-sm uppercase tracking-wider hover:bg-surface-container active:translate-y-0.5 transition-all shadow-[0_2px_0_0_#e0bfb7]"
            >
              Masuk
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-primary text-on-primary font-black text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-1 active:shadow-none transition-all"
            >
              Mulai
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Duolingo: Big Illustration Left, Direct CTA Right) ── */}
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
                className="absolute -top-2 -left-4 z-20 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-lg border-2 border-primary/20 flex items-center gap-2"
              >
                <Flame className="text-primary w-5 h-5" />
                <span className="font-black text-primary text-sm">7 HARI STREAK</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 -right-4 z-20 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-lg border-2 border-secondary/20 flex items-center gap-2"
              >
                <Sparkles className="text-secondary w-5 h-5" />
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
                href="/onboarding"
                className="w-full text-center py-4 px-6 rounded-2xl bg-primary text-on-primary font-black text-base uppercase tracking-wider shadow-[0_5px_0_0_#881f00] hover:bg-primary-container active:translate-y-1 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth"
                className="w-full text-center py-3.5 px-6 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant text-primary font-black text-base uppercase tracking-wider shadow-[0_4px_0_0_#e0bfb7] hover:bg-surface-container active:translate-y-1 active:shadow-[0_1px_0_0_#e0bfb7] transition-all"
              >
                Aku Sudah Punya Akun
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature 1: Belajar Seperti Game (Scroll InView) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface-container-low/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Visual Box */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 flex justify-center"
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 text-center md:text-left"
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

      {/* ── Feature 2: Culture Connection (Interactive Busana Adat) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Text Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 text-center md:text-left order-2 md:order-1"
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 flex justify-center order-1 md:order-2"
            >
              <div className="w-full max-w-sm bg-surface-container-lowest border-2 border-outline-variant/40 rounded-3xl p-6 shadow-xl text-center">
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

      {/* ── Feature 3: Paspor Budaya (Lencana & Portofolio) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface-container-low/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Visual Badge Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 flex justify-center"
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 text-center md:text-left"
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

      {/* ── Final CTA Section (Duolingo Style: Big & Bold) ── */}
      <section className="border-t-2 border-outline-variant/30 py-20 bg-surface text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-6 flex flex-col items-center"
        >
          <span className="text-5xl mb-4">🚀</span>
          <h2 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Mulai petualangan budayamu hari ini.
          </h2>
          <p className="mt-4 text-lg text-on-surface-variant font-medium">
            Gratis selamanya, menyenangkan, dan melestarikan warisan Nusantara.
          </p>

          <Link
            href="/onboarding"
            className="mt-8 w-full sm:w-72 text-center py-4 px-8 rounded-2xl bg-primary text-on-primary font-black text-base uppercase tracking-wider shadow-[0_5px_0_0_#881f00] hover:bg-primary-container active:translate-y-1 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2"
          >
            <span>Mulai Belajar Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Minimal Footer ── */}
      <footer className="border-t-2 border-outline-variant/30 py-8 bg-surface-container-low text-center text-xs text-on-surface-variant font-bold">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-primary font-black text-sm">LARAS NUSANTARA</span>
          <span>© 2026 LARAS — Nusantara Before It&apos;s Gone.</span>
          <div className="flex gap-4">
            <Link href="/auth" className="hover:underline">Masuk</Link>
            <Link href="/dashboard/paspor" className="hover:underline">Paspor</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
