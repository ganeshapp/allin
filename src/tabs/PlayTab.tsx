import { useState } from "react";
import { PokerTable } from "../components/PokerTable";
import { EvCoachPanel } from "../components/EvCoachPanel";
import { HandHistory } from "../components/HandHistory";
import { BotIntelPanel } from "../components/BotIntelPanel";
import { MathExplainer } from "../components/MathExplainer";
import { SessionSummaryModal } from "../components/SessionSummaryModal";
import { useGame } from "../hooks/useGame";
import type { SessionSummary } from "../types";

export function PlayTab() {
  const { game, loading, error, startSession, endSession, startHand, act, dismissCoach, stepBot } = useGame();
  const [showMath, setShowMath] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [ending, setEnding] = useState(false);

  if (loading) {
    return <div className="tab-loading">Loading table…</div>;
  }

  if (error) {
    return <div className="tab-error">Error: {error}</div>;
  }

  if (!game) return null;

  const isHeroTurn =
    !game.hand_over && game.players[game.action_on]?.is_human === true;
  const isBotTurn =
    !game.hand_over &&
    game.hand_number > 0 &&
    !game.players[game.action_on]?.is_human;
  const callAmount = Math.max(0, game.current_bet - game.players[0].bet);
  const raiseTo = Math.max(game.current_bet + 2.5, game.players[0].bet + 2.5);
  const actorName = game.players[game.action_on]?.is_human
    ? "You"
    : game.bots.find((b) => b.seat === game.action_on)?.name ?? "Bot";

  const handleEndSession = async () => {
    if (game.hand_number > 0 && !game.hand_over) {
      return;
    }
    setEnding(true);
    try {
      const result = await endSession();
      setSummary(result);
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="play-tab">
      <div className="play-toolbar">
        {game.session_active && (
          <span className="session-badge">
            Session · {game.session_hands_completed} hand{game.session_hands_completed !== 1 ? "s" : ""} played
          </span>
        )}
        <div className="toolbar-actions">
          {game.session_active && game.hand_number > 0 && !game.hand_over && (
            <button type="button" className="btn btn-secondary" onClick={() => setShowMath(true)}>
              Show Math
            </button>
          )}
          {!game.session_active ? (
            <button type="button" className="btn btn-primary" onClick={startSession}>
              Start Session
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={startHand}
                disabled={game.hand_number > 0 && !game.hand_over}
              >
                {game.hand_number === 0 ? "Deal First Hand" : "New Hand"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleEndSession}
                disabled={ending || (game.hand_number > 0 && !game.hand_over)}
              >
                End Session
              </button>
            </>
          )}
        </div>
      </div>

      {!game.session_active && (
        <div className="session-prompt">
          <p>Start a session to play multiple hands against the same opponents. Bot types stay fixed so you can learn their tendencies over time.</p>
        </div>
      )}

      <div className="play-layout">
        <div className="play-main">
          {game.last_action && (
            <div className={`action-log ${game.hand_over ? "hand-over" : ""}`}>
              Latest: {game.last_action}
            </div>
          )}

          <PokerTable game={game} />

          {game.hand_over && game.session_active && (
            <div className="hand-over-banner">
              Hand complete — click New Hand to continue
            </div>
          )}

          {game.hand_number > 0 && !game.hand_over && (
            <div className="play-controls">
              <div className={`forward-bar ${isBotTurn ? "" : "inactive"}`}>
                <span className="forward-hint">
                  {isBotTurn ? `${actorName} to act` : isHeroTurn ? "Your turn — take an action below" : "Waiting for action"}
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!isBotTurn}
                  onClick={stepBot}
                >
                  Forward →
                </button>
              </div>
              <div className="action-bar">
                <button type="button" className="btn btn-action fold" disabled={!isHeroTurn} onClick={() => act("fold")}>
                  Fold
                </button>
                <button type="button" className="btn btn-action check" disabled={!isHeroTurn || callAmount > 0} onClick={() => act("check")}>
                  Check
                </button>
                <button type="button" className="btn btn-action call" disabled={!isHeroTurn || callAmount === 0} onClick={() => act("call")}>
                  Call {callAmount > 0 ? `$${callAmount.toFixed(2)}` : ""}
                </button>
                <button type="button" className="btn btn-action raise" disabled={!isHeroTurn} onClick={() => act("raise", raiseTo)}>
                  Raise to ${raiseTo.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="play-sidebar">
          <HandHistory game={game} />
          {game.hand_number > 0 && <BotIntelPanel game={game} />}
        </aside>
      </div>

      {game.show_coach && game.last_coach_message && (
        <EvCoachPanel analysis={game.last_coach_message} onDismiss={dismissCoach} />
      )}

      {showMath && <MathExplainer onClose={() => setShowMath(false)} />}

      {summary && (
        <SessionSummaryModal summary={summary} onClose={() => setSummary(null)} />
      )}
    </div>
  );
}
