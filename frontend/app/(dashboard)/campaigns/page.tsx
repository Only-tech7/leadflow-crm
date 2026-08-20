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
    <div className="min-h-screen bg-[#09090b] px-6 py-6 text-white lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
              <Send className="h-4 w-4" />
              Automação comercial
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
              Campanhas
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Gerencie campanhas de prospecção e acompanhe os resultados por
              canal.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Nova campanha
          </button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Campanhas ativas"
            value={activeCampaigns.toString()}
            description="Disparos em andamento"
            icon={<PlayCircle className="h-5 w-5 text-emerald-300" />}
          />

          <MetricCard
            title="Mensagens enviadas"
            value={totalSent.toLocaleString("pt-BR")}
            description="Total de contatos realizados"
            icon={<Send className="h-5 w-5 text-violet-300" />}
          />

          <MetricCard
            title="Respostas recebidas"
            value={totalResponses.toString()}
            description="Interações geradas"
            icon={<MessageCircle className="h-5 w-5 text-cyan-300" />}
          />

          <MetricCard
            title="Conversões"
            value={totalConversions.toString()}
            description="Oportunidades criadas"
            icon={<BarChart3 className="h-5 w-5 text-amber-300" />}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-base font-medium text-zinc-100">
                Campanhas recentes
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Acompanhe o desempenho e a evolução de cada campanha.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-[290px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar campanha..."
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-10 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-white/[0.15]"
                />
              </div>

              <select
                value={channelFilter}
                onChange={(event) => setChannelFilter(event.target.value)}
                className="h-11 rounded-xl border border-white/[0.07] bg-[#111113] px-4 text-sm text-zinc-300 outline-none"
              >
                <option value="Todos">Todos os canais</option>
                <option value="E-mail">E-mail</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Campanha
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Público
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Enviados
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Abertura
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Respostas
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Conversões
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                    Status
                  </th>

                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {filteredCampaigns.map((campaign) => {
                  const openingRate = calculateRate(
                    campaign.opens,
                    campaign.sent
                  );

                  const responseRate = calculateRate(
                    campaign.responses,
                    campaign.sent
                  );

                  const conversionRate = calculateRate(
                    campaign.conversions,
                    campaign.sent
                  );

                  return (
                    <tr
                      key={campaign.id}
                      className="border-b border-white/[0.04] transition last:border-none hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-zinc-200">
                            {campaign.name}
                          </p>

                          <div className="mt-2 flex items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                channelStyles[campaign.channel]
                              }`}
                            >
                              {getChannelIcon(campaign.channel)}
                              {campaign.channel}
                            </span>

                            <span className="text-xs text-zinc-700">
                              Criada em {campaign.createdAt}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {campaign.audience}
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-300">
                            {campaign.sent}
                          </p>

                          <p className="mt-1 text-xs text-zinc-700">
                            de {campaign.audience}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-300">
                              {openingRate}%
                            </span>

                            <span className="text-xs text-zinc-700">
                              {campaign.opens}
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                              style={{ width: `${openingRate}%` }}
                              className="h-full rounded-full bg-violet-500/70"
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-300">
                            {campaign.responses}
                          </p>

                          <p className="mt-1 text-xs text-zinc-700">
                            {responseRate}% dos enviados
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-300">
                            {campaign.conversions}
                          </p>

                          <p className="mt-1 text-xs text-zinc-700">
                            {conversionRate}% dos enviados
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[campaign.status]
                          }`}
                        >
                          {getStatusIcon(campaign.status)}
                          {campaign.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
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
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                <Search className="h-5 w-5 text-zinc-600" />
              </div>

              <p className="mt-4 font-medium text-zinc-300">
                Nenhuma campanha encontrada
              </p>

              <p className="mt-2 text-sm text-zinc-600">
                Tente alterar a busca ou o canal selecionado.
              </p>
            </div>
          )}

          <div className="border-t border-white/[0.06] px-5 py-4">
            <p className="text-sm text-zinc-600">
              Exibindo{" "}
              <span className="font-medium text-zinc-400">
                {filteredCampaigns.length}
              </span>{" "}
              de{" "}
              <span className="font-medium text-zinc-400">
                {campaigns.length}
              </span>{" "}
              campanhas
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

function MetricCard({
  title,
  value,
  description,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{title}</span>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-600">{description}</p>
    </div>
  );
}