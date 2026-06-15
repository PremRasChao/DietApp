# Nutrition Wize — Claude Session Handoff

## What this app is

**Nutrition Wize** is a React Native / Expo app for a GTA-based dietitian service. It has two parts:

1. **Marketing site** (`app/(marketing)/`) — landing page for the business, Nutrium-inspired premium SaaS aesthetic
2. **Patient app** (`app/(app)/`) — food logging, calorie tracking, appointments dashboard

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Expo SDK 55, `newArchEnabled: true` |
| Routing | Expo Router v3 (file-based) |
| Styling | NativeWind v4 + Tailwind CSS v3 |
| Animations | Moti (replaces framer-motion — does NOT work in RN) |
| Icons | `@expo/vector-icons` → Ionicons |
| SVG | `react-native-svg` (calorie ring) |
| Images | `expo-image` |
| Gradients | `expo-linear-gradient` |
| Fonts | `Inter` (body) + `Fraunces` (display/serif) via `@expo-google-fonts` |
| Backend | Supabase (Postgres + RLS) |
| Food API | USDA FoodData Central (`api.nal.usda.gov/fdc/v1/foods/search`) |

---

## Color Palette (`lib/tokens.ts`)

Current palette — **forest / sage / clay / linen**:

```ts
export const colors = {
  forest: "#2D4A3E",   // dark forest green — primary, buttons, avatar bg
  sage:   "#5A8A78",   // medium sage — secondary accent, carbs
  clay:   "#C44B3A",   // rust/terracotta — fat, italic headline, warnings, CTA red
  linen:  "#EAE4D6",   // warm greige — main app background
  white:  "#FFFFFF",   // pure white — card surfaces
  ink:    "#1C1917",   // near-black — primary text
  stone:  "#6B6560",   // warm gray — secondary text, icons

  // Backward-compat aliases (same names, new values — so old refs still work):
  bone:     "#EAE4D6",  // → linen
  cream:    "#FFFFFF",  // → white
  espresso: "#2D4A3E",  // → forest
  tan:      "#5A8A78",  // → sage
  taupe:    "#6B6560",  // → stone
};

export const macroColors = {
  protein: "#2D4A3E",  // forest green
  carbs:   "#5A8A78",  // sage
  fat:     "#C44B3A",  // clay/rust
};
```

**Never change the palette again without user confirmation.** This is the 3rd and final palette.

---

## File Structure

```
app/
  _layout.tsx                  # Root layout, loads fonts
  index.tsx                    # Redirects → /(marketing)
  (marketing)/
    _layout.tsx
    index.tsx                  # Landing page (NavBar + HeroSection + ServicesGrid + DashboardPreview + DietitianCarousel + CTABand)
  (app)/
    _layout.tsx                # CustomTabBar wired here
    index.tsx                  # Dashboard / home screen
    log.tsx                    # Food log / search screen
    plan.tsx                   # Meal plan tab (stub)
    chat.tsx                   # AI chat tab (stub)
    profile.tsx                # Profile tab (stub)
  (auth)/
    _layout.tsx
    index.tsx                  # Auth screen (stub)

components/
  app/
    CustomTabBar.tsx           # Floating bottom tab bar, center Log button
    AIAssistantCard.tsx
    AppointmentCard.tsx
    ProgressSnapshot.tsx
    RecipeCard.tsx
    StreakCard.tsx
    TopBar.tsx
    TodayPlanCard.tsx
    QuickActionsRow.tsx
  marketing/
    NavBar.tsx                 # Premium nav: N logo, Book Now CTA, hamburger
    HeroSection.tsx            # Two-col: copy left + AppPreviewCard right (desktop)
    DashboardPreview.tsx       # 4 stat cards + food-database table mockup
    ServicesGrid.tsx           # 5 service cards with Ionicons
    DietitianCarousel.tsx
    TestimonialsRow.tsx        # Large quotes, 5-star, author initials
    CTABand.tsx                # Forest bg + Glow overlay, clay buttons
    AppFeatureSection.tsx
    BlogPreview.tsx
    InsuranceChecker.tsx
    WhoWeAre.tsx
    AIChatWidget.tsx
    Footer.tsx
  ui/
    Glow.tsx                   # Cross-platform radial glow (CSS on web, LinearGradient on native)
    AnimatedTabs.tsx           # Moti-powered tab switcher (NOT framer-motion)
    Button.tsx
    Card.tsx
    ThemedText.tsx
    GlassButton.tsx

lib/
  tokens.ts                    # Color palette + macroColors (source of truth)
  mockData.ts                  # All mock data (user, appointments, streak, meals, weekly progress)
  supabase/
    client.ts                  # Supabase client init (reads env vars)
  food/
    openFoodFacts.ts           # USDA FoodData Central API search
    commonFoods.ts             # 60+ local foods + Levenshtein fuzzy search
    foodLog.ts                 # logFood(), getTodayLogs(), deleteLog() via Supabase

hooks/
  useBreakpoint.ts             # isMd breakpoint for responsive layout

global.css                     # Tailwind base + --brand CSS vars + .glow-effect
tailwind.config.js             # All color tokens, font families, keyframes
```

