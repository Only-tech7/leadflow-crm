"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Bot,
  Building2,
  ChevronRight,
  KanbanSquare,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

const navigationSections = [
  {
    title: "Visão geral",
    items: [
      {
        title: "Visão Geral",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Prospecção",
    items: [
      {
        title: "Leads",
        href: "/leads",
        icon: Users,
      },
      {
        title: "Empresas",
        href: "/companies",
        icon: Building2,
      },
    ],
  },
  {
    title: "Execução",
    items: [
      {
        title: "Pipeline",
        href: "/pipeline",
        icon: KanbanSquare,
      },
      {
        title: "Campanhas",
        href: "/campaigns",
        icon: Mail,
      },
    ],
  },
  {
    title: "Inteligência",
    items: [
      {
        title: "Inteligência Comercial",
        href: "/intelligence",
        icon: Bot,
      },
      {
        title: "Relatórios",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.08] bg-[#151515] lg:flex">
      {/* Marca */}
      <div className="flex h-20 items-center border-b border-white/[0.08] px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#b3262d]/30 bg-[#b3262d]/10">
            <div className="absolute inset-0 rounded-xl bg-[#b3262d]/10 blur-lg" />

            <Sparkles className="relative h-5 w-5 text-[#d84a50]" />
          </div>

          <div>
            <p className="text-base font-semibold tracking-[-0.02em] text-white">
              LeadFlow
            </p>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              Inteligência Comercial
            </p>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 ${
                        active
                          ? "bg-[#b3262d] text-white shadow-[0_10px_28px_rgba(179,38,45,0.22)]"
                          : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-100"
                      }`}
                    >
                      {active && (
                        <span className="absolute -left-3 h-5 w-0.5 rounded-r-full bg-[#ef6b70]" />
                      )}

                      <Icon
                        className={`h-[18px] w-[18px] transition ${
                          active
                            ? "text-white"
                            : "text-zinc-600 group-hover:text-zinc-300"
                        }`}
                      />

                      <span className="min-w-0 flex-1 truncate font-medium">
                        {item.title}
                      </span>

                      {active && (
                        <ChevronRight className="h-3.5 w-3.5 text-red-100" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Configurações */}
      <div className="border-t border-white/[0.08] p-3">
        <Link
          href="/settings"
          className={`group flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition ${
            pathname.startsWith("/settings")
              ? "bg-[#b3262d] text-white"
              : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-100"
          }`}
        >
          <Settings
            className={`h-[18px] w-[18px] transition ${
              pathname.startsWith("/settings")
                ? "text-white"
                : "text-zinc-600 group-hover:text-zinc-300"
            }`}
          />

          <span className="font-medium">Configurações</span>
        </Link>
      </div>

      {/* Empresa ativa */}
      <div className="border-t border-white/[0.08] p-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9343b] to-[#7d171c] text-xs font-bold text-white shadow-[0_8px_20px_rgba(179,38,45,0.2)]">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-100">
                Acton Experience
              </p>

              <p className="mt-0.5 text-[10px] text-zinc-500">
                Ambiente personalizado
              </p>
            </div>

            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}