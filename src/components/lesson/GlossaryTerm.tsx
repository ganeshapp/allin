interface Props {
  term: string;
  definition: string;
}

export function GlossaryTerm({ term, definition }: Props) {
  return (
    <span className="glossary-term" tabIndex={0}>
      <abbr title={definition}>{term}</abbr>
      <span className="glossary-tooltip">{definition}</span>
    </span>
  );
}
