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
import { useState } from "react";

type PipelineLead = {
  id: number;
  name: string;
  company: string;
  value: number;
  owner: string;
  nextAction: string;
  priority: "Alta" | "Média" | "Baixa";
  probability: number;
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
        name: "Mariana Alves",
        company: "Grupo Horizonte",
        value: 18000,
        owner: "Matheus",
        nextAction: "Hoje, 15:00",
        priority: "Alta",
        probability: 92,
      },
      {
        id: 2,
        name: "Felipe Andrade",
        company: "Instituto Aurora",
        value: 8500,
        owner: "Gabriel",
        nextAction: "Amanhã, 09:30",
        priority: "Média",
        probability: 65
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
        name: "Camila Rocha",
        company: "Farmácia Araujo",
        value: 24500,
        owner: "Matheus",
        nextAction: "Hoje, 16:20",
        priority: "Alta",
        probability: 88
      },
      {
        id: 4,
        name: "Lucas Martins",
        company: "Cine Brasil",
        value: 12000,
        owner: "André",
        nextAction: "25 jul, 11:00",
        priority: "Baixa",
        probability: 52
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
        name: "Renata Oliveira",
        company: "Acton Experience",
        value: 32000,
        owner: "Gabriel",
        nextAction: "Hoje, 14:30",
        priority: "Alta",
        probability: 96,
      },
      {
        id: 6,
        name: "João Ribeiro",
        company: "Vitta Corporate",
        value: 16000,
        owner: "Matheus",
        nextAction: "Amanhã, 10:00",
        priority: "Média",
        probability: 74,
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
        name: "Beatriz Lima",
        company: "Nexa Eventos",
        value: 41000,
        owner: "André",
        nextAction: "26 jul, 13:00",
        priority: "Alta",
        probability: 83,
      },
    ],
  },
  {
    id: "fechado",
    title: "Fechado",
    description: "Oportunidades conquistadas",
    leads: [
      {
        id: 8,
        name: "Daniel Costa",
        company: "Studio Central",
        value: 27500,
        owner: "Gabriel",
        nextAction: "Contrato aprovado",
        priority: "Média",
        probability: 100
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
  fechado: "#10b981",
};

const columnBackgrounds: Record<string, string> = {
  novo: "from-blue-500/8",
  qualificado: "from-[#b3262d]/12",
  contato: "from-amber-500/8",
  proposta: "from-violet-500/8",
  fechado: "from-emerald-500/8",
};

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

function getProbabilityColor(probability: number) {
  if (probability >= 85) {
    return "bg-emerald-400";
  }

  if (probability >= 70) {
    return "bg-[#b3262d]";
  }

  return "bg-amber-400";
}

export default function PipelinePage() {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedLead, setSelectedLead] =
  useState<PipelineLead | null>(null);
  const [draggedLead, setDraggedLead] = useState<{
    lead: PipelineLead;
    sourceColumnId: string;
  } | null>(null);

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

    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id === draggedLead.sourceColumnId) {
          return {
            ...column,
            leads: column.leads.filter(
              (lead) => lead.id !== draggedLead.lead.id
            ),
          };
        }

        if (column.id === targetColumnId) {
          return {
            ...column,
            leads: [...column.leads, draggedLead.lead],
          };
        }

        return column;
      })
    );

    setDraggedLead(null);
  }

  const totalPipeline = columns.reduce(
    (total, column) =>
      total +
      column.leads.reduce(
        (columnTotal, lead) => columnTotal + lead.value,
        0
      ),
    0
  );

  const totalLeads = columns.reduce(
    (total, column) => total + column.leads.length,
    0
  );

  const averageTicket = totalPipeline / totalLeads;

const averageProbability =
  Math.round(
    columns
      .flatMap((column) => column.leads)
      .reduce((total, lead) => total + lead.probability, 0) / totalLeads
  );

const expectedRevenue = Math.round(
  columns
    .flatMap((column) => column.leads)
    .reduce(
      (total, lead) =>
        total + lead.value * (lead.probability / 100),
      0
    )
);

const biggestOpportunity = columns
  .flatMap((column) => column.leads)
  .sort((a, b) => b.value - a.value)[0];

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1800px]">
        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#b3262d]/20 bg-[#b3262d]/10 px-3 py-1.5 text-xs font-medium text-[#ef8b90]">
                    <CircleDollarSign className="h-3.5 w-3.5" />
                    Pipeline Executivo
                  </div>

                  <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-100">
                    Pipeline Comercial
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-500">
                    Visualize todas as negociações, acompanhe a evolução das
                    oportunidades e identifique rapidamente onde concentrar os
                    esforços da equipe comercial.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-zinc-300 transition hover:bg-white/[0.05]">
                    Todos os responsáveis

                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#b3262d] px-5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(179,38,45,.25)] transition hover:bg-[#9d1f26]">
                    <Plus className="h-4 w-4" />
                    Nova oportunidade
                  </button>
                </div>
              </header>

              <section className="grid gap-5 xl:grid-cols-5">
  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
      Pipeline Total
    </p>

    <h2 className="mt-3 text-3xl font-semibold text-white">
      {formatCurrency(totalPipeline)}
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Valor bruto das oportunidades
    </p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
      Receita Prevista
    </p>

    <h2 className="mt-3 text-3xl font-semibold text-[#ef8b90]">
      {formatCurrency(expectedRevenue)}
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Considerando a probabilidade de fechamento
    </p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
      Ticket Médio
    </p>

    <h2 className="mt-3 text-3xl font-semibold text-white">
      {formatCompactCurrency(averageTicket)}
    </h2>

    <p className="mt-2 text-sm text-zinc-500">
      Média por oportunidade
    </p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
      Probabilidade Média
    </p>

    <h2 className="mt-3 text-3xl font-semibold text-white">
      {averageProbability}%
    </h2>

    <div className="mt-4 h-2 rounded-full bg-white/5">
      <div
        className="h-2 rounded-full bg-[#b3262d]"
        style={{ width: `${averageProbability}%` }}
      />
    </div>
  </div>

  <div className="rounded-3xl border border-[#b3262d]/20 bg-gradient-to-br from-[#b3262d]/15 to-transparent p-6">
    <p className="text-xs uppercase tracking-[0.25em] text-[#ef8b90]">
      Maior oportunidade
    </p>

    <h2 className="mt-3 text-xl font-semibold text-white">
      {biggestOpportunity.company}
    </h2>

    <p className="mt-2 text-zinc-400">
      {biggestOpportunity.name}
    </p>

    <div className="mt-5 text-2xl font-bold text-[#ef8b90]">
      {formatCurrency(biggestOpportunity.value)}
    </div>
  </div>
