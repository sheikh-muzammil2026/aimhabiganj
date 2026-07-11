"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "student",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setError(""); // ইউজার আবার টাইপ করা শুরু করলে এরর মুছে যাবে
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // ফ্রন্টএন্ড পাসওয়ার্ড ম্যাচ চেক
        if (formData.password !== formData.confirmPassword) {
            setError("পাসওয়ার্ড দুটি মিলছে না!");
            return;
        }

        // Better Auth API কল
        await authClient.signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            // এখানে আপনি চাইলে অতিরিক্ত ডেটা (যেমন role) পাঠাতে পারেন যদি আপনার ডাটাবেজ স্কিমাতে তা ডিফাইন করা থাকে
            // metadata: { role: formData.role }, 
            // callbackURL: "/auth/login" 
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: () => {
                setLoading(false);
                router.push("/auth/login"); 
            },
            onError: (ctx) => {
                setLoading(false);
                setError(ctx.error.message || "নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            },
        });
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center transition-colors duration-200 px-4 py-12 sm:px-6 lg:px-8" 
            style={{backgroundImage: `url('/loginBackground.jpg')`}} // এখানে আপনার ছবির সঠিক পাথ দিন
        >
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

                {/* এরর মেসেজ ডিসপ্লে */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium text-center">
                        {error}
                    </div>
                )}

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

                        {/* পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পাসওয়ার্ড তৈরি করুন
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600"
                                >
                                    {showPassword ? "লুকান" : "देखুন"}
                                </button>
                            </div>
                        </div>

                        {/* কনফার্ম পাসওয়ার্ড */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                পাসওয়ার্ডটি পুনরায় নিশ্চিত করুন
                            </label>
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600"
                                >
                                    {showConfirmPassword ? "লুকান" : "देखুন"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* শর্তাবলী সম্মতি */}
                    <div className="flex items-start text-xs sm:text-sm pt-1">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="terms" className="ml-2 block text-gray-900 dark:text-gray-300 leading-tight cursor-pointer">
                            আমি মাদ্রাসার সমস্ত ডিজিটাল ব্যবহারের <Link href="/about#policies" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">নীতিমালা ও শর্তাবলী</Link> মেনে চলবো।
                        </label>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-slate-950 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md transition duration-150 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন (Register)"}
                        </button>
                    </div>
                </form>

                {/* লগইন লিংক */}
                <div className="text-center pt-2">
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
