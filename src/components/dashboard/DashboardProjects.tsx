"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CyberButton from "@/components/CyberButton";

export default function DashboardProjects({ onEdit }) {
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

  return (
    <div className="p-6 bg-black/40 border border-[#CFFB2D]/20 rounded-lg">
      <h3 className="text-xl text-[#CFFB2D] mb-4">Projects</h3>
      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 bg-black/30 border border-[#CFFB2D]/10 rounded-lg">
              <h4 className="text-lg text-[#CFFB2D]">{project.name}</h4>
              <p className="text-gray-400 text-sm">{project.description}</p>
              <p className="text-gray-400 text-sm">Progress: {project.progress}%</p>
              <p className="text-gray-400 text-sm">End Date: {project.end_date || "Not set"}</p>
              <CyberButton onClick={() => onEdit(project)}>Edit</CyberButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
