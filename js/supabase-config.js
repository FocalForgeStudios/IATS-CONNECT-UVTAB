/**
 * IATS CONNECT — Supabase Project Configuration
 * -----------------------------------------------------------------------
 * 1. Create a free project at https://supabase.com
 * 2. Go to Project Settings -> Data API / API, copy the "Project URL"
 *    and the "anon public" key (NOT the service_role key — that one
 *    must never be used in frontend code).
 * 3. Paste them below.
 * 4. Run supabase/schema.sql in the Supabase SQL Editor (see the file
 *    in the supabase/ folder of this project) to create all the
 *    tables, security policies, and rate limiting this app needs.
 * -----------------------------------------------------------------------
 * This file is intentionally the ONLY place credentials live, so the
 * rest of the app never hardcodes a project.
 */

export const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

if (typeof window !== "undefined") {
  window.IATS_SUPABASE_CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY };
}
