# Nutrition Wize — Claude Session Handoff

**Last updated:** 2026-07-14  
**Current branch:** `feature/meals-tab-recipes`  
**GitHub:** `PremRasChao/DietApp`  
**Main branch:** `main`

---

## What this app is

**Nutrition Wize** is a React Native / Expo app for a GTA-based dietitian service. It has three parts:

1. **Marketing site** (`app/(marketing)/`) — landing page for the business, Nutrium-inspired premium SaaS aesthetic
2. **Auth flow** (`app/(auth)/`) — role selection, patient sign-in, dietitian verification + sign-in
3. **Patient app** (`app/(app)/`) — food logging, calorie tracking, meal planning, appointments dashboard

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Expo SDK 55, `newArchEnabled: true` |
| Routing | Expo Router v3 (file-based) |
| Styling | NativeWind v4 + Tailwind CSS v3 |
| Animations | Moti (NOT framer-motion — does not work in RN) |
| Icons | `@expo/vector-icons` → Ionicons |
| SVG | `react-native-svg` (calorie ring) |
| Images | `expo-image` |
| Gradients | `expo-linear-gradient` |
| Fonts | `Inter` (body) + `Fraunces` (display/serif) via `@expo-google-fonts` |
| Backend | Supabase (Postgres + RLS + Auth) |
| Auth — native Google | `@react-native-google-signin/google-signin` |
| Auth — Apple | `expo-apple-authentication` (iOS only) |
| Auth — web Google | Supabase OAuth (`signInWithOAuth`) |
| Auth tokens | `expo-secure-store` (native) / `localStorage` (web, SSR-safe) |
| Food API 1 | USDA FoodData Central |
| Food API 2 | Spoonacular (100/day limit) |
| Food API 3 | TheMealDB (free fallback for recipes) |

---

## Color Palette — NEVER CHANGE WITHOUT USER CONFIRMATION

This is the **3rd and final** palette. Do not change it.

```ts
// lib/tokens.ts
forest: "#2D4A3E"   // dark forest green — primary buttons, avatar bg
sage:   "#5A8A78"   // medium sage — secondary accent, carbs
clay:   "#C44B3A"   // rust/terracotta — fat, warnings, CTA red
linen:  "#EAE4D6"   // warm greige — main app background
white:  "#FFFFFF"   // pure white — card surfaces
ink:    "#1C1917"   // near-black — primary text
stone:  "#6B6560"   // warm gray — secondary text

macroColors.protein: "#2D4A3E"  // forest
macroColors.carbs:   "#5A8A78"  // sage
macroColors.fat:     "#C44B3A"  // clay
```

Font rules:
- **Always** use `fontFamily: "Inter_700Bold"` — never `fontWeight: "bold"` (breaks on native)
- Display headings: `Fraunces_700Bold` or `Fraunces_700Bold_Italic`

---

## File Structure

