"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col justify-center items-center px-6 transition-colors duration-300 dark:bg-slate-900 dark:text-gray-100">

            {/* ব্যাকগ্রাউন্ড মেহরাব স্টাইল বা ক্যালিগ্রাফি এফেক্ট এর জন্য কন্টেইনার */}
            <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-amber-500 transition-colors duration-300 dark:bg-slate-800 dark:border-emerald-600">

                {/* বড় ইসলামিক বা ট্র্যাডিশনাল জিওমেট্রিক মোটিফ আইকন */}
                <div className="text-6xl md:text-7xl mb-4 text-emerald-800 dark:text-emerald-400">
                    🕌
                </div>

                {/* ইউনিফর্ম হেডিং স্টাইল */}
                <h1 className="text-4xl font-black text-emerald-950 mb-2 dark:text-white">
                    ৪০৪
                </h1>
                <h2 className="text-xl font-bold text-slate-800 mb-4 dark:text-amber-400">
                    পৃষ্ঠাটি খুঁজে পাওয়া যায়নি!
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed mb-8 dark:text-slate-400">
                    দুঃখিত, আপনি যে লিংকটি খুঁজছেন তা এই মুহূর্তে উপলব্ধ নেই অথবা স্থানান্তরিত হয়েছে। দয়া করে সঠিক ইউআরএল চেক করুন।
                </p>

                {/* হোম পেজের ইউনিফর্ম বাটন স্টাইল */}
                <Link
                    href="/"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-md shadow transition transform hover:-translate-y-0.5 text-sm md:text-base dark:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                    প্রধান পাতায় ফিরে যান
                </Link>
            </div>
        </div>
    );
}