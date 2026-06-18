import { useState } from "react";

interface Props {
  onComplete: () => void;
}

export function BankrollLesson({ onComplete }: Props) {
  const [bankroll, setBankroll] = useState(4000);
  const [stakes, setStakes] = useState(200);
  const [sessionBuyin, setSessionBuyin] = useState(200);

  const buyins = bankroll / stakes;
  const sessionPct = (sessionBuyin / bankroll) * 100;
  const maxSession = bankroll * 0.05;

  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Why do we need a bankroll?</h4>
        <p>
          Poker has <strong>variance</strong> — even when you play well, you lose hands due to luck.
          A bankroll is money set aside <em>only for poker</em> so bad streaks don't wipe you out.
        </p>
        <p>
          Think of each buy-in as one "bullet." If you bring 1 bullet to a gunfight and miss,
          you're done. If you bring 20, one miss doesn't end you.
        </p>
      </section>

      <section className="lesson-section highlight-box">
        <h4>Interactive calculator</h4>
        <div className="calc-row">
          <label>
            Total bankroll ($)
            <input
              type="range"
              min={500}
              max={20000}
              step={100}
              value={bankroll}
              onChange={(e) => setBankroll(Number(e.target.value))}
            />
            <span>${bankroll.toLocaleString()}</span>
          </label>
        </div>
        <div className="calc-row">
          <label>
            Buy-in per session ($)
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={stakes}
              onChange={(e) => setStakes(Number(e.target.value))}
            />
            <span>${stakes}</span>
          </label>
        </div>
        <div className="calc-result">
          <p>
            <strong>{buyins.toFixed(1)} buy-ins</strong> in your bankroll
            (${bankroll} ÷ ${stakes})
          </p>
          {buyins < 20 && (
            <p className="calc-warn">
              Below 20 buy-ins — you're one bad run from going broke. Save more or play lower stakes.
            </p>
          )}
          {buyins >= 20 && buyins < 30 && (
            <p className="calc-ok">20+ buy-ins — minimum recommended. You can survive normal variance.</p>
          )}
          {buyins >= 30 && (
            <p className="calc-ok">30+ buy-ins — comfortable cushion for downswings.</p>
          )}
        </div>
      </section>

      <section className="lesson-section">
        <h4>Why $1/$2 needs $4,000 (not arbitrary)</h4>
        <p>
          At $1/$2 cash games, a standard buy-in is <strong>100 big blinds = $200</strong>
          (the big blind is $2, so 100 × $2 = $200).
        </p>
        <p>
          The 20 buy-in rule: $200 × 20 = <strong>$4,000</strong>. This isn't a magic number —
          statistical simulations show that with 20 buy-ins at winning play, your risk of ruin
          (losing everything) drops to a manageable level.
        </p>
        <p>
          With only 5 buy-ins ($1,000), a normal 5-buy-in downswing — which happens to everyone —
          forces you to reload broke or quit.
        </p>
      </section>

      <section className="lesson-section highlight-box">
        <h4>Why the 5% session rule?</h4>
        <div className="calc-row">
          <label>
            How much are you sitting with tonight? ($)
            <input
              type="range"
              min={50}
              max={Math.min(2000, bankroll)}
              step={50}
              value={sessionBuyin}
              onChange={(e) => setSessionBuyin(Number(e.target.value))}
            />
            <span>${sessionBuyin}</span>
          </label>
        </div>
        <div className="calc-result">
          <p>
            That's <strong>{sessionPct.toFixed(1)}%</strong> of your ${bankroll.toLocaleString()} bankroll
            (${sessionBuyin} ÷ ${bankroll} × 100)
          </p>
          <p>Maximum recommended per session: <strong>5% = ${maxSession.toFixed(0)}</strong></p>
          {sessionPct > 5 ? (
            <p className="calc-warn">
              You're risking more than 5% tonight. If you lose this session, it hurts your bankroll
              disproportionately — one bad night shouldn't cost 10–20% of your total funds.
            </p>
          ) : (
            <p className="calc-ok">
              Within the 5% limit. Even if you lose tonight's stack, you still have 95% of your
              bankroll to play another day.
            </p>
          )}
        </div>
      </section>

      <button type="button" className="btn btn-primary" onClick={onComplete}>
        Finish Lesson
      </button>
    </div>
  );
}
