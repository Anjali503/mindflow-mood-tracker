"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section id="cta" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-violet-600/30 via-indigo-900/40 to-cyan-900/20 p-10 text-center shadow-glow backdrop-blur-xl md:p-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

          <h2 className="font-display relative text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Start Understanding Your Mind Today
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-slate-300">
            Join thousands who use MindFlow to track moods, reflect with intention, and see meaningful trends over time.
          </p>

          <motion.div
            className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#"
                className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-violet-900 shadow-xl transition hover:bg-slate-100"
              >
                Create Free Account
              </Link>
            </motion.div>
            <Link
              href="#demo"
              className="text-sm font-medium text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              See the demo first
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
