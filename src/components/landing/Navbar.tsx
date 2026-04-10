"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-0 left-0 right-0 z-50 px-5 pt-6 md:px-10"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
            <span className="text-[10px] font-black text-white/90">MF</span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white/90">
            MindFlow
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/signin"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            Get Started Free
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
