import React from 'react';
import { Search, Sparkles, Flame } from 'lucide-react';
import { useRecipe } from '../../context/RecipeContext';

const POPULAR_DISHES = [
  'Chicken Biryani',
  'Paneer Butter Masala',
  'Masala Dosa',
  'Pasta',
  'Pizza',
];

export default function DishSelector({ onDishSelected }) {
  const { dishName, setDishName } = useRecipe();

  const handleSelectDish = (name) => {
    setDishName(name);
    if (onDishSelected) onDishSelected(name);
  };

  return (
    <div className="w-100">
      <div className="text-start mb-3">
        <label className="font-display fw-bold fs-5 text-dark mb-1 d-flex align-items-center gap-2">
          <UtensilsIcon size={22} className="text-danger" />
          <span>STEP 1 — What would you like to cook today?</span>
        </label>
        <p className="text-muted text-sm m-0">
          Enter any dish name, cuisine, or specific craving. Our AI will handle the ingredients and recipe logic.
        </p>
      </div>

      {/* Prominent Full-Width Input Engine */}
      <div
        className="card-chefmate p-2 p-sm-3 rounded-4 shadow-md d-flex align-items-center gap-3 mb-3 w-100"
        style={{ border: '1px solid rgba(234, 88, 12, 0.25)' }}
      >
        <Search size={22} className="text-danger flex-shrink-0 ms-2" />
        <input
          type="text"
          className="form-control border-0 bg-transparent fs-5 text-dark focus-ring-none py-2 w-100"
          placeholder="e.g. Chicken Biryani, Creamy Alfredo Pasta..."
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />
      </div>

      {/* Popular Suggestions */}
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className="text-xs fw-bold text-uppercase tracking-wider text-muted me-1">Popular Suggestions:</span>
        {POPULAR_DISHES.map((dish) => (
          <button
            key={dish}
            type="button"
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 text-xs font-label fw-semibold transition-all ${dishName === dish
              ? 'btn-primary-chef text-white shadow-xs'
              : 'bg-white text-secondary border hover-bg-light'
              }`}
            onClick={() => handleSelectDish(dish)}
          >
            {dish}
          </button>
        ))}
      </div>
    </div>
  );
}

function UtensilsIcon({ size = 20, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>
      restaurant_menu
    </span>
  );
}
