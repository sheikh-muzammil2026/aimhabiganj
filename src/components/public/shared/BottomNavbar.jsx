"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // useRouter ইমপোর্ট করা হয়েছে
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
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
    Image,
    PhoneCall,
    UserCheck,
    LogIn,
    LogOut, // LogOut আইকন ইমপোর্ট করা হলো
    User
} from "lucide-react";

export default function BottomNavbar() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Auth Session Check
    const { data: session } = authClient.useSession();
    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role;
    const userName = session?.user?.name;

    const getDashboardPath = () => {
        if (!userRole) return "/";
        return `/dashboard/${userRole.toLowerCase()}`;
    };

    // Logout Handler
    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setIsMenuOpen(false);
                    router.push("/login");
                }
            }
        });
    };

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
                { name: t("menu.exam_routine"), href: "/academics#exam-routine" },
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
        { name: t("menu.notices"), href: "/notices", icon: <FileText className="w-4 h-4" /> },
        { name: t("menu.gallery"), href: "/gallery", icon: <Image className="w-4 h-4" /> },
        { name: t("menu.results"), href: "/results", icon: <GraduationCap className="w-4 h-4" /> },
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
        { name: t("menu.home"), href: "/", icon: <Home className="w-[22px] h-[22px]" /> },
        { name: t("menu.results"), href: "/results", icon: <GraduationCap className="w-[22px] h-[22px]" /> },
        { name: t("menu.notices"), href: "/notices", icon: <FileText className="w-[22px] h-[22px]" /> },
        isLoggedIn
            ? { name: t("menu.dashboard"), href: getDashboardPath(), icon: <UserCheck className="w-[22px] h-[22px]" /> }
            : { name: t("menu.login"), href: "/login", icon: <LogIn className="w-[22px] h-[22px]" /> },
    ];

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            {/* ১. মূল বটম নেভিগেশন বার (মোবাইল ভিউ) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-[#ffffff] to-[#f4fbf7] border-t-2 border-emerald-600/30 shadow-[0_-8px_30px_rgb(6,95,70,0.08)] rounded-t-2xl md:hidden pb-safe print:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    {primaryItems.map((item, idx) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${isActive ? "text-emerald-700 font-bold" : "text-gray-500 hover:text-emerald-600"
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute top-0 w-8 h-1 bg-amber-500 rounded-full shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />
                                )}
                                <div className={`transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_2px_4px_rgba(4,120,87,0.2)]" : "group-hover:scale-105"}`}>
                                    {item.icon}
                                </div>
                                <span className="text-[10.5px] mt-1 break-keep text-center tracking-tight font-medium">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${isMenuOpen ? "text-amber-600 font-bold" : "text-gray-500 hover:text-emerald-600"
                            }`}
                    >
                        {isMenuOpen && (
                            <span className="absolute top-0 w-8 h-1 bg-amber-500 rounded-full" />
                        )}
                        <div className={`p-1.5 rounded-xl transition-all duration-300 ${isMenuOpen ? "bg-amber-50 text-amber-600 rotate-90" : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"}`}>
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </div>
                        <span className="text-[10.5px] mt-0.5 font-medium">{t("menu.more")}</span>
                    </button>
                </div>
            </div>

            {/* ২. "অন্যান্য" বটম শিট ড্রয়ার */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-xs md:hidden transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="fixed bottom-16 left-0 right-0 max-h-[75vh] bg-[#fafdfb] rounded-t-3xl overflow-y-auto p-4 shadow-[0_-15px_40px_rgba(6,95,70,0.15)] border-t border-emerald-600/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-16 h-1.5 bg-emerald-200/60 rounded-full mx-auto mb-4" />

                        {/* 🌟 লগইন থাকলে ইউজার ইনফো ও লগআউট বাটন (এখানে যুক্ত করা হয়েছে) */}
                        {isLoggedIn && (
                            <div className="bg-emerald-800 text-white p-3.5 rounded-2xl mb-4 flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-sm">
                                        {userRole ? userRole[0].toUpperCase() : "U"}
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-200 capitalize font-medium">{userRole || "User"}</p>
                                        <p className="text-sm font-semibold truncate max-w-[150px]">{userName || "Account"}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500 text-red-100 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-400/30 transition-all active:scale-95"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>{t("menu.logout") || "Logout"}</span>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-2 mb-4 border-b border-emerald-100 pb-3">
                            <School className="w-5 h-5 text-emerald-700" />
                            <h3 className="text-center font-bold text-emerald-950 text-base font-serif">{t("menu.menu_title")}</h3>
                        </div>

                        <div className="space-y-2.5 pb-6">
                            {menuItems.map((item, idx) => {
                                const hasDropdown = !!item.dropdown;
                                const isDropdownOpen = activeDropdown === idx;

                                return (
                                    <div key={idx} className="bg-white rounded-xl border border-emerald-600/5 shadow-[0_2px_8px_rgba(6,95,70,0.03)] overflow-hidden transition-all">
                                        {hasDropdown ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleDropdown(idx)}
                                                    className={`w-full flex justify-between items-center p-3.5 text-left font-medium transition-colors ${isDropdownOpen ? "bg-emerald-50 text-emerald-800" : "text-gray-700 hover:bg-emerald-50/40"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-1.5 rounded-lg ${isDropdownOpen ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-sm font-semibold">{item.name}</span>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 text-emerald-600/60 transition-transform duration-300 ${isDropdownOpen ? "rotate-90 text-amber-500" : ""}`} />
                                                </button>

                                                {isDropdownOpen && (
                                                    <div className="bg-[#f7fdfa] border-t border-emerald-100 divide-y divide-emerald-100/40">
                                                        {item.dropdown.map((subItem, subIdx) => (
                                                            <Link
                                                                key={subIdx}
                                                                href={subItem.href}
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className="flex items-center gap-2 p-3.5 pl-12 text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href || "#"}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 p-3.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                            >
                                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                                                    {item.icon}
                                                </div>
                                                {item.name}
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
