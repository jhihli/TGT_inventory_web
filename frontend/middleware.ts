import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

//withAuth runs before every request to check authentication

export default withAuth(
  function middleware(req) {
    //console.log("🔹 Middleware triggered");

    const token = req.nextauth.token;
    const isLoggedIn = !!token;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    //If not authenticated, redirects the user to /login
    if (isOnDashboard && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        //console.log("✅ Authorized check:", token);
        return !!token; // Allow access only if token exists
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware to dashboard routes
};