```
app/
  index.tsx                    # Smart root: checks session → (app) or (marketing)
  _layout.tsx                  # Root layout: loads fonts, calls configureGoogleSignin()
  (marketing)/
    _layout.tsx
    index.tsx                  # Landing page (NavBar + HeroSection + ... + Footer)
  (auth)/
    _layout.tsx                # Stack, no header
    index.tsx                  # ROLE SELECTION: "Patient" or "Dietitian" cards
    patient.tsx                # Patient Google + Apple sign-in
    dietitian-code.tsx         # Dietitian ID entry + Supabase RPC verification
    dietitian-login.tsx        # Dietitian Google + Apple sign-in (after ID verified)
  (app)/
    _layout.tsx                # Session guard → redirects to (auth) if no session; Tab bar
    index.tsx                  # Dashboard / home screen
    log.tsx                    # Food log / search screen
    plan.tsx                   # Meals tab: Foods, Recipes, Equivalents, Templates
    chat.tsx                   # AI chat tab (stub)
    profile.tsx                # Profile tab (stub)

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
  auth/
    GoogleSignInButton.tsx         # TypeScript fallback (Metro uses .native/.web)
    GoogleSignInButton.native.tsx  # Native: @react-native-google-signin SDK
    GoogleSignInButton.web.tsx     # Web: supabase.auth.signInWithOAuth
    AppleSignInButton.tsx          # iOS only (returns null on Android/web)
  marketing/
    NavBar.tsx, HeroSection.tsx, DashboardPreview.tsx, ServicesGrid.tsx,
    DietitianCarousel.tsx, TestimonialsRow.tsx, CTABand.tsx,
    AppFeatureSection.tsx, BlogPreview.tsx, InsuranceChecker.tsx,
    WhoWeAre.tsx, AIChatWidget.tsx, Footer.tsx
  ui/
    Glow.tsx                   # Cross-platform radial glow (CSS web, LinearGradient native)
    AnimatedTabs.tsx           # Moti-powered tab switcher
    Button.tsx, Card.tsx, ThemedText.tsx, GlassButton.tsx

lib/
  tokens.ts                    # Color palette + macroColors (source of truth)
  mockData.ts                  # 15 mock recipes, 4 plan meals, 8 meal templates, user data
  rateLimit.ts                 # In-memory daily counters: spoonacular(100), usda(500), mealdb(200)
  auth/
    useSession.ts              # useSession() hook → { session, loading }
    googleSignin.ts            # Web: no-op export
    googleSignin.native.ts     # Native: GoogleSignin.configure() with env vars
    pendingRole.ts             # Module-level store for role selected before sign-in
    dietitianRateLimit.ts      # Rate limiter: 5 attempts / 15 min for dietitian code entry
  supabase/
    client.ts                  # Supabase client, SecureStore on native / localStorage web
  food/
    openFoodFacts.ts           # USDA FoodData Central API search
    commonFoods.ts             # 60+ local foods + Levenshtein fuzzy search
    foodLog.ts                 # logFood(), getTodayLogs(), deleteLog() — uses real auth.getUser()
    spoonacular.ts             # searchRecipes() with addRecipeInformation=true embedded
    mealdb.ts                  # searchMealDB(), getRecipeDetailsByName(), getRandomMeals()

hooks/
  useBreakpoint.ts             # isMd breakpoint for responsive layout

supabase/
  migrations/
    20260712_auth_setup.sql    # dietitian_codes table + verify_dietitian_code() RPC + profiles

global.css                     # Tailwind base + --brand CSS vars + .glow-effect
tailwind.config.js             # All color tokens, font families, keyframes
```

---

## Authentication Flow

### Architecture
```
app/index.tsx
  ├── session present → /(app)
  └── no session → /(marketing)

/(auth)/index.tsx  [Role Selection]
  ├── "I'm a Patient" → /(auth)/patient
  │     └── Google / Apple sign-in → updateUser({ role: 'patient' }) → /(app)
  └── "I'm a Dietitian" → /(auth)/dietitian-code
        └── Enter code → supabase.rpc('verify_dietitian_code') → /(auth)/dietitian-login
              └── Google / Apple sign-in → updateUser({ role: 'dietitian' }) → /(app)

/(app)/_layout.tsx  [Session Guard]
  ├── loading → spinner
  ├── no session → Redirect to /(auth)
  └── session → show Tabs
```

