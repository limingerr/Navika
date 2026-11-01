export function adminEmailForIdentifier(identifier) {
  const clean = identifier?.trim().toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-");
  return clean === "nav-adm-9921-z4" ? "admin@navika.id" : null;
}
