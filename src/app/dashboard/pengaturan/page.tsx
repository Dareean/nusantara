"use client";

import { useState, useEffect } from "react";
import { LogOut, Edit3 } from "lucide-react";
import { getSession, type ClientSession } from "../../auth/authClient";
import EditProfileModal from "../../components/EditProfileModal";

export default function PengaturanPage() {
  const [dailyGoal, setDailyGoal] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [audioAutoPlay, setAudioAutoPlay] = useState(true);
  const [session, setSession] = useState<{ email: string; name: string; avatarUrl?: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    try {
      const dg = localStorage.getItem("laras.setting.dailyGoal");
      if (dg !== null) setDailyGoal(JSON.parse(dg));
      const pn = localStorage.getItem("laras.setting.pushNotif");
      if (pn !== null) setPushNotif(JSON.parse(pn));
      const ap = localStorage.getItem("laras.setting.audioAutoPlay");
      if (ap !== null) setAudioAutoPlay(JSON.parse(ap));
    } catch {
      // ignore JSON parse or localStorage security errors
    }

    getSession().then((sess) => {
      if (sess) setSession(sess);
    });

    const onProfileChanged = (e: Event) => {
      const detail = (e as CustomEvent<ClientSession>).detail;
      if (detail) {
        setSession(detail);
      }
    };
    window.addEventListener("laras-profile-updated", onProfileChanged);
    return () => window.removeEventListener("laras-profile-updated", onProfileChanged);
  }, []);

  const toggleDailyGoal = () => {
    setDailyGoal((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("laras.setting.dailyGoal", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const togglePushNotif = () => {
    setPushNotif((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("laras.setting.pushNotif", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleAudioAutoPlay = () => {
    setAudioAutoPlay((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("laras.setting.audioAutoPlay", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Gagal logout:", err);
    }
    window.location.href = "/auth";
  };

  return (
    <>
      <main className="relative min-h-screen w-full px-3 pb-20 pt-4 sm:pt-6 sm:px-4 lg:px-6">
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
                onClick={toggleDailyGoal}
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
                <p className="text-xs text-on-surface-variant">Ingatkan target harian dan hari beruntun.</p>
              </div>
              <button
                type="button"
                onClick={togglePushNotif}
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
                onClick={toggleAudioAutoPlay}
                className={`relative h-7 w-12 rounded-full transition ${audioAutoPlay ? "bg-primary" : "bg-surface-container-high"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${audioAutoPlay ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
          </section>

          {session && (
            <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-base font-extrabold text-on-surface">Akun & Sesi</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Masuk sebagai <strong className="text-on-surface">{session.name}</strong> ({session.email})
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary px-4 py-2 text-sm font-black shadow-[0_2px_0_0_#881f00] hover:brightness-105 active:translate-y-[1px] active:shadow-none transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    Ubah Profil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-error-container/30 px-4 py-2 text-sm font-bold text-error ring-1 ring-error/25 transition hover:bg-error-container/60 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={session?.name || ""}
        currentEmail={session?.email || ""}
        currentAvatar={session?.avatarUrl || ""}
        onProfileUpdated={(updated) => setSession(updated)}
      />
    </>
  );
}
