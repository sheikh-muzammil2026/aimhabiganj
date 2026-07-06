"use client";

import { useState } from "react";

export default function Dashboard() {
    // চার্ট ২-এর জন্য বাস্তবসম্মত ডাটা সেট
    const monthlyAnalysis = [
        { month: "Feb 2026", col: 35, exp: 22, colTxt: "৳৩৫,০০০.০০", expTxt: "৳২২,০০০.০০" },
        { month: "Mar 2026", col: 45, exp: 65, colTxt: "৳৪৫,০০০.০০", expTxt: "৳৬৫,০০০.০০" },
        { month: "Apr 2026", col: 50, exp: 85, colTxt: "৳৫০,০০০.০০", expTxt: "৳৮৫,০০০.০০" },
        { month: "May 2026", col: 8, exp: 12, colTxt: "৳৮,০০০.০০", expTxt: "৳১২,০০০.০০" },
        { month: "Jun 2026", col: 140, exp: 260, colTxt: "৳১,৫১,০৭৮.০০", expTxt: "৳২,৭৫,০৪৭.৪৫" },
        { month: "Jul 2026", col: 15, exp: 28, colTxt: "৳১৫,০০০.০০", expTxt: "৳২৮,০০০.০০" },
    ];

    // চার্ট ৩-এর জন্য বাস্তবসম্মত মাসিক বকেয়া ডাটা সেট
    const monthlyDues = [
        { label: "Jul 2025", height: 25, amount: "৳৮৫,৪০০.০০" },
        { label: "Aug 2025", height: 32, amount: "৳১,১০,০০০.০০" },
        { label: "Sep 2025", height: 28, amount: "৳৯৫,০০০.০০" },
        { label: "Oct 2025", height: 40, amount: "৳১,৪০,৫oo.০০" },
        { label: "Nov 2025", height: 45, amount: "৳১,৬০,০০০.০০" },
        { label: "Dec 2025", height: 55, amount: "৳১,৯৮,০০০.০০" },
        { label: "Jan 2026", height: 85, amount: "৳৩১৮,৪৭৬.৫০", isCurrent: true },
        { label: "Feb 2026", height: 60, amount: "৳২,১০,০০০.০০" },
        { label: "Mar 2026", height: 70, amount: "৳২,৪৫,০০০.০০" },
        { label: "Apr 2026", height: 50, amount: "৳১,৭৫,০০০.০০" },
        { label: "May 2026", height: 35, amount: "৳১,২০,০০০.০০" },
        { label: "Jun 2026", height: 90, amount: "৳৩,৪০,০০০.০০" },
        { label: "Jul 2026", height: 30, amount: "৳১০২,৩৫০.০০" }
    ];

    return (
        <div className="flex min-h-screen bg-[#f7f6f0] text-slate-800 antialiased font-sans w-full selection:bg-emerald-800 selection:text-white">
            
            {/* মেইন কন্টেন্ট উইন্ডো */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">

                {/* টপ মোবাইল ও জেনারেল নেভিগেশন বার (ইসলামিক ক্যালিগ্রাফিক ভাইবসহ প্রফেশনাল হেডার) */}
                <header className="bg-white border-b border-emerald-900/10 p-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🕌</span>
                        <div>
                            <h2 className="font-black text-base sm:text-lg text-[#064e3b] tracking-wide">আস-সালাম আইডিয়াল মাদ্রাসা</h2>
                            <p className="text-[10px] text-amber-600 font-semibold tracking-wider">হবিগঞ্জ, বাংলাদেশ</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <span>📞 ০১৮০৪৯০৯৫০০</span>
                        <span className="text-emerald-300">|</span>
                        <span>সাপোর্ট সময়: সকাল ১০টা - সন্ধ্যা ৭টা</span>
                    </div>
                </header>

                {/* ড্যাশবোর্ড বডি কন্টেনার */}
                <main className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">

                    {/* ফিল্টার গ্রুপ বার (অ্যাম্বার ও এমারেল্ড টোনড প্রফেশনাল ডিজাইন) */}
                    <div className="flex flex-wrap gap-2 items-center bg-white p-2.5 rounded-xl shadow-xs border border-emerald-900/5 text-xs sm:text-sm">
                        {["সর্বকাল", "বর্তমান", "আজ", "এই সপ্তাহ", "এই মাস", "এই বছর", "গত বছর"].map((tab, idx) => (
                            <button
                                key={idx}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${idx === 1 ? "bg-[#064e3b] text-amber-400 shadow-sm ring-1 ring-emerald-700" : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-[#064e3b]"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* প্রধান পরিসংখ্যান (৬টি গ্রিড কার্ড - ইসলামিক জ্যামিতিক বর্ডার টাচসহ) */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-2 border-l-4 border-amber-500 pl-2.5">
                            <span className="text-xs text-amber-500">✦</span> প্রধান পরিসংখ্যান
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: "মোট শিক্ষার্থী", value: "277", icon: "👥", color: "border-emerald-600" },
                                { label: "সর্বমোট সংগ্রহ", value: "৳১,৪১৭,১৯৭", icon: "💵", color: "border-emerald-600" },
                                { label: "সর্বমোট খরচ", value: "৳১,৪৬৩,৯৫৮", icon: "💸", color: "border-amber-500" },
                                { label: "বর্তমান ব্যালেন্স", value: "৳-৩০,৯৮১", icon: "💳", color: "border-red-500" },
                                { label: "মোট শিক্ষক", value: "18", icon: "🕌", color: "border-emerald-600" },
                                { label: "মোট স্টাফ", value: "23", icon: "👤", color: "border-emerald-600" }
                            ].map((card, i) => (
                                <div key={i} className={`bg-white p-4 rounded-xl border-t-4 ${card.color} shadow-xs text-center relative overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
                                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900 to-transparent pointer-events-none"></div>
                                    <span className="text-xl block mb-1 transform group-hover:scale-110 transition duration-200">{card.icon}</span>
                                    <p className="text-[11px] font-bold text-slate-500 truncate">{card.label}</p>
                                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">{card.value}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* সকল ফান্ড (১০টি গ্রিড কার্ড) */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-2 border-l-4 border-amber-500 pl-2.5">
                            <span className="text-xs text-amber-500">✦</span> সকল ফান্ড ডিরেক্টরি
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {[
                                { name: "ভর্তি ফান্ড", val: "৳৫১,৮৮৩" }, { name: "বেতন ফান্ড", val: "৳৩৭,燃৭৫" },
                                { name: "যাকাত ফান্ড", val: "৳১২,৫২০" }, { name: "এতিম ফান্ড", val: "৳২,২০০" },
                                { name: "জেনারেল ফান্ড", val: "৳-৪০,০১০" }, { name: "পরিবহন ফান্ড", val: "৳-৭১,৪৪৯" },
                                { name: "বিদ্যুৎ বিল", val: "৳১,৪০০" }, { name: "Canteen", val: "৳৯,০০০" },
                                { name: "বোর্ডিং", val: "৳৫০০" }, { name: "MAHFIL", val: "৳৫,০০০" }
                            ].map((fund, i) => (
                                <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs hover:border-emerald-600/30 transition text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 opacity-[0.01] bg-emerald-800 group-hover:opacity-[0.03] transition-all"></div>
                                    <p className="text-xs text-slate-500 font-bold truncate">{fund.name}</p>
                                    <h4 className="text-sm font-black text-[#064e3b] mt-1">{fund.val}</h4>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 📊 ড্যাশবোর্ড বিশ্লেষণ সেকশন */}
                    <section className="space-y-6 pt-2">
                        <div className="border-b border-emerald-900/10 pb-3">
                            <h2 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                                📜 ড্যাশবোর্ড বিশ্লেষণ ও গ্রাফিক্স রিপোর্ট
                            </h2>
                        </div>

                        {/* ১. চলতি মাস ক্লাস ভিত্তিক বাকি */}
                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-4 bg-linear-to-r from-red-50/80 to-transparent border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="bg-red-600 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shadow-xs">৳</span>
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-800">চলতি মাস ক্লাসভিত্তিক বকেয়া</h3>
                                        <p className="text-[10px] text-slate-500">জুলাই ২০২৬ • মোট বকেয়া রেকর্ড</p>
                                    </div>
                                </div>
                                <span className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-md font-black border border-red-100">৳১০২,৩৫০.০০</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                                            <th className="p-3 font-semibold">শ্রেণি</th>
                                            <th className="p-3 font-semibold text-center">শিক্ষার্থী সংখ্যা</th>
                                            <th className="p-3 font-semibold text-right">বকেয়া পরিমাণ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium">Nursery</td><td className="p-3 text-center">30</td><td className="p-3 text-right font-semibold text-slate-900">৳৪৩,২০০.০০</td></tr>
                                        <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium">One</td><td className="p-3 text-center">22</td><td className="p-3 text-right font-semibold text-slate-900">৳৩১,৩০০.০০</td></tr>
                                        <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium">Play</td><td className="p-3 text-center">19</td><td className="p-3 text-right font-semibold text-slate-900">৳২৭,৮৫০.০০</td></tr>
                                        <tr className="bg-emerald-50/30 font-bold text-[#064e3b]"><td className="p-3">সর্বমোট বকেয়া</td><td className="p-3 text-center">71</td><td className="p-3 text-right">৳১০২,৩৫০.০০</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* ২. মাস ভিত্তিক সংগ্রহ ও খরচ (রিয়েলিস্টিক ইন্টারেক্টিভ বার চার্ট) */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4 relative">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-[#064e3b] flex items-center gap-1.5">📊 মাসভিত্তিক সংগ্রহ ও খরচ</h3>
                                    <p className="text-[10px] text-slate-400">নির্দিষ্ট বারের ওপর মাউস (Hover) রাখলে ডাটা দেখতে পাবেন</p>
                                </div>
                                
                                {/* কাস্টম হোভার বার চার্ট */}
                                <div className="pt-10 pb-2 h-56 flex items-end justify-between gap-3 border-b border-slate-100 relative">
                                    {monthlyAnalysis.map((bar, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                                            
                                            {/* ডাইনামিক রিয়েলিস্টিক টুলটিপ (Hover-only) */}
                                            <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 pointer-events-none whitespace-nowrap min-w-[110px]">
                                                <p className="font-bold border-b border-slate-700 pb-1 mb-1 text-amber-400 text-center">{bar.month}</p>
                                                <p className="flex justify-between gap-2"><span>সংগ্রহ:</span> <span className="text-emerald-400 font-medium">{bar.colTxt}</span></p>
                                                <p className="flex justify-between gap-2"><span>খরচ:</span> <span className="text-amber-400 font-medium">{bar.expTxt}</span></p>
                                            </div>

                                            {/* বার গ্রাফ বার কন্টেনার */}
                                            <div className="w-full flex items-end justify-center gap-1 max-w-[45px] h-[85%] cursor-pointer">
                                                {/* সংগ্রহ বার */}
                                                <div style={{ height: `${(bar.col / 280) * 100}%` }} className="w-1/2 bg-emerald-600 rounded-t-xs transition-all duration-200 group-hover:bg-emerald-500 shadow-2xs"></div>
                                                {/* খরচ বার */}
                                                <div style={{ height: `${(bar.exp / 280) * 100}%` }} className="w-1/2 bg-amber-500 rounded-t-xs transition-all duration-200 group-hover:bg-amber-400 shadow-2xs"></div>
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">{bar.month.split(' ')[0]}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* চার্ট লেজেন্ড */}
                                <div className="flex justify-center gap-4 text-[11px] font-semibold pt-1">
                                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span>সংগ্রহ ফান্ড</span>
                                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span>ব্যয় বা খরচ</span>
                                </div>
                            </div>

                            {/* ৩. মাস ভিত্তিক বাকি (রিয়েলিস্টিক ইন্টারেক্টিভ বার চার্ট) */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-[#064e3b]">📈 মাসভিত্তিক বকেয়ার হিসাব (ট্র্যাকিং)</h3>
                                    <p className="text-[10px] text-slate-400">বিগত মাসগুলোর বকেয়া দেখতে বারের ওপর মাউস রাখুন</p>
                                </div>
                                
                                <div className="h-56 flex items-end justify-between gap-1 border-b border-slate-100 pt-8 relative">
                                    {monthlyDues.map((bar, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                            
                                            {/* ডাইনামিক হোভার টুলটিপ */}
                                            <div className="absolute bottom-full mb-1 bg-emerald-950 text-white text-[10px] p-2 rounded-md shadow-lg z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform translate-y-1 group-hover:translate-y-0 pointer-events-none whitespace-nowrap">
                                                <span className="text-amber-400 font-bold">{bar.label}:</span> {bar.amount}
                                            </div>

                                            {/* সিঙ্গেল মেম্বার বার */}
                                            <div 
                                                style={{ height: `${bar.height}%` }} 
                                                className={`w-full max-w-[14px] rounded-t-xs transition-all duration-200 cursor-pointer ${bar.isCurrent ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-400'}`}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                                    <span>Jul 2025</span>
                                    <span className="text-emerald-700 font-bold">Jan 2026 (Peak)</span>
                                    <span>Jul 2026</span>
                                </div>
                            </div>
                        </div>

                        {/* ৪. শ্রেণিভিত্তিক শিক্ষার্থীর সংখ্যা */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-[#064e3b] flex items-center gap-1.5">🎓 শ্রেণিভিত্তিক শিক্ষার্থী বিন্যাস</h3>
                                    <p className="text-[10px] text-slate-500">১৯টি সক্রিয় শ্রেণি • মোট ২৭৭ জন শিক্ষার্থী</p>
                                </div>
                                <span className="bg-emerald-50 text-[#064e3b] border border-emerald-100 text-[11px] px-2.5 py-1 rounded-lg font-bold">সর্বোচ্চ স্তর: Nursery (34)</span>
                            </div>

                            <div className="space-y-3.5">
                                {[
                                    { class: "Nursery", count: 34, max: 35, color: "bg-emerald-600", idx: 1 },
                                    { class: "Nahbemir (Seven)", count: 31, max: 35, color: "bg-teal-600", idx: 2 },
                                    { class: "Play", count: 31, max: 35, color: "bg-amber-600", idx: 3 },
                                    { class: "পঞ্চম শ্রেণি", count: 29, max: 35, color: "bg-slate-700", idx: 4 }
                                ].map((item, index) => (
                                    <div key={index} className="space-y-1 text-xs">
                                        <div className="flex justify-between items-center font-medium text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-[10px] border border-amber-200/40">{item.idx}</span>
                                                <span className="font-semibold text-slate-800">{item.class}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{item.count} জন</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                                            <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${(item.count / item.max) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* উপস্থিতি এবং হাজিরা ট্র্যাকিং কার্ড গ্রিড */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* শ্রেণীভিত্তিক উপস্থিতি */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                            <h3 className="text-xs sm:text-sm font-bold text-[#064e3b] flex items-center gap-2">📋 শ্রেণীভিত্তিক উপস্থিতি বিবরণী</h3>
                            <div className="space-y-2 text-xs">
                                {[
                                    { name: "Nursery", up: 0, lt: 0, an: 0, ch: 34 },
                                    { name: "Nahbemir (Seven)", up: 0, lt: 0, an: 0, ch: 31 },
                                    { name: "Play", up: 0, lt: 0, an: 0, ch: 31 }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50/60 rounded-lg border border-slate-100/80 hover:border-emerald-600/20 transition">
                                        <span className="font-bold text-slate-700">{row.name}</span>
                                        <div className="flex gap-1.5 text-[10px]">
                                            <span className="bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded border border-emerald-100">উপস্থিত: {row.up}</span>
                                            <span className="bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded border border-amber-100">দেরি: {row.lt}</span>
                                            <span className="bg-blue-50 text-blue-800 font-medium px-2 py-0.5 rounded border border-blue-100">ছুটি: {row.ch}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* প্রতিদিনের ক্লাস ভিত্তিক হাজিরা */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                            <h3 className="text-xs sm:text-sm font-bold text-[#064e3b] flex items-center gap-2">📅 দৈনিক ক্লাস ভিত্তিক হাজিরা স্ট্যাটাস</h3>
                            <div className="grid grid-cols-2 gap-3 text-center pt-2">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-2xl font-black block text-slate-400">0</span>
                                    <span className="text-[11px] font-semibold text-slate-500 mt-1 block">সম্পন্ন ক্লাস (0%)</span>
                                </div>
                                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                    <span className="text-2xl font-black block text-amber-700">21</span>
                                    <span className="text-[11px] font-bold text-amber-600 mt-1 block">বাকি ক্লাস (100%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* লিঙ্গ অনুপাত এবং শীর্ষ ফান্ড বাটন গ্রুপ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* লিঙ্গ অনুপাত */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                            <h3 className="text-xs sm:text-sm font-bold text-[#064e3b]">👫 লিঙ্গ অনুপাত ও ডেমোগ্রাফি</h3>
                            <div className="text-center pt-2">
                                <p className="text-2xl font-black text-[#064e3b]">২৭৭ <span className="text-xs font-semibold text-slate-500">জন সর্বমোট</span></p>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-4 flex p-[1px]">
                                    <div className="bg-emerald-600 h-full rounded-l-full" style={{ width: '38.6%' }}></div>
                                    <div className="bg-purple-500 h-full rounded-r-full" style={{ width: '61.4%' }}></div>
                                </div>
                                <div className="flex justify-between items-center text-xs mt-4 font-semibold">
                                    <span className="text-emerald-700">👦 ছাত্র: ১০৭ (৩৮.৬%)</span>
                                    <span className="text-purple-700">👧 ছাত্রী: ১৭০ (৬১.৪%)</span>
                                </div>
                            </div>
                        </div>

                        {/* ব্যালেন্স অনুযায়ী শীর্ষ ফান্ড */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                            <h3 className="text-xs sm:text-sm font-bold text-[#064e3b]">🏆 ব্যালেন্স অনুযায়ী শীর্ষ ৩টি সক্রিয় ফান্ড</h3>
                            <p className="text-xs font-bold text-slate-600">৳১০২,৩৭৮.০০ <span className="font-normal text-slate-400">অগ্রগামী রেভিনিউ</span></p>
                            <div className="space-y-3 pt-1">
                                {[
                                    { name: "ভর্তি ফান্ড", amt: "৳৫১,৮৮৩", prg: "50.7%", color: "bg-emerald-600" },
                                    { name: "বেতন ফান্ড", amt: "৳৩৭,৯৭৫", prg: "37.1%", color: "bg-emerald-600" },
                                    { name: "যাকাত ফান্ড", amt: "৳১২,৫২০", prg: "12.2%", color: "bg-amber-500" }
                                ].map((f, idx) => (
                                    <div key={idx} className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100">
                                        <div className="flex justify-between font-bold text-xs mb-1.5">
                                            <span className="text-slate-700">#{idx + 1} {f.name}</span>
                                            <span className="text-[#064e3b]">{f.amt}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div className={`${f.color} h-full rounded-full`} style={{ width: f.prg }}></div>
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
