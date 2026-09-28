---
description: Core coding standards — always apply
alwaysApply: true
---

# General

## Principles

- Prefer readability over clever code
- Avoid overengineering; keep solutions simple (KISS)
- Do not duplicate logic — extract only when a second consumer exists (DRY)
- Use early returns to keep control flow flat
- Keep each file focused on one responsibility
- Match neighboring code: Tailwind + shadcn/ui, next-intl, FSD layers
- Delivered code must not contain TODOs, placeholders, or incomplete implementations
- During work, report any temporary WIP; remove it before delivery
- Ask clarifying questions only when requirements are ambiguous
- Do not expand scope (no extra refactors, docs, or comments unless asked)

## Scope and delivery

### BAD — drive-by refactor while fixing a bug

```tsx
// Task: fix login button label
// Also renames 12 files, reformats unrelated components, adds a generic useDebounce hook
```

### GOOD — minimal diff for the task

```tsx
// Task: fix login button label
<LinkButton href="/login">{t("login")}</LinkButton>
```

### BAD — placeholder left in delivered code

```tsx
function EventCard() {
  // TODO: add price formatting
  return <div>...</div>;
}
```

### GOOD — complete implementation or explicit guard

```tsx
function EventCard({ price }: EventCardProps) {
  if (price == null) return null;

  return <div>{formatPrice(price)}</div>;
}
```

## Control flow

### BAD — nested conditions

```tsx
function canCheckout(cart: Cart) {
  if (cart.items.length > 0) {
    if (cart.user) {
      if (!cart.user.isBlocked) {
        return true;
      }
    }
  }
  return false;
}
```

### GOOD — early returns

```tsx
function canCheckout(cart: Cart) {
  if (cart.items.length === 0) return false;
  if (!cart.user) return false;
  if (cart.user.isBlocked) return false;

  return true;
}
```

## Abstractions

### BAD — helper extracted after one use

```tsx
function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString("ru-KZ");
}

// used once in one component — keep inline until reused
```

### GOOD — extract when a second consumer appears

```tsx
// format-event-date.ts used in EventCard and EventPage header
export function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString("ru-KZ");
}
```

## Import order

Group imports in this order, blank line between groups:

1. React / Next.js / third-party
2. `@/_app`, `@/_pages`, `@/widgets`, `@/features`, `@/entities`, `@/shared`
3. Relative (`./`, `../`)

### BAD

```tsx
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { ChangeLanguage } from "@/features/change-language";
import { ChangeLanguageList } from "./change-language-list";
```

### GOOD

```tsx
import { useState } from "react";

import { ChangeLanguage } from "@/features/change-language";
import { Button } from "@/shared/ui/button";

import { ChangeLanguageList } from "./change-language-list";
```

## Comments

- Do not comment obvious code
- Comment only non-obvious business rules or external constraints

### BAD

```tsx
// Set loading to true
setIsLoading(true);
```

### GOOD

```tsx
// Backend returns null price for free events; treat as "price hidden", not zero
if (event.price == null) return t("free");
```
