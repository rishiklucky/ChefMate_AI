import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import DishSelector from '../components/generator/DishSelector';
import PreferenceForm from '../components/generator/PreferenceForm';
import IngredientCustomizer from '../components/generator/IngredientCustomizer';
import LoadingScreen from '../components/generator/LoadingScreen';
import { Sparkles, Flame, CheckCircle, ShieldCheck, ArrowRight, Zap, Users, BookOpen } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const {
    dishName,
    servings,
    cookingMethod,
    isGeneratingRecipe,
    generateFinalRecipe,
    fetchPreliminaryIngredients,
    preliminaryIngredients,
  } = useRecipe();

  const [hasSelectedDish, setHasSelectedDish] = useState(false);

  const handleDishSelected = (selectedName) => {
    setHasSelectedDish(true);
    fetchPreliminaryIngredients(selectedName);
  };

  const handleStartGeneration = async () => {
    const result = await generateFinalRecipe((recipeId) => {
      navigate(`/guide?id=${recipeId}`);
    });
  };

  if (isGeneratingRecipe) {
    return <LoadingScreen dishName={dishName} servings={servings} cookingMethod={cookingMethod} />;
  }

  return (
    <div className="w-100 min-vh-100 pt-4 pt-md-5 pb-5 mt-2 mt-md-0">
      {/* HERO SECTION */}
      <section className="container px-3 px-sm-4 px-lg-5 pt-3 pt-md-4 pb-4 pb-md-5">
        <div className="row g-4 g-lg-5 align-items-center">

          {/* Left Column: Copy & Command Center */}
          <div className="col-lg-7 text-start">
            {/* Eyebrow Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1.5 px-sm-3.5 py-sm-2 rounded-pill font-label fw-bold text-xs mb-3 shadow-xs"
              style={{
                backgroundColor: 'rgba(234, 88, 12, 0.12)',
                border: '1px solid rgba(234, 88, 12, 0.25)',
                color: '#d94600',
              }}
            >
              <Sparkles size={14} className="text-danger flex-shrink-0" />
              <span>Next-Gen Culinary Intelligence • Powered by ChefMate AI &nbsp;</span>
            </div>

            {/* Title */}
            <h1 className="font-display fw-extrabold display-4 display-md-3 text-dark tracking-tight mb-3 hero-title">
              Cook Anything.<br />
              <span className="text-gradient-chef position-relative d-inline-block">
                Step by Step.
                <svg className="position-absolute bottom-0 start-0 w-100" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#ea580c' }}>
                  <path d="M1 5.5C45 2.5 155 1.5 199 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subheading */}
            <p className="font-body fs-6 fs-md-5 text-muted max-w-2xl mb-4 leading-relaxed">
              Tell us what you want to cook. We'll guide you from ingredients to plate with dynamic AI precision adapted to your exact ingredients, servings, spice level, and cooking method.
            </p>

            {/* Quick Feature Badges */}
            <div className="d-flex flex-wrap align-items-center gap-2 gap-sm-3 text-xs text-muted mb-4">
              <span className="d-inline-flex align-items-center gap-1.5 fw-semibold text-dark bg-white px-2.5 px-sm-3 py-1.5 rounded-pill shadow-xs border">
                <CheckCircle size={15} className="text-success flex-shrink-0" /> &nbsp;Indian & Metric Units (g, ml, cups) &nbsp;
              </span>
              <span className="d-inline-flex align-items-center gap-1.5 fw-semibold text-dark bg-white px-2.5 px-sm-3 py-1.5 rounded-pill shadow-xs border">
                <CheckCircle size={15} className="text-success flex-shrink-0" /> &nbsp;Gas, Induction, Oven & Air Fryer &nbsp;
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="col-lg-5 d-flex justify-content-center">
            <div className="card-chefmate p-3 p-sm-4 rounded-5 shadow-luxury border position-relative overflow-hidden w-100 max-w-md">
              <div className="position-relative rounded-4 overflow-hidden mb-3" style={{ height: 220 }}>
                <img
                  src="/CB.png"
                  alt="Hyderabadi Chicken Biryani"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div className="position-absolute top-3 start-3">
                  <span className="badge bg-white text-dark shadow-sm px-2.5 py-1 px-sm-3 py-sm-1.5 rounded-pill text-xs fw-bold border">
                    🔥 190°C Induction
                  </span>
                </div>
                <div className="position-absolute bottom-3 start-3 text-white p-2">
                  <span className="text-xs text-warning fw-bold text-uppercase tracking-wider">Formulated Master Dish</span>
                  <h4 className="font-display fw-bold mb-0 text-white fs-5 fs-sm-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Hyderabadi Chicken Biryani</h4>
                </div>
              </div>

              <div className="d-flex justify-content-between text-center p-2.5 p-sm-3 rounded-4" style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex-fill">
                  <div className="font-display fw-bold fs-6 fs-sm-5 text-dark">20 min</div>
                  <div className="text-xs text-muted fw-medium">Prep Time</div>
                </div>
                <div className="border-start border-end px-2 px-sm-3 flex-fill">
                  <div className="font-display fw-bold fs-6 fs-sm-5 text-dark">40 min</div>
                  <div className="text-xs text-muted fw-medium">Cook Time</div>
                </div>
                <div className="flex-fill">
                  <div className="font-display fw-bold fs-6 fs-sm-5 text-dark">Medium</div>
                  <div className="text-xs text-muted fw-medium">Spice Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GENERATION WORKFLOW STUDIO */}
      <section className="container px-4 px-lg-5 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">

            {/* STEP 1 */}
            <DishSelector onDishSelected={handleDishSelected} />

            {/* STEP 2 */}
            <PreferenceForm />

            {/* STEP 3 */}
            <IngredientCustomizer onGenerateClick={handleStartGeneration} />

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="container px-4 px-lg-5 py-5 mt-5">
        <div className="text-center mb-5">
          <span className="badge badge-chef-primary mb-2">Simplicity First</span>
          <h2 className="font-display fw-bold display-6 text-dark">How ChefMate AI Works</h2>
          <p className="text-muted max-w-lg mx-auto">No long videos, blog filler, or paywalls. Just exact culinary guidance.</p>
        </div>

        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="card-chefmate p-4 rounded-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <UtensilsIcon size={24} />
              </div>
              <h5 className="font-display fw-bold text-dark">1. Select Dish</h5>
              <p className="text-sm text-muted mb-0">Enter any dish or choose from popular regional suggestions.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-chefmate p-4 rounded-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <Users size={24} />
              </div>
              <h5 className="font-display fw-bold text-dark">2. Set Preferences</h5>
              <p className="text-sm text-muted mb-0">Specify servings, spice level, and your specific appliance.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-chefmate p-4 rounded-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <Sparkles size={24} />
              </div>
              <h5 className="font-display fw-bold text-dark">3. Customize Ingredients</h5>
              <p className="text-sm text-muted mb-0">Add or remove ingredients based on what is in your pantry.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-chefmate p-4 rounded-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3 text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <Flame size={24} />
              </div>
              <h5 className="font-display fw-bold text-dark">4. Cook Step by Step</h5>
              <p className="text-sm text-muted mb-0">Follow clear heat levels, visual cues, timers, and Kitchen Mode.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UtensilsIcon({ size = 24 }) {
  return (
    <span className="material-symbols-outlined" style={{ fontSize: size }}>
      restaurant_menu
    </span>
  );
}
