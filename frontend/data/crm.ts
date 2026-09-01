export type ProductType = "Roupas" | "Canecas" | "Livros";

export type LeadStatus =
  | "Novo"
  | "Qualificado"
  | "Em contato"
  | "Aguardando retorno"
  | "Sem resposta";

export type PipelineStage =
  | "novo"
  | "qualificado"
  | "contato"
  | "proposta"
  | "negociacao"
  | "fechado";

export type CrmLead = {
  id: number;
  name: string;
  role: string;
  company: string;
  origin: string;
  score: number;
  status: LeadStatus;
  nextAction: string;
  owner: string;
  initials: string;

  product: ProductType;
  campaign: string;
  source: string;

  estimatedValue: number;
};

export type PipelineOpportunity = {
  id: number;
  leadId: number;
  name: string;
  company: string;
  product: ProductType;
  campaign: string;
  source: string;
  value: number;
  owner: string;
  nextAction: string;
  priority: "Alta" | "Média" | "Baixa";
  probability: number;
  stage: PipelineStage;
};

export type CrmCustomer = {
  id: number;
  leadId: number;
  opportunityId: number;
  name: string;
  company: string;
  product: ProductType;
  campaign: string;
  source: string;
  value: number;
  owner: string;
  convertedAt: string;
};

/*
|--------------------------------------------------------------------------
| Histórico comercial
|--------------------------------------------------------------------------
*/

export type CrmHistoryEventType =
  | "lead_created"
  | "pipeline_created"
  | "stage_changed"
  | "converted";

export type CrmHistoryEvent = {
  id: string;
  leadId: number;
  opportunityId?: number;

  type: CrmHistoryEventType;

  title: string;
  description: string;

  fromStage?: PipelineStage;
  toStage?: PipelineStage;

  createdAt: string;
};

/*
|--------------------------------------------------------------------------
| Leads iniciais
|--------------------------------------------------------------------------
*/

export const crmLeads: CrmLead[] = [
  {
    id: 1,
    name: "Mariana Souza",
    role: "Diretora de Marketing",
    company: "Grupo Horizonte",
    origin: "Meta Ads",
    score: 94,
    status: "Qualificado",
    nextAction: "Reunião hoje, 10h",
    owner: "Matheus",
    initials: "MS",

    product: "Livros",
    campaign: "Campanha Liderança 2026",
    source: "Meta Ads",

    estimatedValue: 8500,
  },

  {
    id: 2,
    name: "Carlos Mendes",
    role: "Gerente Comercial",
    company: "Grupo Vertex",
    origin: "Instagram Ads",
    score: 89,
    status: "Em contato",
    nextAction: "Enviar proposta",
    owner: "Ana",
    initials: "CM",

    product: "Canecas",
    campaign: "Brindes Corporativos",
    source: "Instagram Ads",

    estimatedValue: 5200,
  },

  {
    id: 3,
    name: "Fernanda Lima",
    role: "Coordenadora de Eventos",
    company: "Horizonte Produções",
    origin: "LinkedIn",
    score: 82,
    status: "Novo",
    nextAction: "Ligar amanhã, 9h",
    owner: "Lucas",
    initials: "FL",

    product: "Roupas",
    campaign: "Uniformes Corporativos",
    source: "LinkedIn",

    estimatedValue: 12000,
  },
];

/*
|--------------------------------------------------------------------------
| Pipeline inicial
|--------------------------------------------------------------------------
*/

export const initialPipelineOpportunities: PipelineOpportunity[] = [
  {
    id: 101,
    leadId: 1,
    name: "Mariana Souza",
    company: "Grupo Horizonte",
    product: "Livros",
    campaign: "Campanha Liderança 2026",
    source: "Meta Ads",
    value: 8500,
    owner: "Matheus",
    nextAction: "Reunião hoje, 10h",
    priority: "Alta",
    probability: 75,
    stage: "qualificado",
  },

  {
    id: 102,
    leadId: 2,
    name: "Carlos Mendes",
    company: "Grupo Vertex",
    product: "Canecas",
    campaign: "Brindes Corporativos",
    source: "Instagram Ads",
    value: 5200,
    owner: "Ana",
    nextAction: "Enviar proposta",
    priority: "Alta",
    probability: 60,
    stage: "contato",
  },
];

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const LEADS_STORAGE_KEY = "leadflow-leads";
const PIPELINE_STORAGE_KEY = "leadflow-pipeline";
const CUSTOMERS_STORAGE_KEY = "leadflow-customers";
const HISTORY_STORAGE_KEY = "leadflow-history";

