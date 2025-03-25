"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

interface Workspace {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface WorkspaceListProps {
  activeWorkspace: string | null;
  onWorkspaceSelect: (id: string) => void;
}

export default function WorkspaceList({
  activeWorkspace,
  onWorkspaceSelect,
}: WorkspaceListProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please sign in to view workspaces");
          return;
        }

        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setWorkspaces(data);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
        toast.error("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();

    // Subscribe to workspace changes
    const subscription = supabase
      .channel('workspace_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspaces'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setWorkspaces(prev => [payload.new as Workspace, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setWorkspaces(prev => prev.map(workspace =>
              workspace.id === payload.new.id ? payload.new as Workspace : workspace
            ));
          } else if (payload.eventType === 'DELETE') {
            setWorkspaces(prev => prev.filter(workspace => workspace.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#CFFB2D] font-['Orbitron']">
          Workspaces
        </h2>
        <CyberButton
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </CyberButton>
      </div>

      <div className="space-y-4">
        {workspaces.map((workspace) => (
          <motion.div
            key={workspace.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onWorkspaceSelect(workspace.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all
              ${activeWorkspace === workspace.id
                ? 'bg-[#CFFB2D]/20 border border-[#CFFB2D]'
                : 'bg-black/40 border border-[#CFFB2D]/20 hover:border-[#CFFB2D]/50'
              }`}
          >
            <h3 className="text-lg font-bold text-[#CFFB2D] font-['Orbitron'] mb-2">
              {workspace.name}
            </h3>
            <p className="text-sm text-gray-400 font-['Share_Tech_Mono']">
              {workspace.description}
            </p>
          </motion.div>
        ))}

        {workspaces.length === 0 && !loading && (
          <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
            No workspaces found. Create one to get started!
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
