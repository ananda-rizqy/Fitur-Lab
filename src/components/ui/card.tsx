import * as React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "brutal";
  animate?: boolean;
}

function Card({
  className,
  variant = "default",
  animate = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        variant === "default" &&
          "bg-card text-card-foreground rounded-xl border shadow-sm",

        variant === "brutal" && [
          "flex flex-col gap-2 rounded-none overflow-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]",
          animate &&
            "transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.02)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_rgba(9,9,11,1)] dark:active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.02)]",
        ],

        "flex flex-col gap-2 py-6",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
