"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import TopHeaderTicker from "./TopHeaderTicker";

export default function TopHeader() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    window.__isDarkModeActive = isDark;
    const frameId = requestAnimationFrame(() => {
      setDarkMode(isDark);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
    if (typeof window !== "undefined") {
      window.__isDarkModeActive = newMode;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__toggleMobileDarkMode = toggleDarkMode;
      window.__isDarkModeActive = darkMode;
    }
  });

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const getDashboardPath = () => {
    if (!userRole) return "/";
    return `/dashboard/${userRole.toLowerCase()}`;
  };

  return (
    <div className="w-full print:hidden">
      <div className="w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-3 px-4 md:px-6 border-b border-emerald-800/60 relative z-30 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
        {/* মেইন কন্টেইনার */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-3 md:gap-6">
          {/* বাম ও মধ্য অংশ: লোগো এবং নির্বাচিত ভাষায় মাদরাসার নাম */}
          <div className="w-full md:flex-1 flex flex-row items-center gap-3.5 md:gap-5">
            {/* লোগো সেকশন */}
            <div className="flex-shrink-0 w-[30px] h-[30px] sm:w-[20px] sm:h-[20px] md:w-[40px] md:h-[40px] relative rounded-full overflow-hidden p-[2px] bg-transparent">
              <Link href="/" className="relative block w-full h-full">
                <Image
                  src="/aimlogo1.png"
                  alt="As-Salam Ideal Madrasah (AIM) Logo"
                  fill
                  sizes="(max-width: 768px) 68px, 96px"
                  className="object-cover scale-[1.10] rounded-full"
                  priority
                />
              </Link>
            </div>

            {/* নাম ও স্লোগান কন্টেইনার (শুধু সিলেক্ট করা ভাষার নাম দেখাবে) */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-start space-y-1">
              {language === "ar" ? (
                <h1
                  className="text-xl sm:text-2xl md:text-4xl lg:text-[42px] font-bold kufi-custom text-amber-100 tracking-wide dark:text-emerald-300 leading-tight drop-shadow-sm"
                  dir="rtl"
                  lang="ar"
                >
                  مدرس<span className="font-sans">ة</span> الس
                  <span className="font-sans">لا</span>م النموذجي
                  <span className="font-sans">ة</span>
                </h1>
              ) : language === "en" ? (
                <h1 className="text-base sm:text-xl md:text-3xl lg:text-[38px] font-black tracking-wide text-amber-100/95 dark:text-emerald-300 capitalize leading-tight font-britanic drop-shadow-sm">
                  As-Salam Ideal Madrasah (AIM)
                </h1>
              ) : (
                <h1 className="text-lg sm:text-2xl md:text-[12px] lg:text-[12px] font-bold text-white tracking-normal dark:text-slate-100 leading-tight font-shalda drop-shadow-sm">
                  আস-সালাম আইডিয়াল মাদরাসা (এইম)
                </h1>
              )}

              {/* স্লোগান */}
              <div className="w-full pt-0.5 md:pt-1">
                <p className="text-[10px] sm:text-xs md:text-[10px] font-medium tracking-widest text-emerald-200/80 italic uppercase dark:text-slate-400">
                  {t("header.slogan")}
                </p>
              </div>
            </div>
          </div>

          {/* ডান অংশ: ল্যাঙ্গুয়েজ বাটন, ডার্ক/লাইট মোড বাটন, ড্যাশবোর্ড ও লগইন/লগআউট বাটন */}
          <div className="w-full md:w-auto flex items-center justify-end gap-2 pt-2 md:pt-0 border-t border-white/10 md:border-t-0 flex-shrink-0">
            {/* ভাষা পরিবর্তনকারী বাটন */}
            <LanguageSwitcher />

            {/* ডার্ক / লাইট মোড পরিবর্তনকারী বাটন */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-amber-200 hover:text-amber-100 focus:outline-none flex-shrink-0 cursor-pointer shadow-sm"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* ড্যাশবোর্ড ও লগইন/লগআউট অ্যাকশন বাটন */}
            <div className="flex items-center gap-2 pl-2 border-s border-white/15 flex-shrink-0">
              {isLoggedIn ? (
                <>
                  <Link
                    href={getDashboardPath()}
                    className="inline-flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/30 font-semibold px-3 py-1.5 rounded-lg text-xs sm:text-sm shadow-sm transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{t("menu.dashboard")}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 border border-white/15 hover:border-rose-400/40 font-medium px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t("menu.logout")}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/30 font-semibold px-3.5 py-1.5 rounded-lg text-xs sm:text-sm shadow-sm transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t("menu.login")}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <TopHeaderTicker />
    </div>
  );
}
