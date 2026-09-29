"use client";

import Link from "next/link";
import TopBar from "../../components/TopBar";

const learningTracks = [
  { title: "Bahasa Ledo", progress: 82, tag: "Active" },
  { title: "Adab & sapaan", progress: 100, tag: "Done" },
  { title: "Busana adat", progress: 35, tag: "Next" },
];

const achievements = [
  { title: "Pionir Salam", detail: "3 sesi sapaan selesai", icon: "military_tech" },
  { title: "Penjaga Adab", detail: "12 ekspresi hormat dikuasai", icon: "verified_user" },
  { title: "Petualang Budaya", detail: "5 quest diselesaikan", icon: "auto_awesome" },
  { title: "Riset Ledo", detail: "1 mini challenge selesai", icon: "school" },
];

export default function ProfilPage() {
  return (
    <>
      <TopBar title="Profile" subtitle="Jalur belajar dan achievement" />

      <main className="relative min-h-screen w-full px-3 pb-20 pt-20 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  alt="Rani Maharani"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Vhf8Tpf1UP_r76LEL-9Olxy-KamrRKdvbuw_IdSOUdsPnutS-ucQSUNrUwCmvv79RwssCekEhlPat9dql81M0_w3TdFVqc0hENXtxegKWhP1UapZD9OlTcn4MiCZZPhuf7VNtyofbbQ8ByHlCDXGq8phTykzER2D0OKlgZrlUIKLycgNPOKpSjSCeQYrau-XCBnFjpIEDXwO8PKFKpjzvu77uKgmWMakGwQ2PeNYy_zuHKKvm8sSrmGaG3"
                />
                <div>
                  <h1 className="text-2xl font-black text-on-surface">Rani Maharani</h1>
                  <p className="text-sm text-on-surface-variant">@ranimaharani • Sulawesi Tengah</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/pengaturan"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-container px-4 py-2.5 text-sm font-bold text-on-surface ring-1 ring-outline-variant/25 transition hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[16px]">settings</span>
                  Pengaturan
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">XP</div>
              <div className="mt-2 text-2xl font-black text-on-surface">480</div>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Level</div>
              <div className="mt-2 text-2xl font-black text-on-surface">3</div>
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Streak</div>
              <div className="mt-2 text-2xl font-black text-on-surface">5 hari</div>
            </div>
          </section>

          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-on-surface">Jalur belajar</h2>
              <Link href="/dashboard/belajar" className="text-sm font-bold text-primary">Lihat path</Link>
            </div>

            <div className="space-y-3">
              {learningTracks.map((track) => (
                <div key={track.title} className="rounded-[18px] bg-surface-container p-3 ring-1 ring-outline-variant/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-extrabold text-on-surface">{track.title}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${
                        track.tag === "Done"
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : track.tag === "Active"
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {track.tag}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div
                      className={`h-full rounded-full ${
                        track.progress === 100 ? "w-full bg-secondary" : "w-[" + track.progress + "%] bg-primary"
                      }`}
                    />
                  </div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    Progress {track.progress}%
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-on-surface">Achievement</h2>
              <Link href="/dashboard/paspor" className="text-sm font-bold text-primary">Lihat semua</Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {achievements.map((item) => (
                <div key={item.title} className="rounded-[18px] bg-surface-container p-3 ring-1 ring-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-on-surface">{item.title}</p>
                      <p className="text-[11px] text-on-surface-variant">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
