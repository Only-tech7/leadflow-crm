"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Prospecção centralizada",
    description: "Leads, empresas e oportunidades reunidos em um único lugar.",
  },
  {
    icon: Workflow,
    title: "Processos inteligentes",
    description: "Acompanhe cada oportunidade durante toda a jornada comercial.",
  },
  {
    icon: BarChart3,
    title: "Decisões orientadas por dados",
    description: "Indicadores claros para entender o desempenho da operação.",
  },
];

export default function Home() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* Área institucional */}
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-[#0d0d10] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[140px]" />
            <div className="absolute -bottom-52 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[150px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-tight">
                  LeadFlow
                </p>
                <p className="text-xs text-zinc-500">
                  Sales Intelligence Platform
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma comercial inteligente
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em]">
              Transforme oportunidades em{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                crescimento previsível.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
              Uma plataforma desenvolvida para organizar a prospecção,
              automatizar processos e oferecer uma visão completa da operação
              comercial.
            </p>

            <div className="mt-10 space-y-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex max-w-xl items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        {feature.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-zinc-600">
            <span>LeadFlow Showcase</span>
            <span>Preparado para Acton Experience</span>
          </div>
        </section>

        {/* Área de login */}
        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold">LeadFlow</p>
                <p className="text-xs text-zinc-500">
                  Sales Intelligence Platform
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ambiente de demonstração
              </div>

              <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                Bem-vindo à plataforma
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Acesse o ambiente comercial inteligente preparado para a
                apresentação da Acton.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                  <input
                    id="email"
                    type="email"
                    defaultValue="equipe@actonexperience.com"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10"
                    placeholder="seuemail@empresa.com"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Senha
                  </label>

                  <button
                    type="button"
                    className="text-xs text-zinc-500 transition hover:text-blue-400"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    defaultValue="leadflow2026"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-blue-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Digite sua senha"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Acesso liberado para demonstração
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparando ambiente...
                  </>
                ) : (
                  <>
                    Entrar na plataforma
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-white/[0.07] pt-6">
              <p className="text-center text-xs leading-5 text-zinc-600">
                Protótipo visual para validação da experiência e das
                funcionalidades do LeadFlow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}