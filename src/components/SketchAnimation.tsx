"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import { motion } from "framer-motion";

export default function SketchAnimation() {
  const annotationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (annotationRef.current) {
      const annotation = annotate(annotationRef.current, {
        type: "underline",
        color: "#cffb2d",
        strokeWidth: 2,
        padding: 2,
        animationDuration: 1500,
      });
      annotation.show();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-8 right-8 z-10"
    >
      <div
        ref={annotationRef}
        className="font-['Share_Tech_Mono'] text-lg text-[#cffb2d]"
      >
        SYSTEM INITIALIZED
      </div>
    </motion.div>
  );
}
