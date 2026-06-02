/** Parse tea variant size strings like "10g", "1kg" into grams. */
export function parseSizeGrams(size: string): number {
  const s = size.trim().toLowerCase();
  const kgMatch = s.match(/^(\d+(?:\.\d+)?)\s*kg$/);
  if (kgMatch) return Math.round(parseFloat(kgMatch[1]) * 1000);
  const gMatch = s.match(/^(\d+(?:\.\d+)?)\s*g$/);
  if (gMatch) return Math.round(parseFloat(gMatch[1]));
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Pack sizes below 100g are treated as samples (per price sheet). */
export const SAMPLE_MAX_GRAMS = 99;

export function isSampleSize(size: string): boolean {
  const grams = parseSizeGrams(size);
  return grams > 0 && grams <= SAMPLE_MAX_GRAMS;
}

export function isBulkSize(size: string): boolean {
  const grams = parseSizeGrams(size);
  return grams >= 100;
}
