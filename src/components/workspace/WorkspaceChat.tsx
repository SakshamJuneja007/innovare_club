"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, X } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles: {
    username: string;
  } | null;
}

interface WorkspaceChatProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceChat({ workspaceId, isOpen, onClose }: WorkspaceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('workspace_messages')
          .select(`
            id,
            content,
            sender_id,
            created_at,
            profiles!sender_id(username)
          `)
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data?.map(msg => ({
          ...msg,
          profiles: msg.profiles?.[0] || null
        })) || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`workspace_messages:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspace_messages',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [workspaceId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to send messages");
        return;
      }

      const { error } = await supabase
        .from('workspace_messages')
        .insert({
          workspace_id: workspaceId,
          content: newMessage,
          sender_id: session.user.id
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-96 rounded-xl bg-black/90 border border-[#CFFB2D]/20 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center justify-between p-4 border-b border-[#CFFB2D]/20">
            <h3 className="text-lg font-bold text-[#CFFB2D] font-['Orbitron']">
              Workspace Chat
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col space-y-1"
              >
                <span className="text-sm text-[#C661E3] font-['Share_Tech_Mono']">
                  {message.profiles?.username || 'Unknown User'}
                </span>
                <div className="bg-black/30 rounded-lg p-3 border border-[#CFFB2D]/10">
                  <p className="text-gray-300 font-['Share_Tech_Mono']">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#CFFB2D]/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/30 border border-[#CFFB2D]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 font-['Share_Tech_Mono'] focus:outline-none focus:border-[#CFFB2D]"
              />
              <CyberButton type="submit">
                <Send className="w-4 h-4" />
              </CyberButton>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
