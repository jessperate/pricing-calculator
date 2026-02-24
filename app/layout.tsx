import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pricing Calculator",
  description: "Simple, transparent pricing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
