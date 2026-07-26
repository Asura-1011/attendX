/**
 * Crescent Institute of Science & Technology (B.Tech AI & DS)
 * College Attendance Management System - Main Application Logic
 */

// Global Application State
let currentStudent = null;
let currentTab = "overview"; // 'overview', 'predictor', 'timetable', 'history', 'credentials'
let activeTimetableDay = "Monday";
let dashboardViewFilter = "today"; // 'today' or 'all'
let isDarkMode = true;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("crescent_app_version_v13")) {
    localStorage.clear();
    localStorage.setItem("crescent_app_version_v13", "v13");
  }

  isDarkMode = localStorage.getItem("theme_mode") !== "light";
  if (!isDarkMode) {
    document.documentElement.setAttribute("data-theme", "light");
  }

  activeTimetableDay = getCurrentDayName();

  // Fetch latest state from cloud BEFORE initial render
  await AttendanceStore.fetchFromCloud();
  renderApp();

  // Auto-sync when tab becomes active / focused (e.g. switching between Phone and Laptop)
  window.addEventListener("focus", async () => {
    if (currentStudent && !isUserTypingOrInModal()) {
      await AttendanceStore.fetchFromCloud();
      renderApp();
    }
  });

  // Background auto-refresh timer (every 5 seconds) ONLY if user is logged in & not typing
  setInterval(async () => {
    if (currentStudent && !isUserTypingOrInModal()) {
      await AttendanceStore.fetchFromCloud();
      renderApp();
    }
  }, 5000);
});

// Check if user is actively typing in a form or interacting with a modal
function isUserTypingOrInModal() {
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
    return true;
  }
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer && modalContainer.children.length > 0) {
    return true;
  }
  return false;
}

// Helper to get current day name
function getCurrentDayName() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = new Date().getDay();
  return days[d] === "Sunday" ? "Monday" : days[d];
}

