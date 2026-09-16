import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [dishName, setDishName] = useState('');
  const [servings, setServings] = useState(2);
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [cookingMethod, setCookingMethod] = useState('Gas Stove');
  
  const [preliminaryIngredients, setPreliminaryIngredients] = useState([]);
  const [isGeneratingIngredients, setIsGeneratingIngredients] = useState(false);
  
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipeHistory, setRecipeHistory] = useState([]);
  const [error, setError] = useState(null);

  // Load preliminary ingredients from AI backend
  const fetchPreliminaryIngredients = async (targetDish, targetServings, targetSpice, targetMethod) => {
    const dish = targetDish || dishName;
    const serv = targetServings || servings;
    const spice = targetSpice || spiceLevel;
    const method = targetMethod || cookingMethod;

    if (!dish || !dish.trim()) return;

    setIsGeneratingIngredients(true);
    setError(null);

    try {
      const res = await API.post('/recipes/preliminary-ingredients', {
        dishName: dish,
        servings: serv,
        spiceLevel: spice,
        cookingMethod: method,
      });

      const formatted = (res.data.ingredients || []).map((ing, idx) => ({
        id: `ing_${Date.now()}_${idx}`,
        name: ing.name || '',
        quantity: ing.quantity || '1',
        unit: ing.unit || '',
        note: ing.note || '',
      }));

      setPreliminaryIngredients(formatted);
      setIsGeneratingIngredients(false);
      return formatted;
    } catch (err) {
      console.error('Failed to generate preliminary ingredients:', err);
      setError(err.response?.data?.message || 'Failed to fetch ingredients for dish.');
      setIsGeneratingIngredients(false);
      return [];
    }
  };

  // Ingredient list control actions
  const addIngredient = () => {
    setPreliminaryIngredients((prev) => [
      ...prev,
      {
        id: `ing_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        name: '',
        quantity: '1',
        unit: 'piece',
        note: '',
      },
    ]);
  };

  const removeIngredient = (id) => {
    setPreliminaryIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const updateIngredient = (id, field, value) => {
    setPreliminaryIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Generate Full Recipe from customized options
  const generateFinalRecipe = async (navigateCallback) => {
    if (!dishName || !dishName.trim()) {
      setError('Please specify a dish name to cook.');
      return;
    }

    setIsGeneratingRecipe(true);
    setError(null);

    try {
      const payload = {
        dishName: dishName.trim(),
        servings: Number(servings),
        spiceLevel,
        cookingMethod,
        ingredients: preliminaryIngredients.map(({ name, quantity, unit, note }) => ({
          name,
          quantity: String(quantity || ''),
          unit: unit || '',
          note: note || '',
        })),
      };

      const res = await API.post('/recipes/generate', payload);
      setCurrentRecipe(res.data);
      setIsGeneratingRecipe(false);

      if (navigateCallback) {
        navigateCallback(res.data._id || 'view');
      }
      return res.data;
    } catch (err) {
      console.error('Failed to generate final recipe guide:', err);
      const msg = err.response?.data?.message || 'Unable to generate your cooking guide right now. Please try again.';
      setError(msg);
      setIsGeneratingRecipe(false);
      return null;
    }
  };

  // Save / Bookmark recipe
  const toggleSaveRecipe = async (recipeId) => {
    try {
      const targetId = recipeId || (currentRecipe ? currentRecipe._id : null);
      if (!targetId) return;

      const res = await API.post(`/recipes/${targetId}/save`);
      
      // Update local current recipe if matched
      if (currentRecipe && (currentRecipe._id === targetId || targetId === 'view')) {
        setCurrentRecipe((prev) => ({ ...prev, isSaved: res.data.isSaved }));
      }

      fetchSavedRecipes();
      return res.data;
    } catch (err) {
      console.error('Failed to toggle save recipe:', err);
    }
  };

  // Fetch History
  const fetchRecipeHistory = async () => {
    try {
      const res = await API.get('/recipes');
      setRecipeHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  // Fetch Saved
  const fetchSavedRecipes = async () => {
    try {
      const res = await API.get('/recipes/saved');
      setSavedRecipes(res.data || []);
    } catch (err) {
      console.error('Error fetching saved:', err);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        dishName,
        setDishName,
        servings,
        setServings,
        spiceLevel,
        setSpiceLevel,
        cookingMethod,
        setCookingMethod,
        preliminaryIngredients,
        setPreliminaryIngredients,
        isGeneratingIngredients,
        isGeneratingRecipe,
        currentRecipe,
        setCurrentRecipe,
        savedRecipes,
        recipeHistory,
        error,
        setError,
        fetchPreliminaryIngredients,
        addIngredient,
        removeIngredient,
        updateIngredient,
        generateFinalRecipe,
        toggleSaveRecipe,
        fetchRecipeHistory,
        fetchSavedRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
