import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Digital",
  description: "Seu cartão de visita digital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}