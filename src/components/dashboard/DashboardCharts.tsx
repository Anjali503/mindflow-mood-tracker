"use client";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

export function MoodTrendCard({
  data,
}: {
  data: { day: string; score: number | null }[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-3">
        <div className="text-lg font-semibold text-white/90">Mood Trend</div>
        <div className="text-sm text-white/35">Last 7 days</div>
      </div>
      <div className="h-56 w-full min-w-0 min-h-[224px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-white/40">
            No mood data yet.
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 8"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,0.30)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="rgba(255,255,255,0.20)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.85)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "14px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(v: any) => [v ?? "—", "Mood"]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#trendLine)"
              strokeWidth={4}
              dot={{ r: 5, fill: "#0b1022", stroke: "#a78bfa", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#60a5fa", strokeWidth: 0 }}
              connectNulls
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function MoodMixCard({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-3">
        <div className="text-lg font-semibold text-white/90">Mood Mix</div>
        <div className="text-sm text-white/35">All time</div>
      </div>
      <div className="h-56 w-full min-w-0 min-h-[224px]">
        {data.every((d) => d.value === 0) ? (
          <div className="h-full flex items-center justify-center text-sm text-white/40">
            No mood mix yet.
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.filter((d) => d.value > 0)}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            >
              {data.map((d, idx) => (
                <Cell key={idx} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.85)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "14px",
              }}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/55">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TagFrequencyCard({
  data,
}: {
  data: { tag: string; count: number }[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-3">
        <div className="text-lg font-semibold text-white/90">Tag Frequency</div>
        <div className="text-sm text-white/35">Last 30 days</div>
      </div>
      <div className="h-56 w-full min-w-0 min-h-[224px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-white/40">
            No tags yet.
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 6, right: 6 }}>
            <CartesianGrid
              strokeDasharray="3 8"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="tag"
              stroke="rgba(255,255,255,0.30)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.20)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.85)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "14px",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar
              dataKey="count"
              radius={[10, 10, 10, 10]}
              fill="rgba(99,102,241,0.65)"
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function ActivityImpactChart({
  data,
}: {
  data: { tag: string; avgMood: number; count: number }[];
}) {
  if (data.length === 0)
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="text-lg font-semibold text-white/90 mb-1">Activity Impact on Mood</div>
        <div className="text-sm text-white/35">Not enough tagged entries yet.</div>
      </div>
    );
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-3">
        <div className="text-lg font-semibold text-white/90">Activity Impact on Mood</div>
        <div className="text-sm text-white/35">Avg mood score per tag (1–5)</div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 6, right: 6 }}>
            <CartesianGrid strokeDasharray="3 8" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="tag"
              stroke="rgba(255,255,255,0.30)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="rgba(255,255,255,0.20)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '14px',
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(v: any, name: any, { payload }: any) => [
                `${Number(v).toFixed(1)} avg (${payload.count} entries)`,
                'Mood',
              ]}
            />
            <Bar dataKey="avgMood" radius={[10, 10, 0, 0]}>
              {data.map((d, idx) => {
                const color =
                  d.avgMood >= 4
                    ? 'rgba(52,211,153,0.75)'
                    : d.avgMood >= 3
                    ? 'rgba(251,191,36,0.70)'
                    : 'rgba(251,113,133,0.75)';
                return <Cell key={idx} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
