const privatePaths = ["/pengaturan", "/profil", "/tersimpan", "/dashboard", "/kalender", "/notifikasi"];

export function isProtectedPage(pathname) {
  return privatePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function safeRedirectPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  try {
    const url = new URL(value, "https://navika.invalid");
    return url.origin === "https://navika.invalid" && isProtectedPage(url.pathname)
      ? `${url.pathname}${url.search}${url.hash}`
      : null;
  } catch {
    return null;
  }
}
