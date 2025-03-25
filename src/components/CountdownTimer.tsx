"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isGlitching, setIsGlitching] = useState(false);
  const [showBattleMode, setShowBattleMode] = useState(false);
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent | null>(null);

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('featured_events')
          .select('*')
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setFeaturedEvent(data);
      } catch (error) {
        console.error('Error fetching featured event:', error);
        toast.error("Failed to load event details");
      }
    };

    fetchFeaturedEvent();

    // Subscribe to changes in featured events
    const subscription = supabase
      .channel('featured_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'featured_events',
          filter: 'is_active=eq.true'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
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

      if (difference > 0) {
        setIsGlitching(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        if (!isGlitching) {
          setIsGlitching(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          document.body.classList.add('glitch-effect');
          
          // Start the glitch sequence
          setTimeout(() => {
            document.body.classList.remove('glitch-effect');
            setShowBattleMode(true);
          }, 3000);
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [featuredEvent, isGlitching]);

  const glitchVariants = {
    normal: {
      skew: 0,
      opacity: 1,
      x: 0,
    },
    glitch: {
      skew: [0, -10, 10, 0],
      opacity: [1, 0.8, 0.9, 1],
      x: [0, -5, 5, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative">
        <motion.div
          className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-black/40 backdrop-blur-md"
          initial={false}
          animate={{
            boxShadow: isGlitching 
              ? ["0 0 20px rgba(207,251,45,0.2)", "0 0 40px rgba(207,251,45,0.4)", "0 0 20px rgba(207,251,45,0.2)"]
              : "0 0 20px rgba(207,251,45,0.2)"
          }}
          transition={{
            duration: 2,
            repeat: isGlitching ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#CFFB2D]/10 to-[#8B30FF]/10"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="relative z-10 font-['Share_Tech_Mono'] text-4xl font-bold text-[#CFFB2D] w-[3ch] text-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0"
              >
                {value.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.div
            className="absolute inset-0 border border-[#CFFB2D]/20"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
        
        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-['Orbitron'] text-sm font-medium text-[#CFFB2D]/80">
            {label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );

  if (showBattleMode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1,
          scale: 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className="relative"
      >
        <motion.div
          className="battle-mode text-center"
          animate={{
            textShadow: [
              "0 0 20px rgba(207,251,45,0.7)",
              "0 0 40px rgba(207,251,45,0.9)",
              "0 0 20px rgba(207,251,45,0.7)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            LET THE BATTLE COMMENCE
          </motion.span>
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at center, rgba(207,251,45,0.2) 0%, transparent 70%)",
              "radial-gradient(circle at center, rgba(139,48,255,0.2) 0%, transparent 70%)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      className="relative mt-8 flex flex-wrap justify-center gap-4 px-4"
    >
      <TimeUnit value={timeLeft.days} label="DAYS" />
      <TimeUnit value={timeLeft.hours} label="HOURS" />
      <TimeUnit value={timeLeft.minutes} label="MINUTES" />
      <TimeUnit value={timeLeft.seconds} label="SECONDS" />
      {isGlitching ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="battle-mode text-center"
        >
          BATTLE MODE ON
        </motion.div>
      ) : (
        <motion.div
          className="absolute -inset-4 -z-10 rounded-xl bg-gradient-to-r from-[#CFFB2D]/20 to-[#8B30FF]/20"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}
