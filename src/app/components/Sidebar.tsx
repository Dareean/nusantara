"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/dashboard", icon: "home", label: "Beranda" },
  { path: "/dashboard/belajar", icon: "route", label: "Jalur Belajar" },
  { path: "/dashboard/arcade", icon: "sports_esports", label: "Arcade Budaya" },
  {
    path: "/dashboard/culture-connection",
    icon: "theater_comedy",
    label: "Scenario Studio",
  },
  { path: "/dashboard/paspor", icon: "menu_book", label: "Paspor Budaya" },
  { path: "/dashboard/profil", icon: "account_circle", label: "Profil & Pengaturan" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 hidden lg:flex flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-start gap-2 group">
          <img
            alt="LARAS Brand"
            className="h-9 w-auto object-contain"
            src="/logo/logo_laras.png"
          />
          <div className="flex flex-col">
            <span className="text-headline-md text-primary tracking-tight">
              LARAS
            </span>
            <span className="text-label-sm text-secondary uppercase font-bold tracking-wider">
              NUSANTARA — Before It&apos;s Gone
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_4px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {item.icon}
                </span>
                <span className="text-label-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col gap-2">
        <div className="bg-surface-container p-2 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-headline-sm">
            local_fire_department
          </span>
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface font-bold">
              6 Hari Berturut-turut
            </span>
            <span className="text-body-sm text-on-surface-variant">
              Keep the flame burning!
            </span>
          </div>
        </div>
        <div className="bg-surface-container-low p-2 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-tertiary text-[16px]">
              explore
            </span>
            <div className="flex flex-col">
              <span className="text-label-sm text-on-surface-variant">
                Fokus Wilayah
              </span>
              <span className="text-label-md text-on-surface font-bold">
                Sulawesi Tengah (Kaili)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-body-md">
            unfold_more
          </span>
        </div>

        <Link
          href="/admin"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              admin_panel_settings
            </span>
            <span className="text-label-sm font-bold">Panel Kurator CMS</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>
    </aside>
  );
}