/*
|--------------------------------------------------------------------------
| Leads
|--------------------------------------------------------------------------
*/

export function getStoredLeads(): CrmLead[] {
  if (typeof window === "undefined") {
    return crmLeads;
  }

  const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);

  if (!storedLeads) {
    localStorage.setItem(
      LEADS_STORAGE_KEY,
      JSON.stringify(crmLeads),
    );

    return crmLeads;
  }

  try {
    return JSON.parse(storedLeads) as CrmLead[];
  } catch {
    return crmLeads;
  }
}

export function saveLeads(leads: CrmLead[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    LEADS_STORAGE_KEY,
    JSON.stringify(leads),
  );
}

/*
|--------------------------------------------------------------------------
| Histórico
|--------------------------------------------------------------------------
*/

export function getStoredHistory(): CrmHistoryEvent[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedHistory = localStorage.getItem(
    HISTORY_STORAGE_KEY,
  );

  if (!storedHistory) {
    return [];
  }

  try {
    return JSON.parse(storedHistory) as CrmHistoryEvent[];
  } catch {
    return [];
  }
}

export function saveHistory(history: CrmHistoryEvent[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(history),
  );
}

type AddHistoryEventInput = Omit<
  CrmHistoryEvent,
  "id" | "createdAt"
>;

export function addHistoryEvent(
  event: AddHistoryEventInput,
) {
  if (typeof window === "undefined") {
    return null;
  }

  const currentHistory = getStoredHistory();

  const historyEvent: CrmHistoryEvent = {
    ...event,

    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    createdAt: new Date().toISOString(),
  };

  const updatedHistory = [
    ...currentHistory,
    historyEvent,
  ];

  saveHistory(updatedHistory);

  return historyEvent;
}

export function getLeadHistory(
  leadId: number,
): CrmHistoryEvent[] {
  return getStoredHistory()
    .filter((event) => event.leadId === leadId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime(),
    );
}

/*
|--------------------------------------------------------------------------
| Registrar criação de Lead
|--------------------------------------------------------------------------
*/

export function registerLeadCreated(lead: CrmLead) {
  const history = getStoredHistory();

  const alreadyRegistered = history.some(
    (event) =>
      event.leadId === lead.id &&
      event.type === "lead_created",
  );

  if (alreadyRegistered) {
    return;
  }

  addHistoryEvent({
    leadId: lead.id,

    type: "lead_created",

    title: "Lead captado",

    description: `${lead.name} entrou no CRM através de ${lead.source}, com interesse em ${lead.product}.`,
  });
}

/*
|--------------------------------------------------------------------------
| Pipeline
|--------------------------------------------------------------------------
*/

export function getPipelineOpportunities(): PipelineOpportunity[] {
  if (typeof window === "undefined") {
    return initialPipelineOpportunities;
  }

  const storedPipeline = localStorage.getItem(
    PIPELINE_STORAGE_KEY,
  );

  if (!storedPipeline) {
    localStorage.setItem(
      PIPELINE_STORAGE_KEY,
      JSON.stringify(initialPipelineOpportunities),
    );

    return initialPipelineOpportunities;
  }

  try {
    return JSON.parse(
      storedPipeline,
    ) as PipelineOpportunity[];
  } catch {
    return initialPipelineOpportunities;
  }
}

export function savePipelineOpportunities(
  opportunities: PipelineOpportunity[],
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    PIPELINE_STORAGE_KEY,
    JSON.stringify(opportunities),
  );
}

/*
|--------------------------------------------------------------------------
| Converter Lead em oportunidade
|--------------------------------------------------------------------------
*/

