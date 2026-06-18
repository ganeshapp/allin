import { HandRankingLesson } from "./HandRankingLesson";
import { BuildBestHandLesson } from "./BuildBestHandLesson";
import { PositionLesson } from "./PositionLesson";
import { BankrollLesson } from "./BankrollLesson";
import { RangeMatrixLesson } from "./RangeMatrixLesson";
import { PotOddsLesson } from "./PotOddsLesson";
import { BoardTextureLesson } from "./BoardTextureLesson";
import { CbetLesson } from "./CbetLesson";
import { CombosLesson } from "./CombosLesson";
import { BlockersLesson } from "./BlockersLesson";
import { ExploitLesson } from "./ExploitLesson";
import { GlossaryTerm } from "./GlossaryTerm";

interface Props {
  moduleId: string;
  onComplete: () => void;
}

function RulesLesson({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>How a Hand Flows</h4>
        <ol className="hand-flow">
          <li><strong>Blinds posted</strong> — <GlossaryTerm term="SB" definition="Small Blind — half a bet" /> and <GlossaryTerm term="BB" definition="Big Blind — full bet" /> put money in.</li>
          <li><strong>Hole cards dealt</strong> — each player gets 2 private cards.</li>
          <li><strong>Preflop betting</strong> — starting left of the big blind.</li>
          <li><strong>Flop</strong> — 3 community cards dealt.</li>
          <li><strong>Flop betting</strong> — starting left of the button.</li>
          <li><strong>Turn</strong> — 4th community card.</li>
          <li><strong>Turn betting</strong></li>
          <li><strong>River</strong> — 5th community card.</li>
          <li><strong>River betting</strong></li>
          <li><strong>Showdown</strong> — best 5-card hand wins the pot.</li>
        </ol>
      </section>
      <button type="button" className="btn btn-primary" onClick={onComplete}>Finish Lesson</button>
    </div>
  );
}

function OpeningRangesLesson({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="interactive-lesson">
      <section className="lesson-section">
        <h4>Opening ranges by position</h4>
        <p>The later you act, the more hands you can profitably open:</p>
        <table className="lesson-table">
          <thead><tr><th>Position</th><th>% of hands</th><th>Example opens</th></tr></thead>
          <tbody>
            <tr><td>UTG</td><td>~15%</td><td>77+, ATs+, KQs, AJo+</td></tr>
            <tr><td>MP</td><td>~20%</td><td>55+, A9s+, KJs+, ATo+</td></tr>
            <tr><td>CO</td><td>~30%</td><td>22+, A2s+, K9s+, QTs+, J9s+</td></tr>
            <tr><td>Button</td><td>~45%</td><td>Most pairs, suited aces, connectors, broadways</td></tr>
          </tbody>
        </table>
        <p className="lesson-tip">Complete the Range Matrix lesson, then practice painting ranges in Play → Read Opponents.</p>
      </section>
      <button type="button" className="btn btn-primary" onClick={onComplete}>Finish Lesson</button>
    </div>
  );
}

export function LessonContent({ moduleId, onComplete }: Props) {
  switch (moduleId) {
    case "l1-rules": return <RulesLesson onComplete={onComplete} />;
    case "l1-rankings": return <HandRankingLesson onComplete={onComplete} />;
    case "l1-position": return <PositionLesson onComplete={onComplete} />;
    case "l1-bankroll": return <BankrollLesson onComplete={onComplete} />;
    case "l1-build-hand": return <BuildBestHandLesson onComplete={onComplete} />;
    case "l2-matrix": return <RangeMatrixLesson onComplete={onComplete} />;
    case "l2-open": return <OpeningRangesLesson onComplete={onComplete} />;
    case "l3-odds": return <PotOddsLesson onComplete={onComplete} />;
    case "l3-texture": return <BoardTextureLesson onComplete={onComplete} />;
    case "l3-cbet": return <CbetLesson onComplete={onComplete} />;
    case "l4-combos": return <CombosLesson onComplete={onComplete} />;
    case "l4-blockers": return <BlockersLesson onComplete={onComplete} />;
    case "l4-exploit": return <ExploitLesson onComplete={onComplete} />;
    default:
      return (
        <div className="lesson-fallback">
          <p>Lesson content loading…</p>
          <button type="button" className="btn btn-primary" onClick={onComplete}>Mark Complete</button>
        </div>
      );
  }
}
