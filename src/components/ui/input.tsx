import * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 h-12 px-3.5 py-1 text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors duration-150 disabled:pointer-events-none disabled:cursor-not-allowed shadow-none disabled:opacity-40  ",

        // focus
        "focus-visible:border-black dark:focus-visible:border-white focus:shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] focus:dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ",

        // error
        "aria-invalid:border-red-500 dark:aria-invalid:border-red-400 aria-invalid:text-red-600 dark:aria-invalid:text-red-400",

        // file input
        "file:inline-flex file:h-7 file:border-0 file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 file:px-2.5 file:py-0.5  file:text-xs file:font-black file:uppercase file:tracking-wider file:cursor-pointer file:hover:bg-zinc-300 dark:file:hover:bg-zinc-700",

        className,
      )}
      {...props}
    />
  );
}

export { Input };
