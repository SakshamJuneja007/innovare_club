"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, X, Bot } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import { toast } from "sonner";

interface Message {
  id: string;
  message: string;
  response: string;
  created_at: string;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('ai_chat_history')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error("Failed to load chat history");
      }
    };

    fetchChatHistory();

    const subscription = supabase
      .channel('ai_chat_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_chat_history'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to use the chat");
        return;
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: newMessage },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#CFFB2D] text-black shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-96 rounded-xl bg-black/90 border border-[#CFFB2D]/20 backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#CFFB2D]/20">
              <h3 className="text-lg font-bold text-[#CFFB2D] font-['Orbitron']">
                NEURAL LINK ASSISTANT
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] rounded-lg bg-[#CFFB2D]/10 p-3 border border-[#CFFB2D]/20">
                      <p className="text-white font-['Share_Tech_Mono']">
                        {message.message}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-lg bg-[#8B30FF]/10 p-3 border border-[#8B30FF]/20">
                      <p className="text-[#CFFB2D] font-['Share_Tech_Mono']">
                        {message.response}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <div className="text-[#CFFB2D] font-['Share_Tech_Mono']">
                    Processing neural input...
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#CFFB2D]/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter your query..."
                  className="flex-1 bg-black/30 border border-[#CFFB2D]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 font-['Share_Tech_Mono'] focus:outline-none focus:border-[#CFFB2D]"
                  disabled={isLoading}
                />
                <CyberButton type="submit" disabled={isLoading}>
                  <Send className="w-4 h-4" />
                </CyberButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
