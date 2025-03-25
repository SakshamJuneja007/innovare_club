"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface FeaturedEventProps {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  href: string;
}

export default function FeaturedEvent({
  title,
  date,
  description,
  imageUrl,
  href,
}: FeaturedEventProps) {
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-md border border-[#cffb2d]/20"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="p-6">
        <p className="mb-2 font-['Share_Tech_Mono'] text-sm text-[#cffb2d]">{date}</p>
        <h3 className="mb-3 font-['Orbitron'] text-xl font-bold text-white">{title}</h3>
        <p className="mb-4 font-['Share_Tech_Mono'] text-gray-300">{description}</p>
        <Link 
          href={href}
          className="inline-block rounded-lg bg-[#cffb2d] px-4 py-2 font-['Orbitron'] text-sm font-bold text-black transition-colors hover:bg-[#dffb4d]"
        >
          Learn More
        </Link>
      </div>
    </motion.div>
  );
}
