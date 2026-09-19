import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, CheckCircle2, Clock } from 'lucide-react';

const LOADING_MESSAGES = [
  "Reading your custom ingredients...",
  "Adjusting spice balance and portion scaling...",
  "Adapting instructions for specified appliance...",
  "Setting step-by-step temperatures and visual cues...",
  "Plating up your master cooking guide...",
  "Almost ready..."
];

export default function LoadingScreen({ dishName, servings, cookingMethod }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((msgIndex + 1) / LOADING_MESSAGES.length) * 100);

  return (
    <div className="py-4 py-md-5 d-flex flex-column align-items-center justify-content-center text-center px-3">
      <div
        className="card-chefmate p-4 p-sm-4.5 p-md-5 rounded-4 shadow-luxury position-relative overflow-hidden w-100"
        style={{ maxWidth: '520px' }}
      >
        {/* Decorative Top Ambient Accent Line */}
        <div
          className="position-absolute top-0 start-0 end-0"
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #ea580c, #f97316, #15803d)',
          }}
        />

        {/* Animated Chef Hat Icon Badge */}
        <div className="mb-3.5 position-relative d-inline-block">
          <div
            className="p-3.5 rounded-circle text-white shadow-md d-inline-flex align-items-center justify-content-center"
            style={{
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              boxShadow: '0 10px 25px rgba(234, 88, 12, 0.3)',
            }}
          >
            <ChefHat size={44} />
          </div>
          <span
            className="position-absolute bottom-0 end-0 p-1.5 rounded-circle text-white d-flex align-items-center justify-content-center shadow-xs"
            style={{ background: '#15803d' }}
          >
            <Sparkles size={14} />
          </span>
        </div>

        {/* Header Text */}
        <h4 className="font-display fw-bold text-dark fs-5 fs-sm-4 mb-1">Your AI Chef is Preparing</h4>
        <h3 className="font-display fw-extrabold mb-3 fs-4 fs-sm-3" style={{ color: '#ea580c' }}>
          "{dishName || 'Master Recipe'}"
        </h3>

        {/* Servings & Appliance Badges */}
        <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 text-xs mb-4">
          <span
            className="px-3 py-1.5 rounded-pill font-label fw-semibold"
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.2)',
              color: '#c2410c',
            }}
          >
            {servings} {servings === 1 ? 'Person' : 'People'}
          </span>
          <span
            className="px-3 py-1.5 rounded-pill font-label fw-semibold"
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.2)',
              color: '#c2410c',
            }}
          >
            {cookingMethod || 'Gas Stove'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3.5">
          <div className="d-flex align-items-center justify-content-between text-xs text-muted fw-bold mb-1.5 m-1">
            <span>Creation Progress</span>
            <span style={{ color: '#ea580c' }}>{progressPercent}%</span>
          </div>
          <div
            className="progress rounded-pill shadow-xs"
            style={{ height: '8px', backgroundColor: 'rgba(234, 88, 12, 0.12)' }}
          >
            <div
              className="progress-bar rounded-pill transition-all"
              role="progressbar"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #ea580c, #c2410c)',
                transition: 'width 0.5s ease',
              }}
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
        <div>
          <br></br>
        </div>

        {/* Status Message Container */}
        <div
          className="p-3 rounded-4 border mb-4 text-center transition-all"
          style={{
            backgroundColor: 'rgba(234, 88, 12, 0.05)',
            borderColor: 'rgba(234, 88, 12, 0.2)',
          }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2.5">
            <div
              className="spinner-border spinner-border-sm flex-shrink-0 m-1"
              style={{ color: '#ea580c', width: '1.1rem', height: '1.1rem' }}
              role="status"
            />
            <span className="font-label fw-bold text-dark text-xs text-sm-sm">
              {LOADING_MESSAGES[msgIndex]}
            </span>
          </div>
        </div>

        {/* Sequential Checklist Progress */}
        <div className="p-3 p-sm-3.5 rounded-4 bg-light border text-start">
          <div className="d-flex flex-column gap-2.5">
            {LOADING_MESSAGES.map((msg, idx) => {
              const isDone = idx < msgIndex;
              const isCurrent = idx === msgIndex;

              return (
                <div
                  key={idx}
                  className={`d-flex align-items-start gap-2.5 text-xs transition-all ${isDone
                    ? 'text-dark fw-medium'
                    : isCurrent
                      ? 'text-dark fw-bold'
                      : 'text-muted opacity-50'
                    }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-0.5 m-1" />
                  ) : isCurrent ? (
                    <div
                      className="spinner-grow spinner-grow-sm flex-shrink-0 mt-0.5 m-1"
                      style={{ width: 14, height: 14, color: '#ea580c' }}
                    />
                  ) : (
                    <Clock size={15} className="text-muted flex-shrink-0 mt-0.5 opacity-50 m-1" />
                  )}
                  <span className="leading-snug">{msg}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
