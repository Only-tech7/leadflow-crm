"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Megaphone,
  Package,
  Target,
  UserRound,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  getLeadHistory,
  getStoredCustomers,
  type CrmCustomer,
  type CrmHistoryEvent,
} from "@/data/crm";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getEventLabel(event: CrmHistoryEvent) {
  if (event.type === "lead_created") {
    return "Captação";
  }

  if (event.type === "pipeline_created") {
    return "Pipeline";
  }

  if (event.type === "stage_changed") {
    return "Movimentação";
  }

  if (event.type === "converted") {
    return "Conversão";
  }

  return "Atividade";
}

export default function CustomerDetailsPage() {
  const params = useParams();

  const [customers, setCustomers] = useState<CrmCustomer[]>([]);
  const [history, setHistory] = useState<CrmHistoryEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCustomers(getStoredCustomers());
    setLoaded(true);
  }, []);

  const customer = useMemo(() => {
    const customerId = Number(params.id);

    return customers.find(
      (item) => item.id === customerId,
    );
  }, [customers, params.id]);

  useEffect(() => {
    if (!customer) {
      setHistory([]);
      return;
    }

    setHistory(getLeadHistory(customer.leadId));
  }, [customer]);

  if (!loaded) {
    return (
      <div className="min-h-screen px-6 py-8 text-white">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-sm text-zinc-500">
            Carregando cliente...
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen px-6 py-8 text-white">
        <div className="mx-auto max-w-[1500px]">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para clientes
          </Link>

          <div className="mt-10 rounded-3xl border border-white/[0.07] bg-[#111114] p-10 text-center">
            <p className="text-lg font-medium text-zinc-200">
              Cliente não encontrado
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              O registro pode ter sido removido ou não existe mais nesta base.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      <div className="mx-auto max-w-[1600px]">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Customer base
        </Link>

        {/* CUSTOMER DOSSIER */}
        <section className="mt-6 border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                <span className="text-[#d84a50]">CUSTOMER DOSSIER</span>
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Converted
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-zinc-100 lg:text-5xl">
                {customer.name}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                <Building2 className="h-4 w-4 text-zinc-600" />
                {customer.company}
              </div>
            </div>

            <div className="xl:text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Closed revenue
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-zinc-100">
                {formatCurrency(customer.value)}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 xl:justify-end">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Conversão concluída
              </div>
            </div>
          </div>
        </section>

        {/* COMMERCIAL SIGNALS */}
        <section className="grid border-b border-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Produto", value: customer.product, icon: Package },
            { label: "Campanha", value: customer.campaign, icon: Megaphone },
            { label: "Responsável", value: customer.owner, icon: UserRound },
            { label: "Conversão", value: formatDate(customer.convertedAt), icon: CalendarDays },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.label}
                className={`py-6 sm:px-5 xl:px-6 ${
                  index === 0 ? "sm:pl-0 xl:pl-0" : ""
                } ${index < 3 ? "xl:border-r xl:border-white/[0.06]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                      0{index + 1} / {item.label}
                    </p>
                    <p className={`${index === 3 ? "text-sm" : "text-lg"} mt-3 font-medium text-zinc-200`}>
                      {item.value}
                    </p>
                  </div>
                  <Icon className="mt-1 h-4 w-4 text-[#d84a50]" />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          {/* JOURNEY LOG */}
          <article>
            <div className="flex items-end justify-between gap-4 border-b border-white/[0.07] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#d84a50] shadow-[0_0_12px_rgba(216,74,80,0.6)]" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    Journey Log / {history.length} events
                  </p>
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-zinc-100">
                  Jornada comercial
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Registro cronológico da negociação até a conversão.
                </p>
              </div>
            </div>

            {history.length > 0 ? (
              <div className="pt-6">
                {history.map((event, index) => {
                  const isLast = index === history.length - 1;
                  const converted = event.type === "converted";

                  return (
                    <div key={event.id} className="relative flex gap-5 pb-8 last:pb-0">
                      {!isLast && (
                        <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-white/[0.08]" />
                      )}

                      <div className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center border ${
                        converted
                          ? "border-emerald-500/25 bg-emerald-500/[0.07]"
                          : "border-[#b3262d]/25 bg-[#b3262d]/[0.055]"
                      }`}>
                        <CheckCircle2 className={`h-3.5 w-3.5 ${
                          converted ? "text-emerald-400" : "text-[#d84a50]"
                        }`} />
                      </div>

                      <div className="min-w-0 flex-1 border-b border-white/[0.045] pb-7">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-zinc-200">
                                {event.title}
                              </p>
                              <span className={`border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] ${
                                converted
                                  ? "border-emerald-500/15 text-emerald-400"
                                  : "border-white/[0.07] text-zinc-500"
                              }`}>
                                {getEventLabel(event)}
                              </span>
                            </div>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                              {event.description}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5 font-mono text-[9px] text-zinc-600">
                            <Clock3 className="h-3 w-3" />
                            {formatHistoryDate(event.createdAt)}
                          </div>
                        </div>

                        {event.fromStage && event.toStage && (
                          <div className="mt-3 inline-flex items-center gap-2 border-l border-[#b3262d]/35 pl-3 font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-500">
                            <span>{event.fromStage}</span>
                            <span className="text-zinc-700">→</span>
                            <span className="text-zinc-300">{event.toStage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 border border-dashed border-white/[0.08] px-6 py-12 text-center">
                <Clock3 className="mx-auto h-5 w-5 text-zinc-600" />
                <p className="mt-4 text-sm font-medium text-zinc-400">
                  Nenhum histórico registrado
                </p>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-500">
                  Este cliente foi convertido antes da implementação do histórico comercial.
                  Novas oportunidades terão a jornada registrada automaticamente.
                </p>
              </div>
            )}
          </article>

          {/* CONVERSION INTELLIGENCE */}
          <aside className="border-l border-white/[0.07] xl:pl-8">
            <div className="border-b border-white/[0.07] pb-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                Conversion Data
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-zinc-100">
                Dados do fechamento
              </h2>
            </div>

            <div className="divide-y divide-white/[0.055]">
              {[
                ["Origem", customer.source],
                ["Campanha", customer.campaign],
                ["Produto", customer.product],
                ["Executivo", customer.owner],
                ["Data do fechamento", formatDate(customer.convertedAt)],
              ].map(([label, value]) => (
                <div key={label} className="py-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-600">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-emerald-500/20 pt-5">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-emerald-400" />
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-400">
                  Revenue generated
                </p>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
                {formatCurrency(customer.value)}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                <Target className="h-3.5 w-3.5 text-zinc-600" />
                Conversão concluída com sucesso
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}