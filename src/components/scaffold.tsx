"use client";

import AppHeader from "./custom/app-header";

export function Scaffold({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
