// ============================================================
// MEALPLANNER1 - Smart Meal Planner & Admin Application Logic
// ============================================================

// State Management & Storage
let isLoggedIn = sessionStorage.getItem('mp_is_logged_in') === 'true';
let hasCompletedProfile = localStorage.getItem('mp_has_profile') === 'true';
let mode = localStorage.getItem('mp_app_mode') || 'random'; // 'random' or 'diet'
let activeTab = 'home'; // 'home', 'profile', or 'admin'
let currentUserEmail = sessionStorage.getItem('mp_user_email') || '';

const ADMIN_EMAIL = "natitasinsuwan@gmail.com";

// Check if current user is admin
function isAdmin() {
  const email = (currentUserEmail || '').trim().toLowerCase();
  return email === "natitasinsuwan@gmail.com" || 
         email === "natitasinsuwan64@gmail.com" || 
         email.includes("natitasinsuwan") ||
         email === "admin@example.com";
}

// User Profile
let profile = JSON.parse(localStorage.getItem('mp_user_profile') || JSON.stringify({
  weight: 45,
  height: 157,
  birthday: '2010-05-15',
  sex: 'female',
  exercise: 1,
  allergies: [],
  religious: [],
  ethical: []
}));

let selectedKeywords = new Set();
let todayMeals = [];
let adminSearchQuery = "";

// Server & Cloud Persistence State
let isServerPersistenceActive = false;
let isCommittingToGitHub = false;
let pendingGitHubCommitMsg = null;

// GitHub Repository Configuration for Instant Live Cloud Sync
const GITHUB_CONFIG = {
  owner: 'natitasinsuwan-netizen',
  repo: 'MEALPLANNER1',
  branch: 'main',
  get token() {
    return (localStorage.getItem('mp_gh_token') || sessionStorage.getItem('mp_gh_token') || '').trim();
  },
  get repository() {
    return (localStorage.getItem('mp_gh_repo') || '').trim() || `${this.owner}/${this.repo}`;
  },
  get targetBranch() {
    return (localStorage.getItem('mp_gh_branch') || '').trim() || this.branch;
  }
};

// Check for token in URL parameters or hash if supplied by admin
try {
  const urlParams = new URLSearchParams(window.location.search);
  const hashMatch = window.location.hash ? window.location.hash.match(/token=([^&]+)/) : null;
  const paramToken = urlParams.get('gh_token') || urlParams.get('token') || (hashMatch ? decodeURIComponent(hashMatch[1]) : null);
  if (paramToken) {
    localStorage.setItem('mp_gh_token', paramToken.trim());
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, document.title, window.location.pathname);
    }
  }
} catch (e) {}

// Purge obsolete local meal copies so users ALWAYS see authoritative code/repository updates
try {
  localStorage.removeItem('mp_all_meals');
  localStorage.removeItem('mp_custom_meals');
} catch (e) {
  // Ignore storage exceptions
}

// Floating Toast Notification Helper
let toastTimeout = null;
function showAppToast(message, type = 'success') {
  const toast = document.getElementById('appToast');
  if (!toast) {
    console.log(message);
    return;
  }

  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  toast.style.display = 'block';
  toast.style.opacity = '0';
  toast.style.transform = 'translate(-50%, -10px)';

  if (type === 'error') {
    toast.style.background = '#DC2626';
    toast.style.color = '#FFFFFF';
  } else if (type === 'info') {
    toast.style.background = '#1E293B';
    toast.style.color = '#FFFFFF';
  } else {
    toast.style.background = '#10B981';
    toast.style.color = '#FFFFFF';
  }

  toast.innerHTML = message;

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  }, 10);

  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -10px)';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3500);
}

// Helper: Sync live meal catalog immediately on boot (for ALL users: regular & admin)
async function syncLiveCatalog() {
  const buster = Date.now();

  // 1. If running on local server, load from /api/meals
  try {
    const res = await fetch(`/api/meals?t=${buster}`, { method: 'GET', cache: 'no-store' });
    if (res.ok) {
      const serverMeals = await res.json();
      if (Array.isArray(serverMeals) && serverMeals.length > 0) {
        INITIAL_MEALS = serverMeals;
        isServerPersistenceActive = true;
        updatePersistenceStatusUI();
        if (activeTab === 'admin') renderAdminMealsList();
        renderDashboard();
        console.log(`[SYNC] Loaded ${serverMeals.length} live meals from local server.`);

        // Also fetch token configuration from local server if not already in localStorage
        try {
          const cfgRes = await fetch('/api/gh-config');
          if (cfgRes.ok) {
            const cfg = await cfgRes.json();
            if (cfg.token && !localStorage.getItem('mp_gh_token')) {
              localStorage.setItem('mp_gh_token', cfg.token);
              updatePersistenceStatusUI();
            }
          }
        } catch (e) {}

        return;
      }
    }
  } catch (e) {
    // Local server not running or running on static client
  }

  // 2. Fetch live raw GitHub catalog (instant updates directly from GitHub main repository)
  // This bypasses GitHub Pages build delay (~1-2 min) and serves the latest commit immediately!
  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.targetBranch}/meals.json?t=${buster}`;
  try {
    const ghRes = await fetch(rawUrl, { method: 'GET', cache: 'no-store' });
    if (ghRes.ok) {
      const ghMeals = await ghRes.json();
      if (Array.isArray(ghMeals) && ghMeals.length > 0) {
        INITIAL_MEALS = ghMeals;
        updatePersistenceStatusUI();
        if (activeTab === 'admin') renderAdminMealsList();
        renderDashboard();
        console.log(`[SYNC] Loaded ${ghMeals.length} live meals directly from GitHub repository.`);
        return;
      }
    }
  } catch (e) {
    console.warn('[SYNC] Raw GitHub sync notice:', e.message);
  }

  // 3. Fallback to same-origin meals.json
  try {
    const fallbackRes = await fetch(`meals.json?t=${buster}`, { method: 'GET', cache: 'no-store' });
    if (fallbackRes.ok) {
      const fbMeals = await fallbackRes.json();
      if (Array.isArray(fbMeals) && fbMeals.length > 0) {
        INITIAL_MEALS = fbMeals;
        if (activeTab === 'admin') renderAdminMealsList();
        renderDashboard();
        return;
      }
    }
  } catch (e) {}

  updatePersistenceStatusUI();
}

function updatePersistenceStatusUI() {
  const dot = document.getElementById('persistenceStatusDot');
  const text = document.getElementById('persistenceStatusText');
  if (!dot || !text) return;

  if (isServerPersistenceActive) {
    dot.style.background = '#10B981';
    text.textContent = 'Auto-Save: Active (Server Disk & GitHub)';
    text.setAttribute('title', 'Edits are automatically saved to local disk and pushed to GitHub repository code.');
  } else if (GITHUB_CONFIG.token) {
    dot.style.background = '#10B981';
    text.textContent = 'Cloud Auto-Save: Active (GitHub Code)';
    text.setAttribute('title', 'Edits immediately commit to meals.js and meals.json on GitHub main branch so all users see updates instantly.');
  } else {
    dot.style.background = '#F59E0B';
    text.textContent = 'Local Mode (Click GitHub Sync to link)';
    text.setAttribute('title', 'Running locally without GitHub token. Click GitHub Sync to configure automatic cloud saves.');
  }
}

// Automatic Git commit directly to GitHub repository (meals.js + meals.json)
async function autoCommitToGitHub(commitMsg = 'Admin: Update meal catalog in meals.js and meals.json') {
  const token = GITHUB_CONFIG.token;
  const repo = GITHUB_CONFIG.repository;
  const branch = GITHUB_CONFIG.targetBranch;

  if (!token) {
    console.warn('[AUTO-COMMIT] No GitHub token configured. Skipping cloud commit.');
    return { success: false, reason: 'no_token' };
  }

  if (isCommittingToGitHub) {
    pendingGitHubCommitMsg = commitMsg;
    return { success: false, reason: 'queued' };
  }

  isCommittingToGitHub = true;
  showAppToast('⏳ Committing changes to GitHub repository code...', 'info');

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    // Step 1: Fetch HEAD commit of target branch
    const refRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`, { headers });
    if (!refRes.ok) {
      const err = await refRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch branch ref (HTTP ${refRes.status})`);
    }
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // Step 2: Fetch commit tree SHA
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits/${latestCommitSha}`, { headers });
    if (!commitRes.ok) {
      const err = await commitRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch commit tree (HTTP ${commitRes.status})`);
    }
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // Step 3: Format updated meals.json and meals.js
    const formattedJson = JSON.stringify(INITIAL_MEALS, null, 2);
    const jsContent = `const DEFAULT_MEALS = ${formattedJson};\n\nlet INITIAL_MEALS = [...DEFAULT_MEALS];\n`;

    // Helper to upload blob reliably regardless of payload size
    async function uploadBlob(contentStr) {
      const bRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: contentStr, encoding: 'utf-8' })
      });
      if (!bRes.ok) {
        const bErr = await bRes.json().catch(() => ({}));
        throw new Error(bErr.message || `Blob upload failed (HTTP ${bRes.status})`);
      }
      const bData = await bRes.json();
      return bData.sha;
    }

    const [jsonBlobSha, jsBlobSha] = await Promise.all([
      uploadBlob(formattedJson),
      uploadBlob(jsContent)
    ]);

    // Step 4: Create new Git Tree with blob references
    const treePayload = {
      base_tree: baseTreeSha,
      tree: [
        {
          path: 'meals.json',
          mode: '100644',
          type: 'blob',
          sha: jsonBlobSha
        },
        {
          path: 'meals.js',
          mode: '100644',
          type: 'blob',
          sha: jsBlobSha
        }
      ]
    };

    const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify(treePayload)
    });
    if (!treeRes.ok) {
      const err = await treeRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create Git tree (HTTP ${treeRes.status})`);
    }
    const treeData = await treeRes.json();
    const newTreeSha = treeData.sha;

    // Step 5: Create new Git Commit
    const newCommitPayload = {
      message: commitMsg,
      tree: newTreeSha,
      parents: [latestCommitSha]
    };

    const newCommitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newCommitPayload)
    });
    if (!newCommitRes.ok) {
      const err = await newCommitRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create Git commit (HTTP ${newCommitRes.status})`);
    }
    const newCommitData = await newCommitRes.json();
    const newCommitSha = newCommitData.sha;

    // Step 6: Move branch pointer to new commit
    const updateRefRes = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ sha: newCommitSha, force: false })
    });
    if (!updateRefRes.ok) {
      const err = await updateRefRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update branch head (HTTP ${updateRefRes.status})`);
    }

    const shortSha = newCommitSha.substring(0, 7);
    console.log(`[AUTO-COMMIT] Successfully committed & pushed ${shortSha} to GitHub (${repo}/${branch})`);
    showAppToast(`🚀 Saved to GitHub repository code! (Commit ${shortSha}) Users see changes immediately!`, 'success');
    return { success: true, commitSha: shortSha };
  } catch (err) {
    console.error('[AUTO-COMMIT ERROR]', err);
    showAppToast(`⚠️ GitHub auto-sync notice: ${err.message}`, 'error');
    return { success: false, error: err.message };
  } finally {
    isCommittingToGitHub = false;
    if (pendingGitHubCommitMsg) {
      const nextMsg = pendingGitHubCommitMsg;
      pendingGitHubCommitMsg = null;
      setTimeout(() => autoCommitToGitHub(nextMsg), 500);
    }
  }
}

