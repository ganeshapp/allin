import { useState } from "react";
import { PlayingCard } from "./PlayingCard";
import { ALL_HAND_RANKING_QUIZZES } from "./quizBanks";
import { QuizPracticeNav, nextQuizStep } from "./QuizPracticeNav";

interface Props {
  onComplete: () => void;
}

export function HandRankingLesson({ onComplete: _onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<"A" | "B" | null>(null);
  const quiz = ALL_HAND_RANKING_QUIZZES[step];

  const next = () => {
    setStep((s) => nextQuizStep(s, ALL_HAND_RANKING_QUIZZES.length));
    setAnswer(null);
  };

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Hand Rankings (high → low)</h4>
        <ol className="ranking-ladder">
          <li><strong>Royal Flush</strong> — A K Q J T same suit</li>
          <li><strong>Straight Flush</strong> — five consecutive, same suit</li>
          <li><strong>Four of a Kind</strong> — e.g. K K K K 3</li>
          <li><strong>Full House</strong> — three of a kind + a pair</li>
          <li><strong>Flush</strong> — five cards same suit</li>
          <li><strong>Straight</strong> — five consecutive cards</li>
          <li><strong>Three of a Kind</strong> — e.g. 9 9 9</li>
          <li><strong>Two Pair</strong> — e.g. J J 4 4</li>
          <li><strong>One Pair</strong> — e.g. A A</li>
          <li><strong>High Card</strong> — no made hand</li>
        </ol>
      </section>

      <section className="lesson-section highlight-box">
        <h4>What is a kicker?</h4>
        <p>
          When two players have the <em>same hand rank</em>, side cards — <strong>kickers</strong> — decide the winner.
        </p>
      </section>

      <section className="lesson-section quiz-section">
        <h4>Quiz {step + 1} of {ALL_HAND_RANKING_QUIZZES.length}: {quiz.question}</h4>
        <div className="quiz-hands">
          <div className="quiz-hand">
            <span className="quiz-label">{quiz.labelA}</span>
            <div className="quiz-cards">
              {quiz.handA.map((c) => <PlayingCard key={c} card={c} />)}
            </div>
            <button
              type="button"
              className={`btn quiz-btn ${answer === "A" ? (quiz.correct === "A" ? "correct" : "wrong") : ""}`}
              onClick={() => setAnswer("A")}
              disabled={answer !== null}
            >
              Player A wins
            </button>
          </div>
          <div className="quiz-hand">
            <span className="quiz-label">{quiz.labelB}</span>
            <div className="quiz-cards">
              {quiz.handB.map((c) => <PlayingCard key={c} card={c} />)}
            </div>
            <button
              type="button"
              className={`btn quiz-btn ${answer === "B" ? (quiz.correct === "B" ? "correct" : "wrong") : ""}`}
              onClick={() => setAnswer("B")}
              disabled={answer !== null}
            >
              Player B wins
            </button>
          </div>
        </div>
        {answer && (
          <div className={`quiz-feedback ${answer === quiz.correct ? "correct" : "wrong"}`}>
            <p>{answer === quiz.correct ? "Correct!" : "Not quite."} {quiz.explanation}</p>
            <QuizPracticeNav step={step} total={ALL_HAND_RANKING_QUIZZES.length} onNext={next} answered />
          </div>
        )}
      </section>
    </div>
  );
}
