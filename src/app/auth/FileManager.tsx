"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FileManager({ user }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from("files")
        .select("id, file_name, file_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error loading files:", error);
        setError(error.message);
      } else {
        setFiles(data);
      }
    };

    fetchFiles();
  }, [user]);

  return (
    <div className="bg-black/40 p-6 rounded-lg border border-[#CFFB2D]/20">
      <h2 className="text-xl font-bold text-[#CFFB2D] mb-4">Your Files</h2>

      {error && <p className="text-red-500">{error}</p>}

      {files.length === 0 ? (
        <p className="text-gray-400">No files uploaded yet.</p>
      ) : (
        <ul className="text-gray-300">
          {files.map((file) => (
            <li key={file.id} className="mb-2">
              <a href={file.file_url} target="_blank" className="text-[#CFFB2D] hover:underline">
                {file.file_name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
