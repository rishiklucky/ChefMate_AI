import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import { Mail, Flame, Bookmark } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { savedRecipes } = useRecipe();

  return (
    <div className="w-100 min-vh-100 pt-4 pb-5">
      <div className="container px-3 px-lg-5 max-w-2xl">
        <div className="card-chefmate p-4 p-md-5 rounded-5 shadow-luxury mb-4">

          <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 gap-sm-4 mb-4 text-center text-sm-start">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'Chef User'}
                className="rounded-circle shadow-md border flex-shrink-0"
                style={{ width: 72, height: 72, objectFit: 'cover', borderColor: 'rgba(234, 88, 12, 0.3)' }}
              />
            ) : (
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center font-display fw-extrabold display-6 shadow-md flex-shrink-0"
                style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'C'}
              </div>
            )}
            <div className="w-100 min-w-0 overflow-hidden">
              <div className="d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap gap-2">
                <h3 className="font-display fw-bold text-dark m-0 fs-4">{user?.name || 'Chef User'}</h3>
                {user?.authProvider === 'google' ? (
                  <span className="badge rounded-pill px-2.5 py-1 text-xs fw-bold" style={{ backgroundColor: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
                    Google Auth
                  </span>
                ) : (
                  <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1 text-xs fw-bold">
                    Email Login
                  </span>
                )}
              </div>
              <div className="text-muted text-xs text-sm-sm d-flex align-items-center justify-content-center justify-content-sm-start gap-1.5 mt-1.5 w-100">
                <Mail size={15} className="text-chef-orange flex-shrink-0 m-1" />
                <span className="text-break" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {user?.email || 'chef@example.com'}
                </span>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="p-3.5 rounded-4 text-center border" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Bookmark size={22} className="text-chef-orange mb-1" />
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

        </div>
      </div>
    </div>
  );
}
