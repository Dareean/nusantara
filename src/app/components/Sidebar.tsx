"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Gamepad2,
  Sparkles,
  BookOpen,
  User,
  Flame,
  ChevronsUpDown,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", Icon: Home, label: "Beranda" },
  { path: "/dashboard/belajar", Icon: Compass, label: "Jalur Belajar" },
  { path: "/dashboard/arcade", Icon: Gamepad2, label: "Arcade Budaya" },
  {
    path: "/dashboard/culture-connection",
    Icon: Sparkles,
    label: "Scenario Studio",
  },
  { path: "/dashboard/paspor", Icon: BookOpen, label: "Paspor Budaya" },
  { path: "/dashboard/profil", Icon: User, label: "Profil & Pengaturan" },
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
            <span className="text-headline-md text-primary tracking-tight font-black">
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
            const { Icon } = item;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-black shadow-[0_4px_0_0_#881f00]"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-bold"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-label-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col gap-2">
        <div className="bg-surface-container p-3 rounded-2xl flex items-center gap-3">
          <Flame className="w-7 h-7 text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface font-black">
              6 Hari Berturut-turut
            </span>
            <span className="text-body-sm text-on-surface-variant">
              Keep the flame burning!
            </span>
          </div>
        </div>
        <div className="bg-surface-container-low p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-tertiary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant">
                Fokus Wilayah
              </span>
              <span className="text-label-md text-on-surface font-bold">
                Sulawesi Tengah (Kaili)
              </span>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-on-surface-variant" />
        </div>

        <Link
          href="/admin"
          className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all group font-bold"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="text-label-sm">Panel Kurator CMS</span>
          </div>
          <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
