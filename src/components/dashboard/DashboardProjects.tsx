"use client";

import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Code2, GitBranch, Users } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  team: string[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Neural Network Integration",
    status: "In Progress",
    progress: 75,
    team: ["Sarah C.", "Mike T.", "Alex R."]
  },
  {
    id: "2",
    name: "Quantum Computing Research",
    status: "Planning",
    progress: 30,
    team: ["Dr. James", "Lisa K.", "Tom B."]
  },
  {
    id: "3",
    name: "Cybersecurity Framework",
    status: "Review",
    progress: 90,
    team: ["John D.", "Emma S.", "Chris P."]
  }
];

export default function DashboardProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('dashboard_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('dashboard_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_projects'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects(prev => [payload.new as Project, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects(prev => prev.map(project => 
              project.id === payload.new.id ? payload.new as Project : project
            ));
          } else if (payload.eventType === 'DELETE') {
            setProjects(prev => prev.filter(project => project.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="col-span-2 rounded-xl bg-black/40 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <h3 className="font-['Orbitron'] text-xl font-bold text-[#CFFB2D] mb-6">
        Active Projects
      </h3>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-black/30 p-4 border border-[#CFFB2D]/10"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(207,251,45,0.1) 0%, transparent 100%)",
                  "linear-gradient(45deg, transparent 0%, rgba(139,48,255,0.1) 100%)",
                  "linear-gradient(45deg, rgba(207,251,45,0.1) 0%, transparent 100%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
                  {project.name}
                </h4>
                <span className="font-['Share_Tech_Mono'] text-sm text-[#C661E3]">
                  {project.status}
                </span>
              </div>
              <div className="mb-4">
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#CFFB2D] to-[#8B30FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-1 text-right font-['Share_Tech_Mono'] text-sm text-gray-400">
                  {project.progress}%
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-['Share_Tech_Mono']">
                <div className="flex items-center gap-1 text-[#CFFB2D]">
                  <Users className="w-4 h-4" />
                  <span>{project.team.length}</span>
                </div>
                <div className="flex items-center gap-1 text-[#8B30FF]">
                  <GitBranch className="w-4 h-4" />
                  <span>4</span>
                </div>
                <div className="flex items-center gap-1 text-[#C661E3]">
                  <Code2 className="w-4 h-4" />
                  <span>23</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
