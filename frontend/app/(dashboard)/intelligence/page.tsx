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
      <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
        <style jsx>{`
          @keyframes lf-scan {
            0% { transform: translateY(-120%); opacity: 0; }
            12% { opacity: .45; }
            75% { opacity: .18; }
            100% { transform: translateY(520%); opacity: 0; }
          }
          @keyframes lf-pulse-ring {
            0%, 100% { transform: scale(.92); opacity: .22; }
            50% { transform: scale(1.08); opacity: .55; }
          }
          @keyframes lf-signal {
            0%, 100% { opacity: .22; transform: scaleX(.72); }
            50% { opacity: .9; transform: scaleX(1); }
          }
          @keyframes lf-float {
            0%, 100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(0,-5px,0); }
          }
          .lf-scan { animation: lf-scan 6.5s linear infinite; }
          .lf-ring { animation: lf-pulse-ring 3.4s ease-in-out infinite; }
          .lf-signal { animation: lf-signal 2.6s ease-in-out infinite; transform-origin: left; }
          .lf-float { animation: lf-float 5s ease-in-out infinite; }
        `}</style>

        <div className="mx-auto max-w-[1600px]">
          <header className="relative overflow-hidden border-b border-white/[0.07] pb-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b3262d]/70 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#b3262d]/10">
              <div className="lf-ring absolute inset-10 rounded-full border border-[#b3262d]/15" />
              <div className="lf-ring absolute inset-24 rounded-full border border-[#d84a50]/20 [animation-delay:700ms]" />
            </div>

            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                  <span className="text-[#d84a50]">06 / DECISION INTELLIGENCE</span>
                  <span className="h-px w-8 bg-white/[0.08]" />
                  <span className="text-zinc-600">Analysis Engine / Live</span>
                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-zinc-100 lg:text-6xl">
                  Inteligência
                  <span className="block bg-gradient-to-r from-zinc-500 via-zinc-400 to-[#b3262d] bg-clip-text text-transparent">
                    Comercial
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
                  O LeadFlow interpreta comportamento, intenção e contexto comercial
                  para transformar dados da operação em decisões acionáveis.
                </p>
              </div>

              <div className="min-w-[270px] border-l border-white/[0.08] pl-5">
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Intelligence engine online
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[72, 91, 64].map((width, index) => (
                    <div key={index} className="h-7 border-b border-white/[0.06]">
                      <div
                        className="lf-signal mt-4 h-px bg-[#d84a50]"
                        style={{
                          width: `${width}%`,
                          animationDelay: `${index * 420}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-700">
                  Signals synchronized / updated now
                </p>
              </div>
            </div>
          </header>

          <section className="relative mt-7 overflow-hidden border-y border-[#b3262d]/20 bg-[#b3262d]/[0.025]">
            <div className="lf-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[#b3262d]/[0.06] to-transparent" />
            <div className="relative grid xl:grid-cols-[1.35fr_1fr]">
              <div className="border-b border-white/[0.06] p-6 xl:border-b-0 xl:border-r xl:p-7">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-4 w-4 text-[#d84a50]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
                    Executive Analysis
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-zinc-100">
                  O sistema detectou uma janela de oportunidade.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  Há concentração de intenção em contas relacionadas a eventos.
                  A recomendação é agir sobre os contatos de maior score antes de
                  ampliar o volume de prospecção.
                </p>

                <div className="mt-7 grid gap-px border-y border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-4">
                  {executiveSummary.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="bg-[#0a0a0c]/90 p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[8px] text-zinc-700">
                            0{index + 1}
                          </span>
                          <Icon className="h-3.5 w-3.5 text-[#d84a50]" />
                        </div>
                        <p className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
                          {item.value}
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-zinc-500">
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative p-6 xl:p-7">
                <div className="absolute right-6 top-6 font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-700">
                  Priority signal / 01
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#d84a50]">
                  Principal recomendação
                </p>
                <p className="mt-5 max-w-md text-xl leading-8 text-zinc-200">
                  Priorizar o contato com
                  <span className="text-white"> Mariana Alves </span>
                  nas próximas 24 horas.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Score 92 · probabilidade estimada em 87% · sinal de expansão
                  identificado na Acton Experience.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    openAssistant("Crie uma abordagem para Mariana Alves")
                  }
                  className="mt-7 inline-flex h-10 items-center gap-2 border border-[#b3262d]/45 bg-[#b3262d]/10 px-4 text-sm font-medium text-[#ef8b90] transition hover:bg-[#b3262d]/20"
                >
                  <Sparkles className="h-4 w-4" />
                  Gerar abordagem
                </button>
              </div>
            </div>
          </section>

          <section className="grid border-b border-white/[0.07] md:grid-cols-3">
            {insights.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`py-6 md:px-6 ${index === 0 ? "md:pl-0" : ""} ${
                    index < 2 ? "md:border-r md:border-white/[0.06]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                        Signal 0{index + 1}
                      </p>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-zinc-100">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-zinc-400">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        {item.description}
                      </p>
                    </div>
                    <Icon className="lf-float mt-1 h-4 w-4 text-[#d84a50]" />
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-8 grid gap-8 xl:grid-cols-[1.55fr_0.85fr]">
            <div>
              <div className="flex items-end justify-between border-b border-white/[0.07] pb-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
                    Opportunity Radar
                  </p>
                  <h2 className="mt-2 text-lg font-medium text-zinc-100">
                    Oportunidades Priorizadas
                  </h2>
                </div>
                <UserRoundSearch className="h-4 w-4 text-zinc-600" />
              </div>

              <div className="divide-y divide-white/[0.055]">
                {opportunities.map((lead, index) => (
                  <article key={lead.id} className="group py-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_210px]">
                      <div className="flex min-w-0 gap-4">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-[#b3262d]/20 bg-[#b3262d]/[0.055] font-mono text-[10px] font-semibold text-[#ef8b90]">
                          {lead.initials}
                          <span className="absolute -left-px top-0 h-2 w-px bg-[#d84a50]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-[8px] text-zinc-700">
                              0{index + 1}
                            </span>
                            <h3 className="font-medium text-zinc-200">{lead.name}</h3>
                            <span className="border border-[#b3262d]/20 bg-[#b3262d]/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#ef8b90]">
                              SCORE {lead.score}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">
                            {lead.role} · {lead.company}
                          </p>

                          <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div className="border-l border-white/[0.08] pl-3">
                              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-700">
                                Signal detected
                              </p>
                              <p className="mt-2 text-sm leading-5 text-zinc-300">
                                {lead.signal}
                              </p>
                            </div>
                            <div className="border-l border-[#b3262d]/25 pl-3">
                              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#b85a5f]">
                                Recommended action
                              </p>
                              <p className="mt-2 text-sm leading-5 text-zinc-300">
                                {lead.action}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-l border-white/[0.06] pl-5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-600">
                            Probability
                          </span>
                          <span className="font-mono text-lg font-semibold text-emerald-300">
                            {lead.probability}%
                          </span>
                        </div>
                        <div className="mt-3 h-px bg-white/[0.07]">
                          <div
                            className="h-px bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all duration-700"
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
                          className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 border border-[#b3262d]/35 bg-[#b3262d]/10 text-xs font-medium text-[#ef8b90] transition hover:bg-[#b3262d]/20"
                        >
                          {lead.channel === "E-mail" ? (
                            <Mail className="h-3.5 w-3.5" />
                          ) : (
                            <MessageCircle className="h-3.5 w-3.5" />
                          )}
                          Gerar abordagem
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside>
              <div className="flex items-end justify-between border-b border-white/[0.07] pb-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d84a50]">
                    Decision Engine
                  </p>
                  <h2 className="mt-2 text-lg font-medium text-zinc-100">
                    Recomendações
                  </h2>
                </div>
                <Sparkles className="h-4 w-4 text-[#d84a50]" />
              </div>

              <div className="divide-y divide-white/[0.055]">
                {recommendations.map((recommendation, index) => (
                  <div key={recommendation.title} className="py-5">
                    <div className="flex gap-3">
                      <span className="mt-1 font-mono text-[8px] text-zinc-700">
                        0{index + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-zinc-200">
                            {recommendation.title}
                          </h3>
                          <span className="border border-[#b3262d]/15 bg-[#b3262d]/[0.06] px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-[#d84a50]">
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

              <div className="relative mt-5 overflow-hidden border border-[#b3262d]/18 bg-[#b3262d]/[0.035] p-4">
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d84a50] to-transparent" />
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 text-[#d84a50]" />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#d84a50]">
                      Pattern detected
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Leads de empresas do setor de eventos estão apresentando
                      maior taxa de resposta nesta semana.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section className="relative mt-8 overflow-hidden border-y border-[#b3262d]/20 py-6">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-[#b3262d]/[0.055] blur-[70px]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-[#b3262d]/25 bg-[#b3262d]/10 text-[#d84a50]">
                  <span className="absolute inset-0 animate-ping border border-[#b3262d]/15 [animation-duration:2.8s]" />
                  <BrainCircuit className="relative h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#d84a50]">
                    AI Strategic Consultant
                  </p>
                  <h2 className="mt-1 font-medium text-zinc-100">
                    Consulte a inteligência da operação
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
                    Gere abordagens, diagnósticos e próximos passos a partir dos
                    sinais comerciais já identificados pelo LeadFlow.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAssistant()}
                className="inline-flex h-10 items-center justify-center gap-2 border border-[#b3262d]/50 bg-[#b3262d] px-5 text-sm font-medium text-white shadow-[0_0_28px_rgba(179,38,45,0.16)] transition hover:bg-[#c62c34]"
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

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-white/[0.1] bg-[#0c0c0f]/95 shadow-[0_30px_100px_rgba(0,0,0,0.75),0_0_60px_rgba(179,38,45,0.08)] backdrop-blur-xl">
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