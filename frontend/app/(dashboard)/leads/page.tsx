"use client";

import { useMemo, useState } from "react";
import { crmLeads, saveLeads, sendLeadToPipeline } from "@/data/crm";

import {
  Activity,
  ArrowDownUp,
  Building2,
  ChevronDown,
  Download,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import { AddLeadModal, type NewLeadData } from "@/components/leads/AddLeadModal";
import { LeadDrawer } from "@/components/leads/LeadDrawer";

const statusStyles: Record<string, string> = {
  Qualificado:
    "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300",
  "Em contato":
    "border-[#b3262d]/20 bg-[#b3262d]/10 text-[#ef8b90]",
  Novo: "border-zinc-500/20 bg-zinc-500/[0.08] text-zinc-300",
  "Aguardando retorno":
    "border-amber-500/20 bg-amber-500/[0.08] text-amber-300",
  "Sem resposta":
    "border-red-500/20 bg-red-500/[0.08] text-red-300",
};

function getScoreStyle(score: number) {
  if (score >= 85) {
    return "bg-emerald-400";
  }

  if (score >= 70) {
    return "bg-[#d84a50]";
  }

  return "bg-amber-400";
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [originFilter, setOriginFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("score-desc");

  const [selectedLead, setSelectedLead] =
    useState<(typeof crmLeads)[number] | null>(null);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadList, setLeadList] = useState(crmLeads);
  const [successMessage, setSuccessMessage] = useState("");

  const dynamicLeadStats = useMemo(() => {
    const qualified = leadList.filter((lead) => lead.status === "Qualificado").length;
    const attention = leadList.filter(
      (lead) => lead.status === "Sem resposta" || lead.status === "Aguardando retorno",
    ).length;
    const averageScore = leadList.length
      ? Math.round(leadList.reduce((total, lead) => total + lead.score, 0) / leadList.length)
      : 0;

    return [
      { title: "Leads ativos", value: String(leadList.length), description: "Contatos nesta base comercial", icon: Users },
      { title: "Qualificados", value: String(qualified), description: "Prontos para avanço comercial", icon: UserCheck },
      { title: "Atenção", value: String(attention), description: "Retorno ou resposta pendente", icon: Activity },
      { title: "Score médio", value: String(averageScore), description: "Prioridade média da base", icon: Target },
    ];
  }, [leadList]);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = leadList.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.name.toLowerCase().includes(normalizedSearch) ||
        lead.role.toLowerCase().includes(normalizedSearch) ||
        lead.company.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" || lead.status === statusFilter;

      const matchesOrigin =
        originFilter === "Todas" || lead.origin === originFilter;

      return matchesSearch && matchesStatus && matchesOrigin;
    });

    return [...result].sort((firstLead, secondLead) => {
      if (sortBy === "score-desc") {
        return secondLead.score - firstLead.score;
      }

      if (sortBy === "score-asc") {
        return firstLead.score - secondLead.score;
      }

      if (sortBy === "name") {
        return firstLead.name.localeCompare(secondLead.name);
      }

      if (sortBy === "company") {
        return firstLead.company.localeCompare(secondLead.company);
      }

      return 0;
    });
  }, [leadList, searchTerm, statusFilter, originFilter, sortBy]);

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "Todos" ||
    originFilter !== "Todas";

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("Todos");
    setOriginFilter("Todas");
    setSortBy("score-desc");
  }

    function handleAddLead(newLead: NewLeadData) {
  const initials = newLead.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const lead = {
    id: Date.now(),
    ...newLead,
    initials,
  };

  setLeadList((currentLeads) => {
    const updatedLeads = [lead, ...currentLeads];

    saveLeads(updatedLeads);

    return updatedLeads;
  });

  const pipelineResult = sendLeadToPipeline(lead);

  if (pipelineResult.success) {
    setSuccessMessage(
      `${newLead.name} foi adicionado e enviado para o Pipeline.`,
    );
  } else {
    setSuccessMessage(
      `${newLead.name} foi adicionado. A oportunidade já existia no Pipeline.`,
    );
  }

  window.setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
}


  return (
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      {successMessage && (
        <div className="fixed right-6 top-24 z-[100] flex items-center gap-3 border border-emerald-500/20 bg-[#0c110e]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <UserCheck className="h-4 w-4 text-emerald-300" />
          <div>
            <p className="text-sm font-medium text-zinc-100">Lead adicionado</p>
            <p className="mt-0.5 text-xs text-zinc-400">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1600px]">
        <section className="border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                <span className="text-[#d84a50]">02 / LEAD DATABASE</span>
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="text-zinc-600">Acquisition / Live</span>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-zinc-100 lg:text-5xl">
                Base <span className="block text-zinc-500">Comercial</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Centralize contatos, identifique prioridades e transforme leads qualificados em oportunidades acompanháveis no Pipeline.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="inline-flex h-10 items-center gap-2 border border-white/[0.08] bg-white/[0.018] px-4 text-sm text-zinc-400 transition hover:border-white/[0.15] hover:text-zinc-100">
                <Upload className="h-4 w-4" /> Importar
              </button>
              <button type="button" onClick={() => setIsAddLeadModalOpen(true)} className="inline-flex h-10 items-center gap-2 border border-[#b3262d]/60 bg-[#b3262d] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(179,38,45,0.18)] transition hover:bg-[#c62c34]">
                <Plus className="h-4 w-4" /> Adicionar lead
              </button>
            </div>
          </div>
        </section>

        <section className="grid border-b border-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          {dynamicLeadStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <article key={stat.title} className={`relative py-6 sm:px-5 xl:px-6 ${index === 0 ? "sm:pl-0 xl:pl-0" : ""} ${index < 3 ? "xl:border-r xl:border-white/[0.06]" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">{String(index + 1).padStart(2, "0")} / {stat.title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">{stat.value}</p>
                    <p className="mt-2 text-xs text-zinc-500">{stat.description}</p>
                  </div>
                  <Icon className="mt-1 h-4 w-4 text-[#b3262d]" />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-7">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#d84a50] shadow-[0_0_12px_rgba(216,74,80,0.65)]" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Lead Registry / {filteredLeads.length} visible</p>
              </div>
              <p className="mt-2 text-sm text-zinc-400">Base ativa e priorizada para operação comercial.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="group flex h-10 min-w-[280px] items-center gap-3 border-b border-white/[0.1] px-1 transition focus-within:border-[#b3262d]/55">
                <Search className="h-4 w-4 shrink-0 text-zinc-600 group-focus-within:text-[#d84a50]" />
                <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Nome, empresa ou cargo..." className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-700" />
                {searchTerm && <button type="button" onClick={() => setSearchTerm("")} className="text-zinc-600 hover:text-zinc-300"><X className="h-4 w-4" /></button>}
              </div>

              <div className="relative">
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 appearance-none border border-white/[0.08] bg-[#0c0c0f]/80 pl-3 pr-9 text-xs text-zinc-400 outline-none focus:border-[#b3262d]/45">
                  <option value="Todos">Todos os status</option><option value="Qualificado">Qualificado</option><option value="Em contato">Em contato</option><option value="Novo">Novo</option><option value="Aguardando retorno">Aguardando retorno</option><option value="Sem resposta">Sem resposta</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              </div>

              <div className="relative">
                <select value={originFilter} onChange={(event) => setOriginFilter(event.target.value)} className="h-10 appearance-none border border-white/[0.08] bg-[#0c0c0f]/80 pl-3 pr-9 text-xs text-zinc-400 outline-none focus:border-[#b3262d]/45">
                  <option value="Todas">Todas as origens</option><option value="LinkedIn">LinkedIn</option><option value="Indicação">Indicação</option><option value="Site">Site</option><option value="Campanha">Campanha</option><option value="Apollo">Apollo</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              </div>

              <div className="relative">
                <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 appearance-none border border-white/[0.08] bg-[#0c0c0f]/80 pl-9 pr-9 text-xs text-zinc-400 outline-none focus:border-[#b3262d]/45">
                  <option value="score-desc">Maior score</option><option value="score-asc">Menor score</option><option value="name">Nome</option><option value="company">Empresa</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              </div>

              {hasActiveFilters && <button type="button" onClick={clearFilters} className="inline-flex h-10 items-center gap-2 border border-[#b3262d]/20 bg-[#b3262d]/[0.05] px-3 text-xs text-[#ef8b90]"><X className="h-3.5 w-3.5" /> Limpar</button>}
              <button type="button" className="inline-flex h-10 items-center gap-2 border border-white/[0.08] px-3 text-xs text-zinc-500 hover:text-zinc-200"><Download className="h-3.5 w-3.5" /> Exportar</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead><tr className="border-b border-white/[0.06] text-left">
                {["Lead","Empresa","Origem","Score comercial","Status","Próxima ação","Responsável"].map((heading) => <th key={heading} className="px-4 py-4 font-mono text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-600 first:pl-0">{heading}</th>)}
                <th className="w-14 px-4 py-4" />
              </tr></thead>
              <tbody className="divide-y divide-white/[0.055]">
                {filteredLeads.map((lead, index) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="group cursor-pointer transition hover:bg-white/[0.018]">
                    <td className="py-4 pl-0 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-[#b3262d]/20 bg-[#b3262d]/[0.055] font-mono text-[10px] font-semibold text-[#ef8b90]">{lead.initials}<span className="absolute -left-px top-0 h-2 w-px bg-[#d84a50]" /></div>
                        <div><div className="flex items-center gap-2"><span className="font-mono text-[8px] text-zinc-700">{String(index + 1).padStart(2,"0")}</span><p className="text-sm font-medium text-zinc-200">{lead.name}</p></div><p className="mt-1 text-xs text-zinc-500">{lead.role}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2 text-sm text-zinc-400"><Building2 className="h-3.5 w-3.5 text-zinc-600" />{lead.company}</div></td>
                    <td className="px-4 py-4"><span className="border border-white/[0.07] bg-white/[0.018] px-2.5 py-1.5 text-xs text-zinc-400">{lead.origin}</span></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="h-1 w-16 overflow-hidden bg-white/[0.06]"><div className={`h-full ${getScoreStyle(lead.score)}`} style={{width:`${lead.score}%`}} /></div><span className="font-mono text-xs font-medium text-zinc-300">{lead.score}</span></div></td>
                    <td className="px-4 py-4"><span className={`inline-flex border px-2.5 py-1.5 text-xs font-medium ${statusStyles[lead.status]}`}>{lead.status}</span></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2 text-sm text-zinc-400"><Mail className="h-3.5 w-3.5 text-zinc-600" />{lead.nextAction}</div></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center border border-white/[0.07] bg-white/[0.025] font-mono text-[9px] font-semibold text-zinc-300">{lead.owner.slice(0,1)}</div><span className="text-sm text-zinc-400">{lead.owner}</span></div></td>
                    <td className="px-4 py-4 text-right"><button type="button" onClick={(event)=>event.stopPropagation()} className="inline-flex h-8 w-8 items-center justify-center text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-200"><MoreHorizontal className="h-4 w-4" /></button></td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && <tr><td colSpan={8} className="px-6 py-20 text-center"><Search className="mx-auto h-5 w-5 text-zinc-600" /><p className="mt-5 text-sm font-medium text-zinc-300">Nenhum lead encontrado</p><button type="button" onClick={clearFilters} className="mt-5 border border-white/[0.08] px-4 py-2 text-xs text-zinc-300">Limpar filtros</button></td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/[0.07] py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs text-zinc-400">Exibindo {filteredLeads.length} de {leadList.length} leads</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">Registry / current environment</p></div>
            <div className="flex items-center gap-1">
              <button type="button" className="h-8 border border-white/[0.07] px-3 text-xs text-zinc-500">Anterior</button>
              <button type="button" className="h-8 min-w-8 border border-[#b3262d]/35 bg-[#b3262d]/10 px-3 font-mono text-xs text-[#ef8b90]">1</button>
              <button type="button" className="h-8 min-w-8 border border-white/[0.07] px-3 font-mono text-xs text-zinc-500">2</button>
              <button type="button" className="h-8 min-w-8 border border-white/[0.07] px-3 font-mono text-xs text-zinc-500">3</button>
              <button type="button" className="h-8 border border-white/[0.07] px-3 text-xs text-zinc-500">Próxima</button>
            </div>
          </div>
        </section>

        <LeadDrawer lead={selectedLead} isOpen={selectedLead !== null} onClose={() => setSelectedLead(null)} />
        <AddLeadModal isOpen={isAddLeadModalOpen} onClose={() => setIsAddLeadModalOpen(false)} onAddLead={handleAddLead} />
      </div>
    </div>
  );
}