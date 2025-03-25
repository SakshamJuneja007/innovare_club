"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PreviewCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function MenuPreviewCard({
  title,
  description,
  imageUrl,
}: PreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="absolute left-1/2 top-[calc(100%+0.5rem)] w-64 -translate-x-1/2 overflow-hidden rounded-xl bg-[#CCCCCC]/90 p-4 shadow-lg backdrop-blur-sm hidden sm:block"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="256px"
        />
      </div>
      <h3 className="mt-3 font-medium text-black">{title}</h3>
      <p className="mt-1 text-sm text-black/70">{description}</p>
    </motion.div>
  );
}
