"use client";

import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";

export default function AboutHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="mb-16"
    >
      <TextScramble
        className="text-6xl font-bold text-[#CFFB2D] font-['Orbitron'] tracking-tighter"
        trigger={true}
        speed={0.03}
        characterSet="matrix"
        glowColor="#CFFB2D"
      >
        INNOVARE TECHNICAL CLUB
      </TextScramble>
    </motion.div>
  );
}
