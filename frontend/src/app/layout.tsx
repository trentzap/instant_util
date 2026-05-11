import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instant.Utilities",
  description: "Multi-tenant property management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="max-w-[480px] w-full mx-auto min-h-screen bg-[var(--surface)] relative shadow-[var(--shadow-custom)] ring-1 ring-[var(--border)]">
          {children}
        </div>
      </body>
    </html>
  );
}
