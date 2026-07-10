import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : "https://placeholder.supabase.co";
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseAnonKey = rawKey && rawKey !== "YOUR_SUPABASE_ANON_KEY" ? rawKey : "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
