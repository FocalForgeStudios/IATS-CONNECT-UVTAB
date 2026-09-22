/**
 * IATS CONNECT - Core Engine & Interactive State Manager
 * Institute of Advanced Technology & Studies Student Hub
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

  // Curated African student portrait collection for authentic representation (100% local, offline-safe relative paths)
  const AFRICAN_SCHOLAR_AVATARS = [
    "./images/scholar_female.jpg",
    "./images/scholar_male.jpg",
    "./images/scholar_glasses.jpg",
    "./images/scholar_laptop.jpg"
  ];

  function getRandomAfricanAvatar() {
    return AFRICAN_SCHOLAR_AVATARS[Math.floor(Math.random() * AFRICAN_SCHOLAR_AVATARS.length)];
  }

  // Global Dynamic State Store (Strictly Cloud Firestore Driven, No LocalStorage Mock Data)
  const AppState = {
    currentUser: null,
    activeView: "landing",
    pendingEmail: null,
    otpTimer: null,
    otpSecondsRemaining: 60,
    currentMatchIndex: 0,
    activeChatId: null,
    activeHubCategory: "tech",
    
    // Live Cloud Database collections
    matchProfiles: [],
    catchups: [],
    hubPosts: [],
    conversations: [],
    activeMessages: []
  };

  // ==========================================
  // Strict Academic Content Moderation Hook
  // ==========================================
  function validateAcademicContent(fieldsObj, contextTitle = "Academic Entry") {
    if (!window.IATSContentFilter || typeof window.IATSContentFilter.checkFields !== "function") {
      return true;
    }
    const result = window.IATSContentFilter.checkFields(fieldsObj);
    if (!result.allowed) {
      const reasonBox = document.getElementById("filter-warning-reason-text");
      if (reasonBox) {
        reasonBox.innerHTML = `<b>Policy Rejection:</b> ${result.reason}`;
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
    renderNavigation();
    bindEvents();
    renderActiveView();
    updateUnreadBadge();
    initHeaderScrollBlur();
    initSupabaseSync();
    hideBootLoaderWhenReady();
  }

  // Shows the boot loader for a minimum of ~2 seconds so the app always
  // presents a clear, deliberate loading state instead of a flash of
  // unstyled content — purely a UX/perception change, no UI redesign.
  function hideBootLoaderWhenReady() {
    const MIN_VISIBLE_MS = 2000;
    const startedAt = Date.now();
    const finish = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(() => {
        const loader = document.getElementById("app-boot-loader");
        if (loader) loader.classList.add("is-hidden");
      }, remaining);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
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
    });

    // React instantly to real sign-in / sign-out / token refresh events.
    window.SupabaseService.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && session.user) {
        hydrateSessionFromAuthUser(session.user);
      } else if (event === "SIGNED_OUT") {
        AppState.currentUser = null;
        renderNavigation();
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
      AppState.catchups = catchups || [];
      if (AppState.activeView === "catchup" || AppState.activeView === "dashboard") {
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
    AppState.currentUser = {
      id: authUser.id,
      name: (profile && profile.name) || "IATS Scholar",
      email: authUser.email,
      major: (profile && profile.major) || "Undeclared",
      year: (profile && profile.year) || "Class of 2026",
      bio: (profile && profile.bio) || "",
      courses: (profile && profile.courses) || [],
      interests: (profile && profile.interests) || [],
      skills: (profile && profile.interests && profile.interests.length ? profile.interests : ["Academic Collaboration"]),
      avatar: profile && profile.avatar_url, // may be undefined — UI already falls back to a default vector
      location: (profile && profile.location) || "IATS Main Campus",
      authProvider: provider === "google" ? "Google Account (Verified)" : "Personal Email (Verified)",
      isVerified: true
    };
    renderNavigation();
    startConversationsSync();
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

  async function clearSession() {
    if (window.SupabaseService && typeof window.SupabaseService.signOut === "function") {
      await window.SupabaseService.signOut();
    }
    AppState.currentUser = null;
    AppState.conversations = [];
    AppState.activeMessages = [];
    AppState.activeChatId = null;
    if (unsubConversations) unsubConversations();
    if (unsubActiveMessages) unsubActiveMessages();
    renderNavigation();
    navigateTo("landing");
    showToast("Signed Out", "You've been signed out of your IATS CONNECT account.");
  }

  // ==========================================
  // Navigation & View Routing
  // ==========================================
  function navigateTo(viewId) {
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
          <img src="${resolveAssetUrl(AppState.currentUser.avatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" class="user-avatar-sm" alt="${AppState.currentUser.name}">
          <span style="font-weight: 700; font-size: 0.88rem; color: #1E293B;">${AppState.currentUser.name}</span>
          <span class="tag-pill tag-pill-highlight" style="font-size: 0.72rem; padding: 2px 8px;">IATS Verified</span>
        </div>
        <button class="btn-liquid btn-glass btn-sm" id="btn-header-logout" title="Sign Out">
          <span>Sign Out</span>
        </button>
      `;
      const profBtn = document.getElementById("btn-header-profile");
      if (profBtn) profBtn.addEventListener("click", () => navigateTo("profile"));
      const logoutBtn = document.getElementById("btn-header-logout");
      if (logoutBtn) logoutBtn.addEventListener("click", clearSession);
    } else {
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
    
    if (stepMain) stepMain.style.display = (step === "main") ? "block" : "none";
    if (stepOtp) stepOtp.style.display = (step === "otp") ? "block" : "none";
    if (stepSuccess) stepSuccess.style.display = (step === "success") ? "block" : "none";
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
              <img src="${resolveAssetUrl(c.hostAvatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="host">
              <div>
                <div style="font-weight: 700; font-size: 0.94rem; color: #1E293B;">${c.title}</div>
                <div style="font-size: 0.82rem; color: #64748B; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  ${ICONS.pin} <span>${c.location}</span> • <b>${c.time}</b>
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
                <img src="${resolveAssetUrl(p.authorAvatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" alt="author">
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
        radarText.innerHTML = "No study partner profiles in the directory yet. Tap <b>+ Add Scholar Profile</b> to register your syllabus and find a study buddy.";
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

    if (AppState.matchProfiles.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 48px 24px; max-width: 580px; margin: 0 auto;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: #EFF6FF; color: #3A86C8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            ${ICONS.users}
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">No Study Buddies in Directory Yet</h3>
          <p style="color: #64748B; max-width: 440px; margin: 0 auto 24px auto;">
            The real-time Firestore study partner directory is ready. Add your scholar profile or register classmates with syllabus codes to find compatible study buddies.
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

    if (AppState.currentMatchIndex >= AppState.matchProfiles.length) {
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

    const student = AppState.matchProfiles[AppState.currentMatchIndex];
    container.innerHTML = `
      <div class="glass-panel match-card-main">
        <div class="match-photo-holder">
          <img src="${resolveAssetUrl(student.avatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" alt="${student.name}" referrerpolicy="no-referrer">
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
      avatarElem.src = resolveAssetUrl(student.avatar || getRandomAfricanAvatar());
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
    let conv = AppState.conversations.find(c => c.name === student.name);
    if (!conv) {
      conv = {
        id: String(Date.now()),
        name: student.name,
        avatar: student.avatar || getRandomAfricanAvatar(),
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
    const modal = document.getElementById("create-profile-modal");
    if (modal) modal.classList.add("open");
  }

  function closeCreateProfileModal() {
    const modal = document.getElementById("create-profile-modal");
    if (modal) modal.classList.remove("open");
  }

  async function handleCreateProfile(e) {
    e.preventDefault();
    const name = document.getElementById("new-student-name").value.trim();
    const major = document.getElementById("new-student-major").value.trim();
    const year = document.getElementById("new-student-year").value.trim();
    const coursesStr = document.getElementById("new-student-courses").value.trim();
    const location = document.getElementById("new-student-location").value.trim();
    const bio = document.getElementById("new-student-bio").value.trim();
    const interestsStr = document.getElementById("new-student-interests").value.trim();

    if (!name || !major || !bio) {
      alert("Please fill in all required fields.");
      return;
    }

    // STRICT ACADEMIC CONTENT FILTER VERIFICATION
    if (!validateAcademicContent({
      name,
      major,
      year,
      courses: coursesStr,
      location,
      bio,
      interests: interestsStr
    }, "Scholar Profile Registration")) {
      return;
    }

    const courses = coursesStr.split(",").map(c => c.trim()).filter(Boolean);
    const interests = interestsStr.split(",").map(i => i.trim()).filter(Boolean);

    const newStudent = {
      name,
      major,
      year: year || "IATS Scholar",
      university: "IATS",
      compatScore: Math.floor(84 + Math.random() * 14),
      bio,
      courses: courses.length ? courses : ["CS 201", "IT Core"],
      interests: interests.length ? interests : ["Research", "Algorithms"],
      avatar: getRandomAfricanAvatar(),
      location: location || "IATS Main Campus"
    };

    if (window.SupabaseService && typeof window.SupabaseService.addMatchProfile === "function") {
      const saved = await window.SupabaseService.addMatchProfile(newStudent);
      if (saved) {
        newStudent.id = saved.id;
      }
    }

    AppState.matchProfiles.push(newStudent);

    closeCreateProfileModal();
    const form = document.getElementById("create-profile-form");
    if (form) form.reset();

    showToast("Profile Added", `${name} added to the real-time study buddy directory.`);
    renderMatchView();
  }

  // ==========================================
  // Academic Events & News (CatchUp) Logic
  // ==========================================
  function renderCatchUpView() {
    const grid = document.getElementById("catchup-grid-container");
    if (!grid) return;

    if (AppState.catchups.length === 0) {
      grid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #EFF6FF; color: #3A86C8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            ${ICONS.coffee}
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">No Academic Events Scheduled</h3>
          <p style="color: #64748B; max-width: 440px; margin: 0 auto 20px auto;">
            Organize study sprints, departmental seminars, lecture discussions, or revision workshops for IATS scholars.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-liquid btn-primary" onclick="CampusApp.openHostCatchupModal()">
              <span>+ Host First Academic Event</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = AppState.catchups.map(c => `
      <div class="glass-panel catchup-card">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span class="tag-pill tag-pill-highlight">${c.tag || 'Academic Event'}</span>
            <span style="font-size: 0.8rem; font-weight: 700; color: #D8232A; display: flex; align-items: center; gap: 4px;">
              ${ICONS.users} ${c.attendees || 1}/${c.maxAttendees || 8} Going
            </span>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #1E293B; line-height: 1.35; margin-bottom: 6px;">${c.title}</h3>
          <div class="catchup-meta" style="display: flex; align-items: center; gap: 4px; color: #64748B; font-size: 0.86rem; margin-bottom: 6px;">
            ${ICONS.pin} <span>${c.location}</span>
          </div>
          <div style="font-size: 0.86rem; color: #64748B; margin-bottom: 16px; display: flex; align-items: center; gap: 4px;">
            ${ICONS.clock} <b>${c.time}</b>
          </div>
        </div>

        <div class="catchup-attendees">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${resolveAssetUrl(c.hostAvatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="${c.host}">
            <span style="font-size: 0.82rem; font-weight: 500;">Host: <b>${c.host}</b></span>
          </div>
          <button class="btn-liquid ${c.isJoined ? 'btn-glass' : 'btn-primary'} btn-sm btn-catchup-toggle" data-id="${c.id}">
            ${c.isJoined ? "Leave Event" : "Join Event"}
          </button>
        </div>
      </div>
    `).join("");

    grid.querySelectorAll(".btn-catchup-toggle").forEach(btn => {
      btn.addEventListener("click", () => toggleJoinCatchup(btn.dataset.id));
    });
  }

  function toggleJoinCatchup(id) {
    const catchup = AppState.catchups.find(c => String(c.id) === String(id));
    if (!catchup) return;

    if (catchup.isJoined) {
      catchup.isJoined = false;
      catchup.attendees = Math.max(0, (catchup.attendees || 1) - 1);
      if (window.SupabaseService && typeof window.SupabaseService.toggleCatchupAttendance === "function") {
        window.SupabaseService.toggleCatchupAttendance(id, AppState.currentUser ? AppState.currentUser.id : "guest", false);
      }
      showToast("Left Event", `You left "${catchup.title}".`);
    } else {
      if ((catchup.attendees || 0) >= (catchup.maxAttendees || 8)) {
        alert("This academic event is currently at maximum capacity!");
        return;
      }
      catchup.isJoined = true;
      catchup.attendees = (catchup.attendees || 0) + 1;
      if (window.SupabaseService && typeof window.SupabaseService.toggleCatchupAttendance === "function") {
        window.SupabaseService.toggleCatchupAttendance(id, AppState.currentUser ? AppState.currentUser.id : "guest", true);
      }
      showToast("Spot Confirmed", `You are attending "${catchup.title}".`);
    }

    renderActiveView();
  }

  function openHostCatchupModal() {
    const hostModal = document.getElementById("host-catchup-modal");
    if (hostModal) hostModal.classList.add("open");
  }

  function closeHostCatchupModal() {
    const hostModal = document.getElementById("host-catchup-modal");
    if (hostModal) hostModal.classList.remove("open");
  }

  async function handleCreateCatchup(e) {
    e.preventDefault();
    const title = document.getElementById("new-catchup-title") ? document.getElementById("new-catchup-title").value.trim() : "";
    const location = document.getElementById("new-catchup-location") ? document.getElementById("new-catchup-location").value.trim() : "";
    const time = document.getElementById("new-catchup-time") ? document.getElementById("new-catchup-time").value.trim() : "";
    const tag = document.getElementById("new-catchup-tag") ? document.getElementById("new-catchup-tag").value : "Study Group";
    const capacity = document.getElementById("new-catchup-capacity") ? (parseInt(document.getElementById("new-catchup-capacity").value) || 8) : 8;

    if (!title || !location || !time) {
      alert("Please fill out all required fields for your IATS academic event.");
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

    const hostName = AppState.currentUser ? AppState.currentUser.name : "IATS Scholar";
    const hostAvatar = AppState.currentUser ? AppState.currentUser.avatar : getRandomAfricanAvatar();

    const newCatchup = {
      title,
      host: hostName,
      hostAvatar,
      location,
      time,
      tag,
      attendees: 1,
      maxAttendees: capacity,
      isJoined: true
    };

    if (window.SupabaseService && typeof window.SupabaseService.addCatchup === "function") {
      const saved = await window.SupabaseService.addCatchup(newCatchup);
      if (saved) newCatchup.id = saved.id;
    }

    AppState.catchups.unshift(newCatchup);

    closeHostCatchupModal();
    const hostForm = document.getElementById("host-catchup-form");
    if (hostForm) hostForm.reset();
    showToast("Event Hosted", `"${newCatchup.title}" is now published on the academic feed.`);
    renderCatchUpView();
  }

  // ==========================================
  // Courses & Academic Forums (Hubs) Logic
  // ==========================================
  function renderHubsView() {
    const listContainer = document.getElementById("hub-posts-list");
    if (!listContainer) return;

    const filtered = AppState.hubPosts.filter(p => {
      if (AppState.activeHubCategory === "all") return true;
      return p.category === AppState.activeHubCategory;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 48px 24px;">
          <div style="font-weight: 700; font-size: 1.1rem; color: #1E293B; margin-bottom: 6px;">No Discussions in this Course Channel</div>
          <p style="font-size: 0.88rem; color: #64748B; max-width: 440px; margin: 0 auto 20px auto;">
            Be the first scholar to post lecture notes, course problem sets, or research questions in this faculty forum.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openCreatePostModal()">
              <span>+ Post in This Channel</span>
            </button>
          </div>
        </div>
      `;
    } else {
      listContainer.innerHTML = filtered.map(post => `
        <div class="glass-panel thread-post-card" style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${resolveAssetUrl(post.authorAvatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;" alt="${post.author}">
              <div>
                <div style="font-weight: 700; font-size: 0.92rem; color: #1E293B;">${post.author}</div>
                <div style="font-size: 0.78rem; color: #64748B;">${post.authorRole || 'IATS Scholar'} • ${post.timeAgo || 'Recent'}</div>
              </div>
            </div>
            <span class="tag-pill tag-pill-highlight">${(post.category || 'TECH').toUpperCase()}</span>
          </div>

          <h3 style="font-size: 1.15rem; font-weight: 700; color: #1E293B; margin-bottom: 8px;">${post.title}</h3>
          <p style="font-size: 0.92rem; color: #334155; line-height: 1.6; margin-bottom: 14px;">${post.content}</p>

          <div class="tag-list" style="margin-bottom: 16px;">
            ${(post.tags || []).map(t => `<span class="tag-pill tag-pill-blue">#${t}</span>`).join("")}
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.05);">
            <button class="btn-liquid btn-glass btn-sm btn-upvote-post" data-id="${post.id}" style="${post.hasUpvoted ? 'color: #D8232A; font-weight: 700; border-color: #FECACA;' : ''}">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                ${ICONS.upvote} ${post.upvotes || 0} Upvotes
              </span>
            </button>
            <span style="font-size: 0.82rem; color: #64748B; display: flex; align-items: center; gap: 4px;">
              ${ICONS.chat} ${post.commentsCount || 0} Discussions
            </span>
          </div>
        </div>
      `).join("");

      listContainer.querySelectorAll(".btn-upvote-post").forEach(btn => {
        btn.addEventListener("click", () => toggleUpvotePost(btn.dataset.id));
      });
    }

    // Handle channel selection
    document.querySelectorAll(".hub-channel-btn").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".hub-channel-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        AppState.activeHubCategory = btn.dataset.category;
        renderHubsView();
      };
    });
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

  function openCreatePostModal() {
    const modal = document.getElementById("create-post-modal");
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
    const authorAvatar = AppState.currentUser ? AppState.currentUser.avatar : getRandomAfricanAvatar();

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
    if (activeConv) AppState.activeChatId = activeConv.id;

    // Render Left Sidebar Threads
    threadsList.innerHTML = AppState.conversations.map(c => `
      <div class="chat-thread-item ${String(c.id) === String(activeConv.id) ? 'active' : ''}" data-id="${c.id}">
        <img src="${resolveAssetUrl(c.avatar_url || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover;" alt="${c.name}">
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
          <img src="${resolveAssetUrl(activeConv.avatar_url || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="${activeConv.name}">
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: #1E293B;">${activeConv.name}</div>
            <div style="font-size: 0.8rem; color: #059669; display: flex; align-items: center; gap: 5px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #059669; display: inline-block;"></span>
              ${activeConv.status || 'online'}
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
          <div>${msg.text}</div>
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
    const faculty = document.getElementById("new-chat-faculty").value.trim();
    const firstMsg = document.getElementById("new-chat-first-msg").value.trim();

    if (!recipient || !firstMsg) {
      alert("Please fill in the recipient name and initial message.");
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
      message: firstMsg
    }, "Initiate Academic Chat")) {
      return;
    }

    const submitBtn = document.getElementById("btn-submit-new-chat");
    setButtonLoading(submitBtn, "Starting chat…");
    try {
      const conv = await window.SupabaseService.createConversation({
        recipientName: recipient,
        major: faculty || "IATS Scholar",
        firstMessage: firstMsg,
        avatar: getRandomAfricanAvatar()
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
  // Student Profile Logic View
  // ==========================================
  function renderProfileView() {
    const user = AppState.currentUser || {
      name: "IATS Scholar",
      university: "Institute of Advanced Technology & Studies",
      major: "Faculty of Computing & Information Tech",
      year: "3rd Year (Class of 2026)",
      bio: "Active IATS scholar specializing in distributed cloud computing, modern UI systems, and academic peer collaboration.",
      skills: ["Software Engineering", "Algorithms", "Cloud Architecture", "Database Systems", "Academic Research"],
      authProvider: "Guest Session (Preview)",
      avatar: "./images/scholar_female.jpg"
    };

    const container = document.getElementById("profile-view-container");
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel" style="padding: 32px; max-width: 680px; margin: 0 auto;">
        <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
          <img src="${resolveAssetUrl(user.avatar || getRandomAfricanAvatar())}" onerror="this.onerror=null;this.src='./images/scholar_female.jpg';" style="width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid #D8232A; box-shadow: 0 4px 16px rgba(216,35,42,0.15);" alt="${user.name}">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #1E293B;">${user.name}</h2>
              <span class="tag-pill tag-pill-highlight" style="font-size: 0.8rem;">IATS Verified</span>
            </div>
            <div style="font-size: 0.95rem; color: #475569; font-weight: 600; margin-top: 4px;">${user.major} • ${user.university}</div>
            <div style="font-size: 0.82rem; color: #64748B; margin-top: 2px;">Auth: <b>${user.authProvider}</b></div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #D8232A; text-transform: uppercase; margin-bottom: 6px;">Biography & Academic Focus</div>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">${user.bio}</p>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-bottom: 8px;">Academic Focus Areas & Skills</div>
          <div class="tag-list">
            ${(user.skills || []).map(s => `<span class="tag-pill tag-pill-highlight">${s}</span>`).join("")}
          </div>
        </div>

        <!-- Academic Institutional Controls -->
        <div style="border-top: 1px solid rgba(0,0,0,0.06); padding-top: 20px; margin-top: 20px;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-bottom: 12px;">Institutional Platform Services</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-liquid btn-primary btn-sm" onclick="CampusApp.openCreateProfileModal()">
              <span>+ Register Scholar Candidate</span>
            </button>
            <button class="btn-liquid btn-glass btn-sm" onclick="CampusApp.openLogicInspector()">
              <span>View System Architecture</span>
            </button>
            <button class="btn-liquid btn-glass btn-sm" id="btn-profile-privacy-link" style="color: #3A86C8;">
              <span>Privacy Policy</span>
            </button>
            <button class="btn-liquid btn-glass btn-sm" id="btn-profile-terms-link" style="color: #3A86C8;">
              <span>Terms of Service</span>
            </button>
          </div>
        </div>
      </div>
    `;

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
      desc: "Welcome to IATS CONNECT. The top bar features the official Institute of Advanced Technology & Studies shield crest, frosted liquid glass navigation, and instant authentication via personal email or Google.",
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
        navigateTo(AppState.currentUser ? "dashboard" : "landing");
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

    const closeCatchupBtn = document.getElementById("btn-close-catchup-modal");
    if (closeCatchupBtn) closeCatchupBtn.addEventListener("click", closeHostCatchupModal);

    // Create Profile form
    const profileForm = document.getElementById("create-profile-form");
    if (profileForm) profileForm.addEventListener("submit", handleCreateProfile);

    const closeProfileBtn = document.getElementById("btn-close-create-profile");
    if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeCreateProfileModal);

    // Create Course Discussion Post form
    const openPostBtn = document.getElementById("btn-open-create-post");
    if (openPostBtn) openPostBtn.addEventListener("click", openCreatePostModal);

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
