import { createClient } from 'npm:@supabase/supabase-js@2'

// Zmienne środowiskowe z uniwersalnymi nazwami (z fallbackiem do nazw Supabase)
export const config = {
  dbUrl: Deno.env.get('DATABASE_URL') || Deno.env.get('SUPABASE_URL') || '',
  dbServiceKey: Deno.env.get('DATABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  dbAnonKey: Deno.env.get('DATABASE_ANON_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '',
}

// Główny klient bazy/auth z uprawnieniami administratora
export const dbAdmin = createClient(config.dbUrl, config.dbServiceKey)

// Klient anonimowy (np. do operacji logowania/rejestracji)
export const dbPublic = createClient(config.dbUrl, config.dbAnonKey)