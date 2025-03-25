"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { TextScramble } from "@/components/ui/text-scramble";
import WorkspaceList from "@/components/workspace/WorkspaceList";
import WorkspaceView from "@/components/workspace/WorkspaceView";
import { toast } from "sonner";

export default function WorkspacePage() {
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);

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
            Collaborative Workspace
          </TextScramble>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-400 font-['Share_Tech_Mono']"
          >
            Manage projects and collaborate with your team in real-time
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-full lg:col-span-3">
            <WorkspaceList
              activeWorkspace={activeWorkspace}
              onWorkspaceSelect={setActiveWorkspace}
            />
          </div>
          <div className="col-span-9">
            <WorkspaceView workspaceId={activeWorkspace} />
          </div>
        </div>
      </div>
    </main>
  );
}
