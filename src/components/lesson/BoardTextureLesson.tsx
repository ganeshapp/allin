import { useState } from "react";
import { PlayingCard } from "./PlayingCard";
import { BOARD_TEXTURE_QUIZZES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

interface Props {
  onComplete: () => void;
}

export function BoardTextureLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const board = BOARD_TEXTURE_QUIZZES[step];

  const next = () => {
    setStep((s) => nextQuizStep(s, BOARD_TEXTURE_QUIZZES.length));
    setAnswer(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Wet vs Dry Boards</h4>
        <p><strong>Dry:</strong> few draws — safe to bet small, bluff more. <strong>Wet:</strong> many draws — bet bigger for protection or check back.</p>
      </section>
      <section className="lesson-section highlight-box">
        <p>Quiz {step + 1}/{BOARD_TEXTURE_QUIZZES.length}: Classify this flop</p>
        <div className="quiz-cards">
          {board.cards.map((c) => <PlayingCard key={c} card={c} />)}
        </div>
        <div className="type-guess-btns">
          {["dry", "wet"].map((t) => (
            <button key={t} type="button" className={`btn quiz-btn ${answer === t ? (t === board.answer ? "correct" : "wrong") : ""}`}
              onClick={() => setAnswer(t)} disabled={answer !== null}>{t}</button>
          ))}
        </div>
        {answer && (
          <div className={`quiz-feedback ${answer === board.answer ? "correct" : "wrong"}`}>
            <p>{answer === board.answer ? "Correct!" : `It's ${board.answer}.`} {board.why}</p>
            <QuizPracticeNav step={step} total={BOARD_TEXTURE_QUIZZES.length} onNext={next} answered />
          </div>
        )}
      </section>
    </div>
  );
}
