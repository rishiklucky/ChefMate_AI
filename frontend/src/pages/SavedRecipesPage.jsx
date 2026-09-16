import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import { Bookmark, Search, Trash2, ExternalLink, Clock, Users, Flame } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function SavedRecipesPage() {
  const navigate = useNavigate();
  const { savedRecipes, fetchSavedRecipes, toggleSaveRecipe } = useRecipe();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchSavedRecipes();
      setLoading(false);
    };
    load();
  }, []);

  const filtered = savedRecipes.filter((r) =>
    r.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-100 min-vh-100 pt-4 pb-5">
      <div className="container px-3 px-lg-5">
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <Bookmark size={20} />
              </div>
              <h2 className="font-display fw-extrabold text-dark m-0">My Saved Recipes</h2>
            </div>
            <p className="text-muted text-sm m-0">Your personal culinary collection saved for quick reference.</p>
          </div>

          {/* Search Filter */}
          <div className="card-chefmate p-1.5 rounded-pill shadow-xs d-flex align-items-center gap-2 px-3" style={{ minWidth: 280, border: '1px solid rgba(234, 88, 12, 0.2)' }}>
            <Search size={18} className="text-danger" />
            <input
              type="text"
              className="form-control border-0 bg-transparent text-sm focus-ring-none py-1"
              placeholder="Search saved recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((recipe) => (
              <div key={recipe._id} className="col-12 col-md-6 col-lg-4">
                <div className="card-chefmate p-4 rounded-4 h-100 d-flex flex-column justify-content-between shadow-md">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge badge-chef-primary">{recipe.cookingMethod}</span>
                      <span className="badge badge-chef-gold">{recipe.spiceLevel} Spice</span>
                    </div>

                    <h5 className="font-display fw-bold text-dark mb-2">{recipe.dishName}</h5>

                    <div className="d-flex align-items-center gap-3 text-xs text-muted mb-3">
                      <span className="d-flex align-items-center gap-1">
                        <Clock size={14} className="text-danger" /> {formatDuration(recipe.totalTimeMinutes || 30)}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <Users size={14} className="text-danger" /> {recipe.servings} Servings
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                      {recipe.ingredients?.length || 0} Ingredients • {recipe.steps?.length || 0} Steps
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2 pt-3 border-top">
                    <button
                      className="btn btn-sm btn-primary-chef flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 rounded-3 py-2"
                      onClick={() => navigate(`/guide?id=${recipe._id}`)}
                    >
                      <span>Open Guide</span>
                      <ExternalLink size={14} />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger p-2 rounded-3 border"
                      title="Remove from saved"
                      onClick={() => toggleSaveRecipe(recipe._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-12 text-center py-5">
                <div className="card-chefmate p-5 rounded-5 shadow-sm max-w-md mx-auto">
                  <Bookmark size={40} className="text-muted mb-3" />
                  <h5 className="font-display fw-bold text-dark">No Saved Recipes Yet</h5>
                  <p className="text-muted text-sm mb-4">When you generate recipes, click "Save Recipe" to store them in your collection.</p>
                  <button className="btn btn-primary-chef rounded-pill px-4 py-2.5" onClick={() => navigate('/')}>
                    Discover & Generate Recipes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
