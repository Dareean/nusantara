import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LARAS — Lestarikan Bahasa & Budaya Nusantara",
  description:
    "Belajar bahasa daerah Kaili dan busana adat secara terpadu melalui gamifikasi modern berstandar etnolinguistik. Ubah wawasan budaya pasif menjadi kebiasaan interaktif 5 menit sehari.",
  keywords: [
    "LARAS",
    "bahasa daerah",
    "Kaili",
    "busana adat",
    "budaya Nusantara",
    "Sulawesi Tengah",
    "pelestarian budaya",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo/logo_laras.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/logo/logo_laras.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full`}>
      <body className="min-h-full font-sans bg-surface text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}
