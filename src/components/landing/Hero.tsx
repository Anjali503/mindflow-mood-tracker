"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const floatingIcons = ["😄", "😊", "🙂", "😐", "😟"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 pb-24 pt-28 md:px-10 md:pt-32">
      {/* Grid + gradients to match reference */}
      <div className="pointer-events-none absolute inset-0 mindflow-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-70" />
      <div className="pointer-events-none absolute -top-48 left-[-140px] h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-48 right-[-180px] h-[640px] w-[640px] rounded-full bg-indigo-600/18 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[20%] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[170px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center"
      >
        <motion.div
          variants={item}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-md"
        >
          <span className="text-white/60">⚡</span>
          AI-Powered Emotional Intelligence
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-balance text-white/95 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span>Understand Your Mind,</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
            Transform Your Life
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-white/45 md:text-lg"
        >
          Track your daily moods, journal your thoughts, and discover hidden
          patterns in your emotional landscape — guided by AI.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/signin"
              className="inline-flex min-w-[230px] items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:brightness-110"
            >
              Start Tracking Free →
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dashboard"
              className="inline-flex min-w-[210px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              View Demo Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating mood tiles */}
      <div className="relative z-10 mx-auto mt-14 flex max-w-4xl items-end justify-center gap-3 px-4">
        {floatingIcons.map((emoji, i) => (
          <motion.div
            key={emoji}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
            className={[
              "h-16 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-glass",
              "flex items-center justify-center text-3xl",
              i === 0 ? "translate-y-4" : "",
              i === 1 ? "translate-y-8" : "",
              i === 2 ? "translate-y-10" : "",
              i === 3 ? "translate-y-8" : "",
              i === 4 ? "translate-y-4" : "",
            ].join(" ")}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
