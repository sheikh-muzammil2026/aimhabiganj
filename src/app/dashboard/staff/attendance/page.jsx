"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
  ShieldCheck,
  Navigation,
  RefreshCw,
  LogOut,
  LogIn,
  Info,
  History,
  Sparkles,
  MessageSquare,
  X,
  Send,
  ArrowRight,
  Filter,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  MADRASA_LOCATION,
  STAFF_ATTENDANCE_RULES,
  isWithinMadrasaGeofence,
  calculateDistanceMeters,
  evaluateStaffCheckInStatus,
  evaluateStaffCheckOutStatus,
  getStaffShiftPhase,
} from "@/lib/attendance-config";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function StaffAttendancePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const sessionUser = session?.user;

  // Real-time state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingToday, setLoadingToday] = useState(true);
  const [todayData, setTodayData] = useState(null);
  const [shiftPhase, setShiftPhase] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Geolocation state
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState(null);

  // Late / Early Comment Modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentModalType, setCommentModalType] = useState("late"); // "late" | "early" | "overtime"
  const [attendanceComment, setAttendanceComment] = useState("");

  // Submission loading states
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);

  // 1. Live Clock updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDhakaTimeWithSeconds = (date) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "--:--:--";
    }
  };

  const formatDhakaTimeOnly = (isoString) => {
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

  const formatDisplayDate = (isoStringOrDate) => {
    if (!isoStringOrDate) return "";
    try {
      return new Intl.DateTimeFormat("bn-BD", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(
        typeof isoStringOrDate === "string"
          ? new Date(isoStringOrDate)
          : isoStringOrDate
      );
    } catch {
      return "";
    }
  };

  // 2. Fetch today's attendance record
  const fetchTodayAttendance = useCallback(async () => {
    try {
      setLoadingToday(true);
      const email = sessionUser?.email || "";
      const query = email ? `?email=${encodeURIComponent(email)}` : "";

      const res = await fetch(`${API_BASE}/api/staff/attendance/today${query}`, {
        headers: email ? { "x-user-email": email } : {},
      });
      const json = await res.json();
      if (json.success) {
        setTodayData(json.attendance);
        setShiftPhase(json.shiftPhase);
      }
    } catch (err) {
      console.error("Failed to load today's staff attendance:", err);
    } finally {
      setLoadingToday(false);
    }
  }, [sessionUser]);

  // 3. Fetch past attendance history
  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const email = sessionUser?.email || "";
      const queryParams = new URLSearchParams();
      if (email) queryParams.append("email", email);
      if (selectedMonth) queryParams.append("month", selectedMonth);
      queryParams.append("limit", "30");

      const res = await fetch(`${API_BASE}/api/staff/attendance/history?${queryParams.toString()}`, {
        headers: email ? { "x-user-email": email } : {},
      });
      const json = await res.json();
      if (json.success) {
        setHistoryList(json.history || []);
        setMonthlyMetrics(json.metrics || null);
      }
    } catch (err) {
      console.error("Failed to load staff attendance history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [sessionUser, selectedMonth]);

  useEffect(() => {
    if (!sessionLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTodayAttendance();
      fetchHistory();
    }
  }, [sessionLoading, fetchTodayAttendance, fetchHistory]);

  // 4. Request GPS Location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const err = "আপনার ডিভাইসে Geolocation সমর্থিত নয়।";
      setLocationError(err);
      toast.warning(err);
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = { lat: latitude, lng: longitude, accuracy };
        setCurrentCoords(coords);

        const check = isWithinMadrasaGeofence(latitude, longitude);
        setGeofenceStatus({
          ...check,
          accuracy: Math.round(accuracy),
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let msg = "লোকেশন প্রাপ্তিতে সমস্যা হয়েছে।";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "অনুগ্রহ করে ব্রাউজার ও ডিভাইসের GPS/লোকেশন পারমিশন অন করুন।";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "ডিভাইসের অবস্থান শনাক্ত করা সম্ভব হয়নি।";
        } else if (error.code === error.TIMEOUT) {
          msg = "লোকেশন পেতে অতিরিক্ত সময় লাগছে। আবার চেষ্টা করুন।";
        }
        setLocationError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestLocation();
  }, [requestLocation]);

  // 5. Term 1 Check-In API Handler
  const handleCheckInClick = () => {
    const status = evaluateStaffCheckInStatus(currentTime);
    if (status === "Late") {
      setCommentModalType("late");
      setCommentModalOpen(true);
    } else {
      executeCheckIn("");
    }
  };

  const executeCheckIn = async (comment = "") => {
    const userEmail = sessionUser?.email;
    if (!userEmail) {
      toast.error("লগইন সেশন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় লগইন করুন।");
      return;
    }

    try {
      setSubmittingCheckIn(true);
      const res = await fetch(`${API_BASE}/api/staff/attendance/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          lat: currentCoords?.lat,
          lng: currentCoords?.lng,
          checkInComment: comment,
          bypassGeofence: !currentCoords,
          email: userEmail,
          staffEmail: userEmail,
          staffName: sessionUser?.name || "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.requiresComment) {
          setCommentModalType("late");
          setCommentModalOpen(true);
        }
        toast.error(data.message || "১ম টার্ম হাজিরা ব্যর্থ হয়েছে।");
        return;
      }

      toast.success(data.message || "১ম টার্মের প্রবেশ হাজিরা সফলভাবে নিশ্চিত হয়েছে!");
      setTodayData(data.attendance);
      fetchHistory();
      setCommentModalOpen(false);
      setAttendanceComment("");
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error("সার্ভার ত্রুটি! প্রবেশ হাজিরা সংরক্ষণ করা সম্ভব হয়নি।");
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  // 6. Term 2 Check-Out API Handler
  const handleCheckOutClick = () => {
    const status = evaluateStaffCheckOutStatus(currentTime);
    if (status === "Early") {
      setCommentModalType("early");
      setCommentModalOpen(true);
    } else if (status === "Overtime") {
      setCommentModalType("overtime");
      setCommentModalOpen(true);
    } else {
      executeCheckOut("");
    }
  };

  const executeCheckOut = async (comment = "") => {
    const userEmail = sessionUser?.email;
    if (!userEmail) {
      toast.error("লগইন সেশন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় লগইন করুন।");
      return;
    }

    try {
      setSubmittingCheckOut(true);
      const res = await fetch(`${API_BASE}/api/staff/attendance/check-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          lat: currentCoords?.lat,
          lng: currentCoords?.lng,
          checkOutComment: comment,
          bypassGeofence: !currentCoords,
          email: userEmail,
          staffEmail: userEmail,
          staffName: sessionUser?.name || "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.requiresComment) {
          setCommentModalType("early");
          setCommentModalOpen(true);
        }
        toast.error(data.message || "২য় টার্ম হাজিরা ব্যর্থ হয়েছে।");
        return;
      }

      toast.success(data.message || "২য় টার্মের প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে!");
      setTodayData(data.attendance);
      fetchHistory();
      setCommentModalOpen(false);
      setAttendanceComment("");
    } catch (err) {
      console.error("Check-out error:", err);
      toast.error("সার্ভার ত্রুটি! প্রস্থান হাজিরা সংরক্ষণ করা সম্ভব হয়নি।");
    } finally {
      setSubmittingCheckOut(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const trimmed = attendanceComment.trim();
    if (!trimmed) {
      toast.warning("অনুগ্রহ করে কারণ উল্লেখ করুন।");
      return;
    }
    if (commentModalType === "late") {
      executeCheckIn(trimmed);
    } else {
      executeCheckOut(trimmed);
    }
  };

  // Live status evaluation
  const liveCheckInStatus = evaluateStaffCheckInStatus(currentTime);
  const liveCheckOutStatus = evaluateStaffCheckOutStatus(currentTime);

  const hasCheckedIn = Boolean(todayData?.checkInTime);
  const hasCheckedOut = Boolean(todayData?.checkOutTime);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* ================= 1. TOP HEADER & LIVE DHAKA CLOCK ================= */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>স্টাফ ডিজিটাল হাজিরা ব্যবস্থা • প্রতিদিন ২ টার্ম</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              দৈনিক হাজিরা পোর্টাল (২ টার্ম)
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/90 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formatDisplayDate(currentTime)}</span>
            </p>
          </div>

          {/* Live Clock Card */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center md:text-right shrink-0 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-end gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>বাংলাদেশ সময় (UTC+6)</span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-amber-400 tracking-wider">
              {formatDhakaTimeWithSeconds(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TWO-TERM POLICY & SCHEDULE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Term 1 Card */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 sm:p-6 border-t-4 border-t-emerald-600 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <LogIn className="w-4 h-4" />
              <span>১ম টার্ম: সকালের প্রবেশ হাজিরা</span>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ভোর ০৫:৩০ টা পর্যন্ত
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p>
              • <strong>সময়মতো (On Time):</strong> ভোর ৫:৩০ এর পূর্বে বা ৫:৩০ পর্যন্ত হাজিরা দিলে অন-টাইম গণ্য হবে।
            </p>
            <p>
              • <strong>দেরিতে (Late):</strong> ভোর ৫:৩০ এর পর প্রবেশ করলে লেট কাউন্ট হবে এবং দেরির কারণ উল্লেখ করতে হবে।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">আজকের অবস্থা:</span>
            {hasCheckedIn ? (
              <span
                className={`font-black flex items-center gap-1 ${
                  todayData.checkInStatus === "On Time"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  সম্পন্ন ({formatDhakaTimeOnly(todayData.checkInTime)}) - {todayData.checkInStatus}
                </span>
              </span>
            ) : liveCheckInStatus === "On Time" ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                উইন্ডো উন্মুক্ত (অন-টাইম চলমান)
              </span>
            ) : (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                ভোর ৫:৩০ অতিক্রান্ত (লেট উইন্ডো)
              </span>
            )}
          </div>
        </div>

        {/* Term 2 Card */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 sm:p-6 border-t-4 border-t-teal-600 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <LogOut className="w-4 h-4" />
              <span>২য় টার্ম: রাতের প্রস্থান হাজিরা</span>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              রাত ১০:০০ - ১০:১০ টা
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p>
              • <strong>নির্ধারিত সময় (On Time):</strong> রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে প্রস্থান হাজিরা দেওয়া বাধ্যতামূলক।
            </p>
            <p>
              • <strong>আগাম প্রস্থান (Early):</strong> রাত ১০:০০ এর পূর্বে প্রস্থান দিলে আর্লি এক্সিট হিসেবে গণ্য হবে।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">আজকের অবস্থা:</span>
            {hasCheckedOut ? (
              <span
                className={`font-black flex items-center gap-1 ${
                  todayData.checkOutStatus === "On Time"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : todayData.checkOutStatus === "Early"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  সম্পন্ন ({formatDhakaTimeOnly(todayData.checkOutTime)}) - {todayData.checkOutStatus}
                </span>
              </span>
            ) : liveCheckOutStatus === "On Time" ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                উইন্ডো উন্মুক্ত! (রাত ১০:০০ - ১০:১০)
              </span>
            ) : liveCheckOutStatus === "Early" ? (
              <span className="text-slate-500 font-semibold">
                উইন্ডো শুরু হতে বাকি (রাত ১০:০০ টায়)
              </span>
            ) : (
              <span className="text-amber-600 font-bold">
                রাত ১০:১০ অতিক্রান্ত (ওভারটাইম / লেট এক্সিট)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= 3. GPS LOCATION / GEOFENCE STATUS ================= */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                geofenceStatus?.isInside
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : currentCoords
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <MapPin className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  মাদরাসা প্রাঙ্গণ ও GPS অবস্থান
                </h4>
                {geofenceStatus?.isInside ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300">
                    ক্যাম্পাসের ভেতরে অবস্থিত
                  </span>
                ) : currentCoords ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-black border border-amber-300">
                    দূরত্ব: {geofenceStatus?.distance} মিটার
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                    অবস্থান অনুসন্ধান চলছে...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {MADRASA_LOCATION.NAME} • ব্যাসার্ধ: {MADRASA_LOCATION.RADIUS_METERS} মিটার
              </p>
            </div>
          </div>

          <button
            onClick={requestLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "শনাক্ত হচ্ছে..." : "GPS রিফ্রেশ করুন"}</span>
          </button>
        </div>
      </div>

      {/* ================= 4. ATTENDANCE SUBMISSION ACTION CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Term 1 Submission Card */}
        <div className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-[#0f172a] dark:to-emerald-950/20 rounded-3xl p-6 sm:p-7 border border-emerald-200 dark:border-emerald-900/50 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                <LogIn className="w-4 h-4" />
                ১ম টার্ম: প্রবেশ হাজিরা (সকাল)
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                শেষ সময়: ০৫:৩০ AM
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {hasCheckedIn ? "১ম টার্ম সফলভাবে সম্পন্ন" : "১ম টার্মের হাজিরা দিন"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {hasCheckedIn ? (
                <>
                  আপনি আজ সকাল <strong>{formatDhakaTimeOnly(todayData.checkInTime)}</strong> টায় ১ম টার্মের প্রবেশ হাজিরা দিয়েছেন। স্ট্যাটাস:{" "}
                  <strong className={todayData.checkInStatus === "On Time" ? "text-emerald-600" : "text-amber-600"}>
                    {todayData.checkInStatus}
                  </strong>
                  {todayData.checkInComment && ` (${todayData.checkInComment})`}
                </>
              ) : (
                "ভোর ৫:৩০ টার মধ্যে আপনার সকালের উপস্থিতি নিশ্চিত করুন। ৫:৩০ এর পর হাজিরা দিলে দেরির কারণসহ লেট হিসেবে লিপিবদ্ধ হবে।"
              )}
            </p>
          </div>

          <div>
            {hasCheckedIn ? (
              <div className="p-3 bg-emerald-100/80 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>আজকের ১ম টার্মের প্রবেশ হাজিরা ইতিমধ্যে নিশ্চিত করা হয়েছে</span>
              </div>
            ) : (
              <button
                onClick={handleCheckInClick}
                disabled={submittingCheckIn}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-black rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingCheckIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>১ম টার্ম: প্রবেশ হাজিরা সাবমিট করুন</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Term 2 Submission Card */}
        <div className="bg-gradient-to-br from-white to-teal-50/40 dark:from-[#0f172a] dark:to-teal-950/20 rounded-3xl p-6 sm:p-7 border border-teal-200 dark:border-teal-900/50 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-400">
                <LogOut className="w-4 h-4" />
                ২য় টার্ম: প্রস্থান হাজিরা (রাত)
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                উইন্ডো: ১০:০০ - ১০:১০ PM
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {hasCheckedOut ? "২য় টার্ম সফলভাবে সম্পন্ন" : "২য় টার্মের হাজিরা দিন"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {hasCheckedOut ? (
                <>
                  আপনি আজ রাত <strong>{formatDhakaTimeOnly(todayData.checkOutTime)}</strong> টায় প্রস্থান হাজিরা দিয়েছেন। স্ট্যাটাস:{" "}
                  <strong className={todayData.checkOutStatus === "On Time" ? "text-emerald-600" : "text-amber-600"}>
                    {todayData.checkOutStatus}
                  </strong>
                  {todayData.durationText && ` • মোট কাজ: ${todayData.durationText}`}
                </>
              ) : (
                "রাতের নির্ধারিত সময়সূচী অনুযায়ী রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে আপনার প্রস্থান হাজিরা সাবমিট করুন।"
              )}
            </p>
          </div>

          <div>
            {hasCheckedOut ? (
              <div className="p-3 bg-teal-100/80 dark:bg-teal-950/50 rounded-2xl border border-teal-200 dark:border-teal-800 flex items-center gap-2 text-xs font-bold text-teal-900 dark:text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>আজকের ২য় টার্মের প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে</span>
              </div>
            ) : !hasCheckedIn ? (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold text-slate-500 text-center">
                প্রস্থান হাজিরা দেওয়ার জন্য প্রথমে ১ম টার্মের প্রবেশ হাজিরা সম্পন্ন করুন।
              </div>
            ) : (
              <button
                onClick={handleCheckOutClick}
                disabled={submittingCheckOut}
                className={`w-full py-3.5 px-5 text-white font-black rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  liveCheckOutStatus === "On Time"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 ring-2 ring-emerald-400"
                    : "bg-gradient-to-r from-teal-800 to-slate-800 hover:from-teal-900 hover:to-slate-900"
                }`}
              >
                {submittingCheckOut ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>
                      ২য় টার্ম: প্রস্থান হাজিরা সাবমিট করুন{" "}
                      {liveCheckOutStatus === "On Time" && "(সময়মতো)"}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= 5. MONTHLY STATS SUMMARY ================= */}
      {monthlyMetrics && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                চলতি মাসের সামগ্রিক পরিসংখ্যান
              </h3>
              <p className="text-xs text-slate-500">
                মোট কর্মদিবস: {monthlyMetrics.presentDays} দিন • সময়মতো উপস্থিতি:{" "}
                {monthlyMetrics.onTimeRate}%
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold">মাস নির্বাচন:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">উপস্থিত দিন</span>
              <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
                {monthlyMetrics.presentDays} দিন
              </span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block">
                ১ম টার্ম অন-টাইম
              </span>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                {monthlyMetrics.onTimeCheckIns} দিন
              </span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/40 text-center">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 block">
                ১ম টার্ম লেট
              </span>
              <span className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5 block">
                {monthlyMetrics.lateCheckIns} দিন
              </span>
            </div>
            <div className="bg-teal-50 dark:bg-teal-950/30 p-3 rounded-2xl border border-teal-100 dark:border-teal-900/40 text-center">
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400 block">
                ২য় টার্ম অন-টাইম
              </span>
              <span className="text-lg font-black text-teal-700 dark:text-teal-300 mt-0.5 block">
                {monthlyMetrics.onTimeCheckOuts} দিন
              </span>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-center">
              <span className="text-[11px] font-bold text-rose-800 dark:text-rose-400 block">
                সময়ের পূর্বে প্রস্থান
              </span>
              <span className="text-lg font-black text-rose-700 dark:text-rose-300 mt-0.5 block">
                {monthlyMetrics.earlyCheckOuts} দিন
              </span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-center">
              <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400 block">
                মোট কর্মঘণ্টা
              </span>
              <span className="text-lg font-black text-indigo-700 dark:text-indigo-300 mt-0.5 block">
                {monthlyMetrics.totalHoursWorked} ঘণ্টা
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. RECENT ATTENDANCE HISTORY LOG ================= */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            <span>বিগত দিনগুলোর হাজিরার লগ</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            সর্বশেষ {historyList.length} টি রেকর্ড
          </span>
        </div>

        {loadingHistory ? (
          <div className="py-8 text-center text-xs text-slate-500">
            হাজিরা হিস্টোরি লোড হচ্ছে...
          </div>
        ) : historyList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            কোনো পূর্ববর্তী রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 rounded-l-xl">তারিখ</th>
                  <th className="py-3 px-4">১ম টার্ম (সকাল ৫:৩০)</th>
                  <th className="py-3 px-4">২য় টার্ম (রাত ১০:০০-১০:১০)</th>
                  <th className="py-3 px-4">মোট কর্মঘণ্টা</th>
                  <th className="py-3 px-4 rounded-r-xl">মন্তব্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historyList.map((row, idx) => (
                  <tr
                    key={row._id || idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {row.date}
                    </td>

                    {/* Term 1 */}
                    <td className="py-3 px-4">
                      {row.checkInTime ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {formatDhakaTimeOnly(row.checkInTime)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              row.checkInStatus === "On Time"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}
                          >
                            {row.checkInStatus}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">অনুস্থিত</span>
                      )}
                    </td>

                    {/* Term 2 */}
                    <td className="py-3 px-4">
                      {row.checkOutTime ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {formatDhakaTimeOnly(row.checkOutTime)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              row.checkOutStatus === "On Time"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : row.checkOutStatus === "Early"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}
                          >
                            {row.checkOutStatus}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">অসম্পূর্ণ</span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {row.durationText || "--"}
                    </td>

                    {/* Comments */}
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {row.checkInComment || row.checkOutComment || "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= 7. COMMENT / REASON MODAL ================= */}
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>
                  {commentModalType === "late"
                    ? "১ম টার্ম: দেরিতে চেক-ইন এর কারণ"
                    : commentModalType === "early"
                    ? "২য় টার্ম: সময়ের পূর্বে প্রস্থানের কারণ"
                    : "২য় টার্ম: বিলম্বিত প্রস্থানের কারণ"}
                </span>
              </h3>
              <button
                onClick={() => setCommentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {commentModalType === "late"
                ? "ভোর ৫:৩০ টা অতিক্রান্ত হয়েছে। অনুগ্রহ করে দেরির সুনির্দিষ্ট কারণ উল্লেখ করে হাজিরা সাবমিট করুন।"
                : commentModalType === "early"
                ? "এখন রাত ১০:০০ টা বাজেনি। অফিসিয়াল সময়সূচীর পূর্বে প্রস্থান করার কারণ উল্লেখ করুন।"
                : "রাত ১০:১০ অতিক্রান্ত হয়েছে। অতিরিক্ত সময়ের কারণ উল্লেখ করুন।"}
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                value={attendanceComment}
                onChange={(e) => setAttendanceComment(e.target.value)}
                placeholder="এখানে কারণ বা মন্তব্য লিখুন..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCommentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingCheckIn || submittingCheckOut}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>নিশ্চিত করুন ও সাবমিট</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
