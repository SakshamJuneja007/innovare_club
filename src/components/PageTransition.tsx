"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }
        }}
        exit={{ 
          opacity: 0,
          y: -20,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }
        }}
        className="relative"
      >
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ 
            scaleY: 0,
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1]
            }
          }}
          exit={{ 
            scaleY: 1,
            originY: 1,
            transition: {
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1]
            }
          }}
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-[#CFFB2D]/10 mix-blend-overlay" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#CFFB2D]/20 to-[#8B30FF]/20"
              animate={{
                opacity: [0, 0.5, 0],
                x: ["-100%", "0%", "100%"],
                scale: [0.9, 1, 1.1],
              }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1]
              }}
            />
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                background: [
                  "radial-gradient(circle at center, rgba(207,251,45,0.3) 0%, transparent 70%)",
                  "radial-gradient(circle at center, rgba(139,48,255,0.3) 0%, transparent 70%)",
                ],
              }}
              transition={{
                duration: 1,
                ease: [0.76, 0, 0.24, 1]
              }}
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIE0gMCAwIEwgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIwNywgMjUxLCA0NSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }
          }}
          exit={{ 
            opacity: 0,
            scale: 0.96,
            transition: {
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
