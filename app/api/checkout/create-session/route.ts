import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "lib/stripe";
import { baseUrl } from "lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { orderId, cart } = await request.json();

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Количката е празна" },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(
      cart,
      `${baseUrl}/checkout/success?orderId=${orderId}`,
      `${baseUrl}/checkout/cancel`
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Грешка при създаване на сесия за плащане" },
      { status: 500 }
    );
  }
}
