"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import { toast } from "sonner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  workspaceId,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to create a task");
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .insert({
          ...formData,
          workspace_id: workspaceId,
          created_by: session.user.id
        });

      if (error) throw error;

      toast.success("Task created successfully");
      onClose();
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg p-6 rounded-xl bg-black border border-[#CFFB2D]/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-6">
              Create New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CyberInput
                label="TITLE"
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                required
                placeholder="Enter task title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Enter task description"
                  className="w-full px-4 py-2 bg-black/40 border border-[#CFFB2D]/20 rounded-lg
                    focus:outline-none focus:border-[#CFFB2D] text-white placeholder-gray-500
                    font-['Share_Tech_Mono']"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2 bg-black/40 border border-[#CFFB2D]/20 rounded-lg
                      focus:outline-none focus:border-[#CFFB2D] text-white
                      font-['Share_Tech_Mono']"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <CyberInput
                  label="DUE DATE"
                  type="date"
                  value={formData.due_date}
                  onChange={(value) => setFormData(prev => ({ ...prev, due_date: value }))}
                />
              </div>

              <div className="flex justify-end gap-4">
                <CyberButton
                  type="button"
                  onClick={onClose}
                  variant="secondary"
                >
                  Cancel
                </CyberButton>
                <CyberButton
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </CyberButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
