import React from 'react';
import { Plus, Trash2, AlertCircle, Sparkles, ChefHat, RefreshCw, ChevronRight } from 'lucide-react';
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
    <div className="w-100 card-chefmate p-4 p-sm-4.5 p-md-5 rounded-4 shadow-sm mt-4 mt-sm-5">
      {/* STEP 3 Header */}
      <div className="d-flex align-items-start gap-2.5 mb-3">
        <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
          <ChefHat size={20} />
        </div>
        <div>
          <h5 className="font-display fw-bold text-dark fs-6 fs-sm-5 m-0 p-2">STEP 3 — Ingredient Customization</h5>
          <p className="text-muted text-xs text-sm-sm mb-0 mt-1 leading-relaxed">
            Review and adjust quantities, add special additions, or remove ingredients you don't have.
          </p>
        </div>
      </div>

      {/* Centered Re-generate Draft Action */}
      <div className="d-flex justify-content-center my-3 pb-1">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center justify-content-center gap-2 rounded-pill px-4 py-2 text-xs fw-semibold border shadow-xs transition-all"
          style={{ backgroundColor: '#ffffff', borderColor: 'rgba(234, 88, 12, 0.25)' }}
          onClick={() => fetchPreliminaryIngredients()}
          disabled={isGeneratingIngredients}
        >
          <RefreshCw size={14} className={isGeneratingIngredients ? 'animate-spin' : ''} style={{ color: '#ea580c' }} />
          <span>Generate Ingredients</span>
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
          <div className="spinner-border" style={{ color: '#ea580c' }} role="status">
            <span className="visually-hidden">Loading ingredients...</span>
          </div>
          <p className="text-muted text-sm mt-3">Fetching preliminary ingredients from AI chef...</p>
        </div>
      ) : (
        <>
          {/* Desktop Ingredient List Table (md and up) */}
          <div className="d-none d-md-block table-responsive mb-4 rounded-4 border overflow-hidden shadow-xs">
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

          {/* Mobile Ingredient List Cards Slider (sm and down) */}
          <div className="d-block d-md-none mb-3">
            {preliminaryIngredients.length > 0 ? (
              <>
                <div
                  className="d-flex flex-row flex-nowrap overflow-x-auto pb-3 px-1 no-scrollbar"
                  style={{
                    gap: '1.25rem',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {preliminaryIngredients.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-4 border bg-white shadow-xs position-relative flex-shrink-0"
                      style={{
                        flex: '0 0 84%',
                        maxWidth: '310px',
                        scrollSnapAlign: 'start',
                        borderColor: 'rgba(234, 88, 12, 0.18)',
                        boxShadow: '0 4px 16px rgba(28, 25, 23, 0.04)',
                      }}
                    >
                      {/* Top Header inside Card */}
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="badge bg-light text-dark border text-xs font-label px-2 py-1 rounded-3 fw-bold">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1 rounded-circle d-inline-flex align-items-center justify-content-center transition-all"
                          title="Remove ingredient"
                          style={{ width: 30, height: 30 }}
                          onClick={() => removeIngredient(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Ingredient Name */}
                      <div className="mb-2">
                        <label className="form-label text-xs fw-bold text-muted mb-1">Ingredient Name</label>
                        <input
                          type="text"
                          className="form-control font-label fw-semibold form-control-chef py-1.5 px-2.5 text-xs text-sm-sm"
                          placeholder="e.g. Basmati Rice"
                          value={item.name}
                          onChange={(e) => updateIngredient(item.id, 'name', e.target.value)}
                        />
                      </div>

                      {/* Quantity & Unit Row */}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label text-xs fw-bold text-muted mb-1">Quantity</label>
                          <input
                            type="text"
                            className="form-control form-control-chef text-center py-1.5 px-2 text-xs text-sm-sm"
                            placeholder="2"
                            value={item.quantity}
                            onChange={(e) => updateIngredient(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-xs fw-bold text-muted mb-1">Unit</label>
                          <input
                            type="text"
                            className="form-control form-control-chef py-1.5 px-2.5 text-xs text-sm-sm"
                            placeholder="cups, g, tbsp"
                            value={item.unit}
                            onChange={(e) => updateIngredient(item.id, 'unit', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Note (Optional) */}
                      <div>
                        <label className="form-label text-xs fw-bold text-muted mb-1">Note (Optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-chef text-muted text-xs py-1.5 px-2.5"
                          placeholder="soaked, chopped, to taste"
                          value={item.note}
                          onChange={(e) => updateIngredient(item.id, 'note', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slide indicator message below cards */}
                <div className="text-center text-xs text-muted fw-semibold mt-2.5 mb-3.5 d-flex align-items-center justify-content-center gap-1.5">
                  <span>Slide to view all ingredients</span>
                  <ChevronRight size={14} className="text-danger" />
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-muted border rounded-4 bg-light text-sm mb-3">
                No ingredients in list. Click "+ Add Ingredient" below to add custom items.
              </div>
            )}
          </div>

          {/* Add Ingredient Button */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <button
              type="button"
              className="btn btn-outline-chefmate btn-sm rounded-pill px-3.5 py-2 font-label fw-semibold d-inline-flex align-items-center gap-1.5 shadow-xs text-nowrap"
              onClick={addIngredient}
            >
              <Plus size={16} />
              <span>Add Ingredient</span>
            </button>

            <span className="text-xs text-muted text-nowrap">
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
