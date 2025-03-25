"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Profile from "@/components/auth/Profile";
import FileManager from "@/components/auth/FileManager";
import { TextScramble } from "@/components/ui/text-scramble";
import UserActivity from "@/components/auth/UserActivity";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      }
    };
    
    checkAuth();
  }, [router]);
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
            User Profile
          </TextScramble>
        </motion.div>
        <div className="space-y-12">
          <Profile />
          <UserActivity />
          <FileManager />
        </div>
      </div>
    </main>
  );
}
