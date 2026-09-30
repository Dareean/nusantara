"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Compass,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = (searchParams && searchParams.get("redirect")) || "/dashboard";

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === "register") {
        // register locally
        const { register } = await import('./authClient');
        await register(name.trim(), email.trim(), password);
      } else {
        const { login } = await import('./authClient');
        await login(email.trim(), password);
      }
      // on success redirect (respect redirect param if present)
      router.push(redirectTo);
    } catch (err: any) {
      // basic inline error handling
      const msg = err?.message || 'Terjadi kesalahan autentikasi';
      // eslint-disable-next-line no-alert
      alert(msg);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-surface relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-16 -left-12 w-96 h-96 rounded-full bg-gradient-to-br from-primary-fixed/30 via-secondary-fixed/20 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-20 -right-8 w-80 h-80 rounded-full bg-gradient-to-tl from-tertiary-fixed/30 via-primary-fixed-dim/20 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="flex flex-col w-full items-center justify-center py-8 relative">
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden relative border border-outline-variant/30">
          {/* Top Rainbow Accent Strip */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary-container to-tertiary"></div>

          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* Header / Brand */}
            <div className="flex flex-col items-center text-center gap-1 relative">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed">
                <Flame className="w-4 h-4 fill-current" />
                <span className="text-label-sm uppercase tracking-wider font-bold">
                  Nusantara — Before It&apos;s Gone
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 mt-3">
                <img
                  alt="LARAS Logo"
                  className="h-11 w-auto object-contain"
                  src="/logo/logo_laras.png"
                />
                <h1 className="text-display-lg text-primary font-black tracking-tight">
                  LARAS
                </h1>
              </div>

              <p className="text-label-md text-secondary tracking-widest uppercase font-bold -mt-1">
                Learn the Language. Wear the Culture.
              </p>
              <p className="text-body-md text-on-surface-variant max-w-sm mt-1">
                Bergabung bersama ribuan pemuda pelestari bahasa dan busana
                tradisi Nusantara.
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-2 p-1 bg-surface-container rounded-full">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`py-2.5 rounded-full text-label-lg font-bold text-center transition-all duration-200 cursor-pointer ${
                  authMode === "login"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`py-2.5 rounded-full text-label-lg font-bold text-center transition-all duration-200 cursor-pointer ${
                  authMode === "register"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg transition-colors cursor-pointer border border-outline-variant/30"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-surface-container-high"></div>
              <span className="text-label-sm uppercase text-outline tracking-wider font-semibold">
                atau dengan surel
              </span>
              <div className="h-px flex-1 bg-surface-container-high"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {authMode === "register" && (
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-label-md text-on-surface font-semibold"
                    htmlFor="userName"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 text-outline w-5 h-5 pointer-events-none" />
                    <input
                      id="userName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rani Maharani"
                      required
                      className="w-full py-3 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline/60 text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all border border-outline-variant/30"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-label-md text-on-surface font-semibold"
                  htmlFor="userEmail"
                >
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    id="userEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rani@mahasiswa.ac.id"
                    required
                    className="w-full py-3 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline/60 text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-label-md text-on-surface font-semibold"
                    htmlFor="userPassword"
                  >
                    Kata Sandi
                  </label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      className="text-label-sm text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-outline w-5 h-5 pointer-events-none" />
                  <input
                    id="userPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="w-full py-3 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline/60 text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all border border-outline-variant/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-outline hover:text-on-surface flex items-center justify-center p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {authMode === "register" && (
                <div className="flex flex-col gap-2">
                  <span className="text-label-md text-on-surface font-semibold">
                    Minat Budaya &amp; Dialek Pertama
                  </span>
                  <div className="p-3 rounded-xl bg-primary-fixed/40 flex items-start gap-3 border border-primary/20">
                    <Compass className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-label-md text-on-primary-fixed-variant font-bold truncate">
                        Suku Kaili (Ledo &amp; Tara)
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Lembah Palu &amp; Donggala, Sulawesi Tengah
                      </span>
                    </div>
                    <span className="text-label-sm px-2 py-0.5 rounded-full bg-primary text-on-primary self-center whitespace-nowrap font-bold">
                      Bawaan
                    </span>
                  </div>
                </div>
              )}

              {authMode === "login" && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      defaultChecked
                      type="checkbox"
                      className="w-4 h-4 rounded text-primary focus:ring-primary/30 accent-primary"
                    />
                    <span className="text-body-sm text-on-surface-variant">
                      Ingat saya di perangkat ini
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-lg shadow-[0_4px_0_0_#881f00] hover:bg-primary-container active:translate-y-0.5 active:shadow-[0_2px_0_0_#881f00] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>
                  {authMode === "login"
                    ? "Masuk ke Akun Belajar"
                    : "Mulai Petualangan Budaya"}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Bottom prompt */}
            <div className="flex flex-col items-center gap-3 pt-2 text-center">
              <p className="text-body-md text-on-surface-variant">
                {authMode === "login" ? (
                  <>
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="text-primary font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Daftar gratis dalam 30 detik
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-primary font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Masuk sekarang
                    </button>
                  </>
                )}
              </p>

              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface-container-low text-on-surface-variant max-w-sm">
                <BadgeCheck className="text-secondary w-5 h-5 shrink-0" />
                <span className="text-body-sm text-left">
                  Data kemajuan belajar dan Paspor Budaya Anda tersimpan aman dan
                  terenkripsi.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex items-center gap-4 text-outline text-label-sm">
          <Link href="/" className="hover:text-on-surface transition-colors">
            Kembali ke Beranda
          </Link>
          <span>•</span>
          <span className="text-on-surface-variant">v2.4 Kaili Edition</span>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-surface">
          <div className="text-label-lg text-on-surface-variant">Memuat autentikasi…</div>
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
