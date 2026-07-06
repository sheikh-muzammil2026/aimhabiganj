"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    // ডাইনামিক রোল ও অথেনটিকেশন স্টেট (মাস্টার প্ল্যান অনুযায়ী)
    const [user, setUser] = useState({
        isLoggedIn: true,
        role: "Admin",
        photo: null
    });

    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
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

    // আপনার রিকোয়ারমেন্ট অনুযায়ী সম্পূর্ণ মেনু স্ট্রাকচার
    const menuItems = [
        { name: "হোম", href: "/" },
        {
            name: "আমাদের সম্পর্কে",
            dropdown: [
                { name: "প্রতিষ্ঠান পরিচিতি", href: "/about#profile" },
                { name: "প্রতিষ্ঠাতা পরিচিতি", href: "/about#founder" },
                { name: "লক্ষ্য ও উদ্দেশ্য", href: "/about#vision" },
                { name: "পরিচালনা পর্ষদ", href: "/about#committee" },
                { name: "আমাদের বৈশিষ্ট্য", href: "/about#features" },
                { name: "ভবিষ্যৎ পরিকল্পনা", href: "/about#roadmap" },
                { name: "মতামত (শিক্ষার্থী ও উলামা)", href: "/about#testimonials" },
                { name: "নীতিমালা", href: "/about#policies" },
                { name: "শিক্ষকমণ্ডলী", href: "/about#faculty" },
                { name: "কর্মকর্তা ও কর্মচারী", href: "/about#staff" },
                { name: "কর্মক্ষেত্র ও দায়িত্ব", href: "/about#roster" },
            ],
        },
        {
            name: "শিক্ষা কার্যক্রম",
            dropdown: [
                { name: "শ্রেণী শিক্ষকের তালিকা", href: "/academics#teachers" },
                { name: "শিক্ষা স্তর", href: "/academics#levels" },
                { name: "পাঠ্যক্রম (Syllabus)", href: "/academics#syllabus" },
                { name: "সহ-পাঠ্যক্রম", href: "/academics#co-curricular" },
                { name: "ক্লাস রুটিন", href: "/academics#class-routine" },
                { name: "পরীক্ষা রুটিন", href: "/academics#exam-routine" },
            ],
        },
        {
            name: "বিভাগসমূহ",
            dropdown: [
                { name: "হিফজ বিভাগ", href: "/departments/hifz" },
                { name: "একাডেমিক বিভাগ", href: "/departments/academic" },
            ],
        },
        {
            name: "ভর্তি",
            dropdown: [
                { name: "ভর্তির সময়", href: "/admission#timeline" },
                { name: "ভর্তি পরীক্ষা", href: "/admission#test" },
                { name: "ভর্তি প্রক্রিয়া", href: "/admission#process" },
                { name: "ভর্তি ফি", href: "/admission#fees" },
                { name: "ভর্তির শর্তাবলী", href: "/admission#terms" },
                { name: "অনলাইন ভর্তি ফরম", href: "/admission/apply" },
            ],
        },
        {
            name: "আবাসন",
            dropdown: [
                { name: "ছাত্রাবাস পরিচিতি", href: "/hostel#about" },
                { name: "আবাসিক হলের পরিচালকবৃন্দ", href: "/hostel#directors" },
                { name: "আবাসন প্রাপ্তির নিয়মাবলী", href: "/hostel#rules" },
                { name: "আবাসন চার্ট", href: "/hostel#chart" },
                { name: "দৈনিক আবাসিক কার্যসূচি", href: "/hostel#routine" },
            ],
        },
        {
            name: "স্মার্ট ক্লাসরুম",
            dropdown: [
                { name: "লাইভ ক্লাস", href: "/smart-classroom/live" },
                { name: "রেকর্ডেড ক্লাস", href: "/smart-classroom/recorded" },
                { name: "ই-বুক / লেকচার শিট", href: "/smart-classroom/ebooks" },
                { name: "অনলাইন এক্সাম", href: "/smart-classroom/exam" },
                { name: "কুইজ প্রতিযোগিতা", href: "/smart-classroom/quiz" },
            ],
        },
        { name: "নোটিশ বোর্ড", href: "/notices" },
        { name: "গ্যালারি", href: "/gallery" },
        { name: "ফলাফল", href: "/results" },
        {
            name: "যোগাযোগ",
            dropdown: [
                { name: "যোগাযোগের তথ্য", href: "/contact" },
                { name: "অভিযোগ ও পরামর্শ", href: "/contact#feedback" },
            ],
        },
    ];

    return (
        <nav className="bg-emerald-850 text-white shadow-md sticky top-0 z-50 transition-colors duration-300 dark:bg-slate-900 border-b dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* লোগো সেকশন - প্ল্যান অনুযায়ী লোগোটি একা বামপাশে থাকবে এবং মাদ্রাসার নাম এখানে থাকবে না */}
                    <div className="flex-shrink-0 flex items-center pr-4">
                        <Link href="/" className="flex items-center" onClick={closeMenu}>
                            <div className="bg-white text-emerald-950 font-black p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-amber-400 dark:bg-emerald-800 dark:text-white dark:border-emerald-600 text-lg tracking-wider">
                                AS
                            </div>
                        </Link>
                    </div>

                    {/* ডেস্কটপ মেনু - ml-auto ব্যবহার করায় লোগো ও মেনু আইটেমের মাঝে সর্বোচ্চ খালি জায়গা তৈরি হবে */}
                    <div className="hidden lg:flex items-center space-x-0.5 ml-auto">
                        {menuItems.map((item, index) => (
                            <div key={index} className="relative group">
                                {item.dropdown ? (
                                    <>
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                            className="px-2 py-2 rounded-md text-[13px] xl:text-sm font-medium hover:bg-emerald-700 dark:hover:bg-slate-800 transition flex items-center gap-0.5 focus:outline-none"
                                        >
                                            {item.name}
                                            <svg className="w-3 h-3 text-emerald-200/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* ড্রপডাউন বক্স */}
                                        <div className="absolute left-0 mt-0 w-56 bg-white text-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t-4 border-amber-500 dark:bg-slate-800 dark:text-gray-100 dark:border-emerald-600">
                                            <div className="py-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                                {item.dropdown.map((sub, i) => (
                                                    <Link
                                                        key={i}
                                                        href={sub.href}
                                                        className="block px-4 py-2 text-xs xl:text-sm hover:bg-emerald-50 dark:hover:bg-slate-700/50 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link href={item.href} className="px-2 py-2 rounded-md text-[13px] xl:text-sm font-medium hover:bg-emerald-700 dark:hover:bg-slate-800 transition block">{item.name}</Link>
                                )}
                            </div>
                        ))}

                        {/* থিম টগল বাটন */}
                        <button onClick={toggleDarkMode} className="p-1.5 ml-1 rounded-full hover:bg-emerald-700 dark:hover:bg-slate-800 transition-colors text-amber-300 focus:outline-none flex-shrink-0">
                            {darkMode ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M12 12a9 9 0 110 18v-1z" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>

                        {/* রোল-বেসড ডাইনামিক অ্যাকশন বাটন প্যানেল */}
                        {user.isLoggedIn ? (
                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-emerald-700 dark:border-slate-700 flex-shrink-0">
                                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-[11px] overflow-hidden border border-white shadow-inner">
                                    {user.photo ? <img src={user.photo} alt="Profile" className="w-full h-full object-cover" /> : user.role[0]}
                                </div>
                                <Link
                                    href={`/dashboard/${user.role.toLowerCase()}`}
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs xl:text-sm shadow transition transform hover:-translate-y-0.5"
                                >
                                    ড্যাশবোর্ড
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs xl:text-sm shadow transition transform hover:-translate-y-0.5 flex-shrink-0"
                            >
                                লগইন
                            </Link>
                        )}
                    </div>

                    {/* মোবাইল রেসপনসিভ হ্যামবার্গার ও থিম বাটন */}
                    <div className="flex items-center lg:hidden gap-2">
                        <button onClick={toggleDarkMode} className="p-2 text-amber-300"><span className="text-lg">{darkMode ? "☀️" : "🌙"}</span></button>
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-emerald-100 hover:bg-emerald-700 focus:outline-none">
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* মোবাইল মেনু ড্রয়ার */}
            {isOpen && (
                <div className="lg:hidden bg-emerald-900 border-t border-emerald-800 dark:bg-slate-950 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
                    <div className="px-2 pt-2 pb-4 space-y-1">
                        {menuItems.map((item, index) => (
                            <div key={index} className="block">
                                {item.dropdown ? (
                                    <>
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-800 dark:hover:bg-slate-800 transition flex items-center justify-between"
                                        >
                                            <span>{item.name}</span>
                                            <svg className={`w-4 h-4 transform transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {activeDropdown === item.name && (
                                            <div className="pl-4 bg-emerald-950/50 dark:bg-slate-900 rounded-md mt-1 mb-2">
                                                {item.dropdown.map((sub, i) => (
                                                    <Link key={i} href={sub.href} onClick={closeMenu} className="block px-3 py-2 text-sm text-emerald-100 dark:text-gray-300 hover:bg-emerald-800 dark:hover:bg-slate-800 hover:text-white rounded-md transition">{sub.name}</Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link href={item.href} onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-800 dark:hover:bg-slate-800 transition">{item.name}</Link>
                                )}
                            </div>
                        ))}
                        <div className="pt-4 border-t border-emerald-800 dark:border-slate-800 px-3">
                            {user.isLoggedIn ? (
                                <Link href={`/dashboard/${user.role.toLowerCase()}`} onClick={closeMenu} className="block text-center bg-amber-500 text-slate-950 font-bold py-2 rounded-md">ড্যাশবোর্ড প্যানেল</Link>
                            ) : (
                                <Link href="/login" onClick={closeMenu} className="block text-center bg-amber-500 text-slate-950 font-bold py-2 rounded-md">লগইন করুন</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}