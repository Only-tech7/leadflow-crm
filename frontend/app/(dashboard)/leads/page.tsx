"use client";

import { useMemo, useState } from "react";
import { crmLeads, saveLeads, sendLeadToPipeline } from "@/data/crm";

import {
  ArrowDownUp,
  Building2,
  ChevronDown,
  Download,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import { AddLeadModal, type NewLeadData } from "@/components/leads/AddLeadModal";
import { LeadDrawer } from "@/components/leads/LeadDrawer";

const leadStats = [
  {
    title: "Total de leads",
    value: "248",
    description: "32 adicionados neste mês",
    icon: Users,
  },
  {
    title: "Leads qualificados",
    value: "86",
    description: "34,6% da base comercial",
    icon: UserCheck,
  },
  {
    title: "Precisam de atenção",
    value: "17",
    description: "Sem contato há mais de 5 dias",
    icon: Sparkles,
  },
  {
    title: "Conversão estimada",
    value: "31,8%",
    description: "+4,2% em relação ao mês anterior",
    icon: Building2,
  },
];




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
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      {successMessage && (
        <div className="fixed right-6 top-6 z-[100] flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-[#111814] px-4 py-3 shadow-2xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
            <UserCheck className="h-4 w-4 text-emerald-300" />
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-100">
              Lead adicionado
            </p>

            <p className="mt-0.5 text-xs text-zinc-500">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1600px]">
        {/* Cabeçalho */}
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#b3262d]/25 bg-[#b3262d]/10 px-3 py-1.5 text-xs font-medium text-[#ef8b90]">
              <Sparkles className="h-3.5 w-3.5" />
              Base comercial centralizada
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
              Leads
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Centralize contatos, acompanhe prioridades e organize as próximas
              ações de cada oportunidade comercial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
            >
              <Upload className="h-4 w-4" />
              Importar leads
            </button>

            <button
              type="button"
              onClick={() => setIsAddLeadModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b3262d] px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(179,38,45,0.22)] transition hover:bg-[#971f26]"
            >
              <Plus className="h-4 w-4" />
              Adicionar lead
            </button>
          </div>
        </section>

        {/* Indicadores */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {leadStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="rounded-3xl border border-white/[0.07] bg-[#111114] p-5 transition hover:border-white/[0.12] hover:bg-[#131317]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">{stat.title}</p>

                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#b3262d]/20 bg-[#b3262d]/10">
                    <Icon className="h-5 w-5 text-[#d84a50]" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-zinc-600">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </section>

        {/* Área principal */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#111114]">
          {/* Filtros */}
          <div className="border-b border-white/[0.07] p-4 lg:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <div className="flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 transition focus-within:border-[#b3262d]/45 focus-within:ring-4 focus-within:ring-[#b3262d]/[0.07]">
                  <Search className="h-4 w-4 shrink-0 text-zinc-600" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Pesquisar por nome, empresa ou cargo..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-zinc-600 transition hover:text-zinc-300"
                      aria-label="Limpar pesquisa"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-10 appearance-none rounded-xl border border-white/[0.07] bg-[#151519] pl-3 pr-10 text-sm text-zinc-400 outline-none transition hover:border-white/[0.12] focus:border-[#b3262d]/45"
                  >
                    <option value="Todos">Todos os status</option>
                    <option value="Qualificado">Qualificado</option>
                    <option value="Em contato">Em contato</option>
                    <option value="Novo">Novo</option>
                    <option value="Aguardando retorno">
                      Aguardando retorno
                    </option>
                    <option value="Sem resposta">Sem resposta</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>

                <div className="relative">
                  <select
                    value={originFilter}
                    onChange={(event) => setOriginFilter(event.target.value)}
                    className="h-10 appearance-none rounded-xl border border-white/[0.07] bg-[#151519] pl-3 pr-10 text-sm text-zinc-400 outline-none transition hover:border-white/[0.12] focus:border-[#b3262d]/45"
                  >
                    <option value="Todas">Todas as origens</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Site">Site</option>
                    <option value="Campanha">Campanha</option>
                    <option value="Apollo">Apollo</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#b3262d]/20 bg-[#b3262d]/[0.06] px-3 text-sm text-[#ef8b90] transition hover:bg-[#b3262d]/10"
                  >
                    <X className="h-4 w-4" />
                    Limpar filtros
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-10 appearance-none rounded-xl border border-white/[0.07] bg-[#151519] pl-9 pr-9 text-sm text-zinc-400 outline-none transition hover:border-white/[0.12] focus:border-[#b3262d]/45"
                  >
                    <option value="score-desc">Maior score</option>
                    <option value="score-asc">Menor score</option>
                    <option value="name">Nome</option>
                    <option value="company">Empresa</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-sm text-zinc-400 transition hover:border-white/[0.12] hover:text-zinc-200"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.015] text-left">
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Lead
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Empresa
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Origem
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Score comercial
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Próxima ação
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Responsável
                  </th>

                  <th className="w-16 px-5 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.055]">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="group cursor-pointer transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#b3262d]/20 bg-gradient-to-br from-[#b3262d] to-[#74161b] text-xs font-semibold text-white shadow-[0_8px_20px_rgba(179,38,45,0.16)]">
                          {lead.initials}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            {lead.name}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {lead.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Building2 className="h-4 w-4 text-zinc-700" />
                        {lead.company}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-xs text-zinc-400">
                        {lead.origin}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className={`h-full rounded-full ${getScoreStyle(
                              lead.score,
                            )}`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>

                        <span className="text-sm font-medium text-zinc-300">
                          {lead.score}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1.5 text-xs font-medium ${
                          statusStyles[lead.status]
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Mail className="h-4 w-4 text-zinc-700" />
                        {lead.nextAction}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.05] text-[10px] font-semibold text-zinc-300">
                          {lead.owner.slice(0, 1)}
                        </div>

                        <span className="text-sm text-zinc-400">
                          {lead.owner}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-200"
                        aria-label={`Abrir ações de ${lead.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                          <Search className="h-6 w-6 text-zinc-600" />
                        </div>

                        <p className="mt-5 text-sm font-medium text-zinc-300">
                          Nenhum lead encontrado
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                          Não encontramos contatos que correspondam aos filtros
                          selecionados.
                        </p>

                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06]"
                        >
                          Limpar filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Rodapé */}
          <div className="flex flex-col gap-4 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-zinc-500">
                Exibindo {filteredLeads.length} de {leadList.length} leads desta
                visualização
              </p>

              <p className="mt-1 text-[10px] text-zinc-700">
                248 contatos cadastrados na base completa
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-9 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-200"
              >
                Anterior
              </button>

              <button
                type="button"
                className="h-9 min-w-9 rounded-xl bg-[#b3262d] px-3 text-xs font-medium text-white shadow-[0_8px_18px_rgba(179,38,45,0.18)]"
              >
                1
              </button>

              <button
                type="button"
                className="h-9 min-w-9 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-200"
              >
                2
              </button>

              <button
                type="button"
                className="h-9 min-w-9 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-200"
              >
                3
              </button>

              <button
                type="button"
                className="h-9 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-zinc-500 transition hover:border-white/[0.12] hover:text-zinc-200"
              >
                Próxima
              </button>
            </div>
          </div>
        </section>

        <LeadDrawer
          lead={selectedLead}
          isOpen={selectedLead !== null}
          onClose={() => setSelectedLead(null)}
        />

        <AddLeadModal
          isOpen={isAddLeadModalOpen}
          onClose={() => setIsAddLeadModalOpen(false)}
          onAddLead={handleAddLead}
        />
      </div>
    </div>
  );
}
