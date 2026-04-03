import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollWrapper } from "@/components/layout/SmoothScrollWrapper";
import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immersive Interactive Gallery",
  description: "A high-performance interactive gallery experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-white selection:bg-amber-500/30">
        <CustomCursor />
        <Preloader />
        <ScrollProgress />
        
        <SmoothScrollWrapper>
          <Navbar />
          <main className="flex-1 mt-16 md:mt-20">
            {children}
          </main>
        </SmoothScrollWrapper>
      </body>
    </html>
  );
}
