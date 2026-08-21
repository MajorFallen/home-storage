import { User, SupabaseClient } from 'npm:@supabase/supabase-js@2'

export interface CustomUser {
  id: string
  email: string
  name: string
  role: string
}

export type Env = {
  Variables: {
    user: CustomUser
    supabase: SupabaseClient
  }
}