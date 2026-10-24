"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Flame,
  MapPin,
  Pause,
  Play,
  RotateCw,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { getSession } from "../../auth/authClient";
import { readProgress, recordLessonResult } from "../progress";

interface Choice {
  id: string;
  label: string;
  feedback: string;
  score: number;
  isBest: boolean;
}

interface Decision {
  stage: string;
  location: string;
  narrative: string;
  prompt: string;
  image: string;
  choices: Choice[];
}

const decisions: Decision[] = [
  {
    stage: "Tahap 1 dari 3",
    location: "Pelataran Souraja, Palu Barat",
    narrative:
      "Kamu tiba di pelataran Souraja mewakili keluargamu. Di muka beranda rumah panggung, para dewan tetua adat (Pue) sedang berbincang menyambut para tamu kehormatan.",
    prompt: "Tetua adat sedang berbincang di muka serambi. Apa tindakan dan tutur sapa yang kamu lakukan?",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnqzf4AUY4GtDvGFESMzw5vK14-0xCr_-CqqKyHzgObssX2HonjZALyMHyv39OWxApYxC7Qh-I_QL8HUz0P49aJ6BzYjxVwjXJHDsRyqGQ94Fcy6GzwgtD7xsDzDMpUvUCL8cjccCPgdt2Y3tLKFkDkPWH3ofPYJMVw67VqH8tQ8M2Lij3qg990UKy62hGgrC7qGw0SSgnFIpN5YHUA0es_BtlcATm5jgXKQfrCE10dXoeDE-lLZQMbw",
    choices: [
      {
        id: "tabe",
        label: "Ucapkan 'Tabe pue, nalompa mai kami' sambil menundukkan badan",
        feedback:
          "Tetua adat tersenyum takzim dan mempersilakanmu naik. Sapaan 'Tabe' menunjukkan adab kerendahan hati tertinggi dalam budaya Kaili.",
        score: 2,
        isBest: true,
      },
      {
        id: "wait",
        label: "Berdiri diam di anak tangga tanpa menyapa sampai disapa duluan",
        feedback:
          "Cukup sopan, namun tetua sempat memandang heran karena kamu tampak kaku dan tidak berinisiatif memberi salam.",
        score: 1,
        isBest: false,
      },
      {
        id: "enter",
        label: "Langsung melangkah masuk ke ruang utama Souraja",
        feedback:
          "Kurang elok. Melangkah melewati tetua tanpa salam adat dianggap tidak mengindahkan adab bertamu.",
        score: 0,
        isBest: false,
      },
    ],
  },
  {
    stage: "Tahap 2 dari 3",
    location: "Ruang Utama Majelis Souraja",
    narrative:
      "Kamu melangkah masuk ke ruang utama upacara adat perkawinan. Seluruh keluarga besar dan tamu dewan adat mengenakan busana tradisi bernuansa khidmat.",
    prompt: "Pilihan busana apa yang kamu kenakan untuk menghormati majelis dewan adat ini?",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGGe6e5vP1nGlX2ZvT-UWV9U5KAgLs72Sx27pc9mWuqPe01VmMKmx0DY8XbKA_r787_92pwgfiNumLz4-iEx6Nq6vvyfNc4N2LM7ruBRvLAOih6SWFuROZCbgCyVmTQAuyl2CMFa2elMsDv2JbxdEeaCSXjUqCi9G3Wj0aeNXHmvef-hwkOzESw41KdPVLaaSgxbbKPPlqGPfNa2_DJN29ozR1Xvy4rPWtQLsRBJj8QzLNr5yBMJcbaQ",
    choices: [
      {
        id: "nggembe",
        label: "Baju Nggembe merah terakota & Sarung Tenun Donggala (Buya Sabe)",
        feedback:
          "Pilihan paripurna! Warna terakota dan tenun Buya Sabe mencerminkan tamu kehormatan yang paham tata krama tanpa menutupi busana emas pengantin.",
        score: 2,
        isBest: true,
      },
      {
        id: "plain",
        label: "Pakaian kemeja sehari-hari yang santai",
        feedback:
          "Pakaianmu bersih, namun dinilai kurang menghargai sakralnya perhelatan adat Souraja.",
        score: 1,
        isBest: false,
      },
      {
        id: "loud",
        label: "Busana gemerlap mencolok menyaingi busana pengantin",
        feedback:
          "Kurang tepat. Adab tamu mengutamakan keselarasan, bukan mencari perhatian yang menyaingi mempelai.",
        score: 0,
        isBest: false,
      },
    ],
  },
  {
    stage: "Tahap 3 dari 3",
    location: "Tikar Kehormatan Majelis Adat",
    narrative:
      "Tuan rumah (Pue Rumah) tersenyum ramah dan secara khusus mempersilakanmu menempati tikar anyaman kehormatan di dekat dewan adat.",
    prompt: "Bagaimana gestur dan tutur katamu saat menerima penghormatan tempat duduk ini?",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3GhtQRWPzykvIVNWr2V35NhJTe_dCVIIrRtyBVfZEEj3XqYhEOJv_SEbk1PTWX0c31bxzkMEw4gOh7sN-WlcJNaV67h505nMT6eV4hEBOjXkJ6KJwhuR9O1EtZUS6Z3a5-anWincRSwsEM6Cd1eIcoTaILOCLMI3NIxB7VqVikEobrcT0CoVvKVVkAc_aFxEbqVUD4ypGJjz4ltJB0RE8BCXz7x3pKJC2QF3wSnftvmW7hDh7y67iQ",
    choices: [
      {
        id: "lower",
        label: "Menunduk santun kedua tangan merapat sambil mengucap terima kasih",
        feedback:
          "Sangat beradab! Menundukkan gesture dan tangan merapat mencerminkan falsafah luhur Katura masyarakat Kaili.",
        score: 2,
        isBest: true,
      },
      {
        id: "nod",
        label: "Mengangguk singkat lalu langsung duduk",
        feedback:
          "Wajar dan santun, namun gestur tangan merapat akan jauh lebih berkesan di hadapan sang Pue Rumah.",
        score: 1,
        isBest: false,
      },
      {
        id: "rush",
        label: "Duduk tergesa-gesa tanpa menatap tuan rumah",
        feedback:
          "Tergesa-gesa di hadapan majelis dianggap kurang menaruh rasa hormat kepada sang tuan rumah.",
        score: 0,
        isBest: false,
      },
    ],
  },
];

