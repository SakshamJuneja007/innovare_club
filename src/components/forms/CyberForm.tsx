"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TextScramble } from "@/components/ui/text-scramble";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
}

interface CyberFormProps {
  title: string;
  description: string;
  fields: FormField[];
  tableName: "dashboard_projects" | "dashboard_events";
  onSuccess?: () => void;
}

export default function CyberForm({ 
  title, 
  description, 
  fields,
  tableName,
  onSuccess 
}: CyberFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to continue");
        return;
      }

      // Get user role and permissions
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const userRole = userProfile?.role ?? 'member';
      const permissions = {
        canCreateEvents: userRole === 'admin' || userRole === 'moderator',
        canEditEvents: userRole === 'admin' || userRole === 'moderator',
        canDeleteEvents: userRole === 'admin',
        canManageUsers: userRole === 'admin',
        canManageWorkspaces: userRole === 'admin' || userRole === 'moderator'
      };

      // Check permissions based on table
      if (tableName === 'dashboard_events' && !permissions.canCreateEvents) {
        toast.error("You don't have permission to create events");
        return;
      }

      // Validate required fields
      const missingFields = fields
        .filter(field => field.required && !formData[field.name])
        .map(field => field.label);

      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(", ")}`);
        return;
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert({
          ...formData,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          status: 'pending', // Add status for moderation
          created_by_role: userRole
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for moderators/admins
      if (tableName === 'dashboard_events') {
        await supabase.from('notifications').insert({
          type: 'event_created',
          content: `New event "${formData.title}" requires approval`,
          user_id: session.user.id,
          target_id: data.id,
          status: 'unread'
        });
      }

      toast.success("Successfully submitted for approval!");
      setFormData({});
      onSuccess?.();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(207,251,45,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative">
        <TextScramble
          className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-2"
          trigger={true}
          speed={0.03}
        >
          {title}
        </TextScramble>

        <p className="font-['Share_Tech_Mono'] text-gray-400 mb-8">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <CyberInput
              key={field.name}
              label={field.label}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.name] ?? ""}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  [field.name]: value
                }));
              }}
              min={field.min}
              max={field.max}
              required={field.required}
            />
          ))}

          <div className="pt-4">
            <CyberButton 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT"}
            </CyberButton>
          </div>
        </form>
      </div>

      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: [
            "0 0 0px rgba(207, 251, 45, 0)",
            "0 0 20px rgba(207, 251, 45, 0.3)",
            "0 0 0px rgba(207, 251, 45, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  );
}
