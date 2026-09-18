import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import NoSleep from 'nosleep.js';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // Default 5 mins (300s)
  const [initialSeconds, setInitialSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  const audioCtxRef = useRef(null);
  const noSleepRef = useRef(null);

  // Initialize NoSleep instance
  useEffect(() => {
    noSleepRef.current = new NoSleep();
    return () => {
      if (noSleepRef.current && noSleepRef.current.isEnabled) {
        try {
          noSleepRef.current.disable();
        } catch (e) {
          // ignore cleanup error
        }
      }
    };
  }, []);

  // Enable NoSleep Screen Keep Awake
  const enableKeepAwake = () => {
    try {
      if (noSleepRef.current && !noSleepRef.current.isEnabled) {
        noSleepRef.current.enable();
      }
      setIsWakeLockActive(true);
    } catch (err) {
      console.warn('NoSleep enable error:', err);
      setIsWakeLockActive(true);
    }
  };

  // Disable NoSleep Screen Keep Awake
  const disableKeepAwake = () => {
    try {
      if (noSleepRef.current && noSleepRef.current.isEnabled) {
        noSleepRef.current.disable();
      }
    } catch (err) {
      console.warn('NoSleep disable error:', err);
    }
    setIsWakeLockActive(false);
  };

  // Synchronous Timer Controls with Keep Awake
  const startTimer = () => {
    if (secondsLeft === 0) setSecondsLeft(initialSeconds || 300);
    setIsRunning(true);
    setIsAlarming(false);
    enableKeepAwake();
  };

  const pauseTimer = () => {
    setIsRunning(false);
    disableKeepAwake();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
    setIsAlarming(false);
    disableKeepAwake();
  };

  const setPresetSeconds = (secs) => {
    setIsRunning(false);
    setInitialSeconds(secs);
    setSecondsLeft(secs);
    setIsAlarming(false);
  };

  const addTime = (secsToAdd) => {
    setSecondsLeft((prev) => prev + secsToAdd);
    setInitialSeconds((prev) => prev + secsToAdd);
  };

  // Re-engage Keep Awake on user tap/touch if timer is running
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isRunning && noSleepRef.current && !noSleepRef.current.isEnabled) {
        enableKeepAwake();
      }
    };

    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, [isRunning]);

  // Countdown effect
  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsAlarming(true);
      disableKeepAwake();
      playAlarmSound();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Web Audio API synth alarm sound
  const playAlarmSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const playBeep = (freq, duration, delay) => {
        setTimeout(() => {
          if (ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        }, delay);
      };

      // Play 3 pleasant kitchen timer beeps
      playBeep(880, 0.2, 0);
      playBeep(1174.66, 0.25, 250);
      playBeep(1760, 0.4, 550);
    } catch (e) {
      console.warn('AudioContext alert failed:', e);
    }
  };

  const openCard = () => setIsCardOpen(true);
  const closeCard = () => setIsCardOpen(false);
  const toggleCard = () => setIsCardOpen((prev) => !prev);
  const dismissAlarm = () => setIsAlarming(false);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <TimerContext.Provider
      value={{
        secondsLeft,
        initialSeconds,
        isRunning,
        isCardOpen,
        isAlarming,
        isWakeLockActive,
        enableKeepAwake,
        disableKeepAwake,
        startTimer,
        pauseTimer,
        resetTimer,
        setPresetSeconds,
        addTime,
        openCard,
        closeCard,
        toggleCard,
        dismissAlarm,
        formatTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
