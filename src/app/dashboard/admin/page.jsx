"use client";

import { useState } from "react";
// import Sidebar from "./Sidebar";

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f7f6f0] text-slate-800 antialiased font-sans">
            {/* ১. সাইডবার ইনস্ট্যান্স */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* ২. মেইন কন্টেন্ট উইন্ডো */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">

                {/* টপ মোবাইল নেভিগেশন বার */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="bg-[#064e3b] text-white p-2 rounded-lg text-sm"
                    >
                        ☰ মেনু
                    </button>
                    <h2 className="font-bold text-sm text-[#064e3b]">এহরাহুল নূরানি হাফিজিয়া মাদ্রাসা</h2>
                </header>

                {/* ড্যাশবোর্ড বডি কন্টেনার */}
                <main className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">

                    {/* মাদ্রাসা প্রোফাইল কার্ড (শীর্ষ ব্যানার) */}
                    <div className="bg-[#064e3b] text-white p-6 rounded-2xl border-t-4 border-amber-500 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 space-y-2">
                            <span className="bg-emerald-700 text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">নতুন আপডেট এসেছে</span>
                            <h1 className="text-xl sm:text-2xl font-black">এহরাহুল নূরানি হাফিজিয়া প্রি-ক্যাডেট মাদ্রাসা</h1>
                            <p className="text-xs sm:text-sm text-emerald-200">📞 ০১৮০৪৯০৯৫০০ | সাপোর্ট সময়: প্রতিদিন সকাল ১০টা থেকে সন্ধ্যা ৭টা পর্যন্ত</p>
                        </div>
                    </div>

                    {/* ফিল্টার গ্রুপ বার */}
                    <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-xs sm:text-sm">
                        {["সর্বকাল", "বর্তমান", "আজ", "এই সপ্তাহ", "এই মাস", "এই বছর", "গত বছর"].map((tab, idx) => (
                            <button
                                key={idx}
                                className={`px-4 py-1.5 rounded-full font-medium transition ${idx === 1 ? "bg-[#064e3b] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                {tab}
                            </button>
                        ))}
                        <div className="ml-auto text-slate-500 font-mono text-xs">🔑 ১০৪ দিন বাকি (মেয়াদ শেষ: ২২ Oct, 2026)</div>
                    </div>

                    {/* প্রধান পরিসংখ্যান (৬টি গ্রিড কার্ড) */}
                    <section className="space-y-4">
                        <h2 className="text-base font-bold text-[#064e3b] border-l-4 border-amber-500 pl-2">🟢 প্রধান পরিসংখ্যান</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: "মোট শিক্ষার্থী", value: "277", icon: "👥" },
                                { label: "সর্বমোট সংগ্রহ", value: "৳১,৪১৭,১৯৭", icon: "💵" },
                                { label: "সর্বমোট খরচ", value: "৳১,৪৬৩,৯৫৮", icon: "💸" },
                                { label: "বর্তমান ব্যালেন্স", value: "৳-৩০,৯৮১", icon: "💳" },
                                { label: "মোট শিক্ষক", value: "18", icon: "🕌" },
                                { label: "মোট স্টাফ/কর্মচারী", value: "23", icon: "👤" }
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border-t-2 border-[#064e3b] shadow-xs text-center">
                                    <span className="text-lg block mb-1">{card.icon}</span>
                                    <p className="text-xs font-semibold text-slate-500 truncate">{card.label}</p>
                                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">{card.value}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* সকল ফান্ড (১০টি গ্রিড কার্ড) */}
                    <section className="space-y-4">
                        <h2 className="text-base font-bold text-[#064e3b] border-l-4 border-amber-500 pl-2">🟢 সকল ফান্ড</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {[
                                { name: "ভর্তি ফান্ড", val: "৳৫১,৮৮৩" }, { name: "বেতন ফান্ড", val: "৳৩৭,৯৭৫" },
                                { name: "যাকাত ফান্ড", val: "৳১২,৫২০" }, { name: "এতিম ফান্ড", val: "৳২,২০০" },
                                { name: "জেনারেল ফান্ড", val: "৳-৪০,০১০" }, { name: "পরিবহন ফান্ড", val: "৳-৭১,৪৪৯" },
                                { name: "বিদ্যুৎ বিল", val: "৳১,৪০০" }, { name: "Canteen", val: "৳৯,০০০" },
                                { name: "বোর্ডিং", val: "৳৫০০" }, { name: "MAHFIL", val: "৳৫,০০০" }
                            ].map((fund, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-center">
                                    <p className="text-xs text-slate-500 font-bold">{fund.name}</p>
                                    <h4 className="text-sm font-black text-[#064e3b] mt-1">{fund.val}</h4>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* শ্রেণীভিত্তিক উপস্থিতি এবং ক্লাস ভিত্তিক হাজিরা */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* শ্রেণীভিত্তিক উপস্থিতি */}
                        <div className="bg-white p-5 rounded-2xl border-t-2 border-[#064e3b] shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#064e3b] flex items-center gap-2">👥 শ্রেণীভিত্তিক উপস্থিত ও অনুপস্থিত</h3>
                            <div className="space-y-2.5 text-xs">
                                {[
                                    { name: "Nursery", up: 0, lt: 0, an: 0, ch: 34 },
                                    { name: "Nahbemir (Seven)", up: 0, lt: 0, an: 0, ch: 31 },
                                    { name: "Ply", up: 0, lt: 0, an: 0, ch: 31 }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">{row.name}</span>
                                        <div className="flex gap-1.5 font-mono text-[10px]">
                                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">উ: {row.up}</span>
                                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">দে: {row.lt}</span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">ছু: {row.ch}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* প্রতিদিনের ক্লাস ভিত্তিক হাজিরা */}
                        <div className="bg-white p-5 rounded-2xl border-t-2 border-[#064e3b] shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#064e3b] flex items-center gap-2">📅 প্রতিদিনের ক্লাস ভিত্তিক হাজিরা</h3>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xl font-bold block text-slate-800">0</span>
                                    <span className="text-xs text-slate-500">হাজিরা নেওয়া ক্লাস (0%)</span>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                                    <span className="text-xl font-bold block text-amber-700">21</span>
                                    <span className="text-xs text-amber-600">হাজিরা বাকি ক্লাস (100%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* লিঙ্গ অনুপাত এবং শীর্ষ ফান্ড বাটন গ্রুপ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* লিঙ্গ অনুপাত */}
                        <div className="bg-white p-5 rounded-2xl border-t-2 border-[#064e3b] shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#064e3b]">👫 লিঙ্গ অনুপাত (পাই)</h3>
                            <div className="text-center">
                                <p className="text-xl font-bold text-[#064e3b]">২৭৭ <span className="text-xs font-normal text-slate-500">শিক্ষার্থী</span></p>
                                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mt-3 flex">
                                    <div className="bg-teal-600 h-full" style={{ width: '38.6%' }}></div>
                                    <div className="bg-purple-500 h-full" style={{ width: '61.4%' }}></div>
                                </div>
                                <div className="flex justify-between items-center text-xs mt-4">
                                    <span className="text-teal-700 font-medium">👦 ছাত্র: ১০৭ (৩৮.৬%)</span>
                                    <span className="text-purple-700 font-medium">👧 ছাত্রী: ১৭০ (৬১.৪%)</span>
                                </div>
                            </div>
                        </div>

                        {/* ব্যালেন্স অনুযায়ী শীর্ষ ফান্ড */}
                        <div className="bg-white p-5 rounded-2xl border-t-2 border-[#064e3b] shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#064e3b]">🏆 ব্যালেন্স অনুযায়ী শীর্ষ ৩টি ফান্ড</h3>
                            <p className="text-xs font-bold text-slate-600">৳১০২,৩৭৮ <span className="font-normal text-slate-400">শীর্ষ ৩ ফান্ড মোট</span></p>
                            <div className="space-y-2 text-xs">
                                {[
                                    { name: "ভর্তি ফান্ড", amt: "৳৫১,৮৮৩", prg: "50.7%" },
                                    { name: "বেতন ফান্ড", amt: "৳३৭,৯৭৫", prg: "37.1%" },
                                    { name: "যাকাত ফান্ড", amt: "৳১২,৫২০", prg: "12.2%" }
                                ].map((f, idx) => (
                                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex justify-between font-semibold mb-1">
                                            <span>#{idx + 1} {f.name}</span>
                                            <span className="text-[#064e3b]">{f.amt}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-600 h-full" style={{ width: f.prg }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}