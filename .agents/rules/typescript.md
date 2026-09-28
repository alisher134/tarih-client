---
description: TypeScript standards for this repo
alwaysApply: true
---

# TypeScript

`tsconfig.json` has `strict: true` — still guard optional DTO fields at runtime when data comes from the backend. Do not turn `strict` off as a drive-by change.

- Do not add new `any`. Existing `any` on the backend boundary is tolerated; do not globally rewrite it
- Prefer `unknown` + narrowing over `any`
- Avoid `@ts-ignore` / `@ts-expect-error` unless unavoidable and commented why
- Prefer `type` for data shapes; `interface` when you need `extends` or declaration merging
- Domain types live in the module (`api/type.ts`, `model/`), not inside a UI component
- Prettier: double quotes (including JSX), semicolons, `printWidth: 80`

## Nullable backend fields

### BAD — assumes field exists

```tsx
function EventPrice({ event }: { event: EventDto }) {
  return <span>{event.price.amount}</span>;
}
```

### GOOD — explicit guard

```tsx
type Price = { amount: number } | null;

function formatPrice(price: Price): string {
  if (price == null) return "";
  return String(price.amount);
}
```

## unknown vs any

### BAD

```tsx
function parseError(error: any) {
  return error.message;
}
```

### GOOD

```tsx
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}
```

## Type location

### BAD — DTO inside component file

```tsx
// event-card.tsx
type EventDto = { id: string; title: string };
export function EventCard({ event }: { event: EventDto }) {}
```

### GOOD — type in module model

```tsx
// entities/event/model/types.ts
export type Event = { id: string; title: string };

// entities/event/ui/event-card.tsx
import type { Event } from "../model/types";
```

## Const assertions and satisfies

Use `as const satisfies` for config objects that must stay typed and readonly.

### BAD — loses locale union

```tsx
export const localeOptions = [
  { code: "kz", label: "Қазақша" },
  { code: "ru", label: "Русский" },
];
// code becomes string, not Locale
```

### GOOD

```tsx
export const localeOptions = [
  { code: "kz", label: "Қазақша", shortLabel: "Қаз" },
  { code: "ru", label: "Русский", shortLabel: "Рус" },
] as const satisfies readonly {
  code: Locale;
  label: string;
  shortLabel: string;
}[];
```

## Props typing

### BAD — inline object type on every component

```tsx
export function Container({ children }: { children: React.ReactNode }) {}
```

### GOOD — named props type when exported or reused

```tsx
type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {}
```

## Enums

Prefer string union types over `enum`.

### BAD

```tsx
enum OrderStatus {
  Pending = "pending",
  Paid = "paid",
}
```

### GOOD

```tsx
type OrderStatus = "pending" | "paid" | "cancelled";
```
