"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/auth/AuthForm";
import { TextScramble } from "@/components/ui/text-scramble";

export default function AuthPage() {
  return (
    <main>
      <Navbar />
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
            Authentication Required
          </TextScramble>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-400 font-['Share_Tech_Mono']"
          >
            Access the system by signing in or creating a new account
          </motion.p>
        </motion.div>
        <AuthForm />
      
    </main>
  );
}
