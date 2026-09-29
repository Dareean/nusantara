"use client";

import Link from "next/link";

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
  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[260px] h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center gap-2 justify-between px-3 sm:px-4 lg:px-6 overflow-hidden">
      {/* Left section: mobile brand/back or desktop location tag */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {showBack ? (
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px]">
              arrow_back
            </span>
          </Link>
        ) : (
          <div className="lg:hidden flex shrink-0 items-center gap-2">
            <img
              alt="LARAS"
              className="h-7 w-auto object-contain"
              src="/logo/logo_laras.png"
            />
            <span className="text-headline-sm text-primary font-extrabold tracking-tight">
              LARAS
            </span>
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold uppercase tracking-wider">
              Kaili (Ledo)
            </span>
          </div>
        )}

        {title ? (
          <div className="min-w-0 flex flex-col">
            <h1 className="truncate text-headline-sm text-on-surface font-bold leading-tight">
              {title}
            </h1>
            {subtitle && (
              <span className="text-body-sm text-on-surface-variant hidden sm:inline">
                {subtitle}
              </span>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 bg-surface-container-lowest px-4 py-1.5 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.04)] cursor-pointer hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-primary text-[18px]">
              location_on
            </span>
            <span className="text-label-md text-on-surface">
              Sulawesi Tengah • Suku Kaili (Ledo)
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              arrow_drop_down
            </span>
          </div>
        )}
      </div>

      {/* Right section: gamification badges & user profile */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Streak */}
        <div className="hidden min-[360px]:flex items-center gap-1 bg-primary-fixed px-2.5 py-1 rounded-full text-on-primary-fixed font-bold text-label-md shadow-xs">
          <span className="material-symbols-outlined text-primary text-[18px] fill-current">
            local_fire_department
          </span>
          <span>6</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1 bg-secondary-fixed px-2.5 py-1 rounded-full text-on-secondary-fixed font-bold text-label-md shadow-xs">
          <span className="material-symbols-outlined text-secondary text-[18px] fill-current">
            bolt
          </span>
          <span className="hidden min-[360px]:inline">480 XP</span>
          <span className="min-[360px]:hidden">480</span>
        </div>

        {/* Level (Desktop only) */}
        <div className="hidden md:flex items-center gap-1 bg-tertiary-fixed px-3 py-1 rounded-full text-on-tertiary-fixed font-bold text-label-md shadow-xs">
          <span className="material-symbols-outlined text-tertiary text-[18px] fill-current">
            military_tech
          </span>
          <span>Lv. 3 Penjelajah</span>
        </div>

        {/* User profile */}
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity"
        >
          <img
            alt="Profile Rani"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Vhf8Tpf1UP_r76LEL-9Olxy-KamrRKdvbuw_IdSOUdsPnutS-ucQSUNrUwCmvv79RwssCekEhlPat9dql81M0_w3TdFVqc0hENXtxegKWhP1UapZD9OlTcn4MiCZZPhuf7VNtyofbbQ8ByHlCDXGq8phTykzER2D0OKlgZrlUIKLycgNPOKpSjSCeQYrau-XCBnFjpIEDXwO8PKFKpjzvu77uKgmWMakGwQ2PeNYy_zuHKKvm8sSrmGaG3"
          />
          <span className="text-label-lg text-on-surface font-semibold hidden xl:inline">
            Rani M.
          </span>
        </Link>
      </div>
    </header>
  );
}
