import { useState } from "react";
import { GlossaryTerm } from "./GlossaryTerm";
import { POSITION_QUIZZES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

const POSITIONS = [
  { seat: 0, label: "BTN", name: "Button", desc: "Dealer button. Acts last post-flop — the most profitable seat." },
  { seat: 1, label: "SB", name: "Small Blind", desc: "Posts half a blind bet. Acts second-to-last preflop, first post-flop." },
  { seat: 2, label: "BB", name: "Big Blind", desc: "Posts a full blind. Defends the pot; acts last preflop, second post-flop." },
  { seat: 3, label: "UTG", name: "Under the Gun", desc: "First to act preflop. Play tight — 5 players still to act behind you." },
  { seat: 4, label: "MP", name: "Middle Position", desc: "Between early and late position. Slightly wider range than UTG." },
  { seat: 5, label: "CO", name: "Cutoff", desc: "One seat before the Button. Second-best seat — steal blinds often." },
];

interface Props {
  onComplete: () => void;
}

export function PositionLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const quiz = POSITION_QUIZZES[step];

  const next = () => {
    setStep((s) => nextQuizStep(s, POSITION_QUIZZES.length));
    setAnswer(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Why Position Matters</h4>
        <p>
          In poker, <strong>position</strong> means when you act relative to other players.
          Acting <em>last</em> lets you see what everyone else does before you decide.
        </p>
      </section>

      <section className="lesson-section">
        <h4>6-Max Table Positions</h4>
        <div className="position-diagram">
          <div className="position-table">
            <div className="position-felt" />
            {POSITIONS.map((pos) => {
              const angle = (pos.seat / 6) * 360 - 90;
              const radius = 44;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={pos.label}
                  className={`position-seat ${pos.label === "BTN" ? "button-seat" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className="pos-label">{pos.label}</span>
                  <span className="pos-name">{pos.name}</span>
                </div>
              );
            })}
            <div className="dealer-button">D</div>
          </div>
        </div>
      </section>

      <section className="lesson-section highlight-box">
        <h4>Position Quiz {step + 1}/{POSITION_QUIZZES.length}</h4>
        <p>{quiz.scenario}</p>
        <div className="type-guess-btns">
          {quiz.options.map((o) => (
            <button
              key={o}
              type="button"
              className={`btn quiz-btn ${answer === o ? (o === quiz.answer ? "correct" : "wrong") : ""}`}
              onClick={() => setAnswer(o)}
              disabled={answer !== null}
            >
              {o}
            </button>
          ))}
        </div>
        {answer && (
          <div className={`quiz-feedback ${answer === quiz.answer ? "correct" : "wrong"}`}>
            <p>{answer === quiz.answer ? "Correct!" : `Answer: ${quiz.answer}.`} {quiz.explain}</p>
            <QuizPracticeNav step={step} total={POSITION_QUIZZES.length} onNext={next} answered />
          </div>
        )}
      </section>

      <section className="lesson-section">
        <h4>Key Takeaway</h4>
        <ul className="lesson-bullets">
          <li><strong>Late position</strong> (<GlossaryTerm term="BTN" definition="Button" />, <GlossaryTerm term="CO" definition="Cutoff" />) → play more hands</li>
          <li><strong>Early position</strong> (<GlossaryTerm term="UTG" definition="Under the Gun" />) → play fewer, stronger hands</li>
          <li><strong>Blinds</strong> → already invested; defend selectively</li>
        </ul>
      </section>
    </div>
  );
}
