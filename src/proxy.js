import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow the unauthorized page to be accessed without looping
  if (pathname === "/dashboard/unauthorized") {
    return NextResponse.next();
  }

  // 2. Quick cookie check for Better Auth session token
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Validate user session using Better Auth
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Proxy session verification error:", error);
  }

  const user = session?.user;
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if account is banned
  if (user.isBanned || user.status === "banned") {
    return NextResponse.redirect(
      new URL("/login?error=account_banned", request.url),
    );
  }

  const userRole = (user.role || "student").toLowerCase();
  const permissions = Array.isArray(user.permissions) ? user.permissions : [];

  // 4. Handle root /dashboard redirect to user's role dashboard
  // if (pathname === "/dashboard" || pathname === "/dashboard/") {
  //   const targetDashboard =
  //     userRole === "admin"
  //       ? "/dashboard/admin"
  //       : userRole === "teacher"
  //         ? "/dashboard/teacher"
  //         : userRole === "accountant"
  //           ? "/dashboard/accountant"
  //           : userRole === "parent"
  //             ? "/dashboard/parent"
  //             : "/dashboard/student";
  //   return NextResponse.redirect(new URL(targetDashboard, request.url));
  // }

  // 5. Common pages accessible to all authenticated roles
  if (pathname.startsWith("/dashboard/profile-settings")) {
    return NextResponse.next();
  }

  // 6. Role and Permission access checks
  // Admins and superadmins have unrestricted access to all routes
  if (userRole === "admin" || userRole === "superadmin") {
    return NextResponse.next();
  }

  // Helper to determine if user has permission
  const hasPerm = (p) => permissions.includes(p);

  // Check /dashboard/admin routes
  if (pathname.startsWith("/dashboard/admin")) {
    // If not admin, check specific granted permissions
    if (
      pathname.startsWith("/dashboard/admin/admission") &&
      hasPerm("manage_admissions")
    ) {
      return NextResponse.next();
    }
    if (
      pathname.startsWith("/dashboard/admin/notice") &&
      hasPerm("manage_notices")
    ) {
      return NextResponse.next();
    }
    if (
      pathname.startsWith("/dashboard/admin/students-management") &&
      hasPerm("manage_users")
    ) {
      return NextResponse.next();
    }
    if (
      pathname.startsWith("/dashboard/admin/teachers-management") &&
      hasPerm("manage_users")
    ) {
      return NextResponse.next();
    }
    if (
      pathname.startsWith("/dashboard/admin/administration") &&
      (hasPerm("manage_roles") || hasPerm("manage_users"))
    ) {
      return NextResponse.next();
    }

    // Unauthorized attempt to access admin routes
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url),
    );
  }

  // Check /dashboard/accountant routes
  if (pathname.startsWith("/dashboard/accountant")) {
    if (userRole === "accountant" || hasPerm("manage_finance")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url),
    );
  }

  // Check /dashboard/teacher routes
  if (pathname.startsWith("/dashboard/teacher")) {
    if (userRole === "teacher") {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url),
    );
  }

  // Check /dashboard/student routes
  if (pathname.startsWith("/dashboard/student")) {
    if (userRole === "student") {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url),
    );
  }

  // Check /dashboard/parent routes
  if (pathname.startsWith("/dashboard/parent")) {
    if (userRole === "parent") {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url),
    );
  }

  // Check /dashboard/attendance route
  if (pathname.startsWith("/dashboard/attendance")) {
    if (userRole === "teacher" || hasPerm("manage_academics")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/dashboard/unauthorized", request.url),
    );
  }

  // Check /dashboard/shared routes
  if (pathname.startsWith("/dashboard/shared")) {
    if (pathname.startsWith("/dashboard/shared/academics")) {
      if (userRole === "teacher" || hasPerm("manage_academics")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(
        new URL("/dashboard/unauthorized", request.url),
      );
    }
    if (pathname.startsWith("/dashboard/shared/gallery")) {
      if (userRole === "teacher") {
        return NextResponse.next();
      }
      return NextResponse.redirect(
        new URL("/dashboard/unauthorized", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
