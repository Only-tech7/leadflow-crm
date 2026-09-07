"use client";

import { Bell, Command, Search, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.055] bg-[#070708]/75 px-6 backdrop-blur-2xl lg:px-8">
      {/* Busca */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="group flex h-10 w-full max-w-lg items-center gap-3 border-b border-white/[0.08] px-1 transition focus-within:border-[#b3262d]/45">
          <Search className="h-4 w-4 shrink-0 text-zinc-700 transition group-focus-within:text-[#d84a50]" />

          <input
            type="text"
            placeholder="Pesquisar leads, empresas ou oportunidades..."
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-700"
          />

          <div className="hidden items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-700 sm:flex">
            <Command className="h-3 w-3" />
            K
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="ml-6 flex items-center gap-5">
        <button
          type="button"
          className="group hidden items-center gap-2 xl:flex"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#d84a50]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600 transition group-hover:text-zinc-300">
            3 sinais ativos
          </span>
        </button>

        <span className="hidden h-5 w-px bg-white/[0.06] xl:block" />

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center text-zinc-600 transition hover:text-zinc-200"
          aria-label="Notificações"
        >
          <Bell className="h-[17px] w-[17px]" />

          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#d84a50] shadow-[0_0_9px_rgba(216,74,80,0.75)]" />
        </button>

        <span className="hidden h-8 w-px bg-white/[0.06] sm:block" />

        <button
          type="button"
          className="group flex items-center gap-3"
        >
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-zinc-300 transition group-hover:text-white">
              Matheus Ferreira
            </p>

            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
              Admin / LF-01
            </p>
          </div>

          <div className="relative flex h-9 w-9 items-center justify-center border border-white/[0.08] bg-white/[0.025]">
            <span className="font-mono text-xs font-semibold text-zinc-300">
              M
            </span>

            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-[#09090b] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]" />
          </div>
        </button>
      </div>
    </header>
  );
}