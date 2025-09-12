// // middleware.ts (در ریشه پروژه یا src/)
// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export default clerkMiddleware(async (auth, req) => {
//   const { isAuthenticated, redirectToSignIn } = await auth();
//   const { pathname, search } = req.nextUrl;

//   // اجازه دهید صفحات و فایل‌های عمومی و خودِ صفحه‌ی auth عبور کنند:
//   if (
//     pathname.startsWith("/auth") || // صفحه لاگین/ثبت‌نام خودت
//     pathname.startsWith("/_next") || // فایل‌های داخلی next
//     pathname.includes(".") // فایل‌های استاتیک مثل .png .css و ...
//   ) {
//     return; // ادامه عادی
//   }

//   // اگر کاربر لاگین نیست => redirect به sign-in (ما returnTo رو می‌فرستیم)
//   if (!isAuthenticated) {
//     const returnTo = pathname + search;
//     // redirectToSignIn(returnTo) از تنظیمات CLERK_SIGN_IN_URL استفاده می‌کنه.
//     return redirectToSignIn(returnTo);
//     // --- یا اگر می‌خواهی صریحاً به /auth برید:
//     // const u = new URL("/auth", req.url);
//     // u.searchParams.set("returnTo", returnTo);
//     // return NextResponse.redirect(u);
//   }
// });

// // matcher: فقط روی صفحات اجرا میشه (خارج از _next، api و فایل‌های استاتیک)
// export const config = {
//   matcher: ["/((?!_next|api|trpc|.*\\..*).*)"],
// };

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