export function sendLeadToPipeline(lead: CrmLead) {
  const currentPipeline = getPipelineOpportunities();

  const alreadyExists = currentPipeline.some(
    (opportunity) => opportunity.leadId === lead.id,
  );

  if (alreadyExists) {
    return {
      success: false,
      reason: "already-exists" as const,
    };
  }

  /*
   * Caso o lead tenha sido criado antes da implementação
   * do histórico, garantimos o primeiro evento aqui.
   */

  registerLeadCreated(lead);

  let priority: PipelineOpportunity["priority"] = "Baixa";

  if (lead.score >= 85) {
    priority = "Alta";
  } else if (lead.score >= 70) {
    priority = "Média";
  }

  const opportunity: PipelineOpportunity = {
    id: Date.now(),

    leadId: lead.id,

    name: lead.name,

    company: lead.company,

    product: lead.product,

    campaign: lead.campaign,

    source: lead.source,

    value: lead.estimatedValue,

    owner: lead.owner,

    nextAction: lead.nextAction,

    priority,

    probability: Math.min(lead.score, 95),

    stage: "novo",
  };

  const updatedPipeline = [
    opportunity,
    ...currentPipeline,
  ];

  savePipelineOpportunities(updatedPipeline);

  /*
   * Registra entrada real no Pipeline.
   */

  addHistoryEvent({
    leadId: lead.id,

    opportunityId: opportunity.id,

    type: "pipeline_created",

    title: "Oportunidade criada",

    description: `${lead.company} entrou no Pipeline com valor estimado de ${new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      },
    ).format(lead.estimatedValue)}.`,

    toStage: "novo",
  });

  return {
    success: true,
    opportunity,
  };
}

/*
|--------------------------------------------------------------------------
| Registrar movimentação no Pipeline
|--------------------------------------------------------------------------
*/

export function registerPipelineStageChange(
  opportunity: PipelineOpportunity,
  fromStage: PipelineStage,
  toStage: PipelineStage,
) {
  if (fromStage === toStage) {
    return;
  }

  const stageLabels: Record<PipelineStage, string> = {
    novo: "Novo",
    qualificado: "Qualificado",
    contato: "Em contato",
    proposta: "Proposta",
    negociacao: "Negociação",
    fechado: "Fechado",
  };

  addHistoryEvent({
    leadId: opportunity.leadId,

    opportunityId: opportunity.id,

    type: "stage_changed",

    title: `Movido para ${stageLabels[toStage]}`,

    description: `A oportunidade avançou de ${stageLabels[fromStage]} para ${stageLabels[toStage]}.`,

    fromStage,
    toStage,
  });
}

/*
|--------------------------------------------------------------------------
| Clientes convertidos
|--------------------------------------------------------------------------
*/

export function getStoredCustomers(): CrmCustomer[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedCustomers = localStorage.getItem(
    CUSTOMERS_STORAGE_KEY,
  );

  if (!storedCustomers) {
    return [];
  }

  try {
    return JSON.parse(
      storedCustomers,
    ) as CrmCustomer[];
  } catch {
    return [];
  }
}

export function saveCustomers(
  customers: CrmCustomer[],
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CUSTOMERS_STORAGE_KEY,
    JSON.stringify(customers),
  );
}

/*
|--------------------------------------------------------------------------
| Converter oportunidade em cliente
|--------------------------------------------------------------------------
*/

export function convertOpportunityToCustomer(
  opportunity: PipelineOpportunity,
) {
  const currentCustomers = getStoredCustomers();

  const alreadyConverted = currentCustomers.some(
    (customer) =>
      customer.opportunityId === opportunity.id,
  );

  if (alreadyConverted) {
    return {
      success: false,
      reason: "already-converted" as const,
    };
  }

  const convertedAt = new Date().toISOString();

  const customer: CrmCustomer = {
    id: Date.now(),

    leadId: opportunity.leadId,

    opportunityId: opportunity.id,

    name: opportunity.name,

    company: opportunity.company,

    product: opportunity.product,

    campaign: opportunity.campaign,

    source: opportunity.source,

    value: opportunity.value,

    owner: opportunity.owner,

    convertedAt,
  };

  const updatedCustomers = [
    customer,
    ...currentCustomers,
  ];

  saveCustomers(updatedCustomers);

  /*
   * Registra a conversão real.
   */

  addHistoryEvent({
    leadId: opportunity.leadId,

    opportunityId: opportunity.id,

    type: "converted",

    title: "Cliente conquistado",

    description: `${opportunity.company} foi convertido em cliente com fechamento de ${new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      },
    ).format(opportunity.value)}.`,

    toStage: "fechado",
  });

  return {
    success: true,
    customer,
  };
}