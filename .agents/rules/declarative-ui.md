---
description: Declarative UI with Show, gates, AsyncWrapper, EmptyState, and error primitives
alwaysApply: true
---

# Declarative UI

Describe _what_ is on screen. Do not branch with `if` / `&&` / ternaries in page or widget JSX for loading, error, empty, or optional data. Use the primitives in `shared/ui`. Do not invent new wrappers (`DataGuard`, `QueryBoundary`, …).

| Need                          | Use                               |
| ----------------------------- | --------------------------------- |
| loading + error + data        | `AsyncWrapper`                    |
| only loading                  | `LoaderGate`                      |
| only error (replace children) | `ErrorGate`                       |
| boolean / optional data       | `Show`                            |
| empty list / no content       | `EmptyState` (as `Show` fallback) |
| inline error                  | `ErrorAlert`                      |
| full-page error               | `ErrorPageElement`                |

Import from the file, not a made-up barrel: `@/shared/ui/async-wrapper`, `loader-gate`, `error-gate`, `show`, `empty-state`, `error-alert`, `error-page-element`, `spinner`.

## Fetch with data

`AsyncWrapper` owns the three states. `children` is a render prop with data. Do not nest `LoaderGate` / `ErrorGate` / `Show` around the same query.

### BAD — imperative branches

```tsx
if (isLoading) return <Spinner />;
if (isError) return <p>Ошибка</p>;
if (!event) return null;

return <EventDetails event={event} />;
```

### BAD — ternary / &&

```tsx
{
  isLoading ? (
    <Spinner />
  ) : isError ? (
    <ErrorAlert />
  ) : (
    event && <EventDetails event={event} />
  );
}
```

### BAD — stack gates on a query that has data

```tsx
<LoaderGate isLoading={isLoading}>
  <ErrorGate isError={isError} errorSlot={<ErrorAlert />}>
    <Show when={!!event} data={event}>
      {(event) => <EventDetails event={event} />}
    </Show>
  </ErrorGate>
</LoaderGate>
```

### GOOD

```tsx
<AsyncWrapper
  isLoading={isLoading}
  isError={isError}
  data={event}
  errorSlot={<ErrorAlert errorMessage={error?.message} />}
>
  {(event) => <EventDetails event={event} />}
</AsyncWrapper>
```

Pass `loaderSlot` only when the default spinner is wrong (skeleton, page placeholder). Pass `errorSlot` for real error UI (`ErrorAlert` or `ErrorPageElement`), not a raw string.

## Only loading

Use `LoaderGate` when there is no error/data split (toggle, deferred chunk, button wait).

### BAD

```tsx
if (isLoading) return <Spinner />;
return <Filters />;
```

### GOOD

```tsx
<LoaderGate isLoading={isLoading} loaderSlot={<Spinner />}>
  <Filters />
</LoaderGate>
```

## Only error (replace content)

`ErrorGate` **replaces** children. Use it when the block must not render on failure.

### BAD

```tsx
if (isError) return <ErrorAlert errorMessage={message} />;
return <EventList events={events} />;
```

### GOOD

```tsx
<ErrorGate isError={isError} errorSlot={<ErrorAlert errorMessage={message} />}>
  <EventList events={events} />
</ErrorGate>
```

## Error beside content

If the form or list must stay visible, do **not** use `ErrorGate` / `AsyncWrapper`. Put `ErrorAlert` in the tree.

### BAD — hides the form on submit error

```tsx
<ErrorGate isError={isError} errorSlot={<ErrorAlert errorMessage={message} />}>
  <LoginForm />
</ErrorGate>
```

### GOOD

```tsx
<>
  <Show when={isError}>
    <ErrorAlert errorMessage={message} />
  </Show>
  <LoginForm />
</>
```

## Page-level vs inline error

### BAD — full-page crash as a small alert

```tsx
<ErrorAlert errorMessage="Не удалось открыть страницу" />
```

### BAD — field-level failure as a full-page card

```tsx
<ErrorPageElement title="Неверный пароль" />
```

### GOOD — route / screen failure

```tsx
<ErrorPageElement
  title={t("title")}
  description={t("description")}
  onRetry={handleRetry}
  onGoHome={handleGoHome}
/>
```

### GOOD — query / mutation message

```tsx
<ErrorAlert errorMessage={error.message} />
```

Use `ErrorPageElement` as `errorSlot` of `AsyncWrapper` when the whole screen depends on that query.

## Optional UI

Use `Show` instead of `&&`, ternaries, and early returns for visibility. Use the render-prop `children` when you need the value narrowed.

### BAD

```tsx
{
  user && <Avatar name={user.name} />;
}
{
  isModalOpen ? <EventModal /> : null;
}
```

### GOOD — flag

```tsx
<Show when={isModalOpen}>
  <EventModal />
</Show>
```

### GOOD — narrow data

```tsx
<Show when={user != null} data={user} fallback={null}>
  {(user) => <Avatar name={user.name} />}
</Show>
```

Do not use `Show` for loading or fetch errors (`when={!isLoading}`). That is `LoaderGate` / `AsyncWrapper`.

### BAD

```tsx
<Show when={!isLoading} fallback={<Spinner />}>
  <EventDetails event={event} />
</Show>
```

## Empty content

When a list or block has no data (after a successful fetch), use `EmptyState` as the `Show` fallback. Do not use a bare muted `<p>`, custom empty cards, or invent a feature-local empty component.

`EmptyState` props: `title` (required), optional `description`, optional `action` (usually `LinkButton`). No icons.

### BAD — plain text or ad-hoc empty UI

```tsx
{
  items.length === 0 ? (
    <p className="text-sm text-muted-foreground">{t("empty")}</p>
  ) : (
    <EventList events={items} />
  );
}
```

```tsx
<div className="rounded-xl border bg-muted/30 p-4">
  <p className="text-sm text-muted-foreground">{t("empty")}</p>
  <LinkButton href="/courses">{t("browse")}</LinkButton>
</div>
```

### GOOD — Show + EmptyState

```tsx
<Show
  when={items.length > 0}
  fallback={
    <EmptyState
      title={t("emptyTitle")}
      description={t("empty")}
      action={
        <LinkButton href="/dashboard/courses" variant="outline" size="sm">
          {t("browseCourses")}
        </LinkButton>
      }
    />
  }
>
  <EventList events={items} />
</Show>
```

Title-only is fine when there is nothing useful to add:

```tsx
<Show when={items.length > 0} fallback={<EmptyState title={t("empty")} />}>
  <AdminUsersTable users={items} />
</Show>
```

`EmptyState` is for **successful empty** data, not for fetch failures (`ErrorAlert` / `ErrorPageElement`) or loading (`LoaderGate` / `AsyncWrapper`).

## Do not

- Mix `AsyncWrapper` with `LoaderGate` / `ErrorGate` for the same request
- Recreate loading/error/empty helpers in a feature
- Default `errorSlot` to a bare string when `ErrorAlert` / `ErrorPageElement` exists
- Use a muted `<p>` or custom empty card when `EmptyState` fits
- Use `Show`’s `data` without `when` (it will not render)
- Hide interactive UI with `ErrorGate` when the user still needs it
