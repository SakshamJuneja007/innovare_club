"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

interface FeaturedEvent {
  id: string;
  title: string;
  date: string;
  description: string | null;
  is_active: boolean;
}

export default function FeaturedEventManager() {
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<FeaturedEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    is_active: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load featured events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('featured_events')
          .update({
            title: formData.title,
            date: formData.date,
            description: formData.description,
            is_active: formData.is_active
          })
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        const { error } = await supabase
          .from('featured_events')
          .insert([formData]);

        if (error) throw error;
        toast.success("Event created successfully");
      }

      setFormData({ title: "", date: "", description: "", is_active: true });
      setEditingEvent(null);
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('featured_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Failed to delete event");
    }
  };

  const handleEdit = (event: FeaturedEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description || "",
      is_active: event.is_active
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading featured events...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron']">
          Featured Events
        </h2>
        <CyberButton onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Featured Event
        </CyberButton>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-black/40 border border-[#CFFB2D]/20 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#CFFB2D] font-['Orbitron']">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
                setFormData({ title: "", date: "", description: "", is_active: true });
              }}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <CyberInput
            label="TITLE"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            required
          />

          <CyberInput
            label="DATE"
            type="datetime-local"
            value={formData.date}
            onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-black/30 border border-[#CFFB2D]/20 rounded-lg 
                text-white placeholder-gray-500 font-['Share_Tech_Mono'] resize-none
                focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-[#CFFB2D]/20 bg-black/30 text-[#CFFB2D]"
            />
            <label className="text-[#CFFB2D] font-['Share_Tech_Mono']">
              Active Event
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <CyberButton type="submit">
              <Save className="w-4 h-4 mr-2" />
              {editingEvent ? "Update Event" : "Create Event"}
            </CyberButton>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-xl bg-black/30 border border-[#CFFB2D]/20"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-400 font-['Share_Tech_Mono'] mb-2">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-gray-300 font-['Share_Tech_Mono']">
                  {event.description}
                </p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-['Share_Tech_Mono'] ${
                    event.is_active 
                      ? 'bg-[#CFFB2D]/20 text-[#CFFB2D]' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <CyberButton
                  onClick={() => handleEdit(event)}
                  variant="secondary"
                >
                  <Edit2 className="w-4 h-4" />
                </CyberButton>
                <CyberButton
                  onClick={() => handleDelete(event.id)}
                  variant="secondary"
                >
                  <Trash2 className="w-4 h-4" />
                </CyberButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
