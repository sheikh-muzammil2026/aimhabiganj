"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import NavbarTicker from "./NavbarTicker";

const FIRST_SECTION_HASHES = new Set([
  "profile",
  "teachers",
  "timeline",
  "about",
  "hifz",
]);

export default function Navbar() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Hysteresis scroll threshold + constant header height eliminates scroll jitter
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled((prev) => (prev ? y > 10 : y > 35));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const scrollToElementCleanly = useCallback((hash) => {
    if (typeof window === "undefined" || !hash) return false;

    // Scrolling to top: 0 for the first section displays the entire top portion cleanly
    if (FIRST_SECTION_HASHES.has(hash)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    }

    const element = document.getElementById(hash);
    if (!element) return false;

    const header =
      typeof document !== "undefined" ? document.querySelector("header") : null;
    const headerHeight = header ? header.offsetHeight : 70;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;

    const targetY = Math.max(0, elementTop - headerHeight - 16);
    window.scrollTo({ top: targetY, behavior: "smooth" });
    return true;
  }, []);

  const handleSubmenuClick = (e, href) => {
    setActiveDropdown(null);

    if (!href) return;

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;

    // Plain page link (e.g. "/" or "/contact" or "/gallery")
    if (!href.includes("#")) {
      if (currentPath === href) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const [targetPath, hash] = href.split("#");
    const normalizedTarget = targetPath || "/";

    if (currentPath === normalizedTarget) {
      const didScroll = scrollToElementCleanly(hash);
      if (didScroll) {
        e.preventDefault();
        window.history.pushState(null, "", href);
      }
    }
  };

  const menuItems = [
    { id: "home", name: t("menu.home"), href: "/" },
    {
      id: "about",
      name: t("menu.about"),
      href: "/about",
      basePath: "/about",
      dropdown: [
        { name: t("menu.profile"), href: "/about#profile" },
        { name: t("menu.founder"), href: "/about#founder" },
        { name: t("menu.vision"), href: "/about#vision" },
        { name: t("menu.committee"), href: "/about#committee" },
        { name: t("menu.features"), href: "/about#features" },
        { name: t("menu.roadmap"), href: "/about#roadmap" },
        { name: t("menu.policies"), href: "/about#policies" },
        { name: t("menu.faculty"), href: "/about#faculty" },
        { name: t("menu.staff"), href: "/about#staff" },
        { name: t("menu.roster"), href: "/about#roster" },
      ],
    },
    {
      id: "academics",
      name: t("menu.academics"),
      href: "/academics",
      basePath: "/academics",
      dropdown: [
        { name: t("menu.teachers"), href: "/academics#teachers" },
        { name: t("menu.levels"), href: "/academics#levels" },
        { name: t("menu.syllabus"), href: "/academics#syllabus" },
        { name: t("menu.co_curricular"), href: "/academics#co-curricular" },
        { name: t("menu.class_routine"), href: "/academics#class-routine" },
        { name: t("menu.exam_routine"), href: "/academics/routine/class-wise" },
      ],
    },
    {
      id: "departments",
      name: t("menu.departments"),
      href: "/#hifz",
      dropdown: [
        { name: t("menu.hifz"), href: "/#hifz" },
        { name: t("menu.academic_dept"), href: "/#academic" },
      ],
    },
    {
      id: "admission",
      name: t("menu.admission"),
      href: "/admission",
      basePath: "/admission",
      isAdmission: true,
      dropdown: [
        { name: t("menu.timeline"), href: "/admission#timeline" },
        { name: t("menu.test"), href: "/admission#test" },
        { name: t("menu.process"), href: "/admission#process" },
        { name: t("menu.fees"), href: "/admission#fees" },
        { name: t("menu.terms"), href: "/admission#terms" },
        { name: t("menu.online_form"), href: "/admission/form" },
      ],
    },
    {
      id: "hostel",
      name: t("menu.hostel"),
      href: "/hostel",
      basePath: "/hostel",
      dropdown: [
        { name: t("menu.hostel_about"), href: "/hostel#about" },
        { name: t("menu.hostel_directors"), href: "/hostel#directors" },
        { name: t("menu.hostel_rules"), href: "/hostel#rules" },
        { name: t("menu.hostel_chart"), href: "/hostel#chart" },
        { name: t("menu.hostel_routine"), href: "/hostel#routine" },
      ],
    },
    { id: "gallery", name: t("menu.gallery"), href: "/gallery" },
    { id: "results", name: t("menu.results"), href: "/results" },
    {
      id: "contact",
      name: t("menu.contact"),
      href: "/contact",
      basePath: "/contact",
      dropdown: [
        { name: t("menu.contact_info"), href: "/contact" },
        { name: t("menu.feedback"), href: "/contact#feedback" },
      ],
    },
  ];

  const isMenuActive = (item) => {
    if (item.basePath) {
      return pathname?.startsWith(item.basePath);
    }
    if (item.href && !item.href.includes("#")) {
      return pathname === item.href;
    }
    return false;
  };

  const renderNavItems = () =>
    menuItems.map((item) => {
      const active = isMenuActive(item);
      const isOpen = activeDropdown === item.id;

      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
          onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
        >
          {item.dropdown ? (
            <>
              <div
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap select-none ${
                  item.isAdmission
                    ? active
                      ? "bg-gradient-to-r from-amber-500/30 to-amber-400/20 text-amber-200 font-semibold border border-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.28)]"
                      : "bg-gradient-to-r from-amber-500/15 to-amber-400/5 text-amber-300 font-semibold border border-amber-400/35 hover:from-amber-500/25 hover:to-amber-400/15 hover:border-amber-300/65 hover:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.14)]"
                    : active
                      ? "bg-gradient-to-r from-emerald-500/25 via-emerald-400/15 to-amber-500/15 text-amber-200 font-semibold border border-amber-400/35 shadow-[0_0_15px_rgba(16,185,129,0.22)]"
                      : "text-slate-100/95 hover:text-amber-200 hover:bg-white/[0.08] dark:hover:bg-emerald-500/15 border border-transparent"
                }`}
              >
                {item.isAdmission && (
                  <span className="relative flex h-2 w-2 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                )}
                {/* Clicking menu text navigates directly to parent page */}
                <Link
                  href={item.href}
                  onClick={(e) => handleSubmenuClick(e, item.href)}
                  className="focus:outline-none cursor-pointer"
                >
                  {item.name}
                </Link>
                {/* Clicking chevron arrow toggles dropdown */}
                <button
                  type="button"
                  aria-label={`${item.name} menu`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(isOpen ? null : item.id);
                  }}
                  className="p-0.5 focus:outline-none cursor-pointer transition-transform duration-200"
                >
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "group-hover:rotate-180"
                    } ${
                      item.isAdmission
                        ? "text-amber-300"
                        : active || isOpen
                          ? "text-amber-200"
                          : "text-emerald-200/70 group-hover:text-amber-200"
                    }`}
                  />
                </button>
              </div>

              {/* লাক্সারি গ্লাসমরফিক ড্রপডাউন মেনু */}
              <div
                className={`absolute ltr:left-0 rtl:right-0 top-full pt-2 w-60 z-[90] transition-all duration-200 ${
                  isOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="bg-[#022014]/95 dark:bg-[#02120b]/95 text-slate-100 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-emerald-500/25 dark:border-amber-400/25 backdrop-blur-2xl overflow-hidden">
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  <div className="p-1.5 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-0.5">
                    {item.dropdown.map((sub, i) => (
                      <Link
                        key={i}
                        href={sub.href}
                        onClick={(e) => handleSubmenuClick(e, sub.href)}
                        className="group/sub flex items-center justify-between px-3 py-2 rounded-xl text-xs xl:text-[13px] font-medium text-slate-200 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-amber-500/10 hover:text-amber-300 transition-colors duration-150"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rotate-45 bg-amber-400/60 group-hover/sub:bg-amber-300 transition-colors flex-shrink-0" />
                          <span>{sub.name}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 text-amber-400 transition-opacity duration-150" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.href}
              onClick={(e) => handleSubmenuClick(e, item.href)}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] font-medium transition-colors duration-200 block whitespace-nowrap ${
                active
                  ? "bg-gradient-to-r from-emerald-500/25 via-emerald-400/15 to-amber-500/15 text-amber-200 font-semibold border border-amber-400/35 shadow-[0_0_15px_rgba(16,185,129,0.22)]"
                  : "text-slate-100/95 hover:text-amber-200 hover:bg-white/[0.08] dark:hover:bg-emerald-500/15 border border-transparent"
              }`}
            >
              {item.name}
            </Link>
          )}
        </div>
      );
    });

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full print:hidden text-white py-2.5 md:py-2.5 transition-[background-color,box-shadow,border-color] duration-300 border-b border-amber-400/20 dark:border-amber-400/25 ${
          isScrolled
            ? "bg-[#021d12]/95 dark:bg-[#010c07]/95 backdrop-blur-xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.75)]"
            : "bg-gradient-to-r from-[#021d12] via-[#04301f] to-[#021d12] dark:from-[#010906] dark:via-[#031b11] dark:to-[#010906] shadow-md"
        }`}
      >
        {/* Ambient Top Golden & Emerald Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 left-1/4 w-96 h-28 bg-emerald-400/10 dark:bg-emerald-400/15 rounded-full blur-3xl" />
          <div className="absolute -top-16 right-1/4 w-80 h-28 bg-amber-400/10 dark:bg-amber-400/15 rounded-full blur-3xl" />
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 relative z-10">
          {/* Main Container */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-3 xl:gap-4">
            {/* 1. Left Section: Logo & Name */}
            <div className=" w-full md:w-auto flex items-center justify-center md:justify-start gap-2.5 sm:gap-3.5 flex-shrink-0">
              <Link
                href="/"
                onClick={(e) => handleSubmenuClick(e, "/")}
                className="group/logo relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-amber-200 to-emerald-400 shadow-[0_0_20px_rgba(245,158,11,0.32)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(245,158,11,0.5)] cursor-pointer"
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#021d12]">
                  <Image
                    src="/aimlogo1.png"
                    alt="As-Salam Ideal Madrasah (AIM) Logo"
                    fill
                    sizes="48px"
                    className="object-cover scale-[1.10] rounded-full transition-transform duration-500 group-hover/logo:scale-[1.16]"
                    priority
                  />
                </div>
              </Link>

              <Link
                href="/"
                onClick={(e) => handleSubmenuClick(e, "/")}
                className="flex flex-col justify-center text-center md:text-start group cursor-pointer"
              >
                {language === "ar" ? (
                  <h1
                    className="text-lg sm:text-xl lg:text-[19px] xl:text-[22px] font-bold kufi-custom bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text text-transparent tracking-wide leading-tight drop-shadow-sm whitespace-nowrap transition-all"
                    dir="rtl"
                    lang="ar"
                  >
                    مدرس<span className="font-sans">ة</span> الس
                    <span className="font-sans">লা</span>م النموذجي
                    <span className="font-sans">ة</span>
                  </h1>
                ) : language === "en" ? (
                  <h1 className="text-sm sm:text-base lg:text-[14px] xl:text-[17px] font-black tracking-wide bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent capitalize leading-tight font-britanic drop-shadow-sm whitespace-nowrap transition-all">
                    As-Salam Ideal Madrasah (AIM)
                  </h1>
                ) : (
                  <h1 className="text-base sm:text-lg lg:text-[16px] xl:text-[19px] font-bold bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent tracking-normal leading-tight font-shalda drop-shadow-sm whitespace-nowrap transition-all">
                    আস-সালাম আইডিয়াল মাদরাসা (এইম)
                  </h1>
                )}

                <div className="flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
                  <span className="hidden sm:inline-block w-3 h-[1px] bg-gradient-to-r from-amber-400 to-transparent" />
                  <p className="text-[9px] sm:text-[10px] xl:text-[10.5px] font-semibold tracking-[0.14em] text-amber-200/80 italic uppercase dark:text-amber-300/85 whitespace-nowrap">
                    {t("header.slogan")}
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. Center: Navigation Capsule */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center justify-center gap-0.5 bg-white/[0.04] dark:bg-[#052418]/70 border border-white/12 dark:border-amber-400/20 rounded-2xl p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.3)] dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15),0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              {renderNavItems()}
            </nav>

            {/* 3. Right Section: Switchers & Auth */}
            <div className="justify-between w-full md:w-auto flex md:items-center md:justify-center md:justify-end gap-1.5 sm:gap-2 pt-2 md:pt-0 border-t border-white/10 md:border-t-0 flex-shrink-0">
              <LanguageSwitcher />

              <button
                type="button"
                onClick={toggleDarkMode}
                title={darkMode ? "Light Mode" : "Dark Mode"}
                aria-label="Toggle Dark Mode"
                className="group p-2 rounded-xl border border-white/15 dark:border-amber-400/30 bg-white/[0.06] dark:bg-amber-400/10 hover:bg-white/[0.12] dark:hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300 text-amber-300 hover:text-amber-200 focus:outline-none flex-shrink-0 cursor-pointer shadow-sm"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
                )}
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 pl-2 border-s border-white/15 dark:border-amber-400/20 flex-shrink-0">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={getDashboardPath()}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-[13px] shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>{t("menu.dashboard")}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 bg-white/[0.07] hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 border border-white/15 hover:border-rose-400/40 font-medium px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] transition-all duration-300 cursor-pointer whitespace-nowrap"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("menu.logout")}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-3.5 xl:px-4 py-1.5 rounded-xl text-xs xl:text-[13px] shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t("menu.login")}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Tablet Nav */}
          <nav
            aria-label="Tablet Navigation"
            className="hidden md:flex lg:hidden items-center justify-center flex-wrap gap-1 mt-2.5 pt-2 border-t border-white/10"
          >
            {renderNavItems()}
          </nav>
        </div>
      </header>

      {/* Notice Ticker */}
      <NavbarTicker />
    </>
  );
}
