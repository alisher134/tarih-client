import { cn } from "cn";

export function Container({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto", className)} {...props}>
      {children}
    </div>
  );
}
