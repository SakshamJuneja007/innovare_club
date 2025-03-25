"use client";

import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import EventRegistrationForm from "./EventRegistrationForm";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  status: string;
  profiles?: {
    username: string;
    role: string;
  }[];
}

interface EventPayload {
  id: string;
  title: string;
  date: string;
  status: string;
  profiles?: {
    username: string;
    role: string;
  }[];
  [key: string]: any;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('dashboard_events')
          .select(`
            *,
            profiles:user_id(username, role)
          `)
          .eq('status', 'approved')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Subscribe to changes
    const subscription = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_events',
          filter: `status=eq.approved`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [...prev, payload.new as Event]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => prev.map(event => 
              event.id === payload.new.id ? (payload.new as Event) : event
            ));
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => prev.filter(event => event.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-8"
      >
        Upcoming Events
      </motion.h2>
      <div className="grid grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-[400px] rounded-2xl bg-black/40 p-8 backdrop-blur-md border border-[#cffb2d]/20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-[#cffb2d] font-['Orbitron']"
          >
            Advanced AI & Robotics Summit
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-4"
          >
            <TextScramble
              className="text-xl font-['Share_Tech_Mono'] text-[#CFFB2D]"
              trigger={true}
              speed={0.05}
              characterSet="01"
            >
              Advanced Machine Learning Workshop
            </TextScramble>
            <div className="flex justify-center py-4 text-[#CFFB2D] font-['Share_Tech_Mono'] text-4xl">
              15:00 GMT
            </div>
            <div className="space-y-2 font-['Share_Tech_Mono']">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-[#cffb2d]"
              >
                <span className="text-gray-400">Date:</span> April 15, 2025
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-[#cffb2d]"
              >
                <span className="text-gray-400">Day:</span> Tuesday
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-[#cffb2d]"
              >
                <span className="text-gray-400">Time:</span> 15:00 GMT
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
        <EventRegistrationForm />
      </div>
    </div>
  );
}
