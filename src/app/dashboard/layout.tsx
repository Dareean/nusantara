"use client";

import { usePathname } from "next/navigation";
import BottomNav from "../components/BottomNav";
import DuolingoSidebar from "../components/DuolingoSidebar";
import PageTransition from "../components/PageTransition";
import TopBar from "../components/TopBar";

const immersiveRoutes = [
  "/dashboard/latihan",
  "/dashboard/culture-connection",
  "/dashboard/evaluasi",
  "/dashboard/selesai",
];

function getRouteHeader(pathname: string): { title: string; subtitle: string } {
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return { title: "Beranda", subtitle: "Jalur belajarmu hari ini" };
  }
  if (pathname.startsWith("/dashboard/belajar")) {
    return { title: "Jalur Belajar", subtitle: "Misi budaya yang siap kamu jalani" };
  }
  if (pathname.startsWith("/dashboard/arcade")) {
    return { title: "Arcade", subtitle: "Tantangan Kilat Pusaka Kaili" };
  }
  if (pathname.startsWith("/dashboard/paspor")) {
    return { title: "Paspor", subtitle: "Prestasi belajar dan progress budaya" };
  }
  if (pathname.startsWith("/dashboard/profil")) {
    return { title: "Profile", subtitle: "Jalur belajar dan achievement" };
  }
  if (pathname.startsWith("/dashboard/pengaturan")) {
    return { title: "Pengaturan", subtitle: "Atur pengalaman belajar kamu" };
  }
  return { title: "Beranda", subtitle: "Jalur belajarmu hari ini" };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLessonPlayer =
    pathname.startsWith("/dashboard/belajar/") && pathname !== "/dashboard/belajar";

  if (isLessonPlayer) {
    return <div className="min-h-screen bg-background text-on-surface antialiased">{children}</div>;
  }

  const isImmersive = immersiveRoutes.some((route) => pathname.startsWith(route));

  if (isImmersive) {
    return (
      <div className="min-h-screen bg-background text-on-surface antialiased pb-20 lg:pb-8">
        <PageTransition>{children}</PageTransition>
        <BottomNav />
      </div>
    );
  }

  const headerInfo = getRouteHeader(pathname);

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* Desktop Fixed Left Sidebar */}
      <DuolingoSidebar />

      {/* Unified TopBar for non-immersive dashboard routes */}
      <TopBar
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        hasSidebar={true}
      />

      {/* Main Content Area indented for desktop sidebar & topbar */}
      <div className="md:pl-64 min-h-screen pt-20 pb-20 md:pb-8">
        <PageTransition>{children}</PageTransition>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
