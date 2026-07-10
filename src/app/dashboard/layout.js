"use client";
import Sidebar from '@/components/dashboard/sidebar';
import React, { useState, useEffect } from 'react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    // ইসলামিক পরিবেশের সাথে সামঞ্জস্য রেখে রিয়েল-টাইম ঘড়ি ও বাংলা তারিখের ব্যবস্থা (ঐচ্ছিক কিন্তু প্রফেশনাল)
    useEffect(() => {
        const updateTime = () => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date();
            setCurrentTime(today.toLocaleDateString('bn-BD', options));
        };
        updateTime();
        const timer = setInterval(updateTime, 60000); // প্রতি মিনিটে আপডেট হবে
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen bg-[#f4f6f4] text-slate-800 antialiased font-sans w-full selection:bg-emerald-800 selection:text-white overflow-hidden">
            
            {/* ১. সাইডবার কম্পোনেন্ট (নতুন লোকেশন অনুযায়ী) */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* ২. মেইন কন্টেন্ট এরিয়া */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                
                {/* ৩. প্রফেশনাল টপ নেভিগেশন বার (সব স্ক্রিনের জন্য ফিক্সড) */}
                <header className="bg-white border-b border-emerald-900/10 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs flex-shrink-0">
                    
                    {/* বাম পাশ: মোবাইল টগল এবং মাদরাসার নাম */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 -ml-2 text-slate-600 hover:text-emerald-800 focus:outline-hidden lg:hidden transition-colors"
                            aria-label="Toggle Sidebar"
                        >
                            <span className="text-xl">☰</span>
                        </button>
                        
                        <div className="flex flex-col">
                            <h2 className="font-black text-sm sm:text-base text-emerald-900 tracking-wide lg:block hidden">
                                মারকাযি নিয়ন্ত্রণ বোর্ড
                            </h2>
                            <h2 className="font-black text-sm text-emerald-900 tracking-wide lg:hidden block">
                                আস-সালাম আইডিয়াল মাদরাসা
                            </h2>
                        </div>
                    </div>

                    {/* ডান পাশ: ইসলামিক ক্যালেন্ডার/তারিখ এবং প্রোফাইল কুইক অ্যাকশন */}
                    <div className="flex items-center gap-4">
                        {/* বর্তমান তারিখ (মোবাইলে হাইড থাকবে স্পেস বাঁচানোর জন্য) */}
                        <div className="hidden md:flex items-center gap-2 bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
                            <span>📅</span>
                            <span>{currentTime || "আজকের তারিখ"}</span>
                        </div>

                        {/* কুইক নোটিফিকেশন আইকন (ডামি হিসেবে রাখা, পরে ডাইনামিক করা যাবে) */}
                        <button className="relative p-2 text-slate-500 hover:text-emerald-800 transition-colors focus:outline-hidden" title="নোটিফিকেশন">
                            <span className="text-lg">🔔</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
                        </button>
                    </div>
                </header>

                {/* ৪. ড্যাশবোর্ড পেজের স্ক্রলযোগ্য কন্টেন্ট বডি */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8faf8] scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
                
            </div>
        </div>
    );
};

export default DashboardLayout;
