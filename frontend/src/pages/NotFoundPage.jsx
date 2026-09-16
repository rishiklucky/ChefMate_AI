import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-vh-80 d-flex align-items-center justify-content-center text-center p-4">
      <div className="bg-white p-5 rounded-5 shadow-sm border max-w-md w-100">
        <div className="p-4 rounded-circle bg-light-danger text-danger d-inline-flex mb-3">
          <ChefHat size={48} />
        </div>
        <h1 className="font-display fw-bold text-dark display-5">404</h1>
        <h4 className="font-display fw-bold text-dark mb-2">Recipe Not Found</h4>
        <p className="text-muted text-sm mb-4">
          The culinary page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary-chef rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2">
          <Home size={18} />
          <span>Return to Kitchen Studio</span>
        </Link>
      </div>
    </div>
  );
}
