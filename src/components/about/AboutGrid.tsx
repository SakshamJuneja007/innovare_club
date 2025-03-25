"use client";

import { motion } from "framer-motion";
import { Section } from "@/types/about";
import AboutCard from "./AboutCard";

interface AboutGridProps {
  sections: Section[];
  hoveredSection: string | null;
  onHover: (id: string | null) => void;
}

export default function AboutGrid({ sections, hoveredSection, onHover }: AboutGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {sections.map((section) => (
        <AboutCard
          key={section.id}
          id={section.id}
          title={section.title}
          shortDesc={section.shortDesc}
          icon={section.icon}
          isHovered={hoveredSection === section.id}
          onHover={onHover}
        />
      ))}
    </div>
  );
}
