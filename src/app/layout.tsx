import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans bg-surface text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}
