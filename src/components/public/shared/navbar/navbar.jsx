"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    // ডার্ক মোড ইনিশিয়ালাইজেশন
    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // ডার্ক মোড টগল ফাংশন
    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDarkMode(true);
        }
    };

    // সব মেনু বন্ধ করার ফাংশন
    const closeMenu = () => {
        setIsOpen(false);
        setActiveDropdown(null);
    };

    const toggleDropdown = (menuName) => {
        if (activeDropdown === menuName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(menuName);
        }
    };

    // আপনার রিকোয়ারমেন্ট অনুযায়ী মেনু স্ট্রাকচার
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
                { name: "सह-পাঠ্যক্রম", href: "/academics#co-curricular" },
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
        { name: "গ্যালারি", href: "/gallery" },
        { name: "ফলাফল", href: "/results" },
        { name: "যোগাযোগ", href: "/contact" },
    ];

    return (
        <nav className="bg-emerald-850 dark:bg-slate-900 text-white shadow-lg sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo / Brand Name (৩ ভাষায় নাম সেট করা হয়েছে) */}
                    <div className="flex-shrink-0 flex items-center pr-4">
                        <Link href="/" className="flex items-center gap-2.5" onClick={closeMenu}>
                            <div className="bg-white text-emerald-800 dark:bg-emerald-700 dark:text-white font-black p-2 rounded-full w-11 h-11 flex items-center justify-center shadow-md border border-emerald-100 flex-shrink-0">
                                AS
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-emerald-200/80 font-serif leading-none tracking-wider mt-0.5 text-right" dir="rtl">
                                    مدرسة السلام النموذجية، حبيغنج
                                </span>
                                <span className="font-extrabold text-base md:text-lg tracking-wide leading-none text-amber-400 dark:text-emerald-400 capitalize">
                                    As-Salam Ideal Madrasah
                                </span>
                                <span className="text-xs md:text-sm font-semibold text-emerald-100 mt-0.5 leading-tight">
                                    আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ
                                </span>

                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - ml-auto ব্যবহার করে লোগো ও হোমের মাঝে গ্যাপ বাড়ানো হয়েছে */}
                    <div className="hidden lg:flex items-center space-x-1 ml-auto">
                        {menuItems.map((item, index) => (
                            <div key={index} className="relative group">
                                {item.dropdown ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className="px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 dark:hover:bg-slate-800 transition flex items-center gap-1 focus:outline-none"
                                        >
                                            {item.name}
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Hover Dropdown Menu */}
                                        <div className="absolute left-0 mt-0 w-60 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border-t-4 border-emerald-700 dark:border-emerald-600">
                                            <div className="py-1">
                                                {item.dropdown.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subItem.href}
                                                        className="block px-4 py-2.5 text-sm hover:bg-emerald-50 dark:hover:bg-slate-700/50 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 dark:hover:bg-slate-800 transition"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Light/Dark Mode Toggle Button */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 ml-2 rounded-full hover:bg-emerald-700 dark:hover:bg-slate-800 transition-colors text-amber-300 dark:text-amber-400 focus:outline-none"
                            title={darkMode ? "লাইট মোড অন করুন" : "ডার্ক মোড অন করুন"}
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M12 12a9 9 0 110 18v-1z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* Login Button */}
                        <Link
                            href="/login"
                            className="ml-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-2 rounded-md text-sm shadow transition-all duration-150"
                        >
                            লগইন
                        </Link>
                    </div>

                    {/* Mobile menu and Dark Mode buttons */}
                    <div className="flex items-center lg:hidden gap-2">
                        {/* Mobile Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-slate-800 text-amber-300"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M12 12a9 9 0 110 18v-1z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 dark:hover:bg-slate-800 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {isOpen && (
                <div className="lg:hidden bg-emerald-900 dark:bg-slate-950 max-h-[85vh] overflow-y-auto border-t border-emerald-700 dark:border-slate-800">
                    <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                        {menuItems.map((item, index) => (
                            <div key={index} className="block">
                                {item.dropdown ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-800 dark:hover:bg-slate-800 transition flex items-center justify-between"
                                        >
                                            <span>{item.name}</span>
                                            <svg
                                                className={`w-4 h-4 transform transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Mobile Sub-Links */}
                                        {activeDropdown === item.name && (
                                            <div className="pl-4 bg-emerald-950/50 dark:bg-slate-900 rounded-md mt-1 mb-2">
                                                {item.dropdown.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subItem.href}
                                                        onClick={closeMenu}
                                                        className="block px-3 py-2 text-sm text-emerald-100 dark:text-gray-300 hover:bg-emerald-800 dark:hover:bg-slate-800 hover:text-white rounded-md transition"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-800 dark:hover:bg-slate-800 transition"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Mobile Login Button */}
                        <div className="pt-4 px-3">
                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="block text-center w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-md shadow transition"
                            >
                                লগইন ড্যাশবোর্ড
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}