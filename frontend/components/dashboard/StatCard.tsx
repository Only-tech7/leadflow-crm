import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from "lucide-react";

import type { DashboardStat } from "@/data/dashboard";

type StatCardProps = {
  stat: DashboardStat;
  icon: LucideIcon;
};

export default function StatCard({ stat, icon: Icon }: StatCardProps) {
  const trendStyles = {
    up: {
      className: "bg-emerald-500/10 text-emerald-400",
      icon: ArrowUpRight,
    },
    down: {
      className: "bg-red-500/10 text-red-400",
      icon: ArrowDownRight,
    },
    neutral: {
      className: "bg-zinc-500/10 text-zinc-400",
      icon: Minus,
    },
  };

  const trend = trendStyles[stat.trend];
  const TrendIcon = trend.icon;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#141417]">
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-500/[0.06] blur-3xl transition group-hover:bg-blue-500/[0.1]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04]">
            <Icon className="h-5 w-5 text-blue-400" />
          </div>

          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trend.className}`}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {stat.variation}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-zinc-500">{stat.title}</p>

          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-zinc-100">
            {stat.value}
          </p>

          <p className="mt-2 text-xs text-zinc-600">{stat.description}</p>
        </div>
      </div>
    </article>
  );
}