import { cn } from "cn";
import { Loader2Icon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin text-primary", className)}
      {...props}
    />
  );
}

type CenteredSpinnerProps = {
  className?: string;
};

function CenteredSpinner({ className }: CenteredSpinnerProps) {
  return (
    <div className="flex w-full flex-1 items-center justify-center py-16">
      <Spinner className={cn("size-8", className)} />
    </div>
  );
}

export { CenteredSpinner, Spinner };
