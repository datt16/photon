export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      scenes: {
        Row: {
          created_at: string | null
          name: string
          annotation_dataset: Json | null
          scene_file_url: string | null
          owner_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          name?: string
          annotation_dataset?: Json | null
          scene_file_url?: string | null
          owner_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          name?: string
          annotation_dataset?: Json | null
          scene_file_url?: string | null
          owner_id?: string | null
          id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
