import { createClient } from "npm:@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") ?? "https://focalforgestudios.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "Sign in required" }, 401);
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const moderationKey = Deno.env.get("OPENAI_MODERATION_API_KEY");
  const safeBrowsingKey = Deno.env.get("GOOGLE_SAFE_BROWSING_API_KEY");
  if (!url || !anon || !moderationKey || !safeBrowsingKey) return json({ error: "Content safety checks are not configured. Sending is temporarily unavailable." }, 503);
  const client = createClient(url, anon, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return json({ error: "Valid sign-in required" }, 401);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  if (body.kind === "image") {
    const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
    if (dataUrl.length > 12_000_000) return json({ error: "Image exceeds the 8 MB moderation limit." }, 413);
    if (!/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(dataUrl)) return json({ error: "Unsupported or invalid image format." }, 400);
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/moderations", { method: "POST", headers: { Authorization: `Bearer ${moderationKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "omni-moderation-latest", input: [{ type: "image_url", image_url: { url: dataUrl } }] }), signal: AbortSignal.timeout(15000) });
    } catch { return json({ error: "Image screening is unavailable. Try again later." }, 503); }
    if (!response.ok) return json({ error: "Image screening failed. The image was not sent." }, 503);
    const moderation = (await response.json())?.results?.[0];
    if (!moderation || moderation.flagged === true) return json({ allowed: false, reason: "This image does not meet IATS CONNECT content rules." }, 422);
    return json({ allowed: true });
  }

  if (body.kind === "text") {
    const text = typeof body.text === "string" ? body.text : "";
    if (!text.trim() || text.length > 5000) return json({ error: "Invalid message text." }, 400);
    const rawUrls = [...new Set(text.match(/(?:https?:\/\/|www\.)[^\s<>"']+/gi) ?? [])];
    if (!rawUrls.length) return json({ allowed: true });
    const urls: string[] = [];
    for (const raw of rawUrls) {
      let parsed: URL;
      try { parsed = new URL(raw.startsWith("www.") ? `https://${raw}` : raw); } catch { return json({ allowed: false, reason: "A link could not be verified." }, 422); }
      if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) return json({ allowed: false, reason: "This link format is not allowed." }, 422);
      urls.push(parsed.toString());
    }
    let response: Response;
    try {
      response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(safeBrowsingKey)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client: { clientId: "iats-connect", clientVersion: "1.0" }, threatInfo: { threatTypes: ["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE","POTENTIALLY_HARMFUL_APPLICATION"], platformTypes: ["ANY_PLATFORM"], threatEntryTypes: ["URL"], threatEntries: urls.map(url => ({ url })) } }), signal: AbortSignal.timeout(10000) });
    } catch { return json({ error: "Link verification is unavailable. Messages containing links are blocked for now." }, 503); }
    if (!response.ok) return json({ error: "Link verification failed. Messages containing links are blocked for now." }, 503);
    const result = await response.json();
    if (Array.isArray(result?.matches) && result.matches.length) return json({ allowed: false, reason: "This link is known to be unsafe." }, 422);
    // Safe Browsing is not an adult-domain classifier; require an explicit IATS allowlist.
    const allowlist = (Deno.env.get("LINK_ALLOWLIST") ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const allowed = urls.every(value => { const host = new URL(value).hostname.toLowerCase(); return allowlist.some(domain => host === domain || host.endsWith("." + domain)); });
    if (!allowed) return json({ allowed: false, reason: "This link is not on IATS CONNECT's verified-link allowlist." }, 422);
    return json({ allowed: true });
  }
  return json({ error: "Unsupported content type." }, 400);
});