---

## Key Screens

### Home Screen (`app/(app)/index.tsx`)

- Greeting header: "Good morning/evening, [First name]" + bell icon + avatar circle
- **2×2 KPI stat cards**: Calories today (clay icon), Day streak (sage), Protein today (sage), Next session (stone)
- **Calorie ring card**: SVG ring in `colors.forest`, macro bars using `macroColors.protein/carbs/fat`
- **Upcoming session card**: forest avatar, clay date/time text, "View details" forest button
- **Weekly activity bar chart**: today's bar in forest, rest in `#E0DBD2`
- Live data from `getTodayLogs()` via `useFocusEffect`

### Food Log Screen (`app/(app)/log.tsx`)

- **4 macro stat cards** at top: Energy (clay), Protein (forest), Carbs (sage), Fat (clay)
  - Each card has icon in colored bg, value, goal progress bar
- **Search box** — instant local results + USDA after 350ms debounce
- **Food result rows** — name, brand/source, kcal + P/C/F per 100g
- **Meal-grouped today's intake table** — grouped by breakfast/lunch/snack/dinner, swipe-to-delete
- Modal for serving size + meal type selection before logging
- All logs go to Supabase `food_logs` table

### Landing Page (`app/(marketing)/index.tsx`)

Components stacked in order:
1. `NavBar` — N square logo mark, "Book now" + arrow, "Check insurance" ghost, hamburger mobile
2. `HeroSection` — "Real nutrition guidance, *rooted in you.*" (italic in clay), trust avatar row (SC/MR/JL/+), AppPreviewCard on desktop right
3. `ServicesGrid` — 5 service cards
4. `DashboardPreview` — 4 stat tiles + food database table mockup
5. `DietitianCarousel`
6. `TestimonialsRow`
7. `CTABand` — forest bg, Glow overlay, clay/tan buttons
8. `Footer`

---

## Food Search Architecture

Two-layer search — instant feedback + API enrichment:

```
User types
  → immediate: searchLocal(query) from commonFoods.ts
  → after 350ms debounce: searchFood(query) from USDA API
  → merge: API results first, then local results not already in API set
```

### Fuzzy matching (`lib/food/commonFoods.ts`)

- `levenshtein(a, b)` — edit distance, early exit if length diff > 3
- `searchLocal(query)`:
  - 1–2 char queries: word-start matches only (avoids too many results)
  - 3+ char queries: exact substring (100pts) > word-start (80pts) > fuzzy 1-edit (60pts) > fuzzy 2-edit (40pts)
  - Results sorted by score, limited to top 10

### USDA API (`lib/food/openFoodFacts.ts`)

- Endpoint: `https://api.nal.usda.gov/fdc/v1/foods/search`
- Key env var: `EXPO_PUBLIC_USDA_KEY` (in `.env`, **never committed**)
- Nutrient IDs: 1008=kcal, 1003=protein, 1005=carbs, 1004=fat
- Filters out 0-kcal and >900 kcal/100g results
- In-memory cache per query string
- All values normalized to per 100g by USDA

