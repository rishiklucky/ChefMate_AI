import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Search, Trash2, ExternalLink, Clock, Users, LogIn, Lock } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function SavedRecipesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { savedRecipes, fetchSavedRecipes, toggleSaveRecipe } = useRecipe();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        setLoading(true);
        await fetchSavedRecipes();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="w-100 min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
        <div className="card-chefmate p-4 p-md-5 rounded-5 shadow-luxury border text-center max-w-md w-100" style={{ borderColor: 'rgba(234, 88, 12, 0.2)' }}>
          <div className="p-3 rounded-circle bg-danger-subtle text-danger d-inline-flex mb-3 shadow-xs">
            <Lock size={36} style={{ color: '#ea580c' }} />
          </div>
          <h3 className="font-display fw-bold text-dark mb-2">Sign In Required</h3>
          <p className="text-muted text-sm mb-4">
            Saved recipes are stored securely in your individual account (up to 20 recipes). Please sign in or register to access your personal collection.
          </p>
          <div className="d-flex flex-column gap-2">
            <Link to="/login?redirect=%2Fsaved" className="btn btn-primary-chef w-100 py-2.5 rounded-4 font-display fw-bold d-flex align-items-center justify-content-center gap-2">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
            <Link to="/register?redirect=%2Fsaved" className="btn btn-light border w-100 py-2.5 rounded-4 font-label fw-semibold text-muted">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filtered = savedRecipes.filter((r) =>
    r.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-100 min-vh-100 pt-4 pb-5">
      <div className="container px-3 px-lg-5">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2.5 mb-1">
              <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <Bookmark size={20} />
              </div>
              <h2 className="font-display fw-extrabold text-dark m-1">My Saved Recipes</h2>
              <span className="badge rounded-pill px-3 py-1.5 text-xs fw-bold ms-1" style={{ backgroundColor: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
                {savedRecipes.length} / 20 Saved
              </span>
            </div>
            <p className="text-muted text-sm m-0">Your personal culinary collection saved for quick reference (max 20 recipes).</p>
          </div>

          {/* Search Filter */}
          <div className="card-chefmate p-1.5 rounded-pill shadow-xs d-flex align-items-center gap-2 px-3" style={{ minWidth: 280, border: '1px solid rgba(234, 88, 12, 0.2)' }}>
            <Search size={18} className="text-chef-orange" />
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
            <div className="spinner-border text-chef-orange" role="status">
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
                        <Clock size={14} className="text-chef-orange" /> {formatDuration(recipe.totalTimeMinutes || 30)}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <Users size={14} className="text-chef-orange" /> {recipe.servings} Servings
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
                      className="btn btn-sm p-2 rounded-3 border d-flex align-items-center justify-content-center transition-all"
                      style={{ borderColor: 'rgba(220, 38, 38, 0.4)', backgroundColor: '#fef2f2', color: '#dc2626' }}
                      title="Remove from saved"
                      onClick={() => toggleSaveRecipe(recipe._id)}
                    >
                      <Trash2 size={16} style={{ color: '#dc2626' }} />
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
                  <p className="text-muted text-sm mb-4">When you generate recipes, click "Save Recipe" to store them in your personal collection (up to 20 recipes).</p>
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
