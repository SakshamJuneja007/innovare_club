"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FeaturedEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent | null>(null);

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("featured_events")
          .select("*")
          .eq("is_active", true)
          .single();

        if (error) throw error;
        setFeaturedEvent(data);
      } catch (error) {
        toast.error("Failed to load event details");
      }
    };

    fetchFeaturedEvent();

    const subscription = supabase
      .channel("featured_events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "featured_events",
          filter: "is_active=eq.true",
        },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            setFeaturedEvent(payload.new as FeaturedEvent);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!featuredEvent) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetDate = new Date(featuredEvent.date).getTime();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [featuredEvent]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mt-4">
      {/* Countdown Timer UI */}
      <div className="flex items-center space-x-3">
        {[
          { value: timeLeft.days, label: "DAYS" },
          { value: timeLeft.hours, label: "HOURS" },
          { value: timeLeft.minutes, label: "MINUTES" },
          { value: timeLeft.seconds, label: "SECONDS" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Countdown Box */}
            <motion.div
              className="w-20 h-20 flex items-center justify-center 
                        bg-black bg-opacity-50 rounded-md 
                        text-[#CFFB2D] shadow-md shadow-[#CFFB2D]/50 border border-[#CFFB2D]
                        transition-transform duration-200 hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-mono text-4xl font-bold">{item.value.toString().padStart(2, "0")}</span>
            </motion.div>

            {/* Label Below */}
            <span className="mt-1 text-[white] text-sm font-semibold tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
