"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Home, MapPin, Zap } from "lucide-react";
import { getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "../dashboard/progress";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
}

export default function TopBar({
  title,
  subtitle,
  showBack = false,
  backHref = "/dashboard",
}: TopBarProps) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [userName, setUserName] = useState("Pelajar LARAS");

  useEffect(() => {
    let email = "";
    getSession().then(async (session) => {
      if (!session) return;
      email = session.email;
      setUserName(session.name);
      setProgress(await loadProgress(email));
    });
    const refresh = () => {
      if (email) setProgress(readProgress(email));
    };
    window.addEventListener("laras-progress-updated", refresh);
    return () => window.removeEventListener("laras-progress-updated", refresh);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-20 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBack ? (
            <Link
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </Link>
          ) : (
            <div className="flex shrink-0 items-center gap-10 lg:gap-3">
              <img
                alt="LARAS"
                className="h-8 w-auto object-contain sm:h-9"
                src="/logo/logo_laras.png"
              />
              <div className="hidden sm:flex sm:flex-col">
                <span className="text-headline-sm text-primary font-extrabold tracking-tight leading-none">
                  LARAS
                </span>
              </div>
            </div>
          )}

          
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-secondary-fixed px-2.5 py-1.5 rounded-full text-on-secondary-fixed font-bold text-label-md shadow-xs">
            <Zap className="text-secondary w-4 h-4 fill-current" />
            <span className="hidden min-[360px]:inline">{progress.xp} XP</span>
            <span className="min-[360px]:hidden">{progress.xp}</span>
          </div>

          <Link
            href="/dashboard/profil"
            className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-on-primary ring-2 ring-primary/20 sm:h-9 sm:w-9">
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <span className="hidden text-label-lg text-on-surface font-semibold xl:inline">
              {userName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
