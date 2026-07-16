"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, GraduationCap, Phone, Menu, X, ChevronRight } from "lucide-react";

export default function BottomNavbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // আপনার দেওয়া সম্পূর্ণ menuItems অ্যারে
    const menuItems = [
        { name: "হোম", href: "/", icon: <Home className="w-5 h-5" /> },
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
                { name: "হিফজ বিভাগ", href: "/#hifz" },
                { name: "একাডেমিক বিভাগ", href: "/#academic" },
            ],
        },
        {
            name: "ভর্তি",
            isAdmission: true, 
            icon: <GraduationCap className="w-5 h-5" />,
            dropdown: [
                { name: "ভর্তির সময়", href: "/admission#timeline" },
                { name: "ভর্তি পরীক্ষা", href: "/admission#test" },
                { name: "ভর্তি প্রক্রিয়া", href: "/admission#process" },
                { name: "ভর্তি ফি", href: "/admission#fees" },
                { name: "ভর্তির শর্তাবলী", href: "/admission#terms" },
                { name: "অনলাইন ভর্তি ফরম", href: "/admission/form" },
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
        { name: "নোটিশ বোর্ড", href: "/notices", icon: <FileText className="w-5 h-5" /> },
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

    // মূল বারের জন্য গুরুত্বপূর্ণ ৪টি আইটেম (বাকিগুলো 'অন্যান্য' তে যাবে)
    const primaryItems = [
        { name: "হোম", href: "/", icon: <Home className="w-5.5 h-5.5" /> },
        { name: "ভর্তি ফরম", href: "/admission/form", icon: <GraduationCap className="w-5.5 h-5.5" /> },
        { name: "নোটিশ", href: "/notices", icon: <FileText className="w-5.5 h-5.5" /> },
        { name: "যোগাযোগ", href: "/contact", icon: <Phone className="w-5.5 h-5.5" /> },
    ];

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            {/* ১. মূল বটম নেভিগেশন বার (শুধু মোবাইল ও ট্যাবলেটের জন্য - md:hidden) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden pb-safe">
                <div className="flex justify-around items-center h-16">
                    {primaryItems.map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={idx} 
                                href={item.href} 
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                                    isActive ? "text-emerald-600 font-semibold" : "text-gray-500"
                                }`}
                            >
                                {item.icon}
                                <span className="text-[11px] mt-1 break-keep text-center">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* ৫ নম্বর বাটন: অন্যান্য (More Options) */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                            isMenuOpen ? "text-emerald-600 font-semibold" : "text-gray-500"
                        }`}
                    >
                        {isMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
                        <span className="text-[11px] mt-1">অন্যান্য</span>
                    </button>
                </div>
            </div>

            {/* ২. "অন্যান্য" বাটনের ড্রয়ার/বটম শিট মেনু */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity" onClick={() => setIsMenuOpen(false)}>
                    <div 
                        className="fixed bottom-16 left-0 right-0 max-h-[70vh] bg-gray-50 rounded-t-2xl overflow-y-auto p-4 shadow-2xl transition-transform"
                        onClick={(e) => e.stopPropagation()} // ড্রয়ারের ভেতর ক্লিক করলে যেন বন্ধ না হয়
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
                        <h3 className="text-center font-bold text-gray-700 mb-4 border-b pb-2 text-base">সব মেনু অপশন</h3>
                        
                        <div className="space-y-2">
                            {menuItems.map((item, idx) => {
                                // যে লিঙ্কগুলো অলরেডি মূল বারে আছে, সেগুলো ড্রপডাউন থেকে বাদ দিতে পারেন অথবা রাখতেও পারেন।
                                const hasDropdown = !!item.dropdown;

                                return (
                                    <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        {hasDropdown ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleDropdown(idx)}
                                                    className="w-full flex justify-between items-center p-3.5 text-left font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    <span className="text-sm">{item.name}</span>
                                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeDropdown === idx ? "rotate-90 text-emerald-600" : ""}`} />
                                                </button>
                                                
                                                {/* সাব-মেনু আইটেমসমূহ */}
                                                {activeDropdown === idx && (
                                                    <div className="bg-gray-50 border-t border-gray-100 divide-y divide-gray-200/50">
                                                        {item.dropdown.map((subItem, subIdx) => (
                                                            <Link
                                                                key={subIdx}
                                                                href={subItem.href}
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className="block p-3 pl-6 text-xs text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50"
                                                            >
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
                                                className="block p-3.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
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
