import { useEffect, useState } from "react";
import { getMathBreakdown } from "../api/tauri";
import type { MathBreakdown } from "../types";

interface Props {
  onClose: () => void;
}

export function MathExplainer({ onClose }: Props) {
  const [breakdown, setBreakdown] = useState<MathBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMathBreakdown()
      .then(setBreakdown)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal math-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Math Breakdown</h3>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        {loading && <p>Calculating…</p>}
        {error && <p className="peek-error">{error}</p>}
        {breakdown && (
          <div className="math-breakdown">
            {breakdown.steps.map((step, i) => (
              <div key={i} className="math-step">
                <div className="math-step-label">{step.label}</div>
                <div className="math-step-formula">{step.formula}</div>
                <div className="math-step-result">{step.result}</div>
              </div>
            ))}
            <div className="math-recommendation">{breakdown.recommendation}</div>
          </div>
        )}
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
