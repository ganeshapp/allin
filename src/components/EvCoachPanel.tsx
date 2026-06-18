import type { EvAnalysis } from "../types";

interface Props {
  analysis: EvAnalysis;
  onDismiss: () => void;
}

export function EvCoachPanel({ analysis, onDismiss }: Props) {
  return (
    <div className="ev-coach-panel-wrapper">
      <div className={`ev-coach-panel ${analysis.is_mistake ? "mistake" : "good"}`}>
        <div className="coach-header">
          <span className="coach-badge">
            {analysis.is_mistake ? "EV Coach — Heads Up" : "EV Coach"}
          </span>
          <button type="button" className="coach-close" onClick={onDismiss} aria-label="Dismiss">
            ×
          </button>
        </div>
        <p className="coach-explanation">{analysis.explanation}</p>
        <p className="coach-advisory">
          This is advice only — you can keep playing however you like.
        </p>
        <div className="coach-stats">
          <div className="stat">
            <span className="stat-label">Equity</span>
            <span className="stat-value">{analysis.equity_percent.toFixed(1)}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Pot Odds</span>
            <span className="stat-value">{analysis.pot_odds_percent.toFixed(1)}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">EV (Call)</span>
            <span className={`stat-value ${analysis.ev_call < 0 ? "negative" : "positive"}`}>
              ${analysis.ev_call.toFixed(2)}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Call Amount</span>
            <span className="stat-value">${analysis.call_amount.toFixed(2)}</span>
          </div>
        </div>
        <button type="button" className="btn btn-secondary coach-dismiss" onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
