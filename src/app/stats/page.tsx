"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/stats/StatsCard";
import AchievementCard from "@/components/stats/AchievementCard";
import { Award, Users, Trophy, Target } from "lucide-react";

const memberStats = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 150 },
  { name: 'Mar', value: 180 },
  { name: 'Apr', value: 220 },
  { name: 'May', value: 270 },
  { name: 'Jun', value: 310 }
];

const eventStats = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 6 },
  { name: 'Mar', value: 5 },
  { name: 'Apr', value: 8 },
  { name: 'May', value: 7 },
  { name: 'Jun', value: 10 }
];

const achievements = [
  {
    title: "Best Tech Club Award",
    description: "Recognized as the top technical club in the region",
    date: "June 2024",
    icon: <Trophy className="h-6 w-6 text-[#CFFB2D]" />
  },
  {
    title: "Hackathon Champions",
    description: "First place in the National Collegiate Hackathon",
    date: "May 2024",
    icon: <Award className="h-6 w-6 text-[#CFFB2D]" />
  },
  {
    title: "Community Milestone",
    description: "Reached 300+ active members",
    date: "April 2024",
    icon: <Users className="h-6 w-6 text-[#CFFB2D]" />
  }
];

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar />
      <div className="mx-auto max-w-7xl px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-4xl font-bold text-[#CFFB2D] font-['Orbitron']"
        >
          Club Statistics
        </motion.h1>

        <div className="mb-12 grid grid-cols-2 gap-6">
          <StatsCard
            title="Active Members"
            value={310}
            change={15}
            data={memberStats}
            color="#CFFB2D"
          />
          <StatsCard
            title="Events Organized"
            value={40}
            change={25}
            data={eventStats}
            color="#C661E3"
          />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold text-[#CFFB2D] font-['Orbitron']"
        >
          Recent Achievements
        </motion.h2>

        <div className="grid grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <AchievementCard {...achievement} />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
