"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    LayoutDashboard,
    GraduationCap,
    Wallet,
    Users,
    Menu,
    X,
    ChevronDown,
    Sparkles
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Better Auth থেকে সেশন ডেটা
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;
    const userRole = user?.role?.toLowerCase() || "user";
    const userName = user?.name || "অতিথি ব্যবহারকারী";
    const avatarLetter = user?.name ? user.name.charAt(0) : "ই";

    const menuConfig = [
        {
            id: "admin-dashboard",
            title: "ওভারভিউ",
            icon: "🕌",
            href: "/dashboard/admin",
            roles: ["admin"]
        },
        {
            id: "academics",
            title: "পরীক্ষা ও ফলাফল",
            icon: "📚",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "পরীক্ষা ফি", href: "/dashboard/exam-fee" },
                { title: "পরীক্ষা রুটিন", href: "/dashboard/academics/routine" },
                { title: "এডমিট কার্ড", href: "/dashboard/academics/admit-card" },
                { title: "সীট প্লান", href: "/dashboard/academics/seat-plan" },
                { title: "সাক্ষরপত্র", href: "/dashboard/academics?attendance-sheet" },
                { title: "নম্বর ইনপুট", href: "/dashboard/academics/results/input" },
                { title: "ক্লাসভিত্তিক ফলাফল", href: "/dashboard/academics/results/class-wise-result" },
                { title: "ব্যক্তিগত ফলাফল", href: "/dashboard/academics/results/individual-result" },
            ]
        },
        {
            id: "admission",
            title: "ভর্তি ব্যবস্থাপনা",
            icon: "📝",
            roles: ["admin", "accountant"],
            dropdown: [
                { title: "ভর্তির সময়", href: "/dashboard/admission?section=timeline" },
                { title: "ভর্তি পরীক্ষা", href: "/dashboard/admission?section=test" },
                { title: "ভর্তি প্রক্রিয়া", href: "/dashboard/admission?section=process" },
                { title: "ভর্তি ফি", href: "/dashboard/admission?section=fees" },
                { title: "সকল আবেদন", href: "/dashboard/admission" },
            ]
        },
        {
            id: "gallery",
            title: "মিডিয়া গ্যালারি",
            icon: "🖼️",
            roles: ["admin"],
            dropdown: [
                { title: "গ্যালারি নিয়ন্ত্রণ", href: "/dashboard/gallery" },
                { title: "ফটো এবং ভিডিও লিস্ট", href: "/dashboard/gallery/list" },
            ]
        },
        {
            id: "smart-classroom",
            title: "স্মার্ট ক্লাসরুম",
            icon: "💻",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "লাইভ ক্লাস লিংক", href: "/dashboard/smart-classroom/live" },
                { title: "রেকর্ডেড ক্লাস আপলোড", href: "/dashboard/smart-classroom/recorded" },
                { title: "ই-বুক / লেকচার শিট", href: "/dashboard/smart-classroom/ebooks" },
                { title: "অনলাইন এক্সাম কন্ট্রোল", href: "/dashboard/smart-classroom/exam" },
                { title: "একাডেমিক ক্যালেন্ডার", href: "/dashboard/calendar" },
            ]
        },
        { id: "attendance", title: "ডিজিটাল হাজিরা", icon: "📅", href: "/dashboard/attendance", roles: ["admin", "teacher"] },
        {
            id: "students",
            title: "শিক্ষার্থী ব্যবস্থাপনা",
            icon: "👥",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "সকল শিক্ষার্থী তালিকা", href: "/dashboard/students" },
                { title: "নতুন শিক্ষার্থী ভর্তি/এন্ট্রি", href: "/dashboard/students/add" },
                { title: "শ্রেণী ও শাখা ভিত্তিক তালিকা", href: "/dashboard/students/by-class" },
                { title: "শিক্ষার্থীর আইডি কার্ড জেনারেটর", href: "/dashboard/students/id-card" },
                { title: "প্রসঙ্গ / ছাড়পত্র (TC & Character Cert)", href: "/dashboard/students/certificates" },
                { title: "অভিভাবকের তথ্য ও যোগাযোগ", href: "/dashboard/students/parents" },
                { title: "শিক্ষার্থীর উপস্থিতি রিপোর্ট", href: "/dashboard/students/attendance-report" },
                { title: "আবাসিক/হোস্টেল শিক্ষার্থী", href: "/dashboard/students/hostel" },
                { title: "ঝরে পড়া / নিষ্ক্রিয় শিক্ষার্থী", href: "/dashboard/students/inactive" },
            ]
        },
        { id: "teachers", title: "শিক্ষক ব্যবস্থাপনা", icon: "🕌", href: "/dashboard/teachers", roles: ["admin"] },
        { id: "administration", title: "প্রশাসনিক বিভাগ", icon: "🛡️", href: "/dashboard/administration", roles: ["admin"] },
        {
            id: "finance",
            title: "হিসাব ও অর্থ বিভাগ",
            icon: "💰",
            roles: ["admin", "accountant"],
            dropdown: [
                { title: "অ্যাকাউন্টিং রিপোর্টস", href: "/dashboard/finance" },
            ]
        },
        {
            id: "parent-corner",
            title: "অভিভাবক কর্নার",
            icon: "👨‍👩‍👦",
            roles: ["admin", "parent"],
            dropdown: [
                { title: "সন্তানের প্রোফাইল", href: "/dashboard/parent/child-profile" },
                { title: "একাডেমিক রেজাল্ট", href: "/dashboard/parent/results" },
                { title: "হাজিরা রিপোর্ট", href: "/dashboard/parent/attendance" },
                { title: "ফি ও অনলাইন পেমেন্ট", href: "/dashboard/parent/payments" },
                { title: "ক্লাস ও পরীক্ষার রুটিন", href: "/dashboard/parent/routines" },
                { title: "শিক্ষকদের নোটিশ", href: "/dashboard/parent/notices" },
            ]
        }
    ];

    // ইউজার রোল অনুযায়ী ফিল্টার করা মেনু
    const allowedMenuItems = isPending ? [] : menuConfig.filter(item => item.roles.includes(userRole));

    // ছোট ডিভাইসের বটম নেভিগেশন মেনু (অ্যাকাউন্টিং আইকন Wallet যুক্ত করা হয়েছে)
    const highDemandItems = [
        { id: "admin-dashboard", title: "ওভারভিউ", icon: <LayoutDashboard className="w-[20px] h-[20px]" /> },
        { id: "academics", title: "পরীক্ষা", icon: <GraduationCap className="w-[20px] h-[20px]" /> },
        { id: "finance", title: "অ্যাকাউন্টিং", icon: <Wallet className="w-[20px] h-[20px]" /> },
        { id: "students", title: "শিক্ষার্থী", icon: <Users className="w-[20px] h-[20px]" /> },
    ];

    useEffect(() => {
        if (!isPending) {
            allowedMenuItems.forEach((item) => {
                if (item.dropdown) {
                    const hasActiveChild = item.dropdown.some(sub => pathname.startsWith(sub.href.split('?')[0]));
                    if (hasActiveChild) {
                        setOpenDropdown(item.id);
                    }
                }
            });
        }
    }, [pathname, isPending, userRole]);

    // বটম বারের বাটনে ক্লিক করলে ড্রয়ার ওপেন হওয়া এবং উক্ত মেনুর ড্রপডাউন প্রসারিত করা
    const handleBottomNavClick = (targetId) => {
        if (targetId) {
            setOpenDropdown(targetId);
        }
        setIsMobileMenuOpen(true);
    };

    const displayRoleName = (role) => {
        switch (role) {
            case "admin": return "Admin";
            case "teacher": return "Teacher";
            case "accountant": return "Accountant";
            case "parent": return "Parent";
            default: return role;
        }
    };

    return (
        <>
            {/* ========================================================= */}
            {/* 1. DESKTOP SIDEBAR (বড় স্ক্রিনে দেখাবে: lg:flex)          */}
            {/* ========================================================= */}
            <aside className="hidden lg:flex sticky top-0 left-0 w-66 bg-[#043e30] text-gray-100 h-screen flex-col border-r border-emerald-800/40 z-50">
                {/* ব্র্যান্ড লোগো */}
                <div className="p-4 border-b border-emerald-800/40 flex items-center justify-between bg-emerald-950/30">
                    <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
                        <div className="w-10 h-10 rounded-full border border-blue-900 p-0.5 flex-shrink-0 flex items-center justify-center bg-white">
                            <img src="/aimlogo1.png" alt="AIM Logo" className="w-full h-full object-contain rounded-full" />
                        </div>
                        <div>
                            <h2 className="font-black text-sm text-amber-400 tracking-wide">আস-সালাম আইডিয়াল মাদরাসা</h2>
                            <p className="text-[10px] text-emerald-300/80 font-medium tracking-wider">হবিগঞ্জ, বাংলাদেশ</p>
                        </div>
                    </Link>
                </div>

                {/* মেনু আইটেমসমূহ */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-emerald-900/60 scrollbar-track-transparent">
                    {isPending ? (
                        <div className="space-y-3 p-2 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-9 bg-emerald-900/40 rounded-xl w-full"></div>
                            ))}
                        </div>
                    ) : (
                        allowedMenuItems.map((item) => {
                            const isDropdownOpen = openDropdown === item.id;
                            const hasDropdown = !!item.dropdown;
                            const isActive = pathname === item.href;

                            return (
                                <div key={item.id} className="space-y-1">
                                    {hasDropdown ? (
                                        <button
                                            onClick={() => setOpenDropdown(isDropdownOpen ? null : item.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-300 group/btn ${
                                                isDropdownOpen
                                                    ? "bg-emerald-900/80 text-amber-300 shadow-inner border-l-4 border-amber-400 pl-2"
                                                    : "text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white hover:translate-x-1"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-base group-hover/btn:scale-110 transition-transform">{item.icon}</span>
                                                <span className="font-semibold tracking-wide text-left">{item.title}</span>
                                            </div>
                                            <span className={`text-[10px] text-emerald-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-amber-400" : ""}`}>
                                                ▼
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href || "#"}
                                            className={`flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-300 group/link ${
                                                isActive
                                                    ? "bg-amber-400 text-[#043e30] font-black shadow-md border-r-4 border-emerald-900 scale-[1.02]"
                                                    : "text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white hover:translate-x-1"
                                            }`}
                                        >
                                            <span className="text-base transform group-hover/link:scale-110 transition-transform">{item.icon}</span>
                                            <span className="font-semibold tracking-wide">{item.title}</span>
                                        </Link>
                                    )}

                                    {/* ড্রপডাউন মেনু */}
                                    {hasDropdown && (
                                        <div className={`pl-4 space-y-1 border-l-2 border-emerald-800/50 ml-5 overflow-hidden transition-all duration-300 ${isDropdownOpen ? "max-h-[500px] opacity-100 py-1" : "max-h-0 opacity-0"}`}>
                                            {item.dropdown.map((sub, subIdx) => {
                                                const isSubActive = pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={subIdx}
                                                        href={sub.href}
                                                        className={`block py-2 px-3 text-[11px] sm:text-xs rounded-lg transition-all duration-200 font-medium ${
                                                            isSubActive
                                                                ? "text-amber-400 font-bold bg-emerald-900/60 border-l-2 border-amber-400 pl-2"
                                                                : "text-emerald-200/80 hover:text-white hover:bg-emerald-800/30 hover:pl-4"
                                                        }`}
                                                    >
                                                        ✨ {sub.title}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ইউজার প্রোফাইল কার্ড */}
                {!isPending && session && (
                    <div className="p-3 border-t border-emerald-800/40 bg-emerald-950/40">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-emerald-900/30 border border-emerald-800/30">
                            <div className="w-8 h-8 rounded-full bg-amber-400 text-[#043e30] flex items-center justify-center font-black text-sm">
                                {user?.image ? <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <span className="uppercase">{avatarLetter}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-100 truncate">{userName}</h4>
                                <span className="inline-block text-[9px] font-extrabold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-widest mt-0.5">
                                    {displayRoleName(userRole)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </aside>


            {/* ========================================================= */}
            {/* 2. MOBILE BOTTOM NAVBAR & DRAWER (ছোট স্ক্রিনে দেখাবে: lg:hidden) */}
            {/* ========================================================= */}
            
            {/* Fixed Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#043e30] border-t-2 border-amber-400/40 shadow-2xl lg:hidden pb-safe print:hidden">
                <div className="flex justify-around items-center h-16 px-1">
                    {/* বটম মেনু বাটনসমূহ: সবগুলিতে ক্লিক করলে ড্রয়ার ওপেন হবে */}
                    {highDemandItems.map((item, idx) => {
                        const isSelected = openDropdown === item.id && isMobileMenuOpen;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleBottomNavClick(item.id)}
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
                                    isSelected ? "text-amber-400 font-bold" : "text-emerald-200/70 hover:text-white"
                                }`}
                            >
                                {isSelected && (
                                    <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-full shadow-md" />
                                )}
                                <div className={`transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                                    {item.icon}
                                </div>
                                <span className="text-[10px] mt-1 tracking-tight font-medium">
                                    {item.title}
                                </span>
                            </button>
                        );
                    })}

                    {/* 'অন্যান্য' মেনু বাটন (Drawer Toggle) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
                            isMobileMenuOpen ? "text-amber-400 font-bold" : "text-emerald-200/70 hover:text-white"
                        }`}
                    >
                        {isMobileMenuOpen && (
                            <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-full" />
                        )}
                        <div className={`p-1 rounded-lg transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90 text-amber-400" : ""}`}>
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] mt-0.5 font-medium">অন্যান্য</span>
                    </button>
                </div>
            </div>

            {/* 'অন্যান্য' ও সাব-মেনু ড্রয়ার (Bottom Sheet Drawer) */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-emerald-950/60 backdrop-blur-xs lg:hidden transition-all duration-300" 
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className="fixed bottom-16 left-0 right-0 max-h-[75vh] bg-[#043e30] rounded-t-3xl overflow-y-auto p-4 border-t border-emerald-700/50 text-gray-100 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ড্রয়ার গ্রিপ বার */}
                        <div className="w-12 h-1.5 bg-emerald-700/60 rounded-full mx-auto mb-4" />

                        {/* ড্রয়ারের ভেতর ইউজার ইনফো */}
                        {!isPending && session && (
                            <div className="bg-emerald-950/80 border border-emerald-800/60 p-3 rounded-2xl mb-4 flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-400 text-[#043e30] font-bold flex items-center justify-center text-sm">
                                        {avatarLetter.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs text-amber-300 font-semibold">{userName}</p>
                                        <p className="text-[10px] text-emerald-300 capitalize">{displayRoleName(userRole)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-center font-bold text-amber-400 text-sm mb-3 pb-2 border-b border-emerald-800/50">
                            ড্যাশবোর্ড মেনুসমূহ
                        </div>

                        {/* ড্রয়ারের ভেতরের ফুল ড্যাশবোর্ড মেনু (সাইডবারের মূলমেনু ও সাব-মেনুসমূহ) */}
                        <div className="space-y-2 pb-6">
                            {allowedMenuItems.map((item) => {
                                const hasDropdown = !!item.dropdown;
                                const isDropdownOpen = openDropdown === item.id;
                                const isActive = pathname === item.href;

                                return (
                                    <div key={item.id} className="bg-emerald-950/40 rounded-xl border border-emerald-800/30 overflow-hidden">
                                        {hasDropdown ? (
                                            <div>
                                                <button
                                                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.id)}
                                                    className={`w-full flex justify-between items-center p-3 text-left font-medium transition-colors ${
                                                        isDropdownOpen ? "bg-emerald-900/60 text-amber-300" : "text-emerald-100"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-base">{item.icon}</span>
                                                        <span className="text-xs font-semibold">{item.title}</span>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-amber-400" : ""}`} />
                                                </button>

                                                {/* সাব-মেনু তালিকা */}
                                                {isDropdownOpen && (
                                                    <div className="bg-emerald-950/90 border-t border-emerald-800/40 divide-y divide-emerald-900/40">
                                                        {item.dropdown.map((subItem, subIdx) => {
                                                            const isSubActive = pathname === subItem.href;
                                                            return (
                                                                <Link
                                                                    key={subIdx}
                                                                    href={subItem.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className={`flex items-center gap-2 p-3 pl-8 text-xs font-medium transition-colors ${
                                                                        isSubActive ? "text-amber-400 font-bold bg-emerald-900/50" : "text-emerald-200/80 hover:text-white"
                                                                    }`}
                                                                >
                                                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                                                    {subItem.title}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href || "#"}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 p-3 text-xs font-semibold transition-colors ${
                                                    isActive ? "text-amber-400 bg-emerald-900/60" : "text-emerald-100 hover:text-white"
                                                }`}
                                            >
                                                <span className="text-base">{item.icon}</span>
                                                {item.title}
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
