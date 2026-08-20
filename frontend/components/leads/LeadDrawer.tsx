"use client";

import {
  BrainCircuit,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Target,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

type Lead = {
  id: number;
  name: string;
  role: string;
  company: string;
  origin: string;
  score: number;
  status: string;
  nextAction: string;
  owner: string;
  initials: string;
};

type LeadDrawerProps = {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
};

type GeneratedMessageType = "email" | "whatsapp" | null;

const timeline = [
  {
    title: "Lead adicionado à plataforma",
    description: "Contato importado e enriquecido com dados comerciais.",
    time: "Hoje, 08:42",
  },
  {
    title: "Primeiro contato realizado",
    description: "E-mail de apresentação enviado.",
    time: "Ontem, 16:20",
  },
  {
    title: "Interesse identificado",
    description: "O lead abriu o e-mail e acessou a apresentação comercial.",
    time: "Ontem, 16:43",
  },
];

const buyingSignals = [
  "Empresa demonstra interesse em soluções audiovisuais",
  "Contato possui poder de decisão",
  "Interação recente com apresentação comercial",
];

function getScoreColor(score: number) {
  if (score >= 85) {
    return "bg-emerald-400";
  }

  if (score >= 70) {
    return "bg-blue-400";
  }

  return "bg-amber-400";
}

function getProbability(score: number) {
  return Math.min(Math.max(score - 5, 45), 94);
}

export function LeadDrawer({
  lead,
  isOpen,
  onClose,
}: LeadDrawerProps) {
  const [generatedMessageType, setGeneratedMessageType] =
    useState<GeneratedMessageType>(null);

  const [copied, setCopied] = useState(false);

  if (!lead) {
    return null;
  }

  const probability = getProbability(lead.score);

  const firstName = lead.name.split(" ")[0];

  const emailMessage = `Assunto: Uma ideia para os próximos projetos da ${lead.company}

Olá, ${firstName}. Tudo bem?

Analisei o momento da ${lead.company} e acredito que podemos contribuir com soluções audiovisuais alinhadas aos próximos projetos da empresa.

Na OVNI Productions, desenvolvemos produções pensadas para fortalecer a comunicação, gerar impacto e entregar uma experiência completa ao público.

Gostaria de entender melhor os projetos que vocês estão planejando e apresentar algumas possibilidades.

Podemos conversar por alguns minutos nesta semana?

Abraços,
${lead.owner}`;

  const whatsappMessage = `Olá, ${firstName}! Tudo bem?

Sou ${lead.owner}, da OVNI Productions.

Vi o trabalho da ${lead.company} e acredito que podemos contribuir com soluções audiovisuais para os próximos projetos da empresa.

Podemos marcar uma conversa rápida para eu entender melhor o momento de vocês?`;

  const generatedMessage =
    generatedMessageType === "email"
      ? emailMessage
      : generatedMessageType === "whatsapp"
        ? whatsappMessage
        : "";

  function handleGenerateMessage(type: GeneratedMessageType) {
    setGeneratedMessageType(type);
    setCopied(false);
  }

  async function handleCopyMessage() {
    if (!generatedMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar detalhes do lead"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-2xl border-l border-white/[0.08] bg-[#0d0d10] shadow-[-30px_0_80px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <header className="border-b border-white/[0.07] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-700 text-sm font-semibold text-white">
                  {lead.initials}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-zinc-100">
                      {lead.name}
                    </h2>

                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                      {lead.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-zinc-500">
                    {lead.role}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                    <Building2 className="h-3.5 w-3.5" />
                    {lead.company}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <section className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-zinc-600">Lead Score</p>

                    <p className="mt-2 text-2xl font-semibold text-zinc-100">
                      {lead.score}
                      <span className="text-sm text-zinc-600">/100</span>
                    </p>
                  </div>

                  <Sparkles className="h-5 w-5 text-blue-300" />
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${getScoreColor(
                      lead.score,
                    )}`}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-600">
                    Chance de conversão
                  </p>

                  <Target className="h-5 w-5 text-emerald-300" />
                </div>

                <p className="mt-2 text-2xl font-semibold text-emerald-300">
                  {probability}%
                </p>

                <p className="mt-2 text-[11px] leading-5 text-zinc-600">
                  Potencial calculado pela IA.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-600">
                    Melhor horário
                  </p>

                  <Clock3 className="h-5 w-5 text-violet-300" />
                </div>

                <p className="mt-2 text-lg font-semibold text-zinc-100">
                  10h às 12h
                </p>

                <p className="mt-2 text-[11px] leading-5 text-zinc-600">
                  Baseado nas interações anteriores.
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-violet-500/15 bg-violet-500/[0.05] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                  <BrainCircuit className="h-5 w-5 text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100">
                    Recomendação da IA
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {lead.nextAction}. O contato apresenta alto potencial e
                    demonstrou interesse recente nas soluções da empresa.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateMessage("email")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                    >
                      <Mail className="h-4 w-4" />
                      Gerar e-mail
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenerateMessage("whatsapp")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Gerar WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {generatedMessageType && (
              <section className="mt-4 overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-300" />

                    <p className="text-sm font-medium text-zinc-200">
                      Abordagem gerada pela IA
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-300">
                    {generatedMessage}
                  </pre>
                </div>
              </section>
            )}

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">
                  Sinais de oportunidade
                </h3>

                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-violet-300">
                  <Zap className="h-3.5 w-3.5" />
                  IA
                </span>
              </div>

              <div className="space-y-2">
                {buyingSignals.map((signal) => (
                  <div
                    key={signal}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                    <p className="text-sm leading-5 text-zinc-400">
                      {signal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">
                  Informações do contato
                </h3>

                <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                  Perfil enriquecido
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                  <Mail className="h-4 w-4 text-zinc-700" />

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-700">
                      E-mail
                    </p>

                    <p className="mt-1 truncate text-sm text-zinc-300">
                      contato@
                      {lead.company.toLowerCase().replaceAll(" ", "")}
                      .com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                  <Phone className="h-4 w-4 text-zinc-700" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-700">
                      Telefone
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      (31) 99999-0000
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                  <LinkIcon className="h-4 w-4 text-zinc-700" />

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-700">
                      LinkedIn
                    </p>

                    <p className="mt-1 truncate text-sm text-blue-300">
                      linkedin.com/in/
                      {lead.name.toLowerCase().replaceAll(" ", "-")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <MapPin className="h-4 w-4 text-zinc-700" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-700">
                      Localização
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      Belo Horizonte, MG
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">
                  Atividades recentes
                </h3>

                <button
                  type="button"
                  className="text-xs text-blue-300 transition hover:text-blue-200"
                >
                  Ver histórico
                </button>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="space-y-5">
                  {timeline.map((item, index) => (
                    <div
                      key={item.title}
                      className="relative flex gap-3"
                    >
                      {index !== timeline.length - 1 && (
                        <div className="absolute left-[7px] top-5 h-[calc(100%+4px)] w-px bg-white/[0.07]" />
                      )}

                      <div className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#0d0d10] bg-blue-500 ring-1 ring-blue-500/30" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-zinc-300">
                            {item.title}
                          </p>

                          <span className="text-[10px] text-zinc-700">
                            {item.time}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-zinc-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <UserRound className="h-4 w-4" />
                Responsável pelo lead:
                <span className="font-medium text-zinc-300">
                  {lead.owner}
                </span>
              </div>
            </section>
          </div>

          <footer className="border-t border-white/[0.07] bg-[#0d0d10]/95 px-6 py-4 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]"
              >
                Editar lead
              </button>

              <button
                type="button"
                onClick={() => handleGenerateMessage("email")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] transition hover:bg-blue-500"
              >
                <Mail className="h-4 w-4" />
                Gerar abordagem
              </button>
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
}