"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import { toast } from "sonner";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to create a workspace");
        return;
      }

      const { error } = await supabase
        .from('workspaces')
        .insert({
          name,
          description,
          owner_id: session.user.id
        });

      if (error) throw error;

      toast.success("Workspace created successfully");
      onClose();
      setName("");
      setDescription("");
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error("Failed to create workspace");
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
            className="relative w-[95vw] md:w-full max-w-lg p-4 md:p-6 rounded-xl bg-black border border-[#CFFB2D]/20 mx-4 md:mx-0"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-6">
              Create New Workspace
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Workspace Name
                </label>
                <CyberInput
                  label="NAME"
                  type="text"
                  value={name}
                  onChange={(value) => setName(value)}
                  required
                  placeholder="Enter workspace name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter workspace description"
                  className="w-full px-4 py-2 bg-black/40 border border-[#CFFB2D]/20 rounded-lg
                    focus:outline-none focus:border-[#CFFB2D] text-white placeholder-gray-500
                    font-['Share_Tech_Mono']"
                  rows={4}
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
                  {loading ? "Creating..." : "Create Workspace"}
                </CyberButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
