import { CartProvider } from "components/cart/cart-context";
import { ConditionalNavbar } from "components/layout/conditional-navbar";
import { CookieConsent } from "components/cookie-consent";
import { GeistSans } from "geist/font/sans";
import {
  APP_ICON_PATH,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_TWITTER_IMAGE_PATH,
  SITE_LOGO_PATH,
} from "lib/site-brand";
import { baseUrl } from "lib/utils";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const SITE_NAME = process.env.SITE_NAME || "Ferti Lider";
const defaultDescription =
  "Ferti Lider — семена и продукти. България, с. Батулци, община Ябланица.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#71a826" },
    { media: "(prefers-color-scheme: dark)", color: "#192609" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  robots: {
    follow: true,
    index: true,
  },
  icons: {
    icon: [
      { url: APP_ICON_PATH, type: "image/png", sizes: "32x32" },
      { url: APP_ICON_PATH, type: "image/png", sizes: "48x48" },
      { url: SITE_LOGO_PATH, type: "image/png", sizes: "192x192" },
      { url: SITE_LOGO_PATH, type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { url: SITE_LOGO_PATH, type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: SITE_LOGO_PATH, type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: defaultDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
      {
        url: SITE_LOGO_PATH,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — лого`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: defaultDescription,
    images: [DEFAULT_TWITTER_IMAGE_PATH],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="bg" className={GeistSans.variable}>
      <body className={`${GeistSans.className} bg-neutral-50 text-neutral-950 selection:bg-brand-200 selection:text-neutral-950 dark:bg-neutral-950 dark:text-white dark:selection:bg-brand-800 dark:selection:text-white`}>
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
