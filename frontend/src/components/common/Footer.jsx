import React from 'react';
import { Flame, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="mt-5 py-4 text-light"
      style={{
        backgroundColor: '#0F1015',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="container-fluid px-3 px-sm-4 px-lg-4">
        <div
          className="d-flex flex-column flex-sm-row align-items-center justify-content-between"
          style={{ gap: '1.25rem' }}
        >

          {/* Left: Brand + Divider + Copyright */}
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-3">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none group">
              <img
                src="/logo.png"
                alt="ChefMate AI"
                style={{ width: 32, height: 32, objectFit: 'contain' }}
                className="rounded-2 shadow-xs"
              />
              <span className="font-display fw-bold text-white fs-6 tracking-wide ms-0.5">ChefMate AI</span>
            </Link>

            <span className="d-none d-sm-inline" style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '0.875rem' }}>|</span>

            <span className="font-sans" style={{ color: '#94A3B8', fontSize: '0.8125rem', letterSpacing: '0.01em' }}>
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          {/* Right: Developer Attribution Badge */}
          <div
            className="px-3.5 py-1.5 rounded-pill font-label d-inline-flex align-items-center gap-2 shadow-xs transition-all"
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              color: '#FB923C',
              fontSize: '0.8125rem',
            }}
          >
            &nbsp; <Code2 size={14} className="text-orange-400" />
            <span style={{ letterSpacing: '0.05em' }}>
              Developed by <strong className="text-white fw-semibold ms-0.5"> Rishik Nallagulla &nbsp;</strong>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}



