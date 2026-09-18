import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { Clock, Play, Pause, RotateCcw, Minus, X, Bell, Plus, Sparkles, Sun } from 'lucide-react';

export default function FloatingTimerCard() {
  const {
    secondsLeft,
    initialSeconds,
    isRunning,
    isCardOpen,
    isAlarming,
    isWakeLockActive,
    startTimer,
    pauseTimer,
    resetTimer,
    setPresetSeconds,
    addTime,
    closeCard,
    dismissAlarm,
    formatTimer,
  } = useTimer();

  const [customMins, setCustomMins] = useState('5');

  if (!isCardOpen) return null;

  const handleCustomSet = (e) => {
    e.preventDefault();
    const val = parseInt(customMins, 10);
    if (!isNaN(val) && val > 0) {
      setPresetSeconds(val * 60);
    }
  };

  const progressPercent = initialSeconds > 0 ? Math.max(0, Math.min(100, (secondsLeft / initialSeconds) * 100)) : 0;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
      style={{
        backgroundColor: 'rgba(28, 25, 23, 0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1060,
      }}
      onClick={closeCard}
    >
      <div
        className="card-chefmate rounded-5 p-4 p-sm-4.5 shadow-luxury bg-white border position-relative overflow-hidden w-100 animate-scale-up"
        style={{
          maxWidth: '420px',
          boxShadow: '0 24px 48px rgba(28, 25, 23, 0.25)',
          borderColor: isAlarming ? '#ea580c' : 'rgba(234, 88, 12, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Collapse & Close Controls */}
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div
              className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs"
              style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
            >
              <Clock size={18} />
            </div>
            <div>
              <h6 className="font-display fw-bold text-dark m-0">Kitchen Master Timer</h6>
              <span className="text-xs text-muted font-label">Hands-Free Cooking Clock</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-1">
            {/* Collapse / Minimize Button */}
            <button
              type="button"
              className="btn btn-sm btn-light border rounded-circle p-0 d-inline-flex align-items-center justify-content-center transition-all hover-bg-light"
              onClick={closeCard}
              title="Collapse to Navbar"
              style={{ width: 32, height: 32, lineHeight: 0 }}
            >
              <Minus size={16} className="text-dark d-block m-auto" />
            </button>
            {/* Close Button */}
            <button
              type="button"
              className="btn btn-sm btn-light border rounded-circle p-0 d-inline-flex align-items-center justify-content-center transition-all hover-bg-light"
              onClick={closeCard}
              title="Close Timer Window"
              style={{ width: 32, height: 32, lineHeight: 0 }}
            >
              <X size={16} className="text-dark d-block m-auto" />
            </button>
          </div>
        </div>

        {/* Time's Up Alarming Banner */}
        {isAlarming && (
          <div className="alert alert-warning border border-warning p-3 rounded-4 mb-3 d-flex align-items-center justify-content-between animate-pulse">
            <div className="d-flex align-items-center gap-2 text-xs text-dark fw-bold">
              <Bell size={18} className="text-danger flex-shrink-0 animate-bounce" />
              <span>⏰ Time's Up! Chef, check your dish! </span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-dark rounded-pill px-3 text-xs"
              onClick={dismissAlarm}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Big Monospace Digital Timer Display */}
        <div className="text-center my-3 py-2 bg-dark rounded-4 p-3 position-relative overflow-hidden shadow-inner">
          {/* Subtle Progress Bar */}
          <div
            className="position-absolute bottom-0 start-0 top-0 opacity-20"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #ea580c, #f59e0b)',
              transition: 'width 1s linear',
            }}
          ></div>

          <div className="font-mono display-4 fw-extrabold text-warning position-relative z-1 tracking-wider">
            {formatTimer(secondsLeft)}
          </div>

          <div className="text-xs font-label text-light opacity-75 mt-1 position-relative z-1 d-flex align-items-center justify-content-center gap-2">
            <span>{isRunning ? '⏱️ Timer Running...' : secondsLeft === 0 ? 'Completed' : 'Timer Ready'}</span>
            {isWakeLockActive && (
              <span className="badge bg-warning text-dark border px-2 py-0.5 rounded-pill text-xs d-inline-flex align-items-center gap-1 shadow-xs">
                <Sun size={11} /> Screen Awake Active
              </span>
            )}
          </div>
        </div>

        {/* Preset Time Buttons */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-1 mb-3">
          {[
            { label: '1 m', secs: 60 },
            { label: '5 m', secs: 300 },
            { label: '10 m', secs: 600 },
            { label: '15 m', secs: 900 },
            { label: '30 m', secs: 1800 },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-sm btn-light border font-label text-xs fw-semibold rounded-pill px-2.5 py-1 transition-all hover-border-danger"
              onClick={() => {
                if (isRunning) {
                  addTime(preset.secs);
                } else {
                  setPresetSeconds(preset.secs);
                }
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Quick Custom Input */}
        <form onSubmit={handleCustomSet} className="d-flex align-items-center gap-2 mb-3">
          <div className="input-group input-group-sm">
            <input
              type="number"
              min="1"
              max="180"
              className="form-control rounded-start-pill text-center text-xs font-mono fw-bold"
              value={customMins}
              onChange={(e) => setCustomMins(e.target.value)}
              placeholder="Mins"
            />
            <span className="input-group-text bg-light text-xs font-label">mins</span>
          </div>
          <button type="submit" className="btn btn-sm btn-outline-chefmate rounded-end-pill px-3 text-xs fw-semibold flex-shrink-0">
            Set
          </button>
        </form>

        {/* Action Controls Row */}
        <div className="d-flex align-items-center gap-2 pt-1">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-warning rounded-pill flex-1 py-2 text-xs font-display fw-bold d-inline-flex align-items-center justify-content-center gap-1.5 text-dark shadow-xs"
              onClick={pauseTimer}
            >
              <Pause size={15} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary-chef rounded-pill flex-1 py-2 text-xs font-display fw-bold d-inline-flex align-items-center justify-content-center gap-1.5 shadow-xs"
              onClick={startTimer}
            >
              <Play size={15} />
              <span>{secondsLeft === 0 ? 'Restart' : 'Start Timer'}</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-light border rounded-pill py-2 px-3 text-xs font-display fw-semibold d-inline-flex align-items-center gap-1 hover-bg-light"
            onClick={resetTimer}
            title="Reset Timer"
          >
            <RotateCcw size={14} className="text-muted" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
