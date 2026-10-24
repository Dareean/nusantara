"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, HelpCircle, Home, MapPin, Zap } from "lucide-react";
import { getCachedSessionSync, getSession } from "../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type UserProgress } from "../dashboard/progress";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  hasSidebar?: boolean;
}

export default function TopBar({
  title,
  subtitle,
  showBack = false,
  backHref = "/dashboard",
  hasSidebar = false,
}: TopBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/dashboard" || pathname === "/dashboard/";
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cached = getCachedSessionSync();
    let email = cached?.email || "";
    if (cached) {
      setUserName(cached.name);
      setAvatarUrl(cached.avatarUrl || "");
      setProgress(readProgress(cached.email));
      setIsLoaded(true);
    }

    getSession().then(async (session) => {
      if (!session) {
        setIsLoaded(true);
        return;
      }
      email = session.email;
      setUserName(session.name);
      setAvatarUrl(session.avatarUrl || "");
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
      const detail = (e as CustomEvent<{ name: string; avatarUrl?: string }>).detail;
      if (detail) {
        if (detail.name) setUserName(detail.name);
        if (detail.avatarUrl !== undefined) setAvatarUrl(detail.avatarUrl);
      }
    };
    window.addEventListener("laras-profile-updated", onProfileChanged);

    return () => {
      window.removeEventListener("laras-progress-updated", refresh);
      window.removeEventListener("laras-profile-updated", onProfileChanged);
    };
  }, []);

  const headerClasses = hasSidebar
    ? "fixed left-0 md:left-64 right-0 top-0 z-30 h-20 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    : "fixed inset-x-0 top-0 z-40 h-20 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]";

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBack ? (
            <Link
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </Link>
          ) : (
            <div className={`flex shrink-0 items-center gap-2 lg:gap-3 ${hasSidebar ? "md:hidden" : ""}`}>
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

          {!isHome && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-on-primary px-3 py-1.5 text-label-md font-bold shadow-[0_2px_0_0_#881f00] transition-all hover:bg-primary-container shrink-0"
              aria-label="Kembali ke Beranda"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
          )}

          {title ? (
            <div className="min-w-0 flex flex-col">
              <h1 className="truncate text-headline-sm text-on-surface font-bold leading-tight">
                {title}
              </h1>
              {subtitle && (
                <span className="hidden text-body-sm text-on-surface-variant sm:inline">
                  {subtitle}
                </span>
              )}
            </div>
          ) : (
            <div className="hidden min-[980px]:flex items-center gap-2 rounded-full bg-surface-container-lowest px-2 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ring-1 ring-outline-variant/30">
              <MapPin className="text-primary w-4 h-4" />
              <span className="text-label-md text-on-surface">
                Sulawesi Tengah • Suku Kaili (Ledo)
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("laras-start-tour"))}
            className="inline-flex items-center gap-1 bg-surface-container-high hover:bg-surface-container-highest px-2 sm:px-2.5 py-1.5 rounded-full text-on-surface font-bold text-label-md shadow-xs min-h-[32px] cursor-pointer transition text-xs"
            title="Buka Panduan Belajar"
          >
            <HelpCircle className="text-primary w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden min-[480px]:inline">Panduan</span>
          </button>

          <div suppressHydrationWarning className="flex items-center gap-1 bg-secondary-fixed px-2.5 py-1.5 rounded-full text-on-secondary-fixed font-bold text-label-md shadow-xs min-h-[32px]">
            <Zap className="text-secondary w-4 h-4 fill-current" />
            {isLoaded ? (
              <>
                <span className="hidden min-[360px]:inline">{progress.xp} XP</span>
                <span className="min-[360px]:hidden">{progress.xp}</span>
              </>
            ) : (
              <span className="inline-block w-8 h-3.5 rounded bg-secondary/30 animate-pulse" />
            )}
          </div>

          <Link
            suppressHydrationWarning
            href="/dashboard/profil"
            className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity"
          >
            {isLoaded && userName ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-on-primary ring-2 ring-primary/20 overflow-hidden sm:h-9 sm:w-9">
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
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-surface-container-high ring-2 ring-outline-variant/30 animate-pulse sm:h-9 sm:w-9" />
            )}
            {isLoaded && userName ? (
              <span className="hidden text-label-lg text-on-surface font-semibold xl:inline">
                {userName}
              </span>
            ) : (
              <span className="hidden w-20 h-4 rounded bg-surface-container-high animate-pulse xl:inline" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
