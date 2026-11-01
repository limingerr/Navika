export function adminEmailForIdentifier(identifier) {
  const clean = identifier?.trim().toLowerCase();
  return clean === "nav-adm-9921-z4" ? "admin@navika.id" : null;
}
