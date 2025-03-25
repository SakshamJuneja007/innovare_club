"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";

export default function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dashboard_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects.");
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("dashboard_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Project deleted successfully!");
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#CFFB2D] mb-6">Your Projects</h1>
      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects found.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="p-6 bg-black/40 border border-[#CFFB2D]/20 rounded-lg">
              <h3 className="text-xl text-[#CFFB2D]">{project.name}</h3>
              <p className="text-gray-400">{project.description}</p>
              <p className="text-gray-400">Progress: {project.progress}%</p>
              <p className="text-gray-400">End Date: {project.end_date || "Not set"}</p>
              <div className="mt-4 flex gap-4">
                <CyberButton onClick={() => router.push(`/dashboard/edit-project?id=${project.id}`)}>
                  Edit
                </CyberButton>
                <CyberButton variant="danger" onClick={() => handleDelete(project.id)}>
                  Delete
                </CyberButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";

export default function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dashboard_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects.");
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("dashboard_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Project deleted successfully!");
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#CFFB2D] mb-6">Your Projects</h1>
      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects found.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="p-6 bg-black/40 border border-[#CFFB2D]/20 rounded-lg">
              <h3 className="text-xl text-[#CFFB2D]">{project.name}</h3>
              <p className="text-gray-400">{project.description}</p>
              <p className="text-gray-400">Progress: {project.progress}%</p>
              <p className="text-gray-400">End Date: {project.end_date || "Not set"}</p>
              <div className="mt-4 flex gap-4">
                <CyberButton onClick={() => router.push(`/dashboard/edit-project?id=${project.id}`)}>
                  Edit
                </CyberButton>
                <CyberButton variant="danger" onClick={() => handleDelete(project.id)}>
                  Delete
                </CyberButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
