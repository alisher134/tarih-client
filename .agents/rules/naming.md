---
description: Naming conventions for this Next.js frontend
alwaysApply: true
---

# Naming

## Files and folders

- Files and folders: `kebab-case` (`change-language.tsx`, `change-region/`)
- Components: `PascalCase`; hooks: `useSomething`
- Booleans: `is` / `has` / `can` / `should` prefix
- Constants: `UPPER_SNAKE_CASE`
- Types: `PascalCase`
- Callback props: `onX`; local handlers: `handleX`
- Module public API: `index.ts` barrel — import the folder, not a file inside it
- Avoid abbreviations unless domain-standard (`KZ`, `DTO`, `i18n`)

### BAD — inconsistent file names

```
src/features/ChangeLanguage/ChangeLanguage.tsx
src/widgets/header/Header.tsx
src/shared/ui/SearchInput.tsx
```

### GOOD — kebab-case files, PascalCase exports

```
src/features/change-language/ui/change-language.tsx   → export function ChangeLanguage
src/widgets/header/ui/header.tsx                      → export function Header
src/shared/ui/search-input.tsx                        → export function SearchInput
```

## FSD module structure

```
feature-name/
  index.ts          # public API
  ui/               # components
  model/            # types, stores (when needed)
  api/              # fetchers (when needed)
  lib/              # pure helpers (when needed)
```

### BAD — deep import bypassing barrel

```tsx
import { ChangeLanguage } from "@/features/change-language/ui/change-language";
```

### GOOD — import through public API

```tsx
import { ChangeLanguage } from "@/features/change-language";
```

```ts
// features/change-language/index.ts
export { ChangeLanguage } from "./ui/change-language";
```

## Variables and props

### BAD — vague names

```tsx
function OrderRow({ data, item, value, handleClick }: Props) {
  const temp = data.status;
  const result = value * item.count;
}
```

### GOOD — domain-specific names

```tsx
function OrderRow({ order, ticketPrice, onSelect }: OrderRowProps) {
  const orderStatus = order.status;
  const totalPrice = ticketPrice * order.ticketCount;
}
```

## Event handlers

### BAD

```tsx
<Button onClick={() => setOpen(true)} />
<Select onChange={(e) => onChange(e.target.value)} />
```

### GOOD — named handler when logic grows; inline only for one-liners

```tsx
function ChangeLanguageList({ currentLocale }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  return (
    <Button onClick={() => handleLocaleChange(item.code)}>{item.label}</Button>
  );
}
```

## Translation namespaces

- One JSON file per feature/widget namespace: `change-language.json`, `header.json`
- Namespace key matches file name: `getTranslations("changeLanguage")` ↔ `change-language.json`

### BAD

```tsx
const t = await getTranslations("common"); // mega-file with unrelated strings
t("headerLoginButtonLabel");
```

### GOOD

```tsx
const t = await getTranslations("header");
t("login");
```
