import React from 'react';
import { Plus, Trash2, AlertCircle, Sparkles, ChefHat, RefreshCw } from 'lucide-react';
import { useRecipe } from '../../context/RecipeContext';

export default function IngredientCustomizer({ onGenerateClick }) {
  const {
    dishName,
    servings,
    spiceLevel,
    cookingMethod,
    preliminaryIngredients,
    isGeneratingIngredients,
    addIngredient,
    removeIngredient,
    updateIngredient,
    fetchPreliminaryIngredients,
  } = useRecipe();

  // Check for common omitted key ingredients
  const getOmittedWarnings = () => {
    if (!preliminaryIngredients || preliminaryIngredients.length === 0) return [];

    const lowerDish = dishName.toLowerCase();
    const names = preliminaryIngredients.map((i) => i.name.toLowerCase());
    const warnings = [];

    if (lowerDish.includes('biryani') && !names.some((n) => n.includes('rice'))) {
      warnings.push('Rice is commonly used in Biryani. Since you removed it, the dish structure will differ.');
    }
    if (lowerDish.includes('paneer') && !names.some((n) => n.includes('paneer'))) {
      warnings.push('Paneer is the main protein in this recipe. Since you removed it, please ensure an alternative protein is present.');
    }
    if (lowerDish.includes('pasta') && !names.some((n) => n.includes('pasta') || n.includes('noodle') || n.includes('spaghetti'))) {
      warnings.push('Pasta base is missing from your ingredients list.');
    }
    return warnings;
  };

  const warnings = getOmittedWarnings();

  return (
    <div className="w-100 card-chefmate p-4 p-md-5 rounded-4 shadow-sm mt-4">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
            <ChefHat size={22} />
          </div>
          <div>
            <h5 className="font-display fw-bold text-dark m-0">STEP 3 — Ingredient Customization</h5>
            <p className="text-muted text-sm mb-0 mt-0.5">
              Review and adjust quantities, add special additions, or remove ingredients you don't have.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 rounded-pill px-3 py-1.5 fw-semibold border"
          onClick={() => fetchPreliminaryIngredients()}
          disabled={isGeneratingIngredients}
        >
          <RefreshCw size={14} className={isGeneratingIngredients ? 'animate-spin' : ''} />
          <span>Re-generate Draft</span>
        </button>
      </div>

      {/* Warnings Banner */}
      {warnings.length > 0 && (
        <div className="alert border d-flex align-items-start gap-2.5 mb-4 py-2.5 px-3.5 rounded-4 shadow-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-xs text-dark">
            {warnings.map((w, idx) => (
              <div key={idx} className="fw-semibold">{w}</div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state for ingredients */}
      {isGeneratingIngredients ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading ingredients...</span>
          </div>
          <p className="text-muted text-sm mt-3">Fetching preliminary ingredients from AI chef...</p>
        </div>
      ) : (
        <>
          {/* Ingredient List Table */}
          <div className="table-responsive mb-4 rounded-4 border overflow-hidden shadow-xs">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-xs text-uppercase tracking-wider text-muted">
                <tr>
                  <th style={{ width: '35%' }} className="ps-3 py-3">Ingredient Name</th>
                  <th style={{ width: '20%' }} className="py-3">Quantity</th>
                  <th style={{ width: '20%' }} className="py-3">Unit</th>
                  <th style={{ width: '20%' }} className="py-3">Optional Note</th>
                  <th style={{ width: '5%' }} className="text-end pe-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {preliminaryIngredients.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-3">
                      <input
                        type="text"
                        className="form-control form-control-sm font-label fw-semibold form-control-chef"
                        placeholder="e.g. Basmati Rice"
                        value={item.name}
                        onChange={(e) => updateIngredient(item.id, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm text-center form-control-chef"
                        placeholder="2"
                        value={item.quantity}
                        onChange={(e) => updateIngredient(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm form-control-chef"
                        placeholder="cups, g, tbsp"
                        value={item.unit}
                        onChange={(e) => updateIngredient(item.id, 'unit', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm text-muted form-control-chef"
                        placeholder="soaked, chopped, to taste"
                        value={item.note}
                        onChange={(e) => updateIngredient(item.id, 'note', e.target.value)}
                      />
                    </td>
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger p-1.5 rounded-3 transition-all"
                        title="Remove ingredient"
                        onClick={() => removeIngredient(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {preliminaryIngredients.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4 text-sm">
                      No ingredients in list. Click "+ Add Ingredient" below to add custom items.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Ingredient Button */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1.5 rounded-pill px-3.5 py-2 fw-semibold shadow-xs"
              onClick={addIngredient}
            >
              <Plus size={16} />
              <span>Add Ingredient</span>
            </button>

            <span className="text-xs text-muted">
              Total ingredients: <strong>{preliminaryIngredients.length}</strong>
            </span>
          </div>

          {/* Generate Master Recipe CTA */}
          <div className="pt-3 border-top">
            <button
              type="button"
              className="btn btn-primary-chef w-100 py-3.5 fs-5 font-display fw-bold d-flex align-items-center justify-content-center gap-2 rounded-4 shadow-luxury"
              onClick={onGenerateClick}
            >
              <Sparkles size={24} />
              <span>Generate Cooking Guide</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
