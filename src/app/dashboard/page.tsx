"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardProjects from "@/components/dashboard/DashboardProjects";
import DashboardEvents from "@/components/dashboard/DashboardEvents";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CyberButton from "@/components/CyberButton";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
      } else {
        setUserRole(data.role);
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .neq("role", "admin"); // Exclude admins

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUserRole();
    fetchUsers();
  }, []);

  const grantAdminAccess = async () => {
    if (!selectedUser) return toast.error("Select a user first");

    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", selectedUser);

    if (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to grant admin access");
    } else {
      toast.success("User granted admin access!");
      setShowAdminForm(false);
      setUsers(users.filter(user => user.id !== selectedUser)); // Remove from dropdown
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron']">
            Command Center
          </h1>
          <p className="mt-4 text-gray-400 font-['Share_Tech_Mono']">
            Real-time system monitoring and analytics
          </p>
        </motion.div>

        {/* Admin Controls */}
        {userRole === "admin" && (
          <div className="flex justify-center gap-4 mb-6">
            <CyberButton onClick={() => router.push("/dashboard/new-event")}>
              + Add Event
            </CyberButton>
            <CyberButton onClick={() => setShowAdminForm(true)}>
              👑 Grant Admin Access
            </CyberButton>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DashboardStats />
          <DashboardProjects />
          <DashboardEvents />
        </div>
      </div>

      {/* Grant Admin Form */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-6 bg-gray-900 border border-[#CFFB2D]/20 rounded-lg w-96">
            <h2 className="text-xl text-[#CFFB2D] mb-4">Grant Admin Access</h2>
            <select
              className="w-full px-4 py-2 bg-black/30 border border-[#CFFB2D]/20 text-white"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.role})
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end gap-4">
              <CyberButton onClick={() => setShowAdminForm(false)}>
                Cancel
              </CyberButton>
              <CyberButton onClick={grantAdminAccess}>Grant</CyberButton>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
