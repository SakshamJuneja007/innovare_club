"use client";

import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";

export default function CurrentEvent() {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-8"
      >
        Current Event
      </motion.h2>
      <div className="grid grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-[400px] rounded-2xl bg-black/40 p-8 backdrop-blur-md border border-[#cffb2d]/20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-[#cffb2d] font-['Orbitron']"
          >
            Business Idea Presentation
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-4"
          >
            <div className="flex justify-center py-4 text-[#CFFB2D] font-['Share_Tech_Mono'] text-4xl">
              10:00 AM
            </div>
            <div className="space-y-2 font-['Share_Tech_Mono']">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-[#cffb2d]"
              >
                <span className="text-gray-400">Date:</span> March 27, 2025
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-[#cffb2d]"
              >
                <span className="text-gray-400">Day:</span> Thursday
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-[#cffb2d]"
              >
                <span className="text-gray-400">Time:</span> 14:00 GMT
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6 rounded-2xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center font-['Orbitron'] text-2xl font-bold text-[#cffb2d]"
          >
            Register for Event
          </motion.h2>
          <CyberInput
            label="NAME"
            placeholder="Enter your name"
            value=""
            onChange={() => {}}
          />
          <CyberInput
            label="EMAIL"
            type="email"
            placeholder="Enter your email"
            value=""
            onChange={() => {}}
          />
          <div className="mt-8 space-y-4">
            <CyberButton type="submit">
              SUBMIT REGISTRATION
            </CyberButton>
            <CyberButton variant="secondary">
              CANCEL
            </CyberButton>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
