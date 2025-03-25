export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
      }
      files: {
        Row: {
          id: string
          created_at: string
          name: string
          size: number
          type: string
          url: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          size: number
          type: string
          url: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          size?: number
          type?: string
          url?: string
          user_id?: string
        }
      }
    }
  }
}
