"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import NavbarTicker from "./NavbarTicker";
import LanguageSwitcher from "./LanguageSwitcher";

const FIRST_SECTION_HASHES = new Set([
  "profile",
  "teachers",
  "timeline",
  "about",
  "hifz",
]);

const LANGUAGES = [
  { code: "bn", name: "বাংলা", short: "বাং" },
  { code: "en", name: "English", short: "EN" },
  { code: "ar", name: "العربية", short: "عربي" },
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);

    if (!href) return;

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;

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
              <div className="flex items-center gap-0.5 select-none py-1">
                <Link
                  href={item.href}
                  onClick={(e) => handleSubmenuClick(e, item.href)}
                  className={`text-[13px]  xl:text-[14px] transition-colors cursor-pointer pb-0.5 border-b-2 whitespace-nowrap ${
                    active
                      ? "text-[#008744] border-[#008744] font-semibold"
                      : "text-slate-700 hover:text-[#008744] border-transparent font-medium"
                  }`}
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  aria-label={`${item.name} menu`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(isOpen ? null : item.id);
                  }}
                  className="p-0.5 text-slate-500 hover:text-[#008744] focus:outline-none cursor-pointer transition-transform duration-200"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 text-[#008744]"
                        : "group-hover:rotate-180"
                    }`}
                  />
                </button>
              </div>

              {/* Glass Dropdown Popover */}
              <div
                className={`absolute ltr:left-0 rtl:right-0 top-full pt-2 w-56 z-[90] transition-all duration-200 ${
                  isOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="bg-white text-slate-800 rounded-lg shadow-xl border border-gray-100 p-1.5 space-y-0.5">
                  {item.dropdown.map((sub, i) => (
                    <Link
                      key={i}
                      href={sub.href}
                      onClick={(e) => handleSubmenuClick(e, sub.href)}
                      className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-[#e6f4ea] hover:text-[#008744] transition-colors"
                    >
                      <span>{sub.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#008744] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.href}
              onClick={(e) => handleSubmenuClick(e, item.href)}
              className={`text-[13px] xl:text-[14px] transition-colors block pb-0.5 border-b-2 whitespace-nowrap py-1 ${
                active
                  ? "text-[#008744] border-[#008744] font-bold"
                  : "text-slate-700 hover:text-[#008744] border-transparent font-medium"
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
        className="absolute md:sticky top-2 sm:top-3 z-50 w-full px-2 sm:px-4 lg:px-6 print:hidden transition-all duration-300  mb-4"
      >
        {/* Floating rounded container centered horizontally with pure white background */}
        <div
          className={`max-w-[1380px] mx-auto bg-white rounded-xl shadow-md border border-gray-100/90 px-3 sm:px-5 py-2.5 md:py-4 transition-all duration-300 ${
            isScrolled ? "shadow-lg bg-white/95 backdrop-blur-md" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-3 lg:gap-4 xl:gap-6">
            {/* 1. Left Section: Logo & Branding */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                onClick={(e) => handleSubmenuClick(e, "/")}
                className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer"
              >
                <div className="relative w-10 h-10 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border border-emerald-100 shadow-xs">
                  <Image
                    src="/aimlogo1.png"
                    alt="AIM Logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* 2. Center: Desktop Menu Items with Forest Green Active Underline */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 flex-1 px-2"
            >
              {renderNavItems()}
            </nav>

            {/* 3. Right Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              <LanguageSwitcher />

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                title={darkMode ? "Light Mode" : "Dark Mode"}
                aria-label="Toggle Dark Mode"
                className="p-1.5 sm:p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:text-[#008744] hover:bg-[#e6f4ea] transition-colors cursor-pointer shadow-xs"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Auth actions: */}
              {isLoggedIn ? (
                <div className=" relative group/user">
                  <Link
                    href={getDashboardPath()}
                    title={t("menu.dashboard")}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde047] text-[#92400e] transition-colors cursor-pointer shadow-xs"
                  >
                    <User className="w-4 h-4" />
                  </Link>

                  <div className="absolute right-0 top-full pt-1.5 hidden group-hover/user:block z-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 w-36 text-xs overflow-hidden">
                      <Link
                        href={getDashboardPath()}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#e6f4ea] hover:text-[#008744] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>{t("menu.dashboard")}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t("menu.logout")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  title={t("menu.login")}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde047] text-[#92400e] transition-colors cursor-pointer shadow-xs"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notice Ticker */}
      <NavbarTicker />
    </>
  );
}
