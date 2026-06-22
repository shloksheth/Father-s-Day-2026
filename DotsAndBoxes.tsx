import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GameStateProvider } from "@/hooks/useGameState";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "For Nirav - Happy Father's Day",
  description: "A special interactive experience for a great dad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter bg-white text-gray-900 overflow-x-hidden">
        <GameStateProvider>
          {children}
        </GameStateProvider>
      </body>
    </html>
  );
}
