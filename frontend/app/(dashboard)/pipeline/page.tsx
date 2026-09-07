"use client";

import {
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Edit3,
  FileText,
  GripVertical,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  convertOpportunityToCustomer,
  getLeadHistory,
  getPipelineOpportunities,
  registerPipelineStageChange,
  savePipelineOpportunities,
  type CrmHistoryEvent,
  type PipelineOpportunity,
  type PipelineStage,
} from "@/data/crm";

type PipelineLead = {
  id: number;
  leadId: number;
  name: string;
  company: string;
  value: number;
  owner: string;
  nextAction: string;
  priority: "Alta" | "Média" | "Baixa";
  probability: number;

  product: "Produção Audiovisual" | "Eventos" | "Experiências";
  campaign: string;
  source: string;
};

type PipelineColumn = {
  id: string;
  title: string;
  description: string;
  leads: PipelineLead[];
};

const initialColumns: PipelineColumn[] = [
  {
    id: "novo",
    title: "Novo",
    description: "Leads recém-captados",
    leads: [
      {
        id: 1,
        leadId: 1,
        name: "Mariana Alves",
        company: "Acton Experience",
        value: 18500,
        owner: "Matheus",
        nextAction: "Enviar case de evento corporativo",
        priority: "Alta",
        probability: 87,
        product: "Produção Audiovisual",
        campaign: "Eventos Corporativos 2026",
        source: "LinkedIn",
      },
      {
        id: 2,
        leadId: 2,
        name: "Felipe Andrade",
        company: "Instituto Aurora",
        value: 8500,
        owner: "Gabriel",
        nextAction: "Amanhã, 09:30",
        priority: "Média",
        probability: 65,
        product: "Experiências",
        campaign: "Brindes Corporativos",
        source: "Instagram Ads",
      },
    ],
  },
  {
    id: "qualificado",
    title: "Qualificado",
    description: "Leads com potencial validado",
    leads: [
      {
        id: 3,
        leadId: 3,
        name: "Camila Rocha",
        company: "Farmácia Araujo",
        value: 24500,
        owner: "Matheus",
        nextAction: "Hoje, 16:20",
        priority: "Alta",
        probability: 88,
        product: "Produção Audiovisual",
        campaign: "Uniformes Corporativos",
        source: "LinkedIn",
      },
      {
        id: 4,
        leadId: 4,
        name: "Lucas Martins",
        company: "Cine Brasil",
        value: 12000,
        owner: "André",
        nextAction: "25 jul, 11:00",
        priority: "Baixa",
        probability: 52,
        product: "Eventos",
        campaign: "Coleção Executiva",
        source: "Google Ads",
      },
    ],
  },
  {
    id: "contato",
    title: "Em contato",
    description: "Negociações em andamento",
    leads: [
      {
        id: 5,
        leadId: 5,
        name: "Renata Oliveira",
        company: "Acton Experience",
        value: 32000,
        owner: "Gabriel",
        nextAction: "Hoje, 14:30",
        priority: "Alta",
        probability: 96,
        product: "Eventos",
        campaign: "Campanha Liderança 2026",
        source: "Meta Ads",
      },
      {
        id: 6,
        leadId: 6,
        name: "João Ribeiro",
        company: "Vitta Corporate",
        value: 16000,
        owner: "Matheus",
        nextAction: "Amanhã, 10:00",
        priority: "Média",
        probability: 74,
        product: "Experiências",
        campaign: "Brindes Corporativos",
        source: "WhatsApp",
      },
    ],
  },
  {
    id: "proposta",
    title: "Proposta",
    description: "Propostas comerciais enviadas",
    leads: [
      {
        id: 7,
        leadId: 7,
        name: "Beatriz Lima",
        company: "Nexa Eventos",
        value: 41000,
        owner: "André",
        nextAction: "26 jul, 13:00",
        priority: "Alta",
        probability: 83,
        product: "Produção Audiovisual",
        campaign: "Uniformes Corporativos",
        source: "Indicação",
      },
    ],
  },
  {
    id: "negociacao",
    title: "Negociação",
    description: "Ajustes finais e decisão comercial",
    leads: [],
  },
  {
    id: "fechado",
    title: "Fechado",
    description: "Oportunidades conquistadas",
    leads: [
      {
        id: 8,
        leadId: 8,
        name: "Daniel Costa",
        company: "Studio Central",
        value: 27500,
        owner: "Gabriel",
        nextAction: "Contrato aprovado",
        priority: "Média",
        probability: 100,
        product: "Eventos",
        campaign: "Coleção Executiva",
        source: "E-mail",
      },
    ],
  },
];

