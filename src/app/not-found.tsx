"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TextScramble } from "@/components/ui/text-scramble";
import { Home, RefreshCcw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black">
      <div className="relative max-w-2xl w-full">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#CFFB2D]/20 to-[#8B30FF]/20 rounded-xl"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            filter: ["blur(8px)", "blur(12px)", "blur(8px)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="relative rounded-xl border border-[#CFFB2D]/20 bg-black/60 p-8 backdrop-blur-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <motion.div
            animate={{
              x: [-2, 2, -2],
              filter: [
                "hue-rotate(0deg)",
                "hue-rotate(90deg)",
                "hue-rotate(0deg)",
              ],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <TextScramble
              className="font-['Orbitron'] text-4xl font-bold text-[#CFFB2D] mb-6"
              trigger={true}
              speed={0.03}
            >
              404 - PAGE NOT FOUND
            </TextScramble>
          </motion.div>

          <div className="space-y-4">
            <div className="font-['Share_Tech_Mono'] text-[#C661E3] text-sm">
              Error Code: 404_PAGE_NOT_FOUND
            </div>
            <div className="font-['Share_Tech_Mono'] text-gray-400 mb-8">
              The requested page could not be located in the system.
            </div>
            
            <div className="flex gap-4">
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 rounded-lg bg-[#CFFB2D] px-6 py-3 font-['Orbitron'] text-black transition-all hover:bg-[#8B30FF] hover:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="h-5 w-5" />
                  RETURN HOME
                </motion.button>
              </Link>
              <motion.button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 rounded-lg bg-black/30 px-6 py-3 font-['Orbitron'] text-[#CFFB2D] border border-[#CFFB2D]/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCcw className="h-5 w-5" />
                RETRY
              </motion.button>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: [
                "0 0 0px rgba(207, 251, 45, 0)",
                "0 0 20px rgba(207, 251, 45, 0.3)",
                "0 0 0px rgba(207, 251, 45, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
