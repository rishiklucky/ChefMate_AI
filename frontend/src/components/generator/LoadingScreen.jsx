import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="min-vh-80 d-flex flex-column align-items-center justify-content-center text-center p-4">
      <div className="bg-white p-5 rounded-5 shadow-lg border max-w-lg w-100 position-relative overflow-hidden">
        {/* Decorative Top Ambient Bar */}
        <div className="position-absolute top-0 start-0 end-0 h-2 bg-gradient" style={{ background: 'linear-gradient(90deg, #a23a00, #ffb95b, #006e27)' }}></div>

        {/* Animated Icon Avatar */}
        <div className="mb-4 position-relative d-inline-block">
          <div className="p-4 rounded-circle bg-light-danger d-inline-flex align-items-center justify-content-center text-danger shadow-md animate-bounce">
            <ChefHat size={56} />
          </div>
          <span className="position-absolute bottom-0 end-0 p-2 rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-xs">
            <Sparkles size={18} />
          </span>
        </div>

        <h3 className="font-display fw-bold text-dark mb-2">Your AI Chef is Preparing</h3>
        <h5 className="text-danger fw-bold mb-3 font-display">"{dishName || 'Master Recipe'}"</h5>

        <div className="d-flex align-items-center justify-content-center gap-3 text-xs text-muted mb-4">
          <span className="badge bg-light text-dark border px-2.5 py-1.5">{servings} Servings</span>
          <span className="badge bg-light text-dark border px-2.5 py-1.5">{cookingMethod}</span>
        </div>

        {/* Status Message Carousel */}
        <div className="bg-light p-3 rounded-4 border mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 text-danger fw-semibold text-sm">
            <div className="spinner-grow spinner-grow-sm text-danger" role="status"></div>
            <span>{LOADING_MESSAGES[msgIndex]}</span>
          </div>
        </div>

        {/* Sequential Checkmarks */}
        <div className="d-flex flex-column gap-2 text-start px-2">
          {LOADING_MESSAGES.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex align-items-center gap-2 text-xs transition-all ${
                idx <= msgIndex ? 'text-dark fw-semibold opacity-100' : 'text-muted opacity-40'
              }`}
            >
              <CheckCircle2 size={14} className={idx <= msgIndex ? 'text-success' : 'text-muted'} />
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
