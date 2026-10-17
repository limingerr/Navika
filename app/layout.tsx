import type { Metadata } from "next";
import { AppProvider } from "@/components/app-provider";
import "./globals.css";
import "./design.css";

export const metadata: Metadata = {
  title: "NAVIKA — Temukan peluangmu",
  description: "Jelajahi peluang beasiswa, magang, dan bootcamp untuk mahasiswa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
