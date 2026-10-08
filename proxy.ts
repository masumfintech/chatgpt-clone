import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // Public routes
  if (req.nextUrl.pathname.startsWith("/sign-in")) {
    return NextResponse.next();
  }

  // Protect everything else
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Clerk
    "/__clerk/:path*",

    // API routes
    "/(api|trpc)(.*)",
  ],
};