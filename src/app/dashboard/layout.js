"use client";
import Sidebar from "@/components/dashboard/sidebar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/public/shared/LanguageSwitcher";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [liveUser, setLiveUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(true);

  const [currentTime, setCurrentTime] = useState("");
  const [theme, setTheme] = useState("light");
  const { language } = useLanguage();

  // Live user & permissions sync from DB
  const syncUserData = React.useCallback(async () => {
    try {
      const email = session?.user?.email || "";
      const query = email ? `?email=${encodeURIComponent(email)}` : "";
      const res = await fetch(`${API_BASE}/api/user/me${query}`, {
        headers: email ? { "x-user-email": email } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setLiveUser(data.user);
        }
      }
    } catch (e) {
      console.warn("Failed to sync live user in layout:", e);
    } finally {
      setIsSyncingLive(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user) {
      syncUserData();
    } else if (!isPending) {
      setIsSyncingLive(false);
    }
  }, [session, isPending, syncUserData]);

  // Reactive listener for permission changes across tabs and windows
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel("aim-auth-sync");
      channel.onmessage = (event) => {
        if (
          event.data?.type === "PERMISSIONS_UPDATED" ||
          event.data?.type === "ROLE_UPDATED"
        ) {
          syncUserData();
          if (typeof refetch === "function") refetch();
        }
      };
    } catch (_) {}

    const handleCustomSync = () => {
      syncUserData();
      if (typeof refetch === "function") refetch();
    };

    window.addEventListener("aim-auth-sync", handleCustomSync);
    window.addEventListener("storage", handleCustomSync);

    const interval = setInterval(syncUserData, 15000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("aim-auth-sync", handleCustomSync);
      window.removeEventListener("storage", handleCustomSync);
      clearInterval(interval);
    };
  }, [syncUserData, refetch]);

  // Client-side Route Guard for SPA transitions
  useEffect(() => {
    if (isPending) return;

    // Unauthorized page is always accessible
    if (pathname === "/dashboard/unauthorized") return;

    if (!session?.user) {
      let isMounted = true;
      setIsVerifying(true);
      authClient
        .getSession()
        .then((res) => {
          if (!isMounted) return;
          if (!res?.data?.user) {
            router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          } else if (typeof refetch === "function") {
            refetch();
          }
        })
        .catch(() => {
          if (isMounted) {
            router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsVerifying(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }

    const activeUser = liveUser || session.user;
    if (activeUser.isBanned || activeUser.status === "banned") {
      router.replace("/login?error=account_banned");
      return;
    }

    const userRole = (liveUser?.role || session.user?.role || "student").toLowerCase();
    const permissions =
      Array.isArray(liveUser?.permissions) && liveUser.permissions.length > 0
        ? liveUser.permissions
        : Array.isArray(session.user?.permissions)
        ? session.user.permissions
        : Array.isArray(liveUser?.permissions)
        ? liveUser.permissions
        : [];

    const hasPerm = (p) => {
      if (permissions.includes(p)) return true;
      if (
        p === "manage_finance" &&
        (permissions.includes("accounts") ||
          permissions.includes("accountant") ||
          permissions.includes("finance"))
      )
        return true;
      if (
        p === "manage_teachers" &&
        (permissions.includes("manage_attendance") ||
          permissions.includes("teacher_attendance") ||
          permissions.includes("manage_users") ||
          permissions.includes("teacher"))
      )
        return true;
      if (
        p === "manage_attendance" &&
        (permissions.includes("manage_teachers") ||
          permissions.includes("teacher_attendance") ||
          permissions.includes("manage_academics") ||
          permissions.includes("manage_users") ||
          permissions.includes("teacher"))
      )
        return true;
      if (
        p === "manage_staff" &&
        (permissions.includes("manage_users") ||
          permissions.includes("staff"))
      )
        return true;
      return false;
    };

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const targetDashboard =
        userRole === "admin" || userRole === "superadmin"
          ? "/dashboard/admin"
          : userRole === "teacher"
          ? "/dashboard/teacher"
          : userRole === "staff"
          ? "/dashboard/staff"
          : userRole === "accountant"
          ? "/dashboard/accountant"
          : userRole === "parent"
          ? "/dashboard/parent"
          : "/dashboard/student";
      router.replace(targetDashboard);
      return;
    }

    // Strict role-specific corner dashboard access checks (runs before admin bypass)
    if (pathname.startsWith("/dashboard/parent")) {
      if (userRole !== "parent") {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/staff")) {
      if (userRole !== "staff") {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (userRole === "admin" || userRole === "superadmin") return;

    if (pathname.startsWith("/dashboard/profile-settings")) return;

    if (pathname.startsWith("/dashboard/admin")) {
      const isAllowedAdminSubpath =
        (pathname.startsWith("/dashboard/admin/admission") &&
          hasPerm("manage_admissions")) ||
        (pathname.startsWith("/dashboard/admin/notice") &&
          hasPerm("manage_notices")) ||
        (pathname.startsWith("/dashboard/admin/students-management") &&
          hasPerm("manage_users")) ||
        (pathname.startsWith("/dashboard/admin/teachers-management") &&
          (hasPerm("manage_users") ||
            hasPerm("manage_teachers") ||
            hasPerm("manage_attendance"))) ||
        (pathname.startsWith("/dashboard/admin/staff-management") &&
          (hasPerm("manage_users") ||
            hasPerm("manage_staff") ||
            hasPerm("manage_attendance"))) ||
        (pathname.startsWith("/dashboard/admin/administration") &&
          (hasPerm("manage_roles") || hasPerm("manage_users")));

      if (!isAllowedAdminSubpath) {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/accountant")) {
      if (userRole !== "accountant" && !hasPerm("manage_finance")) {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (
      pathname.startsWith("/dashboard/attendance") ||
      pathname.startsWith("/dashboard/teachers-attendance")
    ) {
      if (
        userRole !== "teacher" &&
        userRole !== "accountant" &&
        !hasPerm("manage_academics") &&
        !hasPerm("manage_attendance") &&
        !hasPerm("manage_teachers") &&
        !hasPerm("teacher")
      ) {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/teacher")) {
      if (
        userRole !== "teacher" &&
        !hasPerm("manage_teachers") &&
        !hasPerm("manage_academics") &&
        !hasPerm("teacher")
      ) {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/student")) {
      if (userRole !== "student") {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/shared")) {
      if (
        pathname.startsWith("/dashboard/shared/academics") &&
        userRole !== "teacher" &&
        !hasPerm("manage_academics") &&
        !hasPerm("manage_teachers") &&
        !hasPerm("teacher")
      ) {
        router.replace("/dashboard/unauthorized");
        return;
      }
      if (
        pathname.startsWith("/dashboard/shared/gallery") &&
        userRole !== "teacher" &&
        !hasPerm("manage_gallery")
      ) {
        router.replace("/dashboard/unauthorized");
        return;
      }
    }
  }, [pathname, isPending, session, liveUser, router, refetch]);

  // থিম ইনিশিয়ালাইজ ও ডার্ক মোড ক্লাস হ্যান্ডেল করা
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ইসলামিক পরিবেশের সাথে সামঞ্জস্য রেখে রিয়েল-টাইম ঘড়ি ও নির্বাচিত ভাষায় তারিখের ব্যবস্থা
  useEffect(() => {
    const updateTime = () => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const today = new Date();
      const localeCode =
        language === "ar" ? "ar-SA" : language === "en" ? "en-US" : "bn-BD";
      setCurrentTime(today.toLocaleDateString(localeCode, options));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [language]);

  if (
    (isPending || (!session?.user && isVerifying)) &&
    pathname !== "/dashboard/unauthorized"
  ) {
    return (
      <div className="min-h-screen bg-[#f6faf8] flex flex-col justify-center items-center px-6 transition-colors duration-300 dark:bg-[#010a06] backdrop-blur-sm">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-emerald-800 border-l-transparent animate-spin dark:border-b-emerald-400"></div>
          <div className="absolute top-3 bg-white text-emerald-950 font-black text-xs w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-pulse border border-emerald-100 dark:bg-[#031810] dark:text-amber-300 dark:border-amber-400/30">
            AS
          </div>
          <p className="mt-5 text-sm font-bold text-emerald-950 tracking-wide dark:text-amber-300 animate-pulse">
            {language === "ar"
              ? "يرجى الانتظار..."
              : language === "en"
                ? "Please wait..."
                : "অনুগ্রহ করে অপেক্ষা করুন..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f8f6] dark:bg-[#010a06] text-slate-800 dark:text-slate-100 antialiased font-sans w-full selection:bg-emerald-800 selection:text-white overflow-hidden">
      {/* ১. সাইডবার কম্পোনেন্ট */}
      <Sidebar />

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* ৩. প্রফেশনাল রয়্যাল টপ নেভিগেশন বার */}
        <header className="relative bg-gradient-to-r from-[#021d12] via-[#04301f] to-[#021d12] dark:from-[#010906] dark:via-[#031b11] dark:to-[#010906] border-b border-amber-400/25 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md flex-shrink-0 print:hidden text-white">
          <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          {/* বাম পাশ: মূল ওয়েবসাইটে ফিরে যাওয়ার প্রফেশনাল বাটন এবং টাইটেল */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-amber-200 bg-white/[0.06] hover:bg-amber-400/15 border border-white/15 hover:border-amber-400/40 rounded-xl transition-all shadow-xs"
              title={
                language === "ar"
                  ? "العودة إلى الصفحة الرئيسية"
                  : language === "en"
                    ? "Back to Home Page"
                    : "মূল হোম পেজে ফিরে যান"
              }
            >
              <span>🏠</span>
            </Link>

            <div className="flex flex-col">
              <h2 className="font-black text-sm sm:text-base bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent tracking-wide lg:block hidden">
                {language === "ar"
                  ? "لوحة التحكم"
                  : language === "en"
                    ? "Control Panel"
                    : "কন্ট্রোল প্যানেল"}
              </h2>
            </div>
          </div>

          {/* ডান পাশ: ভাষা পরিবর্তন, তারিখ, ডার্ক মোড ও প্রোফাইল কুইক অ্যাকশন */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* বর্তমান তারিখ */}
            <div className="hidden md:flex items-center gap-2 bg-white/[0.06] border border-amber-400/25 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200">
              <span>📅</span>
              <span>
                {currentTime ||
                  (language === "ar"
                    ? "تاريخ اليوم"
                    : language === "en"
                      ? "Today's Date"
                      : "আজকের তারিখ")}
              </span>
            </div>

            {/* ৩-ভাষা পরিবর্তনকারী (বাংলা, English, العربية) */}
            <LanguageSwitcher />

            {/* ডার্ক মোড টগল বাটন */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-amber-400/15 hover:border-amber-400/40 text-amber-300 transition-all focus:outline-none cursor-pointer"
              title={
                theme === "light" ? "ডার্ক মোড চালু করুন" : "লাইট মোড চালু করুন"
              }
            >
              <span className="text-sm">{theme === "light" ? "🌙" : "☀️"}</span>
            </button>

            {/* কুইক নোটিফিকেশন আইকন */}
            <button
              className="relative p-2 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-amber-400/15 hover:border-amber-400/40 text-amber-300 transition-all focus:outline-hidden cursor-pointer"
              title="নোটিফিকেশন"
            >
              <span className="text-sm">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#021d12]"></span>
            </button>

            {/* প্রোফাইল সেটিংস লিংক */}
            <Link
              href="/dashboard/profile-settings"
              className="p-2 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-amber-400/15 hover:border-amber-400/40 text-amber-300 transition-all focus:outline-hidden"
              title="প্রোফাইল সেটিংস"
            >
              <span className="text-sm">⚙️</span>
            </Link>
          </div>
        </header>

        {/* ৪. ড্যাশবোর্ড পেজের স্ক্রলযোগ্য কন্টেন্ট বডি */}
        <main className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-24 lg:p-8 bg-gradient-to-b from-[#f6faf8] via-white to-[#f2f8f5] dark:from-[#010a06] dark:via-[#02140c] dark:to-[#010a06] scroll-smooth transition-colors duration-300">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
