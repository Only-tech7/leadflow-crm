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
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      <style jsx>{`
        @keyframes report-rise {
          from { transform: scaleY(.08); opacity: .15; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes report-line {
          0%, 100% { opacity: .25; }
          50% { opacity: .75; }
        }
        .report-bar {
          transform-origin: bottom;
          animation: report-rise 900ms cubic-bezier(.2,.8,.2,1) both;
        }
        .report-signal {
          animation: report-line 3.2s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-[1600px]">
        <header className="border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                <span className="text-[#d84a50]">07 / PERFORMANCE REPORTS</span>
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="text-zinc-600">Executive Analytics</span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-zinc-100 lg:text-5xl">
                Performance
                <span className="block text-zinc-500">Comercial</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Consolidação executiva de aquisição, conversão, receita e
                desempenho da equipe comercial.
              </p>
            </div>

            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-700">
                Analysis period
              </p>
              <select
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
                className="h-10 min-w-[190px] border border-white/[0.08] bg-[#0b0b0d]/90 px-3 text-xs text-zinc-300 outline-none transition focus:border-[#b3262d]/40"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <section className="grid border-b border-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Leads captados",
              value: "215",
              variation: "+18,4%",
              icon: Users,
            },
            {
              title: "Taxa de conversão",
              value: "14,4%",
              variation: "+2,1%",
              icon: Target,
            },
            {
              title: "Receita gerada",
              value: "R$ 327 mil",
              variation: "+23,7%",
              icon: CircleDollarSign,
            },
            {
              title: "Ciclo médio",
              value: "18 dias",
              variation: "-3 dias",
              icon: TrendingUp,
            },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.title}
                className={`py-6 sm:px-5 xl:px-6 ${
                  index === 0 ? "sm:pl-0 xl:pl-0" : ""
                } ${index < 3 ? "xl:border-r xl:border-white/[0.06]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-zinc-600">
                      KPI 0{index + 1} / {metric.title}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-zinc-100">
                      {metric.value}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                        {index === 3 ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {metric.variation}
                      </span>
                      <span className="text-[10px] text-zinc-700">vs. período anterior</span>
                    </div>
                  </div>
                  <Icon className="mt-1 h-4 w-4 text-[#d84a50]" />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.55fr_0.85fr]">
          <div className="border-b border-white/[0.07] pb-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
                  Commercial Trajectory
                </p>
                <h2 className="mt-2 text-lg font-medium text-zinc-100">
                  Evolução comercial
                </h2>
                <p className="mt-1 text-xs text-zinc-600">
                  Leads captados e conversões mensais
                </p>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
                Fev — Jul
              </span>
            </div>

            <div className="relative mt-8 h-[290px] border-b border-l border-white/[0.07]">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((line) => (
                  <span key={line} className="block h-px w-full bg-white/[0.035]" />
                ))}
              </div>

              <div className="absolute inset-x-4 bottom-0 top-4 flex items-end gap-4">
                {monthlyPerformance.map((item, index) => {
                  const leadHeight = (item.leads / maxLeads) * 220;
                  const conversionHeight =
                    (item.conversions / maxLeads) * 220;

                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="flex h-[230px] items-end gap-2">
                        <div
                          style={{
                            height: `${leadHeight}px`,
                            animationDelay: `${index * 90}ms`,
                          }}
                          className="report-bar relative w-4 bg-[#b3262d]/65 transition hover:bg-[#d84a50]"
                          title={`${item.leads} leads`}
                        >
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-zinc-600">
                            {item.leads}
                          </span>
                        </div>

                        <div
                          style={{
                            height: `${Math.max(conversionHeight, 12)}px`,
                            animationDelay: `${index * 90 + 120}ms`,
                          }}
                          className="report-bar w-4 bg-emerald-500/55 transition hover:bg-emerald-400"
                          title={`${item.conversions} conversões`}
                        />
                      </div>

                      <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-5">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                <span className="h-px w-5 bg-[#d84a50]" />
                Leads
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                <span className="h-px w-5 bg-emerald-400" />
                Conversões
              </div>
            </div>
          </div>

          <div className="border-b border-white/[0.07] pb-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
              Acquisition Mix
            </p>
            <h2 className="mt-2 text-lg font-medium text-zinc-100">
              Origem dos leads
            </h2>
            <p className="mt-1 text-xs text-zinc-600">
              Distribuição e eficiência por canal
            </p>

            <div className="mt-7 divide-y divide-white/[0.055]">
              {leadSources.map((source, index) => (
                <div key={source.name} className="py-4 first:pt-0">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[8px] text-zinc-700">
                          0{index + 1}
                        </span>
                        <span className="text-sm text-zinc-300">{source.name}</span>
                      </div>
                      <span className="mt-1 block text-xs text-zinc-600">
                        {source.leads} leads
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-zinc-300">
                        {source.percentage}%
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        conv. {source.conversion}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-px bg-white/[0.07]">
                    <div
                      style={{ width: `${source.percentage}%` }}
                      className="report-signal h-px bg-[#d84a50]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[0.85fr_1.45fr]">
          <div>
            <div className="border-b border-white/[0.07] pb-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
                Conversion Flow
              </p>
              <h2 className="mt-2 text-lg font-medium text-zinc-100">
                Funil de conversão
              </h2>
              <p className="mt-1 text-xs text-zinc-600">
                Avanço dos leads pelas etapas comerciais
              </p>
            </div>

            <div className="mt-5 space-y-5">
              {funnelStages.map((stage, index) => (
                <div key={stage.name}>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8px] text-zinc-700">
                        0{index + 1}
                      </span>
                      <span className="text-sm text-zinc-400">{stage.name}</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-sm font-medium text-zinc-200">
                        {stage.value}
                      </span>
                      <span className="w-9 text-right font-mono text-[9px] text-zinc-600">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 h-[5px] bg-white/[0.045]">
                    <div
                      style={{ width: `${stage.percentage}%` }}
                      className={`h-full ${
                        index === funnelStages.length - 1
                          ? "bg-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.25)]"
                          : "bg-[#b3262d]/65"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between border-b border-white/[0.07] pb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
                  Team Performance
                </p>
                <h2 className="mt-2 text-lg font-medium text-zinc-100">
                  Desempenho da equipe
                </h2>
                <p className="mt-1 text-xs text-zinc-600">
                  Resultados individuais no período selecionado
                </p>
              </div>
              <BarChart3 className="h-4 w-4 text-zinc-600" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Responsável", "Leads", "Oportunidades", "Vendas", "Receita"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-4 py-4 text-left font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-600 first:pl-0"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.055]">
                  {teamPerformance.map((member, index) => (
                    <tr
                      key={member.name}
                      className="transition hover:bg-white/[0.018]"
                    >
                      <td className="py-4 pl-0 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-9 w-9 items-center justify-center border border-[#b3262d]/20 bg-[#b3262d]/[0.05] font-mono text-[9px] font-semibold text-[#ef8b90]">
                            {member.initials}
                            <span className="absolute -left-px top-0 h-2 w-px bg-[#d84a50]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[8px] text-zinc-700">
                                0{index + 1}
                              </span>
                              <p className="text-sm font-medium text-zinc-300">
                                {member.name}
                              </p>
                            </div>
                            <p className="mt-1 text-[10px] text-zinc-600">
                              {member.conversion}% conversão
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-zinc-400">
                        {member.leads}
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-zinc-400">
                        {member.opportunities}
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-zinc-400">
                        {member.sales}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-zinc-200">
                        {formatCurrency(member.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-white/[0.07] py-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
            LeadFlow analytics / {selectedPeriod}
          </p>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Report synchronized
          </div>
        </footer>
      </div>
    </div>
  );
}