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
  title: "LARAS — Nusantara, Before It's Gone",
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
    icon: "/logo/logo_laras.png",
    apple: "/logo/logo_laras.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans bg-surface text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}
