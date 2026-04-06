import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

function sessionTokenHex(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return null;
  return createHmac("sha256", "ferti-lider-admin-session")
    .update(pwd)
    .digest("hex");
}

export function createAdminSessionToken(): string {
  const t = sessionTokenHex();
  if (!t) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  return t;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const expected = sessionTokenHex();
  if (!expected || !token || token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function adminPasswordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  try {
    const a = Buffer.from(input, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
