import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function MyInputForm({ label, type, placeholder, onChange }: Props) {
  return (
    <div className="flex flex-col ">
      <form action="">
        <div className=" flex flex-col gap-2">
          <Label>{label}</Label>
          <Input type={type} placeholder={placeholder} onChange={onChange} />
        </div>
      </form>
    </div>
  );
}
