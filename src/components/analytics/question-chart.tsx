"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load Recharts components - only loads when this component is rendered
const RechartsBarChart = dynamic(
  () => import('recharts').then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } = mod;
    return function BarChartComponent({ data, colors }: { data: Array<{ name: string; value: number }>; colors: string[] }) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" />
            <YAxis stroke="currentColor" className="text-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Bar dataKey="value" fill={colors[0] || "#3B82F6"} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    };
  }),
  { ssr: false, loading: () => <Skeleton className="w-full h-full" /> }
);

const RechartsPieChart = dynamic(
  () => import('recharts').then((mod) => {
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;
    return function PieChartComponent({ data, colors }: { data: Array<{ name: string; value: number }>; colors: string[] }) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => 
                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    };
  }),
  { ssr: false, loading: () => <Skeleton className="w-full h-full" /> }
);

interface QuestionChartProps {
  stats: Array<{ name: string; value: number }>;
  isBar: boolean;
  colors?: string[];
}

export function QuestionChart({ stats, isBar, colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'] }: QuestionChartProps) {
  return (
    <div className="h-64">
      {isBar ? (
        <RechartsBarChart data={stats} colors={colors} />
      ) : (
        <RechartsPieChart data={stats} colors={colors} />
      )}
    </div>
  );
}

