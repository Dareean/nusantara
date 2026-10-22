"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  Award,
  BadgeCheck,
  Compass,
  GraduationCap,
  LogOut,
  Edit3,
  Camera,
} from "lucide-react";
import { getCachedSessionSync, getSession, type ClientSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "../progress";
import { CANONICAL_BADGES } from "@/lib/badges";
import EditProfileModal from "../../components/EditProfileModal";

export default function ProfilPage() {
  const [session, setSession] = useState<{ email: string; name: string; avatarUrl?: string } | null>(null);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const cached = getCachedSessionSync();
    let email = cached?.email || "";
    if (cached) {
      setSession(cached);
      setUserName(cached.name);
      setAvatarUrl(cached.avatarUrl || "");
      setProgress(readProgress(cached.email));
      setIsLoaded(true);
    }
    getSession().then(async (sess) => {
      if (!sess) {
        setIsLoaded(true);
        return;
      }
      setSession(sess);
      setUserName(sess.name);
      setAvatarUrl(sess.avatarUrl || "");
      email = sess.email;
      const local = readProgress(email);
      setProgress(local);
      setIsLoaded(true);
      const remote = await loadProgress(email);
      setProgress(remote);
    });

    const refresh = () => {
      if (email) setProgress(readProgress(email));
    };
    window.addEventListener("laras-progress-updated", refresh);

    const onProfileChanged = (e: Event) => {
      const detail = (e as CustomEvent<ClientSession>).detail;
      if (detail) {
        setUserName(detail.name);
        setAvatarUrl(detail.avatarUrl || "");
        setSession(detail);
      }
    };
    window.addEventListener("laras-profile-updated", onProfileChanged);

    return () => {
      window.removeEventListener("laras-progress-updated", refresh);
      window.removeEventListener("laras-profile-updated", onProfileChanged);
    };
  }, []);

  const handleProfileUpdated = (updatedSession: ClientSession) => {
    setUserName(updatedSession.name);
    setAvatarUrl(updatedSession.avatarUrl || "");
    setSession(updatedSession);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Gagal logout:", err);
    }
    window.location.href = "/auth";
  };

  const learningTracks = [
    {
      title: "Salam & Adab Tabe (Kaili Ledo)",
      progress: progress.completedLessons.includes(1) ? 100 : 0,
      tag: progress.completedLessons.includes(1) ? "Selesai" : "Aktif",
    },
    {
      title: "Busana Adat Nggembe",
      progress: progress.completedLessons.includes(2) ? 100 : 0,
      tag: progress.completedLessons.includes(2)
        ? "Selesai"
        : progress.unlockedLessons.includes(2)
        ? "Aktif"
        : "Terkunci",
    },
    {
      title: "Skenario Souraja (Rumah Adat)",
      progress: progress.completedLessons.includes(3) ? 100 : 0,
      tag: progress.completedLessons.includes(3)
        ? "Selesai"
        : progress.unlockedLessons.includes(3)
        ? "Aktif"
        : "Terkunci",
    },
  ];

  return (
    <>
      <main className="relative min-h-screen w-full px-3 pb-20 pt-4 sm:pt-6 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <section className="rounded-[24px] bg-surface-container-lowest p-4 shadow-xs ring-1 ring-outline-variant/25 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {isLoaded && userName ? (
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      title="Klik untuk ubah foto profil"
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-black text-on-primary ring-2 ring-primary/20 overflow-hidden shadow-xs hover:ring-4 hover:ring-primary/40 transition-all cursor-pointer"
                    >
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{userName.slice(0, 1).toUpperCase()}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      aria-label="Ubah foto profil"
                      className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow flex items-center justify-center hover:scale-110 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-surface-container-high ring-2 ring-outline-variant/30 animate-pulse" />
                )}
                <div>
                  {isLoaded && userName ? (
                    <>
                      <h1 className="text-2xl font-black text-on-surface">{userName}</h1>
                      <p className="text-sm text-on-surface-variant">{session?.email || `${userName.toLowerCase().replaceAll(" ", "_")}@laras.id`}</p>
                    </>
                  ) : (
                    <>
                      <div className="h-7 w-36 rounded bg-surface-container-high animate-pulse mb-1.5" />
                      <div className="h-4 w-48 rounded bg-surface-container-high animate-pulse" />
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary px-4 py-2.5 text-sm font-black shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-[1px] active:shadow-none transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profil
                </button>
                <Link
                  href="/dashboard/pengaturan"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-container px-4 py-2.5 text-sm font-bold text-on-surface ring-1 ring-outline-variant/25 transition hover:bg-surface-container-high"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </Link>
                {session && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-error-container/30 px-4 py-2.5 text-sm font-bold text-error ring-1 ring-error/25 transition hover:bg-error-container/60 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">XP</div>
              {isLoaded ? (
                <div className="mt-2 text-2xl font-black text-on-surface">{progress.xp}</div>
              ) : (
                <div className="mt-2 h-8 w-16 rounded bg-surface-container-high animate-pulse" />
              )}
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Level</div>
              {isLoaded ? (
                <div className="mt-2 text-2xl font-black text-on-surface">{Math.floor(progress.xp / 100) + 1}</div>
              ) : (
                <div className="mt-2 h-8 w-10 rounded bg-surface-container-high animate-pulse" />
              )}
            </div>
            <div className="rounded-[20px] bg-surface-container-lowest p-3.5 shadow-xs ring-1 ring-outline-variant/25">
              <div className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">Streak</div>
              {isLoaded ? (
                <div className="mt-2 text-2xl font-black text-on-surface">{progress.streak} hari</div>
              ) : (
                <div className="mt-2 h-8 w-20 rounded bg-surface-container-high animate-pulse" />
              )}
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
                        track.tag === "Selesai"
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : track.tag === "Aktif"
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {track.tag}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${track.progress}%` }}
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
              {CANONICAL_BADGES.map((item) => {
                const isUnlocked =
                  progress.badges.includes(item.title) ||
                  progress.completedLessons.includes(item.lessonId);
                const Icon = item.lessonId === 1 ? Award : item.lessonId === 2 ? BadgeCheck : Compass;
                return (
                  <div key={item.title} className="rounded-[18px] bg-surface-container p-3 ring-1 ring-outline-variant/20">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            item.tone === "primary"
                              ? "bg-primary-fixed text-primary"
                              : item.tone === "secondary"
                                ? "bg-secondary-fixed text-secondary"
                                : "bg-tertiary-fixed text-tertiary"
                          } ${!isUnlocked ? "opacity-50 grayscale" : ""}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-on-surface">{item.title}</p>
                          <p className="text-[11px] text-on-surface-variant">{item.detail}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${isUnlocked ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container-high text-on-surface-variant"}`}>
                        {isUnlocked ? "Buka" : "Kunci"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={userName}
        currentEmail={session?.email || ""}
        currentAvatar={avatarUrl}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
}
