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
    <div className="relative min-h-screen overflow-hidden px-5 py-6 text-white lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_72%_5%,rgba(179,38,45,0.14),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        {/* CONTROL ROOM / HERO */}
        <section className="relative border-b border-white/[0.08] pb-8 lg:pb-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">
            <div className="flex items-center gap-3">
              <span className="text-[#d84a50]">01 / Control room</span>
              <span className="hidden h-px w-12 bg-white/10 sm:block" />
              <span>Sales intelligence</span>
            </div>

            <div className="flex items-center gap-5">
              <span className="hidden md:inline">LF / OPS-01</span>
              <span className="inline-flex items-center gap-2 text-zinc-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d84a50] shadow-[0_0_12px_rgba(216,74,80,0.8)]" />
                System live
              </span>
            </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                {dashboardSummary.greeting}
              </p>
              <h1 className="max-w-4xl text-[clamp(2.8rem,6vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-zinc-100">
                Operação
                <span className="block text-zinc-500">comercial.</span>
              </h1>

              <div className="mt-7 flex max-w-2xl flex-col gap-5 border-l border-[#b3262d]/45 pl-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xl text-sm leading-7 text-zinc-500 lg:text-base">
                  {crmLoaded
                    ? `${activeOpportunities} oportunidades abertas, ${priorityOpportunities} prioritárias e ${convertedCustomers} clientes convertidos neste recorte.`
                    : dashboardSummary.message}
                </p>
                <button
                  type="button"
                  onClick={() => setIsIntelligenceOpen(true)}
                  className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  Abrir análise
                  <ArrowRight className="h-4 w-4 text-[#d84a50] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="xl:pb-1">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                <span>Pipeline ativo</span>
                <span>BRL / LIVE</span>
              </div>
              <p className="text-[clamp(3rem,6vw,5.7rem)] font-medium leading-none tracking-[-0.065em] text-zinc-100">
                {crmLoaded
                  ? formatCurrency(activePipelineValue)
                  : dashboardSummary.potentialRevenue}
              </p>
              <div className="mt-5 grid grid-cols-3 border-y border-white/[0.08]">
                <div className="py-4 pr-4">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-zinc-200">{activeOpportunities}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Abertas</p>
                </div>
                <div className="border-x border-white/[0.08] px-4 py-4">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-zinc-200">{conversionRate.toFixed(1).replace('.', ',')}%</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Conversão</p>
                </div>
                <div className="py-4 pl-4">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-[#e15b61]">{priorityOpportunities}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Prioridade</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPERATION FILTER */}
        <section className="flex flex-col gap-5 border-b border-white/[0.08] py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">View /</span>
            <span className="text-sm text-zinc-400">
              {selectedProduct === "Todos" ? "Operação consolidada" : selectedProduct}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["Todos", "Roupas", "Canecas", "Livros"] as const).map((product) => {
              const active = selectedProduct === product;
              return (
                <button
                  key={product}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className={`relative px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition ${
                    active ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {product === "Todos" ? "Geral" : product}
                  {active && <span className="absolute inset-x-3 -bottom-[21px] h-px bg-[#d84a50] shadow-[0_0_10px_rgba(216,74,80,0.65)]" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* KPI STRIP */}
        <section className="grid border-b border-white/[0.08] sm:grid-cols-2 xl:grid-cols-4">
          {dynamicDashboardStats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <div key={stat.id} className="group relative min-h-44 border-white/[0.08] px-1 py-7 sm:px-6 sm:[&:nth-child(even)]:border-l xl:border-l xl:first:border-l-0">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">0{index + 1} / {stat.title}</p>
                  <Icon className="h-4 w-4 text-zinc-700 transition group-hover:text-[#d84a50]" />
                </div>
                <p className="mt-7 text-3xl font-semibold tracking-[-0.05em] text-zinc-200 lg:text-4xl">{stat.value}</p>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-600">{stat.description}</span>
                  <span className="shrink-0 text-zinc-400">{stat.variation}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* PERFORMANCE */}
        <section className="grid border-b border-white/[0.08] xl:grid-cols-[0.72fr_1.28fr]">
          <article className="relative px-1 py-8 sm:px-6 xl:border-r xl:border-white/[0.08] xl:py-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d84a50]">02 / Target monitor</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-100">
                  {selectedProduct === "Todos" ? "Meta comercial" : `Meta / ${selectedProduct}`}
                </h2>
              </div>
              <button type="button" onClick={openGoalModal} className="inline-flex items-center gap-2 border border-white/[0.08] px-3 py-2 text-xs text-zinc-500 transition hover:border-[#b3262d]/35 hover:text-zinc-200">
                <Settings2 className="h-3.5 w-3.5" /> Ajustar
              </button>
            </div>

            <div className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">Receita alcançada</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-zinc-100">{formatCurrency(currentAchievedRevenue)}</p>
                </div>
                <p className="font-mono text-lg text-[#e15b61]">{goalPercentage.toFixed(1).replace('.', ',')}%</p>
              </div>
              <div className="relative mt-7 h-px bg-white/[0.08]">
                <div className="absolute left-0 top-0 h-px bg-[#d84a50] shadow-[0_0_14px_rgba(216,74,80,0.65)]" style={{ width: `${Math.min(goalPercentage, 100)}%` }} />
                <span className="absolute -top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-[#e15b61] shadow-[0_0_14px_rgba(216,74,80,0.8)]" style={{ left: `${Math.min(goalPercentage, 100)}%` }} />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700"><span>0</span><span>Meta {formatCurrency(currentGoalTarget)}</span></div>
            </div>

            <div className="mt-10 grid grid-cols-3 border-t border-white/[0.08] pt-6">
              <div><p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Restante</p><p className="mt-2 text-sm font-medium text-zinc-300">{formatCurrency(goalRemaining)}</p></div>
              <div className="border-x border-white/[0.08] px-4"><p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Projeção</p><p className="mt-2 text-sm font-medium text-emerald-300">{formatCurrency(projectedClosing)}</p></div>
              <div className="pl-4"><p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Ticket</p><p className="mt-2 text-sm font-medium text-zinc-300">{convertedCustomers > 0 ? formatCurrency(customerAverageTicket) : "R$ 0"}</p></div>
            </div>
          </article>

          <article className="px-1 py-8 sm:px-6 xl:py-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">Performance / 06 months</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-100">Evolução da receita potencial</h2>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400">↗ 18,4% / month</div>
            </div>
            <div className="mt-8 overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[250px] w-full overflow-visible" role="img" aria-label="Gráfico de evolução da receita potencial">
                <defs>
                  <linearGradient id="revenueAreaCinematic" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b3262d" stopOpacity="0.22"/><stop offset="100%" stopColor="#b3262d" stopOpacity="0"/></linearGradient>
                  <linearGradient id="revenueLineCinematic" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#72171c"/><stop offset="100%" stopColor="#e15b61"/></linearGradient>
                </defs>
                {[45,90,135,180].map((y)=><line key={y} x1="20" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.045)" strokeWidth="1"/>) }
                <polygon points={chartArea} fill="url(#revenueAreaCinematic)"/>
                <polyline points={chartLine} fill="none" stroke="url(#revenueLineCinematic)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {chartPoints.map((point)=><g key={point.month}><circle cx={point.x} cy={point.y} r="5" fill="#09090b" stroke="#d84a50" strokeWidth="2"/><circle cx={point.x} cy={point.y} r="1.5" fill="#fff"/></g>)}
              </svg>
              <div className="grid grid-cols-6 gap-2 border-t border-white/[0.06] pt-4">{revenuePerformance.map((performance)=><div key={performance.month}><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700">{performance.month}</p><p className="mt-1 text-xs text-zinc-500">R$ {performance.value}k</p></div>)}</div>
            </div>
          </article>
        </section>

        {/* PIPELINE + INTELLIGENCE */}
        <section className="grid border-b border-white/[0.08] xl:grid-cols-[1.25fr_0.75fr]">
          <article className="px-1 py-8 sm:px-6 xl:border-r xl:border-white/[0.08] xl:py-10">
            <div className="flex items-end justify-between gap-4">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">03 / Pipeline signal</p><h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-100">Distribuição do funil</h2></div>
              <button type="button" onClick={() => router.push('/pipeline')} className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-500 transition hover:text-white">Abrir pipeline <ArrowRight className="h-3.5 w-3.5 text-[#d84a50] transition-transform group-hover:translate-x-1"/></button>
            </div>
            <div className="mt-8">
              {dynamicPipelineStages.map((stage,index)=><div key={stage.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-4 border-t border-white/[0.06] py-4 first:border-t-0">
                <span className="font-mono text-[10px] text-zinc-700">0{index+1}</span>
                <div><div className="flex items-center justify-between gap-4"><p className="text-sm text-zinc-300">{stage.name}</p><p className="text-xs text-zinc-500">{stage.opportunities} ops.</p></div><div className="mt-2 h-px bg-white/[0.06]"><div className="h-px bg-gradient-to-r from-[#7d171c] to-[#d84a50]" style={{width:`${stage.percentage}%`}}/></div></div>
                <p className="min-w-24 text-right text-sm font-medium text-zinc-300">{stage.value}</p>
              </div>)}
            </div>
          </article>

          <article className="relative overflow-hidden px-1 py-8 sm:px-6 xl:py-10">
            <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#b3262d]/10 blur-[90px]"/>
            <div className="relative">
              <div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d84a50]">04 / Decision engine</p><h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-100">Sinais da operação</h2></div><Sparkles className="h-4 w-4 text-zinc-700"/></div>
              <div className="mt-8 space-y-0">
                {dynamicAiInsights.map((insight,index)=><div key={insight.id} className="border-t border-white/[0.07] py-5 first:border-t-0 first:pt-0">
                  <div className="flex gap-4"><span className="font-mono text-[10px] text-zinc-700">0{index+1}</span><div className="flex-1"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-zinc-200">{insight.title}</p><span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${insight.priority==='high'?'bg-[#d84a50]':insight.priority==='medium'?'bg-amber-400':'bg-zinc-500'}`}/></div><p className="mt-2 text-xs leading-6 text-zinc-600">{insight.description}</p><button type="button" onClick={()=>setIsIntelligenceOpen(true)} className="mt-3 text-[11px] uppercase tracking-[0.12em] text-zinc-400 transition hover:text-[#e15b61]">{insight.action} →</button></div></div>
                </div>)}
              </div>
            </div>
          </article>
        </section>

        {/* ACTIVITY / SCHEDULE */}
        <section className="grid pb-10 xl:grid-cols-2">
          <article className="px-1 py-8 sm:px-6 xl:border-r xl:border-white/[0.08] xl:py-10">
            <div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">05 / Activity log</p><h2 className="mt-3 text-xl font-semibold text-zinc-100">Atividades recentes</h2></div><Activity className="h-4 w-4 text-zinc-700"/></div>
            <div className="mt-7">{recentActivities.map((activity,index)=>{const Icon=activityIcons[activity.type];return <div key={activity.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-4 border-t border-white/[0.06] py-4 first:border-t-0"><span className="font-mono text-[10px] text-zinc-700">0{index+1}</span><div className="flex min-w-0 items-center gap-3"><Icon className="h-3.5 w-3.5 shrink-0 text-[#d84a50]"/><div className="min-w-0"><p className="text-sm text-zinc-300">{activity.title}</p><p className="mt-1 truncate text-xs text-zinc-600">{activity.description}</p></div></div><span className="font-mono text-[10px] text-zinc-700">{activity.time}</span></div>})}</div>
          </article>
          <article className="px-1 py-8 sm:px-6 xl:py-10">
            <div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">06 / Schedule</p><h2 className="mt-3 text-xl font-semibold text-zinc-100">Próximos compromissos</h2></div><CalendarDays className="h-4 w-4 text-zinc-700"/></div>
            <div className="mt-7">{upcomingEvents.map((event,index)=><div key={event.id} className="group grid grid-cols-[28px_70px_1fr_auto] items-center gap-4 border-t border-white/[0.06] py-4 first:border-t-0"><span className="font-mono text-[10px] text-zinc-700">0{index+1}</span><div><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#d84a50]">{event.date}</p><p className="mt-1 text-sm text-zinc-300">{event.time}</p></div><div className="min-w-0"><p className="text-sm text-zinc-300">{event.title}</p><p className="mt-1 text-xs text-zinc-600">{event.company}</p></div><ArrowRight className="h-3.5 w-3.5 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-[#d84a50]"/></div>)}</div>
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