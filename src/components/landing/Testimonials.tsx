"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

const quotes = [
  {
    text: "MindFlow helped me understand my stress patterns. The dashboard made it obvious when I was overcommitting.",
    name: "Alex R.",
    role: "Product designer",
  },
  {
    text: "Finally a mood app that feels premium. Logging takes seconds and the insights actually feel personal.",
    name: "Jordan M.",
    role: "Engineering lead",
  },
  {
    text: "Journaling plus analytics in one place—I've stuck with it longer than any other wellness app.",
    name: "Sam K.",
    role: "Graduate student",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-14">
          <p className="text-sm font-medium uppercase tracking-widest text-fuchsia-400/90">
            Social proof
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Loved by mindful builders
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={q.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-glass backdrop-blur-xl"
            >
              <Stars />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">&ldquo;{q.text}&rdquo;</p>
              <footer className="mt-6 border-t border-white/10 pt-4">
                <p className="font-medium text-white">{q.name}</p>
                <p className="text-xs text-slate-500">{q.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </Section>
  );
}
