export function formatPriceKzt(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} ₸`;
}

export function formatPricePerMonthKzt(total: number, months: number) {
  if (months <= 0) return formatPriceKzt(total);

  return formatPriceKzt(Math.round(total / months));
}
