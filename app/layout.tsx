import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingo — Traduce tus PDF",
  description:
    "Sube tu documento PDF y prepáralo para traducirlo a otro idioma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
