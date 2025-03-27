"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import { TextScramble } from "@/components/ui/text-scramble";
import { Users, MapPin, Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#020617] pt-20">
      <Navbar />
      <div className="relative mx-auto max-w-[1400px] px-8 py-12">
        {/* Hero Section */}
        <div className="relative mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <TextScramble
              className="text-6xl font-bold text-[#CFFB2D] font-['Orbitron']"
              trigger={true}
              speed={0.03}
            >
              BUSINESS IDEATHON
            </TextScramble>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center font-['Share_Tech_Mono'] text-gray-400"
          >
            Present your startup ideas, solve real world challenges with innovation
          </motion.p>
          <div className="flex justify-center w-full">

          <CountdownTimer />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 font-['Share_Tech_Mono'] text-[#fff]"
            >
              <Users className="h-5 w-5 text-[#CFFB2D]" />
              <span>30+ Participants</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 font-['Share_Tech_Mono'] text-[#fff]"
            >
              <Calendar className="h-5 w-5 text-[#CFFB2D]" />
              <span>27 March 2025</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 font-['Share_Tech_Mono'] text-[#fff]"
            >
              <MapPin className="h-5 w- text-[#CFFB2D]" />
              <span>Vaish College of Engineering, Rohtak</span>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 rounded-full bg-[#CFFB2D] px-8 py-3 font-['Orbitron'] font-bold text-black transition-all hover:bg-[#8B30FF] hover:text-white"
          >
            Register Now
          </motion.button>
        </div>

        {/* Speakers Section */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center font-['Orbitron'] text-3xl font-bold text-[#CFFB2D]"
          >
            SPEAKERS
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {[
              {
                name: "Jane Doe",
                role: "CTO, TechNova",
                image: "https://i.ibb.co/9m3HWGhm/Whats-App-Image-2025-03-23-at-6-34-31-PM.jpg",
                topic: "Peran AI dalam transformasi bisnis global"
              },
              {
                name: "John Smith",
                role: "Lead Designer, UXNext",
                image: "https://i.ibb.co/9m3HWGhm/Whats-App-Image-2025-03-23-at-6-34-31-PM.jpg",
                topic: "Desain yang Mengutamakan Pengalaman Pengguna (UX)"
              },
              {
                name: "Emily Tan",
                role: "Founder, Innovate AI",
                image: "https://i.ibb.co/9m3HWGhm/Whats-App-Image-2025-03-23-at-6-34-31-PM.jpg",
                topic: "Strategi membangun startup teknologi dari nol hingga sukses"
              }
            ].map((speaker, index) => (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="group relative overflow-hidden rounded-xl bg-black/30 p-6 backdrop-blur-sm"
              >
                <div className="relative mb-6 h-32 sm:h-48 w-full overflow-hidden rounded-lg">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <h3 className="mb-1 font-['Orbitron'] text-xl font-bold text-[#CFFB2D]">
                  {speaker.name}
                </h3>
                <p className="mb-3 font-['Share_Tech_Mono'] text-sm text-[#8B30FF]">
                  {speaker.role}
                </p>
                <p className="font-['Share_Tech_Mono'] text-sm text-gray-400">
                  {speaker.topic}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center font-['Orbitron'] text-3xl font-bold text-[#CFFB2D]"
          >
            EVENTS TIMELINE
          </motion.h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#CFFB2D]/50 via-[#8B30FF]/50 to-[#CFFB2D]/50" />
            
            {/* Timeline Events */}
            <div className="space-y-24">
              {/* Past Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex justify-end"
              >
                <div className="w-[calc(50%-2rem)] pr-8">
                  <div className="rounded-xl bg-black/30 p-6 backdrop-blur-sm border border-[#CFFB2D]/20">
                    <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D]/70">Past Events</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="font-['Share_Tech_Mono'] text-[#8B30FF]">February 20, 2024</p>
                        <p className="font-['Share_Tech_Mono'] text-gray-400">Tech Innovation Summit</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CFFB2D]/70" />
              </motion.div>

              {/* Current Event */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex justify-start"
              >
                <div className="w-[calc(50%-2rem)] pl-8">
                  <div className="rounded-xl bg-black/30 p-5 backdrop-blur-sm border border-[#CFFB2D] shadow-[0_0_20px_rgba(207,251,45,0.3)]">
                    <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D]">Current Event</h3>
                    <div className="mt-4">
                      <p className="font-['Share_Tech_Mono'] text-[#CFFB2D]">March 27, 2025</p>
                      <p className="font-['Orbitron'] text-l pr-5 text-white mt-2">Business Idea Presentation</p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CFFB2D] shadow-[0_0_20px_rgba(207,251,45,0.5)]" />
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex justify-end"
              >
                <div className="w-[calc(50%-2rem)] pr-8">
                  <div className="rounded-xl bg-black/30 p-6 backdrop-blur-sm border border-[#CFFB2D]/20">
                    <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D]/70">Upcoming Events</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="font-['Share_Tech_Mono'] text-[#8B30FF]">April 15, 2025</p>
                        <p className="font-['Share_Tech_Mono'] text-gray-400">Advanced AI Workshop</p>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CFFB2D]/70" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


