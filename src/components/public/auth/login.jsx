"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function LoginPage() {
    const router = useRouter();
    
   
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password
            });

            if (data && !error) {
                toast.success("স্বাগতম! লগইন সফল হয়েছে।");

                // ডেটাবেস/অথ ক্লায়েন্ট থেকে ইউজারের রোল নিয়ে আসা (যেমন: data.user.role)
                // আপনার অথেন্টিকেশন লাইব্রেরি (যেমন: Better Auth, NextAuth, বা Supabase) অনুযায়ী এই 'data' অবজেক্টের স্ট্রাকচার আলাদা হতে পারে।
                const userRole = data?.user?.role; 

                // রোল অনুযায়ী আলাদা আলাদা ড্যাশবোর্ডে পাঠানো
                if (userRole === "admin") {
                    router.push('dashboard/admin');
                } else if (userRole === "teacher") {
                    router.push('dashboard/teacher');
                } else if (userRole === "student") {
                    router.push('dashboard/student');
                } else if (userRole === "parent") {
                    router.push('/dashboard/parent');
                } else {
                    router.push('/'); 
                }
            }
            
            if (error) {
                toast.error(error.message || "ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।");
            }
        } catch (err) {
            console.error("Authentication lifecycle crash:", err);
            toast.error("লগইন করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে।");
        } finally {
            setIsSubmitting(false);
        }
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
                        {/* রোল সিলেকশনের ড্রপডাউনটি এখান থেকে সম্পূর্ণ সরিয়ে দেওয়া হয়েছে */}

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

                        {/* পাসওয়ার্ড ইনপুট */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পাসওয়ার্ড
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

                    {/* রিমেম্বার মি ও পাসওয়ার্ড রিসেট */}
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
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Link>
                        </div>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-slate-950 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition duration-150 disabled:opacity-50"
                        >
                            {isSubmitting ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন (Login)"}
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
