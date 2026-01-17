import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL. Please add it to your .env.local file.\n" +
    "Example: NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please add it to your .env.local file.\n" +
    "Get it from Supabase Dashboard -> Settings -> API -> anon public key"
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}". It must be a valid HTTP/HTTPS URL.\n` +
    "Example: https://your-project-id.supabase.co"
  );
}

// Helper to check if error is React.postpone()
function isReactPostpone(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "$$typeof" in error &&
    error.$$typeof === Symbol.for("react.postpone")
  );
}

export async function getSupabaseServerClient() {
  // TypeScript guard: ensure variables are defined
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  try {
    const cookieStore = await cookies();
    
    return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Don't catch React.postpone() - let it propagate
            if (isReactPostpone(error)) {
              throw error;
            }
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            // Don't catch React.postpone() - let it propagate
            if (isReactPostpone(error)) {
              throw error;
            }
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  } catch (error) {
    // Don't catch React.postpone() - let it propagate for PPR
    if (isReactPostpone(error)) {
      throw error;
    }
    console.error("Error creating Supabase server client:", error);
    throw error;
  }
}

// Legacy export for backward compatibility
export async function createServerClient() {
  return getSupabaseServerClient();
}
