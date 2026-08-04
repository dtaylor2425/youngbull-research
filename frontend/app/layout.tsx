import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Young Bull Research",
  description: "Stock research for the physical layer of AI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
