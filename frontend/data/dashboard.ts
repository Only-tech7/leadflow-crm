export type DashboardStat= {
  id: string;
  title: string;
  value:string;
  variation: string;
  trend: "up" | "down" | "neutral";
  description: string;
};

export type PipelineStage = {
  id: string;
  name: string;
  opportunities: number;
  value: string;
  percentage: number;
};

export type AiInsight = {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: "high" | "medium" | "low";
};

export type RecentActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "lead" | "email" | "meeting" | "proposal";
};

export type UpcomingEvent = {
  id: string;
  title: string;
  company: string;
  time: string;
  date: string;
  type: "meeting" | "follow-up" | "call";
};

export type RevenuePerformance = {
  month: string;
  value: number;
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "potential-revenue",
    title: "Receita potencial",
    value: "R$ 487.000",
    variation: "+18,4%",
    trend: "up",
    description: "Comparado ao mês anterior",
  },
  {
    id: "active-opportunities",
    title: "Oportunidades ativas",
    value: "48",
    variation: "+12",
    trend: "up",
    description: "Novas oportunidades neste mês",
  },
  {
    id: "conversion-rate",
    title: "Taxa de conversão",
    value: "31,8%",
    variation: "+4,2%",
    trend: "up",
    description: "Conversão média da operação",
  },
  {
    id: "active-campaigns",
    title: "Campanhas ativas",
    value: "12",
    variation: "3 em destaque",
    trend: "neutral",
    description: "E-mail, LinkedIn e WhatsApp",
  },
];

export const monthlyGoal = {
  target: 650000,
  targetFormatted: "R$ 650.000",
  achieved: 487000,
  achievedFormatted: "R$ 487.000",
  percentage: 74.9,
  remainingFormatted: "R$ 163.000",
  projectedClosingFormatted: "R$ 712.000",
  averageTicketFormatted: "R$ 10.145",
};

export const revenuePerformance: RevenuePerformance[] = [
  {
    month: "Fev",
    value: 210,
  },
  {
    month: "Mar",
    value: 260,
  },
  {
    month: "Abr",
    value: 248,
  },
  {
    month: "Mai",
    value: 330,
  },
  {
    month: "Jun",
    value: 398,
  },
  {
    month: "Jul",
    value: 487,
  },
];

export const pipelineStages: PipelineStage[] = [
  {
    id: "new",
    name: "Novas oportunidades",
    opportunities: 18,
    value: "R$ 142.000",
    percentage: 78,
  },
  {
    id: "contact",
    name: "Contato iniciado",
    opportunities: 13,
    value: "R$ 126.000",
    percentage: 61,
  },
  {
    id: "qualification",
    name: "Qualificação",
    opportunities: 9,
    value: "R$ 98.000",
    percentage: 46,
  },
  {
    id: "proposal",
    name: "Proposta enviada",
    opportunities: 5,
    value: "R$ 76.000",
    percentage: 31,
  },
  {
    id: "negotiation",
    name: "Negociação",
    opportunities: 3,
    value: "R$ 45.000",
    percentage: 19,
  },
];

export const aiInsights: AiInsight[] = [
  {
    id: "forgotten-leads",
    title: "7 leads precisam de atenção",
    description:
      "Esses contatos não recebem uma interação há mais de cinco dias.",
    action: "Revisar leads",
    priority: "high",
  },
  {
    id: "best-contact-time",
    title: "Melhor horário para contato",
    description:
      "As interações realizadas entre 14h e 16h apresentam maior taxa de resposta.",
    action: "Criar campanha",
    priority: "medium",
  },
  {
    id: "similar-companies",
    title: "12 empresas com perfil ideal",
    description:
      "A inteligência identificou empresas semelhantes aos clientes com maior conversão.",
    action: "Ver empresas",
    priority: "low",
  },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "activity-1",
    title: "Novo lead adicionado",
    description: "Mariana Souza, Diretora de Marketing da Lumina Eventos",
    time: "Há 8 minutos",
    type: "lead",
  },
  {
    id: "activity-2",
    title: "E-mail respondido",
    description: "Carlos Mendes demonstrou interesse em uma reunião",
    time: "Há 24 minutos",
    type: "email",
  },
  {
    id: "activity-3",
    title: "Reunião agendada",
    description: "Apresentação comercial com a Horizonte Produções",
    time: "Há 1 hora",
    type: "meeting",
  },
  {
    id: "activity-4",
    title: "Proposta enviada",
    description: "Proposta comercial enviada para o Grupo Vertex",
    time: "Há 2 horas",
    type: "proposal",
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "event-1",
    title: "Apresentação comercial",
    company: "Lumina Eventos",
    time: "10:00",
    date: "Hoje",
    type: "meeting",
  },
  {
    id: "event-2",
    title: "Follow-up de proposta",
    company: "Grupo Vertex",
    time: "14:30",
    date: "Hoje",
    type: "follow-up",
  },
  {
    id: "event-3",
    title: "Ligação de qualificação",
    company: "Horizonte Produções",
    time: "09:00",
    date: "Amanhã",
    type: "call",
  },
];

export const dashboardSummary = {
  greeting: "Bom dia, Equipe Acton",
  message:
    "Hoje existem 48 oportunidades abertas e 7 contatos que precisam da atenção da equipe.",
  potentialRevenue: "R$ 487.000",
  activeOpportunities: 48,
  priorityOpportunities: 7,
};
