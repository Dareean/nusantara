"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Heart,
  ArrowLeft,
  MapPin,
  Flame,
  BadgeCheck,
  Volume2,
  AudioWaveform,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { getSession } from "../../auth/authClient";
import { recordLessonResult } from "../progress";

const missionSteps = [
  {
    label: "Tiba di Souraja",
    prompt: "Kamu tiba di beranda saat tetua sedang berbicara. Apa langkahmu?",
    hint: "Tujuanmu: masuk dengan hormat tanpa memotong percakapan.",
    choices: [
      { id: "wait", label: "Menunggu di sisi tangga", detail: "Memberi ruang sebelum menyapa.", score: 1 },
      { id: "tabe", label: "Mengucapkan Tabe sambil menunduk", detail: "Meminta izin dengan sikap merendah.", score: 2 },
      { id: "enter", label: "Langsung naik ke tangga", detail: "Masuk tanpa membuka sapaan.", score: 0 },
    ],
  },
  {
    label: "Sapa tetua",
    prompt: "Tetua menoleh dan memberi perhatian. Bagaimana kamu membuka percakapan?",
    hint: "Pilih sapaan yang menjaga jarak hormat dan niat baik.",
    choices: [
      { id: "formal", label: "Tabe pue, nalompa mai kami", detail: "Sapaan hormat untuk meminta izin hadir.", score: 2 },
      { id: "casual", label: "Halo, kami datang", detail: "Ramah, tetapi terlalu umum untuk konteks ini.", score: 1 },
      { id: "quiet", label: "Diam dan langsung duduk", detail: "Niatmu belum terbaca oleh tuan rumah.", score: 0 },
    ],
  },
  {
    label: "Jaga gesture",
    prompt: "Kamu dipersilakan mendekat. Gesture apa yang kamu gunakan?",
    hint: "Hormati ruang dan orang yang dituakan dengan gerak yang tenang.",
    choices: [
      { id: "lower", label: "Menunduk ringan dengan tangan kanan merendah", detail: "Gesture tenang yang melengkapi kata Tabe.", score: 2 },
      { id: "wave", label: "Melambaikan tangan dari jauh", detail: "Cocok untuk teman sebaya, bukan momen ini.", score: 0 },
      { id: "bow", label: "Membungkuk terlalu dalam", detail: "Niat hormat ada, tetapi gesture terasa berlebihan.", score: 1 },
    ],
  },
];