const priorityStyles = {
  Alta: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  Média: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Baixa: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
};

const columnColors: Record<string, string> = {
  novo: "#3b82f6",
  qualificado: "#b3262d",
  contato: "#f59e0b",
  proposta: "#8b5cf6",
  negociacao: "#e11d48",
  fechado: "#10b981",
};

const columnBackgrounds: Record<string, string> = {
  novo: "from-blue-500/8",
  qualificado: "from-[#b3262d]/12",
  contato: "from-amber-500/8",
  proposta: "from-violet-500/8",
  negociacao: "from-rose-500/8",
  fechado: "from-emerald-500/8",
};


type ProductFilter = "Todos" | PipelineLead["product"];

const productFilters: ProductFilter[] = [
  "Todos",
  "Produção Audiovisual",
  "Eventos",
  "Experiências",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}


function getProbabilityColor(probability: number) {
  if (probability >= 85) {
    return "bg-emerald-400";
  }

  if (probability >= 70) {
    return "bg-[#b3262d]";
  }

  return "bg-amber-400";
}

function opportunityToLead(
  opportunity: PipelineOpportunity,
): PipelineLead {
  return {
    id: opportunity.id,
    leadId: opportunity.leadId,
    name: opportunity.name,
    company: opportunity.company,
    value: opportunity.value,
    owner: opportunity.owner,
    nextAction: opportunity.nextAction,
    priority: opportunity.priority,
    probability: opportunity.probability,
    product: opportunity.product,
    campaign: opportunity.campaign,
    source: opportunity.source,
  };
}

