"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import AboutGrid from "./AboutGrid";
import DetailPanel from "./DetailPanel";
import { Section } from "@/types/about";

interface AboutContentProps {
  sections: Section[];
}

export default function AboutContent({ sections }: AboutContentProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const currentSection = useMemo(() => 
    sections.find(s => s.id === hoveredSection), 
    [hoveredSection, sections]
  );

  return (
    <div className="grid grid-cols-[600px_1fr] gap-12 h-[800px]">
      <AboutGrid
        sections={sections}
        hoveredSection={hoveredSection}
        onHover={setHoveredSection}
      />
      <AnimatePresence mode="wait">
        {hoveredSection && (
          <DetailPanel
            section={currentSection}
            isVisible={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
