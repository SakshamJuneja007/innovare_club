"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserProject {
  id: string;
  name: string;
  status: string;
  role: string;
  joined_at: string;
}

export interface UserEvent {
  id: string;
  title: string;
  date: string;
  status: string;
  type: string;
}

export interface UserActivity {
  projects: UserProject[];
  events: UserEvent[];
}

export function useUserActivity() {
  const [activity, setActivity] = useState<UserActivity>({ projects: [], events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [projectsResponse, eventsResponse] = await Promise.all([
          supabase
            .from('user_projects')
            .select(`
              id,
              role,
              joined_at,
              project:dashboard_projects(id, name, status)
            `)
            .eq('user_id', session.user.id),
          supabase
            .from('user_events')
            .select(`
              id,
              status,
              event:dashboard_events(id, title, date, type)
            `)
            .eq('user_id', session.user.id)
        ]);

        if (projectsResponse.error) throw projectsResponse.error;
        if (eventsResponse.error) throw eventsResponse.error;

        const projects: UserProject[] = (projectsResponse.data ?? []).map((p: any) => ({
          id: p.project?.id || '',
          name: p.project?.name || '',
          status: p.project?.status || '',
          role: p.role || '',
          joined_at: p.joined_at || new Date().toISOString()
        }));

        const events: UserEvent[] = (eventsResponse.data ?? []).map((e: any) => ({
          id: e.event?.id || '',
          title: e.event?.title || '',
          date: e.event?.date || new Date().toISOString(), 
          status: e.status || '',
          type: e.event?.type || ''
        }));

        setActivity({ projects, events });
      } catch (error) {
        console.error('Error fetching activity:', error);
        toast.error('Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, loading };
}
