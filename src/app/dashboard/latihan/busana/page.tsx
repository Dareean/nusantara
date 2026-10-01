"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Heart,
  Shirt,
  Sparkles,
  Check,
  CheckCircle2,
  ArrowRight,
  Palette,
  Eye,
} from "lucide-react";
import { useEffect } from "react";
import { getSession } from "../../../auth/authClient";
import { recordLessonResult } from "../../progress";

const hotspots = [
  {
    id: 1,
    name: "Kerah Persegi Dada",
    title: "Leher Lebar Persegi (Pola Berongga)",
    description:
      "Didesain lebar tanpa kancing kerah untuk kenyamanan iklim tropis Lembah Palu, sekaligus memudahkan pemakaian kalung bertingkat (Taiganja).",
    tag: "Ornamen Atas",
    Icon: Sparkles,
    top: "22%",
    left: "50%",
  },
  {
    id: 2,
    name: "Lengan Menggantung",
    title: "Lengan Melebar Beruntai Benang Emas",
    description:
      "Ujung lengan yang tidak dijahit rapat melambangkan keterbukaan budi pekerti perempuan Kaili dalam menerima tamu adat dan kekerabatan.",
    tag: "Etika & Gerak",
    Icon: Palette,
    top: "38%",
    left: "26%",
  },
  {
    id: 3,
    name: "Tenun Donggala Buya Sabe",
    title: "Sarung Tenun Buya Sabe Corak Subolang",
    description:
      "Ditenun berbulan-bulan oleh penenun Donggala menggunakan benang sutra berpewarna alami, mencerminkan martabat tinggi sang pemakai.",
    tag: "Tekstil Utama",
    Icon: Eye,
    top: "70%",
    left: "64%",
  },
];

export default function LatihanBusanaPage() {
  const router = useRouter();
  const [activeHotspotId, setActiveHotspotId] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];
  const ActiveIcon = activeHotspot.Icon;

  useEffect(() => {
    getSession().then((session) => {
      setSessionEmail(session?.email ?? "");
      setSessionReady(true);
    });
  }, []);

  const handleContinue = () => {
    if (!selectedAnswer) return;
    if (!hasCheckedAnswer) {
      setHasCheckedAnswer(true);
      return;
    }
    if (sessionEmail) {
      recordLessonResult(sessionEmail, {
        lessonId: 3,
        answered: String(selectedAnswer),
        correct: selectedAnswer === 1,
        score: selectedAnswer === 1 ? 100 : 40,
        xp: 20,
        completedAt: new Date().toISOString(),
      });
    }
    router.push("/dashboard/evaluasi");
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-4 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
        >
          <X className="w-6 h-6" />
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
          <Heart className="w-4 h-4 text-primary fill-current" />
          <Heart className="w-4 h-4 text-primary fill-current" />
          <Heart className="w-4 h-4 text-primary fill-current" />
        </div>
      </header>

      {/* Main Body */}
      <main className="pt-20 pb-12 w-full max-w-3xl mx-auto px-4">
        {/* Title */}
        <div className="mt-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold">
            <Shirt className="w-4 h-4" />
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
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Lore Card for Active Hotspot */}
              <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-outline-variant/30 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0 mt-0.5">
                    <ActiveIcon className="w-5 h-5" />
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

        {/* Cultural Choice Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-secondary w-5 h-5" />
            <h3 className="text-headline-sm text-on-surface font-bold">
              Pilih Busana untuk Momen Ini
            </h3>
          </div>
          <p className="text-body-md text-on-surface mb-4">
            Kamu akan menghadiri pernikahan adat. Setelah menemukan tiga detail
            busana, tindakan apa yang paling menghormati momen ini?
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSelectedAnswer(1); setHasCheckedAnswer(false); }}
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
                  {selectedAnswer === 1 ? <Check className="w-4 h-4" /> : "*"}
                </div>
                <span className="text-title-md text-on-surface font-bold truncate">
                  Memakai Baju Nggembe merah bata dengan Buya Sabe
                </span>
              </div>
              {selectedAnswer === 1 && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>

            <button
              onClick={() => { setSelectedAnswer(2); setHasCheckedAnswer(false); }}
              className={`w-full text-left p-4 rounded-2xl shadow-xs flex items-center justify-between transition-all cursor-pointer border ${
                selectedAnswer === 2
                  ? "bg-primary-fixed/40 border-primary ring-2 ring-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                  o
                </div>
                <span className="text-body-md text-on-surface truncate">
                  Memilih pakaian kerja agar lebih praktis bergerak
                </span>
              </div>
              {selectedAnswer === 2 && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>

            <button
              onClick={() => { setSelectedAnswer(3); setHasCheckedAnswer(false); }}
              className={`w-full text-left p-4 rounded-2xl shadow-xs flex items-center justify-between transition-all cursor-pointer border ${
                selectedAnswer === 3
                  ? "bg-primary-fixed/40 border-primary ring-2 ring-primary"
                  : "bg-surface-container-low hover:bg-surface-container border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                  o
                </div>
                <span className="text-body-md text-on-surface truncate">
                  Memilih aksesori paling mencolok agar menjadi pusat perhatian
                </span>
              </div>
              {selectedAnswer === 3 && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>
          </div>

          {hasCheckedAnswer && selectedAnswer > 0 && (
            <div className={`mt-4 rounded-2xl p-4 border ${selectedAnswer === 1 ? "bg-primary-fixed/30 border-primary/30" : "bg-secondary-fixed/30 border-secondary/30"}`}>
              <p className="text-body-md text-on-surface font-semibold">
                {selectedAnswer === 1
                  ? "Pilihanmu selaras dengan suasana pernikahan adat: resmi, beradab, dan tidak mengalahkan pusat perhatian acara."
                  : "Pilihan ini belum paling selaras dengan konteks pernikahan. Perhatikan acara, peran tamu, dan keseimbangan tampilan."}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedAnswer || !sessionReady}
            className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-base"
          >
            <span>{hasCheckedAnswer ? "Simpan Temuan &amp; Lanjutkan" : "Lakukan Pilihan"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
