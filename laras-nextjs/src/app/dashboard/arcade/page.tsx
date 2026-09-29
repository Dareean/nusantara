"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  hint: string;
  category: "Kosakata" | "Busana" | "Fonetik Dialek";
  options: string[];
  correctIndex: number;
  lore: string;
}

const quizData: Question[] = [
  {
    id: 1,
    question: "Apa arti dari salam kehormatan 'Tabe' dalam bahasa Kaili?",
    hint: "Diucapkan sambil membungkukkan badan saat lewat atau menyapa.",
    category: "Kosakata",
    options: ["Permisi / Maaf", "Terima Kasih", "Selamat Jalan", "Apa Kabar"],
    correctIndex: 0,
    lore: "'Tabe' adalah sapaan etika tertinggi suku Kaili saat melintas di depan sesepuh atau meminta izin.",
  },
  {
    id: 2,
    question: "Busana 'Baju Nggembe' khas wanita Kaili memiliki bentuk potongan apa?",
    hint: "Bentuk segi empat longgar tanpa kancing penutup depan.",
    category: "Busana",
    options: ["Segi Empat Longgar", "Kebaya Ketat", "Gamis Bertingkat", "Rompi Berlapis"],
    correctIndex: 0,
    lore: "Baju Nggembe berbentuk segi empat dengan lengan melebar, melambangkan keleluasaan budi pekerti wanita Kaili.",
  },
  {
    id: 3,
    question: "Kain tenun Donggala sutra yang dihiasi benang emas disebut...",
    hint: "Ditenun dengan alat ATBM khas Banawa.",
    category: "Busana",
    options: ["Buya Sabe", "Kain Cual", "Ulos Batak", "Songket Palembang"],
    correctIndex: 0,
    lore: "Buya Sabe adalah kain tenun sutra Donggala bermotif Subi atau Kombu yang menjadi kebanggaan mahar dan upacara adat.",
  },
  {
    id: 4,
    question: "Istilah perhiasan kalung kuningan wanita Kaili di wilayah Sigi disebut apa?",
    hint: "Di Donggala disebut Dali, di Sigi memiliki nama lain.",
    category: "Busana",
    options: ["Sampa", "Salonde", "Pompapanto", "Jimat Tara"],
    correctIndex: 0,
    lore: "Sampa adalah kalung susun kuningan bermotif matahari yang melambangkan kehangatan dan derajat sosial sang mempelai.",
  },
  {
    id: 5,
    question: "Nilai luhur gotong royong dan kebersamaan masyarakat Kaili dikenal dengan istilah...",
    hint: "Falsafah hidup hidup rukun dan tolong-menolong.",
    category: "Kosakata",
    options: ["Sintuvu", "Maroso", "Mapalus", "Masagena"],
    correctIndex: 0,
    lore: "'Sintuvu' adalah fondasi adat Kaili yang berarti kesatuan hati, gotong royong, dan saling menopang dalam duka maupun sukacita.",
  },
  {
    id: 6,
    question: "Apa perbedaan dialek Ledo dan Tara dalam menyebut kata 'Tidak'?",
    hint: "Nama sub-etnis Kaili dinamai dari kata 'Tidak' yang digunakan.",
    category: "Fonetik Dialek",
    options: [
      "Ledo menyebut 'Ledo', Tara menyebut 'Tara'",
      "Keduanya menggunakan kata 'Ndada'",
      "Ledo menyebut 'De'e', Tara menyebut 'Bia'",
      "Sama sekali tidak ada perbedaan kosakata",
    ],
    correctIndex: 0,
    lore: "Suku Kaili memiliki keunikan linguistik: nama sub-suku (Ledo, Tara, Da'a, Rai, Ija) diambil dari varian kata negasi 'Tidak' masing-masing.",
  },
];

