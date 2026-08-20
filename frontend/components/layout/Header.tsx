"use client";

import { Bell, Command, Search, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#09090b]/90 px-6 backdrop-blur-xl lg:px-8">
      {/* Busca */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="group flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 transition focus-within:border-blue-500/40 focus-within:bg-white/[0.04] focus-within:ring-4 focus-within:ring-blue-500/[0.06]">
          <Search className="h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-blue-400" />

          <input
            type="text"
            placeholder="Pesquisar leads, empresas ou oportunidades..."
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
          />

          <div className="hidden items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.035] px-1.5 py-1 text-[10px] text-zinc-600 sm:flex">
            <Command className="h-3 w-3" />
            K
          </div>
        </div>
      </div>

      {/* Perfil e ações */}
      <div className="ml-6 flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/[0.06] px-3 py-1.5 text-xs text-blue-300 xl:flex">
          <Sparkles className="h-3.5 w-3.5" />
          3 novos insights
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-zinc-200"
          aria-label="Notificações"
        >
          <Bell className="h-[18px] w-[18px]" />

          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-[#09090b]" />
        </button>

        <div className="mx-1 hidden h-8 w-px bg-white/[0.07] sm:block" />

        <button
          type="button"
          className="group flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-white/[0.035]"
        >
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-zinc-200">
              Matheus Ferreira
            </p>

            <p className="mt-0.5 text-[10px] text-zinc-600">
              Administrador
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]">
            M
          </div>
        </button>
      </div>
    </header>
  );
}