"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CyberSpinner from "./ui/loading/CyberSpinner";
import GlitchText from "./ui/loading/GlitchText";
import ProgressBar from "./ui/loading/ProgressBar";
import DataMatrix from "./ui/loading/DataMatrix";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 40);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="relative max-w-sm w-full mx-auto px-8">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2">
          <DataMatrix />
        </div>
        
        <div className="mb-8 flex items-center justify-center">
          <CyberSpinner size={60} />
        </div>

        <GlitchText 
          text="INNOVARE"
          className="text-center text-4xl font-bold mb-8"
        />

        <div className="space-y-2">
          <ProgressBar progress={progress} className="w-full" />
          <div className="flex justify-between font-['Share_Tech_Mono'] text-xs text-[#CFFB2D]">
            <span>LOADING SYSTEM</span>
            <span>{progress}%</span>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              "0 0 0px rgba(207, 251, 45, 0)",
              "0 0 20px rgba(207, 251, 45, 0.3)",
              "0 0 0px rgba(207, 251, 45, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </motion.div>
  );
}
