import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  const { pathname } = request.nextUrl;

  if (pathname === "/login" && token && userRole) {
    return NextResponse.redirect(new URL(`/dashboard/${userRole.toLowerCase()}`, request.url));
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roles = ["ADMIN", "ALUNO", "PROFESSOR", "RESPONSAVEL"];
  for (const role of roles) {
    if (pathname.startsWith(`/dashboard/${role.toLowerCase()}`) && userRole !== role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
