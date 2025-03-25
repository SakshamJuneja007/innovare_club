"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import CyberInput from '@/components/CyberInput';
import CyberButton from '@/components/CyberButton';
import { useEventStore } from '@/stores/eventStore';
import { Calendar, MapPin, FileText } from 'lucide-react';

interface EventFormData {
  name: string;
  date: string;
  location: string;
  description: string;
}

const initialFormData: EventFormData = {
  name: '',
  date: '',
  location: '',
  description: ''
};

export default function EventForm() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const addEvent = useEventStore(state => state.addEvent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addEvent(formData);
      setFormData(initialFormData);
    } catch (error) {
      // Error is handled by the store
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-8">
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="relative">
            <CyberInput
              label="EVENT NAME"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              required
              placeholder="Enter event name"
            />
            <Calendar className="absolute right-4 top-10 h-5 w-5 text-[#CFFB2D]/50" />
          </div>

          <div className="relative">
            <CyberInput
              label="EVENT DATE"
              type="date"
              value={formData.date}
              onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
              required
            />
            <Calendar className="absolute right-4 top-10 h-5 w-5 text-[#CFFB2D]/50" />
          </div>

          <div className="relative">
            <CyberInput
              label="LOCATION"
              value={formData.location}
              onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              required
              placeholder="Enter event location"
            />
            <MapPin className="absolute right-4 top-10 h-5 w-5 text-[#CFFB2D]/50" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
              DESCRIPTION
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Enter event description"
                className="w-full h-32 px-4 py-3 rounded-lg bg-black/30 border border-[#CFFB2D]/20 
                  text-white placeholder-gray-500 font-['Share_Tech_Mono'] resize-none
                  focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]"
              />
              <FileText className="absolute right-4 top-4 h-5 w-5 text-[#CFFB2D]/50" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <CyberButton
            type="button"
            variant="secondary"
            onClick={() => setFormData(initialFormData)}
          >
            Reset
          </CyberButton>
          <CyberButton
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </CyberButton>
        </div>
      </form>
    </motion.div>
  );
}
