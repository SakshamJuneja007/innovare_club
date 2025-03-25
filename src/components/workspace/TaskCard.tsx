"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  created_by: string;
  due_date: string;
}

interface Profile {
  id: string;
  username: string;
}

interface TaskCardProps {
  task: Task;
  workspaceId: string;
}

export default function TaskCard({ task, workspaceId }: TaskCardProps) {
  const [assignees, setAssignees] = useState<Profile[]>([]);
  const [showAssignees, setShowAssignees] = useState(false);

  const fetchWorkspaceMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          user_id,
          profiles:profiles(id, username)
        `)
        .eq('workspace_id', workspaceId);

      if (error) throw error;
      setAssignees(data.map((member: any) => member.profiles));
    } catch (error) {
      console.error('Error fetching workspace members:', error);
      toast.error("Failed to load workspace members");
    }
  };

  const assignTask = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: userId })
        .eq('id', task.id);

      if (error) throw error;
      toast.success("Task assigned successfully");
      setShowAssignees(false);
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error("Failed to assign task");
    }
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative overflow-hidden rounded-lg bg-black/30 p-4 border border-[#CFFB2D]/10 cursor-grab active:cursor-grabbing"
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
            {task.title}
          </h4>
          <span className={`px-2 py-1 rounded-full text-xs font-['Share_Tech_Mono']
            ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'}`}
          >
            {task.priority}
          </span>
        </div>
        <p className="text-sm text-gray-400 font-['Share_Tech_Mono'] mb-4">
          {task.description}
        </p>
        <div className="flex items-center justify-between text-sm font-['Share_Tech_Mono']">
          <div className="flex items-center gap-2 text-[#CFFB2D]">
            <User className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <span>{task.assigned_to ? assignees.find(a => a.id === task.assigned_to)?.username || 'Loading...' : 'Unassigned'}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssignees(!showAssignees);
                  if (!showAssignees) {
                    fetchWorkspaceMembers();
                  }
                }}
                className="p-1 hover:bg-[#CFFB2D]/10 rounded-full"
              >
                <UserPlus className="w-4 h-4 text-[#CFFB2D]" />
              </button>
            </div>
            {showAssignees && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-black/90 border border-[#CFFB2D]/20 rounded-lg shadow-lg z-50"
              >
                <div className="py-2">
                  {assignees.map((assignee) => (
                    <button
                      key={assignee.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        assignTask(assignee.id);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#CFFB2D]/10 text-gray-300 font-['Share_Tech_Mono']"
                    >
                      {assignee.username}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          {task.due_date && (
            <div className="flex items-center gap-2 text-[#C661E3]">
              <Calendar className="w-4 h-4" />
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
