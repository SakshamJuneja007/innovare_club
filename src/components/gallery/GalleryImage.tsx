"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LazyImage from "@/components/ui/LazyImage";

interface GalleryImageProps {
  src: string;
  alt: string;
  index: number;
}

export default function GalleryImage({ src, alt, index }: GalleryImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, index % 2 === 0 ? 100 : -100]
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[250px] sm:h-[400px] overflow-hidden rounded-3xl border-2 border-[#CFFB2D]/20 
        transform transition-all duration-500 hover:scale-105 hover:border-[#CFFB2D]/40 
        hover:shadow-[0_0_30px_rgba(207,251,45,0.3)]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <motion.div 
        className="absolute inset-0 transform transition-all duration-700 ease-out"
        style={{ y, scale: 1.1 }}
      >
        <LazyImage
          src={src}
          alt={alt}
          fill
          className="object-cover transform transition-all duration-700 hover:scale-110"
          sizes="33vw"
          quality={40}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="font-['Orbitron'] text-2xl font-bold text-white mb-2">
          {alt}
        </h3>
      </div>
    </motion.div>
  );
}
