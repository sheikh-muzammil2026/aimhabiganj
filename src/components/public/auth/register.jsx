"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { X } from "lucide-react";
import siteConfig from "@/config/siteConfig";

export default function RegisterPage({ onClose }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "parent",
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
    await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push("/login");
        },
        onError: (ctx) => {
          setLoading(false);
          setError(
            ctx.error.message ||
              "নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-[820px] bg-[#E3F2FD] flex items-center justify-center py-12 sm:py-16">
      <div className="site-container flex items-center justify-center w-full">
        <div className="relative max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#90CAF9] text-[#1E293B]">
          {/* হোম / ক্লোজ বাটন */}
          <Link
            href="/"
            onClick={() => {
              if (typeof onClose === "function") onClose();
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-[#0D47A1] transition-colors p-1.5 rounded-full hover:bg-[#E3F2FD] cursor-pointer"
            title="হোম পেজে ফিরে যান"
            aria-label="হোম পেজে ফিরে যান"
          >
            <X className="w-5 h-5" />
          </Link>

          {/* হেডার */}
          <div className="text-center">
            <Link
              href="/"
              onClick={() => {
                if (typeof onClose === "function") onClose();
              }}
              className="inline-block group focus:outline-none"
              title="হোম পেজে ফিরে যান"
            >
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white shadow-md border-2 border-[#0D47A1] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg">
                <Image
                  src={siteConfig.assets.logo}
                  alt={`${siteConfig.name.short} Logo`}
                  width={72}
                  height={72}
                  className="object-contain rounded-full"
                  priority
                />
              </div>
            </Link>
            <h2 className="mt-4 text-2xl font-black text-[#0D47A1]">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
              {siteConfig.name.bn} এর ডিজিটাল পোর্টালে যুক্ত হোন
            </p>
          </div>

          {/* এরর মেসেজ ডিসপ্লে */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs sm:text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* নাম ইনপুট */}
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1">
                  পূর্ণ নাম (বাংলা অথবা ইংরেজি)
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="MD. Anik Hasan"
                  className="w-full px-3.5 py-2 border border-[#90CAF9] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] text-sm"
                />
              </div>

              {/* ইমেইল ইনপুট */}
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1">
                  ইমেইল ঠিকানা
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 border border-[#90CAF9] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] text-sm"
                />
              </div>

              {/* রোল সিলেকশন */}
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1">
                  আপনি কোন রোলে যুক্ত হতে চান?
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-[#90CAF9] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] text-sm cursor-pointer"
                >
                  <option value="teacher">শিক্ষক</option>
                  <option value="parent">অভিভাবক</option>
                  <option value="staff">স্টাফ</option>
                </select>
              </div>

              {/* পাসওয়ার্ড */}
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1">
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
                    className="w-full px-3.5 py-2 border border-[#90CAF9] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] text-sm pr-12 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-[#2196F3] hover:text-[#0D47A1] cursor-pointer"
                  >
                    {showPassword ? "লুকান" : "দেখুন"}
                  </button>
                </div>
              </div>

              {/* কনফার্ম পাসওয়ার্ড */}
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1">
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
                    className="w-full px-3.5 py-2 border border-[#90CAF9] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] text-sm pr-12 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-[#2196F3] hover:text-[#0D47A1] cursor-pointer"
                  >
                    {showConfirmPassword ? "লুকান" : "দেখুন"}
                  </button>
                </div>
              </div>
            </div>

            {/* শর্তাবলী সম্মতি */}
            <div className="flex items-start text-xs pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 text-[#2196F3] focus:ring-[#2196F3] border-[#90CAF9] rounded cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-slate-700 leading-relaxed cursor-pointer"
              >
                আমি মাদ্রাসার সমস্ত ডিজিটাল ব্যবহারের{" "}
                <Link
                  href="/about#policies"
                  className="text-[#2196F3] font-bold hover:underline"
                >
                  নীতিমালা ও শর্তাবলী
                </Link>{" "}
                মেনে চলবো।
              </label>
            </div>

            {/* সাবমিট বাটন */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-bold rounded-xl text-white bg-[#2196F3] hover:bg-[#1976D2] shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন (Register)"}
              </button>
            </div>
          </form>

          {/* লগইন লিংক */}
          <div className="text-center pt-2 border-t border-[#90CAF9]/40">
            <p className="text-xs sm:text-sm text-slate-600">
              পূর্বেই অ্যাকাউন্ট তৈরি করা আছে?{" "}
              <Link
                href="/login"
                className="font-bold text-[#2196F3] hover:text-[#0D47A1] hover:underline ml-1"
              >
                এখানে লগইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
