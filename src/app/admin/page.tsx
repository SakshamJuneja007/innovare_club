"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TextScramble } from "@/components/ui/text-scramble";
import { toast } from "sonner";
import UserManagement from "@/components/admin/UserManagement";
import EventModeration from "@/components/admin/EventModeration";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminLogs from "@/components/admin/AdminLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Calendar, LineChart, History, Star } from "lucide-react";
import FeaturedEventManager from "@/components/admin/FeaturedEventManager";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/auth";
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (!profile?.is_admin) {
          window.location.href = "/";
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error("Failed to verify admin status");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-[#CFFB2D] font-['Share_Tech_Mono']">
          Verifying admin access...
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-[#CFFB2D]" />
            <TextScramble
              className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron']"
              trigger={true}
              speed={0.03}
            >
              Admin Dashboard
            </TextScramble>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 font-['Share_Tech_Mono']"
          >
            Manage users, moderate content, and monitor system analytics
          </motion.p>
        </motion.div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-[#CFFB2D] data-[state=active]:text-black"
            >
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex items-center gap-2 data-[state=active]:bg-[#CFFB2D] data-[state=active]:text-black"
            >
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="flex items-center gap-2 data-[state=active]:bg-[#CFFB2D] data-[state=active]:text-black"
            >
              <Star className="w-4 h-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#CFFB2D] data-[state=active]:text-black"
            >
              <LineChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="flex items-center gap-2 data-[state=active]:bg-[#CFFB2D] data-[state=active]:text-black"
            >
              <History className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            <TabsContent value="events">
              <EventModeration />
            </TabsContent>
            <TabsContent value="featured">
              <FeaturedEventManager />
            </TabsContent>
            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
            <TabsContent value="logs">
              <AdminLogs />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
