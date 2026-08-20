import type { ReactNode } from "react";

import AppLayout from "@/components/layout/AppLayout";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}