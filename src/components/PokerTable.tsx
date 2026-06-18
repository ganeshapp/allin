import type { GameState } from "../types";
import { TableCard } from "./TableCard";

interface Props {
  game: GameState;
}

export function PokerTable({ game }: Props) {
  const human = game.players[0];
  const isHeroTurn = !game.hand_over && game.players[game.action_on]?.is_human === true;
  const activeSeat = game.action_on;
  const revealHoleCards = game.hand_over && game.showdown;

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
                <TableCard key={i} card={card} className="board-card" />
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
          const isWinner = game.hand_over && game.winner_seat === player.seat;
          const showCards =
            player.hole_cards &&
            (player.is_human || (revealHoleCards && !player.folded));

          return (
            <div
              key={player.seat}
              className={`seat seat-pos-${player.seat} ${player.is_human ? "hero" : "bot"} ${player.folded ? "folded" : ""} ${isActive ? "active" : ""} ${isWinner ? "winner" : ""}`}
            >
              <div className="seat-name">
                {player.is_human ? "You" : bot?.name ?? `Bot ${player.seat}`}
                {isWinner && <span className="winner-badge">Winner</span>}
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
              {showCards && (
                <div className="hole-cards">
                  {player.hole_cards!.map((c, i) => (
                    <TableCard key={i} card={c} className="hole-card" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {human.hole_cards && (
        <div className="hero-hand-bar">
          <span>Your hand:</span>
          <div className="hero-hand-cards">
            <TableCard card={human.hole_cards[0]} className="hero-hand-card" />
            <TableCard card={human.hole_cards[1]} className="hero-hand-card" />
          </div>
          {isHeroTurn && <span className="turn-badge">Your turn</span>}
        </div>
      )}

      {game.hand_over && game.showdown && game.winner_seat !== null && (
        <div className="showdown-result">
          <strong>
            {game.players[game.winner_seat].is_human
              ? "You"
              : game.bots.find((b) => b.seat === game.winner_seat)?.name ?? `Bot ${game.winner_seat}`}
          </strong>{" "}
          wins ${game.pot.toFixed(2)}
          {game.winning_hand && (
            <span className="showdown-hand"> with {game.winning_hand}</span>
          )}
        </div>
      )}
    </div>
  );
}
