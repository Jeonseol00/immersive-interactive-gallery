import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollWrapper } from "@/components/layout/SmoothScrollWrapper";
import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { GlobalBackground } from "@/components/ui/GlobalBackground";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | IMGAL",
    default: "IMGAL | Interactive Digital Gallery",
  },
  description: "Ruang eksperimental interaktif dimana mahakarya seni klasik dibangun ulang menggunakan komputasi digital terkini.",
  openGraph: {
    title: "IMGAL | Interactive Digital Gallery",
    description: "Ruang eksperimental interaktif dimana mahakarya seni klasik dibangun ulang menggunakan komputasi digital.",
    url: "https://imgal.studio",
    siteName: "IMGAL Desktop Gallery",
    images: [{ url: "/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IMGAL | Interactive Digital Gallery",
    description: "Ruang eksperimental dimana mahakarya seni klasik dibangun ulang.",
    images: ["/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg"],
  }
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
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-amber-500/30">
        <GlobalBackground />
        <CustomCursor />
        <Preloader />
        <ScrollProgress />
        
        <SmoothScrollWrapper>
          <Navbar />
          <main className="flex-1 w-full relative z-10">
            {children}
          </main>
          <Footer />
        </SmoothScrollWrapper>
      </body>
    </html>
  );
}
