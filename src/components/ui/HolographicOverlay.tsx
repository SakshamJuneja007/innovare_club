"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HolographicOverlayProps {
  children: ReactNode;
  variant?: "modal" | "tooltip" | "card";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function HolographicOverlay({
  children,
  variant = "card",
  isOpen = true,
  onClose
}: HolographicOverlayProps) {
  const variants = {
    modal: "fixed inset-0 flex items-center justify-center",
    tooltip: "absolute z-50",
    card: "relative"
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        duration: 0.2
      }
    }
  };

  const glitchVariants = {
    initial: { clipPath: "inset(0 0 0 0)" },
    glitch: {
      clipPath: [
        "inset(40% 0 61% 0)",
        "inset(92% 0 1% 0)",
        "inset(43% 0 1% 0)",
        "inset(25% 0 58% 0)",
        "inset(0 0 0 0)",
      ],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror" as const,
        repeatDelay: 5,
      },
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className={`${variants[variant]}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
    >
      {variant === "modal" && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      <motion.div
        className="relative overflow-hidden rounded-xl border border-[#CFFB2D]/20 
          bg-black/30 p-6 backdrop-blur-md shadow-[0_8px_32px_0_rgba(207,251,45,0.1)]"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#CFFB2D]/5 to-[#8B30FF]/5"
          variants={glitchVariants}
          initial="initial"
          animate="glitch"
        />
        
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(45deg, rgba(207,251,45,0.1) 0%, rgba(139,48,255,0.1) 100%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="relative z-10"
          whileHover={{
            scale: variant === "card" ? 1.02 : 1,
          }}
        >
          {children}
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              "0 0 0px rgba(207,251,45,0)",
              "0 0 20px rgba(207,251,45,0.3)",
              "0 0 0px rgba(207,251,45,0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
