"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { File } from '@/lib/supabase';
import { motion } from 'framer-motion';
import CyberButton from '@/components/CyberButton';
import { Upload, Download, Trash2 } from 'lucide-react';

export default function FileManager() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getFiles();
  }, []);

  async function getFiles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const filePath = `${user.id}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          user_id: user.id,
        });

      if (dbError) throw dbError;
      getFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  }

  async function downloadFile(file: File) {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(`${file.user_id}/${file.name}`);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  async function deleteFile(file: File) {
    try {
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([`${file.user_id}/${file.name}`]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;
      getFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 rounded-xl bg-black/40 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron']">
          File Manager
        </h2>
        <label className="cursor-pointer">
          <CyberButton>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </CyberButton>
          <input
            type="file"
            className="hidden"
            onChange={uploadFile}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/10"
          >
            <div>
              <h3 className="text-[#CFFB2D] font-['Share_Tech_Mono']">{file.name}</h3>
              <p className="text-sm text-gray-400 font-['Share_Tech_Mono']">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => downloadFile(file)}
                className="p-2 text-[#CFFB2D] hover:text-[#8B30FF] transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteFile(file)}
                className="p-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {files.length === 0 && (
          <p className="text-center text-gray-400 font-['Share_Tech_Mono']">
            No files uploaded yet
          </p>
        )}
      </div>
    </motion.div>
  );
}
