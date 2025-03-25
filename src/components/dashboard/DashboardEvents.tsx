"use client";

import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "AI Workshop Series",
    date: "2025-04-15",
    time: "14:00",
    location: "Tech Hub",
    type: "Workshop"
  },
  {
    id: "2",
    title: "Hackathon 2025",
    date: "2025-05-01",
    time: "09:00",
    location: "Main Campus",
    type: "Competition"
  },
  {
    id: "3",
    title: "Tech Expo",
    date: "2025-06-10",
    time: "10:00",
    location: "Innovation Center",
    type: "Exhibition"
  }
];

export default function DashboardEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components
  
    const fetchEvents = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
  
        const { data, error } = await supabase
          .from('dashboard_events')
          .select('*')
          .order('date', { ascending: true });
  
        if (error) throw error;
  
        if (isMounted) {
          setEvents(data);
        }
  
        // Subscribe to real-time changes
        const subscription = supabase
          .channel('dashboard_events')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'dashboard_events'
            },
            (payload) => {
              if (!isMounted) return; // Avoid updates after unmount
  
              if (payload.eventType === 'INSERT') {
                setEvents(prev => [...prev, payload.new as Event].sort((a, b) => 
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                ));
              } else if (payload.eventType === 'UPDATE') {
                setEvents(prev => prev.map(event => 
                  event.id === payload.new.id ? payload.new as Event : event
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
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchEvents();
  
    return () => {
      isMounted = false; // Prevent updates after unmount
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl bg-black/40 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D] mb-6">
        Upcoming Events
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-black/30 p-4 border border-[#CFFB2D]/10"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(207,251,45,0.1) 0%, transparent 100%)",
                  "linear-gradient(45deg, transparent 0%, rgba(139,48,255,0.1) 100%)",
                  "linear-gradient(45deg, rgba(207,251,45,0.1) 0%, transparent 100%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
                  {event.title}
                </h4>
                <span className="font-['Share_Tech_Mono'] text-sm text-[#C661E3]">
                  {event.type}
                </span>
              </div>
              <div className="space-y-2 font-['Share_Tech_Mono'] text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
