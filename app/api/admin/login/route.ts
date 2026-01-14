import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, verifyAdminApiKey } from "lib/supabase/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API ключ е задължителен" },
        { status: 400 }
      );
    }

    // Verify API key
    if (!verifyAdminApiKey(apiKey)) {
      return NextResponse.json(
        { error: "Невалиден API ключ" },
        { status: 401 }
      );
    }

    // Create session
    await createAdminSession(apiKey);

    return NextResponse.json(
      { success: true, message: "Успешно влизане" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing admin login:", error);
    return NextResponse.json(
      { error: "Грешка при влизане" },
      { status: 500 }
    );
  }
}
