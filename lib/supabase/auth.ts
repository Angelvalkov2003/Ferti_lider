import { cookies } from "next/headers";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
  throw new Error("ADMIN_API_KEY is not set in environment variables");
}

const ADMIN_SESSION_COOKIE = "admin_session";

/**
 * Verify admin API key
 */
export function verifyAdminApiKey(apiKey: string): boolean {
  return apiKey === ADMIN_API_KEY;
}

/**
 * Check if admin is authenticated (has valid session)
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!session?.value) {
    return false;
  }

  // Verify the session token matches the admin API key
  // In a production app, you might want to use JWT tokens or more secure session management
  return session.value === ADMIN_API_KEY;
}

/**
 * Create admin session (set cookie)
 */
export async function createAdminSession(apiKey: string): Promise<boolean> {
  if (!verifyAdminApiKey(apiKey)) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_API_KEY, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return true;
}

/**
 * Destroy admin session (remove cookie)
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
