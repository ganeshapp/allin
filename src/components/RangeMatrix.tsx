import { useState, useEffect } from "react";
import type { RangeMatrix as RangeMatrixType } from "../types";
import { getHandLabels } from "../api/tauri";

interface Props {
  matrix: RangeMatrixType;
  onChange: (matrix: RangeMatrixType) => void;
  readOnly?: boolean;
  revealMatrix?: RangeMatrixType | null;
  compact?: boolean;
}

export function RangeMatrix({
  matrix,
  onChange,
  readOnly = false,
  revealMatrix = null,
  compact = false,
}: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

  useEffect(() => {
    getHandLabels().then(setLabels);
  }, []);

  const toggle = (index: number) => {
    if (readOnly) return;
    const hands = [...matrix.hands];
    hands[index] = !hands[index];
    onChange({ hands });
  };

  const cellClass = (index: number) => {
    const userSel = matrix.hands[index];
    const botSel = revealMatrix?.hands[index];
    if (revealMatrix) {
      if (userSel && botSel) return "cell-overlap";
      if (userSel) return "cell-user-only";
      if (botSel) return "cell-bot-only";
      return "cell-empty";
    }
    return userSel ? "cell-selected" : "cell-empty";
  };

  if (labels.length === 0) {
    return <div className="matrix-loading">Loading matrix…</div>;
  }

  return (
    <div className={`range-matrix-wrapper ${compact ? "compact" : ""}`}>
      <div className={`range-matrix ${compact ? "compact" : ""}`}>
        <div className="matrix-corner" />
        {ranks.map((r) => (
          <div key={`col-${r}`} className="matrix-label col-label">
            {r}
          </div>
        ))}
        {ranks.map((rowRank, row) => (
          <div key={`row-${rowRank}`} className="matrix-row">
            <div className="matrix-label row-label">{rowRank}</div>
            {ranks.map((_, col) => {
              const index = row * 13 + col;
              return (
                <button
                  key={index}
                  type="button"
                  className={`matrix-cell ${cellClass(index)}`}
                  onClick={() => toggle(index)}
                  disabled={readOnly}
                  title={labels[index]}
                >
                  <span className="cell-text">{labels[index]}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {revealMatrix && (
        <div className="matrix-legend">
          <span className="legend-item overlap">Overlap</span>
          <span className="legend-item user-only">Your guess</span>
          <span className="legend-item bot-only">Bot range</span>
        </div>
      )}
    </div>
  );
}

export function emptyMatrix(): RangeMatrixType {
  return { hands: Array(169).fill(false) };
}
