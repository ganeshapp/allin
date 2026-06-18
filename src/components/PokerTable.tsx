import type { GameState } from "../types";

interface Props {
  game: GameState;
}

export function PokerTable({ game }: Props) {
  const human = game.players[0];
  const isHeroTurn = !game.hand_over && game.players[game.action_on]?.is_human === true;
  const activeSeat = game.action_on;

  return (
    <div className="poker-table-container">
      <div className="table-info">
        <span>Hand #{game.hand_number || "—"}</span>
        <span className="street-badge">{game.street}</span>
        <span>Pot: ${game.pot.toFixed(2)}</span>
      </div>

      <div className="poker-table">
        <div className="table-felt">
          <div className="board-cards">
            {game.board.length > 0 ? (
              game.board.map((card, i) => (
                <div key={i} className="card board-card">{card}</div>
              ))
            ) : (
              <span className="board-placeholder">No board yet</span>
            )}
          </div>
          <div className="pot-display">${game.pot.toFixed(2)}</div>
        </div>

        {game.players.map((player) => {
          const bot = game.bots.find((b) => b.seat === player.seat);
          const isActive = activeSeat === player.seat;
          return (
            <div
              key={player.seat}
              className={`seat seat-pos-${player.seat} ${player.is_human ? "hero" : "bot"} ${player.folded ? "folded" : ""} ${isActive ? "active" : ""}`}
            >
              <div className="seat-name">
                {player.is_human ? "You" : bot?.name ?? `Bot ${player.seat}`}
              </div>
              <div className="seat-avatar-wrap">
                <div className="seat-avatar" />
                {game.dealer_seat === player.seat && (
                  <span className="dealer-chip" title="Dealer button">D</span>
                )}
              </div>
              <div className="seat-stack">${player.stack.toFixed(2)}</div>
              {player.bet > 0 && (
                <div className="seat-bet-chip">${player.bet.toFixed(2)}</div>
              )}
              {player.hole_cards && player.is_human && (
                <div className="hole-cards">
                  {player.hole_cards.map((c, i) => (
                    <div key={i} className="card hole-card">{c}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {human.hole_cards && (
        <div className="hero-hand-bar">
          Your hand: <strong>{human.hole_cards[0]} {human.hole_cards[1]}</strong>
          {isHeroTurn && <span className="turn-badge">Your turn</span>}
        </div>
      )}
    </div>
  );
}
