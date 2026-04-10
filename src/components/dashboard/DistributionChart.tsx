'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Entry } from '@/lib/db';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#a855f7'];

export default function DistributionChart({ data }: { data: Entry[] }) {
  // Aggregate mood scores
  const scoreCounts = [1, 2, 3, 4, 5].map(score => ({
    name: ['Awful', 'Bad', 'Okay', 'Good', 'Awesome'][score - 1],
    value: data.filter(d => d.moodScore === score).length
  }));

  if (data.length === 0) return null;

  return (
    <div className="h-64 mt-4 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={scoreCounts.filter(d => d.value > 0)}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {scoreCounts.map((entry, index) => (
              <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
             itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