### Web OAuth Flow (Google on web)
1. User picks role → `setPendingRole(role)` stored in module memory
2. `GoogleSignInButton.web.tsx` saves role to `sessionStorage.__pendingRole` before redirect
3. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`
4. Browser goes to Google → user authorizes → browser returns to `app/index.tsx`
5. `app/index.tsx` reads `sessionStorage.__pendingRole`, calls `updateUser({ data: { role } })`, navigates to `/(app)`

### Native OAuth Flow (Google/Apple on iOS/Android)
1. User picks role → `setPendingRole(role)` stored in module memory
2. Sign-in button calls native SDK → success → fires `onSuccess` callback
3. Parent screen calls `supabase.auth.updateUser({ data: { role } })` → navigates to `/(app)`

### Dietitian Code Security
- Codes stored in `dietitian_codes` table with RLS blocking all direct client access
- `verify_dietitian_code(p_code)` is a SECURITY DEFINER function — only it can query the table
- Client only gets `true`/`false` — never sees the table data
- In-memory rate limiter: 5 failed attempts → 15-minute lockout
- Input sanitized: 4-32 chars, alphanumeric + hyphens only, lowercased before RPC call
- To add a dietitian code: `insert into public.dietitian_codes (code) values ('DT-12345');`

---

## Environment Variables (`.env` — NEVER commit)

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_USDA_KEY=your-usda-key
EXPO_PUBLIC_SPOONACULAR_KEY=490d82dca2dc4b21a50940f1c4d43608
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com   ← STILL NEEDED
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxx.apps.googleusercontent.com   ← STILL NEEDED
```

**The two Google Client IDs are not yet set.** The user needs to:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create a **Web application** OAuth client → copy Client ID → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
3. Create an **iOS** OAuth client (Bundle ID: `com.dietapp`) → copy Client ID → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
4. Add to Supabase dashboard → Auth → URL Configuration → Redirect URLs:
   - `http://localhost:8083` (dev)
   - Production URL when deployed

---

## Supabase Setup

Run `supabase/migrations/20260712_auth_setup.sql` in the Supabase SQL editor. It creates:
- `dietitian_codes` table (admin-managed, RLS blocks all client access)
- `verify_dietitian_code(text)` RPC function
- `profiles` table with `role` column (`patient` | `dietitian`)
- Trigger `on_auth_user_created` → auto-creates profile row on sign-up

**food_logs table** (pre-existing, created manually):
```sql
id uuid PK, user_id uuid, food_name text, brand text,
kcal int, protein_g numeric, carbs_g numeric, fat_g numeric,
serving_g int, meal_type text, logged_at timestamptz
```
RLS is currently **permissive** (dev mode). Needs proper user-scoped policy before prod.

---

## Key Screens

### Home (`app/(app)/index.tsx`)
- Greeting + bell + avatar
- 2×2 KPI cards: Calories today, Day streak, Protein today, Next session
- Calorie ring (SVG, `colors.forest`)
- Macro progress bars (protein=forest, carbs=sage, fat=clay)
- Upcoming session card + Weekly activity bar chart
- Live data from `getTodayLogs()` via `useFocusEffect`

### Food Log (`app/(app)/log.tsx`)
- 4 macro stat cards at top (Energy/clay, Protein/forest, Carbs/sage, Fat/clay)
- Search box — instant local + USDA after 350ms debounce
- Food result rows with kcal + P/C/F per 100g
- Meal-grouped today's intake table, swipe-to-delete
- Modal: serving size + meal type before logging
- Logs go to Supabase `food_logs` table using real `auth.getUser()` ID

### Meals Tab (`app/(app)/plan.tsx`)
4 sub-tabs via `AnimatedTabs`:

**Foods** — USDA food search + log button

**Recipes** — 
- Module-level `featuredCache` (persists across tab switches)
- `detailsCache: Map<string, RecipeDetails | false>` for recipe details
- `RecipeDetailModal` with fallback chain:
  1. Embedded data from Spoonacular `complexSearch` (`addRecipeInformation=true`)
  2. Cache hit
  3. Spoonacular `getRecipeDetails(id)` by numeric ID
  4. TheMealDB `getRecipeDetailsByName(name)` (free fallback)
  5. "Not available" message
- `chunk<T>()` helper for explicit 2-column grid (avoids flexWrap web issues)

**Equivalents** — Carb equivalents per meal (Spoonacular powered)

**Templates** — 8 meal templates, "Generate" creates a full day plan

