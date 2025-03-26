"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Profile from "@/components/auth/Profile";
import FileManager from "@/components/auth/FileManager";
import { TextScramble } from "@/components/ui/text-scramble";
import UserActivity from "@/components/auth/UserActivity";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#CFFB2D]">
        Loading...
      </div>
    );
  }

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
          <Profile user={user} />
          <UserActivity user={user} />
          <FileManager user={user} />
        </div>
      </div>
    </main>
  );
}
