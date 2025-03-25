"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardProjects from "@/components/dashboard/DashboardProjects";
import DashboardEvents from "@/components/dashboard/DashboardEvents";
import { TextScramble } from "@/components/ui/text-scramble";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <TextScramble
            className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron']"
            trigger={true}
            speed={0.03}
          >
            Command Center
          </TextScramble>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-400 font-['Share_Tech_Mono']"
          >
            Real-time system monitoring and analytics
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DashboardStats />
          <DashboardProjects />
          <DashboardEvents />
        </div>
      </div>
    </main>
  );
}
