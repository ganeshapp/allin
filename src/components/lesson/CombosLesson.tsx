import { useState } from "react";
import { COMBO_QUIZZES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

interface Props {
  onComplete: () => void;
}

export function CombosLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = COMBO_QUIZZES[step];

  const next = () => {
    setStep((n) => nextQuizStep(n, COMBO_QUIZZES.length));
    setPicked(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Hand Combinations</h4>
        <p>Ranges are weighted by combos. Pairs = 6, suited = 4, offsuit = 12. Blockers remove combos.</p>
      </section>
      <section className="lesson-section highlight-box">
        <p><strong>Q{step + 1}/{COMBO_QUIZZES.length}:</strong> {q.q}</p>
        <div className="type-guess-btns">
          {q.options.map((o) => (
            <button key={o} type="button" className={`btn quiz-btn ${picked === o ? (o === q.answer ? "correct" : "wrong") : ""}`}
              onClick={() => setPicked(o)} disabled={picked !== null}>{o}</button>
          ))}
        </div>
        {picked && (
          <div className={`quiz-feedback ${picked === q.answer ? "correct" : "wrong"}`}>
            <p>{picked === q.answer ? "Correct!" : `Answer: ${q.answer}.`} {q.explain}</p>
            <QuizPracticeNav step={step} total={COMBO_QUIZZES.length} onNext={next} answered />
          </div>
        )}
      </section>
    </div>
  );
}
