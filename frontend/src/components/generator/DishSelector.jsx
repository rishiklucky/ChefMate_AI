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
    <div className="w-100 card-chefmate p-4 p-sm-4.5 p-md-5 rounded-4 shadow-sm">
      <div className="text-start mb-3.5">
        <label className="font-display fw-bold fs-6 fs-sm-5 text-dark mb-1.5 d-flex align-items-center gap-2">
          <UtensilsIcon size={22} className="text-danger flex-shrink-0" />
          <span>STEP 1 — What would you like to cook today?</span>
        </label>
        <br></br>
        <p className="text-muted text-xs text-sm-sm m-0 leading-relaxed">
          Enter any dish name, cuisine, or specific craving. Our AI will handle the ingredients and recipe logic.
        </p>
        <br></br>
      </div>

      {/* Prominent Full-Width Input Engine */}
      <div
        className="p-3 p-sm-3.5 rounded-4 shadow-xs bg-white d-flex align-items-center gap-3 mb-3.5 w-100 border"
        style={{ borderColor: 'rgba(234, 88, 12, 0.3)' }}
      >
        <Search size={22} className="text-danger flex-shrink-0 ms-1" />
        <input
          type="text"
          className="form-control border-0 bg-transparent fs-6 fs-sm-5 text-dark focus-ring-none p-0 w-100"
          placeholder="e.g. Biryani, Butter Masala, Pasta, Dosa..."
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />

      </div>

      {/* Popular Suggestions */}
      <div className="d-flex flex-wrap align-items-center gap-2">
        <br></br>
        <span className="text-xs fw-bold text-uppercase tracking-wider text-muted me-1 w-100 w-sm-auto mb-1 mb-sm-0">
          Popular Suggestions:
        </span>
        {POPULAR_DISHES.map((dish) => (
          <button
            key={dish}
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 text-xs font-label fw-semibold transition-all ${dishName === dish
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
