import { getTranslations } from "next-intl/server";

import { SignInForm } from "@/features/sign-in";
import { AuthFormSwitchLink } from "@/features/require-auth/ui/auth-form-switch-link";
import { AuthFormLayout } from "@/widgets/auth-form-layout";

export async function SignIn() {
  const t = await getTranslations("signIn");

  return (
    <AuthFormLayout
      title={t("title")}
      footer={
        <>
          {t("noAccount")}{" "}
          <AuthFormSwitchLink href="/sign-up" label={t("signUp")} />
        </>
      }
    >
      <SignInForm />
    </AuthFormLayout>
  );
}
