"use client";

import { useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }) {
    const menuItems = [
        { title: "অফিসিয়াল ড্যাশবোর্ড", icon: "📊" },
        { title: "ভর্তি ব্যবস্থাপনা", icon: "📝" },
        { title: "সিস্টেম সেটিংস", icon: "⚙️" },
        { title: "ডিজিটাল হাজিরা", icon: "📅" },
        { title: "শিক্ষার্থী ব্যবস্থাপনা", icon: "👥" },
        { title: "একাডেমিক বিভাগ", icon: "🏫" },
        { title: "প্রমোশন এবং গ্র্যাজুয়েশন", icon: "🎓" },
        { title: "শিক্ষক ব্যবস্থাপনা", icon: "🕌" },
        { title: "প্রশাসনিক বিভাগ", icon: "🛡️" },
        { title: "হিসাব ও অর্থ বিভাগ", icon: "💰" },
        { title: "রশিদ ব্যবস্থাপনা", icon: "🧾" },
        { title: "সদকা এবং অনুদান বিভাগ", icon: "❤️" },
        { title: "ঋণ এবং বকেয়া ব্যবস্থাপনা", icon: "💳" },
        { title: "অ্যাকাউন্টিং রিপোর্টস", icon: "📈" },
        { title: "হোস্টেল ম্যানেজমেন্ট", icon: "🛏️" },
        { title: "অভিযোগ ও ফিডব্যাক", icon: "📨" },
        { title: "এতিম স্পন্সর বিভাগ", icon: "👦" },
        { title: "রুটিন ব্যবস্থাপনা", icon: "⏳" },
        { title: "নোটিশ এবং ঘোষণা", icon: "📢" },
        { title: "ডেভেলপার", icon: "💻" },
    ];

    return (
        <>
            {/* মোবাইল ব্যাকড্রপ ওভারলে */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen bg-[#064e3b] text-white w-72 transition-transform duration-300 z-50 overflow-y-auto flex flex-col border-r border-[#047857]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
            >
                {/* সাইডবার হেডার */}
                <div className="p-4 bg-[#022c22] border-b border-[#047857] flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🕌</span>
                        <span className="font-bold text-lg tracking-wide">ড্যাশবোর্ড</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-white hover:bg-white/10 p-1.5 rounded"
                    >
                        ✕
                    </button>
                </div>

                {/* স্ক্রিনশটের মতো কার্ভড বাটন ও বর্ডারসহ মেনু তালিকা */}
                <div className="p-3 space-y-2 flex-1">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-200 border text-left
                ${index === 0
                                    ? "bg-white text-[#064e3b] border-amber-500 rounded-xl shadow-md"
                                    : "bg-white/5 text-emerald-100 hover:bg-white/10 border-transparent rounded-lg"
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span className="truncate">{item.title}</span>
                        </button>
                    ))}
                </div>
            </aside>
        </>
    );
}