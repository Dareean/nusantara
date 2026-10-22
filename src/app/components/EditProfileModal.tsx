"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  User,
  Lock,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { updateProfile, type ClientSession } from "../auth/authClient";

export const CULTURAL_AVATARS = [
  { id: "pamong", label: "Pamong Budaya", url: "/media/presets/avatar_admin.jpg" },
  { id: "tabe", label: "Sikap Tabe", url: "/media/presets/sikap_tabe.webp" },
  { id: "nggembe", label: "Baju Nggembe", url: "/media/presets/baju_nggembe.webp" },
  { id: "souraja", label: "Souraja", url: "/media/presets/souraja.webp" },
  { id: "lalove", label: "Suling Lalove", url: "/media/presets/lalove.webp" },
  { id: "gimba", label: "Gendang Gimba", url: "/media/presets/gimba.webp" },
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  currentAvatar?: string;
  onProfileUpdated?: (updatedSession: ClientSession) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  currentAvatar = "",
  onProfileUpdated,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"biodata" | "password">("biodata");
  const [name, setName] = useState(currentName);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Mohon pilih berkas gambar (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setAvatarUrl(dataUrl);
          setErrorMsg("");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput("");
    setShowUrlField(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validasi tab kata sandi
    if (activeTab === "password") {
      if (!newPassword) {
        setErrorMsg("Masukkan kata sandi baru.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("Kata sandi baru minimal 6 karakter.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("Konfirmasi kata sandi tidak cocok.");
        return;
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Nama pengguna tidak boleh kosong.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: {
        name?: string;
        avatarUrl?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        name: name.trim(),
        avatarUrl,
      };

      if (activeTab === "password" && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const updated = await updateProfile(payload);
      setSuccessMsg("Profil dan akun berhasil diperbarui!");
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-lowest p-5 sm:p-6 shadow-2xl border border-outline-variant/30 text-on-surface overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 shrink-0">
          <div>
            <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Edit Profil &amp; Akun
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Sesuaikan identitas, foto avatar budaya, dan keamanan akunmu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 mt-3.5 bg-surface-container rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab("biodata");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "biodata"
                ? "bg-white text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <User className="w-4 h-4" />
            Biodata &amp; Foto
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "password"
                ? "bg-white text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Lock className="w-4 h-4" />
            Kata Sandi
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-error-container/60 border border-error/30 text-on-error-container text-xs font-bold flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-error" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center gap-2 shrink-0">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Content (Scrollable) */}
        <form onSubmit={handleSubmit} className="mt-3.5 flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === "biodata" ? (
            <>
              {/* Preview Avatar & Selector */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30 gap-3">
                <div className="relative group">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-primary text-on-primary ring-4 ring-primary/20 flex items-center justify-center font-black text-2xl shadow-md">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="Foto Profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{name ? name.slice(0, 1).toUpperCase() : "P"}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Ganti foto profil"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow flex items-center justify-center hover:scale-110 transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xs font-bold text-on-surface">Foto Avatar Pengguna</p>
                  <p className="text-[10px] text-on-surface-variant">
                    Pilih avatar budaya khas Kaili, unggah fotomu, atau pakai inisial.
                  </p>
                </div>

                {/* Cultural Presets */}
                <div className="w-full">
                  <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
                    Preset Avatar Budaya Kaili
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {CULTURAL_AVATARS.map((preset) => {
                      const isSelected = avatarUrl === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatarUrl(preset.url)}
                          title={preset.label}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary ring-2 ring-primary/40 scale-105"
                              : "border-outline-variant/40 opacity-80 hover:opacity-100 hover:border-outline"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="h-full w-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions: Upload & URL */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Unggah Berkas
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="h-8 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Tautan URL
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="h-8 px-2.5 rounded-xl text-error hover:bg-error-container/30 text-[11px] font-bold transition cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>

                {/* Input URL Custom jika dibuka */}
                {showUrlField && (
                  <div className="w-full flex items-center gap-2 mt-1">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://contoh.com/foto.jpg"
                      className="flex-1 h-9 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-xs font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="h-9 px-3 rounded-xl bg-primary text-on-primary text-xs font-black"
                    >
                      Terapkan
                    </button>
                  </div>
                )}
              </div>

              {/* Input Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="profileName">
                  Nama Lengkap / Panggilan
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                  <input
                    id="profileName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkapmu"
                    required
                    className="w-full h-11 pl-9 pr-3 rounded-2xl bg-surface-container-low text-on-surface text-sm font-bold border border-outline-variant/50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Email Pengguna (Read-only) */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
                  Alamat Email (Akun)
                </label>
                <div className="w-full h-11 px-3.5 rounded-2xl bg-surface-container-high/50 border border-outline-variant/30 flex items-center justify-between text-xs font-bold text-on-surface-variant select-none">
                  <span>{currentEmail}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface">
                    Terverifikasi
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Tab Kata Sandi */}
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-on-surface-variant font-medium">
                Gunakan kata sandi yang kuat (minimal 6 karakter) agar akun petualangan budayamu tetap aman.
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="currentPassword">
                  Kata Sandi Saat Ini (Jika ada)
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan sandi lama jika pernah dibuat"
                    className="w-full h-11 pl-9 pr-10 rounded-2xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-outline hover:text-on-surface p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="newPassword">
                  Kata Sandi Baru
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full h-11 pl-9 pr-10 rounded-2xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-outline hover:text-on-surface p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant" htmlFor="confirmPassword">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-outline w-4 h-4 pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    required
                    className="w-full h-11 pl-9 pr-3 rounded-2xl bg-surface-container-low text-on-surface text-sm font-medium border border-outline-variant/50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-primary text-on-primary text-xs font-black uppercase tracking-wider shadow-[0_3px_0_0_#881f00] hover:brightness-105 active:translate-y-[1px] active:shadow-none transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
