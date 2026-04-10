"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

const features = [
  {
    title: "Mood Tracking",
    description:
      "Log daily moods with expressive emoji-based input—fast, intuitive, and habit-friendly.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 8.832 9 8.625 9s-.375.336-.375.75.168.75.375.75.375-.336.375-.75zm5.25 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
      </svg>
    ),
  },
  {
    title: "Smart Emotional Insights",
    description:
      "AI-inspired analysis surfaces recurring themes and emotional patterns you might miss.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Visual Analytics Dashboard",
    description:
      "Interactive charts reveal trends, streaks, and how your mood shifts across the week.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Personal Journaling",
    description:
      "Capture reflections and triggers in one place to connect feelings with context.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <Section id="features" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center md:mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400/90">
            Features
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Everything you need to know yourself better
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A focused toolkit for awareness—track, reflect, and see the story your emotions tell.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-glass backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-300 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="font-display relative mt-5 text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                {f.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
