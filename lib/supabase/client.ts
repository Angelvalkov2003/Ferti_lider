"use client";

import { createBrowserClient } from "@supabase/ssr";

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

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
