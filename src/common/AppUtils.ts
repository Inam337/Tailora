export function getRandomString(length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export function generateEntityId(prefix?: string): string {
  const base = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${getRandomString(8)}`;

  return prefix ? `${prefix}_${base}` : base;
}

export function formatCurrencyPKR(amount: number, locale = 'en-PK'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortDate(isoDate: string, locale?: string): string {
  const d = new Date(isoDate);

  if (Number.isNaN(d.getTime())) {
    return isoDate;
  }

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function toArrayBuffer<T>(obj: T): ArrayBuffer {
  const json = JSON.stringify(obj);

  return new TextEncoder().encode(json).buffer;
}

export function toObject<T>(buf: ArrayBuffer): T {
  const txt = new TextDecoder().decode(new Uint8Array(buf));

  return JSON.parse(txt);
}

/** Digits suitable for https://wa.me/{digits} (Pakistan: leading 0 → 92). */
export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('92')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `92${digits.slice(1)}`;
  }

  if (digits.length >= 10) {
    return `92${digits}`;
  }

  return digits;
}

export function buildWhatsAppShareUrl(phone: string, message: string): string | null {
  const n = normalizePhoneForWhatsApp(phone);

  if (!n) {
    return null;
  }

  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export type PaymentSlipContext = {
  paymentId: string;
  paymentDateFormatted: string;
  amountFormatted: string;
  paymentMethodLabel: string;
  orderDressType: string;
  orderId: string;
  customerName: string;
  customerPhone?: string;
};

export function buildPaymentSlipMessage(ctx: PaymentSlipContext): string {
  const lines = [
    '*Tailora — Payment receipt*',
    '',
    `Payment ID: ${ctx.paymentId}`,
    `Date: ${ctx.paymentDateFormatted}`,
    `Amount: ${ctx.amountFormatted}`,
    `Method: ${ctx.paymentMethodLabel}`,
    '',
    `Order: ${ctx.orderDressType}`,
    `Order ID: ${ctx.orderId}`,
    `Customer: ${ctx.customerName}`,
  ];

  if (ctx.customerPhone?.trim()) {
    lines.push(`Phone: ${ctx.customerPhone.trim()}`);
  }

  lines.push('', 'Thank you for your payment.');

  return lines.join('\n');
}
