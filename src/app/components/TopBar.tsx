"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
}

const navItems = [
  { href: "/dashboard/belajar", label: "Jalur Belajar" },
  { href: "/dashboard/arcade", label: "Arcade" },
  { href: "/dashboard/paspor", label: "Paspor" },
  { href: "/dashboard/profil", label: "Profil" },
];

export default function TopBar({
  title,
  subtitle,
  showBack = false,
  backHref = "/dashboard",
}: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-20 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBack ? (
            <Link
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface">
                arrow_back
              </span>
            </Link>
          ) : (
            <div className="flex shrink-0 items-center gap-2 lg:gap-3">
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

          <div className="hidden min-[980px]:flex items-center gap-1.5 rounded-full bg-surface-container-lowest p-1 ring-1 ring-outline-variant/30 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-label-md font-bold transition-colors ${
                    isActive
                      ? "bg-primary text-on-primary shadow-[0_2px_0_0_#881f00]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-on-primary px-3 py-1.5 text-label-md font-bold shadow-[0_2px_0_0_#881f00] transition-all hover:bg-primary-container"
            aria-label="Kembali ke Beranda"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span className="hidden sm:inline">Beranda</span>
          </Link>

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
              <span className="material-symbols-outlined text-primary text-[18px]">
                location_on
              </span>
              <span className="text-label-md text-on-surface">
                Sulawesi Tengah • Suku Kaili (Ledo)
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-secondary-fixed px-2.5 py-1.5 rounded-full text-on-secondary-fixed font-bold text-label-md shadow-xs">
            <span className="material-symbols-outlined text-secondary text-[18px] fill-current">
              bolt
            </span>
            <span className="hidden min-[360px]:inline">480 XP</span>
            <span className="min-[360px]:hidden">480</span>
          </div>

          <Link
            href="/dashboard/profil"
            className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity"
          >
            <img
              alt="Profile Rani"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20 sm:h-9 sm:w-9"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Vhf8Tpf1UP_r76LEL-9Olxy-KamrRKdvbuw_IdSOUdsPnutS-ucQSUNrUwCmvv79RwssCekEhlPat9dql81M0_w3TdFVqc0hENXtxegKWhP1UapZD9OlTcn4MiCZZPhuf7VNtyofbbQ8ByHlCDXGq8phTykzER2D0OKlgZrlUIKLycgNPOKpSjSCeQYrau-XCBnFjpIEDXwO8PKFKpjzvu77uKgmWMakGwQ2PeNYy_zuHKKvm8sSrmGaG3"
            />
            <span className="hidden text-label-lg text-on-surface font-semibold xl:inline">
              Rani M.
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
