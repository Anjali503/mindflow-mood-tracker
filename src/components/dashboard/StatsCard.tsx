"use client";

import { motion } from "framer-motion";
import { ClipboardList, Flame, Scale, Smile } from "lucide-react";

export type StatsIconName = "flame" | "smile" | "clipboard" | "scale";

const ICONS: Record<StatsIconName, typeof Flame> = {
  flame: Flame,
  smile: Smile,
  clipboard: ClipboardList,
  scale: Scale,
};

export function StatsCard({
  iconName,
  iconBgClassName,
  value,
  label,
  sublabel,
  accent,
}: {
  iconName: StatsIconName;
  iconBgClassName: string;
  value: string;
  label: string;
  sublabel?: string;
  accent?: "warm" | "cool" | "neutral";
}) {
  const Icon = ICONS[iconName];
  const glow =
    accent === "warm"
      ? "hover:shadow-[0_0_0_1px_rgba(251,146,60,0.20),0_20px_70px_rgba(251,146,60,0.10)]"
      : accent === "cool"
        ? "hover:shadow-[0_0_0_1px_rgba(99,102,241,0.20),0_20px_70px_rgba(99,102,241,0.10)]"
        : "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_20px_70px_rgba(0,0,0,0.35)]";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={[
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        "transition",
        glow,
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className={`h-12 w-12 rounded-2xl border border-white/10 ${iconBgClassName} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white/80" />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-4xl font-extrabold text-white">{value}</div>
        <div className="mt-1 text-sm text-white/45">{label}</div>
        {sublabel ? <div className="mt-1 text-sm text-teal-300/70">{sublabel}</div> : null}
      </div>
    </motion.div>
  );
}

