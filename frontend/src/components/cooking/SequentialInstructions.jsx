import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ListOrdered, Sparkles } from 'lucide-react';
import StepCard from './StepCard';

export default function SequentialInstructions({ steps = [], completedSteps = {}, toggleStepComplete }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sliderRef = useRef(null);

  const totalSteps = steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  // Track scroll position to update activeStepIndex on swipe/scroll
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        setActiveStepIndex(Math.min(totalSteps - 1, Math.max(0, index)));
      }
    }
  };

  const scrollToStep = (index) => {
    if (sliderRef.current) {
      const targetIndex = Math.min(totalSteps - 1, Math.max(0, index));
      const clientWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: targetIndex * clientWidth,
        behavior: 'smooth',
      });
      setActiveStepIndex(targetIndex);
    }
  };

  const goToPrev = () => {
    if (activeStepIndex > 0) {
      scrollToStep(activeStepIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeStepIndex < totalSteps - 1) {
      scrollToStep(activeStepIndex + 1);
    }
  };

  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-100 mb-3 pt-2">
      {/* Header Row Card */}
      <div className="bg-white p-4 p-md-4 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        {/* Left: Logo Icon beside Main Heading + Subtitle below */}
        <div className="d-flex flex-column gap-1.5 min-w-0">
          <div className="d-flex align-items-center gap-2.5 min-w-0">
            <div
              className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
            >
              <ListOrdered size={16} />
            </div>
            <h5 className="font-display fw-bold text-dark m-0 text-truncate fs-6 fs-md-5 m-1">Sequential Instructions</h5>
          </div>
          <p className="text-muted text-xs font-label m-0 d-inline-flex align-items-center gap-1.5 m-1">
            <Sparkles size={13} className="text-warning flex-shrink-0 m-1" />
            <span>Swipe horizontally or use controls to view steps sequentially</span>
          </p>
        </div>

        {/* Header Right Controls & Badges */}
        <div className="d-flex align-items-center gap-2 gap-sm-2.5 flex-nowrap ms-auto ms-sm-0 flex-shrink-0">
          {/* Active Step Counter Badge */}
          <span
            className="badge font-label text-xs py-1.5 px-2.5 px-sm-3 rounded-pill border fw-bold flex-shrink-0"
            style={{ backgroundColor: 'rgba(234, 88, 12, 0.08)', color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.25)' }}
          >
            Step {activeStepIndex + 1} of {totalSteps}
          </span>

          {/* Steps Completed Counter */}
          <span className="badge badge-chef-green px-2.5 px-sm-3 py-1.5 rounded-pill text-xs fw-semibold flex-shrink-0">
            {completedCount} of {totalSteps} Done
          </span>

          {/* Slider Arrow Buttons right beside Done block */}
          <div className="d-flex align-items-center gap-1.5 flex-shrink-0 ms-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-chefmate rounded-circle p-0 d-inline-flex align-items-center justify-content-center transition-all"
              onClick={goToPrev}
              disabled={activeStepIndex === 0}
              title="Previous Step"
              style={{ width: 32, height: 32, lineHeight: 0, opacity: activeStepIndex === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} className="d-block m-auto" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-chefmate rounded-circle p-0 d-inline-flex align-items-center justify-content-center transition-all m-1"
              onClick={goToNext}
              disabled={activeStepIndex === totalSteps - 1}
              title="Next Step"
              style={{ width: 32, height: 32, lineHeight: 0, opacity: activeStepIndex === totalSteps - 1 ? 0.4 : 1 }}
            >
              <ChevronRight size={16} className="d-block m-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Step Cards Slidable Track (Dynamic Height Adapts to Active Card) */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="d-flex flex-row flex-nowrap overflow-x-auto no-scrollbar w-100 rounded-4 align-items-start"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <div
              key={step.stepNumber || idx}
              className="w-100 flex-shrink-0 transition-all"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                height: isActive ? 'auto' : 0,
                overflow: isActive ? 'visible' : 'hidden',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.25s ease-in-out',
              }}
            >
              <StepCard
                step={step}
                isCompleted={!!completedSteps[step.stepNumber]}
                onToggleComplete={() => {
                  const willBeCompleted = !completedSteps[step.stepNumber];
                  toggleStepComplete(step.stepNumber);
                  if (willBeCompleted && idx < totalSteps - 1) {
                    setTimeout(() => scrollToStep(idx + 1), 350);
                  }
                }}
                className="mb-0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