// Toast Notification Helper
function showToast(message, type) {
  const toastType = type || "info";
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${toastType}`;
  let icon = "ℹ️";
  if (toastType === "success") icon = "✅";
  if (toastType === "warning") icon = "⚠️";
  if (toastType === "danger") icon = "🚨";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 3500);
  }, 3500);
}

// Escape HTML helper
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Helper to find subjects scheduled for a specific day
function getScheduledSubjectsForDay(student, dayName) {
  const rawSlots = RAW_WEEKLY_TIMETABLE[dayName] || [];
  const subjectIds = new Set();

  rawSlots.forEach(slot => {
    if (!slot.isElective) {
      if (slot.codeKey) {
        const matched = student.subjects.find(s => s.code.replace(/\s+/g, '') === slot.codeKey);
        if (matched) subjectIds.add(matched.id);
      }
    } else {
      const matchingElectiveKey = student.electives.find(e => slot.slotGroup.includes(e));
      if (matchingElectiveKey) {
        const matched = student.subjects.find(s => s.code.replace(/\s+/g, '') === matchingElectiveKey);
        if (matched) subjectIds.add(matched.id);
      }
    }
  });

  return Array.from(subjectIds);
}

// Core Render Method
function renderApp() {
  currentStudent = AttendanceStore.getActiveUser();

  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  // IF NOT LOGGED IN -> RENDER FULL PAGE LOGIN SCREEN (ONLY ONCE, NEVER OVERWRITE WHILE TYPING)
  if (!currentStudent) {
    if (!document.getElementById("portal-user-input")) {
      renderLoginScreen(appRoot);
    }
    return;
  }

  // LOGGED IN -> RENDER MAIN DASHBOARD
  const overall = AttendanceMath.calculateOverall(currentStudent.subjects);
  const overallStatus = AttendanceMath.getStatusCategory(overall.percentage);

  appRoot.innerHTML = `
    <div class="app-container">
      <!-- Navigation Header -->
      <header class="navbar">
        <div class="navbar-inner">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <a href="#" class="brand-logo" onclick="event.preventDefault(); switchTab('overview');">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>AttendX <span class="brand-badge">B.Tech AI & DS</span></span>
            </a>
          </div>

          <div class="nav-actions">
            <!-- Active Student Profile Pill -->
            <div class="user-quick-profile" title="Logged in as ${escapeHtml(currentStudent.name)}">
              <div class="user-avatar-circle" style="background: ${currentStudent.accentColor || '#3b82f6'};">
                ${currentStudent.avatar}
              </div>
              <div class="user-info-text">
                <span class="user-name">${escapeHtml(currentStudent.name)}</span>
                <span class="user-role">RRN: ${escapeHtml(currentStudent.rrn)}</span>
              </div>
            </div>

            <!-- Live Cloud Sync Button -->
            <button class="btn-secondary" onclick="handleManualSync()" title="Sync data live between Phone & PC" style="padding: 0.4rem 0.75rem; font-size: 0.78rem;">
              ☁️ Sync Data
            </button>

            <!-- Theme Toggle Button -->
            <button class="btn-icon" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Light/Dark Theme">
              ${isDarkMode ? `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M18.99 4.93l-1.41 1.41"/></svg>
              ` : `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              `}
            </button>

            <!-- Logout Button -->
            <button class="btn-secondary" onclick="handleLogout()" style="color: #f87171; border-color: rgba(239,68,68,0.3); padding: 0.4rem 0.75rem; font-size: 0.78rem;">
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Body -->
      <main class="main-content">
        <!-- Shortage Warning Banner -->
        ${renderGlobalWarningBanner(currentStudent, overall)}

        <!-- Navigation Tabs -->
        <div class="tabs-header">
          <button class="tab-btn ${currentTab === 'overview' ? 'active' : ''}" onclick="switchTab('overview')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Attendance Dashboard
          </button>
          <button class="tab-btn ${currentTab === 'predictor' ? 'active' : ''}" onclick="switchTab('predictor')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Bunk & Leave Predictor
          </button>
          <button class="tab-btn ${currentTab === 'timetable' ? 'active' : ''}" onclick="switchTab('timetable')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            My Class Timetable
          </button>
          <button class="tab-btn ${currentTab === 'history' ? 'active' : ''}" onclick="switchTab('history')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Leave History
          </button>
          <button class="tab-btn ${currentTab === 'credentials' ? 'active' : ''}" onclick="switchTab('credentials')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Class Directory
          </button>
        </div>

        <!-- Dynamic Tab Content -->
        <div id="tab-content">
          ${renderTabContent(currentTab, currentStudent, overall, overallStatus)}
        </div>
      </main>
    </div>

    <!-- Modals Container -->
    <div id="modal-container"></div>
  `;
}

// FULL PAGE LOGIN SCREEN RENDERER
function renderLoginScreen(container) {
  container.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: var(--bg-main);">
      <div style="max-width: 900px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center;">
        
        <!-- Left Hero Branding -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--accent-primary);">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em;">AttendX <span class="brand-badge">B.Tech AI & DS</span></span>
          </div>

          <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.03em;">
            College Attendance & Leave Management Portal
          </h1>

          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
            Track your subject attendance percentages, calculate safe bunk limits, get instant alerts before dropping below <strong>75%</strong>, and view your personalized timetable schedule.
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
              <span style="color: var(--color-safe);">🔒</span>
              <span>Anti-Cheating Subject Lock with Card Undo</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
              <span style="color: var(--accent-primary);">📅</span>
              <span>Today's Scheduled Classes Filter</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
              <span style="color: #ec4899;">☁️</span>
              <span>Live Cloud REST DB Sync (Phone, Laptop & PC)</span>
            </div>
          </div>
        </div>

        <!-- Right Login Card -->
        <div class="glass-panel" style="padding: 2.5rem; border-radius: var(--radius-lg); background: var(--bg-card-solid); box-shadow: var(--shadow-lg);">
          <div style="margin-bottom: 1.75rem;">
            <h2 style="font-size: 1.5rem; font-weight: 800;">Student Portal Login</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Enter your College RRN or Educational Email to continue</p>
          </div>

          <form onsubmit="handlePortalLogin(event)">
            <div class="form-group">
              <label class="form-label">RRN Number or Educational Email</label>
              <input type="text" id="portal-user-input" required placeholder="Enter RRN or Email" class="form-control" style="padding: 0.8rem 1rem;" autocomplete="username" />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="portal-pass-input" required placeholder="Enter Password" class="form-control" style="padding: 0.8rem 1rem;" autocomplete="current-password" />
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem; margin-top: 1.25rem;">
              Sign In to Dashboard →
            </button>
          </form>
        </div>

      </div>
    </div>
  `;
}

// Global Event Handlers
window.handlePortalLogin = async function(e) {
  e.preventDefault();
  const userInput = document.getElementById("portal-user-input").value;
  const passInput = document.getElementById("portal-pass-input").value;

  showToast("Syncing with live cloud database...", "info");
  await AttendanceStore.fetchFromCloud();

  const auth = AttendanceStore.authenticate(userInput, passInput);
  if (auth.success) {
    showToast(`Welcome back, ${auth.student.name}!`, "success");
    renderApp();
  } else {
    showToast(auth.message, "danger");
  }
};

window.handleLogout = function() {
  AttendanceStore.logout();
  showToast("Logged out successfully.", "info");
  renderApp();
};

window.handleManualSync = async function() {
  showToast("Syncing live with cloud database...", "info");
  const synced = await AttendanceStore.fetchFromCloud();
  if (synced) {
    showToast("Synced live with Cloud Database!", "success");
    renderApp();
  } else {
    showToast("Already using latest live data.", "info");
  }
};

window.switchTab = function(tabName) {
  currentTab = tabName;
  renderApp();
  if (tabName === "predictor") {
    setTimeout(runSimulation, 50);
  }
};

window.switchTimetableDay = function(dayName) {
  activeTimetableDay = dayName;
  renderApp();
};

window.setDashboardFilter = function(filterMode) {
  dashboardViewFilter = filterMode;
  renderApp();
};

window.toggleTheme = function() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme_mode", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme_mode", "light");
  }
  renderApp();
};