</section>

<div className="mt-6 overflow-hidden rounded-3xl border border-white/5 bg-[#0b0b0d]">
  <section className="overflow-x-auto px-4 py-4">
          <div className="flex min-w-max gap-6 pr-6">
            {columns.map((column) => {
              const columnTotal = column.leads.reduce(
                (total, lead) => total + lead.value,
                0
              );

              return (
               <div
                    key={column.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(column.id)}
                    className={`
                  w-[340px]
                  shrink-0
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-gradient-to-b
                  ${columnBackgrounds[column.id]}
                  to-[#111111]
                  shadow-xl
                  transition-all
                  duration-300
                  hover:border-white/20
`}
                  >
                  <div className="px-1 pb-3">
                    <div
                          className="border-b border-white/5 p-5"
                          style={{
                            borderTop: `4px solid ${columnColors[column.id]}`,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-white">
                                  {column.title}
                                </h2>

                                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-400">
                                  {column.leads.length}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-zinc-500">
                                {column.description}
                              </p>
                            </div>

                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-[#b3262d] hover:text-white"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                Total da etapa
                              </span>

                              <span className="text-xs text-zinc-500">
                                {column.leads.length} oportunidades
                              </span>
                            </div>

                            <div className="mt-2 text-2xl font-bold text-white">
                              {formatCompactCurrency(columnTotal)}
                            </div>
                          </div>
                          </div>

                   
                  </div>

                  <div className="space-y-3">
                    {column.leads.map((lead) => (
                      <article
                      key={lead.id}
                      draggable
                      onClick={() => setSelectedLead(lead)}
                      onDragStart={() => handleDragStart(lead, column.id)}
                      onDragEnd={() => setDraggedLead(null)}
                      className="group cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-b from-[#181818] to-[#111111] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b3262d]/40 hover:shadow-[0_18px_40px_rgba(0,0,0,.35)] active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white">
                            {lead.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                            <Building2 className="h-4 w-4" />
                            {lead.company}
                          </div>
                        </div>

                        <GripVertical className="h-4 w-4 text-zinc-700 transition group-hover:text-zinc-500" />
                      </div>

                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Valor da oportunidade
                        </p>

                        <div className="mt-1 text-3xl font-bold text-white">
                          {formatCurrency(lead.value)}
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-zinc-500">
                            Probabilidade
                          </span>

                          <span className="text-sm font-semibold text-white">
                            {lead.probability}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full ${getProbabilityColor(
                              lead.probability
                            )}`}
                            style={{
                              width: `${lead.probability}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                            <UserRound className="h-4 w-4 text-zinc-400" />
                          </div>

                          <div>
                            <p className="text-xs text-zinc-500">
                              Responsável
                            </p>

                            <p className="text-sm text-white">
                              {lead.owner}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                            <CalendarDays className="h-4 w-4 text-zinc-400" />
                          </div>

                          <div>
                            <p className="text-xs text-zinc-500">
                              Próxima ação
                            </p>

                            <p className="text-sm text-white">
                              {lead.nextAction}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            priorityStyles[lead.priority]
                          }`}
                        >
                          {lead.priority}
                        </span>

                        <span className="text-xs text-zinc-600">
                          Score Comercial
                        </span>
                      </div>
</article>
                    ))}

                    {column.leads.length === 0 && (
                      <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-white/[0.08] text-center">
                        <p className="text-xs text-zinc-700">
                          Arraste uma oportunidade para esta etapa
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

                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                  <Building2 className="h-4 w-4" />
                  {selectedLead.company}
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
                  <h3 className="text-sm font-semibold text-white">
                    Histórico recente
                  </h3>

                  <button
                    type="button"
                    className="text-xs font-medium text-[#ef8b90] hover:text-white"
                  >
                    Ver tudo
                  </button>
                </div>

                <div className="mt-5 border-l border-white/10 pl-5">
                  <div className="relative pb-6">
                    <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-[#b3262d]" />

                    <p className="text-sm text-white">
                      Oportunidade adicionada ao pipeline
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Registrada por {selectedLead.owner}
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-zinc-600" />

                    <p className="text-sm text-white">
                      Próxima atividade programada
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {selectedLead.nextAction}
                    </p>
                  </div>
                </div>
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


    