import React from 'react';
import { Users, Flame, Zap, Wind, Microwave, Sliders } from 'lucide-react';
import { useRecipe } from '../../context/RecipeContext';

const SERVING_OPTIONS = [1, 2];
const SPICE_LEVELS = [
  { level: 'Low', desc: 'Mild & gentle heat', color: 'bg-success text-white' },
  { level: 'Medium', desc: 'Balanced flavor & warmth', color: 'bg-warning text-dark' },
  { level: 'High', desc: 'Authentic kick & spicy', color: 'bg-danger text-white' },
];
const COOKING_METHODS = [
  { name: 'Gas Stove', icon: Flame, desc: 'Flame controlled' },
  { name: 'Induction', icon: Zap, desc: 'Wattage & precise heat' },
  { name: 'Air Fryer', icon: Wind, desc: 'Crispy & low oil' },
  { name: 'Oven', icon: Microwave, desc: 'Baking & roasting °C' },
];

export default function PreferenceForm() {
  const {
    servings,
    setServings,
    spiceLevel,
    setSpiceLevel,
    cookingMethod,
    setCookingMethod,
  } = useRecipe();

  const [isCustomServings, setIsCustomServings] = React.useState(false);

  return (
    <div className="w-100 card-chefmate p-4 p-md-5 rounded-4 shadow-sm mt-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
          <Sliders size={20} />
        </div>
        <h5 className="font-display fw-bold text-dark m-0">STEP 2 — Cooking Preferences & Setup</h5>
      </div>

      <div className="row g-4">
        {/* 1. Number of People */}
        <div className="col-12">
          <label className="form-label font-label fw-bold text-dark d-flex align-items-center gap-2 mb-2">
            <Users size={18} className="text-danger" />
            <span>Number of People (Servings)</span>
          </label>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {SERVING_OPTIONS.map((num) => (
              <button
                key={num}
                type="button"
                className={`btn font-label fw-semibold rounded-3 px-3.5 py-2 transition-all ${servings === num && !isCustomServings
                    ? 'btn-primary-chef text-white shadow-xs'
                    : 'btn-secondary-chef'
                  }`}
                onClick={() => {
                  setServings(num);
                  setIsCustomServings(false);
                }}
              >
                {num} {num === 1 ? 'Person' : 'People'}
              </button>
            ))}

            <button
              type="button"
              className={`btn font-label fw-semibold rounded-3 px-3.5 py-2 ${isCustomServings ? 'btn-primary-chef text-white shadow-xs' : 'btn-secondary-chef'
                }`}
              onClick={() => setIsCustomServings(true)}
            >
              Custom
            </button>

            {isCustomServings && (
              <div className="d-inline-flex align-items-center gap-2 ms-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="form-control form-control-sm text-center fw-bold form-control-chef"
                  style={{ width: '90px' }}
                  value={servings}
                  onChange={(e) => setServings(Math.max(1, Number(e.target.value)))}
                />
                <span className="text-xs text-muted fw-semibold">people</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Spice Level */}
        <div className="col-md-6">
          <label className="form-label font-label fw-bold text-dark d-flex align-items-center gap-2 mb-2">
            <Flame size={18} className="text-danger" />
            <span>Spice Level</span>
          </label>

          <div className="d-flex flex-column gap-2.5">
            {SPICE_LEVELS.map((sp) => {
              const isSelected = spiceLevel === sp.level;
              return (
                <label
                  key={sp.level}
                  className={`p-3 rounded-4 border d-flex align-items-center justify-content-between cursor-pointer transition-all ${isSelected
                      ? 'border-danger shadow-xs'
                      : 'bg-white hover-bg-light'
                    }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.06)' : '#ffffff',
                    borderColor: isSelected ? 'rgba(234, 88, 12, 0.4)' : 'rgba(234, 88, 12, 0.12)',
                  }}
                  onClick={() => setSpiceLevel(sp.level)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="spiceLevel"
                      checked={isSelected}
                      onChange={() => setSpiceLevel(sp.level)}
                      className="form-check-input mt-0"
                    />
                    <div>
                      <div className="fw-bold text-dark text-sm">{sp.level} Spice</div>
                      <div className="text-muted text-xs">{sp.desc}</div>
                    </div>
                  </div>
                  <span className={`badge ${sp.color} rounded-pill px-3 py-1 text-xs fw-bold`}>
                    {sp.level}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Cooking Method */}
        <div className="col-md-6">
          <label className="form-label font-label fw-bold text-dark d-flex align-items-center gap-2 mb-2">
            <Zap size={18} className="text-danger" />
            <span>Appliance / Cooking Method</span>
          </label>

          <div className="row g-2.5">
            {COOKING_METHODS.map((method) => {
              const IconComp = method.icon;
              const isSelected = cookingMethod === method.name;

              return (
                <div key={method.name} className="col-6">
                  <div
                    className={`p-3 rounded-4 border text-center cursor-pointer transition-all h-100 d-flex flex-column align-items-center justify-content-center ${isSelected
                        ? 'shadow-xs'
                        : 'bg-white hover-bg-light'
                      }`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.06)' : '#ffffff',
                      borderColor: isSelected ? 'rgba(234, 88, 12, 0.4)' : 'rgba(234, 88, 12, 0.12)',
                    }}
                    onClick={() => setCookingMethod(method.name)}
                  >
                    <IconComp size={24} className={isSelected ? 'text-danger mb-1' : 'text-secondary mb-1'} />
                    <div className="fw-bold text-dark text-sm">{method.name}</div>
                    <div className="text-muted text-xs mt-0.5">{method.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
