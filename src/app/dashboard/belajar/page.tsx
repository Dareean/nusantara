"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "../../components/TopBar";
import {
  BookOpen,
  Headphones,
  Languages,
  Star,
  BookMarked,
  Lock,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";
import { getSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, type UserProgress } from "../progress";
import { getStoredSessions, syncSessionsFromServer } from "../../components/game-engine/sessionStore";
import type { GameSession } from "../../components/game-engine/types";

type LessonStatus = "done" | "active" | "locked";

type Lesson = {
  id: number;
  Icon: LucideIcon;
  label: string;
  status: LessonStatus;
  href: string;
  left: number;
  top: number;
  size: number;
};

const lessons: Lesson[] = [
  { id: 1, Icon: BookOpen, label: "Baca", status: "done", href: "/dashboard/latihan/1", left: 50, top: 12, size: 68 },
  { id: 2, Icon: Headphones, label: "Dengar", status: "active", href: "/dashboard/latihan/1", left: 50, top: 32, size: 104 },
  { id: 3, Icon: Languages, label: "Pahami", status: "locked", href: "/dashboard/latihan/2", left: 50, top: 52, size: 82 },
  { id: 4, Icon: Star, label: "Tantang", status: "locked", href: "/dashboard/latihan/3", left: 50, top: 68, size: 84 },
  { id: 5, Icon: BookMarked, label: "Rekap", status: "locked", href: "/dashboard/paspor", left: 50, top: 88, size: 82 },
];

export default function JalurBelajarPage() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [curatorSessions, setCuratorSessions] = useState<GameSession[]>([]);

  useEffect(() => {
    getSession().then(async (session) => {
      if (session) setProgress(await loadProgress(session.email));
    });

    const updateSessions = () => {
      try {
        const builtinIds = new Set(["SES-KL-MASTER-001", "SES-LALOVE-002"]);
        const stored = getStoredSessions();
        const custom = stored.filter((s) => !builtinIds.has(s.id));
        setCuratorSessions(custom);
      } catch (err) {
        console.error("Gagal membaca sesi kurator:", err);
      }
    };

    updateSessions();
    window.addEventListener("laras-sessions-updated", updateSessions);
    syncSessionsFromServer().catch(() => {});
    return () => window.removeEventListener("laras-sessions-updated", updateSessions);
  }, []);

  return (
    <>
      <TopBar title="Jalur Belajar" subtitle="Misi budaya yang siap kamu jalani" />

      <main className="relative min-h-screen bg-[#f5efe9] px-3 pb-24 pt-24 text-[#2d1c15]">
        <div className="mx-auto max-w-[560px]">
          <div className="relative mx-auto h-[620px] w-full max-w-[440px]">
            <svg
              viewBox="0 0 220 620"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M110 12 C 112 52, 108 100, 110 158 C 112 200, 92 228, 110 282 C 128 336, 110 390, 110 448 C 110 502, 92 540, 110 600"
                fill="none"
                stroke="#e7c4a0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M110 110 C 118 130, 114 150, 110 170"
                fill="none"
                stroke="#db9964"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.75"
              />
            </svg>

            {lessons.map((lesson) => {
              const isDone = progress.completedLessons.includes(lesson.id) || (lesson.id === 1 && lesson.status === "done");
              const isUnlocked = progress.unlockedLessons.includes(lesson.id) || lesson.id === 1;
              const isActive = isUnlocked && !isDone;
              const isLocked = !isUnlocked;
              const { Icon } = lesson;

              const nodeTopMap: Record<number, number> = {
                1: 58,
                2: 185,
                3: 340,
                4: 480,
                5: 600,
              };

              const top = nodeTopMap[lesson.id] ?? 240;

              return (
                <div key={lesson.id}>
                  {isActive && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 rounded-xl bg-[#fffaf5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#5a2c1d] shadow-[0_8px_20px_rgba(0,0,0,0.12)] ring-1 ring-[#e8d5c2]"
                      style={{ top: `${top - 72}px` }}
                    >
                      Jump here?
                    </div>
                  )}

                  {isLocked ? (
                    <div
                      aria-label={`${lesson.label} terkunci`}
                      className={`absolute flex items-center justify-center rounded-full border-[5px] transition-all duration-200 ${"border-[#d8cdc3] bg-[#e8e1db] text-[#554a43] opacity-90"}`}
                      style={{
                        left: "50%",
                        top: `${top}px`,
                        width: `${lesson.size}px`,
                        height: `${lesson.size}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Lock className="w-8 h-8" aria-hidden="true" />
                    </div>
                  ) : (
                    <Link
                    href={lesson.href}
                    aria-label={lesson.label}
                    className={`absolute flex items-center justify-center rounded-full border-[5px] transition-all duration-200 ${
                      isActive
                        ? "border-[#ee8c54] bg-[#f29b5b] text-[#fffaf3] shadow-[0_12px_28px_-10px_rgba(240,155,91,0.8)]"
                        : isDone
                          ? "border-[#d5b381] bg-[#f6d7ab] text-[#482b1c]"
                          : "border-[#d8cdc3] bg-[#e8e1db] text-[#554a43] opacity-90"
                    }`}
                    style={{
                      left: "50%",
                      top: `${top}px`,
                      width: `${lesson.size}px`,
                      height: `${lesson.size}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                    >
                    <Icon className="w-8 h-8" aria-hidden="true" />

                    {isActive && (
                      <span className="absolute inset-[-10px] rounded-full ring-4 ring-[#f29b5b]/20" />
                    )}
                    </Link>
                  )}

                  {lesson.id === 3 && isLocked && (
                    <div
                      className="absolute flex items-center gap-1 rounded-full bg-[#fffaf5]/80 px-2.5 py-1 text-[10px] font-semibold text-[#5d3122] ring-1 ring-[#e7d7c8] shadow-sm"
                      style={{
                        left: "70%",
                        top: `${top + 12}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <Lock className="w-3 h-3" />
                      later
                    </div>
                  )}
                </div>
              );
            })}

            <div className="absolute bottom-4 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f29b5b] text-[#fffaf3] shadow-[0_12px_24px_-12px_rgba(242,155,91,0.9)]">
              <ArrowUp className="w-7 h-7" />
            </div>

            <div className="absolute bottom-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1d1b] text-sm font-black text-white shadow-md">
              N
            </div>
          </div>

          {curatorSessions.length > 0 && (
            <section className="mt-8 rounded-3xl bg-[#fffaf5] p-5 shadow-sm ring-1 ring-[#e8d5c2]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#db9964]">Koleksi Kurator</p>
                  <h3 className="text-base font-black text-[#2d1c15]">Sesi Tantangan Komunitas</h3>
                </div>
                <span className="rounded-full bg-[#f6d7ab] px-3 py-1 text-xs font-black text-[#482b1c]">
                  {curatorSessions.length} Sesi Aktif
                </span>
              </div>
              <div className="space-y-3">
                {curatorSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/belajar/${session.id}`}
                    className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8d5c2]/70 transition-all hover:scale-[1.01] hover:shadow-md"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#2d1c15]">{session.title}</h4>
                      <p className="mt-0.5 text-xs text-[#7d6b62]">
                        {session.subEthnic || "Budaya Kaili"} • {session.questions?.length || 0} tantangan • +{session.xpReward || 30} XP
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f29b5b] px-3.5 py-1.5 text-xs font-black text-white shadow-sm">
                      Mulai
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
