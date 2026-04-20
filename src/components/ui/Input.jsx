import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="space-y-1 w-full">
      {label && <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-8",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";
