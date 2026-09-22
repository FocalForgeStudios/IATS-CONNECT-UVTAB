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

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  // ===========================================================
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
        host: sanitizeText(catchup.host, 80),
        host_avatar: sanitizeAvatar(catchup.hostAvatar),
        host_id: user ? user.id : null,
        location: sanitizeText(catchup.location, 100),
        event_time: sanitizeText(catchup.time, 60),
        tag: sanitizeText(catchup.tag, 40) || "Academic Event",
        attendees: 1,
        max_attendees: Math.min(Number(catchup.maxAttendees) || 8, 30),
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

  async toggleCatchupAttendance(catchupId, _userId, isJoining) {
    if (!supabase || !catchupId) return false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data: row } = await supabase.from("catchups").select("attendees, attendee_ids").eq("id", catchupId).maybeSingle();
      if (!row) return false;
      let ids = Array.isArray(row.attendee_ids) ? row.attendee_ids : [];
      let attendees = row.attendees || 0;
      if (isJoining) {
        if (!ids.includes(user.id)) ids.push(user.id);
        attendees += 1;
      } else {
        ids = ids.filter(id => id !== user.id);
        attendees = Math.max(0, attendees - 1);
      }
      const { error } = await supabase.from("catchups").update({ attendees, attendee_ids: ids }).eq("id", catchupId);
      if (error) throw error;
      return true;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data: row } = await supabase.from("hub_posts").select("upvotes, upvoter_ids").eq("id", postId).maybeSingle();
      if (!row) return false;
      let ids = Array.isArray(row.upvoter_ids) ? row.upvoter_ids : [];
      let upvotes = row.upvotes || 0;
      if (isUpvoting) {
        if (!ids.includes(user.id)) ids.push(user.id);
        upvotes += 1;
      } else {
        ids = ids.filter(id => id !== user.id);
        upvotes = Math.max(0, upvotes - 1);
      }
      const { error } = await supabase.from("hub_posts").update({ upvotes, upvoter_ids: ids }).eq("id", postId);
      if (error) throw error;
      return true;
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

    const load = () => {
      supabase.from("conversations").select("*")
        .or(`created_by.eq.${user.id},participant_id.eq.${user.id}`)
        .order("updated_at", { ascending: false })
        .then(({ data, error }) => { if (!error) onUpdate(data || []); });
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
      supabase.from("messages").select("*").eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }).limit(200)
        .then(({ data, error }) => { if (!error) onUpdate(data || []); });
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

    let participantId = null;
    if (recipientName) {
      const { data: match } = await supabase.from("profiles").select("id")
        .ilike("name", recipientName.trim()).neq("id", user.id).limit(1).maybeSingle();
      if (match) participantId = match.id;
    }

    const payload = {
      created_by: user.id,
      participant_id: participantId,
      name: sanitizeText(recipientName, 80),
      major: sanitizeText(major, 100),
      avatar_url: sanitizeAvatar(avatar),
      status: "online"
    };
    const { data: conv, error } = await supabase.from("conversations").insert(payload).select().single();
    if (error) throw new Error(friendlyError(error));

    if (firstMessage) {
      await this.sendMessage(conv.id, firstMessage);
    }
    return conv;
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