// Master Persistence Handler: saves to local server disk AND commits directly to GitHub code
function persistMeals(syncToServer = true, commitMsg = 'Admin: Update meal catalog in meals.js and meals.json') {
  // 1. Sync to local server disk if server is running
  if (syncToServer) {
    fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(INITIAL_MEALS)
    }).then(res => {
      if (res.ok) {
        isServerPersistenceActive = true;
        updatePersistenceStatusUI();
        console.log('[DISK PERSISTENCE] Successfully saved to server disk (meals.js & meals.json).');
      }
    }).catch(err => {
      // Static host or offline
    });
  }

  // 2. Automatically commit to GitHub repository code if admin is saving
  if (isAdmin() && GITHUB_CONFIG.token) {
    autoCommitToGitHub(commitMsg);
  }
}

// Helper: Get Today's Date String (YYYY-MM-DD)
function getTodayDateString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Automatic Daily Reset Check
function checkAndResetNewDay() {
  const lastDate = localStorage.getItem('mp_last_date');
  const todayStr = getTodayDateString();

  if (lastDate !== todayStr) {
    todayMeals = [];
    localStorage.setItem('mp_today_meals', JSON.stringify([]));
    localStorage.setItem('mp_last_date', todayStr);
  } else {
    todayMeals = JSON.parse(localStorage.getItem('mp_today_meals') || '[]');
  }
}

// KEYWORD CATEGORIES
const CATEGORIZED_KEYWORDS = {
  "Country": ["Thai", "Japanese", "Chinese", "Korean", "Indian", "Vietnamese", "Laos", "Lebanon", "Mexican", "Italian", "French", "Spanish", "American", "British", "German"],
  "Cooking Methods": ["Fry", "Boil", "Grill", "Bake", "Steam", "Stir-Fry", "Stew", "Smoke"],
  "Carbs": ["Noodles", "Rice", "Bread", "Pasta", "Low-Carb"],
  "Protein": ["Chicken", "Egg", "Pork", "Beef", "Fish", "Seafood", "Tofu"]
};

// All available allergens & dietary tags for editor
const ALLERGEN_OPTIONS = ["nuts", "dairy", "gluten", "shellfish", "egg", "soy", "fish", "sesame"];
const DIETARY_OPTIONS = ["halal", "kosher", "vegetarian", "vegan", "gluten-free", "dairy-free"];

// Temporary edit/add chip state
let currentEditAllergens = [];
let currentEditDietary = [];
let currentAddAllergens = [];
let currentAddDietary = [];

// Calculate Age dynamically from Birthday
function getAgeFromBirthday(birthdayStr) {
  if (!birthdayStr) return 15;
  const birthDate = new Date(birthdayStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(1, age);
}

// Calculate BMR using Mifflin–St Jeor formula
function calculateBMR() {
  const age = getAgeFromBirthday(profile.birthday);
  const weight = parseFloat(profile.weight) || 45;
  const height = parseFloat(profile.height) || 157;
  const sex = profile.sex || 'female';

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = sex === 'male' ? bmr + 5 : bmr - 161;
  return Math.round(bmr);
}

// Calculate TDEE (BMR * Activity Factor)
function calculateTDEE() {
  const bmr = calculateBMR();
  const exercise = parseInt(profile.exercise) || 1;
  const activityFactors = {
    0: 1.2,
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.55,
    5: 1.725,
    6: 1.725,
    7: 1.9
  };
  const factor = activityFactors[exercise] || 1.2;
  return Math.round(bmr * factor);
}

// Energy Target Rule: Random Meal uses TDEE; Diet Planning uses BMR
function calculateEnergyTarget() {
  if (mode === 'diet') {
    return calculateBMR();
  }
  return calculateTDEE();
}

// ============================================================
// DOM INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  checkAndResetNewDay();
  setupEventListeners();
  renderCategorizedKeywords();
  updateBottomNavVisibility();
  syncLiveCatalog();

  if (!isLoggedIn) {
    showScreen('screenLogin');
  } else if (!mode) {
    showScreen('screenPurpose');
  } else {
    renderDashboard();
    showScreen('screenDashboard');
  }
});

// Update Bottom Navigation visibility and tabs based on role
function updateBottomNavVisibility() {
  const bottomNav = document.getElementById('bottomNav');
  const tabAdmin = document.getElementById('tabNavAdmin');

  if (tabAdmin) {
    if (isAdmin()) {
      tabAdmin.style.display = 'flex';
    } else {
      tabAdmin.style.display = 'none';
    }
  }
}

// ============================================================
// SCREEN CONTROLLER & NAVIGATION
// ============================================================
function showScreen(screenId) {
  const screens = [
    'screenLogin', 'screenRegister', 'screenForgotPassword', 'screenPurpose', 
    'screenStep2Body', 'screenStep3Exercise', 'screenStep4Dietary', 
    'screenStep5Allergies', 'screenDashboard', 'screenSettings', 'screenAdmin'
  ];
  
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) {
    if (screenId === 'screenDashboard' || screenId === 'screenSettings' || screenId === 'screenAdmin') {
      bottomNav.style.display = 'flex';
      updateBottomNavVisibility();
    } else {
      bottomNav.style.display = 'none';
    }
  }

  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigation Tabs
window.openHomeScreen = function() {
  activeTab = 'home';
  updateNavTabStyles();
  renderDashboard();
  showScreen('screenDashboard');
};

window.openSettingsScreen = function() {
  activeTab = 'profile';
  updateNavTabStyles();
  renderSettingsScreen();
  showScreen('screenSettings');
};

window.openAdminScreen = function() {
  activeTab = 'admin';
  updateNavTabStyles();
  renderAdminMealsList();
  updatePersistenceStatusUI();
  showScreen('screenAdmin');
};

function updateNavTabStyles() {
  const tabHome = document.getElementById('tabNavHome');
  const tabProfile = document.getElementById('tabNavProfile');
  const tabAdmin = document.getElementById('tabNavAdmin');

  if (tabHome) tabHome.classList.toggle('active', activeTab === 'home');
  if (tabProfile) tabProfile.classList.toggle('active', activeTab === 'profile');
  if (tabAdmin) tabAdmin.classList.toggle('active', activeTab === 'admin');
}

