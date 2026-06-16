
const SUPABASE_URL = "https://vkmvmbobvrgmbdcokhbm.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbXZtYm9idnJnbWJkY29raGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTIzODQsImV4cCI6MjA5NzE4ODM4NH0.PlMOjwCRPORoibUzaE9jn76Ak-m9PeU_srX5d63qkqw";


export const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);