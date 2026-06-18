import { useState } from "react";
import { PlayingCard } from "./PlayingCard";
import { BUILD_HAND_EXERCISES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

interface Props {
  onComplete: () => void;
}

export function BuildBestHandLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const ex = BUILD_HAND_EXERCISES[step];

  const toggle = (card: string) => {
    if (result) return;
    setSelected((prev) => {
      if (prev.includes(card)) return prev.filter((c) => c !== card);
      if (prev.length >= 5) return prev;
      return [...prev, card];
    });
  };

  const check = () => {
    const sorted = [...selected].sort();
    const expected = [...ex.correct].sort();
    const match = sorted.length === 5 && sorted.every((c, i) => c === expected[i]);
    setResult(match ? "correct" : "wrong");
  };

  const next = () => {
    setStep((s) => nextQuizStep(s, BUILD_HAND_EXERCISES.length));
    setSelected([]);
    setResult(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Build the Best 5-Card Hand</h4>
        <p>
          Pick exactly <strong>5 cards</strong> from your 7 available. You may use both, one, or neither hole card.
        </p>
      </section>

      <section className="lesson-section">
        <p className="exercise-label">Exercise {step + 1} of {BUILD_HAND_EXERCISES.length}</p>
        <div className="build-hand-area">
          <div className="build-hand-group">
            <span className="build-label">Your hole cards</span>
            <div className="build-cards">
              {ex.hole.map((c) => (
                <PlayingCard key={`hole-${c}`} card={c} selected={selected.includes(c)} onClick={() => toggle(c)} />
              ))}
            </div>
          </div>
          <div className="build-hand-group">
            <span className="build-label">Community board</span>
            <div className="build-cards">
              {ex.board.map((c) => (
                <PlayingCard key={`board-${c}`} card={c} selected={selected.includes(c)} onClick={() => toggle(c)} />
              ))}
            </div>
          </div>
        </div>
        <p className="selection-count">Selected: {selected.length} / 5</p>

        {!result && (
          <button type="button" className="btn btn-primary" onClick={check} disabled={selected.length !== 5}>
            Check My Hand
          </button>
        )}

        {result && (
          <div className={`quiz-feedback ${result}`}>
            <p>{result === "correct" ? "Perfect!" : "Not the best hand."} {ex.explanation}</p>
            <p className="correct-cards">Best five: {ex.correct.join(" ")}</p>
            <QuizPracticeNav step={step} total={BUILD_HAND_EXERCISES.length} onNext={next} answered />
          </div>
        )}
      </section>
    </div>
  );
}