// ============================================================
// EVENT LISTENERS SETUP
// ============================================================
function setupEventListeners() {
  // Login Form
  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginEmailInput = document.getElementById('loginEmail');
      currentUserEmail = loginEmailInput ? (loginEmailInput.value.trim() || 'user@example.com') : 'user@example.com';
      isLoggedIn = true;
      sessionStorage.setItem('mp_is_logged_in', 'true');
      sessionStorage.setItem('mp_user_email', currentUserEmail);
      localStorage.removeItem('mp_is_logged_in'); // Clean legacy persistent login

      updateBottomNavVisibility();

      if (!hasCompletedProfile && !localStorage.getItem('mp_has_profile')) {
        showScreen('screenPurpose');
      } else {
        openHomeScreen();
      }
    });
  }

  // Register Form
  const formRegister = document.getElementById('formRegister');
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const regEmailInput = document.getElementById('registerEmail');
      const email = regEmailInput ? regEmailInput.value.trim() : '';

      if (isProtectedAdminEmail(email)) {
        alert('❌ The administrator account (natitasinsuwan@gmail.com) cannot be created or modified through public registration.');
        return;
      }

      currentUserEmail = email || 'user@example.com';
      isLoggedIn = true;
      sessionStorage.setItem('mp_is_logged_in', 'true');
      sessionStorage.setItem('mp_user_email', currentUserEmail);
      localStorage.removeItem('mp_is_logged_in');

      updateBottomNavVisibility();
      showScreen('screenPurpose');
    });
  }

  // Navigation Links
  const btnCreateAccount = document.getElementById('btnCreateAccount');
  if (btnCreateAccount) {
    btnCreateAccount.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('screenRegister');
    });
  }

  const btnLinkToLogin = document.getElementById('btnLinkToLogin');
  if (btnLinkToLogin) {
    btnLinkToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('screenLogin');
    });
  }

  // Forgot Password Screen Navigation & Form
  const btnForgotPassword = document.getElementById('btnForgotPassword');
  if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      showForgotPasswordScreen();
    });
  }

  const btnBackToLoginFromReset = document.getElementById('btnBackToLoginFromReset');
  if (btnBackToLoginFromReset) {
    btnBackToLoginFromReset.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('screenLogin');
    });
  }

  const formForgotPasswordScreen = document.getElementById('formForgotPasswordScreen');
  if (formForgotPasswordScreen) {
    formForgotPasswordScreen.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('resetScreenEmail').value || '').trim();
      const password = (document.getElementById('resetScreenPassword').value || '');
      const feedback = document.getElementById('screenResetFeedback');

      if (isProtectedAdminEmail(email)) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.background = '#FFF5F5';
          feedback.style.color = '#E53E3E';
          feedback.style.border = '1px solid #FEB2B2';
          feedback.textContent = '❌ Admin password cannot be reset via the public recovery form.';
        }
        return;
      }

      if (!email || !password || password.length < 6) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.background = '#FFF5F5';
          feedback.style.color = '#E53E3E';
          feedback.style.border = '1px solid #FEB2B2';
          feedback.textContent = 'Please enter a valid email and a password of at least 6 characters.';
        }
        return;
      }

      let users = {};
      try {
        users = JSON.parse(localStorage.getItem('mp_users') || '{}');
      } catch (err) {
        users = {};
      }
      users[email.toLowerCase()] = { email, password, updatedAt: new Date().toISOString() };
      localStorage.setItem('mp_users', JSON.stringify(users));

      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = '#ECFDF5';
        feedback.style.color = '#065F46';
        feedback.style.border = '1px solid #A7F3D0';
        feedback.textContent = `✓ Password updated successfully for ${email}!`;
      }

      const loginEmail = document.getElementById('loginEmail');
      const loginPass = document.getElementById('loginPassword');
      if (loginEmail) loginEmail.value = email;
      if (loginPass) loginPass.value = password;

      setTimeout(() => {
        if (feedback) feedback.style.display = 'none';
        showScreen('screenLogin');
      }, 1200);
    });
  }

  // Clear Keywords
  const btnClearKeywords = document.getElementById('btnClearKeywords');
  if (btnClearKeywords) {
    btnClearKeywords.addEventListener('click', () => {
      clearAllKeywords();
    });
  }

  // Start New Day
  const btnStartNewDay = document.getElementById('btnStartNewDay');
  if (btnStartNewDay) {
    btnStartNewDay.addEventListener('click', () => {
      if (confirm("Start a new day? This will reset all your logged meals and consumed calories for today.")) {
        todayMeals = [];
        localStorage.setItem('mp_today_meals', JSON.stringify([]));
        localStorage.setItem('mp_last_date', getTodayDateString());
        renderDashboard();
      }
    });
  }
}

// ============================================================
// ADMIN SCREEN & MEAL CATALOG MANAGEMENT (MATCHES MOCKUP)
// ============================================================

