import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Липсват Supabase environment variables" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return NextResponse.json(
        { error: "Грешка при излизане" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Успешно излизане" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing admin logout:", error);
    return NextResponse.json(
      { error: "Грешка при излизане" },
      { status: 500 }
    );
  }
}
