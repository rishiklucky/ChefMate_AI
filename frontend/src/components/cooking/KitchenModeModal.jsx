import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Flame, Clock, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export default function KitchenModeModal({ recipe, onClose }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  if (!recipe || !recipe.steps || recipe.steps.length === 0) return null;

  const currentStep = recipe.steps[activeStepIndex];
  const totalSteps = recipe.steps.length;

  const nextStep = () => {
    if (activeStepIndex < totalSteps - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  // Listen for keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStepIndex, totalSteps]);

  const renderKitchenQuantityChips = (details) => {
    if (!details) return null;
    const parts = details.split(',').map((p) => p.trim()).filter(Boolean);

    return (
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4 max-w-3xl mx-auto px-2">
        {parts.map((item, i) => (
          <span
            key={i}
            className="badge font-label fw-semibold text-sm py-2 px-3.5 rounded-pill shadow-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.16), rgba(217, 119, 6, 0.08))',
              border: '1px solid rgba(251, 146, 60, 0.35)',
              color: '#FFEDD5',
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.01em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const showHeat = currentStep.heatLevel && !['none', 'null', 'n/a'].includes(currentStep.heatLevel.toLowerCase().trim());

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 text-white z-max d-flex flex-column overflow-y-auto"
      style={{
        zIndex: 1060,
        background: 'radial-gradient(ellipse at 50% 10%, #1c130e 0%, #0a0b0e 70%)',
      }}
    >
      {/* Floating Side Navigation Arrow Buttons (Middle of screen sides) */}
      <button
        type="button"
        className="position-fixed top-50 start-0 translate-middle-y ms-2 ms-md-4 btn text-white rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center transition-all opacity-90 hover-opacity-100"
        style={{
          zIndex: 1070,
          width: 58,
          height: 58,
          backgroundColor: 'rgba(20, 23, 31, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
        onClick={prevStep}
        disabled={activeStepIndex === 0}
        title="Previous Step (Left Arrow)"
      >
        <ChevronLeft size={32} style={{ color: activeStepIndex === 0 ? 'rgba(255, 255, 255, 0.3)' : '#F8FAFC' }} />
      </button>

      {activeStepIndex < totalSteps - 1 ? (
        <button
          type="button"
          className="position-fixed top-50 end-0 translate-middle-y me-2 me-md-4 btn text-white rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center transition-all"
          style={{
            zIndex: 1070,
            width: 58,
            height: 58,
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            border: '1px solid rgba(253, 186, 116, 0.5)',
            boxShadow: '0 8px 25px rgba(234, 88, 12, 0.5), 0 0 15px rgba(234, 88, 12, 0.3)',
          }}
          onClick={nextStep}
          title="Next Step (Right Arrow or Space)"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      ) : (
        <button
          type="button"
          className="position-fixed top-50 end-0 translate-middle-y me-2 me-md-4 btn text-white rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center transition-all"
          style={{
            zIndex: 1070,
            width: 58,
            height: 58,
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            border: '1px solid rgba(187, 247, 208, 0.5)',
            boxShadow: '0 8px 25px rgba(22, 163, 74, 0.5)',
          }}
          onClick={onClose}
          title="Finish Cooking"
        >
          <CheckCircle2 size={28} className="text-white" />
        </button>
      )}

      {/* Top Header */}
      <div
        className="p-3 p-md-4 d-flex align-items-center justify-content-between flex-shrink-0"
        style={{
          backgroundColor: 'rgba(15, 17, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="p-2.5 rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
          >
            <Flame size={22} />
          </div>
          <div>
            <h5 className="font-display fw-bold text-white m-0 tracking-tight">{recipe.dishName}</h5>
            <div className="text-xs fw-medium mt-0.5" style={{ color: '#94A3B8' }}>
              Active Kitchen Mode • <span style={{ color: '#CBD5E1' }}>{recipe.cookingMethod}</span>
            </div>
          </div>
        </div>

        {/* Right Header Cluster: Heat Setting, Duration, Voice Toggle, Close */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {showHeat && (
            <span
              className="badge px-3 py-2 rounded-pill font-label text-xs d-inline-flex align-items-center gap-1.5 shadow-xs"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.16)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#FCA5A5',
              }}
            >
              <Flame size={14} className="text-danger" />
              <span className="fw-semibold">{currentStep.heatLevel}</span>
            </span>
          )}

          {currentStep.timeMinutes && (
            <span
              className="badge px-3 py-2 rounded-pill font-label text-xs d-inline-flex align-items-center gap-1.5 shadow-xs"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.16)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#FDE047',
              }}
            >
              <Clock size={14} style={{ color: '#FDE047' }} />
              <span className="fw-semibold">
                {formatDuration(currentStep.timeMinutes)}
              </span>
            </span>
          )}

          <button
            type="button"
            className={`btn btn-sm ${isAudioEnabled ? 'btn-danger' : 'btn-outline-secondary'} rounded-pill px-3 py-1.5`}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: isAudioEnabled ? '#ffffff' : '#CBD5E1' }}
          >
            {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="ms-1 d-none d-sm-inline">{isAudioEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-light rounded-circle p-2 ms-1 transition-all"
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#CBD5E1' }}
            onClick={onClose}
            title="Close Kitchen Mode"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress rounded-0 flex-shrink-0" style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${((activeStepIndex + 1) / totalSteps) * 100}%`,
            background: 'linear-gradient(90deg, #ea580c, #f97316, #fbbf24)',
          }}
        ></div>
      </div>

      {/* Center Content Area */}
      <div className="flex-grow-1 container d-flex flex-column justify-content-center py-4 px-4 px-md-5 max-w-4xl">
        <div className="text-center mb-3">
          <span
            className="badge font-display text-xs fw-bold px-3.5 py-2 rounded-pill mb-3 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              color: '#ffffff',
              letterSpacing: '0.08em',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
            }}
          >
            STEP {activeStepIndex + 1} OF {totalSteps}
          </span>
          <h2 className="font-display fw-bold text-white display-6 mb-3 tracking-tight">
            {currentStep.title}
          </h2>

          {/* Formatted Ingredient Bubbles */}
          {renderKitchenQuantityChips(currentStep.quantityDetails)}
        </div>

        {/* Premium Instruction Card */}
        <div
          className="p-4 p-md-5 rounded-5 text-center shadow-lg"
          style={{
            background: 'linear-gradient(145deg, #141720, #191c28)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(234, 88, 12, 0.06)',
          }}
        >
          <p
            className="fs-3 font-body leading-relaxed m-0 fw-medium text-white"
            style={{ letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            "{currentStep.instruction}"
          </p>

          {currentStep.visualCue && (
            <div
              className="mt-4 pt-3.5 text-sm d-flex align-items-center justify-content-center gap-2 rounded-4 p-3"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#FDE047',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>👁️</span>
              <div>
                <strong style={{ color: '#FBBF24' }}>Look for:</strong>{' '}
                <span style={{ color: '#F3F4F6' }}>{currentStep.visualCue}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div
        className="py-3 px-4 text-center text-xs flex-shrink-0 fw-medium"
        style={{
          backgroundColor: 'rgba(15, 17, 23, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94A3B8',
          letterSpacing: '0.01em',
        }}
      >
        Use side arrows or keyboard left / right / space keys to navigate hands-free
      </div>
    </div>
  );
}
