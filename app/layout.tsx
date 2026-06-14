import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Human Intelligence Boost — когнитивные тренировки",
  description:
    "HIB — веб-сервис коротких научных тренировок для памяти, внимания, логики, реакции и креативности. Развивай интеллект по 3–5 минут в день.",
  keywords: [
    "когнитивные тренировки",
    "память",
    "внимание",
    "логика",
    "креативность",
    "brain training",
  ],
  authors: [{ name: "HIB" }],
  openGraph: {
    title: "Human Intelligence Boost",
    description:
      "Короткие научные тренировки для памяти, внимания, логики и креативности.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
