import * as React from "react";
import { Header } from "../components/organism/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export function PageLayout({
  children,
  pageTitle,
  pageDescription,
}: DashboardLayoutProps) {
  const handleLogoutSimulated = () => {
    console.log("Sesi user dibersihkan.");
  };

  return (
    <div className="min-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300 text-zinc-900 dark:text-zinc-50">
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          title={pageTitle}
          description={pageDescription}
          onLogout={handleLogoutSimulated}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8  w-full mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
