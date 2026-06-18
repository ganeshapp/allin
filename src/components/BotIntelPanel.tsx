import { useState } from "react";
import type { GameState, RangeMatrix as RangeMatrixType } from "../types";
import { RangeMatrix, emptyMatrix } from "./RangeMatrix";
import {
  peekBotCards,
  peekBotRange,
  peekBotType,
  scoreRangeGuess,
} from "../api/tauri";
import type { GuessResult } from "../types";

interface Props {
  game: GameState;
}

export function BotIntelPanel({ game }: Props) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [userRange, setUserRange] = useState(emptyMatrix());
  const [guessResult, setGuessResult] = useState<GuessResult | null>(null);
  const [peekedCards, setPeekedCards] = useState<[string, string] | null>(null);
  const [peekedRangeMatrix, setPeekedRangeMatrix] = useState<RangeMatrixType | null>(null);
  const [peekedType, setPeekedType] = useState<{ archetype: string; vpip: number; pfr: number } | null>(null);
  const [guessedType, setGuessedType] = useState<string | null>(null);

  const activeBots = game.players.filter((p) => !p.is_human && !p.folded);

  const selectBot = (seat: number) => {
    if (selectedSeat === seat) {
      setExpanded((e) => !e);
      return;
    }
    setSelectedSeat(seat);
    setExpanded(true);
    setUserRange(emptyMatrix());
    setGuessResult(null);
    setPeekedCards(null);
    setPeekedRangeMatrix(null);
    setPeekedType(null);
    setGuessedType(null);
  };

  const handlePeekCards = async () => {
    if (selectedSeat === null) return;
    const result = await peekBotCards(selectedSeat);
    setPeekedCards(result.hole_cards);
  };

  const handlePeekRange = async () => {
    if (selectedSeat === null) return;
    const range = await peekBotRange(selectedSeat);
    setPeekedRangeMatrix(range);
    if (userRange.hands.filter(Boolean).length > 0) {
      const result = await scoreRangeGuess(selectedSeat, userRange);
      setGuessResult(result);
    }
  };

  const handlePeekType = async () => {
    if (selectedSeat === null) return;
    const result = await peekBotType(selectedSeat);
    setPeekedType(result);
  };

  const handleScoreGuess = async () => {
    if (selectedSeat === null) return;
    const result = await scoreRangeGuess(selectedSeat, userRange);
    setGuessResult(result);
  };

  const botName = selectedSeat !== null
    ? game.bots.find((b) => b.seat === selectedSeat)?.name ?? `Seat ${selectedSeat}`
    : null;

  return (
    <div className="bot-intel-panel">
      <h4>Read Opponents</h4>
      <div className="bot-select-list">
        {activeBots.map((p) => (
          <button
            key={p.seat}
            type="button"
            className={`bot-select-btn ${selectedSeat === p.seat ? "active" : ""}`}
            onClick={() => selectBot(p.seat)}
          >
            {game.bots.find((b) => b.seat === p.seat)?.name ?? `Bot ${p.seat}`}
          </button>
        ))}
      </div>

      {selectedSeat !== null && expanded && (
        <div className="intel-actions">
          <p className="intel-target">Analyzing {botName} <span className="intel-collapse-hint">(click bot again to collapse)</span></p>

          <div className="intel-section">
            <span className="intel-section-title">Guess player type</span>
            <div className="type-guess-btns">
              {["TAG", "LAG", "Nit", "Calling Station"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`btn btn-secondary type-guess ${guessedType === t ? "selected" : ""}`}
                  onClick={() => setGuessedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handlePeekType}>
              Peek Type
            </button>
            {peekedType && (
              <p className="peek-reveal">
                Actual: <strong>{peekedType.archetype}</strong> (VPIP {peekedType.vpip.toFixed(0)}%, PFR {peekedType.pfr.toFixed(0)}%)
                {guessedType && (
                  <span className={guessedType === peekedType.archetype ? "correct" : "wrong"}>
                    {guessedType === peekedType.archetype ? " — Correct!" : ` — You guessed ${guessedType}`}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="intel-section">
            <span className="intel-section-title">Hole cards</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handlePeekCards}>
              Peek Cards
            </button>
            {peekedCards && (
              <p className="peek-reveal">
                {peekedCards[0]} {peekedCards[1]}
              </p>
            )}
          </div>

          <div className="intel-section">
            <span className="intel-section-title">Range (optional guess)</span>
            <div className="intel-matrix">
              <RangeMatrix
                matrix={userRange}
                onChange={setUserRange}
                readOnly={false}
                revealMatrix={peekedRangeMatrix}
                compact
              />
            </div>
            <div className="intel-btn-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleScoreGuess}
                disabled={userRange.hands.filter(Boolean).length === 0}
              >
                Score Guess
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handlePeekRange}>
                Peek Range
              </button>
            </div>
            {guessResult && (
              <p className="peek-reveal">
                Accuracy: <strong>{guessResult.accuracy_score.toFixed(1)}%</strong>
                {peekedRangeMatrix && ` — Bot range has ${guessResult?.bot_selected ?? "—"} combos`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
