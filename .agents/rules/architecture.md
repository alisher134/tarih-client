---
description: Feature-Sliced Design layer boundaries and imports
alwaysApply: true
---

# Architecture (FSD)

Layers (top → bottom): `app/` → `src/_app` → `src/_pages` → `src/widgets` → `src/features` → `src/entities` → `src/shared`

**Import rule:** a module may import only from layers **below** it, never from above or sideways across slices at the same layer.

| Layer      | Responsibility                            | Examples                           |
| ---------- | ----------------------------------------- | ---------------------------------- |
| `app/`     | Next.js routes, layouts, metadata         | `app/[locale]/page.tsx`            |
| `_app`     | App shell, providers, global i18n request | `main-layout.tsx`, `request.ts`    |
| `_pages`   | Full page compositions                    | `home-page.tsx`                    |
| `widgets`  | Large independent UI blocks               | `header`, `footer`                 |
| `features` | User actions / business interactions      | `change-language`, `change-region` |
| `entities` | Business entities                         | `event`, `user`                    |
| `shared`   | UI kit, config, utils, i18n infra         | `shared/ui`, `shared/config`       |

## Import boundaries

### BAD — feature imports from widget

```tsx
// features/event-filter/ui/event-filter.tsx
import { Header } from "@/widgets/header";
```

### BAD — shared imports from feature

```tsx
// shared/ui/event-badge.tsx
import { useCart } from "@/features/add-to-cart";
```

### GOOD — top imports from bottom

```tsx
// widgets/header/ui/header.tsx
import { ChangeLanguage } from "@/features/change-language";
import { Container } from "@/shared/ui/container";
```

```tsx
// _pages/home/ui/home-page.tsx
import { Container } from "@/shared/ui/container";
import { Button } from "@/shared/ui/button";
```

## Page composition

Route files in `app/` stay thin — delegate to `_pages`.

### BAD — business UI directly in route

```tsx
// app/[locale]/page.tsx
export default function Page() {
  return (
    <main>
      <h1>Events</h1>
      {/* 200 lines of page markup */}
    </main>
  );
}
```

### GOOD — route re-exports page slice

```tsx
// app/[locale]/page.tsx
export { HomePage as default } from "@/_pages/home";
```

## Slice public API

Each slice exposes only what others need via `index.ts`.

### BAD — export internals

```tsx
// features/change-language/index.ts
export { ChangeLanguage } from "./ui/change-language";
export { ChangeLanguageList } from "./ui/change-language-list"; // internal detail
```

### GOOD — hide implementation details

```tsx
// features/change-language/index.ts
export { ChangeLanguage } from "./ui/change-language";
// ChangeLanguageList stays private — used only inside the feature
```

## Where to put new code

| Need                     | Place                       |
| ------------------------ | --------------------------- |
| Reusable button, input   | `shared/ui/`                |
| Locale config, routing   | `shared/config/i18n/`       |
| "Switch language" action | `features/change-language/` |
| Site header block        | `widgets/header/`           |
| Full home screen         | `_pages/home/`              |
| App-wide layout          | `_app/layouts/`             |
| Next.js route wiring     | `app/[locale]/`             |

### BAD — dump everything in shared

```tsx
// shared/ui/header-with-language-switcher.tsx — belongs in widgets + features
```

### GOOD — split by responsibility

```tsx
// widgets/header/ui/header.tsx        — layout of header
// features/change-language/             — language switching behavior
```

## Cross-feature communication

### BAD — feature A imports feature B directly

```tsx
// features/checkout/ui/checkout-form.tsx
import { AddToCartButton } from "@/features/add-to-cart";
```

Prefer composition at widget/page level, or shared entity layer for common data.

### GOOD — page/widget composes features

```tsx
// _pages/event/ui/event-page.tsx
<EventDetails event={event} />
<AddToCart eventId={event.id} />
<ShareEvent eventId={event.id} />
```
