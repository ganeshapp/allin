interface Props {
  card: string;
  className?: string;
}

function suitColor(card: string): "red" | "black" {
  if (card.includes("♥") || card.includes("♦")) return "red";
  return "black";
}

export function TableCard({ card, className = "" }: Props) {
  return (
    <div className={`card ${suitColor(card)} ${className}`.trim()}>
      {card}
    </div>
  );
}

export function CardText({ card }: { card: string }) {
  return <span className={`card-text ${suitColor(card)}`}>{card}</span>;
}
