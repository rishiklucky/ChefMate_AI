const { GoogleGenerativeAI } = require('@google/generative-ai');

const getApiKey = () => process.env.GEMINI_API_KEY || '';

// Candidate models order (Gemini Flash & Pro models for automatic failover)
const MODEL_CANDIDATES = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
];

async function generateContentWithFallback(genAI, prompt) {
  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const textRaw = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
      const text = String(textRaw || '');
      console.log(`\x1b[32m[ChefMate AI Service] Active Model for Request: ${modelName}\x1b[0m`);
      return { text, modelUsed: modelName };
    } catch (err) {
      lastError = err;
      const isCapacityError = err.message && (err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('capacity'));
      if (isCapacityError) {
        console.warn(`[ChefMate AI Service] Model ${modelName} is at capacity (503). Retrying next candidate...`);
      } else {
        console.warn(`[ChefMate AI Service] Model ${modelName} failed (${err.message}). Retrying next candidate...`);
      }
      continue;
    }
  }
  throw lastError || new Error('Google Gemini API temporarily unavailable due to server capacity limits.');
}

/**
 * Generate preliminary ingredients for user customization before full recipe generation
 */
async function generatePreliminaryIngredients(dishName, servings = 2, spiceLevel = 'Medium', cookingMethod = 'Gas Stove') {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[ChefMate AI Service] Using fallback ingredient generator (No valid GEMINI_API_KEY set)');
    return getFallbackIngredients(dishName, servings);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are an expert chef. Provide a clean JSON array of standard ingredients required to prepare "${dishName}" for ${servings} people with ${spiceLevel} spice level on a ${cookingMethod}.
Use standard Indian & metric culinary units (g, kg, ml, L, tsp, tbsp, cups, pieces, medium).

Return ONLY raw valid JSON array of objects with no markdown wrapping, e.g.:
[
  { "name": "Basmati Rice", "quantity": "2", "unit": "cups", "note": "soaked for 30 mins" },
  { "name": "Salt", "quantity": "1.5", "unit": "tsp", "note": "to taste" }
]`;

    const { text } = await generateContentWithFallback(genAI, prompt);
    const cleanJson = cleanJsonResponse(text);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('[Gemini AI Service Error - Preliminary Ingredients]:', error.message);
    return getFallbackIngredients(dishName, servings);
  }
}

/**
 * Generate full cooking guide structured JSON
 */
async function generateFullRecipe({ dishName, servings = 2, spiceLevel = 'Medium', cookingMethod = 'Gas Stove', ingredients = [] }) {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[ChefMate AI Service] Using fallback full recipe generator');
    return getFallbackFullRecipe(dishName, servings, spiceLevel, cookingMethod, ingredients);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const ingredientListText = ingredients && ingredients.length > 0
      ? ingredients.map(ing => `- ${ing.name}: ${ing.quantity || ''} ${ing.unit || ''} (${ing.note || ''})`).join('\n')
      : 'Use standard authentic ingredients';

    const systemPrompt = `You are an expert professional chef and recipe developer.
Generate a practical, step-by-step cooking guide for the dish: "${dishName}".

Target Specifications:
- Number of people (servings): ${servings}
- Spice Level: ${spiceLevel} (Low = reduced chilli, Medium = balanced, High = enhanced chilli/spice)
- Cooking Method: ${cookingMethod} (Gas Stove = flame descriptions like low/medium flame; Induction = wattage/temp; Oven = exact °C & preheat; Air Fryer = temp °C & basket time)
- Customized Ingredients Provided By User:
${ingredientListText}

CRITICAL RULES:
1. Base the recipe steps strictly on the ingredient list provided above.
2. Use metric units (g, kg, ml, L, tsp, tbsp, cups, pieces) and temperatures in Celsius (°C).
3. If an essential ingredient was omitted by the user, add a friendly warning note in "warnings".
4. Every step MUST include clear title, sequential instruction, temperatureC (or null if not applicable), heatLevel, timeMinutes, quantityDetails, and expected visual/texture cue.

Return ONLY raw valid JSON (NO Markdown code blocks, NO text outside JSON) matching exact format:
{
  "dishName": "${dishName}",
  "servings": ${servings},
  "spiceLevel": "${spiceLevel}",
  "cookingMethod": "${cookingMethod}",
  "totalTimeMinutes": 35,
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 20,
  "ingredients": [
    {
      "name": "Ingredient Name",
      "quantity": "2",
      "unit": "cups",
      "note": "optional note"
    }
  ],
  "equipment": ["Heavy pan", "Spatula"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Heat the Oil",
      "instruction": "Add oil to pan and heat on medium flame.",
      "temperatureC": null,
      "heatLevel": "Medium Flame",
      "timeMinutes": 2,
      "quantityDetails": "2 tbsp Oil",
      "visualCue": "Oil shimmers without smoking"
    }
  ],
  "tips": ["Chef tip 1"],
  "commonMistakes": ["Mistake to avoid"],
  "servingSuggestion": "Serve piping hot with garlic naan or basmati rice.",
  "storageInstructions": "Refrigerate in airtight container up to 3 days.",
  "nutritionNote": "High protein, rich flavor profile.",
  "warnings": []
}`;

    const { text, modelUsed } = await generateContentWithFallback(genAI, systemPrompt);
    const cleanJson = cleanJsonResponse(text);
    const parsedRecipe = JSON.parse(cleanJson);
    parsedRecipe.aiModelUsed = modelUsed;
    return parsedRecipe;
  } catch (error) {
    console.error('[Gemini AI Service Error - Full Recipe]:', error.message);
    return getFallbackFullRecipe(dishName, servings, spiceLevel, cookingMethod, ingredients);
  }
}

function cleanJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

// Intelligent Fallback Ingredient Generator
function getFallbackIngredients(dishName, servings = 2) {
  const lower = dishName.toLowerCase();
  const mult = servings / 2;

  if (lower.includes('biryani')) {
    return [
      { name: 'Basmati Rice', quantity: `${(1.5 * mult).toFixed(1)}`, unit: 'cups', note: 'Washed & soaked 30 mins' },
      { name: 'Chicken / Paneer', quantity: `${(400 * mult).toFixed(0)}`, unit: 'g', note: 'Cut into curry size pieces' },
      { name: 'Onions', quantity: `${Math.ceil(2 * mult)}`, unit: 'large', note: 'Thinly sliced for birista' },
      { name: 'Yogurt (Dahi)', quantity: `${(0.5 * mult).toFixed(1)}`, unit: 'cups', note: 'Whisked smooth' },
      { name: 'Ginger Garlic Paste', quantity: `${(1.5 * mult).toFixed(1)}`, unit: 'tbsp', note: 'Fresh paste' },
      { name: 'Biryani Masala', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tbsp', note: 'Aromatic blend' },
      { name: 'Ghee / Cooking Oil', quantity: `${(3 * mult).toFixed(0)}`, unit: 'tbsp', note: 'For frying and dum' },
      { name: 'Fresh Mint & Coriander', quantity: `${(0.5 * mult).toFixed(1)}`, unit: 'cups', note: 'Finely chopped' },
      { name: 'Salt', quantity: `${(1.5 * mult).toFixed(1)}`, unit: 'tsp', note: 'To taste' },
    ];
  }

  if (lower.includes('butter masala') || lower.includes('paneer') || lower.includes('tikka')) {
    return [
      { name: 'Paneer / Chicken', quantity: `${(350 * mult).toFixed(0)}`, unit: 'g', note: 'Cubed' },
      { name: 'Tomatoes', quantity: `${Math.ceil(4 * mult)}`, unit: 'medium', note: 'Pureed smooth' },
      { name: 'Butter', quantity: `${(2 * mult).toFixed(0)}`, unit: 'tbsp', note: 'Unsalted or salted' },
      { name: 'Fresh Cream', quantity: `${(3 * mult).toFixed(0)}`, unit: 'tbsp', note: 'Heavy cream' },
      { name: 'Cashews', quantity: `${(10 * mult).toFixed(0)}`, unit: 'pieces', note: 'Soaked & blended into paste' },
      { name: 'Kasuri Methi', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tsp', note: 'Crushed dry fenugreek' },
      { name: 'Garam Masala', quantity: `${(0.5 * mult).toFixed(1)}`, unit: 'tsp', note: 'For aroma' },
      { name: 'Kashmiri Chilli Powder', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tsp', note: 'For color & mild warmth' },
      { name: 'Salt', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tsp', note: 'To taste' },
    ];
  }

  if (lower.includes('pasta')) {
    return [
      { name: 'Penne / Spaghetti Pasta', quantity: `${(200 * mult).toFixed(0)}`, unit: 'g', note: 'Dry pasta' },
      { name: 'Olive Oil', quantity: `${(2 * mult).toFixed(0)}`, unit: 'tbsp', note: 'Extra virgin' },
      { name: 'Garlic', quantity: `${Math.ceil(4 * mult)}`, unit: 'cloves', note: 'Finely minced' },
      { name: 'Tomato Puree / Cream', quantity: `${(1.5 * mult).toFixed(1)}`, unit: 'cups', note: 'Base sauce' },
      { name: 'Parmesan / Mozzarella Cheese', quantity: `${(0.5 * mult).toFixed(1)}`, unit: 'cups', note: 'Grated' },
      { name: 'Italian Herbs & Chilli Flakes', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tsp', note: 'Seasoning' },
      { name: 'Salt & Black Pepper', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tsp', note: 'To taste' },
    ];
  }

  // Generic dish default
  return [
    { name: `Main Base for ${dishName}`, quantity: `${(300 * mult).toFixed(0)}`, unit: 'g', note: 'Primary ingredient' },
    { name: 'Onions & Tomatoes', quantity: `${Math.ceil(2 * mult)}`, unit: 'medium', note: 'Finely chopped' },
    { name: 'Cooking Oil / Ghee', quantity: `${(2 * mult).toFixed(0)}`, unit: 'tbsp', note: 'For tempering' },
    { name: 'Spices & Garlic Paste', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tbsp', note: 'Flavoring base' },
    { name: 'Salt', quantity: `${(1 * mult).toFixed(1)}`, unit: 'tsp', note: 'To taste' },
  ];
}

// Intelligent Fallback Full Recipe Generator
function getFallbackFullRecipe(dishName, servings = 2, spiceLevel = 'Medium', cookingMethod = 'Gas Stove', inputIngredients = []) {
  const ingredients = inputIngredients && inputIngredients.length > 0
    ? inputIngredients
    : getFallbackIngredients(dishName, servings);

  const isAirFryer = cookingMethod.toLowerCase().includes('air fryer');
  const isOven = cookingMethod.toLowerCase().includes('oven');
  const isInduction = cookingMethod.toLowerCase().includes('induction');

  const heatText = isAirFryer ? '180°C Air Fryer' : isOven ? '200°C Oven' : isInduction ? '800W - 1200W' : 'Medium Flame';

  return {
    dishName: dishName || 'Delicious Custom Dish',
    servings: Number(servings) || 2,
    spiceLevel: spiceLevel || 'Medium',
    cookingMethod: cookingMethod || 'Gas Stove',
    totalTimeMinutes: 30,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    ingredients: ingredients,
    equipment: [isAirFryer ? 'Air Fryer' : isOven ? 'Baking Tray / Oven' : 'Heavy Bottom Pan / Kadhai', 'Spatula', 'Chef Knife', 'Measuring Spoons'],
    steps: [
      {
        stepNumber: 1,
        title: 'Preparation & Mis en Place',
        instruction: `Wash and chop all primary vegetables and aromatics. Measure out spices for ${servings} servings.`,
        temperatureC: null,
        heatLevel: 'Prep Work',
        timeMinutes: 8,
        quantityDetails: 'All key fresh ingredients',
        visualCue: 'Uniformly chopped ingredients ready in bowls'
      },
      {
        stepNumber: 2,
        title: 'Temper Aromatics & Base',
        instruction: isAirFryer
          ? 'Toss the base ingredients with oil and seasonings evenly in a bowl.'
          : isOven
            ? 'Preheat oven to 190°C. Grease baking pan lightly with oil.'
            : `Heat oil/ghee in pan over ${heatText}. Sauté onions, garlic, and ginger until fragrant and golden.`,
        temperatureC: isOven ? 190 : isAirFryer ? 180 : null,
        heatLevel: heatText,
        timeMinutes: 5,
        quantityDetails: 'Oil & Aromatics',
        visualCue: 'Golden color and rich release of aromas'
      },
      {
        stepNumber: 3,
        title: 'Combine & Cook Main Ingredients',
        instruction: `Add the main ingredients and spices formatted for ${spiceLevel} spice level. Stir continuously to infuse spices without burning.`,
        temperatureC: isAirFryer ? 180 : isOven ? 190 : null,
        heatLevel: heatText,
        timeMinutes: 10,
        quantityDetails: 'Spices and Main Proteins / Veggies',
        visualCue: 'Oil separates from masala / deep golden crust forms'
      },
      {
        stepNumber: 4,
        title: 'Simmer & Garnish',
        instruction: 'Reduce heat to low. Cover and simmer to allow flavors to lock in. Garnish with fresh herbs before serving.',
        temperatureC: null,
        heatLevel: isInduction ? '400W Simmer' : 'Low Flame',
        timeMinutes: 5,
        quantityDetails: 'Fresh Herbs & Finishers',
        visualCue: 'Lava-like gentle simmer and aromatic steam'
      }
    ],
    tips: [
      `For ${spiceLevel} heat level, balance with a spoonful of fresh cream or yogurt if desired.`,
      `Adjust cooking times slightly if using a heavier stainless steel or cast iron base.`
    ],
    commonMistakes: [
      'Burning garlic/ginger by cooking on excessively high heat without stirring.',
      'Crowding the pan or air fryer basket which steams rather than roasts the ingredients.'
    ],
    servingSuggestion: `Serve fresh and hot alongside steamed basmati rice, warm butter naan, or crisp roti.`,
    storageInstructions: 'Store leftover dish in an airtight glass container in the refrigerator for up to 3 days.',
    nutritionNote: `Nutritious fresh meal tailored for ${servings} people with ${spiceLevel} spice preference.`,
    warnings: []
  };
}

module.exports = {
  generatePreliminaryIngredients,
  generateFullRecipe,
};
