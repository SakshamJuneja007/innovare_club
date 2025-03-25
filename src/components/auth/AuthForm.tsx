"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Github, Mail } from 'lucide-react';
import { TextScramble } from '@/components/ui/text-scramble';

export default function AuthForm() {
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === 'sign_up') {
        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              username: email.split('@')[0]
            }
          }
        });
        
        if (error) throw error;
        
        if (user) {
          // Create profile for new user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                username: email.split('@')[0],
                full_name: '',
                created_at: new Date().toISOString()
              }
            ]);

          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast.error('Failed to create user profile');
            return;
          }
          
          toast.success('Account created! Please check your email to confirm your registration');
          setView('sign_in');
        }
      } else {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (session) {
          toast.success('Successfully signed in');
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-[#CFFB2D]/20 p-8">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(207,251,45,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(207,251,45,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative">
          <TextScramble
            className="text-2xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-2"
            trigger={true}
            speed={0.03}
          >
            {view === 'sign_in' ? 'Access Terminal' : 'Create Access Key'}
          </TextScramble>

          <p className="text-gray-400 font-['Share_Tech_Mono'] mb-8">
            {view === 'sign_in' 
              ? 'Initialize system connection' 
              : 'Register new terminal access'}
          </p>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
                IDENTIFICATION
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-[#CFFB2D]/20 rounded-lg 
                    text-white placeholder-gray-500 font-['Share_Tech_Mono']
                    focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]
                    transition-all duration-200"
                  placeholder="Enter access ID"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-[#CFFB2D]/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CFFB2D] font-['Share_Tech_Mono'] mb-2">
                ACCESS CODE
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-[#CFFB2D]/20 rounded-lg 
                  text-white placeholder-gray-500 font-['Share_Tech_Mono']
                  focus:outline-none focus:border-[#CFFB2D] focus:ring-1 focus:ring-[#CFFB2D]
                  transition-all duration-200"
                placeholder="Enter access code"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#CFFB2D] text-black font-['Orbitron'] font-bold rounded-lg
                hover:bg-[#8B30FF] hover:text-white transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#CFFB2D] to-[#8B30FF]"
                animate={{
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{ opacity: 0.5 }}
              />
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                  />
                  INITIALIZING...
                </span>
              ) : (
                <span className="relative z-10">
                  {view === 'sign_in' ? 'AUTHENTICATE' : 'INITIALIZE ACCESS'}
                </span>
              )}
            </motion.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#CFFB2D]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/40 text-gray-400 font-['Share_Tech_Mono']">
                  ALTERNATE ACCESS PROTOCOLS
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
              className="w-full py-3 bg-black/30 border border-[#CFFB2D]/20 rounded-lg
                text-[#CFFB2D] font-['Share_Tech_Mono']
                hover:bg-[#CFFB2D]/10 transition-all duration-300
                flex items-center justify-center gap-2
                relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              GitHub Authentication
            </motion.button>

            <p className="mt-6 text-center text-sm text-gray-400 font-['Share_Tech_Mono']">
              {view === 'sign_in' ? (
                <>
                  Request new access?{' '}
                  <button
                    type="button"
                    onClick={() => setView('sign_up')}
                    className="text-[#CFFB2D] hover:text-[#8B30FF] transition-colors"
                  >
                    Initialize Registration
                  </button>
                </>
              ) : (
                <>
                  Access key exists?{' '}
                  <button
                    type="button"
                    onClick={() => setView('sign_in')}
                    className="text-[#CFFB2D] hover:text-[#8B30FF] transition-colors"
                  >
                    Authentication Protocol
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        
      </div>
    </motion.div>
  );
}
