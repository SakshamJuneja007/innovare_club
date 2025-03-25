"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  height?: number;
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  height = 4,
  className = ""
}: ProgressBarProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-full bg-black/30 backdrop-blur-sm ${className}`}
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#CFFB2D] to-[#8B30FF]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["0%", "100%"],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow: [
            "0 0 10px rgba(207, 251, 45, 0.5)",
            "0 0 20px rgba(207, 251, 45, 0.7)",
            "0 0 10px rgba(207, 251, 45, 0.5)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
