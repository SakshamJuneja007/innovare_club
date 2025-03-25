"use client";

import { motion } from "framer-motion";
import HolographicOverlay from "./HolographicOverlay";

interface HolographicCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function HolographicCard({
  title,
  children,
  icon
}: HolographicCardProps) {
  return (
    <HolographicOverlay variant="card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              className="rounded-full bg-[#CFFB2D]/10 p-2 text-[#CFFB2D]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {icon}
            </motion.div>
          )}
          <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D]">
            {title}
          </h3>
        </div>
        <div className="font-['Share_Tech_Mono'] text-gray-300">
          {children}
        </div>
      </div>
    </HolographicOverlay>
  );
}
