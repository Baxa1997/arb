import { cn } from "@/lib/cn";
import { Icons } from "@/config/icons";

export function Spinner({ className, ...props }) {
  return (
    <Icons.spinner
      className={cn("h-4 w-4 animate-spin text-muted-foreground", className)}
      {...props}
    />
  );
}
