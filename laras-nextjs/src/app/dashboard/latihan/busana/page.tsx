"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Hotspot {
  id: number;
  name: string;
  tag: string;
  title: string;
  description: string;
  icon: string;
  top: string;
  left: string;
}

const hotspots: Hotspot[] = [
  {
    id: 1,
    name: "1. Sampa (Dada)",
    tag: "FILOSOFI & KEAGUNGAN",
    title: "Sampa (Kalung Dada Bertingkat)",
    description:
      "Melambangkan kehormatan, keagungan akhlak, serta status sosial terpandang bagi wanita Suku Kaili dalam tatanan adat.",
    icon: "verified",
    top: "28%",
    left: "48%",
  },
  {
    id: 2,
    name: "2. Baju Nggembe (Blus)",
    tag: "SILUET & KESOPANAN",
    title: "Baju Nggembe (Potongan Segi Empat)",
    description:
      "Busana bersiluet longgar berlengan pendek hingga siku, melambangkan keanggunan dan kesopanan gerak-gerik putri Kaili.",
    icon: "checkroom",
    top: "44%",
    left: "24%",
  },
  {
    id: 3,
    name: "3. Sarung Donggala (Buya)",
    tag: "WARISAN TENUN",
    title: "Buya Sabe (Sarung Sutra Donggala)",
    description:
      "Kain tenun sutra Donggala bermotif Subolang atau Bomba, ditenun dengan benang emas asli lambang kemakmuran pesisir.",
    icon: "palette",
    top: "78%",
    left: "64%",
  },
];

