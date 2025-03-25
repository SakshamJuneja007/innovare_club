"use client";

import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const categories = ["All", "Techathon 2023", "Techfest 2023", "Hackathon 2024", "2022"] as const;
type Category = (typeof categories)[number];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    alt: "Techathon 2023 Opening Ceremony",
    categories: ["Techathon 2023"]
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
    alt: "Techathon 2023 Project Showcase",
    categories: ["Techathon 2023"]
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    alt: "Techfest 2023 Keynote",
    categories: ["Techfest 2023"]
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    alt: "Techfest 2023 Workshop",
    categories: ["Techfest 2023"]
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    alt: "Hackathon 2024 Team Collaboration",
    categories: ["Hackathon 2024"]
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    alt: "Hackathon 2024 Winners",
    categories: ["Hackathon 2024"]
  }
];

import GalleryImage from "@/components/gallery/GalleryImage";
import { useImagePreloader } from "@/hooks/useImagePreloader";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const { isLoading } = useImagePreloader(galleryImages);

  return (
    <main className="min-h-screen bg-black pt-20 overflow-x-hidden">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-[#CFFB2D] font-['Orbitron'] text-2xl"
          >
            Loading Gallery...
          </motion.div>
        </div>
      )}
      <Navbar />
      <div className="container mx-auto px-8 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-[#cffb2d] font-['Orbitron'] mb-16 text-center"
        >
          Innovation Gallery
        </motion.h1>
        <motion.div className="mb-8 flex flex-wrap justify-center gap-4 px-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-xl font-['Orbitron'] text-sm transition-all
                ${selectedCategory === category 
                  ? 'bg-[#CFFB2D] text-black' 
                  : 'bg-black/30 text-[#CFFB2D] border border-[#CFFB2D]/20'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 px-4 lg:px-0"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {galleryImages
            .filter(image => selectedCategory === "All" || image.categories.includes(selectedCategory))
            .map((image, index) => (
            <GalleryImage
              key={image.src}
              {...image}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
