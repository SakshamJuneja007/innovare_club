"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface AchievementCardProps {
  title: string;
  description: string;
  date: string;
  icon?: React.ReactNode;
}

export default function AchievementCard({ 
  title, 
  description, 
  date, 
  icon = <Trophy className="h-6 w-6" />
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#8B30FF]/20 to-[#C661E3]/20 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-[#CFFB2D]/20 p-3">
          {icon}
        </div>
        <div>
          <h3 className="font-['Orbitron'] text-lg font-bold text-[#CFFB2D]">{title}</h3>
          <p className="mt-1 font-['Share_Tech_Mono'] text-gray-300">{description}</p>
          <p className="mt-2 font-['Share_Tech_Mono'] text-sm text-[#C661E3]">{date}</p>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: [
            "0 0 0px rgba(207, 251, 45, 0)",
            "0 0 20px rgba(207, 251, 45, 0.3)",
            "0 0 0px rgba(207, 251, 45, 0)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  );
}
