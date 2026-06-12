import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";

export function PageSizeDropdown({
  onChange,
}: {
  onChange: (n: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Size Page</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[5, 10, 15].map((size) => (
          <DropdownMenuItem key={size} onClick={() => onChange(size)}>
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
