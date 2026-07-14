export function normalizeTag(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();
}

export function normalizeTags(values: readonly string[]) {
  return [...new Set(values.map(normalizeTag).filter(Boolean))].slice(0, 10);
}
