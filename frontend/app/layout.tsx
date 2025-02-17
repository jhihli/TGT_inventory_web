"use client"
import '@/app/ui/global.css';
import {inter} from "@/app/ui/fonts"
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
    </SessionProvider>
  );
}
