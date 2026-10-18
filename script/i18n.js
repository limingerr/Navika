export function translate(locale, id, en) {
    return locale === "en" ? en : id;
}
export function resolveTheme(theme, prefersDark) {
    return theme === "system" ? (prefersDark ? "dark" : "light") : theme;
}
