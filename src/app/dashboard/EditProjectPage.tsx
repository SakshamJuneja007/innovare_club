"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";
import CollaboratorSelect from "@/components/CollaboratorSelect";

export default function EditProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    progress: "0",
    end_date: "",
    team: [] as { id: string; name: string; role: string }[],
  });

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dashboard_projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        toast.error("Project not found");
        router.push("/dashboard");
      } else {
        setFormData({
          name: data.name,
          description: data.description,
          status: data.status,
          progress: String(data.progress),
          end_date: data.end_date || "",
          team: data.team.map((id: string) => ({ id, name: "Fetching...", role: "Member" })),
        });

        const { data: users } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", data.team);

        setFormData((prev) => ({
          ...prev,
          team: prev.team.map((member) => ({
            ...member,
            name: users?.find((user) => user.id === member.id)?.full_name || "Unknown",
          })),
        }));
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        toast.error("Please sign in to edit this project");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("dashboard_projects")
        .update({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          progress: Number(formData.progress),
          end_date: formData.end_date,
          team: formData.team.map((member) => member.id),
        })
        .eq("id", projectId)
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast.success("Project updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-[#CFFB2D] mb-6">Edit Project</h1>
      <form onSubmit={handleUpdate}>
        <CyberInput label="Project Name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />
        <CyberInput label="End Date" type="date" value={formData.end_date} onChange={(value) => setFormData({ ...formData, end_date: value })} />
        <CyberButton type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Project"}
        </CyberButton>
      </form>
    </div>
  );
}
