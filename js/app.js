/**
 * IATS CONNECT - Core Engine & Interactive State Manager
 * Institute of Advanced Technical Studies Student Hub
 * Frosted Liquid Glass UI (Crimson Red #D8232A & Royal Blue #3A86C8)
 * Strict Academic Content Moderation & Cloud Firestore Persistence
 */

(function () {
  "use strict";

  // SVG Icon Templates
  const ICONS = {
    spark: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,
    coffee: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    pin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    users: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    userPlus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`,
    chat: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    upvote: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    mail: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    cross: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  };

  // Base asset path resolver for GitHub Pages / subpaths / root hosting compatibility
  function resolveAssetUrl(url) {
    if (!url || typeof url !== "string") return "./images/scholar_female.jpg";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    if (url.startsWith("/")) {
      return "." + url;
    }
    if (!url.startsWith("./")) {
      return "./" + url;
    }
    return url;
  }

  // Neutral placeholder shown until a member uploads their own profile photo.
  const DEFAULT_AVATAR_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 rx=%2250%22 fill=%22%23E2E8F0%22/%3E%3Ccircle cx=%2250%22 cy=%2237%22 r=%2218%22 fill=%22%2394A3B8%22/%3E%3Cpath d=%22M15 92c2-22 16-34 35-34s33 12 35 34%22 fill=%22%2394A3B8%22/%3E%3C/svg%3E";

  const IATS_COURSES = [{"code":"CTH","name":"Certificate in Tourism and Hospitality Management","department":"Department of Business Administration"},{"code":"NIT","name":"National Certificate in Information and Communication Technology","department":"Department of Science and Technology"},{"code":"CLI","name":"National Certificate in Library and Information Science","department":"Department of Humanities and Social Sciences"},{"code":"CSW","name":"National Certificate in Social Work and Social Administration","department":"Department of Humanities and Social Sciences"},{"code":"CCF","name":"Certificate in Clearing and Forwarding","department":"Department of Business Administration"},{"code":"CTV","name":"Certificate in CCTV Installation and Surveillance Systems","department":"Department of Science and Technology"},{"code":"CJM","name":"Certificate in Journalism and Media Studies","department":"Department of Humanities and Social Sciences"},{"code":"NCS","name":"National Certificate in Secretarial and Office Management","department":"Department of Business Administration"},{"code":"NHR","name":"National Certificate in Human Resource Management","department":"Department of Business Administration"},{"code":"CEC","name":"Certificate in Early Childhood Education","department":"Department of Humanities and Social Sciences"},{"code":"CPA","name":"Certificate in Public Administration and Management","department":"Department of Business Administration"},{"code":"NCB","name":"National Certificate in Cosmetology and Beauty Therapy","department":"Department of Public Health and Medicine"},{"code":"CPM","name":"Certificate in Procurement and Logistics Management","department":"Department of Business Administration"},{"code":"NCR","name":"National Certificate in Computer Repair and Maintenance","department":"Department of Science and Technology"},{"code":"CSF","name":"Professional Certificate in Software Engineering","department":"Department of Science and Technology"},{"code":"NAF","name":"National Certificate in Accounting and Finance","department":"Department of Business Administration"},{"code":"CBA","name":"National Certificate in Business Administration","department":"Department of Business Administration"},{"code":"NCM","name":"Certificate in Digital Marketing","department":"Department of Business Administration"},{"code":"CHI","name":"Certificate in Hotel Management and Institutional Catering","department":"Department of Business Administration"},{"code":"CRM","name":"Certificate in Records and Information Management","department":"Department of Business Administration"},{"code":"CGC","name":"National Certificate in Guidance and Counselling","department":"Department of Humanities and Social Sciences"},{"code":"NCA","name":"National Certificate in Agriculture","department":"Department of Agriculture and Environmental Sciences"},{"code":"HEG","name":"Higher Education Certificate (HEC) General","department":"Department of Humanities and Social Sciences"},{"code":"HEB","name":"Higher Education Certificate in Biological Sciences","department":"Department of Public Health and Medicine"},{"code":"HEP","name":"Higher Education Certificate Physical Sciences","department":"Department of Science and Technology"},{"code":"HET","name":"Higher Education Certificate General","department":"Department of Humanities and Social Sciences"},{"code":"HEE","name":"Higher Education Certificate Evening","department":"Department of Humanities and Social Sciences"}];
  const IATS_COHORTS = ["1.1", "1.2", "2.1", "2.2"];
  const getActiveBuddyProfiles = () => { const u = AppState.currentUser; return AppState.matchProfiles.filter(p => !p.is_former_student && String(p.owner_id || p.user_id || p.id || "") !== String(u?.id || "")); };

  // Global Dynamic State Store (Strictly Cloud Firestore Driven, No LocalStorage Mock Data)
  const AppState = {
    currentUser: null,
    activeView: "landing",
    pendingEmail: null,
    otpTimer: null,
    otpSecondsRemaining: 60,
    currentMatchIndex: 0,
    activeChatId: null,
    activeHubCategory: "department",
    activeHubDepartment: "Department of Science and Technology",
    
    // Live Cloud Database collections
    matchProfiles: [],
    catchups: [],
    hubPosts: [],
    conversations: [],
    onlineUserIds: [],
    activeMessages: [],
    selectedChatRecipientId: null,
    replyingToMessageId: null,
    unreadNewsIds: [],
    unreadChatCounts: {},
    adminStats: null,
    adminEvents: [],
    adminFilter: "all",
    adminSort: "soonest",
    editingEventId: null
  };

  // ==========================================
  // Strict Academic Content Moderation Hook
  // ==========================================
  function validateAcademicContent(fieldsObj, contextTitle = "Academic Entry") {
    if (!window.IATSContentFilter || typeof window.IATSContentFilter.checkFields !== "function") {
      return true;
    }
    const result = window.IATSContentFilter.checkFields(fieldsObj);
    const allowed = typeof result.allowed === "boolean"
      ? result.allowed
      : typeof result.isClean === "boolean" ? result.isClean : true;
    if (!allowed) {
      const reasonBox = document.getElementById("filter-warning-reason-text");
      if (reasonBox) {
        reasonBox.textContent = result.reason || "This entry was flagged by the academic content policy. Review the event details and try again.";
      }
      const warningModal = document.getElementById("content-filter-warning-modal");
      if (warningModal) {
        warningModal.classList.add("open");
      }
      showToast("Submission Blocked", "Your input violates the IATS Academic Policy against non-academic content.");
      return false;
    }
    return true;
  }

  // ==========================================
  // Initialization & Real Database Synchronization
  // ==========================================
  function initApp() {
    // Reveal the real page immediately; database/auth sync must never hold the boot screen.
    hideBootLoaderWhenReady();
    try {
      renderNavigation();
      bindEvents();
      renderActiveView();
      updateUnreadBadge();
      initHeaderScrollBlur();
      initSupabaseSync();
      if (!eventTicker) eventTicker = window.setInterval(tickEventCountdowns, 1000);
    } catch (error) {
      // Never leave users with a blank screen if a non-critical initializer fails.
      console.error("[IATS CONNECT] App initialization failed; restoring the public landing view.", error);
      document.querySelectorAll(".view-section").forEach(section => section.classList.remove("active"));
      const landing = document.getElementById("view-landing");
      if (landing) landing.classList.add("active");
      const loader = document.getElementById("app-boot-loader");
      if (loader) {
        loader.classList.add("is-hidden");
        window.setTimeout(() => loader.remove(), 300);
      }
    }
  }

  // Dismiss the boot skeleton once the app has mounted. Do not wait for
  // every image/font/network request: those can be slow on mobile connections.
  function hideBootLoaderWhenReady() {
    const reveal = () => {
      const loader = document.getElementById("app-boot-loader");
      if (loader) {
        loader.classList.add("is-hidden");
        window.setTimeout(() => loader.remove(), 180);
      }
    };
    // Two frames lets the browser paint the app shell first; no network request is awaited.
    window.requestAnimationFrame(() => window.requestAnimationFrame(reveal));
    // Safety fallback in case rendering or a browser extension delays animation frames.
    window.setTimeout(reveal, 900);
  }

  // Adds a subtle progressive blur to anything scrolling up past the
  // header, instead of leaving it perfectly crisp right up to the edge.
  function initHeaderScrollBlur() {
    const header = document.getElementById("main-header");
    const veil = document.getElementById("header-blur-veil");
    if (!header && !veil) return;

    const SCROLL_THRESHOLD = 24;
    let ticking = false;

    function applyState() {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      if (header) header.classList.toggle("is-scrolled", scrolled);
      if (veil) veil.classList.toggle("is-active", scrolled);
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(applyState);
        ticking = true;
      }
    }, { passive: true });

    applyState();
  }

  // Live Supabase sync: real accounts only, no local/sample data seeding.
  let unsubMatchProfiles = null;
  let unsubCatchups = null;
  let unsubHubPosts = null;
  let unsubConversations = null;
  let unsubActiveMessages = null;
  let unsubPresence = null;
  let eventTicker = null;

  function initSupabaseSync() {
    if (!window.SupabaseService || typeof window.SupabaseService.isReady !== "function") {
      setTimeout(initSupabaseSync, 300);
      return;
    }
    if (!window.SupabaseService.isReady()) {
      showToast(
        "Supabase Not Configured",
        "Open js/supabase-config.js and add your project URL + anon key, then run supabase/schema.sql."
      );
      return;
    }

    console.log("✓ Connecting IATS CONNECT to live Supabase collections...");

    // The INITIAL_SESSION auth event below restores the persisted session.
    // Keep this separate lookup only for password-recovery routing so startup
    // does not hydrate the same user twice and issue duplicate database requests.
    window.SupabaseService.getSession().then((session) => {
      const recoveryRequested = new URLSearchParams(window.location.search).get("password-recovery") === "1";
      if (recoveryRequested && session && session.user) {
        const modal = document.getElementById("auth-modal-backdrop");
        if (modal) modal.classList.add("open");
        showAuthStep("password-recovery");
      }
    }).catch(error => console.warn("[IATS CONNECT] Could not check password-recovery session:", error));

    // React instantly to real sign-in / sign-out / token refresh events.
    window.SupabaseService.onAuthStateChange((event, session) => {
      if ((event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") && session && session.user) {
        hydrateSessionFromAuthUser(session.user).catch(error => console.warn("[IATS CONNECT] Session restore/profile sync failed:", error));
      } else if (event === "PASSWORD_RECOVERY") {
        const modal = document.getElementById("auth-modal-backdrop");
        if (modal) modal.classList.add("open");
        showAuthStep("password-recovery");
      } else if (event === "SIGNED_OUT") {
        if (unsubPresence) { unsubPresence(); unsubPresence = null; }
        AppState.onlineUserIds = [];
        AppState.currentUser = null;
        AppState.conversations = [];
        AppState.activeMessages = [];
        AppState.activeChatId = null;
        renderNavigation();
        // The signed-out state should be visible from the Profile tab, not hidden on Home.
        navigateTo("profile");
      }
    });

    // Real-time public directory / feed listeners (no polling delay)
    unsubMatchProfiles = window.SupabaseService.subscribeMatchProfiles((profiles) => {
      AppState.matchProfiles = profiles || [];
      if (AppState.activeView === "match" || AppState.activeView === "dashboard") {
        renderActiveView();
      }
    });

    unsubCatchups = window.SupabaseService.subscribeCatchups((catchups) => {
      AppState.catchups = (catchups || []).map(c => ({
        ...c,
        hostAvatar: c.hostAvatar ?? c.host_avatar ?? null,
        time: c.time ?? c.event_time ?? "",
        event_starts_at: c.event_starts_at ?? null,
        event_ends_at: c.event_ends_at ?? null,
        item_type: c.item_type || (String(c.tag || "").toLowerCase().replace(/\s+/g, "") === "campusnews" ? "news" : "event"),
        is_official: Boolean(c.is_official),
        event_format: c.event_format || "physical",
        online_url: c.online_url || "",
        registration_deadline: c.registration_deadline || null,
        maxAttendees: c.maxAttendees ?? c.max_attendees ?? null,
        isJoined: Array.isArray(c.attendee_ids) && !!AppState.currentUser && c.attendee_ids.includes(AppState.currentUser.id)
      }));
      refreshUnreadNews();
      if (AppState.activeView === "catchup" || AppState.activeView === "dashboard" || AppState.activeView === "admin") {
        renderActiveView();
      }
    });

    unsubHubPosts = window.SupabaseService.subscribeHubPosts(AppState.activeHubCategory, (posts) => {
      AppState.hubPosts = posts || [];
      if (AppState.activeView === "hubs" || AppState.activeView === "dashboard") {
        renderActiveView();
      }
    });
  }

  // Once a real user is authenticated, load/create their profile row and
  // start their real-time direct-message thread listener.
  async function hydrateSessionFromAuthUser(authUser) {
    // Paint the authenticated state immediately from the persisted Supabase session.
    // Profile/network requests enrich this user afterward and must not make refresh
    // look like a sign-out while the database is responding slowly.
    const earlyProvider = (authUser.app_metadata && authUser.app_metadata.provider) || "email";
    const earlyDeveloper = String(authUser.email || "").trim().toLowerCase() === "focalforges@gmail.com";
    if (!AppState.currentUser || AppState.currentUser.id !== authUser.id) {
      AppState.currentUser = {
        id: authUser.id,
        name: (authUser.user_metadata && (authUser.user_metadata.full_name || authUser.user_metadata.name)) ||
              (authUser.email ? authUser.email.split("@")[0] : "IATS Scholar"),
        email: authUser.email,
        major: earlyDeveloper ? "Developer" : "Undeclared",
        year: earlyDeveloper ? "Platform Administrator" : "Class of 2026",
        bio: "",
        courses: [],
        interests: [],
        skills: [],
        avatar: authUser.user_metadata && authUser.user_metadata.avatar_url,
        location: earlyDeveloper ? "IATS CONNECT Platform" : "IATS Main Campus",
        authProvider: earlyProvider === "google" ? "Google Account (Verified)" : "Personal Email (Verified)",
        isVerified: true,
        isDeveloper: earlyDeveloper
      };
      renderNavigation();
    }
    let profile = await window.SupabaseService.fetchProfile(authUser.id);
    if (!profile) {
      profile = await window.SupabaseService.saveUser({
        id: authUser.id,
        name: (authUser.user_metadata && (authUser.user_metadata.full_name || authUser.user_metadata.name)) ||
              (authUser.email ? authUser.email.split("@")[0] : "IATS Scholar"),
        email: authUser.email,
        avatar: authUser.user_metadata && authUser.user_metadata.avatar_url // optional, never required
      });
    }
    const provider = (authUser.app_metadata && authUser.app_metadata.provider) || "email";
    const developerAccount = String(authUser.email || "").trim().toLowerCase() === "focalforges@gmail.com";
    AppState.currentUser = {
      id: authUser.id,
      name: (profile && profile.name) || (developerAccount ? "IATS CONNECT Developer" : "IATS Scholar"),
      email: authUser.email,
      major: developerAccount ? "Developer" : ((profile && profile.major) || "Undeclared"),
      year: developerAccount ? "Platform Administrator" : ((profile && profile.year) || "Class of 2026"),
      bio: developerAccount ? "Developer and platform administrator for IATS CONNECT, responsible for product engineering, campus event moderation, and official campus news." : ((profile && profile.bio) || ""),
      courses: developerAccount ? [] : ((profile && profile.courses) || []),
      interests: developerAccount ? ["Software Engineering", "Platform Development", "System Architecture", "Database Security"] : ((profile && profile.interests) || []),
      skills: developerAccount ? ["Software Engineering", "Platform Development", "System Architecture", "Database Security"] : ((profile && profile.interests && profile.interests.length ? profile.interests : ["Academic Collaboration"])),
      avatar: profile && profile.avatar_url,
      location: developerAccount ? "IATS CONNECT Platform" : ((profile && profile.location) || "IATS Main Campus"),
      authProvider: provider === "google" ? "Google Account (Verified)" : "Personal Email (Verified)",
      isVerified: true,
      isDeveloper: developerAccount
    };
    if (developerAccount && window.SupabaseService && typeof window.SupabaseService.saveUser === "function" &&
        (!profile || profile.major !== "Developer" || profile.year !== "Platform Administrator")) {
      const savedDeveloperProfile = await window.SupabaseService.saveUser(AppState.currentUser);
      if (savedDeveloperProfile) AppState.currentUser.avatar = savedDeveloperProfile.avatar_url || AppState.currentUser.avatar;
    }
    if (!developerAccount && profile && IATS_COURSES.some(c=>c.name===profile.major) && IATS_COHORTS.includes(profile.year)) {
      // Run directory sync in the background so a slow database round-trip cannot delay sign-in UI.
      window.SupabaseService.upsertMatchProfile({...AppState.currentUser,owner_id:authUser.id,course_code:IATS_COURSES.find(c=>c.name===profile.major).code,cohort:profile.year,is_former_student:false})
        .then(buddy => { if (buddy) AppState.matchProfiles=[buddy,...AppState.matchProfiles.filter(p=>p.owner_id!==authUser.id)]; })
        .catch(err => console.warn("Study Buddy profile sync failed",err));
    }
    syncNewsPublishingOption();
    renderNavigation();
    refreshUnreadNews();
    startConversationsSync();
    if (unsubPresence) { unsubPresence(); unsubPresence = null; }
    if (window.SupabaseService.subscribePresence) window.SupabaseService.subscribePresence(async ids => {
      AppState.onlineUserIds = ids || [];
      try {
        const peerIds = [...new Set((AppState.conversations || []).map(c => c.peer_id).filter(Boolean))];
        const lastSeen = await window.SupabaseService.refreshPeerLastSeen(peerIds);
        AppState.conversations = AppState.conversations.map(c => ({ ...c, peer_last_seen_at: lastSeen[c.peer_id] || c.peer_last_seen_at || null }));
      } catch (err) { console.warn("Last-seen refresh failed", err); }
      if (AppState.activeView === "chats") renderChatsView();
    }).then(unsub => { unsubPresence = unsub; }).catch(err => console.warn("Presence sync failed", err));
    if (isNewsPublisher() && AppState.activeView === "landing") navigateTo("admin");
  }

  function startConversationsSync() {
    if (unsubConversations) unsubConversations();
    window.SupabaseService.subscribeConversations((convs) => {
      AppState.conversations = convs || [];
      AppState.conversations.forEach(c => { if (typeof c.unread_count === "number") AppState.unreadChatCounts[c.id] = (AppState.activeView === "chats" && String(AppState.activeChatId) === String(c.id)) ? 0 : c.unread_count; });
      updateNotificationBadges();
      if (!AppState.activeChatId && convs && convs.length > 0) {
        AppState.activeChatId = convs[0].id;
      }
      if (AppState.activeChatId) startActiveMessagesSync(AppState.activeChatId);
      if (AppState.activeView === "chats") renderActiveView();
      updateUnreadBadge();
    }).then((unsub) => { unsubConversations = unsub; });
  }

  function startActiveMessagesSync(conversationId) {
    if (unsubActiveMessages) unsubActiveMessages();
    AppState.activeMessages = [];
    unsubActiveMessages = window.SupabaseService.subscribeMessages(conversationId, (messages) => {
      AppState.activeMessages = messages || [];
      const unread = AppState.activeMessages.filter(message => message.sender_id !== (AppState.currentUser && AppState.currentUser.id) && !message.read_at && !message.deleted_at).length;
      AppState.unreadChatCounts[conversationId] = AppState.activeView === "chats" && String(AppState.activeChatId) === String(conversationId) ? 0 : unread;
      updateNotificationBadges();
      if (AppState.activeView === "chats" && String(AppState.activeChatId) === String(conversationId)) {
        renderActiveView();
      }
    });
  }

  function saveSession(user) {
    // Kept for compatibility with call sites; real persistence now happens
    // through Supabase Auth + hydrateSessionFromAuthUser().
    AppState.currentUser = user;
    renderNavigation();
  }

  async function clearSession(returnView = "profile") {
    // Always reset the visible UI, even if Supabase reports a network/sign-out error.
    // The service clears the local session as well as requesting remote sign-out.
    let signOutError = null;
    try {
      if (window.SupabaseService && typeof window.SupabaseService.signOut === "function") {
        await window.SupabaseService.signOut();
      }
    } catch (error) {
      signOutError = error;
      console.warn("Remote sign-out did not complete cleanly:", error);
      try { await window.SupabaseService?.clearLocalSession?.(); } catch (_) {}
    } finally {
      AppState.currentUser = null;
      AppState.unreadNewsIds = [];
      AppState.unreadChatCounts = {};
      AppState.conversations = [];
      AppState.activeMessages = [];
      AppState.activeChatId = null;
      AppState.activeMessagesChannel = null;
      if (unsubConversations) { unsubConversations(); unsubConversations = null; }
      if (unsubActiveMessages) { unsubActiveMessages(); unsubActiveMessages = null; }
      if (unsubPresence) { unsubPresence(); unsubPresence = null; }
      AppState.onlineUserIds = [];
      AppState.replyingToMessageId = null;
      const authModal = document.getElementById("auth-modal-backdrop");
      if (authModal) authModal.classList.remove("open");
      renderNavigation();
      // Admins can explicitly return to the public guest landing page after sign-out.
      navigateTo(returnView === "landing" ? "landing" : "profile");
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    if (signOutError) {
      showToast("Signed out on this device", "The local session was cleared. If you are signed back in after refresh, check your connection and try again.");
    } else {
      showToast("Signed Out", "You have been signed out. Choose Sign In / Verify to sign in again or create an account.");
    }
  }

  // ==========================================
  // Navigation & View Routing
  // ==========================================
  function navigateTo(viewId) {
    if (viewId === "admin" && !isNewsPublisher()) {
      showToast("Administrator Only", "The administration dashboard is restricted to focalforges@gmail.com.");
      viewId = "dashboard";
    }
    AppState.activeView = viewId;
    
    // Update bottom dock nav buttons and any nav-item-btn elements
    document.querySelectorAll(".dock-nav-btn, .nav-item-btn").forEach(btn => {
      if (btn.dataset.view === viewId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Hide all view sections and show target
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });
    
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderActiveView();
    if (viewId === "catchup") refreshUnreadNews();
    if (viewId === "chats" && AppState.activeChatId) markActiveConversationRead(AppState.activeChatId);
    updateNotificationBadges();
  }

  function renderActiveView() {
    switch (AppState.activeView) {
      case "dashboard":
        renderDashboardView();
        break;
      case "match":
        renderMatchView();
        break;
      case "catchup":
        renderCatchUpView();
        break;
      case "admin":
        renderAdminDashboardView();
        break;
      case "hubs":
        renderHubsView();
        break;
      case "chats":
        renderChatsView();
        break;
      case "profile":
        renderProfileView();
        break;
      default:
        // Landing view
        break;
    }
  }

  function updateNotificationBadges() {
    const newsCount = (AppState.unreadNewsIds || []).length;
    const chatCount = Object.values(AppState.unreadChatCounts || {}).reduce((sum, count) => sum + Number(count || 0), 0);
    document.querySelectorAll('.dock-nav-btn[data-view="catchup"]').forEach(button => {
      let badge = button.querySelector(".nav-notification-badge");
      if (newsCount > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "nav-notification-badge";
          badge.setAttribute("role", "status");
          button.appendChild(badge);
        }
        badge.textContent = newsCount > 99 ? "99+" : String(newsCount);
        badge.setAttribute("aria-label", newsCount + " unread campus news items");
        badge.title = newsCount + " unread campus news items";
        badge.hidden = false;
      } else if (badge) {
        badge.remove();
      }
    });
    document.querySelectorAll('.dock-nav-btn[data-view="chats"]').forEach(button => {
      let badge = button.querySelector(".nav-notification-badge");
      if (chatCount > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "nav-notification-badge";
          button.appendChild(badge);
        }
        badge.textContent = chatCount > 99 ? "99+" : String(chatCount);
        badge.setAttribute("aria-label", chatCount + " unread messages");
        badge.title = chatCount + " unread messages";
      } else if (badge) badge.remove();
    });
  }

  async function refreshUnreadNews() {
    if (!AppState.currentUser || !window.SupabaseService?.getUnreadNewsIds) return;
    try {
      AppState.unreadNewsIds = await window.SupabaseService.getUnreadNewsIds((AppState.catchups || []).filter(isCampusNewsItem).map(item => item.id));
      updateNotificationBadges();
      if (AppState.activeView === "catchup") renderCatchUpView();
      if (AppState.activeView === "dashboard") renderDashboardView();
    } catch (err) { console.warn("Unread news refresh failed", err); }
  }

  async function markNewsRead(newsId) {
    if (!AppState.currentUser || !newsId || !window.SupabaseService?.markNewsRead) return;
    try { await window.SupabaseService.markNewsRead(newsId); AppState.unreadNewsIds = AppState.unreadNewsIds.filter(id => String(id) !== String(newsId)); updateNotificationBadges(); if (AppState.activeView === "catchup") renderCatchUpView(); }
    catch (err) { console.warn("Could not mark news as read", err); }
  }

  async function markActiveConversationRead(conversationId) {
    if (!AppState.currentUser || !conversationId || !window.SupabaseService?.markConversationRead) return;
    try { await window.SupabaseService.markConversationRead(conversationId); AppState.unreadChatCounts[conversationId] = 0; updateNotificationBadges(); }
    catch (err) { console.warn("Could not mark chat as read", err); }
  }

  function renderNavigation() {
    const userContainer = document.getElementById("header-user-area");
    if (!userContainer) return;

    if (AppState.currentUser) {
      userContainer.innerHTML = `
        <div class="user-profile-pill" id="btn-header-profile" title="View Profile" style="cursor: pointer;">
          <img src="${resolveAssetUrl(AppState.currentUser.avatar || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" class="user-avatar-sm" alt="${AppState.currentUser.name}">
          <span style="font-weight: 700; font-size: 0.88rem; color: #1E293B;">${AppState.currentUser.name}</span>
          <span class="tag-pill tag-pill-highlight" style="font-size: 0.72rem; padding: 2px 8px;">${isNewsPublisher() ? "Developer · Admin" : "IATS Verified"}</span>
        </div>
        ${isNewsPublisher() ? '<button class="btn-liquid btn-glass btn-sm" id="btn-header-admin" type="button"><span>Admin Dashboard</span></button>' : ''}
        <button class="btn-liquid btn-glass btn-sm" id="btn-header-logout" title="Sign Out">
          <span>Sign Out</span>
        </button>
      `;
      document.querySelectorAll(".dock-nav-btn[data-view]").forEach(btn => {
        const view = btn.dataset.view;
        btn.style.display = isNewsPublisher()
          ? (view === "catchup" ? "" : "none")
          : "";
      });
      const profBtn = document.getElementById("btn-header-profile");
      if (profBtn) profBtn.addEventListener("click", () => navigateTo("profile"));
      const adminBtn = document.getElementById("btn-header-admin");
      if (adminBtn) adminBtn.addEventListener("click", () => navigateTo("admin"));
      const logoutBtn = document.getElementById("btn-header-logout");
      if (logoutBtn) logoutBtn.addEventListener("click", clearSession);
    } else {
      document.querySelectorAll(".dock-nav-btn[data-view]").forEach(btn => { btn.style.display = ""; });
      userContainer.innerHTML = `
        <button class="btn-liquid btn-glass btn-sm" id="btn-open-system-tour" style="display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          <span>System Tour</span>
        </button>
        <button class="btn-liquid btn-primary btn-sm" id="btn-open-auth-modal">
          <span>Sign In / Verify</span>
        </button>
      `;
      const authBtn = document.getElementById("btn-open-auth-modal");
      if (authBtn) authBtn.addEventListener("click", openAuthModal);
      const tourBtn = document.getElementById("btn-open-system-tour");
      if (tourBtn) tourBtn.addEventListener("click", startSystemTour);
    }
  }

  function updateUnreadBadge() {
    const badge = document.getElementById("chat-unread-badge");
    if (!badge) return;
    const totalUnread = AppState.conversations.reduce((acc, c) => acc + (c.unread || 0), 0);
    if (totalUnread > 0) {
      badge.textContent = totalUnread;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }

  // ==========================================
  // Auth Engine: Google Identity + Active Email OTP
  // ==========================================
  function openAuthModal() {
    const modal = document.getElementById("auth-modal-backdrop");
    if (modal) {
      modal.classList.add("open");
      showAuthStep("main");
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById("auth-modal-backdrop");
    if (modal) modal.classList.remove("open");
    clearInterval(AppState.otpTimer);
  }

  function showAuthStep(step) {
    const stepMain = document.getElementById("auth-step-main");
    const stepOtp = document.getElementById("auth-step-otp");
    const stepSuccess = document.getElementById("auth-step-success");
    const stepRecovery = document.getElementById("auth-step-password-recovery");
    if (stepMain) stepMain.style.display = (step === "main") ? "block" : "none";
    if (stepOtp) stepOtp.style.display = (step === "otp") ? "block" : "none";
    if (stepSuccess) stepSuccess.style.display = (step === "success") ? "block" : "none";
    if (stepRecovery) stepRecovery.style.display = (step === "password-recovery") ? "block" : "none";
  }

  // Real Google OAuth via Supabase Auth — no sample/fake account is ever
  // created. This redirects to Google's actual consent screen.
  async function handleGoogleSignIn() {
    const btn = document.getElementById("btn-auth-google");
    if (!window.SupabaseService || !window.SupabaseService.isReady()) {
      showToast("Setup Needed", "Add your Supabase project URL + anon key in js/supabase-config.js first.");
      return;
    }
    setButtonLoading(btn, "Redirecting to Google…");
    try {
      await window.SupabaseService.signInWithGoogle();
      // Page will redirect to Google; nothing further to do here.
    } catch (err) {
      clearButtonLoading(btn);
      alert(err.message || "Could not start Google sign-in. Please try again.");
    }
  }

  async function completePasswordAuth(user, message) {
    if (!user) throw new Error("Authentication did not return a user session.");
    await hydrateSessionFromAuthUser(user);
    showAuthStep("success");
    const panel = document.getElementById("auth-step-success");
    if (panel) panel.classList.add("success-pop-in");
    setTimeout(() => {
      closeAuthModal();
      showToast("Signed In", message + ", " + (AppState.currentUser ? AppState.currentUser.name : "Scholar") + "!");
      navigateTo(isNewsPublisher() ? "admin" : "dashboard");
    }, 700);
  }

  async function handlePasswordSignIn(e) {
    e.preventDefault();
    const email = document.getElementById("auth-password-email")?.value.trim() || "";
    const password = document.getElementById("auth-password-input")?.value || "";
    if (!validateEmail(email) || !password) { alert("Enter a valid email address and your password."); return; }
    if (!window.SupabaseService || !window.SupabaseService.isReady()) { showToast("Setup Needed", "Supabase is not configured."); return; }
    const btn = document.getElementById("btn-password-signin");
    setButtonLoading(btn, "Signing in…");
    try {
      const data = await window.SupabaseService.signInWithPassword(email, password);
      await completePasswordAuth(data.user, "Welcome back");
    } catch (err) { alert(err.message || "Sign-in failed. Check your email and password."); }
    finally { clearButtonLoading(btn); }
  }

  async function handlePasswordRecoveryRequest() {
    const email = document.getElementById("auth-password-email")?.value.trim() || "";
    if (!validateEmail(email)) { alert("Enter focalforges@gmail.com (or the account email) in the email field first."); return; }
    if (!window.SupabaseService || !window.SupabaseService.isReady()) { showToast("Setup Needed", "Supabase is not configured."); return; }
    const btn = document.getElementById("btn-password-recovery");
    if (btn) btn.disabled = true;
    try {
      await window.SupabaseService.requestPasswordRecovery(email);
      alert("If an account exists for that email, a recovery link has been sent. Open it on the deployed IATS CONNECT website, not localhost.");
    } catch (err) { alert(err.message || "Could not send the recovery email."); }
    finally { if (btn) btn.disabled = false; }
  }

  async function handlePasswordRecoverySubmit(e) {
    e.preventDefault();
    const password = document.getElementById("auth-new-password")?.value || "";
    const confirm = document.getElementById("auth-confirm-password")?.value || "";
    if (password.length < 8) { alert("Use a password of at least 8 characters."); return; }
    if (password !== confirm) { alert("The passwords do not match."); return; }
    const btn = document.getElementById("btn-save-new-password");
    setButtonLoading(btn, "Saving password…");
    try {
      const user = await window.SupabaseService.updatePassword(password);
      document.getElementById("form-password-recovery")?.reset();
      const url = new URL(window.location.href);
      url.searchParams.delete("password-recovery"); url.hash = "";
      window.history.replaceState({}, document.title, url.pathname + url.search);
      await completePasswordAuth(user, "Password updated");
    } catch (err) { alert(err.message || "Could not update password. Request a fresh recovery link and try again."); }
    finally { clearButtonLoading(btn); }
  }

  async function handlePasswordSignUp() {
    const email = document.getElementById("auth-password-email")?.value.trim() || "";
    const password = document.getElementById("auth-password-input")?.value || "";
    if (!validateEmail(email) || password.length < 8) { alert("Enter a valid email and a password of at least 8 characters."); return; }
    const btn = document.getElementById("btn-password-signup");
    setButtonLoading(btn, "Creating account…");
    try {
      const data = await window.SupabaseService.signUpWithPassword(email, password);
      if (data.session && data.user) await completePasswordAuth(data.user, "Account created");
      else alert("Account request received. Supabase requires email confirmation for new accounts. Check your inbox, or disable email confirmations in Supabase for a presentation demo.");
    } catch (err) { alert(err.message || "Could not create the account."); }
    finally { clearButtonLoading(btn); }
  }

  // Requests a REAL 6-digit code emailed by Supabase Auth. No code is ever
  // generated, stored, or shown in the browser.
  async function handleEmailOTPRequest(e) {
    e.preventDefault();
    const emailInput = document.getElementById("auth-email-input");
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email || !validateEmail(email)) {
      alert("Please enter a valid personal email address (e.g. name@gmail.com, name@outlook.com, etc.).");
      return;
    }
    if (!window.SupabaseService || !window.SupabaseService.isReady()) {
      showToast("Setup Needed", "Add your Supabase project URL + anon key in js/supabase-config.js first.");
      return;
    }

    const submitBtn = document.getElementById("btn-send-otp");
    setButtonLoading(submitBtn, "Sending…");
    try {
      await window.SupabaseService.requestEmailOtp(email);
      AppState.pendingEmail = email;
      showAuthStep("otp");
      const sentDisplay = document.getElementById("otp-sent-email-display");
      if (sentDisplay) sentDisplay.textContent = email;
      startOtpCountdown();
      showToast("Check Your Inbox", `A real verification code was emailed to ${email}.`);
    } catch (err) {
      alert(err.message || "Could not send the verification email. Please try again.");
    } finally {
      clearButtonLoading(submitBtn);
    }
  }

  function startOtpCountdown() {
    clearInterval(AppState.otpTimer);
    AppState.otpSecondsRemaining = 60;
    const timerElem = document.getElementById("otp-countdown-timer");
    const resendBtn = document.getElementById("btn-resend-otp");

    if (resendBtn) resendBtn.disabled = true;

    AppState.otpTimer = setInterval(() => {
      AppState.otpSecondsRemaining--;
      if (timerElem) timerElem.textContent = `${AppState.otpSecondsRemaining}s`;

      if (AppState.otpSecondsRemaining <= 0) {
        clearInterval(AppState.otpTimer);
        if (timerElem) timerElem.textContent = "Expired";
        if (resendBtn) resendBtn.disabled = false;
      }
    }, 1000);
  }

  async function verifyOtpCode() {
    const inputs = document.querySelectorAll(".otp-digit-box");
    let enteredCode = "";
    inputs.forEach(input => enteredCode += input.value);

    if (enteredCode.length !== 6) {
      alert("Please enter the complete 6-digit verification code.");
      return;
    }
    if (!AppState.pendingEmail) {
      alert("Something went wrong — please request a new code.");
      showAuthStep("main");
      return;
    }

    const verifyBtn = document.getElementById("btn-verify-otp");
    setButtonLoading(verifyBtn, "Verifying…");
    try {
      const session = await window.SupabaseService.verifyEmailOtp(AppState.pendingEmail, enteredCode);
      clearInterval(AppState.otpTimer);
      if (session && session.user) {
        await hydrateSessionFromAuthUser(session.user);
      }
      showAuthStep("success");
      const successPanel = document.getElementById("auth-step-success");
      if (successPanel) successPanel.classList.add("success-pop-in");

      setTimeout(() => {
        closeAuthModal();
        showToast("Account Activated", `Welcome to IATS CONNECT, ${AppState.currentUser ? AppState.currentUser.name : "Scholar"}!`);
        navigateTo("dashboard");
      }, 1000);
    } catch (err) {
      alert(err.message || "That code didn't match. Please check your email and try again.");
    } finally {
      clearButtonLoading(verifyBtn);
    }
  }

  // ==========================================
  // Tiny loading-state helpers (UX only — markup/labels are preserved)
  // ==========================================
  function setButtonLoading(btn, label) {
    if (!btn) return;
    if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-inline-spinner"></span><span>${label || "Working…"}</span>`;
  }

  function clearButtonLoading(btn) {
    if (!btn) return;
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.originalHtml;
    }
    btn.disabled = false;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ==========================================
  // Dashboard Logic View (Feed)
  // ==========================================
  function renderDashboardView() {
    const userBanner = document.getElementById("dash-user-welcome");
    if (userBanner && AppState.currentUser) {
      userBanner.textContent = `Welcome back, ${AppState.currentUser.name}!`;
    }

    // Render Quick Academic Events in Dashboard
    const quickCatchupList = document.getElementById("dash-catchup-preview");
    if (quickCatchupList) {
      if (AppState.catchups.length === 0) {
        quickCatchupList.innerHTML = `
          <div class="glass-panel" style="padding: 24px; text-align: center;">
            <div style="font-weight: 700; font-size: 0.95rem; color: #1E293B; margin-bottom: 4px;">No Scheduled Academic Events</div>
            <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Host a study sprint, lecture discussion, or departmental seminar on campus.</p>
            <button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openHostCatchupModal()">
              <span>+ Host First Event</span>
            </button>
          </div>
        `;
      } else {
        const dashboardItems = [...AppState.catchups].sort((a, b) => Number(Boolean(b.is_official) || isCampusNewsItem(b)) - Number(Boolean(a.is_official) || isCampusNewsItem(a)) || Number(isCampusNewsItem(b)) - Number(isCampusNewsItem(a)) || Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0)).slice(0, 2);
        quickCatchupList.innerHTML = dashboardItems.map(c => {
          if (isCampusNewsItem(c)) {
            const unread = (AppState.unreadNewsIds || []).some(id => String(id) === String(c.id));
            return `
          <div class="glass-panel campus-news-dashboard-card" data-news-id="${c.id}" style="padding: 16px; margin-bottom: 12px; cursor:pointer; border-left:4px solid ${unread ? '#D8232A' : '#CBD5E1'};" role="button" tabindex="0" aria-label="Read campus news: ${escapeEventText(c.title || 'Campus News')}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div style="font-weight:700;font-size:.94rem;color:#1E293B;">${escapeEventText(c.title || 'Campus News')}</div>
              ${unread ? '<span class="news-unread-pill">NEW</span>' : '<span style="font-size:.78rem;color:#64748B;">NEWS</span>'}
            </div>
            <p style="font-size:.84rem;color:#475569;margin:8px 0 0;">${escapeEventText(String(c.description || '').slice(0,140))}${String(c.description || '').length > 140 ? '…' : ''}</p>
            <div style="font-size:.8rem;color:#D8232A;font-weight:700;margin-top:10px;">Read full news →</div>
          </div>`;
          }
          return `
          <div class="glass-panel" style="padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${resolveAssetUrl(c.hostAvatar || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="host">
              <div>
                <div style="font-weight: 700; font-size: 0.94rem; color: #1E293B;">${c.title}</div>
                <div style="font-size: 0.82rem; color: #64748B; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  ${ICONS.pin} <span>${c.location}</span> • <b>${c.time}</b>
                </div>
                <div style="font-size:.78rem;font-weight:700;color:#D8232A;margin-top:5px;display:flex;align-items:center;gap:6px;">
                  <span class="tag-pill tag-pill-blue" data-event-status-label>${eventStatus(c) === "live" ? "LIVE NOW" : eventStatus(c) === "past" ? "PAST" : "UPCOMING"}</span>
                  <span data-event-countdown data-event-status="${eventStatus(c)}" data-start-iso="${getEventStart(c) || ""}" data-end-iso="${getEventEnd(c) || ""}">${formatEventCountdown(getEventStart(c), getEventEnd(c))}</span>
                </div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
              <span style="font-size:.78rem;color:#64748B;text-align:right;">${c.maxAttendees == null && c.max_attendees == null ? Number(c.attendees || 0) + " registered · Unlimited spots" : Number(c.attendees || 0) + " registered · " + Math.max(0, Number(c.maxAttendees ?? c.max_attendees) - Number(c.attendees || 0)) + " spots remaining"}</span>
              <button class="btn-liquid ${c.isJoined ? 'btn-glass' : 'btn-primary'} btn-sm btn-join-catchup" data-id="${c.id}" ${(!c.isJoined && ((c.registration_deadline && Date.now() >= Date.parse(c.registration_deadline)) || ((c.maxAttendees ?? c.max_attendees) != null && Number(c.attendees || 0) >= Number(c.maxAttendees ?? c.max_attendees)) || eventStatus(c) === "past")) ? "disabled" : ""}>
                ${c.isJoined ? "Leave Event" : (c.registration_deadline && Date.now() >= Date.parse(c.registration_deadline)) ? "Registration Closed" : ((c.maxAttendees ?? c.max_attendees) != null && Number(c.attendees || 0) >= Number(c.maxAttendees ?? c.max_attendees)) ? "Event Full" : "Join Event"}
              </button>
            </div>
          </div>`;
        }).join("");

        quickCatchupList.querySelectorAll(".btn-join-catchup").forEach(btn => {
          btn.addEventListener("click", event => { event.stopPropagation(); toggleJoinCatchup(btn.dataset.id); });
        });
        quickCatchupList.querySelectorAll(".campus-news-dashboard-card").forEach(card => {
          const openNews = () => openCatchupDetails(card.dataset.newsId);
          card.addEventListener("click", openNews);
          card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openNews(); } });
        });
      }
    }

    // Render Trending Discussions in Dashboard
    const dashHubPreview = document.getElementById("dash-hub-preview");
    if (dashHubPreview) {
      if (AppState.hubPosts.length === 0) {
        dashHubPreview.innerHTML = `
          <div class="glass-panel" style="padding: 24px; text-align: center;">
            <div style="font-weight: 700; font-size: 0.95rem; color: #1E293B; margin-bottom: 4px;">No Course Discussions Yet</div>
            <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Share lecture notes, ask coursework questions, or start an academic forum thread.</p>
            <button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openCreatePostModal()">
              <span>+ Create Discussion Post</span>
            </button>
          </div>
        `;
      } else {
        dashHubPreview.innerHTML = AppState.hubPosts.slice(0, 2).map(p => `
          <div class="glass-panel" style="padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${resolveAssetUrl(p.authorAvatar || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" alt="author">
                <span style="font-weight: 700; font-size: 0.85rem; color: #1E293B;">${p.author}</span>
              </div>
              <span class="tag-pill tag-pill-highlight" style="font-size: 0.75rem;">${(p.category || 'TECH').toUpperCase()}</span>
            </div>
            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: #1E293B;">${p.title}</div>
            <div style="font-size: 0.84rem; color: #475569; margin-bottom: 10px;">${p.content ? p.content.substring(0, 110) + '...' : ''}</div>
            <div style="display: flex; align-items: center; gap: 14px; font-size: 0.8rem; color: #64748B;">
              <span style="color: #D8232A; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                ${ICONS.upvote} ${p.upvotes || 0} Upvotes
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                ${ICONS.chat} ${p.commentsCount || 0} Discussions
              </span>
            </div>
          </div>
        `).join("");
      }
    }

    // Show the profile-creation CTA only when the signed-in account has no
    // scholar-directory record. The main profiles row alone is not a scholar profile.
    const scholarProfileButton = document.getElementById("dash-add-scholar-profile");
    const scholarProfileSidebarButton = document.getElementById("dash-add-scholar-profile-sidebar");
    if (scholarProfileButton || scholarProfileSidebarButton) {
      const user = AppState.currentUser;
      const signedInId = user?.id;
      const hasOwnDirectoryRecord = !!signedInId && AppState.matchProfiles.some(
        profile => String(profile.owner_id || profile.user_id || profile.id || "") === String(signedInId)
      );
      // The public directory subscription can omit the current user's own row
      // (RLS/public-directory filtering). A complete saved course + cohort on
      // the authenticated profile is also authoritative evidence of setup.
      const hasSavedCourse = !!String(user?.major || "").trim();
      const hasSavedCohort = IATS_COHORTS.includes(String(user?.year || user?.cohort || "").trim());
      const hasStudyBuddyResults = getActiveBuddyProfiles().length > 0;
      const hasScholarProfile = hasOwnDirectoryRecord || (hasSavedCourse && hasSavedCohort) || hasStudyBuddyResults;
      [scholarProfileButton, scholarProfileSidebarButton].filter(Boolean).forEach(button => {
        button.hidden = !signedInId || hasScholarProfile;
        button.setAttribute("aria-hidden", String(button.hidden));
      });
    }

    // Study partner radar status
    const radarText = document.getElementById("dash-match-radar-text");
    if (radarText) {
      const count = AppState.matchProfiles.length;
      if (count === 0) {
        radarText.innerHTML = "Set up your course and cohort once to find classmates in your course community.";
      } else {
        radarText.innerHTML = `You have <b>${count} candidate study partner${count > 1 ? 's' : ''}</b> ready in the IATS directory.`;
      }
    }
  }

  // ==========================================
  // Study Partner & Buddy Engine Logic
  // ==========================================
  function escapeBuddyDirectoryText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function getBuddyCourseLabel(profile) {
    return String(profile.major || profile.course_name || profile.course || profile.course_code || "Course not specified");
  }

  function getBuddyCohortLabel(profile) {
    return String(profile.year || profile.cohort || profile.intake || "Cohort not specified");
  }

  function renderMatchView() {
    const container = document.getElementById("match-card-container");
    if (!container) return;

    const currentUser = AppState.currentUser;
    const buddyProfiles = getActiveBuddyProfiles().slice().sort((a, b) => {
      const ownCourse = String(currentUser?.major || "").trim().toLowerCase();
      const aSameCourse = getBuddyCourseLabel(a).trim().toLowerCase() === ownCourse ? 0 : 1;
      const bSameCourse = getBuddyCourseLabel(b).trim().toLowerCase() === ownCourse ? 0 : 1;
      return aSameCourse - bSameCourse || String(a.name || "").localeCompare(String(b.name || ""));
    });

    if (!currentUser) {
      container.innerHTML = `
        <div class="glass-panel buddy-directory-empty">
          <div class="buddy-directory-empty-icon">${ICONS.users}</div>
          <h3>Find your study community</h3>
          <p>Sign in to browse fellow IATS students and connect with classmates for academic collaboration.</p>
          <button type="button" class="btn-liquid btn-primary" id="btn-buddy-sign-in">Sign in to continue</button>
        </div>`;
      const signInButton = document.getElementById("btn-buddy-sign-in");
      if (signInButton) signInButton.addEventListener("click", openAuthModal);
      return;
    }

    if (buddyProfiles.length === 0) {
      container.innerHTML = `
        <div class="glass-panel buddy-directory-empty">
          <div class="buddy-directory-empty-icon">${ICONS.users}</div>
          <h3>No students to show just yet</h3>
          <p>There are no other student profiles in the directory yet. As more IATS scholars complete their academic profiles, they will appear here.</p>
        </div>`;
      return;
    }

    const courses = [...new Set(buddyProfiles.map(getBuddyCourseLabel).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const cohorts = [...new Set(buddyProfiles.map(getBuddyCohortLabel).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const cards = buddyProfiles.map((student, index) => {
      const name = escapeBuddyDirectoryText(student.name || "IATS Student");
      const course = escapeBuddyDirectoryText(getBuddyCourseLabel(student));
      const cohort = escapeBuddyDirectoryText(getBuddyCohortLabel(student));
      const bio = escapeBuddyDirectoryText(student.bio || "This student has not added a study introduction yet.");
      const avatar = escapeBuddyDirectoryText(resolveAssetUrl(student.avatar || DEFAULT_AVATAR_PLACEHOLDER));
      const interests = (Array.isArray(student.interests) ? student.interests : [])
        .slice(0, 5)
        .map(item => `<span class="buddy-interest-tag">${escapeBuddyDirectoryText(item)}</span>`)
        .join("");
      const searchText = escapeBuddyDirectoryText([
        student.name, getBuddyCourseLabel(student), getBuddyCohortLabel(student),
        student.bio, ...(Array.isArray(student.interests) ? student.interests : [])
      ].join(" ").toLowerCase());
      return `
        <article class="buddy-directory-card" data-search="${searchText}" data-course="${course.toLowerCase()}" data-cohort="${cohort.toLowerCase()}">
          <img class="buddy-directory-avatar" src="${avatar}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';">
          <div class="buddy-directory-main">
            <div class="buddy-directory-name-row">
              <h3>${name}</h3>
              <span class="buddy-directory-label">IATS scholar</span>
            </div>
            <p class="buddy-directory-academic">${course} <span aria-hidden="true">·</span> Cohort ${cohort}</p>
            <p class="buddy-directory-bio">${bio}</p>
            ${interests ? `<div class="buddy-interest-list" aria-label="Academic interests">${interests}</div>` : ""}
          </div>
          <div class="buddy-directory-actions">
            <button type="button" class="btn-liquid btn-primary btn-sm buddy-message-button" data-buddy-index="${index}">${ICONS.chat}<span>Message about studying</span></button>
          </div>
        </article>`;
    }).join("");

    container.innerHTML = `
      <div class="buddy-directory">
        <div class="buddy-directory-heading">
          <div>
            <p class="buddy-directory-eyebrow">ACADEMIC CONNECTIONS</p>
            <h2>Find your Study Buddies</h2>
            <p>Browse fellow scholars at your own pace. Find classmates, discover shared interests and start an academic conversation.</p>
          </div>
          <div class="buddy-directory-count"><strong id="buddy-directory-visible-count">${buddyProfiles.length}</strong><span>students</span></div>
        </div>
        <div class="buddy-directory-filters" role="search">
          <label class="buddy-search-field">
            <span class="sr-only">Search students</span>
            <span aria-hidden="true">${ICONS.users}</span>
            <input id="buddy-directory-search" type="search" placeholder="Search by name, course or interest" autocomplete="off">
          </label>
          <label>
            <span>Course</span>
            <select id="buddy-directory-course">
              <option value="">All courses</option>
              ${courses.map(course => `<option value="${escapeBuddyDirectoryText(course.toLowerCase())}">${escapeBuddyDirectoryText(course)}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Cohort</span>
            <select id="buddy-directory-cohort">
              <option value="">All cohorts</option>
              ${cohorts.map(cohort => `<option value="${escapeBuddyDirectoryText(cohort.toLowerCase())}">${escapeBuddyDirectoryText(cohort)}</option>`).join("")}
            </select>
          </label>
        </div>
        <p class="buddy-directory-results-note" id="buddy-directory-results-note">Showing all ${buddyProfiles.length} students. No likes or dislikes—just browse and connect.</p>
        <div class="buddy-directory-list" id="buddy-directory-list">${cards}</div>
        <div class="buddy-directory-empty buddy-directory-filter-empty" id="buddy-directory-filter-empty" hidden>
          <h3>No students match those filters</h3>
          <p>Try another search or clear one of the filters.</p>
          <button type="button" class="btn-liquid btn-glass btn-sm" id="btn-buddy-clear-filters">Clear filters</button>
        </div>
      </div>`;

    const searchInput = document.getElementById("buddy-directory-search");
    const courseSelect = document.getElementById("buddy-directory-course");
    const cohortSelect = document.getElementById("buddy-directory-cohort");
    const clearButton = document.getElementById("btn-buddy-clear-filters");
    const applyFilters = () => {
      const query = String(searchInput?.value || "").trim().toLowerCase();
      const course = String(courseSelect?.value || "").toLowerCase();
      const cohort = String(cohortSelect?.value || "").toLowerCase();
      const cardElements = [...container.querySelectorAll(".buddy-directory-card")];
      let visible = 0;
      cardElements.forEach(card => {
        const matches = (!query || (card.dataset.search || "").includes(query)) &&
          (!course || (card.dataset.course || "") === course) &&
          (!cohort || (card.dataset.cohort || "") === cohort);
        card.hidden = !matches;
        if (matches) visible++;
      });
      const count = document.getElementById("buddy-directory-visible-count");
      const note = document.getElementById("buddy-directory-results-note");
      const empty = document.getElementById("buddy-directory-filter-empty");
      if (count) count.textContent = String(visible);
      if (note) note.textContent = `Showing ${visible} of ${buddyProfiles.length} students. No likes or dislikes—just browse and connect.`;
      if (empty) empty.hidden = visible !== 0;
    };
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (courseSelect) courseSelect.addEventListener("change", applyFilters);
    if (cohortSelect) cohortSelect.addEventListener("change", applyFilters);
    if (clearButton) clearButton.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (courseSelect) courseSelect.value = "";
      if (cohortSelect) cohortSelect.value = "";
      applyFilters();
    });

    container.querySelectorAll(".buddy-message-button").forEach(button => {
      button.addEventListener("click", () => {
        const student = buddyProfiles[Number(button.dataset.buddyIndex)];
        if (student) startChatWithStudent(student);
      });
    });
  }

  function showMatchSuccessModal(student) {
    const modal = document.getElementById("match-success-modal");
    if (!modal) return;

    const nameElem = document.getElementById("match-modal-name");
    if (nameElem) nameElem.textContent = student.name;
    const avatarElem = document.getElementById("match-modal-avatar");
    if (avatarElem) {
      avatarElem.src = resolveAssetUrl(student.avatar || DEFAULT_AVATAR_PLACEHOLDER);
      avatarElem.onerror = () => { avatarElem.src = "./images/scholar_female.jpg"; };
    }
    modal.classList.add("open");

    const msgBtn = document.getElementById("btn-match-message-now");
    if (msgBtn) {
      msgBtn.onclick = () => {
        modal.classList.remove("open");
        AppState.currentMatchIndex++;
        startChatWithStudent(student);
      };
    }

    const keepBtn = document.getElementById("btn-match-keep-browsing");
    if (keepBtn) {
      keepBtn.onclick = () => {
        modal.classList.remove("open");
        AppState.currentMatchIndex++;
        renderMatchView();
      };
    }
  }

  async function startChatWithStudent(student) {
    if (!AppState.currentUser) { openAuthModal(); return; }
    const recipientId = student && (student.owner_id || student.id);
    if (!recipientId) { showToast("Cannot Open Chat", "This study buddy does not have a linked account ID."); return; }
    try {
      // Always ask Supabase for the canonical direct thread; never create a local/fake conversation.
      const conv = await window.SupabaseService.createConversation({
        recipientId,
        recipientName: student.name || "IATS Scholar",
        major: student.major || "IATS Scholar",
        firstMessage: "",
        avatar: student.avatar || student.avatar_url || DEFAULT_AVATAR_PLACEHOLDER
      });
      if (!conv) throw new Error("Could not open this scholar's conversation. Please try again.");
      if (!AppState.conversations.some(c => String(c.id) === String(conv.id))) AppState.conversations.unshift(conv);
      AppState.activeChatId = conv.id;
      startActiveMessagesSync(conv.id);
      navigateTo("chats");
    } catch (error) {
      console.error("[IATS CONNECT] Could not open Study Buddy chat:", error);
      showToast("Chat Unavailable", error.message || "Could not open this scholar's chat.");
    }
  }

  // Create Profile Modal
  function openCreateProfileModal() {
    const user = AppState.currentUser;
    if (!user || isNewsPublisher()) { showToast("Sign In Required", "Sign in with your scholar account first."); return; }
    if (user.major && IATS_COURSES.some(c => c.name === user.major) && IATS_COHORTS.includes(user.year)) { showToast("Profile Already Saved", "Your scholar profile is already saved. Use Edit Scholar Profile to change it."); navigateTo("profile"); return; }
    const modal = document.getElementById("create-profile-modal");
    const name = document.getElementById("new-student-name"); if (name) name.value = user.name || "";
    if (modal) modal.classList.add("open");
  }

  function closeCreateProfileModal() {
    const modal = document.getElementById("create-profile-modal");
    if (modal) modal.classList.remove("open");
  }

  async function handleCreateProfile(e) {
    e.preventDefault(); const user = AppState.currentUser;
    if (!user || !window.SupabaseService) { showToast("Sign In Required", "Please sign in first."); return; }
    const name = document.getElementById("new-student-name").value.trim();
    const courseName = document.getElementById("new-student-courses").value.trim();
    const cohort = document.getElementById("new-student-year").value;
    const location = document.getElementById("new-student-location").value.trim() || "IATS Main Campus";
    const bio = document.getElementById("new-student-bio").value.trim();
    const interests = document.getElementById("new-student-interests").value.split(",").map(x=>x.trim()).filter(Boolean).slice(0,6);
    const course = IATS_COURSES.find(c=>c.name===courseName);
    if (!name || !course || !IATS_COHORTS.includes(cohort)) { alert("Choose an official course from the suggestions and select cohort 1.1, 1.2, 2.1 or 2.2."); return; }
    if (!validateAcademicContent({name,major:course.name,year:cohort,courses:course.name,location,bio,interests:interests.join(",")}, "Scholar Profile")) return;
    const updated = {...user,name,major:course.name,year:cohort,courses:[course.name],location,bio,interests,skills:interests};
    const saved = await window.SupabaseService.saveUser(updated);
    if (!saved) { showToast("Profile Not Saved","Could not save the profile. Please try again."); return; }
    AppState.currentUser = {...updated,avatar:saved.avatar_url || updated.avatar};
    try { const buddy = await window.SupabaseService.upsertMatchProfile({...updated,owner_id:user.id,course_code:course.code,cohort,is_former_student:false}); if (buddy) AppState.matchProfiles=[buddy,...AppState.matchProfiles.filter(p=>p.owner_id!==user.id)]; }
    catch(err) { console.error("Study Buddy sync failed",err); showToast("Profile Saved","Account profile saved; Study Buddy sync could not complete yet."); }
    closeCreateProfileModal(); const form=document.getElementById("create-profile-form"); if(form) form.reset();
    renderNavigation(); renderProfileView(); renderMatchView(); showToast("Scholar Profile Saved","Your profile is now saved to your account and reused across the platform.");
  }

  // ==========================================
  // Academic Events & News (CatchUp) Logic
  // ==========================================
  function eventStatusFromTimes(startValue, endValue, now = Date.now()) {
    const start = startValue ? Date.parse(startValue) : NaN;
    const end = endValue ? Date.parse(endValue) : NaN;
    if (!Number.isFinite(start)) return "upcoming";
    if (now < start) return "upcoming";
    if (Number.isFinite(end) && now >= end) return "past";
    return "live";
  }

  function getEventStart(event) { return event.event_starts_at || event.eventStartsAt || null; }
  function getEventEnd(event) { return event.event_ends_at || event.eventEndsAt || null; }
  function eventStatus(event, now = Date.now()) { return eventStatusFromTimes(getEventStart(event), getEventEnd(event), now); }

  function escapeEventText(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  function formatEventDateTime(value) {
    if (!value) return "Date/time not set";
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Date/time not set";
  }

  function formatEventDuration(ms) {
    const totalMinutes = Math.max(0, Math.floor(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days) return days + "d " + hours + "h";
    if (hours) return hours + "h " + minutes + "m";
    if (minutes) return minutes + "m";
    return "less than a minute";
  }

  function formatEventCountdown(startValue, endValue, now = Date.now()) {
    const start = startValue ? Date.parse(startValue) : NaN;
    const end = endValue ? Date.parse(endValue) : NaN;
    if (!Number.isFinite(start)) return "Date/time not set";
    if (now < start) return "Starts in " + formatEventDuration(start - now);
    if (Number.isFinite(end) && now >= end) return "Ended";
    return Number.isFinite(end) ? "LIVE NOW · ends in " + formatEventDuration(end - now) : "LIVE NOW";
  }

  function renderCatchupCard(event) {
    const status = eventStatus(event);
    const start = getEventStart(event);
    const end = getEventEnd(event);
    const startMs = start && Number.isFinite(Date.parse(start)) ? Date.parse(start) : "";
    const endMs = end && Number.isFinite(Date.parse(end)) ? Date.parse(end) : "";
    const label = status === "live" ? "LIVE NOW" : status === "past" ? "PAST" : "UPCOMING";
    const avatar = resolveAssetUrl(event.hostAvatar || event.host_avatar || DEFAULT_AVATAR_PLACEHOLDER);
    const attendeeCount = Number(event.attendees || 0);
    const capacity = event.maxAttendees ?? event.max_attendees;
    const remaining = capacity == null ? null : Math.max(0, Number(capacity) - attendeeCount);
    const attendees = capacity == null ? attendeeCount + " registered · Unlimited capacity" : attendeeCount + "/" + Number(capacity) + " registered · " + remaining + " spots remaining";
    const format = String(event.event_format || "physical");
    const formatLabel = format === "online" ? "Online" : format === "hybrid" ? "Hybrid · Physical + Online" : "Physical";
    const deadline = event.registration_deadline ? Date.parse(event.registration_deadline) : NaN;
    const deadlinePassed = Number.isFinite(deadline) && Date.now() >= deadline;
    const full = capacity != null && remaining <= 0;
    const canRegister = status !== "past" && !deadlinePassed && !full;
    const meetingUrl = /^https?:\/\//i.test(String(event.online_url || "")) ? String(event.online_url) : "";
    const bannerUrl = /^https?:\/\//i.test(String(event.banner_url || "")) ? String(event.banner_url) : "";
    const isHost = !!AppState.currentUser && String(event.host_id || "") === String(AppState.currentUser.id);
    const registrationLabel = event.isJoined ? "Leave Event" : deadlinePassed ? "Registration Closed" : full ? "Event Full" : "Join Event";
    return "<article class='glass-panel catchup-card' style='display:flex;flex-direction:column;justify-content:space-between;gap:16px;'>"
      + "<div><div style='display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap;'>"
      + "<span class='tag-pill tag-pill-highlight'>" + escapeEventText(event.tag || "Academic Event") + "</span>"
      + "<span class='tag-pill " + (status === "live" ? "tag-pill-highlight" : "tag-pill-blue") + "' data-event-status-label>" + label + "</span></div>"
      + (bannerUrl ? (/\.(mp4|webm|mov)(?:$|[?#])/i.test(bannerUrl) ? "<video src='" + escapeEventText(bannerUrl) + "' controls preload='metadata' playsinline style='width:100%;max-height:260px;border-radius:14px;margin-bottom:12px;background:#0f172a;'></video>" : "<img src='" + escapeEventText(bannerUrl) + "' alt='Event poster' loading='lazy' style='width:100%;height:170px;object-fit:cover;border-radius:14px;margin-bottom:12px;'>") : "")
      + "<div style='font-size:.82rem;font-weight:700;color:#D8232A;margin-bottom:10px;' data-event-countdown data-event-status='" + status + "' data-start-iso='" + escapeEventText(start || "") + "' data-end-iso='" + escapeEventText(end || "") + "' data-start-ms='" + startMs + "' data-end-ms='" + endMs + "'>"
      + formatEventCountdown(start, end) + "</div>"
      + "<h3 style='font-size:1.15rem;font-weight:700;color:#1E293B;line-height:1.35;margin-bottom:6px;'>" + escapeEventText(event.title) + "</h3>"
      + (event.description ? "<p style='font-size:.88rem;color:#475569;line-height:1.55;margin:0 0 10px;white-space:pre-wrap;'>" + escapeEventText(event.description) + "</p>" : "")
      + "<div style='color:#64748B;font-size:.86rem;margin-bottom:6px;'>" + ICONS.pin + " " + escapeEventText(event.location || (format === "online" ? "Online event" : "Location not set")) + "</div>"
      + "<div style='font-size:.8rem;font-weight:700;color:#475569;margin-bottom:6px;'>" + escapeEventText(formatLabel) + "</div>"
      + "<div style='font-size:.86rem;color:#64748B;margin-bottom:8px;'>" + ICONS.clock + " " + escapeEventText(formatEventDateTime(start) === "Date/time not set" ? (event.time || event.event_time || "Date/time not set") : formatEventDateTime(start))
      + (end ? " – " + escapeEventText(new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) : "") + "</div>"
      + "<div style='font-size:.8rem;color:#64748B;'>" + escapeEventText(attendees) + "</div>"
      + (Number.isFinite(deadline) ? "<div style='font-size:.8rem;color:" + (deadlinePassed ? "#B91C1C" : "#64748B") + ";margin-top:6px;'>Registration deadline: " + escapeEventText(formatEventDateTime(event.registration_deadline)) + (deadlinePassed ? " · Closed" : "") + "<div data-registration-countdown data-deadline-ms='" + deadline + "' data-deadline-state='" + (deadlinePassed ? "closed" : "open") + "' style='font-weight:700;margin-top:3px;'>" + (deadlinePassed ? "Registration closed" : formatEventCountdown(event.registration_deadline, null, Date.now())) + "</div></div>" : "")
      + (meetingUrl && format !== "physical" ? "<div style='margin-top:8px;'><a href='" + escapeEventText(meetingUrl) + "' target='_blank' rel='noopener noreferrer'>Open online meeting link ↗</a></div>" : "") + "</div>"
      + "<div class='catchup-attendees'><div style='display:flex;align-items:center;gap:8px;'>"
      + "<img src='" + avatar + "' onerror=\"this.onerror=null;this.src='" + DEFAULT_AVATAR_PLACEHOLDER + "';\" style='width:32px;height:32px;border-radius:50%;object-fit:cover;' alt='Host'>"
      + "<span style='font-size:.82rem;font-weight:500;'>Host: <b>" + escapeEventText(event.host || "IATS Scholar") + "</b>" + (isHost ? "<span style='display:block;font-size:.75rem;color:#D8232A;'>" + attendeeCount + " registration" + (attendeeCount === 1 ? "" : "s") + " so far</span>" : "") + "</span></div>"
      + "<div style='display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;'>"
      + (isHost ? "<button class='btn-liquid btn-glass btn-sm btn-host-edit-event' data-id='" + escapeEventText(event.id) + "' type='button'>Manage Event</button>" : "")
      + "<button class='btn-liquid " + (event.isJoined ? "btn-glass" : "btn-primary") + " btn-sm btn-catchup-toggle' data-id='" + escapeEventText(event.id) + "' " + (!event.isJoined && !canRegister ? "disabled" : "") + ">"
      + registrationLabel + "</button></div></div></article>";
  }

  function isCampusNewsItem(item) {
    return String(item?.item_type || "").toLowerCase() === "news" ||
      String(item?.tag || "").toLowerCase().replace(/\s+/g, "") === "campusnews";
  }

  function renderCampusNewsCard(item) {
    const description = String(item.description || "");
    const excerpt = description.length > 240 ? description.slice(0, 240).trimEnd() + "…" : description;
    const unread = (AppState.unreadNewsIds || []).some(id => String(id) === String(item.id));
    return "<article class='glass-panel catchup-card campus-news-card " + (unread ? "campus-news-unread" : "") + "' style='cursor:pointer;display:flex;flex-direction:column;gap:14px;' data-open-details='" + escapeEventText(item.id) + "'>"
      + "<div style='display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;'><span class='tag-pill tag-pill-highlight'>OFFICIAL CAMPUS NEWS</span><span style='font-size:.78rem;color:#64748B;'>" + (unread ? "<span class='news-unread-pill'>NEW</span> " : "") + escapeEventText(formatEventDateTime(item.created_at)) + "</span></div>"
      + "<h3 style='font-size:1.16rem;font-weight:800;color:#1E293B;line-height:1.35;margin:0;'>" + escapeEventText(item.title || "Campus News") + "</h3>"
      + "<p style='font-size:.9rem;color:#475569;line-height:1.6;margin:0;white-space:pre-wrap;'>" + escapeEventText(excerpt || "Open to read the full announcement.") + "</p>"
      + "<div style='display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:auto;padding-top:12px;border-top:1px solid rgba(148,163,184,.22);'><span style='font-size:.82rem;color:#64748B;'>Published by " + escapeEventText(item.host || "IATS CONNECT") + "</span><button type='button' class='btn-liquid btn-glass btn-sm btn-open-catchup-details' data-id='" + escapeEventText(item.id) + "'>Read full news →</button></div></article>";
  }

  function renderCatchupCard(event) {
    const status = eventStatus(event), start = getEventStart(event), end = getEventEnd(event);
    const startMs = start && Number.isFinite(Date.parse(start)) ? Date.parse(start) : "";
    const endMs = end && Number.isFinite(Date.parse(end)) ? Date.parse(end) : "";
    const label = status === "live" ? "LIVE NOW" : status === "past" ? "PAST" : "UPCOMING";
    const format = String(event.event_format || "physical");
    const formatLabel = format === "online" ? "Online" : format === "hybrid" ? "Physical + Online" : "Physical";
    const count = Number(event.attendees || 0);
    const attendees = event.max_attendees == null ? count + " registered" : count + "/" + event.max_attendees + " registered";
    const deadline = event.registration_deadline ? Date.parse(event.registration_deadline) : NaN;
    const registrationClosed = Number.isFinite(deadline) && Date.now() > deadline;
    const onlineUrl = /^https?:\/\//i.test(String(event.online_url || "")) ? String(event.online_url) : "";
    const description = String(event.description || "");
    const excerpt = description.length > 200 ? description.slice(0, 200).trimEnd() + "…" : description;
    return "<article class='glass-panel catchup-card' data-open-details='" + escapeEventText(event.id) + "' style='cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;gap:14px;'>"
      + "<div><div style='display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap;'><span class='tag-pill tag-pill-highlight'>" + escapeEventText(event.tag || "Academic Event") + "</span><span class='tag-pill " + (status === "live" ? "tag-pill-highlight" : "tag-pill-blue") + "' data-event-status-label>" + label + "</span></div>"
      + "<div style='font-size:.82rem;font-weight:700;color:#D8232A;margin-bottom:10px;' data-event-countdown data-event-status='" + status + "' data-start-iso='" + escapeEventText(start || "") + "' data-end-iso='" + escapeEventText(end || "") + "' data-start-ms='" + startMs + "' data-end-ms='" + endMs + "'>" + formatEventCountdown(start, end) + "</div>"
      + "<h3 style='font-size:1.15rem;font-weight:800;color:#1E293B;line-height:1.35;margin:0 0 7px;'>" + escapeEventText(event.title) + "</h3>"
      + (excerpt ? "<p style='font-size:.88rem;color:#475569;line-height:1.55;margin:0 0 10px;white-space:pre-wrap;'>" + escapeEventText(excerpt) + "</p>" : "")
      + "<div style='display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 10px;'><span class='tag-pill tag-pill-blue'>" + escapeEventText(formatLabel) + "</span><span class='tag-pill'>" + escapeEventText(attendees) + "</span></div>"
      + (format !== "online" && event.location ? "<div style='color:#64748B;font-size:.86rem;margin-bottom:6px;'>" + ICONS.pin + " " + escapeEventText(event.location) + "</div>" : "")
      + "<div style='font-size:.86rem;color:#64748B;margin-bottom:8px;'>" + ICONS.clock + " " + escapeEventText(formatEventDateTime(start)) + (end ? " – " + escapeEventText(new Date(end).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})) : "") + "</div>"
      + (event.registration_deadline ? "<div style='font-size:.82rem;color:" + (registrationClosed ? "#B91C1C" : "#64748B") + ";margin-bottom:8px;'>" + (registrationClosed ? "Registration closed" : "Register by") + ": " + escapeEventText(formatEventDateTime(event.registration_deadline)) + "</div>" : "")
      + "</div><div class='catchup-attendees' style='gap:10px;flex-wrap:wrap;'><div style='display:flex;align-items:center;gap:8px;min-width:0;'><img src='" + escapeEventText(resolveAssetUrl(event.hostAvatar || event.host_avatar || DEFAULT_AVATAR_PLACEHOLDER)) + "' onerror=\"this.onerror=null;this.src='" + DEFAULT_AVATAR_PLACEHOLDER + "';\" style='width:32px;height:32px;border-radius:50%;object-fit:cover;' alt='Host'><span style='font-size:.82rem;font-weight:500;'>Host: <b>" + escapeEventText(event.host || "IATS Scholar") + "</b></span></div>"
      + "<div style='display:flex;gap:8px;flex-wrap:wrap;'><button type='button' class='btn-liquid btn-glass btn-sm btn-open-catchup-details' data-id='" + escapeEventText(event.id) + "'>Full details</button>"
      + (onlineUrl && format !== "physical" ? "<a class='btn-liquid btn-glass btn-sm' href='" + escapeEventText(onlineUrl) + "' target='_blank' rel='noopener noreferrer'>Join online ↗</a>" : "")
      + "<button type='button' class='btn-liquid " + (event.isJoined ? "btn-glass" : "btn-primary") + " btn-sm btn-catchup-toggle' data-id='" + escapeEventText(event.id) + "' " + (status === "past" || (registrationClosed && !event.isJoined) ? "disabled" : "") + ">" + (event.isJoined ? "Cancel registration" : "Register") + "</button></div></div></article>";
  }

  function openCatchupDetails(id) {
    const item = AppState.catchups.find(entry => String(entry.id) === String(id)) || (AppState.adminEvents || []).find(entry => String(entry.id) === String(id));
    if (!item) return;
    let modal = document.getElementById("catchup-details-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "catchup-details-modal";
      modal.className = "modal-backdrop";
      modal.innerHTML = "<div class='modal-box' style='max-width:760px;max-height:86vh;overflow:auto;'><button type='button' class='modal-close-btn' id='btn-close-catchup-details' aria-label='Close'>✕</button><div id='catchup-details-content'></div></div>";
      document.body.appendChild(modal);
      modal.addEventListener("click", event => { if (event.target === modal) modal.classList.remove("open"); });
      modal.querySelector("#btn-close-catchup-details").addEventListener("click", () => modal.classList.remove("open"));
    }
    const news = isCampusNewsItem(item), format = String(item.event_format || "physical");
    if (news) markNewsRead(item.id);
    const url = /^https?:\/\//i.test(String(item.online_url || "")) ? String(item.online_url) : "";
    modal.querySelector("#catchup-details-content").innerHTML = "<span class='tag-pill " + (news ? "tag-pill-highlight" : "tag-pill-blue") + "'>" + (news ? "OFFICIAL CAMPUS NEWS" : escapeEventText(item.tag || "Academic Event")) + "</span>"
      + "<h2 style='font-size:1.55rem;font-weight:850;color:#1E293B;line-height:1.3;margin:14px 40px 10px 0;'>" + escapeEventText(item.title || "") + "</h2>"
      + "<div style='font-size:.86rem;color:#64748B;margin-bottom:18px;'>" + (news ? "Published " + escapeEventText(formatEventDateTime(item.created_at)) : "Hosted by " + escapeEventText(item.host || "IATS Scholar") + " · " + escapeEventText(formatEventDateTime(getEventStart(item)))) + "</div>"
      + (news ? "" : "<div style='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;'><span class='tag-pill tag-pill-blue'>" + escapeEventText(format === "online" ? "Online" : format === "hybrid" ? "Physical + Online" : "Physical") + "</span><span class='tag-pill'>" + escapeEventText(Number(item.attendees || 0) + " registered") + "</span></div>")
      + "<div style='font-size:.98rem;color:#334155;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;'>" + escapeEventText(item.description || "No additional details provided.") + "</div>"
      + (news ? "" : "<div style='margin-top:18px;color:#475569;line-height:1.7;'>" + (format !== "online" && item.location ? "<div><b>Location:</b> " + escapeEventText(item.location) + "</div>" : "") + (item.registration_deadline ? "<div><b>Registration deadline:</b> " + escapeEventText(formatEventDateTime(item.registration_deadline)) + "</div>" : "") + (url && format !== "physical" ? "<div style='margin-top:12px;'><a href='" + escapeEventText(url) + "' target='_blank' rel='noopener noreferrer'>Open online meeting link ↗</a></div>" : "") + "</div>");
    modal.classList.add("open");
  }

  function renderCatchUpView() {
    const grid = document.getElementById("catchup-grid-container");
    if (!grid) return;
    const all = AppState.catchups || [];
    const official = all.filter(item => Boolean(item.is_official) || isCampusNewsItem(item)).sort((a,b) => {
      if (isCampusNewsItem(a) !== isCampusNewsItem(b)) return isCampusNewsItem(a) ? -1 : 1;
      return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
    });
    const news = official.filter(isCampusNewsItem);
    const unreadNews = new Set((AppState.unreadNewsIds || []).map(String));
    const officialEvents = official.filter(item => !isCampusNewsItem(item));
    const groups = [{key:"live",title:"Live Now",events:[]},{key:"upcoming",title:"Upcoming Events",events:[]},{key:"past",title:"Past Events",events:[]}];
    all.filter(item => !Boolean(item.is_official) && !isCampusNewsItem(item)).forEach(event => groups.find(group => group.key === eventStatus(event)).events.push(event));
    groups.forEach(group => group.events.sort((a,b) => {
      const as = Date.parse(getEventStart(a) || ""), bs = Date.parse(getEventStart(b) || "");
      if (!Number.isFinite(as) && !Number.isFinite(bs)) return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
      if (!Number.isFinite(as)) return 1; if (!Number.isFinite(bs)) return -1;
      return group.key === "past" ? bs - as : as - bs;
    }));
    let markup = "";
    if (news.length) markup += "<section style='grid-column:1/-1;margin-bottom:20px;'><div style='display:flex;align-items:end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:4px 0 14px;'><div><h3 style='font-size:1.25rem;font-weight:850;color:#1E293B;margin:0 0 4px;'>Official Campus News</h3><p style='color:#64748B;font-size:.88rem;margin:0;'>Important announcements from IATS CONNECT — shown first.</p></div><span class='tag-pill tag-pill-highlight'>" + news.length + " " + (news.length === 1 ? "announcement" : "announcements") + "</span></div><div class='catchup-grid campus-news-grid'>" + news.map(renderCampusNewsCard).join("") + "</div></section>";
    if (officialEvents.length) markup += "<section style='grid-column:1/-1;margin-bottom:20px;'><h3 style='font-size:1.15rem;font-weight:850;color:#1E293B;margin:8px 0 14px;'>Official IATS Events <span style='font-size:.8rem;color:#64748B;'>(" + officialEvents.length + ")</span></h3><div class='catchup-grid'>" + officialEvents.map(renderCatchupCard).join("") + "</div></section>";
    markup += groups.filter(group => group.events.length).map(group => "<section style='grid-column:1/-1;margin-bottom:20px;'><h3 style='font-size:1.1rem;font-weight:850;color:#1E293B;margin:8px 0 14px;'>" + group.title + " <span style='font-size:.8rem;color:#64748B;'>(" + group.events.length + ")</span></h3><div class='catchup-grid'>" + group.events.map(renderCatchupCard).join("") + "</div></section>").join("");
    if (!markup) markup = "<div class='glass-panel' style='grid-column:1/-1;text-align:center;padding:40px 24px;'><h3 style='font-size:1.3rem;font-weight:850;color:#1E293B;margin-bottom:8px;'>No Events or News Yet</h3><p style='color:#64748B;max-width:520px;margin:0 auto;'>Academic events will appear here, while official campus news will always be prioritised above them.</p></div>";
    grid.innerHTML = markup;
    grid.querySelectorAll(".btn-catchup-toggle").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); toggleJoinCatchup(btn.dataset.id); }));
    grid.querySelectorAll(".btn-host-edit-event").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); openHostCatchupModal(btn.dataset.id, false); }));
    grid.querySelectorAll(".btn-open-catchup-details").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); openCatchupDetails(btn.dataset.id); }));
    grid.querySelectorAll("[data-open-details]").forEach(card => card.addEventListener("click", event => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      openCatchupDetails(card.dataset.openDetails);
    }));
  }

  function renderAdminDashboardView() {
    if (!isNewsPublisher()) {
      navigateTo("dashboard");
      return;
    }
    const container = document.getElementById("admin-dashboard-content");
    if (!container) return;
    container.innerHTML = "<div class='glass-panel' style='padding:24px;text-align:center;'>Loading administration overview…</div>";
    if (!window.SupabaseService || typeof window.SupabaseService.fetchAdminOverview !== "function") {
      container.innerHTML = "<div class='glass-panel' style='padding:24px;'>Administration service unavailable. Refresh and try again.</div>";
      return;
    }
    window.SupabaseService.fetchAdminOverview().then(data => {
      AppState.adminStats = { studentCount: data.studentCount || 0, eventCount: data.eventCount || 0 };
      AppState.adminEvents = data.events || [];
      if (AppState.activeView !== "admin") return;
      container.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:20px;'>"
        + "<div class='glass-panel' style='padding:22px;'><div style='color:#64748B;font-size:.85rem;font-weight:700;'>COMMUNITY PROFILES</div><div style='font-size:2rem;font-weight:800;color:#1E293B;margin-top:8px;'>" + AppState.adminStats.studentCount + "</div></div>"
        + "<div class='glass-panel' style='padding:22px;'><div style='color:#64748B;font-size:.85rem;font-weight:700;'>TOTAL EVENTS & NEWS</div><div style='font-size:2rem;font-weight:800;color:#1E293B;margin-top:8px;'>" + AppState.adminStats.eventCount + "</div></div></div>"
        + "<div class='glass-panel' style='padding:20px;'>"
        + "<div style='display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px;'><h3 style='font-size:1.1rem;font-weight:800;color:#1E293B;'>Event & News Management</h3><div style='display:flex;gap:8px;flex-wrap:wrap;'>"
        + "<button type='button' id='btn-admin-create-event' class='btn-liquid btn-primary btn-sm'>+ Create Event</button><button type='button' id='btn-admin-create-news' class='btn-liquid btn-glass btn-sm'>+ Publish Campus News</button></div></div>"
        + "<div style='display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;'>"
        + "<label style='font-size:.85rem;color:#475569;'>Status <select id='admin-event-filter' class='form-input' style='display:inline-block;width:auto;margin-left:6px;'>"
        + "<option value='all'>All</option><option value='upcoming'>Upcoming</option><option value='live'>Live</option><option value='past'>Past</option></select></label>"
        + "<label style='font-size:.85rem;color:#475569;'>Sort <select id='admin-event-sort' class='form-input' style='display:inline-block;width:auto;margin-left:6px;'>"
        + "<option value='soonest'>Start time: soonest</option><option value='latest'>Recently posted</option><option value='attendees'>Most attendees</option><option value='title'>Title A–Z</option></select></label></div></div>"
        + "<div id='admin-events-list'></div></div>"
        + "<div class='glass-panel' style='padding:20px;margin-top:18px;'><h3 style='font-size:1.1rem;font-weight:800;color:#1E293B;margin-bottom:8px;'>Cohort Promotion</h3><p style='font-size:.88rem;color:#64748B;margin-bottom:14px;'>Promote an entire cohort at once. Cohort 2.2 graduates into former-student status.</p><div style='display:flex;gap:10px;flex-wrap:wrap;align-items:end;'><label style='font-size:.85rem;'>Current cohort<select id='admin-promote-cohort' class='form-input'><option>1.1</option><option>1.2</option><option>2.1</option><option>2.2</option></select></label><button type='button' id='btn-admin-promote-cohort' class='btn-liquid btn-primary btn-sm'>Promote cohort</button></div></div>";
      const createEventBtn = document.getElementById("btn-admin-create-event");
      if (createEventBtn) createEventBtn.addEventListener("click", () => openHostCatchupModal(null, false));
      const createNewsBtn = document.getElementById("btn-admin-create-news");
      if (createNewsBtn) createNewsBtn.addEventListener("click", () => openHostCatchupModal(null, true));
      const filter = document.getElementById("admin-event-filter");
      const sort = document.getElementById("admin-event-sort");
      if (filter) { filter.value = AppState.adminFilter; filter.addEventListener("change", () => { AppState.adminFilter = filter.value; renderAdminEventsList(); }); }
      if (sort) { sort.value = AppState.adminSort; sort.addEventListener("change", () => { AppState.adminSort = sort.value; renderAdminEventsList(); }); }
      renderAdminEventsList();
      const promoteBtn = document.getElementById("btn-admin-promote-cohort");
      if (promoteBtn) promoteBtn.addEventListener("click", async () => {
        const from = document.getElementById("admin-promote-cohort").value;
        const next = {"1.1":"1.2","1.2":"2.1","2.1":"2.2","2.2":"Former Student"}[from];
        if (!confirm("Promote all cohort " + from + " scholars to " + next + "?")) return;
        try { const result=await window.SupabaseService.promoteCohort(from); showToast("Cohort Promoted", (result?.affected ?? 0) + " profiles updated."); renderAdminDashboardView(); }
        catch(err) { showToast("Promotion Failed",err.message || "Could not promote cohort."); }
      });
    }).catch(err => {
      if (AppState.activeView === "admin") container.innerHTML = "<div class='glass-panel' style='padding:24px;color:#991B1B;'>Could not load administration data: " + escapeEventText(err.message || "Please try again.") + "</div>";
    });
  }

  function renderAdminEventsList() {
    const list = document.getElementById("admin-events-list");
    if (!list) return;
    const filter = AppState.adminFilter || "all";
    const sort = AppState.adminSort || "soonest";
    const now = Date.now();
    const events = (AppState.adminEvents || []).filter(event => filter === "all" || eventStatus(event, now) === filter);
    events.sort((a, b) => {
      if ((Boolean(a.is_official) || isCampusNewsItem(a)) !== (Boolean(b.is_official) || isCampusNewsItem(b))) return (Boolean(a.is_official) || isCampusNewsItem(a)) ? -1 : 1;
      if (isCampusNewsItem(a) !== isCampusNewsItem(b)) return isCampusNewsItem(a) ? -1 : 1;
      if (sort === "latest") return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
      if (sort === "attendees") return (b.attendees || 0) - (a.attendees || 0);
      if (sort === "title") return String(a.title || "").localeCompare(String(b.title || ""));
      const aStart = Date.parse(getEventStart(a) || "");
      const bStart = Date.parse(getEventStart(b) || "");
      if (!Number.isFinite(aStart) && !Number.isFinite(bStart)) return 0;
      if (!Number.isFinite(aStart)) return 1;
      if (!Number.isFinite(bStart)) return -1;
      return aStart - bStart;
    });
    if (!events.length) {
      list.innerHTML = "<div style='padding:28px;text-align:center;color:#64748B;'>No events match this filter.</div>";
      return;
    }
    list.innerHTML = events.map(event => {
      const status = eventStatus(event, now);
      const start = getEventStart(event);
      const end = getEventEnd(event);
      const startMs = start && Number.isFinite(Date.parse(start)) ? Date.parse(start) : "";
      const endMs = end && Number.isFinite(Date.parse(end)) ? Date.parse(end) : "";
      const label = status === "live" ? "LIVE NOW" : status === "past" ? "PAST" : "UPCOMING";
      const cap = isCampusNewsItem(event) ? "News · no registration" : Number(event.attendees || 0) + (event.max_attendees == null ? " registered" : "/" + event.max_attendees + " registered");
      return "<div class='glass-panel' style='padding:16px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;'>"
        + "<div style='min-width:200px;flex:1;'><div style='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px;'><strong>" + escapeEventText(event.title) + "</strong><span class='tag-pill " + (isCampusNewsItem(event) ? "tag-pill-highlight" : "tag-pill-blue") + "'>" + (isCampusNewsItem(event) ? "OFFICIAL NEWS" : label) + "</span></div>"
        + "<div style='font-size:.85rem;color:#64748B;'>" + (isCampusNewsItem(event) ? "Official campus announcement" : escapeEventText(event.tag || "Academic Event") + " · " + escapeEventText(event.event_format === "online" ? "Online" : event.event_format === "hybrid" ? "Physical + Online" : (event.location || "Location not set")) + (event.online_url ? " · Meeting link provided" : "")) + " · Host: " + escapeEventText(event.host || "IATS Scholar") + "</div>"
        + (event.description ? "<div style='font-size:.82rem;color:#475569;margin-top:5px;line-height:1.45;'>" + escapeEventText(event.description.slice(0, 220)) + (event.description.length > 220 ? "…" : "") + "</div>" : "")
        + "<div style='font-size:.82rem;color:#64748B;margin-top:5px;'>" + (isCampusNewsItem(event) ? "Published " + escapeEventText(formatEventDateTime(event.created_at)) + " · No registration required" : escapeEventText(formatEventDateTime(start) === "Date/time not set" ? (event.event_time || "Date/time not set") : formatEventDateTime(start)) + " · " + escapeEventText(cap) + (event.registration_deadline ? " · Register by " + escapeEventText(formatEventDateTime(event.registration_deadline)) : "")) + "</div></div>"
        + "<div style='display:flex;align-items:center;gap:8px;flex-wrap:wrap;'>" + (isCampusNewsItem(event) ? "" : "<div style='font-size:.82rem;font-weight:700;color:#D8232A;' data-event-countdown data-event-status='" + status + "' data-start-iso='" + escapeEventText(start || "") + "' data-end-iso='" + escapeEventText(end || "") + "' data-start-ms='" + startMs + "' data-end-ms='" + endMs + "'>" + formatEventCountdown(start, end, now) + "</div>")
        + "<button type='button' class='btn-liquid btn-glass btn-sm btn-admin-edit-event' data-id='" + escapeEventText(event.id) + "'>Edit</button>"
        + "<button type='button' class='btn-liquid btn-glass btn-sm btn-admin-delete-event' data-id='" + escapeEventText(event.id) + "' style='color:#B91C1C;'>Delete</button></div></div>";
    }).join("");
    list.querySelectorAll(".btn-admin-edit-event").forEach(btn => btn.addEventListener("click", () => openHostCatchupModal(btn.dataset.id, false)));
    list.querySelectorAll(".btn-admin-delete-event").forEach(btn => btn.addEventListener("click", () => deleteAdminEvent(btn.dataset.id)));
  }

  async function deleteAdminEvent(id) {
    if (!isNewsPublisher()) {
      showToast("Administrator Only", "Only the platform developer can moderate events.");
      return;
    }
    const event = (AppState.adminEvents || []).find(item => String(item.id) === String(id));
    if (!event || !confirm("Delete " + (event.title || "this event") + " permanently?")) return;
    try {
      await window.SupabaseService.deleteCatchup(id);
      AppState.adminEvents = AppState.adminEvents.filter(item => String(item.id) !== String(id));
      AppState.catchups = AppState.catchups.filter(item => String(item.id) !== String(id));
      const overview = await window.SupabaseService.fetchAdminOverview();
      AppState.adminStats = { studentCount: overview.studentCount || 0, eventCount: overview.eventCount || 0 };
      AppState.adminEvents = overview.events || [];
      showToast("Item Deleted", "The event/news item was removed.");
      renderAdminDashboardView();
    } catch (err) {
      showToast("Delete Failed", err.message || "Could not delete this item.");
    }
  }

  function tickEventCountdowns() {
    const now = Date.now();
    let publicStatusChanged = false;
    let dashboardStatusChanged = false;
    let adminStatusChanged = false;
    document.querySelectorAll("[data-registration-countdown]").forEach(el => {
      const deadline = Number(el.getAttribute("data-deadline-ms"));
      if (!Number.isFinite(deadline)) return;
      const remaining = deadline - now;
      const nextState = remaining <= 0 ? "closed" : "open";
      const previousState = el.getAttribute("data-deadline-state") || "open";
      if (nextState !== previousState) {
        el.setAttribute("data-deadline-state", nextState);
        if (AppState.activeView === "catchup") publicStatusChanged = true;
        if (AppState.activeView === "dashboard") dashboardStatusChanged = true;
      }
      if (remaining <= 0) {
        el.textContent = "Registration closed";
        el.style.color = "#B91C1C";
      } else {
        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        el.textContent = "Closes in " + (days ? days + "d " : "") + String(hours).padStart(2,"0") + ":" + String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");
      }
    });
    document.querySelectorAll("[data-event-countdown]").forEach(el => {
      const start = el.getAttribute("data-start-iso") || "";
      const end = el.getAttribute("data-end-iso") || "";
      const oldStatus = el.getAttribute("data-event-status") || "upcoming";
      const newStatus = eventStatusFromTimes(start, end, now);
      el.textContent = formatEventCountdown(start, end, now);
      if (oldStatus !== newStatus) {
        el.setAttribute("data-event-status", newStatus);
        const label = el.parentElement && el.parentElement.querySelector("[data-event-status-label]");
        if (label) label.textContent = newStatus === "live" ? "LIVE NOW" : newStatus === "past" ? "PAST" : "UPCOMING";
        if (AppState.activeView === "catchup") publicStatusChanged = true;
        if (AppState.activeView === "dashboard") dashboardStatusChanged = true;
        if (AppState.activeView === "admin") adminStatusChanged = true;
      }
    });
    if (publicStatusChanged) renderCatchUpView();
    if (dashboardStatusChanged) renderDashboardView();
    if (adminStatusChanged) renderAdminEventsList();
  }

  async function toggleJoinCatchup(id) {
    const catchup = AppState.catchups.find(c => String(c.id) === String(id));
    if (!catchup || isCampusNewsItem(catchup)) return;
    if (!AppState.currentUser) { showToast("Sign In Required", "Please sign in before registering for an academic event."); openAuthModal(); return; }
    const joining = !catchup.isJoined;
    if (joining && catchup.registration_deadline && Date.now() > Date.parse(catchup.registration_deadline)) {
      showToast("Registration Closed", "The host's registration deadline has passed."); return;
    }
    try {
      await window.SupabaseService.toggleCatchupAttendance(id, AppState.currentUser.id, joining);
      catchup.isJoined = joining;
      const fresh = await window.SupabaseService.fetchCatchupById(id);
      if (fresh) Object.assign(catchup, fresh, { isJoined: joining });
      AppState.adminEvents = AppState.adminEvents.map(item => String(item.id) === String(id) ? { ...item, attendees: catchup.attendees } : item);
      showToast(joining ? "Registration Confirmed" : "Registration Cancelled", joining ? `You are registered for "${catchup.title}".` : `Your registration for "${catchup.title}" has been cancelled.`);
      renderActiveView();
    } catch (error) { showToast("Registration Not Updated", error.message || "Please try again."); }
  }

  function isNewsPublisher() {
    return String(AppState.currentUser?.email || "").trim().toLowerCase() === "focalforges@gmail.com";
  }
  function syncNewsPublishingOption() {
    const option = document.querySelector('#new-catchup-tag option[data-admin-only="true"]');
    if (!option) return;
    option.hidden = !isNewsPublisher(); option.disabled = !isNewsPublisher();
    if (!isNewsPublisher() && option.selected) {
      const select = document.getElementById("new-catchup-tag");
      if (select) select.value = "Study Group";
    }
  }
  function toLocalDateTimeInput(value) {
    if (!value) return "";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  function openHostCatchupModal(eventId = null, forceNews = false) {
    syncNewsPublishingOption();
    const event = eventId
      ? (AppState.adminEvents || []).concat(AppState.catchups || []).find(item => String(item.id) === String(eventId))
      : null;
    const canManageEvent = event && (isNewsPublisher() || (String(event.host_id || "") === String(AppState.currentUser?.id || "") && !isCampusNewsItem(event) && !event.is_official));
    if (eventId && (!event || !canManageEvent)) {
      showToast("Event Not Available", "You can only edit events you host. Refresh and try again.");
      return;
    }
    AppState.editingEventId = event ? event.id : null;
    const titleInput = document.getElementById("new-catchup-title");
    const locationInput = document.getElementById("new-catchup-location");
    const descriptionInput = document.getElementById("new-catchup-description");
    const startInput = document.getElementById("new-catchup-start");
    const endInput = document.getElementById("new-catchup-end");
    const capacityInput = document.getElementById("new-catchup-capacity");
    const tagSelect = document.getElementById("new-catchup-tag");
    const modalTitle = document.getElementById("host-catchup-modal-title");
    const submitLabel = document.getElementById("host-catchup-submit-label");
    const mediaInput = document.getElementById("new-catchup-media-file");
    const bannerPreview = document.getElementById("new-catchup-banner-preview");
    const videoPreview = document.getElementById("new-catchup-video-preview");
    const currentMedia = document.getElementById("new-catchup-media-current");
    if (mediaInput) mediaInput.value = "";
    if (bannerPreview) { bannerPreview.src = ""; bannerPreview.style.display = "none"; }
    if (videoPreview) { videoPreview.pause(); videoPreview.removeAttribute("src"); videoPreview.load(); videoPreview.style.display = "none"; }
    if (currentMedia) { currentMedia.textContent = event?.banner_url ? "Current poster/trailer will be kept unless you choose a replacement file." : ""; currentMedia.style.display = event?.banner_url ? "block" : "none"; }
    if (titleInput) titleInput.value = event ? (event.title || "") : "";
    if (locationInput) locationInput.value = event ? (event.location || "") : "";
    if (descriptionInput) descriptionInput.value = event ? (event.description || "") : "";
    if (startInput) startInput.value = event ? toLocalDateTimeInput(getEventStart(event)) : "";
    if (endInput) endInput.value = event ? toLocalDateTimeInput(getEventEnd(event)) : "";
    if (capacityInput) capacityInput.value = event && event.max_attendees != null ? event.max_attendees : "";
    if (tagSelect) tagSelect.value = forceNews || (event && isCampusNewsItem(event)) ? "Campus News" : (event ? (event.tag || "Study Group") : "Study Group");
    const formatInput = document.getElementById("new-catchup-format");
    const onlineInput = document.getElementById("new-catchup-online-url");
    const deadlineInput = document.getElementById("new-catchup-registration-deadline");
    if (formatInput) formatInput.value = event?.event_format || "physical";
    if (onlineInput) onlineInput.value = event?.online_url || "";
    if (deadlineInput) deadlineInput.value = event?.registration_deadline ? toLocalDateTimeInput(event.registration_deadline) : "";
    if (modalTitle) modalTitle.textContent = forceNews || (event && isCampusNewsItem(event)) ? "Publish Official Campus News" : event ? "Edit Academic Event" : "Create an Academic Event";
    if (submitLabel) submitLabel.textContent = forceNews || (event && isCampusNewsItem(event)) ? "Publish Campus News →" : event ? "Save Changes →" : "Publish Academic Event →";
    syncCatchupFormType();
    const hostModal = document.getElementById("host-catchup-modal");
    if (hostModal) hostModal.classList.add("open");
  }

  function closeHostCatchupModal() {
    const hostModal = document.getElementById("host-catchup-modal");
    if (hostModal) hostModal.classList.remove("open");
    AppState.editingEventId = null;
  }

  function syncCatchupFormType() {
    const isNews = document.getElementById("new-catchup-tag")?.value === "Campus News";
    const format = document.getElementById("new-catchup-format")?.value || "physical";
    ["catchup-location-group", "catchup-dates-group", "catchup-capacity-group", "catchup-format-group", "catchup-registration-deadline-group"].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.style.display = isNews ? "none" : "";
    });
    const location = document.getElementById("new-catchup-location");
    const start = document.getElementById("new-catchup-start");
    const end = document.getElementById("new-catchup-end");
    const url = document.getElementById("new-catchup-online-url");
    const deadline = document.getElementById("new-catchup-registration-deadline");
    const urlGroup = document.getElementById("catchup-online-url-group");
    if (location) location.required = !isNews && format !== "online";
    if (start) start.required = !isNews;
    if (end) end.required = !isNews;
    if (url) url.required = !isNews && format !== "physical";
    if (deadline) deadline.required = !isNews;
    if (urlGroup) urlGroup.style.display = isNews || format === "physical" ? "none" : "";
  }

  async function handleCreateCatchup(e) {
    e.preventDefault();
    const title = document.getElementById("new-catchup-title") ? document.getElementById("new-catchup-title").value.trim() : "";
    const location = document.getElementById("new-catchup-location") ? document.getElementById("new-catchup-location").value.trim() : "";
    const description = document.getElementById("new-catchup-description") ? document.getElementById("new-catchup-description").value.trim() : "";
    const mediaFile = document.getElementById("new-catchup-media-file")?.files?.[0] || null;
    if (mediaFile && mediaFile.size > 50 * 1024 * 1024) { alert("The poster or video trailer must be 50 MB or smaller."); return; }
    if (mediaFile && !["image/jpeg","image/png","image/webp","image/gif","video/mp4","video/webm","video/quicktime"].includes(mediaFile.type)) { alert("Choose a JPG, PNG, WebP, GIF, MP4, WebM, or MOV file."); return; }
    const startValue = document.getElementById("new-catchup-start")?.value || "";
    const endValue = document.getElementById("new-catchup-end")?.value || "";
    const startsAt = startValue ? new Date(startValue) : null;
    const endsAt = endValue ? new Date(endValue) : null;
    const time = startsAt && Number.isFinite(startsAt.getTime())
      ? startsAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
    const tag = document.getElementById("new-catchup-tag") ? document.getElementById("new-catchup-tag").value : "Study Group";
    const isCampusNews = String(tag).toLowerCase().replace(/\s+/g, "") === "campusnews";
    const format = document.getElementById("new-catchup-format")?.value || "physical";
    const onlineUrl = document.getElementById("new-catchup-online-url")?.value.trim() || "";
    const deadlineValue = document.getElementById("new-catchup-registration-deadline")?.value || "";
    const registrationDeadline = deadlineValue ? new Date(deadlineValue) : null;
    if (isCampusNews && !isNewsPublisher()) {
      alert("Only focalforges@gmail.com can publish Campus News. Scholars can still publish academic events."); return;
    }
    if (isCampusNews && !description) {
      alert("Please add the full announcement details before publishing Campus News.");
      return;
    }
    const capacityInput = document.getElementById("new-catchup-capacity");
    const capacityValue = !isCampusNews && capacityInput ? capacityInput.value.trim() : "";
    const capacity = capacityValue ? Number.parseInt(capacityValue, 10) : null;
    if (capacityValue && (!Number.isInteger(capacity) || capacity < 1)) {
      alert("Enter a capacity of at least 1 scholar, or leave the field blank for unlimited registration.");
      return;
    }

    if (!title) { alert("Please enter a title."); return; }
    if (!isCampusNews) {
      if ((format !== "online" && !location) || !startsAt || !Number.isFinite(startsAt.getTime()) || !endsAt || !Number.isFinite(endsAt.getTime())) {
        alert("Please enter the physical venue when applicable, plus the event start and end date/time.");
        return;
      }
      if (endsAt <= startsAt) { alert("The event end date and time must be after the start date and time."); return; }
      if (format !== "physical" && onlineUrl && !/^https?:\/\//i.test(onlineUrl)) {
        alert("Please provide a valid online meeting URL beginning with https:// or http://.");
        return;
      }
      if (!registrationDeadline || !Number.isFinite(registrationDeadline.getTime()) || registrationDeadline.getTime() <= Date.now() || registrationDeadline > startsAt) {
        alert("Please set a future registration deadline before the event starts.");
        return;
      }
    }
    if (AppState.editingEventId) {
      const existing = (AppState.adminEvents || []).concat(AppState.catchups || []).find(item => String(item.id) === String(AppState.editingEventId));
      const ownsEvent = existing && String(existing.host_id || "") === String(AppState.currentUser?.id || "") && !existing.is_official && !isCampusNewsItem(existing);
      if (!isNewsPublisher() && !ownsEvent) {
        showToast("Event Not Available", "You can only edit events you host.");
        return;
      }
    }

    // STRICT ACADEMIC CONTENT FILTER VERIFICATION
    if (!validateAcademicContent({
      title,
      location,
      time,
      tag
    }, "Academic Event Hosting")) {
      return;
    }

    if (!AppState.currentUser) {
      showToast("Sign In Required", "Please sign in with your IATS scholar account before publishing an event.");
      openAuthModal();
      return;
    }

    const editingEvent = AppState.editingEventId
      ? (AppState.adminEvents || []).concat(AppState.catchups || []).find(item => String(item.id) === String(AppState.editingEventId))
      : null;
    const hostName = editingEvent ? (editingEvent.host || AppState.currentUser.name) : AppState.currentUser.name;
    const hostAvatar = editingEvent
      ? (editingEvent.host_avatar || DEFAULT_AVATAR_PLACEHOLDER)
      : (AppState.currentUser.avatar || DEFAULT_AVATAR_PLACEHOLDER);

    const newCatchup = {
      title,
      description,
      banner_url: editingEvent?.banner_url || null,
      host: hostName,
      hostAvatar,
      location: isCampusNews ? "" : location,
      time: startsAt ? time : "",
      startsAt: !isCampusNews && startsAt ? startsAt.toISOString() : null,
      endsAt: !isCampusNews && endsAt ? endsAt.toISOString() : null,
      event_starts_at: !isCampusNews && startsAt ? startsAt.toISOString() : null,
      event_ends_at: !isCampusNews && endsAt ? endsAt.toISOString() : null,
      tag,
      item_type: isCampusNews ? "news" : "event",
      is_official: isCampusNews || Boolean(editingEvent && editingEvent.is_official) || (!editingEvent && isNewsPublisher()),
      event_format: isCampusNews ? "physical" : format,
      online_url: isCampusNews || format === "physical" ? null : onlineUrl,
      registration_deadline: !isCampusNews && registrationDeadline ? registrationDeadline.toISOString() : null,
      attendees: 0,
      maxAttendees: isCampusNews ? null : capacity,
      isJoined: false
    };

    try {
      if (!window.SupabaseService || typeof window.SupabaseService.addCatchup !== "function") {
        throw new Error("The event service is unavailable. Please refresh and try again.");
      }
      if (mediaFile) newCatchup.banner_url = await window.SupabaseService.uploadEventMedia(mediaFile, AppState.currentUser.id);
      let saved;
      if (AppState.editingEventId) {
        saved = await window.SupabaseService.updateCatchup(AppState.editingEventId, newCatchup);
      } else {
        saved = await window.SupabaseService.addCatchup(newCatchup);
      }
      if (!saved || !saved.id) throw new Error("The item could not be saved. Please check your connection and try again.");
      Object.assign(newCatchup, {
        id: saved.id,
        hostAvatar: saved.host_avatar ?? newCatchup.hostAvatar,
        time: saved.event_time ?? newCatchup.time,
        event_starts_at: saved.event_starts_at ?? newCatchup.event_starts_at,
        event_ends_at: saved.event_ends_at ?? newCatchup.event_ends_at,
        maxAttendees: saved.max_attendees ?? newCatchup.maxAttendees,
        attendees: saved.attendees ?? newCatchup.attendees,
        item_type: saved.item_type ?? newCatchup.item_type,
        event_format: saved.event_format ?? newCatchup.event_format,
        online_url: saved.online_url ?? newCatchup.online_url,
        registration_deadline: saved.registration_deadline ?? newCatchup.registration_deadline
      });
      if (AppState.editingEventId) {
        const editingId = String(AppState.editingEventId);
        AppState.catchups = AppState.catchups.map(item => String(item.id) === editingId ? { ...item, ...newCatchup } : item);
        AppState.adminEvents = AppState.adminEvents.map(item => String(item.id) === editingId ? { ...item, ...saved } : item);
      } else {
        AppState.catchups.unshift(newCatchup);
        AppState.adminEvents.unshift(saved);
      }
    } catch (err) {
      console.error("Academic event publish failed:", err);
      showToast("Event Not Published", err.message || "Could not publish the event. Please try again.");
      return;
    }

    const wasEditing = !!AppState.editingEventId;
    AppState.editingEventId = null;
    closeHostCatchupModal();
    const hostForm = document.getElementById("host-catchup-form");
    if (hostForm) hostForm.reset();
    showToast(wasEditing ? "Changes Saved" : (String(tag).toLowerCase() === "campus news" ? "Campus News Published" : "Event Hosted"),
      `"${newCatchup.title}" ${wasEditing ? "has been updated." : "is now published on IATS CONNECT."}`);
    renderCatchUpView();
    if (isNewsPublisher() && AppState.activeView === "admin") renderAdminDashboardView();
  }

  // ==========================================
  // Courses & Academic Forums (Hubs) Logic
  // ==========================================
  function renderHubsView() {
    const listContainer = document.getElementById("hub-posts-list");
    const sidebar = document.querySelector(".hub-channel-list");
    if (!listContainer || !sidebar) return;
    const departments = [...new Set(IATS_COURSES.map(c => c.department))];
    if (!departments.includes(AppState.activeHubDepartment)) AppState.activeHubDepartment = departments[0];
    sidebar.innerHTML = departments.map(department => {
      const count = IATS_COURSES.filter(c => c.department === department).length;
      return "<li><button class='hub-channel-btn " + (AppState.activeHubDepartment === department ? "active" : "") + "' data-department='" + department.replace(/'/g,"&#39;") + "' type='button'>" + department + " <span style='opacity:.7'>(" + count + ")</span></button></li>";
    }).join("") + "<li><button class='hub-channel-btn " + (AppState.activeHubCategory === "all" ? "active" : "") + "' data-course='all' type='button'>All Course Discussions</button></li>";
    // Remove the legacy course drawer; the main panel already lists courses for the selected department.
    document.getElementById("hub-course-list")?.remove();
    const departmentCourses = IATS_COURSES.filter(c => c.department === AppState.activeHubDepartment);
    const selectedCourse = IATS_COURSES.find(c => c.code === AppState.activeHubCategory);
    const heading = selectedCourse ? selectedCourse.name : AppState.activeHubCategory === "all" ? "All Course Discussions" : AppState.activeHubDepartment;
    if (AppState.activeHubCategory === "department") {
      listContainer.innerHTML = "<div style='margin-bottom:14px;'><h3 style='font-size:1.2rem;font-weight:800;color:#1E293B;margin:0 0 6px;'>" + escapeEventText(AppState.activeHubDepartment) + "</h3><p style='color:#64748B;font-size:.9rem;margin:0;'>Choose one of the official courses below to open its course community.</p></div><div class='hub-course-grid' style='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px;'>" + departmentCourses.map(c => "<button type='button' class='glass-panel hub-course-card' data-course='" + c.code + "' style='text-align:left;padding:16px;border:1px solid #E2E8F0;cursor:pointer;min-width:0;'><span style='display:inline-block;font-size:.76rem;font-weight:800;color:#D8232A;margin-bottom:7px;'>" + c.code + "</span><span style='display:block;font-weight:750;color:#1E293B;line-height:1.4;'>" + escapeEventText(c.name) + "</span><span style='display:block;color:#64748B;font-size:.8rem;margin-top:9px;'>Open course community →</span></button>").join("") + "</div>";
      listContainer.querySelectorAll("[data-course]").forEach(btn => btn.addEventListener("click", () => { AppState.activeHubCategory = btn.dataset.course; renderHubsView(); }));
    } else {
    const filtered = AppState.hubPosts.filter(p => AppState.activeHubCategory === "all" || String(p.category || "").toUpperCase() === String(AppState.activeHubCategory).toUpperCase());
    if (filtered.length === 0) {
      listContainer.innerHTML = "<div class='glass-panel' style='text-align:center;padding:36px 20px;'><div style='font-weight:800;font-size:1.1rem;color:#1E293B;margin-bottom:6px;'>" + heading + "</div><p style='font-size:.9rem;color:#64748B;max-width:440px;margin:0 auto 18px;'>No discussions in this course yet. Be the first to share notes, questions or revision resources.</p><button class='btn-liquid btn-primary btn-sm' id='btn-post-in-selected-course' type='button'>+ Post in this course</button></div>";
      const postBtn = document.getElementById("btn-post-in-selected-course");
      if (postBtn) postBtn.addEventListener("click", () => openCreatePostModal(AppState.activeHubCategory));
    } else {
      listContainer.innerHTML = "<h3 style='font-size:1.15rem;font-weight:800;margin:0 0 14px;color:#1E293B;'>" + heading + "</h3>" + filtered.map(post => {
        const course = IATS_COURSES.find(c => c.code === String(post.category || "").toUpperCase());
        return "<div class='glass-panel thread-post-card' style='margin-bottom:16px;padding:18px;'><div style='display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;'><div style='display:flex;align-items:center;gap:10px;'><img src='" + resolveAssetUrl(post.authorAvatar || DEFAULT_AVATAR_PLACEHOLDER) + "' onerror=\"this.onerror=null;this.src='" + DEFAULT_AVATAR_PLACEHOLDER + "';\" style='width:38px;height:38px;border-radius:50%;object-fit:cover;' alt='Scholar avatar'><div><div style='font-weight:700;color:#1E293B;'>" + escapeEventText(post.author || "IATS Scholar") + "</div><div style='font-size:.78rem;color:#64748B;'>" + escapeEventText(post.authorRole || "IATS Scholar") + " · " + escapeEventText(post.timeAgo || "Recent") + "</div></div></div><span class='tag-pill tag-pill-highlight'>" + escapeEventText(course ? course.code : String(post.category || "COURSE").toUpperCase()) + "</span></div><h3 style='font-size:1.1rem;font-weight:700;color:#1E293B;margin-bottom:8px;'>" + escapeEventText(post.title || "") + "</h3><p style='font-size:.92rem;color:#334155;line-height:1.6;margin-bottom:14px;'>" + escapeEventText(post.content || "") + "</p><div class='tag-list' style='margin-bottom:16px;'>" + (post.tags || []).map(t => "<span class='tag-pill tag-pill-blue'>#" + escapeEventText(t) + "</span>").join("") + "</div><div style='display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(0,0,0,.05);'><button class='btn-liquid btn-glass btn-sm btn-upvote-post' data-id='" + post.id + "'>" + ICONS.upvote + " " + (post.upvotes || 0) + " Upvotes</button><span style='font-size:.82rem;color:#64748B;'>" + ICONS.chat + " " + (post.commentsCount || 0) + " Discussions</span></div></div>";
      }).join("");
      listContainer.querySelectorAll(".btn-upvote-post").forEach(btn => btn.addEventListener("click", () => toggleUpvotePost(btn.dataset.id)));
    }
    }
    sidebar.querySelectorAll("[data-department]").forEach(btn => btn.addEventListener("click", () => { AppState.activeHubDepartment = btn.dataset.department; AppState.activeHubCategory = "department"; renderHubsView(); }));
    sidebar.querySelectorAll("[data-course]").forEach(btn => btn.addEventListener("click", () => { AppState.activeHubCategory = btn.dataset.course === "all" ? "all" : btn.dataset.course; if (btn.dataset.course !== "all") { const c = IATS_COURSES.find(x => x.code === btn.dataset.course); if (c) AppState.activeHubDepartment = c.department; } renderHubsView(); }));
  }

  function toggleUpvotePost(id) {
    const post = AppState.hubPosts.find(p => String(p.id) === String(id));
    if (!post) return;

    if (post.hasUpvoted) {
      post.hasUpvoted = false;
      post.upvotes = Math.max(0, (post.upvotes || 1) - 1);
      if (window.SupabaseService && typeof window.SupabaseService.togglePostUpvote === "function") {
        window.SupabaseService.togglePostUpvote(id, AppState.currentUser ? AppState.currentUser.id : "guest", false);
      }
    } else {
      post.hasUpvoted = true;
      post.upvotes = (post.upvotes || 0) + 1;
      if (window.SupabaseService && typeof window.SupabaseService.togglePostUpvote === "function") {
        window.SupabaseService.togglePostUpvote(id, AppState.currentUser ? AppState.currentUser.id : "guest", true);
      }
    }
    renderHubsView();
  }

  function openCreatePostModal(courseCode) {
    const modal = document.getElementById("create-post-modal");
    const select = document.getElementById("new-post-channel");
    if (select && courseCode && IATS_COURSES.some(c => c.code === courseCode)) select.value = courseCode;
    if (modal) modal.classList.add("open");
  }

  function closeCreatePostModal() {
    const modal = document.getElementById("create-post-modal");
    if (modal) modal.classList.remove("open");
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    const channel = document.getElementById("new-post-channel").value;
    const title = document.getElementById("new-post-title").value.trim();
    const content = document.getElementById("new-post-content").value.trim();
    const tagsStr = document.getElementById("new-post-tags").value.trim();

    if (!title || !content) {
      alert("Please enter title and content.");
      return;
    }

    // STRICT ACADEMIC CONTENT FILTER VERIFICATION
    if (!validateAcademicContent({
      title,
      content,
      tags: tagsStr
    }, "Course Discussion Post")) {
      return;
    }

    const tags = tagsStr.split(",").map(t => t.trim().replace(/^#/, "")).filter(Boolean);
    const author = AppState.currentUser ? AppState.currentUser.name : "IATS Scholar";
    const authorRole = AppState.currentUser ? (AppState.currentUser.major || "IATS Scholar") : "IATS Department";
    const authorAvatar = AppState.currentUser ? AppState.currentUser.avatar : DEFAULT_AVATAR_PLACEHOLDER;

    const newPost = {
      category: channel,
      author,
      authorRole,
      authorAvatar,
      timeAgo: "Just now",
      title,
      content,
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      tags: tags.length ? tags : ["IATSConnect", "Course"]
    };

    if (window.SupabaseService && typeof window.SupabaseService.addHubPost === "function") {
      const saved = await window.SupabaseService.addHubPost(newPost);
      if (saved) newPost.id = saved.id;
    }

    AppState.hubPosts.unshift(newPost);

    closeCreatePostModal();
    const form = document.getElementById("create-post-form");
    if (form) form.reset();

    showToast("Post Published", "Your discussion is live on the course feed.");
    renderHubsView();
  }

  // ==========================================
  // Real-Time Direct Scholar Chats Logic
  // ==========================================
  function renderChatsView() {
    const threadsList = document.getElementById("chat-threads-container");
    const messagesWindow = document.getElementById("chat-messages-container");
    const activeHeader = document.getElementById("chat-active-peer-header");

    if (!threadsList || !messagesWindow) return;

    if (AppState.conversations.length === 0) {
      threadsList.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: #64748B; font-size: 0.88rem;">
          No active scholar chats yet.
          <button class="btn-liquid btn-primary btn-sm" style="margin-top: 12px; width: 100%;" onclick="CampusApp.openNewChatModal()">
            <span>+ Start New Chat</span>
          </button>
        </div>
      `;

      if (activeHeader) {
        activeHeader.innerHTML = `
          <div style="font-weight: 700; color: #64748B; font-size: 0.95rem;">No Chat Selected</div>
        `;
      }

      messagesWindow.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #64748B;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #EFF6FF; color: #3A86C8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            ${ICONS.chat}
          </div>
          <div style="font-weight: 700; font-size: 1.1rem; color: #1E293B; margin-bottom: 4px;">Direct Scholar Messaging</div>
          <p style="font-size: 0.88rem; max-width: 380px; margin: 0 auto 16px auto;">
            Connect directly with fellow IATS classmates, collaborate on coursework problem sets, and organize research study circles.
          </p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openNewChatModal()">
              <span>+ Start New Chat</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    const activeConv = AppState.conversations.find(c => String(c.id) === String(AppState.activeChatId)) || AppState.conversations[0];
    if (activeConv && AppState.activeView === "chats") markActiveConversationRead(activeConv.id);
    const peerOnline = !!(activeConv && AppState.onlineUserIds.includes(activeConv.peer_id));
    if (activeConv) AppState.activeChatId = activeConv.id;
    const peerLastSeen = activeConv && activeConv.peer_last_seen_at ? new Date(activeConv.peer_last_seen_at) : null;
    const peerPresenceLabel = peerOnline ? "Online" : peerLastSeen && !Number.isNaN(peerLastSeen.getTime()) ? "Last seen " + formatLastSeen(peerLastSeen) : "Offline";

    // Render Left Sidebar Threads
    threadsList.innerHTML = AppState.conversations.map(c => `
      <div class="chat-thread-item ${String(c.id) === String(activeConv.id) ? 'active' : ''}" data-id="${c.id}">
        <img src="${resolveAssetUrl(c.avatar_url || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover;" alt="${c.name}">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap:6px;">
            <div style="font-weight: 700; font-size: 0.92rem; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeEventText(c.name || "IATS Scholar")}</div>
            <button type="button" class="chat-delete-thread-btn" data-delete-conversation="${c.id}" title="Remove this chat from your inbox" aria-label="Delete chat with ${escapeEventText(c.name || "scholar")}">×</button>
          </div>
          <div style="font-size: 0.8rem; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${c.last_message ? c.last_message : 'No messages yet'}
          </div>
          <div style="font-size:.68rem;color:${AppState.onlineUserIds.includes(c.peer_id) ? "#059669" : "#64748B"};margin-top:3px;">
            ${AppState.onlineUserIds.includes(c.peer_id) ? "● Online" : c.peer_last_seen_at ? "Last seen " + formatLastSeen(new Date(c.peer_last_seen_at)) : "○ Offline"}
          </div>
          ${Number(AppState.unreadChatCounts[c.id] || 0) > 0 ? `<span class="chat-unread-badge">${Number(AppState.unreadChatCounts[c.id]) > 99 ? "99+" : Number(AppState.unreadChatCounts[c.id])}</span>` : ""}
        </div>
      </div>
    `).join("");

    threadsList.querySelectorAll(".chat-thread-item").forEach(item => {
      item.addEventListener("click", (event) => {
        if (event.target.closest("[data-delete-conversation]")) return;
        AppState.activeChatId = item.dataset.id;
        const selected = AppState.conversations.find(c => String(c.id) === String(AppState.activeChatId));
        if (selected) {
          selected.unread = 0;
          updateUnreadBadge();
        }
        startActiveMessagesSync(AppState.activeChatId);
        renderChatsView();
      });
    });

    threadsList.querySelectorAll("[data-delete-conversation]").forEach(button => {
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        const conversationId = button.dataset.deleteConversation;
        const conversation = AppState.conversations.find(c => String(c.id) === String(conversationId));
        const peerName = conversation?.name || "this scholar";
        if (!window.confirm(`Remove your chat with ${peerName} from your inbox? The other person will keep their chat and messages.`)) return;
        button.disabled = true;
        try {
          await window.SupabaseService.hideConversation(conversationId);
          AppState.conversations = AppState.conversations.filter(c => String(c.id) !== String(conversationId));
          delete AppState.unreadChatCounts[conversationId];
          if (String(AppState.activeChatId) === String(conversationId)) {
            AppState.activeChatId = AppState.conversations[0]?.id || null;
            if (AppState.activeChatId) startActiveMessagesSync(AppState.activeChatId);
            else { if (unsubActiveMessages) { unsubActiveMessages(); unsubActiveMessages = null; } AppState.activeMessages = []; }
          }
          updateNotificationBadges();
          renderChatsView();
          showToast("Chat Removed", "The chat was removed from your inbox only.");
        } catch (error) {
          button.disabled = false;
          showToast("Could Not Delete Chat", error.message || "Please try again.");
        }
      });
    });

    // Render Active Header
    if (activeHeader && activeConv) {
      activeHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${resolveAssetUrl(activeConv.avatar_url || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="${activeConv.name}">
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: #1E293B;">${activeConv.name}</div>
            <div style="font-size: 0.8rem; color: #059669; display: flex; align-items: center; gap: 5px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${peerOnline ? "#059669" : "#94A3B8"}; display: inline-block;"></span>
              ${peerPresenceLabel}
            </div>
          </div>
          <button type="button" class="btn-liquid btn-secondary btn-sm" id="btn-toggle-share-profile" style="margin-left:auto;">Share profile</button>
        </div>
        <div id="chat-share-profile-panel" class="chat-share-profile-panel" hidden>
          <label for="chat-share-profile-select">Choose a student to recommend to ${escapeEventText(activeConv.name || "this scholar")}</label>
          <div class="chat-share-profile-controls">
            <select id="chat-share-profile-select" class="form-input">
              <option value="">Select a student…</option>
              ${AppState.matchProfiles.filter(p => String(p.owner_id || p.id) !== String(AppState.currentUser?.id) && String(p.owner_id || p.id) !== String(activeConv.peer_id)).map(p => `<option value="${escapeEventText(p.owner_id || p.id)}">${escapeEventText(p.name || "IATS Scholar")} — ${escapeEventText(p.major || "Student")}</option>`).join("")}
            </select>
            <button type="button" class="btn-liquid btn-primary btn-sm" id="btn-send-shared-profile">Send</button>
          </div>
        </div>
      `;
      document.getElementById("btn-toggle-share-profile")?.addEventListener("click", () => {
        const panel = document.getElementById("chat-share-profile-panel");
        if (panel) panel.hidden = !panel.hidden;
      });
      document.getElementById("btn-send-shared-profile")?.addEventListener("click", async () => {
        const select = document.getElementById("chat-share-profile-select");
        const sharedId = select?.value;
        if (!sharedId) { showToast("Choose a Student", "Select a student profile to share."); return; }
        const shared = AppState.matchProfiles.find(p => String(p.owner_id || p.id) === String(sharedId));
        try {
          await window.SupabaseService.sendProfileShare(activeConv.id, sharedId);
          const panel = document.getElementById("chat-share-profile-panel");
          if (panel) panel.hidden = true;
          showToast("Profile Shared", `Shared ${shared?.name || "the student"}'s profile with ${activeConv.name || "your chat"}.`);
        } catch (error) { showToast("Could Not Share Profile", error.message || "Please try again."); }
      });
    }

    // Render Messages — sourced from the live, real-time `messages` table
    // (see startActiveMessagesSync). No delay: new rows push in over
    // Supabase Realtime and re-render this exact block automatically.
    if (activeConv) {
      const myId = AppState.currentUser ? AppState.currentUser.id : null;
      const messageById = new Map((AppState.activeMessages || []).map(m => [m.id, m]));
      messagesWindow.innerHTML = (AppState.activeMessages || []).map(msg => {
        const mine = msg.sender_id === myId;
        const quoted = msg.reply_to ? messageById.get(msg.reply_to) : null;
        const canEdit = mine && !msg.deleted_at && Date.now() - new Date(msg.created_at).getTime() <= 120000;
        const canDelete = mine && !msg.deleted_at;
        const quoteMarkup = quoted ? `<div class="message-reply-quote"><strong>${quoted.sender_id === myId ? "You" : escapeEventText(quoted.sender_name || activeConv.name || "Scholar")}</strong><div>${quoted.deleted_at ? "Message deleted" : escapeEventText(quoted.text || "")}</div></div>` : "";
        const sharedProfileId = !msg.deleted_at ? msg.shared_profile_id : null;
        const sharedProfile = sharedProfileId ? AppState.matchProfiles.find(p => String(p.owner_id || p.id) === String(sharedProfileId)) : null;
        const body = msg.deleted_at ? '<em>This message was deleted</em>' : sharedProfileId ? "" : escapeEventText(msg.text || "");
        const profileShareMarkup = sharedProfileId ? `<div class="shared-profile-card"><div class="shared-profile-icon">👤</div><div class="shared-profile-copy"><strong>${escapeEventText(sharedProfile?.name || "Shared IATS student")}</strong><span>${escapeEventText(sharedProfile?.major || "Student profile")}</span></div><button type="button" class="btn-liquid btn-primary btn-sm" data-open-shared-profile="${sharedProfileId}" data-profile-name="${escapeEventText(sharedProfile?.name || "IATS Scholar")}">Message</button></div>` : "";
        const attachmentMarkup = msg.attachment_path && !msg.deleted_at ? `<div class="chat-attachment-card" data-attachment-path="${escapeEventText(msg.attachment_path)}" data-attachment-name="${escapeEventText(msg.attachment_name || "Attachment")}" data-attachment-mime="${escapeEventText(msg.attachment_mime || "")}"><span>📎 ${escapeEventText(msg.attachment_name || "Attachment")}</span><small>Preparing secure link…</small></div>` : "";
        return `<div class="message-bubble ${mine ? "msg-outgoing" : "msg-incoming"}" data-message-id="${msg.id}">
          ${quoteMarkup}
          <div class="message-sender-label">${mine ? "You" : escapeEventText(msg.sender_name || activeConv.name || "IATS Scholar")}</div>
          <div class="message-body">${body}${profileShareMarkup}${attachmentMarkup}</div>
          <div class="message-meta"><span>${formatMessageTime(msg.created_at)}${msg.edited_at && !msg.deleted_at ? " · edited" : ""}</span><span class="message-actions">
            <button type="button" class="message-action-btn" data-message-action="reply" data-message-id="${msg.id}" title="Reply">Reply</button>
            ${canEdit ? `<button type="button" class="message-action-btn" data-message-action="edit" data-message-id="${msg.id}" title="Edit message">Edit</button>` : ""}
            ${canDelete ? `<button type="button" class="message-action-btn" data-message-action="delete" data-message-id="${msg.id}" title="Delete message">Delete</button>` : ""}
          </span></div>
        </div>`;
      }).join("") || `<div style="text-align:center; color:#94A3B8; font-size:0.85rem; padding: 30px 0;">No messages yet — say hello 👋</div>`;
      messagesWindow.querySelectorAll("[data-message-action]").forEach(button => button.addEventListener("click", () => handleMessageAction(button.dataset.messageAction, button.dataset.messageId)));
      messagesWindow.querySelectorAll("[data-open-shared-profile]").forEach(button => button.addEventListener("click", () => {
        const profileId = button.dataset.openSharedProfile;
        const profile = AppState.matchProfiles.find(p => String(p.owner_id || p.id) === String(profileId));
        startChatWithStudent(profile || { id: profileId, name: button.dataset.profileName || "IATS Scholar" });
      }));
      messagesWindow.querySelectorAll("[data-attachment-path]").forEach(async card => {
        const url = await window.SupabaseService.getChatAttachmentUrl(card.dataset.attachmentPath);
        if (!url || !card.isConnected) { if (card.isConnected) card.innerHTML = "<span>Attachment unavailable</span>"; return; }
        const mime = card.dataset.attachmentMime || "";
        const name = escapeEventText(card.dataset.attachmentName || "Attachment");
        if (mime.startsWith("image/")) card.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="${url}" alt="${name}" loading="lazy" class="chat-attachment-image"><span>${name}</span></a>`;
        else if (mime.startsWith("video/")) card.innerHTML = `<video controls preload="metadata" class="chat-attachment-video" src="${url}"></video><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`;
        else card.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer" download="${name}">📎 ${name} <span>Open / download</span></a>`;
      });
      renderReplyPreview();

      messagesWindow.scrollTop = messagesWindow.scrollHeight;
    }
  }

  function formatMessageTime(isoString) {
    if (!isoString) return "Just now";
    try { return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return "Just now"; }
  }

  function formatLastSeen(date) {
    const ms = Date.now() - date.getTime();
    if (ms < 60000) return "just now";
    if (ms < 3600000) return Math.max(1, Math.floor(ms / 60000)) + " min ago";
    if (ms < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function renderReplyPreview() {
    const box = document.getElementById("chat-reply-preview");
    if (!box) return;
    const message = (AppState.activeMessages || []).find(m => m.id === AppState.replyingToMessageId);
    if (!message) { box.hidden = true; box.innerHTML = ""; return; }
    box.hidden = false;
    box.innerHTML = `<div><strong>Replying to ${message.sender_id === (AppState.currentUser && AppState.currentUser.id) ? "yourself" : escapeEventText(message.sender_name || "scholar")}</strong><div>${message.deleted_at ? "Message deleted" : escapeEventText(message.text || "")}</div></div><button type="button" id="btn-cancel-chat-reply" aria-label="Cancel reply">✕</button>`;
    document.getElementById("btn-cancel-chat-reply")?.addEventListener("click", () => { AppState.replyingToMessageId = null; renderReplyPreview(); });
  }

  async function handleMessageAction(action, messageId) {
    const message = (AppState.activeMessages || []).find(m => m.id === messageId);
    if (!message) return;
    if (action === "reply") {
      AppState.replyingToMessageId = messageId;
      renderReplyPreview();
      document.getElementById("chat-input-message")?.focus();
      return;
    }
    if (message.sender_id !== (AppState.currentUser && AppState.currentUser.id)) return;
    if (action === "edit") {
      if (message.deleted_at || Date.now() - new Date(message.created_at).getTime() > 120000) { showToast("Cannot Edit", "Messages can only be edited within two minutes."); return; }
      const updated = window.prompt("Edit your message:", message.text || "");
      if (updated === null || !updated.trim() || updated.trim() === message.text) return;
      if (!validateAcademicContent({ message: updated.trim() }, "Edit Chat Message")) return;
      try { await window.SupabaseService.editMessage(messageId, updated.trim()); showToast("Message Updated", "Your edit has been saved."); }
      catch (err) { alert(err.message || "Could not edit the message."); }
    } else if (action === "delete") {
      if (!window.confirm("Delete this message? The other person will see that it was deleted.")) return;
      try { await window.SupabaseService.deleteMessage(messageId); showToast("Message Deleted", "The message was deleted."); }
      catch (err) { alert(err.message || "Could not delete the message."); }
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input-message");
    const text = input ? input.value.trim() : "";
    if (!text) return;

    if (!AppState.currentUser) {
      openAuthModal();
      return;
    }

    // STRICT ACADEMIC CONTENT FILTER VERIFICATION
    if (!validateAcademicContent({ message: text }, "Direct Scholar Chat Message")) {
      return;
    }

    const activeConv = AppState.conversations.find(c => String(c.id) === String(AppState.activeChatId)) || AppState.conversations[0];
    if (!activeConv) {
      alert("Start a chat first using \"+ Start New Chat\".");
      return;
    }

    const sendBtn = document.getElementById("btn-send-chat-message");
    input.value = "";
    if (sendBtn) setButtonLoading(sendBtn, "");

    try {
      // Real-time delivery: the message row is inserted once, Supabase
      // Realtime instantly pushes it back to every subscriber (including
      // this tab) — no polling, no simulated reply, no artificial delay.
      await window.SupabaseService.sendMessage(activeConv.id, text, AppState.replyingToMessageId);
      AppState.replyingToMessageId = null;
      renderReplyPreview();
    } catch (err) {
      alert(err.message || "Your message couldn't be sent. Please try again.");
      input.value = text;
    } finally {
      if (sendBtn) clearButtonLoading(sendBtn);
    }
  }

  function openNewChatModal() {
    if (!AppState.currentUser) {
      openAuthModal();
      return;
    }
    const modal = document.getElementById("new-chat-modal");
    if (modal) modal.classList.add("open");
  }

  function closeNewChatModal() {
    const modal = document.getElementById("new-chat-modal");
    if (modal) modal.classList.remove("open");
  }

  async function handleCreateChat(e) {
    e.preventDefault();
    const recipientInput = document.getElementById("new-chat-recipient");
    const recipient = recipientInput ? recipientInput.value.trim() : "";
    const recipientId = AppState.selectedChatRecipientId;
    const faculty = "";
    const firstMsg = "";
    if (!recipient) { alert("Please enter the username of the person you want to chat with.");
      return;
    }
    if (!AppState.currentUser) {
      openAuthModal();
      return;
    }

    // STRICT ACADEMIC CONTENT FILTER VERIFICATION
    if (!validateAcademicContent({
      recipient,
      faculty,
      message: ""
    }, "Initiate Academic Chat")) {
      return;
    }

    const submitBtn = document.getElementById("btn-submit-new-chat");
    setButtonLoading(submitBtn, "Starting chat…");
    try {
      const conv = await window.SupabaseService.createConversation({
        recipientId,
        recipientName: recipient,
        major: faculty || "IATS Scholar",
        firstMessage: "",
        avatar: DEFAULT_AVATAR_PLACEHOLDER
      });
      if (conv) {
        if (!AppState.conversations.some(c => String(c.id) === String(conv.id))) AppState.conversations.unshift(conv);
        AppState.activeChatId = conv.id;
        startActiveMessagesSync(conv.id);
      }

      closeNewChatModal();
      const form = document.getElementById("new-chat-form");
      if (form) form.reset();
      AppState.selectedChatRecipientId = null;
      const suggestions = document.getElementById("new-chat-suggestions");
      if (suggestions) { suggestions.hidden = true; suggestions.innerHTML = ""; }
      const searchStatus = document.getElementById("new-chat-search-status");
      if (searchStatus) searchStatus.textContent = "";

      showToast("Chat Started", `Academic conversation with ${recipient} created.`);
      navigateTo("chats");
    } catch (err) {
      alert(err.message || "Couldn't start that chat. Please try again.");
    } finally {
      clearButtonLoading(submitBtn);
    }
  }

  let recipientSearchSequence = 0;
  async function handleRecipientSearch() {
    const input = document.getElementById("new-chat-recipient");
    const list = document.getElementById("new-chat-suggestions");
    const status = document.getElementById("new-chat-search-status");
    if (!input || !list || !status) return;
    const query = input.value.trim();
    AppState.selectedChatRecipientId = null;
    const seq = ++recipientSearchSequence;
    if (query.length < 2) { list.hidden = true; list.innerHTML = ""; status.textContent = query ? "Type at least 2 characters to search." : ""; return; }
    status.textContent = "Searching scholars…";
    try {
      const users = await window.SupabaseService.searchChatRecipients(query);
      if (seq !== recipientSearchSequence) return;
      if (!users.length) { list.hidden = true; list.innerHTML = ""; status.textContent = `User “${query}” does not exist or has no matching IATS account.`; return; }
      list.hidden = false;
      status.textContent = "Choose the person you want to message.";
      list.innerHTML = users.map(user => `<button type="button" class="chat-recipient-option" data-user-id="${user.id}" data-user-name="${escapeEventText(user.name)}"><span class="chat-recipient-avatar">${escapeEventText((user.name || "I").trim().slice(0,1).toUpperCase())}</span><span><strong>${escapeEventText(user.name)}</strong><small>${escapeEventText(user.major || "IATS Scholar")}</small></span></button>`).join("");
      list.querySelectorAll(".chat-recipient-option").forEach(option => option.addEventListener("click", () => {
        AppState.selectedChatRecipientId = option.dataset.userId;
        input.value = option.dataset.userName;
        list.hidden = true;
        list.innerHTML = "";
        status.textContent = `Selected ${option.dataset.userName}. Ready to start chatting.`;
      }));
    } catch (err) {
      if (seq === recipientSearchSequence) status.textContent = "Could not search users right now. Please try again.";
    }
  }

  // ==========================================
  // Account profile view (developer account is not classified as a student)
  // ==========================================
  function renderProfileView() {
    const container = document.getElementById("profile-view-container");
    if (!AppState.currentUser || AppState.currentUser.authProvider === "Guest Session (Preview)") {
      if (container) {
        container.innerHTML = `
          <div class="glass-panel signed-out-profile-panel" style="max-width:760px;margin:32px auto;padding:clamp(24px,5vw,48px);text-align:center;">
            <div style="width:64px;height:64px;margin:0 auto 18px;border-radius:20px;display:grid;place-items:center;background:#FEE2E2;color:#DC2626;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h1 style="margin:0 0 10px;font-size:clamp(1.5rem,3vw,2rem);">Welcome to IATS CONNECT</h1>
            <p style="max-width:520px;margin:0 auto 24px;color:var(--text-muted,#64748b);line-height:1.65;">Sign in to continue to your scholar profile, chats, study communities and campus updates. New here? You can create an account too.</p>
            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
              <button class="btn-liquid btn-primary" id="btn-profile-signin" type="button"><span>Sign In / Verify</span></button>
              <button class="btn-liquid btn-glass" id="btn-profile-signup" type="button"><span>Create Account</span></button>
            </div>
          </div>`;
        document.getElementById("btn-profile-signin")?.addEventListener("click", openAuthModal);
        document.getElementById("btn-profile-signup")?.addEventListener("click", () => { openAuthModal(); showAuthStep("main"); });
      }
      return;
    }
    const isDeveloperAccount = isNewsPublisher();
    const user = AppState.currentUser || {
      name: "IATS Scholar",
      university: "Institute of Advanced Technical Studies",
      major: "Faculty of Computing & Information Tech",
      year: "3rd Year (Class of 2026)",
      bio: "Active IATS scholar specializing in distributed cloud computing, modern UI systems, and academic peer collaboration.",
      skills: ["Software Engineering", "Algorithms", "Cloud Architecture", "Database Systems", "Academic Research"],
      authProvider: "Guest Session (Preview)",
      avatar: "./images/scholar_female.jpg"
    };

    // A scholar profile is complete when the account has an official course and valid IATS cohort.
    // Do not depend on matchProfiles loading: that public directory is asynchronous.
    const hasCompletedScholarProfile = !isDeveloperAccount &&
      IATS_COURSES.some(course => course.name === String(user.major || "").trim()) &&
      IATS_COHORTS.includes(String(user.year || "").trim());

    // Reuse the container declared at the start of renderProfileView().
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel" style="padding: 32px; max-width: 680px; margin: 0 auto;">
        <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
          <img id="current-profile-avatar" src="${resolveAssetUrl(user.avatar || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid #D8232A; box-shadow: 0 4px 16px rgba(216,35,42,0.15);" alt="${user.name}">
          <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
            <label for="profile-photo-upload" class="btn-liquid btn-glass btn-sm" style="cursor:pointer;">Upload your photo</label><button type="button" class="btn-liquid btn-glass btn-sm" id="btn-remove-profile-photo">Remove photo</button>
            <input type="file" id="profile-photo-upload" accept="image/png,image/jpeg,image/webp" style="display:none;">
            <span style="font-size:.78rem;color:#64748B;">Use your own photo (JPG, PNG or WebP; max 5 MB).</span>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #1E293B;">${user.name}</h2>
              <span class="tag-pill tag-pill-highlight" style="font-size: 0.8rem;">${isDeveloperAccount ? "Developer · Administrator" : "IATS Verified"}</span>
            </div>
            <div style="font-size: 0.95rem; color: #475569; font-weight: 600; margin-top: 4px;">${isDeveloperAccount ? "Developer · IATS CONNECT Platform" : user.major + " • " + user.university}</div>
            ${isDeveloperAccount ? "<div style='font-size:.82rem;color:#64748B;margin-top:4px;'>Overall events moderator · Official campus news publisher</div>" : ""}
            <div style="font-size: 0.82rem; color: #64748B; margin-top: 2px;">Auth: <b>${user.authProvider}</b></div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #D8232A; text-transform: uppercase; margin-bottom: 6px;">${isDeveloperAccount ? "Developer Profile" : "Biography & Academic Focus"}</div>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">${user.bio}</p>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-bottom: 8px;">${isDeveloperAccount ? "Engineering & Platform Responsibilities" : "Academic Focus Areas & Skills"}</div>
          <div class="tag-list">
            ${(user.skills || []).map(s => `<span class="tag-pill tag-pill-highlight">${s}</span>`).join("")}
          </div>
        </div>

        <!-- Academic Institutional Controls -->
        <div style="border-top: 1px solid rgba(0,0,0,0.06); padding-top: 20px; margin-top: 20px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-bottom: 12px;">Institutional Platform Services</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${isDeveloperAccount || hasCompletedScholarProfile ? "" : '<button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openCreateProfileModal()"><span>+ Register Scholar Candidate</span></button>'}
            <button class="btn-liquid btn-glass btn-sm" onclick="CampusApp.openLogicInspector()">
              <span>View System Architecture</span>
            </button>
            <button class="btn-liquid btn-glass btn-sm" id="btn-profile-privacy-link" style="color: #3A86C8;">
              <span>Privacy Policy</span>
            </button>
            <button class="btn-liquid btn-glass btn-sm" id="btn-profile-terms-link" style="color: #3A86C8;">
              <span>Terms of Service</span>
            </button>
            <button class="btn-liquid btn-glass btn-sm" id="btn-profile-signout"><span>Sign Out</span></button>
            ${isDeveloperAccount ? "" : '<button class="btn-liquid btn-sm" id="btn-delete-account" style="background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;"><span>Delete My Account</span></button>'}
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-profile-signout")?.addEventListener("click", clearSession);
    document.getElementById("btn-delete-account")?.addEventListener("click", async () => {
      if (!AppState.currentUser || !confirm("Delete your IATS CONNECT profile and associated scholar-directory record? This cannot be undone. You will be signed out. If you also want your authentication account permanently erased, contact the platform administrator.")) return;
      const button = document.getElementById("btn-delete-account");
      if (button) button.disabled = true;
      try {
        await window.SupabaseService.deleteOwnProfileData();
        showToast("Profile data removed", "Your scholar profile and directory entry have been deleted.");
        await clearSession();
      } catch (error) {
        showToast("Could not delete profile", error.message || "Please try again.");
        if (button) button.disabled = false;
      }
    });
    document.getElementById("btn-remove-profile-photo")?.addEventListener("click", async () => { try { await window.SupabaseService.removeAvatar(); AppState.currentUser.avatar = null; renderNavigation(); renderProfileView(); showToast("Photo removed", "Your profile now uses the default avatar."); } catch (err) { alert(err.message || "Could not remove photo."); } });
    const photoInput = document.getElementById("profile-photo-upload");
    if (photoInput) photoInput.addEventListener("change", async () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file || !AppState.currentUser) return;
      try {
        showToast("Uploading Photo", "Saving your profile picture securely…");
        const avatarUrl = await window.SupabaseService.uploadAvatar(file, AppState.currentUser.id);
        const updated = { ...AppState.currentUser, avatar: avatarUrl };
        const saved = await window.SupabaseService.saveUser(updated);
        if (!saved) throw new Error("Photo uploaded but profile could not be saved. Please try again.");
        AppState.currentUser.avatar = avatarUrl;
        renderNavigation();
        renderProfileView();
        showToast("Profile Photo Updated", "Your photo is saved to your profile.");
      } catch (err) { alert(err.message || "Could not upload your photo."); }
      finally { photoInput.value = ""; }
    });
    const privBtn = document.getElementById("btn-profile-privacy-link");
    if (privBtn) {
      privBtn.addEventListener("click", () => {
        document.getElementById("privacy-policy-modal")?.classList.add("open");
      });
    }

    const termsBtn = document.getElementById("btn-profile-terms-link");
    if (termsBtn) {
      termsBtn.addEventListener("click", () => {
        document.getElementById("terms-of-service-modal")?.classList.add("open");
      });
    }
  }

  // ==========================================
  // Interactive Guided System Tour Engine
  // ==========================================
  let tourStep = 0;
  const tourSteps = [
    {
      title: "1. Liquid Glass Header & Authentic IATS Shield",
      desc: "Welcome to IATS CONNECT. The top bar features the official Institute of Advanced Technical Studies shield crest, frosted liquid glass navigation, and instant authentication via personal email or Google.",
      view: "landing"
    },
    {
      title: "2. Live IATS Academic Feed & Dashboard",
      desc: "The Feed aggregates upcoming academic events, faculty seminar announcements, and trending syllabus discussions across faculties in real time.",
      view: "dashboard"
    },
    {
      title: "3. Study Partner & Buddy Finder",
      desc: "Connect with compatible classmates based on shared course syllabus codes (BIT, CS, Engineering), revision schedules, and campus study lab proximity.",
      view: "match"
    },
    {
      title: "4. Academic Events & Campus News",
      desc: "Discover or host spontaneous study sprints, exam revision workshops, and departmental news around the IATS campus.",
      view: "catchup"
    },
    {
      title: "5. Courses & Direct Scholar Chats",
      desc: "Direct message study partners, reply to course discussion channels, and exchange academic notes under strict academic code of conduct.",
      view: "chats"
    }
  ];

  function startSystemTour() {
    tourStep = 0;
    renderTourStep();
  }

  function renderTourStep() {
    let overlay = document.getElementById("system-tour-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "system-tour-overlay";
      overlay.style.cssText = "position: fixed; inset: 0; z-index: 1800; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); pointer-events: auto;";
      document.body.appendChild(overlay);
    }

    const step = tourSteps[tourStep];
    navigateTo(step.view);

    overlay.innerHTML = `
      <div class="tour-step-card" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div style="font-size: 0.8rem; font-weight: 700; color: #D8232A; text-transform: uppercase; margin-bottom: 4px;">Guided System Tour (${tourStep + 1}/${tourSteps.length})</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">${step.title}</h3>
        <p style="font-size: 0.92rem; color: #475569; line-height: 1.55; margin-bottom: 18px;">${step.desc}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button id="btn-tour-close" class="btn-liquid btn-glass btn-sm">Exit Tour</button>
          <button id="btn-tour-next" class="btn-liquid btn-primary btn-sm">
            ${tourStep === tourSteps.length - 1 ? "Finish Tour ✓" : "Next Step →"}
          </button>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById("btn-tour-close");
    if (closeBtn) closeBtn.addEventListener("click", () => overlay.remove());

    const nextBtn = document.getElementById("btn-tour-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        tourStep++;
        if (tourStep < tourSteps.length) {
          renderTourStep();
        } else {
          overlay.remove();
          showToast("Tour Completed", "Enjoy connecting with fellow IATS scholars.");
        }
      });
    }
  }

  // ==========================================
  // System Logic Inspector Modal
  // ==========================================
  function openLogicInspector() {
    const modal = document.getElementById("logic-inspector-modal");
    if (modal) modal.classList.add("open");
  }

  function closeLogicInspector() {
    const modal = document.getElementById("logic-inspector-modal");
    if (modal) modal.classList.remove("open");
  }

  // ==========================================
  // Toast Helper
  // ==========================================
  function showToast(title, message) {
    const toast = document.createElement("div");
    toast.className = "live-toast-alert";
    toast.innerHTML = `
      <div class="pulse-dot" style="margin-top: 5px;"></div>
      <div style="flex: 1;">
        <div style="font-weight: 700; font-size: 0.9rem; color: #1E293B;">${title}</div>
        <div style="font-size: 0.84rem; color: #475569; margin-top: 2px;">${message}</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // Event Bindings
  // ==========================================
  function bindEvents() {
    // Admin-only sign-out returns directly to the public guest landing page.
    const adminSignOutBtn = document.getElementById("btn-admin-signout-home");
    if (adminSignOutBtn) adminSignOutBtn.addEventListener("click", () => clearSession("landing"));

    // Bottom dock navigation items & general nav buttons
    document.querySelectorAll(".dock-nav-btn, .nav-item-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        if (view) navigateTo(view);
      });
    });

    // Brand logo returns to landing/dash
    const brandLink = document.getElementById("brand-logo-link");
    if (brandLink) {
      brandLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(AppState.currentUser ? (isNewsPublisher() ? "admin" : "dashboard") : "landing");
      });
    }

    // Landing Page CTAs
    const heroExplore = document.getElementById("btn-hero-explore");
    if (heroExplore) {
      heroExplore.addEventListener("click", () => {
        if (AppState.currentUser) {
          navigateTo("match");
        } else {
          openAuthModal();
        }
      });
    }

    const heroTour = document.getElementById("btn-hero-tour");
    if (heroTour) heroTour.addEventListener("click", startSystemTour);

    const heroLogic = document.getElementById("btn-hero-logic-info");
    if (heroLogic) heroLogic.addEventListener("click", openLogicInspector);

    // Auth Modal buttons
    const googleBtn = document.getElementById("btn-auth-google");
    if (googleBtn) googleBtn.addEventListener("click", handleGoogleSignIn);

    const emailForm = document.getElementById("form-email-auth");
    if (emailForm) emailForm.addEventListener("submit", handleEmailOTPRequest);
    const passwordForm = document.getElementById("form-password-auth");
    if (passwordForm) passwordForm.addEventListener("submit", handlePasswordSignIn);
    const passwordSignupBtn = document.getElementById("btn-password-signup");
    if (passwordSignupBtn) passwordSignupBtn.addEventListener("click", handlePasswordSignUp);
    document.getElementById("btn-password-recovery")?.addEventListener("click", handlePasswordRecoveryRequest);
    document.getElementById("form-password-recovery")?.addEventListener("submit", handlePasswordRecoverySubmit);
    document.getElementById("btn-back-from-recovery")?.addEventListener("click", () => showAuthStep("main"));

    const verifyOtpBtn = document.getElementById("btn-verify-otp");
    if (verifyOtpBtn) verifyOtpBtn.addEventListener("click", verifyOtpCode);

    const resendBtn = document.getElementById("btn-resend-otp");
    if (resendBtn) resendBtn.addEventListener("click", async () => {
      if (!AppState.pendingEmail || !window.SupabaseService) return;
      setButtonLoading(resendBtn, "Resending…");
      try {
        await window.SupabaseService.requestEmailOtp(AppState.pendingEmail);
        startOtpCountdown();
        showToast("Code Resent", `A new verification code was emailed to ${AppState.pendingEmail}.`);
      } catch (err) {
        alert(err.message || "Could not resend the code yet. Please wait a moment and try again.");
      } finally {
        clearButtonLoading(resendBtn);
      }
    });

    const closeAuthBtn = document.getElementById("btn-close-auth");
    if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeAuthModal);

    const authBackdrop = document.getElementById("auth-modal-backdrop");
    if (authBackdrop) {
      authBackdrop.addEventListener("click", (e) => {
        if (e.target.id === "auth-modal-backdrop") closeAuthModal();
      });
    }

    // OTP Input auto-tabbing
    const otpBoxes = document.querySelectorAll(".otp-digit-box");
    otpBoxes.forEach((box, index) => {
      box.addEventListener("input", (e) => {
        if (e.target.value && index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      });
      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
          otpBoxes[index - 1].focus();
        }
      });
    });

    // Host CatchUp form (Academic Event)
    const openHostCatchup = document.getElementById("btn-open-host-catchup");
    if (openHostCatchup) openHostCatchup.addEventListener("click", () => openHostCatchupModal(null, false));

    const catchupForm = document.getElementById("host-catchup-form");
    if (catchupForm) catchupForm.addEventListener("submit", handleCreateCatchup);
    const catchupTag = document.getElementById("new-catchup-tag");
    if (catchupTag) catchupTag.addEventListener("change", syncCatchupFormType);

    // Keep the visible radio-style format choices synchronized with the existing select used by event publishing.
    document.querySelectorAll('input[name="event-format-choice"]').forEach((choice) => {
      choice.addEventListener("change", () => {
        const formatSelect = document.getElementById("new-catchup-format");
        if (formatSelect) {
          formatSelect.value = choice.value;
          formatSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
    const syncEventFormatChoices = () => {
      const selected = document.getElementById("new-catchup-format")?.value || "physical";
      document.querySelectorAll('input[name="event-format-choice"]').forEach((choice) => {
        choice.checked = choice.value === selected;
      });
    };
    document.getElementById("new-catchup-format")?.addEventListener("change", syncEventFormatChoices);
    syncEventFormatChoices();

    // Native rich-text editing: apply formatting to the highlighted text and keep
    // the existing description textarea synchronized for the current save pipeline.
    const richEditor = document.getElementById("new-catchup-rich-editor");
    const descriptionStorage = document.getElementById("new-catchup-description");
    const syncRichDescription = () => {
      if (!richEditor || !descriptionStorage) return;
      descriptionStorage.value = richEditor.innerHTML;
      descriptionStorage.dispatchEvent(new Event("input", { bubbles: true }));
    };
    if (richEditor && descriptionStorage) {
      richEditor.addEventListener("input", syncRichDescription);
      document.querySelectorAll("#host-catchup-modal .event-editor-toolbar [data-format]").forEach((button) => {
        button.addEventListener("mousedown", (event) => event.preventDefault());
        button.addEventListener("click", () => {
          richEditor.focus();
          const format = button.dataset.format;
          if (format === "bold") document.execCommand("bold", false);
          else if (format === "italic") document.execCommand("italic", false);
          else if (format === "underline") document.execCommand("underline", false);
          else if (format === "heading") document.execCommand("formatBlock", false, "h2");
          else if (format === "bullet") document.execCommand("insertUnorderedList", false);
          else if (format === "number") document.execCommand("insertOrderedList", false);
          syncRichDescription();
        });
      });
      // Existing event descriptions are plain text or previously saved text; display them as text, never as executable markup.
      const originalResetCatchupForm = resetCatchupForm;
      resetCatchupForm = function(event) {
        originalResetCatchupForm(event);
        if (richEditor && descriptionStorage) {
          richEditor.innerHTML = "";
          if (event && event.description) {
            richEditor.textContent = event.description;
          }
          syncRichDescription();
        }
      };
    }

    const catchupFormat = document.getElementById("new-catchup-format");
    if (catchupFormat) catchupFormat.addEventListener("change", syncCatchupFormType);

    const closeCatchupBtn = document.getElementById("btn-close-catchup-modal");
    if (closeCatchupBtn) closeCatchupBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeHostCatchupModal();
    });
    const catchupBackdrop = document.getElementById("host-catchup-modal");
    if (catchupBackdrop) {
      catchupBackdrop.addEventListener("click", event => {
        if (event.target === catchupBackdrop) closeHostCatchupModal();
      });
      // Capture outside clicks before nested UI handlers can swallow them.
      catchupBackdrop.addEventListener("pointerdown", event => {
        if (event.target === catchupBackdrop) closeHostCatchupModal();
      });
    }
    // The modal overlays the navigation, so any navigation intent should dismiss it first.
    document.querySelectorAll(".nav-item-btn, .dock-nav-btn, [data-view]").forEach((navButton) => {
      navButton.addEventListener("click", () => {
        const modal = document.getElementById("host-catchup-modal");
        if (modal?.classList.contains("open")) closeHostCatchupModal();
      }, true);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const modal = document.getElementById("host-catchup-modal");
        if (modal?.classList.contains("open")) closeHostCatchupModal();
      }
    });
    const mediaInput = document.getElementById("new-catchup-media-file");
    const imagePreview = document.getElementById("new-catchup-banner-preview");
    const videoPreview = document.getElementById("new-catchup-video-preview");
    if (mediaInput) mediaInput.addEventListener("change", () => {
      const file = mediaInput.files?.[0] || null;
      const currentMedia = document.getElementById("new-catchup-media-current");
      if (imagePreview) { imagePreview.removeAttribute("src"); imagePreview.style.display = "none"; }
      if (videoPreview) { videoPreview.pause(); videoPreview.removeAttribute("src"); videoPreview.load(); videoPreview.style.display = "none"; }
      if (!file) return;
      if (currentMedia) { currentMedia.textContent = "Selected: " + file.name; currentMedia.style.display = "block"; }
      const previewUrl = URL.createObjectURL(file);
      if (file.type.startsWith("image/") && imagePreview) { imagePreview.src = previewUrl; imagePreview.style.display = "block"; }
      else if (file.type.startsWith("video/") && videoPreview) { videoPreview.src = previewUrl; videoPreview.style.display = "block"; }
    });
    document.querySelectorAll(".dock-nav-btn, [data-view], .nav-link").forEach(button => {
      button.addEventListener("click", () => {
        const modal = document.getElementById("host-catchup-modal");
        if (modal?.classList.contains("open")) closeHostCatchupModal();
      }, true);
    });

    // Create Profile form
    const profileForm = document.getElementById("create-profile-form");
    if (profileForm) profileForm.addEventListener("submit", handleCreateProfile);

    const closeProfileBtn = document.getElementById("btn-close-create-profile");
    if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeCreateProfileModal);

    // Create Course Discussion Post form
    const openPostBtn = document.getElementById("btn-open-create-post");
    if (openPostBtn) openPostBtn.addEventListener("click", () => openCreatePostModal(AppState.activeHubCategory === "all" ? IATS_COURSES[0]?.code : AppState.activeHubCategory));

    const postForm = document.getElementById("create-post-form");
    if (postForm) postForm.addEventListener("submit", handleCreatePost);

    const closePostBtn = document.getElementById("btn-close-post-modal");
    if (closePostBtn) closePostBtn.addEventListener("click", closeCreatePostModal);

    // Start New Chat form
    const openChatBtn = document.getElementById("btn-start-new-chat");
    if (openChatBtn) openChatBtn.addEventListener("click", openNewChatModal);

    const chatModalForm = document.getElementById("new-chat-form");
    if (chatModalForm) chatModalForm.addEventListener("submit", handleCreateChat);
    const recipientSearchInput = document.getElementById("new-chat-recipient");
    if (recipientSearchInput) recipientSearchInput.addEventListener("input", handleRecipientSearch);

    const closeChatBtn = document.getElementById("btn-close-chat-modal");
    if (closeChatBtn) closeChatBtn.addEventListener("click", closeNewChatModal);

    // Chat composer: text, emoji picker and secure file attachments.
    const chatForm = document.getElementById("chat-send-form");
    if (chatForm) chatForm.addEventListener("submit", handleSendMessage);
    document.getElementById("btn-chat-attach")?.addEventListener("click", () => document.getElementById("chat-attachment-input")?.click());
    document.getElementById("btn-chat-emoji")?.addEventListener("click", () => {
      const picker = document.getElementById("chat-emoji-picker");
      if (picker) picker.hidden = !picker.hidden;
    });
    document.querySelectorAll("[data-chat-emoji]").forEach(button => button.addEventListener("click", () => {
      const input = document.getElementById("chat-input-message");
      if (input) {
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        input.value = input.value.slice(0, start) + button.dataset.chatEmoji + input.value.slice(end);
        input.focus();
        input.setSelectionRange(start + button.dataset.chatEmoji.length, start + button.dataset.chatEmoji.length);
      }
    }));
    document.getElementById("chat-attachment-input")?.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      const conversation = AppState.conversations.find(c => String(c.id) === String(AppState.activeChatId));
      if (!conversation) { showToast("Choose a Chat", "Open a conversation before attaching a file."); return; }
      const attachButton = document.getElementById("btn-chat-attach");
      if (attachButton) setButtonLoading(attachButton, "Uploading…");
      try {
        await window.SupabaseService.uploadChatAttachment(conversation.id, file);
        showToast("Attachment Sent", file.name + " was shared securely.");
      } catch (error) { showToast("Upload Failed", error.message || "Please try a smaller file."); }
      finally { if (attachButton) clearButtonLoading(attachButton); }
    });

    // Logic Inspector Close
    const closeLogicBtn = document.getElementById("btn-close-logic-modal");
    if (closeLogicBtn) closeLogicBtn.addEventListener("click", closeLogicInspector);

    const logicBackdrop = document.getElementById("logic-inspector-modal");
    if (logicBackdrop) {
      logicBackdrop.addEventListener("click", (e) => {
        if (e.target.id === "logic-inspector-modal") closeLogicInspector();
      });
    }

    // Privacy Policy Modal Handlers
    const openPrivacyBtn = document.getElementById("btn-open-privacy-policy");
    if (openPrivacyBtn) {
      openPrivacyBtn.addEventListener("click", () => {
        document.getElementById("privacy-policy-modal")?.classList.add("open");
      });
    }
    const closePrivacyBtn = document.getElementById("btn-close-privacy");
    if (closePrivacyBtn) {
      closePrivacyBtn.addEventListener("click", () => {
        document.getElementById("privacy-policy-modal")?.classList.remove("open");
      });
    }
    const privacyBackdrop = document.getElementById("privacy-policy-modal");
    if (privacyBackdrop) {
      privacyBackdrop.addEventListener("click", (e) => {
        if (e.target.id === "privacy-policy-modal") {
          privacyBackdrop.classList.remove("open");
        }
      });
    }

    // Terms of Service Modal Handlers
    const openTermsBtn = document.getElementById("btn-open-terms-service");
    if (openTermsBtn) {
      openTermsBtn.addEventListener("click", () => {
        document.getElementById("terms-of-service-modal")?.classList.add("open");
      });
    }
    const closeTermsBtn = document.getElementById("btn-close-terms");
    if (closeTermsBtn) {
      closeTermsBtn.addEventListener("click", () => {
        document.getElementById("terms-of-service-modal")?.classList.remove("open");
      });
    }
    const termsBackdrop = document.getElementById("terms-of-service-modal");
    if (termsBackdrop) {
      termsBackdrop.addEventListener("click", (e) => {
        if (e.target.id === "terms-of-service-modal") {
          termsBackdrop.classList.remove("open");
        }
      });
    }

    // Content Filter Warning Modal Handlers
    const closeFilterBtn = document.getElementById("btn-close-filter-warning");
    if (closeFilterBtn) {
      closeFilterBtn.addEventListener("click", () => {
        document.getElementById("content-filter-warning-modal")?.classList.remove("open");
      });
    }
    const ackFilterBtn = document.getElementById("btn-ack-filter-warning");
    if (ackFilterBtn) {
      ackFilterBtn.addEventListener("click", () => {
        document.getElementById("content-filter-warning-modal")?.classList.remove("open");
      });
    }
    const filterBackdrop = document.getElementById("content-filter-warning-modal");
    if (filterBackdrop) {
      filterBackdrop.addEventListener("click", (e) => {
        if (e.target.id === "content-filter-warning-modal") {
          filterBackdrop.classList.remove("open");
        }
      });
    }
  }

  // Expose App globally for inline handlers & programmatic navigation
  window.CampusApp = {
    state: AppState,
    navigateTo,
    openAuthModal,
    openHostCatchupModal,
    openCreateProfileModal,
    openCreatePostModal,
    openNewChatModal,
    startSystemTour,
    openLogicInspector
  };

  // Run on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
