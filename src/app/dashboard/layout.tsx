"use client";

import { usePathname } from "next/navigation";
import BottomNav from "../components/BottomNav";
import DuolingoSidebar from "../components/DuolingoSidebar";
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
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* Desktop Fixed Left Sidebar */}
      <DuolingoSidebar />

      {/* Main Content Area indented for desktop sidebar */}
      <div className="md:pl-64 min-h-screen pb-20 md:pb-8">
        <PageTransition>{children}</PageTransition>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
