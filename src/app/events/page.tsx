"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { TextScramble } from "@/components/ui/text-scramble";
import CountdownTimer from "@/components/CountdownTimer";
import { supabase } from "@/lib/supabase";

export default function EventsPage() {
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("dashboard_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        return;
      }

      processEvents(data);
    };

    fetchEvents();

    // Real-time event updates
    const subscription = supabase
      .channel("events_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard_events" },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const processEvents = (events) => {
    const now = new Date();
    let past = [];
    let upcoming = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate < now) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });

    setPastEvents(past.reverse()); // Show latest past events first
    setUpcomingEvents(upcoming);
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-20">
      <Navbar />
      <div className="relative mx-auto max-w-[1400px] px-8 py-12">
        
        {/* Business Idea Presentation (Current Event) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-24 text-center"
        >
          <TextScramble
            className="text-6xl font-bold text-[#CFFB2D] font-['Orbitron']"
            trigger={true}
            speed={0.03}
          >
            BUSINESS IDEA
          </TextScramble>
          <TextScramble
            className="text-5xl font-bold text-[#8B30FF] font-['Orbitron']"
            trigger={true}
            speed={0.03}
          >
            PRESENTATION 2025
          </TextScramble>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center font-['Share_Tech_Mono'] text-gray-400"
          >
            Present your startup ideas, solve real-world challenges with innovation.
          </motion.p>

          <CountdownTimer />
        </motion.div>

        {/* Speakers Section (Reveals on Scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-12 text-center font-['Orbitron'] text-3xl font-bold text-[#CFFB2D]">
            SPEAKERS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {[
              {
                name: "Jane Doe",
                role: "CTO, TechNova",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
                topic: "The Role of AI in Business Transformation"
              },
              {
                name: "John Smith",
                role: "Lead Designer, UXNext",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
                topic: "User Experience Design for the Future"
              },
              {
                name: "Emily Tan",
                role: "Founder, Innovate AI",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
                topic: "Building a Successful Tech Startup from Scratch"
              }
            ].map((speaker, index) => (
              <SpeakerCard key={speaker.name} speaker={speaker} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Horizontal Events Timeline (Reveals on Scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="mb-12 text-center font-['Orbitron'] text-3xl font-bold text-[#CFFB2D]">
            EVENTS TIMELINE
          </h2>

          <div className="relative flex items-center overflow-x-auto px-4 pb-8">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#CFFB2D]/50 via-[#8B30FF]/50 to-[#CFFB2D]/50" />

            <div className="flex justify-between w-full">
              {/* Past Events */}
              {pastEvents.length > 0 && (
                <TimelineSection title="Past Events" events={pastEvents} isPast />
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <TimelineSection title="Upcoming Events" events={upcomingEvents} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TimelineSection({ title, events, isPast = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isPast ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative flex flex-col items-center space-y-6"
    >
      {events.map((event, index) => (
        <div key={event.id} className="relative flex flex-col items-center mx-12">
          <div className="w-5 h-5 bg-[#CFFB2D] rounded-full border border-white shadow-md" />
          <div className="w-72 bg-black/30 p-6 backdrop-blur-sm border border-[#CFFB2D]/20 rounded-xl text-center">
            <h3 className="font-['Orbitron'] text-lg font-bold text-[#CFFB2D]/70">
              {title}
            </h3>
            <p className="text-[#8B30FF]">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-400">{event.title}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function SpeakerCard({ speaker, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 * index, duration: 0.8 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl bg-black/30 p-6 backdrop-blur-sm"
    >
      <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D]">{speaker.name}</h3>
      <p className="text-[#8B30FF]">{speaker.role}</p>
    </motion.div>
  );
}
