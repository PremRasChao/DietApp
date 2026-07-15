// Mock data — uses only literal placeholder names per naming rule

export const mockUser = {
  firstName: "[First name]",
  avatar: null as null | string,
};

export const mockMeals = [
  {
    id: "breakfast",
    label: "Breakfast",
    name: "Greek Yogurt Parfait",
    kcal: 320,
    checked: true,
    thumbnail: null as null | string,
  },
  {
    id: "lunch",
    label: "Lunch",
    name: "Grilled Chicken & Quinoa",
    kcal: 520,
    checked: false,
    thumbnail: null as null | string,
  },
  {
    id: "snack",
    label: "Snack",
    name: "Apple & Almond Butter",
    kcal: 180,
    checked: false,
    thumbnail: null as null | string,
  },
  {
    id: "dinner",
    label: "Dinner",
    name: "Salmon with Roasted Veg",
    kcal: 620,
    checked: false,
    thumbnail: null as null | string,
  },
];

export const mockDietitians = [
  {
    id: "1",
    name: "[Dietitian name]",
    specializations: ["Weight Management", "Diabetes Care"],
    languages: ["English", "French"],
    photo: null as null | string,
  },
  {
    id: "2",
    name: "[Dietitian name]",
    specializations: ["Pediatric Nutrition", "Eating Disorders"],
    languages: ["English", "Punjabi"],
    photo: null as null | string,
  },
  {
    id: "3",
    name: "[Dietitian name]",
    specializations: ["Cultural Meal Planning", "Weight Management"],
    languages: ["English", "Mandarin"],
    photo: null as null | string,
  },
  {
    id: "4",
    name: "[Dietitian name]",
    specializations: ["Diabetes Care", "Sports Nutrition"],
    languages: ["English", "Spanish"],
    photo: null as null | string,
  },
];

export const mockTestimonials = [
  {
    id: "1",
    quote:
      "Working with my dietitian completely changed how I think about food. I've lost 18 lbs and have so much more energy.",
    attribution: "[First name], [Neighborhood]",
  },
  {
    id: "2",
    quote:
      "The cultural meal planning service was exactly what I needed. My dietitian understood my heritage and helped me eat healthier.",
    attribution: "[First name], [Neighborhood]",
  },
  {
    id: "3",
    quote:
      "My son's eating disorder required expert guidance. Nutrition Wize gave us a compassionate, evidence-based plan.",
    attribution: "[First name], [Neighborhood]",
  },
];

export const mockBlogPosts = [
  {
    id: "1",
    title: "5 High-Protein Breakfasts for Busy Mornings",
    excerpt:
      "Start your day with energy that lasts. Our registered dietitians share their favourite quick-prep meals.",
    date: "May 8, 2026",
    category: "Meal Planning",
    thumbnail: null as null | string,
  },
  {
    id: "2",
    title: "Understanding the Glycemic Index for Diabetes Management",
    excerpt:
      "Making sense of blood sugar impact can feel overwhelming — here's a plain-language guide from our team.",
    date: "May 2, 2026",
    category: "Diabetes Care",
    thumbnail: null as null | string,
  },
  {
    id: "3",
    title: "How to Meal Prep for a Multi-Cultural Household",
    excerpt:
      "Balancing flavours, textures, and nutritional needs across cultural preferences is easier than you think.",
    date: "April 25, 2026",
    category: "Cultural Nutrition",
    thumbnail: null as null | string,
  },
];

export const mockServices = [
  {
    id: "weight",
    title: "Weight Management",
    description:
      "Personalised, evidence-based plans that go beyond calorie counting to support lasting lifestyle change.",
    icon: "⚖️",
  },
  {
    id: "diabetes",
    title: "Diabetes Care",
    description:
      "Expert guidance for Type 1, Type 2, and pre-diabetes — including carb counting and blood sugar strategies.",
    icon: "🩺",
  },
  {
    id: "pediatric",
    title: "Pediatric Nutrition",
    description:
      "Age-appropriate nutrition support for children and teens, with family-centred meal planning.",
    icon: "🧒",
  },
  {
    id: "eating-disorder",
    title: "Eating Disorder Support",
    description:
      "Compassionate, non-diet care for anorexia, bulimia, ARFID, and disordered eating patterns.",
    icon: "💙",
  },
  {
    id: "cultural",
    title: "Cultural Meal Planning",
    description:
      "Nutrition guidance that respects and celebrates your cultural food traditions across 20+ cuisines.",
    icon: "🌍",
  },
];

export const mockInsuranceProviders = [
  "Sun Life",
  "Manulife",
  "Canada Life",
  "GreenShield",
  "Blue Cross",
];

export const mockAppointment = {
  dietitianName: "[Dietitian name]",
  dietitianPhoto: null as null | string,
  date: "Thursday, May 15, 2026",
  time: "2:30 PM",
  type: "Video call",
  isWithin15Min: false,
};

export const mockStreak = {
  count: 12,
  nextMilestone: 14,
};

export const mockRecipe = {
  title: "Chickpea & Spinach Curry",
  description: "A fragrant, plant-based dish inspired by South Asian cuisine.",
  kcal: 410,
  prepTime: "25 min",
  tags: ["Vegan", "High Protein", "Gluten-Free"],
  thumbnail: null as null | string,
};

