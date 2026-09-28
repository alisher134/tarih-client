---
description: UI kit, Tailwind CSS, and asset conventions
globs: "{src/**/*.tsx,app/**/*.tsx,app/**/*.css}"
alwaysApply: false
---

# UI and styling

Stack: Tailwind CSS v4, shadcn/ui (base-nova), `@base-ui/react`, `class-variance-authority`, `cn` from `"cn"`, Lucide icons.

## Reuse shared UI

Before creating a new primitive, check `shared/ui/`. Extend via variants, do not duplicate.

### BAD — custom button from scratch

```tsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Submit
</button>
```

### GOOD — use existing Button

```tsx
import { Button } from "@/shared/ui/button";

<Button type="submit">Submit</Button>;
```

### GOOD — extend via CVA variants (like LinkButton)

```tsx
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "cn";

<Link
  className={cn(buttonVariants({ variant: "ghost", size: "lg" }), className)}
/>;
```

## className merging

Always merge classes with `cn()` when accepting `className` prop.

### BAD

```tsx
function Card({ className }: { className?: string }) {
  return <div className={`rounded-lg border p-4 ${className}`} />;
}
```

### GOOD

```tsx
import { cn } from "cn";

function Card({ className }: CardProps) {
  return <div className={cn("rounded-lg border p-4", className)} />;
}
```

## Layout

Use `Container` for page-width constraints.

### BAD — repeated max-width on every page

```tsx
<main className="mx-auto max-w-7xl px-4">{children}</main>
```

### GOOD

```tsx
import { Container } from "@/shared/ui/container";

<Container>{children}</Container>;
```

## Icons

- UI icons: `lucide-react` (`ChevronDownIcon`, not default import)
- Brand/custom icons: SVGR from `@/shared/assets/icons/`

### BAD — inline SVG copy-pasted in every component

```tsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

### GOOD — Lucide for standard icons

```tsx
import { ChevronDownIcon } from "lucide-react";

<ChevronDownIcon className="size-4 text-muted-foreground" />;
```

### GOOD — SVGR for brand assets

```tsx
import LogoIcon from "@/shared/assets/icons/logo-icon.svg?react";

<LogoIcon className="size-6" aria-hidden />;
```

SVG imports:

- `*.svg?react` → React component
- `*.svg` → URL string (for `<img>` or `next/image`)

## Tailwind conventions

- Use design tokens from `globals.css`: `text-muted-foreground`, `bg-primary`, `border-border`
- Prefer semantic tokens over raw colors: `text-primary` not `text-blue-500`
- Icon sizing: `size-4`, `size-6` — shadcn Button already handles `[&_svg]` sizing
- Spacing: consistent gaps (`gap-1`, `gap-2`) and padding aligned with existing components

### BAD — arbitrary values everywhere

```tsx
<div className="mt-[17px] text-[#333333] w-[342px]">
```

### GOOD — design system tokens

```tsx
<div className="mt-4 text-muted-foreground w-full max-w-sm">
```

## Accessibility

### BAD

```tsx
<button onClick={handleClose}>
  <XIcon />
</button>
```

### GOOD

```tsx
<button type="button" onClick={handleClose} aria-label={t("close")}>
  <XIcon aria-hidden />
</button>
```

Decorative icons: `aria-hidden`. Meaningful icons: `aria-label` on the interactive element.

## Forms

Use existing `Input`, `Textarea`, `InputGroup` from `shared/ui/`. Match field spacing with neighboring forms.

### BAD — raw input with mismatched styles

```tsx
<input className="border p-2 rounded" />
```

### GOOD

```tsx
import { Input } from "@/shared/ui/input";

<Input type="email" placeholder={t("emailPlaceholder")} />;
```

## Responsive and states

Handle interactive states via Tailwind variants already in the design system (`hover:`, `focus-visible:`, `disabled:`, `aria-expanded:`).

### BAD — manual state class toggling duplicated across components

```tsx
className={isActive ? "bg-gray-200 font-bold" : "bg-white font-normal"}
```

### GOOD — use Button variant prop

```tsx
<Button variant={isActive ? "default" : "ghost"}>{label}</Button>
```

## Do not

- Add SCSS/CSS modules unless the task explicitly requires it — project uses Tailwind
- Install new UI libraries without being asked — extend shadcn/shared first
- Override shadcn component internals — compose or add variants via CVA
