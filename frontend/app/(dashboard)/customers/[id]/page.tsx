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
      <div className="min-h-screen bg-[#09090b] px-6 py-8 text-white">
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
      <div className="min-h-screen bg-[#09090b] px-6 py-8 text-white">
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
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">

        {/* VOLTAR */}

        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para clientes
        </Link>

        {/* CABEÇALHO */}

        <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#111114] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-1.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Cliente convertido
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-zinc-100">
                {customer.name}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
                <Building2 className="h-4 w-4" />
                {customer.company}
              </div>
            </div>

            <div className="rounded-2xl border border-[#b3262d]/20 bg-[#b3262d]/[0.055] px-6 py-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#d84a50]">
                Valor fechado
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {formatCurrency(customer.value)}
              </p>
            </div>

          </div>
        </section>

        {/* INDICADORES */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <Package className="h-5 w-5 text-[#d84a50]" />

            <p className="mt-5 text-xs uppercase tracking-[0.15em] text-zinc-600">
              Produto
            </p>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {customer.product}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <Megaphone className="h-5 w-5 text-[#d84a50]" />

            <p className="mt-5 text-xs uppercase tracking-[0.15em] text-zinc-600">
              Campanha
            </p>

            <p className="mt-2 text-sm font-medium text-zinc-200">
              {customer.campaign}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <UserRound className="h-5 w-5 text-[#d84a50]" />

            <p className="mt-5 text-xs uppercase tracking-[0.15em] text-zinc-600">
              Responsável
            </p>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {customer.owner}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <CalendarDays className="h-5 w-5 text-[#d84a50]" />

            <p className="mt-5 text-xs uppercase tracking-[0.15em] text-zinc-600">
              Conversão
            </p>

            <p className="mt-2 text-sm font-medium text-zinc-200">
              {formatDate(customer.convertedAt)}
            </p>
          </div>

        </section>

        {/* CONTEÚDO */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

          {/* JORNADA REAL */}

          <article className="rounded-3xl border border-white/[0.07] bg-[#111114] p-6 lg:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-lg font-semibold text-zinc-100">
                  Jornada comercial
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Histórico real das movimentações realizadas durante a negociação.
                </p>
              </div>

              <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-500">
                {history.length} eventos
              </span>

            </div>

            {history.length > 0 ? (
              <div className="mt-8">

                {history.map((event, index) => {
                  const isLast =
                    index === history.length - 1;

                  const converted =
                    event.type === "converted";

                  return (
                    <div
                      key={event.id}
                      className="relative flex gap-5 pb-8 last:pb-0"
                    >

                      {!isLast && (
                        <div className="absolute left-[19px] top-10 h-[calc(100%-20px)] w-px bg-white/[0.08]" />
                      )}

                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                          converted
                            ? "border-emerald-500/20 bg-emerald-500/[0.08]"
                            : "border-[#b3262d]/20 bg-[#b3262d]/[0.07]"
                        }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            converted
                              ? "text-emerald-400"
                              : "text-[#d84a50]"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <div className="flex flex-wrap items-center gap-2">

                              <p className="text-sm font-semibold text-zinc-200">
                                {event.title}
                              </p>

                              <span
                                className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] ${
                                  converted
                                    ? "border-emerald-500/15 bg-emerald-500/[0.05] text-emerald-400"
                                    : "border-white/[0.07] bg-white/[0.025] text-zinc-600"
                                }`}
                              >
                                {getEventLabel(event)}
                              </span>

                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                              {event.description}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-zinc-600">
                            <Clock3 className="h-3 w-3" />

                            {formatHistoryDate(
                              event.createdAt,
                            )}
                          </div>

                        </div>

                        {event.fromStage &&
                          event.toStage && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-zinc-600">
                              <span>
                                {event.fromStage}
                              </span>

                              <span>→</span>

                              <span className="font-medium text-zinc-300">
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
              <div className="mt-8 rounded-2xl border border-dashed border-white/[0.08] px-6 py-12 text-center">

                <Clock3 className="mx-auto h-6 w-6 text-zinc-700" />

                <p className="mt-4 text-sm font-medium text-zinc-400">
                  Nenhum histórico registrado
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-600">
                  Este cliente foi convertido antes da implementação do histórico comercial.
                  Novas oportunidades terão toda a jornada registrada automaticamente.
                </p>

              </div>
            )}

          </article>

          {/* DETALHES */}

          <article className="rounded-3xl border border-white/[0.07] bg-[#111114] p-6 lg:p-7">

            <p className="text-lg font-semibold text-zinc-100">
              Detalhes da conversão
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Informações comerciais relacionadas ao fechamento.
            </p>

            <div className="mt-6 space-y-3">

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                  Origem
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {customer.source}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                  Campanha
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {customer.campaign}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                  Produto
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {customer.product}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                  Executivo responsável
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {customer.owner}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                  Data do fechamento
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatDate(customer.convertedAt)}
                </p>
              </div>

            </div>

            {/* RECEITA */}

            <div className="mt-5 rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5">

              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-emerald-400" />

                <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-400/80">
                  Receita gerada
                </p>
              </div>

              <p className="mt-3 text-3xl font-semibold text-emerald-300">
                {formatCurrency(customer.value)}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
                <Target className="h-3.5 w-3.5" />
                Conversão concluída com sucesso
              </div>

            </div>

          </article>

        </section>

      </div>
    </div>
  );
}