"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import PageTransition from "../components/PageTransition";

const immersiveRoutes = [
  "/dashboard/latihan",
  "/dashboard/culture-connection",
  "/dashboard/evaluasi",
  "/dashboard/selesai",
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isImmersive = immersiveRoutes.some((route) => pathname.startsWith(route));

  if (isImmersive) {
    return (
      <div className="min-h-screen bg-background text-on-surface antialiased pb-20 lg:pb-8">
        <PageTransition>{children}</PageTransition>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      <Sidebar />
      <div className="lg:pl-[260px] flex-1 flex flex-col pb-20 lg:pb-8">
        <PageTransition>{children}</PageTransition>
      </div>
      <BottomNav />
    </div>
  );
}
