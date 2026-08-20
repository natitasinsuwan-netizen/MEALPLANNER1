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

// Initialize Meals Database (Load from localStorage if updated, otherwise use DEFAULT_MEALS)
const savedMeals = localStorage.getItem('mp_all_meals') || localStorage.getItem('mp_custom_meals');
if (savedMeals) {
  try {
    const parsed = JSON.parse(savedMeals);
    if (Array.isArray(parsed) && parsed.length > 0) {
      INITIAL_MEALS = parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored meals:", e);
  }
}

// Helper: Save all meals to localStorage
function persistMeals() {
  localStorage.setItem('mp_all_meals', JSON.stringify(INITIAL_MEALS));
  localStorage.setItem('mp_custom_meals', JSON.stringify(INITIAL_MEALS));
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
    'screenLogin', 'screenRegister', 'screenPurpose', 
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
      currentUserEmail = regEmailInput ? (regEmailInput.value.trim() || 'user@example.com') : 'user@example.com';
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
    // Find absolute index in INITIAL_MEALS
    const actualIndex = INITIAL_MEALS.indexOf(meal);
    
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
        <button class="btn-icon-edit" onclick="openEditMealModal(${actualIndex})" title="Edit meal details">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn-icon-delete" onclick="deleteMeal(${actualIndex})" title="Delete meal">
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
function openEditMealModal(index) {
  const meal = INITIAL_MEALS[index];
  if (!meal) return;

  document.getElementById('editMealIndex').value = index;
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
  const index = parseInt(document.getElementById('editMealIndex').value);
  if (isNaN(index) || !INITIAL_MEALS[index]) return;

  const meal = INITIAL_MEALS[index];

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

  persistMeals();
  closeEditMealModal();

  // Refresh Views
  if (adminSearchQuery) {
    handleAdminSearch(adminSearchQuery);
  } else {
    renderAdminMealsList();
  }
  renderDashboard();

  alert(`Successfully updated "${meal.name}"!`);
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
  persistMeals();

  document.getElementById('formAddMeal').reset();
  closeAddMealModal();

  renderAdminMealsList();
  renderDashboard();

  alert(`"${newMeal.name}" has been added to the catalog!`);
}

// Delete Meal from Catalog
function deleteMeal(index) {
  const meal = INITIAL_MEALS[index];
  if (!meal) return;

  if (confirm(`Are you sure you want to delete "${meal.name}" from the catalog?`)) {
    INITIAL_MEALS.splice(index, 1);
    persistMeals();

    if (adminSearchQuery) {
      handleAdminSearch(adminSearchQuery);
    } else {
      renderAdminMealsList();
    }
    renderDashboard();
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
  persistMeals();
  closeImportModal();

  renderAdminMealsList();
  renderDashboard();

  alert(`Successfully imported "${name}" into the meal catalog!`);
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
  if (loginPass) loginPass.value = '';

  showScreen('screenLogin');
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

// Global Window Bindings for inline HTML handlers
window.showScreen = showScreen;
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
