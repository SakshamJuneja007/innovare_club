"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CyberButton from "@/components/CyberButton";
import { User, Shield, ShieldOff } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();

    const subscription = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(user =>
              user.id === payload.new.id ? { ...user, ...payload.new } : user
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at, is_admin');

      if (profilesError) throw profilesError;

      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      const combinedUsers = profiles.map(profile => ({
        ...profile,
        email: users.users.find(u => u.id === profile.id)?.email || ''
      }));

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to continue");
        return;
      }

      const { data, error } = await supabase.functions.invoke('manage-roles', {
        body: { 
          userId,
          role: !currentStatus ? 'admin' : 'member',
          permissions: !currentStatus ? {
            canCreateEvents: true,
            canEditEvents: true,
            canDeleteEvents: true,
            canManageUsers: true,
            canManageWorkspaces: true
          } : {}
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      toast.success(`Admin status ${!currentStatus ? 'granted' : 'revoked'}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update admin status");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading users...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/20"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-[#CFFB2D]/10">
                  <User className="w-5 h-5 text-[#CFFB2D]" />
                </div>
                <div>
                  <h3 className="font-['Orbitron'] text-lg text-[#CFFB2D]">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-400 font-['Share_Tech_Mono']">
                    {user.email}
                  </p>
                </div>
              </div>
              <CyberButton
                onClick={() => toggleAdminStatus(user.id, user.is_admin)}
              >
                {user.is_admin ? (
                  <>
                    <ShieldOff className="w-4 h-4 mr-2" />
                    Revoke Admin
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Make Admin
                  </>
                )}
              </CyberButton>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
