"use client";

import { AppError } from "@/_pages/app-error";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return <AppError reset={reset} />;
}