---

## Backend (Supabase)

- **Table**: `food_logs`
  - `id` uuid PK
  - `user_id` uuid (placeholder: `00000000-0000-0000-0000-000000000001` until auth wired)
  - `food_name` text
  - `brand` text nullable
  - `kcal` int
  - `protein_g` numeric
  - `carbs_g` numeric
  - `fat_g` numeric
  - `serving_g` int
  - `meal_type` text nullable (`breakfast | lunch | snack | dinner`)
  - `logged_at` timestamptz
- **RLS**: permissive (all reads/writes allowed) for dev — must be tightened before prod
- **Client**: reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `.env`

---

## Environment Variables (`.env` — NEVER commit this file)

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_USDA_KEY=...
```

**Security rule**: Never print, commit, or share these values. The `.env` file is gitignored.

---

## Fonts

Loaded in `app/_layout.tsx` via `useFonts`:

| Variable name | Font |
|---|---|
| `Inter_400Regular` | Body regular |
| `Inter_500Medium` | Body medium |
| `Inter_600SemiBold` | Body semibold |
| `Inter_700Bold` | Body bold |
| `Fraunces_300Light` | Display light |
| `Fraunces_700Bold` | Display bold |
| `Fraunces_700Bold_Italic` | Display bold italic (used for "rooted in you.") |

Always use `fontFamily: "Inter_700Bold"` style — NOT `fontWeight: "bold"` (breaks on native).

---

## Cross-Platform Notes

- **Web** (`Platform.OS === 'web'`): CSS `backgroundImage` works, `layoutId` (framer-motion) does NOT — use moti
- **Native**: `expo-linear-gradient` for gradients, `react-native-svg` for rings, moti for animations
- `AnimatedTabs.tsx` uses `MotiView` with `animate={{ opacity }}` — no `layoutId`
- `Glow.tsx`: web → CSS `radial-gradient` via `@ts-ignore`; native → `LinearGradient`
- Responsive layout via `useBreakpoint` hook → `isMd` breakpoint

---

## Git / GitHub

- **Repo**: `PremRasChao` GitHub account
- **Main branch**: `main`
- **Current branch**: `nutrium-redesign` (all current work lives here)
- **Commits so far**:
  - `ebda1d7` — Nutrium-inspired redesign: new forest/sage/clay palette, dashboard, food log
  - `a86b745` — UI polish: log redesign, Glow, AnimatedTabs, fuzzy search, warm bg
  - `aa1c292` — Add calorie tracker: food search, logging, dashboard integration
  - `2e978c2` — Visual redesign: unified cream/bone palette
  - `ef81a73` — Initial commit

---

## Pending / Known Issues

1. **Auth not wired** — all Supabase calls use placeholder user ID `00000000-0000-0000-0000-000000000001`. When auth is added, replace `PLACEHOLDER_USER_ID` in `lib/food/foodLog.ts`.
2. **RLS is permissive** — must add proper row-level security before production.
3. **Stub screens** — `plan.tsx`, `chat.tsx`, `profile.tsx` are empty placeholders.
4. **No real dietitian data** — all names/photos are `[Placeholder]` strings from `lib/mockData.ts`.
5. **USDA DEMO_KEY fallback** — if `EXPO_PUBLIC_USDA_KEY` is missing, falls back to `DEMO_KEY` (rate-limited).

---

## Running Locally

```bash
# Install
npm install

# Start web
npx expo start --web --port 8083

# Start mobile (Expo Go)
npx expo start
```

Requires `.env` file in root with the three env vars above (get from Supabase dashboard + USDA API portal).

---

## Style Rules (from CLAUDE.md)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER save working files or tests to root — use `/src`, `/tests`, `/docs`, `/config`, `/scripts`
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or `.env` files
- Keep files under 500 lines
- Validate input at system boundaries only
