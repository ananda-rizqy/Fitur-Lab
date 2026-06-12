import React from "react";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  optional?: boolean;
}

export function FormLabel({
  children,
  optional,
  className = "",
  ...props
}: FormLabelProps) {
  return (
    <label
      className={`text-[10px] font-black  tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 block ${className}`}
      {...props}
    >
      {children}{" "}
      {optional && (
        <span className="text-zinc-300 dark:text-zinc-700 italic font-normal">
          (Opsional)
        </span>
      )}
    </label>
  );
}
