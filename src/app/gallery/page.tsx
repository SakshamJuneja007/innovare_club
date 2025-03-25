"use client";

import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";

const categories = ["All", "Techathon 2023", "Techfest 2023", "Hackathon 2024", "2022"] as const;
type Category = (typeof categories)[number];

const galleryImages = [
  { src: "https://i.ibb.co/KjTNgt8L/Whats-App-Image-2025-03-24-at-2-55-51-PM.jpga", alt: "Techathon 2023 Opening Ceremony", categories: ["Techathon 2023"] },
  { src: "https://i.ibb.co/9m3HWGhm/Whats-App-Image-2025-03-23-at-6-34-31-PM.jpg", alt: "Techathon 2023 Project Showcase", categories: ["Techathon 2023"] },
  { src: "https://i.ibb.co/Z6KG837g/Whats-App-Image-2025-03-24-at-2-55-47-PM.jpg", alt: "Techfest 2023 Keynote", categories: ["Techfest 2023"] },
  { src: "https://i.ibb.co/vxTJBQJw/Whats-App-Image-2025-03-24-at-2-55-43-PM.jpg", alt: "Techfest 2023 Workshop", categories: ["Techfest 2023"] },
  { src: "https://i.ibb.co/0j18d8VK/Whats-App-Image-2025-03-24-at-2-55-46-PM-1.jpg", alt: "Hackathon 2024 Team Collaboration", categories: ["Hackathon 2024"] },
  { src: "https://i.ibb.co/23rGJmQm/Whats-App-Image-2025-03-24-at-2-55-42-PM.jpg", alt: "Hackathon 2024 Winners", categories: ["Hackathon 2024"] },
  { src: "https://i.ibb.co/8nVMdyZh/Whats-App-Image-2025-03-24-at-2-55-44-PM-1.jpg", alt: "Hackathon 2024 Team Collaboration", categories: ["Hackathon 2024"] },
  { src: "https://i.ibb.co/TqD4rh8R/Whats-App-Image-2025-03-24-at-2-55-46-PM.jpg", alt: "Hackathon 20243 Winners", categories: ["Techfest 2023"] },
];

function ParallaxImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? 100 : -100]);

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[250px] sm:h-[400px] overflow-hidden rounded-3xl border-2 border-[#CFFB2D]/20 
      transition-transform duration-500 hover:scale-105 hover:border-[#CFFB2D]/40 hover:shadow-[0_0_30px_rgba(207,251,45,0.3)]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <motion.div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ y, scale: 1.1 }}>
        <Image src={src} alt={alt} fill className="object-cover transition-transform duration-700 hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" quality={75} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="font-['Orbitron'] text-2xl font-bold text-white mb-2">{alt}</h3>
      </div>
    </motion.div>
  );
}

function CategoryButton({ category, selected, onClick }: { category: Category; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl font-['Orbitron'] text-sm transition-all ${
        selected ? "bg-[#CFFB2D] text-black" : "bg-black/30 text-[#CFFB2D] border border-[#CFFB2D]/20"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {category}
    </motion.button>
  );
}

function GalleryGrid({ selectedCategory }: { selectedCategory: Category }) {
  const filteredImages = useMemo(
    () => galleryImages.filter(image => selectedCategory === "All" || image.categories.includes(selectedCategory)),
    [selectedCategory]
  );

  return (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 px-4 lg:px-0" layout>
      {filteredImages.map((image, index) => (
        <ParallaxImage key={image.src} {...image} index={index} />
      ))}
    </motion.div>
  );
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const handleCategoryChange = useCallback((category: Category) => setSelectedCategory(category), []);

  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar />
      <div className="mx-auto max-w-[1400px] px-8 py-12">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold text-[#cffb2d] font-['Orbitron'] mb-16 text-center">
          Innovation Gallery
        </motion.h1>

        {/* Category Selector */}
        <motion.div className="mb-8 flex flex-wrap justify-center gap-4 px-4">
          {categories.map(category => (
            <CategoryButton key={category} category={category} selected={selectedCategory === category} onClick={() => handleCategoryChange(category)} />
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <GalleryGrid selectedCategory={selectedCategory} />
      </div>
    </main>
  );
}
