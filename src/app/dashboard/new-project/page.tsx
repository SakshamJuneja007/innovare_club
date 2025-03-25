"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { Target, GitBranch, Users, Calendar } from "lucide-react";
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
    team: [] as { id: string; name: string; role: string }[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to create a project");
        return;
      }

      // First create the project
      const { data: projectData, error: projectError } = await supabase
        .from('dashboard_projects')
        .insert({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          progress: parseInt(formData.progress || '0'),
          start_date: formData.start_date,
          end_date: formData.end_date,
          team: formData.team.map(member => member.id),
          user_id: session.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Then create team member associations if there are any team members
      if (formData.team.length > 0) {
        const teamInserts = formData.team.map(member => ({
          project_id: projectData.id,
          user_id: member.id,
          role: member.role,
          joined_at: new Date().toISOString()
        }));

        const { error: teamError } = await supabase
          .from('user_projects')
          .insert(teamInserts);

        if (teamError) throw teamError;

        // Create notifications for team members
        const notifications = formData.team.map(member => ({
          user_id: member.id,
          message: `You have been added to project: ${formData.name}`,
          type: 'project_assignment',
          project_id: projectData.id,
          created_at: new Date().toISOString()
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) throw notificationError;
      }

      toast.success("Project created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("Failed to create project");
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
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(207,251,45,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <div className="relative">
            <h1 className="text-3xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-2">
              Create New Project
            </h1>
            <p className="text-gray-400 font-['Share_Tech_Mono'] mb-8">
              Initialize a new project in the system matrix
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <CyberInput
                    label="PROJECT NAME"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    required
                    placeholder="Enter project designation"
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-32 px-4 py-3 rounded-lg bg-black/30 border border-[#CFFB2D]/20 
                        text-white placeholder-gray-500 font-['Share_Tech_Mono'] resize-none
                        focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]"
                      placeholder="Enter project details"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <CyberInput
                      label="START DATE"
                      type="date"
                      value={formData.start_date}
                      onChange={(value) => setFormData(prev => ({ ...prev, start_date: value }))}
                      required
                    />
                    <CyberInput
                      label="END DATE"
                      type="date"
                      value={formData.end_date}
                      onChange={(value) => setFormData(prev => ({ ...prev, end_date: value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
                      STATUS
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#CFFB2D]/20 
                        text-white font-['Share_Tech_Mono']
                        focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]"
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <CyberInput
                    label="PROGRESS"
                    type="number"
                    value={formData.progress}
                    onChange={(value) => setFormData(prev => ({ ...prev, progress: value }))}
                    required
                    min="0"
                    max="100"
                    placeholder="Project completion percentage"
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
                      TEAM MEMBERS
                    </label>
                    <CollaboratorSelect
                      onSelect={(collaborators) => setFormData(prev => ({ ...prev, team: collaborators }))}
                      currentCollaborators={formData.team}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <CyberButton
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </CyberButton>
                <CyberButton
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Project"}
                </CyberButton>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
