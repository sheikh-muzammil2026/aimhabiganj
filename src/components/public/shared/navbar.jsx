"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { data: session } = authClient.useSession();

    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role;
    const userPhoto = session?.user?.image;

    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);

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

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newMode);
    };

    const closeMenu = () => {
        setIsOpen(false);
        setActiveDropdown(null);
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    closeMenu();
                    router.push("/login");
                }
            }
        });
    };

    const getDashboardPath = () => {
        if (!userRole) return "/";
        return `/dashboard/${userRole.toLowerCase()}`;
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
                { name: t("menu.testimonials"), href: "/about#testimonials" },
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
                { name: t("menu.exam_routine"), href: "/academics#exam-routine" },
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
        {
            name: t("menu.smart_classroom"),
            dropdown: [
                { name: t("menu.live_class"), href: "/smart-classroom/live" },
                { name: t("menu.recorded_class"), href: "/smart-classroom/recorded" },
                { name: t("menu.ebooks"), href: "/smart-classroom/ebooks" },
                { name: t("menu.exam"), href: "/smart-classroom/exam" },
                { name: t("menu.quiz"), href: "/smart-classroom/quiz" },
            ],
        },
        { name: t("menu.notices"), href: "/notices" },
        { name: t("menu.gallery"), href: "/gallery" },
        { name: t("menu.results"), href: "/results" },
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
            {/* ডেস্কটপ নেভবার (মোবাইলে হাইড করার জন্য hidden lg:block যোগ করা হয়েছে) */}
            <nav className={`hidden lg:block left-0 w-full print:hidden text-white z-50 transition-all duration-300 ${isScrolled
                ? "fixed top-0 bg-emerald-900/95 shadow-md border-b border-emerald-800 dark:bg-slate-900/95 dark:border-slate-800 backdrop-blur-sm bg-opacity-100 pointer-events-auto"
                : "absolute top-57 bg-transparent lg:bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-end h-20">

                        {/* মেনু কন্টেইনার */}
                        <div className="hidden lg:flex items-center space-x-0.5">
                            {menuItems.map((item, index) => (
                                <div key={index} className="relative group">
                                    {item.dropdown ? (
                                        <>
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                                className={`px-2 py-2 rounded-md text-[13px] xl:text-sm font-semibold hover:bg-emerald-800/80 dark:hover:bg-slate-800/80 transition flex items-center gap-0.5 focus:outline-none text-white ${item.isAdmission ? "bg-amber-500 hover:bg-amber-600 text-slate-950 dark:text-slate-950 animate-pulse rounded-md px-3 font-bold" : ""
                                                    }`}
                                            >
                                                {item.name}
                                                <svg className={`w-3 h-3 ${item.isAdmission ? "text-slate-950" : "text-emerald-200/70"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <div className="absolute left-0 mt-0 w-56 bg-white text-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t-4 border-amber-500 dark:bg-slate-800 dark:text-gray-100 dark:border-emerald-600">
                                                <div className="py-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                                    {item.dropdown.map((sub, i) => (
                                                        <Link
                                                            key={i}
                                                            href={sub.href}
                                                            className="block px-4 py-2 text-xs xl:text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-700/50 hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Link href={item.href} className="px-2 py-2 rounded-md text-[13px] xl:text-sm font-medium hover:bg-emerald-800/80 dark:hover:bg-slate-800/80 transition block text-white">{item.name}</Link>
                                    )}
                                </div>
                            ))}

                            {/* থিম টগল */}
                            <button onClick={toggleDarkMode} className="p-1.5 ml-1 rounded-full hover:bg-emerald-800/80 dark:hover:bg-slate-800/80 transition-colors text-amber-300 focus:outline-none flex-shrink-0">
                                {darkMode ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M12 12a9 9 0 110 18v-1z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>

                            {/* লগইন/লগআউট অ্যাকশন */}
                            {isLoggedIn ? (
                                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20 flex-shrink-0">
                                    <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-[11px] overflow-hidden border border-white shadow-inner">
                                        {userPhoto ? <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" /> : userRole ? userRole[0].toUpperCase() : "U"}
                                    </div>
                                    <Link href={getDashboardPath()} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs xl:text-sm shadow transition transform hover:-translate-y-0.5">{t("menu.dashboard")}</Link>
                                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-md text-xs xl:text-sm shadow transition transform hover:-translate-y-0.5">{t("menu.logout")}</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/20 flex-shrink-0">
                                    <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs xl:text-sm shadow transition transform hover:-translate-y-0.5">{t("menu.login")}</Link>
                                    <Link href="/register" className="bg-transparent border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs xl:text-sm shadow transition transform hover:-translate-y-0.5">{t("menu.register")}</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* মোবাইল মোডাল/ড্রয়ার প্যানেল */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 lg:hidden" onClick={closeMenu}>
                    <div className="absolute top-24 right-4 w-64 bg-emerald-950/95 border border-emerald-800 rounded-2xl shadow-2xl p-4 space-y-3 dark:bg-slate-950/95 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-800 dark:border-slate-800">
                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{t("menu.account_menu")}</span>
                            <button onClick={closeMenu} className="text-emerald-400 hover:text-white">&times;</button>
                        </div>
                        {isLoggedIn ? (
                            <div className="space-y-2">
                                <Link
                                    href={getDashboardPath()}
                                    onClick={closeMenu}
                                    className="block text-center bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow text-sm"
                                >
                                    {t("menu.dashboard")} ({userRole})
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-center bg-red-600 text-white font-bold py-2.5 rounded-xl shadow text-sm"
                                >
                                    {t("menu.logout")}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="block text-center bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow text-sm"
                                >
                                    {t("menu.login")}
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={closeMenu}
                                    className="block text-center bg-transparent border border-amber-400 text-amber-400 font-bold py-2.5 rounded-xl shadow text-sm"
                                >
                                    {t("menu.register")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <GlobalMobileNavTrigger isOpen={isOpen} setIsOpen={setIsOpen} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </>
    );
}

function GlobalMobileNavTrigger({ isOpen, setIsOpen, darkMode, toggleDarkMode }) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.__toggleMobileMenu = () => setIsOpen(!isOpen);
            window.__toggleMobileDarkMode = toggleDarkMode;
            window.__isDarkModeActive = darkMode;
        }
    }, [isOpen, darkMode]);
    return null;
}
