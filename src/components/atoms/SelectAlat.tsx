interface Props {
  value: number | null;
  onChange: (value: number) => void;
  options: { id: number; label: string }[];
}

export function SelectAlat({ value, onChange, options }: Props) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border rounded px-3 py-2 w-full"
      required
    >
      <option value="">-- Pilih Alat --</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
