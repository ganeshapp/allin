import { useState } from "react";
import { RangeMatrix, emptyMatrix } from "../RangeMatrix";

interface Props {
  onComplete: () => void;
}

const POSITIONS = [
  { id: "utg", label: "UTG (Early)", desc: "Tight — only strong hands", pct: "~15%" },
  { id: "btn", label: "Button (Late)", desc: "Wide — steal blinds, play suited connectors", pct: "~45%" },
];

export function RangeMatrixLesson({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [matrix, setMatrix] = useState(emptyMatrix());
  const [selectedPos, setSelectedPos] = useState("utg");

  const steps = [
    {
      title: "What is the 13×13 matrix?",
      body: (
        <>
          <p>Every Texas Hold'em starting hand fits in one grid cell:</p>
          <ul className="lesson-bullets">
            <li><strong>Diagonal</strong> (AA, KK…) = pocket pairs</li>
            <li><strong>Above diagonal</strong> (AKs) = suited hands</li>
            <li><strong>Below diagonal</strong> (AKo) = offsuit hands</li>
          </ul>
          <p>169 unique combos total. Coloring a cell means "I'd play this hand from this position."</p>
        </>
      ),
    },
    {
      title: "Try it — paint a range",
      body: (
        <>
          <p>Click cells to select hands you'd open from <strong>{POSITIONS.find(p => p.id === selectedPos)?.label}</strong>.</p>
          <div className="pos-toggle">
            {POSITIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn-secondary ${selectedPos === p.id ? "active" : ""}`}
                onClick={() => setSelectedPos(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <RangeMatrix matrix={matrix} onChange={setMatrix} compact />
          <p className="lesson-tip">
            {selectedPos === "utg"
              ? "UTG typically opens ~15%: pairs 77+, AJo+, KQs, suited broadways."
              : "Button opens ~45%: adds suited connectors, weak aces, more broadways."}
          </p>
        </>
      ),
    },
    {
      title: "How to read opponent ranges",
      body: (
        <p>
          In the Play tab, use <strong>Peek Range</strong> to see what a bot actually holds as a range.
          Compare it to what you painted. The overlap % is your accuracy score.
          Over time you'll learn: tight players have small red zones, loose players paint half the grid.
        </p>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>{current.title}</h4>
        {current.body}
      </section>
      <div className="lesson-nav">
        {step > 0 && (
          <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (isLast ? onComplete() : setStep((s) => s + 1))}
        >
          {isLast ? "Finish Lesson" : "Next"}
        </button>
      </div>
    </div>
  );
}
