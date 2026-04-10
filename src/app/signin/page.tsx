"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden px-5 md:px-10">
      <div className="pointer-events-none absolute inset-0 mindflow-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-70" />
      <div className="pointer-events-none absolute -top-48 left-[-140px] h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-48 right-[-180px] h-[640px] w-[640px] rounded-full bg-indigo-600/18 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[20%] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#070a18]/60 p-10 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 ring-1 ring-white/10 shadow-glow" />
            <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight text-white">
              MindFlow
            </h1>
            <p className="mt-2 text-sm text-white/35">
              Welcome back — we missed you
            </p>
          </div>

          <div className="mt-8 flex rounded-2xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setTab("in")}
              className={[
                "flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition",
                tab === "in"
                  ? "bg-indigo-500/25 text-white"
                  : "text-white/35 hover:text-white/60",
              ].join(" ")}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab("up")}
              className={[
                "flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition",
                tab === "up"
                  ? "bg-indigo-500/25 text-white"
                  : "text-white/35 hover:text-white/60",
              ].join(" ")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/20 focus:bg-white/10"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/20 focus:bg-white/10"
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:brightness-110"
            >
              {tab === "in" ? "Sign In →" : "Sign Up →"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-cyan-500/10 px-5 py-4 text-center text-xs text-white/70">
            ✨ Demo: any email &amp; password works
          </div>
        </motion.div>
      </div>
    </main>
  );
}

