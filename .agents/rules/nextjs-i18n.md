---
description: Next.js App Router and next-intl patterns
globs: "{app/**,src/**}"
alwaysApply: false
---

# Next.js and i18n

Stack: Next.js 16 App Router, `next-intl`, locales `kz` / `ru` / `en`.

## Routing and navigation

Always use i18n-aware navigation from `@/shared/config/i18n/navigation` — never raw `next/link` or `next/navigation` for app routes.

### BAD

```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

<Link href="/login">Login</Link>;
router.push("/events");
```

### GOOD

```tsx
import { Link, useRouter, usePathname } from "@/shared/config/i18n/navigation";

<Link href="/login">{t("login")}</Link>;
router.replace(pathname, { locale: "ru" });
```

## Translations

- Server Components: `getTranslations` from `next-intl/server`
- Client Components: `useTranslations` from `next-intl`
- Add strings to `shared/config/i18n/messages/{locale}/{namespace}.json`
- Register namespace in `load-messages.ts`

### BAD — hardcoded UI strings

```tsx
export async function Header() {
  return <LinkButton href="/login">Войти</LinkButton>;
}
```

### GOOD

```tsx
export async function Header() {
  const t = await getTranslations("header");
  return <LinkButton href="/login">{t("login")}</LinkButton>;
}
```

### BAD — fetch all messages in client component unnecessarily

```tsx
"use client";
import { useTranslations } from "next-intl";

export function StaticLabel() {
  const t = useTranslations("header");
  return <span>{t("brand")}</span>; // could be server-rendered
}
```

## Async params (Next.js 15+)

Route `params` and `searchParams` are Promises — always await.

### BAD

```tsx
export default function LocaleLayout({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
}
```

### GOOD

```tsx
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <MainLayout>{children}</MainLayout>;
}
```

## Server vs client split

| Need                                      | Use                                       |
| ----------------------------------------- | ----------------------------------------- |
| `getTranslations`, `getLocale`            | Server Component                          |
| `onClick`, `useState`, `useEffect`        | `"use client"`                            |
| Popover trigger with server-fetched label | Server wrapper + client interactive child |

### GOOD — matches project pattern

```tsx
// change-language.tsx — server
export async function ChangeLanguage() {
  const locale = await getLocale();
  const t = await getTranslations("changeLanguage");
  return (
    <Popover>
      <PopoverTrigger>{/* ... */}</PopoverTrigger>
      <PopoverContent>
        <ChangeLanguageList currentLocale={locale} />
      </PopoverContent>
    </Popover>
  );
}

// change-language-list.tsx — client
("use client");
export function ChangeLanguageList({ currentLocale }: Props) {
  const router = useRouter();
  /* ... */
}
```

## Metadata and static params

Export `generateStaticParams` for locale routes.

```tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

## Data fetching

Prefer Server Components for data fetching. Do not fetch in `useEffect` what can be fetched on the server.

### BAD

```tsx
"use client";
export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    fetch("/api/events").then(/* ... */);
  }, []);
}
```

### GOOD

```tsx
// _pages/events/ui/events-page.tsx — server component
export async function EventsPage() {
  const events = await getEvents();
  return <EventList events={events} />;
}
```

## Error and not-found

Use Next.js conventions: `notFound()` for invalid locale/resource, `error.tsx` for runtime errors.

### BAD — silent fallback for invalid locale

```tsx
const locale = params.locale ?? "kz"; // hides routing bugs
```

### GOOD

```tsx
if (!hasLocale(routing.locales, locale)) {
  notFound();
}
```
