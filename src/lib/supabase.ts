import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  
  return supabaseInstance;
}

export interface DbSurveyResponse {
  id?: string;
  created_at?: string;
  municipality: string;
  respondent_name?: string | null;
  suggested_actions?: string | null;
  communication: number;
  resources: number;
  knowledge: number;
  social_capital: number;
  competencies: number;
}
