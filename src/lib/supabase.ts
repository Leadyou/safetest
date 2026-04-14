import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbSurveyResponse {
  id?: string;
  created_at?: string;
  communication: number;
  resources: number;
  knowledge: number;
  social_capital: number;
  competencies: number;
}
