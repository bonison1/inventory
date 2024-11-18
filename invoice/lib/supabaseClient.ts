// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Get your Supabase URL and public anon key from your Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
