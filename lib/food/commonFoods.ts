import { FoodResult } from "./openFoodFacts";

// Instant local results — no API call needed, shows while USDA loads in background
// Values per 100g
export const COMMON_FOODS: FoodResult[] = [
  // Dairy
  { id: "l-milk-whole",    name: "Milk, Whole",          brand: null, kcalPer100g: 61,  proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, servingG: 240 },
  { id: "l-milk-2",        name: "Milk, 2%",             brand: null, kcalPer100g: 50,  proteinPer100g: 3.3, carbsPer100g: 4.8, fatPer100g: 2.0, servingG: 240 },
  { id: "l-milk-skim",     name: "Milk, Skim",           brand: null, kcalPer100g: 34,  proteinPer100g: 3.4, carbsPer100g: 5.0, fatPer100g: 0.1, servingG: 240 },
  { id: "l-milk-oat",      name: "Oat Milk",             brand: null, kcalPer100g: 44,  proteinPer100g: 1.0, carbsPer100g: 7.0, fatPer100g: 1.5, servingG: 240 },
  { id: "l-milk-almond",   name: "Almond Milk",          brand: null, kcalPer100g: 15,  proteinPer100g: 0.6, carbsPer100g: 0.6, fatPer100g: 1.2, servingG: 240 },
  { id: "l-yogurt",        name: "Greek Yogurt",         brand: null, kcalPer100g: 59,  proteinPer100g: 10,  carbsPer100g: 3.6, fatPer100g: 0.4, servingG: 170 },
  { id: "l-cheese-ched",   name: "Cheddar Cheese",       brand: null, kcalPer100g: 402, proteinPer100g: 25,  carbsPer100g: 1.3, fatPer100g: 33,  servingG: 28  },
  { id: "l-paneer",        name: "Paneer",               brand: null, kcalPer100g: 265, proteinPer100g: 18,  carbsPer100g: 3.6, fatPer100g: 20,  servingG: 100 },
  // Eggs
  { id: "l-egg-whole",     name: "Egg, Whole",           brand: null, kcalPer100g: 143, proteinPer100g: 13,  carbsPer100g: 0.7, fatPer100g: 10,  servingG: 50  },
  { id: "l-egg-white",     name: "Egg White",            brand: null, kcalPer100g: 52,  proteinPer100g: 11,  carbsPer100g: 0.7, fatPer100g: 0.2, servingG: 33  },
  // Grains & Bread
  { id: "l-rice-white",    name: "Rice, White (cooked)", brand: null, kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28,  fatPer100g: 0.3, servingG: 186 },
  { id: "l-rice-brown",    name: "Rice, Brown (cooked)", brand: null, kcalPer100g: 123, proteinPer100g: 2.6, carbsPer100g: 26,  fatPer100g: 1.0, servingG: 186 },
  { id: "l-roti",          name: "Roti / Chapati",       brand: null, kcalPer100g: 297, proteinPer100g: 9.0, carbsPer100g: 55,  fatPer100g: 5.0, servingG: 40  },
  { id: "l-naan",          name: "Naan",                 brand: null, kcalPer100g: 317, proteinPer100g: 9.0, carbsPer100g: 55,  fatPer100g: 7.0, servingG: 90  },
  { id: "l-bread-white",   name: "Bread, White",         brand: null, kcalPer100g: 265, proteinPer100g: 9.0, carbsPer100g: 49,  fatPer100g: 3.2, servingG: 28  },
  { id: "l-bread-whole",   name: "Bread, Whole Wheat",   brand: null, kcalPer100g: 247, proteinPer100g: 13,  carbsPer100g: 41,  fatPer100g: 3.4, servingG: 28  },
  { id: "l-oats",          name: "Oats, Rolled",         brand: null, kcalPer100g: 389, proteinPer100g: 17,  carbsPer100g: 66,  fatPer100g: 7.0, servingG: 80  },
  { id: "l-pasta",         name: "Pasta, Cooked",        brand: null, kcalPer100g: 131, proteinPer100g: 5.0, carbsPer100g: 25,  fatPer100g: 1.1, servingG: 200 },
  { id: "l-quinoa",        name: "Quinoa, Cooked",       brand: null, kcalPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 22,  fatPer100g: 1.9, servingG: 185 },
  // Proteins — Meat & Fish
  { id: "l-chicken-breast",name: "Chicken Breast",       brand: null, kcalPer100g: 165, proteinPer100g: 31,  carbsPer100g: 0,   fatPer100g: 3.6, servingG: 140 },
  { id: "l-chicken-thigh", name: "Chicken Thigh",        brand: null, kcalPer100g: 209, proteinPer100g: 26,  carbsPer100g: 0,   fatPer100g: 11,  servingG: 100 },
  { id: "l-beef-ground",   name: "Beef, Ground (lean)",  brand: null, kcalPer100g: 215, proteinPer100g: 26,  carbsPer100g: 0,   fatPer100g: 12,  servingG: 100 },
  { id: "l-beef-steak",    name: "Beef, Sirloin Steak",  brand: null, kcalPer100g: 207, proteinPer100g: 29,  carbsPer100g: 0,   fatPer100g: 9.5, servingG: 150 },
  { id: "l-salmon",        name: "Salmon, Atlantic",     brand: null, kcalPer100g: 208, proteinPer100g: 20,  carbsPer100g: 0,   fatPer100g: 13,  servingG: 150 },
  { id: "l-tuna-can",      name: "Tuna, Canned in Water",brand: null, kcalPer100g: 116, proteinPer100g: 26,  carbsPer100g: 0,   fatPer100g: 1.0, servingG: 85  },
  { id: "l-shrimp",        name: "Shrimp",               brand: null, kcalPer100g: 99,  proteinPer100g: 24,  carbsPer100g: 0,   fatPer100g: 0.3, servingG: 85  },
  // South Asian
  { id: "l-dal",           name: "Dal, Masoor (cooked)", brand: null, kcalPer100g: 116, proteinPer100g: 9.0, carbsPer100g: 20,  fatPer100g: 0.4, servingG: 200 },
  { id: "l-chana",         name: "Chana Masala",         brand: null, kcalPer100g: 164, proteinPer100g: 9.0, carbsPer100g: 27,  fatPer100g: 3.0, servingG: 200 },
  { id: "l-biryani",       name: "Biryani, Chicken",     brand: null, kcalPer100g: 185, proteinPer100g: 10,  carbsPer100g: 25,  fatPer100g: 5.5, servingG: 300 },
  { id: "l-samosa",        name: "Samosa",               brand: null, kcalPer100g: 262, proteinPer100g: 5.0, carbsPer100g: 30,  fatPer100g: 14,  servingG: 60  },
  { id: "l-butter-chicken",name: "Butter Chicken",       brand: null, kcalPer100g: 150, proteinPer100g: 14,  carbsPer100g: 7.0, fatPer100g: 7.5, servingG: 250 },
  { id: "l-palak-paneer",  name: "Palak Paneer",         brand: null, kcalPer100g: 132, proteinPer100g: 7.0, carbsPer100g: 6.0, fatPer100g: 9.0, servingG: 200 },
  // Legumes
  { id: "l-chickpeas",     name: "Chickpeas, Cooked",    brand: null, kcalPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27,  fatPer100g: 2.6, servingG: 164 },
  { id: "l-lentils",       name: "Lentils, Cooked",      brand: null, kcalPer100g: 116, proteinPer100g: 9.0, carbsPer100g: 20,  fatPer100g: 0.4, servingG: 198 },
  { id: "l-black-beans",   name: "Black Beans, Cooked",  brand: null, kcalPer100g: 132, proteinPer100g: 8.9, carbsPer100g: 24,  fatPer100g: 0.5, servingG: 172 },
  { id: "l-tofu",          name: "Tofu, Firm",           brand: null, kcalPer100g: 76,  proteinPer100g: 8.0, carbsPer100g: 1.9, fatPer100g: 4.8, servingG: 100 },
  // Fruits
  { id: "l-banana",        name: "Banana",               brand: null, kcalPer100g: 89,  proteinPer100g: 1.1, carbsPer100g: 23,  fatPer100g: 0.3, servingG: 118 },
  { id: "l-apple",         name: "Apple",                brand: null, kcalPer100g: 52,  proteinPer100g: 0.3, carbsPer100g: 14,  fatPer100g: 0.2, servingG: 182 },
  { id: "l-mango",         name: "Mango",                brand: null, kcalPer100g: 60,  proteinPer100g: 0.8, carbsPer100g: 15,  fatPer100g: 0.4, servingG: 165 },
  { id: "l-orange",        name: "Orange",               brand: null, kcalPer100g: 47,  proteinPer100g: 0.9, carbsPer100g: 12,  fatPer100g: 0.1, servingG: 131 },
  { id: "l-strawberry",    name: "Strawberries",         brand: null, kcalPer100g: 32,  proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3, servingG: 152 },
  { id: "l-blueberry",     name: "Blueberries",          brand: null, kcalPer100g: 57,  proteinPer100g: 0.7, carbsPer100g: 14,  fatPer100g: 0.3, servingG: 148 },
  { id: "l-grapes",        name: "Grapes",               brand: null, kcalPer100g: 67,  proteinPer100g: 0.6, carbsPer100g: 17,  fatPer100g: 0.4, servingG: 92  },
  { id: "l-watermelon",    name: "Watermelon",           brand: null, kcalPer100g: 30,  proteinPer100g: 0.6, carbsPer100g: 7.6, fatPer100g: 0.2, servingG: 280 },
  { id: "l-avocado",       name: "Avocado",              brand: null, kcalPer100g: 160, proteinPer100g: 2.0, carbsPer100g: 9.0, fatPer100g: 15,  servingG: 150 },
  // Vegetables
  { id: "l-broccoli",      name: "Broccoli",             brand: null, kcalPer100g: 34,  proteinPer100g: 2.8, carbsPer100g: 7.0, fatPer100g: 0.4, servingG: 91  },
  { id: "l-spinach",       name: "Spinach",              brand: null, kcalPer100g: 23,  proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, servingG: 30  },
  { id: "l-carrot",        name: "Carrots",              brand: null, kcalPer100g: 41,  proteinPer100g: 0.9, carbsPer100g: 10,  fatPer100g: 0.2, servingG: 61  },
  { id: "l-potato",        name: "Potato, Baked",        brand: null, kcalPer100g: 93,  proteinPer100g: 2.5, carbsPer100g: 21,  fatPer100g: 0.1, servingG: 173 },
  { id: "l-sweet-potato",  name: "Sweet Potato, Baked",  brand: null, kcalPer100g: 90,  proteinPer100g: 2.0, carbsPer100g: 21,  fatPer100g: 0.1, servingG: 130 },
  { id: "l-tomato",        name: "Tomato",               brand: null, kcalPer100g: 18,  proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, servingG: 123 },
  { id: "l-onion",         name: "Onion",                brand: null, kcalPer100g: 40,  proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1, servingG: 110 },
  { id: "l-cucumber",      name: "Cucumber",             brand: null, kcalPer100g: 15,  proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1, servingG: 119 },
  // Nuts & Seeds
  { id: "l-almonds",       name: "Almonds",              brand: null, kcalPer100g: 579, proteinPer100g: 21,  carbsPer100g: 22,  fatPer100g: 50,  servingG: 28  },
  { id: "l-peanut-butter", name: "Peanut Butter",        brand: null, kcalPer100g: 588, proteinPer100g: 25,  carbsPer100g: 20,  fatPer100g: 50,  servingG: 32  },
  { id: "l-walnuts",       name: "Walnuts",              brand: null, kcalPer100g: 654, proteinPer100g: 15,  carbsPer100g: 14,  fatPer100g: 65,  servingG: 28  },
  // Drinks
  { id: "l-oj",            name: "Orange Juice",         brand: null, kcalPer100g: 45,  proteinPer100g: 0.7, carbsPer100g: 10,  fatPer100g: 0.2, servingG: 240 },
  { id: "l-coffee-black",  name: "Coffee, Black",        brand: null, kcalPer100g: 2,   proteinPer100g: 0.3, carbsPer100g: 0,   fatPer100g: 0,   servingG: 240 },
  // Common restaurant / fast food
  { id: "l-pizza-slice",   name: "Pizza, Cheese (1 slice)",brand:null,kcalPer100g: 266, proteinPer100g: 11,  carbsPer100g: 33,  fatPer100g: 10,  servingG: 107 },
  { id: "l-burger",        name: "Hamburger",            brand: null, kcalPer100g: 295, proteinPer100g: 17,  carbsPer100g: 24,  fatPer100g: 14,  servingG: 110 },
];

