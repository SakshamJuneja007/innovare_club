"use client";

import { motion } from "framer-motion";
import FeaturedEvent from "./FeaturedEvent";
import { useRef } from "react";

export default function FeaturedEventsSection() {
  return (
    <motion.section 
      className="min-h-screen py-24"
    >
      <h2 className="mb-8 font-['Orbitron'] text-3xl font-bold text-[#cffb2d]">
        Featured Events
      </h2>
      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <FeaturedEvent
            title="AI Workshop Series"
            date="April 15, 2025"
            description="Join us for an intensive workshop on artificial intelligence and machine learning fundamentals."
            imageUrl="https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
            href="/events"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <FeaturedEvent
            title="Hackathon 2025"
            date="May 1-3, 2025"
            description="48 hours of coding, innovation, and exciting challenges with amazing prizes."
            imageUrl="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
            href="/events"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <FeaturedEvent
            title="Tech Expo"
            date="June 10, 2025"
            description="Showcase your projects and network with industry professionals."
            imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
            href="/events"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
