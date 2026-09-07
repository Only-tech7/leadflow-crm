import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="leadflow-cinematic min-h-screen bg-[#070708] text-white">

      {/* ATMOSFERA GLOBAL */}
      <div
        className="leadflow-atmosphere"
        aria-hidden="true"
      >
        <div className="leadflow-grid" />

        <div className="leadflow-glow leadflow-glow-primary" />

        <div className="leadflow-glow leadflow-glow-secondary" />

        <div className="leadflow-light-beam" />

        <div className="leadflow-vignette" />

        <div className="leadflow-noise" />
      </div>

      {/* INTERFACE */}
      <div className="relative z-10 min-h-screen">
        <Sidebar />

        <div className="min-h-screen lg:pl-64">
          <Header />

          <main className="relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}