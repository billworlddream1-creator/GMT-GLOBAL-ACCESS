import React from 'react';
import { GlassCard } from '../GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'USA', gdp: 85, growth: 2.4 },
  { name: 'CHN', gdp: 72, growth: 4.1 },
  { name: 'EU', gdp: 65, growth: 1.8 },
  { name: 'JPN', gdp: 40, growth: 0.9 },
  { name: 'IND', gdp: 35, growth: 6.8 },
  { name: 'GBR', gdp: 28, growth: 1.2 },
  { name: 'BRA', gdp: 20, growth: 2.1 },
];

export const GlobalMarket: React.FC = () => {
  return (
    <div className="space-y-6">
      <GlassCard title="Global GDP Rankings (Simulated)" className="min-h-[500px]">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              cursor={{fill: '#ffffff10'}}
              contentStyle={{ backgroundColor: '#000000aa', backdropFilter: 'blur(10px)', border: '1px solid #333' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="gdp" name="GDP Index" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="growth" name="Growth %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard title="Market Sentiment" className="border-l-4 border-l-emerald-500">
           <div className="text-4xl font-bold text-white">BULLISH</div>
           <p className="text-emerald-400 text-sm mt-1">+2.4% Daily Avg</p>
        </GlassCard>
        <GlassCard title="Volatility Index" className="border-l-4 border-l-amber-500">
           <div className="text-4xl font-bold text-white">14.2</div>
           <p className="text-amber-400 text-sm mt-1">Moderate Risk</p>
        </GlassCard>
        <GlassCard title="Commodities" className="border-l-4 border-l-blue-500">
           <div className="text-4xl font-bold text-white">GOLD</div>
           <p className="text-blue-400 text-sm mt-1">Trending Upward</p>
        </GlassCard>
      </div>
    </div>
  );
};