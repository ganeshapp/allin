import type { GameState } from "../types";

interface Props {
  game: GameState;
}

export function HandHistory({ game }: Props) {
  const entries = [...game.action_history].reverse();

  return (
    <div className="hand-history">
      <h4>Hand History</h4>
      <div className="history-list">
        {entries.length === 0 ? (
          <p className="history-empty">No actions yet</p>
        ) : (
          entries.map((entry, i) => (
            <div key={`${entries.length - i}-${entry}`} className="history-entry">
              <span className="history-num">{entries.length - i}</span>
              <span className="history-text">{entry}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
