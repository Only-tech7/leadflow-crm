"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  Mail,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

export type NewLeadData = {
  name: string;
  role: string;
  company: string;
  origin: string;
  status: string;
  owner: string;
  score: number;
  nextAction: string;
};

type AddLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: NewLeadData) => void;
};

const initialFormData: NewLeadData = {
  name: "",
  role: "",
  company: "",
  origin: "LinkedIn",
  status: "Novo",
  owner: "Matheus",
  score: 75,
  nextAction: "Realizar primeiro contato",
};

export function AddLeadModal({
  isOpen,
  onClose,
  onAddLead,
}: AddLeadModalProps) {
  const [formData, setFormData] =
    useState<NewLeadData>(initialFormData);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function updateField<Key extends keyof NewLeadData>(
    field: Key,
    value: NewLeadData[Key],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = formData.name.trim();
    const normalizedCompany = formData.company.trim();

    if (!normalizedName || !normalizedCompany) {
      return;
    }

    onAddLead({
      ...formData,
      name: normalizedName,
      role: formData.role.trim() || "Cargo não informado",
      company: normalizedCompany,
      nextAction:
        formData.nextAction.trim() || "Realizar primeiro contato",
    });

    setFormData(initialFormData);
    onClose();
  }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar cadastro de lead"
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#101013] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
          <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3 py-1.5 text-xs font-medium text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                Novo contato comercial
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-zinc-100">
                Adicionar lead
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Cadastre um novo contato para iniciar o acompanhamento comercial.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-zinc-500">
                  Nome do contato
                </span>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 focus-within:border-blue-500/40 focus-within:ring-4 focus-within:ring-blue-500/[0.06]">
                  <UserRound className="h-4 w-4 text-zinc-700" />

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Ex.: Gabriel Almeida"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
                  />
                </div>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium text-zinc-500">
                  Cargo
                </span>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 focus-within:border-blue-500/40">
                  <BriefcaseBusiness className="h-4 w-4 text-zinc-700" />

                  <input
                    type="text"
                    value={formData.role}
                    onChange={(event) =>
                      updateField("role", event.target.value)
                    }
                    placeholder="Diretor de Marketing"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
                  />
                </div>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium text-zinc-500">
                  Empresa
                </span>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 focus-within:border-blue-500/40">
                  <Building2 className="h-4 w-4 text-zinc-700" />

                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(event) =>
                      updateField("company", event.target.value)
                    }
                    placeholder="Nome da empresa"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
                  />
                </div>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium text-zinc-500">
                  Origem
                </span>

                <div className="relative">
                  <select
                    value={formData.origin}
                    onChange={(event) =>
                      updateField("origin", event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#151519] px-3 pr-10 text-sm text-zinc-300 outline-none focus:border-blue-500/40"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Site">Site</option>
                    <option value="Campanha">Campanha</option>
                    <option value="Apollo">Apollo</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium text-zinc-500">
                  Responsável
                </span>

                <div className="relative">
                  <select
                    value={formData.owner}
                    onChange={(event) =>
                      updateField("owner", event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#151519] px-3 pr-10 text-sm text-zinc-300 outline-none focus:border-blue-500/40"
                  >
                    <option value="Matheus">Matheus</option>
                    <option value="Ana">Ana</option>
                    <option value="Lucas">Lucas</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                </div>
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-medium text-zinc-500">
                  Próxima ação
                </span>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 focus-within:border-blue-500/40">
                  <Mail className="h-4 w-4 text-zinc-700" />

                  <input
                    type="text"
                    value={formData.nextAction}
                    onChange={(event) =>
                      updateField("nextAction", event.target.value)
                    }
                    placeholder="Ex.: Enviar apresentação comercial"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
                  />
                </div>
              </label>
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-white/[0.015] px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] transition hover:bg-blue-500"
              >
                Adicionar lead
              </button>
            </footer>
          </form>
        </div>
      </div>
    </>
  );
}