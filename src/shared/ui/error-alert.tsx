import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertTitle } from "./alert";

type ErrorAlertProps = {
  errorMessage: string;
  className?: string;
};

export function ErrorAlert({ errorMessage, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircleIcon />
      <AlertTitle className="text-balance break-words">{errorMessage}</AlertTitle>
    </Alert>
  );
}
