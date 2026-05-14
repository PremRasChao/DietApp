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
    protein: 24,
    carbs: 44,
    fat: 7,
    checked: true,
    thumbnail: null as null | string,
  },
  {
    id: "lunch",
    label: "Lunch",
    name: "Grilled Chicken & Quinoa",
    kcal: 520,
    protein: 46,
    carbs: 55,
    fat: 11,
    checked: false,
    thumbnail: null as null | string,
  },
  {
    id: "snack",
    label: "Snack",
    name: "Apple & Almond Butter",
    kcal: 180,
    protein: 5,
    carbs: 21,
    fat: 8,
    checked: false,
    thumbnail: null as null | string,
  },
  {
    id: "dinner",
    label: "Dinner",
    name: "Salmon with Roasted Veg",
    kcal: 620,
    protein: 48,
    carbs: 42,
    fat: 22,
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
  dietitianPhoto: "https://randomuser.me/api/portraits/women/44.jpg" as null | string,
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
  thumbnail: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" as null | string,
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

export const MACRO_GOALS = { protein: 135, carbs: 225, fat: 40 } as const;
