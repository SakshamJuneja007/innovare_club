"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { TextScramble } from "@/components/ui/text-scramble";

export default function HeroSection() {


  return (
    <motion.div 
      className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-5rem)] gap-8 py-6 lg:py-0 px-4 lg:px-0 mt-8 md:mt-0"
    >
      <h1 
        className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#CFFB2D] font-['Permanent Marker'] leading-tight text-center lg:text-left"
      >
        Innovare<br/>Technical<br/>Club
      </h1>

      <div
        className="w-full lg:w-[500px] rounded-2xl bg-gradient-to-br from-[#8B30FF]/20 to-[#C661E3]/20 p-4 lg:p-8 backdrop-blur-md border border-[#CFFB2D]/20"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-[#cffb2d] font-['Orbitron']"
        >
          Current Event
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-4"
        >
          <TextScramble
            className="text-xl font-['Share_Tech_Mono'] text-[#CFFB2D]"
            trigger={true}
            speed={0.05}
            characterSet="01"
          >
            Business Idea Presentation
          </TextScramble>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4"
          >
            <Link 
              href="/events"
              className="inline-block w-full rounded-lg bg-[#cffb2d] px-6 py-3 text-center text-base font-bold text-black transition-all hover:bg-[#dffb4d] font-['Orbitron']"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
