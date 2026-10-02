"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // যেকোনো এরর ট্র্যাকিং সার্ভিসে লগ করার জন্য
        console.error("System Error Log:", error);
    }, [error]);

    // Safe string formatting for any error object or primitive
    const formatErrorMessage = () => {
        if (!error) return "সিস্টেম লোড হতে সাময়িক ত্রুটি দেখা দিয়েছে।";
        if (typeof error === "string") return error;
        if (typeof error?.message === "string") return error.message;
        if (typeof error === "object") {
            // If an object with keys { active, type, class } is received
            if ("active" in error || "type" in error || "class" in error) {
                return `বিভাগ: ${error.type || "N/A"}, শ্রেণি: ${error.class || "N/A"}, সক্রিয়: ${String(Boolean(error.active))}`;
            }
            // If an address object with keys { house, road, village, postOffice, thana, district } is received
            if ("village" in error || "district" in error || "thana" in error || "road" in error || "house" in error) {
                const parts = [
                    error.house ? `বাড়ি: ${error.house}` : null,
                    error.road ? `রোড: ${error.road}` : null,
                    error.village ? `গ্রাম: ${error.village}` : null,
                    error.postOffice ? `ডাকঘর: ${error.postOffice}` : null,
                    error.thana ? `থানা: ${error.thana}` : null,
                    error.district ? `জেলা: ${error.district}` : null,
                ].filter(Boolean);
                return parts.length > 0 ? parts.join(", ") : JSON.stringify(error);
            }
            try {
                return JSON.stringify(error, null, 2);
            } catch {
                return String(error);
            }
        }
        return String(error);
    };

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

                <p className="text-sm text-gray-500 leading-relaxed mb-4 dark:text-slate-400">
                    সিস্টেম লোড হতে সাময়িক ত্রুটি দেখা দিয়েছে। নিচের বাটনে ক্লিক করে আবার চেষ্টা করে দেখতে পারেন।
                </p>

                {/* Safe error message container - guaranteed primitive rendering */}
                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-left">
                        <div className="text-[11px] font-bold text-rose-800 dark:text-rose-300 mb-1">
                            ত্রুটির বিবরণ:
                        </div>
                        <pre className="text-xs font-mono text-rose-700 dark:text-rose-400 whitespace-pre-wrap break-all">
                            {formatErrorMessage()}
                        </pre>
                    </div>
                )}

                {/* হোম পেজের বাটন স্টাইল মেনটেইন করে রিলোড বাটন */}
                <button
                    onClick={() => reset()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-md shadow transition transform hover:-translate-y-0.5 text-sm md:text-base dark:bg-emerald-700 dark:hover:bg-emerald-600 cursor-pointer"
                >
                    আবার চেষ্টা করুন
                </button>
            </div>
        </div>
    );
}