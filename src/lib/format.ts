export function formatCurrency(amount: number, decimals = 2): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `£${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `£${(amount / 1_000).toFixed(0)}k`;
  return `£${amount.toFixed(0)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function formatDate(d: string | Date): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(d: string | Date): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleString("en-GB");
}

export function getEmailError(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return null;
}

export function getPhoneError(phone: string): string | null {
  if (!phone.trim()) return "Phone is required";
  // Normalise: drop spaces/hyphens/parens/dots, then map +44 / 0044 to the
  // national 0… form. UK numbers in national form start with 0 and are 10–11
  // digits in total (e.g. 07911 123456, 020 7946 0958).
  let n = phone.replace(/[\s().-]/g, "");
  if (n.startsWith("+44")) n = "0" + n.slice(3);
  else if (n.startsWith("0044")) n = "0" + n.slice(4);
  if (!/^0\d{9,10}$/.test(n)) return "Enter a valid UK phone number";
  return null;
}

/** Cap a phone input to the UK maximum digit count for the form being typed
 *  (national 0… = 11, +44 = 12, 0044 = 14), preserving spaces/“+” formatting.
 *  Used on input so the field can't exceed a valid UK length. */
export function clampUkPhone(raw: string): string {
  const startsPlus = raw.trimStart().startsWith("+");
  const allDigits = raw.replace(/\D/g, "");
  const max = startsPlus && allDigits.startsWith("44") ? 12 : allDigits.startsWith("0044") ? 14 : 11;
  if (allDigits.length <= max) return raw;
  let count = 0;
  let out = "";
  for (const ch of raw) {
    if (/\d/.test(ch)) {
      if (count >= max) break;
      count++;
    }
    out += ch;
  }
  return out;
}

export function getPostcodeError(postcode: string): string | null {
  if (!postcode.trim()) return "Postcode is required";
  // Loose UK postcode pattern
  if (!/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(postcode.trim())) {
    return "Enter a valid UK postcode";
  }
  return null;
}

/** Canonical UK postcode form: uppercase, single space before the 3-char inward
 *  code (e.g. "sw1a1aa" → "SW1A 1AA"). Returns the trimmed/uppercased input
 *  unchanged if it's too short to split. */
export function formatUkPostcode(postcode: string): string {
  const s = postcode.replace(/\s+/g, "").toUpperCase();
  return s.length >= 5 ? `${s.slice(0, -3)} ${s.slice(-3)}` : s;
}

export function relativeTime(d: string | Date): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  const diff = (Date.now() - dt.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dt);
}