### Marketing Landing (`app/(marketing)/index.tsx`)
NavBar → HeroSection → ServicesGrid → DashboardPreview → DietitianCarousel → TestimonialsRow → CTABand → Footer

---

## Food Search Architecture

```
User types
  → immediate: searchLocal(query) from commonFoods.ts (60+ foods, Levenshtein fuzzy)
  → after 350ms debounce: searchFood(query) from USDA API
  → merge: API results first, then local not already in API set
```

Scoring: exact substring (100pts) > word-start (80pts) > fuzzy 1-edit (60pts) > fuzzy 2-edit (40pts)

---

## app.json Key Config

```json
{
  "ios": { "bundleIdentifier": "com.dietapp", "usesAppleSignIn": true },
  "android": { "package": "com.dietapp" },
  "scheme": "dietapp",
  "plugins": [
    "expo-router", "expo-secure-store", "expo-web-browser",
    ["@react-native-google-signin/google-signin", {
      "iosUrlScheme": "com.googleusercontent.apps.680408975155-vhgcv3hb1bfn7rmjufhl8vk10k5ivp6p"
    }]
  ]
}
```

---

## Git History

```
cb7ae5f  Add full authentication flow: role selection, patient & dietitian sign-in
0f43f3f  Add Meals tab: Foods, Recipes, Equivalents, Templates with full recipe details
58432ee  Add session handoff document with full project context
ebda1d7  Nutrium-inspired redesign: new forest/sage/clay palette, dashboard, food log
a86b745  UI polish: log redesign, Glow, AnimatedTabs, fuzzy search, warm bg
aa1c292  Add calorie tracker: food search, logging, dashboard integration
ef81a73  Initial commit
```

---

## Known Issues / Pending Work

1. **Google Sign-In not functional yet** — `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` not in `.env`. User is in the process of creating OAuth credentials in Google Cloud Console.

2. **Apple Sign-In** — requires a physical iOS device or TestFlight. Works only with `expo run:ios` (not Expo Go or web).

3. **RLS on food_logs** — currently permissive (all reads/writes allowed). Needs user-scoped policy before production:
   ```sql
   create policy "users_own_logs" on food_logs
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```

4. **chat.tsx and profile.tsx** — empty stubs. Chat is meant to be an AI nutrition assistant. Profile should show user info + sign-out button.

5. **Sign-out button** — not yet added anywhere. Add to profile.tsx:
   ```tsx
   await supabase.auth.signOut();
   router.replace('/(auth)');
   ```

6. **Typed routes** — new auth routes (`/(auth)/patient`, `/dietitian-code`, `/dietitian-login`) not yet in `.expo/types/router.d.ts`. Will auto-regenerate on next `npx expo start`. Currently worked around with `as any` casts on those 3 router.push calls.

7. **Marketing page has no "Sign In" button** — users can't navigate from the landing page to the auth flow without manually going to `/(auth)`. A "Get Started" button in NavBar / CTABand should link there.

8. **No Android Google Sign-In tested** — requires a physical Android device with `expo run:android`. The Google Play Services check is handled in `GoogleSignInButton.native.tsx`.

---

## Running Locally

```bash
# Install
npm install

# Start web (already running on port 8083 as of last session)
npx expo start --web --port 8083

# iOS (physical device required for Apple Sign-In)
npx expo run:ios

# Android
npx expo run:android
```

**Security rule (never break):**
- NEVER commit `.env`, secrets, or credentials
- NEVER change the color palette without user confirmation
- NEVER commit `.env` — it is gitignored

---

## Style Rules (from CLAUDE.md)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation unless explicitly requested
- ALWAYS read a file before editing it
- Keep files under 500 lines
- Validate input at system boundaries only
- No comments unless the WHY is non-obvious
- Always use `fontFamily: "Inter_700Bold"` — never `fontWeight: "bold"`
- Moti for animations — never framer-motion
- `chunk<T>()` helper for 2-column grids — never `flexWrap: "wrap"` with percentages on web