export default function LatihanBusanaPage() {
  const router = useRouter();
  const [activeHotspotId, setActiveHotspotId] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-4 lg:px-8">
        <Link
          href="/dashboard/belajar"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="flex items-center justify-between text-label-sm text-on-surface-variant mb-1 font-semibold">
            <span>TANTANGAN BUSANA ADAT</span>
            <span className="text-primary font-bold">50% Selesai</span>
          </div>
          <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-full shadow-xs">
          <span className="material-symbols-outlined text-primary text-[18px] fill-current">
            favorite
          </span>
          <span className="material-symbols-outlined text-primary text-[18px] fill-current">
            favorite
          </span>
          <span className="material-symbols-outlined text-primary text-[18px] fill-current">
            favorite
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main className="pt-20 pb-12 w-full max-w-3xl mx-auto px-4">
        {/* Title */}
        <div className="mt-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
            <span className="material-symbols-outlined text-[16px]">
              apparel
            </span>
            <span>BUSANA ADAT • ANATOMI &amp; MAKNA</span>
          </div>
          <h1 className="text-headline-lg text-on-surface mt-2 font-extrabold tracking-tight">
            Kenali Bagian Busana Adat Kaili: Baju Nggembe
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Ketuk pin berdenyut pada busana untuk membaca makna filosofis setiap
            ornamen tenun.
          </p>
        </div>

        {/* Interactive Garment Visual */}
        <div className="mt-4">
          <div className="relative w-full rounded-3xl bg-surface-container-lowest shadow-md overflow-hidden p-3 border border-outline-variant/30">
            <div className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-surface-container-low flex items-center justify-center">
              <img
                className="w-full h-full object-cover object-top"
                alt="Baju Nggembe Tradisional"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmz5eB8HvynR7w5GcrUZU26XUnNN45q_UDe8_VJfaAgUL2Cw3WaORXxTvfEeDQI2bQK21L37uGMWgKx7dKkp26JOXL12lBXjQF93VnjL3Vv4YRGSVOL__1nRgDw9_acA4pmlD1kN0D6WxXzgvJR5Q1t7jZIO8GjaOW4v3sZkshEhK7jyoOXQ5uJoSYQ5d0JFdfKPNlZKp-JNkdL66_opFKUrSJ2ecf_Jm8-eP1TXdXdhspZiy6Z6PHvQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent pointer-events-none"></div>

              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs">
                <span className="text-label-sm text-on-surface font-bold tracking-wider">
                  BUSANA WANITA KAILI
                </span>
              </div>

              {/* Hotspots */}
              {hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  style={{ top: spot.top, left: spot.left }}
                >
                  <button
                    onClick={() => setActiveHotspotId(spot.id)}
                    className={`relative flex items-center justify-center rounded-full shadow-lg transition-transform active:scale-90 cursor-pointer ${
                      activeHotspotId === spot.id
                        ? "w-9 h-9 bg-primary text-on-primary ring-4 ring-primary-fixed"
                        : "w-7 h-7 bg-secondary text-on-secondary hover:scale-110"
                    }`}
                  >
                    {activeHotspotId === spot.id && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping"></span>
                    )}
                    <span className="material-symbols-outlined text-[16px]">
                      {activeHotspotId === spot.id ? "flare" : "touch_app"}
                    </span>
                  </button>
                </div>
              ))}

              {/* Lore Card for Active Hotspot */}
              <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-outline-variant/30 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">
                      {activeHotspot.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-title-md text-on-surface font-bold truncate">
                        {activeHotspot.title}
                      </h4>
                      <span className="text-label-sm text-primary font-bold">
                        {activeHotspot.tag}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {activeHotspot.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Anatomy Selector Pills */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspotId(spot.id)}
                  className={`px-4 py-2 rounded-full text-label-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeHotspotId === spot.id
                      ? "bg-primary text-on-primary shadow-xs"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {spot.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Quiz Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              help_center
            </span>
            <h3 className="text-headline-sm text-on-surface font-bold">
              Uji Pemahaman Singkat
            </h3>
          </div>
          <p className="text-body-md text-on-surface mb-4">
            Pada momentum atau acara apakah Baju Nggembe warna merah bata ini
            lazim dikenakan oleh putri Kaili?
          </p>

          <div className="flex flex-col gap-3">
            {/* Option 1 */}
            <button
              onClick={() => setSelectedAnswer(1)}
              className={`w-full text-left p-4 rounded-2xl shadow-xs flex items-center justify-between transition-all cursor-pointer border ${
                selectedAnswer === 1
                  ? "bg-primary-fixed/40 border-primary ring-2 ring-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    selectedAnswer === 1
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {selectedAnswer === 1 ? (
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  ) : (
                    "A"
                  )}
                </div>
                <span className="text-title-md text-on-surface font-bold truncate">
                  Upacara Adat Pernikahan &amp; Pesta Adat
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">
                {selectedAnswer === 1
                  ? "radio_button_checked"
                  : "radio_button_unchecked"}
              </span>
            </button>

            {/* Option 2 */}
            <button
              onClick={() => setSelectedAnswer(2)}
              className={`w-full text-left p-4 rounded-2xl shadow-xs flex items-center justify-between transition-all cursor-pointer border ${
                selectedAnswer === 2
                  ? "bg-primary-fixed/40 border-primary ring-2 ring-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                  B
                </div>
                <span className="text-body-md text-on-surface truncate">
                  Pakaian Kerja Sehari-hari di Ladang
                </span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px]">
                {selectedAnswer === 2
                  ? "radio_button_checked"
                  : "radio_button_unchecked"}
              </span>
            </button>

            {/* Option 3 */}
            <button
              onClick={() => setSelectedAnswer(3)}
              className={`w-full text-left p-4 rounded-2xl shadow-xs flex items-center justify-between transition-all cursor-pointer border ${
                selectedAnswer === 3
                  ? "bg-primary-fixed/40 border-primary ring-2 ring-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                  C
                </div>
                <span className="text-body-md text-on-surface truncate">
                  Upacara Duka Cita &amp; Masa Berkabung
                </span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px]">
                {selectedAnswer === 3
                  ? "radio_button_checked"
                  : "radio_button_unchecked"}
              </span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push("/dashboard/evaluasi")}
            className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-base"
          >
            <span>Kirim Jawaban &amp; Buka Penjelasan</span>
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
