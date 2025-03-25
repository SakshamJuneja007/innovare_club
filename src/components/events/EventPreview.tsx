"use client";

import { motion } from 'framer-motion';
import { useEventStore } from '@/stores/eventStore';
import { Calendar, MapPin, Clock, Check, X, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const RsvpButtons = ({ eventId }: { eventId: string }) => {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const { rsvpToEvent, getRsvpStatus } = useEventStore();

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getRsvpStatus(eventId);
      setCurrentStatus(status);
    };
    fetchStatus();
  }, [eventId, getRsvpStatus]);

  const handleRsvp = async (status: 'attending' | 'maybe' | 'not_attending') => {
    try {
      await rsvpToEvent(eventId, status);
      setCurrentStatus(status);
    } catch (error) {
      console.error('Failed to update RSVP:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleRsvp('attending')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          currentStatus === 'attending'
            ? 'bg-[#CFFB2D] text-black border-[#CFFB2D]'
            : 'border-[#CFFB2D]/20 text-[#CFFB2D] hover:bg-[#CFFB2D]/10'
        }`}
      >
        <Check className="w-4 h-4" />
        Attending
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleRsvp('maybe')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          currentStatus === 'maybe'
            ? 'bg-[#8B30FF] text-white border-[#8B30FF]'
            : 'border-[#8B30FF]/20 text-[#8B30FF] hover:bg-[#8B30FF]/10'
        }`}
      >
        <HelpCircle className="w-4 h-4" />
        Maybe
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleRsvp('not_attending')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          currentStatus === 'not_attending'
            ? 'bg-red-500 text-white border-red-500'
            : 'border-red-500/20 text-red-500 hover:bg-red-500/10'
        }`}
      >
        <X className="w-4 h-4" />
        Not Attending
      </motion.button>
    </div>
  );
};

export default function EventPreview() {
  const events = useEventStore(state => state.events);
  const loading = useEventStore(state => state.loading);

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading events...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron']">
        Latest Events
      </h2>

      <div className="grid gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
          >
            <h3 className="text-xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-4">
              {event.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-400 font-['Share_Tech_Mono']">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400 font-['Share_Tech_Mono']">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>

            <p className="text-gray-300 font-['Share_Tech_Mono'] mb-4">
              {event.description}
            </p>
            <RsvpButtons eventId={event.id} />
          </motion.div>
        ))}

        {events.length === 0 && (
          <p className="text-center text-gray-400 font-['Share_Tech_Mono']">
            No events found. Create one to get started!
          </p>
        )}
      </div>
    </motion.div>
  );
}
