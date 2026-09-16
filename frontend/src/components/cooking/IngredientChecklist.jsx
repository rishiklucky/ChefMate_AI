import React, { useState } from 'react';
import { CheckSquare, Square, ShoppingBag } from 'lucide-react';

export default function IngredientChecklist({ ingredients = [] }) {
  const [checkedState, setCheckedState] = useState({});

  const toggleCheck = (idx) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checkedCount = Object.values(checkedState).filter(Boolean).length;
  const total = ingredients.length;

  return (
    <div className="card-chefmate p-4 p-md-4 rounded-4 shadow-sm mb-4 w-100 overflow-hidden">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2 min-w-0">
          <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
            <ShoppingBag size={18} />
          </div>
          <h5 className="font-display fw-bold text-dark m-0 text-truncate">Required Ingredients</h5>
        </div>
        <span className="badge badge-chef-green px-3 py-1.5 rounded-pill text-xs flex-shrink-0 ms-2">
          {checkedCount} of {total} Done
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-4 rounded-pill" style={{ height: '7px', backgroundColor: 'var(--surface-container-low)' }}>
        <div
          className="progress-bar rounded-pill"
          role="progressbar"
          style={{
            width: `${total ? (checkedCount / total) * 100 : 0}%`,
            background: 'linear-gradient(90deg, #16a34a, #22c55e)',
          }}
        ></div>
      </div>

      {/* Ingredient Items List */}
      <div className="d-flex flex-column gap-3 w-100">
        {ingredients.map((ing, idx) => {
          const isChecked = !!checkedState[idx];

          return (
            <div
              key={idx}
              className={`p-3 px-3.5 rounded-4 border d-flex align-items-center justify-content-between gap-3 cursor-pointer transition-all w-100 overflow-hidden ${
                isChecked ? 'bg-light border-success opacity-75' : 'bg-white hover-bg-light shadow-xs'
              }`}
              style={{ borderColor: isChecked ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 88, 12, 0.12)' }}
              onClick={() => toggleCheck(idx)}
            >
              {/* Checkbox aligned exactly beside Main Ingredient Name */}
              <div className="d-flex align-items-start gap-2.5 min-w-0 flex-grow-1">
                <button
                  type="button"
                  className="btn p-0 border-0 text-success d-flex align-items-center flex-shrink-0 mt-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(idx);
                  }}
                >
                  {isChecked ? <CheckSquare size={20} className="text-success" /> : <Square size={20} className="text-muted" />}
                </button>
                
                <div className="min-w-0 flex-grow-1">
                  <div
                    className={`font-label fw-bold text-dark text-sm leading-snug ${
                      isChecked ? 'text-decoration-line-through text-muted' : ''
                    }`}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {ing.name}
                  </div>
                  {ing.note && (
                    <div className="text-muted text-xs mt-0.5 leading-tight" style={{ wordBreak: 'break-word' }}>
                      {ing.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Badge - Vertically Centered */}
              {(ing.quantity || ing.unit) && (
                <div
                  className="badge font-label text-xs py-1.5 px-3 rounded-pill flex-shrink-0 my-auto align-self-center border"
                  style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}
                >
                  {ing.quantity} {ing.unit}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