export const mockWeeklyProgress = [
  { day: "Mon", kcal: 1850 },
  { day: "Tue", kcal: 2100 },
  { day: "Wed", kcal: 1950 },
  { day: "Thu", kcal: 2200 },
  { day: "Fri", kcal: 1800 },
  { day: "Sat", kcal: 2050 },
  { day: "Sun", kcal: 1920 },
];

export const CALORIE_GOAL = 2000;

// ── Meal-plan data ─────────────────────────────────────────────────────────────

export type Recipe = {
  id: string; name: string; cuisine: string; tags: string[];
  kcal: number; protein_g: number; carbs_g: number; fat_g: number; prepTime: string;
};

export const mockRecipes: Recipe[] = [
  { id: "r1",  name: "Chicken Tikka Masala",      cuisine: "Indian",     tags: ["High Protein", "Gluten-Free"],    kcal: 380, protein_g: 35, carbs_g: 18, fat_g: 14, prepTime: "30 min" },
  { id: "r2",  name: "Japanese Miso Salmon",        cuisine: "Japanese",   tags: ["Omega-3", "Low Carb"],            kcal: 420, protein_g: 40, carbs_g: 8,  fat_g: 22, prepTime: "20 min" },
  { id: "r3",  name: "Mexican Black Bean Bowl",     cuisine: "Mexican",    tags: ["Vegan", "High Fibre"],            kcal: 460, protein_g: 18, carbs_g: 62, fat_g: 12, prepTime: "15 min" },
  { id: "r4",  name: "Greek Chicken Souvlaki",      cuisine: "Greek",      tags: ["High Protein", "Mediterranean"],  kcal: 340, protein_g: 38, carbs_g: 12, fat_g: 10, prepTime: "25 min" },
  { id: "r5",  name: "Pad Thai with Tofu",          cuisine: "Thai",       tags: ["Vegetarian", "High Carb"],        kcal: 520, protein_g: 22, carbs_g: 68, fat_g: 16, prepTime: "20 min" },
  { id: "r6",  name: "Moroccan Lentil Soup",        cuisine: "Moroccan",   tags: ["Vegan", "High Fibre"],            kcal: 310, protein_g: 16, carbs_g: 48, fat_g: 6,  prepTime: "35 min" },
  { id: "r7",  name: "Korean Bibimbap",             cuisine: "Korean",     tags: ["Balanced", "High Protein"],       kcal: 490, protein_g: 28, carbs_g: 58, fat_g: 14, prepTime: "30 min" },
  { id: "r8",  name: "Brazilian Açaí Bowl",         cuisine: "Brazilian",  tags: ["Antioxidants", "Vegetarian"],     kcal: 380, protein_g: 8,  carbs_g: 54, fat_g: 16, prepTime: "10 min" },
  { id: "r9",  name: "Italian Tuna Pasta",          cuisine: "Italian",    tags: ["High Protein", "Mediterranean"],  kcal: 440, protein_g: 32, carbs_g: 52, fat_g: 10, prepTime: "15 min" },
  { id: "r10", name: "Ethiopian Injera Platter",    cuisine: "Ethiopian",  tags: ["Vegan", "High Fibre"],            kcal: 420, protein_g: 18, carbs_g: 64, fat_g: 10, prepTime: "45 min" },
  { id: "r11", name: "Lebanese Lemon Chicken",      cuisine: "Lebanese",   tags: ["High Protein", "Low Carb"],       kcal: 360, protein_g: 42, carbs_g: 6,  fat_g: 18, prepTime: "25 min" },
  { id: "r12", name: "Vietnamese Pho",              cuisine: "Vietnamese", tags: ["Low Fat", "High Protein"],        kcal: 290, protein_g: 26, carbs_g: 32, fat_g: 4,  prepTime: "40 min" },
  { id: "r13", name: "Peruvian Quinoa Salad",       cuisine: "Peruvian",   tags: ["Vegan", "High Protein"],          kcal: 350, protein_g: 14, carbs_g: 46, fat_g: 12, prepTime: "15 min" },
  { id: "r14", name: "Turkish Lentil Köfte",        cuisine: "Turkish",    tags: ["Vegan", "High Fibre"],            kcal: 330, protein_g: 15, carbs_g: 50, fat_g: 8,  prepTime: "20 min" },
  { id: "r15", name: "Canadian Maple Oat Porridge", cuisine: "Canadian",   tags: ["High Fibre", "Breakfast"],        kcal: 320, protein_g: 10, carbs_g: 56, fat_g: 6,  prepTime: "10 min" },
];

export type PlanMeal = {
  id: string; name: string; meal_type: string;
  kcal: number; protein_g: number; carbs_g: number; fat_g: number;
};

