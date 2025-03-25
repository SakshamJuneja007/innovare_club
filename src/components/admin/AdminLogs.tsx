"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Activity } from "lucide-react";

interface AdminLog {
  id: string;
  admin: {
    username: string;
  };
  action: string;
  target_type: string;
  details: any;
  created_at: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();

    const subscription = supabase
      .channel('admin_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_logs'
        },
        (payload) => {
          setLogs(prev => [payload.new as AdminLog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          id,
          action,
          target_type,
          details,
          created_at,
          profiles!admin_id (username)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedLogs = data.map(log => ({
        ...log,
        admin: {
          username: log.profiles?.[0]?.username || 'Unknown'
        }
      })) as AdminLog[];

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error("Failed to load admin logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading logs...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {logs.map((log) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#CFFB2D]" />
            <div className="flex-1">
              <p className="font-['Share_Tech_Mono'] text-[#CFFB2D]">
                <span className="text-[#8B30FF]">{log.admin.username}</span>
                {' '}performed{' '}
                <span className="text-[#C661E3]">{log.action}</span>
                {' '}on{' '}
                <span className="text-[#8B30FF]">{log.target_type}</span>
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-400 font-['Share_Tech_Mono']">
                  {new Date(log.created_at).toLocaleString()}
                </p>
                {log.details && (
                  <p className="text-sm text-gray-400 font-['Share_Tech_Mono']">
                    {JSON.stringify(log.details)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
