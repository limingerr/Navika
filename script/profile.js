export function normalizeGpa(value) {
    const normalized = value.trim().replace(",", ".");
    if (!normalized)
        return "";
    if (!/^\d(?:\.\d{1,2})?$/.test(normalized) || Number(normalized) > 4)
        return null;
    return normalized;
}
