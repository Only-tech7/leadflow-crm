"use client";

import {
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  LoaderCircle,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundSearch,
  X,
  Zap,
} from "lucide-react";

import { FormEvent, useState } from "react";

const opportunities = [
  {
    id: 1,
    name: "Mariana Alves",
    company: "Acton Experience",
    role: "Gerente de Marketing",
    initials: "MA",
    score: 92,
    probability: 87,
    signal: "Empresa ampliando investimentos em eventos",
    action: "Enviar case de evento corporativo",
    channel: "E-mail",
  },
  {
    id: 2,
    name: "Lucas Andrade",
    company: "Grupo Horizonte",
    role: "Diretor Comercial",
    initials: "LA",
    score: 86,
    probability: 78,
    signal: "Interagiu com três contatos recentes",
    action: "Fazer follow-up pelo WhatsApp",
    channel: "WhatsApp",
  },
  {
    id: 3,
    name: "Camila Rocha",
    company: "Nexo Comunicação",
    role: "Coordenadora de Produção",
    initials: "CR",
    score: 81,
    probability: 71,
    signal: "Visitou a proposta comercial novamente",
    action: "Agendar uma ligação comercial",
    channel: "Ligação",
  },
];

const insights = [
  {
    title: "Leads com maior chance de conversão",
    value: "18",
    description: "Oportunidades acima de 75% de probabilidade",
    icon: Target,
  },
  {
    title: "Receita potencial identificada",
    value: "R$ 184 mil",
    description: "Valor detectado nas oportunidades em andamento",
    icon: TrendingUp,
  },
  {
    title: "Ações prioritárias",
    value: "12",
    description: "Contatos recomendados para a equipe hoje",
    icon: Zap,
  },
];

const executiveSummary = [
  {
    label: "Oportunidades prioritárias",
    value: "18",
    icon: Target,
  },
  {
    label: "Receita potencial",
    value: "R$ 184 mil",
    icon: CircleDollarSign,
  },
  {
    label: "Empresas com alta intenção",
    value: "3",
    icon: Building2,
  },
  {
    label: "Ações recomendadas",
    value: "12",
    icon: Zap,
  },
];

const recommendations = [
  {
    title: "Priorize Mariana Alves",
    description:
      "A empresa apresenta sinais de expansão e o lead possui alto nível de interação com os conteúdos enviados.",
    badge: "Alta prioridade",
  },
  {
    title: "Retome o contato com o Grupo Horizonte",
    description:
      "O lead respondeu anteriormente e está há dois dias sem receber uma nova abordagem comercial.",
    badge: "Follow-up",
  },
  {
    title: "Envie uma proposta personalizada",
    description:
      "A Nexo Comunicação demonstrou interesse recorrente em soluções audiovisuais para eventos corporativos.",
    badge: "Oportunidade",
  },
];

const quickPrompts = [
  "Crie uma abordagem para Mariana Alves",
  "Quais contatos devo priorizar hoje?",
  "Apresente um resumo das oportunidades comerciais",
];

