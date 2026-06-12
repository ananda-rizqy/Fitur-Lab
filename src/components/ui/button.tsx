import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-primary bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        circle: "bg-primary text-primary-foreground hover:bg-primary/90  ",
        brutal:
          "border-2 border-zinc-950 font-sans font-black text-xs tracking-wider transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(19,19,56,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(39,39,42,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_rgba(9,9,11,1)]",
      },
      color: {
        blue: "bg-blue-500 text-white!",
        red: "bg-red-500 text-white!",
        green: "bg-emerald-500 text-white!",
        yellow: "bg-amber-400 text-zinc-950!",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-none gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-none px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        circle: "rounded-full",
      },
    },
    compoundVariants: [
      { variant: "brutal", color: "blue" },
      { variant: "brutal", color: "red" },
      { variant: "brutal", color: "green" },
      { variant: "brutal", color: "yellow" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, color }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
