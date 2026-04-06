import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "lib/admin-session";

export async function POST() {
  const res = NextResponse.json(
    { success: true, message: "Успешно излизане" },
    { status: 200 }
  );

  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
