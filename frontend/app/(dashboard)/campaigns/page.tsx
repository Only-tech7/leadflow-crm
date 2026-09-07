"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Send,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type Campaign = {
  id: number;
  name: string;
  channel: "E-mail" | "WhatsApp" | "LinkedIn";
  audience: number;
  sent: number;
  opens: number;
  responses: number;
  conversions: number;
  status: "Ativa" | "Pausada" | "Concluída" | "Rascunho";
  createdAt: string;
};

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Prospecção eventos corporativos",
    channel: "E-mail",
    audience: 420,
    sent: 386,
    opens: 248,
    responses: 42,
    conversions: 12,
    status: "Ativa",
    createdAt: "23 jul, 09:15",
  },
  {
    id: 2,
    name: "Follow-up leads qualificados",
    channel: "WhatsApp",
    audience: 118,
    sent: 104,
    opens: 96,
    responses: 31,
    conversions: 9,
    status: "Ativa",
    createdAt: "22 jul, 14:30",
  },
  {
    id: 3,
    name: "Conexão com gestores de marketing",
    channel: "LinkedIn",
    audience: 210,
    sent: 176,
    opens: 119,
    responses: 27,
    conversions: 7,
    status: "Pausada",
    createdAt: "21 jul, 11:20",
  },
  {
    id: 4,
    name: "Reativação de contatos antigos",
    channel: "E-mail",
    audience: 285,
    sent: 285,
    opens: 174,
    responses: 29,
    conversions: 8,
    status: "Concluída",
    createdAt: "18 jul, 16:45",
  },
  {
    id: 5,
    name: "Campanha audiovisual premium",
    channel: "WhatsApp",
    audience: 95,
    sent: 0,
    opens: 0,
    responses: 0,
    conversions: 0,
    status: "Rascunho",
    createdAt: "23 jul, 12:10",
  },
];

const channelStyles: Record<Campaign["channel"], string> = {
  "E-mail": "border-violet-500/20 bg-violet-500/10 text-violet-300",
  WhatsApp:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  LinkedIn: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
};

const statusStyles: Record<Campaign["status"], string> = {
  Ativa: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  Pausada: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Concluída: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  Rascunho: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
};

