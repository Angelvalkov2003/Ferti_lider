import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "lib/admin-session";

// Helper to check if error is React.postpone()
function isReactPostpone(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "$$typeof" in error &&
    error.$$typeof === Symbol.for("react.postpone")
  );
}

/**
 * Админ сесия: парола от ADMIN_PASSWORD + httpOnly бисквитка (не Supabase Auth).
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(ADMIN_SESSION_COOKIE)?.value;
    return verifyAdminSessionToken(token);
  } catch (error) {
    if (isReactPostpone(error)) {
      throw error;
    }
    console.error("Error checking admin status:", error);
    return false;
  }
}

/** Няма потребителски профил при env-парола — връща null. */
export async function getCurrentUser() {
  return null;
}
