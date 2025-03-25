"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

export default function DashboardEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("dashboard_events")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load dashboard events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { error } = await supabase.from("dashboard_events").delete().eq("id", id);
      if (error) throw error;

      // Remove event from UI
      setEvents(events.filter((event) => event.id !== id));

      toast.success("Event removed successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
            className="relative overflow-hidden rounded-lg bg-black/30 p-4 border border-[#CFFB2D]/10 flex justify-between items-center"
          >
            <div>
              <h4 className="font-['Orbitron'] text-lg text-[#CFFB2D]">{event.title}</h4>
              <div className="space-y-2 font-['Share_Tech_Mono'] text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => deleteEvent(event.id)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete Event"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