function calculateRate(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getChannelIcon(channel: Campaign["channel"]) {
  if (channel === "E-mail") {
    return <Mail className="h-4 w-4" />;
  }

  if (channel === "WhatsApp") {
    return <MessageCircle className="h-4 w-4" />;
  }

  return <Users className="h-4 w-4" />;
}

function getStatusIcon(status: Campaign["status"]) {
  if (status === "Ativa") {
    return <PlayCircle className="h-3.5 w-3.5" />;
  }

  if (status === "Pausada") {
    return <PauseCircle className="h-3.5 w-3.5" />;
  }

  if (status === "Concluída") {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }

  return <Clock3 className="h-3.5 w-3.5" />;
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("Todos");

  const filteredCampaigns = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesSearch =
        !normalizedSearch ||
        campaign.name.toLowerCase().includes(normalizedSearch);

      const matchesChannel =
        channelFilter === "Todos" ||
        campaign.channel === channelFilter;

      return matchesSearch && matchesChannel;
    });
  }, [searchTerm, channelFilter]);

  const totalSent = campaigns.reduce(
    (total, campaign) => total + campaign.sent,
    0
  );

  const totalResponses = campaigns.reduce(
    (total, campaign) => total + campaign.responses,
    0
  );

  const totalConversions = campaigns.reduce(
    (total, campaign) => total + campaign.conversions,
    0
  );

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "Ativa"
  ).length;

  return (
    <div className="min-h-screen px-6 py-7 text-white lg:px-8 lg:py-9">
      <div className="mx-auto max-w-[1600px]">
        <header className="border-b border-white/[0.07] pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
                <span className="text-[#d84a50]">05 / CAMPAIGN OPERATIONS</span>
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="text-zinc-600">Outbound / Multi-channel</span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-zinc-100 lg:text-5xl">
                Operações
                <span className="block text-zinc-500">de Campanha</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Acompanhe prospecção, alcance, respostas e conversões por canal
                para entender quais ações estão gerando oportunidades comerciais.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#b3262d]/60 bg-[#b3262d] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(179,38,45,0.18)] transition hover:bg-[#c62c34]"
            >
              <Plus className="h-4 w-4" />
              Nova campanha
            </button>
          </div>
        </header>

        <section className="grid border-b border-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Campanhas ativas",
              value: activeCampaigns.toString(),
              description: "Disparos em andamento",
              icon: PlayCircle,
            },
            {
              label: "Mensagens enviadas",
              value: totalSent.toLocaleString("pt-BR"),
              description: "Contatos realizados",
              icon: Send,
            },
            {
              label: "Respostas",
              value: totalResponses.toString(),
              description: "Interações geradas",
              icon: MessageCircle,
            },
            {
              label: "Conversões",
              value: totalConversions.toString(),
              description: "Oportunidades criadas",
              icon: BarChart3,
            },
          ].map((metric, index) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className={`py-6 sm:px-5 xl:px-6 ${
                  index === 0 ? "sm:pl-0 xl:pl-0" : ""
                } ${index < 3 ? "xl:border-r xl:border-white/[0.06]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                      0{index + 1} / {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {metric.description}
                    </p>
                  </div>
                  <Icon className="mt-1 h-4 w-4 text-[#d84a50]" />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-7">
          <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#d84a50] shadow-[0_0_12px_rgba(216,74,80,0.65)]" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                  Campaign Registry / {filteredCampaigns.length} visible
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Performance operacional das campanhas de aquisição e follow-up.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="group flex h-10 w-full items-center gap-3 border-b border-white/[0.1] px-1 transition focus-within:border-[#b3262d]/55 sm:w-[290px]">
                <Search className="h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-[#d84a50]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar campanha..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-700"
                />
              </div>

              <select
                value={channelFilter}
                onChange={(event) => setChannelFilter(event.target.value)}
                className="h-10 border border-white/[0.08] bg-[#0b0b0d]/90 px-3 text-xs text-zinc-400 outline-none transition focus:border-[#b3262d]/40"
              >
                <option value="Todos">Todos os canais</option>
                <option value="E-mail">E-mail</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {[
                    "Campanha",
                    "Público",
                    "Enviados",
                    "Abertura",
                    "Respostas",
                    "Conversões",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-4 text-left font-mono text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-600 first:pl-0"
                    >
                      {heading}
                    </th>
                  ))}
                  <th className="w-14 px-4 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.055]">
                {filteredCampaigns.map((campaign, index) => {
                  const openingRate = calculateRate(campaign.opens, campaign.sent);
                  const responseRate = calculateRate(
                    campaign.responses,
                    campaign.sent,
                  );
                  const conversionRate = calculateRate(
                    campaign.conversions,
                    campaign.sent,
                  );

                  return (
                    <tr
                      key={campaign.id}
                      className="group transition duration-200 hover:bg-white/[0.018]"
                    >
                      <td className="py-5 pl-0 pr-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[8px] text-zinc-700">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <p className="font-medium text-zinc-200">
                              {campaign.name}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-1.5 border px-2 py-1 text-xs font-medium ${
                                channelStyles[campaign.channel]
                              }`}
                            >
                              {getChannelIcon(campaign.channel)}
                              {campaign.channel}
                            </span>
                            <span className="font-mono text-[9px] text-zinc-600">
                              {campaign.createdAt}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 font-mono text-sm text-zinc-400">
                        {campaign.audience}
                      </td>

                      <td className="px-4 py-5">
                        <p className="font-mono text-sm font-medium text-zinc-300">
                          {campaign.sent}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          de {campaign.audience}
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <div className="w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-medium text-zinc-300">
                              {openingRate}%
                            </span>
                            <span className="text-xs text-zinc-600">
                              {campaign.opens}
                            </span>
                          </div>
                          <div className="mt-2 h-px bg-white/[0.07]">
                            <div
                              style={{ width: `${openingRate}%` }}
                              className="h-px bg-[#d84a50] shadow-[0_0_7px_rgba(216,74,80,0.45)]"
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <p className="font-mono text-sm font-medium text-zinc-300">
                          {campaign.responses}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {responseRate}% dos enviados
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <p className="font-mono text-sm font-medium text-zinc-300">
                          {campaign.conversions}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {conversionRate}% dos enviados
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[campaign.status]
                          }`}
                        >
                          {getStatusIcon(campaign.status)}
                          {campaign.status}
                        </span>
                      </td>

                      <td className="px-4 py-5">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:bg-white/[0.04] hover:text-zinc-300"
                          aria-label={`Mais opções de ${campaign.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="flex min-h-[280px] flex-col items-center justify-center border-b border-white/[0.06] px-6 text-center">
              <Search className="h-5 w-5 text-zinc-600" />
              <p className="mt-4 font-medium text-zinc-300">
                Nenhuma campanha encontrada
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Tente alterar a busca ou o canal selecionado.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/[0.07] py-4">
            <div>
              <p className="text-xs text-zinc-400">
                Exibindo {filteredCampaigns.length} de {campaigns.length} campanhas
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
                Campaign operations / current environment
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Operations online
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
