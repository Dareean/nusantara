"use client";

import { useState } from "react";
import TopBar from "../../components/TopBar";

export default function PengaturanPage() {
  const [dailyGoal, setDailyGoal] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [audioAutoPlay, setAudioAutoPlay] = useState(true);

  return (
    <>
      <TopBar title="Settings" subtitle="Atur pengalaman belajar kamu" />

      <main className="relative min-h-screen w-full px-3 pb-20 pt-20 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
            <h1 className="text-2xl font-black text-on-surface">Pengaturan</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Sesuaikan cara belajar dan notifikasi agar lebih nyaman.</p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between rounded-[20px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
              <div>
                <p className="text-base font-extrabold text-on-surface">Target harian</p>
                <p className="text-xs text-on-surface-variant">Arahkan fokus belajar tiap hari.</p>
              </div>
              <button
                type="button"
                onClick={() => setDailyGoal((prev) => !prev)}
                className={`relative h-7 w-12 rounded-full transition ${dailyGoal ? "bg-primary" : "bg-surface-container-high"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${dailyGoal ? "left-6" : "left-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-[20px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
              <div>
                <p className="text-base font-extrabold text-on-surface">Notifikasi push</p>
                <p className="text-xs text-on-surface-variant">Ingatkan misi harian dan streak.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushNotif((prev) => !prev)}
                className={`relative h-7 w-12 rounded-full transition ${pushNotif ? "bg-primary" : "bg-surface-container-high"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${pushNotif ? "left-6" : "left-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-[20px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25">
              <div>
                <p className="text-base font-extrabold text-on-surface">Audio autoplay</p>
                <p className="text-xs text-on-surface-variant">Mainkan contoh suara saat membuka latihan.</p>
              </div>
              <button
                type="button"
                onClick={() => setAudioAutoPlay((prev) => !prev)}
                className={`relative h-7 w-12 rounded-full transition ${audioAutoPlay ? "bg-primary" : "bg-surface-container-high"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${audioAutoPlay ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
