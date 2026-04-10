"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

const steps = [
  {
    n: "01",
    title: "Log your mood",
    description: "Pick an emoji and optional intensity—takes under ten seconds.",
  },
  {
    n: "02",
    title: "Write a short reflection",
    description: "Note what happened or how you feel; context makes patterns visible.",
  },
  {
    n: "03",
    title: "Get insights & analytics",
    description: "See trends, distributions, and prompts that deepen self-awareness.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center md:mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400/90">
            How it works
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Three steps to a clearer mind
          </h2>
        </div>

        <div className="relative">
          {/* Connector line — desktop */}
          <div className="absolute left-0 right-0 top-[52px] hidden h-0.5 md:block">
            <div className="mx-auto h-full max-w-4xl bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="relative"
              >
                {/* Mobile vertical line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[22px] top-14 bottom-0 w-px bg-gradient-to-b from-violet-500/50 to-transparent md:hidden" />
                )}

                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-glass backdrop-blur-xl transition hover:border-violet-400/25">
                  <div className="flex items-start gap-4">
                    <span className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
