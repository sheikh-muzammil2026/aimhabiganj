"use client";
import Sidebar from '@/components/dashboard/sidebar';
import React, { useState } from 'react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f7f6f0] text-slate-800 antialiased font-sans w-full selection:bg-emerald-800 selection:text-white overflow-hidden">
            {/* সাইডবার কম্পোনেন্ট */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* মেইন কন্টেন্ট এরিয়া */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* মোবাইল স্ক্রিনের জন্য হেডার ও মেনু বাটন */}
                <header className="lg:hidden bg-white border-b border-emerald-900/10 p-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-slate-600 hover:text-emerald-800 focus:outline-hidden"
                            aria-label="Toggle Sidebar"
                        >
                            ☰
                        </button>
                        <div>
                            <h2 className="font-black text-sm text-[#064e3b]">আস-সালাম মাদ্রাসা</h2>
                        </div>
                    </div>
                </header>

                {/* ড্যাশবোর্ড পেজের চাইল্ড কন্টেন্ট */}
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;