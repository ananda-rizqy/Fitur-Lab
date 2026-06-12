import * as React from "react";
import { cn } from "../../lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 [&_tr]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr]:border-b-2 [&_tr]:border-zinc-200 dark:[&_tr]:border-zinc-800 [&_tr:last-child]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-zinc-100 dark:bg-zinc-900 border-t-2 border-zinc-950 dark:border-zinc-800 font-mono font-black [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 data-[state=selected]:bg-zinc-100 dark:data-[state=selected]:bg-zinc-800 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-zinc-900 dark:text-zinc-100 h-12 px-4 text-left align-middle font-mono font-black text-xs tracking-wider whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle font-sans text-xs font-medium text-zinc-800 dark:text-zinc-300 whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "text-zinc-400 dark:text-zinc-500 mt-4 font-mono text-xs font-bold tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
