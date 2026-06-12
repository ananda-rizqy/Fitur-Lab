interface Props {
  type: boolean;
}

export function TypeLabel({ type }: Props) {
  return <span>{type ? "Anchor" : "Beacon"}</span>;
}
