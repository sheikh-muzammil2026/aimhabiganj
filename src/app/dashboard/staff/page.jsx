"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  Printer,
  Eye,
  Phone,
  Briefcase,
  Layers,
  Bell,
  Check,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import StaffIdFront from "@/components/dashboard/staff/id-card/StaffIdFront";
import StaffIdBack from "@/components/dashboard/staff/id-card/StaffIdBack";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function StaffDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const sessionUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [shiftPhase, setShiftPhase] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [idCardSide, setIdCardSide] = useState("front"); // "front" | "back"

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );

      setCurrentDateStr(
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: "Asia/Dhaka",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(now)
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch staff dashboard data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const email = sessionUser?.email || "";
      const query = email ? `?email=${encodeURIComponent(email)}` : "";

      const [resProfile, resToday] = await Promise.all([
        fetch(`${API_BASE}/api/staff/me${query}`),
        fetch(`${API_BASE}/api/staff/attendance/today${query}`),
      ]);

      const [dataProfile, dataToday] = await Promise.all([
        resProfile.json(),
        resToday.json(),
      ]);

      if (dataProfile.success) {
        setProfileData(dataProfile.profile);
        setStats(dataProfile.stats);
      }

      if (dataToday.success) {
        setTodayAttendance(dataToday.attendance);
        setShiftPhase(dataToday.shiftPhase);
      }
    } catch (err) {
      console.error("Staff dashboard fetch error:", err);
      toast.error("ড্যাশবোর্ড ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchData();
    }
  }, [sessionLoading, fetchData]);

  const profile = profileData || {
    fullName: sessionUser?.name || "মুহাম্মদ আব্দুল্লাহ",
    designation: "অফিস সহকারী (Office Assistant)",
    staffId: "ID NO-AIM ST-001",
    email: sessionUser?.email || "abdullah.office@aimhabiganj.edu.bd",
    phone: "০১৭১২৩৪৫৬৭৮",
    bloodGroup: "A (+)",
    dateOfBirth: "15/05/1992",
    joiningDate: "01/01/2023",
    address: "হবিগঞ্জ সদর, হবিগঞ্জ",
  };

  const hasCheckedIn = Boolean(todayAttendance?.checkInTime);
  const checkInStatus = todayAttendance?.checkInStatus || null;
  const hasCheckedOut = Boolean(todayAttendance?.checkOutTime);
  const checkOutStatus = todayAttendance?.checkOutStatus || null;

  const formatDhakaTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return "--:--";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* ================= 1. HERO BANNER ================= */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>আস-সালাম আইডিয়াল মাদরাসা • স্টাফ পোর্টাল</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                আসসালামু আলাইকুম, {profile.fullName}!
              </h1>
              <p className="text-emerald-200/90 text-sm sm:text-base mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-semibold text-amber-300">
                  {profile.designation}
                </span>
                <span>•</span>
                <span className="font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-700/50 text-xs">
                  {profile.staffId}
                </span>
                <span>•</span>
                <span className="text-xs sm:text-sm">{currentDateStr}</span>
              </p>
            </div>
          </div>

          {/* Right Clock & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                রিয়েল-টাইম সময় (ঢাকা)
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wide">
                {currentTimeStr || "--:--:--"}
              </span>
            </div>

            <div className="flex sm:flex-col gap-2">
              <Link
                href="/dashboard/staff/attendance"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>হাজিরা দিন</span>
              </Link>
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
                <span>আপডেট</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TWO-TERM ATTENDANCE ALERT / SCHEDULE STRIP ================= */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-emerald-600/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-emerald-950 dark:text-emerald-300">
                দৈনিক ২ টার্ম হাজিরা নিয়মাবলী
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                <span className="font-bold text-emerald-800 dark:text-emerald-400">
                  ১ম টার্ম (সকালের চেক-ইন):
                </span>{" "}
                সর্বশেষ সময় <strong className="text-amber-700 dark:text-amber-400">ভোর ৫:৩০ টা</strong>{" "}
                (এরপর লেট) •{" "}
                <span className="font-bold text-teal-800 dark:text-teal-400">
                  ২য় টার্ম (রাতের চেক-আউট):
                </span>{" "}
                নির্ধারিত সময় <strong className="text-amber-700 dark:text-amber-400">রাত ১০:০০ টা থেকে ১০:১০ টা</strong>।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <Link
              href="/dashboard/staff/attendance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <span>হাজিরা পেজ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 3. 4 KEY METRICS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Term 1 Status */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ১ম টার্ম (সকালের চেক-ইন)
            </span>
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                hasCheckedIn
                  ? checkInStatus === "On Time"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {hasCheckedIn ? "✓" : "⏰"}
            </span>
          </div>

          <div className="mt-3">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {hasCheckedIn ? formatDhakaTime(todayAttendance.checkInTime) : "বাকি আছে"}
            </h4>
            <p className="text-xs mt-1 flex items-center gap-1">
              {hasCheckedIn ? (
                checkInStatus === "On Time" ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> সময়মতো (ভোর ৫:৩০ এর মধ্যে)
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> দেরিতে চেক-ইন (ভোর ৫:৩০ এর পর)
                  </span>
                )
              ) : (
                <span className="text-slate-500 font-medium">
                  শেষ সময় ভোর ৫:৩০ টা
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Metric 2: Term 2 Status */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ২য় টার্ম (রাতের চেক-আউট)
            </span>
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                hasCheckedOut
                  ? checkOutStatus === "On Time"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {hasCheckedOut ? "✓" : "🌙"}
            </span>
          </div>

          <div className="mt-3">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {hasCheckedOut ? formatDhakaTime(todayAttendance.checkOutTime) : "অপেক্ষমাণ"}
            </h4>
            <p className="text-xs mt-1 flex items-center gap-1">
              {hasCheckedOut ? (
                checkOutStatus === "On Time" ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> সময়মতো প্রস্থান (রাত ১০:০০-১০:১০)
                  </span>
                ) : checkOutStatus === "Early" ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> সময়ের পূর্বে প্রস্থান
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> বিলম্বিত প্রস্থান / ওভারটাইম
                  </span>
                )
              ) : (
                <span className="text-slate-500 font-medium">
                  উইন্ডো: রাত ১০:০০ - ১০:১০
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Metric 3: Monthly Present Days */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              চলতি মাসের উপস্থিতি
            </span>
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 flex items-center justify-center text-sm">
              📅
            </span>
          </div>

          <div className="mt-3">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats?.presentDays ?? 0} দিন
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              উপস্থিতির হার:{" "}
              <strong className="text-teal-700 dark:text-teal-400">
                {stats?.onTimeRate ?? 100}%
              </strong>
            </p>
          </div>
        </div>

        {/* Metric 4: Total Working Hours */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              মোট কর্মঘণ্টা
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center text-sm">
              ⏳
            </span>
          </div>

          <div className="mt-3">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats?.totalHoursWorked ?? 0} ঘণ্টা
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              সময়মতো উপস্থিতি:{" "}
              <strong className="text-emerald-700 dark:text-emerald-400">
                {stats?.onTimeDays ?? 0} দিন
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. MAIN GRID: ID CARD & ATTENDANCE ACTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (7 cols): Staff ID Card Widget */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <span>আমার অফিসিয়াল স্টাফ আইডি কার্ড</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                মাদরাসার অনুমোদিত ডিজিটাল পরিচিতিপত্র
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setIdCardSide("front")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    idCardSide === "front"
                      ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  সামনের দিক
                </button>
                <button
                  onClick={() => setIdCardSide("back")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    idCardSide === "back"
                      ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  পেছনের দিক
                </button>
              </div>

              <Link
                href="/dashboard/staff/id-card"
                className="p-2 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-700 dark:text-teal-300 rounded-xl transition-colors"
                title="পূর্ণাঙ্গ ভিউ ও প্রিন্ট"
              >
                <Printer className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Card Render Container */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 overflow-x-auto">
            <div className="transform sm:scale-105 transition-transform duration-300 drop-shadow-lg">
              {idCardSide === "front" ? (
                <StaffIdFront staff={profile} scale={1} />
              ) : (
                <StaffIdBack scale={1} />
              )}
            </div>
          </div>

          {/* Card Details Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">
                স্টাফ আইডি
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate block">
                {profile.staffId}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">
                রক্তের গ্রুপ
              </span>
              <span className="text-xs font-black text-rose-600 block">
                {profile.bloodGroup}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">
                যোগদানের তারিখ
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {profile.joiningDate}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">
                ফোন নম্বর
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                {profile.phone}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500">
              কার্ডটি হারিয়ে গেলে তাৎক্ষণিক প্রশাসনিক দফতরে অবহিত করুন।
            </p>
            <Link
              href="/dashboard/staff/id-card"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>আইডি কার্ড ডাউনলোড ও প্রিন্ট</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Quick Services & Daily Duty Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>প্রয়োজনীয় সার্ভিস ও পেজসমূহ</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/dashboard/staff/attendance"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/70 dark:border-slate-800 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center font-bold">
                    📅
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                      ডিজিটাল হাজিরা (২ টার্ম)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      ভোর ৫:৩০ চেক-ইন এবং রাত ১০:০০ চেক-আউট
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-all group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/dashboard/staff/id-card"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200/70 dark:border-slate-800 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-400 flex items-center justify-center font-bold">
                    🪪
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 transition-colors">
                      স্টাফ আইডি কার্ড জেনারেটর
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      ডিজিটাল আইডি কার্ড ভিউ ও প্রিন্ট
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-all group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/dashboard/staff/notices"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200/70 dark:border-slate-800 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center font-bold">
                    📢
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 transition-colors">
                      স্টাফ নোটিশ ও সার্কুলার
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      মাদরাসা কর্তৃপক্ষের জরুরি নোটিশসমূহ
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-all group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/dashboard/profile-settings"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-bold">
                    ⚙️
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-950 transition-colors">
                      প্রোফাইল ও নিরাপত্তা সেটিংস
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      পাসওয়ার্ড ও ব্যক্তিগত তথ্য আপডেট
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 transition-all group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Daily Campus Duty Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                ক্যাম্পাস ডিউটি গাইডলাইন
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-800/80 font-bold border border-emerald-700">
                সক্রিয় শিফট
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5">
                  ১
                </span>
                <p>
                  <strong>সকালের টার্ম:</strong> ফজরের পূর্বে মাদরাসা প্রাঙ্গণে উপস্থিতি নিশ্চিত করে ভোর ৫:৩০ টার মধ্যে ১ম টার্ম হাজিরা সাবমিট করুন।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5">
                  ২
                </span>
                <p>
                  <strong>রাতের টার্ম:</strong> রাতের শিফট ও ক্যাম্পাস গেট লকিং তদারকি শেষে রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে ২য় টার্ম হাজিরা সম্পন্ন করুন।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5">
                  ৩
                </span>
                <p>
                  জরুরি প্রয়োজনে বা দেরির ক্ষেত্রে মন্তব্য বক্সে কারণ উল্লেখ করুন অথবা অ্যাডমিনের অনুমতি গ্রহণ করুন।
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">জরুরি অফিস হেল্পলাইন:</span>
              <span className="font-mono font-bold text-amber-400">
                ০১৮০৪৯০৯৫০০
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
