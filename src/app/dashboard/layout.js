"use client";
import Sidebar from "@/components/dashboard/sidebar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [isVerifying, setIsVerifying] = useState(false);

  const [currentTime, setCurrentTime] = useState("");
  const [theme, setTheme] = useState("light");

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

    const user = session.user;
    if (user.isBanned || user.status === "banned") {
      router.replace("/login?error=account_banned");
      return;
    }

    const userRole = (user.role || "student").toLowerCase();
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const targetDashboard =
        userRole === "admin"
          ? "/dashboard/admin"
          : userRole === "teacher"
          ? "/dashboard/teacher"
          : userRole === "accountant"
          ? "/dashboard/accountant"
          : userRole === "parent"
          ? "/dashboard/parent"
          : "/dashboard/student";
      router.replace(targetDashboard);
      return;
    }

    if (userRole === "admin") return;

    if (pathname.startsWith("/dashboard/profile-settings")) return;

    if (pathname.startsWith("/dashboard/admin")) {
      const isAllowedAdminSubpath =
        (pathname.startsWith("/dashboard/admin/admission") && hasPerm("manage_admissions")) ||
        (pathname.startsWith("/dashboard/admin/notice") && hasPerm("manage_notices")) ||
        (pathname.startsWith("/dashboard/admin/students-management") && hasPerm("manage_users")) ||
        (pathname.startsWith("/dashboard/admin/teachers-management") && hasPerm("manage_users")) ||
        (pathname.startsWith("/dashboard/admin/administration") && (hasPerm("manage_roles") || hasPerm("manage_users")));

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

    if (pathname.startsWith("/dashboard/teacher")) {
      if (userRole !== "teacher") {
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

    if (pathname.startsWith("/dashboard/parent")) {
      if (userRole !== "parent") {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/attendance")) {
      if (userRole !== "teacher" && !hasPerm("manage_academics")) {
        router.replace("/dashboard/unauthorized");
      }
      return;
    }

    if (pathname.startsWith("/dashboard/shared")) {
      if (pathname.startsWith("/dashboard/shared/academics") && userRole !== "teacher" && !hasPerm("manage_academics")) {
        router.replace("/dashboard/unauthorized");
        return;
      }
      if (pathname.startsWith("/dashboard/shared/gallery") && userRole !== "teacher") {
        router.replace("/dashboard/unauthorized");
        return;
      }
    }
  }, [pathname, isPending, session, router, refetch]);

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

  // ইসলামিক পরিবেশের সাথে সামঞ্জস্য রেখে রিয়েল-টাইম ঘড়ি ও বাংলা তারিখের ব্যবস্থা
  useEffect(() => {
    const updateTime = () => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const today = new Date();
      setCurrentTime(today.toLocaleDateString("bn-BD", options));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // প্রতি মিনিটে আপডেট হবে
    return () => clearInterval(timer);
  }, []);

  if (
    (isPending || (!session?.user && isVerifying)) &&
    pathname !== "/dashboard/unauthorized"
  ) {
    return (
      <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center px-6 transition-colors duration-300 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-emerald-800 border-l-transparent animate-spin dark:border-b-emerald-400"></div>
          <div className="absolute top-3 bg-white text-emerald-950 font-black text-xs w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-pulse border border-emerald-100 dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700">
            AS
          </div>
          <p className="mt-5 text-sm font-bold text-emerald-950 tracking-wide dark:text-emerald-400 animate-pulse">
            অনুগ্রহ করে অপেক্ষা করুন...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f6f4] dark:bg-[#09101d] text-slate-800 dark:text-slate-200 antialiased font-sans w-full selection:bg-emerald-800 selection:text-white overflow-hidden">
      {/* ১. সাইডবার কম্পোনেন্ট */}
      <Sidebar />

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* ৩. প্রফেশনাল টপ নেভিগেশন বার */}
        <header className="bg-white dark:bg-[#0f172a] border-b border-emerald-900/10 dark:border-emerald-950/30 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs flex-shrink-0 print:hidden">
          {/* বাম পাশ: মূল ওয়েবসাইটে ফিরে যাওয়ার প্রফেশনাল বাটন এবং টাইটেল */}
          <div className="flex items-center gap-3">
            {/* হ্যামবার্গার সরিয়ে ব্যাক টু হোম বাটন যুক্ত করা হয়েছে */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-350 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/30 rounded-xl transition-all shadow-xs"
              title="মূল হোম পেজে ফিরে যান"
            >
              <span>🏠</span>
            </Link>

            <div className="flex flex-col">
              <h2 className="font-black text-sm sm:text-base text-emerald-900 dark:text-emerald-400 tracking-wide lg:block hidden">
                Control panel
              </h2>
            </div>
          </div>

          {/* ডান পাশ: ইসলামিক ক্যালেন্ডার/তারিখ এবং প্রোফাইল কুইক অ্যাকশন */}
          <div className="flex items-center gap-4">
            {/* বর্তমান তারিখ */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span>📅</span>
              <span>{currentTime || "আজকের তারিখ"}</span>
            </div>

            {/* ডার্ক মোড টগল বাটন */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors focus:outline-none"
              title={
                theme === "light" ? "ডার্ক মোড চালু করুন" : "লাইট মোড চালু করুন"
              }
            >
              <span className="text-lg">{theme === "light" ? "🌙" : "☀️"}</span>
            </button>

            {/* কুইক নোটিফিকেশন আইকন */}
            <button
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors focus:outline-hidden"
              title="নোটিফিকেশন"
            >
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* প্রোফাইল সেটিংস লিংক */}
            <Link
              href="/dashboard/profile-settings"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors focus:outline-hidden"
              title="প্রোফাইল সেটিংস"
            >
              <span className="text-lg">⚙️</span>
            </Link>
          </div>
        </header>

        {/* ৪. ড্যাশবোর্ড পেজের স্ক্রলযোগ্য কন্টেন্ট বডি */}
        <main className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-24 lg:p-8 bg-[#f8faf8] dark:bg-[#09101d] scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
