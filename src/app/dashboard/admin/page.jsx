"use client";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-[#f4f3eb] text-slate-800 antialiased font-sans w-full selection:bg-emerald-800 selection:text-white">
            
            {/* মেইন কন্টেন্ট উইন্ডো */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">

                {/* টপ মোবাইল নেভিগেশন বার */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
                    <h2 className="font-bold text-sm text-[#064e3b]">আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ</h2>
                </header>

                {/* ড্যাশবোর্ড বডি কন্টেনার */}
                <main className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">

                    {/* মাদ্রাসা প্রোফাইল কার্ড (শীর্ষ ব্যানার - পাতার প্যাটার্নসহ) */}
                    <div className="bg-[#064e3b] text-white p-6 rounded-2xl border-b-4 border-amber-500 shadow-md relative overflow-hidden group">
                        {/* পাতার মতো ইসলামিক ওভারলে প্যাটার্ন ইফেক্ট */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-emerald-500 to-green-950 pointer-events-none"></div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-2">
                            <span className="bg-emerald-800 text-amber-400 text-xs px-3 py-1 rounded-full font-bold border border-emerald-600/50">নতুন আপডেট এসেছে</span>
                            <h1 className="text-xl sm:text-3xl font-black tracking-wide text-amber-50">আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ</h1>
                            <p className="text-xs sm:text-sm text-emerald-200/90 flex items-center gap-2">
                                <span>📞 ০১৮০৪৯০৯৫০০</span> 
                                <span className="text-emerald-400">|</span> 
                                <span>সাপোর্ট সময়: প্রতিদিন সকাল ১০টা থেকে সন্ধ্যা ७টা পর্যন্ত</span>
                            </p>
                        </div>
                    </div>

                    {/* ফিল্টার গ্রুপ বার */}
                    <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl shadow-sm border border-slate-200/80 text-xs sm:text-sm">
                        {["সর্বকাল", "বর্তমান", "আজ", "এই সপ্তাহ", "এই মাস", "এই বছর", "গত বছর"].map((tab, idx) => (
                            <button
                                key={idx}
                                className={`px-4 py-1.5 rounded-full font-medium transition ${idx === 1 ? "bg-[#064e3b] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                {tab}
                            </button>
                        ))}
                        
                    </div>

                    {/* প্রধান পরিসংখ্যান (৬টি গ্রিড কার্ড) */}
                    <section className="space-y-4">
                        <h2 className="text-base font-bold text-[#064e3b] flex items-center gap-2 border-l-4 border-amber-500 pl-2">
                            <span>🟢</span> প্রধান পরিসংখ্যান
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: "মোট শিক্ষার্থী", value: "277", icon: "👥" },
                                { label: "সর্বমোট সংগ্রহ", value: "৳১,৪১৭,১৯৭", icon: "💵" },
                                { label: "সর্বমোট খরচ", value: "৳১,৪৬৩,৯৫৮", icon: "💸" },
                                { label: "বর্তমান ব্যালেন্স", value: "৳-৩০,৯৮১", icon: "💳" },
                                { label: "মোট শিক্ষক", value: "18", icon: "🕌" },
                                { label: "মোট স্টাফ/কর্মচারী", value: "23", icon: "👤" }
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border-t-4 border-[#064e3b] shadow-xs text-center relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900 to-transparent pointer-events-none"></div>
                                    <span className="text-xl block mb-1 transform group-hover:scale-110 transition">{card.icon}</span>
                                    <p className="text-xs font-semibold text-slate-500 truncate">{card.label}</p>
                                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">{card.value}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* সকল ফান্ড (১০টি গ্রিড কার্ড) */}
                    <section className="space-y-4">
                        <h2 className="text-base font-bold text-[#064e3b] flex items-center gap-2 border-l-4 border-amber-500 pl-2">
                            <span>🟢</span> সকল ফান্ড
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {[
                                { name: "ভর্তি ফান্ড", val: "৳৫১,৮৮৩" }, { name: "বেতন ফান্ড", val: "৳৩৭,৯৭৫" },
                                { name: "যাকাত ফান্ড", val: "৳১২,৫২০" }, { name: "এতিম ফান্ড", val: "৳২,২০০" },
                                { name: "জেনারেল ফান্ড", val: "৳-৪০,০১০" }, { name: "পরিবহন ফান্ড", val: "৳-৭১,৪৪৯" },
                                { name: "বিদ্যুৎ বিল", val: "৳১,৪০০" }, { name: "Canteen", val: "৳৯,০০০" },
                                { name: "বোর্ডিং", val: "৳৫০০" }, { name: "MAHFIL", val: "৳৫,০০০" }
                            ].map((fund, i) => (
                                <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-800 to-transparent"></div>
                                    <p className="text-xs text-slate-500 font-bold">{fund.name}</p>
                                    <h4 className="text-sm font-black text-[#064e3b] mt-1">{fund.val}</h4>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ========================================================= */}
                    {/* 📊 ড্যাশবোর্ড বিশ্লেষণ সেকশন (নতুন ৪টি চার্ট/কার্ড এখানে যুক্ত করা হয়েছে) */}
                    {/* ========================================================= */}
                    <section className="space-y-6 pt-4">
                        <div className="border-b border-slate-300 pb-2">
                            <h2 className="text-lg font-black text-[#064e3b] flex items-center gap-2">
                                📜 ড্যাশবোর্ড বিশ্লেষণ
                            </h2>
                        </div>

                        {/* ১. চলতি মাস ক্লাস ভিত্তিক বাকি */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-red-50/60 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-red-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold">৳</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">চলতি মাস ক্লাসভিত্তিক বাকি</h3>
                                        <p className="text-[11px] text-slate-500">মাস: জুলাই ২০২৬ - মোট বাকি: ৳১০২,৩৫০.০০</p>
                                    </div>
                                </div>
                                <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-black">৳১০২,৩৫০.০০</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                            <th className="p-3 font-semibold">শ্রেণি</th>
                                            <th className="p-3 font-semibold text-center">শিক্ষার্থী</th>
                                            <th className="p-3 font-semibold text-right">বাকি</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        <tr className="hover:bg-slate-50/80"><td className="p-3 font-medium">Nursery</td><td className="p-3 text-center">30</td><td className="p-3 text-right font-mono">৳৪৩,২০০.০০</td></tr>
                                        <tr className="hover:bg-slate-50/80"><td className="p-3 font-medium">One</td><td className="p-3 text-center">22</td><td className="p-3 text-right font-mono">৳৩১,৩০০.০০</td></tr>
                                        <tr className="hover:bg-slate-50/80"><td className="p-3 font-medium">Play</td><td className="p-3 text-center">19</td><td className="p-3 text-right font-mono">৳২৭,৮৫০.০০</td></tr>
                                        <tr className="bg-emerald-50/40 font-bold text-[#064e3b]"><td className="p-3">মোট</td><td className="p-3 text-center">71</td><td className="p-3 text-right font-mono">৳১০২,৩৫০.০০</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ২. মাস ভিত্তিক সংগ্রহ ও খরচ (বার চার্ট রিপ্রেজেন্টেশন) */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900 to-transparent"></div>
                            <h3 className="text-sm font-bold text-[#064e3b] flex items-center gap-2">📊 মাসভিত্তিক সংগ্রহ ও খরচ (বার)</h3>
                            
                            {/* কাস্টম সিএসএস/টেইলউইন্ড বার চার্ট */}
                            <div className="pt-6 pb-2 h-56 flex items-end justify-between gap-2 border-b border-slate-200 relative">
                                {/* চার্ট টুলটিপ (যেমনটা ছবিতে দেখা যাচ্ছে) */}
                                <div className="absolute top-2 right-[15%] bg-slate-800 text-white text-[10px] p-2 rounded-lg shadow-md z-10 pointer-events-none">
                                    <p className="font-bold border-b border-slate-600 pb-0.5 mb-1">Jun 2026</p>
                                    <p className="text-emerald-400">সংগ্রহ: ৳১,৫১,০৭৮.০০</p>
                                    <p className="text-amber-400">খরচ: ৳২,৭৫,০৪৭.৪৫</p>
                                </div>

                                {[
                                    { month: "Feb 2026", col: 35, exp: 22 },
                                    { month: "Mar 2026", col: 45, exp: 65 },
                                    { month: "Apr 2026", col: 50, exp: 85 },
                                    { month: "May 2026", col: 8, exp: 12 },
                                    { month: "Jun 2026", col: 140, exp: 260, highlight: true },
                                    { month: "Jul 2026", col: 15, exp: 28 },
                                ].map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                        <div className="w-full flex items-end justify-center gap-1 max-w-[50px] h-[80%]">
                                            {/* সংগ্রহ বার */}
                                            <div style={{ height: `${(bar.col / 280) * 100}%` }} className="w-1/2 bg-teal-600 rounded-t-sm transition-all group-hover:opacity-90"></div>
                                            {/* খরচ বার */}
                                            <div style={{ height: `${(bar.exp / 280) * 100}%` }} className="w-1/2 bg-amber-500 rounded-t-sm transition-all group-hover:opacity-90"></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 whitespace-nowrap font-medium">{bar.month}</span>
                                    </div>
                                ))}
                            </div>
                            {/* চার্ট লেজেন্ড */}
                            <div className="flex justify-center gap-4 text-[11px] font-medium pt-1">
                                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-3 h-3 bg-teal-600 rounded-xs"></span>সংগ্রহ</span>
                                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-3 h-3 bg-amber-500 rounded-xs"></span>খরচ</span>
                            </div>
                        </div>

                        {/* ৩. মাস ভিত্তিক বাকি */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-[#064e3b]">📈 মাসভিত্তিক বাকি (বার)</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">বিগত মাসগুলোর মোট বকেয়া ট্র্যাকিং</p>
                            </div>
                            
                            <div className="h-40 flex items-end justify-between gap-1 border-b border-slate-200 pt-4 relative">
                                <div className="absolute top-0 right-[30%] bg-emerald-950 text-white text-[10px] p-1.5 rounded shadow">
                                    Jan 2026: ৳৩১৮,৪৭৬.৫০
                                </div>
                                {Array.from({ length: 20 }).map((_, i) => {
                                    // ইমেজের ট্রেন্ড অনুযায়ী বারের হাইট জেনারেট করা হয়েছে
                                    let heightPercent = 12;
                                    if (i > 8 && i < 14) heightPercent = (i - 7) * 15;
                                    if (i >= 14) heightPercent = 90 - (i - 13) * 12;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                                            <div 
                                                style={{ height: `${Math.max(heightPercent, 8)}%` }} 
                                                className={`w-full max-w-[12px] rounded-t-xs transition-all ${i === 13 ? 'bg-emerald-700' : 'bg-amber-500'}`}
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-mono px-1">
                                <span>Jul 2025</span>
                                <span>Jan 2026</span>
                                <span>Jul 2026</span>
                            </div>
                        </div>

                        {/* ৪. শ্রেণিভিত্তিক শিক্ষার্থীর সংখ্যা */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                    <h3 className="text-sm font-bold text-[#064e3b] flex items-center gap-1.5">🎓 শ্রেণিভিত্তিক শিক্ষার্থী সংখ্যা</h3>
                                    <p className="text-[11px] text-slate-500">১৯টি শ্রেণি - ২৭৭ জন মোট শিক্ষার্থী</p>
                                </div>
                                <span className="bg-emerald-50 text-[#064e3b] border border-emerald-100 text-xs px-2.5 py-1 rounded-lg font-bold">সর্বোচ্চ: Nursery (34)</span>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { class: "Nursery", count: 34, max: 35, color: "bg-emerald-600", idx: 1 },
                                    { class: "Nahbemir (Seven)", count: 31, max: 35, color: "bg-teal-700", idx: 2 },
                                    { class: "Ply", count: 31, max: 35, color: "bg-cyan-500", idx: 3 },
                                    { class: "পঞ্চম", count: 29, max: 35, color: "bg-sky-500", idx: 4 }
                                ].map((item, index) => (
                                    <div key={index} className="space-y-1 text-xs">
                                        <div className="flex justify-between items-center font-medium text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">{item.idx}</span>
                                                <span>{item.class}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className={item.color} style={{ width: `${(item.count / item.max) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* শ্রেণীভিত্তিক উপস্থিতি এবং ক্লাস ভিত্তিক হাজিরা (পূর্বের কোড ঠিক রাখা হয়েছে) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* শ্রেণীভিত্তিক উপস্থিতি */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#064e3b] flex items-center gap-2">👥 শ্রেণীভিত্তিক উপস্থিত ও অনুপস্থিত</h3>
                            <div className="space-y-2.5 text-xs">
                                {[
                                    { name: "Nursery", up: 0, lt: 0, an: 0, ch: 34 },
                                    { name: "Nahbemir (Seven)", up: 0, lt: 0, an: 0, ch: 31 },
                                    { name: "Ply", up: 0, lt: 0, an: 0, ch: 31 }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
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
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#064e3b]">🏆 ব্যালেন্স অনুযায়ী শীর্ষ ৩টি ফান্ড</h3>
                            <p className="text-xs font-bold text-slate-600">৳১০২,৩৭৮ <span className="font-normal text-slate-400">শীর্ষ ৩ ফান্ড মোট</span></p>
                            <div className="space-y-2 text-xs">
                                {[
                                    { name: "ভর্তি ফান্ড", amt: "৳৫১,৮৮৩", prg: "50.7%" },
                                    { name: "বেতন ফান্ড", amt: "৳৩৭,৯৭৫", prg: "37.1%" },
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
