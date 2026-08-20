"use client";

import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";

import {
  aiInsights,
  dashboardStats,
  dashboardSummary,
  monthlyGoal,
  pipelineStages,
  recentActivities,
  revenuePerformance,
  upcomingEvents,
} from "@/data/dashboard";

const statIcons = [CircleDollarSign, Target, BarChart3, Mail];

const activityIcons = {
  lead: Users,
  email: Mail,
  meeting: CalendarDays,
  proposal: CircleDollarSign,
};

const priorityStyles = {
  high: "border-red-500/20 bg-red-500/[0.06] text-red-300",
  medium: "border-amber-500/20 bg-amber-500/[0.06] text-amber-300",
  low: "border-zinc-500/20 bg-zinc-500/[0.06] text-zinc-300",
};

const maxRevenue = Math.max(
  ...revenuePerformance.map((performance) => performance.value),
);

const chartWidth = 620;
const chartHeight = 210;
const chartPaddingX = 20;
const chartPaddingY = 20;

const chartPoints = revenuePerformance.map((performance, index) => {
  const availableWidth = chartWidth - chartPaddingX * 2;
  const availableHeight = chartHeight - chartPaddingY * 2;

  const x =
    chartPaddingX +
    (index / (revenuePerformance.length - 1)) * availableWidth;

  const y =
    chartHeight -
    chartPaddingY -
    (performance.value / maxRevenue) * availableHeight;

  return {
    ...performance,
    x,
    y,
  };
});

const chartLine = chartPoints
  .map((point) => `${point.x},${point.y}`)
  .join(" ");

