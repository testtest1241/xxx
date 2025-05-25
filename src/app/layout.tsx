import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kedi'nin Aşk Planı",
  description: "Pixel art aşk macerası",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
