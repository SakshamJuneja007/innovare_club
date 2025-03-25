"use client";

import { motion } from "framer-motion";

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function CyberButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: CyberButtonProps) {
  const baseClasses = "relative px-6 py-3 rounded-lg font-['Orbitron'] text-base font-bold transition-all";
  const variantClasses = variant === "primary" 
    ? "bg-[#CFFB2D] text-black hover:bg-[#8B30FF]" 
    : "bg-black/30 text-[#CFFB2D] border border-[#C661E3]/20";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: "0 0 20px rgba(207, 251, 45, 0.3)",
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      {children}
    </motion.button>
  );
}
