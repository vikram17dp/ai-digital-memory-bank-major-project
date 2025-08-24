import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/memories(.*)",
  "/api/chat(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Await the auth object because it's a Promise
  const authData = await auth();

  // Now userId exists
  if (isProtectedRoute(req) && !authData.userId) {
    const redirectUrl = new URL("/sign-in", req.url);
    redirectUrl.searchParams.set("redirect_url", req.url);

    return Response.redirect(redirectUrl, 302);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
