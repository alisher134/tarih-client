---
description: Keep code and React components readable, small, and reusable
alwaysApply: true
---

# Readable code and components

- Write code for the next developer to understand on the first read
- Use domain-specific names; avoid `data`, `item`, `value`, `temp`, `result` when a precise name exists
- Component flow: inputs and hooks → derived state → handlers → guards → JSX
- Move data fetching and sync into hooks; move pure transforms into `lib/`
- Target ≤100 lines per component; 100–200 only when cohesive; never deliver >200 lines
- Split by visible responsibility, not arbitrary line ranges
- Keep props small — pass only what a child needs
- Reuse existing components/hooks; extract shared code only with a real second consumer
- One component per file; avoid nested ternaries, long inline callbacks, duplicated JSX branches
- Before delivery, reread every changed component top to bottom

## Large component

### BAD — one component owns the whole screen

```tsx
function SellerPage({ sellerId }: SellerPageProps) {
  const [search, setSearch] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { data: seller, isLoading } = useSeller(sellerId);
  const { data: products = [] } = useSellerProducts(sellerId);

  if (isLoading) return <SellerSkeleton />;
  if (!seller) return <NotFound />;

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main>
      <section>
        <Image src={seller.logo} alt={seller.name} />
        <h1>{seller.name}</h1>
        <p>{seller.description}</p>
        <button onClick={() => setIsContactOpen(true)}>Contact</button>
      </section>
      <section>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
        <div>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <ContactModal
        seller={seller}
        open={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
```

### GOOD — page reads as a screen outline

```tsx
function SellerPage({ sellerId }: SellerPageProps) {
  const { seller, products, isLoading, isNotFound } = useSellerPage(sellerId);

  if (isLoading) return <SellerSkeleton />;
  if (isNotFound) return <NotFound />;

  return (
    <SellerLayout>
      <SellerHero seller={seller} />
      <SellerProductSection products={products} />
      <SellerContactModal seller={seller} />
    </SellerLayout>
  );
}
```

## Logic in hooks

### BAD — filtering, URL sync, and rendering mixed

```tsx
function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProductSort>("popular");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
    return filtered.sort((a, b) =>
      sort === "price" ? a.price - b.price : b.sales - a.sales,
    );
  }, [products, search, sort]);

  useEffect(() => {
    router.replace(`?search=${search}&sort=${sort}`);
  }, [router, search, sort]);

  return (/* ... */);
}
```

### GOOD — behavior has a name

```tsx
function ProductList({ products }: ProductListProps) {
  const {
    search,
    sort,
    visibleProducts,
    handleSearchChange,
    handleSortChange,
  } = useProductListFilters(products);

  return (
    <section>
      <ProductFilters
        search={search}
        sort={sort}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
      <ProductGrid products={visibleProducts} />
    </section>
  );
}
```

## Business rules in plain functions

### BAD — nested ternaries in JSX

```tsx
function OrderStatus({ order }: OrderStatusProps) {
  return (
    <Tag
      color={
        order.cancelled
          ? "red"
          : order.paid && order.shipped
            ? "green"
            : order.paid
              ? "blue"
              : "orange"
      }
    >
      {order.cancelled
        ? "Cancelled"
        : order.paid && order.shipped
          ? "Delivered"
          : order.paid
            ? "Paid"
            : "Pending"}
    </Tag>
  );
}
```

### GOOD — explicit helper

```tsx
function OrderStatus({ order }: OrderStatusProps) {
  const status = getOrderStatus(order);
  return <Tag color={status.color}>{status.label}</Tag>;
}

function getOrderStatus(order: Order): OrderStatusView {
  if (order.cancelled) return { color: "red", label: "Cancelled" };
  if (order.paid && order.shipped)
    return { color: "green", label: "Delivered" };
  if (order.paid) return { color: "blue", label: "Paid" };
  return { color: "orange", label: "Pending" };
}
```

## Server vs client components

Default to Server Components. Add `"use client"` only when the file needs hooks, browser APIs, or event handlers.

### BAD — entire feature tree is client

```tsx
"use client";

export async function Header() {
  const t = await getTranslations("header"); // invalid in client component
  return <header>{t("login")}</header>;
}
```

### GOOD — server shell + client leaf

```tsx
// header.tsx — Server Component
export async function Header() {
  const t = await getTranslations("header");
  return (
    <header>
      <ChangeLanguage />
      <LinkButton href="/login">{t("login")}</LinkButton>
    </header>
  );
}

// change-language-list.tsx — Client Component (needs onClick + router)
("use client");
export function ChangeLanguageList({ currentLocale }: Props) {
  /* ... */
}
```

## Props drilling vs composition

### BAD — pass entire entity when child needs one field

```tsx
<EventCard event={event} />
// EventCardTitle only uses event.title but receives full event + 20 fields
```

### GOOD — pass only what child needs

```tsx
<EventCardTitle title={event.title} />
<EventCardPrice price={event.price} />
```

## Conditional rendering

### BAD — duplicate markup branches

```tsx
{
  isLoading ? (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
    </div>
  );
}
```

### GOOD — extract variant or guard early

```tsx
if (isLoading) return <EventCardSkeleton />;

return (
  <div className="flex flex-col gap-2">
    <h2>{event.title}</h2>
    <p>{event.description}</p>
  </div>
);
```

## Lists

### BAD — index as key for mutable lists

```tsx
{
  items.map((item, index) => <Row key={index} item={item} />);
}
```

### GOOD — stable id

```tsx
{
  localeOptions.map((item) => (
    <Button key={item.code} /* ... */>{item.label}</Button>
  ));
}
```
