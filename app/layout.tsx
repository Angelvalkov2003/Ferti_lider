import { CartProvider } from "components/cart/cart-context";
import { ConditionalNavbar } from "components/layout/conditional-navbar";
import { CookieConsent } from "components/cookie-consent";
import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const SITE_NAME = process.env.SITE_NAME || "Ecommerce Store";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Cart is now loaded from localStorage in CartProvider
  // No need to fetch from database or pass any props

  return (
    <html lang="bg" className={GeistSans.variable}>
      <body className={`${GeistSans.className} bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white`}>
        <CartProvider>
          <ConditionalNavbar />
          <main suppressHydrationWarning>
            {children}
            <Toaster closeButton />
          </main>
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
