"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import {
  Home,
  FileText,
  GraduationCap,
  BookOpen,
  Menu,
  X,
  ChevronRight,
  Info,
  School,
  Hotel,
  MonitorPlay,
  Image as ImageIcon,
  PhoneCall,
  UserCheck,
  LogIn,
  LogOut,
} from "lucide-react";

const FIRST_SECTION_HASHES = new Set([
  "profile",
  "teachers",
  "timeline",
  "about",
  "hifz",
]);

export default function BottomNavbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;
  const userName = session?.user?.name;

  const getDashboardPath = () => {
    if (!userRole) return "/";
    return `/dashboard/${userRole.toLowerCase()}`;
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMenuOpen(false);
          router.push("/login");
        },
      },
    });
  };

  const handleSubmenuClick = useCallback((e, href) => {
    setIsMenuOpen(false);
    setActiveDropdown(null);

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
      if (FIRST_SECTION_HASHES.has(hash)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", href);
        return;
      }

      const element = document.getElementById(hash);
      if (element) {
        e.preventDefault();
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 70;
        const top =
          element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  }, [pathname]);

  const menuItems = [
    { name: t("menu.home"), href: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: t("menu.about"),
      icon: <Info className="w-4 h-4" />,
      dropdown: [
        { name: t("menu.profile"), href: "/about#profile" },
        { name: t("menu.founder"), href: "/about#founder" },
        { name: t("menu.vision"), href: "/about#vision" },
        { name: t("menu.committee"), href: "/about#committee" },
        { name: t("menu.features"), href: "/about#features" },
        { name: t("menu.roadmap"), href: "/about#roadmap" },
        { name: t("menu.testimonials"), href: "/about#testimonials" },
        { name: t("menu.policies"), href: "/about#policies" },
        { name: t("menu.faculty"), href: "/about#faculty" },
        { name: t("menu.staff"), href: "/about#staff" },
        { name: t("menu.roster"), href: "/about#roster" },
      ],
    },
    {
      name: t("menu.academics"),
      icon: <BookOpen className="w-4 h-4" />,
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
      name: t("menu.departments"),
      icon: <School className="w-4 h-4" />,
      dropdown: [
        { name: t("menu.hifz"), href: "/#hifz" },
        { name: t("menu.academic_dept"), href: "/#academic" },
      ],
    },
    {
      name: t("menu.admission"),
      isAdmission: true,
      icon: <GraduationCap className="w-4 h-4" />,
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
      name: t("menu.hostel"),
      icon: <Hotel className="w-4 h-4" />,
      dropdown: [
        { name: t("menu.hostel_about"), href: "/hostel#about" },
        { name: t("menu.hostel_directors"), href: "/hostel#directors" },
        { name: t("menu.hostel_rules"), href: "/hostel#rules" },
        { name: t("menu.hostel_chart"), href: "/hostel#chart" },
        { name: t("menu.hostel_routine"), href: "/hostel#routine" },
      ],
    },
    {
      name: t("menu.smart_classroom"),
      icon: <MonitorPlay className="w-4 h-4" />,
      dropdown: [
        { name: t("menu.live_class"), href: "/smart-classroom/live" },
        { name: t("menu.recorded_class"), href: "/smart-classroom/recorded" },
        { name: t("menu.ebooks"), href: "/smart-classroom/ebooks" },
        { name: t("menu.exam"), href: "/smart-classroom/exam" },
        { name: t("menu.quiz"), href: "/smart-classroom/quiz" },
      ],
    },
    {
      name: t("menu.notices"),
      href: "/notices",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      name: t("menu.gallery"),
      href: "/gallery",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      name: t("menu.results"),
      href: "/results",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      name: t("menu.fatwa"),
      href: "/fatwa",
      icon: <BookOpen className="w-4 h-4 text-[#2196F3]" />,
    },
    {
      name: t("menu.contact"),
      icon: <PhoneCall className="w-4 h-4" />,
      dropdown: [
        { name: t("menu.contact_info"), href: "/contact" },
        { name: t("menu.feedback"), href: "/contact#feedback" },
      ],
    },
  ];

  const primaryItems = [
    {
      name: t("menu.home"),
      href: "/",
      icon: <Home className="w-[21px] h-[21px]" />,
    },
    {
      name: t("menu.results"),
      href: "/results",
      icon: <GraduationCap className="w-[21px] h-[21px]" />,
    },
    {
      name: t("menu.notices"),
      href: "/notices",
      icon: <FileText className="w-[21px] h-[21px]" />,
    },
    isLoggedIn
      ? {
          name: t("menu.dashboard"),
          href: getDashboardPath(),
          icon: <UserCheck className="w-[21px] h-[21px]" />,
        }
      : {
          name: t("menu.login"),
          href: "/login",
          icon: <LogIn className="w-[21px] h-[21px]" />,
        },
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <>
      {/* ১. মূল বটম নেভিগেশন বার (মোবাইল ভিউ) */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] bg-[#0D47A1] border-t border-[#90CAF9]/40 shadow-xl rounded-t-xl md:hidden pb-safe print:hidden transition-colors duration-300 text-white">
        <div className="flex justify-around items-center h-16 px-2">
          {primaryItems.map((item, idx) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={(e) => handleSubmenuClick(e, item.href)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${
                  isActive
                    ? "text-white font-bold"
                    : "text-[#E3F2FD]/70 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-[#2196F3] rounded-full shadow-[0_2px_10px_rgba(33,150,243,0.6)]" />
                )}
                <div
                  className={`transition-transform duration-300 ${
                    isActive
                      ? "text-[#2196F3] scale-110 drop-shadow-[0_2px_6px_rgba(33,150,243,0.4)]"
                      : "group-hover:scale-105"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[10.5px] mt-1 break-keep text-center tracking-tight font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group cursor-pointer ${
              isMenuOpen
                ? "text-white font-bold"
                : "text-[#E3F2FD]/70 hover:text-white"
            }`}
          >
            {isMenuOpen && (
              <span className="absolute top-0 w-8 h-1 bg-[#2196F3] rounded-full" />
            )}
            <div
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isMenuOpen
                  ? "bg-[#2196F3] text-white rotate-90"
                  : "bg-white/10 text-white border border-[#90CAF9]/30 hover:bg-white/20"
              }`}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10.5px] mt-0.5 font-medium">
              {t("menu.more")}
            </span>
          </button>
        </div>
      </div>

      {/* ২. "অন্যান্য" বটম শিট ড্রয়ার */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs md:hidden transition-all duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="fixed bottom-16 left-0 right-0 max-h-[75vh] bg-[#E3F2FD] rounded-t-2xl overflow-y-auto p-4 shadow-2xl border-t border-[#90CAF9]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-1.5 bg-[#90CAF9] rounded-full mx-auto mb-4" />

            {/* লগইন থাকলে ইউজার ইনফো ও লগআউট বাটন */}
            {isLoggedIn && (
              <div className="bg-[#0D47A1] border border-[#90CAF9]/40 text-white p-3.5 rounded-xl mb-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2196F3] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {userRole ? userRole[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-xs text-[#90CAF9] capitalize font-medium">
                      {userRole || "User"}
                    </p>
                    <p className="text-sm font-semibold truncate max-w-[150px]">
                      {userName || "Account"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-100 px-3 py-1.5 rounded-xl text-xs font-semibold border border-rose-400/30 transition-all active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t("menu.logout") || "Logout"}</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mb-4 border-b border-[#90CAF9]/40 pb-3">
              <School className="w-5 h-5 text-[#2196F3]" />
              <h3 className="text-center font-bold text-[#0D47A1] text-base">
                {t("menu.menu_title")}
              </h3>
            </div>

            <div className="space-y-2.5 pb-6">
              {menuItems.map((item, idx) => {
                const hasDropdown = !!item.dropdown;
                const isDropdownOpen = activeDropdown === idx;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-[#90CAF9] shadow-xs overflow-hidden transition-all"
                  >
                    {hasDropdown ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleDropdown(idx)}
                          className={`w-full flex justify-between items-center p-3.5 text-left font-medium transition-colors cursor-pointer ${
                            isDropdownOpen
                              ? "bg-[#E3F2FD] text-[#0D47A1]"
                              : "text-[#1E293B] hover:bg-[#E3F2FD]/50 hover:text-[#0D47A1]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-lg ${
                                isDropdownOpen
                                  ? "bg-[#2196F3] text-white"
                                  : "bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]/40"
                              }`}
                            >
                              {item.icon}
                            </div>
                            <span className="text-sm font-semibold">
                              {item.name}
                            </span>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-[#90CAF9] transition-transform duration-300 ${
                              isDropdownOpen ? "rotate-90 text-[#2196F3]" : ""
                            }`}
                          />
                        </button>

                        {isDropdownOpen && (
                          <div className="bg-[#E3F2FD]/40 border-t border-[#90CAF9]/40 divide-y divide-[#90CAF9]/30">
                            {item.dropdown.map((subItem, subIdx) => (
                              <Link
                                key={subIdx}
                                href={subItem.href}
                                onClick={(e) =>
                                  handleSubmenuClick(e, subItem.href)
                                }
                                className="flex items-center gap-2.5 p-3.5 pl-12 text-xs font-medium text-[#1E293B] hover:text-[#0D47A1] hover:bg-white/80 transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rotate-45 bg-[#2196F3]" />
                                <span>{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        onClick={(e) => handleSubmenuClick(e, item.href)}
                        className="flex items-center gap-3 p-3.5 text-sm font-semibold text-[#1E293B] hover:bg-[#E3F2FD]/60 hover:text-[#0D47A1] transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]/40">
                          {item.icon}
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
