"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CreditCard,
  Printer,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Shield,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import StaffIdFront from "@/components/dashboard/staff/id-card/StaffIdFront";
import StaffIdBack from "@/components/dashboard/staff/id-card/StaffIdBack";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function StaffIdCardPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const sessionUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeSide, setActiveSide] = useState("both"); // "both" | "front" | "back"
  const [cardScale, setCardScale] = useState(1);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const email = sessionUser?.email || "";
      const query = email ? `?email=${encodeURIComponent(email)}` : "";
      const res = await fetch(`${API_BASE}/api/staff/me${query}`);
      const data = await res.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Staff profile fetch error for ID card:", err);
      toast.error("আইডি কার্ডের তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!sessionLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile();
    }
  }, [sessionLoading, fetchProfile]);

  const staff = profile || {
    fullName: sessionUser?.name || "নাম সংরক্ষিত নেই",
    name: sessionUser?.name || "নাম সংরক্ষিত নেই",
    designation: "পদবি সংরক্ষিত নেই",
    staffId: "—",
    email: sessionUser?.email || "—",
    phone: "—",
    bloodGroup: "—",
    dateOfBirth: "—",
    joiningDate: "—",
    address: "—",
    profileImage: sessionUser?.image || "",
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* ================= 1. TOP HEADER & ACTIONS (HIDDEN IN PRINT) ================= */}
      <div className="print:hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/staff"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-emerald-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ডে ফিরুন</span>
              </Link>
              <span className="text-xs text-emerald-300">•</span>
              <span className="text-xs text-amber-300 font-bold">
                ডিজিটাল আইডি কার্ড
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <CreditCard className="w-7 h-7 text-amber-400" />
              <span>স্টাফ অফিসিয়াল আইডি কার্ড</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/90">
              আস-সালাম আইডিয়াল মাদরাসা (AIM) কর্তৃক প্রদত্ত প্রাতিষ্ঠানিক ডিজিটাল পরিচিতিপত্র
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto">
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>আইডি কার্ড প্রিন্ট করুন</span>
            </button>

            <Link
              href="/dashboard/admin/staff-management/staff-id-card"
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
              title="অ্যাডমিন আইডি কার্ড জেনারেটর"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 2. VIEW CONTROLS (HIDDEN IN PRINT) ================= */}
      <div className="print:hidden bg-white dark:bg-[#0f172a] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">ভিউ মোড:</span>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveSide("both")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSide === "both"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              উভয় দিক (পাশাপাশি)
            </button>
            <button
              onClick={() => setActiveSide("front")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSide === "front"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              শুধুমাত্র সামনের দিক
            </button>
            <button
              onClick={() => setActiveSide("back")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSide === "back"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              শুধুমাত্র পেছনের দিক
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-500">
          <span>সাইজ স্কেল:</span>
          <button
            onClick={() => setCardScale(1)}
            className={`px-2.5 py-1 rounded-lg font-bold ${
              cardScale === 1
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            ১০০% (প্রকৃত)
          </button>
          <button
            onClick={() => setCardScale(1.15)}
            className={`px-2.5 py-1 rounded-lg font-bold ${
              cardScale === 1.15
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            ১১৫% (বড়)
          </button>
        </div>
      </div>

      {/* ================= 3. CARD DISPLAY AREA ================= */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs print:shadow-none print:border-none print:p-0">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Card Presentation Container */}
          <div
            className={`flex flex-wrap items-center justify-center gap-8 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 print:bg-white print:border-none print:p-0 ${
              cardScale !== 1 ? "py-10" : ""
            }`}
          >
            {/* Front Side */}
            {(activeSide === "both" || activeSide === "front") && (
              <div className="flex flex-col items-center space-y-2">
                <span className="print:hidden text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  সামনের দিক (Front)
                </span>
                <div className="drop-shadow-xl print:drop-shadow-none">
                  <StaffIdFront staff={staff} scale={cardScale} />
                </div>
              </div>
            )}

            {/* Back Side */}
            {(activeSide === "both" || activeSide === "back") && (
              <div className="flex flex-col items-center space-y-2">
                <span className="print:hidden text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  পেছনের দিক (Back)
                </span>
                <div className="drop-shadow-xl print:drop-shadow-none">
                  <StaffIdBack scale={cardScale} />
                </div>
              </div>
            )}
          </div>

          {/* Details Verification Table (Hidden in Print) */}
          <div className="print:hidden w-full max-w-3xl bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>কার্ডে মুদ্রিত ব্যক্তিগত তথ্য যাচাই</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">পূর্ণ নাম:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {staff.fullName}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">পদবী / পদ:</span>
                <span className="font-bold text-teal-700 dark:text-teal-400">
                  {staff.designation}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">স্টাফ আইডি নম্বর:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {staff.staffId}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">মোবাইল নম্বর:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {staff.phone}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">রক্তের গ্রুপ:</span>
                <span className="font-black text-rose-600">
                  {staff.bloodGroup}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">জন্ম তারিখ:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {staff.dateOfBirth}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                কোনো তথ্য সংশোধন বা আপডেট করতে চাইলে অনুগ্রহ করে প্রশাসনিক দফতরে যোগাযোগ করুন।
              </p>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs transition-colors shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
