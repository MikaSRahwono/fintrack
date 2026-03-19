import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { MonthProvider } from "@/context/MonthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Toast from "@/components/ui/Toast";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500", "600"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FinTrack — Personal Finance OS",
  description: "Refined dark fintech dashboard for personal finance tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body className="bg-bg text-text font-sans overflow-hidden h-screen">
        <MonthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 bg-bg">
                {children}
              </main>
            </div>
          </div>
          <Toast />
        </MonthProvider>
      </body>
    </html>
  );
}