export default function CultureConnectionPage() {
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
  const [decisionStep, setDecisionStep] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [harmony, setHarmony] = useState(0);
  const [sessionEmail, setSessionEmail] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      const email = session?.email ?? "";
      setSessionEmail(email);
      setSessionReady(true);
      if (email) {
        const prog = readProgress(email);
        setIsAlreadyClaimed(Boolean(prog.cultureConnectionClaimed || prog.completedLessons.includes(4)));
      }
    });
  }, []);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleClaim = () => {
    if (decisionStep < decisions.length || !sessionEmail) return;
    recordLessonResult(sessionEmail, {
      lessonId: 4,
      answered: "culture-connection",
      correct: true,
      score: Math.max(60, harmony * 20),
      xp: isAlreadyClaimed ? 0 : 30,
      completedAt: new Date().toISOString(),
    });
    setIsAlreadyClaimed(true);
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      router.push("/dashboard/paspor");
    }, 800);
  };

  const currentDecision = decisions[decisionStep];
  const activeChoice = currentDecision?.choices.find((c) => c.id === selectedChoiceId);

  const handleConfirmDecision = () => {
    if (!activeChoice) return;
    setIsConfirmed(true);
    setHarmony((prev) => prev + activeChoice.score);
  };

  const handleNextStep = () => {
    setIsConfirmed(false);
    setSelectedChoiceId(null);
    setDecisionStep((prev) => prev + 1);
  };

  const progressPercent = Math.min(100, Math.round(((decisionStep) / decisions.length) * 100));

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* 1. TOP GAME HUD (Navigasi, Progress Bar, & Harmoni Meter) */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 px-4 py-3 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </Link>

          {/* Central Progress Bar */}
          <div className="flex-1 max-w-xs mx-auto flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-on-surface-variant">
              <span>{decisionStep < decisions.length ? currentDecision.stage : "Selesai"}</span>
              <span className="text-primary">{Math.round((harmony / 6) * 100)}% Harmoni</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${decisionStep >= decisions.length ? 100 : progressPercent}%` }}
              />
            </div>
          </div>

          {/* Audio Atmosphere Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
              isPlayingAudio
                ? "bg-primary text-on-primary animate-pulse"
                : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
            }`}
            title="Dengarkan Suasana Lalove & Ganda"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPlayingAudio ? "Audio Aktif" : "Musik Adat"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN GAME ARENA (Terpusat, Bersih, Format Game Skenario) */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {decisionStep < decisions.length ? (
          /* Skenario Game Berjalan */
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Visual Scene Stage Card */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-outline-variant/30 shadow-md bg-surface-container-lowest">
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black/40">
                <img
                  src={currentDecision.image}
                  alt={currentDecision.location}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                  <MapPin className="w-3.5 h-3.5 text-primary-fixed" />
                  <span>{currentDecision.location}</span>
                </div>
              </div>

              {/* Story Narrative Bubble */}
              <div className="p-4 sm:p-5 -mt-6 relative z-10 mx-3 mb-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    Situasi Adat
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed">
                  {currentDecision.narrative}
                </p>
              </div>
            </div>

            {/* Prompt Pertanyaan Keputusan */}
            <div className="px-1 pt-1">
              <h2 className="text-base sm:text-lg font-black text-on-surface tracking-tight">
                {currentDecision.prompt}
              </h2>
            </div>

            {/* Pilihan Keputusan Bergaya Game Choice Cards */}
            <div className="flex flex-col gap-2.5">
              {currentDecision.choices.map((choice, index) => {
                const isSelected = selectedChoiceId === choice.id;
                const letter = String.fromCharCode(65 + index); // A, B, C

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={isConfirmed}
                    onClick={() => setSelectedChoiceId(choice.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "border-primary bg-primary-fixed/20 shadow-[0_3px_0_0_#881f00] ring-1 ring-primary"
                        : "border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low shadow-xs"
                    } ${isConfirmed && !isSelected ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition ${
                        isSelected
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-on-surface flex-1 leading-snug">
                      {choice.label}
                    </span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary shrink-0 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Jawaban / Konfirmasi Tindakan */}
            {isConfirmed && activeChoice ? (
              <div
                className={`p-4 rounded-2xl border-2 flex flex-col gap-2 animate-in fade-in duration-300 ${
                  activeChoice.isBest
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                    : activeChoice.score > 0
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                    : "bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-100"
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {activeChoice.isBest
                      ? "Harmoni Sempurna (+2)"
                      : activeChoice.score > 0
                      ? "Cukup Beradab (+1)"
                      : "Kurang Selaras (+0)"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {activeChoice.feedback}
                </p>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-on-primary font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmDecision}
                disabled={!selectedChoiceId}
                className="mt-2 w-full py-3.5 rounded-full bg-primary text-on-primary font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Tentukan Keputusan
              </button>
            )}
          </div>
        ) : (
          /* Layar Kemenangan / Selesai Skenario (Victory Game Screen) */
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border-2 border-primary/30 shadow-xl flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-inner">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Skenario Adat Tuntas
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-on-surface mt-1">
                Upacara Adat Sempurna!
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1.5 max-w-md">
                Kamu telah mempraktikkan etika bertamu, tutur sapa Tabe, dan busana adat Kaili dengan penuh penghormatan di Souraja.
              </p>
            </div>

            {/* Stat Ringkas Kemenangan */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="p-3 rounded-2xl bg-surface-container-high flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">Tingkat Harmoni</span>
                <span className="text-lg font-black text-primary mt-0.5">
                  {Math.round((harmony / 6) * 100)}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-200">Perolehan XP</span>
                <span className="text-lg font-black text-amber-600 mt-0.5 flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-current" />
                  {isAlreadyClaimed ? "0 XP" : "+30 XP"}
                </span>
              </div>
            </div>

            {/* Cap Paspor Unlocked Banner */}
            <div className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-primary uppercase tracking-wider">Cap Paspor Baru</p>
                <p className="text-sm font-extrabold text-on-surface truncate">Tamu Sopan Lembah Palu</p>
              </div>
            </div>

            {/* Tombol Utama */}
            <div className="w-full flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleClaim}
                disabled={isClaiming || !sessionReady}
                className="w-full py-3.5 rounded-full bg-primary text-on-primary font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_0_#881f00] hover:brightness-105 active:translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isClaiming ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Paspor...</span>
                  </>
                ) : (
                  <>
                    <span>{isAlreadyClaimed ? "Buka Paspor Budaya" : "Klaim Cap Paspor"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-full text-center text-xs font-bold text-on-surface-variant hover:text-primary transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
