import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="w-100 min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
      <div
        className="card-chefmate p-4 p-sm-5 rounded-5 shadow-luxury border w-100"
        style={{ maxWidth: '440px', borderColor: 'rgba(234, 88, 12, 0.2)' }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo.png"
            alt="ChefMate AI Logo"
            style={{ width: 56, height: 56, objectFit: 'contain' }}
            className="mb-3 rounded-4 shadow-sm"
          />
          <h3 className="font-display fw-extrabold text-dark mb-1 tracking-tight">Welcome Back</h3>
          <p className="text-muted text-xs m-0">Sign in to access your AI recipes & kitchen profile</p>
        </div>

        {authError && (
          <div
            className="alert border d-flex align-items-center gap-2 py-2.5 px-3 text-xs mb-3 rounded-3"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#dc2626' }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="fw-semibold">{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">Email Address</label>
            <div className="input-group">
              <span className="input-group-text border-end-0 text-danger rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                className="form-control border-start-0 text-sm form-control-chef rounded-end-3"
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">Password</label>
            <div className="input-group">
              <span className="input-group-text border-end-0 text-danger rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="form-control border-start-0 text-sm form-control-chef rounded-end-3"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-chef w-100 py-3 rounded-4 font-display fw-bold d-flex align-items-center justify-content-center gap-2 shadow-luxury"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-xs text-muted">
          New to ChefMate AI?{' '}
          <Link to="/register" className="text-danger fw-bold text-decoration-none hover-underline">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
