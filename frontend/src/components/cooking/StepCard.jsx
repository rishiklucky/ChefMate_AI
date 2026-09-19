import React from 'react';
import { Flame, Clock, Eye, CheckCircle2, Thermometer, ShoppingBag } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { formatDuration } from '../../utils/formatters';

export default function StepCard({ step, isCompleted, onToggleComplete, className = '' }) {
  const {
    stepNumber,
    title,
    instruction,
    temperatureC,
    heatLevel,
    timeMinutes,
    quantityDetails,
    visualCue,
  } = step;

  const { isRunning: isTimerRunning, setPresetSeconds, startTimer, openCard } = useTimer();

  const handleSetStepTimer = () => {
    if (timeMinutes && timeMinutes > 0) {
      setPresetSeconds(timeMinutes * 60);
      startTimer();
      openCard();
    }
  };

  // Render full-width quantity chips spanning across entire card
  const renderQuantityChips = (details) => {
    if (!details) return null;
    const parts = details.split(',').map((p) => p.trim()).filter(Boolean);

    return (
      <div className="w-100 d-flex flex-wrap align-items-center gap-2 my-2.5 pt-1">
        <span className="text-xs font-label text-muted d-inline-flex align-items-center gap-1.5 me-1 flex-shrink-0">
          <ShoppingBag size={14} className="m-1" style={{ color: '#ea580c' }} />
          <span className="fw-semibold">Step Ingredients:</span>
        </span>
        {parts.map((item, i) => (
          <span
            key={i}
            className="badge font-label fw-semibold text-xs py-1.5 px-3 rounded-pill shadow-xs"
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.05)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              color: 'var(--text-main)',
              letterSpacing: '0.01em',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const showHeat = heatLevel && !['none', 'null', 'n/a'].includes(heatLevel.toLowerCase().trim());

  return (
    <div className={`step-card p-4 p-md-4 transition-all w-100 overflow-hidden ${isCompleted ? 'opacity-75 bg-light' : ''} ${className}`}>

      {/* Step Title Header Row */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-3 mb-2">
        {/* Step Number & Title */}
        <div className="d-flex align-items-start gap-3 min-w-0">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold font-display flex-shrink-0 shadow-sm ${isCompleted ? 'bg-success text-white' : 'text-white'
              }`}
            style={{
              width: 46,
              height: 46,
              fontSize: '1.1rem',
              background: isCompleted ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #ea580c, #c2410c)',
            }}
          >
            {isCompleted ? <CheckCircle2 size={24} /> : (stepNumber < 10 ? `0${stepNumber}` : stepNumber)}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-uppercase tracking-wider fw-extrabold mb-0.5" style={{ color: '#ea580c' }}>
              STEP {stepNumber < 10 ? `0${stepNumber}` : stepNumber}
            </div>
            <h5 className={`font-display fw-bold text-dark m-0 ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
              {title}
            </h5>
          </div>
        </div>

        {/* Telemetry Badges & Mark Done (Pushed to right edge) */}
        <div className="d-flex flex-wrap align-items-center gap-2 flex-shrink-0 ms-auto ms-sm-0">
          {temperatureC && (
            <span
              className="badge font-label text-xs d-inline-flex align-items-center gap-1.5 py-1.5 px-3 rounded-pill border"
              style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}
            >
              <Thermometer size={13} className="m-1" style={{ color: '#ea580c' }} /> {temperatureC}°C
            </span>
          )}

          {showHeat && (
            <span
              className="badge font-label text-xs d-inline-flex align-items-center gap-1.5 py-1.5 px-3 rounded-pill border"
              style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}
            >
              <Flame size={13} className="m-1" style={{ color: '#ea580c' }} /> {heatLevel}
            </span>
          )}

          {timeMinutes && (
            <span
              className="badge font-label text-xs d-inline-flex align-items-center gap-1.5 py-1.5 px-3 rounded-pill border"
              style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}
            >
              <Clock size={13} className="m-1" style={{ color: '#ea580c' }} /> {formatDuration(timeMinutes)}
            </span>
          )}

          <button
            type="button"
            className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary-chef'} rounded-pill px-3.5 text-xs fw-semibold shadow-xs`}
            onClick={onToggleComplete}
          >
            {isCompleted ? 'Done' : 'Mark Done'}
          </button>
        </div>
      </div>

      {/* Full-Width Step Ingredients Bubbles (Spans entire card width) */}
      {renderQuantityChips(quantityDetails)}

      {/* Instruction Body */}

      <p className="text-dark leading-relaxed text-sm mb-3 pt-1 m-1">
        {instruction}
      </p>

      {/* Interactive Timer & Visual Cue Bar */}
      <div className="row g-2.5 align-items-center mt-2 pt-3 border-top">
        {/* Visual Cue */}
        {visualCue && (
          <div className="col-12 col-md-7">
            <div
              className="p-3 rounded-4 border d-flex align-items-center gap-2.5 text-xs shadow-xs"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            >
              <Eye size={18} className="flex-shrink-0" style={{ color: '#ea580c' }} />
              <div>
                <strong className="text-dark m-1">Visual Cue:</strong> <span className="text-muted">{visualCue}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step Timer Action Button (Mapped to Master Kitchen Timer) */}
        {timeMinutes && (
          <div className={`col-12 ${visualCue ? 'col-md-5' : 'col-12'} d-flex align-items-center justify-content-md-end p-1`}>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3.5 py-2 text-xs font-label fw-bold d-inline-flex align-items-center gap-1.5 transition-all shadow-xs ${isTimerRunning
                ? 'btn-light border text-muted opacity-60 cursor-not-allowed'
                : 'btn-primary-chef text-white hover-scale'
                }`}
              onClick={handleSetStepTimer}
              disabled={isTimerRunning}
              title={isTimerRunning ? 'Master Kitchen Timer is currently running' : `Set master timer for ${timeMinutes} mins`}
            >
              <Clock size={14} className={isTimerRunning ? 'text-muted m-1' : 'text-warning m-1'} />
              <span>{isTimerRunning ? 'Timer Running' : `Set Timer (${timeMinutes}m)`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
