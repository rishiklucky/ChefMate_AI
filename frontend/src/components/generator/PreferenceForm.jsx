import React from 'react';
import { Users, Flame, Zap, Wind, Microwave, Sliders } from 'lucide-react';
import { useRecipe } from '../../context/RecipeContext';

const SERVING_OPTIONS = [1, 2, 4];
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
    <div className="w-100 card-chefmate p-4 p-sm-4.5 p-md-5 rounded-4 shadow-sm mt-4 mt-sm-5">
      <div className="d-flex align-items-center gap-2.5 mb-4">
        <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
          <Sliders size={20} />
        </div>
        <h5 className="font-display fw-bold text-dark fs-6 fs-sm-5 m-0 p-2"> STEP 2 — Cooking Preferences & Setup</h5>
      </div>

      <div className="row g-4">
        {/* 1. Number of People */}
        <div className="col-12">
          <label className="form-label font-label fw-bold text-dark d-flex align-items-center gap-2 mb-2.5 text-sm">
            <Users size={18} className="text-chef-orange flex-shrink-0" />
            <span>Number of People (Servings)</span>
          </label>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {SERVING_OPTIONS.map((num) => {
              const isSelected = servings === num && !isCustomServings;
              return (
                <button
                  key={num}
                  type="button"
                  className={`btn font-label fw-semibold rounded-3 px-3.5 py-2 text-xs text-sm-sm flex-fill flex-sm-grow-0 transition-all ${isSelected
                    ? 'btn-primary-chef text-white shadow-xs'
                    : 'text-dark bg-white'
                    }`}
                  style={{
                    border: isSelected ? '2px solid #ea580c' : '1.5px solid #e2e8f0',
                  }}
                  onClick={() => {
                    setServings(num);
                    setIsCustomServings(false);
                  }}
                >
                  {num} {num === 1 ? 'Person' : 'People'}
                </button>
              );
            })}

            <button
              type="button"
              className={`btn font-label fw-semibold rounded-3 px-3.5 py-2 text-xs text-sm-sm flex-fill flex-sm-grow-0 transition-all ${isCustomServings ? 'btn-primary-chef text-white shadow-xs' : 'text-dark bg-white'
                }`}
              style={{
                border: isCustomServings ? '2px solid #ea580c' : '1.5px solid #e2e8f0',
              }}
              onClick={() => setIsCustomServings(true)}
            >
              Custom
            </button>

            {isCustomServings && (
              <div className="d-inline-flex align-items-center gap-2 w-100 w-sm-auto mt-2 mt-sm-0 ms-0 ms-sm-2">
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
          <label className="form-label font-label fw-bold text-dark d-flex align-items-center gap-2 mb-2.5 text-sm">
            <Flame size={18} className="text-chef-orange flex-shrink-0" />
            <span>Spice Level</span>
          </label>

          <div className="d-flex flex-column gap-3" style={{ gap: '0.85rem' }}>
            {SPICE_LEVELS.map((sp) => {
              const isSelected = spiceLevel === sp.level;
              return (
                <div
                  key={sp.level}
                  className={`preference-card-option p-3 rounded-4 d-flex align-items-center justify-content-between gap-2 cursor-pointer transition-all ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.08)' : '#ffffff',
                    border: isSelected ? '2px solid #ea580c' : '1.5px solid #e2e8f0',
                    boxShadow: isSelected ? '0 4px 14px rgba(234, 88, 12, 0.15)' : 'none',
                  }}
                  onClick={() => setSpiceLevel(sp.level)}
                >
                  <div className="d-flex align-items-center gap-3" style={{ flex: '1 1 0%', minWidth: 0 }}>
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-1 transition-all`}
                      style={{
                        width: 18,
                        height: 18,
                        border: isSelected ? '1.5px solid #ea580c' : '1.5px solid #94a3b8',
                        background: isSelected ? 'linear-gradient(135deg, #ea580c, #c2410c)' : '#ffffff',
                      }}
                    >
                      {isSelected && <div className="rounded-circle bg-white" style={{ width: 6, height: 6 }} />}
                    </div>
                    <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                      <div className="fw-bold text-dark text-xs text-sm-sm text-truncate">{sp.level} Spice</div>
                      <div className="text-muted text-xs text-truncate" style={{ fontSize: '0.75rem' }}>{sp.desc}</div>
                    </div>
                  </div>
                  <span
                    className={`badge ${sp.color} rounded-pill font-label fw-bold flex-shrink-0 ms-1`}
                    style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                  >
                    {sp.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Cooking Method */}
        <div className="col-md-6">
          <label className="form-label font-label fw-bold text-dark d-flex align-items-center gap-2 mb-2.5 text-sm">
            <Zap size={18} className="text-chef-orange flex-shrink-0" />
            <span>Appliance / Cooking Method</span>
          </label>

          <div className="row g-3">
            {COOKING_METHODS.map((method) => {
              const IconComp = method.icon;
              const isSelected = cookingMethod === method.name;

              return (
                <div key={method.name} className="col-6">
                  <div
                    className={`preference-card-option py-3 px-2 px-sm-3 rounded-4 text-center cursor-pointer transition-all h-100 d-flex flex-column align-items-center justify-content-between ${isSelected ? 'selected' : ''
                      }`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.08)' : '#ffffff',
                      border: isSelected ? '2px solid #ea580c' : '1.5px solid #e2e8f0',
                      boxShadow: isSelected ? '0 4px 14px rgba(234, 88, 12, 0.15)' : 'none',
                    }}
                    onClick={() => setCookingMethod(method.name)}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center w-100 flex-grow-1 pt-1">
                      <div className="d-flex align-items-center justify-content-center mb-1.5" style={{ height: '26px' }}>
                        <IconComp size={22} className={isSelected ? 'text-chef-orange' : 'text-secondary'} />
                      </div>
                      <div className="fw-bold text-dark text-xs text-sm-sm">{method.name}</div>
                    </div>
                    <div
                      className="text-muted text-xs mt-1.5 d-none d-sm-flex align-items-center justify-content-center text-center w-100"
                      style={{ minHeight: '2.4rem', fontSize: '0.73rem', lineHeight: '1.25' }}
                    >
                      {method.desc}
                    </div>
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
