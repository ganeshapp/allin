import { useState } from "react";
import { saveHandHistory } from "../api/tauri";
import type { SessionSummary } from "../types";

interface Props {
  summary: SessionSummary;
  onClose: () => void;
}

export function SessionSummaryModal({ summary, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const download = async () => {
    if (!summary.export_text.trim()) {
      setStatus("No hand history to export.");
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      const path = await saveHandHistory(summary.export_text);
      if (path) {
        setStatus(`Saved to ${path}`);
      } else {
        setStatus("Save cancelled.");
      }
    } catch (e) {
      setStatus(`Failed to save: ${String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal session-summary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Session Summary</h3>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="session-stats-grid">
          <div className="session-stat">
            <span className="stat-label">Hands played</span>
            <span className="stat-value">{summary.hands_played}</span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Hands won</span>
            <span className="stat-value positive">{summary.hands_won}</span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Hands lost</span>
            <span className="stat-value negative">{summary.hands_lost}</span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Preflop folds</span>
            <span className="stat-value">{summary.preflop_folds}</span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Showdowns</span>
            <span className="stat-value">{summary.showdowns}</span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Net profit</span>
            <span className={`stat-value ${summary.net_profit >= 0 ? "positive" : "negative"}`}>
              ${summary.net_profit.toFixed(2)}
            </span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Ending stack</span>
            <span className="stat-value">${summary.ending_stack.toFixed(2)}</span>
          </div>
          <div className="session-stat">
            <span className="stat-label">Total pots won</span>
            <span className="stat-value">${summary.total_pot_won.toFixed(2)}</span>
          </div>
        </div>

        <section className="session-players">
          <h4>Table results</h4>
          <table className="lesson-table">
            <thead>
              <tr><th>Player</th><th>Start</th><th>End</th><th>Net</th></tr>
            </thead>
            <tbody>
              {summary.player_summaries.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>${p.starting_stack.toFixed(2)}</td>
                  <td>${p.ending_stack.toFixed(2)}</td>
                  <td className={p.net >= 0 ? "positive" : "negative"}>
                    {p.net >= 0 ? "+" : ""}${p.net.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="session-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={download}
            disabled={saving}
          >
            {saving ? "Saving…" : "Download Hand Histories"}
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
        {status && <p className="session-export-status">{status}</p>}
        <p className="session-export-hint">
          Hand histories are exported in PokerStars-compatible format for use with online analysis tools.
        </p>
      </div>
    </div>
  );
}
