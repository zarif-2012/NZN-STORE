
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://oixodlssscugtxjhvjwn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_A5M49r9RGewyspjbYuTaxg_vpX1khyC";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

console.log("NZN MART Supabase client initialized");
