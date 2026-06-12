interface FormFieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLSelectElement
> {
  label: string;
  as?: "input" | "select";
  children?: React.ReactNode;
}

export function FormField({
  label,
  as = "input",
  children,
  ...props
}: FormFieldProps) {
  const baseClass =
    "w-full p-3 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 outline-none focus:border-zinc-950 dark:focus:border-white font-bold text-xs text-zinc-800 dark:text-zinc-200 transition-colors";

  return (
    <div className="flex flex-col gap-1 text-left">
      <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 ml-1">
        {label}
      </label>
      {as === "select" ? (
        <select className={baseClass} {...(props as any)}>
          {children}
        </select>
      ) : (
        <input className={baseClass} {...props} />
      )}
    </div>
  );
}
