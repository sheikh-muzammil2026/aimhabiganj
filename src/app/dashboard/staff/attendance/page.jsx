"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  RefreshCw,
  LogOut,
  LogIn,
  History,
  Sparkles,
  X,
  Send,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  MADRASA_LOCATION,
  isWithinMadrasaGeofence,
  evaluateStaffCheckInStatus,
  evaluateStaffCheckOutStatus,
  formatDhakaTimeWithSeconds,
  formatDhakaTimeOnly,
  formatDhakaDateBangla as formatDisplayDate,
} from "@/lib/attendance-config";
import { useAttendanceGeolocation } from "@/hooks/useAttendanceGeolocation";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const STAFF_I18N = {
  bn: {
    badge: "স্টাফ ডিজিটাল হাজিরা ব্যবস্থা • প্রতিদিন ২ টার্ম",
    title: "দৈনিক হাজিরা পোর্টাল (২ টার্ম)",
    bdTimeLabel: "বাংলাদেশ সময় (UTC+6)",
    term1Title: "১ম টার্ম: সকালের প্রবেশ হাজিরা",
    term1WindowBadge: "ভোর ০৫:৩০ টা পর্যন্ত",
    term1RuleOnTimeLabel: "সময়মতো (On Time):",
    term1RuleOnTimeText:
      "ভোর ৫:৩০ এর পূর্বে বা ৫:৩০ পর্যন্ত হাজিরা দিলে অন-টাইম গণ্য হবে।",
    term1RuleLateLabel: "দেরিতে (Late):",
    term1RuleLateText:
      "ভোর ৫:৩০ এর পর প্রবেশ করলে লেট কাউন্ট হবে এবং দেরির কারণ উল্লেখ করতে হবে।",
    todayStatusLabel: "আজকের অবস্থা:",
    completedLabel: "সম্পন্ন",
    term1OpenOnTime: "উইন্ডো উন্মুক্ত (অন-টাইম চলমান)",
    term1LateWindow: "ভোর ৫:৩০ অতিক্রান্ত (লেট উইন্ডো)",
    term2Title: "২য় টার্ম: রাতের প্রস্থান হাজিরা",
    term2WindowBadge: "রাত ১০:০০ - ১০:১০ টা",
    term2RuleOnTimeLabel: "নির্ধারিত সময় (On Time):",
    term2RuleOnTimeText:
      "রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে প্রস্থান হাজিরা দেওয়া বাধ্যতামূলক।",
    term2RuleEarlyLabel: "আগাম প্রস্থান (Early):",
    term2RuleEarlyText:
      "রাত ১০:০০ এর পূর্বে প্রস্থান দিলে আর্লি এক্সিট হিসেবে গণ্য হবে।",
    term2OpenNow: "উইন্ডো উন্মুক্ত! (রাত ১০:০০ - ১০:১০)",
    term2Waiting: "উইন্ডো শুরু হতে বাকি (রাত ১০:০০ টায়)",
    term2Overtime: "রাত ১০:১০ অতিক্রান্ত (ওভারটাইম / লেট এক্সিট)",
    gpsHeader: "মাদরাসা প্রাঙ্গণ ও GPS অবস্থান",
    gpsErrorBadge: "GPS ত্রুটি / পারমিশন নেই",
    gpsInsideBadge: "ক্যাম্পাসের ভেতরে অবস্থিত",
    gpsOutsideBadge: "ক্যাম্পাসের বাইরে",
    gpsDistanceWord: "দূরত্ব",
    gpsMeterWord: "মিটার",
    gpsSearching: "অবস্থান অনুসন্ধান চলছে...",
    gpsNotVerified: "অবস্থান যাচাই করা হয়নি",
    allowedRadius: "অনুমোদিত ব্যাসার্ধ",
    gpsAccuracy: "GPS নির্ভুলতা",
    locatingBtn: "শনাক্ত হচ্ছে...",
    refreshGpsBtn: "GPS রিফ্রেশ করুন",
    subCard1Top: "১ম টার্ম: প্রবেশ হাজিরা (সকাল)",
    subCard1Deadline: "শেষ সময়: ০৫:৩০ AM",
    subCard1TitleDone: "১ম টার্ম সফলভাবে সম্পন্ন",
    subCard1TitlePending: "১ম টার্মের হাজিরা দিন",
    subCard1DescDonePrefix: "আপনি আজ সকাল",
    subCard1DescDoneMid: "টায় ১ম টার্মের প্রবেশ হাজিরা দিয়েছেন। স্ট্যাটাস:",
    subCard1DescPending:
      "ভোর ৫:৩০ টার মধ্যে আপনার সকালের উপস্থিতি নিশ্চিত করুন। ৫:৩০ এর পর হাজিরা দিলে দেরির কারণসহ লেট হিসেবে লিপিবদ্ধ হবে।",
    subCard1ConfirmedBanner:
      "আজকের ১ম টার্মের প্রবেশ হাজিরা ইতিমধ্যে নিশ্চিত করা হয়েছে",
    verifyingBtn: "যাচাই হচ্ছে...",
    subCard1Btn: "১ম টার্ম: প্রবেশ হাজিরা সাবমিট করুন",
    subCard2Top: "২য় টার্ম: প্রস্থান হাজিরা (রাত)",
    subCard2Window: "উইন্ডো: ১০:০০ - ১০:১০ PM",
    subCard2TitleDone: "২য় টার্ম সফলভাবে সম্পন্ন",
    subCard2TitlePending: "২য় টার্মের হাজিরা দিন",
    subCard2DescDonePrefix: "আপনি আজ রাত",
    subCard2DescDoneMid: "টায় প্রস্থান হাজিরা দিয়েছেন। স্ট্যাটাস:",
    totalWorkLabel: "মোট কাজ",
    subCard2DescPending:
      "রাতের নির্ধারিত সময়সূচী অনুযায়ী রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে আপনার প্রস্থান হাজিরা সাবমিট করুন।",
    subCard2ConfirmedBanner:
      "আজকের ২য় টার্মের প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে",
    subCard2NeedCheckIn:
      "প্রস্থান হাজিরা দেওয়ার জন্য প্রথমে ১ম টার্মের প্রবেশ হাজিরা সম্পন্ন করুন।",
    subCard2Btn: "২য় টার্ম: প্রস্থান হাজিরা সাবমিট করুন",
    onTimeSuffix: "(সময়মতো)",
    monthlyStatsTitle: "চলতি মাসের সামগ্রিক পরিসংখ্যান",
    totalWorkingDays: "মোট কর্মদিবস",
    daysUnit: "দিন",
    hoursUnit: "ঘণ্টা",
    onTimeRateLabel: "সময়মতো উপস্থিতি",
    selectMonthLabel: "মাস নির্বাচন:",
    metricPresentDays: "উপস্থিত দিন",
    metricTerm1OnTime: "১ম টার্ম অন-টাইম",
    metricTerm1Late: "১ম টার্ম লেট",
    metricTerm2OnTime: "২য় টার্ম অন-টাইম",
    metricEarlyExit: "সময়ের পূর্বে প্রস্থান",
    metricTotalHours: "মোট কর্মঘণ্টা",
    historyTitle: "বিগত দিনগুলোর হাজিরার লগ",
    historyCountPrefix: "সর্বশেষ",
    historyCountSuffix: "টি রেকর্ড",
    historyLoading: "হাজিরা হিস্টোরি লোড হচ্ছে...",
    historyEmpty: "কোনো পূর্ববর্তী রেকর্ড পাওয়া যায়নি।",
    colDate: "তারিখ",
    colTerm1: "১ম টার্ম (সকাল ৫:৩০)",
    colTerm2: "২য় টার্ম (রাত ১০:০০-১০:১০)",
    colDuration: "মোট কর্মঘণ্টা",
    colComment: "মন্তব্য",
    absentText: "অনুপস্থিত",
    incompleteText: "অসম্পূর্ণ",
    modalTitleLate: "১ম টার্ম: দেরিতে চেক-ইন এর কারণ",
    modalTitleEarly: "২য় টার্ম: সময়ের পূর্বে প্রস্থানের কারণ",
    modalTitleOvertime: "২য় টার্ম: বিলম্বিত প্রস্থানের কারণ",
    modalDescLate:
      "ভোর ৫:৩০ টা অতিক্রান্ত হয়েছে। অনুগ্রহ করে দেরির সুনির্দিষ্ট কারণ উল্লেখ করে হাজিরা সাবমিট করুন।",
    modalDescEarly:
      "এখন রাত ১০:০০ টা বাজেনি। অফিসিয়াল সময়সূচীর পূর্বে প্রস্থান করার কারণ উল্লেখ করুন।",
    modalDescOvertime:
      "রাত ১০:১০ অতিক্রান্ত হয়েছে। অতিরিক্ত সময়ের কারণ উল্লেখ করুন।",
    modalPlaceholder: "এখানে কারণ বা মন্তব্য লিখুন...",
    cancelBtn: "বাতিল",
    confirmSubmitBtn: "নিশ্চিত করুন ও সাবমিট",
  },
  en: {
    badge: "Staff Digital Attendance System • 2 Terms Daily",
    title: "Daily Attendance Portal (2 Terms)",
    bdTimeLabel: "Bangladesh Time (UTC+6)",
    term1Title: "Term 1: Morning Check-In",
    term1WindowBadge: "Up to 05:30 AM",
    term1RuleOnTimeLabel: "On Time:",
    term1RuleOnTimeText:
      "Checking in on or before 5:30 AM is recorded as On Time.",
    term1RuleLateLabel: "Late:",
    term1RuleLateText:
      "Checking in after 5:30 AM is marked Late and requires a valid reason.",
    todayStatusLabel: "Today's Status:",
    completedLabel: "Completed",
    term1OpenOnTime: "Window Open (On-Time Active)",
    term1LateWindow: "Past 5:30 AM (Late Window)",
    term2Title: "Term 2: Night Check-Out",
    term2WindowBadge: "10:00 PM - 10:10 PM",
    term2RuleOnTimeLabel: "Scheduled Window (On Time):",
    term2RuleOnTimeText:
      "Check-out must be submitted between 10:00 PM and 10:10 PM.",
    term2RuleEarlyLabel: "Early Exit:",
    term2RuleEarlyText:
      "Checking out before 10:00 PM is recorded as an Early Exit.",
    term2OpenNow: "Window Open! (10:00 PM - 10:10 PM)",
    term2Waiting: "Window Opens at 10:00 PM",
    term2Overtime: "Past 10:10 PM (Overtime / Late Exit)",
    gpsHeader: "Madrasah Campus & GPS Location",
    gpsErrorBadge: "GPS Error / No Permission",
    gpsInsideBadge: "Inside Campus",
    gpsOutsideBadge: "Outside Campus",
    gpsDistanceWord: "Distance",
    gpsMeterWord: "m",
    gpsSearching: "Locating GPS...",
    gpsNotVerified: "Location Not Verified",
    allowedRadius: "Allowed Radius",
    gpsAccuracy: "GPS Accuracy",
    locatingBtn: "Locating...",
    refreshGpsBtn: "Refresh GPS",
    subCard1Top: "Term 1: Morning Check-In",
    subCard1Deadline: "Deadline: 05:30 AM",
    subCard1TitleDone: "Term 1 Completed Successfully",
    subCard1TitlePending: "Submit Term 1 Attendance",
    subCard1DescDonePrefix: "You checked in today at",
    subCard1DescDoneMid: "for Term 1. Status:",
    subCard1DescPending:
      "Confirm your morning check-in by 5:30 AM. Entries after 5:30 AM require a reason and are marked Late.",
    subCard1ConfirmedBanner:
      "Today's Term 1 Check-In has already been confirmed",
    verifyingBtn: "Verifying...",
    subCard1Btn: "Submit Term 1 Check-In",
    subCard2Top: "Term 2: Night Check-Out",
    subCard2Window: "Window: 10:00 - 10:10 PM",
    subCard2TitleDone: "Term 2 Completed Successfully",
    subCard2TitlePending: "Submit Term 2 Attendance",
    subCard2DescDonePrefix: "You checked out tonight at",
    subCard2DescDoneMid: "for Term 2. Status:",
    totalWorkLabel: "Total Work",
    subCard2DescPending:
      "Submit your night check-out between 10:00 PM and 10:10 PM according to the official schedule.",
    subCard2ConfirmedBanner:
      "Today's Term 2 Check-Out has been confirmed",
    subCard2NeedCheckIn:
      "Please complete Term 1 Morning Check-In first before checking out.",
    subCard2Btn: "Submit Term 2 Check-Out",
    onTimeSuffix: "(On Time)",
    monthlyStatsTitle: "Current Month Summary Statistics",
    totalWorkingDays: "Present Days",
    daysUnit: "days",
    hoursUnit: "hrs",
    onTimeRateLabel: "On-Time Rate",
    selectMonthLabel: "Select Month:",
    metricPresentDays: "Present Days",
    metricTerm1OnTime: "Term 1 On-Time",
    metricTerm1Late: "Term 1 Late",
    metricTerm2OnTime: "Term 2 On-Time",
    metricEarlyExit: "Early Exit",
    metricTotalHours: "Total Hours",
    historyTitle: "Recent Attendance History Log",
    historyCountPrefix: "Last",
    historyCountSuffix: "records",
    historyLoading: "Loading attendance history...",
    historyEmpty: "No previous attendance records found.",
    colDate: "Date",
    colTerm1: "Term 1 (05:30 AM)",
    colTerm2: "Term 2 (10:00-10:10 PM)",
    colDuration: "Total Hours",
    colComment: "Remarks",
    absentText: "Absent",
    incompleteText: "Incomplete",
    modalTitleLate: "Term 1: Reason for Late Check-In",
    modalTitleEarly: "Term 2: Reason for Early Check-Out",
    modalTitleOvertime: "Term 2: Reason for Late Check-Out",
    modalDescLate:
      "It is past 5:30 AM. Please specify the reason for your late arrival to submit attendance.",
    modalDescEarly:
      "It is before 10:00 PM. Please provide the reason for leaving before the scheduled time.",
    modalDescOvertime:
      "It is past 10:10 PM. Please specify the reason for overtime/delayed check-out.",
    modalPlaceholder: "Write your reason or remarks here...",
    cancelBtn: "Cancel",
    confirmSubmitBtn: "Confirm & Submit",
  },
  ar: {
    badge: "نظام الحضور الرقمي للموظفين • فترتان يومياً",
    title: "بوابة الحضور اليومي (فترتان)",
    bdTimeLabel: "توقيت بنغلاديش (UTC+6)",
    term1Title: "الفترة الأولى: تسجيل الدخول الصباحي",
    term1WindowBadge: "حتى ٠٥:٣٠ صباحاً",
    term1RuleOnTimeLabel: "في الوقت المحدد (On Time):",
    term1RuleOnTimeText:
      "التسجيل قبل أو حتى الساعة ٥:٣٠ صباحاً يُحتسب في الموعد المحدد.",
    term1RuleLateLabel: "متأخر (Late):",
    term1RuleLateText:
      "التسجيل بعد الساعة ٥:٣٠ صباحاً يُحتسب تأخراً ويتطلب ذكر السبب.",
    todayStatusLabel: "حالة اليوم:",
    completedLabel: "مكتمل",
    term1OpenOnTime: "النافذة مفتوحة (في الوقت المحدد)",
    term1LateWindow: "تجاوز ٥:٣٠ صباحاً (فترة التأخير)",
    term2Title: "الفترة الثانية: تسجيل الانصراف المسائي",
    term2WindowBadge: "١٠:٠٠ - ١٠:١٠ مساءً",
    term2RuleOnTimeLabel: "الوقت المحدد (On Time):",
    term2RuleOnTimeText:
      "يجب تسجيل الانصراف المسائي بين الساعة ١٠:٠٠ و ١٠:١٠ مساءً.",
    term2RuleEarlyLabel: "انصراف مبكر (Early):",
    term2RuleEarlyText:
      "الانصراف قبل الساعة ١٠:٠٠ مساءً يُسجل كانصراف مبكر.",
    term2OpenNow: "النافذة مفتوحة الآن! (١٠:٠٠ - ١٠:١٠ م)",
    term2Waiting: "تفتح النافذة الساعة ١٠:٠٠ مساءً",
    term2Overtime: "تجاوز ١٠:١٠ مساءً (وقت إضافي)",
    gpsHeader: "حرم المدرسة وموقع GPS",
    gpsErrorBadge: "خطأ في GPS / لا يوجد إذن",
    gpsInsideBadge: "داخل حرم المدرسة",
    gpsOutsideBadge: "خارج حرم المدرسة",
    gpsDistanceWord: "المسافة",
    gpsMeterWord: "متر",
    gpsSearching: "جاري تحديد الموقع...",
    gpsNotVerified: "لم يتم التحقق من الموقع",
    allowedRadius: "النطاق المسموح",
    gpsAccuracy: "دقة GPS",
    locatingBtn: "جاري التحديد...",
    refreshGpsBtn: "تحديث GPS",
    subCard1Top: "الفترة الأولى: حضور الصباح",
    subCard1Deadline: "آخر موعد: ٠٥:٣٠ ص",
    subCard1TitleDone: "اكتملت الفترة الأولى بنجاح",
    subCard1TitlePending: "تسجيل حضور الفترة الأولى",
    subCard1DescDonePrefix: "لقد سجلت حضورك اليوم الساعة",
    subCard1DescDoneMid: "الحالة:",
    subCard1DescPending:
      "أكد حضورك الصباحي قبل الساعة ٥:٣٠ صباحاً. التسجيل بعد ذلك يتطلب ذكر سبب التأخير.",
    subCard1ConfirmedBanner: "تم تأكيد حضور الفترة الأولى لهذا اليوم بنجاح",
    verifyingBtn: "جاري التحقق...",
    subCard1Btn: "إرسال حضور الفترة الأولى",
    subCard2Top: "الفترة الثانية: انصراف المساء",
    subCard2Window: "النافذة: ١٠:٠٠ - ١٠:١٠ م",
    subCard2TitleDone: "اكتملت الفترة الثانية بنجاح",
    subCard2TitlePending: "تسجيل انصراف الفترة الثانية",
    subCard2DescDonePrefix: "لقد سجلت انصرافك الليلة الساعة",
    subCard2DescDoneMid: "الحالة:",
    totalWorkLabel: "إجمالي العمل",
    subCard2DescPending:
      "يرجى تسجيل الانصراف المسائي بين الساعة ١٠:٠٠ و ١٠:١٠ مساءً حسب الجدول الرسمي.",
    subCard2ConfirmedBanner: "تم تأكيد انصراف الفترة الثانية لهذا اليوم بنجاح",
    subCard2NeedCheckIn:
      "يرجى إتمام تسجيل حضور الفترة الأولى أولاً قبل تسجيل الانصراف.",
    subCard2Btn: "إرسال انصراف الفترة الثانية",
    onTimeSuffix: "(في الموعد)",
    monthlyStatsTitle: "إحصائيات الشهر الحالي",
    totalWorkingDays: "أيام الحضور",
    daysUnit: "يوم",
    hoursUnit: "ساعة",
    onTimeRateLabel: "نسبة الانضباط",
    selectMonthLabel: "اختر الشهر:",
    metricPresentDays: "أيام الحضور",
    metricTerm1OnTime: "فترة ١ في الموعد",
    metricTerm1Late: "فترة ١ متأخر",
    metricTerm2OnTime: "فترة ٢ في الموعد",
    metricEarlyExit: "انصراف مبكر",
    metricTotalHours: "إجمالي الساعات",
    historyTitle: "سجل الحضور للأيام السابقة",
    historyCountPrefix: "آخر",
    historyCountSuffix: "سجلات",
    historyLoading: "جاري تحميل سجل الحضور...",
    historyEmpty: "لا توجد سجلات حضور سابقة.",
    colDate: "التاريخ",
    colTerm1: "الفترة الأولى (٠٥:٣٠ ص)",
    colTerm2: "الفترة الثانية (١٠:٠٠-١٠:١٠ م)",
    colDuration: "ساعات العمل",
    colComment: "ملاحظات",
    absentText: "غائب",
    incompleteText: "غير مكتمل",
    modalTitleLate: "الفترة الأولى: سبب التأخير في الحضور",
    modalTitleEarly: "الفترة الثانية: سبب الانصراف المبكر",
    modalTitleOvertime: "الفترة الثانية: سبب تأخر الانصراف",
    modalDescLate:
      "لقد تجاوزت الساعة ٥:٣٠ صباحاً. يرجى كتابة سبب التأخير لتأكيد الحضور.",
    modalDescEarly:
      "لم تحن الساعة ١٠:٠٠ مساءً بعد. يرجى ذكر سبب الانصراف المبكر.",
    modalDescOvertime:
      "تجاوزت الساعة ١٠:١٠ مساءً. يرجى ذكر سبب العمل الإضافي أو التأخير.",
    modalPlaceholder: "اكتب السبب أو الملاحظة هنا...",
    cancelBtn: "إلغاء",
    confirmSubmitBtn: "تأكيد وإرسال",
  },
};

