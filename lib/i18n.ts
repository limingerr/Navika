export type Locale = "id" | "en";
export type Theme = "light" | "dark" | "system";

export function translate(locale: Locale, id: string, en: string) {
  return locale === "en" ? en : id;
}

export function resolveTheme(theme: Theme, prefersDark: boolean) {
  return theme === "system" ? (prefersDark ? "dark" : "light") : theme;
}
