/**
 * IATS CONNECT — Supabase Service Layer
 * -----------------------------------------------------------------------
 * Handles:
 *   - Real authentication (Google OAuth + real emailed 6-digit OTP codes)
 *   - Reading/writing all app data through Supabase Postgres
 *   - Live real-time updates via Supabase Realtime (Postgres CHANGES)
 *   - Lightweight client-side request throttling (the database itself
 *     enforces the real rate limits — see supabase/schema.sql — this is
 *     just a first line of defense so a double-click or key-repeat can't
 *     even reach the network).
 *
 * No local storage, no seeded/sample accounts, no fake sign-in. Every
 * user in the app is a row created by real Supabase Auth.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const DEFAULT_STUDENT_AVATAR = "./images/scholar_female.jpg";
const isConfigured =
  SUPABASE_URL && !SUPABASE_URL.includes("YOUR-PROJECT-REF") &&
  SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR-ANON-PUBLIC-KEY");

let supabase = null;
if (isConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: { eventsPerSecond: 5 }
    }
  });
} else {
  console.warn(
    "[IATS CONNECT] Supabase is not configured yet. Open js/supabase-config.js " +
    "and paste your Project URL + anon key, then run supabase/schema.sql in the SQL Editor."
  );
}

// -------------------------------------------------------------
// Sanitization / free-tier safeguards
// -------------------------------------------------------------
function sanitizeText(text, maxLen = 300) {
  if (typeof text !== "string") return "";
  return text.trim().slice(0, maxLen);
}

function sanitizeAvatar(url) {
  if (!url || typeof url !== "string") return null; // null = "use default", never forced
  if (url.startsWith("data:") && url.length > 25000) {
    console.warn("Avatar payload exceeded 20KB limit, ignoring — free tier storage guard.");
    return null;
  }
  return url.slice(0, 500);
}

// -------------------------------------------------------------
// Tiny client-side throttle (first line of defense; the database
// trigger `enforce_rate_limit()` is the real, unbypassable limiter)
// -------------------------------------------------------------
const lastActionAt = {};
function throttled(actionKey, minIntervalMs = 800) {
  const now = Date.now();
  const last = lastActionAt[actionKey] || 0;
  if (now - last < minIntervalMs) return false;
  lastActionAt[actionKey] = now;
  return true;
}

function friendlyError(e) {
  const msg = (e && e.message) || String(e);
  if (/rate limit/i.test(msg)) {
    return "You're doing that a little too fast. Please wait a few seconds and try again.";
  }
  return msg;
}

export const SupabaseService = {
  isReady() {
    return !!supabase;
  },
  client() {
    return supabase;
  },

  // ===========================================================
  // 1. Real Authentication (no sample/fake accounts, ever)
  // ===========================================================
  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  },

  onAuthStateChange(callback) {
    if (!supabase) return () => {};
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return () => data.subscription.unsubscribe();
  },

  /** Redirects to Google's real OAuth consent screen via Supabase Auth. */
  async signInWithGoogle() {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    if (!throttled("auth:google", 1500)) return { skipped: true };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw new Error(friendlyError(error));
    return { redirecting: true };
  },

  /**
   * Sends a REAL 6-digit code to the person's inbox via Supabase Auth
   * (configure the "Magic Link" / OTP email template in the Supabase
   * dashboard to show {{ .Token }} so the email contains the 6 digits).
   * No code is ever generated or shown client-side.
   */
  async requestEmailOtp(email) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    if (!throttled("auth:otp:" + email, 15000)) {
      throw new Error("Please wait a few seconds before requesting another code.");
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    if (error) throw new Error(friendlyError(error));
    return true;
  },

  /** Verifies the real code the person received by email. */
  async verifyEmailOtp(email, token) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) throw new Error(friendlyError(error));
    return data.session || null;
  },

  /** Sign in with an existing email/password account; no email is sent. */
  async signInWithPassword(email, password) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(friendlyError(error));
    return data;
  },

  async requestPasswordRecovery(email) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const cleanEmail = String(email || "").trim();
    if (!cleanEmail) throw new Error("Enter your account email address first.");
    if (!throttled("auth:password-recovery:" + cleanEmail.toLowerCase(), 15000)) throw new Error("Please wait a few seconds before requesting another recovery email.");
    const redirectUrl = new URL(window.location.href);
    redirectUrl.searchParams.set("password-recovery", "1"); redirectUrl.hash = "";
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: redirectUrl.toString() });
    if (error) throw new Error(friendlyError(error));
    return true;
  },

  async updatePassword(newPassword) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    if (typeof newPassword !== "string" || newPassword.length < 8) throw new Error("Use a password of at least 8 characters.");
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(friendlyError(error));
    return data.user;
  },

  /** Create an account; Supabase may still require email confirmation. */
  async signUpWithPassword(email, password) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw new Error(friendlyError(error));
    return data;
  },

  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  },

  async clearLocalSession() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  },

  // ===========================================================
  // Realtime presence: online only while an authenticated client is connected.
  async subscribePresence(onUpdate) {
    if (!supabase) return () => {};
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return () => {};
    const channel = supabase.channel("iats-global-presence", { config: { presence: { key: user.id } } });
    let heartbeat = null;
    const touchLastSeen = async () => {
      try { await supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", user.id); }
      catch (error) { console.warn("Last-seen update failed:", error); }
    };
    const publish = () => {
      const state = channel.presenceState();
      onUpdate(Object.keys(state));
    };
    channel.on("presence", { event: "sync" }, publish)
      .on("presence", { event: "join" }, publish)
      .on("presence", { event: "leave" }, publish)
      .subscribe(async status => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
          await touchLastSeen();
          heartbeat = setInterval(touchLastSeen, 30000);
          publish();
        }
      });
    const onVisible = () => { if (document.visibilityState === "visible") touchLastSeen(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { if (heartbeat) clearInterval(heartbeat); document.removeEventListener("visibilitychange", onVisible); touchLastSeen(); supabase.removeChannel(channel); };
  },

  // 2. Profiles (created on first sign-in, no photo required)
  // ===========================================================
  async refreshPeerLastSeen(userIds) {
    if (!supabase || !Array.isArray(userIds) || !userIds.length) return {};
    const { data, error } = await supabase.from("profiles").select("id,last_seen_at").in("id", userIds);
    if (error) throw new Error(friendlyError(error));
    return Object.fromEntries((data || []).map(p => [p.id, p.last_seen_at || null]));
  },

  async fetchProfile(userId) {
    if (!supabase || !userId) return null;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) {
      console.warn("fetchProfile failed:", error);
      return null;
    }
    return data;
  },

  async deleteOwnProfileData() {
    if (!supabase) throw new Error("Service unavailable.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Please sign in again.");
    const { error: matchError } = await supabase.from("match_profiles").delete().eq("owner_id", user.id);
    if (matchError) throw new Error(friendlyError(matchError));
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", user.id);
    if (profileError) throw new Error(friendlyError(profileError));
    return true;
  },

  /** Upload a member-selected profile image to their own Storage folder. */
  async uploadAvatar(file, userId) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) throw new Error("Sign in again before changing your photo.");
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG, or WebP image.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Your photo must be 5 MB or smaller.");
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = user.id + "/" + crypto.randomUUID() + "." + ext;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });
    if (error) throw new Error(friendlyError(error));
    return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  },
  /** Upload an event poster or video trailer to public event media storage. */
  async uploadEventMedia(file, userId) {
    if (!supabase || !file) throw new Error("Choose a poster image or video trailer first.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) throw new Error("Sign in again before uploading event media.");
    const allowed = new Set(["image/jpeg","image/png","image/webp","image/gif","video/mp4","video/webm","video/quicktime"]);
    if (!allowed.has(file.type)) throw new Error("Choose a JPG, PNG, WebP, GIF, MP4, WebM, or MOV file.");
    if (file.size > 50 * 1024 * 1024) throw new Error("The poster or video trailer must be 50 MB or smaller.");
    const extensionByType = {"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","video/mp4":"mp4","video/webm":"webm","video/quicktime":"mov"};
    const path = user.id + "/" + crypto.randomUUID() + "." + extensionByType[file.type];
    const { error } = await supabase.storage.from("event-media").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });
    if (error) throw new Error(friendlyError(error));
    return supabase.storage.from("event-media").getPublicUrl(path).data.publicUrl;
  },
  /** Creates the profile row on first login / updates it later. Avatar is always optional. */
  async saveUser(user) {
    if (!supabase || !user || !user.id) return null;
    try {
      // Only write the profile belonging to the currently authenticated account.
      // This blocks stale UI state during account switching from writing another
      // person's profile/photo onto this account.
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser || authUser.id !== user.id) {
        console.warn("saveUser blocked: requested profile does not belong to the signed-in account.");
        return null;
      }
      const { data: existingProfile, error: existingError } = await supabase
        .from("profiles").select("avatar_url").eq("id", authUser.id).maybeSingle();
      if (existingError) throw existingError;
      const incomingAvatar = sanitizeAvatar(user.avatar);
      const avatarForThisUser = incomingAvatar || existingProfile?.avatar_url || null;
      const payload = {
        id: user.id,
        name: sanitizeText(user.name, 80) || "IATS Scholar",
        email: sanitizeText(user.email, 100),
        university: "IATS",
        major: sanitizeText(user.major, 100) || "Undeclared",
        year: sanitizeText(user.year, 50) || "Class of 2026",
        bio: sanitizeText(user.bio, 500),
        courses: Array.isArray(user.courses) ? user.courses.map(c => sanitizeText(c, 30)) : [],
        interests: Array.isArray(user.interests) ? user.interests.map(i => sanitizeText(i, 30)) : [],
        avatar_url: avatarForThisUser, // Preserve this user's existing photo when an update omits it.
        location: sanitizeText(user.location, 80) || "IATS Main Campus",
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from("profiles").upsert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("saveUser failed:", e);
      return null;
    }
  },

  // ===========================================================
  // 3. Study-buddy directory (match_profiles)
  // ===========================================================
  subscribeMatchProfiles(onUpdate) {
    if (!supabase) return () => {};
    supabase.from("match_profiles").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data, error }) => { if (!error) onUpdate(data || []); });

    const channel = supabase.channel("public:match_profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "match_profiles" }, () => {
        supabase.from("match_profiles").select("*").order("created_at", { ascending: false }).limit(50)
          .then(({ data, error }) => { if (!error) onUpdate(data || []); });
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  async upsertMatchProfile(profile) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== profile.owner_id) throw new Error("Sign in again before saving your scholar profile.");
    const payload = { owner_id:user.id, name:sanitizeText(profile.name,80), major:sanitizeText(profile.major,150), year:sanitizeText(profile.cohort || profile.year,10), university:"IATS", compat_score:90, bio:sanitizeText(profile.bio,500), courses:Array.isArray(profile.courses)?profile.courses.slice(0,6):[], interests:Array.isArray(profile.interests)?profile.interests.slice(0,6):[], avatar_url:sanitizeAvatar(profile.avatar), location:sanitizeText(profile.location,80)||"IATS Main Campus", course_code:sanitizeText(profile.course_code,10), cohort:sanitizeText(profile.cohort || profile.year,10), is_former_student:!!profile.is_former_student };
    const { data, error } = await supabase.from("match_profiles").upsert(payload,{onConflict:"owner_id"}).select().single();
    if (error) throw new Error(friendlyError(error));
    return data;
  },

  async promoteCohort(fromCohort) {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data, error } = await supabase.rpc("admin_promote_cohort",{p_from_cohort:fromCohort});
    if (error) throw new Error(friendlyError(error));
    return data;
  },

  async addMatchProfile(profile) {
    if (!supabase) return null;
    if (!throttled("match_profiles:add", 1500)) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        owner_id: user ? user.id : null,
        name: sanitizeText(profile.name, 80),
        major: sanitizeText(profile.major, 100),
        year: sanitizeText(profile.year, 50),
        university: "IATS",
        compat_score: profile.compatScore || Math.floor(82 + Math.random() * 16),
        bio: sanitizeText(profile.bio, 500),
        courses: Array.isArray(profile.courses) ? profile.courses.slice(0, 6) : ["CS 201"],
        interests: Array.isArray(profile.interests) ? profile.interests.slice(0, 6) : ["Study"],
        avatar_url: sanitizeAvatar(profile.avatar),
        location: sanitizeText(profile.location, 80) || "IATS Main Campus"
      };
      const { data, error } = await supabase.from("match_profiles").insert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("addMatchProfile failed:", friendlyError(e));
      throw e;
    }
  },

  // ===========================================================
  // 4. Academic events / news (catchups)
  // ===========================================================
  async fetchAdminOverview() {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || String(user.email || "").toLowerCase() !== "focalforges@gmail.com") {
      throw new Error("Administrator access is required.");
    }
    const [students, events, eventRows] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).neq("email", "focalforges@gmail.com"),
      supabase.from("catchups").select("id", { count: "exact", head: true }),
      (async () => {
        const allRows = [];
        const pageSize = 500;
        for (let offset = 0; ; offset += pageSize) {
          const { data, error } = await supabase.from("catchups")
            .select("id,title,description,banner_url,host,host_avatar,host_id,location,event_time,event_starts_at,event_ends_at,tag,item_type,is_official,event_format,online_url,registration_deadline,attendees,max_attendees,attendee_ids,created_at")
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);
          if (error) throw new Error(friendlyError(error));
          allRows.push(...(data || []));
          if (!data || data.length < pageSize) break;
        }
        return allRows;
      })()
    ]);
    if (students.error) throw new Error(friendlyError(students.error));
    if (events.error) throw new Error(friendlyError(events.error));
    return { studentCount: students.count || 0, eventCount: events.count || 0, events: eventRows || [] };
  },

  subscribeCatchups(onUpdate) {
    if (!supabase) return () => {};
    supabase.from("catchups").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data, error }) => { if (!error) onUpdate(data || []); });

    const channel = supabase.channel("public:catchups")
      .on("postgres_changes", { event: "*", schema: "public", table: "catchups" }, () => {
        supabase.from("catchups").select("*").order("created_at", { ascending: false }).limit(50)
          .then(({ data, error }) => { if (!error) onUpdate(data || []); });
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  async addCatchup(catchup) {
    if (!supabase) return null;
    if (!throttled("catchups:add", 1500)) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        title: sanitizeText(catchup.title, 120),
        description: sanitizeText(catchup.description, 2000),
        banner_url: catchup.banner_url ? sanitizeText(catchup.banner_url, 1000) : null,
        host: sanitizeText(catchup.host, 80),
        host_avatar: sanitizeAvatar(catchup.hostAvatar),
        host_id: user ? user.id : null,
        location: sanitizeText(catchup.location, 100),
        event_time: sanitizeText(catchup.time, 100),
        event_starts_at: catchup.startsAt ? new Date(catchup.startsAt).toISOString() : null,
        event_ends_at: catchup.endsAt ? new Date(catchup.endsAt).toISOString() : null,
        tag: sanitizeText(catchup.tag, 40) || "Academic Event",
        item_type: catchup.item_type === "news" ? "news" : "event",
        is_official: Boolean(catchup.is_official),
        event_format: ["physical", "online", "hybrid"].includes(catchup.event_format) ? catchup.event_format : "physical",
        online_url: catchup.online_url ? sanitizeText(catchup.online_url, 500) : null,
        registration_deadline: catchup.registration_deadline || null,
        attendees: 0,
        max_attendees: catchup.item_type === "news" || catchup.maxAttendees == null || catchup.maxAttendees === "" ? null : Number(catchup.maxAttendees),
        attendee_ids: []
      };
      const { data, error } = await supabase.from("catchups").insert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("addCatchup failed:", friendlyError(e));
      throw e;
    }
  },

  async updateCatchup(catchupId, catchup) {
    if (!supabase || !catchupId) throw new Error("An event ID is required.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Please sign in to manage this event.");
    const isAdmin = String(user.email || "").toLowerCase() === "focalforges@gmail.com";
    const { data: existing, error: readError } = await supabase.from("catchups")
      .select("id,host_id,is_official,item_type,tag").eq("id", catchupId).maybeSingle();
    if (readError || !existing) throw new Error("The event could not be found. Refresh and try again.");
    const isOwner = String(existing.host_id || "") === String(user.id);
    const isNews = existing.item_type === "news" || String(existing.tag || "").toLowerCase().replace(/\\s+/g, "") === "campusnews";
    if (!isAdmin && (!isOwner || existing.is_official || isNews)) {
      throw new Error("You can only edit events that you host.");
    }
    const payload = {
      title: sanitizeText(catchup.title, 120),
      description: sanitizeText(catchup.description, 2000),
      banner_url: catchup.banner_url ? sanitizeText(catchup.banner_url, 1000) : null,
      location: sanitizeText(catchup.location, 100),
      event_time: sanitizeText(catchup.time, 100),
      event_starts_at: catchup.startsAt ? new Date(catchup.startsAt).toISOString() : null,
      event_ends_at: catchup.endsAt ? new Date(catchup.endsAt).toISOString() : null,
      tag: sanitizeText(catchup.tag, 40) || "Academic Event",
      item_type: isAdmin && catchup.item_type === "news" ? "news" : "event",
      is_official: isAdmin ? Boolean(catchup.is_official) : false,
      event_format: ["physical", "online", "hybrid"].includes(catchup.event_format) ? catchup.event_format : "physical",
      online_url: catchup.online_url ? sanitizeText(catchup.online_url, 500) : null,
      registration_deadline: catchup.registration_deadline || null,
      max_attendees: catchup.item_type === "news" || catchup.maxAttendees == null || catchup.maxAttendees === "" ? null : Number(catchup.maxAttendees)
    };
    const { data, error } = await supabase.from("catchups").update(payload).eq("id", catchupId).select().single();
    if (error) throw new Error(friendlyError(error));
    return data;
  },

  async deleteCatchup(catchupId) {
    if (!supabase || !catchupId) throw new Error("An event ID is required.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || String(user.email || "").toLowerCase() !== "focalforges@gmail.com") {
      throw new Error("Only the platform developer can moderate events.");
    }
    const { error } = await supabase.from("catchups").delete().eq("id", catchupId);
    if (error) throw new Error(friendlyError(error));
    return true;
  },

  async fetchCatchupById(catchupId) {
    if (!supabase || !catchupId) return null;
    const { data, error } = await supabase.from("catchups").select("*").eq("id", catchupId).maybeSingle();
    if (error) throw new Error(friendlyError(error));
    return data || null;
  },

  async toggleCatchupAttendance(catchupId, _userId, isJoining) {
    if (!supabase || !catchupId) return false;
    try {
      const { data, error } = await supabase.rpc("toggle_catchup_attendance", {
        p_catchup_id: catchupId,
        p_joining: !!isJoining
      });
      if (error) throw new Error(friendlyError(error));
      if (data !== true) throw new Error("Registration could not be confirmed. The event may be full.");
      return true;
    } catch (e) {
      throw new Error(friendlyError(e));
    }
  },

  // ===========================================================
  // 5. Faculty & Guild Hub discussions (hub_posts)
  // ===========================================================
  subscribeHubPosts(category, onUpdate) {
    if (!supabase) return () => {};
    const load = () => {
      let q = supabase.from("hub_posts").select("*").order("created_at", { ascending: false }).limit(50);
      q.then(({ data, error }) => {
        if (error) return;
        const list = (data || []).filter(p => !category || category === "all" || p.category === category);
        onUpdate(list);
      });
    };
    load();
    const channel = supabase.channel("public:hub_posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "hub_posts" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  async addHubPost(post) {
    if (!supabase) return null;
    if (!throttled("hub_posts:add", 1500)) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        category: post.category || "tech",
        author: sanitizeText(post.author, 80),
        author_role: sanitizeText(post.authorRole, 100),
        author_avatar: sanitizeAvatar(post.authorAvatar),
        author_id: user ? user.id : null,
        title: sanitizeText(post.title, 150),
        content: sanitizeText(post.content, 1200),
        upvotes: 1,
        upvoter_ids: user ? [user.id] : [],
        comments_count: 0,
        tags: Array.isArray(post.tags) ? post.tags.slice(0, 5).map(t => sanitizeText(t, 25)) : ["IATSConnect", "Course"]
      };
      const { data, error } = await supabase.from("hub_posts").insert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("addHubPost failed:", friendlyError(e));
      throw e;
    }
  },

  async togglePostUpvote(postId, _userId, isUpvoting) {
    if (!supabase || !postId) return false;
    try {
      const { data, error } = await supabase.rpc("toggle_hub_post_upvote", {
        p_post_id: postId,
        p_upvoting: !!isUpvoting
      });
      if (error) throw error;
      return data === true;
    } catch (e) {
      console.warn("togglePostUpvote failed:", friendlyError(e));
      return false;
    }
  },

  // ===========================================================
  // 6. Real-time, zero-delay direct messaging
  //    conversations = threads, messages = individual live rows
  // ===========================================================
  async subscribeConversations(onUpdate) {
    if (!supabase) return () => {};
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return () => {};

    const load = async () => {
      const { data, error } = await supabase.from("conversations").select("*")
        .or(`created_by.eq.${user.id},participant_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });
      if (error) return;
      const allConversations = data || [];
      const { data: hiddenRows } = await supabase.from("conversation_hides").select("conversation_id").eq("user_id", user.id);
      const hiddenIds = new Set((hiddenRows || []).map(row => row.conversation_id));
      const convs = allConversations.filter(c => !hiddenIds.has(c.id));
      const unreadCounts = await Promise.all(convs.map(async c => {
        const { count, error: countError } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("conversation_id", c.id).neq("sender_id", user.id).is("read_at", null).is("deleted_at", null);
        return [c.id, countError ? 0 : (count || 0)];
      }));
      const unreadByConversation = new Map(unreadCounts);
      const peerIds = [...new Set(convs.map(c => c.created_by === user.id ? c.participant_id : c.created_by).filter(Boolean))];
      let peers = [];
      if (peerIds.length) {
        const result = await supabase.from("profiles").select("id,name,avatar_url,last_seen_at,major").in("id", peerIds);
        if (!result.error) peers = result.data || [];
      }
      const byId = new Map(peers.map(p => [p.id, p]));
      onUpdate(convs.map(c => {
        const peerId = c.created_by === user.id ? c.participant_id : c.created_by;
        const peer = byId.get(peerId);
        return { ...c, peer_id: peerId, name: peer?.name || "IATS Scholar", avatar_url: peer?.avatar_url || null, peer_last_seen_at: peer?.last_seen_at || null, unread_count: unreadByConversation.get(c.id) || 0 };
      }));
    };
    load();

    const channel = supabase.channel("public:conversations:" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  async markConversationRead(conversationId) {
    if (!supabase || !conversationId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("conversation_id", conversationId).neq("sender_id", user.id).is("read_at", null);
    if (error) throw new Error(friendlyError(error));
  },

  async getUnreadNewsIds(newsIds = []) {
    if (!supabase || !newsIds.length) return [];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from("news_reads").select("catchup_id").eq("user_id", user.id).in("catchup_id", newsIds);
    if (error) throw new Error(friendlyError(error));
    const read = new Set((data || []).map(row => String(row.catchup_id)));
    return newsIds.filter(id => !read.has(String(id)));
  },

  async markNewsRead(newsId) {
    if (!supabase || !newsId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("news_reads").upsert({ user_id: user.id, catchup_id: newsId, read_at: new Date().toISOString() }, { onConflict: "user_id,catchup_id" });
    if (error) throw new Error(friendlyError(error));
  },

  /** Live, no-delay message stream for one open conversation thread. */
  subscribeMessages(conversationId, onUpdate) {
    if (!supabase || !conversationId) return () => {};
    const load = () => {
      (async () => {
        const { data, error } = await supabase.from("messages").select("*").eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }).limit(200);
        if (error) return;
        const messages = data || [];
        const senderIds = [...new Set(messages.map(m => m.sender_id).filter(Boolean))];
        let profiles = [];
        if (senderIds.length) {
          const result = await supabase.from("profiles").select("id,name").in("id", senderIds);
          if (!result.error) profiles = result.data || [];
        }
        const names = new Map(profiles.map(p => [p.id, p.name]));
        onUpdate(messages.map(m => ({ ...m, sender_name: names.get(m.sender_id) || "IATS Scholar" })));
      })();
    };
    load();

    const channel = supabase.channel("public:messages:" + conversationId)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "messages",
        filter: `conversation_id=eq.${conversationId}`
      }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  /**
   * Creates a new thread. If `recipientName` matches a real signed-up
   * scholar's display name, the thread is linked to their account so
   * they see it too and replies land instantly. Otherwise it starts
   * as your own private thread (handy for personal notes/drafts) until
   * a matching account exists.
   */
  async searchChatRecipients(query) {
    if (!supabase) throw new Error("Chat service is unavailable.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You need to sign in first.");
    const term = String(query || "").trim().replace(/[,%()]/g, " ");
    if (term.length < 2) return [];
    const { data, error } = await supabase.from("profiles").select("id,name,major,avatar_url")
      .neq("id", user.id).ilike("name", `%${term}%`).order("name", { ascending: true }).limit(8);
    if (error) throw new Error(friendlyError(error));
    return data || [];
  },

  async createConversation({ recipientId, recipientName, major, firstMessage, avatar }) {
    if (!supabase) return null;
    if (!throttled("conversations:add", 1500)) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You need to sign in first.");
    if (!recipientName) throw new Error("Enter the name of the scholar you want to message.");

    let recipient = null;
    if (recipientId) {
      const { data, error: recipientError } = await supabase.from("profiles").select("id,name,avatar_url").eq("id", recipientId).neq("id", user.id).maybeSingle();
      if (recipientError) throw new Error(friendlyError(recipientError));
      recipient = data;
    } else {
      const { data: matches, error: lookupError } = await supabase.from("profiles").select("id,name,avatar_url").ilike("name", recipientName.trim()).neq("id", user.id).limit(2);
      if (lookupError) throw new Error(friendlyError(lookupError));
      if (!matches || matches.length === 0) throw new Error(`User "${recipientName}" does not exist or has no matching IATS account.`);
      if (matches.length > 1) throw new Error("More than one scholar has that name. Choose the correct person from the suggestions.");
      recipient = matches[0];
    }
    if (!recipient) throw new Error("That user does not exist or is unavailable.");

    const { data: existing } = await supabase.from("conversations").select("id")
      .or(`and(created_by.eq.${user.id},participant_id.eq.${recipient.id}),and(created_by.eq.${recipient.id},participant_id.eq.${user.id})`)
      .limit(1).maybeSingle();
    const { data: conv, error } = await supabase.rpc("get_or_create_direct_conversation", {
      p_recipient_id: recipient.id,
      p_major: sanitizeText(major, 100) || "IATS Scholar",
      p_avatar_url: sanitizeAvatar(recipient.avatar_url || avatar)
    });
    if (error) throw new Error(friendlyError(error));
    if (!conv) throw new Error("Could not open the conversation. Please try again.");
    // Opening a previously hidden chat brings it back only in this user's inbox.
    await supabase.from("conversation_hides").delete().eq("user_id", user.id).eq("conversation_id", conv.id);
    if (firstMessage && !existing) await this.sendMessage(conv.id, firstMessage);
    return { ...conv, peer_id: recipient.id, name: recipient.name || recipientName, avatar_url: recipient.avatar_url || conv.avatar_url };
  },

  async sendProfileShare(conversationId, profileId) {
    if (!supabase || !conversationId || !profileId) throw new Error("Choose a student profile to share.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Please sign in again.");
    if (String(profileId) === String(user.id)) throw new Error("You cannot share your own profile as another student.");
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      text: "Shared a student profile",
      shared_profile_id: profileId
    });
    if (error) throw new Error(friendlyError(error));
    return true;
  },

  async hideConversation(conversationId) {
    if (!supabase || !conversationId) throw new Error("Choose a chat first.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Please sign in again.");
    const { error } = await supabase.from("conversation_hides").insert(
      { user_id: user.id, conversation_id: conversationId }
    );
    // Another tab may already have hidden this same chat; treat that as success.
    if (error && error.code !== "23505") throw new Error(friendlyError(error));
    return true;
  },

  async uploadChatAttachment(conversationId, file) {
    if (!supabase || !conversationId || !file) throw new Error("Choose a file to share.");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Please sign in again.");
    if (file.size > 50 * 1024 * 1024) throw new Error("Attachments must be 50 MB or smaller.");
    const allowed = new Set([
      "image/jpeg","image/png","image/webp","image/gif",
      "video/mp4","video/webm","video/quicktime",
      "application/pdf","text/plain","application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ]);
    if (!allowed.has(file.type)) throw new Error("Use an image, video, PDF, Word, Excel, PowerPoint, or text document.");
    const safeName = String(file.name || "attachment").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
    const path = conversationId + "/" + user.id + "/" + crypto.randomUUID() + "-" + safeName;
    const { error: uploadError } = await supabase.storage.from("chat-attachments").upload(path, file, {
      cacheControl: "3600", contentType: file.type, upsert: false
    });
    if (uploadError) throw new Error(friendlyError(uploadError));
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      text: "Shared an attachment: " + safeName,
      attachment_path: path,
      attachment_name: safeName,
      attachment_mime: file.type,
      attachment_size: file.size
    });
    if (messageError) {
      await supabase.storage.from("chat-attachments").remove([path]);
      throw new Error(friendlyError(messageError));
    }
    return true;
  },

  async getChatAttachmentUrl(path) {
    if (!supabase || !path) return null;
    const { data, error } = await supabase.storage.from("chat-attachments").createSignedUrl(path, 3600);
    if (error) { console.warn("Attachment link could not be created:", friendlyError(error)); return null; }
    return data?.signedUrl || null;
  },

  async editMessage(messageId, text) {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Please sign in again.");
    const { error } = await supabase.from("messages").update({ text: sanitizeText(text, 500), edited_at: new Date().toISOString() }).eq("id", messageId).eq("sender_id", user.id).is("deleted_at", null).gte("created_at", new Date(Date.now()-120000).toISOString()); if (error) throw new Error(friendlyError(error));
  },
  async deleteMessage(messageId) {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Please sign in again.");
    const { error } = await supabase.from("messages").update({ text: "", deleted_at: new Date().toISOString() }).eq("id", messageId).eq("sender_id", user.id); if (error) throw new Error(friendlyError(error));
  },
  async removeAvatar() {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Please sign in again.");
    const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id); if (error) throw new Error(friendlyError(error)); return true;
  },
  /** Sends a message instantly over Realtime — DB trigger rate-limits abuse. */
  async sendMessage(conversationId, text, replyTo = null) {
    if (!supabase || !conversationId || !text) return false;
    if (!throttled("messages:send:" + conversationId, 400)) return false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to sign in first.");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        text: sanitizeText(text, 500),
        reply_to: replyTo || null
      });
      if (error) throw error;
      // conversations.updated_at / last_message are refreshed automatically by
      // the on_message_inserted trigger defined in supabase/schema.sql
      return true;
    } catch (e) {
      console.warn("sendMessage failed:", friendlyError(e));
      throw e;
    }
  }
};

// Export to window for the vanilla JS application engine
if (typeof window !== "undefined") {
  window.SupabaseService = SupabaseService;
  window.DEFAULT_STUDENT_AVATAR = DEFAULT_STUDENT_AVATAR;
}
