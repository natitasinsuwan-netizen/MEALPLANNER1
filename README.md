# 🥗 MEALPLANNER1 — Smart Meal Planner & Admin Web App

A warm, responsive web application designed for smart meal planning, automated daily energy tracking (BMR & TDEE formulas), allergy/dietary preference filtering, random meal recommendations, and **Full Admin Catalog Management**.

Repository Target: [natitasinsuwan-netizen/MEALPLANNER1](https://github.com/natitasinsuwan-netizen/MEALPLANNER1)

---

## 🚀 Live Local Application Link

When running the local server:
👉 **[http://localhost:8094](http://localhost:8094)**

---

## ✨ Features & Functionality

### 1. 🛡️ Dedicated Admin Screen (`natitasinsuwan@gmail.com`)
- When signed in with the administrator account (`natitasinsuwan@gmail.com`), the **Admin** navigation tab (with shield icon) is automatically activated in the bottom navigation bar.
- **Admin Capabilities**:
  - 📋 **Catalog View**: Displays all meals in the catalog (68 authentic dishes across Thai, Japanese, Korean, Italian, Mexican, American, Chinese, Indian, Vietnamese, and European cuisines).
  - 🔍 **Real-Time Search**: Instant search filtering by meal name, keywords, country, or protein.
  - ➕ **Add New Meals (`+ New ...`)**: Comprehensive form allowing the admin to create new meals with custom images, descriptions, calories, macros (fat, protein, carbs), cooking methods, allergens, and dietary tags.
  - ✏️ **Edit Everything**: Ability to edit every single field for any meal in the catalog.
  - 🗑️ **Delete**: Remove dishes from the database catalog with confirmation.
  - 🥄 **Spoonacular API Search & Import (`Import...`)**: Search online recipes from Spoonacular and import them directly into the catalog.

### 2. 🎯 Energy Target Calculation (BMR vs TDEE)
- **Diet Planning Mode**: Uses Mifflin–St Jeor formula to compute **BMR**.
  $$\text{BMR} = (10 \times \text{weight}_{\text{kg}}) + (6.25 \times \text{height}_{\text{cm}}) - (5 \times \text{age}_{\text{years}}) + S$$
  - Male: $S = +5$
  - Female: $S = -161$
- **Random Meal Mode**: Uses **TDEE** ($\text{BMR} \times \text{Activity Factor}$).
- **Activity Multipliers ($0 \dots 7$ Workout Days/Week)**:
  - 0–1 days (Sedentary): `1.2`
  - 2 days (Lightly Active): `1.375`
  - 3–4 days (Moderately Active): `1.55`
  - 5–6 days (Very Active): `1.725`
  - 7 days (Super Active): `1.9`
- **Energy Tracking**:
  $$\text{Remaining Calories} = \text{Target Calories} - \text{Consumed Today}$$

### 3. 🕛 Automatic Midnight New Day Reset
- Automatically resets logged meals and consumed calories at midnight daily, with a manual `Reset Day` option.

### 4. 🛡️ Allergy & Dietary Preference Safety Filters
- Filters out recipes containing user allergies (`Nuts`, `Dairy`, `Gluten`, `Shellfish`, `Egg`, `Soy`, `Fish`, `Sesame`) and honors dietary preferences (`Vegetarian`, `Vegan`, `Gluten-Free`, `Dairy-Free`, `Halal`, `Kosher`).

---

## 📂 File Structure

```
├── index.html     # Responsive Single-Page Application (SPA) HTML layout, CSS tokens & Admin screens
├── app.js         # Core application logic, Admin controls, Edit Everything modals, Spoonacular API
├── meals.js       # Database of 68 diverse meals (automatically rewritten on admin edits)
├── server.py      # Zero-dependency Python server with permanent disk persistence for meals.js
├── backend/       # FastAPI backend for Docker container & Railway cloud deployments
│   ├── main.py
│   └── requirements.txt
├── Dockerfile     # Container deployment configuration
└── README.md      # Project documentation
```

---

## 💻 How to Run Locally

### Option 1: Persistent Server (Recommended)
Automatically persists all Admin edits directly into `meals.js` on disk:
```bash
python server.py 8094
```
Then open: **http://localhost:8094** in your browser.

### Option 2: Docker / Railway Container
```bash
docker build -t mealplanner1 .
docker run -p 8080:8080 mealplanner1
```

---

## 💾 Permanent Saving for Admin Menu Edits

When logged into the Admin Account (`natitasinsuwan@gmail.com`):
1. **Local & Server Mode**: All edits (updating dishes, adding new meals, deletions) are sent via `POST /api/meals` and **written directly to `meals.js` on disk**. All sessions, devices, and git tracking reflect the permanent change.
2. **GitHub Pages Mode (`*.github.io`)**:
   - **Export meals.js**: Click `Export meals.js` in the Admin screen to instantly download the generated `meals.js` file to replace in your repository.
   - **GitHub 1-Click Sync**: Configure your GitHub token in the Admin screen (`GitHub Sync`) to commit and push updated meals directly to GitHub `main` branch with zero command-line steps!
   - **Backup & Restore**: Export or import the catalog as clean JSON anytime.

