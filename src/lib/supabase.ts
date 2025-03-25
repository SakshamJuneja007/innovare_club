import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fpbbbkqderuyquobuzje.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYmJia3FkZXJ1eXF1b2J1emplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDI1OTEsImV4cCI6MjA1ODQxODU5MX0.lFnWBveSZGzy_vkpA-dMtJya7HWYVbTsUkK_53TSph8'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For development purposes only
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found. Using development fallback.')
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type File = Database['public']['Tables']['files']['Row']
