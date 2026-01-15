import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, subject } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Име, имейл, телефон и съобщение са задължителни" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Невалиден формат на имейл" },
        { status: 400 }
      );
    }

    // Send email
    await sendContactFormEmail({
      name,
      email,
      phone,
      message,
      subject,
    });

    return NextResponse.json(
      { success: true, message: "Contact form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send contact form email" },
      { status: 500 }
    );
  }
}
