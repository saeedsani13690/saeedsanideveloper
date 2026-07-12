import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;
  console.log(`Current Pathname: ${pathname}`); 

  // --- بخش 1: مدیریت مسیر /auth ---
  if (pathname === "/auth") {
    if (accessToken) {
      try {
        const payload = jwt.verify(accessToken, process.env.ACCEST_TOKEN_SECRET);
        const redirectTo = payload.role === "user" ? "/profile" : "/admin/dashboard";
        return NextResponse.redirect(new URL(redirectTo, request.url));
      } catch (error) {

       
        console.error("JWT verification failed for /auth:", error.message);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // --- بخش 2: مدیریت مسیرهای محافظت شده (خارج از /auth) ---
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const payload = jwt.verify(accessToken, process.env.ACCEST_TOKEN_SECRET);

    // اگر مسیر مربوط به ادمین است
    if (pathname.startsWith("/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
      return NextResponse.next();
    }

    // اگر مسیر مربوط به پروفایل است
    if (pathname.startsWith("/profile")) {
      // اگر ادمین است و اشتباها به پروفایل آمده، او را به داشبورد هدایت کن
      if (payload.role !== "user") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      // اگر کاربر معمولی است، اجازه عبور بده (بدون ریدایرکت مجدد)
      return NextResponse.next();
    }
    
    return NextResponse.next();

  } catch (error) {
    console.error("JWT verification failed for protected route:", error.message);
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    "/auth",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
