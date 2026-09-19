import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Restore state from sessionStorage if mobile browser reloaded/restored tab
  const [step, setStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chefmate_reset_step');
      return saved ? parseInt(saved, 10) : 1;
    } catch (e) {
      return 1;
    }
  });

  const [email, setEmail] = useState(() => {
    try {
      return sessionStorage.getItem('chefmate_reset_email') || '';
    } catch (e) {
      return '';
    }
  });

  const [otp, setOtp] = useState(() => {
    try {
      return sessionStorage.getItem('chefmate_reset_otp') || '';
    } catch (e) {
      return '';
    }
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state to sessionStorage whenever step, email, or otp changes
  useEffect(() => {
    try {
      sessionStorage.setItem('chefmate_reset_step', step.toString());
      sessionStorage.setItem('chefmate_reset_email', email);
      sessionStorage.setItem('chefmate_reset_otp', otp);
    } catch (e) {
      // Storage quota fallback
    }
  }, [step, email, otp]);

  const resetFlowState = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    try {
      sessionStorage.removeItem('chefmate_reset_step');
      sessionStorage.removeItem('chefmate_reset_email');
      sessionStorage.removeItem('chefmate_reset_otp');
    } catch (e) {}
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || 'OTP code sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP code.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('OTP verified successfully!');
        setStep(3);
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please recheck.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(4);
        try {
          sessionStorage.removeItem('chefmate_reset_step');
          sessionStorage.removeItem('chefmate_reset_email');
          sessionStorage.removeItem('chefmate_reset_otp');
        } catch (e) {}
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
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
          <h3 className="font-display fw-extrabold text-dark mb-1 tracking-tight">Reset Password</h3>
          <p className="text-muted text-xs m-0">
            {step === 1 && 'Enter your account email to receive a 6-digit OTP code'}
            {step === 2 && `Enter the 6-digit OTP code sent to ${email}`}
            {step === 3 && 'Create a new secure password for your account'}
            {step === 4 && 'Your password has been successfully updated!'}
          </p>
        </div>

        {error && (
          <div
            className="alert border d-flex align-items-center gap-2 py-2.5 px-3 text-xs mb-3 rounded-3"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#dc2626' }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="fw-semibold">{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
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

            <button
              type="submit"
              className="btn btn-primary-chef w-100 py-3 rounded-4 font-display fw-bold d-flex align-items-center justify-content-center gap-2 shadow-luxury"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <Mail size={18} />
                  <span>Send OTP Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">6-Digit OTP Code</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                  <KeyRound size={18} style={{ color: '#ea580c' }} />
                </span>
                <input
                  type="text"
                  maxLength={6}
                  className="form-control border-start-0 text-center fw-bold fs-5 tracking-widest form-control-chef rounded-end-3"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <button
                  type="button"
                  className="btn btn-link p-0 text-xs text-decoration-none fw-semibold"
                  style={{ color: '#ea580c' }}
                  onClick={handleRequestOtp}
                  disabled={loading}
                >
                  <RefreshCw size={12} className="me-1" /> Resend OTP
                </button>
                <button
                  type="button"
                  className="btn btn-link p-0 text-xs text-decoration-none text-muted"
                  onClick={resetFlowState}
                >
                  Change Email
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-chef w-100 py-3 rounded-4 font-display fw-bold d-flex align-items-center justify-content-center gap-2 shadow-luxury"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">New Password</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                  <Lock size={18} style={{ color: '#ea580c' }} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0 text-sm form-control-chef"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-group-text border-start-0 bg-transparent rounded-end-3"
                  style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} style={{ color: '#ea580c' }} /> : <Eye size={18} style={{ color: '#78716c' }} />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-uppercase text-muted mb-1">Confirm New Password</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 rounded-start-3" style={{ backgroundColor: 'var(--surface-container-low)', borderColor: 'var(--border-subtle)' }}>
                  <Lock size={18} style={{ color: '#ea580c' }} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0 text-sm form-control-chef rounded-end-3"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center py-3">
            <div className="p-3 rounded-circle d-inline-flex mb-3 shadow-xs" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
              <CheckCircle2 size={44} />
            </div>
            <h4 className="font-display fw-bold text-dark mb-2">Password Reset Successful!</h4>
            <p className="text-muted text-xs mb-4">You can now sign in using your email and new password.</p>
            <button
              type="button"
              className="btn btn-primary-chef w-100 py-3 rounded-4 font-display fw-bold"
              onClick={() => {
                resetFlowState();
                navigate('/login');
              }}
            >
              Sign In Now
            </button>
          </div>
        )}

        {step !== 4 && (
          <div className="text-center mt-4 pt-3 border-top text-xs text-muted">
            <Link
              to="/login"
              className="fw-bold text-decoration-none d-inline-flex align-items-center gap-1"
              style={{ color: '#ea580c' }}
              onClick={resetFlowState}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
