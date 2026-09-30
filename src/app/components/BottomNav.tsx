"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Gamepad2, Trophy, User } from "lucide-react";

const navItems = [
  { path: "/dashboard", Icon: Compass, label: "Belajar" },
  { path: "/dashboard/arcade", Icon: Gamepad2, label: "Arcade" },
  { path: "/dashboard/paspor", Icon: Trophy, label: "Paspor" },
  { path: "/dashboard/profil", Icon: User, label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t-2 border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden">
      <div className="max-w-[480px] mx-auto h-16 px-2 flex items-center justify-around">
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
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
                isActive
                  ? "text-primary font-black scale-105"
                  : "text-on-surface-variant hover:text-on-surface font-bold"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[11px] uppercase tracking-wider mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
