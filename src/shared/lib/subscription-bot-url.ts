const TELEGRAM_PAY_BOT_URL = "https://t.me/tarih_pay_bot";

export function getSubscriptionBotUrl(planSlug?: string) {
  if (planSlug == null || planSlug.length === 0) {
    return TELEGRAM_PAY_BOT_URL;
  }

  const params = new URLSearchParams();
  params.set("start", `plan_${planSlug}`);

  return `${TELEGRAM_PAY_BOT_URL}?${params.toString()}`;
}
