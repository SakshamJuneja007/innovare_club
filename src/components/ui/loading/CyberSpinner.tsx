"use client";

import { motion } from "framer-motion";

interface CyberSpinnerProps {
  size?: number;
  color?: string;
  glowColor?: string;
}

export default function CyberSpinner({ 
  size = 40, 
  color = "#CFFB2D",
  glowColor = "rgba(207, 251, 45, 0.5)"
}: CyberSpinnerProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        style={{
          border: `2px solid ${color}`,
          borderRadius: "50%",
          borderTopColor: "transparent",
          filter: `drop-shadow(0 0 8px ${glowColor})`
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          border: `2px dashed ${color}`,
          borderRadius: "50%",
          opacity: 0.5
        }}
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