function generateAssistantResponse(prompt: string) {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes("mariana") ||
    normalizedPrompt.includes("abordagem")
  ) {
    return `DIAGNÓSTICO

• Empresa em um possível momento de expansão.
• Lead com alto nível de interação.
• Probabilidade de conversão estimada em 87%.
• Momento favorável para uma abordagem personalizada.

ESTRATÉGIA RECOMENDADA

Utilizar uma abordagem consultiva, demonstrando compreensão sobre o momento da Acton Experience e apresentando um case de evento corporativo relacionado ao segmento.

MENSAGEM SUGERIDA

Olá, Mariana! Tudo bem?

Percebemos que a Acton Experience está ampliando seus investimentos em eventos e acreditamos que a OVNI Productions pode contribuir com soluções audiovisuais alinhadas a esse novo momento.

Temos experiência em projetos corporativos que envolvem produção de vídeo, cobertura de eventos e criação de experiências visuais completas.

Gostaria de compartilhar um case semelhante e entender melhor os próximos projetos da Acton Experience.

Podemos conversar rapidamente nesta semana?

PRÓXIMA AÇÃO

Enviar a mensagem ainda hoje e realizar um novo contato em até dois dias úteis caso não haja resposta.`;
  }

  if (
    normalizedPrompt.includes("priorizar") ||
    normalizedPrompt.includes("prioridade") ||
    normalizedPrompt.includes("hoje") ||
    normalizedPrompt.includes("contatos")
  ) {
    return `PRIORIDADES COMERCIAIS DO DIA

1. Mariana Alves — Acton Experience
Probabilidade estimada: 87%
Ação recomendada: enviar um case de evento corporativo.
Motivo: alto score e sinais de expansão da empresa.

2. Lucas Andrade — Grupo Horizonte
Probabilidade estimada: 78%
Ação recomendada: realizar follow-up pelo WhatsApp.
Motivo: histórico recente de interação e ausência de novo contato.

3. Camila Rocha — Nexo Comunicação
Probabilidade estimada: 71%
Ação recomendada: propor uma ligação comercial.
Motivo: nova visualização da proposta enviada.

RECOMENDAÇÃO PRINCIPAL

Iniciar pela oportunidade da Acton Experience e realizar o contato com Mariana Alves nas próximas 24 horas.`;
  }

  if (
    normalizedPrompt.includes("resumo") ||
    normalizedPrompt.includes("oportunidades")
  ) {
    return `RESUMO EXECUTIVO DA OPERAÇÃO

• 18 leads apresentam probabilidade superior a 75%.
• O valor potencial identificado é de R$ 184 mil.
• Existem 12 ações comerciais recomendadas para hoje.
• Três empresas apresentam sinais de alta intenção.
• Empresas relacionadas ao setor de eventos estão apresentando maior taxa de resposta.

PRINCIPAL OPORTUNIDADE

Mariana Alves, da Acton Experience, aparece como a oportunidade mais relevante neste momento, com score 92 e probabilidade estimada de conversão de 87%.

DIRECIONAMENTO RECOMENDADO

Priorizar contatos de alta intenção, utilizar abordagens personalizadas e apresentar cases relacionados ao segmento de cada empresa.`;
  }

  return `ANÁLISE COMERCIAL

A operação apresenta oportunidades relevantes que podem ser trabalhadas imediatamente.

Os contatos com maior potencial neste momento são:

• Mariana Alves — Acton Experience
• Lucas Andrade — Grupo Horizonte
• Camila Rocha — Nexo Comunicação

RECOMENDAÇÃO

Priorizar os leads com maior score, revisar as interações mais recentes e adaptar a abordagem ao momento de cada empresa.

PRÓXIMA AÇÃO

Começar pela oportunidade da Acton Experience e preparar uma abordagem personalizada com um case relacionado a eventos corporativos.`;
}

