import { Button } from "../../components/ui/button";
import type { ReactNode } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
}

export function IconButton({ onClick, children }: Props) {
  return (
    <Button onClick={onClick} className="w-8 h-8 p-0">
      {children}
    </Button>
  );
}
