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
    await supabase.auth.signOut();
  },

  // ===========================================================
  // Realtime presence: online only while an authenticated client is connected.
  async subscribePresence(onUpdate) {
    if (!supabase) return () => {};
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return () => {};
    const channel = supabase.channel("iats-global-presence", { config: { presence: { key: user.id } } });
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
          publish();
        }
      });
    return () => supabase.removeChannel(channel);
  },

  // 2. Profiles (created on first sign-in, no photo required)
  // ===========================================================
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
  /** Creates the profile row on first login / updates it later. Avatar is always optional. */
  async saveUser(user) {
    if (!supabase || !user || !user.id) return null;
    try {
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
        avatar_url: sanitizeAvatar(user.avatar), // null is fine — UI falls back to a default vector
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
            .select("id,title,description,host,host_avatar,location,event_time,event_starts_at,event_ends_at,tag,attendees,max_attendees,created_at")
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
        host: sanitizeText(catchup.host, 80),
        host_avatar: sanitizeAvatar(catchup.hostAvatar),
        host_id: user ? user.id : null,
        location: sanitizeText(catchup.location, 100),
        event_time: sanitizeText(catchup.time, 100),
        event_starts_at: catchup.startsAt ? new Date(catchup.startsAt).toISOString() : null,
        event_ends_at: catchup.endsAt ? new Date(catchup.endsAt).toISOString() : null,
        tag: sanitizeText(catchup.tag, 40) || "Academic Event",
        attendees: 1,
        max_attendees: catchup.maxAttendees == null || catchup.maxAttendees === "" ? null : Number(catchup.maxAttendees),
        attendee_ids: user ? [user.id] : []
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
    if (authError || !user || String(user.email || "").toLowerCase() !== "focalforges@gmail.com") {
      throw new Error("Only the platform developer can moderate events.");
    }
    const payload = {
      title: sanitizeText(catchup.title, 120),
      description: sanitizeText(catchup.description, 2000),
      location: sanitizeText(catchup.location, 100),
      event_time: sanitizeText(catchup.time, 100),
      event_starts_at: catchup.startsAt ? new Date(catchup.startsAt).toISOString() : null,
      event_ends_at: catchup.endsAt ? new Date(catchup.endsAt).toISOString() : null,
      tag: sanitizeText(catchup.tag, 40) || "Academic Event",
      max_attendees: catchup.maxAttendees == null || catchup.maxAttendees === "" ? null : Number(catchup.maxAttendees)
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

  async toggleCatchupAttendance(catchupId, _userId, isJoining) {
    if (!supabase || !catchupId) return false;
    try {
      const { data, error } = await supabase.rpc("toggle_catchup_attendance", {
        p_catchup_id: catchupId,
        p_joining: !!isJoining
      });
      if (error) throw error;
      return data === true;
    } catch (e) {
      console.warn("toggleCatchupAttendance failed:", friendlyError(e));
      return false;
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
      const convs = data || [];
      const peerIds = [...new Set(convs.map(c => c.created_by === user.id ? c.participant_id : c.created_by).filter(Boolean))];
      let peers = [];
      if (peerIds.length) {
        const result = await supabase.from("profiles").select("id,name,avatar_url").in("id", peerIds);
        if (!result.error) peers = result.data || [];
      }
      const byId = new Map(peers.map(p => [p.id, p]));
      onUpdate(convs.map(c => {
        const peerId = c.created_by === user.id ? c.participant_id : c.created_by;
        const peer = byId.get(peerId);
        return { ...c, peer_id: peerId, name: peer?.name || c.name || "IATS Scholar", avatar_url: peer?.avatar_url || c.avatar_url };
      }));
    };
    load();

    const channel = supabase.channel("public:conversations:" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
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
        event: "INSERT", schema: "public", table: "messages",
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
  async createConversation({ recipientName, major, firstMessage, avatar }) {
    if (!supabase) return null;
    if (!throttled("conversations:add", 1500)) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You need to sign in first.");
    if (!recipientName) throw new Error("Enter the name of the scholar you want to message.");

    const { data: matches, error: lookupError } = await supabase.from("profiles")
      .select("id,name,avatar_url").ilike("name", recipientName.trim()).neq("id", user.id).limit(2);
    if (lookupError) throw new Error(friendlyError(lookupError));
    if (!matches || matches.length === 0) throw new Error("No other scholar was found with that name. Check the name and try again.");
    if (matches.length > 1) throw new Error("More than one scholar has that name. Use a unique display name to start the chat.");
    const recipient = matches[0];

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
    if (firstMessage && !existing) await this.sendMessage(conv.id, firstMessage);
    return { ...conv, peer_id: recipient.id, name: recipient.name || recipientName, avatar_url: recipient.avatar_url || conv.avatar_url };
  },

  /** Sends a message instantly over Realtime — DB trigger rate-limits abuse. */
  async sendMessage(conversationId, text) {
    if (!supabase || !conversationId || !text) return false;
    if (!throttled("messages:send:" + conversationId, 400)) return false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to sign in first.");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        text: sanitizeText(text, 500)
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
