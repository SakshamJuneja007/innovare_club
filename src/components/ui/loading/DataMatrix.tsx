"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DataMatrixProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export default function DataMatrix({ 
  rows = 8, 
  cols = 16,
  className = ""
}: DataMatrixProps) {
  const [matrix, setMatrix] = useState<string[][]>([]);

  useEffect(() => {
    const chars = "01";
    const newMatrix = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => 
        chars[Math.floor(Math.random() * chars.length)]
      )
    );
    setMatrix(newMatrix);
  }, [rows, cols]);

  return (
    <div className={`font-['Share_Tech_Mono'] text-xs leading-none ${className}`}>
      {matrix.map((row, i) => (
        <div key={i} className="flex justify-center">
          {row.map((char, j) => (
            <motion.span
              key={`${i}-${j}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.2, 1, 0.2],
                color: ["#CFFB2D", "#8B30FF", "#CFFB2D"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (i * cols + j) * 0.05,
              }}
              className="w-2"
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}
