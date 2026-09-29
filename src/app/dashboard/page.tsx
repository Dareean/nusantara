"use client";

import Link from "next/link";
import TopBar from "../components/TopBar";

export default function DashboardHome() {
  const isNewUser = true;
  const primaryAction = isNewUser
    ? { href: "/dashboard/arcade", label: "Mulai game", icon: "sports_esports" }
    : { href: "/dashboard/latihan", label: "Lanjutkan misi", icon: "play_arrow" };

  return (
    <>
      <TopBar />

      <main className="relative min-h-screen w-full px-3 pb-20 pt-20 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <section className="overflow-hidden rounded-[24px] bg-gradient-to-br from-[#fef3e8] via-[#f7d7b8] to-[#ef8f5a] p-4 shadow-[0_12px_22px_-16px_rgba(168,50,17,0.3)] ring-1 ring-[#f3c9a7] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/70 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
                    {isNewUser ? "Pemula baru" : "Misi Hari Ini"}
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-[#3c1d12] sm:text-3xl">
                  {isNewUser ? "Mau mulai petualangan budaya?" : "Level 3: Salam & Hormat"}
                </h1>
                <p className="mt-2 text-sm text-[#543127] sm:text-base">
                  {isNewUser
                    ? "Mulai dengan tantangan cepat dan bangun streak sambil belajar bahasa dan adat Kaili."
                    : "Selesaikan tantangan kecil hari ini untuk naik level dan buka lencana budaya baru."}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-[#fff0e3]/80 px-2.5 py-1.5 shadow-[0_6px_16px_rgba(132,54,16,0.12)] ring-1 ring-white/50">
                <span className="material-symbols-outlined text-[18px] text-primary">local_fire_department</span>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-[#704433]">Streak</div>
                  <div className="text-base font-black text-[#472518]">5 hari</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full bg-[#fff8f1] px-2.5 py-1.5 text-xs font-bold text-[#472518] shadow-sm">
                  480 XP
                </div>
                <div className="rounded-full bg-[#fff8f1] px-2.5 py-1.5 text-xs font-bold text-[#472518] shadow-sm">
                  Level 3
                </div>
                <div className="rounded-full bg-[#fff8f1] px-2.5 py-1.5 text-xs font-bold text-[#472518] shadow-sm">
                  {isNewUser ? "Challenge baru" : "2 misi tersisa"}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d120d] px-4 py-2.5 text-sm font-extrabold text-[#fff7f1] shadow-[0_4px_0_0_#4a2214] transition-all hover:translate-y-[-1px]"
                >
                  <span className="material-symbols-outlined text-[16px]">{primaryAction.icon}</span>
                  {primaryAction.label}
                </Link>

                <Link
                  href={isNewUser ? "/dashboard/latihan" : "/dashboard/arcade"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-2.5 text-sm font-bold text-[#432615] shadow-sm ring-1 ring-white/60 transition-all hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isNewUser ? "play_arrow" : "sports_esports"}
                  </span>
                  {isNewUser ? "Lanjut belajar" : "Main game"}
                </Link>
              </div>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
            <section className="rounded-[22px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                    Path ku
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-on-surface">Quest aktif</h2>
                </div>
                <span className="rounded-full bg-primary-fixed px-2 py-1 text-[10px] font-bold text-on-primary-fixed">
                  3/5
                </span>
              </div>

              <div className="space-y-2.5">
                <Link href="/dashboard/belajar" className="block rounded-2xl bg-surface-container p-3.5 ring-1 ring-outline-variant/20 transition hover:bg-surface-container-high">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">
                        Level 1
                      </p>
                      <h3 className="mt-1 text-base font-extrabold text-on-surface">Salam &amp; sapaan</h3>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full w-full rounded-full bg-primary" />
                  </div>
                </Link>

                <Link href="/dashboard/belajar" className="block rounded-2xl bg-surface-container p-3.5 ring-1 ring-outline-variant/20 transition hover:bg-surface-container-high">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">
                        Level 2
                      </p>
                      <h3 className="mt-1 text-base font-extrabold text-on-surface">Kesantunan adat</h3>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-primary">play_circle</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full w-[70%] rounded-full bg-primary" />
                  </div>
                </Link>

                <Link href="/dashboard/belajar" className="block rounded-2xl bg-surface-container p-3.5 ring-1 ring-outline-variant/20 opacity-80 transition hover:bg-surface-container-high">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">
                        Level 3
                      </p>
                      <h3 className="mt-1 text-base font-extrabold text-on-surface">Busana Nggembe</h3>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">lock</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full w-[35%] rounded-full bg-surface-variant" />
                  </div>
                </Link>
              </div>
            </section>

            <aside className="space-y-3">
              <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Progress
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-primary/20 bg-surface-container text-lg font-black text-primary">
                    68%
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Target harian</p>
                    <p className="text-base font-black text-on-surface">3/5 quest</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-gradient-to-br from-[#f5dfd0] to-[#f7bf8e] p-3.5 shadow-xs ring-1 ring-[#e8b692]">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6e3a21]">
                  Daily bonus
                </p>
                <h3 className="mt-2 text-lg font-black text-[#3f2113]">+20 XP</h3>
                <p className="mt-1 text-xs text-[#6e3a21]">Selesaikan 1 review cepat untuk klaim bonus.</p>
              </div>
            </aside>
          </div>

          <section className="grid gap-3 md:grid-cols-3">
            <Link href="/dashboard/arcade" className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25 transition hover:bg-surface-container">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-fixed text-secondary">
                <span className="material-symbols-outlined text-[22px]">sports_esports</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Mini game</p>
              <h3 className="mt-1.5 text-lg font-extrabold text-on-surface">Arcade</h3>
              <p className="mt-1 text-xs text-on-surface-variant">Jawab cepat untuk dapat combo dan XP.</p>
            </Link>

            <Link href="/dashboard/paspor" className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25 transition hover:bg-surface-container">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Prestasi</p>
              <h3 className="mt-1.5 text-lg font-extrabold text-on-surface">Paspor</h3>
              <p className="mt-1 text-xs text-on-surface-variant">Lihat level budaya, lencana, dan kemajuanmu.</p>
            </Link>

            <Link href="/dashboard/profil" className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25 transition hover:bg-surface-container">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-tertiary-fixed text-tertiary">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Profil</p>
              <h3 className="mt-1.5 text-lg font-extrabold text-on-surface">Akun</h3>
              <p className="mt-1 text-xs text-on-surface-variant">Cek streak, avatar, dan pengaturan belajar.</p>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
