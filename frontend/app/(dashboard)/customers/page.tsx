"use client";

import Link from "next/link";

import {
  Building2,
  CalendarDays,
  CircleDollarSign,
  Package,
  Search,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getStoredCustomers,
  type CrmCustomer,
  type ProductType,
} from "@/data/crm";

type ProductFilter = "Todos" | ProductType;

const productStyles: Record<ProductType, string> = {
  Roupas: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  Canecas: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Livros: "border-violet-500/20 bg-violet-500/10 text-violet-300",
};

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
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CrmCustomer[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductFilter>("Todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCustomers(getStoredCustomers());
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesProduct =
        selectedProduct === "Todos" ||
        customer.product === selectedProduct;

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        customer.name.toLowerCase().includes(searchValue) ||
        customer.company.toLowerCase().includes(searchValue) ||
        customer.campaign.toLowerCase().includes(searchValue);

      return matchesProduct && matchesSearch;
    });
  }, [customers, search, selectedProduct]);

  const totalRevenue = useMemo(
    () =>
      filteredCustomers.reduce(
        (total, customer) => total + customer.value,
        0,
      ),
    [filteredCustomers],
  );

  const averageTicket =
    filteredCustomers.length > 0
      ? totalRevenue / filteredCustomers.length
      : 0;

  const topProduct = useMemo(() => {
    if (filteredCustomers.length === 0) {
      return null;
    }

    const totals: Record<ProductType, number> = {
      Roupas: 0,
      Canecas: 0,
      Livros: 0,
    };

    filteredCustomers.forEach((customer) => {
      totals[customer.product] += customer.value;
    });

    return (Object.entries(totals) as [ProductType, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0];
  }, [filteredCustomers]);

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1800px]">
        {/* CABEÇALHO */}

        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#b3262d]/20 bg-[#b3262d]/10 px-3 py-1.5 text-xs font-medium text-[#ef8b90]">
              <Users className="h-3.5 w-3.5" />
              Carteira comercial
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-100">
              Clientes
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-500">
              Acompanhe os clientes conquistados, receita gerada e a
              origem de cada conversão realizada pelo time comercial.
            </p>
          </div>

          <div className="relative w-full xl:w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar cliente ou empresa..."
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-[#b3262d]/40 focus:bg-white/[0.04]"
            />
          </div>
        </header>

        {/* INDICADORES */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                Clientes conquistados
              </p>

              <Users className="h-4 w-4 text-zinc-600" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-zinc-100">
              {filteredCustomers.length}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Conversões registradas
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                Receita fechada
              </p>

              <CircleDollarSign className="h-4 w-4 text-[#d84a50]" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-zinc-100">
              {formatCurrency(totalRevenue)}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Valor dos negócios conquistados
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                Ticket médio
              </p>

              <TrendingUp className="h-4 w-4 text-zinc-600" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-zinc-100">
              {formatCurrency(averageTicket)}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Média por cliente convertido
            </p>
          </div>

          <div className="rounded-2xl border border-[#b3262d]/15 bg-[#b3262d]/[0.045] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#d84a50]">
                Produto destaque
              </p>

              <Package className="h-4 w-4 text-[#d84a50]" />
            </div>

            <p className="mt-5 text-2xl font-semibold text-zinc-100">
              {topProduct ? topProduct[0] : "—"}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              {topProduct
                ? `${formatCurrency(topProduct[1])} em vendas`
                : "Aguardando conversões"}
            </p>
          </div>
        </section>

        {/* FILTROS */}

        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#111114] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Filtrar carteira
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Visualize os clientes por linha de produto.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["Todos", "Roupas", "Canecas", "Livros"] as const).map(
              (product) => {
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
                    {product}
                  </button>
                );
              },
            )}
          </div>
        </section>

        {/* CLIENTES */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#111114]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
            <div>
              <p className="text-lg font-semibold text-zinc-100">
                Clientes convertidos
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Histórico de oportunidades conquistadas.
              </p>
            </div>

            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
              {filteredCustomers.length} clientes
            </span>
          </div>

          {filteredCustomers.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {filteredCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="group grid gap-5 px-6 py-5 transition hover:bg-white/[0.025] xl:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr]"
                >
                  {/* CLIENTE */}

                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-sm font-semibold text-zinc-300">
                      {customer.name
                        .split(" ")
                        .slice(0, 2)
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-zinc-200">
                        {customer.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
                        <Building2 className="h-3.5 w-3.5" />
                        {customer.company}
                      </div>
                    </div>
                  </div>

                  {/* PRODUTO */}

                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                      Produto
                    </p>

                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                          productStyles[customer.product]
                        }`}
                      >
                        {customer.product}
                      </span>
                    </div>
                  </div>

                  {/* CAMPANHA */}

                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                      Origem
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      {customer.campaign}
                    </p>

                    <p className="mt-1 text-xs text-zinc-700">
                      {customer.source}
                    </p>
                  </div>

                  {/* RESPONSÁVEL */}

                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                      Responsável
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                      <UserRound className="h-3.5 w-3.5 text-zinc-600" />
                      {customer.owner}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(customer.convertedAt)}
                    </div>
                  </div>

                  {/* VALOR */}

                  <div className="flex flex-col justify-center xl:items-end">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                      Valor fechado
                    </p>

                    <p className="mt-2 text-lg font-semibold text-zinc-100">
                      {formatCurrency(customer.value)}
                    </p>

                    <span className="mt-1 text-[11px] font-medium text-emerald-400">
                      Cliente conquistado
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center px-6 py-16">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  <Users className="h-6 w-6 text-zinc-700" />
                </div>

                <p className="mt-5 font-medium text-zinc-300">
                  Nenhum cliente encontrado
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Quando uma oportunidade for movida para Fechado na
                  Pipeline, o cliente aparecerá automaticamente aqui.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}