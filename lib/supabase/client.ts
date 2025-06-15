import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

// Create a Supabase client with the anon key for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a Supabase client with the service role key for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Debug log to check if service key is available
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Key Available:', !!supabaseServiceKey);
  console.log('Service Key Length:', supabaseServiceKey?.length);
}