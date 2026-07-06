"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // যেকোনো এরর ট্র্যাকিং সার্ভিসে লগ করার জন্য
        console.error("System Error Log:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col justify-center items-center px-6 transition-colors duration-300 dark:bg-slate-900 dark:text-gray-100">

            <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-rose-500 transition-colors duration-300 dark:bg-slate-800 dark:border-rose-600">

                <div className="text-5xl mb-4 animate-bounce">
                    ⚠️
                </div>

                {/* ইউনিফর্ম হেডিং স্টাইল */}
                <h2 className="text-xl font-black text-slate-900 mb-3 dark:text-white">
                    কোথাও কোনো সমস্যা হয়েছে!
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed mb-8 dark:text-slate-400">
                    সিস্টেম লোড হতে সাময়িক ত্রুটি দেখা দিয়েছে। নিচের বাটনে ক্লিক করে আবার চেষ্টা করে দেখতে পারেন।
                </p>

                {/* হোম পেজের বাটন স্টাইল মেনটেইন করে রিলোড বাটন */}
                <button
                    onClick={() => reset()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-md shadow transition transform hover:-translate-y-0.5 text-sm md:text-base dark:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                    আবার চেষ্টা করুন
                </button>
            </div>
        </div>
    );
}