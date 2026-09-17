import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import API from '../services/api';
import RecipeHeader from '../components/cooking/RecipeHeader';
import IngredientChecklist from '../components/cooking/IngredientChecklist';
import SequentialInstructions from '../components/cooking/SequentialInstructions';
import KitchenModeModal from '../components/cooking/KitchenModeModal';
import TipsSection from '../components/cooking/TipsSection';
import { ChefHat, ArrowLeft } from 'lucide-react';

export default function RecipeGuidePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentRecipe, setCurrentRecipe } = useRecipe();

  const [recipe, setRecipe] = useState(currentRecipe);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isKitchenModeOpen, setIsKitchenModeOpen] = useState(false);

  const recipeId = searchParams.get('id');

  useEffect(() => {
    if (recipeId && (!currentRecipe || currentRecipe._id !== recipeId)) {
      fetchRecipe(recipeId);
    } else if (currentRecipe) {
      setRecipe(currentRecipe);
    }
  }, [recipeId, currentRecipe]);

  const fetchRecipe = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/recipes/${id}`);
      setRecipe(res.data);
      setCurrentRecipe(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipe guide:', err);
      setLoading(false);
    }
  };

  const toggleStepComplete = (stepNum) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  if (loading) {
    return (
      <div className="min-vh-80 d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading guide...</span>
        </div>
        <p className="text-muted text-sm mt-3 font-display">Retrieving master cooking guide...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-white p-5 rounded-5 shadow-sm border max-w-md mx-auto">
          <ChefHat size={48} className="text-muted mb-3" />
          <h4 className="font-display fw-bold text-dark">No Active Recipe Selected</h4>
          <p className="text-muted text-sm mb-4">Select a dish on the landing page or load a saved recipe from your kitchen library.</p>
          <button className="btn btn-primary-chef rounded-pill px-4" onClick={() => navigate('/')}>
            Start Cooking New Recipe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 min-vh-100 pt-4 pb-5">
      <div className="container px-3 px-lg-5">

        {/* Back Link */}
        <button
          className="btn btn-sm btn-link text-muted text-decoration-none d-inline-flex align-items-center gap-1 mb-3 hover-danger"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </button>

        {/* Master Recipe Header */}
        <RecipeHeader recipe={recipe} onOpenKitchenMode={() => setIsKitchenModeOpen(true)} />

        {/* Required Ingredients Section (Single-Height Slidable Row on Tab/PC, 4-Item Paginated Carousel on Mobile) */}
        <IngredientChecklist ingredients={recipe.ingredients} />

        {/* Sequential Instructions Section (Slidable 1 Card at a Time Concept) */}
        <SequentialInstructions
          steps={recipe.steps}
          completedSteps={completedSteps}
          toggleStepComplete={toggleStepComplete}
        />

        {/* Tips, Common Mistakes & Nutrition */}
        <TipsSection recipe={recipe} />

      </div>

      {/* Kitchen Mode Hands-Free Modal */}
      {isKitchenModeOpen && (
        <KitchenModeModal recipe={recipe} onClose={() => setIsKitchenModeOpen(false)} />
      )}
    </div>
  );
}
