import React, { useState, useRef } from 'react';
import { CheckSquare, Square, ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';

export default function IngredientChecklist({ ingredients = [] }) {
  const [checkedState, setCheckedState] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);

  const mobileScrollRef = useRef(null);
  const desktopScrollRef = useRef(null);

  const ITEMS_PER_PAGE = 4;
  const total = ingredients.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  // Chunk ingredients into pages of 4 items for mobile sliding
  const pages = [];
  for (let i = 0; i < total; i += ITEMS_PER_PAGE) {
    pages.push(ingredients.slice(i, i + ITEMS_PER_PAGE));
  }

  const toggleCheck = (idx) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checkedCount = Object.values(checkedState).filter(Boolean).length;

  const handleMobileScroll = (e) => {
    const { scrollLeft, clientWidth } = e.target;
    if (clientWidth > 0) {
      const pageIndex = Math.round(scrollLeft / clientWidth);
      setActiveSlide(Math.min(totalPages - 1, Math.max(0, pageIndex)));
    }
  };

  const scrollDesktop = (direction) => {
    if (desktopScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      desktopScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="card-chefmate p-4 p-md-4.5 rounded-4 shadow-sm mb-4 w-100 overflow-hidden">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2 min-w-0 flex-shrink-1">
          <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
            <ShoppingBag size={16} />
          </div>
          <h5 className="font-display fw-bold text-dark m-0 text-truncate fs-6 fs-md-5">Ingredients CheckList</h5>
        </div>

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {/* Tablet & PC Desktop Scroll Arrow Buttons */}
          <div className="d-none d-md-flex align-items-center gap-1 me-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-chefmate rounded-circle p-1.5 d-inline-flex align-items-center justify-content-center transition-all"
              onClick={() => scrollDesktop('left')}
              title="Slide Left"
              style={{ width: 32, height: 32 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-chefmate rounded-circle p-1.5 d-inline-flex align-items-center justify-content-center transition-all"
              onClick={() => scrollDesktop('right')}
              title="Slide Right"
              style={{ width: 32, height: 32 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 2-line badge on mobile (0 of X top line, Done bottom line), 1-line badge on desktop */}
          <span className="badge badge-chef-green px-2.5 px-sm-3 py-1.5 rounded-3 rounded-sm-pill text-xs flex-shrink-0 d-inline-flex flex-column flex-sm-row align-items-center justify-content-center gap-0.5 gap-sm-1 shadow-xs">
            <span className="fw-semibold">{checkedCount} of {total}</span>
            <span className="fw-semibold">Done</span>
          </span>
        </div>
      </div>

      {/* Progress Bar with Generous Margins */}
      <div className="progress mt-2.5 mb-4 rounded-pill" style={{ height: '8px', backgroundColor: 'var(--surface-container-low)' }}>
        <div
          className="progress-bar rounded-pill"
          role="progressbar"
          style={{
            width: `${total ? (checkedCount / total) * 100 : 0}%`,
            background: 'linear-gradient(90deg, #16a34a, #22c55e)',
          }}
        ></div>
      </div>

      {/* Tablet & PC View (md and up): Executive Slidable Ingredient Cards */}
      <div className="d-none d-md-block w-100">
        <div
          ref={desktopScrollRef}
          className="d-flex flex-row flex-nowrap overflow-x-auto no-scrollbar gap-4 py-2 px-1 w-100"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {ingredients.map((ing, idx) => {
            const isChecked = !!checkedState[idx];
            return (
              <div
                key={idx}
                className={`rounded-4 border d-flex flex-column justify-content-between align-items-center text-center cursor-pointer transition-all flex-shrink-0 ${isChecked ? 'bg-light border-success opacity-75' : 'bg-white hover-bg-light shadow-xs preference-card-option'
                  }`}
                style={{
                  width: '235px',
                  minHeight: '155px',
                  height: 'auto',
                  padding: '1.15rem 1.15rem 0.9rem 1.15rem',
                  borderColor: isChecked ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 88, 12, 0.18)',
                  boxShadow: '0 4px 14px rgba(28, 25, 23, 0.04)',
                }}
                onClick={() => toggleCheck(idx)}
              >
                {/* Top Row: Checkbox on Left, Quantity Badge on Right (Inset from curved borders) */}
                <div className="d-flex align-items-center justify-content-between w-100 mb-1.5">
                  <button
                    type="button"
                    className="btn p-0 border-0 text-success d-flex align-items-center flex-shrink-0 ms-1 mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheck(idx);
                    }}
                  >
                    {isChecked ? <CheckSquare size={20} className="text-success" /> : <Square size={20} className="text-muted" />}
                  </button>

                  {(ing.quantity || ing.unit) && (
                    <span
                      className="badge bg-light text-dark border font-label text-xs py-1 px-2.5 rounded-pill flex-shrink-0 text-truncate me-1 mt-0.5"
                      style={{
                        borderColor: 'rgba(234, 88, 12, 0.2)',
                        backgroundColor: 'var(--surface-container-low)',
                        color: 'var(--text-main)',
                        maxWidth: '120px',
                      }}
                    >
                      {ing.quantity} {ing.unit}
                    </span>
                  )}
                </div>

                {/* Middle & Bottom Content: Centered Ingredient Name & Optional Note */}
                <div className="w-100 px-1 my-auto d-flex flex-column align-items-center justify-content-center text-center py-1">
                  <div
                    className={`font-label fw-bold text-dark text-sm leading-snug mb-1 text-center ${isChecked ? 'text-decoration-line-through text-muted' : ''
                      }`}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                    }}
                    title={ing.name}
                  >
                    {ing.name}
                  </div>

                  {ing.note && (
                    <div
                      className="text-muted text-xs leading-snug text-center w-100"
                      style={{
                        fontSize: '0.78rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                      }}
                      title={ing.note}
                    >
                      {ing.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View (sm and down): Horizontal Slidable Slides of 4 Ingredients Each */}
      <div className="d-block d-md-none w-100">
        {/* Page Indicator Header Badge */}
        {totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-center bg-light p-2 px-3 rounded-4 border mb-3 shadow-xs">
            <span className="badge bg-white text-dark border font-label text-xs px-3 py-1.5 rounded-pill fw-bold shadow-xs">
              Page {activeSlide + 1} of {totalPages}
            </span>
          </div>
        )}

        {/* Slidable Carousel Container */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="d-flex flex-row flex-nowrap overflow-x-auto no-scrollbar w-100 pb-1"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            gap: '1.25rem',
          }}
        >
          {pages.map((pageItems, pageIdx) => (
            <div
              key={pageIdx}
              className="w-100 flex-shrink-0 d-flex flex-column gap-3"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              {pageItems.map((ing, itemInPageIdx) => {
                const absIdx = pageIdx * ITEMS_PER_PAGE + itemInPageIdx;
                const isChecked = !!checkedState[absIdx];
                return (
                  <IngredientRow
                    key={absIdx}
                    ing={ing}
                    idx={absIdx}
                    isChecked={isChecked}
                    onToggle={() => toggleCheck(absIdx)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Small Helper Message & Active Page Indicator below Slidable Container */}
        <div className="mt-3.5 pt-1 d-flex flex-column align-items-center gap-2.5">
          {/* Active Page Indicator Dots (Perfect Circles) */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">
              {pages.map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-circle transition-all"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: activeSlide === idx ? '#ea580c' : '#cbd5e1',
                    transform: activeSlide === idx ? 'scale(1.25)' : 'scale(1)',
                    boxShadow: activeSlide === idx ? '0 0 6px rgba(234, 88, 12, 0.4)' : 'none',
                  }}
                />
              ))}
            </div>
          )}

          {/* Small Helper Message */}
          <div className="text-center text-xs text-muted fw-semibold d-flex align-items-center justify-content-center gap-1">
            <span>Swipe horizontally to view all required ingredients</span>
            <ChevronRight size={14} className="text-danger" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IngredientRow({ ing, idx, isChecked, onToggle }) {
  return (
    <div
      className={`p-3 px-3.5 rounded-4 border d-flex align-items-center justify-content-between gap-3 cursor-pointer transition-all w-100 overflow-hidden ${isChecked ? 'bg-light border-success opacity-75' : 'bg-white hover-bg-light shadow-xs'
        }`}
      style={{ borderColor: isChecked ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 88, 12, 0.12)' }}
      onClick={onToggle}
    >
      <div className="d-flex align-items-start gap-2.5 min-w-0 flex-grow-1">
        <button
          type="button"
          className="btn p-0 border-0 text-success d-flex align-items-center flex-shrink-0 mt-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isChecked ? <CheckSquare size={20} className="text-success" /> : <Square size={20} className="text-muted" />}
        </button>

        <div className="min-w-0 flex-grow-1 m-1">
          <div
            className={`font-label fw-bold text-dark text-sm leading-snug ${isChecked ? 'text-decoration-line-through text-muted' : ''
              }`}
            style={{ wordBreak: 'break-word' }}
          >
            {ing.name}
          </div>
          {ing.note && (
            <div className="text-muted text-xs mt-0.5 leading-tight" style={{ wordBreak: 'break-word' }}>
              {ing.note}
            </div>
          )}
        </div>
      </div>

      {(ing.quantity || ing.unit) && (
        <div
          className="badge font-label text-xs py-1.5 px-3 rounded-pill flex-shrink-0 my-auto align-self-center border"
          style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}
        >
          {ing.quantity} {ing.unit}
        </div>
      )}
    </div>
  );
}
