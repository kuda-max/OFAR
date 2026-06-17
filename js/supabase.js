
// Supabase client configuration
// NOTE: This file contains the Supabase URL and anon/public key used by
// the client. Treat non-public keys as secrets; the anon key is intended
// for client-side use but consider moving sensitive operations to a server.

const SUPABASE_URL = "https://vkmvmbobvrgmbdcokhbm.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbXZtYm9idnJnbWJkY29raGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTIzODQsImV4cCI6MjA5NzE4ODM4NH0.PlMOjwCRPORoibUzaE9jn76Ak-m9PeU_srX5d63qkqw";


export const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);