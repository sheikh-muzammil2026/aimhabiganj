"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmenuClick = (e, href) => {
    setActiveDropdown(null);

    if (href && href.includes("#")) {
      const [targetPath, hash] = href.split("#");
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";

      // If already on the target page (e.g., /about or /)
      if (
        currentPath === targetPath ||
        (targetPath === "" && currentPath === "/")
      ) {
        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  const menuItems = [
    { name: t("menu.home"), href: "/" },
    {
      name: t("menu.about"),
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
      name: t("menu.academics"),
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
      dropdown: [
        { name: t("menu.hifz"), href: "/#hifz" },
        { name: t("menu.academic_dept"), href: "/#academic" },
      ],
    },
    {
      name: t("menu.admission"),
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
      name: t("menu.hostel"),
      dropdown: [
        { name: t("menu.hostel_about"), href: "/hostel#about" },
        { name: t("menu.hostel_directors"), href: "/hostel#directors" },
        { name: t("menu.hostel_rules"), href: "/hostel#rules" },
        { name: t("menu.hostel_chart"), href: "/hostel#chart" },
        { name: t("menu.hostel_routine"), href: "/hostel#routine" },
      ],
    },
    // { name: t("menu.notices"), href: "/notices" },
    { name: t("menu.gallery"), href: "/gallery" },
    { name: t("menu.results"), href: "/results" },
    // { name: t("menu.fatwa"), href: "/fatwa" },
    {
      name: t("menu.contact"),
      dropdown: [
        { name: t("menu.contact_info"), href: "/contact" },
        { name: t("menu.feedback"), href: "/contact#feedback" },
      ],
    },
  ];

  return (
    <>
      {/* ডেস্কটপ নেভবার */}
      <nav
        className={`hidden lg:block left-0 w-full print:hidden text-white z-50 transition-all duration-300 ${
          isScrolled
            ? "fixed top-0 bg-emerald-950/95 shadow-lg border-b border-emerald-800/60 dark:bg-slate-950/95 dark:border-slate-800 backdrop-blur-md bg-opacity-100 pointer-events-auto"
            : "absolute top-32 bg-transparent lg:bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            {/* মেনু কন্টেইনার */}
            <div
              className={`hidden lg:flex items-center transition-all duration-300 ${
                !isScrolled
                  ? "bg-slate-950/55 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-1.5 shadow-xl"
                  : ""
              }`}
            >
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.name ? null : item.name,
                          )
                        }
                        className={`px-2.5 py-2 rounded-lg text-[13px] xl:text-sm font-medium hover:bg-white/10 transition flex items-center gap-1 focus:outline-none ${
                          item.isAdmission
                            ? "text-amber-300 font-semibold hover:text-amber-200"
                            : "text-slate-100 hover:text-white"
                        }`}
                      >
                        {item.isAdmission && (
                          <span className="relative flex h-2 w-2 mr-0.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                          </span>
                        )}
                        {item.name}
                        <svg
                          className={`w-3 h-3 ${item.isAdmission ? "text-amber-300/80" : "text-emerald-200/70"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div className="absolute left-0 mt-1 w-56 bg-white text-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t-2 border-amber-400 dark:bg-slate-900 dark:text-gray-100 dark:border-emerald-500 overflow-hidden">
                        <div className="py-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                          {item.dropdown.map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.href}
                              onClick={(e) => handleSubmenuClick(e, sub.href)}
                              className="block px-4 py-2 text-xs xl:text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => handleSubmenuClick(e, item.href)}
                      className="px-2.5 py-2 rounded-lg text-[13px] xl:text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition block"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
