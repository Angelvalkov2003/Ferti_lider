import { NextRequest, NextResponse } from "next/server";
import { destroyAdminSession } from "lib/supabase/auth";

export async function POST(request: NextRequest) {
  try {
    await destroyAdminSession();

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
