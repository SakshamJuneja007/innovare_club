"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TextScramble } from "@/components/ui/text-scramble";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const generateRandomData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `${i + 1}h`,
    members: Math.floor(Math.random() * 100) + 200,
    projects: Math.floor(Math.random() * 20) + 30,
    events: Math.floor(Math.random() * 10) + 5
  }));
};

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch dashboard stats
        const { data: statsData, error: statsError } = await supabase
  .from("dashboard_stats")
  .select("*")
  .limit(1) // ✅ Ensures only 1 row is fetched
  .maybeSingle(); // ✅ Prevents error if table is empty

if (statsError) {
  console.error("Error fetching stats:", statsError);
}
setStats(statsData);

        // Fetch activity metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('activity_metrics')
          .select('*')
          .order('timestamp', { ascending: true })
          .limit(24);

        if (metricsError) throw metricsError;
        setActivityData(metricsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time changes
    const statsSubscription = supabase
      .channel('dashboard_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_stats'
        },
        (payload) => {
          setStats(payload.new);
        }
      )
      .subscribe();

    const metricsSubscription = supabase
      .channel('activity_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_metrics'
        },
        (payload) => {
          setActivityData(prev => {
            const newData = [...prev, payload.new];
            if (newData.length > 24) {
              newData.shift();
            }
            return newData;
          });
        }
      )
      .subscribe();

    return () => {
      statsSubscription.unsubscribe();
      metricsSubscription.unsubscribe();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-3 space-y-8"
    >
      <div className="flex justify-end mb-6">
        <div className="flex gap-4">
          <motion.a
            href="/dashboard/new-project"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#CFFB2D] text-black font-['Orbitron'] hover:bg-[#8B30FF] hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + New Project
          </motion.a>
          <motion.a
            href="/dashboard/new-event"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#CFFB2D] text-black font-['Orbitron'] hover:bg-[#8B30FF] hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + New Event
          </motion.a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Active Members", value: "310+", change: "+15%" },
          { title: "Ongoing Projects", value: "42", change: "+8%" },
          { title: "Monthly Events", value: "12", change: "+25%" }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-black/40 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(207,251,45,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <h3 className="font-['Orbitron'] text-lg font-bold text-[#CFFB2D] mb-2">
              {stat.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-['Share_Tech_Mono'] text-3xl text-white">
                {stat.value}
              </span>
              <span className="font-['Share_Tech_Mono'] text-sm text-green-400">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-black/40 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
      >
        <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D] mb-6">
          24h Activity Monitor
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="members" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CFFB2D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#CFFB2D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B30FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B30FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="events" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C661E3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C661E3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
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
                dataKey="members"
                stroke="#CFFB2D"
                fill="url(#members)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="projects"
                stroke="#8B30FF"
                fill="url(#projects)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="#C661E3"
                fill="url(#events)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
