import crypto from "crypto";

const ADMIN_SECRET =
  process.env.ADMIN_TOKEN ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "navika-admin-supersecret-token-2026";

/**
 * Membuat token sesi admin yang aman dengan HMAC-SHA256
 */
export function generateAdminSessionToken(userId, email) {
  const payload = `${userId || "admin"}:${email || "admin@navika.id"}:${Date.now()}`;
  const base64Payload = Buffer.from(payload).toString("base64url");
  const hmac = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(base64Payload)
    .digest("hex");
  return `${base64Payload}.${hmac}`;
}

/**
 * Memvalidasi keaslian token sesi admin
 */
export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [base64Payload, providedHmac] = parts;
  try {
    const expectedHmac = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(base64Payload)
      .digest("hex");

    const providedBuf = Buffer.from(providedHmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (providedBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(providedBuf, expectedBuf);
  } catch {
    return false;
  }
}
