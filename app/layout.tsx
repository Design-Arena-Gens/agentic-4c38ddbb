import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lovable Project Previewer",
  description: "Preview metadata for a Lovable project URL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
