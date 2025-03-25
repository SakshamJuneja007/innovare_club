"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  data: Array<{ name: string; value: number }>;
  color: string;
}

export default function StatsCard({ title, value, change, data, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-black/40 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <div className="mb-4">
        <h3 className="font-['Orbitron'] text-lg font-bold text-[#CFFB2D]">{title}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-['Share_Tech_Mono'] text-3xl text-white">{value}</span>
          <span className={`font-['Share_Tech_Mono'] text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="#666" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(207, 251, 45, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Share Tech Mono'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${title})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
