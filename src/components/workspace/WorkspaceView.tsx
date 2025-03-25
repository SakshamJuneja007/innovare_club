"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Users, MessageSquare } from "lucide-react";
import TaskNotifications from "./TaskNotifications";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";
import TaskList from "./TaskList";
import CreateTaskModal from "./CreateTaskModal";
import MembersModal from "./MembersModal";
import WorkspaceChat from "./WorkspaceChat";

interface WorkspaceViewProps {
  workspaceId: string | null;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  owner_id: string;
}

export default function WorkspaceView({ workspaceId }: WorkspaceViewProps) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      try {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', workspaceId)
          .single();

        if (error) throw error;
        setWorkspace(data);
      } catch (error) {
        console.error('Error fetching workspace:', error);
        toast.error("Failed to load workspace");
      }
    };

    fetchWorkspace();

    // Subscribe to workspace changes
    const subscription = supabase
      .channel(`workspace:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspaces',
          filter: `id=eq.${workspaceId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setWorkspace(payload.new as Workspace);
          } else if (payload.eventType === 'DELETE') {
            setWorkspace(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [workspaceId]);

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-[600px] rounded-xl bg-black/40 border border-[#CFFB2D]/20">
        <p className="text-gray-400 font-['Share_Tech_Mono']">
          Select a workspace to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron']">
            {workspace?.name}
          </h2>
          <p className="text-gray-400 font-['Share_Tech_Mono'] mt-2">
            {workspace?.description}
          </p>
        </div>
        <div className="flex gap-4">
          <CyberButton
            onClick={() => setIsMembersModalOpen(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Members
          </CyberButton>
          <CyberButton
            onClick={() => setIsTaskModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </CyberButton>
          <div className="flex items-center gap-4">
            <TaskNotifications />
            <CyberButton
              onClick={() => setIsChatOpen(!isChatOpen)}
              variant={isChatOpen ? "primary" : "secondary"}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </CyberButton>
          </div>
        </div>
      </div>

      <TaskList workspaceId={workspaceId} />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        workspaceId={workspaceId}
      />

      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        workspaceId={workspaceId}
      />
      
      {workspaceId && (
        <WorkspaceChat
          workspaceId={workspaceId}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
