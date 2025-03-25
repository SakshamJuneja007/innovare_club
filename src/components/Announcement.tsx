"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { TextScramble } from "@/components/ui/text-scramble";

interface AnnouncementProps {
  title: string;
  content: string;
  date: string;
  type: "info" | "warning" | "success";
}

export default function Announcement({
  title,
  content,
  date,
  type,
}: AnnouncementProps) {
  const typeStyles = {
    info: "border-blue-500/20 bg-blue-500/10",
    warning: "border-yellow-500/20 bg-yellow-500/10",
    success: "border-[#CFFB2D]/20 bg-gradient-to-r from-[#8B30FF]/10 to-[#C661E3]/10",
  };

  return (
    <motion.div 
      className={`rounded-xl border p-4 lg:p-6 backdrop-blur-sm ${typeStyles[type]}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-[#cffb2d]/20 p-2">
          <Bell className="h-5 w-5 text-[#cffb2d]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <TextScramble
              className="font-['Orbitron'] text-lg font-bold text-[#CFFB2D]"
              trigger={true}
              speed={0.05}
            >
              {title}
            </TextScramble>
            <span className="font-['Share_Tech_Mono'] text-sm text-gray-400">
              {date}
            </span>
          </div>
          <p className="mt-2 font-['Share_Tech_Mono'] text-gray-300">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
