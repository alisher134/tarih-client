import { getTranslations } from "next-intl/server";

import { AuthFormSwitchLink } from "@/features/require-auth/ui/auth-form-switch-link";
import { AuthFormLayout } from "@/widgets/auth-form-layout";
import { SignUpForm } from "@/features/sign-up";

export async function SignUp() {
  const t = await getTranslations("signUp");

  return (
    <AuthFormLayout
      title={t("title")}
      footer={
        <>
          {t("hasAccount")}{" "}
          <AuthFormSwitchLink href="/sign-in" label={t("signIn")} />
        </>
      }
    >
      <SignUpForm />
    </AuthFormLayout>
  );
}
