"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Heart,
  MapPin,
  Flame,
  Info,
  Volume2,
  Play,
  Pause,
  BadgeCheck,
  Hand,
  Check,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { getCachedSessionSync, getSession } from "../../auth/authClient";
import { DEFAULT_PROGRESS, loadProgress, readProgress, type LessonResult, type UserProgress } from "../progress";

export default function EvaluasiJawabanPage() {
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timerCount, setTimerCount] = useState(4);
  const [isExpandedCulture, setIsExpandedCulture] = useState(false);
  const [isExpandedAudio, setIsExpandedAudio] = useState(false);
  const [isExpandedNotes, setIsExpandedNotes] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);

  useEffect(() => {
    const cached = getCachedSessionSync();
    let email = cached?.email || "";
    if (email) {
      const local = readProgress(email);
      setProgress(local);
      if (local.lastLesson) setLessonResult(local.lastLesson);
    }

    getSession().then(async (session) => {
      if (!session) return;
      email = session.email;
      const local = readProgress(email);
      setProgress(local);
      if (local.lastLesson) setLessonResult(local.lastLesson);

      const remote = await loadProgress(email);
      setProgress(remote);
      if (remote.lastLesson) setLessonResult(remote.lastLesson);
    });

    const onProgressUpdated = () => {
      if (email) {
        const updated = readProgress(email);
        setProgress(updated);
        if (updated.lastLesson) setLessonResult(updated.lastLesson);
      }
    };
    window.addEventListener("laras-progress-updated", onProgressUpdated);
    return () => window.removeEventListener("laras-progress-updated", onProgressUpdated);
  }, []);

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => {
      const currentlyPlaying = !prev;
      if (currentlyPlaying) {
        setTimerCount(4);
      }
      return currentlyPlaying;
    });
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 px-4 lg:px-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 text-on-surface-variant" />
        </Link>
        <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-md font-bold">
          <Heart className="w-4 h-4 text-error fill-current" />
          <span>{lessonResult?.heartsRemaining ?? progress.hearts}/3</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-20 pb-12 bg-surface flex justify-center overflow-x-clip">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-6">
          {/* Metadata Ribbon */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low px-4 lg:px-6 py-3 rounded-2xl border border-outline-variant/30">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-on-surface-variant text-label-md">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  Dialek Kaili (Ledo &amp; Tara) • Lembah Palu &amp; Pesisir Banawa
                </span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-surface-variant hidden sm:block"></div>
              <div className="flex items-center gap-1 text-secondary text-label-md font-bold">
                <Flame className="w-4 h-4" />
                <span>{progress.streak} Hari Beruntun</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm shadow-xs">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
              <span className="font-bold">Refleksi Sesi Belajar</span>
            </div>
          </div>

          {/* 2-Column Split Workspace */}
          <div className="w-full grid grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Cultural Context & Media Station */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 sm:gap-5">
              {/* Photo Card */}
              <div className="relative bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs flex flex-col group border border-outline-variant/30">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Pelataran Souraja"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL3GhtQRWPzykvIVNWr2V35NhJTe_dCVIIrRtyBVfZEEj3XqYhEOJv_SEbk1PTWX0c31bxzkMEw4gOh7sN-WlcJNaV67h505nMT6eV4hEBOjXkJ6KJwhuR9O1EtZUS6Z3a5-anWincRSwsEM6Cd1eIcoTaILOCLMI3NIxB7VqVikEobrcT0CoVvKVVkAc_aFxEbqVUD4ypGJjz4ltJB0RE8BCXz7x3pKJC2QF3wSnftvmW7hDh7y67iQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex flex-col justify-end p-3.5">
                    <span className="px-2 py-0.5 bg-primary text-on-primary rounded text-[10px] font-bold w-fit mb-1">
                      ARSITEKTUR VERNACULAR
                    </span>
                    <p className="text-white text-title-md sm:text-headline-sm font-bold">
                      Pelataran Souraja, Banawa
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-surface-container-lowest flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-on-surface-variant text-body-sm leading-relaxed">
                    Beranda utama Souraja merupakan ruang diplomasi adat tertua Kaili.
                    {isExpandedCulture ? (
                      <>
                        {" "}Tamu kehormatan disambut dengan gestur menunduk halus dan salam berjenjang sebelum menginjakkan kaki di anak tangga ketiga (<em className="italic font-semibold">Tukanggo Adat</em>).
                        <button
                          type="button"
                          onClick={() => setIsExpandedCulture(false)}
                          className="text-primary font-bold text-xs hover:underline ml-1.5 inline cursor-pointer"
                        >
                          Sembunyikan
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsExpandedCulture(true)}
                          className="text-primary font-bold text-xs hover:underline ml-1.5 inline cursor-pointer"
                        >
                          Baca selengkapnya
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Native Audio Station - Folded Accordion */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs flex flex-col gap-3 border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsExpandedAudio(!isExpandedAudio)}
                  className="flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-primary text-label-md uppercase tracking-wider font-bold">
                    <Volume2 className="w-4 h-4" />
                    <span>Audio Penutur Asli</span>
                    <span className="text-on-surface-variant text-label-xs font-normal normal-case hidden sm:inline ml-1">
                      (Dialek Ledo)
                    </span>
                  </div>
                  <span className="text-primary text-xs font-bold hover:underline">
                    {isExpandedAudio ? "Tutup audio" : "Dengarkan audio"}
                  </span>
                </button>

                {isExpandedAudio && (
                  <div className="flex flex-col gap-3 pt-2 border-t border-outline-variant/20">
                    <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center gap-3.5 border border-outline-variant/20">
                      <button
                        type="button"
                        onClick={toggleAudio}
                        className={`w-11 h-11 rounded-full text-on-primary flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0 cursor-pointer ${
                          isPlayingAudio ? "bg-tertiary" : "bg-primary"
                        }`}
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-title-sm sm:text-title-md text-primary font-bold truncate">
                            &ldquo;Tabe pue, nalompa mai kami...&rdquo;
                          </span>
                          <span className="text-label-sm text-on-surface-variant font-bold shrink-0">
                            00:0{timerCount}
                          </span>
                        </div>

                        <div className="h-4 flex items-center gap-1.5 w-full">
                          <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-4 float-lift" : "h-2.5"}`}></span>
                          <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-3" : "h-4"}`}></span>
                          <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-4" : "h-2"}`}></span>
                          <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-3.5 float-lift" : "h-4"}`}></span>
                          <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-2.5" : "h-3"}`}></span>
                          <span className={`w-1 bg-primary rounded-full transition-all ${isPlayingAudio ? "h-4" : "h-3.5"}`}></span>
                          <span className="w-1 h-2 rounded-full bg-outline-variant"></span>
                          <span className="w-1 h-3 rounded-full bg-outline-variant"></span>
                          <span className="w-1 h-1.5 rounded-full bg-outline-variant"></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 text-on-surface-variant text-label-sm">
                      <span className="flex items-center gap-1 text-xs sm:text-label-sm">
                        <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                        Kak Rusdi (38 thn, Palu Barat)
                      </span>
                      <span className="text-secondary font-semibold text-xs sm:text-label-sm">
                        Tervalidasi BPK Wil. XVIII
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Etiquette Micro Card */}
              <div className="bg-surface-container p-3.5 rounded-2xl flex items-start gap-3 border border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <Hand className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-title-sm font-bold text-on-surface">
                    Adab Berucap • Lembah Palu
                  </h4>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Tangan kanan diletakkan lurus di sisi pinggang kiri dengan
                    ujung jemari merapat ketika mengucap kalimat permohonan izin (Tabe).
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Evaluation, Choices & Adat Lore */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 sm:gap-5">
              {/* Question Header */}
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-end">
                    <span className="px-2.5 py-1 bg-surface-container-high rounded-full text-on-surface text-label-sm font-bold shadow-2xs">
                      {lessonResult?.firstAttemptCorrect ?? lessonResult?.correctExercises ?? 0}/{lessonResult?.totalExercises ?? 0} exercise tepat (percobaan pertama)
                    </span>
                  </div>
                  <h2 className="text-headline-md text-on-surface font-extrabold leading-tight mt-1 line-clamp-2">
                    Bagaimana pilihanmu membentuk cara bertamu di pelataran Souraja?
                  </h2>
                </div>

                {/* Choices Comparison */}
                <div className="flex flex-col gap-3">
                  {/* Option B: Correct Answer */}
                  <div className="relative bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 border-2 border-primary shadow-xs">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-title-md font-bold text-on-surface">
                            &ldquo;Tabe pue, nalompa kami ri Souraja...&rdquo;
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Paling Selaras</span>
                          </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant truncate">
                          Penghormatan Adat Penuh • Leksikon formal memohon izin kepada pemangku adat
                        </p>
                      </div>
                    </div>
                    <span className="text-label-sm font-bold text-primary uppercase shrink-0">
                      Baku
                    </span>
                  </div>

                  {/* Option A: Evaluated Choice */}
                  <div className="relative bg-surface-container-low p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 border border-outline-variant/30">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                        A
                      </div>
                      <span className="text-title-md font-medium text-on-surface-variant truncate">
                        &ldquo;Naku ria hau, kitorang datang...&rdquo;
                      </span>
                    </div>
                    <span className="text-label-sm font-semibold text-on-surface-variant uppercase shrink-0">
                      Informal
                    </span>
                  </div>

                  {/* Option C: Neutral */}
                  <div className="relative bg-surface-container-low/70 p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 opacity-75 border border-outline-variant/20">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                        C
                      </div>
                      <span className="text-title-md font-medium text-on-surface truncate">
                        &ldquo;Mao kami ri banua, ane maroa...&rdquo;
                      </span>
                    </div>
                    <span className="text-label-sm text-on-surface-variant uppercase shrink-0">
                      Netral
                    </span>
                  </div>
                </div>
              </div>

              {/* Cultural Nuance Callout Box - Folded Accordion */}
              <div className="bg-secondary-fixed/30 p-4 rounded-xl flex flex-col gap-2 border border-secondary/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-on-secondary-fixed-variant">
                    <ShieldAlert className="w-4 h-4 text-secondary shrink-0" />
                    <h3 className="text-title-sm font-bold">
                      Catatan Budaya • Variasi Tradisi &amp; Ragam Dialek
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExpandedNotes(!isExpandedNotes)}
                    className="text-primary font-bold text-xs hover:underline shrink-0 cursor-pointer"
                  >
                    {isExpandedNotes ? "Sembunyikan" : "Baca selengkapnya"}
                  </button>
                </div>
                {isExpandedNotes && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-secondary/20">
                    <p className="text-body-sm text-on-surface leading-relaxed">
                      Di antara rumpun Kaili (Ledo, Tara, Rai, dan Da&apos;a), kata pembuka sapaan dapat bervariasi antara{" "}
                      <strong className="text-primary font-bold">&ldquo;Tabe pue&rdquo;</strong> dan{" "}
                      <strong className="text-primary font-bold">&ldquo;Ntabe opu&rdquo;</strong>. Dalam kurikulum LARAS, kedua variasi ini diakui secara sejajar dan tidak dinilai salah dalam ujian esai terbuka demi melindungi dialek minoritas pesisir Donggala.
                    </p>
                    <div className="flex items-center justify-between pt-0.5 text-on-secondary-fixed-variant text-label-sm opacity-90">
                      <span>Rujukan: Risalah Lembaga Adat Kaili &amp; BPK</span>
                      <span className="underline cursor-pointer hover:text-primary font-bold">Lihat Arsip Adat →</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Sheet & Action Buttons */}
              <div className="bg-primary-fixed/30 p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col gap-3.5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-title-md font-bold ${lessonResult?.correct ? "text-primary" : "text-error"}`}>
                        {lessonResult?.correct
                          ? (lessonResult.isRepeat
                              ? "Latihan ulang selesai (tanpa XP baru)"
                              : `Sesi tuntas (+${lessonResult.xp + (lessonResult.bonusXp ?? 0)} XP)`)
                          : "Sesi perlu diulang"}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        {lessonResult?.correct
                          ? (lessonResult.isRepeat
                              ? "Semua exercise selesai dengan tepat. Latihan ulang berhasil diselesaikan."
                              : "Semua exercise selesai. Reward dan unlock sudah dicatat.")
                          : "Tidak apa-apa. Ulangi sesi untuk memperkuat konteks budaya."}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface leading-relaxed bg-surface-container-lowest/80 p-3.5 rounded-xl border border-outline-variant/20">
                  {lessonResult?.correct ? "Memasuki wilayah tetua adat Souraja menuntut penggunaan partikel" : "Jawaban yang tepat untuk konteks ini menggunakan partikel"}{" "}
                  honorifik <strong>Tabe</strong> (mohon maaf lahir batin / izin melangkah) dan sapaan <strong>Pue</strong> (tokoh yang dituakan). Lanjutkan untuk merayakan penyelesaian modul ini!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-surface-container-lowest text-tertiary font-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors shadow-xs cursor-pointer font-bold border border-outline-variant/20"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Pelafalan Sakral &ldquo;Tabe Pue&rdquo;</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push(lessonResult?.lessonId ? `/dashboard/selesai?lesson=${lessonResult.lessonId}` : "/dashboard/selesai")}
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-[0_3px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_1px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Lanjut ke Perayaan Selesai</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
