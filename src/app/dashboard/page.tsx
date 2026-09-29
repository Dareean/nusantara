"use client";

import Link from "next/link";
import TopBar from "../components/TopBar";

export default function DashboardHome() {
  return (
    <>
      <TopBar />

      <main className="relative min-h-screen w-full px-4 pb-24 pt-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
                Lembah Palu • Ledo
              </p>
              <h1 className="mt-2 text-headline-lg text-on-surface font-extrabold tracking-tight">
                Selamat pagi, Rani
              </h1>
            </div>

            <Link
              href="/dashboard/belajar"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-label-lg font-bold text-on-primary shadow-[0_3px_0_0_#881f00] transition-all hover:bg-primary-container"
            >
              Lanjutkan kelas
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
            <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-container via-primary to-[#7a2709] p-6 text-on-primary-container shadow-[0_16px_30px_-12px_rgba(168,50,17,0.3)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-label-md uppercase tracking-[0.12em] font-bold">
                  Pelajaran hari ini
                </span>
                <span className="rounded-full bg-black/10 px-2.5 py-1 text-label-sm font-bold">
                  +20 XP
                </span>
              </div>

              <h2 className="max-w-xl text-headline-md font-extrabold leading-tight">
                Pelajaran 3/5: Mengucapkan rasa syukur &amp; hormat
              </h2>

              <p className="mt-3 max-w-xl text-body-md text-primary-fixed/95">
                Pelajari intonasi santun dan gesture sambut adat Kaili saat menyapa
                tetua dan kerabat di teras Souraja.
              </p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-label-sm text-on-primary/90">
                  <span>Progress bab</span>
                  <span>3/5 • 60%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20">
                  <div className="h-full w-[60%] rounded-full bg-secondary-fixed" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/latihan"
                  className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-5 py-3 text-label-lg font-bold text-primary"
                >
                  Lanjutkan belajar
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <span className="text-body-sm text-on-primary/80">Terakhir 18 jam lalu</span>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/30">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-title-md font-bold text-on-surface">Target hari ini</span>
                  <span className="rounded-full bg-primary-fixed px-2 py-1 text-label-sm font-bold text-on-primary-fixed">
                    6 hari
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary/20 text-headline-sm font-extrabold text-primary">
                    50%
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface-variant">1 pelajaran lagi</p>
                    <p className="text-body-sm text-on-surface-variant">Selesaikan sesi hari ini.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/30">
                <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                  Fokus hari ini
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-title-md font-bold text-on-surface">Bahasa Ledo</p>
                    <p className="text-body-sm text-on-surface-variant">2 sub-bab</p>
                  </div>
                  <span className="rounded-full bg-secondary-fixed px-2 py-1 text-label-sm font-bold text-on-secondary-fixed">
                    4/6
                  </span>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href="/dashboard/belajar" className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/30 transition hover:bg-surface-container">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <p className="text-title-md font-bold text-on-surface">Bahasa Daerah</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">5 sub-bab siap dipelajari</p>
            </Link>

            <Link href="/dashboard/paspor" className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/30 transition hover:bg-surface-container">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <p className="text-title-md font-bold text-on-surface">Paspor Budaya</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">Progressmu saat ini 75%</p>
            </Link>

            <Link href="/dashboard/arcade" className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/30 transition hover:bg-surface-container">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary">
                <span className="material-symbols-outlined">sports_esports</span>
              </div>
              <p className="text-title-md font-bold text-on-surface">Arcade</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">Latihan cepat dan kuis mini</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
