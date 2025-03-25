"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CollaboratorSelect({ onSelect, currentCollaborators }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name");
      if (error) console.error("Error fetching users:", error);
      else setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <select
      multiple
      className="w-full p-2 bg-gray-800 text-white border border-[#CFFB2D]/20 rounded"
      onChange={(e) =>
        onSelect([...e.target.selectedOptions].map(option => ({ id: option.value, name: option.textContent })))
      }
    >
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.full_name}
        </option>
      ))}
    </select>
  );
}
