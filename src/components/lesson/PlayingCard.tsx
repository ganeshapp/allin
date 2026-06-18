interface Props {
  card: string;
  small?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

function suitColor(card: string): string {
  if (card.includes("♥") || card.includes("♦")) return "red";
  return "black";
}

export function PlayingCard({ card, small, selected, onClick }: Props) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      className={`playing-card ${small ? "small" : ""} ${selected ? "selected" : ""} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <span className={`card-face ${suitColor(card)}`}>{card}</span>
    </Tag>
  );
}

export function CardRow({ cards, label }: { cards: string[]; label?: string }) {
  return (
    <div className="card-row">
      {label && <span className="card-row-label">{label}</span>}
      <div className="card-row-cards">
        {cards.map((c) => (
          <PlayingCard key={c} card={c} small />
        ))}
      </div>
    </div>
  );
}
