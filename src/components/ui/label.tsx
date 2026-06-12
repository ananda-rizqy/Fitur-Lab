import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../../lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-xs font-black tracking-widest text-black dark:text-white select-none transition-colors group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40 peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
