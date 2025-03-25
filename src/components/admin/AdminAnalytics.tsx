"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Users, Calendar, Target } from "lucide-react";

interface AnalyticsData {
  date: string;
  users: number;
  events: number;
  projects: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    const subscription = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_metrics'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_metrics')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(30);

      if (error) throw error;

      const formattedData = data.map(item => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        users: item.members,
        events: item.events,
        projects: item.projects
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading analytics...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#CFFB2D]" />
            <h3 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
              Total Users
            </h3>
          </div>
          <p className="mt-4 text-3xl font-['Share_Tech_Mono']">
            {data[data.length - 1]?.users || 0}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#CFFB2D]" />
            <h3 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
              Active Events
            </h3>
          </div>
          <p className="mt-4 text-3xl font-['Share_Tech_Mono']">
            {data[data.length - 1]?.events || 0}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-[#CFFB2D]" />
            <h3 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
              Active Projects
            </h3>
          </div>
          <p className="mt-4 text-3xl font-['Share_Tech_Mono']">
            {data[data.length - 1]?.projects || 0}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
      >
        <h3 className="font-['Orbitron'] text-lg text-[#CFFB2D] mb-6">
          30-Day Trends
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFFB2D20" />
              <XAxis
                dataKey="date"
                stroke="#666"
                tick={{ fill: '#666' }}
              />
              <YAxis stroke="#666" tick={{ fill: '#666' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(207,251,45,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#CFFB2D"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#8B30FF"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#C661E3"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
