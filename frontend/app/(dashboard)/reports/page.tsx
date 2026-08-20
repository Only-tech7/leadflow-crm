"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const periods = ["Últimos 7 dias", "Últimos 30 dias", "Este trimestre"];

const monthlyPerformance = [
  { month: "Fev", leads: 34, conversions: 8 },
  { month: "Mar", leads: 46, conversions: 12 },
  { month: "Abr", leads: 52, conversions: 15 },
  { month: "Mai", leads: 61, conversions: 19 },
  { month: "Jun", leads: 73, conversions: 24 },
  { month: "Jul", leads: 89, conversions: 31 },
];

const leadSources = [
  {
    name: "LinkedIn",
    leads: 78,
    percentage: 36,
    conversion: "28%",
  },
  {
    name: "Indicação",
    leads: 53,
    percentage: 25,
    conversion: "42%",
  },
  {
    name: "Tráfego pago",
    leads: 41,
    percentage: 19,
    conversion: "24%",
  },
  {
    name: "WhatsApp",
    leads: 27,
    percentage: 13,
    conversion: "31%",
  },
  {
    name: "Outros",
    leads: 16,
    percentage: 7,
    conversion: "18%",
  },
];

const funnelStages = [
  {
    name: "Leads captados",
    value: 215,
    percentage: 100,
  },
  {
    name: "Qualificados",
    value: 148,
    percentage: 69,
  },
  {
    name: "Em contato",
    value: 96,
    percentage: 45,
  },
  {
    name: "Propostas enviadas",
    value: 54,
    percentage: 25,
  },
  {
    name: "Fechados",
    value: 31,
    percentage: 14,
  },
];

const teamPerformance = [
  {
    name: "Matheus Ferreira",
    initials: "MF",
    leads: 74,
    opportunities: 21,
    sales: 9,
    value: 128000,
    conversion: 12.2,
  },
  {
    name: "Gabriel Rocha",
    initials: "GR",
    leads: 68,
    opportunities: 19,
    sales: 8,
    value: 112000,
    conversion: 11.8,
  },
  {
    name: "André Martins",
    initials: "AM",
    leads: 51,
    opportunities: 14,
    sales: 6,
    value: 87000,
    conversion: 11.7,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Últimos 30 dias");

  const maxLeads = Math.max(
    ...monthlyPerformance.map((item) => item.leads)
  );

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
              <BarChart3 className="h-4 w-4" />
              Inteligência comercial
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
              Relatórios
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Acompanhe indicadores, conversões e desempenho da operação.
            </p>
          </div>

          <select
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
            className="h-11 rounded-xl border border-white/[0.08] bg-[#111113] px-4 text-sm text-zinc-300 outline-none"
          >
            {periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Leads captados"
            value="215"
            variation="+18,4%"
            positive
            icon={<Users className="h-5 w-5 text-violet-300" />}
          />

          <MetricCard
            title="Taxa de conversão"
            value="14,4%"
            variation="+2,1%"
            positive
            icon={<Target className="h-5 w-5 text-cyan-300" />}
          />

          <MetricCard
            title="Receita gerada"
            value="R$ 327 mil"
            variation="+23,7%"
            positive
            icon={
              <CircleDollarSign className="h-5 w-5 text-emerald-300" />
            }
          />

          <MetricCard
            title="Ciclo médio"
            value="18 dias"
            variation="-3 dias"
            positive
            icon={<TrendingUp className="h-5 w-5 text-amber-300" />}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-medium text-zinc-100">
                  Evolução comercial
                </h2>

                <p className="mt-1 text-sm text-zinc-600">
                  Leads captados e conversões mensais
                </p>
              </div>

              <span className="text-xs text-zinc-600">
                Fevereiro a julho
              </span>
            </div>

            <div className="mt-8 flex h-[280px] items-end gap-4">
              {monthlyPerformance.map((item) => {
                const leadHeight = (item.leads / maxLeads) * 220;
                const conversionHeight =
                  (item.conversions / maxLeads) * 220;

                return (
                  <div
                    key={item.month}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div className="flex h-[230px] items-end gap-1.5">
                      <div
                        style={{ height: `${leadHeight}px` }}
                        className="w-5 rounded-t-md bg-violet-500/70 transition hover:bg-violet-400"
                        title={`${item.leads} leads`}
                      />

                      <div
                        style={{
                          height: `${Math.max(
                            conversionHeight,
                            12
                          )}px`,
                        }}
                        className="w-5 rounded-t-md bg-emerald-500/70 transition hover:bg-emerald-400"
                        title={`${item.conversions} conversões`}
                      />
                    </div>

                    <span className="mt-3 text-xs text-zinc-600">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-5 border-t border-white/[0.05] pt-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-500/70" />
                Leads captados
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/70" />
                Conversões
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <h2 className="font-medium text-zinc-100">
              Origem dos leads
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Distribuição por canal de aquisição
            </p>

            <div className="mt-6 space-y-5">
              {leadSources.map((source) => (
                <div key={source.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-zinc-300">
                        {source.name}
                      </span>

                      <span className="ml-2 text-xs text-zinc-600">
                        {source.leads} leads
                      </span>
                    </div>

                    <span className="text-xs text-zinc-500">
                      Conversão {source.conversion}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      style={{ width: `${source.percentage}%` }}
                      className="h-full rounded-full bg-violet-500/70"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <h2 className="font-medium text-zinc-100">
              Funil de conversão
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Avanço dos leads pelas etapas comerciais
            </p>

            <div className="mt-6 space-y-4">
              {funnelStages.map((stage, index) => (
                <div key={stage.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      {stage.name}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-200">
                        {stage.value}
                      </span>

                      <span className="w-10 text-right text-xs text-zinc-600">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-9 overflow-hidden rounded-lg bg-white/[0.04]">
                    <div
                      style={{ width: `${stage.percentage}%` }}
                      className={`flex h-full items-center rounded-lg px-3 ${
                        index === funnelStages.length - 1
                          ? "bg-emerald-500/20"
                          : "bg-violet-500/15"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] p-5">
              <h2 className="font-medium text-zinc-100">
                Desempenho da equipe
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Resultados individuais no período selecionado
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Responsável
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Leads
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Oportunidades
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Vendas
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Receita
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teamPerformance.map((member) => (
                    <tr
                      key={member.name}
                      className="border-b border-white/[0.04] last:border-none"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-xs font-semibold text-zinc-300">
                            {member.initials}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-zinc-300">
                              {member.name}
                            </p>

                            <p className="mt-0.5 text-xs text-zinc-600">
                              {member.conversion}% de conversão
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {member.leads}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {member.opportunities}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {member.sales}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-zinc-300">
                        {formatCurrency(member.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  variation: string;
  positive: boolean;
  icon: React.ReactNode;
};

function MetricCard({
  title,
  value,
  variation,
  positive,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-zinc-500">{title}</span>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 text-xs font-medium ${
            positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}

          {variation}
        </span>

        <span className="text-xs text-zinc-700">
          em relação ao período anterior
        </span>
      </div>
    </div>
  );
}