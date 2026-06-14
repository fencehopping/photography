import { createClient } from '@supabase/supabase-js';

export const ADMIN_EMAIL = 'nickholroyd@gmail.com';
export const PHOTO_BUCKET = 'portfolio-images';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export function isAdminEmail(email: string | undefined | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}
