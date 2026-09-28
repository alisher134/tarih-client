import { Spinner } from "@/shared/ui/spinner";

export function AuthGateLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner className="size-8" />
    </div>
  );
}
