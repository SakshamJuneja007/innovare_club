"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const avatarOptions = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Avatar1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Avatar2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Avatar3",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Avatar4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Avatar5",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Avatar6",
];

export default function Profile({ user }) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const assignRandomAvatar = async () => {
      if (!user) return;

      // Check if user already has an avatar in the database
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url); // Use existing avatar
      } else {
        // Assign a random avatar
        const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

        // Update in the database
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: randomAvatar })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating avatar:", updateError.message);
        } else {
          setAvatarUrl(randomAvatar);
        }
      }
    };

    assignRandomAvatar();
  }, [user]);

  return (
    <div className="bg-black/40 p-6 rounded-lg border border-[#CFFB2D]/20">
      <h2 className="text-xl font-bold text-[#CFFB2D] mb-4">Profile</h2>
      <div className="flex items-center space-x-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border border-[#CFFB2D]" />
        ) : (
          <div className="w-20 h-20 rounded-full border border-[#CFFB2D] bg-gray-800 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        )}
        <p className="text-gray-300">{user.email}</p>
      </div>
    </div>
  );
}
