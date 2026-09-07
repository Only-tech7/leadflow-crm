"use client";

import {
  Building2,
  Search,
  Plus,
  Users,
  BriefcaseBusiness,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";

const companies = [
  {
    id: 1,
    name: "Acton Experience",
    segment: "Eventos e experiências",
    leads: 18,
    opportunities: 6,
    owner: "Matheus Ferreira",
    status: "Ativa",
    lastInteraction: "Hoje, 10:32",
    initials: "AE",
  },
  {
    id: 2,
    name: "Farmácia Araujo",
    segment: "Varejo farmacêutico",
    leads: 12,
    opportunities: 4,
    owner: "Gabriel Rocha",
    status: "Ativa",
    lastInteraction: "Ontem, 16:20",
    initials: "FA",
  },
  {
    id: 3,
    name: "Cine Brasil",
    segment: "Cultura e eventos",
    leads: 9,
    opportunities: 2,
    owner: "André Martins",
    status: "Em negociação",
    lastInteraction: "22 jul, 14:10",
    initials: "CB",
  },
  {
    id: 4,
    name: "Grupo Horizonte",
    segment: "Tecnologia",
    leads: 7,
    opportunities: 3,
    owner: "Matheus Ferreira",
    status: "Ativa",
    lastInteraction: "21 jul, 09:45",
    initials: "GH",
  },
  {
    id: 5,
    name: "Instituto Aurora",
    segment: "Educação",
    leads: 5,
    opportunities: 1,
    owner: "Gabriel Rocha",
    status: "Inativa",
    lastInteraction: "18 jul, 11:30",
    initials: "IA",
  },
];

const statusStyles: Record<string, string> = {
  Ativa:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  "Em negociação":
    "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Inativa:
    "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
};

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return companies;
    }

    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(normalizedSearch) ||
        company.segment.toLowerCase().includes(normalizedSearch) ||
        company.owner.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  const totalLeads = companies.reduce(
    (total, company) => total + company.leads,
    0
  );

  const totalOpportunities = companies.reduce(
    (total, company) => total + company.opportunities,
    0
  );

  return (
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      <div className="mx-auto max-w-[1600px]">
        {/* ACCOUNT CONTROL HEADER */}
        <header className="border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                <span className="text-[#d84a50]">03 / ACCOUNT DATABASE</span>
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="text-zinc-600">Organizations / Active</span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-zinc-100 lg:text-5xl">
                Contas
                <span className="block text-zinc-500">Comerciais</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Organize empresas, contatos vinculados e oportunidades em andamento
                para acompanhar cada relacionamento comercial em um único ambiente.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#b3262d]/60 bg-[#b3262d] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(179,38,45,0.18)] transition hover:bg-[#c62c34]"
            >
              <Plus className="h-4 w-4" />
              Nova empresa
            </button>
          </div>
        </header>

        {/* ACCOUNT METRICS */}
        <section className="grid border-b border-white/[0.07] md:grid-cols-3">
          {[
            {
              label: "Empresas cadastradas",
              value: companies.length,
              description: "Contas monitoradas pelo LeadFlow",
              icon: Building2,
            },
            {
              label: "Leads vinculados",
              value: totalLeads,
              description: "Contatos distribuídos entre empresas",
              icon: Users,
            },
            {
              label: "Oportunidades abertas",
              value: totalOpportunities,
              description: "Negociações em andamento",
              icon: BriefcaseBusiness,
            },
          ].map((metric, index) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className={`py-6 md:px-6 ${
                  index === 0 ? "md:pl-0" : ""
                } ${index < 2 ? "md:border-r md:border-white/[0.06]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                      0{index + 1} / {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {metric.description}
                    </p>
                  </div>

                  <Icon className="mt-1 h-4 w-4 text-[#b3262d]" />
                </div>
              </article>
            );
          })}
        </section>

        {/* ACCOUNT REGISTRY */}
        <section className="mt-7">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#d84a50] shadow-[0_0_12px_rgba(216,74,80,0.65)]" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                  Account Registry / {filteredCompanies.length} visible
                </p>
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                Visão consolidada das organizações presentes na operação comercial.
              </p>
            </div>

            <div className="group flex h-10 w-full items-center gap-3 border-b border-white/[0.1] px-1 transition focus-within:border-[#b3262d]/55 md:w-[340px]">
              <Search className="h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-[#d84a50]" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Empresa, segmento ou responsável..."
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  {[
                    "Empresa",
                    "Leads",
                    "Oportunidades",
                    "Responsável",
                    "Status",
                    "Última interação",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-4 font-mono text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-600 first:pl-0"
                    >
                      {heading}
                    </th>
                  ))}

                  <th className="w-24 px-4 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.055]">
                {filteredCompanies.map((company, index) => (
                  <tr
                    key={company.id}
                    className="group relative transition duration-200 hover:bg-white/[0.018]"
                  >
                    <td className="py-4 pl-0 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-[#b3262d]/20 bg-[#b3262d]/[0.055] font-mono text-[10px] font-semibold text-[#ef8b90]">
                          {company.initials}
                          <span className="absolute -left-px top-0 h-2 w-px bg-[#d84a50]" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[8px] text-zinc-700">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <p className="font-medium text-zinc-200">
                              {company.name}
                            </p>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {company.segment}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="font-mono text-sm font-medium text-zinc-300">
                          {company.leads}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="font-mono text-sm font-medium text-zinc-300">
                          {company.opportunities}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-zinc-400">
                        {company.owner}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex border px-2.5 py-1 text-xs font-medium ${
                          statusStyles[company.status]
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-zinc-400">
                        {company.lastInteraction}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:bg-white/[0.04] hover:text-[#ef8b90]"
                          aria-label={`Abrir ${company.name}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:bg-white/[0.04] hover:text-zinc-300"
                          aria-label={`Mais opções de ${company.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCompanies.length === 0 && (
            <div className="border-b border-white/[0.06] py-16 text-center">
              <Search className="mx-auto h-5 w-5 text-zinc-600" />
              <p className="mt-4 text-sm font-medium text-zinc-300">
                Nenhuma empresa encontrada
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Tente pesquisar por outro nome, segmento ou responsável.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/[0.07] py-4">
            <div>
              <p className="text-xs text-zinc-400">
                Exibindo {filteredCompanies.length} de {companies.length} empresas
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
                Account database / current environment
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Registry online
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}