export default function PipelinePage() {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedProduct, setSelectedProduct] = useState<ProductFilter>("Todos");
  const [closedMessage, setClosedMessage] = useState("");
  const [selectedLead, setSelectedLead] =
  useState<PipelineLead | null>(null);
  const [draggedLead, setDraggedLead] = useState<{
    lead: PipelineLead;
    sourceColumnId: string;
  } | null>(null);

  const [leadHistory, setLeadHistory] = useState<CrmHistoryEvent[]>([]);

  useEffect(() => {
    if (!selectedLead) {
      setLeadHistory([]);
      return;
    }

    setLeadHistory(getLeadHistory(selectedLead.leadId));
  }, [selectedLead]);

  useEffect(() => {
    const storedOpportunities = getPipelineOpportunities();

    setColumns((currentColumns) => {
      const storedIds = new Set(
        storedOpportunities.map((opportunity) => opportunity.id),
      );

      // O localStorage é a fonte de verdade para oportunidades já persistidas.
      // Removemos as versões estáticas desses cards e recolocamos cada uma
      // exatamente na etapa em que foi salva.
      const columnsWithoutStoredOpportunities = currentColumns.map((column) => ({
        ...column,
        leads: column.leads.filter((lead) => !storedIds.has(lead.id)),
      }));

      return columnsWithoutStoredOpportunities.map((column) => {
        const opportunitiesForColumn = storedOpportunities.filter(
          (opportunity) => opportunity.stage === column.id,
        );

        if (opportunitiesForColumn.length === 0) {
          return column;
        }

        return {
          ...column,
          leads: [
            ...opportunitiesForColumn.map(opportunityToLead),
            ...column.leads,
          ],
        };
      });
    });
  }, []);

  function handleDragStart(lead: PipelineLead, sourceColumnId: string) {
    setDraggedLead({
      lead,
      sourceColumnId,
    });
  }

  function handleDrop(targetColumnId: string) {
  if (!draggedLead) {
    return;
  }

  if (draggedLead.sourceColumnId === targetColumnId) {
    setDraggedLead(null);
    return;
  }

  const movedLead = draggedLead.lead;

  const sourceStage =
    draggedLead.sourceColumnId as PipelineStage;

  const targetStage =
    targetColumnId as PipelineStage;

  /*
   * Montamos a oportunidade que está sendo movimentada.
   * Ela será usada tanto no histórico quanto na conversão.
   */
  const movedOpportunity: PipelineOpportunity = {
    id: movedLead.id,
    leadId: movedLead.leadId,
    name: movedLead.name,
    company: movedLead.company,
    product: movedLead.product,
    campaign: movedLead.campaign,
    source: movedLead.source,
    value: movedLead.value,
    owner: movedLead.owner,
    nextAction: movedLead.nextAction,
    priority: movedLead.priority,
    probability: movedLead.probability,
    stage: targetStage,
  };

  /*
   * Atualiza visualmente a Pipeline
   * e persiste a nova posição no localStorage.
   */
  setColumns((currentColumns) => {
    const updatedColumns = currentColumns.map((column) => {
      if (column.id === draggedLead.sourceColumnId) {
        return {
          ...column,
          leads: column.leads.filter(
            (lead) => lead.id !== movedLead.id,
          ),
        };
      }

      if (column.id === targetColumnId) {
        return {
          ...column,
          leads: [...column.leads, movedLead],
        };
      }

      return column;
    });

    const opportunities: PipelineOpportunity[] =
      updatedColumns.flatMap((column) =>
        column.leads.map((lead) => ({
          id: lead.id,
          leadId: lead.leadId,
          name: lead.name,
          company: lead.company,
          product: lead.product,
          campaign: lead.campaign,
          source: lead.source,
          value: lead.value,
          owner: lead.owner,
          nextAction: lead.nextAction,
          priority: lead.priority,
          probability: lead.probability,
          stage: column.id as PipelineStage,
        })),
      );

    savePipelineOpportunities(opportunities);

    return updatedColumns;
  });

  /*
   * NOVO:
   * registra a movimentação real no histórico.
   */
  registerPipelineStageChange(
    movedOpportunity,
    sourceStage,
    targetStage,
  );

  /*
   * Se chegou em Fechado,
   * transforma a oportunidade em cliente.
   */
  if (targetStage === "fechado") {
    const customerResult =
      convertOpportunityToCustomer(movedOpportunity);

    if (customerResult.success) {
      setClosedMessage(
        `${movedLead.name} virou cliente — ${formatCurrency(
          movedLead.value,
        )}.`,
      );
    } else {
      setClosedMessage(
        `${movedLead.name} já estava registrado como cliente.`,
      );
    }

    window.setTimeout(() => {
      setClosedMessage("");
    }, 3500);
  }

  setDraggedLead(null);
}

  const visibleColumns =
    selectedProduct === "Todos"
      ? columns
      : columns.map((column) => ({
          ...column,
          leads: column.leads.filter(
            (lead) => lead.product === selectedProduct
          ),
        }));

  const totalPipeline = visibleColumns.reduce(
    (total, column) =>
      total +
      column.leads.reduce(
        (columnTotal, lead) => columnTotal + lead.value,
        0
      ),
    0
  );

  const totalLeads = visibleColumns.reduce(
    (total, column) => total + column.leads.length,
    0
  );

  const averageTicket = 
  totalLeads > 0 ? totalPipeline / totalLeads : 0;

const averageProbability =
  totalLeads > 0
    ? Math.round(
        visibleColumns
          .flatMap((column) => column.leads)
          .reduce(
            (total, lead) => total + lead.probability,
            0,
          ) / totalLeads,
      )
    : 0;

const expectedRevenue = Math.round(
  visibleColumns
    .flatMap((column) => column.leads)
    .reduce(
      (total, lead) =>
        total + lead.value * (lead.probability / 100),
      0
    )
);