export default function ArcadePage() {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "gameover" | "victory">("lobby");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "incorrect" | null>(null);
  const [highScore, setHighScore] = useState(1250);

  // Timer loop when playing
  useEffect(() => {
    if (gameState !== "playing" || answerStatus !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentIdx, answerStatus]);

  const handleTimeOut = () => {
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setGameState("gameover");
      } else {
        nextQuestion();
      }
      return nextLives;
    });
    setCombo(1);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentIdx(0);
    setScore(0);
    setCombo(1);
    setLives(3);
    setTimeLeft(15);
    setSelectedOption(null);
    setAnswerStatus(null);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || gameState !== "playing") return;

    setSelectedOption(idx);
    const currentQ = quizData[currentIdx];
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      setAnswerStatus("correct");
      const earnedXP = Math.round(100 * combo + timeLeft * 5);
      const newScore = score + earnedXP;
      setScore(newScore);
      setCombo((prev) => Math.min(prev + 0.5, 3.0));

      if (newScore > highScore) {
        setHighScore(newScore);
      }

      setTimeout(() => {
        if (currentIdx + 1 < quizData.length) {
          nextQuestion();
        } else {
          setGameState("victory");
        }
      }, 1400);
    } else {
      setAnswerStatus("incorrect");
      setCombo(1);
      setTimeout(() => {
        setLives((prev) => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            setGameState("gameover");
          } else {
            nextQuestion();
          }
          return nextLives;
        });
      }, 1400);
    }
  };

  const nextQuestion = () => {
    setCurrentIdx((prev) => prev + 1);
    setSelectedOption(null);
    setAnswerStatus(null);
    setTimeLeft(15);
  };

  const currentQ = quizData[currentIdx] || quizData[0];

  return (
    <main className="w-full min-w-0 max-w-4xl mx-auto space-y-6 pb-20 overflow-x-clip">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-[0_3px_0_0_#b45309]">
            <span className="material-symbols-outlined text-[28px]">sports_esports</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
                Warm Heritage Arcade
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                Gen Z Kaili Challenge
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Tantangan Kilat Pusaka Kaili
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface text-label-md font-bold">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              emoji_events
            </span>
            <span>Rekor: {highScore} XP</span>
          </div>
          <Link
            href="/dashboard/belajar"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-surface-container text-on-surface-variant text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Jalur Belajar</span>
          </Link>
        </div>
      </div>

      {/* LOBBY STATE */}
      {gameState === "lobby" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-label-sm uppercase font-bold text-primary tracking-wider">
                Mode Permainan
              </span>
              <h2 className="text-2xl font-extrabold text-on-surface">
                Uji Ketangkasan Adat &amp; Bahasa Lokal
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Jawab cepat tantangan seputar kosakata bahasa Kaili, ragam tata busana tradisional,
                dan filosofi adat Lembah Palu sebelum waktu habis!
              </p>
            </div>

            {/* Feature Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
                <h4 className="text-title-md font-bold text-on-surface mt-1">15 Detik</h4>
                <p className="text-body-sm text-on-surface-variant">Batas waktu tiap pertanyaan</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  local_fire_department
                </span>
                <h4 className="text-title-md font-bold text-on-surface mt-1">Hingga 3.0x</h4>
                <p className="text-body-sm text-on-surface-variant">Multiplier kombo XP berturut</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-tertiary text-[24px]">favorite</span>
                <h4 className="text-title-md font-bold text-on-surface mt-1">3 Nyawa</h4>
                <p className="text-body-sm text-on-surface-variant">Jaga konsentrasi budaya</p>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={startGame}
              className="w-full py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary text-title-md font-bold transition-all transform active:translate-y-0.5 shadow-[0_4px_0_0_#881f00] flex items-center justify-center gap-2 text-lg"
            >
              <span className="material-symbols-outlined text-[24px]">play_arrow</span>
              <span>Mulai Bertanding Sekarang</span>
            </button>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                leaderboard
              </span>
              <h3 className="text-title-md font-bold text-on-surface">Peringkat Murid</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-center font-bold text-secondary text-title-md">1</span>
                  <div className="flex flex-col">
                    <span className="text-label-md font-bold text-on-surface">Rafi Fadhlillah</span>
                    <span className="text-[11px] text-on-surface-variant">Ledo Master • 8 Streak</span>
                  </div>
                </div>
                <span className="text-label-md font-bold text-primary">1,420 XP</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-center font-bold text-on-surface-variant text-title-md">
                    2
                  </span>
                  <div className="flex flex-col">
                    <span className="text-label-md font-bold text-on-surface">Siti Nurhaliza</span>
                    <span className="text-[11px] text-on-surface-variant">Busana Expert</span>
                  </div>
                </div>
                <span className="text-label-md font-bold text-primary">1,250 XP</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-primary-fixed/30 border border-primary-fixed">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-center font-bold text-primary text-title-md">3</span>
                  <div className="flex flex-col">
                    <span className="text-label-md font-bold text-on-surface">Kamu</span>
                    <span className="text-[11px] text-primary font-semibold">Skor Terbaikmu</span>
                  </div>
                </div>
                <span className="text-label-md font-bold text-primary">{highScore} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === "playing" && (
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
          {/* Game Stats Bar */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((heart) => (
                <span
                  key={heart}
                  className={`material-symbols-outlined text-[22px] transition-all ${
                    heart <= lives ? "text-error fill-1" : "text-outline-variant"
                  }`}
                  style={{ fontVariationSettings: heart <= lives ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              ))}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px] float-lift">
                timer
              </span>
              <span
                className={`font-mono text-xl font-bold ${
                  timeLeft <= 5 ? "text-error float-lift" : "text-on-surface"
                }`}
              >
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>

            {/* Score & Combo Multiplier */}
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>{combo.toFixed(1)}x Combo</span>
              </div>
              <span className="font-extrabold text-title-md text-primary">{score} XP</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIdx + 1) / quizData.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold">
                {currentQ.category} • Soal {currentIdx + 1}/{quizData.length}
              </span>
              <span className="text-body-sm text-on-surface-variant italic">
                {currentQ.hint}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              let btnStyle =
                "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container hover:border-primary";

              if (selectedOption !== null) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = "bg-secondary-fixed text-on-secondary-fixed border-secondary font-bold shadow-[0_2px_0_0_#b45309]";
                } else if (idx === selectedOption) {
                  btnStyle = "bg-error-container text-on-error-container border-error font-bold";
                } else {
                  btnStyle = "opacity-40 bg-surface-container-low";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`p-4 rounded-xl border text-left text-body-md transition-all active:scale-[0.99] flex items-center justify-between ${btnStyle}`}
                >
                  <span className="font-semibold">{opt}</span>
                  {selectedOption !== null && idx === currentQ.correctIndex && (
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      check_circle
                    </span>
                  )}
                  {selectedOption !== null &&
                    idx === selectedOption &&
                    idx !== currentQ.correctIndex && (
                      <span className="material-symbols-outlined text-error text-[20px]">
                        cancel
                      </span>
                    )}
                </button>
              );
            })}
          </div>

          {/* Feedback Lore */}
          {answerStatus && (
            <div
              className={`p-4 rounded-xl text-body-sm flex items-start gap-3 border animate-in fade-in duration-200 ${
                answerStatus === "correct"
                  ? "bg-secondary-fixed/30 border-secondary text-on-surface"
                  : "bg-error-container/40 border-error text-on-error-container"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                {answerStatus === "correct" ? "lightbulb" : "info"}
              </span>
              <div>
                <p className="font-bold">
                  {answerStatus === "correct" ? "Jawaban Benar! 🎉" : "Kurang Tepat!"}
                </p>
                <p className="mt-0.5">{currentQ.lore}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER STATE */}
      {gameState === "gameover" && (
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-xl text-center space-y-6 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto shadow-inner">
            <span className="material-symbols-outlined text-[36px]">sentiment_very_dissatisfied</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-on-surface">Nyawa Habis!</h2>
            <p className="text-body-md text-on-surface-variant">
              Jangan patah semangat, kearifan lokal butuh ketekunan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex justify-around">
            <div>
              <span className="text-label-sm text-on-surface-variant">Skor Akhir</span>
              <p className="text-2xl font-extrabold text-primary">{score} XP</p>
            </div>
            <div className="w-px bg-outline-variant/40" />
            <div>
              <span className="text-label-sm text-on-surface-variant">Rekor Terbaik</span>
              <p className="text-2xl font-extrabold text-secondary">{highScore} XP</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={startGame}
              className="w-full py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-label-lg transition-all shadow-[0_3px_0_0_#881f00]"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => setGameState("lobby")}
              className="w-full py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-label-md transition-all"
            >
              Kembali ke Menu Arcade
            </button>
          </div>
        </div>
      )}

      {/* VICTORY STATE */}
      {gameState === "victory" && (
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-xl text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mx-auto shadow-[0_4px_0_0_#b45309] float-lift">
            <span className="material-symbols-outlined text-[44px]">workspace_premium</span>
          </div>

          <div className="space-y-1">
            <span className="text-label-sm uppercase font-bold text-secondary tracking-widest">
              Luar Biasa!
            </span>
            <h2 className="text-3xl font-extrabold text-on-surface">Sang Penjaga Tradisi</h2>
            <p className="text-body-md text-on-surface-variant">
              Kamu berhasil menyelesaikan seluruh tantangan pusaka Kaili dengan gemilang!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex justify-around">
            <div>
              <span className="text-label-sm text-on-surface-variant">Total XP Diperoleh</span>
              <p className="text-3xl font-extrabold text-primary">+{score} XP</p>
            </div>
            <div className="w-px bg-outline-variant/40" />
            <div>
              <span className="text-label-sm text-on-surface-variant">Sisa Nyawa</span>
              <p className="text-3xl font-extrabold text-secondary">{lives} ❤</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/paspor"
              className="flex-1 py-3 rounded-full bg-secondary hover:bg-secondary-container text-on-secondary font-bold text-label-lg transition-all text-center"
            >
              Cek Paspor Budaya
            </Link>
            <button
              onClick={startGame}
              className="flex-1 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-label-lg transition-all shadow-[0_3px_0_0_#881f00]"
            >
              Main Lagi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
