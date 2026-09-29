"use client";

import Link from "next/link";
import TopBar from "../../components/TopBar";

type LessonStatus = "done" | "active" | "locked";

type Lesson = {
  id: number;
  icon: string;
  label: string;
  status: LessonStatus;
  href: string;
  left: number;
  top: number;
  size: number;
};

const lessons: Lesson[] = [
  { id: 1, icon: "menu_book", label: "Baca", status: "done", href: "/dashboard/latihan", left: 50, top: 12, size: 68 },
  { id: 2, icon: "headphones", label: "Dengar", status: "active", href: "/dashboard/latihan", left: 50, top: 32, size: 104 },
  { id: 3, icon: "translate", label: "Pahami", status: "locked", href: "/dashboard/latihan/busana", left: 50, top: 52, size: 82 },
  { id: 4, icon: "star", label: "Tantang", status: "locked", href: "/dashboard/culture-connection", left: 50, top: 68, size: 84 },
  { id: 5, icon: "book_4", label: "Rekap", status: "locked", href: "/dashboard/paspor", left: 50, top: 88, size: 82 },
];

export default function JalurBelajarPage() {
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
              const isDone = lesson.status === "done";
              const isActive = lesson.status === "active";
              const isLocked = lesson.status === "locked";

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
                    <span className="material-symbols-outlined text-[34px]" aria-hidden="true">
                      {lesson.icon}
                    </span>

                    {isActive && (
                      <span className="absolute inset-[-10px] rounded-full ring-4 ring-[#f29b5b]/20" />
                    )}
                  </Link>

                  {lesson.id === 3 && isLocked && (
                    <div
                      className="absolute flex items-center gap-1 rounded-full bg-[#fffaf5]/80 px-2.5 py-1 text-[10px] font-semibold text-[#5d3122] ring-1 ring-[#e7d7c8] shadow-sm"
                      style={{
                        left: "70%",
                        top: `${top + 12}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <span className="material-symbols-outlined text-[12px]">lock</span>
                      later
                    </div>
                  )}
                </div>
              );
            })}

            <div className="absolute bottom-4 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f29b5b] text-[#fffaf3] shadow-[0_12px_24px_-12px_rgba(242,155,91,0.9)]">
              <span className="material-symbols-outlined text-[32px]">keyboard_arrow_up</span>
            </div>

            <div className="absolute bottom-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1d1b] text-sm font-black text-white shadow-md">
              N
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
