"use client";

import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import Announcement from "./Announcement";

export default function AnnouncementsSection() {

  return (
    <motion.section
      className="mb-12 lg:mb-24 min-h-screen px-4 lg:px-0"
    >
      <TextScramble
        className="mb-8 font-['Orbitron'] text-2xl lg:text-3xl font-bold text-[#CFFB2D] text-center lg:text-left"
        trigger={true}
        speed={0.04}
      >
        Club Announcements
      </TextScramble>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Announcement
            title="New Partnership Announcement"
            content="We're excited to announce our new partnership with TechCorp, bringing more opportunities for our members!"
            date="2 hours ago"
            type="success"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Announcement
            title="Membership Applications Open"
            content="Applications for new club members are now open. Don't miss your chance to join our community!"
            date="1 day ago"
            type="info"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Announcement
            title="Workshop Registration Deadline"
            content="Last day to register for the upcoming AI Workshop Series. Limited seats available!"
            date="2 days ago"
            type="warning"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
