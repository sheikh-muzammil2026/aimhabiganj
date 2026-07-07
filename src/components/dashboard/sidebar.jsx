"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null);

    // আপনার দেওয়া অরিজিনাল মেনু আইটেম ও টাইটেলসমূহ (হুবহু রাখা হয়েছে)
    const menuItems = [
        { title: "অফিসিয়াল ড্যাশবোর্ড", icon: "📊", href: "/dashboard/admin" },
        {
            title: "আমাদের সম্পর্কে",
            icon: "ℹ️",
            dropdown: [
                { title: "প্রতিষ্ঠান পরিচিতি", href: "/about#profile" },
                { title: "প্রতিষ্ঠাতা পরিচিতি", href: "/about#founder" },
                { title: "লক্ষ্য ও উদ্দেশ্য", href: "/about#vision" },
                { title: "পরিচালনা পর্ষদ", href: "/about#committee" },
                { title: "আমাদের বৈশিষ্ট্য", href: "/about#features" },
                { title: "ভবিষ্যৎ পরিকল্পনা", href: "/about#roadmap" },
                { title: "শিক্ষকমণ্ডলী", href: "/about#faculty" },
                { title: "কর্মকর্তা ও কর্মচারী", href: "/about#staff" },
                { title: "নীতিমালা", href: "/about#policies" },
            ]
        },
        {
            title: "শিক্ষা কার্যক্রম",
            icon: "📚",
            dropdown: [
                { title: "শিক্ষা স্তর", href: "/academics#levels" },
                { title: "পাঠ্যক্রম (Syllabus)", href: "/academics#syllabus" },
                { title: "ক্লাস রুটিন", href: "/academics#class-routine" },
                { title: "পরীক্ষা রুটিন", href: "/academics#exam-routine" },
                { title: "सह-पाठ्यक्रम", href: "/academics#co-curricular" },
            ]
        },
        {
            title: "বিভাগসমূহ",
            icon: "🏫",
            dropdown: [
                { title: "হিফজ বিভাগ", href: "/departments/hifz" },
                { title: "একাডেমিক বিভাগ", href: "/departments/academic" },
            ]
        },
        {
            title: "ভর্তি ব্যবস্থাপনা",
            icon: "📝",
            dropdown: [
                { title: "ভর্তির সময়", href: "/admission#timeline" },
                { title: "ভর্তি পরীক্ষা", href: "/admission#test" },
                { title: "ভর্তি প্রক্রিয়া", href: "/admission#process" },
                { title: "ভর্তি ফি", href: "/admission#fees" },
                { title: "অনলাইন ভর্তি ফরম", href: "/admission/apply" },
            ]
        },
        {
            title: "আবাসন (হোস্টেল)",
            icon: "🛏️",
            dropdown: [
                { title: "ছাত্রাবাস পরিচিতি", href: "/hostel#about" },
                { title: "আবাসিক নিয়মাবলী", href: "/hostel#rules" },
                { title: "দৈনিক কার্যসূচি", href: "/hostel#routine" },
            ]
        },
        {
            title: "স্মার্ট ক্লাসরুম",
            icon: "💻",
            dropdown: [
                { title: "লাইভ ক্লাস", href: "/smart-classroom/live" },
                { title: "রেকর্ডেড ক্লাস", href: "/smart-classroom/recorded" },
                { title: "ই-বুক / লেকচার শিট", href: "/smart-classroom/ebooks" },
                { title: "অনলাইন এক্সাম", href: "/smart-classroom/exam" },
            ]
        },
        { title: "ডিজিটাল হাজিরা", icon: "📅", href: "/dashboard/attendance" },
        { title: "শিক্ষার্থী ব্যবস্থাপনা", icon: "👥", href: "/dashboard/students" },
        { title: "শিক্ষক ব্যবস্থাপনা", icon: "🕌", href: "/dashboard/teachers" },
        { title: "প্রশাসনিক বিভাগ", icon: "🛡️", href: "/dashboard/administration" },
        {
            title: "হিসাব ও অর্থ বিভাগ",
            icon: "💰",
            dropdown: [
                { title: "রশিদ ব্যবস্থাপনা", href: "/dashboard/finance/receipts" },
                { title: "সদকা ও অনুদান", href: "/dashboard/finance/donations" },
                { title: "ঋণ ও বকেয়া", href: "/dashboard/finance/dues" },
                { title: "অ্যাকাউন্ٹنگ রিপোর্টস", href: "/dashboard/finance/reports" },
            ]
        }
    ];

    return (
        <>
            {/* মোবাইল স্ক্রিনের জন্য ব্যাকড্রপ ওভারলে */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* সাইডবার মেইন এরিয়া */}
            <aside className={`
                fixed top-0 bottom-0 left-0 z-50 lg:sticky lg:top-0
                w-64 bg-[#064e3b] text-white h-screen flex flex-col border-r border-emerald-800
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>

                {/* সাইডবার হেডার ব্র্যান্ডিং (মাদ্রাসার নামে ক্লিক করলে হোম পেজে "/" নিয়ে যাবে) */}
                <div className="p-4 border-b border-emerald-800/60 flex items-center justify-between bg-emerald-950/20">
                    <Link href="/" className="group flex items-center gap-2.5 focus:outline-hidden">
                        <span className="text-xl p-1.5 bg-emerald-900/60 rounded-lg group-hover:bg-amber-500 group-hover:text-[#064e3b] transition-colors duration-200">🏠</span>
                        <div>
                            <h2 className="font-black text-base text-amber-400 tracking-wide group-hover:text-white transition-colors duration-200">আস-সালাম মাদ্রাসা</h2>
                            <p className="text-[10px] text-emerald-300 font-medium">হবিগঞ্জ, বাংলাদেশ</p>
                        </div>
                    </Link>
                    {/* মোবাইল ক্লোজ বাটন */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-emerald-200 hover:text-white text-lg p-1"
                        aria-label="Close Sidebar"
                    >
                        ✕
                    </button>
                </div>

                {/* স্ক্রলযোগ্য মেনু আইটেম লিস্ট */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-emerald-800">
                    {menuItems.map((item, idx) => {
                        const isDropdownOpen = openDropdown === idx;
                        const hasDropdown = !!item.dropdown;
                        const isActive = pathname === item.href;

                        return (
                            <div key={idx} className="space-y-0.5">
                                {hasDropdown ? (
                                    /* ড্রপডাউন টগল বাটন */
                                    <button
                                        onClick={() => setOpenDropdown(isDropdownOpen ? null : idx)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-150
                                            ${isDropdownOpen ? "bg-emerald-900/60 text-amber-300" : "text-emerald-100 hover:bg-emerald-800/70 hover:text-white"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-base">{item.icon}</span>
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        <span className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>
                                            ▼
                                        </span>
                                    </button>
                                ) : (
                                    /* সাধারণ লিংক */
                                    <Link
                                        href={item.href || "#"}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 group
                                            ${isActive
                                                ? "bg-amber-500 text-[#064e3b] font-bold shadow-xs"
                                                : "text-emerald-100 hover:bg-emerald-800/70 hover:text-white"}`}
                                    >
                                        <span className="text-base transform group-hover:scale-110 transition-transform duration-150">{item.icon}</span>
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                )}

                                {/* ড্রপডাউন সাব-মেনু আইটেমসমূহ */}
                                {hasDropdown && isDropdownOpen && (
                                    <div className="pl-4 py-1 space-y-0.5 border-l border-emerald-700/50 ml-5 transition-all duration-200">
                                        {item.dropdown.map((sub, subIdx) => {
                                            const isSubActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={subIdx}
                                                    href={sub.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block py-2 px-3 text-xs rounded-md transition-colors
                                                        ${isSubActive
                                                            ? "text-amber-400 font-bold bg-emerald-900/40"
                                                            : "text-emerald-200 hover:text-white hover:bg-emerald-800/40"}`}
                                                >
                                                    {sub.title}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ড্যাশবোর্ড রোল ইন্ডিকেটর ফুটার (কার ড্যাশবোর্ড তা বোঝার জন্য বিশেষ সেকশন) */}
                <div className="p-3 border-t border-emerald-800 bg-emerald-950/40">
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-800/50">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-[#064e3b] flex items-center justify-center font-black text-sm shadow-xs">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-100 truncate">মুফতি আব্দুল্লাহ</h4>
                            {/* রোল অনুযায়ী ব্যাজ (এখানে আপনি ডায়নামিক রোল বসাতে পারেন, বর্তমানে 'Admin' দেওয়া) */}
                            <span className="inline-block text-[9px] font-extrabold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wider mt-0.5">
                                Admin Dashboard
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}