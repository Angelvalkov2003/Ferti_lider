import { getSupabaseServerClient } from "./server";

/**
 * Check if admin is authenticated (has valid Supabase Auth session)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    // User is authenticated - for MVP, any authenticated user can access admin
    // You can add role-based checks here if needed (e.g., check admins table)
    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
