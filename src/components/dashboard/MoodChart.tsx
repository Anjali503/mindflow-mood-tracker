'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Entry } from '@/lib/db';

export default function MoodChart({ data }: { data: Entry[] }) {
  // Process data for the chart: calculate average score per day
  const dailyAverages = data.reduce((acc, entry) => {
    const day = format(parseISO(entry.createdAt), 'MMM dd');
    if (!acc[day]) acc[day] = { total: 0, count: 0 };
    acc[day].total += entry.moodScore;
    acc[day].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  // Convert to array and reverse to chronological order
  const chartData = Object.keys(dailyAverages).map(day => ({
    day,
    avgScore: dailyAverages[day].total / dailyAverages[day].count
  })).reverse();

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-white/40 border border-white/5 rounded-3xl bg-black/20">No data available yet. Start tracking!</div>;
  }

  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]} 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="avgScore" 
            stroke="#c084fc" 
            strokeWidth={4}
            dot={{ fill: '#c084fc', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#f472b6' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
