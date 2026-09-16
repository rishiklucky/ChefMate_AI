const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { generatePreliminaryIngredients, generateFullRecipe } = require('../services/geminiService');
const { getIsConnected } = require('../config/db');

// In-memory fallback recipe store if MongoDB is offline
const memoryRecipes = [];

// POST /api/recipes/preliminary-ingredients
exports.getPreliminaryIngredients = async (req, res) => {
  try {
    const { dishName, servings, spiceLevel, cookingMethod } = req.body;

    if (!dishName || typeof dishName !== 'string' || !dishName.trim()) {
      return res.status(400).json({ message: 'Dish name is required' });
    }

    const ingredients = await generatePreliminaryIngredients(
      dishName.trim(),
      servings || 2,
      spiceLevel || 'Medium',
      cookingMethod || 'Gas Stove'
    );

    res.json({ dishName, ingredients });
  } catch (error) {
    console.error('Error generating preliminary ingredients:', error);
    res.status(500).json({ message: 'Unable to fetch ingredients for this dish. Please try again.' });
  }
};

// POST /api/recipes/generate
exports.generateRecipe = async (req, res) => {
  try {
    const { dishName, servings, spiceLevel, cookingMethod, ingredients } = req.body;

    if (!dishName || !dishName.trim()) {
      return res.status(400).json({ message: 'Dish name is required' });
    }

    const recipeData = await generateFullRecipe({
      dishName: dishName.trim(),
      servings: Number(servings) || 2,
      spiceLevel: spiceLevel || 'Medium',
      cookingMethod: cookingMethod || 'Gas Stove',
      ingredients: Array.isArray(ingredients) ? ingredients : [],
    });

    const userId = req.user ? req.user._id : null;

    if (!getIsConnected()) {
      // Memory store fallback
      const savedDoc = {
        _id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId,
        ...recipeData,
        isSaved: false,
        createdAt: new Date(),
      };
      memoryRecipes.unshift(savedDoc);
      return res.status(201).json(savedDoc);
    }

    const newRecipe = new Recipe({
      userId,
      ...recipeData,
      isSaved: false,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error in recipe generation endpoint:', error);
    res.status(500).json({
      message: 'Unable to generate your cooking guide right now. Please try again.',
      technical: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// GET /api/recipes
exports.getRecipes = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json(memoryRecipes);
    }

    let filter = {};
    if (req.user) {
      filter = { $or: [{ userId: req.user._id }, { userId: null }] };
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 }).limit(20);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
};

// GET /api/recipes/saved
exports.getSavedRecipes = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const saved = memoryRecipes.filter((r) => r.isSaved);
      return res.json(saved);
    }

    if (!req.user) {
      const savedGuest = await Recipe.find({ isSaved: true }).sort({ createdAt: -1 });
      return res.json(savedGuest);
    }

    const saved = await Recipe.find({
      $or: [{ userId: req.user._id, isSaved: true }, { isSaved: true }],
    }).sort({ createdAt: -1 });

    res.json(saved);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ message: 'Server error fetching saved recipes' });
  }
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!getIsConnected()) {
      const recipe = memoryRecipes.find((r) => r._id.toString() === id);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
      return res.json(recipe);
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    res.status(500).json({ message: 'Server error fetching recipe' });
  }
};

// POST /api/recipes/:id/save
exports.toggleSaveRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!getIsConnected()) {
      const recipe = memoryRecipes.find((r) => r._id.toString() === id);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
      recipe.isSaved = !recipe.isSaved;
      return res.json({ isSaved: recipe.isSaved, message: recipe.isSaved ? 'Saved to collection' : 'Removed from collection' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.isSaved = !recipe.isSaved;
    await recipe.save();

    if (req.user) {
      if (recipe.isSaved) {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedRecipes: recipe._id } });
      } else {
        await User.findByIdAndUpdate(req.user._id, { $pull: { savedRecipes: recipe._id } });
      }
    }

    res.json({
      isSaved: recipe.isSaved,
      message: recipe.isSaved ? 'Recipe saved successfully' : 'Recipe removed from saved list',
    });
  } catch (error) {
    console.error('Error toggling save recipe:', error);
    res.status(500).json({ message: 'Server error saving recipe' });
  }
};

// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!getIsConnected()) {
      const idx = memoryRecipes.findIndex((r) => r._id.toString() === id);
      if (idx !== -1) memoryRecipes.splice(idx, 1);
      return res.json({ message: 'Recipe deleted' });
    }

    await Recipe.findByIdAndDelete(id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
};
