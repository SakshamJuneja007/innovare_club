"use client";

import Navbar from "@/components/Navbar";
import SketchAnimation from "@/components/SketchAnimation";
import HeroSection from "@/components/HeroSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import LoadingScreen from "@/components/LoadingScreen";
import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";

export default function HomePage() {
  return (
    <main className="relative min-h-screen pt-20">
      <SketchAnimation />
      <Navbar />
      <div className="flex min-h-screen flex-col px-4 lg:px-24 space-y-12 lg:space-y-24">
        <HeroSection />
        <AnnouncementsSection />
      </div>
    </main>
  );
}
