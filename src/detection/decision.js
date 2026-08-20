/**
 * Decide whether a sneeze/cough score pair should trigger a blessing.
 * Keep this free of DOM so tests can run in Node.
 */

export function sneezeThreshold(sensitivity) {
  return 0.66 - sensitivity * 0.52;
}

export function shouldBless(sneeze, cough, sensitivity) {
  if (sneeze < sneezeThreshold(sensitivity)) return false;
  // Fake "achoo" often scores as cough. Only ignore it when cough is clearly ahead.
  if (cough >= sneeze + 0.2 && cough >= 0.34) return false;
  return true;
}

const SNEEZE_LIKE = [
  { test: (name) => /\bsneeze\b/.test(name), weight: 1 },
  { test: (name) => /\bgasp\b/.test(name), weight: 0.9 },
  { test: (name) => /\bsnort\b/.test(name), weight: 0.85 },
  { test: (name) => /\bsniff\b/.test(name), weight: 0.55 },
  { test: (name) => /throat clearing/.test(name), weight: 0.55 }
];

function categoryName(category) {
  return `${category.categoryName || ""} ${category.displayName || ""}`.toLowerCase().trim();
}

export function scoresFromYamnetCategories(categories) {
  let sneeze = 0;
  let cough = 0;
  for (const category of categories || []) {
    const name = categoryName(category);
    const score = category.score || 0;
    if (/\bcough\b/.test(name)) {
      cough = Math.max(cough, score);
    }
    for (const { test, weight } of SNEEZE_LIKE) {
      if (test(name)) sneeze = Math.max(sneeze, score * weight);
    }
  }
  return { sneeze, cough };
}

export const YAMNET_CATEGORY_ALLOWLIST = [
  "Sneeze",
  "Cough",
  "Throat clearing",
  "Sniff",
  "Gasp",
  "Snort"
];
