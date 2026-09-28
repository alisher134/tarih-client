import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type AuthFormLayoutProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthFormLayout({
  title,
  children,
  footer,
}: AuthFormLayoutProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle size="page" className="text-center">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm">{footer}</p>
      </CardFooter>
    </Card>
  );
}
