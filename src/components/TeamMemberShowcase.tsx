"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { TextScramble } from "@/components/ui/text-scramble";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  skills: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. James Anderson",
    role: "Faculty Mentor",
    bio: "PhD in Computer Science with 15+ years of industry experience",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    skills: ["AI/ML", "Systems Architecture", "Research"]
  },
  {
    id: "2", 
    name: "Sarah Chen",
    role: "Technical Coordinator",
    bio: "Leading technical initiatives and project management",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    skills: ["Project Management", "Full Stack", "DevOps"]
  },
  {
    id: "3",
    name: "Michael Torres",
    role: "Events Coordinator",
    bio: "Organizing and managing club events and workshops",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    skills: ["Event Planning", "Community", "Marketing"]
  }
];

export default function TeamMemberShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const animate = () => {
      if (!containerRef.current) return;
      
      textRefs.current.forEach((ref, index) => {
        if (!ref) return;
        ref.style.backgroundImage = 'linear-gradient(45deg, #CFFB2D, #8B30FF)';
        ref.style.backgroundSize = '200% 200%';
        ref.style.backgroundClip = 'text';
        ref.style.webkitBackgroundClip = 'text';
        ref.style.color = 'transparent';
      });
    };

    animate();
  }, []);

  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardClick = (id: string) => {
    if (expandedMember === id) {
      // Collapse
      gsap.to(`#member-${id}-details`, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => setExpandedMember(null)
      });
    } else {
      // Expand
      setExpandedMember(id);
      gsap.fromTo(`#member-${id}-details`,
        { height: 0, opacity: 0 },
        { 
          height: "auto", 
          opacity: 1, 
          duration: 0.5,
          ease: "power3.out",
          onStart: () => {
            // Stagger reveal skills
            gsap.fromTo(`#member-${id}-details .skill-tag`,
              { opacity: 0, y: 20 },
              { 
                opacity: 1, 
                y: 0, 
                stagger: 0.1,
                duration: 0.4,
                ease: "back.out"
              }
            );
          }
        }
      );
    }
  };

  return (
    <div ref={containerRef} className="py-16">
      <motion.h2 
        className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Our Team
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            ref={el => {
              if (cardRefs.current) cardRefs.current[index] = el;
            }}
            className={`relative overflow-hidden rounded-xl backdrop-blur-xl border border-[#CFFB2D]/20 p-6
              before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-br 
              before:from-[#CFFB2D]/10 before:to-[#8B30FF]/10 before:backdrop-blur-xl
              shadow-[0_8px_32px_0_rgba(207,251,45,0.1)]
              cursor-pointer transition-all duration-300
              ${expandedMember === member.id ? 'scale-[1.02]' : ''}`}
            onClick={() => handleCardClick(member.id)}
          >
            <motion.div
              className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-[#CFFB2D]/20 to-[#8B30FF]/20"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                filter: ['blur(8px)', 'blur(12px)', 'blur(8px)'],
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{ zIndex: -1, backgroundSize: '200% 200%' }}
            />

            <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            <div 
              ref={(el: HTMLDivElement | null) => {
                if (textRefs.current) textRefs.current[index] = el;
              }}
              className="font-['Orbitron'] text-2xl font-bold mb-2"
            >
              {member.name}
            </div>

            <TextScramble
              className="font-['Share_Tech_Mono'] text-[#C661E3] mb-4"
              trigger={true}
              speed={0.03}
              scrambleOnHover={true}
            >
              {member.role}
            </TextScramble>

            <p className="font-['Share_Tech_Mono'] text-gray-300 mb-6">
              {member.bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + idx * 0.1 }}
                  className="rounded-full bg-[#8B30FF]/20 px-3 py-1 text-sm font-['Share_Tech_Mono'] text-[#CFFB2D]"
                >
                  {skill}
                </motion.span>
              ))}
              {/* Expandable Details Section */}
              <motion.div
                id={`member-${member.id}-details`}
                initial={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-[#CFFB2D]/20">
                  <h4 className="font-['Orbitron'] text-lg text-[#CFFB2D] mb-4">
                    About
                  </h4>
                  <p className="font-['Share_Tech_Mono'] text-gray-300 mb-6">
                    {member.bio}
                  </p>
                  
                  <h4 className="font-['Orbitron'] text-lg text-[#CFFB2D] mb-4">
                    Expertise
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Years of Experience", value: "8+" },
                      { label: "Projects Led", value: "25+" },
                      { label: "Publications", value: "12" },
                      { label: "Awards", value: "5" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-4">
                        <div className="font-['Share_Tech_Mono'] text-[#C661E3] text-sm">
                          {stat.label}
                        </div>
                        <div className="font-['Orbitron'] text-[#CFFB2D] text-xl mt-1">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-['Orbitron'] text-lg text-[#CFFB2D] mt-6 mb-4">
                    Skills & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AI/ML", "System Architecture", "Cloud Computing",
                      "Team Leadership", "Research", "Innovation Strategy"
                    ].map((skill, idx) => (
                      <motion.span
                        key={idx}
                        className="skill-tag rounded-full bg-[#8B30FF]/20 px-4 py-2 
                          text-sm font-['Share_Tech_Mono'] text-[#CFFB2D]"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
