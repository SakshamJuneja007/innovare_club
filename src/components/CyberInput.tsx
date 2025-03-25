"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CyberInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: string;
  max?: string;
}

export default function CyberInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  min,
  max
}: CyberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <motion.label
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 block font-['Share_Tech_Mono'] text-sm text-[#cffb2d]"
      >
        {label}
      </motion.label>
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 20px rgba(207, 251, 45, 0.5)"
              : "0 0 0px rgba(207, 251, 45, 0)",
          }}
          className="absolute inset-0 rounded-lg"
        />
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
          max={max}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full rounded-lg border border-[#C661E3]/20 bg-black/30 px-4 py-3 
            font-['Share_Tech_Mono'] text-[#CFFB2D] backdrop-blur-sm 
            placeholder:text-[#CFFB2D]/30 focus:border-[#8B30FF] 
            focus:outline-none focus:ring-1 focus:ring-[#C661E3]"
          placeholder={placeholder}
        />
        <motion.div
          initial={false}
          animate={{
            width: isFocused ? "100%" : "0%",
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-[2px] bg-[#cffb2d]"
        />
      </div>
    </div>
  );
}
