import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

// Read credentials from localStorage if available, or fallback to environment variables
export const getSavedCredentials = (): { url: string; key: string } => {
  const url = localStorage.getItem('supabase_url') || (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const key = localStorage.getItem('supabase_anon_key') || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
  return { url, key };
};

export const saveCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', key);
    // Force reinitialization
    supabaseInstance = null;
    initSupabase();
  } else {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    supabaseInstance = null;
  }
};

export const initSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = getSavedCredentials();
  
  if (!url || !key) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};

export const getSupabase = (): SupabaseClient | null => {
  return initSupabase();
};

export const isSupabaseConfigured = (): boolean => {
  return initSupabase() !== null;
};
