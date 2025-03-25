"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CyberButton from '@/components/CyberButton';
import { Calendar, Target, MapPin, Check } from 'lucide-react';
import { useUserActivity } from '@/hooks/useUserActivity';
import type { UserProject, UserEvent } from '@/hooks/useUserActivity';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ActivityItemProps {
  title: string;
  subtitle: string;
  metadata: {
    label: string;
    value: string;
  }[];
}

const ActivityItem = ({ title, subtitle, metadata }: ActivityItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/10"
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-['Orbitron'] text-[#CFFB2D]">{title}</h3>
      <span className="px-3 py-1 rounded-full bg-[#CFFB2D]/10 text-[#CFFB2D] text-sm font-['Share_Tech_Mono']">
        {subtitle}
      </span>
    </div>
    <div className="flex items-center gap-4 text-sm font-['Share_Tech_Mono'] text-gray-400">
      {metadata.map(({ label, value }, index) => (
        <span key={index}>{label}: {value}</span>
      ))}
    </div>
  </motion.div>
);

const ProjectList = ({ projects }: { projects: UserProject[] }) => (
  <div className="space-y-4">
    {projects.map((project) => (
      <ActivityItem
        key={project.id}
        title={project.name}
        subtitle={project.status}
        metadata={[
          { label: "Role", value: project.role },
          { label: "Joined", value: new Date(project.joined_at).toLocaleDateString() }
        ]}
      />
    ))}
    {projects.length === 0 && (
      <p className="text-center text-gray-400 font-['Share_Tech_Mono']">
        No project involvement yet
      </p>
    )}
  </div>
);

const RsvpList = () => {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('rsvp_status')
          .select(`
            status,
            created_at,
            dashboard_events (
              title,
              date,
              location
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRsvps(data || []);
      } catch (error) {
        console.error('Error fetching RSVPs:', error);
        toast.error('Failed to load RSVPs');
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 font-['Share_Tech_Mono']">
        Loading RSVPs...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rsvps.map((rsvp) => (
        <motion.div
          key={`${rsvp.dashboard_events.id}-${rsvp.status}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-lg bg-black/30 border border-[#CFFB2D]/10"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-['Orbitron'] text-[#CFFB2D]">
              {rsvp.dashboard_events.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-['Share_Tech_Mono'] ${
              rsvp.status === 'attending' ? 'bg-[#CFFB2D]/20 text-[#CFFB2D]' :
              rsvp.status === 'maybe' ? 'bg-[#8B30FF]/20 text-[#8B30FF]' :
              'bg-red-500/20 text-red-500'
            }`}>
              {rsvp.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-['Share_Tech_Mono'] text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(rsvp.dashboard_events.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{rsvp.dashboard_events.location}</span>
            </div>
          </div>
        </motion.div>
      ))}
      {rsvps.length === 0 && (
        <p className="text-center text-gray-400 font-['Share_Tech_Mono']">
          No RSVPs found
        </p>
      )}
    </div>
  );
};

const EventList = ({ events }: { events: UserEvent[] }) => (
  <div className="space-y-4">
    {events.map((event) => (
      <ActivityItem
        key={event.id}
        title={event.title}
        subtitle={event.type}
        metadata={[
          { label: "Date", value: new Date(event.date).toLocaleDateString() },
          { label: "Status", value: event.status }
        ]}
      />
    ))}
    {events.length === 0 && (
      <p className="text-center text-gray-400 font-['Share_Tech_Mono']">
        No event participation yet
      </p>
    )}
  </div>
);

export default function UserActivity() {
  const [activeTab, setActiveTab] = useState<'projects' | 'events' | 'rsvps'>('projects');
  const { activity } = useUserActivity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl bg-black/40 p-8 backdrop-blur-md border border-[#CFFB2D]/20"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron']">Activity</h2>
        <div className="flex gap-4">
          <CyberButton
            variant={activeTab === 'projects' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('projects')}
          >
            <Target className="w-4 h-4 mr-2" />
            Projects
          </CyberButton>
          <CyberButton
            variant={activeTab === 'events' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('events')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </CyberButton>
          <CyberButton
            variant={activeTab === 'rsvps' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('rsvps')}
          >
            <Check className="w-4 h-4 mr-2" />
            RSVPs
          </CyberButton>
        </div>
      </div>

      {activeTab === 'projects' ? (
        <ProjectList projects={activity.projects} />
      ) : activeTab === 'events' ? (
        <EventList events={activity.events} />
      ) : activeTab === 'rsvps' ? (
        <RsvpList />
      ) : null}
    </motion.div>
  );
}
