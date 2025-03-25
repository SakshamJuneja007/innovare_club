"use client";

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  created_at?: string;
}

interface EventStore {
  events: Event[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  rsvpToEvent: (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => Promise<void>;
  getRsvpStatus: (eventId: string) => Promise<string | null>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  loading: false,

  fetchEvents: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ events: data || [] });

      // Subscribe to real-time changes
      supabase
        .channel('events_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'events'
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              set(state => ({ events: [payload.new as Event, ...state.events] }));
            } else if (payload.eventType === 'UPDATE') {
              set(state => ({
                events: state.events.map(event =>
                  event.id === payload.new.id ? payload.new as Event : event
                )
              }));
            } else if (payload.eventType === 'DELETE') {
              set(state => ({
                events: state.events.filter(event => event.id !== payload.old.id)
              }));
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      set({ loading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ events: [data, ...state.events] }));
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  },

  updateEvent: async (id, event) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        events: state.events.map(e => e.id === id ? { ...e, ...data } : e)
      }));
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  },

  rsvpToEvent: async (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to RSVP');
        return;
      }

      const { error } = await supabase
        .from('rsvp_status')
        .upsert({
          event_id: eventId,
          user_id: session.user.id,
          status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('RSVP updated successfully');
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
      throw error;
    }
  },

  getRsvpStatus: async (eventId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('rsvp_status')
        .select('status')
        .eq('event_id', eventId)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data?.status || null;
    } catch (error) {
      console.error('Error fetching RSVP status:', error);
      return null;
    }
  }
}));