export const mockPlanMeals: PlanMeal[] = [
  { id: "pm1", name: "Oatmeal with Berries",   meal_type: "Breakfast", kcal: 300, protein_g: 8,  carbs_g: 54, fat_g: 5  },
  { id: "pm2", name: "Grilled Chicken Salad",  meal_type: "Lunch",     kcal: 450, protein_g: 42, carbs_g: 18, fat_g: 16 },
  { id: "pm3", name: "Greek Yogurt & Almonds", meal_type: "Snack",     kcal: 200, protein_g: 14, carbs_g: 16, fat_g: 8  },
  { id: "pm4", name: "Salmon & Sweet Potato",  meal_type: "Dinner",    kcal: 580, protein_g: 38, carbs_g: 44, fat_g: 18 },
];

export type MealTemplate = {
  id: string; name: string; description: string; tags: string[];
  kcal: number; fatPct: number; carbsPct: number; proteinPct: number;
};

// ── Dietitian dashboard data ───────────────────────────────────────────────────

export const mockDietitian = {
  firstName: "[Dietitian name]",
  initials: "SC",
};

export const mockDietitianStats = {
  sessionsToday: 5,
  activeClients: 18,
  bookedThisWeek: 22,
  plansDueReview: 3,
};

export const mockWorkHours = {
  today: { start: "8:00 AM", end: "5:00 PM" },
  week: [
    { day: "Mon", hours: "8a–5p" },
    { day: "Tue", hours: "8a–5p" },
    { day: "Wed", hours: "8a–1p" },
    { day: "Thu", hours: "8a–5p" },
    { day: "Fri", hours: "8a–5p" },
    { day: "Sat", hours: "Off" },
    { day: "Sun", hours: "Off" },
  ],
};

export type DietitianAppointment = {
  id: string; time: string; period: string; clientName: string;
  type: string; durationMin: number; accent: "protein" | "fat";
};

export const mockDietitianSchedule: DietitianAppointment[] = [
  { id: "a1", time: "9:00",  period: "AM", clientName: "Priya Malhotra", type: "Follow-up",       durationMin: 30, accent: "fat" },
  { id: "a2", time: "10:30", period: "AM", clientName: "James Osei",     type: "Initial consult",  durationMin: 45, accent: "protein" },
  { id: "a3", time: "1:00",  period: "PM", clientName: "Manpreet Singh", type: "Follow-up",        durationMin: 30, accent: "fat" },
];

export type DietitianClient = {
  id: string; name: string; initials: string;
  planName: string; weekOf: number; weekTotal: number;
  status: "On track" | "New" | "Review due";
};

export const mockDietitianClients: DietitianClient[] = [
  { id: "c1", name: "Priya Malhotra", initials: "PM", planName: "High protein vegan",     weekOf: 4, weekTotal: 8, status: "On track" },
  { id: "c2", name: "James Osei",     initials: "JO", planName: "No plan yet",            weekOf: 0, weekTotal: 0, status: "New" },
  { id: "c3", name: "Lena Kowalski",  initials: "LK", planName: "Mediterranean reset",    weekOf: 6, weekTotal: 6, status: "Review due" },
  { id: "c4", name: "Manpreet Singh", initials: "MS", planName: "Keto weight loss",       weekOf: 2, weekTotal: 10, status: "On track" },
];

export const mockMealTemplates: MealTemplate[] = [
  { id: "t1", name: "High Protein Vegan",       description: "Plant-based plan optimised for muscle growth and recovery",         tags: ["Vegan", "High Protein"],     kcal: 1900, fatPct: 25, carbsPct: 40, proteinPct: 35 },
  { id: "t2", name: "Keto Weight Loss",          description: "Very low carb plan to shift your body into fat-burning mode",        tags: ["Keto", "Weight Loss"],       kcal: 1600, fatPct: 70, carbsPct: 5,  proteinPct: 25 },
  { id: "t3", name: "Mediterranean Balance",     description: "Heart-healthy plan rich in olive oil, fish, and whole grains",       tags: ["Mediterranean", "Balanced"], kcal: 2000, fatPct: 35, carbsPct: 45, proteinPct: 20 },
  { id: "t4", name: "Diabetes-Friendly Low GI",  description: "Blood sugar stabilising plan with low glycemic index foods",         tags: ["Diabetes", "Balanced"],      kcal: 1750, fatPct: 30, carbsPct: 40, proteinPct: 30 },
  { id: "t5", name: "South Asian Vegetarian",    description: "Traditional Indian & South Asian flavours, nutritionally optimised", tags: ["Vegetarian", "Cultural"],    kcal: 1800, fatPct: 25, carbsPct: 50, proteinPct: 25 },
  { id: "t6", name: "Athletic Performance",      description: "High calorie, carb-forward plan for training and competition days",  tags: ["Sports", "High Protein"],    kcal: 2800, fatPct: 20, carbsPct: 55, proteinPct: 25 },
  { id: "t7", name: "1200 kcal Gentle Deficit",  description: "Gradual weight loss with high protein to preserve muscle mass",      tags: ["Weight Loss", "Balanced"],   kcal: 1200, fatPct: 30, carbsPct: 40, proteinPct: 30 },
  { id: "t8", name: "Bone Health & Calcium",     description: "Dairy and leafy-green focused for bone density prevention",         tags: ["Bone Health", "Balanced"],   kcal: 1800, fatPct: 30, carbsPct: 42, proteinPct: 28 },
];
