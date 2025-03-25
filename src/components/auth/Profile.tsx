"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import type { ProfileFormData } from '@/types/profile';
import { motion } from 'framer-motion';
import CyberInput from '@/components/CyberInput';
import CyberButton from '@/components/CyberButton';
import { Upload, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface ExtendedProfile extends Profile {
  skills?: string[];
  social_links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  role?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    full_name: '',
    bio: '',
    role: '',
    skills: [],
    social_links: {}
  });

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        username: data.username ?? '',
        full_name: data.full_name ?? '',
        bio: data.bio ?? '',
        role: data.role ?? 'member',
        skills: data.skills ?? [],
        social_links: data.social_links ?? {},
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      setEditing(false);
      getProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
        });

      if (updateError) throw updateError;
      getProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <motion.div 
        className="p-8 rounded-xl bg-black/40 backdrop-blur-md border border-[#CFFB2D]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
      <div className="flex items-center gap-8 mb-8">
        <div className="relative w-32 h-32">
          <img
            src={profile?.avatar_url ?? 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-2 border-[#CFFB2D]/20"
          />
          <label className="absolute bottom-0 right-0 p-2 bg-[#CFFB2D] rounded-full cursor-pointer hover:bg-[#8B30FF] transition-colors">
            <Upload className="w-4 h-4 text-black" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </label>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron']">
            {profile?.full_name || 'Anonymous User'}
          </h2>
          <p className="text-[#C661E3] font-['Share_Tech_Mono']">
            @{profile?.username || 'username'}
          </p>
        </div>
      </div>

      {editing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CyberInput
              label="USERNAME"
              value={formData.username}
              onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
            />
            <CyberInput
              label="FULL NAME"
              value={formData.full_name ?? ''}
              onChange={(value) => setFormData(prev => ({ ...prev, full_name: value }))}
            />
          </div>
          
          <CyberInput
            label="BIO"
            value={formData.bio ?? ''}
            onChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
          />

          <div className="space-y-2">
            <label className="block text-sm text-[#CFFB2D]/70 font-['Share_Tech_Mono']">SKILLS</label>
            <div className="flex flex-wrap gap-2">
              {formData.skills?.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFFB2D]/10 border border-[#CFFB2D]/20"
                >
                  <span className="text-[#CFFB2D] font-['Share_Tech_Mono']">{skill}</span>
                  <button
                    onClick={() => {
                      const newSkills = formData.skills?.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, skills: newSkills }));
                    }}
                    className="text-[#CFFB2D]/50 hover:text-[#CFFB2D]"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add skill..."
                className="px-3 py-1 rounded-full bg-black/30 border border-[#CFFB2D]/20 text-[#CFFB2D] font-['Share_Tech_Mono'] focus:outline-none focus:border-[#CFFB2D]/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const value = input.value.trim();
                    if (value && !formData.skills?.includes(value)) {
                      setFormData(prev => ({
                        ...prev,
                        skills: [...(prev.skills ?? []), value]
                      }));
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <CyberInput
              label="GITHUB"
              value={formData.social_links?.github ?? ''}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                social_links: { ...(prev.social_links ?? {}), github: value }
              }))}
            />
            <CyberInput
              label="TWITTER"
              value={formData.social_links?.twitter ?? ''}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                social_links: { ...(prev.social_links ?? {}), twitter: value }
              }))}
            />
            <CyberInput
              label="LINKEDIN"
              value={formData.social_links?.linkedin ?? ''}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                social_links: { ...(prev.social_links ?? {}), linkedin: value }
              }))}
            />
            <CyberInput
              label="WEBSITE"
              value={formData.social_links?.website ?? ''}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                social_links: { ...(prev.social_links ?? {}), website: value }
              }))}
            />
          </div>

          <div className="flex gap-4">
            <CyberButton onClick={updateProfile}>
              Save Changes
            </CyberButton>
            <CyberButton variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </CyberButton>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-[#CFFB2D]/70 font-['Share_Tech_Mono'] mb-2">ROLE</h3>
              <p className="text-[#C661E3] font-['Share_Tech_Mono']">{profile?.role || 'Member'}</p>
            </div>
            <div>
              <h3 className="text-sm text-[#CFFB2D]/70 font-['Share_Tech_Mono'] mb-2">SKILLS</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-[#CFFB2D]/10 border border-[#CFFB2D]/20 text-[#CFFB2D] font-['Share_Tech_Mono']"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-[#CFFB2D]/70 font-['Share_Tech_Mono'] mb-2">BIO</h3>
            <p className="text-gray-300 font-['Share_Tech_Mono']">{profile?.bio || 'No bio yet'}</p>
          </div>

          <div>
            <h3 className="text-sm text-[#CFFB2D]/70 font-['Share_Tech_Mono'] mb-2">SOCIAL LINKS</h3>
            <div className="flex gap-4">
              {profile?.social_links?.github && (
                <a
                  href={profile.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CFFB2D] hover:text-[#C661E3] transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}
              {profile?.social_links?.twitter && (
                <a
                  href={profile.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CFFB2D] hover:text-[#C661E3] transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {profile?.social_links?.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CFFB2D] hover:text-[#C661E3] transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {profile?.social_links?.website && (
                <a
                  href={profile.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CFFB2D] hover:text-[#C661E3] transition-colors"
                >
                  <Globe className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          <CyberButton onClick={() => setEditing(true)}>
            Edit Profile
          </CyberButton>
        </div>
      )}
      </motion.div>
    </motion.div>
  );
}
