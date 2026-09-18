import React, { useState } from 'react';
import { Flame, Clock, Users, Zap, Bookmark, Sparkles, Share2, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useRecipe } from '../../context/RecipeContext';
import { useTimer } from '../../context/TimerContext';
import { formatDuration } from '../../utils/formatters';
import RecipePdfTemplate from './RecipePdfTemplate';

export default function RecipeHeader({ recipe, onOpenKitchenMode }) {
  const { toggleSaveRecipe } = useRecipe();
  const { enableKeepAwake } = useTimer();
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!recipe) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const element = document.getElementById('chefmate-pdf-template');
      if (!element) return;

      const sanitizeName = (recipe.dishName || 'Recipe').replace(/[^a-z0-9]/gi, '_');
      const filename = `${sanitizeName}_ChefMate_AI.pdf`;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.dishName ? `${recipe.dishName} — ChefMate AI` : 'ChefMate AI Recipe',
      text: `Check out this recipe for ${recipe.dishName || 'a delicious dish'} on ChefMate AI!`,
      url: window.location.href,
    };

    // 1. Try Native Mobile Web Share API
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    // 2. Try Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn('Clipboard write failed, using fallback:', err);
      }
    }

    // 3. Fallback for non-HTTPS / Local Network IP addresses
    try {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (fallbackErr) {
      console.error('All copy methods failed:', fallbackErr);
    }
  };

  return (
    <div className="card-chefmate rounded-5 p-4 p-lg-5 shadow-luxury mb-4 position-relative overflow-hidden">
      {/* Decorative ambient background accent */}
      <div
        className="position-absolute top-0 end-0 p-5 rounded-circle opacity-30 blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(234, 88, 12, 0.25) 0%, transparent 70%)', width: 300, height: 300 }}
      ></div>

      <div className="row g-4 align-items-center">
        <div className="col-lg-8">
          {/* Badges */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span className="badge badge-chef-primary d-inline-flex align-items-center gap-1">
              <Sparkles size={13} /> Formulated Master Guide
            </span>
            <span className="badge badge-chef-gold d-inline-flex align-items-center gap-1">
              <Flame size={13} /> {recipe.spiceLevel} Spice
            </span>
            <span className="badge badge-chef-green d-inline-flex align-items-center gap-1">
              <Zap size={13} /> {recipe.cookingMethod}
            </span>
          </div>

          {/* Dish Title */}
          <h1 className="font-display fw-extrabold display-4 text-dark mb-3 tracking-tight">
            {recipe.dishName}
          </h1>

          <p className="text-muted text-lg leading-relaxed mb-4">
            AI-crafted sequential culinary guide scaled for {recipe.servings} {recipe.servings === 1 ? 'person' : 'people'}. Follow exact heat cues and timing below.
          </p>

          {/* Telemetry Bar */}
          <div className="row g-3">
            {/* Card 1: Total Time (Full Width on Mobile, 1/3 on Desktop) */}
            <div className="col-12 col-sm-4">
              <div
                className="py-4 px-3.5 rounded-4 h-100 d-flex flex-column align-items-center justify-content-center text-center shadow-xs"
                style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-subtle)' }}
              >
                <Clock size={24} className="mb-2 flex-shrink-0" style={{ color: '#ea580c' }} />
                <div className="font-display fw-bold fs-5 text-dark leading-tight mb-0.5">{formatDuration(recipe.totalTimeMinutes || 30)}</div>
                <div className="text-xs text-muted fw-semibold">Total Time</div>
              </div>
            </div>

            {/* Card 2: Servings (Half Width on Mobile, 1/3 on Desktop) */}
            <div className="col-6 col-sm-4">
              <div
                className="py-4 px-3.5 rounded-4 h-100 d-flex flex-column align-items-center justify-content-center text-center shadow-xs"
                style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-subtle)' }}
              >
                <Users size={24} className="mb-2 flex-shrink-0" style={{ color: '#ea580c' }} />
                <div className="font-display fw-bold fs-5 text-dark leading-tight mb-0.5">{recipe.servings || 2}</div>
                <div className="text-xs text-muted fw-semibold">Servings</div>
              </div>
            </div>

            {/* Card 3: Steps (Half Width on Mobile, 1/3 on Desktop) */}
            <div className="col-6 col-sm-4">
              <div
                className="py-4 px-3.5 rounded-4 h-100 d-flex flex-column align-items-center justify-content-center text-center shadow-xs"
                style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border-subtle)' }}
              >
                <Flame size={24} className="mb-2 flex-shrink-0" style={{ color: '#ea580c' }} />
                <div className="font-display fw-bold fs-5 text-dark leading-tight mb-0.5">{recipe.steps?.length || 0}</div>
                <div className="text-xs text-muted fw-semibold">Total Steps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Cluster */}
        <div className="col-lg-4 d-flex flex-column align-items-lg-end gap-3 position-relative z-2">
          {/* 1. Launch Live Kitchen Mode Button */}
          <button
            type="button"
            className="btn btn-primary-chef py-3.5 px-4 w-100 fs-6 font-display fw-bold d-flex align-items-center justify-content-center gap-2 rounded-4 shadow-luxury cursor-pointer select-none"
            style={{ touchAction: 'manipulation' }}
            onClick={(e) => {
              e.stopPropagation();
              enableKeepAwake();
              if (onOpenKitchenMode) onOpenKitchenMode();
            }}
          >
            <Flame size={22} className="pulse-cooking" style={{ pointerEvents: 'none' }} />
            <span style={{ pointerEvents: 'none' }}>Launch Live Kitchen Mode</span>
          </button>

          {/* 2. Save Recipe & Share Button Group */}
          <div className="d-flex gap-2 w-100">
            <button
              type="button"
              className={`btn ${recipe.isSaved ? 'btn-primary-chef text-white shadow-xs' : 'btn-secondary-chef'} py-2.5 px-3 w-50 font-label fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3 cursor-pointer select-none transition-all`}
              style={{ touchAction: 'manipulation' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveRecipe(recipe._id);
              }}
            >
              <Bookmark size={18} className={recipe.isSaved ? 'fill-white' : ''} style={{ pointerEvents: 'none' }} />
              <span style={{ pointerEvents: 'none' }}>{recipe.isSaved ? 'Saved' : 'Save Recipe'}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary-chef py-2.5 px-3 w-50 font-label fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3 cursor-pointer select-none transition-all"
              style={{ touchAction: 'manipulation' }}
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <Share2 size={18} style={{ pointerEvents: 'none' }} />
              <span style={{ pointerEvents: 'none' }}>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* 3. Download Custom PDF Button (Placed under Save Recipe & Share) */}
          <button
            type="button"
            className="btn btn-outline-chefmate py-2.5 px-3 w-100 font-label fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3 cursor-pointer select-none transition-all shadow-xs"
            style={{ touchAction: 'manipulation' }}
            disabled={isDownloadingPdf}
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadPdf();
            }}
          >
            {isDownloadingPdf ? (
              <>
                <div className="spinner-border spinner-border-sm" style={{ color: '#ea580c', width: 16, height: 16 }} role="status" />
                <span style={{ pointerEvents: 'none' }}>Generating Custom PDF...</span>
              </>
            ) : (
              <>
                <Download size={18} style={{ pointerEvents: 'none' }} />
                <span style={{ pointerEvents: 'none' }}>Download Recipe PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Off-screen Custom PDF Template Parser Container */}
      <div style={{ position: 'absolute', top: '-99999px', left: '-99999px', pointerEvents: 'none', opacity: 0 }}>
        <RecipePdfTemplate recipe={recipe} />
      </div>
    </div>
  );
}