const chartArea = [
  `${chartPoints[0].x},${chartHeight - chartPaddingY}`,
  ...chartPoints.map((point) => `${point.x},${point.y}`),
  `${chartPoints[chartPoints.length - 1].x},${
    chartHeight - chartPaddingY
  }`,
].join(" ");

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Cabeçalho principal */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#111114] p-6 lg:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b3262d]/12 blur-[100px]" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#7d171c]/8 blur-[100px]" />

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b3262d]/30 bg-[#b3262d]/10 px-3 py-1.5 text-xs font-medium text-[#ef8b90]">
              <Sparkles className="h-3.5 w-3.5" />
              Resumo executivo da operação
            </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-100 lg:text-4xl">
                {dashboardSummary.greeting} 
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 lg:text-base">
                {dashboardSummary.message}
              </p>

               <button
                  type="button"
                  onClick={() => router.push("/intelligence")}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#d84a50] transition hover:text-[#ef8b90]"
                >
                  Ver recomendações estratégicas
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[430px]">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                  Receita potencial
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-zinc-100">
                  {dashboardSummary.potentialRevenue}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                  Oportunidades prioritárias
                </p>

                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-100">
                    {dashboardSummary.priorityOpportunities}
                  </p>

                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                    Atenção
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Indicadores */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat, index) => {
            const Icon = statIcons[index];

            return <StatCard key={stat.id} stat={stat} icon={Icon} />;
          })}
        </section>

        {/* Meta mensal + gráfico */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <article className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#111114] p-6">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#b3262d]/12 blur-[80px]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-zinc-100">
                    Meta comercial do mês
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Progresso consolidado da operação.
                  </p>
                </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#b3262d]/25 bg-[#b3262d]/10">
                  <Target className="h-5 w-5 text-[#e15b61]" />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Receita alcançada</p>

                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
                      {monthlyGoal.achievedFormatted}
                    </p>
                  </div>

                  <p className="text-2xl font-semibold text-[#e15b61]">
                    {monthlyGoal.percentage}%
                  </p>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7d171c] via-[#b3262d] to-[#e15b61] shadow-[0_0_20px_rgba(179,38,45,0.3)]"
                    style={{ width: `${monthlyGoal.percentage}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-600">R$ 0</span>
                  <span className="text-zinc-500">
                    Meta: {monthlyGoal.targetFormatted}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                    Falta para a meta
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-200">
                    {monthlyGoal.remainingFormatted}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-500/70">
                    Projeção de fechamento
                  </p>

                  <p className="mt-2 text-lg font-semibold text-emerald-300">
                    {monthlyGoal.projectedClosingFormatted}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                      Ticket médio
                    </p>

                    <p className="mt-2 text-lg font-semibold text-zinc-200">
                      {monthlyGoal.averageTicketFormatted}
                    </p>
                  </div>

                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/[0.07] bg-[#111114] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-zinc-100">
                  Evolução da receita potencial
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Crescimento acumulado nos últimos seis meses.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />
                +18,4% este mês
              </div>
            </div>

            <div className="mt-8 overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-[230px] w-full overflow-visible"
                role="img"
                aria-label="Gráfico de evolução da receita potencial"
              >
                <defs>
                  <linearGradient
                    id="revenueArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                   <stop offset="0%" stopColor="#b3262d" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#b3262d" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient
                    id="revenueLine"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#8f1d23" />
                    <stop offset="100%" stopColor="#e15b61" />
                  </linearGradient>

                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {[45, 90, 135, 180].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    y1={y}
                    x2="600"
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                ))}

                <polygon points={chartArea} fill="url(#revenueArea)" />

                <polyline
                  points={chartLine}
                  fill="none"
                  stroke="url(#revenueLine)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineGlow)"
                />

                {chartPoints.map((point) => (
                  <g key={point.month}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="7"
                      fill="#111114"
                      stroke="#d84a50"
                      strokeWidth="3"
                    />

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="#ffffff"
                    />
                  </g>
                ))}
              </svg>

              <div className="grid grid-cols-6 gap-2 px-1">
                {revenuePerformance.map((performance) => (
                  <div key={performance.month} className="text-center">
                    <p className="text-xs text-zinc-600">
                      {performance.month}
                    </p>

                    <p className="mt-1 text-xs font-medium text-zinc-400">
                      R$ {performance.value}k
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* Pipeline + IA */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <article className="rounded-3xl border border-white/[0.07] bg-[#111114] p-6 transition hover:border-white/[0.1]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-zinc-100">
                  Visão do pipeline
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Distribuição das oportunidades por etapa comercial.
                </p>
              </div>

            <button
             type="button"
               onClick={() => router.push("/pipeline")}
              className="group inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
>
              Abrir pipeline

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
                        </div>

            <div className="mt-8 space-y-6">
              {pipelineStages.map((stage) => (
                <div key={stage.id}>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {stage.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {stage.opportunities} oportunidades
                      </p>
                    </div>

                    <p className="text-sm font-medium text-zinc-300">
                      {stage.value}
                    </p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8f1d23] to-[#d84a50]"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-[#b3262d]/20 bg-[#141011] p-6">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#b3262d]/15 blur-[80px]" />

            <div className="relative">
              <div className="flex items-center gap-3">
                
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#b3262d]/25 bg-[#b3262d]/10">
                  <Sparkles className="h-5 w-5 text-[#e15b61]" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-zinc-100">
                    Inteligência comercial
                  </p>

                  <p className="text-xs text-zinc-500">
                    Análises estratégicas para hoje
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-zinc-200">
                        {insight.title}
                      </p>

                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-wider ${
                          priorityStyles[insight.priority]
                        }`}
                      >
                        {insight.priority === "high"
                          ? "Alta"
                          : insight.priority === "medium"
                            ? "Média"
                            : "Baixa"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {insight.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push("/intelligence")}
                      className="group mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#d84a50] transition hover:text-[#ef8b90]"
                    >
                      {insight.action}

                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* Atividades + agenda */}
        <section className="mt-6 grid gap-6 pb-8 xl:grid-cols-2">
          <article className="rounded-3xl border border-white/[0.07] bg-[#111114] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-zinc-100">
                  Atividades recentes
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Últimas movimentações da operação.
                </p>
              </div>

              <Activity className="h-5 w-5 text-zinc-600" />
            </div>

            <div className="mt-6 divide-y divide-white/[0.06]">
              {recentActivities.map((activity) => {
                const Icon = activityIcons[activity.type];

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035]">
                      <Icon className="h-4 w-4 text-[#d84a50]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-200">
                        {activity.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {activity.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-zinc-600">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-3xl border border-white/[0.07] bg-[#111114] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-zinc-100">
                  Próximos compromissos
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Reuniões, contatos e follow-ups.
                </p>
              </div>

              <CalendarDays className="h-5 w-5 text-zinc-600" />
            </div>

            <div className="mt-6 space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#b3262d]/15 bg-[#b3262d]/10">
                  <span className="text-xs font-medium text-[#e15b61]">
                      {event.date}
                    </span>

                    <span className="mt-1 text-sm font-semibold text-zinc-100">
                      {event.time}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200">
                      {event.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {event.company}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-zinc-700" />
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}