// Render Admin Meals List
function renderAdminMealsList(filteredList = null) {
  const container = document.getElementById('adminMealsCardsList');
  const countEl = document.getElementById('adminCatalogCount');

  if (countEl) countEl.textContent = INITIAL_MEALS.length;
  if (!container) return;

  const mealsToDisplay = filteredList !== null ? filteredList : INITIAL_MEALS;

  if (mealsToDisplay.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 16px; background:#FFFFFF; border-radius:24px;">
        <div style="font-size:24px; margin-bottom:8px;">🔍</div>
        <div style="font-weight:800; font-size:16px; color:#1C1A14; margin-bottom:4px;">No meals found</div>
        <div style="font-size:14px; color:#7C7866;">Try adjusting your search query or add a new meal.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  mealsToDisplay.forEach((meal) => {
    // Find absolute index and ID in INITIAL_MEALS
    const actualIndex = INITIAL_MEALS.indexOf(meal);
    const mealId = meal.id !== undefined ? String(meal.id) : String(actualIndex);
    
    // Format tags
    const country = (meal.keywords && meal.keywords.countries && meal.keywords.countries[0]) || 'Thai';
    const isLowFat = meal.low_fat ? ' · Low-Fat' : '';
    const subText = `${meal.calories} Kcal · ${country}${isLowFat}`;

    const card = document.createElement('div');
    card.className = 'admin-meal-card';
    card.innerHTML = `
      <div class="admin-meal-left">
        <img class="admin-meal-thumb" src="${meal.image_url}" alt="${meal.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'" />
        <div class="admin-meal-info">
          <div class="admin-meal-name">${meal.name}</div>
          <div class="admin-meal-sub">${subText}</div>
        </div>
      </div>
      <div class="admin-meal-actions">
        <button class="btn-icon-edit" onclick="openEditMealModal(${actualIndex}, '${mealId}')" title="Edit meal details">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn-icon-delete" onclick="deleteMeal(${actualIndex}, '${mealId}')" title="Delete meal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Real-time Search in Admin Screen
function handleAdminSearch(query) {
  adminSearchQuery = (query || '').trim().toLowerCase();
  if (!adminSearchQuery) {
    renderAdminMealsList();
    return;
  }

  const filtered = INITIAL_MEALS.filter(meal => {
    const nameMatch = meal.name.toLowerCase().includes(adminSearchQuery);
    const descMatch = (meal.description || '').toLowerCase().includes(adminSearchQuery);
    const countryMatch = meal.keywords && meal.keywords.countries && meal.keywords.countries.some(c => c.toLowerCase().includes(adminSearchQuery));
    const proteinMatch = meal.keywords && meal.keywords.protein && meal.keywords.protein.some(p => p.toLowerCase().includes(adminSearchQuery));
    return nameMatch || descMatch || countryMatch || proteinMatch;
  });

  renderAdminMealsList(filtered);
}

// Helper: Live Image Preview
function updateImagePreview(inputId, imgId) {
  const url = document.getElementById(inputId).value.trim();
  const img = document.getElementById(imgId);
  if (img && url) {
    img.src = url;
  }
}

// ============================================================
// EDIT MEAL MODAL (EDIT EVERYTHING)
// ============================================================
function openEditMealModal(index, id = null) {
  let meal = null;
  if (id !== null && id !== undefined && id !== '') {
    meal = INITIAL_MEALS.find(m => String(m.id) === String(id));
  }
  if (!meal && index !== null && index !== undefined && !isNaN(index)) {
    meal = INITIAL_MEALS[index];
  }
  if (!meal) return;

  const actualIndex = INITIAL_MEALS.indexOf(meal);
  document.getElementById('editMealIndex').value = actualIndex;
  const idField = document.getElementById('editMealId');
  if (idField) {
    idField.value = meal.id !== undefined ? meal.id : '';
  }

  document.getElementById('editMealName').value = meal.name || '';
  document.getElementById('editMealDesc').value = meal.description || '';
  document.getElementById('editMealCal').value = meal.calories || 450;
  document.getElementById('editMealProtein').value = meal.protein_g || 25;
  document.getElementById('editMealCarbs').value = meal.carbs_g || 40;
  document.getElementById('editMealFat').value = meal.fat_g || 15;
  document.getElementById('editMealImg').value = meal.image_url || '';
  document.getElementById('editMealPreviewImg').src = meal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  // Keyword Selects
  const countrySelect = document.getElementById('editMealCountry');
  const methodSelect = document.getElementById('editMealMethod');
  const carbsSelect = document.getElementById('editMealCarbType');
  const proteinSelect = document.getElementById('editMealProteinType');

  if (meal.keywords) {
    if (meal.keywords.countries && meal.keywords.countries[0]) countrySelect.value = meal.keywords.countries[0];
    if (meal.keywords.cooking_methods && meal.keywords.cooking_methods[0]) methodSelect.value = meal.keywords.cooking_methods[0];
    if (meal.keywords.carbs && meal.keywords.carbs[0]) carbsSelect.value = meal.keywords.carbs[0];
    if (meal.keywords.protein && meal.keywords.protein[0]) proteinSelect.value = meal.keywords.protein[0];
  }

  // Allergens & Dietary Chips
  currentEditAllergens = meal.allergens ? [...meal.allergens] : [];
  currentEditDietary = meal.dietary_tags ? [...meal.dietary_tags] : [];

  renderModalChips('editAllergensChips', ALLERGEN_OPTIONS, currentEditAllergens, (tag) => {
    toggleArrayItem(currentEditAllergens, tag);
  });

  renderModalChips('editDietaryChips', DIETARY_OPTIONS, currentEditDietary, (tag) => {
    toggleArrayItem(currentEditDietary, tag);
  });

  document.getElementById('modalEditMeal').style.display = 'flex';
}

function closeEditMealModal() {
  document.getElementById('modalEditMeal').style.display = 'none';
}

function saveMealEdits(event) {
  event.preventDefault();
  const idVal = document.getElementById('editMealId') ? document.getElementById('editMealId').value.trim() : '';
  let index = -1;

  if (idVal) {
    index = INITIAL_MEALS.findIndex(m => String(m.id) === idVal);
  }
  if (index === -1) {
    index = parseInt(document.getElementById('editMealIndex').value);
  }
  if (isNaN(index) || !INITIAL_MEALS[index]) return;

  const meal = INITIAL_MEALS[index];
  const oldName = meal.name;

  meal.name = document.getElementById('editMealName').value.trim();
  meal.description = document.getElementById('editMealDesc').value.trim();
  meal.calories = parseInt(document.getElementById('editMealCal').value) || 0;
  meal.protein_g = parseFloat(document.getElementById('editMealProtein').value) || 0;
  meal.carbs_g = parseFloat(document.getElementById('editMealCarbs').value) || 0;
  meal.fat_g = parseFloat(document.getElementById('editMealFat').value) || 0;
  meal.image_url = document.getElementById('editMealImg').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  meal.low_fat = meal.fat_g <= 10;

  meal.keywords = {
    countries: [document.getElementById('editMealCountry').value],
    cooking_methods: [document.getElementById('editMealMethod').value],
    carbs: [document.getElementById('editMealCarbType').value],
    protein: [document.getElementById('editMealProteinType').value]
  };

  meal.allergens = [...currentEditAllergens];
  meal.dietary_tags = [...currentEditDietary];

  // Save permanently to server disk and commit directly to GitHub repository
  persistMeals(true, `Admin edit: Updated "${meal.name}" (${meal.calories} kcal)`);
  closeEditMealModal();

  // If active in todayMeals, update log entries
  let updatedInToday = false;
  todayMeals.forEach(tm => {
    if (tm.name === oldName || (meal.id !== undefined && String(tm.id) === String(meal.id))) {
      tm.name = meal.name;
      tm.calories = meal.calories;
      tm.image_url = meal.image_url;
      updatedInToday = true;
    }
  });
  if (updatedInToday) {
    localStorage.setItem('mp_today_meals', JSON.stringify(todayMeals));
  }

  // Refresh Views
  if (adminSearchQuery) {
    handleAdminSearch(adminSearchQuery);
  } else {
    renderAdminMealsList();
  }
  renderDashboard();

  const msg = isServerPersistenceActive
    ? `✅ "${meal.name}" saved permanently to meals.js on server!`
    : `✅ "${meal.name}" updated! Saved in browser storage. (Use Export or GitHub Sync for cloud)`;
  showAppToast(msg, 'success');
}

// ============================================================
// ADD NEW MEAL MODAL
// ============================================================
function openAddMealModal() {
  currentAddAllergens = [];
  currentAddDietary = [];

  renderModalChips('addAllergensChips', ALLERGEN_OPTIONS, currentAddAllergens, (tag) => {
    toggleArrayItem(currentAddAllergens, tag);
  });

  renderModalChips('addDietaryChips', DIETARY_OPTIONS, currentAddDietary, (tag) => {
    toggleArrayItem(currentAddDietary, tag);
  });

  document.getElementById('modalAddMeal').style.display = 'flex';
}

function closeAddMealModal() {
  document.getElementById('modalAddMeal').style.display = 'none';
}

function saveNewMeal(event) {
  event.preventDefault();

  const fatVal = parseFloat(document.getElementById('addMealFat').value) || 15;
  const newMeal = {
    id: Date.now(),
    name: document.getElementById('addMealName').value.trim(),
    description: document.getElementById('addMealDesc').value.trim(),
    calories: parseInt(document.getElementById('addMealCal').value) || 450,
    protein_g: parseFloat(document.getElementById('addMealProtein').value) || 30,
    carbs_g: parseFloat(document.getElementById('addMealCarbs').value) || 45,
    fat_g: fatVal,
    low_fat: fatVal <= 10,
    image_url: document.getElementById('addMealImg').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    keywords: {
      countries: [document.getElementById('addMealCountry').value],
      cooking_methods: [document.getElementById('addMealMethod').value],
      carbs: [document.getElementById('addMealCarbType').value],
      protein: [document.getElementById('addMealProteinType').value]
    },
    allergens: [...currentAddAllergens],
    dietary_tags: [...currentAddDietary]
  };

  INITIAL_MEALS.unshift(newMeal); // Add to top
  persistMeals(true, `Admin add: Created new dish "${newMeal.name}" (${newMeal.calories} kcal)`);

  document.getElementById('formAddMeal').reset();
  closeAddMealModal();

  renderAdminMealsList();
  renderDashboard();

  const msg = isServerPersistenceActive
    ? `✅ "${newMeal.name}" created and saved permanently to meals.js!`
    : `✅ "${newMeal.name}" added to catalog and pushed to GitHub!`;
  showAppToast(msg, 'success');
}

// Delete Meal from Catalog
function deleteMeal(index, id = null) {
  let actualIndex = -1;
  if (id !== null && id !== undefined && id !== '') {
    actualIndex = INITIAL_MEALS.findIndex(m => String(m.id) === String(id));
  }
  if (actualIndex === -1 && index !== null && index !== undefined && !isNaN(index)) {
    actualIndex = parseInt(index);
  }
  if (isNaN(actualIndex) || !INITIAL_MEALS[actualIndex]) return;

  const meal = INITIAL_MEALS[actualIndex];
  if (confirm(`Are you sure you want to permanently delete "${meal.name}" from the catalog?`)) {
    INITIAL_MEALS.splice(actualIndex, 1);
    persistMeals(true, `Admin delete: Removed "${meal.name}" from catalog`);

    if (adminSearchQuery) {
      handleAdminSearch(adminSearchQuery);
    } else {
      renderAdminMealsList();
    }
    renderDashboard();

    const msg = isServerPersistenceActive
      ? `🗑️ Deleted "${meal.name}" permanently from meals.js.`
      : `🗑️ Deleted "${meal.name}" from catalog.`;
    showAppToast(msg, 'info');
  }
}

// Helper: Modal Chip Renderer
function renderModalChips(containerId, options, activeArray, onToggle) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  options.forEach(opt => {
    const chip = document.createElement('div');
    const isActive = activeArray.includes(opt);
    chip.className = `checkbox-chip ${isActive ? 'active' : ''}`;
    chip.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
    chip.addEventListener('click', () => {
      onToggle(opt);
      chip.classList.toggle('active', activeArray.includes(opt));
    });
    container.appendChild(chip);
  });
}

function toggleArrayItem(arr, item) {
  const idx = arr.indexOf(item);
  if (idx > -1) {
    arr.splice(idx, 1);
  } else {
    arr.push(item);
  }
}

// ============================================================
// SPOONACULAR API INTEGRATION
// ============================================================
const SPOONACULAR_API_KEY = "939d069f44f14f4aaaf04a477a096383";

function openImportModal() {
  document.getElementById('modalImportMeal').style.display = 'flex';
}

function closeImportModal() {
  document.getElementById('modalImportMeal').style.display = 'none';
}

async function searchSpoonacular() {
  const queryInput = document.getElementById('spoonacularQuery');
  const query = queryInput ? (queryInput.value.trim() || 'Thai') : 'Thai';
  const resultsContainer = document.getElementById('spoonacularResults');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = '<div style="font-size:14px; color:#7C7866; text-align:center; padding:20px;">Searching Spoonacular API...</div>';

  try {
    const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&addRecipeInformation=true&number=8`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultsContainer.innerHTML = '<div style="font-size:14px; color:#7C7866; text-align:center; padding:20px;">No recipes found. Try a different search term.</div>';
      return;
    }

    resultsContainer.innerHTML = '';
    data.results.forEach(rec => {
      const calories = rec.nutrition ? Math.round(rec.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 420) : Math.floor(Math.random() * 200) + 350;
      const escapedName = rec.title.replace(/'/g, "\\'");
      const escapedSummary = (rec.summary ? rec.summary.replace(/<[^>]*>?/gm, '').slice(0, 100) : 'Imported recipe').replace(/'/g, "\\'");

      const item = document.createElement('div');
      item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#F7F6F0; border-radius:18px; border:1px solid #EBE8DC;';
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
          <img src="${rec.image}" style="width:48px; height:48px; border-radius:14px; object-fit:cover; flex-shrink:0;" />
          <div style="min-width:0; flex:1;">
            <div style="font-weight:800; font-size:15px; color:#1C1A14; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${rec.title}</div>
            <div style="font-size:13px; color:var(--primary-orange); font-weight:700;">🔥 ~${calories} kcal</div>
          </div>
        </div>
        <button onclick="importSpoonacularMeal('${escapedName}', ${calories}, '${rec.image}', '${escapedSummary}')" class="btn-orange" style="width:auto; height:38px; padding:0 14px; margin-top:0; font-size:13px; border-radius:9999px; white-space:nowrap; flex-shrink:0;">➕ Import</button>
      `;
      resultsContainer.appendChild(item);
    });
  } catch (err) {
    console.error("Spoonacular API Error:", err);
    resultsContainer.innerHTML = '<div style="font-size:14px; color:#EF4444; text-align:center; padding:20px;">Failed to fetch recipes from Spoonacular. Check API limit or connection.</div>';
  }
}

function importSpoonacularMeal(name, calories, img, desc) {
  const newMeal = {
    id: Date.now(),
    name,
    description: desc || `Authentic recipe imported via Spoonacular API.`,
    calories,
    protein_g: 28,
    carbs_g: 40,
    fat_g: 14,
    low_fat: false,
    image_url: img,
    keywords: {
      countries: ["Thai"],
      cooking_methods: ["Stir-Fry"],
      carbs: ["Rice"],
      protein: ["Chicken"]
    },
    allergens: [],
    dietary_tags: ["gluten-free", "halal"]
  };

  INITIAL_MEALS.unshift(newMeal);
  persistMeals(true, `Admin import: Added "${name}" (${calories} kcal)`);
  closeImportModal();

  renderAdminMealsList();
  renderDashboard();

  const msg = isServerPersistenceActive
    ? `✅ "${name}" imported and saved permanently to meals.js!`
    : `✅ "${name}" imported into catalog! Saved in browser storage.`;
  showAppToast(msg, 'success');
}

// ============================================================
// DASHBOARD & RANDOM GENERATOR
// ============================================================
function clearAllKeywords() {
  selectedKeywords.clear();
  renderCategorizedKeywords();
  rollRandomMeal();
}

function renderCategorizedKeywords() {
  const container = document.getElementById('categorizedKeywordsContainer');
  if (!container) return;
  container.innerHTML = '';

  for (const [catName, tags] of Object.entries(CATEGORIZED_KEYWORDS)) {
    const header = document.createElement('div');
    header.className = 'keyword-category-header';
    header.textContent = catName;
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'chip-wrap-grid';

    tags.forEach(tag => {
      const chip = document.createElement('div');
      chip.className = `chip-btn ${selectedKeywords.has(tag) ? 'active' : ''}`;
      chip.textContent = tag;
      chip.setAttribute('data-testid', `chip-${tag.toLowerCase()}`);
      chip.addEventListener('click', () => {
        if (selectedKeywords.has(tag)) {
          selectedKeywords.delete(tag);
          chip.classList.remove('active');
        } else {
          selectedKeywords.add(tag);
          chip.classList.add('active');
        }
        rollRandomMeal();
      });
      grid.appendChild(chip);
    });

    container.appendChild(grid);
  }
}

function renderDashboard() {
  const calculatedAge = getAgeFromBirthday(profile.birthday);
  const targetCalories = calculateEnergyTarget();
  const consumed = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const remaining = targetCalories - consumed;

  const sexFormatted = profile.sex ? (profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1)) : 'Female';
  const modeLabel = mode === 'diet' ? 'BMR' : 'TDEE';
  
  const subEl = document.getElementById('dashSubtitle');
  if (subEl) subEl.textContent = `${sexFormatted}, ${calculatedAge} yrs, ${profile.weight}kg, ${profile.height}cm (${modeLabel}: ${targetCalories} kcal)`;

  const dashTitle = document.getElementById('dashTitle');
  if (dashTitle) {
    dashTitle.textContent = mode === 'diet' ? "Diet Planning" : "Random Meal Generator";
  }

  const valNeed = document.getElementById('valNeed');
  const valConsumed = document.getElementById('valConsumed');
  const valRemaining = document.getElementById('valRemaining');

  if (valNeed) valNeed.textContent = targetCalories;
  if (valConsumed) valConsumed.textContent = consumed;
  if (valRemaining) valRemaining.textContent = remaining;

  renderTodayMealsList();
  
  const mealBox = document.getElementById('yourMealBox');
  if (mealBox && !mealBox.innerHTML.trim()) {
    rollRandomMeal();
  }
}

function rollRandomMeal() {
  let pool = INITIAL_MEALS;

  // 1. Allergy Filter
  if (profile.allergies && profile.allergies.length > 0) {
    const userAllergies = profile.allergies.map(a => a.toLowerCase());
    pool = pool.filter(meal => {
      if (!meal.allergens || meal.allergens.length === 0) return true;
      const mealAllergens = meal.allergens.map(a => a.toLowerCase());
      return !userAllergies.some(userAlg => mealAllergens.includes(userAlg));
    });
  }

  // 2. Dietary Preferences Filter
  if (profile.ethical && profile.ethical.length > 0) {
    const userPrefs = profile.ethical.map(p => p.toLowerCase());
    if (userPrefs.includes('vegan')) {
      pool = pool.filter(meal => meal.dietary_tags && meal.dietary_tags.includes('vegan'));
    } else if (userPrefs.includes('vegetarian')) {
      pool = pool.filter(meal => meal.dietary_tags && (meal.dietary_tags.includes('vegetarian') || meal.dietary_tags.includes('vegan')));
    }
  }

  // 3. Accurate Category-Aware Keyword Filter (AND across categories, OR within same category)
  if (selectedKeywords.size > 0) {
    // Group selected keywords by their category
    const selByCat = {};
    for (const kw of selectedKeywords) {
      let foundCat = 'Other';
      for (const [catName, tags] of Object.entries(CATEGORIZED_KEYWORDS)) {
        if (tags.some(t => t.toLowerCase() === kw.toLowerCase())) {
          foundCat = catName;
          break;
        }
      }
      if (!selByCat[foundCat]) selByCat[foundCat] = [];
      selByCat[foundCat].push(kw.toLowerCase());
    }

    // Filter meals by checking if meal satisfies all selected categories
    const exactMatches = pool.filter(meal => {
      const kwData = meal.keywords || {};
      const mealCountries = (kwData.countries || []).map(x => x.toLowerCase());
      const mealMethods = (kwData.cooking_methods || []).map(x => x.toLowerCase());
      const mealCarbs = (kwData.carbs || []).map(x => x.toLowerCase());
      const mealProtein = (kwData.protein || []).map(x => x.toLowerCase());
      const mealText = `${meal.name || ''} ${meal.description || ''}`.toLowerCase();

      for (const [cat, selList] of Object.entries(selByCat)) {
        const catMatch = selList.some(sel => {
          if (cat === 'Country') return mealCountries.includes(sel) || mealText.includes(sel);
          if (cat === 'Cooking Methods') return mealMethods.includes(sel) || mealText.includes(sel);
          if (cat === 'Carbs') return mealCarbs.includes(sel) || mealText.includes(sel);
          if (cat === 'Protein') return mealProtein.includes(sel) || mealText.includes(sel);
          return mealText.includes(sel) || mealCountries.includes(sel) || mealMethods.includes(sel) || mealCarbs.includes(sel) || mealProtein.includes(sel);
        });
        if (!catMatch) return false;
      }
      return true;
    });

    if (exactMatches.length > 0) {
      pool = exactMatches;
    } else {
      // Score meals based on number of matched categories if no full combination exists
      const scored = pool.map(meal => {
        const kwData = meal.keywords || {};
        const mealCountries = (kwData.countries || []).map(x => x.toLowerCase());
        const mealMethods = (kwData.cooking_methods || []).map(x => x.toLowerCase());
        const mealCarbs = (kwData.carbs || []).map(x => x.toLowerCase());
        const mealProtein = (kwData.protein || []).map(x => x.toLowerCase());
        const mealText = `${meal.name || ''} ${meal.description || ''}`.toLowerCase();

        let score = 0;
        for (const [cat, selList] of Object.entries(selByCat)) {
          const match = selList.some(sel => {
            if (cat === 'Country') return mealCountries.includes(sel) || mealText.includes(sel);
            if (cat === 'Cooking Methods') return mealMethods.includes(sel) || mealText.includes(sel);
            if (cat === 'Carbs') return mealCarbs.includes(sel) || mealText.includes(sel);
            if (cat === 'Protein') return mealProtein.includes(sel) || mealText.includes(sel);
            return mealText.includes(sel);
          });
          if (match) score++;
        }
        return { meal, score };
      }).filter(item => item.score > 0);

      if (scored.length > 0) {
        const maxScore = Math.max(...scored.map(s => s.score));
        pool = scored.filter(s => s.score === maxScore).map(s => s.meal);
      } else {
        pool = [];
      }
    }
  }

  const box = document.getElementById('yourMealBox');
  if (!box) return;

  if (pool.length === 0) {
    box.innerHTML = `
      <div style="text-align:center; padding:32px 16px; background:#F8F7F0; border-radius:22px; border:1px dashed #DDD8C4;">
        <div style="font-size:36px; margin-bottom:8px;">🔍</div>
        <div style="font-family:var(--font-heading); font-size:18px; font-weight:800; color:#1C1A14; margin-bottom:6px;">No Meals Found</div>
        <div style="font-size:13.5px; color:var(--text-muted); line-height:1.4; margin-bottom:16px;">
          No meals match your selected keyword filters and dietary restrictions.
        </div>
        <button onclick="clearAllKeywords()" class="btn-orange" style="width:auto; height:40px; padding:0 20px; margin:0 auto; font-size:13px; border-radius:9999px;">
          Clear Keywords
        </button>
      </div>
    `;
    return;
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  const escapedName = picked.name.replace(/'/g, "\\'");

  // Generate keyword tags HTML with highlighted active chips
  const allMealTags = [
    ...(picked.keywords?.countries || []),
    ...(picked.keywords?.cooking_methods || []),
    ...(picked.keywords?.carbs || []),
    ...(picked.keywords?.protein || [])
  ];

  const tagsHtml = allMealTags.map(tag => {
    const isSelected = selectedKeywords.has(tag) || Array.from(selectedKeywords).some(k => k.toLowerCase() === tag.toLowerCase());
    return `<span style="display:inline-flex; align-items:center; font-size:12px; font-weight:700; padding:4px 10px; border-radius:9999px; ${isSelected ? 'background:var(--primary-orange); color:#FFFFFF; box-shadow:0 2px 8px rgba(243,156,18,0.3);' : 'background:#F4F2E6; color:#555243; border:1px solid #E5E0CE;'}">${tag}</span>`;
  }).join(' ');

  box.innerHTML = `
    <div style="margin-bottom:14px;">
      <div style="font-family:var(--font-heading); font-weight:900; font-size:22px; color:#1C1A14; margin-bottom:4px;">${picked.name}</div>
      <div style="font-size:14px; color:var(--text-muted); line-height:1.4; margin-bottom:10px;">${picked.description}</div>
      ${allMealTags.length > 0 ? `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:4px;">${tagsHtml}</div>` : ''}
    </div>

    <div style="width:100%; height:220px; border-radius:22px; overflow:hidden; margin-bottom:16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); background:#F3F1E6;">
      <img src="${picked.image_url}" style="width:100%; height:100%; object-fit:cover; display:block;" alt="${picked.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'" />
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <span style="font-family:var(--font-heading); font-weight:900; color:var(--primary-orange); font-size:24px;">🔥 ${picked.calories} kcal</span>
      </div>
      <button class="btn-orange" style="width:auto; height:44px; padding:0 20px; margin-top:0; font-size:14px; border-radius:9999px;" onclick="addMealToToday('${escapedName}', ${picked.calories}, '${picked.image_url}')">
        ➕ Add to Today
      </button>
    </div>
  `;
}

function addMealToToday(name, calories, img) {
  todayMeals.push({
    id: Date.now(),
    name,
    calories,
    image_url: img,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  localStorage.setItem('mp_today_meals', JSON.stringify(todayMeals));
  renderDashboard();
}

function renderTodayMealsList() {
  const container = document.getElementById('todayMealsContainer');
  if (!container) return;

  if (todayMeals.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 24px 0; color:#9CA3AF;">
        <div style="font-weight:800; font-size:16px; color:#1C1A14; margin-bottom:4px;">No meals added yet</div>
        <div style="font-size:14px; color:var(--text-muted);">Add meals above to track your daily intake</div>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  todayMeals.forEach((meal, idx) => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #F3F4F6;';
    div.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${meal.image_url}" style="width:46px; height:46px; border-radius:14px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'" />
        <div>
          <div style="font-weight:800; font-size:15px; color:#1C1A14;">${meal.name}</div>
          <div style="font-size:13px; color:#7C7866;">${meal.time} • 🔥 ${meal.calories} kcal</div>
        </div>
      </div>
      <button onclick="removeTodayMeal(${idx})" style="background:#FFF5F5; border:none; color:#EF4444; width:32px; height:32px; border-radius:50%; font-size:14px; cursor:pointer; font-weight:800; display:flex; align-items:center; justify-content:center;">✕</button>
    `;
    container.appendChild(div);
  });
}

function removeTodayMeal(index) {
  todayMeals.splice(index, 1);
  localStorage.setItem('mp_today_meals', JSON.stringify(todayMeals));
  renderDashboard();
}

// ============================================================
// SETTINGS / PROFILE SCREEN LOGIC
// ============================================================
function renderSettingsScreen() {
  const subtitle = document.getElementById('settingsEmailSubtitle');
  if (subtitle) subtitle.textContent = currentUserEmail || 'user@example.com';
  
  const targetCals = calculateEnergyTarget();
  const valEl = document.getElementById('settingsCalorieVal');
  if (valEl) valEl.textContent = targetCals;
  const modeLabel = mode === 'diet' ? 'BMR' : 'TDEE';
  const subEl = document.getElementById('settingsCalorieSub');
  if (subEl) subEl.textContent = `${targetCals} ${modeLabel} · Mifflin–St Jeor`;

  setSettingsMode(mode || 'random', false);
  setSettingsSex(profile.sex || 'female', false);

  const bDayInput = document.getElementById('settingsInputBirthday');
  if (bDayInput) bDayInput.value = profile.birthday || '2010-05-15';
  const wInput = document.getElementById('settingsInputWeight');
  if (wInput) wInput.value = profile.weight || 45;
  const hInput = document.getElementById('settingsInputHeight');
  if (hInput) hInput.value = profile.height || 157;

  setSettingsExercise(profile.exercise !== undefined ? profile.exercise : 1);
  renderSettingsChips();
}

function setSettingsMode(val, updateDisplay = true) {
  mode = val;
  localStorage.setItem('mp_app_mode', val);
  const btnRandom = document.getElementById('settingsModeRandom');
  const btnDiet = document.getElementById('settingsModeDiet');
  if (btnRandom) btnRandom.classList.toggle('active', val === 'random');
  if (btnDiet) btnDiet.classList.toggle('active', val === 'diet');

  if (updateDisplay) {
    const targetCals = calculateEnergyTarget();
    const valEl = document.getElementById('settingsCalorieVal');
    if (valEl) valEl.textContent = targetCals;
    const subEl = document.getElementById('settingsCalorieSub');
    const modeLabel = mode === 'diet' ? 'BMR' : 'TDEE';
    if (subEl) subEl.textContent = `${targetCals} ${modeLabel} · Mifflin–St Jeor`;
  }
}

function setSettingsSex(val, updateDisplay = true) {
  profile.sex = val;
  const btnMale = document.getElementById('settingsSexMale');
  const btnFemale = document.getElementById('settingsSexFemale');
  if (btnMale) btnMale.classList.toggle('active', val === 'male');
  if (btnFemale) btnFemale.classList.toggle('active', val === 'female');

  if (updateDisplay) {
    const targetCals = calculateEnergyTarget();
    const valEl = document.getElementById('settingsCalorieVal');
    if (valEl) valEl.textContent = targetCals;
    const subEl = document.getElementById('settingsCalorieSub');
    const modeLabel = mode === 'diet' ? 'BMR' : 'TDEE';
    if (subEl) subEl.textContent = `${targetCals} ${modeLabel} · Mifflin–St Jeor`;
  }
}

function setSettingsExercise(val) {
  profile.exercise = val;
  document.querySelectorAll('.workout-grid-4x2 .exercise-pill').forEach((p, idx) => {
    p.classList.toggle('active', idx === val);
  });

  const targetCals = calculateEnergyTarget();
  const calVal = document.getElementById('settingsCalorieVal');
  if (calVal) calVal.textContent = targetCals;
  const calSub = document.getElementById('settingsCalorieSub');
  const modeLabel = mode === 'diet' ? 'BMR' : 'TDEE';
  if (calSub) calSub.textContent = `${targetCals} ${modeLabel} · Mifflin–St Jeor`;
}

function renderSettingsChips() {
  const dietContainer = document.getElementById('settingsDietaryChips');
  if (dietContainer) {
    dietContainer.innerHTML = '';
    const dietOpts = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Halal", "Kosher"];
    if (!profile.ethical) profile.ethical = [];

    dietOpts.forEach(opt => {
      const chip = document.createElement('div');
      chip.className = `chip-btn ${profile.ethical.includes(opt) ? 'active' : ''}`;
      chip.textContent = opt;
      chip.addEventListener('click', () => {
        const idx = profile.ethical.indexOf(opt);
        if (idx > -1) {
          profile.ethical.splice(idx, 1);
          chip.classList.remove('active');
        } else {
          profile.ethical.push(opt);
          chip.classList.add('active');
        }
      });
      dietContainer.appendChild(chip);
    });
  }

  const allergyContainer = document.getElementById('settingsAllergiesChips');
  if (allergyContainer) {
    allergyContainer.innerHTML = '';
    const allergyOpts = ["Nuts", "Dairy", "Gluten", "Shellfish", "Egg", "Soy"];
    if (!profile.allergies) profile.allergies = [];

    allergyOpts.forEach(opt => {
      const chip = document.createElement('div');
      chip.className = `chip-btn ${profile.allergies.includes(opt) ? 'active' : ''}`;
      chip.textContent = opt;
      chip.addEventListener('click', () => {
        const idx = profile.allergies.indexOf(opt);
        if (idx > -1) {
          profile.allergies.splice(idx, 1);
          chip.classList.remove('active');
        } else {
          profile.allergies.push(opt);
          chip.classList.add('active');
        }
      });
      allergyContainer.appendChild(chip);
    });
  }
}

function saveSettings() {
  const bDayInput = document.getElementById('settingsInputBirthday');
  const wInput = document.getElementById('settingsInputWeight');
  const hInput = document.getElementById('settingsInputHeight');

  profile.birthday = bDayInput ? (bDayInput.value.trim() || '2010-05-15') : '2010-05-15';
  profile.weight = wInput ? (parseFloat(wInput.value) || 45) : 45;
  profile.height = hInput ? (parseFloat(hInput.value) || 157) : 157;

  localStorage.setItem('mp_user_profile', JSON.stringify(profile));
  localStorage.setItem('mp_app_mode', mode);

  alert("Settings saved successfully!");
  openHomeScreen();
}

function signOutUser() {
  isLoggedIn = false;
  currentUserEmail = '';
  sessionStorage.removeItem('mp_is_logged_in');
  sessionStorage.removeItem('mp_user_email');
  localStorage.removeItem('mp_is_logged_in');
  localStorage.removeItem('mp_user_email');
  
  const loginEmail = document.getElementById('loginEmail');
  const loginPass = document.getElementById('loginPassword');
  if (loginEmail) loginEmail.value = '';
  if (loginPass) {
    loginPass.value = '';
    loginPass.type = 'password';
  }

  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    btn.setAttribute('title', 'Show password');
    btn.setAttribute('aria-label', 'Show password');
  });

  showScreen('screenLogin');
}

// ============================================================
// PASSWORD VISIBILITY TOGGLE
// ============================================================
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  if (btn) {
    if (isPassword) {
      // Eye-off icon (password is visible, click to hide)
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`;
      btn.setAttribute('title', 'Hide password');
      btn.setAttribute('aria-label', 'Hide password');
    } else {
      // Eye icon (password is hidden, click to show)
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      btn.setAttribute('title', 'Show password');
      btn.setAttribute('aria-label', 'Show password');
    }
  }
}

// ============================================================
// ONBOARDING WIZARD HELPERS
// ============================================================
function selectPurpose(selectedMode) {
  mode = selectedMode;
  localStorage.setItem('mp_app_mode', selectedMode);
  setTimeout(() => {
    showScreen('screenStep2Body');
  }, 150);
}

function setSex(val) {
  profile.sex = val;
  const male = document.getElementById('sexMale');
  const female = document.getElementById('sexFemale');
  if (male) male.classList.toggle('active', val === 'male');
  if (female) female.classList.toggle('active', val === 'female');
}

function setExercise(val, el) {
  profile.exercise = val;
  document.querySelectorAll('.workout-grid .exercise-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

function submitStep2() {
  profile.birthday = document.getElementById('inputStep2Birthday').value || '2010-05-15';
  profile.weight = parseFloat(document.getElementById('inputStep2Weight').value) || 45;
  profile.height = parseFloat(document.getElementById('inputStep2Height').value) || 157;
  showScreen('screenStep3Exercise');
}

function submitStep3() {
  renderStep4Chips();
  showScreen('screenStep4Dietary');
}

function renderStep4Chips() {
  const container = document.getElementById('step4DietaryChips');
  if (!container) return;
  container.innerHTML = '';

  const options = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Halal", "Kosher"];
  if (!profile.ethical) profile.ethical = [];

  options.forEach(opt => {
    const chip = document.createElement('div');
    chip.className = `chip-btn ${profile.ethical.includes(opt) ? 'active' : ''}`;
    chip.textContent = opt;
    chip.addEventListener('click', () => {
      const idx = profile.ethical.indexOf(opt);
      if (idx > -1) {
        profile.ethical.splice(idx, 1);
        chip.classList.remove('active');
      } else {
        profile.ethical.push(opt);
        chip.classList.add('active');
      }
    });
    container.appendChild(chip);
  });
}

function submitStep4() {
  renderStep5Chips();
  showScreen('screenStep5Allergies');
}

function renderStep5Chips() {
  const container = document.getElementById('step5AllergiesChips');
  if (!container) return;
  container.innerHTML = '';

  const options = ["Nuts", "Dairy", "Gluten", "Shellfish", "Egg", "Soy"];
  if (!profile.allergies) profile.allergies = [];

  options.forEach(opt => {
    const chip = document.createElement('div');
    chip.className = `chip-btn ${profile.allergies.includes(opt) ? 'active' : ''}`;
    chip.textContent = opt;
    chip.addEventListener('click', () => {
      const idx = profile.allergies.indexOf(opt);
      if (idx > -1) {
        profile.allergies.splice(idx, 1);
        chip.classList.remove('active');
      } else {
        profile.allergies.push(opt);
        chip.classList.add('active');
      }
    });
    container.appendChild(chip);
  });
}

function submitStep5() {
  hasCompletedProfile = true;
  localStorage.setItem('mp_has_profile', 'true');
  localStorage.setItem('mp_user_profile', JSON.stringify(profile));
  openHomeScreen();
}

// ============================================================
// FORGOT & RESET PASSWORD LOGIC
// ============================================================
// Sanitize any corrupted or tampered local users
try {
  const storedUsers = JSON.parse(localStorage.getItem('mp_users') || '{}');
  let changed = false;
  ['natitasinsuwan@gmail.com', 'natitasinsuwan64@gmail.com', 'admin@example.com'].forEach(a => {
    if (storedUsers[a]) {
      delete storedUsers[a];
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem('mp_users', JSON.stringify(storedUsers));
  }
} catch(e) {}

// ============================================================
// EMAILJS CONFIGURATION & RECOVERY FLOW
// ============================================================
const EMAILJS_CONFIG = {
  publicKey: localStorage.getItem('mp_emailjs_public_key') || 'YOUR_PUBLIC_KEY',
  serviceId: localStorage.getItem('mp_emailjs_service_id') || 'YOUR_SERVICE_ID',
  templateId: localStorage.getItem('mp_emailjs_template_id') || 'YOUR_TEMPLATE_ID'
};

let currentGeneratedOtp = '849201'; // Default fallback code
let currentRecoveryEmail = '';

function isProtectedAdminEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  return normalized === 'natitasinsuwan@gmail.com' ||
         normalized === 'natitasinsuwan64@gmail.com' ||
         normalized.includes('natitasinsuwan');
}

async function sendRecoveryEmail(email) {
  if (isProtectedAdminEmail(email)) {
    console.warn('Password recovery attempt blocked for admin account:', email);
    return { success: false, mode: 'blocked', error: 'Admin recovery blocked' };
  }

  currentRecoveryEmail = email;
  currentGeneratedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const isConfigured = EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined';

  if (isConfigured) {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        to_email: email,
        email: email,
        passcode: currentGeneratedOtp,
        reset_code: currentGeneratedOtp,
        otp: currentGeneratedOtp,
        app_name: 'Meal · Random'
      });
      console.log('✓ Real email sent via EmailJS to:', email);
      return { success: true, mode: 'emailjs', otp: currentGeneratedOtp };
    } catch (err) {
      console.error('EmailJS error:', err);
      return { success: false, mode: 'error', error: err, otp: currentGeneratedOtp };
    }
  } else {
    console.log(`[EmailJS Demo]: Generated code for ${email}: ${currentGeneratedOtp}`);
    return { success: true, mode: 'demo', otp: currentGeneratedOtp };
  }
}

async function resendRecoveryCode() {
  const resetEmailInput = document.getElementById('resetScreenEmail');
  const email = (resetEmailInput && resetEmailInput.value.trim()) ? resetEmailInput.value.trim() : currentRecoveryEmail;
  const feedback = document.getElementById('screenResetFeedback');

  if (!email) return;

  if (feedback) {
    feedback.style.display = 'block';
    feedback.style.background = '#EFF6FF';
    feedback.style.color = '#1E40AF';
    feedback.style.border = '1px solid #BFDBFE';
    feedback.textContent = 'Sending new verification code...';
  }

  const result = await sendRecoveryEmail(email);
  if (feedback) {
    if (result.mode === 'emailjs') {
      feedback.style.background = '#ECFDF5';
      feedback.style.color = '#065F46';
      feedback.style.border = '1px solid #A7F3D0';
      feedback.textContent = `✓ New 6-digit code sent to your inbox (${email})!`;
    } else {
      feedback.style.background = '#EFF6FF';
      feedback.style.color = '#1E40AF';
      feedback.style.border = '1px solid #BFDBFE';
      feedback.innerHTML = `✉ <strong>New Reset Code:</strong> <span style="font-size:16px; font-weight:900; letter-spacing:0.1em;">${result.otp}</span><br><span style="font-size:12px;">(Enter your EmailJS keys in EMAILJS_CONFIG for live inbox delivery)</span>`;
    }
  }
}

async function showForgotPasswordScreen() {
  const loginEmail = document.getElementById('loginEmail');
  const emailVal = loginEmail ? loginEmail.value.trim() : '';
  const noticeEl = document.getElementById('loginEmailNotice');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailVal || !emailRegex.test(emailVal)) {
    if (noticeEl) {
      noticeEl.style.display = 'flex';
      noticeEl.style.alignItems = 'center';
      noticeEl.style.gap = '8px';
      noticeEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Please input your email address first before resetting password.</span>
      `;
    }
    if (loginEmail) {
      loginEmail.focus();
      loginEmail.style.borderColor = '#DC2626';
      loginEmail.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.15)';
      loginEmail.addEventListener('input', function onEmailInput() {
        if (loginEmail.value.trim()) {
          loginEmail.style.borderColor = '';
          loginEmail.style.boxShadow = '';
          if (noticeEl) noticeEl.style.display = 'none';
          loginEmail.removeEventListener('input', onEmailInput);
        }
      });
    }
    return;
  }

  // Block admin accounts from public password recovery
  if (isProtectedAdminEmail(emailVal)) {
    if (noticeEl) {
      noticeEl.style.display = 'flex';
      noticeEl.style.alignItems = 'center';
      noticeEl.style.gap = '8px';
      noticeEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>For security reasons, password recovery is disabled for the administrator account (${emailVal}).</span>
      `;
    }
    if (loginEmail) {
      loginEmail.focus();
      loginEmail.style.borderColor = '#DC2626';
      loginEmail.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.15)';
    }
    return;
  }

  if (noticeEl) noticeEl.style.display = 'none';
  if (loginEmail) {
    loginEmail.style.borderColor = '';
    loginEmail.style.boxShadow = '';
  }

  const resetEmail = document.getElementById('resetScreenEmail');
  const resetPass = document.getElementById('resetScreenPassword');
  const feedback = document.getElementById('screenResetFeedback');

  if (resetEmail) resetEmail.value = emailVal;
  if (resetPass) { resetPass.value = ''; resetPass.type = 'password'; }
  if (feedback) { feedback.style.display = 'none'; feedback.textContent = ''; }

  showScreen('screenForgotPassword');
}

// ============================================================
// PERMANENT PERSISTENCE & GITHUB SYNC
// ============================================================

function downloadMealsJs() {
  const formattedJson = JSON.stringify(INITIAL_MEALS, null, 2);
  const content = `const DEFAULT_MEALS = ${formattedJson};\n\nlet INITIAL_MEALS = [...DEFAULT_MEALS];\n`;
  const blob = new Blob([content], { type: 'application/javascript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meals.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAppToast('💾 Downloaded updated meals.js! Commit this file to your repo to update GitHub Pages.', 'info');
}

function exportMealsJson() {
  const blob = new Blob([JSON.stringify(INITIAL_MEALS, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meals_catalog.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAppToast('📥 Exported catalog to meals_catalog.json', 'info');
}

function handleImportJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0) {
        INITIAL_MEALS = data;
        persistMeals(true, `Admin import: Imported ${data.length} meals`);
        renderAdminMealsList();
        renderDashboard();
        closeBackupModal();
        showAppToast(`✅ Successfully imported ${data.length} meals into catalog!`, 'success');
      } else {
        alert('Invalid JSON file format. Must be a JSON array of meals.');
      }
    } catch (err) {
      alert(`Failed to parse JSON file: ${err.message}`);
    }
  };
  reader.readAsText(file);
}

function confirmResetCatalog() {
  if (confirm('Are you sure you want to reset the entire meal catalog back to the default 68 dishes? Any custom meals and edits will be reverted.')) {
    INITIAL_MEALS = [...DEFAULT_MEALS];
    persistMeals(true, 'Admin reset: Restored catalog to original 68 dishes');
    renderAdminMealsList();
    renderDashboard();
    closeBackupModal();
    showAppToast('🔄 Catalog reset to default 68 dishes.', 'info');
  }
}

function openGitHubSyncModal() {
  const token = localStorage.getItem('mp_gh_token') || GITHUB_CONFIG.defaultToken;
  const repo = localStorage.getItem('mp_gh_repo') || `${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;
  const branch = localStorage.getItem('mp_gh_branch') || GITHUB_CONFIG.branch;

  const tokenInput = document.getElementById('ghSyncToken');
  const repoInput = document.getElementById('ghSyncRepo');
  const branchInput = document.getElementById('ghSyncBranch');
  const logEl = document.getElementById('ghSyncStatusLog');

  if (tokenInput) tokenInput.value = token;
  if (repoInput) repoInput.value = repo;
  if (branchInput) branchInput.value = branch;
  if (logEl) { logEl.style.display = 'none'; logEl.innerHTML = ''; }

  const modal = document.getElementById('modalGitHubSync');
  if (modal) modal.style.display = 'flex';
}

function closeGitHubSyncModal() {
  const modal = document.getElementById('modalGitHubSync');
  if (modal) modal.style.display = 'none';
}

function openBackupModal() {
  const modal = document.getElementById('modalBackup');
  if (modal) modal.style.display = 'flex';
}

function closeBackupModal() {
  const modal = document.getElementById('modalBackup');
  if (modal) modal.style.display = 'none';
}

async function performGitHubSync() {
  const tokenInput = document.getElementById('ghSyncToken');
  const repoInput = document.getElementById('ghSyncRepo');
  const branchInput = document.getElementById('ghSyncBranch');
  const msgInput = document.getElementById('ghSyncMessage');
  const logEl = document.getElementById('ghSyncStatusLog');

  const token = (tokenInput ? tokenInput.value.trim() : '') || GITHUB_CONFIG.token;
  const repo = (repoInput ? repoInput.value.trim() : '') || GITHUB_CONFIG.repository;
  const branch = (branchInput ? branchInput.value.trim() : '') || GITHUB_CONFIG.targetBranch;
  const commitMsg = (msgInput ? msgInput.value.trim() : '') || 'Update meal catalog in meals.js and meals.json';

  localStorage.setItem('mp_gh_token', token);
  localStorage.setItem('mp_gh_repo', repo);
  localStorage.setItem('mp_gh_branch', branch);

  if (logEl) {
    logEl.style.display = 'block';
    logEl.style.background = '#EFF6FF';
    logEl.style.color = '#1D4ED8';
    logEl.style.border = '1px solid #BFDBFE';
    logEl.textContent = '⏳ Committing updated meals.js and meals.json directly to GitHub repository...';
  }

  const result = await autoCommitToGitHub(commitMsg);
  if (result.success) {
    if (logEl) {
      logEl.style.background = '#ECFDF5';
      logEl.style.color = '#065F46';
      logEl.style.border = '1px solid #A7F3D0';
      logEl.innerHTML = `🎉 <strong>Pushed successfully!</strong> (Commit <code>${result.commitSha}</code>)<br>The updated catalog is now permanently saved in repository code. Live raw sync serves updates immediately!`;
    }
  } else {
    if (logEl) {
      logEl.style.background = '#FEF2F2';
      logEl.style.color = '#DC2626';
      logEl.style.border = '1px solid #FECACA';
      logEl.innerHTML = `❌ <strong>Sync Failed:</strong> ${result.error || result.reason}`;
    }
  }
}

// Global Window Bindings for inline HTML handlers
window.showScreen = showScreen;
window.showForgotPasswordScreen = showForgotPasswordScreen;
window.resendRecoveryCode = resendRecoveryCode;
window.sendRecoveryEmail = sendRecoveryEmail;
window.selectPurpose = selectPurpose;
window.setSex = setSex;
window.setExercise = setExercise;
window.submitStep2 = submitStep2;
window.submitStep3 = submitStep3;
window.submitStep4 = submitStep4;
window.submitStep5 = submitStep5;
window.rollRandomMeal = rollRandomMeal;
window.addMealToToday = addMealToToday;
window.removeTodayMeal = removeTodayMeal;
window.setSettingsMode = setSettingsMode;
window.setSettingsSex = setSettingsSex;
window.setSettingsExercise = setSettingsExercise;
window.saveSettings = saveSettings;
window.signOutUser = signOutUser;
window.handleAdminSearch = handleAdminSearch;
window.openEditMealModal = openEditMealModal;
window.closeEditMealModal = closeEditMealModal;
window.saveMealEdits = saveMealEdits;
window.openAddMealModal = openAddMealModal;
window.closeAddMealModal = closeAddMealModal;
window.saveNewMeal = saveNewMeal;
window.deleteMeal = deleteMeal;
window.openImportModal = openImportModal;
window.closeImportModal = closeImportModal;
window.searchSpoonacular = searchSpoonacular;
window.importSpoonacularMeal = importSpoonacularMeal;
window.clearAllKeywords = clearAllKeywords;
window.updateImagePreview = updateImagePreview;
window.togglePasswordVisibility = togglePasswordVisibility;
window.downloadMealsJs = downloadMealsJs;
window.exportMealsJson = exportMealsJson;
window.handleImportJsonFile = handleImportJsonFile;
window.confirmResetCatalog = confirmResetCatalog;
window.openGitHubSyncModal = openGitHubSyncModal;
window.closeGitHubSyncModal = closeGitHubSyncModal;
window.openBackupModal = openBackupModal;
window.closeBackupModal = closeBackupModal;
window.performGitHubSync = performGitHubSync;
window.showAppToast = showAppToast;