export default function IntelligencePage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  function openAssistant(initialPrompt = "") {
    setPrompt(initialPrompt);
    setAssistantResponse("");
    setIsAssistantOpen(true);
  }

  function closeAssistant() {
    if (isGenerating) {
      return;
    }

    setIsAssistantOpen(false);
    setPrompt("");
    setAssistantResponse("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setAssistantResponse("");

    window.setTimeout(() => {
      setAssistantResponse(generateAssistantResponse(trimmedPrompt));
      setIsGenerating(false);
    }, 1200);
  }

  return (
    <>
      <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1600px]">
          {/* Cabeçalho */}
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
                <BrainCircuit className="h-4 w-4 text-[#d84a50]" />

                Análises estratégicas em tempo real
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
                Inteligência Comercial
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
                O LeadFlow analisa o comportamento dos leads, identifica
                oportunidades e recomenda as próximas ações para a equipe
                comercial.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Análise atualizada agora
            </div>
          </header>

          {/* Resumo executivo */}
          <section className="relative mt-8 overflow-hidden rounded-3xl border border-[#b3262d]/20 bg-[#141011] p-6 lg:p-7">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#b3262d]/15 blur-[90px]" />

            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b3262d]/25 bg-[#b3262d]/10 px-3 py-1.5 text-xs font-medium text-[#ef8b90]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Visão consolidada da operação
                  </div>

                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
                    Resumo Executivo
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                    O LeadFlow identificou oportunidades que merecem atenção
                    imediata e organizou as ações mais relevantes para o time
                    comercial.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#b3262d]/20 bg-[#b3262d]/10 px-4 py-3 lg:max-w-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#d84a50]">
                    Principal recomendação
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Priorizar o contato com Mariana Alves nas próximas 24 horas
                    e apresentar um case de evento corporativo.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {executiveSummary.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs leading-5 text-zinc-500">
                            {item.label}
                          </p>

                          <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">
                            {item.value}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#b3262d]/20 bg-[#b3262d]/10">
                          <Icon className="h-4 w-4 text-[#d84a50]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Indicadores */}
          <section className="mt-6 grid gap-4 md:grid-cols-3">
            {insights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-zinc-500">{item.title}</p>

                      <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100">
                        {item.value}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-zinc-600">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b3262d]/20 bg-[#b3262d]/10">
                      <Icon className="h-5 w-5 text-[#d84a50]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Oportunidades e recomendações */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
                <div>
                  <h2 className="font-medium text-zinc-100">
                    Oportunidades Priorizadas
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">
                    Priorização automática baseada em comportamento, histórico
                    de relacionamento e potencial de conversão.
                  </p>
                </div>

                <UserRoundSearch className="h-5 w-5 text-zinc-600" />
              </div>

              <div className="divide-y divide-white/[0.05]">
                {opportunities.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 transition hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#b3262d]/15 bg-[#b3262d]/10 text-sm font-semibold text-[#ef8b90]">
                          {lead.initials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-zinc-200">
                              {lead.name}
                            </h3>

                            <span className="rounded-full border border-[#b3262d]/20 bg-[#b3262d]/10 px-2.5 py-1 text-xs font-medium text-[#ef8b90]">
                              Score {lead.score}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-zinc-500">
                            {lead.role} · {lead.company}
                          </p>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                              <p className="text-xs text-zinc-600">
                                Sinal identificado
                              </p>

                              <p className="mt-2 text-sm leading-5 text-zinc-300">
                                {lead.signal}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                              <p className="text-xs text-zinc-600">
                                Próxima ação
                              </p>

                              <p className="mt-2 text-sm leading-5 text-zinc-300">
                                {lead.action}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full shrink-0 lg:w-[190px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-600">
                            Probabilidade
                          </span>

                          <span className="text-sm font-semibold text-emerald-300">
                            {lead.probability}%
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                            style={{ width: `${lead.probability}%` }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openAssistant(
                              `Crie uma abordagem para ${lead.name}, da empresa ${lead.company}`,
                            )
                          }
                          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#b3262d] text-sm font-medium text-white shadow-[0_10px_24px_rgba(179,38,45,0.2)] transition hover:bg-[#971f26]"
                        >
                          {lead.channel === "E-mail" ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )}

                          Gerar abordagem
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="border-b border-white/[0.06] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#d84a50]" />

                  <h2 className="font-medium text-zinc-100">
                    Recomendações Estratégicas
                  </h2>
                </div>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Direcionamentos baseados no comportamento e no histórico das
                  oportunidades.
                </p>
              </div>

              <div className="space-y-4 p-5">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation.title}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-white/[0.11] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-zinc-200">
                            {recommendation.title}
                          </h3>

                          <span className="rounded-full border border-[#b3262d]/15 bg-[#b3262d]/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#d84a50]">
                            {recommendation.badge}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.06] p-5">
                <div className="rounded-xl border border-[#b3262d]/20 bg-[#b3262d]/[0.07] p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-[#d84a50]" />

                    <div>
                      <p className="text-sm font-medium text-[#ef8b90]">
                        Análise do cenário
                      </p>

                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Leads de empresas do setor de eventos estão apresentando
                        maior taxa de resposta nesta semana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Consultor estratégico */}
          <section className="relative mt-6 overflow-hidden rounded-2xl border border-[#b3262d]/20 bg-gradient-to-r from-[#b3262d]/[0.09] to-transparent p-5">
            <div className="absolute -left-16 -bottom-24 h-52 w-52 rounded-full bg-[#b3262d]/10 blur-[80px]" />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#b3262d]/20 bg-[#b3262d]/10 text-[#d84a50]">
                  <BrainCircuit className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-medium text-zinc-100">
                    Consultor Estratégico
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
                    Gere abordagens personalizadas, diagnósticos comerciais,
                    resumos de oportunidades e direcionamentos para os próximos
                    contatos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAssistant()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#b3262d] px-5 text-sm font-medium text-white shadow-[0_10px_25px_rgba(179,38,45,0.22)] transition hover:bg-[#971f26]"
              >
                <Sparkles className="h-4 w-4" />
                Abrir consultor
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Modal do consultor */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            onClick={closeAssistant}
            aria-label="Fechar consultor"
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/[0.1] bg-[#101014] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#b3262d]/20 bg-[#b3262d]/10 text-[#d84a50]">
                  <BrainCircuit className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-zinc-100">
                      Consultor Estratégico
                    </h2>

                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Online
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">
                    Análises e recomendações para a operação comercial
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAssistant}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-zinc-500 transition hover:bg-white/[0.07] hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {!assistantResponse && !isGenerating && (
                <>
                  <div className="rounded-2xl border border-[#b3262d]/20 bg-[#b3262d]/[0.06] p-5">
                    <div className="flex gap-3">
                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#d84a50]" />

                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          Como posso ajudar sua operação?
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                          Posso analisar contatos, gerar abordagens comerciais,
                          apresentar diagnósticos e recomendar as próximas ações
                          da equipe.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                      Sugestões
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickPrompts.map((quickPrompt) => (
                        <button
                          key={quickPrompt}
                          type="button"
                          onClick={() => setPrompt(quickPrompt)}
                          className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-left text-xs text-zinc-400 transition hover:border-[#b3262d]/35 hover:bg-[#b3262d]/[0.07] hover:text-zinc-200"
                        >
                          {quickPrompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {isGenerating && (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b3262d]/20 bg-[#b3262d]/10">
                    <LoaderCircle className="h-6 w-6 animate-spin text-[#d84a50]" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-zinc-200">
                    Analisando dados comerciais
                  </p>

                  <p className="mt-2 text-xs text-zinc-600">
                    Preparando uma recomendação estratégica...
                  </p>
                </div>
              )}

              {assistantResponse && !isGenerating && (
                <div>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#b3262d] px-4 py-3 text-sm leading-6 text-white">
                      {prompt}
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#b3262d]/20 bg-[#b3262d]/10 text-[#d84a50]">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-white/[0.07] bg-white/[0.025] p-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-300">
                        {assistantResponse}
                      </pre>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPrompt("");
                      setAssistantResponse("");
                    }}
                    className="mt-5 text-xs font-medium text-[#d84a50] transition hover:text-[#ef8b90]"
                  >
                    Fazer uma nova solicitação
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-white/[0.07] bg-[#101014] p-5"
            >
              <div className="flex items-end gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2 transition focus-within:border-[#b3262d]/40">
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Digite uma solicitação para o consultor..."
                  rows={2}
                  disabled={isGenerating}
                  className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-700 disabled:cursor-not-allowed"
                />

                <button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#b3262d] text-white transition hover:bg-[#971f26] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Enviar mensagem"
                >
                  {isGenerating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-zinc-700">
                Pressione Enter para enviar ou Shift + Enter para quebrar a
                linha
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}