import React from 'react';
import { Lightbulb, AlertTriangle, Utensils, Archive, HeartPulse, ShieldAlert } from 'lucide-react';

export default function TipsSection({ recipe }) {
  if (!recipe) return null;

  const { tips = [], commonMistakes = [], servingSuggestion, storageInstructions, nutritionNote, warnings = [] } = recipe;

  return (
    <div className="mt-3">
      {/* Warnings alert if any essential item was omitted */}
      {warnings && warnings.length > 0 && (
        <div className="alert border p-4 rounded-4 shadow-sm mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-2">
            <ShieldAlert size={20} className="text-warning" />
            <span>Chef's Recipe Warning</span>
          </div>
          <ul className="mb-0 text-sm text-dark ps-3">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-4">
        {/* Chef Tips */}
        {tips.length > 0 && (
          <div className="col-md-6">
            <div className="card-chefmate p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Lightbulb size={18} />
                </div>
                <h5 className="font-display fw-bold text-dark m-0">Chef Tips for Success</h5>
              </div>
              <ul className="list-unstyled text-sm text-muted mb-0 d-flex flex-column gap-2.5">
                {tips.map((tip, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-2">
                    <span className="text-warning fw-bold">•</span>
                    <span className="text-dark">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {commonMistakes.length > 0 && (
          <div className="col-md-6">
            <div className="card-chefmate p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  <AlertTriangle size={18} />
                </div>
                <h5 className="font-display fw-bold text-dark m-0">Common Mistakes to Avoid</h5>
              </div>
              <ul className="list-unstyled text-sm text-muted mb-0 d-flex flex-column gap-2.5">
                {commonMistakes.map((m, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-2">
                    <span className="text-danger fw-bold">✕</span>
                    <span className="text-dark">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Serving Suggestion */}
        {servingSuggestion && (
          <div className="col-md-4">
            <div className="card-chefmate p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Utensils size={18} className="text-danger" />
                <h6 className="font-display fw-bold text-dark m-0">Serving Suggestion</h6>
              </div>
              <p className="text-sm text-muted mb-0">{servingSuggestion}</p>
            </div>
          </div>
        )}

        {/* Storage Instructions */}
        {storageInstructions && (
          <div className="col-md-4">
            <div className="card-chefmate p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Archive size={18} className="text-success" />
                <h6 className="font-display fw-bold text-dark m-0">Storage & Leftovers</h6>
              </div>
              <p className="text-sm text-muted mb-0">{storageInstructions}</p>
            </div>
          </div>
        )}

        {/* Nutrition Note */}
        {nutritionNote && (
          <div className="col-md-4">
            <div className="card-chefmate p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <HeartPulse size={18} className="text-danger" />
                <h6 className="font-display fw-bold text-dark m-0">Nutrition Highlight</h6>
              </div>
              <p className="text-sm text-muted mb-0">{nutritionNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
