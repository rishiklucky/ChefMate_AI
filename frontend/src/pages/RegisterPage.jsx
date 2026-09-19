import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Flame, UserPlus, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, googleLogin, loading, authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await googleLogin(credentialResponse);
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
          <h3 className="font-display fw-extrabold text-dark mb-1 tracking-tight">Join ChefMate AI</h3>
          <p className="text-muted text-xs m-0">Create an account to save recipes & build your kitchen library</p>
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

        {/* Google OAuth Section */}
        <div className="d-flex flex-column align-items-center w-100 mb-3">
          <div className="w-100 d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error('Google Sign-Up Failed')}
              theme="outline"
              size="large"
              shape="pill"
              text="signup_with"
              width="100%"
            />
          </div>
        </div>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 border-secondary opacity-25 my-0" />
          <span className="px-2 text-muted text-xs fw-bold text-uppercase">OR</span>
          <hr className="flex-grow-1 border-secondary opacity-25 my-0" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">Full Name</label>
            <div className="input-group">
              <span className="input-group-text border-end-0 text-danger rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <User size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 text-sm form-control-chef rounded-end-3"
                placeholder="Chef Gordon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-danger fw-bold text-decoration-none hover-underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