// Levenshtein edit distance (substitutions, insertions, deletions)
function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const dp = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[b.length];
}

export function searchLocal(query: string): FoodResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = COMMON_FOODS.map((f) => {
    const name = f.name.toLowerCase();
    const words = name.split(/[\s,/]+/).filter(Boolean);

    // 1-2 chars: only word-start match (keeps results tight)
    if (q.length <= 2) {
      return { food: f, score: words.some((w) => w.startsWith(q)) ? 80 : 0 };
    }

    // Exact substring → highest priority
    if (name.includes(q)) return { food: f, score: 100 };

    // Word starts with query → high priority
    if (words.some((w) => w.startsWith(q))) return { food: f, score: 80 };

    // Fuzzy: allow 1 edit for 4-5 char queries, 2 edits for 6+ chars
    if (q.length >= 4) {
      const maxDist = q.length <= 5 ? 1 : 2;
      // Check against each word in the food name
      const wordDist = Math.min(...words.map((w) => levenshtein(q, w)));
      if (wordDist <= maxDist) return { food: f, score: 60 - wordDist * 10 };
      // Also compare query against the first q.length chars of each word (prefix fuzzy)
      const prefDist = Math.min(...words.map((w) => levenshtein(q, w.slice(0, q.length))));
      if (prefDist <= 1) return { food: f, score: 40 };
    }

    return { food: f, score: 0 };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ food }) => food);
}
