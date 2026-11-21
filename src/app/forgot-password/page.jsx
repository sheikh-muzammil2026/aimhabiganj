"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import siteConfig from "@/config/siteConfig";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "", devUrl: "" });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus({
        type: "error",
        text: "দয়া করে একটি সঠিক নিবন্ধিত ইমেইল ঠিকানা প্রদান করুন।",
      });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "", text: "", devUrl: "" });

      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          text:
            data.message ||
            "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।",
          devUrl: data.resetUrl || "",
        });
      } else {
        setStatus({
          type: "error",
          text: data.message || "পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে।",
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setStatus({
        type: "error",
        text: "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="site-container w-full flex flex-col justify-center items-center">
        <div className="w-full max-w-md text-center px-4">
          {/* Logo / Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D47A1] text-[#90CAF9] shadow-xl mb-4 transform -rotate-3 border border-[#90CAF9]/40">
            <span className="text-3xl">🕌</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D47A1] tracking-tight">
            পাসওয়ার্ড ভুলে গেছেন?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#1E293B]">
            {siteConfig.name.fullBn} পোর্টাল
          </p>
        </div>

        <div className="mt-8 w-full max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#90CAF9]">
            {status.type === "success" ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#2196F3]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D47A1]">
                  রিসেট লিংক পাঠানো হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                  {status.text}
                </p>
                <div className="p-3 rounded-xl bg-[#E3F2FD]/60 border border-[#90CAF9] text-[11px] text-[#0D47A1]">
                  ইমেইলটি ইনবক্সে না পেলে স্প্যাম (Spam/Junk) ফোল্ডারটি চেক করুন। লিংকটির মেয়াদ ১ ঘণ্টা।
                </div>

                {status.devUrl && (
                  <div className="p-3 rounded-xl bg-slate-100 text-left text-xs font-mono break-all text-[#0D47A1]">
                    <span className="font-bold block text-slate-500 text-[10px]">ডেভেলপমেন্ট লিংক:</span>
                    <a href={status.devUrl} className="underline hover:text-[#2196F3]">
                      {status.devUrl}
                    </a>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0A3880] text-white text-xs font-bold shadow-md transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>লগইন পেজে ফিরে যান</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-xs text-[#1E293B]">
                  আপনার অ্যাকাউন্টে নিবন্ধিত ইমেইল ঠিকানাটি নিচে দিন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি সুরক্ষিত লিংক পাঠিয়ে দেব।
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
                    নিবন্ধিত ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>রিসেট লিংক পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>রিসেট লিংক পাঠান</span>
                      </>
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
        </div>
      </div>
    </div>
  );
}
