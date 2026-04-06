import { NextRequest, NextResponse } from "next/server";
import {
  adminPasswordMatches,
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "lib/admin-session";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Липсва ADMIN_PASSWORD в средата (.env.local)" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json(
        { error: "Паролата е задължителна" },
        { status: 400 }
      );
    }

    if (!adminPasswordMatches(password)) {
      return NextResponse.json(
        { error: "Невалидна парола" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const res = NextResponse.json(
      { success: true, message: "Успешно влизане" },
      { status: 200 }
    );

    res.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    console.error("Error processing admin login:", error);
    return NextResponse.json(
      { error: error.message || "Грешка при влизане" },
      { status: 500 }
    );
  }
}
