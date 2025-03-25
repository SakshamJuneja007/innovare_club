"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X, UserPlus } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import { toast } from "sonner";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

interface Member {
  id: string;
  username: string;
  role: string;
  joined_at: string;
}

export default function MembersModal({
  isOpen,
  onClose,
  workspaceId,
}: MembersModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('workspace_members')
          .select(`
            user_id,
            role,
            joined_at,
            profiles:profiles!user_id(username)
          `)
          .eq('workspace_id', workspaceId);

        if (error) throw error;

        setMembers(data.map(member => ({
          id: member.user_id,
          username: member.profiles?.[0]?.username || 'Unknown User',
          role: member.role || 'member',
          joined_at: member.joined_at || new Date().toISOString()
        })));
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [isOpen, workspaceId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      // In a real app, you would send an invitation email here
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error("Failed to send invitation");
    } finally {
      setInviting(false);
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
              Workspace Members
            </h2>

            <div className="mb-8">
              <form onSubmit={handleInvite} className="flex gap-4">
                <div className="flex-1">
                  <CyberInput
                    label="EMAIL"
                    type="email"
                    value={inviteEmail}
                    onChange={setInviteEmail}
                    placeholder="Enter email to invite"
                    required
                  />
                </div>
                <CyberButton
                  type="submit"
                  disabled={inviting}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {inviting ? "Inviting..." : "Invite"}
                </CyberButton>
              </form>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-['Orbitron'] text-[#CFFB2D]">
                        {member.username}
                      </h3>
                      <p className="text-sm font-['Share_Tech_Mono'] text-gray-400">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#CFFB2D]/10 text-[#CFFB2D] text-sm font-['Share_Tech_Mono']">
                      {member.role}
                    </span>
                  </div>
                </motion.div>
              ))}

              {!loading && members.length === 0 && (
                <p className="text-center text-gray-400 font-['Share_Tech_Mono']">
                  No members found
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
