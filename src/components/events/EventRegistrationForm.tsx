"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";

interface RegistrationFormData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

export default function EventRegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    phone: "",
    organization: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email) {
        throw new Error("Name and email are required");
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      // Store registration in localStorage
      const registrations = JSON.parse(localStorage.getItem("eventRegistrations") ?? "[]");
      registrations.push({
        ...formData,
        registeredAt: new Date().toISOString(),
        eventId: "current-event" // You can make this dynamic based on the event
      });
      localStorage.setItem("eventRegistrations", JSON.stringify(registrations));

      // Show success message
      toast.success("Registration successful! We'll contact you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: ""
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 space-y-6 rounded-2xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 text-center font-['Orbitron'] text-2xl font-bold text-[#cffb2d]"
      >
        Register for Event
      </motion.h2>

      <CyberInput
        label="NAME"
        placeholder="Enter your name"
        value={formData.name}
        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
        required
      />

      <CyberInput
        label="EMAIL"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        required
      />

      <CyberInput
        label="PHONE"
        type="tel"
        placeholder="Enter your phone number (optional)"
        value={formData.phone ?? ""}
        onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
      />

      <CyberInput
        label="ORGANIZATION"
        placeholder="Enter your organization (optional)"
        value={formData.organization ?? ""}
        onChange={(value) => setFormData(prev => ({ ...prev, organization: value }))}
      />

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

      <div className="mt-8 space-y-4">
        <CyberButton 
          type="submit"
          disabled={loading}
        >
          {loading ? "PROCESSING..." : "SUBMIT REGISTRATION"}
        </CyberButton>
        <CyberButton 
          type="button"
          variant="secondary"
          onClick={() => setFormData({
            name: "",
            email: "",
            phone: "",
            organization: ""
          })}
          disabled={loading}
        >
          CLEAR FORM
        </CyberButton>
      </div>
    </motion.form>
  );
}
