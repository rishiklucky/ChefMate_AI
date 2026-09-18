import React from 'react';
import { ChefHat } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export default function RecipePdfTemplate({ recipe }) {
  if (!recipe) return null;

  const steps = recipe.steps || [];
  const ingredients = recipe.ingredients || [];
  const tips = recipe.tips || [];
  const commonMistakes = recipe.commonMistakes || [];
  const servingSuggestion = recipe.servingSuggestion;
  const storageInstructions = recipe.storageInstructions;
  const nutritionNote = recipe.nutritionNote;

  return (
    <div
      id="chefmate-pdf-template"
      style={{
        width: '710px',
        backgroundColor: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#1c1917',
        padding: '24px 28px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Brand Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #ea580c',
          paddingBottom: '14px',
          marginBottom: '20px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
            }}
          >
            <ChefHat size={24} />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '20px',
                color: '#1c1917',
                letterSpacing: '-0.02em',
              }}
            >
              ChefMate <span style={{ color: '#ea580c' }}>AI</span>
            </h2>
            <span style={{ fontSize: '10px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Master Culinary Recipe Guide
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              backgroundColor: '#ffedd5',
              color: '#431407',
              fontSize: '10px',
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: '9999px',
              border: '1px solid #fed7aa',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            ✦ Dynamic Precision Guide
          </span>
          <div style={{ fontSize: '10px', color: '#a8a29e', marginTop: '3px' }}>
            Generated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Recipe Header Card */}
      <div
        style={{
          backgroundColor: '#fff9f6',
          borderRadius: '14px',
          border: '1px solid #ebd2c8',
          padding: '20px',
          marginBottom: '20px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '24px',
            color: '#ea580c',
            lineHeight: 1.2,
          }}
        >
          {recipe.dishName || 'Master Culinary Recipe'}
        </h1>

        {recipe.description && (
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#57534e', lineHeight: 1.5 }}>
            {recipe.description}
          </p>
        )}

        {/* Quick Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2ddd5',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9px', color: '#78716c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
              Servings
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1c1917' }}>
              {recipe.servings || 2} {recipe.servings === 1 ? 'Person' : 'People'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2ddd5',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9px', color: '#78716c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
              Spice Level
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ea580c' }}>
              {recipe.spiceLevel || 'Medium'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2ddd5',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9px', color: '#78716c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
              Appliance
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1c1917' }}>
              {recipe.cookingMethod || 'Gas Stove'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2ddd5',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9px', color: '#78716c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
              Total Time
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1c1917' }}>
              {formatDuration(recipe.totalTimeMinutes || 30)}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Required Ingredients Table */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            color: '#1c1917',
            marginBottom: '12px',
            borderLeft: '4px solid #ea580c',
            paddingLeft: '10px',
          }}
        >
          1. Ingredients Checklist ({ingredients.length} items)
        </h3>

        <table
          style={{
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #f2ddd5',
            fontSize: '11px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#fdf3ef', color: '#431407', textAlign: 'left', fontWeight: 700, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <th style={{ padding: '8px 10px', width: '6%', borderBottom: '1px solid #ebd2c8' }}>#</th>
              <th style={{ padding: '8px 10px', width: '32%', borderBottom: '1px solid #ebd2c8' }}>Ingredient</th>
              <th style={{ padding: '8px 10px', width: '14%', borderBottom: '1px solid #ebd2c8' }}>Quantity</th>
              <th style={{ padding: '8px 10px', width: '14%', borderBottom: '1px solid #ebd2c8' }}>Unit</th>
              <th style={{ padding: '8px 10px', width: '34%', borderBottom: '1px solid #ebd2c8' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, idx) => (
              <tr
                key={ing.id || idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fffaf8',
                  borderBottom: idx === ingredients.length - 1 ? 'none' : '1px solid #f8e8e2',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid',
                }}
              >
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#ea580c' }}>{idx + 1}</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#1c1917', wordBreak: 'break-word' }}>{ing.name}</td>
                <td style={{ padding: '8px 10px', color: '#44403c', fontWeight: 600 }}>{ing.quantity}</td>
                <td style={{ padding: '8px 10px', color: '#44403c' }}>{ing.unit || '—'}</td>
                <td style={{ padding: '8px 10px', color: '#78716c', fontStyle: 'italic', wordBreak: 'break-word' }}>{ing.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 2: Sequential Step-by-Step Instructions */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            color: '#1c1917',
            marginBottom: '14px',
            borderLeft: '4px solid #ea580c',
            paddingLeft: '10px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          2. Step-by-Step Cooking Instructions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {steps.map((step, idx) => (
            <div
              key={step.stepNumber || idx}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ebd2c8',
                borderRadius: '12px',
                padding: '14px 16px',
                boxShadow: '0 2px 6px rgba(28, 25, 23, 0.02)',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  borderBottom: '1px solid #f8e8e2',
                  paddingBottom: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    STEP {step.stepNumber || idx + 1}
                  </span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '14px', color: '#1c1917' }}>
                    {step.title}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', fontSize: '10px' }}>
                  {step.timeMinutes > 0 && (
                    <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 7px', borderRadius: '6px', fontWeight: 700 }}>
                      ⏱ {step.timeMinutes} mins
                    </span>
                  )}
                  {step.heatLevel && (
                    <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 7px', borderRadius: '6px', fontWeight: 700 }}>
                      🔥 {step.heatLevel} Heat
                    </span>
                  )}
                </div>
              </div>

              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#292524', lineHeight: 1.5, fontWeight: 500 }}>
                {step.instruction}
              </p>

              {step.visualCue && (
                <div
                  style={{
                    backgroundColor: 'rgba(234, 88, 12, 0.05)',
                    borderLeft: '3px solid #ea580c',
                    padding: '6px 10px',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '11px',
                    color: '#c2410c',
                    fontWeight: 600,
                  }}
                >
                  👁 <strong style={{ color: '#ea580c' }}>Visual Cue:</strong> {step.visualCue}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Pro Chef Guidance, Tips, Mistakes & Storage */}
      {(tips.length > 0 || commonMistakes.length > 0 || servingSuggestion || storageInstructions || nutritionNote) && (
        <div style={{ marginBottom: '24px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '16px',
              color: '#1c1917',
              marginBottom: '14px',
              borderLeft: '4px solid #ea580c',
              paddingLeft: '10px',
            }}
          >
            3. Pro Chef Guidance & Tips for Success
          </h3>

          {/* Top Row: Chef Tips & Common Mistakes side by side */}
          {(tips.length > 0 || commonMistakes.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: tips.length > 0 && commonMistakes.length > 0 ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '12px' }}>
              {/* Chef Tips */}
              {tips.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#fff9f6',
                    border: '1px solid #ebd2c8',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}
                >
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '12px', color: '#b45309', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💡 Chef Tips for Success
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#292524', lineHeight: 1.5 }}>
                    {tips.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: idx === tips.length - 1 ? 0 : '5px' }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {commonMistakes.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fed7d7',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}
                >
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '12px', color: '#c53030', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚠️ Common Mistakes to Avoid
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#292524', lineHeight: 1.5, listStyleType: 'none' }}>
                    {commonMistakes.map((m, idx) => (
                      <li key={idx} style={{ marginBottom: idx === commonMistakes.length - 1 ? 0 : '5px', position: 'relative', paddingLeft: '14px' }}>
                        <span style={{ color: '#e53e3e', fontWeight: 800, position: 'absolute', left: 0 }}>✕</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bottom Row: Serving, Storage & Nutrition */}
          {(servingSuggestion || storageInstructions || nutritionNote) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {servingSuggestion && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ebd2c8',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#ea580c', marginBottom: '3px' }}>
                    🍽️ Serving Suggestion
                  </div>
                  <div style={{ fontSize: '10px', color: '#44403c', lineHeight: 1.4 }}>
                    {servingSuggestion}
                  </div>
                </div>
              )}

              {storageInstructions && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ebd2c8',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803d', marginBottom: '3px' }}>
                    📦 Storage & Leftovers
                  </div>
                  <div style={{ fontSize: '10px', color: '#44403c', lineHeight: 1.4 }}>
                    {storageInstructions}
                  </div>
                </div>
              )}

              {nutritionNote && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ebd2c8',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#c2410c', marginBottom: '3px' }}>
                    ❤️ Nutrition Highlight
                  </div>
                  <div style={{ fontSize: '10px', color: '#44403c', lineHeight: 1.4 }}>
                    {nutritionNote}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Branding Banner */}
      <div
        style={{
          borderTop: '2px dashed #ebd2c8',
          paddingTop: '14px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#78716c',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <div>
          🍳 <strong>ChefMate AI</strong> — Master Culinary Precision & Smart Recipe Guidance
        </div>
        <div>
          www.chefmate-ai.com
        </div>
      </div>
    </div>
  );
}
