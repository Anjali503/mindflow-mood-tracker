'use client';

import { useMemo, useState } from 'react';
import { format, subDays, startOfWeek } from 'date-fns';

interface DayData {
  date: string;
  score: number | null;
  mood: string | null;
}

interface Props {
  data: DayData[];
}

function scoreToColor(score: number | null) {
  if (score === null) return 'bg-white/5 border-white/5';
  if (score >= 5) return 'bg-emerald-400/80 border-emerald-300/30';
  if (score >= 4) return 'bg-teal-400/70 border-teal-300/30';
  if (score >= 3) return 'bg-yellow-400/60 border-yellow-300/30';
  if (score >= 2) return 'bg-orange-400/70 border-orange-300/30';
  return 'bg-red-500/70 border-red-400/30';
}

function moodLabel(score: number | null) {
  if (!score) return 'No data';
  if (score >= 5) return 'Very Happy';
  if (score >= 4) return 'Happy';
  if (score >= 3) return 'Neutral';
  if (score >= 2) return 'Sad';
  return 'Very Sad';
}

export default function MoodHeatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; day: DayData } | null>(null);

  // Build a 90-day grid: 13 weeks × 7 days
  const today = useMemo(() => new Date(), []);
  const dayMap = useMemo(() => {
    const m = new Map<string, DayData>();
    for (const d of data) m.set(d.date, d);
    return m;
  }, [data]);

  // Align to week start for a proper grid
  const gridStart = useMemo(() => {
    const d90 = subDays(today, 89);
    return startOfWeek(d90, { weekStartsOn: 0 });
  }, [today]);

  const weeks: DayData[][] = useMemo(() => {
    const result: DayData[][] = [];
    let week: DayData[] = [];
    let cursor = new Date(gridStart);
    while (cursor <= today) {
      const key = format(cursor, 'yyyy-MM-dd');
      const isFuture = cursor > today;
      const isBeforeRange = cursor < subDays(today, 89);
      week.push(
        isFuture || isBeforeRange
          ? { date: key, score: null, mood: null }
          : dayMap.get(key) ?? { date: key, score: null, mood: null }
      );
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
      cursor = new Date(cursor.getTime() + 86400000);
    }
    if (week.length > 0) result.push(week);
    return result;
  }, [gridStart, today, dayMap]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-white/90">Mood Heatmap</div>
          <div className="text-sm text-white/35">Last 90 days</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Low</span>
          {['bg-red-500/70', 'bg-orange-400/70', 'bg-yellow-400/60', 'bg-teal-400/70', 'bg-emerald-400/80'].map((c, i) => (
            <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>High</span>
        </div>
      </div>

      <div className="flex gap-0.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {/* Day labels column */}
        <div className="flex flex-col gap-0.5 mr-1 pt-5">
          {days.map((d, i) => (
            <div key={d} className="h-3 text-[9px] text-white/30 leading-3 flex items-center">
              {i % 2 === 1 ? d : ''}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {/* Month label */}
            <div className="h-4 text-[9px] text-white/30 leading-4 text-center whitespace-nowrap">
              {week[0] && new Date(week[0].date + 'T12:00:00').getDate() <= 7
                ? format(new Date(week[0].date + 'T12:00:00'), 'MMM')
                : ''}
            </div>
            {week.map((day, di) => {
              const colorCls = scoreToColor(day.score);
              return (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm border cursor-pointer transition-transform hover:scale-125 hover:z-10 relative ${colorCls}`}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({ x: rect.left, y: rect.top, day });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-black/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-xl"
          style={{ top: tooltip.y - 56, left: tooltip.x - 40, minWidth: 120 }}
        >
          <div className="font-semibold">{format(new Date(tooltip.day.date + 'T12:00:00'), 'MMM d, yyyy')}</div>
          <div className="text-white/60 mt-0.5">{moodLabel(tooltip.day.score)}</div>
          {tooltip.day.score && (
            <div className="text-white/40">Score: {tooltip.day.score}/5</div>
          )}
        </div>
      )}
    </div>
  );
}
