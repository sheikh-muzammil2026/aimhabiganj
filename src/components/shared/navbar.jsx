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
  LogIn,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import NavbarTicker from "./NavbarTicker";
import LanguageSwitcher from "./LanguageSwitcher";

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
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;
  const isArabic = language === "ar";
  const isHomePage = pathname === "/";

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
          setIsScrolled((prev) => (prev ? y > 12 : y > 36));
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
      setMobileOpenGroup(null);
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
    const headerHeight = header ? header.offsetHeight : 76;
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

      const linkColorClass = active
        ? "text-white border-[#2196F3] font-bold"
        : "text-[#E3F2FD]/90 hover:text-white hover:border-[#90CAF9]/60 border-transparent font-medium";

      const chevronColorClass = isOpen
        ? "rotate-180 text-[#90CAF9]"
        : "text-[#90CAF9]/80 group-hover:text-white group-hover:rotate-180";

      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
          onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
        >
          {item.dropdown ? (
            <>
              <div className="flex items-center gap-1 select-none py-1">
                <Link
                  href={item.href}
                  onClick={(e) => handleSubmenuClick(e, item.href)}
                  className={`text-[14px] xl:text-[15px] transition-colors cursor-pointer pb-1 border-b-2 whitespace-nowrap ${linkColorClass}`}
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
                  className="p-0.5 focus:outline-none cursor-pointer"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${chevronColorClass}`}
                  />
                </button>
              </div>

              {/* Glass Dropdown Popover */}
              <div
                className={`absolute ltr:left-0 rtl:right-0 top-full pt-2.5 w-60 z-[90] transition-all duration-200 ${isOpen
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                  }`}
              >
                <div className="bg-[#0D47A1] text-white rounded-xl shadow-2xl border border-[#90CAF9]/40 p-1.5 space-y-0.5 backdrop-blur-xl">
                  {item.dropdown.map((sub, i) => (
                    <Link
                      key={i}
                      href={sub.href}
                      onClick={(e) => handleSubmenuClick(e, sub.href)}
                      className="group/sub flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-[#E3F2FD] hover:bg-[#2196F3] hover:text-white transition-colors"
                    >
                      <span>{sub.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#90CAF9] group-hover/sub:text-white rtl:rotate-180 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.href}
              onClick={(e) => handleSubmenuClick(e, item.href)}
              className={`text-[14px] xl:text-[15px] transition-colors block pb-1 border-b-2 whitespace-nowrap py-1 ${linkColorClass}`}
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
        dir={isArabic ? "rtl" : "ltr"}
        className="sticky top-2.5 sm:top-3.5 z-50 w-full font-bornomala print:hidden transition-all duration-300"
      >
        {/* Width-Synchronized Container matching HeroSection */}
        <div className="site-container">
          <div
            className="rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 bg-[#0D47A1] border border-[#90CAF9]/40 shadow-xl shadow-[#0D47A1]/25 backdrop-blur-xl text-white"
          >
            <div className="flex items-center justify-between gap-3 lg:gap-5">
              {/* 1. Left Section: Institutional Emblem & Compact Title */}
              <Link
                href="/"
                onClick={(e) => handleSubmenuClick(e, "/")}
                className="flex items-center gap-3 flex-shrink-0 group cursor-pointer"
              >
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#90CAF9]/80 bg-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={siteConfig.assets.logo}
                    alt={`${siteConfig.name.short} Logo`}
                    fill
                    sizes="44px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>

              {/* 2. Center: Desktop Navigation Links */}
              <nav
                aria-label="Main Navigation"
                className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 flex-1 px-2"
              >
                {renderNavItems()}
              </nav>

              {/* 3. Right Actions: Language, Theme, Account & Mobile Menu Trigger */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                <LanguageSwitcher />

                {/* Theme Toggle Button */}
                {/* <button
                  type="button"
                  onClick={toggleDarkMode}
                  title={darkMode ? "Light Mode" : "Dark Mode"}
                  aria-label="Toggle Dark Mode"
                  className="p-2 rounded-xl border border-[#90CAF9]/30 bg-white/10 text-[#E3F2FD] hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#90CAF9]" />
                  )}
                </button> */}

                {/* Desktop Auth Action */}
                <div className="hidden md:flex items-center">
                  {isLoggedIn ? (
                    <div className="relative group/user">
                      <Link
                        href={getDashboardPath()}
                        title={t("menu.dashboard")}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1E88E5] text-white border border-[#90CAF9]/40 text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#E3F2FD]" />
                        <span className="hidden xl:inline">
                          {t("menu.dashboard")}
                        </span>
                      </Link>

                      <div className="absolute ltr:right-0 rtl:left-0 top-full pt-2 hidden group-hover/user:block z-50">
                        <div className="bg-[#0D47A1] text-white rounded-xl shadow-2xl border border-[#90CAF9]/40 p-1.5 w-40 text-xs overflow-hidden backdrop-blur-xl">
                          <Link
                            href={getDashboardPath()}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#E3F2FD] hover:bg-[#2196F3] hover:text-white font-medium transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>{t("menu.dashboard")}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-500/20 font-medium text-left transition-colors cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1E88E5] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden xl:inline">{t("menu.login")}</span>
                    </Link>
                  )}
                </div>



              </div>
            </div>


          </div>
        </div>
      </header>


    </>
  );
}