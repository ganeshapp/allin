import { useState } from "react";

interface Props {
  onComplete: () => void;
}

export function PotOddsLesson({ onComplete }: Props) {
  const [pot, setPot] = useState(40);
  const [call, setCall] = useState(10);
  const [equity, setEquity] = useState(25);

  const potOdds = (call / (pot + call)) * 100;
  const ev = (equity / 100) * (pot + call) - call;
  const shouldCall = equity >= potOdds;

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Pot odds — the core idea</h4>
        <p>
          When facing a bet, ask: <em>"How often do I need to win for this call to break even?"</em>
        </p>
        <p>
          Formula: <strong>Call ÷ (Pot + Call) = % equity needed</strong>
        </p>
      </section>

      <section className="lesson-section highlight-box">
        <h4>Practice calculator</h4>
        <div className="calc-row">
          <label>Pot size ($)<input type="range" min={10} max={200} value={pot} onChange={(e) => setPot(Number(e.target.value))} /><span>${pot}</span></label>
        </div>
        <div className="calc-row">
          <label>Call amount ($)<input type="range" min={1} max={100} value={call} onChange={(e) => setCall(Number(e.target.value))} /><span>${call}</span></label>
        </div>
        <div className="calc-row">
          <label>Your estimated equity (%)<input type="range" min={0} max={100} value={equity} onChange={(e) => setEquity(Number(e.target.value))} /><span>{equity}%</span></label>
        </div>
        <div className="math-step">
          <div className="math-step-label">Step 1: Pot odds</div>
          <div className="math-step-formula">${call} ÷ (${pot} + ${call}) = ${call} ÷ ${pot + call}</div>
          <div className="math-step-result">Need {potOdds.toFixed(1)}% equity to break even</div>
        </div>
        <div className="math-step">
          <div className="math-step-label">Step 2: Compare your equity</div>
          <div className="math-step-formula">Your estimate: {equity}% vs required: {potOdds.toFixed(1)}%</div>
          <div className="math-step-result">{shouldCall ? "Call is profitable" : "Fold — not enough equity"}</div>
        </div>
        <div className="math-step">
          <div className="math-step-label">Step 3: Expected Value</div>
          <div className="math-step-formula">{equity}% × ${pot + call} − ${call}</div>
          <div className="math-step-result">EV = ${ev.toFixed(2)}</div>
        </div>
      </section>

      <section className="lesson-section">
        <h4>Real example</h4>
        <p>
          Pot is $40, opponent bets $10. You must call $10 to win $50 total.
          $10 ÷ $50 = <strong>20%</strong>. If your flush draw has 19% equity, fold.
          If it has 35% equity, call — you'll profit long-term.
        </p>
        <p className="lesson-tip">Use the <strong>Show Math</strong> button during Play to see these steps with your actual hand.</p>
      </section>

      <button type="button" className="btn btn-primary" onClick={onComplete}>Finish Lesson</button>
    </div>
  );
}
