import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Sidebar />

      <div className="min-h-screen lg:pl-64">
        <Header />

        <main>{children}</main>
      </div>
    </div>
  );
}