export default function LatihanPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [missionStep, setMissionStep] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [sessionEmail, setSessionEmail] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleAudioPlay = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1800);
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    const choice = missionSteps[missionStep].choices.find((item) => item.id === selectedOption);
    if (!choice) return;
    const lessonId = new URLSearchParams(window.location.search).get("lesson") === "2" ? 2 : 1;
    const nextReputation = reputation + choice.score;

    if (missionStep < missionSteps.length - 1) {
      setReputation(nextReputation);
      setMissionStep((current) => current + 1);
      setSelectedOption("");
      setHasCheckedAnswer(false);
      return;
    }

    const correct = nextReputation >= 5;
    if (sessionEmail) {
      recordLessonResult(sessionEmail, {
        answered: selectedOption,
        lessonId: lessonId === 2 ? 2 : 1,
        correct,
        score: nextReputation * 20,
        xp: 20,
        completedAt: new Date().toISOString(),
      });
    }
    router.push("/dashboard/evaluasi");
  };

  const currentStep = missionSteps[missionStep];
  const selectedChoice = currentStep.choices.find((choice) => choice.id === selectedOption);

  useEffect(() => {
    getSession().then((session) => {
      setSessionEmail(session?.email ?? "");
      setSessionReady(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased font-sans">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-4 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
        >
          <X className="w-6 h-6" />
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        {/* Lives / Hearts */}
        <div className="flex items-center gap-1 bg-error-container/40 px-3.5 py-1 rounded-full border border-error/20">
          <Heart className="w-5 h-5 text-error fill-current" />
          <span className="text-label-lg text-error font-bold">3/3</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-10 flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-5xl mx-auto bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[640px] relative border border-outline-variant/30">
          {/* Sub Header */}
          <div className="px-6 py-3.5 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-label-md uppercase tracking-wider font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Keluar Latihan</span>
              </Link>
              <div className="h-4 w-px bg-outline-variant"></div>
              <div className="flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-label-sm font-bold">
                <MapPin className="w-4 h-4" />
                <span>Bahasa Kaili Ledo • Lembah Palu</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-surface-container-highest px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-primary" />
                <span className="text-label-md text-on-surface font-bold">
                  Misi {missionStep + 1}/{missionSteps.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-label-sm text-on-surface-variant uppercase font-medium">
                  Reputasi Adab: {reputation}/6
                </span>
                <span className="text-label-sm text-primary font-bold">
                  {reputation >= 5 ? "Harmonis" : "Jelajahi"}
                </span>
              </div>
            </div>
          </div>

          {/* Grid: Context & Question */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
            {/* Left Context Column */}
            <div className="lg:col-span-5 p-6 lg:p-8 bg-surface-container-low/40 flex flex-col justify-between relative overflow-hidden border-r border-surface-container">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-label-sm font-bold">
                    <BadgeCheck className="w-4 h-4" />
                    Etika &amp; Tata Krama
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Kategori: Adat Ledo
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-xs flex flex-col gap-3 border border-outline-variant/20">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-display-lg font-black text-primary tracking-tight">
                        Tabe
                      </span>
                      <span className="ml-2 text-headline-sm text-on-surface-variant font-normal">
                        [ta-be]
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAudioPlay}
                      className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      {isPlayingAudio ? (
                        <AudioWaveform className="w-6 h-6 animate-pulse" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  <div className="mt-1">
                    <div className="flex items-center justify-between text-on-surface-variant text-label-sm mb-1.5 font-medium">
                      <span>Pelafalan Asli Penutur Lokal</span>
                      <span className="text-primary font-bold">0:04</span>
                    </div>
                    <div className="flex items-center gap-1.5 h-6 px-3 rounded-lg bg-surface-container">
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-5 float-lift" : "h-3"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6" : "h-4"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-3" : "h-2"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6 float-lift" : "h-5"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-4" : "h-3"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-6" : "h-6"}`}></span>
                      <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-5" : "h-4"}`}></span>
                      <span className="w-1 h-3 rounded-full bg-outline-variant"></span>
                      <span className="w-1 h-5 rounded-full bg-outline-variant"></span>
                      <span className="w-1 h-2 rounded-full bg-outline-variant"></span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2 italic">
                      Penutur: Kak Rusdi (38 thn), Palu Barat
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Evidence */}
              <div className="mt-6 relative z-10">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-xs">
                  <img
                    className="w-full h-full object-cover"
                    alt="Gestur Tabe Kaili"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7N2RFcBe-VYBGKMVs4RI4fFK_WSAUDavo27MijrqUn0YQFka80Yn6NkLi6NvGUbK_bJsS8bxcs28vXZzzSYuCH3Ml0J8fP_QUR9cO8O6P4uj6LPVZiMDbqT-WEq9WNuQpc2RkTZjx2GyyDWs9peP4G71dL_BEyEljdiyuWO1T87OOfAPwt55ywofq5wU-uIHzArEIeZvJHOo2j8vTDtd7ZuvboUHGas1ryZWxBpc6twFUkXuBoN1i4Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex items-end p-4">
                    <p className="text-body-sm text-inverse-on-surface leading-tight">
                      Sikap tubuh merunduk dengan tangan kanan terentang ke bawah
                      saat melintas di hadapan tetua.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mission Column */}
            <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-label-md uppercase tracking-wider font-bold">
                      Misi Budaya
                    </span>
                  </div>
                  <span className="text-label-sm font-black uppercase tracking-wider text-on-surface-variant">
                    {currentStep.label}
                  </span>
                </div>

                <h2 className="text-headline-lg text-on-surface tracking-tight font-extrabold leading-snug">
                  Bertamu ke <span className="text-primary italic">Souraja</span>
                </h2>
                <p className="text-body-lg text-on-surface mt-3 mb-2 leading-relaxed">
                  {currentStep.prompt}
                </p>
                <p className="text-body-sm text-on-surface-variant mb-6 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-secondary shrink-0" />
                  {currentStep.hint}
                </p>

                {/* Action choices */}
                <div className="space-y-3">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => {
                        setSelectedOption(choice.id);
                        setHasCheckedAnswer(false);
                      }}
                      className={`w-full text-left cursor-pointer p-4 rounded-2xl transition-all flex items-start gap-4 border ${
                        selectedOption === choice.id
                          ? "bg-primary-fixed/20 border-primary ring-2 ring-primary shadow-xs"
                          : "bg-surface-container-low hover:bg-surface-container border-transparent"
                      }`}
                    >
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${selectedOption === choice.id ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                        {selectedOption === choice.id ? <CheckCircle2 className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="text-title-md text-on-surface font-bold block mb-1">{choice.label}</span>
                        <span className="text-body-md text-on-surface-variant">{choice.detail}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-surface-container p-4 border border-outline-variant/20">
                <div className="flex items-center justify-between text-label-sm font-bold text-on-surface-variant">
                  <span>Reputasi Adab</span>
                  <span className="text-primary">{reputation}/6</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min((reputation / 6) * 100, 100)}%` }} />
                </div>
                {hasCheckedAnswer && selectedChoice && (
                  <p className="mt-3 flex items-start gap-2 text-body-sm text-on-surface-variant">
                    <MessageCircle className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                    {selectedChoice.detail} Reaksi lingkungan akan mengikuti pilihanmu.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Evaluation Banner Drawer */}
          <div className="p-5 lg:p-6 bg-surface-container-lowest shadow-[0_-8px_24px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-4 z-20 border-t border-surface-container">
            <div className="flex items-start gap-3 flex-1">
              <div className={`w-12 h-12 rounded-full ${hasCheckedAnswer ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-outline"} flex items-center justify-center shrink-0 shadow-xs`}>
                <CheckCircle2 className="w-7 h-7" />
              </div>
              {hasCheckedAnswer && selectedChoice ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-title-md text-primary font-bold">
                      {missionStep === missionSteps.length - 1 ? "Misi hampir selesai" : "Pilihanmu mengubah suasana"}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
                      <BookOpen className="w-3.5 h-3.5" />
                      Balai Bahasa Sulteng
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant max-w-2xl leading-relaxed">
                    {selectedChoice.detail} Perhatikan reaksi tetua sebelum melanjutkan langkahmu.
                  </p>
                </div>
              ) : (
                <p className="text-body-md text-on-surface-variant">Pilih tindakanmu untuk melihat reaksi situasi.</p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                disabled={!selectedOption || !sessionReady}
                onClick={() => {
                  if (hasCheckedAnswer) {
                    handleContinue();
                  } else {
                    setHasCheckedAnswer(true);
                  }
                }}
                className="w-full md:w-auto px-8 py-3.5 bg-primary text-on-primary rounded-full font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>{hasCheckedAnswer ? (missionStep === missionSteps.length - 1 ? "Selesaikan Misi" : "Lanjutkan Misi") : "Lakukan Aksi"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
