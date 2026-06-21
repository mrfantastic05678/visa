export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(" ");
}

export const EXPRESS_SURCHARGE_AED = Number(
  process.env.EXPRESS_SURCHARGE_AED ?? 99
);

export const APP_ID_REGEX = /^VIS-\d{4}-[A-Z0-9]{6}$/;

export function generateAppId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    suffix += chars[byte % chars.length];
  }
  return `VIS-${year}-${suffix}`;
}

export function formatAed(amount: number): string {
  return `AED ${amount.toLocaleString("en-AE")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
