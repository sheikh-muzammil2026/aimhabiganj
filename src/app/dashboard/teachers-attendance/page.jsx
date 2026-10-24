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
  MessageSquare,
  X,
  Send,
  ChevronDown,
  Layers,
} from "lucide-react";
import {
  MADRASA_LOCATION,
  ATTENDANCE_RULES,
  RESIDENTIAL_ATTENDANCE_RULES,
  HIFZ_ATTENDANCE_RULES,
  isWithinMadrasaGeofence,
  calculateDistanceMeters,
  evaluateCheckInStatus,
  evaluateCheckOutStatus,
  getTeacherCategory,
  getTeacherShiftRules,
  evaluateTeacherShiftCheckIn,
  evaluateTeacherShiftCheckOut,
  getActiveTeacherShift,
} from "@/lib/attendance-config";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function TeacherAttendancePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const currentUser = session?.user;

  // Fallback demo user for preview if not logged in
  const teacherEmail = currentUser?.email || "tanim@gmail.com";
  const teacherName = currentUser?.name || "শিক্ষক";
  const teacherRole = currentUser?.role || "teacher";

  // Teacher category & shift configuration state
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [teacherCategory, setTeacherCategory] = useState("regular"); // "regular" | "residential" | "hifz"
  const [shiftRules, setShiftRules] = useState(null);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [targetShiftId, setTargetShiftId] = useState(null); // Used when opening comment modal for a specific shift
  const [submittingShiftId, setSubmittingShiftId] = useState(null);

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

  // Late / Early exit comment modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentModalType, setCommentModalType] = useState("late"); // "late" | "early"
  const [attendanceComment, setAttendanceComment] = useState("");

  // Action loading states
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

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
        `${API_BASE}/api/attendance/today?email=${encodeURIComponent(teacherEmail)}`
      );
      const json = await res.json();
      if (json.success) {
        setTodayData(json.attendance);
        if (json.user) {
          setTeacherProfile(json.user);
        }
        const category = json.category || getTeacherCategory(json.user?.designation);
        setTeacherCategory(category);
        setShiftRules(json.shiftRules || getTeacherShiftRules(category));
        setActiveShiftId(json.activeShiftId || getActiveTeacherShift(category));
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
        `${API_BASE}/api/attendance/history?email=${encodeURIComponent(teacherEmail)}&limit=15`
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

  // 5. Execute Check-In API call
  const executeCheckIn = async (comment = "") => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    try {
      setSubmittingCheckIn(true);
      const res = await fetch(`${API_BASE}/api/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          checkInComment: comment,
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
      setCommentModalOpen(false);
      setAttendanceComment("");
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  // Handle Check-In Trigger
  const handleCheckIn = async () => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    // If late (after 8:05 AM), open comment modal
    const status = evaluateCheckInStatus(new Date());
    if (status === "Late") {
      setCommentModalType("late");
      setAttendanceComment("");
      setCommentModalOpen(true);
    } else {
      await executeCheckIn("");
    }
  };

  // 6. Execute Check-Out API call
  const executeCheckOut = async (comment = "") => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    try {
      setSubmittingCheckOut(true);
      const res = await fetch(`${API_BASE}/api/attendance/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          checkOutComment: comment,
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
      setCommentModalOpen(false);
      setAttendanceComment("");
    } catch (err) {
      console.error("Check-out error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    } finally {
      setSubmittingCheckOut(false);
    }
  };

  // Handle Check-Out Trigger
  const handleCheckOut = async () => {
    if (!todayData || !todayData.checkInTime) {
      toast.error("আজকের কোনো প্রবেশ হাজিরা পাওয়া যায়নি। আগে চেক-ইন সম্পন্ন করুন।");
      return;
    }

    if (todayData.checkOutTime) {
      toast.info("আপনি ইতিমধ্যে প্রস্থান হাজিরা সম্পন্ন করেছেন।");
      return;
    }

    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    // If early (before 1:10 PM), open comment modal
    const status = evaluateCheckOutStatus(new Date());
    if (status === "Early") {
      setCommentModalType("early");
      setAttendanceComment("");
      setCommentModalOpen(true);
    } else {
      await executeCheckOut("");
    }
  };

  // 5.b Execute Multi-Shift Check-In API call
  const executeShiftCheckIn = async (shiftKey, comment = "") => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error("You must be inside the madrasa premises to submit attendance.");
      return;
    }

    try {
      setSubmittingShiftId(shiftKey);
      const res = await fetch(`${API_BASE}/api/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          checkInComment: comment,
          shiftId: shiftKey,
          teacherEmail,
          teacherName,
          teacherId: currentUser?.id || "teacher-id",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "শিফট প্রবেশ হাজিরা ব্যর্থ হয়েছে।");
        return;
      }

      toast.success(data.message || "শিফট প্রবেশ হাজিরা সফলভাবে নিশ্চিত হয়েছে!");
      setTodayData(data.attendance);
      fetchHistory();
      setCommentModalOpen(false);
      setAttendanceComment("");
      setTargetShiftId(null);
    } catch (err) {
      console.error("Shift check-in error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    } finally {
      setSubmittingShiftId(null);
    }
  };

  // Handle Shift Check-In Trigger
  const handleShiftCheckIn = async (shiftKey) => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error("You must be inside the madrasa premises to submit attendance.");
      return;
    }

    const evalResult = evaluateTeacherShiftCheckIn(teacherCategory, shiftKey, new Date());
    if (evalResult.isLate) {
      setTargetShiftId(shiftKey);
      setCommentModalType("late");
      setAttendanceComment("");
      setCommentModalOpen(true);
    } else {
      await executeShiftCheckIn(shiftKey, "");
    }
  };

  // 6.b Execute Multi-Shift Check-Out API call
  const executeShiftCheckOut = async (shiftKey, comment = "") => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error("You must be inside the madrasa premises to submit attendance.");
      return;
    }

    try {
      setSubmittingShiftId(shiftKey);
      const res = await fetch(`${API_BASE}/api/attendance/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          checkOutComment: comment,
          shiftId: shiftKey,
          teacherEmail,
          teacherName,
          teacherId: currentUser?.id || "teacher-id",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "শিফট প্রস্থান হাজিরা ব্যর্থ হয়েছে।");
        return;
      }

      toast.success(data.message || "শিফট প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে!");
      setTodayData(data.attendance);
      fetchHistory();
      setCommentModalOpen(false);
      setAttendanceComment("");
      setTargetShiftId(null);
    } catch (err) {
      console.error("Shift check-out error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    } finally {
      setSubmittingShiftId(null);
    }
  };

  // Handle Shift Check-Out Trigger
  const handleShiftCheckOut = async (shiftKey) => {
    const shiftLog = todayData?.shifts?.[shiftKey];
    if (!shiftLog || !shiftLog.checkInTime) {
      toast.error("আজকের এই শিফটের কোনো প্রবেশ হাজিরা পাওয়া যায়নি। আগে Check-In সম্পন্ন করুন।");
      return;
    }

    if (shiftLog.checkOutTime) {
      toast.info("আপনি ইতিমধ্যে এই শিফটের প্রস্থান হাজিরা সম্পন্ন করেছেন।");
      return;
    }

    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(currentCoords.lat, currentCoords.lng);
    if (!verification.isInside) {
      toast.error("You must be inside the madrasa premises to submit attendance.");
      return;
    }

    const evalResult = evaluateTeacherShiftCheckOut(teacherCategory, shiftKey, new Date());
    if (evalResult.isEarly) {
      setTargetShiftId(shiftKey);
      setCommentModalType("early");
      setAttendanceComment("");
      setCommentModalOpen(true);
    } else {
      await executeShiftCheckOut(shiftKey, "");
    }
  };

  const isMultiShift = teacherCategory === "residential" || teacherCategory === "hifz";
  const activeShiftRules = shiftRules || (isMultiShift ? getTeacherShiftRules(teacherCategory) : null);
  const currentActiveShift = activeShiftId || (isMultiShift ? getActiveTeacherShift(teacherCategory) : null);

  const isCheckedIn = !!todayData?.checkInTime;
  const isCheckedOut = !!todayData?.checkOutTime;

  // Compute effective distance
  const effectiveDistance = geofenceStatus?.distance ?? null;
  const isInsideEffective = geofenceStatus?.isInside ?? false;

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
              স্বাগতম,{" "}
              <strong className="font-mono text-amber-300">
                {teacherProfile?.teacherId ||
                  teacherProfile?.id ||
                  "আইডি নির্ধারিত নয়"}
              </strong>{" "}
              ({teacherEmail})। মাদরাসা প্রাঙ্গণে অবস্থানকালীন সময়মতো প্রবেশ ও
              প্রস্থান হাজিরা নিশ্চিত করুন।
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {(teacherProfile?.teacherId || teacherProfile?.id) && (
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-emerald-950/60 text-amber-300 border border-amber-400/30">
                  শিক্ষক আইডি: {teacherProfile.teacherId || teacherProfile.id}
                </span>
              )}
              {teacherProfile?.designation && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-white/20 text-white border border-white/20">
                  পদবি: {teacherProfile.designation}
                </span>
              )}
              {isMultiShift && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-400 text-slate-900 shadow-xs">
                  {teacherCategory === "residential"
                    ? "আবাসিক শিক্ষক (৩ শিফট)"
                    : "হিফজ বিভাগীয় শিক্ষক (৩ শিফট)"}
                </span>
              )}
            </div>
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

          {/* Location Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
              অবস্থান রিফ্রেশ করুন
            </button>
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
      {isMultiShift ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                ৩ শিফট
              </span>
              <div>
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  {teacherCategory === "residential"
                    ? "আবাসিক শিক্ষক হাজিরা সূচি (দৈনিক ৩ শিফট)"
                    : "হিফজ বিভাগীয় শিক্ষক হাজিরা সূচি (দৈনিক ৩ শিফট)"}
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                  প্রতিটি শিফটে সময়মতো প্রবেশ ও প্রস্থান হাজিরা নিশ্চিত করুন। দেরিতে প্রবেশ বা নির্ধারিত সময়ের পূর্বে প্রস্থান করলে কারণ উল্লেখ করা বাধ্যতামূলক।
                </p>
              </div>
            </div>
            {currentActiveShift && (
              <span className="self-start sm:self-center px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-600 text-white flex items-center gap-1.5 shadow-xs whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                বর্তমান সক্রিয়: {activeShiftRules?.[currentActiveShift]?.name || currentActiveShift}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {["shift1", "shift2", "shift3"].map((shiftKey) => {
              const rule = activeShiftRules?.[shiftKey];
              if (!rule) return null;
              const shiftLog = todayData?.shifts?.[shiftKey];
              const hasCheckedIn = !!shiftLog?.checkInTime;
              const hasCheckedOut = !!shiftLog?.checkOutTime;
              const isActive = currentActiveShift === shiftKey;
              const isSubmitting = submittingShiftId === shiftKey;

              return (
                <div
                  key={shiftKey}
                  className={`relative overflow-hidden bg-white dark:bg-slate-800/80 rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                    isActive
                      ? "border-emerald-500 dark:border-emerald-500/80 ring-2 ring-emerald-500/20"
                      : "border-slate-200/80 dark:border-slate-700/60"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Shift Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-2 rounded-xl text-xs font-bold ${
                              isActive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                          </span>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                            {rule.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {rule.nameEnglish}
                        </p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end gap-1">
                        {hasCheckedOut ? (
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            সম্পন্ন
                          </span>
                        ) : hasCheckedIn ? (
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 flex items-center gap-1">
                            <LogIn className="w-3.5 h-3.5 text-blue-600" />
                            চলমান
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            অপেক্ষমান
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                            বর্তমান সময়
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Schedule Time Window Guide */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">প্রবেশ সময়:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {rule.checkInWindowLabel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">প্রস্থান সময়:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {rule.checkOutWindowLabel}
                        </span>
                      </div>
                    </div>

                    {/* Logged Information */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">প্রবেশ রেকর্ড:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-white">
                          {hasCheckedIn ? formatDisplayTime(shiftLog.checkInTime) : "--:--"}
                        </span>
                      </div>
                      {hasCheckedIn && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">প্রবেশ স্ট্যাটাস:</span>
                          <span
                            className={`font-semibold ${
                              shiftLog.checkInStatus === "On Time"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {shiftLog.checkInStatus === "On Time" ? "সময়মতো" : "দেরিতে (Late)"}
                          </span>
                        </div>
                      )}
                      {shiftLog?.checkInComment && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 italic bg-rose-50 dark:bg-rose-950/30 p-2 rounded-xl">
                          <strong>দেরির কারণ:</strong> {shiftLog.checkInComment}
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">প্রস্থান রেকর্ড:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-white">
                          {hasCheckedOut ? formatDisplayTime(shiftLog.checkOutTime) : "--:--"}
                        </span>
                      </div>
                      {hasCheckedOut && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">প্রস্থান স্ট্যাটাস:</span>
                          <span
                            className={`font-semibold ${
                              shiftLog.checkOutStatus === "On Time"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {shiftLog.checkOutStatus === "On Time" ? "অন-টাইম প্রস্থান" : "সময়ের পূর্বে (Early)"}
                          </span>
                        </div>
                      )}
                      {shiftLog?.checkOutComment && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 italic bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl">
                          <strong>পূর্বে প্রস্থানের কারণ:</strong> {shiftLog.checkOutComment}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for this Shift */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleShiftCheckIn(shiftKey)}
                      disabled={hasCheckedIn || isSubmitting}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        hasCheckedIn
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-[0.98]"
                      }`}
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : hasCheckedIn ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <LogIn className="w-3.5 h-3.5" />
                      )}
                      <span>{hasCheckedIn ? "প্রবেশ সম্পন্ন" : "প্রবেশ (Check In)"}</span>
                    </button>

                    <button
                      onClick={() => handleShiftCheckOut(shiftKey)}
                      disabled={!hasCheckedIn || hasCheckedOut || isSubmitting}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        !hasCheckedIn || hasCheckedOut
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          : "bg-teal-700 hover:bg-teal-800 text-white shadow-xs active:scale-[0.98]"
                      }`}
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : hasCheckedOut ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                      <span>{hasCheckedOut ? "প্রস্থান সম্পন্ন" : "প্রস্থান (Check Out)"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
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
      )}

      {/* 4. Office Hours & Attendance Rules Card */}
      {isMultiShift ? (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {teacherCategory === "residential"
                ? "আবাসিক শিক্ষক (৩ শিফট) হাজিরা নির্দেশিকা ও সময়সূচি"
                : "হিফজ বিভাগীয় শিক্ষক (৩ শিফট) হাজিরা নির্দেশিকা ও সময়সূচি"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["shift1", "shift2", "shift3"].map((shiftKey) => {
              const rule = activeShiftRules?.[shiftKey];
              if (!rule) return null;
              return (
                <div
                  key={shiftKey}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">
                      {rule.name}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {rule.nameEnglish}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>প্রবেশ সময়:</strong> {rule.checkInWindowLabel}
                    </p>
                    <p>
                      <strong>প্রস্থান সময়:</strong> {rule.checkOutWindowLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
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
      )}

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
                  <th className="py-3 px-4 font-bold">দেরি/পূর্বে প্রস্থানের কারণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {historyList.map((item) => {
                  const isExpanded = expandedHistoryId === item._id;
                  const hasShifts = item.shifts && Object.keys(item.shifts).length > 0;

                  // Collect all comments across shifts
                  const historyComments = [];
                  if (item.shifts) {
                    Object.values(item.shifts).forEach((s) => {
                      if (s?.checkInComment) {
                        historyComments.push({
                          type: "late",
                          label: `${s.name || s.shiftId} (দেরি)`,
                          comment: s.checkInComment,
                        });
                      }
                      if (s?.checkOutComment) {
                        historyComments.push({
                          type: "early",
                          label: `${s.name || s.shiftId} (আর্লি)`,
                          comment: s.checkOutComment,
                        });
                      }
                    });
                  }
                  if (historyComments.length === 0) {
                    if (item.checkInComment) {
                      historyComments.push({
                        type: "late",
                        label: "দেরি",
                        comment: item.checkInComment,
                      });
                    }
                    if (item.checkOutComment) {
                      historyComments.push({
                        type: "early",
                        label: "আর্লি",
                        comment: item.checkOutComment,
                      });
                    }
                  }

                  const completedCount = hasShifts
                    ? Object.values(item.shifts).filter((s) => !!s?.checkInTime).length
                    : 0;

                  return (
                    <React.Fragment key={item._id}>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          <div>{item.date}</div>
                          {hasShifts && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedHistoryId(isExpanded ? null : item._id)
                              }
                              className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                            >
                              <Layers className="w-3 h-3" />
                              <span>শিফট বিবরণ ({completedCount}/৩)</span>
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
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
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                          {historyComments.length > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              {historyComments.map((hc, i) => (
                                <span key={i} title={hc.comment} className="truncate">
                                  <strong
                                    className={
                                      hc.type === "late"
                                        ? "text-rose-600 font-semibold"
                                        : "text-amber-600 font-semibold"
                                    }
                                  >
                                    {hc.label}:
                                  </strong>{" "}
                                  {hc.comment}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Shifts Row in History */}
                      {isExpanded && hasShifts && (
                        <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-y border-amber-200/60 dark:border-amber-900/40">
                          <td colSpan={6} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                  <span>{item.date} — ৩ শিফট বিবরণ</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setExpandedHistoryId(null)}
                                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                {["shift1", "shift2", "shift3"].map((shiftKey, sIdx) => {
                                  const sRecord = item.shifts?.[shiftKey];
                                  const rules =
                                    item.category === "hifz"
                                      ? HIFZ_ATTENDANCE_RULES[shiftKey]
                                      : RESIDENTIAL_ATTENDANCE_RULES[shiftKey];
                                  const hasIn = !!sRecord?.checkInTime;
                                  const hasOut = !!sRecord?.checkOutTime;

                                  return (
                                    <div
                                      key={shiftKey}
                                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                        hasIn
                                          ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs"
                                          : "bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/30 opacity-70"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-1 font-bold text-slate-800 dark:text-white">
                                        <span>{rules?.name || `শিফট ${sIdx + 1}`}</span>
                                        <span className="text-[10px] text-slate-400">
                                          {rules?.nameEnglish}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500">প্রবেশ:</span>
                                        {hasIn ? (
                                          <span className="font-mono font-bold">
                                            {formatDisplayTime(sRecord.checkInTime)}{" "}
                                            <span
                                              className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                                sRecord.checkInStatus === "On Time"
                                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                              }`}
                                            >
                                              {sRecord.checkInStatus}
                                            </span>
                                          </span>
                                        ) : (
                                          <span className="text-slate-400">অনুপস্থিত</span>
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500">প্রস্থান:</span>
                                        {hasOut ? (
                                          <span className="font-mono font-bold">
                                            {formatDisplayTime(sRecord.checkOutTime)}{" "}
                                            <span
                                              className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                                sRecord.checkOutStatus === "On Time"
                                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                              }`}
                                            >
                                              {sRecord.checkOutStatus}
                                            </span>
                                          </span>
                                        ) : (
                                          <span className="text-slate-400">অপেক্ষমান</span>
                                        )}
                                      </div>

                                      {(sRecord?.checkInComment || sRecord?.checkOutComment) && (
                                        <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] space-y-0.5">
                                          {sRecord.checkInComment && (
                                            <div className="text-rose-700 dark:text-rose-300 truncate">
                                              <strong>দেরি:</strong> {sRecord.checkInComment}
                                            </div>
                                          )}
                                          {sRecord.checkOutComment && (
                                            <div className="text-amber-700 dark:text-amber-300 truncate">
                                              <strong>আর্লি:</strong> {sRecord.checkOutComment}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Late / Early Exit Comment Modal */}
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2.5 rounded-2xl ${
                    commentModalType === "late"
                      ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                      : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {targetShiftId && activeShiftRules?.[targetShiftId]
                      ? `${activeShiftRules[targetShiftId].name}: ${
                          commentModalType === "late"
                            ? "দেরিতে উপস্থিতির কারণ"
                            : "সময়ের পূর্বে প্রস্থানের কারণ"
                        }`
                      : commentModalType === "late"
                      ? "দেরিতে উপস্থিতির কারণ"
                      : "সময়ের পূর্বে প্রস্থানের কারণ"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {targetShiftId && activeShiftRules?.[targetShiftId]
                      ? commentModalType === "late"
                        ? `নির্ধারিত সময় (${activeShiftRules[targetShiftId].checkInWindowLabel}) অতিক্রান্ত হয়েছে`
                        : `নির্ধারিত সময় (${activeShiftRules[targetShiftId].checkOutWindowLabel}) এর পূর্বে প্রস্থান করছেন`
                      : commentModalType === "late"
                      ? "নির্ধারিত সময় (সকাল ৮:০৫) এর পরে প্রবেশ করছেন"
                      : "নির্ধারিত সময় (দুপুর ১:১০) এর পূর্বে প্রস্থান করছেন"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCommentModalOpen(false);
                  setTargetShiftId(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              {commentModalType === "late"
                ? "অনুগ্রহ করে দেরিতে আসার সুনির্দিষ্ট কারণ উল্লেখ করুন। এটি প্রশাসন প্যানেলে সংরক্ষিত হবে।"
                : "অনুগ্রহ করে নির্ধারিত সময়ের পূর্বে মাদ্রাসা ত্যাগের কারণ উল্লেখ করুন। এটি প্রশাসন প্যানেলে সংরক্ষিত হবে।"}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                মন্তব্য / কারণ লিখুন:
              </label>
              <textarea
                rows={3}
                value={attendanceComment}
                onChange={(e) => setAttendanceComment(e.target.value)}
                placeholder={
                  commentModalType === "late"
                    ? "যেমন: রাস্তায় যানজটের কারণে অথবা শারীরিক অসুস্থতা..."
                    : "যেমন: জরুরি পারিবারিক প্রয়োজন অথবা শারীরিক অসুস্থতা..."
                }
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCommentModalOpen(false);
                  setTargetShiftId(null);
                }}
                disabled={submittingCheckIn || submittingCheckOut || !!submittingShiftId}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  if (targetShiftId) {
                    if (commentModalType === "late") {
                      executeShiftCheckIn(targetShiftId, attendanceComment);
                    } else {
                      executeShiftCheckOut(targetShiftId, attendanceComment);
                    }
                  } else {
                    if (commentModalType === "late") {
                      executeCheckIn(attendanceComment);
                    } else {
                      executeCheckOut(attendanceComment);
                    }
                  }
                }}
                disabled={submittingCheckIn || submittingCheckOut || !!submittingShiftId}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 active:scale-[0.98] transition disabled:opacity-50"
              >
                {submittingCheckIn || submittingCheckOut || !!submittingShiftId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>জমা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>জমা দিন ও নিশ্চিত করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
