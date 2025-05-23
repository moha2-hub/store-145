import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value
  const userRole = request.cookies.get("userRole")?.value
  const path = request.nextUrl.pathname

  // If user is not logged in and trying to access protected routes
  if (!userId && !path.startsWith("/login") && !path.startsWith("/register")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is logged in and trying to access login/register pages
  if (userId && (path.startsWith("/login") || path.startsWith("/register"))) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else if (userRole === "customer") {
      return NextResponse.redirect(new URL("/customer", request.url))
    } else if (userRole === "seller") {
      return NextResponse.redirect(new URL("/seller", request.url))
    } else {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Role-based access control
  if (userId && userRole) {
    // Admin routes
    if (path.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Customer routes
    if (path.startsWith("/customer") && userRole !== "customer") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Seller routes
    if (path.startsWith("/seller") && userRole !== "seller") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
