import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Flame, LogIn, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

class SafeGoogleWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('Google Auth render caught:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <button
          type="button"
          className="btn btn-outline-secondary w-100 py-2.5 rounded-pill text-xs fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={() => alert('Please configure a valid VITE_GOOGLE_CLIENT_ID in your frontend/.env file.')}
        >
          <span>Continue with Google</span>
        </button>
      );
    }
    return this.props.children;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, googleLogin, loading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const redirectUrl = searchParams.get('redirect')
    || (location.state?.from ? (location.state.from.pathname + (location.state.from.search || '')) : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate(redirectUrl, { replace: true });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await googleLogin(credentialResponse);
    if (res.success) {
      navigate(redirectUrl, { replace: true });
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

        {/* Google OAuth Section */}
        <div className="d-flex flex-column align-items-center w-100 mb-3">
          <div className="w-100 d-flex justify-content-center">
            <SafeGoogleWrapper>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Google Sign-In Failed')}
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                width="100%"
              />
            </SafeGoogleWrapper>
          </div>
        </div>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 border-secondary opacity-25 my-0" />
          <span className="px-2 text-muted text-xs fw-bold text-uppercase">OR</span>
          <hr className="flex-grow-1 border-secondary opacity-25 my-0" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">Email Address</label>
            <div className="input-group">
              <span className="input-group-text border-end-0 text-danger rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Mail size={18} style={{ color: '#ea580c' }} />
              </span>
              <input
                type="email"
                className="form-control border-start-0 text-sm form-control-chef rounded-end-3"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label text-xs fw-bold text-uppercase text-muted m-0">Password</label>
              <Link to="/forgot-password" className="text-xs text-decoration-none fw-semibold" style={{ color: '#ea580c' }}>
                Forgot Password?
              </Link>
            </div>
            <div className="input-group">
              <span className="input-group-text border-end-0 rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                <Lock size={18} style={{ color: '#ea580c' }} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 text-sm form-control-chef"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text border-start-0 bg-transparent rounded-end-3"
                style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} style={{ color: '#ea580c' }} />
                ) : (
                  <Eye size={18} style={{ color: '#78716c' }} />
                )}
              </button>
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
                <span>Sign In with Email</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-xs text-muted">
          New to ChefMate AI?{' '}
          <Link to={`/register${location.search}`} className=" fw-bold text-decoration-none hover-underline" style={{ color: '#ea580c' }}>
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
