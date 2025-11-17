import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://njsrlykklqqanqqcqklo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc3JseWtrbHFxYW5xcWNxa2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTM2OTcsImV4cCI6MjA3ODg4OTY5N30.A30trZhFsazi9nzsdaZxKEUNLyOCmRJ49KjjjlUN9rU';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For backward compatibility, export these as undefined to prevent errors during transition
export const db = null;
export const storage = null;
export const auth = null;
const legacyFirebaseCompat = null;
export default legacyFirebaseCompat;