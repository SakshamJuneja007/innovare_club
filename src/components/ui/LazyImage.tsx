"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
}

export default function LazyImage({
  src,
  alt,
  className,
  sizes = "100vw",
  fill = false,
  quality = 75,
  priority = false,
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      }
    );

    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      {(isVisible || priority) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isLoading ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="relative h-full w-full"
        >
          <Image
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes}
            quality={quality}
            className={className}
            onLoadingComplete={() => setIsLoading(false)}
            loading={priority ? "eager" : "lazy"}
          />
        </motion.div>
      )}
      {isLoading && (isVisible || priority) && (
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/10 to-black/20" />
        </motion.div>
      )}
    </div>
  );
}
