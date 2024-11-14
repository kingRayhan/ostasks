import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Scaffold } from "@/components/scaffold";
import React, { PropsWithChildren } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OsBugs",
  description: "A bug tracker for Open Source projects",
};

const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Scaffold>{children}</Scaffold>
      </body>
    </html>
  );
};

export default AppLayout;
