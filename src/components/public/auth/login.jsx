"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "student", // ডিফল্ট রোল
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", formData);
        // এখানে আপনার ব্যাকএন্ড অথেনটিকেশন লজিক বা API কল হবে
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800">

                {/* হেডার ও লোগো */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-800 text-white font-black flex items-center justify-center shadow-md border border-amber-400 text-lg">
                        AS
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-amber-400">
                        অ্যাকাউন্টে লগইন করুন
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        আস-সালাম আইডিয়াল মাদ্রাসা ম্যানেজমেন্ট সিস্টেম
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">

                        {/* রোল সিলেকশন (মাস্টার প্ল্যান অনুযায়ী) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                আপনার রোল নির্বাচন করুন
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            >
                                <option value="student">শিক্ষার্থী (Student)</option>
                                <option value="teacher">শিক্ষক (Teacher)</option>
                                <option value="parent">অভিভাবক (Parent)</option>
                                <option value="admin">অ্যাডমিন (Admin)</option>
                            </select>
                        </div>

                        {/* ইমেইল ইনপুট */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                ইমেইল ঠিকানা
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@domain.com"
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            />
                        </div>

                        {/* পাসওয়ার্ড ইনপুট */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পাসওয়ার্ড
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            />
                        </div>
                    </div>

                    {/* রিমেম্বার মি ও পাসওয়ার্ড রিসেট */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-900 dark:text-gray-300">
                                মনে রাখুন
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Link>
                        </div>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-slate-950 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition duration-150"
                        >
                            প্রবেশ করুন (Login)
                        </button>
                    </div>
                </form>

                {/* রেজিস্টার লিংক */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        নতুন অ্যাকাউন্ট তৈরি করতে চান?{" "}
                        <Link href="/register" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                            এখানে রেজিস্ট্রেশন করুন
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}