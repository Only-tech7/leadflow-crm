"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BrainCircuit,
  Building2,
  KanbanSquare,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

const navigationSections = [
  {
    index: "01",
    title: "Comando",
    items: [
      {
        title: "Visão Geral",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    index: "02",
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
    index: "03",
    title: "Execução",
    items: [
      {
        title: "Pipeline",
        href: "/pipeline",
        icon: KanbanSquare,
      },
      {
        title: "Clientes",
        href: "/customers",
        icon: UserCheck,
      },
      {
        title: "Campanhas",
        href: "/campaigns",
        icon: Mail,
      },
    ],
  },
  {
    index: "04",
    title: "Inteligência",
    items: [
      {
        title: "Inteligência Comercial",
        href: "/intelligence",
        icon: BrainCircuit,
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
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-[#09090b]/88 backdrop-blur-2xl lg:flex">
      {/* Marca */}
      <div className="relative flex h-24 items-center border-b border-white/[0.06] px-6">
        <div className="absolute left-0 top-0 h-24 w-px bg-gradient-to-b from-[#b3262d] via-[#b3262d]/40 to-transparent" />

        <Link href="/dashboard" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center border border-[#b3262d]/25 bg-[#b3262d]/[0.06]">
            <div className="absolute inset-0 bg-[#b3262d]/10 blur-xl" />
            <Sparkles className="relative h-4 w-4 text-[#d84a50]" />
          </div>

          <div>
            <p className="font-mono text-sm font-semibold tracking-[0.02em] text-zinc-100">
              LEADFLOW
            </p>

            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">
              Sales Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-7">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <div className="mb-3 flex items-center gap-3 px-2">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#b3262d]">
                  {section.index}
                </span>

                <span className="h-px flex-1 bg-white/[0.05]" />

                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                  {section.title}
                </p>
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex h-10 items-center gap-3 px-3 text-sm transition-all duration-200 ${
                        active
                          ? "text-white"
                          : "text-zinc-500 hover:text-zinc-100"
                      }`}
                    >
                      {active && (
                        <>
                          <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-[#d84a50] shadow-[0_0_14px_rgba(216,74,80,0.75)]" />

                          <span className="absolute inset-y-1 left-0 w-24 bg-gradient-to-r from-[#b3262d]/10 to-transparent" />
                        </>
                      )}

                      <Icon
                        className={`relative h-[16px] w-[16px] transition ${
                          active
                            ? "text-[#e15b61]"
                            : "text-zinc-600 group-hover:text-zinc-300"
                        }`}
                      />

                      <span
                        className={`relative min-w-0 flex-1 truncate ${
                          active ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.title}
                      </span>

                      {active && (
                        <span className="relative h-1 w-1 rounded-full bg-[#d84a50] shadow-[0_0_10px_rgba(216,74,80,0.9)]" />
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
      <div className="border-t border-white/[0.06] px-4 py-3">
        <Link
          href="/settings"
          className={`group relative flex h-10 items-center gap-3 px-3 text-sm transition ${
            pathname.startsWith("/settings")
              ? "text-white"
              : "text-zinc-600 hover:text-zinc-200"
          }`}
        >
          {pathname.startsWith("/settings") && (
            <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-[#d84a50]" />
          )}

          <Settings
            className={`h-[16px] w-[16px] transition ${
              pathname.startsWith("/settings")
                ? "text-[#e15b61]"
                : "text-zinc-700 group-hover:text-zinc-400"
            }`}
          />

          <span>Configurações</span>
        </Link>
      </div>

      {/* Workspace */}
      <div className="border-t border-white/[0.06] px-5 py-5">
        <div className="relative">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-zinc-700">
            Workspace / Active
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-[#b3262d]/20 bg-[#b3262d]/[0.06]">
              <span className="font-mono text-xs font-semibold text-zinc-200">
                A
              </span>

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-[#09090b] bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.55)]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-300">
                Acton Experience
              </p>

              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-700">
                Environment 01
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}