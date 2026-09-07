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
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      <div className="mx-auto max-w-[1800px]">
        {/* CUSTOMER CONTROL HEADER */}
        <header className="border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                <span className="text-[#d84a50]">04 / CUSTOMER BASE</span>
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="text-zinc-600">Converted / Active</span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-zinc-100 lg:text-5xl">
                Carteira
                <span className="block text-zinc-500">de Clientes</span>
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
                Acompanhe as oportunidades conquistadas, a receita gerada e o
                contexto comercial preservado após cada conversão.
              </p>
            </div>

            <div className="group flex h-10 w-full items-center gap-3 border-b border-white/[0.1] px-1 transition focus-within:border-[#b3262d]/55 xl:w-[340px]">
              <Search className="h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-[#d84a50]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cliente, empresa ou campanha..."
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-700"
              />
            </div>
          </div>
        </header>

        {/* CONVERSION METRICS */}
        <section className="grid border-b border-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Clientes conquistados",
              value: String(filteredCustomers.length),
              description: "Conversões nesta visualização",
              icon: Users,
            },
            {
              label: "Receita fechada",
              value: formatCurrency(totalRevenue),
              description: "Valor total convertido",
              icon: CircleDollarSign,
            },
            {
              label: "Ticket médio",
              value: formatCurrency(averageTicket),
              description: "Média por cliente convertido",
              icon: TrendingUp,
            },
            {
              label: "Produto destaque",
              value: topProduct ? topProduct[0] : "—",
              description: topProduct
                ? `${formatCurrency(topProduct[1])} em vendas`
                : "Aguardando conversões",
              icon: Package,
            },
          ].map((metric, index) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className={`py-6 sm:px-5 xl:px-6 ${
                  index === 0 ? "sm:pl-0 xl:pl-0" : ""
                } ${
                  index < 3 ? "xl:border-r xl:border-white/[0.06]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                      {String(index + 1).padStart(2, "0")} / {metric.label}
                    </p>
                    <p
                      className={`mt-3 font-semibold tracking-[-0.04em] text-zinc-100 ${
                        index === 3 ? "text-2xl" : "text-3xl"
                      }`}
                    >
                      {metric.value}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {metric.description}
                    </p>
                  </div>

                  <Icon
                    className={`mt-1 h-4 w-4 ${
                      index === 1 || index === 3
                        ? "text-[#d84a50]"
                        : "text-zinc-600"
                    }`}
                  />
                </div>
              </article>
            );
          })}
        </section>

        {/* PORTFOLIO CONTROLS */}
        <section className="mt-7">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                  Conversion Registry / {filteredCustomers.length} records
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Clientes originados de oportunidades fechadas no Pipeline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {(["Todos", "Roupas", "Canecas", "Livros"] as const).map(
                (product) => {
                  const active = selectedProduct === product;

                  return (
                    <button
                      key={product}
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className={`relative px-4 py-2 text-xs font-medium transition ${
                        active
                          ? "text-zinc-100"
                          : "text-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      {product}
                      {active && (
                        <span className="absolute inset-x-3 -bottom-[1px] h-px bg-[#d84a50] shadow-[0_0_8px_rgba(216,74,80,0.55)]" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* CUSTOMER REGISTRY */}
          {filteredCustomers.length > 0 ? (
            <div>
              <div className="hidden grid-cols-[1.45fr_0.8fr_1fr_1fr_0.8fr] border-b border-white/[0.055] xl:grid">
                {["Cliente", "Produto", "Aquisição", "Responsável", "Valor fechado"].map(
                  (heading, index) => (
                    <div
                      key={heading}
                      className={`py-4 font-mono text-[9px] uppercase tracking-[0.17em] text-zinc-600 ${
                        index === 4 ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </div>
                  ),
                )}
              </div>

              <div className="divide-y divide-white/[0.055]">
                {filteredCustomers.map((customer, index) => (
                  <Link
                    key={customer.id}
                    href={`/customers/${customer.id}`}
                    className="group relative grid gap-5 py-5 transition hover:bg-white/[0.018] xl:grid-cols-[1.45fr_0.8fr_1fr_1fr_0.8fr]"
                  >
                    <span className="absolute bottom-0 left-0 top-0 w-px scale-y-0 bg-[#d84a50] transition-transform duration-200 group-hover:scale-y-100" />

                    <div className="flex items-center gap-4 xl:pr-4">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-[#b3262d]/20 bg-[#b3262d]/[0.055] font-mono text-[10px] font-semibold text-[#ef8b90]">
                        {customer.name
                          .split(" ")
                          .slice(0, 2)
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                        <span className="absolute -left-px top-0 h-2 w-px bg-[#d84a50]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] text-zinc-700">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="font-medium text-zinc-200">
                            {customer.name}
                          </p>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                          <Building2 className="h-3.5 w-3.5 text-zinc-600" />
                          {customer.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`inline-flex border px-2.5 py-1 text-xs font-medium ${
                          productStyles[customer.product]
                        }`}
                      >
                        {customer.product}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-zinc-400">
                        {customer.campaign}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                        {customer.source}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <UserRound className="h-3.5 w-3.5 text-zinc-600" />
                        {customer.owner}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-600" />
                        {formatDate(customer.convertedAt)}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center xl:items-end">
                      <p className="text-lg font-semibold tracking-[-0.025em] text-zinc-100">
                        {formatCurrency(customer.value)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-400">
                          Converted
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center border-b border-white/[0.06] px-6 py-16">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/[0.07] bg-white/[0.018]">
                  <Users className="h-5 w-5 text-zinc-600" />
                </div>
                <p className="mt-5 font-medium text-zinc-300">
                  Nenhum cliente encontrado
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Quando uma oportunidade for movida para Fechado no Pipeline,
                  o cliente aparecerá automaticamente nesta carteira.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/[0.07] py-4">
            <div>
              <p className="text-xs text-zinc-400">
                {filteredCustomers.length} clientes nesta visualização
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
                Customer registry / current environment
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Data synchronized
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}