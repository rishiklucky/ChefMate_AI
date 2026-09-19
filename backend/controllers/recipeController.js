const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { generatePreliminaryIngredients, generateFullRecipe } = require('../services/geminiService');
const { getIsConnected } = require('../config/db');

// In-memory fallback recipe store if MongoDB is offline
const memoryRecipes = [];
const memoryUserSavedMap = {}; // userId -> Array of saved recipe IDs

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

    const userId = req.user ? req.user._id : null;

    const recipeData = await generateFullRecipe({
      dishName: dishName.trim(),
      servings: Number(servings) || 2,
      spiceLevel: spiceLevel || 'Medium',
      cookingMethod: cookingMethod || 'Gas Stove',
      ingredients: Array.isArray(ingredients) ? ingredients : [],
    });

    if (!getIsConnected()) {
      // Memory store fallback
      const savedDoc = {
        _id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: userId ? userId.toString() : null,
        ...recipeData,
        createdAt: new Date(),
      };
      memoryRecipes.unshift(savedDoc);

      // Auto-trim memory history if user is logged in: Keep max 5 per user
      if (userId) {
        const userHistory = memoryRecipes.filter((r) => r.userId === userId.toString());
        if (userHistory.length > 5) {
          const userSaved = memoryUserSavedMap[userId.toString()] || [];
          const excess = userHistory.slice(5);
          excess.forEach((oldRec) => {
            if (!userSaved.includes(oldRec._id.toString())) {
              const idx = memoryRecipes.findIndex((r) => r._id === oldRec._id);
              if (idx !== -1) memoryRecipes.splice(idx, 1);
            }
          });
        }
      }

      return res.status(201).json({ ...savedDoc, isSaved: false });
    }

    const newRecipe = new Recipe({
      userId,
      ...recipeData,
      isSaved: false,
    });

    const savedRecipe = await newRecipe.save();

    // Auto-trim MongoDB history if user is logged in: Keep max 5 per user
    if (userId) {
      const userRecipes = await Recipe.find({ userId }).sort({ createdAt: -1 });
      if (userRecipes.length > 5) {
        const user = await User.findById(userId);
        const userSavedIds = user && user.savedRecipes ? user.savedRecipes.map((s) => s.toString()) : [];
        const olderRecipes = userRecipes.slice(5);
        for (const oldRecipe of olderRecipes) {
          if (!userSavedIds.includes(oldRecipe._id.toString())) {
            await Recipe.findByIdAndDelete(oldRecipe._id);
          }
        }
      }
    }

    const resDoc = savedRecipe.toObject();
    res.status(201).json({ ...resDoc, isSaved: false });
  } catch (error) {
    console.error('Error in recipe generation endpoint:', error);
    res.status(500).json({
      message: 'Unable to generate your cooking guide right now. Please try again.',
      technical: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// GET /api/recipes (User Cooking History - Max 5)
exports.getRecipes = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required to view cooking history.' });
    }

    const userId = req.user._id;

    if (!getIsConnected()) {
      const userSaved = memoryUserSavedMap[userId.toString()] || [];
      const history = memoryRecipes
        .filter((r) => r.userId === userId.toString())
        .slice(0, 5)
        .map((r) => ({ ...r, isSaved: userSaved.includes(r._id.toString()) }));
      return res.json(history);
    }

    const user = await User.findById(userId);
    const userSavedIds = user && user.savedRecipes ? user.savedRecipes.map((s) => s.toString()) : [];

    const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 }).limit(5);
    const historyWithSaved = recipes.map((r) => {
      const doc = r.toObject();
      return { ...doc, isSaved: userSavedIds.includes(doc._id.toString()) };
    });

    res.json(historyWithSaved);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
};

// GET /api/recipes/saved (User Saved Recipes - Isolated per user)
exports.getSavedRecipes = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required to view saved recipes.' });
    }

    const userId = req.user._id;

    if (!getIsConnected()) {
      const userSavedIds = memoryUserSavedMap[userId.toString()] || [];
      const saved = memoryRecipes
        .filter((r) => userSavedIds.includes(r._id.toString()))
        .map((r) => ({ ...r, isSaved: true }));
      return res.json(saved);
    }

    const user = await User.findById(userId).populate({
      path: 'savedRecipes',
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedList = (user.savedRecipes || [])
      .filter(Boolean)
      .map((rec) => {
        const doc = rec.toObject ? rec.toObject() : rec;
        return { ...doc, isSaved: true };
      });

    res.json(savedList);
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

      let isSavedForUser = false;
      if (req.user && req.user._id) {
        const userSaved = memoryUserSavedMap[req.user._id.toString()] || [];
        isSavedForUser = userSaved.includes(id.toString());
      }
      return res.json({ ...recipe, isSaved: isSavedForUser });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    let isSavedForUser = false;
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (user && user.savedRecipes) {
        isSavedForUser = user.savedRecipes.some(
          (savedId) => savedId.toString() === recipe._id.toString()
        );
      }
    }

    const doc = recipe.toObject();
    res.json({ ...doc, isSaved: isSavedForUser });
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    res.status(500).json({ message: 'Server error fetching recipe' });
  }
};

// POST /api/recipes/:id/save (Save Cap = 20)
exports.toggleSaveRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required to save recipes.' });
    }

    const userId = req.user._id;

    if (!getIsConnected()) {
      const recipe = memoryRecipes.find((r) => r._id.toString() === id);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

      if (!memoryUserSavedMap[userId.toString()]) {
        memoryUserSavedMap[userId.toString()] = [];
      }

      const userSaved = memoryUserSavedMap[userId.toString()];
      const isAlreadySaved = userSaved.includes(id.toString());

      if (!isAlreadySaved) {
        if (userSaved.length >= 20) {
          return res.status(400).json({ message: 'Limit reached: You can save up to 20 recipes maximum.' });
        }
        userSaved.push(id.toString());
        return res.json({
          isSaved: true,
          message: 'Recipe saved successfully',
        });
      } else {
        const idx = userSaved.indexOf(id.toString());
        if (idx !== -1) userSaved.splice(idx, 1);
        return res.json({
          isSaved: false,
          message: 'Recipe removed from saved list',
        });
      }
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAlreadySaved = user.savedRecipes.some(
      (savedId) => savedId.toString() === recipe._id.toString()
    );

    if (!isAlreadySaved) {
      if (user.savedRecipes.length >= 20) {
        return res.status(400).json({ message: 'Limit reached: You can save up to 20 recipes maximum.' });
      }

      await User.findByIdAndUpdate(userId, { $addToSet: { savedRecipes: recipe._id } });
      res.json({
        isSaved: true,
        message: 'Recipe saved successfully',
      });
    } else {
      await User.findByIdAndUpdate(userId, { $pull: { savedRecipes: recipe._id } });
      res.json({
        isSaved: false,
        message: 'Recipe removed from saved list',
      });
    }
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
    await User.updateMany({}, { $pull: { savedRecipes: id } });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
};