const biggestOpportunity =
  visibleColumns
    .flatMap((column) => column.leads)
    .sort((a, b) => b.value - a.value)[0] ?? null;

  return (
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      {closedMessage && (
        <div className="fixed right-6 top-24 z-[100] min-w-[320px] border border-emerald-400/20 bg-[#090d0a]/95 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]" />
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-300">
              Deal / Closed
            </p>
          </div>
          <p className="mt-3 text-sm text-zinc-300">{closedMessage}</p>
        </div>
      )}

      <div className="mx-auto max-w-[1900px]">
        <header className="border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.24em]">
                <span className="text-[#d84a50]">03 / Pipeline</span>
                <span className="h-px w-12 bg-white/[0.09]" />
                <span className="text-zinc-500">Live Operation</span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-zinc-100 sm:text-5xl">
                Pipeline Comercial
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                Acompanhe o fluxo das oportunidades e mova cada negociação entre as etapas da operação.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex h-10 items-center gap-2 border border-white/[0.08] bg-black/10 px-4 text-xs text-zinc-500 transition hover:border-white/[0.14] hover:text-zinc-200">
                Todos os responsáveis
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <button className="inline-flex h-10 items-center gap-2 border border-[#b3262d]/45 bg-[#b3262d]/10 px-4 text-xs font-medium text-[#ef8b90] transition hover:bg-[#b3262d]/20 hover:text-white">
                <Plus className="h-3.5 w-3.5" />
                Nova oportunidade
              </button>
            </div>
          </div>
        </header>

        <section className="grid border-b border-white/[0.07] xl:grid-cols-[1.35fr_repeat(4,1fr)]">
          <div className="border-b border-white/[0.07] py-6 xl:border-b-0 xl:border-r xl:pr-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
              01 / Pipeline Total
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
              {formatCurrency(totalPipeline)}
            </p>
            <p className="mt-2 text-xs text-zinc-400">Valor bruto em negociação</p>
          </div>

          <div className="border-b border-white/[0.07] py-6 xl:border-b-0 xl:border-r xl:px-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
              02 / Receita Prevista
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#ef8b90]">
              {formatCurrency(expectedRevenue)}
            </p>
            <p className="mt-2 text-xs text-zinc-400">Probabilidade ponderada</p>
          </div>

          <div className="border-b border-white/[0.07] py-6 xl:border-b-0 xl:border-r xl:px-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
              03 / Ticket Médio
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-zinc-200">
              {formatCompactCurrency(averageTicket)}
            </p>
            <p className="mt-2 text-xs text-zinc-400">{totalLeads} oportunidades</p>
          </div>

          <div className="border-b border-white/[0.07] py-6 xl:border-b-0 xl:border-r xl:px-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
              04 / Probabilidade
            </p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-2xl font-semibold text-zinc-200">{averageProbability}%</p>
              <div className="mb-1 h-px flex-1 bg-white/[0.06]">
                <div className="h-px bg-[#b3262d]" style={{ width: `${averageProbability}%` }} />
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-400">Média de fechamento</p>
          </div>

          <div className="py-6 xl:pl-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
              05 / Maior oportunidade
            </p>
            {biggestOpportunity ? (
              <>
                <p className="mt-3 truncate text-sm font-medium text-zinc-300">
                  {biggestOpportunity.company}
                </p>
                <p className="mt-1 text-xl font-semibold text-zinc-100">
                  {formatCurrency(biggestOpportunity.value)}
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs text-zinc-400">Sem oportunidades</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-5 border-b border-white/[0.07] py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">View /</span>
            <span className="text-xs text-zinc-400">
              {selectedProduct === "Todos" ? "Operação consolidada" : selectedProduct}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {productFilters.map((product) => (
              <button
                key={product}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className={`relative px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] transition ${
                  selectedProduct === product
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-400"
                }`}
              >
                {product}
                {selectedProduct === product && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-px bg-[#d84a50] shadow-[0_0_10px_rgba(216,74,80,.55)]" />
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d84a50] shadow-[0_0_10px_rgba(216,74,80,.65)]" />
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                Pipeline Signal / Drag Enabled
              </p>
            </div>
            <p className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-800 sm:block">
              LF / BOARD-03
            </p>
          </div>

          <section className="overflow-x-auto border-y border-white/[0.06] bg-black/[0.08] py-4">
            <div className="flex min-w-max gap-3 px-1 pr-6">
              {visibleColumns.map((column, columnIndex) => {
                const columnTotal = column.leads.reduce(
                  (total, lead) => total + lead.value,
                  0,
                );
                const isDropTarget =
                  draggedLead && draggedLead.sourceColumnId !== column.id;

                return (
                  <div
                    key={column.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(column.id)}
                    className={`w-[310px] shrink-0 border-l px-3 pb-5 transition-all duration-300 ${
                      isDropTarget
                        ? "border-[#b3262d]/35 bg-[#b3262d]/[0.025]"
                        : "border-white/[0.07]"
                    }`}
                  >
                    <div className="min-h-[116px] border-b border-white/[0.07] pb-4 pt-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: columnColors[column.id],
                                boxShadow: `0 0 10px ${columnColors[column.id]}88`,
                              }}
                            />
                            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-500">
                              {String(columnIndex + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <h2 className="mt-3 text-base font-medium text-zinc-200">
                            {column.title}
                          </h2>
                          <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-zinc-500">
                            {column.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center border border-white/[0.06] text-zinc-500 transition hover:border-[#b3262d]/30 hover:text-[#ef8b90]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <p className="text-xl font-semibold tracking-[-0.03em] text-zinc-200">
                          {formatCompactCurrency(columnTotal)}
                        </p>
                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-500">
                          {column.leads.length} {column.leads.length === 1 ? "deal" : "deals"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3">
                      {column.leads.map((lead) => (
                        <article
                          key={lead.id}
                          draggable
                          onClick={() => setSelectedLead(lead)}
                          onDragStart={() => handleDragStart(lead, column.id)}
                          onDragEnd={() => setDraggedLead(null)}
                          className={`group cursor-grab border border-white/[0.07] bg-[#0d0d0f]/88 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b3262d]/30 hover:bg-[#111114]/95 hover:shadow-[0_14px_40px_rgba(0,0,0,.28)] active:cursor-grabbing ${
                            draggedLead?.lead.id === lead.id
                              ? "scale-[0.98] border-[#b3262d]/35 opacity-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-zinc-200">
                                {lead.name}
                              </p>
                              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                                <Building2 className="h-3 w-3" />
                                <span className="truncate">{lead.company}</span>
                              </div>
                            </div>
                            <GripVertical className="h-4 w-4 shrink-0 text-zinc-800 transition group-hover:text-zinc-600" />
                          </div>

                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-500">
                                Opportunity
                              </p>
                              <p className="mt-1 text-xl font-semibold tracking-[-0.035em] text-zinc-100">
                                {formatCurrency(lead.value)}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-zinc-300">
                              {lead.probability}%
                            </span>
                          </div>

                          <div className="mt-3 h-px bg-white/[0.06]">
                            <div
                              className={`h-px ${getProbabilityColor(lead.probability)}`}
                              style={{ width: `${lead.probability}%` }}
                            />
                          </div>

                          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[8px] uppercase tracking-[0.12em]">
                            <span className="text-[#d36a6f]">{lead.product}</span>
                            <span className="text-zinc-500">{lead.source}</span>
                          </div>

                          <p className="mt-3 line-clamp-1 text-[10px] text-zinc-500">
                            {lead.campaign}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.055] pt-3">
                            <div>
                              <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-800">
                                Owner
                              </p>
                              <p className="mt-1 text-[11px] text-zinc-500">{lead.owner}</p>
                            </div>
                            <div>
                              <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-800">
                                Next Action
                              </p>
                              <p className="mt-1 truncate text-[11px] text-zinc-500">
                                {lead.nextAction}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span
                              className={`border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${priorityStyles[lead.priority]}`}
                            >
                              {lead.priority}
                            </span>
                            <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-zinc-800">
                              Score / {lead.probability}
                            </span>
                          </div>
                        </article>
                      ))}

                      {column.leads.length === 0 && (
                        <div
                          className={`flex h-32 items-center justify-center border border-dashed px-5 text-center transition ${
                            isDropTarget
                              ? "border-[#b3262d]/30 bg-[#b3262d]/[0.025]"
                              : "border-white/[0.07]"
                          }`}
                        >
                          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-500">
                            Drop opportunity here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {selectedLead && (
        <>
          {/* Fundo escurecido */}
          <button
            type="button"
            aria-label="Fechar detalhes"
            onClick={() => setSelectedLead(null)}
            className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm"
          />

          {/* Painel lateral */}
          <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[480px] flex-col border-l border-white/10 bg-[#0d0d0f] shadow-[-30px_0_80px_rgba(0,0,0,.55)]">
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#ef8b90]">
                  Detalhes da oportunidade
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {selectedLead.name}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                  <Building2 className="h-4 w-4" />
                  {selectedLead.company}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#b3262d]/20 bg-[#b3262d]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#ef8b90]">
                    {selectedLead.product}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-400">
                    {selectedLead.source}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="rounded-3xl border border-[#b3262d]/20 bg-gradient-to-br from-[#b3262d]/15 to-transparent p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Valor da oportunidade
                </p>

                <p className="mt-2 text-4xl font-bold text-white">
                  {formatCurrency(selectedLead.value)}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    Probabilidade de fechamento
                  </span>

                  <span className="text-lg font-semibold text-white">
                    {selectedLead.probability}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${getProbabilityColor(
                      selectedLead.probability
                    )}`}
                    style={{
                      width: `${selectedLead.probability}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-[#b3262d]/30 hover:bg-[#b3262d]/10"
                >
                  <Edit3 className="h-5 w-5 text-[#ef8b90]" />

                  <div>
                    <p className="text-sm font-medium text-white">Editar</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Alterar dados
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-[#b3262d]/30 hover:bg-[#b3262d]/10"
                >
                  <MessageSquare className="h-5 w-5 text-[#ef8b90]" />

                  <div>
                    <p className="text-sm font-medium text-white">Contato</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Registrar interação
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-[#b3262d]/30 hover:bg-[#b3262d]/10"
                >
                  <FileText className="h-5 w-5 text-[#ef8b90]" />

                  <div>
                    <p className="text-sm font-medium text-white">Tarefa</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Criar atividade
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-[#b3262d]/30 hover:bg-[#b3262d]/10"
                >
                  <Mail className="h-5 w-5 text-[#ef8b90]" />

                  <div>
                    <p className="text-sm font-medium text-white">E-mail</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Enviar mensagem
                    </p>
                  </div>
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">
                  Informações comerciais
                </h3>

                <div className="mt-5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <UserRound className="h-5 w-5 text-zinc-400" />
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">Responsável</p>
                      <p className="mt-1 text-sm text-white">
                        {selectedLead.owner}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <CalendarDays className="h-5 w-5 text-zinc-400" />
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">Próxima ação</p>
                      <p className="mt-1 text-sm text-white">
                        {selectedLead.nextAction}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Campanha de origem
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {selectedLead.campaign}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {selectedLead.source} · Produto: {selectedLead.product}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <Phone className="h-5 w-5 text-zinc-400" />
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">Telefone</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        Não informado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-semibold text-white">
        Histórico comercial
      </h3>

      <p className="mt-1 text-xs text-zinc-400">
        Movimentações registradas nesta oportunidade.
      </p>
    </div>

    <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-zinc-500">
      {leadHistory.length} eventos
    </span>
  </div>

  {leadHistory.length > 0 ? (
    <div className="mt-6">
      {[...leadHistory]
        .reverse()
        .slice(0, 6)
        .map((event, index, events) => {
          const isLast = index === events.length - 1;

          return (
            <div
              key={event.id}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {!isLast && (
                <div className="absolute left-[5px] top-4 h-[calc(100%-4px)] w-px bg-white/[0.08]" />
              )}

              <div
                className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-[#0d0d0f] ${
                  event.type === "converted"
                    ? "bg-emerald-400"
                    : event.type === "stage_changed"
                      ? "bg-[#b3262d]"
                      : "bg-zinc-500"
                }`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-zinc-200">
                    {event.title}
                  </p>

                  <span className="shrink-0 text-[10px] text-zinc-500">
                    {formatHistoryDate(event.createdAt)}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {event.description}
                </p>

                {event.fromStage && event.toStage && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[10px] text-zinc-400">
                    <span>{event.fromStage}</span>

                    <span>→</span>

                    <span className="text-zinc-400">
                      {event.toStage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  ) : (
    <div className="mt-5 rounded-2xl border border-dashed border-white/[0.08] px-4 py-8 text-center">
      <p className="text-xs text-zinc-400">
        Nenhum histórico registrado para esta oportunidade.
      </p>

      <p className="mt-2 text-[10px] leading-5 text-zinc-500">
        As próximas movimentações no Pipeline serão registradas automaticamente.
      </p>
    </div>
  )}
</div>

            </div>

            <div className="border-t border-white/10 bg-[#0a0a0c] p-5">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b3262d] text-sm font-medium text-white transition hover:bg-[#9d1f26]"
              >
                <Edit3 className="h-4 w-4" />
                Editar oportunidade
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
