import React from 'react';
import { ChefHat, Flame, Sparkles, Utensils } from 'lucide-react';

const TIMELINE_PHASES = [
  { title: 'Preparation', icon: ChefHat, desc: 'Chopping & Mis en place' },
  { title: 'Cooking', icon: Flame, desc: 'Sautéing & Heat induction' },
  { title: 'Finishing', icon: Sparkles, desc: 'Simmering & Garnishing' },
  { title: 'Serving', icon: Utensils, desc: 'Plating hot' },
];

export default function CookingTimeline() {
  return (
    <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
      <h6 className="font-display fw-bold text-dark mb-3 text-uppercase text-xs tracking-wider text-muted">
        Culinary Execution Timeline
      </h6>

      <div className="row g-2 text-center position-relative">
        {TIMELINE_PHASES.map((phase, idx) => {
          const IconComp = phase.icon;
          return (
            <div key={phase.title} className="col-3 position-relative">
              <div className="d-flex flex-column align-items-center">
                <div className="p-2.5 rounded-circle bg-light-danger text-danger mb-2 shadow-xs d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                  <IconComp size={20} />
                </div>
                <div className="font-display fw-bold text-dark text-xs">{phase.title}</div>
                <div className="text-muted text-xs d-none d-sm-block mt-0.5" style={{ fontSize: '10px' }}>{phase.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
