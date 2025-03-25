"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { memo } from "react";

interface AboutCardProps {
  id: string;
  title: string;
  shortDesc: string;
  icon: LucideIcon;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

export default memo(function AboutCard({
  id,
  title,
  shortDesc,
  icon: Icon,
  isHovered,
  onHover
}: AboutCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => onHover(id)}
      onHoverEnd={() => onHover(null)}
      className="relative overflow-hidden rounded-xl bg-black/20 p-4 
        border border-[#CFFB2D]/10 cursor-pointer
        backdrop-blur-md
        shadow-[0_8px_32px_0_rgba(207,251,45,0.05)]
        transition-all duration-500 ease-out
        hover:bg-black/30 hover:border-[#CFFB2D]/30
        hover:shadow-[0_8px_32px_0_rgba(207,251,45,0.15)]
        group"
    >
      <motion.div 
        className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-[#CFFB2D]/10 
          to-[#8B30FF]/10 opacity-0 transition-opacity duration-500 ease-out -z-10"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#CFFB2D]" />
        <h2 className="font-['Orbitron'] text-lg font-bold text-[#CFFB2D]">
          {title}
        </h2>
      </div>
      <p className="font-['Share_Tech_Mono'] text-sm text-gray-300 mt-2">
        {shortDesc}
      </p>
    </motion.div>
  );
});
