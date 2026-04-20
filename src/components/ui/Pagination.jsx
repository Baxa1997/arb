import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Icons } from "@/config/icons";

export function Pagination({ page, totalPages, onNext, onPrev, className }) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page <= 1}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Next
          <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
