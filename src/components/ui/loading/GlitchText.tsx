"use client";

import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative text-[#CFFB2D] font-['Share_Tech_Mono']"
        animate={{
          x: [-2, 2, -2],
          textShadow: [
            "0 0 7px #CFFB2D",
            "0 0 10px #8B30FF",
            "0 0 21px #C661E3",
            "0 0 42px #CFFB2D",
            "0 0 82px #8B30FF",
            "0 0 92px #C661E3",
            "0 0 102px #CFFB2D",
            "0 0 151px #8B30FF",
          ],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {text}
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full"
        style={{
          clipPath: "inset(50% 0 50% 0)",
          color: "#C661E3",
        }}
        animate={{
          clipPath: [
            "inset(40% 0 61% 0)",
            "inset(92% 0 1% 0)",
            "inset(43% 0 1% 0)",
            "inset(25% 0 58% 0)",
            "inset(0% 0 0% 0)",
          ],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}
