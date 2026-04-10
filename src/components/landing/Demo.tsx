"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

function MoodLineChart() {
  const points = [
    { x: 0, y: 70 },
    { x: 60, y: 45 },
    { x: 120, y: 55 },
    { x: 180, y: 30 },
    { x: 240, y: 40 },
    { x: 300, y: 20 },
    { x: 360, y: 35 },
  ];
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `${pathD} L 360 80 L 0 80 Z`;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">7-day mood trend</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          +12% vs last week
        </span>
      </div>
      <svg viewBox="0 0 360 90" className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-slate-500">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

function MoodPieChart() {
  const segments = [
    { color: "#8b5cf6", label: "Calm", pct: 35 },
    { color: "#22d3ee", label: "Happy", pct: 28 },
    { color: "#f472b6", label: "Stressed", pct: 22 },
    { color: "#94a3b8", label: "Neutral", pct: 15 },
  ];
  const radius = 36;
  const cx = 48;
  const cy = 48;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
      <span className="text-xs font-medium text-slate-300">Mood mix</span>
      <div className="mt-3 flex items-center gap-4">
        <svg viewBox="0 0 96 96" className="h-24 w-24 shrink-0">
          {segments.map((s, i) => {
            const startPct = segments.slice(0, i).reduce((a, x) => a + x.pct, 0);
            const endPct = startPct + s.pct;
            const startAngle = (startPct / 100) * 2 * Math.PI - Math.PI / 2;
            const endAngle = (endPct / 100) * 2 * Math.PI - Math.PI / 2;
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);
            const large = s.pct > 50 ? 1 : 0;
            const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
            return <path key={i} d={d} fill={s.color} opacity={0.9} />;
          })}
          <circle cx={cx} cy={cy} r={18} fill="#0f172a" />
        </svg>
        <ul className="flex flex-1 flex-col gap-1.5 text-[11px]">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="text-slate-300">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InsightCards() {
  const items = [
    { title: "Peak stress", value: "Thu 4–6pm", hint: "Often after meetings" },
    { title: "Best streak", value: "9 days", hint: "Consistent logging" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent p-3"
        >
          <p className="text-[10px] uppercase tracking-wider text-violet-300/80">{it.title}</p>
          <p className="mt-1 font-display text-lg font-semibold text-white">{it.value}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{it.hint}</p>
        </div>
      ))}
    </div>
  );
}

export function Demo() {
  return (
    <Section id="demo" className="relative px-4 py-24 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400/90">
            Interactive preview
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Your emotional story, at a glance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A calm dashboard that turns daily check-ins into clarity—trends, balance, and insight cards in one view.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Laptop frame */}
          <div className="rounded-t-2xl border border-white/15 bg-gradient-to-b from-slate-800/90 to-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-sm md:p-4">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <div className="ml-4 flex-1 rounded-lg bg-slate-900/80 py-1.5 text-center text-[10px] text-slate-500">
                app.mindflow.io / dashboard
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-950/95 via-violet-950/20 to-slate-950/95 p-4 shadow-inner md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Welcome back</p>
                  <p className="font-display text-lg font-semibold text-white">This week&apos;s overview</p>
                </div>
                <div className="flex gap-2">
                  {["Day", "Week", "Month"].map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        i === 1
                          ? "bg-violet-600 text-white"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <MoodLineChart />
                </div>
                <div className="lg:col-span-2">
                  <MoodPieChart />
                </div>
              </div>
              <div className="mt-4">
                <InsightCards />
              </div>
            </div>
          </div>
          {/* Laptop base */}
          <div className="relative -mt-px mx-auto h-3 w-[108%] max-w-none rounded-b-xl bg-gradient-to-b from-slate-700/80 to-slate-900 shadow-xl" />
          <div className="mx-auto mt-0 h-2 w-[120%] max-w-none rounded-b-lg bg-slate-800/90 shadow-lg" />
        </motion.div>
      </div>
    </Section>
  );
}
