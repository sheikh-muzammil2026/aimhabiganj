"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // লোগো ইমেজের জন্য ইমপোর্ট করা হলো
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // Better Auth ক্লায়েন্ট

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null);

    // Better Auth থেকে রিয়েল-টাইম সেশন এবং ইউজার ডেটা আনা
    const { data: session, isPending } = authClient.useSession();
    
    // সেশন থেকে ইউজার ডেটা প্রসেস করা
    const user = session?.user;
    const userRole = user?.role?.toLowerCase() || "user"; // ডিফল্ট 'user' রোল
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
            title: "শিক্ষা কার্যক্রম",
            icon: "📚",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "ক্লাস রুটিন", href: "/dashboard/admin/academics?section=class-routine" },
                { title: "পরীক্ষা রুটিন", href: "/dashboard/admin/academics?section=exam-routine" },
                { title: "পরীক্ষার ফলাফল (Results)", href: "/dashboard/admin/academics/results" },
            ]
        },
        {
            id: "admission",
            title: "ভর্তি ব্যবস্থাপনা",
            icon: "📝",
            roles: ["admin", "accountant"], 
            dropdown: [
                { title: "ভর্তির সময়", href: "/dashboard/admin/admission?section=timeline" },
                { title: "ভর্তি পরীক্ষা", href: "/dashboard/admin/admission?section=test" },
                { title: "ভর্তি প্রক্রিয়া", href: "/dashboard/admin/admission?section=process" },
                { title: "ভর্তি ফি", href: "/dashboard/admin/admission?section=fees" },
                { title: "সকল আবেদন", href: "/dashboard/admin/admission" },
            ]
        },
        {
            id: "gallery",
            title: "মিডিয়া গ্যালারি",
            icon: "🖼️",
            roles: ["admin"],
            dropdown: [
                { title: "গ্যালারি নিয়ন্ত্রণ", href: "/dashboard/admin/gallery" },
                { title: "ফটো এবং ভিডিও লিস্ট", href: "/dashboard/admin/gallery/list" },
            ]
        },
        {
            id: "smart-classroom",
            title: "স্মার্ট ক্লাসরুম",
            icon: "💻",
            roles: ["admin", "teacher"],
            dropdown: [
                { title: "লাইভ ক্লাস লিংক", href: "/dashboard/admin/smart-classroom/live" },
                { title: "রেকর্ডেড ক্লাস আপলোড", href: "/dashboard/admin/smart-classroom/recorded" },
                { title: "ই-বুক / লেকচার শিট", href: "/dashboard/admin/smart-classroom/ebooks" },
                { title: "অনলাইন এক্সাম কন্ট্রোল", href: "/dashboard/admin/smart-classroom/exam" },
            ]
        },
        { id: "attendance", title: "ডিজিটাল হাজিরা", icon: "📅", href: "/dashboard/attendance", roles: ["admin", "teacher"] },
        {
    id: "students",
    title: "শিক্ষার্থী ব্যবস্থাপনা",
    icon: "👥",
    roles: ["admin", "teacher"],
    dropdown: [
        { title: "সকল শিক্ষার্থী তালিকা", href: "/dashboard/admin/students" },
        { title: "নতুন শিক্ষার্থী ভর্তি/এন্ট্রি", href: "/dashboard/students/add" },
        { title: "শ্রেণী ও শাখা ভিত্তিক তালিকা", href: "/dashboard/admin/students/by-class" },
        { title: "শিক্ষার্থীর আইডি কার্ড জেনারেটর", href: "/dashboard/students/id-cards" },
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
        { title: "ফি ও তহবিল কনফিগার", href: "/dashboard/finance/fees-setup" }, // ১. এটিকে সবার উপরে আনা হয়েছে (যেহেতু এটি সেটিংস)
        { title: "ফি কালেকশন (রসিদ)", href: "/dashboard/finance/collect" },      // ২. আমরা যে পেজটি বানালাম (/collect) সেটির রাউট যুক্ত করা হলো
        { title: "রশিদ ইতিহাস/তালিকা", href: "/dashboard/finance/receipts" },   // আগের রসিদ পেজটিকে হিস্ট্রি হিসেবে ব্যবহার করা যাবে
        { title: "খরচ ও ভাউচার ট্র্যাকিং", href: "/dashboard/finance/expenses" },
        { title: "বেতন ও ভাতা (Payroll)", href: "/dashboard/finance/payroll" },
        { title: "সদকা ও অনুদান", href: "/dashboard/finance/donations" },
        { title: "জাকাত ফান্ড", href: "/dashboard/finance/zakat" },
        { title: "ঋণ ও বকেয়া", href: "/dashboard/finance/dues" },
        { title: "অ্যাকাউন্টিং রিপোর্টস", href: "/dashboard/finance/reports" },
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

    // রিয়েল ইউজার রোলের ওপর ভিত্তি করে ফিল্টারিং
    const allowedMenuItems = isPending ? [] : menuConfig.filter(item => item.roles.includes(userRole));

    // অ্যাক্টিভ সাব-মেনু থাকলে ড্রপডাউনটি অটোমেটিক ওপেন রাখার মেকানিজম
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

    const displayRoleName = (role) => {
        switch(role) {
            case "admin": return "Admin";
            case "teacher": return "Teacher";
            case "accountant": return "Accountant";
            case "parent": return "Parent";
            default: return role;
        }
    };

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

                {/* ব্র্যান্ড লোগো সেকশন */}
                <div className="p-4 border-b border-emerald-800/40 flex items-center justify-between bg-emerald-950/30">
                    <Link href="/" className="group flex items-center gap-2.5 focus:outline-hidden">
                        <div className="w-10 h-10 p-1 bg-emerald-900/30 rounded-xl group-hover:bg-amber-500/10 border border-emerald-700/30 transition-all duration-300 group-hover:scale-105 shadow-sm flex items-center justify-center overflow-hidden">
                            <Image 
                                src="/aimlogo1.png" 
                                alt="আস-সালাম আইডিয়াল মাদরাসা লোগো" 
                                width={36} 
                                height={36} 
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h2 className="font-black text-sm sm:text-base text-amber-400 tracking-wide">আস-সালাম আইডিয়াল মাদরাসা</h2>
                            <p className="text-[10px] text-emerald-300/80 font-medium tracking-wider">হবিগঞ্জ, বাংলাদেশ</p>
                        </div>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-emerald-300 hover:text-white text-base p-1">✕</button>
                </div>

                {/* মেইন মেনু আইটেমসমূহ */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scroll-smooth scrollbar-thin scrollbar-thumb-emerald-900/60 scrollbar-track-transparent">
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
                                <div key={item.id} className="space-y-1 transition-all duration-300">
                                    {hasDropdown ? (
                                        <button
                                            onClick={() => setOpenDropdown(isDropdownOpen ? null : item.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-300 group/btn
                                                ${isDropdownOpen 
                                                    ? "bg-emerald-900/80 text-amber-300 shadow-inner border-l-4 border-amber-400 pl-2" 
                                                    : "text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white hover:translate-x-1"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-base group-hover/btn:scale-110 transition-transform duration-300">{item.icon}</span>
                                                <span className="font-semibold tracking-wide text-left">{item.title}</span>
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
                                            ${isDropdownOpen ? "max-h-[500px] opacity-100 py-1" : "max-h-0 opacity-0"}`}>
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
                        })
                    )}
                </div>

                {/* ইউজার প্রোফাইল কার্ড */}
                {!isPending && session && (
                    <div className="p-3 border-t border-emerald-800/40 bg-emerald-950/40">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-emerald-900/30 border border-emerald-800/30 shadow-xs">
                            <div className="w-8 h-8 rounded-full bg-amber-400 text-[#043e30] flex items-center justify-center font-black text-sm shadow-inner transform hover:rotate-12 transition-transform duration-300 overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="uppercase">{avatarLetter}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-100 truncate tracking-wide">{userName}</h4>
                                <span className="inline-block text-[9px] font-extrabold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-widest mt-0.5">
                                    {displayRoleName(userRole)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
