"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CyberButton from "@/components/CyberButton";
import { Check, X, Calendar, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  created_by: {
    username: string;
  };
}

export default function EventModeration() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();

    const subscription = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_moderation'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            fetchEvents();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('content_moderation')
        .select(`
          id,
          content_id,
          status,
          dashboard_events!content_id (
            title,
            date,
            time,
            location,
            user_id,
            profiles!user_id (
              username
            )
          )
        `)
        .eq('content_type', 'event')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEvents = data.map(item => ({
        id: item.content_id,
        title: item.dashboard_events?.[0]?.title || '',
        date: item.dashboard_events?.[0]?.date || '',
        time: item.dashboard_events?.[0]?.time || '',
        location: item.dashboard_events?.[0]?.location || '',
        status: item.status,
        created_by: {
          username: item.dashboard_events?.[0]?.profiles?.[0]?.username || 'Unknown'
        }
      })) as Event[];

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (eventId: string, approved: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to continue");
        return;
      }

      const { data, error } = await supabase.functions.invoke('approve-event', {
        body: { 
          eventId,
          approved,
          notes: approved ? 'Event approved by moderator' : 'Event rejected by moderator'
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      toast.success(`Event ${approved ? 'approved' : 'rejected'}`);
      fetchEvents(); // Refresh event list
    } catch (error) {
      console.error('Error moderating event:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update event status");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading events...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 font-['Share_Tech_Mono']">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
                <p className="text-sm text-[#8B30FF]">
                  Created by: {event.created_by.username}
                </p>
              </div>
              <div className="flex gap-4">
                <CyberButton
                  onClick={() => handleModeration(event.id, true)}
                  variant="primary"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </CyberButton>
                <CyberButton
                  onClick={() => handleModeration(event.id, false)}
                  variant="secondary"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </CyberButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
