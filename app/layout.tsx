import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Header} from "./ui/header.tsx";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UT Lists",
  description: "Untitled ToDo Lists. Made by Shane Menzies",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <div className="grid grid-cols-[1fr_9fr] grid-rows-1 h-dvh">
            <div className="w-64 h-dvh"><Header /></div>
            <div className="md:p-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
