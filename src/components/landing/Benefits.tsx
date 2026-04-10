"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

const benefits = [
  {
    title: "Understand emotional patterns",
    description: "Spot recurring moods and triggers before they snowball.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.147-2.146a1 1 0 00-.707-1.707H3.98a1 1 0 00-.707 1.707l2.147 2.146a11.95 11.95 0 015.814 5.519L15 15" />
      </svg>
    ),
  },
  {
    title: "Improve mental awareness",
    description: "Build a habit of checking in—small moments add up to big clarity.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75.002v-.002a12.06 12.06 0 00-4.5 0m3.75.002a12.06 12.06 0 01-4.5 0" />
      </svg>
    ),
  },
  {
    title: "Reflect through journaling",
    description: "Connect thoughts to feelings with lightweight, private entries.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Visualize your progress",
    description: "Charts and streaks make growth visible—not just felt.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export function Benefits() {
  return (
    <Section className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-14">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Why teams &amp; individuals choose MindFlow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Purpose-built for emotional literacy—simple on the surface, powerful underneath.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              whileHover={{ scale: 1.02 }}
              className="flex gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 shadow-glass backdrop-blur-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20">
                {b.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{b.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
