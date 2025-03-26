"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CollaboratorSelect from "@/components/CollaboratorSelect";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    progress: "0",
    start_date: "",
    end_date: "",
    team: [] as { id: string; name: string; role: string }[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        toast.error("Please sign in to create a project");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("dashboard_projects")
        .insert({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          progress: Number(formData.progress),
          start_date: formData.start_date,
          end_date: formData.end_date,
          team: formData.team.map(member => member.id),
          user_id: session.user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Project created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
        >
          <h1 className="text-3xl font-bold text-[#CFFB2D] mb-2">Create New Project</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CyberInput
              label="Project Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
            />
            <CyberInput
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              required
            />
            <CyberInput
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(value) => setFormData({ ...formData, end_date: value })}
            />
            <CyberInput
              label="Progress (%)"
              type="number"
              value={formData.progress}
              onChange={(value) => setFormData({ ...formData, progress: value })}
              min="0"
              max="100"
            />
            <label className="text-sm text-[#CFFB2D]">Team Members</label>
            <CollaboratorSelect
              onSelect={(collaborators) => setFormData({ ...formData, team: collaborators })}
              currentCollaborators={formData.team}
            />
            <CyberButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </CyberButton>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