export default function StaffAttendancePage() {
  const { language } = useLanguage();
  const text = STAFF_I18N[language] || STAFF_I18N.bn;

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const sessionUser = session?.user;

  // Real-time & Geolocation state via shared hook
  const {
    currentTime,
    currentCoords,
    locationError,
    isLocating,
    geofenceStatus,
    requestLocation,
  } = useAttendanceGeolocation({
    passAccuracyToGeofence: true,
    unsupportedMessage: "আপনার ডিভাইসে Geolocation সমর্থিত নয়।",
    unsupportedToastType: "warning",
  });

  const [loadingToday, setLoadingToday] = useState(true);
  const [todayData, setTodayData] = useState(null);
  const [shiftPhase, setShiftPhase] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Late / Early Comment Modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentModalType, setCommentModalType] = useState("late"); // "late" | "early" | "overtime"
  const [attendanceComment, setAttendanceComment] = useState("");

  // Submission loading states
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);

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

      const res = await fetch(
        `${API_BASE}/api/staff/attendance/history?${queryParams.toString()}`,
        {
          headers: email ? { "x-user-email": email } : {},
        }
      );
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

  // Verify GPS & Geofence before allowing Check-In or Check-Out
  const verifyGeofenceBeforeAction = () => {
    if (!currentCoords) {
      toast.info(
        "আপনার GPS অবস্থান যাচাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..."
      );
      requestLocation();
      return false;
    }

    if (
      currentCoords.accuracy &&
      MADRASA_LOCATION.MAX_ALLOWED_ACCURACY_METERS &&
      currentCoords.accuracy > MADRASA_LOCATION.MAX_ALLOWED_ACCURACY_METERS
    ) {
      toast.error(
        `আপনার GPS সংকেত দুর্বল (±${currentCoords.accuracy} মিটার)। অনুগ্রহ করে খোলা স্থানে গিয়ে 'GPS রিফ্রেশ করুন' বাটনে ক্লিক করুন।`
      );
      return false;
    }

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng,
      MADRASA_LOCATION.RADIUS_METERS,
      currentCoords.accuracy
    );

    if (!verification.isInside) {
      toast.error(
        `হাজিরা দিতে আপনাকে মাদরাসা প্রাঙ্গণে (${verification.threshold} মিটারের মধ্যে) থাকতে হবে। আপনার বর্তমান দূরত্ব: ${verification.distance} মিটার।`
      );
      return false;
    }

    return true;
  };

  // 5. Term 1 Check-In API Handler
  const handleCheckInClick = () => {
    if (!verifyGeofenceBeforeAction()) return;

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

    if (!verifyGeofenceBeforeAction()) return;

    try {
      setSubmittingCheckIn(true);
      const res = await fetch(`${API_BASE}/api/staff/attendance/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          accuracy: currentCoords.accuracy,
          checkInComment: comment,
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

      toast.success(
        data.message || "১ম টার্মের প্রবেশ হাজিরা সফলভাবে নিশ্চিত হয়েছে!"
      );
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
    if (!verifyGeofenceBeforeAction()) return;

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

    if (!verifyGeofenceBeforeAction()) return;

    try {
      setSubmittingCheckOut(true);
      const res = await fetch(`${API_BASE}/api/staff/attendance/check-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          accuracy: currentCoords.accuracy,
          checkOutComment: comment,
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

      toast.success(
        data.message || "২য় টার্মের প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে!"
      );
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* ================= 1. TOP HEADER & LIVE DHAKA CLOCK ================= */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-400/60 via-emerald-500/40 to-amber-500/50 shadow-[0_20px_60px_-15px_rgba(2,32,20,0.35)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.12)] overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#021d12] via-[#04301f] to-[#021d12] dark:from-[#010906] dark:via-[#031b11] dark:to-[#010906] text-white rounded-[22.5px] p-6 sm:p-8 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/[0.07] backdrop-blur-md rounded-full border border-amber-400/35 text-xs font-bold text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{text.badge}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent tracking-tight">
                {text.title}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{formatDisplayDate(currentTime)}</span>
              </p>
            </div>

            {/* Live Clock Card */}
            <div className="bg-[#01110b]/75 dark:bg-[#010805]/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-amber-400/30 shadow-[inset_0_1px_1px_rgba(251,191,36,0.2),0_10px_30px_rgba(0,0,0,0.4)] text-center md:text-end shrink-0 w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-end gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{text.bdTimeLabel}</span>
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent tracking-wider">
                {formatDhakaTimeWithSeconds(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TWO-TERM POLICY & SCHEDULE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Term 1 Card */}
        <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/45 via-emerald-600/20 to-slate-200 dark:from-amber-400/50 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.08)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
          <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-5 sm:p-6 space-y-3.5 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-amber-300 flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{text.term1Title}</span>
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-50 dark:bg-amber-400/10 text-emerald-900 dark:text-amber-300 border border-emerald-200 dark:border-amber-400/30">
                {text.term1WindowBadge}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              <p>
                • <strong className="text-slate-900 dark:text-amber-200">{text.term1RuleOnTimeLabel}</strong>{" "}
                {text.term1RuleOnTimeText}
              </p>
              <p>
                • <strong className="text-slate-900 dark:text-amber-200">{text.term1RuleLateLabel}</strong>{" "}
                {text.term1RuleLateText}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-emerald-800/40 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-emerald-200/70 font-semibold">
                {text.todayStatusLabel}
              </span>
              {hasCheckedIn ? (
                <span
                  className={`font-black flex items-center gap-1 ${
                    todayData.checkInStatus === "On Time"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-amber-600 dark:text-amber-300"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {text.completedLabel} ({formatDhakaTimeOnly(todayData.checkInTime)}) -{" "}
                    {todayData.checkInStatus}
                  </span>
                </span>
              ) : liveCheckInStatus === "On Time" ? (
                <span className="text-emerald-600 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {text.term1OpenOnTime}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {text.term1LateWindow}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Term 2 Card */}
        <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/45 via-emerald-600/20 to-slate-200 dark:from-amber-400/50 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.08)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
          <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-5 sm:p-6 space-y-3.5 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-600 via-amber-400 to-teal-600" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-amber-300 flex items-center gap-1.5">
                <LogOut className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{text.term2Title}</span>
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-teal-50 dark:bg-amber-400/10 text-teal-900 dark:text-amber-300 border border-teal-200 dark:border-amber-400/30">
                {text.term2WindowBadge}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              <p>
                • <strong className="text-slate-900 dark:text-amber-200">{text.term2RuleOnTimeLabel}</strong>{" "}
                {text.term2RuleOnTimeText}
              </p>
              <p>
                • <strong className="text-slate-900 dark:text-amber-200">{text.term2RuleEarlyLabel}</strong>{" "}
                {text.term2RuleEarlyText}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-emerald-800/40 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-emerald-200/70 font-semibold">
                {text.todayStatusLabel}
              </span>
              {hasCheckedOut ? (
                <span
                  className={`font-black flex items-center gap-1 ${
                    todayData.checkOutStatus === "On Time"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : todayData.checkOutStatus === "Early"
                        ? "text-rose-600 dark:text-rose-300"
                        : "text-amber-600 dark:text-amber-300"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {text.completedLabel} ({formatDhakaTimeOnly(todayData.checkOutTime)}) -{" "}
                    {todayData.checkOutStatus}
                  </span>
                </span>
              ) : liveCheckOutStatus === "On Time" ? (
                <span className="text-emerald-600 dark:text-emerald-300 font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {text.term2OpenNow}
                </span>
              ) : liveCheckOutStatus === "Early" ? (
                <span className="text-slate-500 dark:text-emerald-200/60 font-semibold">
                  {text.term2Waiting}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-300 font-bold">
                  {text.term2Overtime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. GPS LOCATION / GEOFENCE STATUS ================= */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-4 sm:p-5 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ring-1 ${
                  locationError
                    ? "bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-500/40"
                    : geofenceStatus?.isInside
                      ? "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-500/40"
                      : currentCoords
                        ? "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-400/40"
                        : "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/[0.06] dark:text-amber-300 dark:ring-amber-400/30"
                }`}
              >
                <MapPin className="w-5 h-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {text.gpsHeader}
                  </h4>
                  {locationError ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 text-[10px] font-black border border-rose-300 dark:border-rose-500/40">
                      {text.gpsErrorBadge}
                    </span>
                  ) : geofenceStatus?.isInside ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-500/40">
                      {text.gpsInsideBadge} ({geofenceStatus.distance} {text.gpsMeterWord})
                    </span>
                  ) : currentCoords ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-black border border-amber-300 dark:border-amber-400/40">
                      {text.gpsOutsideBadge} ({text.gpsDistanceWord}:{" "}
                      {geofenceStatus?.distance} {text.gpsMeterWord})
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-emerald-100/75 text-[10px] font-bold">
                      {isLocating ? text.gpsSearching : text.gpsNotVerified}
                    </span>
                  )}
                </div>
                {locationError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                    {locationError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-emerald-100/70 mt-0.5">
                    {MADRASA_LOCATION.NAME} • {text.allowedRadius}:{" "}
                    {MADRASA_LOCATION.RADIUS_METERS} {text.gpsMeterWord}
                    {geofenceStatus?.accuracy
                      ? ` • ${text.gpsAccuracy}: ±${geofenceStatus.accuracy} ${text.gpsMeterWord}`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => requestLocation()}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#022014] to-emerald-900 dark:from-amber-400/15 dark:to-emerald-500/15 hover:from-emerald-900 hover:to-emerald-800 text-amber-200 dark:text-amber-300 border border-amber-400/35 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`}
              />
              <span>{isLocating ? text.locatingBtn : text.refreshGpsBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4. ATTENDANCE SUBMISSION ACTION CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Term 1 Submission Card */}
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/55 via-emerald-500/30 to-emerald-700/30 shadow-[0_18px_50px_-15px_rgba(2,32,20,0.14)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.1)]">
          <div className="relative h-full bg-gradient-to-br from-white via-[#f9fcfb] to-emerald-50/40 dark:from-[#052619] dark:via-[#031810] dark:to-[#010a06] rounded-[22.5px] p-6 sm:p-7 flex flex-col justify-between space-y-5 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.2)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-amber-300">
                  <LogIn className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  {text.subCard1Top}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-emerald-200/75">
                  {text.subCard1Deadline}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {hasCheckedIn ? text.subCard1TitleDone : text.subCard1TitlePending}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                {hasCheckedIn ? (
                  <>
                    {text.subCard1DescDonePrefix}{" "}
                    <strong className="text-slate-900 dark:text-amber-200">
                      {formatDhakaTimeOnly(todayData.checkInTime)}
                    </strong>{" "}
                    {text.subCard1DescDoneMid}{" "}
                    <strong
                      className={
                        todayData.checkInStatus === "On Time"
                          ? "text-emerald-600 dark:text-emerald-300"
                          : "text-amber-600 dark:text-amber-300"
                      }
                    >
                      {todayData.checkInStatus}
                    </strong>
                    {todayData.checkInComment && ` (${todayData.checkInComment})`}
                  </>
                ) : (
                  text.subCard1DescPending
                )}
              </p>
            </div>

            <div>
              {hasCheckedIn ? (
                <div className="p-3.5 bg-emerald-100/80 dark:bg-emerald-500/15 rounded-2xl border border-emerald-300 dark:border-emerald-500/35 flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0" />
                  <span>{text.subCard1ConfirmedBanner}</span>
                </div>
              ) : (
                <button
                  onClick={handleCheckInClick}
                  disabled={submittingCheckIn}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-[#022014] via-emerald-900 to-emerald-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 hover:from-emerald-900 hover:to-emerald-700 text-amber-200 dark:text-slate-950 font-black rounded-2xl text-sm shadow-[0_10px_25px_rgba(2,32,20,0.25)] dark:shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submittingCheckIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{text.verifyingBtn}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{text.subCard1Btn}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Term 2 Submission Card */}
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/55 via-teal-500/30 to-emerald-700/30 shadow-[0_18px_50px_-15px_rgba(2,32,20,0.14)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.1)]">
          <div className="relative h-full bg-gradient-to-br from-white via-[#f9fcfb] to-teal-50/40 dark:from-[#042418] dark:via-[#02160f] dark:to-[#010906] rounded-[22.5px] p-6 sm:p-7 flex flex-col justify-between space-y-5 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.2)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-800 dark:text-amber-300">
                  <LogOut className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  {text.subCard2Top}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-emerald-200/75">
                  {text.subCard2Window}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {hasCheckedOut ? text.subCard2TitleDone : text.subCard2TitlePending}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                {hasCheckedOut ? (
                  <>
                    {text.subCard2DescDonePrefix}{" "}
                    <strong className="text-slate-900 dark:text-amber-200">
                      {formatDhakaTimeOnly(todayData.checkOutTime)}
                    </strong>{" "}
                    {text.subCard2DescDoneMid}{" "}
                    <strong
                      className={
                        todayData.checkOutStatus === "On Time"
                          ? "text-emerald-600 dark:text-emerald-300"
                          : "text-amber-600 dark:text-amber-300"
                      }
                    >
                      {todayData.checkOutStatus}
                    </strong>
                    {todayData.durationText &&
                      ` • ${text.totalWorkLabel}: ${todayData.durationText}`}
                  </>
                ) : (
                  text.subCard2DescPending
                )}
              </p>
            </div>

            <div>
              {hasCheckedOut ? (
                <div className="p-3.5 bg-teal-100/80 dark:bg-teal-500/15 rounded-2xl border border-teal-300 dark:border-teal-500/35 flex items-center gap-2 text-xs font-bold text-teal-900 dark:text-teal-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-300 shrink-0" />
                  <span>{text.subCard2ConfirmedBanner}</span>
                </div>
              ) : !hasCheckedIn ? (
                <div className="p-3.5 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-semibold text-slate-500 dark:text-emerald-100/60 text-center">
                  {text.subCard2NeedCheckIn}
                </div>
              ) : (
                <button
                  onClick={handleCheckOutClick}
                  disabled={submittingCheckOut}
                  className={`w-full py-3.5 px-5 font-black rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                    liveCheckOutStatus === "On Time"
                      ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 ring-2 ring-amber-300"
                      : "bg-gradient-to-r from-[#022014] via-teal-900 to-emerald-900 text-amber-200 border border-amber-400/35"
                  }`}
                >
                  {submittingCheckOut ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{text.verifyingBtn}</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>
                        {text.subCard2Btn}{" "}
                        {liveCheckOutStatus === "On Time" && text.onTimeSuffix}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5. MONTHLY STATS SUMMARY ================= */}
      {monthlyMetrics && (
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
          <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-6 space-y-4 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {text.monthlyStatsTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-100/75">
                  {text.totalWorkingDays}: {monthlyMetrics.presentDays}{" "}
                  {text.daysUnit} • {text.onTimeRateLabel}:{" "}
                  {monthlyMetrics.onTimeRate}%
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-amber-300/85 font-bold">
                  {text.selectMonthLabel}
                </span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3.5 py-1.5 bg-[#f4f9f6] dark:bg-[#02140d] border border-emerald-800/15 dark:border-amber-400/30 rounded-xl text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-[#f4f9f6] dark:bg-white/[0.04] p-3.5 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-emerald-100/70 block">
                  {text.metricPresentDays}
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
                  {monthlyMetrics.presentDays} {text.daysUnit}
                </span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-200/70 dark:border-emerald-500/25 text-center">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  {text.metricTerm1OnTime}
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-200 mt-0.5 block">
                  {monthlyMetrics.onTimeCheckIns} {text.daysUnit}
                </span>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/10 p-3.5 rounded-2xl border border-amber-200/70 dark:border-amber-400/25 text-center">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">
                  {text.metricTerm1Late}
                </span>
                <span className="text-lg font-black text-amber-700 dark:text-amber-200 mt-0.5 block">
                  {monthlyMetrics.lateCheckIns} {text.daysUnit}
                </span>
              </div>
              <div className="bg-teal-50 dark:bg-teal-500/10 p-3.5 rounded-2xl border border-teal-200/70 dark:border-teal-400/25 text-center">
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 block">
                  {text.metricTerm2OnTime}
                </span>
                <span className="text-lg font-black text-teal-700 dark:text-teal-200 mt-0.5 block">
                  {monthlyMetrics.onTimeCheckOuts} {text.daysUnit}
                </span>
              </div>
              <div className="bg-rose-50 dark:bg-rose-500/10 p-3.5 rounded-2xl border border-rose-200/70 dark:border-rose-400/25 text-center">
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block">
                  {text.metricEarlyExit}
                </span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-200 mt-0.5 block">
                  {monthlyMetrics.earlyCheckOuts} {text.daysUnit}
                </span>
              </div>
              <div className="bg-amber-50/70 dark:bg-amber-400/10 p-3.5 rounded-2xl border border-amber-300/60 dark:border-amber-400/30 text-center">
                <span className="text-[11px] font-bold text-emerald-900 dark:text-amber-300 block">
                  {text.metricTotalHours}
                </span>
                <span className="text-lg font-black text-emerald-800 dark:text-amber-200 mt-0.5 block">
                  {monthlyMetrics.totalHoursWorked} {text.hoursUnit}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. RECENT ATTENDANCE HISTORY LOG ================= */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-6 space-y-4 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/40 pb-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{text.historyTitle}</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-amber-300/80 font-semibold">
              {text.historyCountPrefix} {historyList.length}{" "}
              {text.historyCountSuffix}
            </span>
          </div>

          {loadingHistory ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-emerald-100/70">
              {text.historyLoading}
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-emerald-100/70">
              {text.historyEmpty}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f4f9f6] dark:bg-[#02140d] text-slate-600 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px] border-b border-emerald-800/10 dark:border-amber-400/20">
                    <th className="py-3.5 px-4 text-start">{text.colDate}</th>
                    <th className="py-3.5 px-4 text-start">{text.colTerm1}</th>
                    <th className="py-3.5 px-4 text-start">{text.colTerm2}</th>
                    <th className="py-3.5 px-4 text-start">{text.colDuration}</th>
                    <th className="py-3.5 px-4 text-start">{text.colComment}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-emerald-800/30">
                  {historyList.map((row, idx) => (
                    <tr
                      key={row._id || idx}
                      className="hover:bg-emerald-50/40 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {row.date}
                      </td>

                      {/* Term 1 */}
                      <td className="py-3.5 px-4">
                        {row.checkInTime ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {formatDhakaTimeOnly(row.checkInTime)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                row.checkInStatus === "On Time"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-500/30"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 dark:border-amber-400/30"
                              }`}
                            >
                              {row.checkInStatus}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">{text.absentText}</span>
                        )}
                      </td>

                      {/* Term 2 */}
                      <td className="py-3.5 px-4">
                        {row.checkOutTime ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {formatDhakaTimeOnly(row.checkOutTime)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                row.checkOutStatus === "On Time"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-500/30"
                                  : row.checkOutStatus === "Early"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/60 dark:border-rose-500/30"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 dark:border-amber-400/30"
                              }`}
                            >
                              {row.checkOutStatus}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            {text.incompleteText}
                          </span>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-emerald-100/80">
                        {row.durationText || "--"}
                      </td>

                      {/* Comments */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-emerald-100/70 max-w-xs truncate">
                        {row.checkInComment || row.checkOutComment || "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= 7. COMMENT / REASON MODAL ================= */}
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#031810] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-800/15 dark:border-amber-400/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/40 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>
                  {commentModalType === "late"
                    ? text.modalTitleLate
                    : commentModalType === "early"
                      ? text.modalTitleEarly
                      : text.modalTitleOvertime}
                </span>
              </h3>
              <button
                onClick={() => setCommentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              {commentModalType === "late"
                ? text.modalDescLate
                : commentModalType === "early"
                  ? text.modalDescEarly
                  : text.modalDescOvertime}
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                value={attendanceComment}
                onChange={(e) => setAttendanceComment(e.target.value)}
                placeholder={text.modalPlaceholder}
                className="w-full p-3 bg-[#f4f9f6] dark:bg-[#02120b] border border-emerald-800/15 dark:border-amber-400/25 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCommentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {text.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={submittingCheckIn || submittingCheckOut}
                  className="px-5 py-2 bg-gradient-to-r from-[#022014] to-emerald-800 dark:from-amber-400 dark:to-amber-500 text-amber-200 dark:text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{text.confirmSubmitBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
