"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Gamepad2,
  Trophy,
  User,
  Settings,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { getSession } from "../auth/authClient";

const navItems = [
  { path: "/dashboard", Icon: Compass, label: "Belajar" },
  { path: "/dashboard/arcade", Icon: Gamepad2, label: "Arcade" },
  { path: "/dashboard/paspor", Icon: Trophy, label: "Paspor" },
  { path: "/dashboard/profil", Icon: User, label: "Profil" },
];

export default function DuolingoSidebar() {
  const pathname = usePathname();
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    getSession().then((sess) => {
      if (sess) setSession(sess);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Gagal logout:", err);
    }
    window.location.href = "/auth";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r-2 border-outline-variant/30 z-40 hidden md:flex flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2 group">
          <img
            alt="LARAS"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            src="/logo/logo_laras.png"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-primary leading-none">
              LARAS
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary mt-1">
              NUSANTARA
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
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
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary-fixed text-primary border-2 border-primary/40 shadow-[0_3px_0_0_#ca4a28]"
                    : "text-on-surface-variant hover:bg-surface-container border-2 border-transparent"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-on-surface-variant"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom utility & User Area */}
      <div className="flex flex-col gap-2 pt-4 border-t-2 border-outline-variant/20">
        <Link
          href="/dashboard/pengaturan"
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-on-surface-variant hover:bg-surface-container font-extrabold text-sm uppercase tracking-wider transition-all"
        >
          <Settings className="w-5 h-5" />
          <span>Pengaturan</span>
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2 rounded-2xl text-xs font-bold text-outline hover:text-on-surface transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-primary" />
          <span>Panel Kurator</span>
        </Link>

        {/* Logo Resmi Munas IX & Permikomnas */}
        <div className="mt-1 p-2 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white shrink-0 shadow-xs">
            <img
              src="/logo-munas-ix.png"
              alt="Logo Munas IX PERMIKOMNAS"
              className="h-7 w-7 object-contain"
            />
            <img
              src="/logo-permikomnas.png"
              alt="Logo Permikomnas RI"
              className="h-7 w-7 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black leading-tight text-on-surface truncate">
              Munas IX
            </span>
            <span className="text-[9px] font-extrabold text-on-surface-variant truncate">
              PERMIKOMNAS RI
            </span>
          </div>
        </div>

        {session && (
          <div className="mt-2 pt-2 border-t border-outline-variant/30 flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-low">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-on-primary">
                {session.name ? session.name.slice(0, 1).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-on-surface truncate">{session.name}</span>
                <span className="text-[10px] text-on-surface-variant truncate">{session.email}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-error hover:bg-error-container/30 transition-all cursor-pointer uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4 text-error" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
