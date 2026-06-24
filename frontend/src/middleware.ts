import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRoleRaw = request.cookies.get("user_role")?.value || "";
  const userRole = userRoleRaw.toUpperCase().trim();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/historico-ocorrencias")) {
    if (!token || (userRole !== "ADMIN" && userRole !== "PROFESSOR")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login" && token && userRole) {
    return NextResponse.redirect(
      new URL(`/dashboard/${userRole.toLowerCase()}`, request.url),
    );
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/historico-ocorrencias/:path*"],
};
