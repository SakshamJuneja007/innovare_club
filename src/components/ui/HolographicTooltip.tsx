"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import HolographicOverlay from "./HolographicOverlay";

interface HolographicTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function HolographicTooltip({
  content,
  children,
  position = "top"
}: HolographicTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <div className={`absolute ${positionStyles[position]} z-50`}>
            <HolographicOverlay variant="tooltip">
              <div className="p-2 text-sm font-['Share_Tech_Mono'] text-[#CFFB2D]">
                {content}
              </div>
            </HolographicOverlay>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
