import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Flame, Clock, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { formatDuration } from '../../utils/formatters';

export default function KitchenModeModal({ recipe, onClose }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const { isRunning: isTimerRunning, secondsLeft, setPresetSeconds, startTimer, openCard, formatTimer } = useTimer();

  if (!recipe || !recipe.steps || recipe.steps.length === 0) return null;

  const currentStep = recipe.steps[activeStepIndex];
  const totalSteps = recipe.steps.length;

  const nextStep = () => {
    if (activeStepIndex < totalSteps - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handleSetMasterTimer = () => {
    if (currentStep.timeMinutes && currentStep.timeMinutes > 0) {
      if (!isTimerRunning) {
        setPresetSeconds(currentStep.timeMinutes * 60);
        startTimer();
      }
      openCard();
    }
  };

  const prevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  // Enter Fullscreen Mode on launch and exit on close
  useEffect(() => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => { });
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }

    return () => {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => { });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    };
  }, []);

  // Listen for keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (activeStepIndex < totalSteps - 1) setActiveStepIndex((prev) => prev + 1);
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

  // Hands-free Voice Narration (Text-to-Speech)
  useEffect(() => {
    if (isAudioEnabled && 'speechSynthesis' in window && currentStep) {
      window.speechSynthesis.cancel();
      const textToSpeak = `Step ${activeStepIndex + 1}. ${currentStep.title}. ${currentStep.instruction}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else if (!isAudioEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [activeStepIndex, isAudioEnabled, currentStep]);

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
      {/* Floating Side Navigation Arrow Buttons (Desktop & Tablet >= 768px) */}
      <button
        type="button"
        className="d-none d-md-flex position-fixed top-50 start-0 translate-middle-y ms-2 ms-md-4 btn text-white rounded-circle p-3 shadow-lg align-items-center justify-content-center transition-all opacity-90 hover-opacity-100"
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
          className="d-none d-md-flex position-fixed top-50 end-0 translate-middle-y me-2 me-md-4 btn text-white rounded-circle p-3 shadow-lg align-items-center justify-content-center transition-all"
          style={{
            zIndex: 1070,
            width: 58,
            height: 58,
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            border: '1px solid rgba(253, 186, 116, 0.5)',
            boxShadow: '0 8px 25px rgba(234, 88, 12, 0.5), 0 0 15px rgba(234, 88, 12, 0.3)',
          }}
          onClick={() => setActiveStepIndex((prev) => prev + 1)}
          title="Next Step (Right Arrow or Space)"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      ) : (
        <button
          type="button"
          className="d-none d-md-flex position-fixed top-50 end-0 translate-middle-y me-2 me-md-4 btn text-white rounded-circle p-3 shadow-lg align-items-center justify-content-center transition-all"
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
        className="p-3 p-md-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 flex-shrink-0"
        style={{
          backgroundColor: 'rgba(15, 17, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Title & Dish Info Row */}
        <div className="d-flex align-items-center justify-content-between w-100 w-md-auto">
          <div className="d-flex align-items-center gap-2.5 min-w-0">
            <div
              className="p-2 rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', width: 38, height: 38 }}
            >
              <Flame size={20} />
            </div>
            <div className="min-w-0">
              <h5 className="font-display fw-bold text-white m-1 tracking-tight text-truncate">{recipe.dishName}</h5>
              <div className="text-xs fw-medium mt-0.5 text-truncate m-1" style={{ color: '#94A3B8' }}>
                Live Kitchen Mode • <span style={{ color: '#CBD5E1' }}>{recipe.cookingMethod}</span>
              </div>
            </div>
          </div>

          {/* Mobile-Only Close X Button */}
          <button
            type="button"
            className="d-md-none btn btn-outline-light rounded-circle p-0 d-inline-flex align-items-center justify-content-center ms-2 transition-all flex-shrink-0"
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#CBD5E1', width: 36, height: 36, lineHeight: 0 }}
            onClick={onClose}
            title="Close Kitchen Mode"
          >
            <X size={18} className="d-block m-auto" />
          </button>
        </div>

        {/* Header Right Cluster: Badges & Controls */}
        <div className="d-flex align-items-center justify-content-start justify-content-md-end gap-2 gap-sm-2.5 flex-wrap w-100 w-md-auto pt-2 pt-md-0 border-top-mobile">
          {showHeat && (
            <span
              className="badge rounded-pill text-xs fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5 px-3 shadow-xs flex-shrink-0"
              style={{
                height: '32px',
                backgroundColor: 'rgba(239, 68, 68, 0.16)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#FCA5A5',
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
            >
              <Flame size={14} className="text-danger flex-shrink-0 m-1" />
              <span>{currentStep.heatLevel}</span>
            </span>
          )}

          {/* Master Kitchen Timer Button */}
          {currentStep.timeMinutes && (
            <button
              type="button"
              className="btn btn-sm rounded-pill text-xs font-mono fw-bold d-inline-flex align-items-center justify-content-center gap-1.5 px-3 shadow-sm transition-all flex-shrink-0 p-0"
              style={{
                height: '32px',
                backgroundColor: isTimerRunning ? 'rgba(234, 88, 12, 0.9)' : 'rgba(245, 158, 11, 0.18)',
                border: isTimerRunning ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                color: isTimerRunning ? '#ffffff' : '#FDE047',
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
              onClick={handleSetMasterTimer}
              title={isTimerRunning ? 'Expand Master Kitchen Timer' : `Start Kitchen Timer for ${currentStep.timeMinutes} mins`}
            >
              <Clock size={14} style={{ color: '#FDE047' }} className="flex-shrink-0 m-1" />
              <span>
                {isTimerRunning ? formatTimer(secondsLeft) : formatDuration(currentStep.timeMinutes)}
              </span>
            </button>
          )}

          {/* Voice Narration Toggle Button */}
          <button
            type="button"
            className={`btn btn-sm ${isAudioEnabled ? 'btn-danger' : 'btn-outline-secondary'} rounded-pill text-xs fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5 px-3 flex-shrink-0 p-0`}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            style={{
              height: '32px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: isAudioEnabled ? '#ffffff' : '#CBD5E1',
              fontSize: '0.75rem',
              lineHeight: 1,
            }}
          >
            {isAudioEnabled ? <Volume2 size={14} className="flex-shrink-0 m-1" /> : <VolumeX size={14} className="flex-shrink-0 m-1" />}
            <span>{isAudioEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>

          {/* Desktop-Only Close X Button */}
          <button
            type="button"
            className="d-none d-md-inline-flex btn btn-outline-light rounded-circle p-0 align-items-center justify-content-center ms-1 transition-all flex-shrink-0"
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#CBD5E1', width: 38, height: 38, lineHeight: 0 }}
            onClick={onClose}
            title="Close Kitchen Mode"
          >
            <X size={18} className="d-block m-auto" />
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
      <div className="flex-grow-1 container d-flex flex-column justify-content-center py-4 px-3 px-sm-4 px-md-5 max-w-4xl">
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
          <h2 className="font-display fw-bold text-white fs-3 fs-sm-2 fs-md-1 mb-3 tracking-tight">
            {currentStep.title}
          </h2>

          {/* Formatted Ingredient Bubbles */}
          {renderKitchenQuantityChips(currentStep.quantityDetails)}
        </div>

        {/* Premium Instruction Card */}
        <div
          className="p-4 p-sm-4.5 p-md-5 rounded-5 text-center shadow-lg mb-3.5 mb-md-4"
          style={{
            background: 'linear-gradient(145deg, #141720, #191c28)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(234, 88, 12, 0.06)',
          }}
        >
          <p
            className="fs-5 fs-sm-4 fs-md-3 font-body leading-relaxed m-0 px-2 py-1.5 fw-medium text-white"
            style={{ letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            "{currentStep.instruction}"
          </p>
        </div>

        {/* Visual Cue Box Outside Card */}
        {currentStep.visualCue && (
          <div
            className="mt-1 mb-2 text-xs text-sm-sm d-flex align-items-center justify-content-center gap-2.5 rounded-4 p-3.5 px-4 shadow-sm max-w-2xl mx-auto w-100"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#FDE047',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ fontSize: '1.15rem' }} className="flex-shrink-0">👁️</span>
            <div className="py-0.5">
              <strong style={{ color: '#FBBF24' }}>Look for:</strong>{' '}
              <span style={{ color: '#F3F4F6' }}>{currentStep.visualCue}</span>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar (< 768px) */}
        <div className="d-flex d-md-none align-items-center justify-content-between gap-3 mt-4 w-100 max-w-md mx-auto">
          <button
            type="button"
            className="btn btn-outline-light rounded-pill px-4 py-2 text-xs font-display fw-bold d-inline-flex align-items-center gap-1.5 flex-1 justify-content-center"
            onClick={prevStep}
            disabled={activeStepIndex === 0}
            style={{ opacity: activeStepIndex === 0 ? 0.4 : 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {activeStepIndex < totalSteps - 1 ? (
            <button
              type="button"
              className="btn btn-primary-chef rounded-pill px-4 py-2 text-xs font-display fw-bold d-inline-flex align-items-center gap-1.5 flex-1 justify-content-center shadow-xs"
              onClick={() => setActiveStepIndex((prev) => prev + 1)}
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success rounded-pill px-4 py-2 text-xs font-display fw-bold d-inline-flex align-items-center gap-1.5 flex-1 justify-content-center shadow-xs"
              onClick={onClose}
            >
              <CheckCircle2 size={16} />
              <span>Finish</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
