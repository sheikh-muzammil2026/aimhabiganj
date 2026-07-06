"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "student",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("পাসওয়ার্ড দুটি মিলছে না!");
            return;
        }
        console.log("Registration Data:", formData);
        // এখানে আপনার ব্যাকএন্ড সাইন-আপ API কল হবে
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800">

                {/* হেডার */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-800 text-white font-black flex items-center justify-center shadow-md border border-amber-400 text-lg">
                        AS
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-amber-400">
                        নতুন অ্যাকাউন্ট তৈরি করুন
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        আস-সালাম আইডিয়াল মাদ্রাসার ডিজিটাল পোর্টালে যুক্ত হোন
                    </p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-3">

                        {/* নাম ইনপুট */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পূর্ণ নাম (বাংলা অথবা ইংরেজি)
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="MD. Anik Hasan"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            />
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
                                placeholder="name@example.com"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            />
                        </div>

                        {/* রোল সিলেকশন */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                আপনি কোন রোলে যুক্ত হতে চান?
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            >
                                <option value="student">শিক্ষার্থী (Student)</option>
                                <option value="teacher">শিক্ষক (Teacher)</option>
                                <option value="parent">অভিভাবক (Parent)</option>
                            </select>
                        </div>

                        {/* পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পাসওয়ার্ড তৈরি করুন
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            />
                        </div>

                        {/* কনফার্ম পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পাসওয়ার্ডটি পুনরায় নিশ্চিত করুন
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                            />
                        </div>
                    </div>

                    {/* শর্তাবলী সম্মতি */}
                    <div className="flex items-start text-xs sm:text-sm">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-gray-900 dark:text-gray-300 leading-tight">
                            আমি মাদ্রাসার সমস্ত ডিজিটাল ব্যবহারের <Link href="/about#policies" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">নীতিমালা ও শর্তাবলী</Link> মেনে চলবো।
                        </label>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-slate-950 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition duration-150"
                        >
                            নিবন্ধন সম্পন্ন করুন (Register)
                        </button>
                    </div>
                </form>

                {/* লগইন লিংক */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        পূর্বেই অ্যাকাউন্ট তৈরি করা আছে?{" "}
                        <Link href="/login" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                            এখানে লগইন করুন
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}