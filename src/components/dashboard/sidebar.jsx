"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // Better Auth ক্লায়েন্ট ইম্পোর্ট করা হলো

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null);

    // ১. Better Auth থেকে রিয়েল-টাইম সেশন এবং ইউজার ডেটা আনা
    const { data: session, isPending } = authClient.useSession();
    
    // সেশন থেকে ইউজার ডেটা প্রসেস করা (লগইন না থাকলে বা লোড হতে থাকলে ব্যাকআপ রাখা)
    const user = session?.user;
    const userRole = user?.role?.toLowerCase() || "user"; // ডিফল্ট বা সেফ সাইড রোল
    const userName = user?.name || "অতিথি ব্যবহারকারী";
    const avatarLetter = userName ? userName[0] : "ইউ";

    const menuConfig = [
        { 
            title: "মারকাযি ড্যাশবোর্ড", 
            icon: "🕌", 
            href: "/dashboard/admin", 
            roles: ["admin"] 
        },
        {
            title: "মাদরাসা পরিচিতি",
            icon: "📜",
            roles: ["admin"],
            dropdown: [
                { title: "প্রতিষ্ঠান পরিচিতি", href: "/dashboard/admin/about?section=profile" },
                { title: "প্রতিষ্ঠাতা পরিচিতি", href: "/dashboard/admin/about?section=founder" },
                { title: "লক্ষ্য ও উদ্দেশ্য", href: "/dashboard/admin/about?section=vision" },
                { title: "পরিচালনা পর্ষদ", href: "/dashboard/admin/about?section=committee" },
                { title: "আমাদের বৈশিষ্ট্য", href: "/dashboard/admin/about?section=features" },
                { title: "ভবিষ্যৎ পরিকল্পনা", href: "/dashboard/admin/about?section=roadmap" },
                { title: "শিক্ষকমণ্ডলী", href: "/dashboard/admin/about?section=faculty" },
                { title: "কর্মকর্তা ও কর্মচারী", href: "/dashboard/admin/about?section=staff" },
                { title: "নীতিমালা", href: "/dashboard/admin/about?section=policies" },
            ]
        },
        {
            title: "শিক্ষা কার্যক্রম",
            icon: "📚",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "শিক্ষা স্তর", href: "/dashboard/admin/academics?section=levels" },
                { title: "পাঠ্যক্রম (Syllabus)", href: "/dashboard/admin/academics?section=syllabus" },
                { title: "ক্লাস রুটিন", href: "/dashboard/admin/academics?section=class-routine" },
                { title: "পরীক্ষা রুটিন", href: "/dashboard/admin/academics?section=exam-routine" },
                { title: "सह-পাঠ্যক্রম", href: "/dashboard/admin/academics?section=co-curricular" },
            ]
        },
        {
            title: "বিভাগসমূহ",
            icon: "🏫",
            roles: ["admin"],
            dropdown: [
                { title: "হিফজ বিভাগ", href: "/dashboard/admin/departments/hifz" },
                { title: "একাডেমিক বিভাগ", href: "/dashboard/admin/departments/academic" },
            ]
        },
        {
            title: "ভর্তি ব্যবস্থাপনা",
            icon: "📝",
            roles: ["admin"],
             dropdown: [
                { title: "ভর্তির সময়", href: "/dashboard/admin/admission?section=timeline" },
                { title: "ভর্তি পরীক্ষা", href: "/dashboard/admin/admission?section=test" },
                { title: "ভর্তি প্রক্রিয়া", href: "/dashboard/admin/admission?section=test" }, 
                { title: "ভর্তি ফি", href: "/dashboard/admin/admission?section=fees" },
                { title: "সকল আবেদন", href: "/dashboard/admin/admission" },
            ]
        },
        {
            title: "মিডিয়া গ্যালারি",
            icon: "🖼️",
            roles: ["admin"],
            dropdown: [
                { title: "গ্যালারি নিয়ন্ত্রণ", href: "/dashboard/admin/gallery" },
                { title: "ফটো এবং ভিডিও লিস্ট", href: "/dashboard/admin/gallery/list" },
            ]
        },
        {
            title: "আবাসন (হোস্টেল)",
            icon: "🛏️",
            roles: ["admin"],
            dropdown: [
                { title: "ছাত্রাবাস পরিচিতি", href: "/dashboard/admin/hostel?section=about" },
                { title: "আবাসিক নিয়মাবলী", href: "/dashboard/admin/hostel?section=rules" },
                { title: "দৈনিক কার্যসূচি", href: "/dashboard/admin/hostel?section=routine" },
            ]
        },
        {
            title: "স্মার্ট ক্লাসরুম",
            icon: "💻",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "লাইভ ক্লাস লিংক", href: "/dashboard/admin/smart-classroom/live" },
                { title: "রেকর্ডেড ক্লাস আপলোড", href: "/dashboard/admin/smart-classroom/recorded" },
                { title: "ই-বুক / লেকচার শিট", href: "/dashboard/admin/smart-classroom/ebooks" },
                { title: "অনলাইন এক্সাম... কন্ট্রোল", href: "/dashboard/admin/smart-classroom/exam" },
            ]
        },
        { title: "ডিজিটাল হাজিরা", icon: "📅", href: "/dashboard/attendance", roles: ["admin", "teacher"] },
        { title: "শিক্ষার্থী ব্যবস্থাপনা", icon: "👥", href: "/dashboard/students", roles: ["admin", "teacher"] },
        { title: "শিক্ষক ব্যবস্থাপনা", icon: "🕌", href: "/dashboard/teachers", roles: ["admin"] },
        { title: "প্রশাসনিক বিভাগ", icon: "🛡️", href: "/dashboard/administration", roles: ["admin"] },
        {
            title: "হিসাব ও অর্থ বিভাগ",
            icon: "💰",
            // ২. রিকোয়েস্ট অনুযায়ী এখানে 'accountant' এর সাথে 'admin' রাখা হয়েছে (যেহেতু আলাদা একাউন্টেন্ট রোল নেই)
            roles: ["admin", "accountant"], 
            dropdown: [
                { title: "রশিদ ব্যবস্থাপনা", href: "/dashboard/finance/receipts" },
                { title: "সদকা ও অনুদান", href: "/dashboard/finance/donations" },
                { title: "ঋণ ও বকেয়া", href: "/dashboard/finance/dues" },
                { title: "অ্যাকাউন্टिंग রিপোর্টস", href: "/dashboard/finance/reports" },
            ]
        }
    ];

    // ৩. রিয়েল ইউজার রোলের ওপর ভিত্তি করে ফিল্টারিং
    const allowedMenuItems = menuConfig.filter(item => item.roles.includes(userRole));

    // সেশন লোড হওয়ার সময়ে একটি মার্জিত কঙ্কাল (Skeleton) বা ব্ল্যাঙ্ক স্টেট রাখা ভালো
    if (isPending) {
        return <div className="w-66 bg-[#043e30] h-screen fixed top-0 left-0 z-50 animate-pulse" />;
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`
                fixed top-0 bottom-0 left-0 z-50 lg:sticky lg:top-0
                w-66 bg-[#043e30] text-gray-100 h-screen flex flex-col border-r border-emerald-800/40
                transition-transform duration-300 ease-in-out scroll-smooth
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>

                <div className="p-4 border-b border-emerald-800/40 flex items-center justify-between bg-emerald-950/30">
                    <Link href="/" className="group flex items-center gap-2.5 focus:outline-hidden">
                        <span className="text-xl p-2 bg-emerald-900/50 rounded-xl group-hover:bg-amber-500 group-hover:text-[#043e30] transition-all duration-300 group-hover:scale-105 shadow-sm">
                            🕌
                        </span>
                        <div>
                            <h2 className="font-black text-sm sm:text-base text-amber-400 tracking-wide transition-colors duration-200">আস-সালাম মাদরাসা</h2>
                            <p className="text-[10px] text-emerald-300/80 font-medium tracking-wider">হবিগঞ্জ, বাংলাদেশ</p>
                        </div>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-emerald-300 hover:text-white text-base p-1">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scroll-smooth scrollbar-thin scrollbar-thumb-emerald-900/60 scrollbar-track-transparent">
                    {allowedMenuItems.map((item, idx) => {
                        const isDropdownOpen = openDropdown === idx;
                        const hasDropdown = !!item.dropdown;
                        const isActive = pathname === item.href;

                        return (
                            <div key={idx} className="space-y-1 transition-all duration-300">
                                {hasDropdown ? (
                                    <button
                                        onClick={() => setOpenDropdown(isDropdownOpen ? null : idx)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-300 group/btn
                                            ${isDropdownOpen 
                                                ? "bg-emerald-900/80 text-amber-300 shadow-inner border-l-4 border-amber-400 pl-2" 
                                                : "text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white hover:translate-x-1"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-base group-hover/btn:scale-110 transition-transform duration-300">{item.icon}</span>
                                            <span className="font-semibold tracking-wide">{item.title}</span>
                                        </div>
                                        <span className={`text-[10px] text-emerald-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-amber-400" : ""}`}>
                                            ▼
                                        </span>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href || "#"}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-300 group/link
                                            ${isActive
                                                ? "bg-amber-400 text-[#043e30] font-black shadow-md border-r-4 border-emerald-900 scale-[1.02]"
                                                : "text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white hover:translate-x-1"}`}
                                    >
                                        <span className="text-base transform group-hover/link:scale-110 transition-transform duration-300">{item.icon}</span>
                                        <span className="font-semibold tracking-wide">{item.title}</span>
                                    </Link>
                                )}

                                {hasDropdown && (
                                    <div className={`pl-4 space-y-1 border-l-2 border-emerald-800/50 ml-5 overflow-hidden transition-all duration-300 ease-in-out
                                        ${isDropdownOpen ? "max-h-[400px] opacity-100 py-1" : "max-h-0 opacity-0"}`}>
                                        {item.dropdown.map((sub, subIdx) => {
                                            const isSubActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={subIdx}
                                                    href={sub.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block py-2 px-3 text-[11px] sm:text-xs rounded-lg transition-all duration-200 font-medium
                                                        ${isSubActive
                                                            ? "text-amber-400 font-bold bg-emerald-900/60 shadow-xs border-l-2 border-amber-400 pl-2"
                                                            : "text-emerald-200/80 hover:text-white hover:bg-emerald-800/30 hover:pl-4"}`}
                                                >
                                                    ✨ {sub.title}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ৪. ইউজার প্রোফাইল কার্ড - ডাইনামিক সেশন ডেটা প্রদর্শন */}
                {session && (
                    <div className="p-3 border-t border-emerald-800/40 bg-emerald-950/40">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-emerald-900/30 border border-emerald-800/30 shadow-xs">
                            <div className="w-8 h-8 rounded-full bg-amber-400 text-[#043e30] flex items-center justify-center font-black text-sm shadow-inner transform hover:rotate-12 transition-transform duration-300 overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    avatarLetter
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-100 truncate tracking-wide">{userName}</h4>
                                <span className="inline-block text-[9px] font-extrabold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-widest mt-0.5">
                                    {userRole === "admin" ? "মুদীর (Admin)" : userRole}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
