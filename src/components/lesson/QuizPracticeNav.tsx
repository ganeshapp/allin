interface Props {
  step: number;
  total: number;
  onNext: () => void;
  answered: boolean;
}

export function QuizPracticeNav({ step, total, onNext, answered }: Props) {
  if (!answered) return null;

  return (
    <div className="quiz-practice-nav">
      <span className="quiz-progress">
        Quiz {step + 1} of {total} — keep practicing or mark the lesson complete above
      </span>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Next Quiz
      </button>
    </div>
  );
}

export function nextQuizStep(current: number, total: number): number {
  return (current + 1) % total;
}
