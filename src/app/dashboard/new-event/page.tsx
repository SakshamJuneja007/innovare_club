"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "",
    capacity: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting event...")
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to create an event");
        return;
      }

      const { data: eventData, error: eventError } = await supabase
      .from("dashboard_events")
      .insert({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
        capacity: parseInt(formData.capacity || "0"), // Ensure it's an integer
        description: formData.description,
        user_id: session.user.id,
        status: "pending",
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    console.log("Inserted Event:", eventData);
    if (eventError) {
      console.error("Supabase Insert Error:", eventError); // Log full error
      toast.error(`Failed to create event: ${eventError.message}`);
      return;
    }
      if (eventError) throw eventError;

      // Create moderation entry
      const { error: moderationError } = await supabase
        .from('content_moderation')
        .insert({
          content_type: 'event',
          content_id: eventData.id,
          status: 'pending'
        });

      if (moderationError) throw moderationError;

      toast.success("Event submitted for approval!");
      router.push("/dashboard");
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
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

          <div className="relative">
            <h1 className="text-3xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-2">
              Schedule New Event
            </h1>
            <p className="text-gray-400 font-['Share_Tech_Mono'] mb-8">
              Initialize a new event in the timeline
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative">
                    <CyberInput
                      label="EVENT TITLE"
                      value={formData.title}
                      onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                      required
                      placeholder="Enter event designation"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <CyberInput
                      label="DATE"
                      type="date"
                      value={formData.date}
                      onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
                      required
                    />
                    <CyberInput
                      label="TIME"
                      type="time"
                      value={formData.time}
                      onChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                      required
                    />
                  </div>

                  <CyberInput
                    label="LOCATION"
                    value={formData.location}
                    onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                    required
                    placeholder="Event coordinates"
                  />
                </div>

                <div className="space-y-6">
                  <CyberInput
                    label="EVENT TYPE"
                    value={formData.type}
                    onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    required
                    placeholder="Specify event classification"
                  />

                  <CyberInput
                    label="CAPACITY"
                    type="number"
                    value={formData.capacity}
                    onChange={(value) => setFormData(prev => ({ ...prev, capacity: value }))}
                    placeholder="Maximum participants"
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-32 px-4 py-3 rounded-lg bg-black/30 border border-[#CFFB2D]/20 
                        text-white placeholder-gray-500 font-['Share_Tech_Mono'] resize-none
                        focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]"
                      placeholder="Enter event details"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <CyberButton
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </CyberButton>
                <CyberButton
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                </CyberButton>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
