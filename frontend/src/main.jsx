import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Uncaught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-100 min-vh-100 d-flex align-items-center justify-content-center p-4 bg-light">
          <div className="card shadow-sm p-4 text-center max-w-md border-danger">
            <h4 className="text-danger fw-bold mb-2">Application Error</h4>
            <p className="text-muted text-sm mb-3">
              {this.state.error?.message || 'An unexpected error occurred in the component tree.'}
            </p>
            <button className="btn btn-danger rounded-pill px-4" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id.apps.googleusercontent.com';

const AppRoot = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId || 'dummy_client_id.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRoot />
    </ErrorBoundary>
  </React.StrictMode>
);
