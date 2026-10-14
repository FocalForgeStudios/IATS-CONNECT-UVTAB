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

  const IATS_COURSES = [{"code":"CTH","name":"Certificate in Tourism and Hospitality Management","faculty":"Institute of Advanced Technical Studies"},{"code":"NIT","name":"National Certificate in Information and Communication Technology","faculty":"Institute of Advanced Technical Studies"},{"code":"CLI","name":"National Certificate in Library and Information Science","faculty":"Institute of Advanced Technical Studies"},{"code":"CSW","name":"National Certificate in Social Work and Social Administration","faculty":"Institute of Advanced Technical Studies"},{"code":"CCF","name":"Certificate in Clearing and Forwarding","faculty":"Institute of Advanced Technical Studies"},{"code":"CTV","name":"Certificate in CCTV Installation and Surveillance Systems","faculty":"Institute of Advanced Technical Studies"},{"code":"CJM","name":"Certificate in Journalism and Media Studies","faculty":"Institute of Advanced Technical Studies"},{"code":"NCS","name":"National Certificate in Secretarial and Office Management","faculty":"Institute of Advanced Technical Studies"},{"code":"NHR","name":"National Certificate in Human Resource Management","faculty":"Institute of Advanced Technical Studies"},{"code":"CEC","name":"Certificate in Early Childhood Education","faculty":"Institute of Advanced Technical Studies"},{"code":"CPA","name":"Certificate in Public Administration and Management","faculty":"Institute of Advanced Technical Studies"},{"code":"NCB","name":"National Certificate in Cosmetology and Beauty Therapy","faculty":"Institute of Advanced Technical Studies"},{"code":"CPM","name":"Certificate in Procurement and Logistics Management","faculty":"Institute of Advanced Technical Studies"},{"code":"NCR","name":"National Certificate in Computer Repair and Maintenance","faculty":"Institute of Advanced Technical Studies"},{"code":"CSF","name":"Professional Certificate in Software Engineering","faculty":"Institute of Advanced Technical Studies"},{"code":"NAF","name":"National Certificate in Accounting and Finance","faculty":"Institute of Advanced Technical Studies"},{"code":"CBA","name":"National Certificate in Business Administration","faculty":"Institute of Advanced Technical Studies"},{"code":"NCM","name":"Certificate in Digital Marketing","faculty":"Institute of Advanced Technical Studies"},{"code":"CHI","name":"Certificate in Hotel Management and Institutional Catering","faculty":"Institute of Advanced Technical Studies"},{"code":"CRM","name":"Certificate in Records and Information Management","faculty":"Institute of Advanced Technical Studies"},{"code":"CGC","name":"National Certificate in Guidance and Counselling","faculty":"Institute of Advanced Technical Studies"},{"code":"NCA","name":"National Certificate in Agriculture","faculty":"Institute of Advanced Technical Studies"},{"code":"HEG","name":"Higher Education Certificate (HEC) General","faculty":"Faculty of Humanities and Social Sciences"},{"code":"HEB","name":"Higher Education Certificate in Biological Sciences","faculty":"Faculty of Health Sciences"},{"code":"HEP","name":"Higher Education Certificate Physical Sciences","faculty":"Faculty of Science and Technology"},{"code":"HET","name":"Higher Education Certificate General","faculty":"Institute of Education and Life-Long Learning"},{"code":"HEE","name":"Higher Education Certificate Evening","faculty":"Institute of Education and Life-Long Learning"}];
  const IATS_COHORTS = ["1.1", "1.2", "2.1", "2.2"];
  const getActiveBuddyProfiles = () => { const u = AppState.currentUser; const ownCourse = IATS_COURSES.find(c => c.name === u?.major); const code = String(ownCourse?.code || u?.course_code || "").toUpperCase(); const major = String(u?.major || "").trim().toLowerCase(); return AppState.matchProfiles.filter(p => !p.is_former_student && p.owner_id !== u?.id && (code ? String(p.course_code || "").toUpperCase() === code : (major && String(p.major || "").trim().toLowerCase() === major))); };

  // Global Dynamic State Store (Strictly Cloud Firestore Driven, No LocalStorage Mock Data)
  const AppState = {
    currentUser: null,
    activeView: "landing",
    pendingEmail: null,
    otpTimer: null,
    otpSecondsRemaining: 60,
    currentMatchIndex: 0,
    activeChatId: null,
    activeHubCategory: "faculty",
    activeHubFaculty: "Institute of Advanced Technical Studies",
    
    // Live Cloud Database collections
    matchProfiles: [],
    catchups: [],
    hubPosts: [],
    conversations: [],
    onlineUserIds: [],
    activeMessages: [],
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

    // Restore an existing real session (if any) on page load/refresh.
    window.SupabaseService.getSession().then((session) => {
      if (session && session.user) hydrateSessionFromAuthUser(session.user);
      const recoveryRequested = new URLSearchParams(window.location.search).get("password-recovery") === "1";
      if (recoveryRequested && session && session.user) {
        const modal = document.getElementById("auth-modal-backdrop");
        if (modal) modal.classList.add("open");
        showAuthStep("password-recovery");
      }
    });

    // React instantly to real sign-in / sign-out / token refresh events.
    window.SupabaseService.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && session.user) {
        hydrateSessionFromAuthUser(session.user);
      } else if (event === "PASSWORD_RECOVERY") {
        const modal = document.getElementById("auth-modal-backdrop");
        if (modal) modal.classList.add("open");
        showAuthStep("password-recovery");
      } else if (event === "SIGNED_OUT") {
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
        event_format: c.event_format || "physical",
        online_url: c.online_url || "",
        registration_deadline: c.registration_deadline || null,
        maxAttendees: c.maxAttendees ?? c.max_attendees ?? null,
        isJoined: Array.isArray(c.attendee_ids) && !!AppState.currentUser && c.attendee_ids.includes(AppState.currentUser.id)
      }));
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
    startConversationsSync();
    if (window.SupabaseService.subscribePresence) window.SupabaseService.subscribePresence(ids => { AppState.onlineUserIds = ids || []; if (AppState.activeView === "chats") renderChatsView(); }).catch(err => console.warn("Presence sync failed", err));
    if (isNewsPublisher() && AppState.activeView === "landing") navigateTo("admin");
  }

  function startConversationsSync() {
    if (unsubConversations) unsubConversations();
    window.SupabaseService.subscribeConversations((convs) => {
      AppState.conversations = convs || [];
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
      AppState.conversations = [];
      AppState.activeMessages = [];
      AppState.activeChatId = null;
      AppState.activeMessagesChannel = null;
      if (unsubConversations) { unsubConversations(); unsubConversations = null; }
      if (unsubActiveMessages) { unsubActiveMessages(); unsubActiveMessages = null; }
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
        quickCatchupList.innerHTML = AppState.catchups.slice(0, 2).map(c => `
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
            <button class="btn-liquid ${c.isJoined ? 'btn-glass' : 'btn-primary'} btn-sm btn-join-catchup" data-id="${c.id}">
              ${c.isJoined ? "Joined ✓" : "Join"}
            </button>
          </div>
        `).join("");

        quickCatchupList.querySelectorAll(".btn-join-catchup").forEach(btn => {
          btn.addEventListener("click", () => toggleJoinCatchup(btn.dataset.id));
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
  function renderMatchView() {
    const container = document.getElementById("match-card-container");
    if (!container) return;

    const buddyProfiles = getActiveBuddyProfiles();
    if (buddyProfiles.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 48px 24px; max-width: 580px; margin: 0 auto;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: #EFF6FF; color: #3A86C8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            ${ICONS.users}
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">No Study Buddies in Directory Yet</h3>
          <p style="color: #64748B; max-width: 440px; margin: 0 auto 24px auto;">
            Study Buddy automatically finds scholars on the same course. Complete your course and cohort once to get started.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-liquid btn-primary" onclick="CampusApp.openCreateProfileModal()">
              <span>+ Add Scholar Profile</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (AppState.currentMatchIndex >= buddyProfiles.length) {
      container.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 48px 24px; max-width: 580px; margin: 0 auto;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: #D1FAE5; color: #059669; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            ${ICONS.check}
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">You've Reviewed All Current Study Buddies</h3>
          <p style="color: #64748B; max-width: 420px; margin: 0 auto 24px auto;">You can reset the directory to review study partners again, or add a new scholar profile.</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button id="btn-reset-match-stack" class="btn-liquid btn-primary">
              <span>Review Directory Again</span>
            </button>
            <button class="btn-liquid btn-glass" onclick="CampusApp.openCreateProfileModal()">
              <span>+ Add New Scholar</span>
            </button>
          </div>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-match-stack");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          AppState.currentMatchIndex = 0;
          renderMatchView();
        });
      }
      return;
    }

    const student = buddyProfiles[AppState.currentMatchIndex];
    container.innerHTML = `
      <div class="glass-panel match-card-main">
        <div class="match-photo-holder">
          <img src="${resolveAssetUrl(student.avatar || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" alt="${student.name}" referrerpolicy="no-referrer">
          <div class="match-compat-chip">
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              ${ICONS.spark} ${student.compatScore || 92}% Syllabus Alignment
            </span>
          </div>
          <div class="match-photo-overlay">
            <h2 style="font-size: 1.8rem; font-weight: 800; line-height: 1.2;">${student.name}</h2>
            <div style="font-size: 0.95rem; opacity: 0.95; font-weight: 600;">${student.major} • ${student.year}</div>
            <div style="font-size: 0.82rem; opacity: 0.9; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
              ${ICONS.pin} ${student.location || 'IATS Main Campus'}
            </div>
          </div>
        </div>

        <div class="match-body-content">
          <div style="font-size: 0.88rem; font-weight: 700; color: #D8232A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Registered IATS Courses</div>
          <div class="tag-list">
            ${(student.courses || []).map(c => `<span class="tag-pill tag-pill-highlight">${c}</span>`).join("")}
          </div>

          <div style="font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-top: 14px; margin-bottom: 6px;">Academic Focus & Study Goals</div>
          <p style="font-size: 0.92rem; color: #334155; line-height: 1.55;">${student.bio}</p>

          <div style="font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-top: 14px; margin-bottom: 6px;">Specializations & Interests</div>
          <div class="tag-list">
            ${(student.interests || []).map(i => `<span class="tag-pill tag-pill-blue">${i}</span>`).join("")}
          </div>
        </div>

        <div class="match-actions-bar">
          <button class="btn-round-action btn-pass" id="btn-match-pass" title="Next Scholar" aria-label="Next Scholar">
            ${ICONS.cross}
          </button>
          <button class="btn-round-action btn-super" id="btn-match-super" title="Study Group Invite" aria-label="Study Group Invite">
            ${ICONS.star}
          </button>
          <button class="btn-round-action btn-like" id="btn-match-like" title="Connect as Study Buddy" aria-label="Connect as Study Buddy">
            ${ICONS.userPlus}
          </button>
        </div>
      </div>
    `;

    const passBtn = document.getElementById("btn-match-pass");
    if (passBtn) passBtn.addEventListener("click", () => handleMatchAction("pass"));
    const likeBtn = document.getElementById("btn-match-like");
    if (likeBtn) likeBtn.addEventListener("click", () => handleMatchAction("like"));
    const superBtn = document.getElementById("btn-match-super");
    if (superBtn) superBtn.addEventListener("click", () => handleMatchAction("super"));
  }

  function handleMatchAction(action) {
    const student = AppState.matchProfiles[AppState.currentMatchIndex];
    if (!student) return;

    if (action === "like" || action === "super") {
      showMatchSuccessModal(student);
    } else {
      AppState.currentMatchIndex++;
      renderMatchView();
    }
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

  function startChatWithStudent(student) {
    let conv = AppState.conversations.find(c => c.peer_id && student.id && c.peer_id === student.id);
    if (!conv) {
      conv = {
        id: String(Date.now()),
        name: student.name,
        avatar: student.avatar || DEFAULT_AVATAR_PLACEHOLDER,
        status: "online",
        major: student.major,
        unread: 0,
        messages: [
          { sender: "them", text: `Hello! Great to connect as study buddies! I see we share ${student.courses && student.courses[0] ? student.courses[0] : 'coursework at IATS'}.`, time: "Just now" }
        ]
      };
      AppState.conversations.unshift(conv);

      if (window.SupabaseService && typeof window.SupabaseService.saveConversation === "function") {
        window.SupabaseService.saveConversation(conv);
      }
    }
    AppState.activeChatId = conv.id;
    navigateTo("chats");
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
    const attendees = event.maxAttendees == null && event.max_attendees == null
      ? (event.attendees || 1) + " attending · Unlimited capacity"
      : (event.attendees || 1) + "/" + (event.maxAttendees ?? event.max_attendees) + " going";
    return "<article class='glass-panel catchup-card' style='display:flex;flex-direction:column;justify-content:space-between;gap:16px;'>"
      + "<div><div style='display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap;'>"
      + "<span class='tag-pill tag-pill-highlight'>" + escapeEventText(event.tag || "Academic Event") + "</span>"
      + "<span class='tag-pill " + (status === "live" ? "tag-pill-highlight" : "tag-pill-blue") + "' data-event-status-label>" + label + "</span></div>"
      + "<div style='font-size:.82rem;font-weight:700;color:#D8232A;margin-bottom:10px;' data-event-countdown data-event-status='" + status + "' data-start-iso='" + escapeEventText(start || "") + "' data-end-iso='" + escapeEventText(end || "") + "' data-start-ms='" + startMs + "' data-end-ms='" + endMs + "'>"
      + formatEventCountdown(start, end) + "</div>"
      + "<h3 style='font-size:1.15rem;font-weight:700;color:#1E293B;line-height:1.35;margin-bottom:6px;'>" + escapeEventText(event.title) + "</h3>"
      + (event.description ? "<p style='font-size:.88rem;color:#475569;line-height:1.55;margin:0 0 10px;white-space:pre-wrap;'>" + escapeEventText(event.description) + "</p>" : "")
      + "<div style='color:#64748B;font-size:.86rem;margin-bottom:6px;'>" + ICONS.pin + " " + escapeEventText(event.location || "Location not set") + "</div>"
      + "<div style='font-size:.86rem;color:#64748B;margin-bottom:8px;'>" + ICONS.clock + " " + escapeEventText(formatEventDateTime(start) === "Date/time not set" ? (event.time || event.event_time || "Date/time not set") : formatEventDateTime(start))
      + (end ? " – " + escapeEventText(new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) : "") + "</div>"
      + "<div style='font-size:.8rem;color:#64748B;'>" + escapeEventText(attendees) + "</div></div>"
      + "<div class='catchup-attendees'><div style='display:flex;align-items:center;gap:8px;'>"
      + "<img src='" + avatar + "' onerror=\"this.onerror=null;this.src='" + DEFAULT_AVATAR_PLACEHOLDER + "';\" style='width:32px;height:32px;border-radius:50%;object-fit:cover;' alt='Host'>"
      + "<span style='font-size:.82rem;font-weight:500;'>Host: <b>" + escapeEventText(event.host || "IATS Scholar") + "</b></span></div>"
      + "<button class='btn-liquid " + (event.isJoined ? "btn-glass" : "btn-primary") + " btn-sm btn-catchup-toggle' data-id='" + escapeEventText(event.id) + "' " + (status === "past" ? "disabled" : "") + ">"
      + (event.isJoined ? "Leave Event" : "Join Event") + "</button></div></article>";
  }

  function isCampusNewsItem(item) {
    return String(item?.item_type || "").toLowerCase() === "news" ||
      String(item?.tag || "").toLowerCase().replace(/\s+/g, "") === "campusnews";
  }

  function renderCampusNewsCard(item) {
    const description = String(item.description || "");
    const excerpt = description.length > 240 ? description.slice(0, 240).trimEnd() + "…" : description;
    return "<article class='glass-panel catchup-card campus-news-card' style='cursor:pointer;display:flex;flex-direction:column;gap:14px;' data-open-details='" + escapeEventText(item.id) + "'>"
      + "<div style='display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;'><span class='tag-pill tag-pill-highlight'>OFFICIAL CAMPUS NEWS</span><span style='font-size:.78rem;color:#64748B;'>" + escapeEventText(formatEventDateTime(item.created_at)) + "</span></div>"
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
    return "<article class='glass-panel catchup-card' style='display:flex;flex-direction:column;justify-content:space-between;gap:14px;'>"
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
    const news = all.filter(isCampusNewsItem).sort((a,b) => Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0));
    const groups = [{key:"live",title:"Live Now",events:[]},{key:"upcoming",title:"Upcoming Events",events:[]},{key:"past",title:"Past Events",events:[]}];
    all.filter(item => !isCampusNewsItem(item)).forEach(event => groups.find(group => group.key === eventStatus(event)).events.push(event));
    groups.forEach(group => group.events.sort((a,b) => {
      const as = Date.parse(getEventStart(a) || ""), bs = Date.parse(getEventStart(b) || "");
      if (!Number.isFinite(as) && !Number.isFinite(bs)) return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
      if (!Number.isFinite(as)) return 1; if (!Number.isFinite(bs)) return -1;
      return group.key === "past" ? bs - as : as - bs;
    }));
    let markup = "";
    if (news.length) markup += "<section style='grid-column:1/-1;margin-bottom:20px;'><div style='display:flex;align-items:end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:4px 0 14px;'><div><h3 style='font-size:1.25rem;font-weight:850;color:#1E293B;margin:0 0 4px;'>Official Campus News</h3><p style='color:#64748B;font-size:.88rem;margin:0;'>Important announcements from IATS CONNECT — shown first.</p></div><span class='tag-pill tag-pill-highlight'>" + news.length + " " + (news.length === 1 ? "announcement" : "announcements") + "</span></div><div class='catchup-grid campus-news-grid'>" + news.map(renderCampusNewsCard).join("") + "</div></section>";
    markup += groups.filter(group => group.events.length).map(group => "<section style='grid-column:1/-1;margin-bottom:20px;'><h3 style='font-size:1.1rem;font-weight:850;color:#1E293B;margin:8px 0 14px;'>" + group.title + " <span style='font-size:.8rem;color:#64748B;'>(" + group.events.length + ")</span></h3><div class='catchup-grid'>" + group.events.map(renderCatchupCard).join("") + "</div></section>").join("");
    if (!markup) markup = "<div class='glass-panel' style='grid-column:1/-1;text-align:center;padding:40px 24px;'><h3 style='font-size:1.3rem;font-weight:850;color:#1E293B;margin-bottom:8px;'>No Events or News Yet</h3><p style='color:#64748B;max-width:520px;margin:0 auto;'>Academic events will appear here, while official campus news will always be prioritised above them.</p></div>";
    grid.innerHTML = markup;
    grid.querySelectorAll(".btn-catchup-toggle").forEach(btn => btn.addEventListener("click", () => toggleJoinCatchup(btn.dataset.id)));
    grid.querySelectorAll(".btn-open-catchup-details").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); openCatchupDetails(btn.dataset.id); }));
    grid.querySelectorAll("[data-open-details]").forEach(card => card.addEventListener("click", () => openCatchupDetails(card.dataset.openDetails)));
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
        + "<div style='font-size:.85rem;color:#64748B;'>" + escapeEventText(event.tag || "Academic Event") + " · " + escapeEventText(event.location || "Location not set") + " · Host: " + escapeEventText(event.host || "IATS Scholar") + "</div>"
        + (event.description ? "<div style='font-size:.82rem;color:#475569;margin-top:5px;line-height:1.45;'>" + escapeEventText(event.description.slice(0, 220)) + (event.description.length > 220 ? "…" : "") + "</div>" : "")
        + "<div style='font-size:.82rem;color:#64748B;margin-top:5px;'>" + (isCampusNewsItem(event) ? "Published " + escapeEventText(formatEventDateTime(event.created_at)) + " · No registration required" : escapeEventText(formatEventDateTime(start) === "Date/time not set" ? (event.event_time || "Date/time not set") : formatEventDateTime(start)) + " · " + escapeEventText(cap) + (event.registration_deadline ? " · Register by " + escapeEventText(formatEventDateTime(event.registration_deadline)) : "")) + "</div></div>"
        + "<div style='display:flex;align-items:center;gap:8px;flex-wrap:wrap;'><div style='font-size:.82rem;font-weight:700;color:#D8232A;' data-event-countdown data-event-status='" + status + "' data-start-iso='" + escapeEventText(start || "") + "' data-end-iso='" + escapeEventText(end || "") + "' data-start-ms='" + startMs + "' data-end-ms='" + endMs + "'>" + formatEventCountdown(start, end, now) + "</div>"
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
    const event = eventId ? (AppState.adminEvents || []).find(item => String(item.id) === String(eventId)) : null;
    if (eventId && (!isNewsPublisher() || !event)) {
      showToast("Administrator Only", "Refresh the admin panel and try again.");
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
    const urlGroup = document.getElementById("catchup-online-url-group");
    if (location) location.required = !isNews && format !== "online";
    if (start) start.required = !isNews;
    if (end) end.required = !isNews;
    if (url) url.required = !isNews && format !== "physical";
    if (urlGroup) urlGroup.style.display = isNews || format === "physical" ? "none" : "";
  }

  async function handleCreateCatchup(e) {
    e.preventDefault();
    const title = document.getElementById("new-catchup-title") ? document.getElementById("new-catchup-title").value.trim() : "";
    const location = document.getElementById("new-catchup-location") ? document.getElementById("new-catchup-location").value.trim() : "";
    const description = document.getElementById("new-catchup-description") ? document.getElementById("new-catchup-description").value.trim() : "";
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
    const capacityValue = capacityInput ? capacityInput.value.trim() : "";
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
      if (format !== "physical" && !/^https?:\/\//i.test(onlineUrl)) {
        alert("Please provide a valid online meeting URL beginning with https:// or http://.");
        return;
      }
      if (registrationDeadline && (!Number.isFinite(registrationDeadline.getTime()) || registrationDeadline > startsAt)) {
        alert("The registration deadline must be a valid date/time before the event starts.");
        return;
      }
    }
    if (AppState.editingEventId && !isNewsPublisher()) {
      showToast("Administrator Only", "Only the platform developer can edit published events.");
      return;
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
      ? (AppState.adminEvents || []).find(item => String(item.id) === String(AppState.editingEventId))
      : null;
    const hostName = editingEvent ? (editingEvent.host || AppState.currentUser.name) : AppState.currentUser.name;
    const hostAvatar = editingEvent
      ? (editingEvent.host_avatar || DEFAULT_AVATAR_PLACEHOLDER)
      : (AppState.currentUser.avatar || DEFAULT_AVATAR_PLACEHOLDER);

    const newCatchup = {
      title,
      description,
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
    const faculties = [...new Set(IATS_COURSES.map(c => c.faculty))];
    if (!faculties.includes(AppState.activeHubFaculty)) AppState.activeHubFaculty = faculties[0];
    sidebar.innerHTML = faculties.map(faculty => {
      const count = IATS_COURSES.filter(c => c.faculty === faculty).length;
      return "<li><button class='hub-channel-btn " + (AppState.activeHubFaculty === faculty ? "active" : "") + "' data-faculty='" + faculty.replace(/'/g,"&#39;") + "' type='button'>" + faculty + " <span style='opacity:.7'>(" + count + ")</span></button></li>";
    }).join("") + "<li><button class='hub-channel-btn " + (AppState.activeHubCategory === "all" ? "active" : "") + "' data-course='all' type='button'>All Course Discussions</button></li>";
    let coursePanel = document.getElementById("hub-course-list");
    if (!coursePanel) {
      coursePanel = document.createElement("div");
      coursePanel.id = "hub-course-list";
      coursePanel.className = "glass-panel";
      coursePanel.style.cssText = "padding:14px;margin-top:12px;";
      sidebar.parentElement.appendChild(coursePanel);
    }
    const facultyCourses = IATS_COURSES.filter(c => c.faculty === AppState.activeHubFaculty);
    coursePanel.innerHTML = "<div style='font-weight:800;margin:0 0 10px;color:#1E293B;'>Courses in this faculty</div>" + facultyCourses.map(c =>
      "<button type='button' class='hub-course-btn " + (AppState.activeHubCategory === c.code ? "active" : "") + "' data-course='" + c.code + "' style='display:block;width:100%;text-align:left;padding:9px 10px;margin:4px 0;border:1px solid #E2E8F0;border-radius:10px;background:" + (AppState.activeHubCategory === c.code ? "#FEE2E2" : "transparent") + ";color:#1E293B;cursor:pointer;'>" + c.code + " · " + c.name + "</button>"
    ).join("");
    const selectedCourse = IATS_COURSES.find(c => c.code === AppState.activeHubCategory);
    const heading = selectedCourse ? selectedCourse.name : AppState.activeHubCategory === "all" ? "All Course Discussions" : AppState.activeHubFaculty;
    if (AppState.activeHubCategory === "faculty") {
      listContainer.innerHTML = "<div style='margin-bottom:14px;'><h3 style='font-size:1.2rem;font-weight:800;color:#1E293B;margin:0 0 6px;'>" + escapeEventText(AppState.activeHubFaculty) + "</h3><p style='color:#64748B;font-size:.9rem;margin:0;'>Choose one of the official programmes below to open its course community.</p></div><div class='hub-course-grid' style='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px;'>" + facultyCourses.map(c => "<button type='button' class='glass-panel hub-course-card' data-course='" + c.code + "' style='text-align:left;padding:16px;border:1px solid #E2E8F0;cursor:pointer;min-width:0;'><span style='display:inline-block;font-size:.76rem;font-weight:800;color:#D8232A;margin-bottom:7px;'>" + c.code + "</span><span style='display:block;font-weight:750;color:#1E293B;line-height:1.4;'>" + escapeEventText(c.name) + "</span><span style='display:block;color:#64748B;font-size:.8rem;margin-top:9px;'>Open course community →</span></button>").join("") + "</div>";
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
    sidebar.querySelectorAll("[data-faculty]").forEach(btn => btn.addEventListener("click", () => { AppState.activeHubFaculty = btn.dataset.faculty; AppState.activeHubCategory = "faculty"; renderHubsView(); }));
    sidebar.querySelectorAll("[data-course]").forEach(btn => btn.addEventListener("click", () => { AppState.activeHubCategory = btn.dataset.course === "all" ? "all" : btn.dataset.course; if (btn.dataset.course !== "all") { const c = IATS_COURSES.find(x => x.code === btn.dataset.course); if (c) AppState.activeHubFaculty = c.faculty; } renderHubsView(); }));
    coursePanel.querySelectorAll("[data-course]").forEach(btn => btn.addEventListener("click", () => { AppState.activeHubCategory = btn.dataset.course; renderHubsView(); }));
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
    const peerOnline = !!(activeConv && AppState.onlineUserIds.includes(activeConv.peer_id));
    if (activeConv) AppState.activeChatId = activeConv.id;

    // Render Left Sidebar Threads
    threadsList.innerHTML = AppState.conversations.map(c => `
      <div class="chat-thread-item ${String(c.id) === String(activeConv.id) ? 'active' : ''}" data-id="${c.id}">
        <img src="${resolveAssetUrl(c.avatar_url || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover;" alt="${c.name}">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-weight: 700; font-size: 0.92rem; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</div>
            ${c.unread ? `<span class="nav-badge">${c.unread}</span>` : ''}
          </div>
          <div style="font-size: 0.8rem; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${c.last_message ? c.last_message : 'No messages yet'}
          </div>
        </div>
      </div>
    `).join("");

    threadsList.querySelectorAll(".chat-thread-item").forEach(item => {
      item.addEventListener("click", () => {
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

    // Render Active Header
    if (activeHeader && activeConv) {
      activeHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${resolveAssetUrl(activeConv.avatar_url || DEFAULT_AVATAR_PLACEHOLDER)}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR_PLACEHOLDER}';" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="${activeConv.name}">
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: #1E293B;">${activeConv.name}</div>
            <div style="font-size: 0.8rem; color: #059669; display: flex; align-items: center; gap: 5px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${peerOnline ? "#059669" : "#94A3B8"}; display: inline-block;"></span>
              ${peerOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      `;
    }

    // Render Messages — sourced from the live, real-time `messages` table
    // (see startActiveMessagesSync). No delay: new rows push in over
    // Supabase Realtime and re-render this exact block automatically.
    if (activeConv) {
      const myId = AppState.currentUser ? AppState.currentUser.id : null;
      messagesWindow.innerHTML = (AppState.activeMessages || []).map(msg => `
        <div class="message-bubble ${msg.sender_id === myId ? 'msg-outgoing' : 'msg-incoming'}">
          <div style="font-size:.7rem;font-weight:700;opacity:.8;margin-bottom:4px;">${msg.sender_id === myId ? "You" : escapeEventText(msg.sender_name || activeConv.name || "IATS Scholar")}</div><div>${escapeEventText(msg.text)}</div>
          <div style="font-size: 0.72rem; opacity: 0.75; text-align: right; margin-top: 4px;">${formatMessageTime(msg.created_at)}</div>
        </div>
      `).join("") || `<div style="text-align:center; color:#94A3B8; font-size:0.85rem; padding: 30px 0;">No messages yet — say hello 👋</div>`;

      messagesWindow.scrollTop = messagesWindow.scrollHeight;
    }
  }

  function formatMessageTime(isoString) {
    if (!isoString) return "Just now";
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "Just now";
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
      await window.SupabaseService.sendMessage(activeConv.id, text);
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
    const recipient = document.getElementById("new-chat-recipient").value.trim();
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
        recipientName: recipient,
        major: faculty || "IATS Scholar",
        firstMessage: "",
        avatar: DEFAULT_AVATAR_PLACEHOLDER
      });
      if (conv) {
        AppState.activeChatId = conv.id;
        startActiveMessagesSync(conv.id);
      }

      closeNewChatModal();
      const form = document.getElementById("new-chat-form");
      if (form) form.reset();

      showToast("Chat Started", `Academic conversation with ${recipient} created.`);
      navigateTo("chats");
    } catch (err) {
      alert(err.message || "Couldn't start that chat. Please try again.");
    } finally {
      clearButtonLoading(submitBtn);
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
            ${isDeveloperAccount ? "" : '<button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openCreateProfileModal()"><span>+ Register Scholar Candidate</span></button>'}
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
    if (openHostCatchup) openHostCatchup.addEventListener("click", openHostCatchupModal);

    const catchupForm = document.getElementById("host-catchup-form");
    if (catchupForm) catchupForm.addEventListener("submit", handleCreateCatchup);
    const catchupTag = document.getElementById("new-catchup-tag");
    if (catchupTag) catchupTag.addEventListener("change", syncCatchupFormType);
    const catchupFormat = document.getElementById("new-catchup-format");
    if (catchupFormat) catchupFormat.addEventListener("change", syncCatchupFormType);

    const closeCatchupBtn = document.getElementById("btn-close-catchup-modal");
    if (closeCatchupBtn) closeCatchupBtn.addEventListener("click", closeHostCatchupModal);

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

    const closeChatBtn = document.getElementById("btn-close-chat-modal");
    if (closeChatBtn) closeChatBtn.addEventListener("click", closeNewChatModal);

    // Chat Message Form
    const chatForm = document.getElementById("chat-send-form");
    if (chatForm) chatForm.addEventListener("submit", handleSendMessage);

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
