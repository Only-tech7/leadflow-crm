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
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
              <Building2 className="h-4 w-4" />
              Gestão comercial
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
              Empresas
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Acompanhe empresas, leads vinculados e oportunidades comerciais.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Nova empresa
          </button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Empresas cadastradas
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Building2 className="h-5 w-5 text-violet-300" />
              </div>
            </div>

            <p className="mt-5 text-3xl font-semibold text-zinc-100">
              {companies.length}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Contas monitoradas pelo LeadFlow
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Leads vinculados
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Users className="h-5 w-5 text-cyan-300" />
              </div>
            </div>

            <p className="mt-5 text-3xl font-semibold text-zinc-100">
              {totalLeads}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Contatos distribuídos entre empresas
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Oportunidades abertas
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <BriefcaseBusiness className="h-5 w-5 text-emerald-300" />
              </div>
            </div>

            <p className="mt-5 text-3xl font-semibold text-zinc-100">
              {totalOpportunities}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Negociações em andamento
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-medium text-zinc-100">
                Lista de empresas
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Visualize o desempenho comercial de cada conta.
              </p>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar empresa..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-10 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-white/[0.15] focus:bg-white/[0.05]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Empresa
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Leads
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Oportunidades
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Responsável
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Última interação
                  </th>

                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="group border-b border-white/[0.04] transition last:border-none hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-sm font-semibold text-zinc-300">
                          {company.initials}
                        </div>

                        <div>
                          <p className="font-medium text-zinc-200">
                            {company.name}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {company.segment}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-zinc-300">
                        {company.leads}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-zinc-300">
                        {company.opportunities}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-zinc-400">
                        {company.owner}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                          statusStyles[company.status]
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-zinc-500">
                        {company.lastInteraction}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
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

          <div className="border-t border-white/[0.06] px-5 py-4">
            <p className="text-sm text-zinc-600">
              Exibindo{" "}
              <span className="font-medium text-zinc-400">
                {filteredCompanies.length}
              </span>{" "}
              de{" "}
              <span className="font-medium text-zinc-400">
                {companies.length}
              </span>{" "}
              empresas
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}