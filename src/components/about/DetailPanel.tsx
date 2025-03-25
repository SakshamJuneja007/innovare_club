"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import { Section } from "@/types/about";

interface DetailPanelProps {
  section: Section | undefined;
  isVisible: boolean;
}

export default function DetailPanel({ section, isVisible }: DetailPanelProps) {
  if (!section || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-xl bg-black/30 p-8 backdrop-blur-xl border border-[#CFFB2D]/20 
        before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-br 
        before:from-[#8B30FF]/10 before:to-[#C661E3]/10 before:backdrop-blur-xl 
        overflow-hidden shadow-[0_8px_32px_0_rgba(139,48,255,0.1)]
        sticky top-32 h-[calc(100vh-8rem)]"
    >
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-[#8B30FF]/20 
        to-[#C661E3]/20 blur-xl opacity-50 -z-10" />
      <TextScramble
        className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D] mb-4"
        trigger={true}
        speed={0.03}
      >
        {section.title}
      </TextScramble>
      <div className="font-['Share_Tech_Mono'] text-gray-300">
        {section.id === "T" ? (
          <div className="grid grid-cols-3 gap-6">
            {section.team?.map((member) => (
              <div key={member.name} className="space-y-4">
                <div className="relative w-full h-48">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg border border-[#CFFB2D]/20 transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D]">
                  {member.name}
                </h3>
                <p className="text-[#C661E3] text-base">{member.role}</p>
              </div>
            ))}
          </div>
        ) : (
          section.longDesc
        )}
      </div>
    </motion.div>
  );
}
