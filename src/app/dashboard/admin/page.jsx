/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import {
  Users,
  Clock,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  School,
  ExternalLink,
  BookOpen,
  FileText,
  UserCheck,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toBengaliDigits } from "@/lib/studentUtils";
import siteConfig from "@/config/siteConfig";

export const FALLBACK_AVATAR_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2394a3b8'><circle cx='50' cy='36' r='20'/><path d='M20 86c0-16.5 13.5-30 30-30s30 13.5 30 30z'/></svg>";

const BENGALI_DAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

export default function AdminDashboardOverview() {
  const printAreaRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // লাইভ সামারি ডাটা ফেচ করা
  const fetchDashboardSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/dashboard-summary");
      if (!res.ok) {
        throw new Error(`Failed to fetch summary: ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        throw new Error(json.message || "ডাটা পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Dashboard overview fetch error:", err);
      setError("ড্যাশবোর্ডের লাইভ ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardSummary();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDashboardSummary]);

  // প্রিন্ট হ্যান্ডলার (react-to-print)
  const handlePrint = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: `Madrasah-Executive-Summary-${data?.meta?.todayStr || "Today"}`,
    suppressErrors: true,
    onPrintError: (errorLocation, error) => {
      console.warn("Print error suppressed:", errorLocation, error);
    },
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  // তারিখ ফরম্যাটিং
  const today = new Date();
  const dayNameBn = BENGALI_DAYS[today.getDay()];
  const formattedDateBn = `${dayNameBn}, ${toBengaliDigits(today.getDate())} ${
    data?.meta?.currentMonthLabel || "নভেম্বর ২০২৬"
  }`;

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-[#f8faf9] min-h-screen space-y-6 font-bornomala text-slate-800 antialiased selection:bg-emerald-800 selection:text-white">
      {/* ----------------- ১. টপ এক্সিকিউটিভ হেডার ও অ্যাকশন বার ----------------- */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#00733a] to-[#043e30] flex items-center justify-center text-white shadow-sm shrink-0 border border-emerald-800/30">
            <School className="w-7 h-7 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#00733a]/10 text-[#00733a] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#00733a]/20">
                কেন্দ্রীয় প্রশাসনিক ড্যাশবোর্ড
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs font-bold text-slate-500 font-ubuntu">
                {formattedDateBn}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#043e30] tracking-tight mt-0.5 truncate">
              আস-সালাম আইডিয়াল মাদরাসা
            </h1>
            <p className="text-xs text-slate-500 font-medium truncate">
              দৈনিক প্রাতিষ্ঠানিক প্রতিবেদন, লাইভ পরিসংখ্যান এবং আর্থিক পর্যালোচনা
            </p>
          </div>
        </div>

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchDashboardSummary}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
            title="ডাটা রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={loading || !data || isPrinting}
            className="inline-flex items-center gap-2 bg-[#00733a] hover:bg-[#005e30] text-amber-300 hover:text-amber-200 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-[#00733a]"
          >
            <Printer className="w-4 h-4" />
            <span>দৈনিক সামারি প্রিন্ট (A4)</span>
          </button>
        </div>
      </div>

      {/* ----------------- কুইক অ্যাকশন শর্টকাট পিলস ----------------- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-black text-slate-500 shrink-0 uppercase tracking-wider pl-1">
          দ্রুত লিঙ্ক:
        </span>
        <Link
          href="/dashboard/admin/students-management"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-bold shrink-0 transition-colors shadow-2xs"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>শিক্ষার্থী অনুমোদন</span>
          {data?.students?.pendingTotal > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-black font-ubuntu ml-0.5">
              {toBengaliDigits(data.students.pendingTotal)}
            </span>
          )}
        </Link>
        <Link
          href="/dashboard/shared/academics/exam-results/exam/seat-plan/hall-map"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-bold shrink-0 transition-colors shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>আসন প্ল্যান ও হল ম্যাপ</span>
        </Link>
        <Link
          href="/dashboard/accountant/finance"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-bold shrink-0 transition-colors shadow-2xs"
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
          <span>হিসাব ও ভাউচার</span>
        </Link>
        <Link
          href="/dashboard/admin/teachers-management"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-bold shrink-0 transition-colors shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>হাজিরা রিপোর্ট</span>
        </Link>
        <Link
          href="/dashboard/admin/notice"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 font-bold shrink-0 transition-colors shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          <span>নোটিশ প্রকাশ</span>
        </Link>
      </div>

      {/* ----------------- এরর স্টেট ----------------- */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
          <button
            onClick={fetchDashboardSummary}
            className="underline font-bold hover:text-rose-950 cursor-pointer"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* ----------------- ২. ROW 1: ৪টি প্রধান KPI সামারি কার্ড ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI ১: সক্রিয় শিক্ষার্থী */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">মোট শিক্ষার্থী (সক্রিয়)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <SkeletonText width="60%" height="28px" />
          ) : (
            <div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 font-ubuntu tracking-tight">
                {toBengaliDigits(data?.students?.totalActiveApproved || 0)}{" "}
                <span className="text-sm font-bold text-slate-500 font-bornomala">জন</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="bg-emerald-50 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  অনুমোদিত ও সক্রিয়
                </span>
                {data?.students?.pendingTotal > 0 ? (
                  <span className="bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded font-ubuntu border border-amber-300">
                    অপেক্ষমাণ: {toBengaliDigits(data.students.pendingTotal)}
                  </span>
                ) : (
                  <span className="text-slate-400">০ অপেক্ষমাণ</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* KPI ২: আজকের স্টাফ হাজিরা */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">আজকের শিক্ষক/স্টাফ হাজিরা</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <SkeletonText width="70%" height="28px" />
          ) : (
            <div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 font-ubuntu tracking-tight">
                {toBengaliDigits(data?.staffFaculty?.attendance?.present || 0)}/
                {toBengaliDigits(data?.staffFaculty?.total || 0)}{" "}
                <span className="text-sm font-bold text-slate-500 font-ubuntu">
                  ({toBengaliDigits(data?.staffFaculty?.attendance?.percentage || 0)}%)
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-ubuntu">
                <span className="bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-200">
                  উপস্থিত: {toBengaliDigits(data?.staffFaculty?.attendance?.present || 0)}
                </span>
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                  অনুপস্থিত: {toBengaliDigits(data?.staffFaculty?.attendance?.absent || 0)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* KPI ৩: আজকের নেট ক্যাশফ্লো */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">আজকের নেট ক্যাশফ্লো</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <SkeletonText width="65%" height="28px" />
          ) : (
            <div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 font-ubuntu tracking-tight">
                ৳{toBengaliDigits(data?.finance?.today?.net?.toLocaleString("en-IN") || 0)}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-ubuntu font-bold">
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  আদায়: +৳{toBengaliDigits(data?.finance?.today?.income?.toLocaleString("en-IN") || 0)}
                </span>
                <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  ব্যয়: -৳{toBengaliDigits(data?.finance?.today?.expense?.toLocaleString("en-IN") || 0)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* KPI ৪: চলতি মাসের উদ্বৃত্ত / ব্যালেন্স */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">
              চলতি মাসের উদ্বৃত্ত ({data?.finance?.month?.monthLabel?.split(" ")[0] || "নভেম্বর"})
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <SkeletonText width="65%" height="28px" />
          ) : (
            <div>
              <div
                className={`text-2xl lg:text-3xl font-black font-ubuntu tracking-tight ${
                  (data?.finance?.month?.net || 0) >= 0 ? "text-[#00733a]" : "text-rose-600"
                }`}
              >
                {(data?.finance?.month?.net || 0) >= 0 ? "+" : ""}৳
                {toBengaliDigits(data?.finance?.month?.net?.toLocaleString("en-IN") || 0)}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-ubuntu font-bold">
                <span className="text-emerald-800">
                  আয়: ৳{toBengaliDigits(data?.finance?.month?.income?.toLocaleString("en-IN") || 0)}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-rose-800">
                  ব্যয়: ৳{toBengaliDigits(data?.finance?.month?.expense?.toLocaleString("en-IN") || 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------- ৩. ROW 2: ফিন্যান্সিয়াল চার্ট ও শ্রেণিভিত্তিক বণ্টন (2-Column Grid) ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): মাসিক আয় বনাম ব্যয় ভিজ্যুয়াল পর্যালোচনা */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-emerald-700">📊</span>
                  <span>মাসিক আয় বনাম ব্যয় পর্যালোচনা (বিগত মাসসমূহ)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  প্রতিষ্ঠানটির ক্যাশফ্লো ভারসাম্য এবং বাজেট সাশ্রয় বিশ্লেষণ
                </p>
              </div>
              <Link
                href="/dashboard/accountant/finance"
                className="text-xs font-bold text-[#00733a] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>লেজার দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4 py-8">
                <SkeletonText width="100%" height="24px" />
                <SkeletonText width="100%" height="24px" />
                <SkeletonText width="100%" height="24px" />
              </div>
            ) : data?.finance?.monthlyComparison?.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                কোনো মাসিক আর্থিক ডাটা পাওয়া যায়নি।
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {/* লেজেন্ড */}
                <div className="flex items-center justify-end gap-4 text-xs font-bold mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#00733a]"></span>
                    <span className="text-slate-700">আদায় (Income)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500"></span>
                    <span className="text-slate-700">ব্যয় (Expense)</span>
                  </div>
                </div>

                {/* বার লিস্ট */}
                {data?.finance?.monthlyComparison?.map((item) => {
                  const maxVal = Math.max(
                    ...data.finance.monthlyComparison.map((x) =>
                      Math.max(x.income, x.expense)
                    ),
                    1
                  );
                  const incomeWidth = Math.min(100, Math.round((item.income / maxVal) * 100));
                  const expenseWidth = Math.min(100, Math.round((item.expense / maxVal) * 100));

                  return (
                    <div key={item.monthKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{item.monthLabel}</span>
                        <span
                          className={`font-black font-ubuntu text-[11px] px-1.5 py-0.2 rounded ${
                            item.net >= 0
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                              : "bg-rose-50 text-rose-900 border border-rose-200"
                          }`}
                        >
                          উদ্বৃত্ত: {item.net >= 0 ? "+" : ""}৳
                          {toBengaliDigits(item.net.toLocaleString("en-IN"))}
                        </span>
                      </div>

                      {/* ইনকাম বার */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-[#00733a] h-full rounded-full transition-all duration-500"
                            style={{ width: `${incomeWidth}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold font-ubuntu text-emerald-950 w-24 text-right">
                          ৳{toBengaliDigits(item.income.toLocaleString("en-IN"))}
                        </span>
                      </div>

                      {/* এক্সপেন্স বার */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${expenseWidth}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold font-ubuntu text-slate-600 w-24 text-right">
                          ৳{toBengaliDigits(item.expense.toLocaleString("en-IN"))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>সরাসরি ক্যাশ ও ব্যাংক ভাউচার থেকে সমাহারকৃত</span>
            <span className="text-[#00733a] font-ubuntu">স্বয়ংক্রিয় হিসাব মিলকরণ সক্রিয়</span>
          </div>
        </div>

        {/* Right (5 Cols): শ্রেণিভিত্তিক শিক্ষার্থী বণ্টন (Play to Hifz) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-emerald-700">🏫</span>
                  <span>শ্রেণিভিত্তিক শিক্ষার্থী বণ্টন (প্লে থেকে হিফজ)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  সক্রিয় শিক্ষার্থীদের ক্রমভিত্তিক শ্রেণি বিন্যাস
                </p>
              </div>
              <span className="bg-emerald-50 text-[#00733a] text-xs font-black px-2 py-0.5 rounded-full border border-emerald-200 font-ubuntu">
                {toBengaliDigits(data?.students?.totalActiveApproved || 0)} জন
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 py-6">
                <SkeletonText width="100%" height="20px" />
                <SkeletonText width="100%" height="20px" />
                <SkeletonText width="100%" height="20px" />
                <SkeletonText width="100%" height="20px" />
              </div>
            ) : data?.students?.classDistribution?.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                কোনো শ্রেণির শিক্ষার্থী তথ্য পাওয়া যায়নি।
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {data?.students?.classDistribution?.map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-[#00733a]/10 text-[#00733a] font-black text-[10px] flex items-center justify-center font-ubuntu shrink-0">
                        {toBengaliDigits(idx + 1)}
                      </span>
                      <span className="font-bold text-slate-800 truncate">
                        {cls.className}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2 overflow-hidden hidden sm:block">
                        <div
                          className="bg-[#00733a] h-full rounded-full"
                          style={{ width: `${cls.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 font-ubuntu text-[11px] min-w-[55px] text-center">
                        {toBengaliDigits(cls.count)} জন
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/dashboard/admin/students-management"
              className="text-[#00733a] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>সকল শিক্ষার্থীর বিস্তারিত তালিকা দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ----------------- ৪. ROW 3: শিক্ষক হাজিরা স্ন্যাপশট ও সাম্প্রতিক আর্থিক ভাউচার ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 Cols): শিক্ষক ও স্টাফ হাজিরা স্ন্যাপশট */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-emerald-700">⏱️</span>
                  <span>শিক্ষক ও স্টাফ হাজিরা স্ন্যাপশট</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {data?.staffFaculty?.isUsingRecentAttendanceFallback
                    ? "আজকের এন্ট্রি না থাকায় সর্বশেষ কর্মদিবসের উপস্থিতি তালিকা"
                    : "আজকের লাইভ প্রবেশ হাজিরা ও সময়ানুবর্তিতা"}
                </p>
              </div>
              <Link
                href="/dashboard/admin/teachers-management"
                className="text-xs font-bold text-[#00733a] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>সম্পূর্ণ তালিকা</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-6">
                <SkeletonText width="100%" height="30px" />
                <SkeletonText width="100%" height="30px" />
                <SkeletonText width="100%" height="30px" />
              </div>
            ) : data?.staffFaculty?.todayRecords?.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                আজকের দিনে এখনও কোনো উপস্থিতি রেকর্ড সম্পন্ন হয়নি।
              </div>
            ) : (
              <div className="space-y-2">
                {data?.staffFaculty?.todayRecords?.map((rec, i) => {
                  const checkInFormatted = rec.checkInTime
                    ? new Date(rec.checkInTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—";

                  const isLate = rec.checkInStatus === "Late";

                  return (
                    <div
                      key={rec._id || i}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                          👤
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 truncate">
                            {rec.teacherName || rec.staffName || "শিক্ষক/স্টাফ"}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-ubuntu">
                            {rec.date ? toBengaliDigits(rec.date) : ""}{" "}
                            {rec.teacherId ? `• আইডি: ${toBengaliDigits(rec.teacherId)}` : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-ubuntu text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {toBengaliDigits(checkInFormatted)}
                        </span>
                        <span
                          className={`font-black text-[10px] px-2 py-0.5 rounded ${
                            isLate
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-emerald-100 text-emerald-950 border border-emerald-300"
                          }`}
                        >
                          {isLate ? "বিলম্বে (Late)" : "উপস্থিত"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>মোট অনুষদ: {toBengaliDigits(data?.staffFaculty?.total || 0)} জন</span>
            <span className="text-emerald-700 font-ubuntu">
              হাজিরা শতকরা: {toBengaliDigits(data?.staffFaculty?.attendance?.percentage || 0)}%
            </span>
          </div>
        </div>

        {/* Right (6 Cols): সাম্প্রতিক আয় ও ব্যয় ভাউচার তালিকা */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-emerald-700">🧾</span>
                  <span>সাম্প্রতিক আয় ও ব্যয় ভাউচার ট্রানজেকশন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  সর্বশেষ নিবন্ধিত আর্থিক জমা ও খরচসমূহের সংক্ষিপ্তসার
                </p>
              </div>
              <Link
                href="/dashboard/accountant/finance"
                className="text-xs font-bold text-[#00733a] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>সকল ভাউচার</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-6">
                <SkeletonText width="100%" height="30px" />
                <SkeletonText width="100%" height="30px" />
                <SkeletonText width="100%" height="30px" />
              </div>
            ) : data?.finance?.recentTransactions?.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                কোনো সাম্প্রতিক আর্থিক লেনদেন পাওয়া যায়নি।
              </div>
            ) : (
              <div className="space-y-2">
                {data?.finance?.recentTransactions?.map((tx) => {
                  const isIncome = tx.type === "income";

                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                            isIncome
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 truncate">
                            {tx.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-ubuntu">
                            {tx.id} • {tx.category} • {toBengaliDigits(tx.date)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`font-black font-ubuntu text-xs sm:text-sm block ${
                            isIncome ? "text-[#00733a]" : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}৳{toBengaliDigits(tx.amount.toLocaleString("en-IN"))}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold">
                          {isIncome ? "জমা (আয়)" : "খরচ (ব্যয়)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>নিবন্ধিত সক্রিয় হিসাব বই</span>
            <Link
              href="/dashboard/accountant/finance"
              className="text-[#00733a] hover:underline"
            >
              নতুন ভাউচার যুক্ত করুন →
            </Link>
          </div>
        </div>
      </div>

      {/* ----------------- ৫. অফ-স্ক্রিন প্রিন্ট এলিমেন্ট (A4 Portrait Executive Summary) ----------------- */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          overflow: "hidden",
        }}
      >
        <div ref={printAreaRef}>
          {data && (
            <ExecutivePrintSummarySheet
              data={data}
              formattedDateBn={formattedDateBn}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// A4 Portrait এক্সিকিউটিভ প্রিন্ট সামারি টেমপ্লেট কম্পোনেন্ট
// -------------------------------------------------------------
function ExecutivePrintSummarySheet({ data, formattedDateBn }) {
  return (
    <div className="font-bornomala text-slate-900 bg-white p-0">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            @media print {
              html, body {
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
                color: #000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-family: 'Bornomala', 'Ubuntu Sans', sans-serif !important;
              }
              .exec-sheet {
                width: 194mm !important;
                height: 278mm !important;
                max-height: 280mm !important;
                margin: 0 auto !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                overflow: hidden !important;
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
            }
          `,
        }}
      />

      <div className="exec-sheet w-[194mm] h-[278mm] mx-auto p-0 flex flex-col justify-between overflow-hidden bg-white">
        {/* ১. প্রাতিষ্ঠানিক হেডার */}
        <div className="border-b-2 border-[#00733a] pb-2 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-emerald-900/30">
              <img
                src={siteConfig.assets.logo}
                alt={`${siteConfig.name.short} Logo`}
                width={56}
                height={56}
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-[1.05]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                }}
              />
            </div>

            <div className="flex-1 text-center min-w-0">
              <h2 className="text-xl font-black text-[#043e30] leading-tight">
                {siteConfig.name.bn}
              </h2>
              <p className="text-[10px] text-slate-600 font-bold">
                {siteConfig.address.bn}
              </p>
              <div className="inline-block bg-[#00733a] text-amber-300 font-black text-xs px-3 py-0.5 rounded-full mt-1 font-ubuntu shadow-2xs">
                দৈনিক প্রশাসনিক ও আর্থিক সারসংক্ষেপ (Executive Summary)
              </div>
            </div>

            <div className="text-right shrink-0 space-y-0.5 text-[9px] text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-emerald-950">
                {formattedDateBn}
              </div>
              <div className="font-ubuntu font-bold">
                শিক্ষাবর্ষ: {toBengaliDigits(data.meta.academicYear)}
              </div>
            </div>
          </div>
        </div>

        {/* ২. প্রধান KPI মেট্রিক্স (৪টি কার্ড) */}
        <div className="grid grid-cols-4 gap-2 my-2 flex-shrink-0 text-center">
          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] font-bold text-slate-500 block">মোট শিক্ষার্থী</span>
            <strong className="text-base font-black text-[#00733a] font-ubuntu">
              {toBengaliDigits(data.students.totalActiveApproved)} জন
            </strong>
            <span className="text-[7.5px] text-slate-400 block">সক্রিয় ভর্তি</span>
          </div>

          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] font-bold text-slate-500 block">আজকের স্টাফ হাজিরা</span>
            <strong className="text-base font-black text-slate-800 font-ubuntu">
              {toBengaliDigits(data.staffFaculty.attendance.present)}/{toBengaliDigits(data.staffFaculty.total)}
            </strong>
            <span className="text-[7.5px] text-slate-400 block font-ubuntu">
              {toBengaliDigits(data.staffFaculty.attendance.percentage)}% উপস্থিতি
            </span>
          </div>

          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] font-bold text-slate-500 block">আজকের নেট ক্যাশফ্লো</span>
            <strong className="text-base font-black text-[#00733a] font-ubuntu">
              ৳{toBengaliDigits(data.finance.today.net.toLocaleString("en-IN"))}
            </strong>
            <span className="text-[7.5px] text-slate-400 block font-ubuntu">
              আদায়: ৳{toBengaliDigits(data.finance.today.income)} | ব্যয়: ৳{toBengaliDigits(data.finance.today.expense)}
            </span>
          </div>

          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] font-bold text-slate-500 block">চলতি মাসের উদ্বৃত্ত</span>
            <strong className="text-base font-black text-[#00733a] font-ubuntu">
              ৳{toBengaliDigits(data.finance.month.net.toLocaleString("en-IN"))}
            </strong>
            <span className="text-[7.5px] text-slate-400 block font-ubuntu">
              আয়: ৳{toBengaliDigits(data.finance.month.income)}
            </span>
          </div>
        </div>

        {/* ৩. ২-কলামের মূল বডি (শ্রেণি বিন্যাস ও সাম্প্রতিক লেনদেন) */}
        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 my-1">
          {/* বাম কলাম: শ্রেণিভিত্তিক শিক্ষার্থী তালিকা */}
          <div className="border border-slate-300 rounded-lg p-2.5 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-black text-slate-800 border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
                <span>শ্রেণিভিত্তিক শিক্ষার্থী শক্তি</span>
                <span className="font-ubuntu text-[10px] text-slate-500">
                  মোট: {toBengaliDigits(data.students.totalActiveApproved)} জন
                </span>
              </h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px]">
                {data.students.classDistribution.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-slate-100 pb-0.5"
                  >
                    <span className="font-bold text-slate-700 truncate">{c.className}:</span>
                    <strong className="font-ubuntu text-slate-900">
                      {toBengaliDigits(c.count)} জন
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[8.5px] text-slate-600 mt-2">
              <strong>একাডেমিক সেশন:</strong> {data.academics.activeExam} • সর্বমোট প্রকাশিত পরীক্ষার নম্বর:{" "}
              {toBengaliDigits(data.academics.totalMarksPublished)} টি
            </div>
          </div>

          {/* ডান কলাম: সাম্প্রতিক ভাউচার ও ট্রানজেকশন তালিকা */}
          <div className="border border-slate-300 rounded-lg p-2.5 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-black text-slate-800 border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
                <span>সাম্প্রতিক আর্থিক লেনদেন তালিকা</span>
                <span className="text-[9px] text-slate-400">সর্বশেষ ৭টি</span>
              </h4>
              <div className="space-y-1 text-[9px]">
                {data.finance.recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b border-slate-100 pb-0.5"
                  >
                    <div className="min-w-0 pr-1 truncate">
                      <span className="font-bold text-slate-800 block truncate">{tx.title}</span>
                      <span className="text-[8px] text-slate-400 font-ubuntu">
                        {tx.id} • {toBengaliDigits(tx.date)}
                      </span>
                    </div>
                    <strong
                      className={`font-ubuntu shrink-0 ${
                        tx.type === "income" ? "text-emerald-800" : "text-rose-800"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}৳
                      {toBengaliDigits(tx.amount.toLocaleString("en-IN"))}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[8.5px] text-slate-600 mt-2">
              <strong>উপস্থিতি রেশিও:</strong> {data.staffFaculty.attendance.ratio} • সময়মতো চেক-ইন:{" "}
              {toBengaliDigits(
                data.staffFaculty.attendance.present - data.staffFaculty.attendance.late
              )}{" "}
              জন
            </div>
          </div>
        </div>

        {/* ৪. ফুটার ও স্বাক্ষর */}
        <div className="border-t border-slate-300 pt-2 flex items-end justify-between text-[9px] text-slate-600 flex-shrink-0">
          <div className="font-ubuntu space-y-0.5">
            <div>আস-সালাম আইডিয়াল মাদরাসা অটোমেটেড ইআরপি সিস্টেম</div>
            <div className="text-[7.5px] text-slate-400">
              প্রিন্ট তারিখ: {toBengaliDigits(new Date().toLocaleDateString("bn-BD"))} • গোপনীয় ও দাপ্তরিক ব্যবহারের জন্য
            </div>
          </div>

          <div className="flex items-center gap-8 text-center">
            <div>
              <div className="w-24 border-b border-dashed border-slate-400 mb-0.5"></div>
              <span className="text-[8px] font-bold text-slate-700">হিসাবরক্ষক</span>
            </div>
            <div>
              <div className="w-24 border-b border-dashed border-slate-400 mb-0.5"></div>
              <span className="text-[8px] font-bold text-slate-700">অধ্যক্ষ / পরিচালক</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonText({ width = "100%", height = "16px" }) {
  return (
    <div
      className="bg-slate-200 animate-pulse rounded"
      style={{ width, height }}
    ></div>
  );
}
