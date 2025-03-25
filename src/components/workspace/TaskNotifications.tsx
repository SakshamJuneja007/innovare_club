"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Bell } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  task: {
    title: string;
  };
}

export default function TaskNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('task_notifications')
          .select(`
            *,
            task:tasks(title)
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error("Failed to load notifications");
      }
    };

    fetchNotifications();

    const subscription = supabase
      .channel('task_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_notifications'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.info("You have a new task notification");
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('task_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 hover:bg-[#CFFB2D]/10 rounded-full"
      >
        <Bell className="w-5 h-5 text-[#CFFB2D]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-[#C661E3] rounded-full text-xs flex items-center justify-center text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-black/90 border border-[#CFFB2D]/20 rounded-lg shadow-lg z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400 font-['Share_Tech_Mono']">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b border-[#CFFB2D]/10 cursor-pointer hover:bg-[#CFFB2D]/5 ${
                      !notification.read ? 'bg-[#CFFB2D]/10' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p className="text-[#CFFB2D] font-['Share_Tech_Mono'] mb-1">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-400 font-['Share_Tech_Mono']">
                      Task: {notification.task.title}
                    </p>
                    <p className="text-xs text-gray-500 font-['Share_Tech_Mono'] mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
