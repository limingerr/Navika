export function jakartaDateAfterDays(now, days) {
  const date = new Date(now.getTime() + days * 86400000);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function deadlineTarget(opp) {
  return {
    databaseId: opp.id,
    id: opp.slug || opp.id,
    title: opp.title,
    organization: opp.organization,
    category: opp.primary_category?.name || "Peluang",
  };
}
