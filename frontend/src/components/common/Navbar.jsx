import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecipe } from '../../context/RecipeContext';
import { Utensils, Flame, BookOpen, Clock, Bookmark, LogIn, User, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentRecipe } = useRecipe();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed-top navbar-chefmate z-3 shadow-sm py-2.5">
      <div className="container-fluid px-3 px-sm-4 px-lg-4">
        <div className="d-flex align-items-center justify-content-between">

          {/* Brand Logo */}
          <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none" onClick={() => setMobileNavOpen(false)}>
            <img
              src="/logo.png"
              alt="ChefMate AI"
              style={{ width: 38, height: 38, objectFit: 'contain' }}
              className="rounded-3 shadow-xs"
            />
            <div className="d-flex align-items-baseline">
              <span className="font-display fw-extrabold fs-4 text-dark tracking-tight">ChefMate</span>
              <span className="font-display fw-bold fs-4 text-gradient-chef ms-1">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-2 p-1 rounded-pill border shadow-xs" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(234, 88, 12, 0.18)' }}>
            <Link
              to="/"
              className={`px-4 py-2 rounded-pill text-decoration-none font-label fw-semibold text-sm transition-all ${isActive('/')
                ? 'text-white shadow-xs'
                : 'text-secondary hover-text-dark'
                }`}
              style={{
                background: isActive('/') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
              }}
            >
              Explore
            </Link>
            <Link
              to="/guide"
              className={`px-4 py-2 rounded-pill text-decoration-none font-label fw-semibold text-sm transition-all ${isActive('/guide')
                ? 'text-white shadow-xs'
                : 'text-secondary hover-text-dark'
                }`}
              style={{
                background: isActive('/guide') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
              }}
            >
              AI Recipe Studio
            </Link>
            <Link
              to="/saved"
              className={`px-4 py-2 rounded-pill text-decoration-none font-label fw-semibold text-sm transition-all ${isActive('/saved')
                ? 'text-white shadow-xs'
                : 'text-secondary hover-text-dark'
                }`}
              style={{
                background: isActive('/saved') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
              }}
            >
              Saved
            </Link>
            <Link
              to="/history"
              className={`px-4 py-2 rounded-pill text-decoration-none font-label fw-semibold text-sm transition-all ${isActive('/history')
                ? 'text-white shadow-xs'
                : 'text-secondary hover-text-dark'
                }`}
              style={{
                background: isActive('/history') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
              }}
            >
              History
            </Link>
          </nav>

          {/* Right Action Cluster - Icon-Only Profile Dropdown */}
          <div className="d-none d-md-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn p-0 rounded-circle border-0 d-flex align-items-center justify-content-center transition-all"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title={isAuthenticated ? user?.name || 'User Profile' : 'Account'}
                style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
                }}
              >
                {isAuthenticated ? (
                  <span className="fw-extrabold text-white text-sm font-display">
                    {user?.name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                ) : (
                  <User size={20} className="text-white" />
                )}
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow-md border rounded-4 mt-2 p-2" style={{ minWidth: '190px' }}>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-sm fw-medium" to="/profile">
                        <User size={16} className="text-danger" /> Profile & Settings
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-sm fw-medium" to="/saved">
                        <Bookmark size={16} className="text-danger" /> Saved Recipes
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider opacity-10" /></li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-sm fw-semibold text-danger" onClick={logout}>
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-sm fw-medium" to="/login">
                        <LogIn size={16} className="text-danger" /> Sign In
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-sm fw-semibold text-danger" to="/register">
                        <Sparkles size={16} className="text-danger" /> Register / Join
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Mobile Hamburger Toggle with Real Food Burger Icon (No Background) */}
          <button
            className="d-lg-none btn p-0 border-0 bg-transparent d-flex align-items-center justify-content-center transition-all"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
            style={{ width: 40, height: 40 }}
          >
            {mobileNavOpen ? (
              <X size={24} className="text-danger" />
            ) : (
              <span style={{ fontSize: '24px', lineHeight: 1 }} role="img" aria-label="Mobile Navigation Menu">
                🍔
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="d-lg-none pt-3 pb-2 border-top mt-2 animate-fade-in">
            <div className="d-flex flex-column align-items-start gap-2">
              <Link
                to="/"
                className={`px-4 py-2 text-decoration-none font-label fw-semibold text-sm rounded-pill transition-all ${
                  isActive('/') ? 'text-white shadow-xs' : 'text-dark hover-bg-light'
                }`}
                style={{
                  background: isActive('/') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
                }}
                onClick={() => setMobileNavOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/guide"
                className={`px-4 py-2 text-decoration-none font-label fw-semibold text-sm rounded-pill transition-all ${
                  isActive('/guide') ? 'text-white shadow-xs' : 'text-dark hover-bg-light'
                }`}
                style={{
                  background: isActive('/guide') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
                }}
                onClick={() => setMobileNavOpen(false)}
              >
                AI Recipe Studio
              </Link>
              <Link
                to="/saved"
                className={`px-4 py-2 text-decoration-none font-label fw-semibold text-sm rounded-pill transition-all ${
                  isActive('/saved') ? 'text-white shadow-xs' : 'text-dark hover-bg-light'
                }`}
                style={{
                  background: isActive('/saved') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
                }}
                onClick={() => setMobileNavOpen(false)}
              >
                Saved Recipes
              </Link>
              <Link
                to="/history"
                className={`px-4 py-2 text-decoration-none font-label fw-semibold text-sm rounded-pill transition-all ${
                  isActive('/history') ? 'text-white shadow-xs' : 'text-dark hover-bg-light'
                }`}
                style={{
                  background: isActive('/history') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
                }}
                onClick={() => setMobileNavOpen(false)}
              >
                History
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 text-decoration-none font-label fw-semibold text-sm rounded-pill transition-all ${
                      isActive('/profile') ? 'text-white shadow-xs' : 'text-dark hover-bg-light'
                    }`}
                    style={{
                      background: isActive('/profile') ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'transparent',
                    }}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Profile & Settings
                  </Link>
                  <button className="btn btn-danger rounded-pill w-100 mt-2 py-2 fw-semibold" onClick={() => { logout(); setMobileNavOpen(false); }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="d-flex gap-2 mt-2 w-100">
                  <Link to="/login" className="btn btn-light border rounded-pill w-50 py-2 fw-semibold" onClick={() => setMobileNavOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary-chef rounded-pill w-50 py-2 fw-semibold" onClick={() => setMobileNavOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
