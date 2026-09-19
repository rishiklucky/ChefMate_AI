const express = require('express');
const router = express.Router();
const {
  getPreliminaryIngredients,
  generateRecipe,
  getRecipes,
  getSavedRecipes,
  getRecipeById,
  toggleSaveRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/preliminary-ingredients', getPreliminaryIngredients);
router.post('/generate', optionalAuth, generateRecipe);
router.get('/', protect, getRecipes);
router.get('/saved', protect, getSavedRecipes);
router.get('/:id', optionalAuth, getRecipeById);
router.post('/:id/save', protect, toggleSaveRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
