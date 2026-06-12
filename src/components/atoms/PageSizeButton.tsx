import { Button } from "../ui/button";

interface Props {
  onClick: () => void;
  size: number;
}

export function PageSizeButton({ onClick, size }: Props) {
  return <Button onClick={onClick}>{size}</Button>;
}
