import React from 'react';
import { Flame, Clock, Users, Zap, Bookmark, Sparkles, Share2 } from 'lucide-react';
import { useRecipe } from '../../context/RecipeContext';
import { formatDuration } from '../../utils/formatters';

export default function RecipeHeader({ recipe, onOpenKitchenMode }) {
  const { toggleSaveRecipe } = useRecipe();
  const [copied, setCopied] = React.useState(false);

  if (!recipe) return null;

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
                <Clock size={24} className="text-danger mb-2 flex-shrink-0" />
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
                <Users size={24} className="text-danger mb-2 flex-shrink-0" />
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
                <Flame size={24} className="text-danger mb-2 flex-shrink-0" />
                <div className="font-display fw-bold fs-5 text-dark leading-tight mb-0.5">{recipe.steps?.length || 0}</div>
                <div className="text-xs text-muted fw-semibold">Total Steps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Cluster */}
        <div className="col-lg-4 d-flex flex-column align-items-lg-end gap-3">
          <button
            type="button"
            className="btn btn-primary-chef py-3.5 px-4 w-100 fs-6 font-display fw-bold d-flex align-items-center justify-content-center gap-2 rounded-4 shadow-luxury"
            onClick={onOpenKitchenMode}
          >
            <Flame size={22} className="pulse-cooking" />
            <span>Launch Live Kitchen Mode</span>
          </button>

          <div className="d-flex gap-2 w-100">
            <button
              type="button"
              className={`btn ${recipe.isSaved ? 'btn-danger' : 'btn-secondary-chef'} py-2.5 px-3 w-50 font-label fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3`}
              onClick={() => toggleSaveRecipe(recipe._id)}
            >
              <Bookmark size={18} className={recipe.isSaved ? 'fill-white' : ''} />
              <span>{recipe.isSaved ? 'Saved' : 'Save Recipe'}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary-chef py-2.5 px-3 w-50 font-label fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3"
              onClick={handleShare}
            >
              <Share2 size={18} />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
