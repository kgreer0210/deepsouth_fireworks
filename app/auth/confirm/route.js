import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  // For recovery, always go to update-password page regardless of next param
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const destination = type === "recovery" ? "/auth/update-password" : safeNext;
  const redirectTo = new URL(destination, request.url);
  const response = NextResponse.redirect(redirectTo);

  if (token_hash && type) {
    // Create client that writes cookies directly to the response (not next/headers)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return response;
  }

  // Token invalid/expired → error page
  return NextResponse.redirect(new URL("/error", request.url));
}
