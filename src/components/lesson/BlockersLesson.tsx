import { useState } from "react";
import { PlayingCard } from "./PlayingCard";
import { BLOCKER_QUIZZES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

interface Props {
  onComplete: () => void;
}

export function BlockersLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<string | null>(null);
  const s = BLOCKER_QUIZZES[step];

  const next = () => {
    setStep((n) => nextQuizStep(n, BLOCKER_QUIZZES.length));
    setAns(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Blockers</h4>
        <p>Cards in your hand that villain can't have. Use them to bluff (block their nuts) or value bet (don't block their calls).</p>
      </section>
      <section className="lesson-section highlight-box">
        <p>Quiz {step + 1}/{BLOCKER_QUIZZES.length}</p>
        <div className="build-cards">
          {s.hole.map((c) => <PlayingCard key={c} card={c} />)}
          {s.board.map((c) => <PlayingCard key={c} card={c} />)}
        </div>
        <p>{s.question}</p>
        <div className="type-guess-btns">
          {["yes", "no"].map((t) => (
            <button key={t} type="button" className={`btn quiz-btn ${ans === t ? (t === s.answer ? "correct" : "wrong") : ""}`}
              onClick={() => setAns(t)} disabled={ans !== null}>{t}</button>
          ))}
        </div>
        {ans && (
          <div className={`quiz-feedback ${ans === s.answer ? "correct" : "wrong"}`}>
            <p>{s.explain}</p>
            <QuizPracticeNav step={step} total={BLOCKER_QUIZZES.length} onNext={next} answered />
          </div>
        )}
      </section>
    </div>
  );
}
