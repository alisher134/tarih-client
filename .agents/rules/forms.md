---
description: Forms with useZodForm, AppForm, and presentational field components
alwaysApply: true
---

# Forms

Stack: `useZodForm` + zod schema + `AppForm` render prop + field components. Fields are presentational: they take `label`, `error`, and input props. They do **not** call `useFormContext`, `register`, or `useController`. Wire RHF only in the feature, through `AppForm`’s `children(form)`.

| Need                                       | Use                                             |
| ------------------------------------------ | ----------------------------------------------- |
| `useForm` + `zodResolver`                  | `useZodForm` from `@/shared/hooks/use-zod-form` |
| `<form>` + `FormProvider` + `handleSubmit` | `AppForm` from `@/shared/ui/app-form`           |
| text input                                 | `InputField`                                    |
| email                                      | `EmailField`                                    |
| password (show/hide)                       | `PasswordField`                                 |
| schema                                     | `z.object` in the feature `model/`              |

Do not add `useFormField`, shadcn `Form` / `FormField`, or bind `name` inside shared fields.

## Setup

Schema lives in the feature, not in the UI file. Infer values from the schema. Always pass `defaultValues`. Do not pass `resolver` — `useZodForm` sets it.

### BAD — raw RHF + resolver in the component

```tsx
const schema = z.object({ email: z.string().email() });
const form = useForm({
  resolver: zodResolver(schema),
});
```

### BAD — no defaultValues

```tsx
const form = useZodForm(loginSchema);
```

### GOOD

```ts
// features/login/model/login-schema.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginValues = z.infer<typeof loginSchema>;
```

```tsx
"use client";

const form = useZodForm(loginSchema, {
  defaultValues: { email: "", password: "" },
});
```

## AppForm

`children` is a function `(form) => ReactNode`. Do not change `AppForm` to plain `ReactNode` children, and do not use `useFormContext` in fields to avoid the render prop.

### BAD — native form + Provider

```tsx
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <input {...form.register("email")} />
  </form>
</FormProvider>
```

### BAD — handleSubmit on the field tree

```tsx
<AppForm form={form} onSubmit={onSubmit}>
  {(form) => (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <EmailField {...form.register("email")} />
    </form>
  )}
</AppForm>
```

### GOOD

```tsx
<AppForm form={form} onSubmit={handleLogin}>
  {(form) => (
    <>
      <EmailField
        label={t("email")}
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <PasswordField
        label={t("password")}
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {t("submit")}
      </Button>
    </>
  )}
</AppForm>
```

`onSubmit` is an `AppForm` prop. `AppForm` already calls `form.handleSubmit`. Put the submit `Button` inside the render prop, `type="submit"`.

## Fields

Pass `label`, `error`, and `{...form.register("field")}`. Use `EmailField` / `PasswordField` instead of `type="email"` / `type="password"` on `InputField`. Do not wrap fields in another `Field` / `FieldLabel` / `FieldError`. Do not pass `name` as a separate API — `register` already sets it.

### BAD — raw input

```tsx
<input type="email" {...form.register("email")} />
<Input type="password" {...form.register("password")} />
```

### BAD — wrong field primitive

```tsx
<InputField type="email" label={t("email")} {...form.register("email")} />
<InputField type="password" label={t("password")} {...form.register("password")} />
```

### BAD — duplicate field chrome

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <EmailField {...form.register("email")} />
</Field>
```

### BAD — bind RHF inside the shared field

```tsx
export function InputField({ name, label }: { name: string; label: string }) {
  const { register, formState } = useFormContext();
  return <Input {...register(name)} />;
}
```

### BAD — Controller on a native input

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field }) => <EmailField {...field} />}
/>
```

### GOOD

```tsx
<EmailField
  label={t("email")}
  error={form.formState.errors.email?.message}
  {...form.register("email")}
/>
<PasswordField
  label={t("password")}
  error={form.formState.errors.password?.message}
  {...form.register("password")}
/>
<InputField
  label={t("name")}
  error={form.formState.errors.name?.message}
  {...form.register("name")}
/>
```

Nested path: `error={form.formState.errors.user?.email?.message}` and `{...form.register("user.email")}`.

Submit / mutation errors that are not field errors: `ErrorAlert` next to the form (`Show` + `ErrorAlert`), not `ErrorGate` that unmounts the form. See `declarative-ui` rule.

## New field types

If a primitive is missing (textarea, select), add a presentational field next to `InputField`: `label`, `error`, `...props`. Do not subscribe to the form inside it. Do not use `useController` unless the control cannot forward a ref (custom select, date picker). Native `<input>` / `<textarea>` / `<select>` stay on `register`.

## Client vs schema

The form component is `"use client"` (hooks + submit). Schema and types stay in `model/` without `"use client"`. Labels and field errors from zod messages go through `next-intl` when they are UI copy; do not hardcode Russian/English strings in the feature UI.

### BAD — schema + form + fetch in one 200-line file

```tsx
"use client";
const schema = z.object({ email: z.string() });
export function LoginForm() {
  /* fetch, schema, markup */
}
```

### GOOD — split

```tsx
// model/login-schema.ts — schema + type
// api/login.ts — submit
// ui/login-form.tsx — useZodForm + AppForm + fields
```
