import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nusantara: Before It's Gone — Digital Cultural Transmission",
  description:
    "Don't just preserve culture. Pass it on. Platform transmisi pengetahuan budaya dari pemilik pengetahuan ke generasi berikutnya.",
  keywords: [
    "budaya",
    "cultural preservation",
    "knowledge transmission",
    "heritage",
    "Sulawesi Tengah",
    "tenun",
    "Nusantara",
  ],
  openGraph: {
    title: "Nusantara: Before It's Gone",
    description: "Don't just preserve culture. Pass it on.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
