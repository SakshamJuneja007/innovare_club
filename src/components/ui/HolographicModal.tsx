"use client";

import { motion, AnimatePresence } from "framer-motion";
import HolographicOverlay from "./HolographicOverlay";
import { X } from "lucide-react";

interface HolographicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function HolographicModal({
  isOpen,
  onClose,
  title,
  children
}: HolographicModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <HolographicOverlay variant="modal" isOpen={isOpen} onClose={onClose}>
          <div className="w-[500px]">
            <div className="mb-6 flex items-center justify-between">
              <motion.h2 
                className="font-['Orbitron'] text-2xl font-bold text-[#CFFB2D]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {title}
              </motion.h2>
              <motion.button
                className="rounded-full p-2 text-[#CFFB2D] hover:bg-[#CFFB2D]/10"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {children}
            </motion.div>
          </div>
        </HolographicOverlay>
      )}
    </AnimatePresence>
  );
}
