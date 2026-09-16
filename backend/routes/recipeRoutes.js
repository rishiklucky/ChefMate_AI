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
router.get('/', optionalAuth, getRecipes);
router.get('/saved', optionalAuth, getSavedRecipes);
router.get('/:id', getRecipeById);
router.post('/:id/save', optionalAuth, toggleSaveRecipe);
router.delete('/:id', optionalAuth, deleteRecipe);

module.exports = router;
