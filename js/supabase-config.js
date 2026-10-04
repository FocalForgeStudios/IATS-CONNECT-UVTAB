/** IATS CONNECT — Supabase Project Configuration */
export const SUPABASE_URL = "https://ojobzjornniyjrqszglk.supabase.co";

export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qb2J6am9ybm5peWpycXN6Z2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDMyOTEsImV4cCI6MjEwNjY3OTI5MX0.YYm7szj_qDQb-LrzyGA_fW0TqbUeD9JcQET404Ctl6g";

if (typeof window !== "undefined") {
  window.IATS_SUPABASE_CONFIG = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  };
}
