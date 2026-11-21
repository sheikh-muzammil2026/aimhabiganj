"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import siteConfig from "@/config/siteConfig";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus({
        type: "error",
        text: "পাসওয়ার্ড রিসেট টোকেন অনুপস্থিত বা অবৈধ। পুনরায় রিসেট অনুরোধ করুন।",
      });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        text: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        text: "নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি।",
      });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "", text: "" });

      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          text:
            data.message ||
            "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগইন করতে পারেন।",
        });
      } else {
        setStatus({
          type: "error",
          text: data.message || "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।",
        });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setStatus({
        type: "error",
        text: "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!token && status.type !== "success") {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center border border-rose-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#0D47A1]">
          অবৈধ অথবা অনুপস্থিত লিংক
        </h3>
        <p className="text-xs sm:text-sm text-[#1E293B]">
          পাসওয়ার্ড রিসেট টোকেন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় রিসেট লিংক চেয়ে অনুরোধ করুন।
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0A3880] text-white text-xs font-bold shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>নতুন রিসেট লিংক অনুরোধ করুন</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {status.type === "success" ? (
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#2196F3]" />
          </div>
          <h3 className="text-lg font-bold text-[#0D47A1]">
            পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!
          </h3>
          <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
            {status.text}
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0A3880] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>লগইন পেজে যান</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-[#1E293B]">
            অনুগ্রহ করে আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড সেট করুন।
          </p>

          {status.text && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                status.type === "error"
                  ? "bg-rose-50 text-rose-800 border border-rose-200"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{status.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0D47A1] mb-1.5">
              নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                required
                minLength={6}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D47A1] mb-1.5">
              নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় টাইপ করুন"
                required
                minLength={6}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>পাসওয়ার্ড আপডেট হচ্ছে...</span>
                </>
              ) : (
                <span>পাসওয়ার্ড সংরক্ষণ করুন</span>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D47A1] hover:text-[#2196F3] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইনে ফিরে যান</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-container">
      <div className="site-container w-full flex flex-col justify-center items-center">
        <div className="w-full max-w-md text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D47A1] text-[#90CAF9] shadow-xl mb-4 transform -rotate-3 border border-[#90CAF9]/40">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D47A1] tracking-tight">
            নতুন পাসওয়ার্ড সেট করুন
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#1E293B]">
            {siteConfig.name.fullBn} পোর্টাল
          </p>
        </div>

        <div className="mt-8 w-full max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#90CAF9]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#2196F3] animate-spin" />
                  <span className="ml-2 text-xs font-semibold text-[#1E293B]">
                    লোড হচ্ছে...
                  </span>
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
