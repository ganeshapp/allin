import { useState } from "react";
import { CBET_QUIZZES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

interface Props {
  onComplete: () => void;
}

export function CbetLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const s = CBET_QUIZZES[step];

  const next = () => {
    setStep((n) => nextQuizStep(n, CBET_QUIZZES.length));
    setChoice(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Continuation Betting</h4>
        <p>You raised preflop. The flop comes. Should you c-bet?</p>
      </section>
      <section className="lesson-section highlight-box">
        <p><strong>Scenario {step + 1}/{CBET_QUIZZES.length}:</strong> Board: {s.board}. You: {s.you}. Villain: {s.villain}.</p>
        <div className="type-guess-btns">
          {["bet", "check"].map((t) => (
            <button key={t} type="button" className={`btn quiz-btn ${choice === t ? (t === s.answer ? "correct" : "wrong") : ""}`}
              onClick={() => setChoice(t)} disabled={choice !== null}>{t === "bet" ? "C-bet" : "Check back"}</button>
          ))}
        </div>
        {choice && (
          <div className={`quiz-feedback ${choice === s.answer ? "correct" : "wrong"}`}>
            <p>{choice === s.answer ? "Good!" : `Usually ${s.answer} here.`} {s.why} Size: {s.size}.</p>
            <QuizPracticeNav step={step} total={CBET_QUIZZES.length} onNext={next} answered />
          </div>
        )}
      </section>
    </div>
  );
}
