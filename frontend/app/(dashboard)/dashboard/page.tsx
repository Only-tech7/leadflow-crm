"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Mail,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Settings2,
  X,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";

import {
  getPipelineOpportunities,
  getStoredCustomers,
  type CrmCustomer,
  type PipelineOpportunity,
  type ProductType,
} from "@/data/crm";

import {
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


const baseAchievedRevenue = monthlyGoal.achieved;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

const pipelineStageLabels: Record<string, string> = {
  novo: "Novas oportunidades",
  qualificado: "Qualificação",
  contato: "Contato iniciado",
  proposta: "Proposta enviada",
  negociacao: "Negociação",
  fechado: "Fechado",
};

type GoalKey = "Todos" | ProductType;

type GoalConfig = Record<GoalKey, number>;

const DEFAULT_GOALS: GoalConfig = {
  Todos: 500000,
  Roupas: 20000,
  Canecas: 35000,
  Livros: 50000,
};

const GOALS_STORAGE_KEY = "leadflow-dashboard-goals";


type IntelligencePriority = "high" | "medium" | "low";

type IntelligenceInsight = {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: IntelligencePriority;
};

type MessageTone = "Profissional" | "Direto" | "Consultivo";

function getStageRecommendation(stage: PipelineOpportunity["stage"]) {
  const recommendations: Record<PipelineOpportunity["stage"], string> = {
    novo: "Realizar o primeiro contato e validar necessidade, prazo e orçamento.",
    qualificado: "Avançar para uma conversa comercial e aprofundar o contexto da oportunidade.",
    contato: "Fazer follow-up e conduzir o lead para uma proposta objetiva.",
    proposta: "Retomar a proposta, investigar objeções e definir o próximo passo.",
    negociacao: "Priorizar o fechamento e alinhar os últimos pontos comerciais.",
    fechado: "Manter relacionamento e identificar novas oportunidades de expansão.",
  };

  return recommendations[stage];
}

export default function DashboardPage() {
  const router = useRouter();

  const [pipelineOpportunities, setPipelineOpportunities] = useState<
    PipelineOpportunity[]
  >([]);
  const [customers, setCustomers] = useState<CrmCustomer[]>([]);
  const [crmLoaded, setCrmLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<"Todos" | ProductType>("Todos");
  const [goals, setGoals] = useState<GoalConfig>(DEFAULT_GOALS);
  const [draftGoals, setDraftGoals] = useState<GoalConfig>(DEFAULT_GOALS);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [messageTone, setMessageTone] = useState<MessageTone>("Profissional");
  const [copiedMessage, setCopiedMessage] = useState<"whatsapp" | "email" | null>(null);

  useEffect(() => {
    setPipelineOpportunities(getPipelineOpportunities());
    setCustomers(getStoredCustomers());

    const storedGoals = window.localStorage.getItem(GOALS_STORAGE_KEY);

    if (storedGoals) {
      try {
        const parsedGoals = {
          ...DEFAULT_GOALS,
          ...JSON.parse(storedGoals),
        } as GoalConfig;

        setGoals(parsedGoals);
        setDraftGoals(parsedGoals);
      } catch {
        setGoals(DEFAULT_GOALS);
        setDraftGoals(DEFAULT_GOALS);
      }
    }

    setCrmLoaded(true);
  }, []);

  const filteredPipeline = useMemo(
    () => selectedProduct === "Todos"
      ? pipelineOpportunities
      : pipelineOpportunities.filter((opportunity) => opportunity.product === selectedProduct),
    [pipelineOpportunities, selectedProduct],
  );

  const filteredCustomers = useMemo(
    () => selectedProduct === "Todos"
      ? customers
      : customers.filter((customer) => customer.product === selectedProduct),
    [customers, selectedProduct],
  );

  const activePipeline = useMemo(
    () =>
      filteredPipeline.filter(
        (opportunity) => opportunity.stage !== "fechado",
      ),
    [filteredPipeline],
  );

  const realizedRevenue = useMemo(
    () => filteredCustomers.reduce((total, customer) => total + customer.value, 0),
    [filteredCustomers],
  );

  const activePipelineValue = useMemo(
    () =>
      activePipeline.reduce(
        (total, opportunity) => total + opportunity.value,
        0,
      ),
    [activePipeline],
  );

  const activeOpportunities = activePipeline.length;

  const priorityOpportunities = activePipeline.filter(
    (opportunity) => opportunity.priority === "Alta",
  ).length;

  const convertedCustomers = filteredCustomers.length;

  const conversionRate =
    filteredPipeline.length > 0
      ? (convertedCustomers / filteredPipeline.length) * 100
      : 0;

  const customerAverageTicket =
    convertedCustomers > 0 ? realizedRevenue / convertedCustomers : 0;

  const currentGoalTarget = goals[selectedProduct];

  const currentAchievedRevenue =
    selectedProduct === "Todos"
      ? baseAchievedRevenue + realizedRevenue
      : realizedRevenue;

  const goalPercentage =
    currentGoalTarget > 0
      ? (currentAchievedRevenue / currentGoalTarget) * 100
      : 0;

  const goalRemaining = Math.max(
    currentGoalTarget - currentAchievedRevenue,
    0,
  );

  const projectedClosing =
    currentAchievedRevenue + activePipelineValue;

  const lastCustomer = filteredCustomers[0] ?? null;

  function openGoalModal() {
    setDraftGoals(goals);
    setIsGoalModalOpen(true);
  }

  function saveGoals() {
    setGoals(draftGoals);
    window.localStorage.setItem(
      GOALS_STORAGE_KEY,
      JSON.stringify(draftGoals),
    );
    setIsGoalModalOpen(false);
  }

  const recommendedOpportunity = useMemo(() => {
    if (activePipeline.length === 0) {
      return null;
    }

    return [...activePipeline].sort((a, b) => {
      const aScore =
        a.probability * 2 +
        (a.priority === "Alta" ? 30 : a.priority === "Média" ? 15 : 0) +
        Math.min(a.value / 1000, 30);

      const bScore =
        b.probability * 2 +
        (b.priority === "Alta" ? 30 : b.priority === "Média" ? 15 : 0) +
        Math.min(b.value / 1000, 30);

      return bScore - aScore;
    })[0];
  }, [activePipeline]);

  const lowProbabilityOpportunities = useMemo(
    () => activePipeline.filter((opportunity) => opportunity.probability < 70),
    [activePipeline],
  );

  const lowProbabilityValue = useMemo(
    () =>
      lowProbabilityOpportunities.reduce(
        (total, opportunity) => total + opportunity.value,
        0,
      ),
    [lowProbabilityOpportunities],
  );

  const advancedPipelineValue = useMemo(
    () =>
      activePipeline
        .filter((opportunity) =>
          ["proposta", "negociacao"].includes(opportunity.stage),
        )
        .reduce((total, opportunity) => total + opportunity.value, 0),
    [activePipeline],
  );

  const canReachGoal = projectedClosing >= currentGoalTarget;

  const dynamicAiInsights = useMemo<IntelligenceInsight[]>(() => {
    if (!crmLoaded) {
      return [];
    }

    const context =
      selectedProduct === "Todos" ? "operação geral" : selectedProduct;

    const insights: IntelligenceInsight[] = [];

    if (recommendedOpportunity) {
      insights.push({
        id: "best-opportunity",
        title: `${recommendedOpportunity.company} merece prioridade`,
        description: `${recommendedOpportunity.name} representa ${formatCurrency(
          recommendedOpportunity.value,
        )}, está em ${pipelineStageLabels[recommendedOpportunity.stage]} e possui ${recommendedOpportunity.probability}% de probabilidade. ${getStageRecommendation(
          recommendedOpportunity.stage,
        )}`,
        action: "Gerar abordagem",
        priority: "high",
      });
    }

    insights.push({
      id: "goal-analysis",
      title: canReachGoal
        ? `A meta de ${context} está ao alcance`
        : `A meta de ${context} exige atenção`,
      description: canReachGoal
        ? `O realizado mais o pipeline aberto projeta ${formatCurrency(
            projectedClosing,
          )}, suficiente para superar a meta de ${formatCurrency(
            currentGoalTarget,
          )}.`
        : `A projeção atual é ${formatCurrency(
            projectedClosing,
          )}. Ainda existe uma diferença de ${formatCurrency(
            Math.max(currentGoalTarget - projectedClosing, 0),
          )} para a meta definida.`,
      action: "Analisar operação",
      priority: canReachGoal ? "medium" : "high",
    });

    if (lowProbabilityOpportunities.length > 0) {
      insights.push({
        id: "risk",
        title: `${lowProbabilityOpportunities.length} oportunidade${
          lowProbabilityOpportunities.length > 1 ? "s" : ""
        } em zona de atenção`,
        description: `${formatCurrency(
          lowProbabilityValue,
        )} do pipeline está em oportunidades com probabilidade abaixo de 70%. Vale revisar abordagem, timing e objeções.`,
        action: "Ver diagnóstico",
        priority: "medium",
      });
    } else {
      insights.push({
        id: "advanced-pipeline",
        title: "Pipeline com boa qualidade comercial",
        description:
          advancedPipelineValue > 0
            ? `${formatCurrency(
                advancedPipelineValue,
              )} já está concentrado entre proposta e negociação. O foco recomendado é acelerar fechamento.`
            : "Não há oportunidades abaixo de 70% de probabilidade neste recorte. Mantenha a cadência comercial.",
        action: "Ver diagnóstico",
        priority: "low",
      });
    }

    return insights.slice(0, 3);
  }, [
    advancedPipelineValue,
    canReachGoal,
    crmLoaded,
    currentGoalTarget,
    lowProbabilityOpportunities.length,
    lowProbabilityValue,
    projectedClosing,
    recommendedOpportunity,
    selectedProduct,
  ]);

  const suggestedMessages = useMemo(() => {
    if (!recommendedOpportunity) {
      return { whatsapp: "", subject: "", email: "" };
    }

    const firstName = recommendedOpportunity.name.split(" ")[0];
    const product = recommendedOpportunity.product.toLowerCase();
    const company = recommendedOpportunity.company;
    const stage = recommendedOpportunity.stage;

    const whatsappByTone: Record<MessageTone, string> = {
      Profissional:
        stage === "proposta" || stage === "negociacao"
          ? `Olá, ${firstName}! Tudo bem? Estou entrando em contato para darmos continuidade à nossa conversa sobre ${product} para a ${company}. Queria entender se conseguiu avaliar os pontos que alinhamos e se existe algo que possamos ajustar para avançarmos.`
          : `Olá, ${firstName}! Tudo bem? Estou entrando em contato para darmos continuidade ao interesse da ${company} em ${product}. Separei algumas informações que podem ajudar nos próximos passos. Podemos conversar rapidamente?`,
      Direto:
        stage === "proposta" || stage === "negociacao"
          ? `Oi, ${firstName}! Conseguiu avaliar nossa proposta de ${product} para a ${company}? Se houver algum ponto pendente, me fala por aqui e já alinhamos para avançar.`
          : `Oi, ${firstName}! Vi o interesse da ${company} em ${product} e queria avançar com você. Podemos falar rapidamente hoje?`,
      Consultivo:
        `Olá, ${firstName}! Tudo bem? Revendo o contexto da ${company} e o interesse em ${product}, acredito que podemos estruturar uma solução bem alinhada ao que vocês precisam. Antes de avançarmos, queria entender se surgiu alguma nova necessidade ou prioridade desde nosso último contato.`,
    };

    const subject =
      stage === "proposta" || stage === "negociacao"
        ? `Próximos passos | ${company}`
        : `${recommendedOpportunity.product} | ${company}`;

    const emailByTone: Record<MessageTone, string> = {
      Profissional: `Olá, ${firstName}!\n\nEstou entrando em contato para darmos continuidade à nossa conversa sobre ${product} para a ${company}.\n\nCom base no contexto da oportunidade, acredito que podemos avançar para a próxima etapa e alinhar os pontos necessários para seguirmos com segurança.\n\nFico à disposição para conversarmos sobre os próximos passos.`,
      Direto: `Olá, ${firstName}!\n\nQuero dar continuidade à oportunidade de ${product} para a ${company}. Podemos alinhar os pontos pendentes e definir o próximo passo?\n\nSe preferir, podemos resolver por aqui mesmo.`,
      Consultivo: `Olá, ${firstName}!\n\nRevendo nossa conversa e o cenário da ${company}, acredito que a solução de ${product} pode ser estruturada de forma bastante aderente à necessidade de vocês.\n\nAntes de avançarmos, gostaria de entender se houve alguma mudança de prioridade, prazo ou escopo para que possamos conduzir a próxima etapa da melhor forma.\n\nFico à disposição.`,
    };

    return {
      whatsapp: whatsappByTone[messageTone],
      subject,
      email: emailByTone[messageTone],
    };
  }, [messageTone, recommendedOpportunity]);

  async function copySuggestedText(
    type: "whatsapp" | "email",
    content: string,
  ) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessage(type);
      window.setTimeout(() => setCopiedMessage(null), 1800);
    } catch {
      setCopiedMessage(null);
    }
  }

  const dynamicDashboardStats = useMemo(
    () =>
      dashboardStats.map((stat) => {
        if (!crmLoaded) {
          return stat;
        }

        if (stat.id === "potential-revenue") {
          return {
            ...stat,
            value: formatCurrency(activePipelineValue),
            variation: `${activeOpportunities} oportunidades`,
            trend: "neutral" as const,
            description: "Valor atual das oportunidades abertas",
          };
        }

        if (stat.id === "active-opportunities") {
          return {
            ...stat,
            value: String(activeOpportunities),
            variation: `${priorityOpportunities} prioritárias`,
            trend:
              activeOpportunities > 0
                ? ("up" as const)
                : ("neutral" as const),
            description: "Oportunidades atualmente no funil",
          };
        }

        if (stat.id === "conversion-rate") {
          return {
            ...stat,
            value: `${conversionRate.toFixed(1).replace(".", ",")}%`,
            variation: `${convertedCustomers} clientes`,
            trend:
              convertedCustomers > 0
                ? ("up" as const)
                : ("neutral" as const),
            description: "Conversões registradas na demonstração",
          };
        }

        return stat;
      }),
    [
      activeOpportunities,
      activePipelineValue,
      conversionRate,
      convertedCustomers,
      crmLoaded,
      priorityOpportunities,
    ],
  );

  const dynamicPipelineStages = useMemo(() => {
    if (!crmLoaded || filteredPipeline.length === 0) {
      return pipelineStages;
    }

    const stages = [
      "novo",
      "qualificado",
      "contato",
      "proposta",
      "negociacao",
      "fechado",
    ];

    const grouped = stages.map((stage) => {
      const opportunities = filteredPipeline.filter(
        (opportunity) => opportunity.stage === stage,
      );

      const stageValue = opportunities.reduce(
        (total, opportunity) => total + opportunity.value,
        0,
      );

      return {
        id: stage,
        name: pipelineStageLabels[stage] ?? stage,
        opportunities: opportunities.length,
        rawValue: stageValue,
      };
    });

    const maxStageValue = Math.max(
      ...grouped.map((stage) => stage.rawValue),
      1,
    );

    return grouped.map((stage) => ({
      id: stage.id,
      name: stage.name,
      opportunities: stage.opportunities,
      value: formatCurrency(stage.rawValue),
      percentage: Math.max(
        stage.rawValue > 0
          ? Math.round((stage.rawValue / maxStageValue) * 100)
          : 0,
        0,
      ),
    }));
  }, [crmLoaded, filteredPipeline]);

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
                {crmLoaded
                  ? `Hoje existem ${activeOpportunities} oportunidades abertas, ${priorityOpportunities} prioritárias e ${convertedCustomers} clientes convertidos na demonstração.`
                  : dashboardSummary.message}
              </p>

               <button
                  type="button"
                  onClick={() => setIsIntelligenceOpen(true)}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#d84a50] transition hover:text-[#ef8b90]"
                >
                  Analisar operação
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[430px]">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                  Receita potencial
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-zinc-100">
                  {crmLoaded
                    ? formatCurrency(activePipelineValue)
                    : dashboardSummary.potentialRevenue}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                  Oportunidades prioritárias
                </p>

                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-100">
                    {crmLoaded
                      ? priorityOpportunities
                      : dashboardSummary.priorityOpportunities}
                  </p>

                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                    Atenção
                  </span>
                </div>
              </div>
            </div>
          </div>

          {crmLoaded && lastCustomer && (
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
                    Último fechamento
                  </p>

                  <p className="mt-2 text-sm font-semibold text-zinc-100">
                    {lastCustomer.company}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {lastCustomer.name} · {lastCustomer.product} ·{" "}
                    {lastCustomer.campaign}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xl font-semibold text-emerald-300">
                    {formatCurrency(lastCustomer.value)}
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    Convertido em cliente
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Filtro por produto */}
        <section className="mt-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#111114] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                Visualizar operação
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {selectedProduct === "Todos"
                  ? "Visão consolidada de todos os produtos"
                  : `Indicadores comerciais de ${selectedProduct}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["Todos", "Roupas", "Canecas", "Livros"] as const).map((product) => {
                const active = selectedProduct === product;
                return (
                  <button
                    key={product}
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-[#b3262d]/50 bg-[#b3262d]/15 text-[#ef8b90]"
                        : "border-white/[0.07] bg-white/[0.025] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"
                    }`}
                  >
                    {product === "Todos" ? "Geral" : product}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Indicadores */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dynamicDashboardStats.map((stat, index) => {
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
                    {selectedProduct === "Todos"
                      ? "Meta comercial geral do mês"
                      : `Meta comercial — ${selectedProduct}`}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {selectedProduct === "Todos"
                      ? "Progresso consolidado de toda a operação."
                      : `Acompanhamento exclusivo da meta de ${selectedProduct}.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openGoalModal}
                  className="flex h-11 items-center gap-2 rounded-xl border border-[#b3262d]/25 bg-[#b3262d]/10 px-3 text-xs font-medium text-[#ef8b90] transition hover:bg-[#b3262d]/15"
                >
                  <Settings2 className="h-4 w-4" />
                  Definir metas
                </button>
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Receita alcançada</p>

                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
                      {crmLoaded
                        ? formatCurrency(currentAchievedRevenue)
                        : monthlyGoal.achievedFormatted}
                    </p>
                  </div>

                  <p className="text-2xl font-semibold text-[#e15b61]">
                    {crmLoaded
                      ? `${goalPercentage.toFixed(1).replace(".", ",")}%`
                      : `${monthlyGoal.percentage}%`}
                  </p>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7d171c] via-[#b3262d] to-[#e15b61] shadow-[0_0_20px_rgba(179,38,45,0.3)]"
                    style={{
                      width: `${Math.min(
                        crmLoaded ? goalPercentage : monthlyGoal.percentage,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-600">R$ 0</span>
                  <span className="text-zinc-500">
                    Meta: {formatCurrency(currentGoalTarget)}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                    Falta para a meta
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-200">
                    {crmLoaded
                      ? formatCurrency(goalRemaining)
                      : monthlyGoal.remainingFormatted}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-500/70">
                    Projeção de fechamento
                  </p>

                  <p className="mt-2 text-lg font-semibold text-emerald-300">
                    {crmLoaded
                      ? formatCurrency(projectedClosing)
                      : monthlyGoal.projectedClosingFormatted}
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
                      {crmLoaded
                      ? convertedCustomers > 0
                        ? formatCurrency(customerAverageTicket)
                        : "R$ 0"
                      : monthlyGoal.averageTicketFormatted}
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
              {dynamicPipelineStages.map((stage) => (
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
                {dynamicAiInsights.map((insight) => (
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
                      onClick={() => setIsIntelligenceOpen(true)}
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

      {isIntelligenceOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar inteligência comercial"
            onClick={() => setIsIntelligenceOpen(false)}
            className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[100] overflow-y-auto px-4 py-6 lg:py-10">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#101013] shadow-[0_35px_120px_rgba(0,0,0,0.7)]">
              <div className="flex items-start justify-between border-b border-white/[0.07] px-6 py-5 lg:px-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b3262d]/25 bg-[#b3262d]/10 px-3 py-1.5 text-xs font-medium text-[#ef8b90]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Inteligência comercial
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-zinc-100">
                    Análise da operação
                    {selectedProduct !== "Todos" ? ` · ${selectedProduct}` : ""}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                    Diagnóstico gerado a partir das oportunidades, probabilidades,
                    metas e fechamentos registrados no CRM.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsIntelligenceOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                        Pipeline aberto
                      </p>
                      <p className="mt-2 text-xl font-semibold text-zinc-100">
                        {formatCurrency(activePipelineValue)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                        Meta atual
                      </p>
                      <p className="mt-2 text-xl font-semibold text-zinc-100">
                        {formatCurrency(currentGoalTarget)}
                      </p>
                    </div>
                  </div>

                  {recommendedOpportunity ? (
                    <div className="rounded-3xl border border-[#b3262d]/20 bg-[#b3262d]/[0.055] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ef8b90]">
                        Oportunidade recomendada
                      </p>

                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-zinc-100">
                            {recommendedOpportunity.company}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {recommendedOpportunity.name} ·{" "}
                            {recommendedOpportunity.product}
                          </p>
                        </div>

                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1 text-xs font-medium text-emerald-300">
                          {recommendedOpportunity.probability}%
                        </span>
                      </div>

                      <p className="mt-5 text-2xl font-semibold text-zinc-100">
                        {formatCurrency(recommendedOpportunity.value)}
                      </p>

                      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/15 p-4">
                        <p className="text-xs font-medium text-zinc-400">
                          Próxima ação recomendada
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {getStageRecommendation(recommendedOpportunity.stage)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5">
                      <p className="text-sm text-zinc-400">
                        Não existem oportunidades abertas neste recorte para gerar
                        uma recomendação comercial.
                      </p>
                    </div>
                  )}

                  <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5">
                    <p className="text-sm font-semibold text-zinc-200">
                      Diagnóstico
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d84a50]" />
                        <p className="text-sm leading-6 text-zinc-500">
                          {canReachGoal
                            ? `A projeção de ${formatCurrency(
                                projectedClosing,
                              )} permite alcançar a meta atual.`
                            : `A projeção atual ainda fica ${formatCurrency(
                                Math.max(
                                  currentGoalTarget - projectedClosing,
                                  0,
                                ),
                              )} abaixo da meta.`}
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                        <p className="text-sm leading-6 text-zinc-500">
                          {lowProbabilityOpportunities.length > 0
                            ? `${lowProbabilityOpportunities.length} oportunidade(s), somando ${formatCurrency(
                                lowProbabilityValue,
                              )}, estão abaixo de 70% de probabilidade.`
                            : "Nenhuma oportunidade aberta está abaixo de 70% de probabilidade neste recorte."}
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                        <p className="text-sm leading-6 text-zinc-500">
                          {advancedPipelineValue > 0
                            ? `${formatCurrency(
                                advancedPipelineValue,
                              )} já está entre proposta e negociação.`
                            : "Ainda não existem valores concentrados nas etapas finais do funil."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/[0.07] bg-[#131316] p-5 lg:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-[#e15b61]" />
                        <p className="text-base font-semibold text-zinc-100">
                          Assistente de abordagem
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        Mensagens sugeridas para a oportunidade prioritária.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(["Profissional", "Direto", "Consultivo"] as const).map(
                        (tone) => (
                          <button
                            key={tone}
                            type="button"
                            onClick={() => setMessageTone(tone)}
                            className={`rounded-lg border px-3 py-1.5 text-[11px] font-medium transition ${
                              messageTone === tone
                                ? "border-[#b3262d]/40 bg-[#b3262d]/12 text-[#ef8b90]"
                                : "border-white/[0.07] bg-white/[0.02] text-zinc-600 hover:text-zinc-300"
                            }`}
                          >
                            {tone}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {recommendedOpportunity ? (
                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.025] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-emerald-400" />
                            <p className="text-sm font-medium text-zinc-200">
                              WhatsApp sugerido
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              copySuggestedText(
                                "whatsapp",
                                suggestedMessages.whatsapp,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-zinc-500 transition hover:text-zinc-200"
                          >
                            {copiedMessage === "whatsapp" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedMessage === "whatsapp" ? "Copiado" : "Copiar"}
                          </button>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">
                          {suggestedMessages.whatsapp}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-400" />
                            <p className="text-sm font-medium text-zinc-200">
                              E-mail sugerido
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              copySuggestedText(
                                "email",
                                `Assunto: ${suggestedMessages.subject}\n\n${suggestedMessages.email}`,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-zinc-500 transition hover:text-zinc-200"
                          >
                            {copiedMessage === "email" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedMessage === "email" ? "Copiado" : "Copiar"}
                          </button>
                        </div>

                        <div className="mt-4 rounded-xl border border-white/[0.05] bg-black/10 p-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                            Assunto
                          </p>
                          <p className="mt-1 text-sm font-medium text-zinc-300">
                            {suggestedMessages.subject}
                          </p>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">
                          {suggestedMessages.email}
                        </p>
                      </div>

                      <p className="text-[10px] leading-5 text-zinc-700">
                        Sugestões geradas a partir dos dados atuais da oportunidade.
                        Revise o conteúdo antes do envio.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
                      <p className="text-sm text-zinc-600">
                        Selecione uma operação com oportunidades abertas para gerar
                        abordagens.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isGoalModalOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar definição de metas"
            onClick={() => setIsGoalModalOpen(false)}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#101013] shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
              <div className="flex items-start justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef8b90]">
                    Planejamento comercial
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-zinc-100">
                    Definir metas do mês
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Configure a meta geral e metas individuais para cada linha de produto.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-6 py-6">
                {(
                  [
                    ["Todos", "Meta geral"],
                    ["Roupas", "Roupas"],
                    ["Canecas", "Canecas"],
                    ["Livros", "Livros"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {label}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {key === "Todos"
                          ? "Objetivo consolidado da operação"
                          : `Objetivo mensal de ${label}`}
                      </p>
                    </div>

                    <div className="flex h-11 items-center rounded-xl border border-white/[0.08] bg-[#151519] px-3 focus-within:border-[#b3262d]/45">
                      <span className="mr-2 text-sm text-zinc-600">R$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={draftGoals[key]}
                        onChange={(event) =>
                          setDraftGoals((current) => ({
                            ...current,
                            [key]: Number(event.target.value),
                          }))
                        }
                        className="w-36 bg-transparent text-right text-sm font-medium text-zinc-200 outline-none"
                      />
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-white/[0.015] px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-200"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={saveGoals}
                  className="h-11 rounded-xl bg-[#b3262d] px-5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(179,38,45,0.22)] transition hover:bg-[#971f26]"
                >
                  Salvar metas
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}