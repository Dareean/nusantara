"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyLessonRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/latihan/1");
  }, [router]);

  return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Membuka sesi lesson...</div>;
}
