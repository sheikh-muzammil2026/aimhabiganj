// app/admission-guide/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdmissionGuidelinePage() {
    const [guideSettings, setGuideSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ড্যাশবোর্ডের এপিআই থেকে লাইভ সেটিংস ডাটা নিয়ে আসা
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admission-settings`);
                const data = await response.json();
                if (data.success && data.data) {
                    setGuideSettings(data.data);
                }
            } catch (error) {
                console.error("গাইডলাইন ডাটা লোড করতে সমস্যা:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // টেক্সট এরিয়া-র নিউলাইন (\n) থেকে লিস্ট আইটেম তৈরি করার হেল্পার ফাংশন
    const renderListFromText = (text) => {
        if (!text) return null;
        return text.split('\n').map((item, index) => {
            if (item.trim() === '') return null;
            return (
                <li key={index} className="flex items-start gap-2.5 text-gray-700 leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 mt-0.5">
                        {index + 1}
                    </span>
                    <span>{item}</span>
                </li>
            );
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="w-10 h-10 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-emerald-950">⏳ ভর্তি গাইডলাইন লোড হচ্ছে...</p>
            </div>
        );
    }

    if (!guideSettings) {
        return (
            <div className="text-center p-12 text-sm font-bold text-rose-900">
                ⚠️ দুঃখিত, এই মুহূর্তে কোনো ভর্তি গাইডলাইন পাওয়া যায়নি। পরে আবার চেষ্টা করুন Bel।
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 bg-gray-50/50 min-h-screen scroll-smooth">

            {/* হেডার সেকশন */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                    ভর্তির নির্দেশিকা
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                    নতুন শিক্ষাবর্ষে ভর্তি গাইডলাইন
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    আমাদের মাদরাসায় নতুন সেশনে ভর্তি সংক্রান্ত যাবতীয় সময়সূচী, ফি এবং নিয়মাবলী নিচে বিস্তারিত দেওয়া হলো।
                </p>
            </div>

            {/* ১. গুরুত্বপূর্ণ তারিখ ও সময়সূচী (id="timeline" যুক্ত করা হয়েছে) */}
            <div id="timeline" className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4 scroll-mt-20">
                <h3 className="text-base font-black text-emerald-950 flex items-center gap-2 border-b border-gray-100 pb-3">
                    📅 গুরুত্বপূর্ণ সময়সূচী (Timeline)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-emerald-800/80">ভর্তি ফরম বিতরণ শুরু</span>
                        <span className="text-base font-black text-gray-900 mt-2">{guideSettings.timeline_start || 'শীঘ্রই জানানো হবে'}</span>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-amber-800/80">ভর্তি পরীক্ষার তারিখ</span>
                        <span className="text-base font-black text-gray-900 mt-2">{guideSettings.timeline_exam || 'শীঘ্রই জানানো হবে'}</span>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-blue-800/80">ক্লাস শুরুর সম্ভাব্য তারিখ</span>
                        <span className="text-base font-black text-gray-900 mt-2">{guideSettings.timeline_class || 'শীঘ্রই জানানো হবে'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ২. ভর্তি প্রক্রিয়া (id="process" যুক্ত করা হয়েছে) */}
                <div id="process" className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4 scroll-mt-20">
                    <h3 className="text-base font-black text-emerald-950 flex items-center gap-2 border-b border-gray-100 pb-3">
                        ⚡ ভর্তি প্রক্রিয়া (How to Apply)
                    </h3>
                    <ul className="space-y-4 font-medium text-sm">
                        {guideSettings.process_details ? (
                            renderListFromText(guideSettings.process_details)
                        ) : (
                            <p className="text-gray-400 text-xs">কোনো প্রক্রিয়া উল্লেখ করা হয়নি।</p>
                        )}
                    </ul>
                </div>

                {/* ৩. ভর্তি পরীক্ষা সংক্রান্ত নিয়মাবলী (id="test" যুক্ত করা হয়েছে) */}
                <div id="test" className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4 scroll-mt-20">
                    <h3 className="text-base font-black text-emerald-950 flex items-center gap-2 border-b border-gray-100 pb-3">
                        📝 ভর্তি পরীক্ষা ও সিলেবাস
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 whitespace-pre-line leading-relaxed">
                            {guideSettings.test_details || 'পরীক্ষার সুনির্দিষ্ট সিলেবাস বা নিয়ম এখনো আপডেট করা হয়নি।'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ৪. ভর্তি ও মাসিক ফি স্ট্রাকচার (id="fees" যুক্ত করা হয়েছে) */}
            <div id="fees" className="bg-white border border-emerald-900/10 rounded-2xl shadow-xs overflow-hidden scroll-mt-20">
                <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
                    <h3 className="text-base font-black tracking-wide flex items-center gap-2">
                        💵 বিভাগভিত্তিক ফি স্ট্রাকচার (Fees Structure)
                    </h3>
                    <p className="text-[11px] text-emerald-200/90 mt-0.5">মাসিক এবং ভর্তি কালীন প্রদেয় ফি এর তালিকা</p>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs sm:text-sm text-gray-600 border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-black">
                                <th className="p-4">বিভাগের নাম</th>
                                <th className="p-4 text-center">ভর্তি ফি (এককালীন)</th>
                                <th className="p-4 text-center">মাসিক বেতন / ফি</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-bold text-gray-800">
                            {/* নূরানী ও নাজেরা */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-emerald-900">নূরানী ও নাজেরা বিভাগ</td>
                                <td className="p-4 text-center font-mono text-gray-900">{guideSettings.fee_noorani_adm || 'N/A'}/-</td>
                                <td className="p-4 text-center font-mono text-gray-600">{guideSettings.fee_noorani_monthly || 'N/A'}/-</td>
                            </tr>
                            {/* হিফজ বিভাগ */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-emerald-900">হিফজ বিভাগ (আবাসিক)</td>
                                <td className="p-4 text-center font-mono text-gray-900">{guideSettings.fee_hifz_adm || 'N/A'}/-</td>
                                <td className="p-4 text-center font-mono text-gray-600">{guideSettings.fee_hifz_monthly || 'N/A'}/-</td>
                            </tr>
                            {/* কিতাব বিভাগ */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-emerald-900">কিতাব বিভাগ</td>
                                <td className="p-4 text-center font-mono text-gray-900">{guideSettings.fee_kitab_adm || 'N/A'}/-</td>
                                <td className="p-4 text-center font-mono text-gray-600">{guideSettings.fee_kitab_monthly || 'N/A'}/-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ৫. ভর্তির শর্তাবলী ও রুলস (id="terms" যুক্ত করা হয়েছে) */}
            <div id="terms" className="bg-white border border-rose-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4 scroll-mt-20">
                <h3 className="text-base font-black text-rose-950 flex items-center gap-2 border-b border-rose-100 pb-3">
                    📜 ভর্তির শর্তাবলী ও রুলস
                </h3>
                <ul className="space-y-4 font-medium text-sm">
                    {guideSettings.terms ? (
                        renderListFromText(guideSettings.terms)
                    ) : (
                        <p className="text-gray-400 text-xs">কোনো শর্তাবলী উল্লেখ করা হয়নি।</p>
                    )}
                </ul>
            </div>

            {/* নতুন যুক্ত করা অনলাইন ভর্তি ফরম বাটন সেকশন */}
            <div className="pt-4 text-center">
                <Link
                    href="/admission/form"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm sm:text-base tracking-wide border border-emerald-950/20"
                >
                    <span>📝 অনলাইন ভর্তি আবেদন ফরম</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>

        </div>
    );
}