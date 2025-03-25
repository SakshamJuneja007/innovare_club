"use client";

import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { TextScramble } from "./text-scramble";
import { RefreshCcw } from "lucide-react";

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-8 bg-black/90"
    >
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
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
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
              SYSTEM ERROR DETECTED
            </TextScramble>
          </motion.div>

          <div className="space-y-4">
            <div className="font-['Share_Tech_Mono'] text-[#C661E3] text-sm">
              Error Code: {error.name}
            </div>
            <div className="font-['Share_Tech_Mono'] text-gray-400 mb-8">
              {error.message}
            </div>
            
            <motion.button
              onClick={resetErrorBoundary}
              className="flex items-center gap-2 rounded-lg bg-[#CFFB2D] px-6 py-3 font-['Orbitron'] text-black transition-all hover:bg-[#8B30FF] hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCcw className="h-5 w-5" />
              SYSTEM REBOOT
            </motion.button>
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
    </motion.div>
  );
}

export function CyberErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset any state that might have caused the error
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