// Global Warning Banner Renderer
function renderGlobalWarningBanner(student, overall) {
  const dangerSubjects = student.subjects.filter(s => AttendanceMath.calculatePercentage(s.attended, s.total) < 75);
  const warningSubjects = student.subjects.filter(s => {
    const pct = AttendanceMath.calculatePercentage(s.attended, s.total);
    return pct >= 75 && pct < 79;
  });

  if (dangerSubjects.length > 0) {
    const dangerNames = dangerSubjects.map(s => `<strong>${escapeHtml(s.name)} (${AttendanceMath.calculatePercentage(s.attended, s.total)}%)</strong>`).join(", ");

    return `
      <div class="alert-banner danger">
        <div class="alert-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <div class="alert-content">
          <div class="alert-title">
            🚨 SUBJECT SHORTAGE DANGER WARNING!
          </div>
          <div class="alert-desc">
            You have <strong>${dangerSubjects.length} course(s)</strong> dropping below the mandatory <strong>75% subject requirement</strong>! You are at risk of exam debarment in these subjects.
            <br/>Shortage Subject(s): ${dangerNames}
            <div style="margin-top: 0.6rem;">
              <button class="btn-primary" onclick="switchTab('predictor')" style="background: var(--color-danger); padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                View Recovery Plan & Required Classes →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (warningSubjects.length > 0) {
    const warningNames = warningSubjects.map(s => `<strong>${escapeHtml(s.name)} (${AttendanceMath.calculatePercentage(s.attended, s.total)}%)</strong>`).join(", ");

    return `
      <div class="alert-banner warning">
        <div class="alert-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <div class="alert-content">
          <div class="alert-title">
            ⚠️ SUBJECT WARNING ZONE (NEAR 75% LIMIT)
          </div>
          <div class="alert-desc">
            Caution: The following subject(s) are hovering near the 75% limit: ${warningNames}. Avoid taking leaves in these courses.
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

function renderTabContent(tab, student, overall, overallStatus) {
  if (tab === "overview") return renderOverviewTab(student, overall, overallStatus);
  if (tab === "predictor") return renderPredictorTab(student, overall);
  if (tab === "timetable") return renderTimetableTab(student);
  if (tab === "history") return renderHistoryTab(student);
  if (tab === "credentials") return renderCredentialsTab();
  return renderOverviewTab(student, overall, overallStatus);
}

// --- TAB 1: OVERVIEW & SUBJECT CARDS ---
function renderOverviewTab(student, overall, overallStatus) {
  let totalSafeSkips = 0;
  let totalClassesNeeded = 0;
  const dangerCount = student.subjects.filter(s => AttendanceMath.calculatePercentage(s.attended, s.total) < 75).length;

  student.subjects.forEach(s => {
    totalSafeSkips += AttendanceMath.calculateSafeSkips(s.attended, s.total, 75);
    totalClassesNeeded += AttendanceMath.calculateRequiredClasses(s.attended, s.total, 75);
  });

  const circumference = 440;
  const strokeOffset = circumference - (overall.percentage / 100) * circumference;

  let strokeColor = "var(--color-safe)";
  if (dangerCount > 0) strokeColor = "var(--color-danger)";
  else if (totalClassesNeeded > 0) strokeColor = "var(--color-warning)";

  const currentDayName = getCurrentDayName();
  const todayScheduledIds = getScheduledSubjectsForDay(student, currentDayName);

  const displaySubjects = dashboardViewFilter === 'today' 
    ? student.subjects.filter(s => todayScheduledIds.includes(s.id))
    : student.subjects;

  return `
    <!-- Top Overview Metrics -->
    <div class="overview-grid">
      <!-- Main Circular Gauge -->
      <div class="glass-panel gauge-card">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">OVERALL AVERAGE</span>
        
        <div class="gauge-wrapper">
          <svg class="gauge-svg" viewBox="0 0 160 160">
            <circle class="gauge-bg-circle" cx="80" cy="80" r="70"></circle>
            <circle class="gauge-progress-circle" cx="80" cy="80" r="70" 
                    style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeOffset}; stroke: ${strokeColor};"></circle>
          </svg>
          <div class="gauge-center-info">
            <span class="gauge-percent">${overall.percentage}%</span>
            <span class="gauge-label">ALL SUBJECTS</span>
          </div>
        </div>

        <div class="status-tag ${dangerCount > 0 ? 'DANGER' : 'SAFE'}">
          ${dangerCount > 0 ? `🔴 ${dangerCount} Shortage Subject(s)` : '🟢 All Subjects Safe (≥75%)'}
        </div>
      </div>

      <!-- Quick Summary Cards -->
      <div class="metrics-row">
        <div class="glass-panel metric-card">
          <div class="metric-header">
            <span>Total Semester Capacity</span>
            <div class="metric-icon">📚</div>
          </div>
          <div class="metric-value">${overall.total}</div>
          <div class="metric-sub">${overall.attended} Attended | ${overall.missed} Missed</div>
        </div>

        <div class="glass-panel metric-card">
          <div class="metric-header">
            <span>Safe Skips Available</span>
            <div class="metric-icon" style="color: var(--color-safe);">🌴</div>
          </div>
          <div class="metric-value" style="color: ${totalSafeSkips > 0 ? 'var(--color-safe)' : 'var(--text-muted)'};">${totalSafeSkips}</div>
          <div class="metric-sub">Classes you can miss without dropping below 75%</div>
        </div>

        <div class="glass-panel metric-card">
          <div class="metric-header">
            <span>Classes Required to Recover</span>
            <div class="metric-icon" style="color: var(--color-danger);">🎯</div>
          </div>
          <div class="metric-value" style="color: ${totalClassesNeeded > 0 ? 'var(--color-danger)' : 'var(--color-safe)'};">${totalClassesNeeded}</div>
          <div class="metric-sub">${totalClassesNeeded > 0 ? 'Mandatory consecutive classes to reach 75%' : 'You are safely above 75% target'}</div>
        </div>
      </div>
    </div>

    <!-- Filter Bar: Today's Scheduled Subjects vs All Enrolled -->
    <div class="glass-panel" style="padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
        <span style="font-weight: 700; font-size: 0.95rem;">Filter Display:</span>
        <button class="btn-secondary ${dashboardViewFilter === 'today' ? 'active' : ''}" onclick="setDashboardFilter('today')" style="${dashboardViewFilter === 'today' ? 'background: var(--accent-primary); color: #fff; border-color: var(--accent-primary);' : ''}">
          📅 Today's Scheduled Classes (${currentDayName} - ${todayScheduledIds.length})
        </button>
        <button class="btn-secondary ${dashboardViewFilter === 'all' ? 'active' : ''}" onclick="setDashboardFilter('all')" style="${dashboardViewFilter === 'all' ? 'background: var(--accent-primary); color: #fff; border-color: var(--accent-primary);' : ''}">
          📚 All Enrolled Courses (${student.subjects.length})
        </button>
      </div>

      <span style="font-size: 0.8rem; color: var(--text-muted);">Sec C (Sem V)</span>
    </div>

    <!-- Subject Cards List -->
    <div class="section-title-bar">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
        ${dashboardViewFilter === 'today' ? `Today's Scheduled Classes (${displaySubjects.length} Courses on ${currentDayName})` : `All Enrolled Courses (${displaySubjects.length} Courses)`}
      </div>
      <button class="btn-secondary" onclick="openAddSubjectModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        Add Custom Subject
      </button>
    </div>

    ${displaySubjects.length === 0 ? `
      <div class="glass-panel" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
        No scheduled classes for <strong>${currentDayName}</strong>. 
        <br/>Click <strong>"All Enrolled Courses"</strong> above to view your full course list!
      </div>
    ` : `
      <div class="subject-cards-grid">
        ${displaySubjects.map(s => renderSubjectCard(student.id, s)).join("")}
      </div>
    `}
  `;
}

function renderSubjectCard(studentId, subject) {
  const pct = AttendanceMath.calculatePercentage(subject.attended, subject.total);
  const minTarget = subject.minPercentage || 75;
  const statusCat = AttendanceMath.getStatusCategory(pct, minTarget);
  const safeSkips = AttendanceMath.calculateSafeSkips(subject.attended, subject.total, minTarget);
  const reqClasses = AttendanceMath.calculateRequiredClasses(subject.attended, subject.total, minTarget);

  const semTotal = subject.semesterTotal || (subject.credits === 4 ? 60 : (subject.credits === 3 ? 45 : 15));
  const maxSemBunks = AttendanceMath.calculateMaxSemesterBunks(semTotal, 75);

  const todayStr = new Date().toISOString().split("T")[0];
  const isLockedToday = AttendanceStore.isSubjectLockedForDate(studentId, subject.id, todayStr);

  let progressColor = "var(--color-safe)";
  if (statusCat === "WARNING") progressColor = "var(--color-warning)";
  if (statusCat === "DANGER") progressColor = "var(--color-danger)";

  return `
    <div class="glass-panel subject-card ${statusCat === 'DANGER' ? 'is-danger' : ''}">
      <div class="subject-header">
        <div>
          <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
            <span class="subject-code-pill">${escapeHtml(subject.code)}</span>
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--accent-primary); background: rgba(59,130,246,0.15); padding: 0.1rem 0.45rem; border-radius: 4px;">
              ${subject.credits || 3} Credits (Max ${semTotal} Classes)
            </span>
          </div>
          <div class="subject-name">${escapeHtml(subject.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">👨‍🏫 ${escapeHtml(subject.faculty || 'Faculty')}</div>
        </div>
        <button onclick="confirmDeleteSubject('${subject.id}', '${escapeHtml(subject.name)}')" title="Remove subject" style="color: var(--text-muted); opacity: 0.6;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>

      <div class="subject-stats-bar">
        <div class="stat-item">
          <span class="stat-item-label">ATTENDED</span>
          <span class="stat-item-val" style="color: var(--color-safe);">${subject.attended}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">MISSED</span>
          <span class="stat-item-val" style="color: var(--color-danger);">${subject.missed || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">CAPACITY</span>
          <span class="stat-item-val">${subject.total} / ${semTotal}</span>
        </div>
      </div>

      <div class="subject-progress-container">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${Math.min(pct, 100)}%; background: ${progressColor};"></div>
        </div>
        <div class="progress-label-row">
          <span>Subject Requirement: ${minTarget}%</span>
          <span class="pct-badge" style="color: ${progressColor};">${pct}%</span>
        </div>
      </div>

      <!-- Safe Skips or Catchup Banner -->
      ${statusCat === 'DANGER' ? `
        <div class="predictor-tag danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>Must attend <strong>${reqClasses} consecutive</strong> classes to reach 75%</span>
        </div>
      ` : `
        <div class="predictor-tag safe">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Can safely skip <strong>${safeSkips} more</strong> class(es) (Max ${maxSemBunks} bunks total)</span>
        </div>
      `}

      <!-- Action Buttons with Direct Card Undo -->
      ${isLockedToday ? `
        <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
          <div style="font-size: 0.78rem;">
            🔒 <strong>LOGGED (${isLockedToday.status.toUpperCase()})</strong>
          </div>
          <button class="btn-secondary" onclick="handleDirectCardUndo('${studentId}', '${subject.id}')" style="font-size: 0.75rem; padding: 0.3rem 0.6rem; color: #f87171; border-color: rgba(239,68,68,0.4);">
            ↩️ Undo & Re-mark
          </button>
        </div>
      ` : `
        <div class="subject-actions">
          <button class="btn-present" onclick="openMarkCalendarModal('${studentId}', '${subject.id}', true)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            + Present
          </button>
          <button class="btn-absent" onclick="openMarkCalendarModal('${studentId}', '${subject.id}', false)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            + Absent
          </button>
        </div>
      `}
    </div>
  `;
}

// --- TAB 2: BUNK & LEAVE PREDICTOR ---
function renderPredictorTab(student, overall) {
  return `
    <div class="section-title-bar">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Attendance Leave Predictor & Bunk Calculator
      </div>
    </div>

    <div class="predictor-panel">
      <div class="glass-panel predictor-table-card">
        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem;">Subject Leave Allowance Table</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          Credit capacities: <strong>4-Credit = 60 Classes</strong> | <strong>3-Credit = 45 Classes</strong> | <strong>1-Credit = 15 Classes</strong>
        </p>

        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Credits</th>
                <th>Attended / Capacity</th>
                <th>Current %</th>
                <th>Status</th>
                <th>Safe Skips (Available)</th>
              </tr>
            </thead>
            <tbody>
              ${student.subjects.map(sub => {
                const pct = AttendanceMath.calculatePercentage(sub.attended, sub.total);
                const status = AttendanceMath.getStatusCategory(pct, 75);
                const skips = AttendanceMath.calculateSafeSkips(sub.attended, sub.total, 75);
                const semTotal = sub.semesterTotal || (sub.credits === 4 ? 60 : (sub.credits === 3 ? 45 : 15));

                return `
                  <tr>
                    <td>
                      <strong>${escapeHtml(sub.code)}</strong> - ${escapeHtml(sub.name)}
                    </td>
                    <td>
                      <span class="brand-badge" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);">${sub.credits} Credits</span>
                    </td>
                    <td style="font-family: var(--font-mono);">
                      ${sub.attended} / ${semTotal}
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: ${status === 'DANGER' ? 'var(--color-danger)' : status === 'WARNING' ? 'var(--color-warning)' : 'var(--color-safe)'}">
                      ${pct}%
                    </td>
                    <td>
                      <span class="status-tag ${status}" style="padding: 0.2rem 0.55rem; font-size: 0.7rem;">${status}</span>
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-safe);">
                      ${skips > 0 ? `+${skips} Classes` : '0 Skips'}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interactive Leave Simulator Tool -->
      <div class="glass-panel simulator-card">
        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem;">🔮 "What-If" Leave Simulator</h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          Test upcoming absences to see your predicted percentage <em>before</em> taking leave.
        </p>

        <div class="form-group">
          <label class="form-label">Select Course</label>
          <select class="form-control" id="sim-subject-select" onchange="runSimulation()">
            ${student.subjects.map(s => `<option value="${s.id}">${escapeHtml(s.code)} - ${escapeHtml(s.name)} (${s.credits} Credits)</option>`).join("")}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Number of Planned Leaves / Missed Classes</label>
          <input type="number" min="1" max="25" value="2" class="form-control" id="sim-leaves-input" oninput="runSimulation()" />
        </div>

        <div id="sim-output-box" class="sim-result-box"></div>
      </div>
    </div>
  `;
}

// --- TAB 3: PERSONALIZED TIMETABLE TRACKER ---
function renderTimetableTab(student) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const rawSlots = RAW_WEEKLY_TIMETABLE[activeTimetableDay] || [];

  const resolvedSlots = rawSlots.map(slot => {
    if (!slot.isElective) {
      if (slot.codeKey) {
        const course = ALL_COURSES[slot.codeKey];
        const matchedSub = student.subjects.find(s => s.code.replace(/\s+/g, '') === slot.codeKey);
        return {
          time: slot.time,
          code: course ? course.code : slot.codeKey,
          name: course ? course.name : "Regular Theory",
          room: slot.room,
          faculty: course ? course.faculty : "Faculty",
          subjectId: matchedSub ? matchedSub.id : student.subjects[0]?.id,
          isElective: false
        };
      }
      return {
        time: slot.time,
        code: "MISC",
        name: slot.name,
        room: slot.room,
        faculty: "Lab / Advisor",
        subjectId: student.subjects[0]?.id,
        isElective: false
      };
    } else {
      const matchingKey = student.electives.find(e => slot.slotGroup.includes(e));
      const course = ALL_COURSES[matchingKey] || ALL_COURSES[slot.slotGroup[0]];
      const matchedSub = student.subjects.find(s => s.code.replace(/\s+/g, '') === matchingKey);

      return {
        time: slot.time,
        code: course.code,
        name: course.name,
        room: slot.room,
        faculty: course.faculty,
        subjectId: matchedSub ? matchedSub.id : student.subjects[0]?.id,
        isElective: true
      };
    }
  });

  return `
    <div class="section-title-bar">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        Official B.Tech AI & DS Timetable (Sec C)
      </div>
    </div>

    <div class="timetable-day-selector">
      ${days.map(d => `
        <button class="day-btn ${activeTimetableDay === d ? 'active' : ''}" onclick="switchTimetableDay('${d}')">
          ${d} ${d === getCurrentDayName() ? ' (Today)' : ''}
        </button>
      `).join("")}
    </div>

    <div class="timetable-slot-list">
      ${resolvedSlots.length === 0 ? `
        <div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--text-muted);">
          No scheduled classes for ${activeTimetableDay}. Enjoy your weekend! ☕
        </div>
      ` : resolvedSlots.map(slot => `
        <div class="glass-panel slot-card">
          <div class="slot-time">
            ⏱️ ${slot.time}
          </div>
          <div class="slot-info">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="slot-subject-name">${escapeHtml(slot.name)}</span>
              ${slot.isElective ? `<span class="brand-badge" style="background: var(--accent-primary); font-size: 0.65rem;">YOUR ELECTIVE</span>` : ''}
            </div>
            <div class="slot-meta">
              <span>Code: <strong>${escapeHtml(slot.code)}</strong></span>
              <span>📍 ${escapeHtml(slot.room)}</span>
              <span>👨‍🏫 ${escapeHtml(slot.faculty)}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- TAB 4: HISTORY LOG ---
function renderHistoryTab(student) {
  const history = student.history || [];

  return `
    <div class="section-title-bar">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Marked Attendance & Absence History Log
      </div>
    </div>

    <div class="glass-panel" style="padding: 1.5rem;">
      ${history.length === 0 ? `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          No attendance entries logged yet for this session.
        </div>
      ` : `
        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(log => `
                <tr>
                  <td style="font-family: var(--font-mono); font-size: 0.85rem;">
                    📅 <strong>${log.date}</strong> at ${log.time || '10:00 AM'}
                  </td>
                  <td>
                    <strong>${escapeHtml(log.subjectCode || '')}</strong> ${escapeHtml(log.subjectName)}
                  </td>
                  <td>
                    <span class="status-tag ${log.status === 'present' ? 'SAFE' : 'DANGER'}" style="padding: 0.2rem 0.55rem; font-size: 0.7rem;">
                      ${log.status === 'present' ? 'Present' : 'Absent / Leave'}
                    </span>
                  </td>
                  <td style="color: var(--text-secondary); font-size: 0.82rem;">
                    ${escapeHtml(log.note || '-')}
                  </td>
                  <td>
                    <button class="btn-secondary" onclick="handleHistoryLogUndo('${student.id}', '${log.id}')" style="font-size: 0.75rem; padding: 0.3rem 0.65rem; color: #f87171; border-color: rgba(239,68,68,0.4);">
                      ↩️ Undo & Delete
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// --- TAB 5: CRESCENT STUDENT CREDENTIALS ---
function renderCredentialsTab() {
  const students = AttendanceStore.getStudents();

  return `
    <div class="section-title-bar">
      <div class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Crescent Class Directory (7 Students)
      </div>
    </div>

    <div class="glass-panel" style="padding: 1.25rem; margin-bottom: 1.5rem; background: var(--bg-surface-hover);">
      <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="font-size: 1.5rem;">🔒</div>
        <div>
          <div style="font-weight: 700; font-size: 1rem;">Single Account Access Policy</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.15rem;">
            You are currently logged in as <strong>${escapeHtml(currentStudent.name)} (${currentStudent.rrn})</strong>. Direct profile switching is disabled while logged in. To switch accounts, click <strong>Logout</strong> at top right.
          </div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem;">
      ${students.map(s => {
        const overall = AttendanceMath.calculateOverall(s.subjects);
        const status = AttendanceMath.getStatusCategory(overall.percentage);
        const electiveCodes = s.electives.map(e => ALL_COURSES[e]?.code).join(" & ");

        return `
          <div class="glass-panel" style="padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div class="user-avatar-circle" style="background: ${s.accentColor || '#3b82f6'};">
                  ${s.avatar}
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 1.05rem;">${escapeHtml(s.name)} ${s.id === currentStudent.id ? '🔑 (Active You)' : ''}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">RRN: <strong style="color: var(--text-primary);">${s.rrn}</strong></div>
                </div>
              </div>

              <div style="background: var(--bg-surface); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 0.85rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                  <span style="color: var(--text-muted);">Email:</span>
                  <strong style="font-family: var(--font-mono); font-size: 0.78rem;">${escapeHtml(s.email)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Assigned Electives:</span>
                  <span style="color: var(--accent-primary); font-weight: 700;">${electiveCodes}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
                <span>Attendance Standing:</span>
                <span class="status-tag ${status}" style="padding: 0.15rem 0.5rem; font-size: 0.72rem;">${overall.percentage}% (${status})</span>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// CALENDAR DATE PICKER MODAL POP-UP
window.openMarkCalendarModal = function(studentId, subjectId, isPresent, defaultNote) {
  const noteVal = defaultNote || "";
  const student = currentStudent;
  if (!student) return;

  const subject = student.subjects.find(s => s.id === subjectId);
  if (!subject) return;

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  const dayBeforeDate = new Date();
  dayBeforeDate.setDate(dayBeforeDate.getDate() - 2);
  const dayBeforeStr = dayBeforeDate.toISOString().split("T")[0];

  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width: 480px;">
        <div class="modal-header">
          <div class="modal-title" style="display: flex; align-items: center; gap: 0.5rem;">
            <span>🗓️ Log Attendance Date</span>
          </div>
          <button onclick="closeModal()" style="color: var(--text-muted);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        <div style="background: var(--bg-surface); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; border-left: 4px solid ${isPresent ? 'var(--color-safe)' : 'var(--color-danger)'};">
          <div style="font-weight: 700; font-size: 1rem;">${escapeHtml(subject.code)} - ${escapeHtml(subject.name)}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem; font-size: 0.82rem;">
            <span style="color: var(--text-muted);">${subject.credits} Credits Course</span>
            <span class="status-tag ${isPresent ? 'SAFE' : 'DANGER'}" style="padding: 0.15rem 0.55rem; font-size: 0.72rem;">
              ${isPresent ? 'Marking PRESENT' : 'Marking ABSENT / LEAVE'}
            </span>
          </div>
        </div>

        <form onsubmit="submitMarkCalendar(event, '${studentId}', '${subjectId}', ${isPresent})">
          <!-- Preset Quick Date Buttons -->
          <div style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-secondary);">Quick Preset Dates:</label>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <button type="button" class="btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="setPickerDate('${todayStr}')">Today</button>
              <button type="button" class="btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="setPickerDate('${yesterdayStr}')">Yesterday</button>
              <button type="button" class="btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="setPickerDate('${dayBeforeStr}')">2 Days Ago</button>
              <button type="button" class="btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="setPickerDate('2026-07-15')">Jul 15 (Start)</button>
            </div>
          </div>

          <!-- Date Picker Calendar Input -->
          <div class="form-group">
            <label class="form-label">Select Class Date from Calendar</label>
            <input type="date" id="mark-date-picker" value="${todayStr}" max="${todayStr}" required class="form-control" style="padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.95rem;" />
          </div>

          <div class="form-group">
            <label class="form-label">Optional Note / Reason</label>
            <input type="text" id="mark-note-input" value="${escapeHtml(noteVal)}" placeholder="e.g. Missed morning lecture" class="form-control" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn-primary" style="background: ${isPresent ? 'var(--color-safe)' : 'var(--color-danger)'}; border: none;">
              Confirm & Log ${isPresent ? 'Present' : 'Absent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};

window.setPickerDate = function(dateStr) {
  const picker = document.getElementById("mark-date-picker");
  if (picker) picker.value = dateStr;
};

window.submitMarkCalendar = async function(e, studentId, subjectId, isPresent) {
  e.preventDefault();
  const dateStr = document.getElementById("mark-date-picker").value;
  const noteStr = document.getElementById("mark-note-input").value;

  const result = await AttendanceStore.markAttendanceWithDate(studentId, subjectId, isPresent, dateStr, noteStr);
  
  if (result && result.isLocked) {
    showToast(result.message, "danger");
    closeModal();
    return;
  }

  if (result && result.subject) {
    const subPct = AttendanceMath.calculatePercentage(result.subject.attended, result.subject.total);
    showToast(`Logged ${isPresent ? 'Present' : 'Absent'} for ${result.subject.code} on ${dateStr} (${subPct}%)`, isPresent ? "success" : "warning");
    closeModal();
    renderApp();
  }
};

window.handleDirectCardUndo = async function(studentId, subjectId) {
  if (await AttendanceStore.undoLatestSubjectMark(studentId, subjectId)) {
    showToast("Logged entry reverted and subject unlocked!", "info");
    renderApp();
  }
};

window.handleHistoryLogUndo = async function(studentId, logId) {
  if (confirm("Are you sure you want to undo and remove this attendance entry?")) {
    if (await AttendanceStore.undoLogEntry(studentId, logId)) {
      showToast("Attendance entry reverted and subject unlocked!", "success");
      renderApp();
    }
  }
};

window.runSimulation = function() {
  const subSelect = document.getElementById("sim-subject-select");
  const leavesInput = document.getElementById("sim-leaves-input");
  const outputBox = document.getElementById("sim-output-box");

  if (!subSelect || !leavesInput || !outputBox) return;

  const subId = subSelect.value;
  const leaves = parseInt(leavesInput.value) || 0;
  const subject = currentStudent.subjects.find(s => s.id === subId);

  if (!subject) return;

  const sim = AttendanceMath.simulateLeaves(subject.attended, subject.total, leaves, 75);

  let boxBg = "rgba(16, 185, 129, 0.12)";
  let boxBorder = "rgba(16, 185, 129, 0.3)";
  let titleColor = "#34d399";
  let icon = "✅";

  if (sim.statusCategory === "WARNING") {
    boxBg = "rgba(245, 158, 11, 0.14)";
    boxBorder = "rgba(245, 158, 11, 0.35)";
    titleColor = "#fbbf24";
    icon = "⚠️";
  } else if (sim.statusCategory === "DANGER") {
    boxBg = "rgba(239, 68, 68, 0.16)";
    boxBorder = "rgba(239, 68, 68, 0.4)";
    titleColor = "#f87171";
    icon = "🚨";
  }

  outputBox.style.background = boxBg;
  outputBox.style.borderColor = boxBorder;

  outputBox.innerHTML = `
    <div style="font-weight: 700; font-size: 1rem; color: ${titleColor}; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
      <span>${icon}</span>
      <span>Simulation Result for ${escapeHtml(subject.name)}</span>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem; margin-bottom: 0.85rem;">
      <div>Current Percentage: <strong>${AttendanceMath.calculatePercentage(subject.attended, subject.total)}%</strong></div>
      <div>Predicted Percentage: <strong style="color: ${titleColor}; font-size: 1rem;">${sim.newPct}%</strong></div>
      <div>Capacity: <strong>${sim.newTotal} Classes</strong></div>
      <div>Drop in Percentage: <strong style="color: var(--color-danger); font-family: var(--font-mono);">${sim.dropAmount > 0 ? '-' + sim.dropAmount + '%' : '0%'}</strong></div>
    </div>

    <div style="font-size: 0.85rem; line-height: 1.4; color: var(--text-primary); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.65rem;">
      ${sim.isSafe ? `
        🎉 <strong>VERDICT: SAFE TO TAKE LEAVE</strong><br/>
        Taking ${leaves} leave(s) keeps your attendance at <strong>${sim.newPct}%</strong>, safely above the 75% requirement.
      ` : `
        🚨 <strong>VERDICT: HIGH DANGER LEAVE!</strong><br/>
        Taking ${leaves} leave(s) will drop your attendance to <strong>${sim.newPct}%</strong> (<75%)! You will enter shortage danger zone.
      `}
    </div>
  `;
};

window.openAddSubjectModal = function() {
  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">Add Custom Subject</div>
          <button onclick="closeModal()" style="color: var(--text-muted);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        <form onsubmit="handleCreateSubject(event)">
          <div class="form-group">
            <label class="form-label">Subject Code</label>
            <input type="text" id="new-code" required placeholder="e.g. CSDX 515" class="form-control"/>
          </div>
          <div class="form-group">
            <label class="form-label">Subject Name</label>
            <input type="text" id="new-name" required placeholder="e.g. Advanced AI Analytics" class="form-control"/>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Course Credits</label>
              <select id="new-credits" class="form-control">
                <option value="4">4 Credits (60 Classes)</option>
                <option value="3" selected>3 Credits (45 Classes)</option>
                <option value="1">1 Credit (15 Classes)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Min Required Target %</label>
              <input type="number" id="new-target" min="50" max="100" value="75" required class="form-control"/>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Create Subject</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

window.handleCreateSubject = async function(e) {
  e.preventDefault();
  const code = document.getElementById("new-code").value;
  const name = document.getElementById("new-name").value;
  const credits = document.getElementById("new-credits").value;
  const minPercentage = document.getElementById("new-target").value;

  if (!currentStudent) return;

  const created = await AttendanceStore.addSubject(currentStudent.id, { code, name, credits, minPercentage, attended: 0, total: 0 });
  if (created) {
    showToast(`Subject ${name} added!`, "success");
    closeModal();
    renderApp();
  }
};

window.confirmDeleteSubject = async function(subjectId, name) {
  if (confirm(`Are you sure you want to remove ${name}?`)) {
    if (currentStudent && await AttendanceStore.deleteSubject(currentStudent.id, subjectId)) {
      showToast(`Removed ${name}`, "info");
      renderApp();
    }
  }
};

window.closeModal = function() {
  const modalContainer = document.getElementById("modal-container");
  if (modalContainer) modalContainer.innerHTML = "";
};
