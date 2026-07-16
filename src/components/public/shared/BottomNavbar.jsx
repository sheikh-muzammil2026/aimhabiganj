"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ArrowRight
} from "lucide-react";

export default function BottomNavbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAcademicsOpen, setIsAcademicsOpen] = useState(false); // শিক্ষা কার্যক্রম ড্রয়ারের জন্য স্টেট
    const [activeDropdown, setActiveDropdown] = useState(null);

    // প্রতিটি ক্যাটাগরির জন্য অর্থপূর্ণ ইসলামিক/মডার্ন আইকন সেটআপ
    const menuItems = [
        { name: "হোম", href: "/", icon: <Home className="w-4 h-4" /> },
        {
            name: "আমাদের সম্পর্কে",
            icon: <Info className="w-4 h-4" />,
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
            icon: <BookOpen className="w-4 h-4" />,
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
            icon: <School className="w-4 h-4" />,
            dropdown: [
                { name: "হিফজ বিভাগ", href: "/#hifz" },
                { name: "একাডেমিক বিভাগ", href: "/#academic" },
            ],
        },
        {
            name: "ভর্তি",
            isAdmission: true, 
            icon: <GraduationCap className="w-4 h-4" />,
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
            icon: <Hotel className="w-4 h-4" />,
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
            icon: <MonitorPlay className="w-4 h-4" />,
            dropdown: [
                { name: "লাইভ ক্লাস", href: "/smart-classroom/live" },
                { name: "রেকর্ডেড ক্লাস", href: "/smart-classroom/recorded" },
                { name: "ই-বুক / লেকচার শিট", href: "/smart-classroom/ebooks" },
                { name: "অনলাইন এক্সাম", href: "/smart-classroom/exam" },
                { name: "কুইজ প্রতিযোগিতা", href: "/smart-classroom/quiz" },
            ],
        },
        { name: "নোটিশ বোর্ড", href: "/notices", icon: <FileText className="w-4 h-4" /> },
        { name: "গ্যালারি", href: "/gallery", icon: <Image className="w-4 h-4" /> },
        { name: "ফলাফল", href: "/results", icon: <GraduationCap className="w-4 h-4" /> },
        {
            name: "যোগাযোগ",
            icon: <PhoneCall className="w-4 h-4" />,
            dropdown: [
                { name: "যোগাযোগের তথ্য", href: "/contact" },
                { name: "অভিযোগ ও পরামর্শ", href: "/contact#feedback" },
            ],
        },
    ];

    // শিক্ষা কার্যক্রমের সাব-আইটেমগুলো সহজে ম্যাপ করার জন্য আলাদাকরণ
    const academicSubItems = menuItems.find(item => item.name === "শিক্ষা কার্যক্রম")?.dropdown || [];

    // মূল বারের আইটেমসমূহ (শিক্ষা কার্যক্রম ও ফলাফল যুক্ত)
    const primaryItems = [
        { name: "হোম", href: "/", icon: <Home className="w-[22px] h-[22px]" />, isLink: true },
        { name: "শিক্ষা কার্যক্রম", href: "/academics", icon: <BookOpen className="w-[22px] h-[22px]" />, isLink: false }, // এটি বাটনের মতো কাজ করবে
        { name: "ফলাফল", href: "/results", icon: <GraduationCap className="w-[22px] h-[22px]" />, isLink: true },
        { name: "নোটিশ", href: "/notices", icon: <FileText className="w-[22px] h-[22px]" />, isLink: true },
    ];

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            {/* ১. মূল বটম নেভিগেশন বার (শুধু মোবাইল ভিউ: md:hidden) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-[#ffffff] to-[#f4fbf7] border-t-2 border-emerald-600/30 shadow-[0_-8px_30px_rgb(6,95,70,0.08)] rounded-t-2xl md:hidden pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    {primaryItems.map((item, idx) => {
                        const isActive = item.isLink ? pathname === item.href : isAcademicsOpen;
                        
                        if (item.isLink) {
                            return (
                                <Link 
                                    key={idx} 
                                    href={item.href} 
                                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${
                                        isActive ? "text-emerald-700 font-bold" : "text-gray-500 hover:text-emerald-600"
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
                        } else {
                            // "শিক্ষা কার্যক্রম" বাটন ট্রিগার (সরাসরি পেজে না গিয়ে মেনু খুলবে)
                            return (
                                <button 
                                    key={idx} 
                                    onClick={() => {
                                        setIsMenuOpen(false); // অন্য ড্রয়ারটি বন্ধ করা
                                        setIsAcademicsOpen(!isAcademicsOpen);
                                    }}
                                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${
                                        isActive ? "text-emerald-700 font-bold" : "text-gray-500 hover:text-emerald-600"
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
                                </button>
                            );
                        }
                    })}

                    {/* ৫ নম্বর আকর্ষণীয় "অন্যান্য" বাটন */}
                    <button
                        onClick={() => {
                            setIsAcademicsOpen(false); // শিক্ষা কার্যক্রম ড্রয়ার বন্ধ করা
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${
                            isMenuOpen ? "text-amber-600 font-bold" : "text-gray-500 hover:text-emerald-600"
                        }`}
                    >
                        {isMenuOpen && (
                            <span className="absolute top-0 w-8 h-1 bg-amber-500 rounded-full" />
                        )}
                        <div className={`p-1.5 rounded-xl transition-all duration-300 ${isMenuOpen ? "bg-amber-50 text-amber-600 rotate-90" : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"}`}>
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </div>
                        <span className="text-[10.5px] mt-0.5 font-medium">অন্যান্য</span>
                    </button>
                </div>
            </div>

            {/* ২.১ "শিক্ষা কার্যক্রম" ডেডিকেটেড বটম শিট ড্রয়ার */}
            {isAcademicsOpen && (
                <div className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-xs md:hidden transition-all duration-300" onClick={() => setIsAcademicsOpen(false)}>
                    <div 
                        className="fixed bottom-16 left-0 right-0 max-h-[60vh] bg-[#fafdfb] rounded-t-3xl overflow-y-auto p-4 shadow-[0_-15px_40px_rgba(6,95,70,0.15)] border-t border-emerald-600/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-16 h-1.5 bg-emerald-200/60 rounded-full mx-auto mb-5" />
                        
                        <div className="flex items-center justify-between mb-4 border-b border-emerald-100 pb-3 px-1">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-emerald-700" />
                                <h3 className="font-bold text-emerald-950 text-base font-serif">শিক্ষা কার্যক্রম মেনু</h3>
                            </div>
                            {/* শিক্ষা কার্যক্রমের মূল পেজে যাওয়ার একটি ডিরেক্ট বাটন (যদি কেউ পুরো পেজ দেখতে চায়) */}
                            <Link 
                                href="/academics" 
                                onClick={() => setIsAcademicsOpen(false)}
                                className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
                            >
                                মূল পাতা <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* সাব-মেনু লিঙ্কগুলো ২ কলামের সুন্দর কার্ড ডিজাইনে গ্রিড আকারে সাজানো */}
                        <div className="grid grid-cols-2 gap-3 pb-6">
                            {academicSubItems.map((subItem, subIdx) => (
                                <Link
                                    key={subIdx}
                                    href={subItem.href}
                                    onClick={() => setIsAcademicsOpen(false)}
                                    className="flex flex-col p-3 bg-white border border-emerald-600/5 rounded-xl shadow-[0_2px_8px_rgba(6,95,70,0.02)] hover:bg-emerald-50/45 text-left group transition-all"
                                >
                                    <span className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                                        {subItem.name}
                                    </span>
                                    <span className="text-[10px] text-emerald-600/70 mt-1 flex items-center gap-0.5">
                                        পজিশন দেখুন →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ২.২ "অন্যান্য" বটম শিট ড্রয়ার (বাকি সব মেনুর জন্য) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-xs md:hidden transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    <div 
                        className="fixed bottom-16 left-0 right-0 max-h-[75vh] bg-[#fafdfb] rounded-t-3xl overflow-y-auto p-4 shadow-[0_-15px_40px_rgba(6,95,70,0.15)] border-t border-emerald-600/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-16 h-1.5 bg-emerald-200/60 rounded-full mx-auto mb-5" />
                        
                        <div className="flex items-center justify-center gap-2 mb-4 border-b border-emerald-100 pb-3">
                            <School className="w-5 h-5 text-emerald-700" />
                            <h3 className="text-center font-bold text-emerald-950 text-base font-serif">আস-সালাম মাদরাসা মেনু</h3>
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
                                                    className={`w-full flex justify-between items-center p-3.5 text-left font-medium transition-colors ${
                                                        isDropdownOpen ? "bg-emerald-50 text-emerald-800" : "text-gray-700 hover:bg-emerald-50/40"
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
                                                
                                                {/* সাব-মেনু আইটেমসমূহ */}
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
