"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
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
} from "lucide-react";
import {
  MADRASA_LOCATION,
  ATTENDANCE_RULES,
  isWithinMadrasaGeofence,
  calculateDistanceMeters,
} from "@/lib/attendance-config";

export default function TeacherAttendancePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const currentUser = session?.user;

  // Fallback demo user for preview if not logged in
  const teacherEmail = currentUser?.email || "tanim@gmail.com";
  const teacherName = currentUser?.name || "শিক্ষক";
  const teacherRole = currentUser?.role || "teacher";

  // Real-time state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingToday, setLoadingToday] = useState(true);
  const [todayData, setTodayData] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Geolocation state
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState(null);

  // Dev simulation toggle (allows testing check-in from non-Madrasa locations)
  const [simulateInside, setSimulateInside] = useState(false);

  // Action loading states
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);

  // 1. Live Clock updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Bangladesh time string (e.g. "08:04:12 AM")
  const formatTimeBD = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Format display time for timestamps
  const formatDisplayTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(isoString));
  };

  // Format display date
  const formatDisplayDate = (isoStringOrDate) => {
    if (!isoStringOrDate) return "";
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
  };

  // 2. Fetch today's attendance record
  const fetchTodayAttendance = useCallback(async () => {
    try {
      setLoadingToday(true);
      const res = await fetch(
        `/api/attendance/today?email=${encodeURIComponent(teacherEmail)}`
      );
      const json = await res.json();
      if (json.success) {
        setTodayData(json.attendance);
      }
    } catch (err) {
      console.error("Failed to load today's attendance:", err);
    } finally {
      setLoadingToday(false);
    }
  }, [teacherEmail]);

  // 3. Fetch past attendance history
  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(
        `/api/attendance/history?email=${encodeURIComponent(teacherEmail)}&limit=15`
      );
      const json = await res.json();
      if (json.success) {
        setHistoryList(json.history || []);
      }
    } catch (err) {
      console.error("Failed to load attendance history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [teacherEmail]);

  useEffect(() => {
    fetchTodayAttendance();
    fetchHistory();
  }, [fetchTodayAttendance, fetchHistory]);

  // 4. Request and verify browser geolocation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const err = "আপনার ব্রাউজারে Geolocation সমর্থিত নয়।";
      setLocationError(err);
      toast.error(err);
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
          msg =
            "অনুগ্রহ করে ব্রাউজার ও ডিভাইসের GPS/লোকেশন পারমিশন অন করুন।";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "ডিভাইসের অবস্থান শনাক্ত করা সম্ভব হয়নি।";
        } else if (error.code === error.TIMEOUT) {
          msg = "লোকেশন পেতে অতিরিক্ত সময় লাগছে। আবার চেষ্টা করুন।";
        }
        setLocationError(msg);
        toast.warning(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Request location on component mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // 5. Handle Check-In
  const handleCheckIn = async () => {
    // If not located yet and not in simulation, request location first
    if (!currentCoords && !simulateInside) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const latToUse = simulateInside
      ? MADRASA_LOCATION.LATITUDE
      : currentCoords?.lat;
    const lngToUse = simulateInside
      ? MADRASA_LOCATION.LONGITUDE
      : currentCoords?.lng;

    // Client-side geofence verification
    const verification = isWithinMadrasaGeofence(latToUse, lngToUse);
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    try {
      setSubmittingCheckIn(true);
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: latToUse,
          lng: lngToUse,
          mockInPremises: simulateInside,
          teacherEmail,
          teacherName,
          teacherId: currentUser?.id || "teacher-id",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "চেক-ইন ব্যর্থ হয়েছে।");
        return;
      }

      toast.success(data.message || "প্রবেশ হাজিরা সফলভাবে নিশ্চিত হয়েছে!");
      setTodayData(data.attendance);
      fetchHistory();
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  // 6. Handle Check-Out
  const handleCheckOut = async () => {
    if (!todayData || !todayData.checkInTime) {
      toast.error("আজকের কোনো প্রবেশ হাজিরা পাওয়া যায়নি। আগে চেক-ইন সম্পন্ন করুন।");
      return;
    }

    if (todayData.checkOutTime) {
      toast.info("আপনি ইতিমধ্যে প্রস্থান হাজিরা সম্পন্ন করেছেন।");
      return;
    }

    if (!currentCoords && !simulateInside) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const latToUse = simulateInside
      ? MADRASA_LOCATION.LATITUDE
      : currentCoords?.lat;
    const lngToUse = simulateInside
      ? MADRASA_LOCATION.LONGITUDE
      : currentCoords?.lng;

    const verification = isWithinMadrasaGeofence(latToUse, lngToUse);
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    try {
      setSubmittingCheckOut(true);
      const res = await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: latToUse,
          lng: lngToUse,
          mockInPremises: simulateInside,
          teacherEmail,
          teacherName,
          teacherId: currentUser?.id || "teacher-id",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "প্রস্থান হাজিরা ব্যর্থ হয়েছে।");
        return;
      }

      toast.success(data.message || "প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে!");
      setTodayData(data.attendance);
      fetchHistory();
    } catch (err) {
      console.error("Check-out error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    } finally {
      setSubmittingCheckOut(false);
    }
  };

  const isCheckedIn = !!todayData?.checkInTime;
  const isCheckedOut = !!todayData?.checkOutTime;

  // Compute effective distance
  const effectiveDistance = simulateInside
    ? 0
    : geofenceStatus?.distance ?? null;
  const isInsideEffective = simulateInside
    ? true
    : geofenceStatus?.isInside ?? false;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner with Islamic Branding & Live Clock */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-700/60 border border-emerald-500/30 rounded-full text-emerald-200 backdrop-blur-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                শিক্ষক হাজিরা পোর্টাল
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                AIM Campus
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>দৈনিক শিক্ষক হাজিরা ও প্রস্থান</span>
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              স্বাগতম, <strong>{teacherName}</strong> ({teacherEmail})।
              মাদরাসা প্রাঙ্গণে অবস্থানকালীন সময়মতো প্রবেশ ও প্রস্থান হাজিরা নিশ্চিত করুন।
            </p>
          </div>

          {/* Live Clock & Islamic Date Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col items-start sm:items-end justify-center shadow-inner min-w-[220px]">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formatDisplayDate(currentTime)}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white mt-1">
              {formatTimeBD(currentTime)}
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              বাংলাদেশ স্ট্যান্ডার্ড সময় (BST)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Geofence Location Verification Bar */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-3 rounded-2xl flex-shrink-0 ${
                isInsideEffective
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
              }`}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  মাদরাসা জিওফেন্স ভেরিফিকেশন
                </h3>
                {isLocating ? (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    অবস্থান খোঁজা হচ্ছে...
                  </span>
                ) : isInsideEffective ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    মাদরাসা ক্যাম্পাসের ভেতরে আছেন
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    মাদরাসা ক্যাম্পাসের বাইরে আছেন
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                লক্ষ্যস্থল: {MADRASA_LOCATION.NAME} (অনুমোদিত পরিধি: {MADRASA_LOCATION.RADIUS_METERS} মিটার)
                {effectiveDistance !== null && (
                  <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">
                    • দূরত্ব: {effectiveDistance > 1000 ? `${(effectiveDistance / 1000).toFixed(2)} কিমি` : `${effectiveDistance} মিটার`}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Location Action & Dev Testing Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
              অবস্থান রিফ্রেশ করুন
            </button>

            {/* Dev Mode Simulation Switch */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
              <label
                htmlFor="simulate-toggle"
                className="text-xs font-bold text-amber-900 dark:text-amber-300 cursor-pointer flex items-center gap-1.5 select-none"
              >
                <span>🧪 টেস্ট মোড (Inside Geofence)</span>
              </label>
              <input
                id="simulate-toggle"
                type="checkbox"
                checked={simulateInside}
                onChange={(e) => setSimulateInside(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {locationError && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* 3. Action Cards Grid: Check-In & Check-Out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHECK-IN CARD */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <LogIn className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  প্রবেশ হাজিরা (Check-In)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                সকাল ৮:০০ থেকে ৮:০৫ এর মধ্যে প্রবেশ করলে &quot;On Time&quot; গণ্য হবে।
              </p>
            </div>

            {/* Check-In Status Badge */}
            {isCheckedIn ? (
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs ${
                  todayData?.checkInStatus === "On Time"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300"
                }`}
              >
                {todayData?.checkInStatus === "On Time" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                {todayData?.checkInStatus === "On Time" ? "সময়মতো (On Time)" : "দেরিতে (Late)"}
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                হাজিরা দেওয়া হয়নি
              </span>
            )}
          </div>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">রেকর্ডকৃত সময়:</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono text-sm">
                {isCheckedIn ? formatDisplayTime(todayData.checkInTime) : "--:--"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">স্ট্যাটাস:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isCheckedIn
                  ? todayData.checkInStatus === "On Time"
                    ? "অন-টাইম উপস্থিতি"
                    : "দেরিতে উপস্থিতি"
                  : "অপেক্ষমান"}
              </span>
            </div>
            {todayData?.checkInLocation && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <span>কো-অর্ডিনেট:</span>
                <span className="font-mono">
                  {todayData.checkInLocation.lat.toFixed(4)}, {todayData.checkInLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn || submittingCheckIn}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isCheckedIn
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-[0.98]"
            }`}
          >
            {submittingCheckIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>যাচাই ও চেক-ইন হচ্ছে...</span>
              </>
            ) : isCheckedIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>আজকের প্রবেশ হাজিরা সম্পন্ন হয়েছে</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>প্রবেশ হাজিরা নিশ্চিত করুন (Check In)</span>
              </>
            )}
          </button>
        </div>

        {/* CHECK-OUT CARD */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  <LogOut className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  প্রস্থান হাজিরা (Check-Out)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                দুপুর ১:১০ বা তার পরে প্রস্থান করলে &quot;On Time&quot; গণ্য হবে।
              </p>
            </div>

            {/* Check-Out Status Badge */}
            {isCheckedOut ? (
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs ${
                  todayData?.checkOutStatus === "On Time"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                }`}
              >
                {todayData?.checkOutStatus === "On Time" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                {todayData?.checkOutStatus === "On Time"
                  ? "অন-টাইম প্রস্থান (On Time)"
                  : "আর্লি প্রস্থান (Early)"}
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                প্রস্থান হয়নি
              </span>
            )}
          </div>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">রেকর্ডকৃত সময়:</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono text-sm">
                {isCheckedOut ? formatDisplayTime(todayData.checkOutTime) : "--:--"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">স্ট্যাটাস:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isCheckedOut
                  ? todayData.checkOutStatus === "On Time"
                    ? "সময়মতো প্রস্থান সম্পন্ন"
                    : "নির্ধারিত সময়ের পূর্বে প্রস্থান"
                  : isCheckedIn
                  ? "কার্যক্রম চলমান"
                  : "প্রবেশ হাজিরা ছাড়া সম্ভব নয়"}
              </span>
            </div>
            {todayData?.checkOutLocation && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <span>কো-অর্ডিনেট:</span>
                <span className="font-mono">
                  {todayData.checkOutLocation.lat.toFixed(4)}, {todayData.checkOutLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isCheckedOut || submittingCheckOut}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              !isCheckedIn
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                : isCheckedOut
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                : "bg-teal-700 hover:bg-teal-800 text-white shadow-teal-700/20 active:scale-[0.98]"
            }`}
          >
            {submittingCheckOut ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>যাচাই ও চেক-আউট হচ্ছে...</span>
              </>
            ) : isCheckedOut ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>আজকের প্রস্থান হাজিরা সম্পন্ন হয়েছে</span>
              </>
            ) : !isCheckedIn ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>আগে প্রবেশ হাজিরা (Check-In) দিন</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>প্রস্থান হাজিরা নিশ্চিত করুন (Check Out)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Office Hours & Attendance Rules Card */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            মাদরাসা অফিস সময় ও হাজিরা নির্দেশিকা
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/40 space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              অফিস কার্যকাল
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              সকাল ৮:০০ - দুপুর ১:১০
            </p>
            <p className="text-xs text-slate-400">দৈনিক মোট ৫ ঘণ্টা ১০ মিনিট</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/40 space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              অন-টাইম প্রবেশ (Arrival)
            </span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              সকাল ৮:০৫ বা পূর্বে
            </p>
            <p className="text-xs text-slate-400">সকাল ৮:০৫ এর পর প্রবেশ করলে Late</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/40 space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              অন-টাইম প্রস্থান (Departure)
            </span>
            <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
              দুপুর ১:১০ বা পরে
            </p>
            <p className="text-xs text-slate-400">দুপুর ১:১০ এর পূর্বে প্রস্থান Early</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/40 space-y-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              লোকেশন বাধ্যবাধকতা
            </span>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              সর্বোচ্চ {MADRASA_LOCATION.RADIUS_METERS} মিটার
            </p>
            <p className="text-xs text-slate-400">মাদরাসা প্রাঙ্গণের বাইরে সাবমিট হবে না</p>
          </div>
        </div>
      </div>

      {/* 5. Personal Attendance History Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              আপনার সাম্প্রতিক হাজিরা লগ
            </h3>
          </div>
          <button
            onClick={fetchHistory}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            রিফ্রেশ
          </button>
        </div>

        {loadingHistory ? (
          <div className="py-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            লগ লোড হচ্ছে...
          </div>
        ) : historyList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            এখনও কোনো হাজিরার রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-700/40">
                <tr>
                  <th className="py-3 px-4 font-bold">তারিখ</th>
                  <th className="py-3 px-4 font-bold">প্রবেশের সময়</th>
                  <th className="py-3 px-4 font-bold">প্রবেশ স্ট্যাটাস</th>
                  <th className="py-3 px-4 font-bold">প্রস্থানের সময়</th>
                  <th className="py-3 px-4 font-bold">প্রস্থান স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {historyList.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDisplayTime(item.checkInTime)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.checkInStatus === "On Time"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {item.checkInStatus === "On Time" ? "On Time" : "Late"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDisplayTime(item.checkOutTime)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.checkOutStatus ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            item.checkOutStatus === "On Time"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {item.checkOutStatus === "On Time" ? "On Time" : "Early"}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">অপেক্ষমান</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
