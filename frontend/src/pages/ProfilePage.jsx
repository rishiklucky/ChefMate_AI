import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import { User, Mail, Flame, Zap, Bookmark, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { savedRecipes } = useRecipe();

  return (
    <div className="w-100 min-vh-100 pt-4 pb-5">
      <div className="container px-3 px-lg-5 max-w-2xl">
        <div className="card-chefmate p-4 p-md-5 rounded-5 shadow-luxury mb-4">
          
          <div className="d-flex align-items-center gap-4 mb-4">
            <div
              className="rounded-circle text-white d-flex align-items-center justify-content-center font-display fw-extrabold display-6 shadow-md"
              style={{ width: 76, height: 76, background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h3 className="font-display fw-bold text-dark m-0">{user?.name || 'Chef User'}</h3>
              <div className="text-muted text-sm d-flex align-items-center gap-1.5 mt-1">
                <Mail size={15} className="text-danger" />
                <span>{user?.email || 'chef@example.com'}</span>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <div className="p-3.5 rounded-4 text-center border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Bookmark size={22} className="text-danger mb-1" />
                <div className="font-display fw-bold fs-4 text-dark">{savedRecipes?.length || 0}</div>
                <div className="text-xs text-muted fw-semibold">Saved Recipes</div>
              </div>
            </div>

            <div className="col-6">
              <div className="p-3.5 rounded-4 text-center border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Flame size={22} className="text-warning mb-1" />
                <div className="font-display fw-bold fs-4 text-dark">Medium</div>
                <div className="text-xs text-muted fw-semibold">Preferred Spice</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-2">
            <Link to="/saved" className="btn btn-secondary-chef rounded-pill px-4 font-label text-sm fw-semibold">
              View Saved Recipes
            </Link>

            <button className="btn btn-danger rounded-pill px-4 font-label text-sm fw-semibold d-flex align-items-center gap-2 shadow-xs" onClick={logout}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
