export function normalizeGpa(value: string): string | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return "";
  if (!/^\d(?:\.\d{1,2})?$/.test(normalized) || Number(normalized) > 4) return null;
  return normalized;
}
