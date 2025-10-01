"use client";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-full relative">
      <div className="hidden md:flex md:w-[200px] md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      <main className="md:pl-[200px] h-full">
        <Navbar />
        <div className="">{children}</div>
      </main>
    </div>
  );
}