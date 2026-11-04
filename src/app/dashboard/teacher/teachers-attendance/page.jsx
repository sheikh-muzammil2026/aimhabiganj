"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
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
  RESIDENTIAL_ATTENDANCE_RULES,
  HIFZ_ATTENDANCE_RULES,
  isWithinMadrasaGeofence,
  evaluateCheckInStatus,
  evaluateCheckOutStatus,
  getTeacherCategory,
  getTeacherShiftRules,
  evaluateTeacherShiftCheckIn,
  evaluateTeacherShiftCheckOut,
  getActiveTeacherShift,
  formatDhakaTimeWithSeconds as formatTimeBD,
  formatDhakaTimeOnly as formatDisplayTime,
  formatDhakaDateBangla as formatDisplayDate,
} from "@/lib/attendance-config";
import { useAttendanceGeolocation } from "@/hooks/useAttendanceGeolocation";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const TEACHER_I18N = {
  bn: {
    portalBadge: "শিক্ষক হাজিরা পোর্টাল",
    campusTag: "AIM Campus",
    pageTitle: "দৈনিক শিক্ষক হাজিরা ও প্রস্থান",
    welcomePrefix: "স্বাগতম,",
    idNotAssigned: "আইডি নির্ধারিত নয়",
    welcomeSuffix:
      "। মাদরাসা প্রাঙ্গণে অবস্থানকালীন সময়মতো প্রবেশ ও প্রস্থান হাজিরা নিশ্চিত করুন।",
    teacherIdLabel: "শিক্ষক আইডি:",
    designationLabel: "পদবি:",
    resShiftBadge: "আবাসিক শিক্ষক (৩ শিফট)",
    hifzShiftBadge: "হিফজ বিভাগীয় শিক্ষক (৩ শিফট)",
    bstLabel: "বাংলাদেশ স্ট্যান্ডার্ড সময় (BST)",
    geofenceTitle: "মাদরাসা জিওফেন্স ভেরিফিকেশন",
    locatingBadge: "অবস্থান খোঁজা হচ্ছে...",
    insideCampusBadge: "মাদরাসা ক্যাম্পাসের ভেতরে আছেন",
    outsideCampusBadge: "মাদরাসা ক্যাম্পাসের বাইরে আছেন",
    targetLabel: "লক্ষ্যস্থল:",
    allowedRadiusLabel: "অনুমোদিত পরিধি:",
    meterUnit: "মিটার",
    kmUnit: "কিমি",
    distanceLabel: "দূরত্ব:",
    refreshLocationBtn: "অবস্থান রিফ্রেশ করুন",
    threeShiftBadge: "৩ শিফট",
    resScheduleTitle: "আবাসিক শিক্ষক হাজিরা সূচি (দৈনিক ৩ শিফট)",
    hifzScheduleTitle: "হিফজ বিভাগীয় শিক্ষক হাজিরা সূচি (দৈনিক ৩ শিফট)",
    multiShiftDesc:
      "প্রতিটি শিফটে সময়মতো প্রবেশ ও প্রস্থান হাজিরা নিশ্চিত করুন। দেরিতে প্রবেশ বা নির্ধারিত সময়ের পূর্বে প্রস্থান করলে কারণ উল্লেখ করা বাধ্যতামূলক।",
    activeShiftPrefix: "বর্তমান সক্রিয়:",
    statusDone: "সম্পন্ন",
    statusOngoing: "চলমান",
    statusPending: "অপেক্ষমান",
    currentWindowTag: "বর্তমান সময়",
    checkInTimeWindow: "প্রবেশ সময়:",
    checkOutTimeWindow: "প্রস্থান সময়:",
    checkInRecord: "প্রবেশ রেকর্ড:",
    checkInStatusLabel: "প্রবেশ স্ট্যাটাস:",
    onTimeText: "সময়মতো",
    lateText: "দেরিতে (Late)",
    lateReasonLabel: "দেরির কারণ:",
    checkOutRecord: "প্রস্থান রেকর্ড:",
    checkOutStatusLabel: "প্রস্থান স্ট্যাটাস:",
    onTimeExitText: "অন-টাইম প্রস্থান",
    earlyExitText: "সময়ের পূর্বে (Early)",
    earlyReasonLabel: "পূর্বে প্রস্থানের কারণ:",
    btnCheckedIn: "প্রবেশ সম্পন্ন",
    btnCheckIn: "প্রবেশ (Check In)",
    btnCheckedOut: "প্রস্থান সম্পন্ন",
    btnCheckOut: "প্রস্থান (Check Out)",
    singleCheckInTitle: "প্রবেশ হাজিরা (Check-In)",
    singleCheckInSub:
      'সকাল ৮:০০ থেকে ৮:০৫ এর মধ্যে প্রবেশ করলে "On Time" গণ্য হবে।',
    badgeOnTime: "সময়মতো (On Time)",
    badgeLate: "দেরিতে (Late)",
    badgeNotSubmitted: "হাজিরা দেওয়া হয়নি",
    recordedTime: "রেকর্ডকৃত সময়:",
    statusField: "স্ট্যাটাস:",
    statusOnTimeArrival: "অন-টাইম উপস্থিতি",
    statusLateArrival: "দেরিতে উপস্থিতি",
    coordinatesLabel: "কো-অর্ডিনেট:",
    verifyingCheckIn: "যাচাই ও চেক-ইন হচ্ছে...",
    doneCheckInBanner: "আজকের প্রবেশ হাজিরা সম্পন্ন হয়েছে",
    confirmCheckInBtn: "প্রবেশ হাজিরা নিশ্চিত করুন (Check In)",
    singleCheckOutTitle: "প্রস্থান হাজিরা (Check-Out)",
    singleCheckOutSub:
      'দুপুর ১:১০ বা তার পরে প্রস্থান করলে "On Time" গণ্য হবে।',
    badgeOnTimeExit: "অন-টাইম প্রস্থান (On Time)",
    badgeEarlyExit: "আর্লি প্রস্থান (Early)",
    badgeNotExited: "প্রস্থান হয়নি",
    statusOnTimeDeparture: "সময়মতো প্রস্থান সম্পন্ন",
    statusEarlyDeparture: "নির্ধারিত সময়ের পূর্বে প্রস্থান",
    statusWorkOngoing: "কার্যক্রম চলমান",
    statusNeedCheckIn: "প্রবেশ হাজিরা ছাড়া সম্ভব নয়",
    verifyingCheckOut: "যাচাই ও চেক-আউট হচ্ছে...",
    doneCheckOutBanner: "আজকের প্রস্থান হাজিরা সম্পন্ন হয়েছে",
    needCheckInFirstBtn: "আগে প্রবেশ হাজিরা (Check-In) দিন",
    confirmCheckOutBtn: "প্রস্থান হাজিরা নিশ্চিত করুন (Check Out)",
    resRulesHeader: "আবাসিক শিক্ষক (৩ শিফট) হাজিরা নির্দেশিকা ও সময়সূচি",
    hifzRulesHeader:
      "হিফজ বিভাগীয় শিক্ষক (৩ শিফট) হাজিরা নির্দেশিকা ও সময়সূচি",
    regularRulesHeader: "মাদরাসা অফিস সময় ও হাজিরা নির্দেশিকা",
    ruleCard1Tag: "অফিস কার্যকাল",
    ruleCard1Val: "সকাল ৮:০০ - দুপুর ১:১০",
    ruleCard1Sub: "দৈনিক মোট ৫ ঘণ্টা ১০ মিনিট",
    ruleCard2Tag: "অন-টাইম প্রবেশ (Arrival)",
    ruleCard2Val: "সকাল ৮:০৫ বা পূর্বে",
    ruleCard2Sub: "সকাল ৮:০৫ এর পর প্রবেশ করলে Late",
    ruleCard3Tag: "অন-টাইম প্রস্থান (Departure)",
    ruleCard3Val: "দুপুর ১:১০ বা পরে",
    ruleCard3Sub: "দুপুর ১:১০ এর পূর্বে প্রস্থান Early",
    ruleCard4Tag: "লোকেশন বাধ্যবাধকতা",
    ruleCard4ValPrefix: "সর্বোচ্চ",
    ruleCard4Sub: "মাদরাসা প্রাঙ্গণের বাইরে সাবমিট হবে না",
    historyHeader: "আপনার সাম্প্রতিক হাজিরা লগ",
    refreshBtn: "রিফ্রেশ",
    loadingLogs: "লগ লোড হচ্ছে...",
    emptyLogs: "এখনও কোনো হাজিরার রেকর্ড পাওয়া যায়নি।",
    colDate: "তারিখ",
    colCheckInTime: "প্রবেশের সময়",
    colCheckInStatus: "প্রবেশ স্ট্যাটাস",
    colCheckOutTime: "প্রস্থানের সময়",
    colCheckOutStatus: "প্রস্থান স্ট্যাটাস",
    colReason: "দেরি/পূর্বে প্রস্থানের কারণ",
    shiftDetailsBtn: "শিফট বিবরণ",
    threeShiftBreakdown: "৩ শিফট বিবরণ",
    absentWord: "অনুপস্থিত",
    lateShort: "দেরি",
    earlyShort: "আর্লি",
    modalLateTitle: "দেরিতে উপস্থিতির কারণ",
    modalEarlyTitle: "সময়ের পূর্বে প্রস্থানের কারণ",
    modalShiftLateSubPrefix: "নির্ধারিত সময় (",
    modalShiftLateSubSuffix: ") অতিক্রান্ত হয়েছে",
    modalShiftEarlySubPrefix: "নির্ধারিত সময় (",
    modalShiftEarlySubSuffix: ") এর পূর্বে প্রস্থান করছেন",
    modalRegLateSub: "নির্ধারিত সময় (সকাল ৮:০৫) এর পরে প্রবেশ করছেন",
    modalRegEarlySub: "নির্ধারিত সময় (দুপুর ১:১০) এর পূর্বে প্রস্থান করছেন",
    modalLateNotice:
      "অনুগ্রহ করে দেরিতে আসার সুনির্দিষ্ট কারণ উল্লেখ করুন। এটি প্রশাসন প্যানেলে সংরক্ষিত হবে।",
    modalEarlyNotice:
      "অনুগ্রহ করে নির্ধারিত সময়ের পূর্বে মাদ্রাসা ত্যাগের কারণ উল্লেখ করুন। এটি প্রশাসন প্যানেলে সংরক্ষিত হবে।",
    modalInputLabel: "মন্তব্য / কারণ লিখুন:",
    modalLatePlaceholder:
      "যেমন: রাস্তায় যানজটের কারণে অথবা শারীরিক অসুস্থতা...",
    modalEarlyPlaceholder:
      "যেমন: জরুরি পারিবারিক প্রয়োজন অথবা শারীরিক অসুস্থতা...",
    cancelBtn: "বাতিল করুন",
    submittingBtn: "জমা হচ্ছে...",
    submitConfirmBtn: "জমা দিন ও নিশ্চিত করুন",
  },
  en: {
    portalBadge: "Teacher Attendance Portal",
    campusTag: "AIM Campus",
    pageTitle: "Daily Teacher Check-In & Check-Out",
    welcomePrefix: "Welcome,",
    idNotAssigned: "ID Not Assigned",
    welcomeSuffix:
      ". Please confirm your daily check-in and check-out on time while inside the Madrasah campus.",
    teacherIdLabel: "Teacher ID:",
    designationLabel: "Designation:",
    resShiftBadge: "Residential Teacher (3 Shifts)",
    hifzShiftBadge: "Hifz Department Teacher (3 Shifts)",
    bstLabel: "Bangladesh Standard Time (BST)",
    geofenceTitle: "Madrasah Geofence Verification",
    locatingBadge: "Locating GPS...",
    insideCampusBadge: "Inside Madrasah Campus",
    outsideCampusBadge: "Outside Madrasah Campus",
    targetLabel: "Target:",
    allowedRadiusLabel: "Allowed Radius:",
    meterUnit: "m",
    kmUnit: "km",
    distanceLabel: "Distance:",
    refreshLocationBtn: "Refresh Location",
    threeShiftBadge: "3 Shifts",
    resScheduleTitle: "Residential Teacher Attendance Schedule (3 Shifts Daily)",
    hifzScheduleTitle: "Hifz Teacher Attendance Schedule (3 Shifts Daily)",
    multiShiftDesc:
      "Ensure timely check-in and check-out for each shift. Providing a reason is mandatory for late entry or early exit.",
    activeShiftPrefix: "Currently Active:",
    statusDone: "Completed",
    statusOngoing: "Ongoing",
    statusPending: "Pending",
    currentWindowTag: "Active Now",
    checkInTimeWindow: "Check-In Window:",
    checkOutTimeWindow: "Check-Out Window:",
    checkInRecord: "Check-In Record:",
    checkInStatusLabel: "Check-In Status:",
    onTimeText: "On Time",
    lateText: "Late",
    lateReasonLabel: "Late Reason:",
    checkOutRecord: "Check-Out Record:",
    checkOutStatusLabel: "Check-Out Status:",
    onTimeExitText: "On-Time Exit",
    earlyExitText: "Early Exit",
    earlyReasonLabel: "Early Exit Reason:",
    btnCheckedIn: "Checked In",
    btnCheckIn: "Check In",
    btnCheckedOut: "Checked Out",
    btnCheckOut: "Check Out",
    singleCheckInTitle: "Morning Check-In",
    singleCheckInSub:
      'Checking in between 8:00 AM and 8:05 AM is recorded as "On Time".',
    badgeOnTime: "On Time",
    badgeLate: "Late",
    badgeNotSubmitted: "Not Checked In",
    recordedTime: "Recorded Time:",
    statusField: "Status:",
    statusOnTimeArrival: "On-Time Arrival",
    statusLateArrival: "Late Arrival",
    coordinatesLabel: "Coordinates:",
    verifyingCheckIn: "Verifying & Checking In...",
    doneCheckInBanner: "Today's Check-In Completed",
    confirmCheckInBtn: "Confirm Check-In",
    singleCheckOutTitle: "Afternoon Check-Out",
    singleCheckOutSub:
      'Checking out at or after 1:10 PM is recorded as "On Time".',
    badgeOnTimeExit: "On-Time Exit",
    badgeEarlyExit: "Early Exit",
    badgeNotExited: "Not Checked Out",
    statusOnTimeDeparture: "On-Time Departure Completed",
    statusEarlyDeparture: "Early Departure",
    statusWorkOngoing: "Session in Progress",
    statusNeedCheckIn: "Requires Check-In First",
    verifyingCheckOut: "Verifying & Checking Out...",
    doneCheckOutBanner: "Today's Check-Out Completed",
    needCheckInFirstBtn: "Complete Check-In First",
    confirmCheckOutBtn: "Confirm Check-Out",
    resRulesHeader: "Residential Teacher (3 Shifts) Attendance Guidelines",
    hifzRulesHeader: "Hifz Department Teacher (3 Shifts) Attendance Guidelines",
    regularRulesHeader: "Madrasah Office Hours & Attendance Guidelines",
    ruleCard1Tag: "Office Hours",
    ruleCard1Val: "08:00 AM - 01:10 PM",
    ruleCard1Sub: "Total 5 hours 10 minutes daily",
    ruleCard2Tag: "On-Time Arrival",
    ruleCard2Val: "By 08:05 AM",
    ruleCard2Sub: "Marked Late after 08:05 AM",
    ruleCard3Tag: "On-Time Departure",
    ruleCard3Val: "01:10 PM or Later",
    ruleCard3Sub: "Marked Early before 01:10 PM",
    ruleCard4Tag: "Geofence Requirement",
    ruleCard4ValPrefix: "Max",
    ruleCard4Sub: "Cannot submit outside campus premises",
    historyHeader: "Your Recent Attendance Log",
    refreshBtn: "Refresh",
    loadingLogs: "Loading logs...",
    emptyLogs: "No attendance records found yet.",
    colDate: "Date",
    colCheckInTime: "Check-In Time",
    colCheckInStatus: "Check-In Status",
    colCheckOutTime: "Check-Out Time",
    colCheckOutStatus: "Check-Out Status",
    colReason: "Late / Early Exit Reason",
    shiftDetailsBtn: "Shift Details",
    threeShiftBreakdown: "3-Shift Breakdown",
    absentWord: "Absent",
    lateShort: "Late",
    earlyShort: "Early",
    modalLateTitle: "Reason for Late Arrival",
    modalEarlyTitle: "Reason for Early Exit",
    modalShiftLateSubPrefix: "Scheduled window (",
    modalShiftLateSubSuffix: ") has passed",
    modalShiftEarlySubPrefix: "Leaving before scheduled window (",
    modalShiftEarlySubSuffix: ")",
    modalRegLateSub: "Checking in after scheduled time (08:05 AM)",
    modalRegEarlySub: "Checking out before scheduled time (01:10 PM)",
    modalLateNotice:
      "Please specify the exact reason for arriving late. This will be recorded in the admin panel.",
    modalEarlyNotice:
      "Please specify the exact reason for leaving before the scheduled time. This will be recorded in the admin panel.",
    modalInputLabel: "Remarks / Reason:",
    modalLatePlaceholder: "e.g., Traffic congestion or medical emergency...",
    modalEarlyPlaceholder: "e.g., Urgent family matter or illness...",
    cancelBtn: "Cancel",
    submittingBtn: "Submitting...",
    submitConfirmBtn: "Submit & Confirm",
  },
  ar: {
    portalBadge: "بوابة حضور المعلمين",
    campusTag: "حرم السلام",
    pageTitle: "تسجيل الحضور والانصراف اليومي للمعلمين",
    welcomePrefix: "مرحباً بك،",
    idNotAssigned: "غير محدد",
    welcomeSuffix:
      ". يرجى تأكيد تسجيل الدخول والانصراف في الوقت المحدد أثناء تواجدك داخل حرم المدرسة.",
    teacherIdLabel: "رقم المعلم:",
    designationLabel: "المسمى الوظيفي:",
    resShiftBadge: "معلم داخلي (٣ فترات)",
    hifzShiftBadge: "معلم قسم التحفيظ (٣ فترات)",
    bstLabel: "توقيت بنغلاديش القياسي (BST)",
    geofenceTitle: "التحقق من النطاق الجغرافي للمدرسة",
    locatingBadge: "جاري تحديد الموقع...",
    insideCampusBadge: "أنت داخل حرم المدرسة",
    outsideCampusBadge: "أنت خارج حرم المدرسة",
    targetLabel: "الموقع:",
    allowedRadiusLabel: "النطاق المسموح:",
    meterUnit: "متر",
    kmUnit: "كم",
    distanceLabel: "المسافة:",
    refreshLocationBtn: "تحديث الموقع",
    threeShiftBadge: "٣ فترات",
    resScheduleTitle: "جدول حضور المعلمين الداخليين (٣ فترات يومياً)",
    hifzScheduleTitle: "جدول حضور معلمي التحفيظ (٣ فترات يومياً)",
    multiShiftDesc:
      "يرجى تأكيد الحضور والانصراف في كل فترة. يجب ذكر السبب عند التأخر أو الانصراف المبكر.",
    activeShiftPrefix: "الفترة النشطة الآن:",
    statusDone: "مكتمل",
    statusOngoing: "جاري",
    statusPending: "قيد الانتظار",
    currentWindowTag: "الوقت الحالي",
    checkInTimeWindow: "وقت الدخول:",
    checkOutTimeWindow: "وقت الانصراف:",
    checkInRecord: "سجل الدخول:",
    checkInStatusLabel: "حالة الدخول:",
    onTimeText: "في الموعد",
    lateText: "متأخر (Late)",
    lateReasonLabel: "سبب التأخير:",
    checkOutRecord: "سجل الانصراف:",
    checkOutStatusLabel: "حالة الانصراف:",
    onTimeExitText: "انصراف في الموعد",
    earlyExitText: "انصراف مبكر (Early)",
    earlyReasonLabel: "سبب الانصراف المبكر:",
    btnCheckedIn: "تم الدخول",
    btnCheckIn: "تسجيل دخول",
    btnCheckedOut: "تم الانصراف",
    btnCheckOut: "تسجيل انصراف",
    singleCheckInTitle: "تسجيل الحضور (Check-In)",
    singleCheckInSub:
      'التسجيل بين الساعة ٨:٠٠ و ٨:٠٥ صباحاً يُحتسب "في الوقت المحدد".',
    badgeOnTime: "في الموعد (On Time)",
    badgeLate: "متأخر (Late)",
    badgeNotSubmitted: "لم يتم التسجيل",
    recordedTime: "الوقت المسجل:",
    statusField: "الحالة:",
    statusOnTimeArrival: "حضور في الوقت المحدد",
    statusLateArrival: "حضور متأخر",
    coordinatesLabel: "الإحداثيات:",
    verifyingCheckIn: "جاري التحقق والتسجيل...",
    doneCheckInBanner: "تم إتمام تسجيل الحضور اليوم",
    confirmCheckInBtn: "تأكيد تسجيل الحضور (Check In)",
    singleCheckOutTitle: "تسجيل الانصراف (Check-Out)",
    singleCheckOutSub:
      'الانصراف الساعة ١:١٠ ظهراً أو بعدها يُحتسب "في الوقت المحدد".',
    badgeOnTimeExit: "انصراف في الموعد",
    badgeEarlyExit: "انصراف مبكر",
    badgeNotExited: "لم يتم الانصراف",
    statusOnTimeDeparture: "تم الانصراف في الموعد",
    statusEarlyDeparture: "انصراف قبل الموعد المحدد",
    statusWorkOngoing: "العمل جاري",
    statusNeedCheckIn: "يتطلب تسجيل الحضور أولاً",
    verifyingCheckOut: "جاري التحقق والانصراف...",
    doneCheckOutBanner: "تم إتمام تسجيل الانصراف اليوم",
    needCheckInFirstBtn: "سجل الحضور (Check-In) أولاً",
    confirmCheckOutBtn: "تأكيد تسجيل الانصراف (Check Out)",
    resRulesHeader: "إرشادات ومواعيد حضور المعلمين الداخليين (٣ فترات)",
    hifzRulesHeader: "إرشادات ومواعيد حضور معلمي التحفيظ (٣ فترات)",
    regularRulesHeader: "أوقات الدوام الرسمي وإرشادات الحضور",
    ruleCard1Tag: "ساعات الدوام",
    ruleCard1Val: "٠٨:٠٠ ص - ٠١:١٠ م",
    ruleCard1Sub: "إجمالي ٥ ساعات و ١٠ دقائق يومياً",
    ruleCard2Tag: "الحضور في الموعد",
    ruleCard2Val: "حتى ٠٨:٠٥ صباحاً",
    ruleCard2Sub: "يُحتسب تأخراً بعد ٠٨:٠٥ صباحاً",
    ruleCard3Tag: "الانصراف في الموعد",
    ruleCard3Val: "٠١:١٠ ظهراً أو بعدها",
    ruleCard3Sub: "يُحتسب مبكراً قبل ٠١:١٠ ظهراً",
    ruleCard4Tag: "شرط الموقع الجغرافي",
    ruleCard4ValPrefix: "الحد الأقصى",
    ruleCard4Sub: "لا يمكن التسجيل خارج حرم المدرسة",
    historyHeader: "سجل حضورك الأخير",
    refreshBtn: "تحديث",
    loadingLogs: "جاري تحميل السجلات...",
    emptyLogs: "لا توجد سجلات حضور حتى الآن.",
    colDate: "التاريخ",
    colCheckInTime: "وقت الدخول",
    colCheckInStatus: "حالة الدخول",
    colCheckOutTime: "وقت الانصراف",
    colCheckOutStatus: "حالة الانصراف",
    colReason: "سبب التأخير / الانصراف المبكر",
    shiftDetailsBtn: "تفاصيل الفترات",
    threeShiftBreakdown: "تفاصيل ٣ فترات",
    absentWord: "غائب",
    lateShort: "تأخير",
    earlyShort: "مبكر",
    modalLateTitle: "سبب التأخر في الحضور",
    modalEarlyTitle: "سبب الانصراف المبكر",
    modalShiftLateSubPrefix: "تم تجاوز الوقت المحدد (",
    modalShiftLateSubSuffix: ")",
    modalShiftEarlySubPrefix: "الانصراف قبل الوقت المحدد (",
    modalShiftEarlySubSuffix: ")",
    modalRegLateSub: "تسجيل الدخول بعد الوقت المحدد (٠٨:٠٥ صباحاً)",
    modalRegEarlySub: "تسجيل الانصراف قبل الوقت المحدد (٠١:١٠ ظهراً)",
    modalLateNotice:
      "يرجى ذكر السبب الدقيق للتأخر في الحضور. سيتم حفظ ذلك في لوحة الإدارة.",
    modalEarlyNotice:
      "يرجى ذكر السبب الدقيق للانصراف قبل الموعد. سيتم حفظ ذلك في لوحة الإدارة.",
    modalInputLabel: "الملاحظة / السبب:",
    modalLatePlaceholder: "مثال: ازدحام مروري أو ظرف صحي طارئ...",
    modalEarlyPlaceholder: "مثال: ظرف عائلي طارئ أو وعكة صحية...",
    cancelBtn: "إلغاء",
    submittingBtn: "جاري الإرسال...",
    submitConfirmBtn: "إرسال وتأكيد",
  },
};

export default function TeacherAttendancePage() {
  const { language } = useLanguage();
  const text = TEACHER_I18N[language] || TEACHER_I18N.bn;

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  // Fallback demo user for preview if not logged in
  const teacherEmail = currentUser?.email || "tanim@gmail.com";
  const teacherName = currentUser?.name || "শিক্ষক";

  // Teacher category & shift configuration state
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [teacherCategory, setTeacherCategory] = useState("regular"); // "regular" | "residential" | "hifz"
  const [shiftRules, setShiftRules] = useState(null);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [targetShiftId, setTargetShiftId] = useState(null);
  const [submittingShiftId, setSubmittingShiftId] = useState(null);

  // Real-time & Geolocation state via shared hook
  const {
    currentTime,
    currentCoords,
    locationError,
    isLocating,
    geofenceStatus,
    requestLocation,
  } = useAttendanceGeolocation();

  const [, setLoadingToday] = useState(true);
  const [todayData, setTodayData] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Late / Early exit comment modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentModalType, setCommentModalType] = useState("late"); // "late" | "early"
  const [attendanceComment, setAttendanceComment] = useState("");

  // Action loading states
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

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
        const category =
          json.category || getTeacherCategory(json.user?.designation);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodayAttendance();
    fetchHistory();
  }, [fetchTodayAttendance, fetchHistory]);

  // 5. Execute Check-In API call
  const executeCheckIn = async (comment = "") => {
    if (!currentCoords) {
      toast.info("আপনার অবস্থান যাচাই করা হচ্ছে...");
      requestLocation();
      return;
    }

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
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
      toast.error(
        "আজকের কোনো প্রবেশ হাজিরা পাওয়া যায়নি। আগে চেক-ইন সম্পন্ন করুন।"
      );
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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    const evalResult = evaluateTeacherShiftCheckIn(
      teacherCategory,
      shiftKey,
      new Date()
    );
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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
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

      toast.success(
        data.message || "শিফট প্রস্থান হাজিরা সফলভাবে নিশ্চিত হয়েছে!"
      );
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
      toast.error(
        "আজকের এই শিফটের কোনো প্রবেশ হাজিরা পাওয়া যায়নি। আগে Check-In সম্পন্ন করুন।"
      );
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

    const verification = isWithinMadrasaGeofence(
      currentCoords.lat,
      currentCoords.lng
    );
    if (!verification.isInside) {
      toast.error(
        "You must be inside the madrasa premises to submit attendance."
      );
      return;
    }

    const evalResult = evaluateTeacherShiftCheckOut(
      teacherCategory,
      shiftKey,
      new Date()
    );
    if (evalResult.isEarly) {
      setTargetShiftId(shiftKey);
      setCommentModalType("early");
      setAttendanceComment("");
      setCommentModalOpen(true);
    } else {
      await executeShiftCheckOut(shiftKey, "");
    }
  };

  const isMultiShift =
    teacherCategory === "residential" || teacherCategory === "hifz";
  const activeShiftRules =
    shiftRules || (isMultiShift ? getTeacherShiftRules(teacherCategory) : null);
  const currentActiveShift =
    activeShiftId ||
    (isMultiShift ? getActiveTeacherShift(teacherCategory) : null);

  const isCheckedIn = !!todayData?.checkInTime;
  const isCheckedOut = !!todayData?.checkOutTime;

  const effectiveDistance = geofenceStatus?.distance ?? null;
  const isInsideEffective = geofenceStatus?.isInside ?? false;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner with Royal Emerald, Obsidian Jade & Liquid Gold */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-400/60 via-emerald-500/40 to-amber-500/50 shadow-[0_20px_60px_-15px_rgba(2,32,20,0.35)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.12)] overflow-hidden">
        <div className="relative overflow-hidden rounded-[22.5px] bg-gradient-to-r from-[#021d12] via-[#04301f] to-[#021d12] dark:from-[#010906] dark:via-[#031b11] dark:to-[#010906] p-6 sm:p-8 text-white">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-white/[0.07] border border-amber-400/35 rounded-full text-amber-300 backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {text.portalBadge}
                </span>
                <span className="text-xs text-amber-200/80 font-semibold">
                  {text.campusTag}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent flex items-center gap-3">
                <span>{text.pageTitle}</span>
              </h1>
              <p className="text-sm text-emerald-100/85 max-w-xl leading-relaxed">
                {text.welcomePrefix}{" "}
                <strong className="font-mono text-amber-300">
                  {teacherProfile?.teacherId ||
                    teacherProfile?.id ||
                    text.idNotAssigned}
                </strong>{" "}
                ({teacherEmail}){text.welcomeSuffix}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(teacherProfile?.teacherId || teacherProfile?.id) && (
                  <span className="px-3 py-1 text-xs font-mono font-bold rounded-xl bg-black/30 text-amber-300 border border-amber-400/35">
                    {text.teacherIdLabel}{" "}
                    {teacherProfile.teacherId || teacherProfile.id}
                  </span>
                )}
                {teacherProfile?.designation && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-xl bg-white/10 text-emerald-100 border border-white/20">
                    {text.designationLabel} {teacherProfile.designation}
                  </span>
                )}
                {isMultiShift && (
                  <span className="px-3 py-1 text-xs font-extrabold rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm">
                    {teacherCategory === "residential"
                      ? text.resShiftBadge
                      : text.hifzShiftBadge}
                  </span>
                )}
              </div>
            </div>

            {/* Live Clock & Date Widget */}
            <div className="bg-[#01110b]/75 dark:bg-[#010805]/85 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-4 sm:p-5 flex flex-col items-start sm:items-end justify-center shadow-[inset_0_1px_1px_rgba(251,191,36,0.2),0_10px_30px_rgba(0,0,0,0.4)] min-w-[230px]">
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{formatDisplayDate(currentTime)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mt-1">
                {formatTimeBD(currentTime)}
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {text.bstLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Geofence Location Verification Bar */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-5 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`p-3.5 rounded-2xl flex-shrink-0 ring-1 ${
                  isInsideEffective
                    ? "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-500/40"
                    : "bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-500/40"
                }`}
              >
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {text.geofenceTitle}
                  </h3>
                  {isLocating ? (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 flex items-center gap-1 border border-amber-300 dark:border-amber-400/35">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {text.locatingBadge}
                    </span>
                  ) : isInsideEffective ? (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300 dark:border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {text.insideCampusBadge}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1 border border-rose-300 dark:border-rose-500/40">
                      <XCircle className="w-3.5 h-3.5" />
                      {text.outsideCampusBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-emerald-100/70">
                  {text.targetLabel} {MADRASA_LOCATION.NAME} (
                  {text.allowedRadiusLabel} {MADRASA_LOCATION.RADIUS_METERS}{" "}
                  {text.meterUnit})
                  {effectiveDistance !== null && (
                    <span className="ltr:ml-2 rtl:mr-2 font-bold text-slate-700 dark:text-amber-300">
                      • {text.distanceLabel}{" "}
                      {effectiveDistance > 1000
                        ? `${(effectiveDistance / 1000).toFixed(2)} ${text.kmUnit}`
                        : `${effectiveDistance} ${text.meterUnit}`}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={requestLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-200 dark:text-amber-300 bg-gradient-to-r from-[#022014] to-emerald-900 dark:from-amber-400/15 dark:to-emerald-500/15 hover:from-emerald-900 hover:to-emerald-800 border border-amber-400/35 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`}
                />
                {text.refreshLocationBtn}
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
      </div>

      {/* 3. Action Cards Grid: Check-In & Check-Out */}
      {isMultiShift ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 via-[#f4f9f6] to-amber-50/50 dark:from-[#042217] dark:via-[#02150e] dark:to-[#041e14] border border-emerald-200 dark:border-amber-400/30 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#022014] to-emerald-800 dark:from-amber-400 dark:to-amber-500 text-amber-300 dark:text-slate-950 font-black text-xs shadow-xs">
                {text.threeShiftBadge}
              </span>
              <div>
                <h3 className="text-sm font-black text-emerald-950 dark:text-amber-200">
                  {teacherCategory === "residential"
                    ? text.resScheduleTitle
                    : text.hifzScheduleTitle}
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-100/75">
                  {text.multiShiftDesc}
                </p>
              </div>
            </div>
            {currentActiveShift && (
              <span className="self-start sm:self-center px-3.5 py-1.5 text-xs font-extrabold rounded-full bg-gradient-to-r from-[#022014] to-emerald-800 dark:from-amber-400/20 dark:to-emerald-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-xs whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                {text.activeShiftPrefix}{" "}
                {activeShiftRules?.[currentActiveShift]?.name ||
                  currentActiveShift}
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
                  className={`relative rounded-3xl p-[1.5px] transition-all duration-300 hover:-translate-y-1 ${
                    isActive
                      ? "bg-gradient-to-b from-amber-400 via-emerald-500 to-amber-500 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.25)]"
                      : "bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.08)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]"
                  }`}
                >
                  <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-6 flex flex-col justify-between overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
                    <div className="space-y-4">
                      {/* Shift Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-2 rounded-xl text-xs font-bold ${
                                isActive
                                  ? "bg-gradient-to-br from-[#022014] to-emerald-800 text-amber-300 ring-1 ring-amber-400/50"
                                  : "bg-emerald-50 text-emerald-700 dark:bg-white/[0.06] dark:text-amber-300"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                            </span>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">
                              {rule.name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                            {rule.nameEnglish}
                          </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-end gap-1">
                          {hasCheckedOut ? (
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                              {text.statusDone}
                            </span>
                          ) : hasCheckedIn ? (
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40 flex items-center gap-1">
                              <LogIn className="w-3.5 h-3.5" />
                              {text.statusOngoing}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-emerald-100/70">
                              {text.statusPending}
                            </span>
                          )}
                          {isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950">
                              {text.currentWindowTag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Schedule Time Window Guide */}
                      <div className="p-3 rounded-2xl bg-[#f4f9f6] dark:bg-[#02140d] border border-emerald-800/10 dark:border-amber-400/20 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-emerald-100/70">
                            {text.checkInTimeWindow}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-amber-200">
                            {rule.checkInWindowLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-emerald-100/70">
                            {text.checkOutTimeWindow}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-amber-200">
                            {rule.checkOutWindowLabel}
                          </span>
                        </div>
                      </div>

                      {/* Logged Information */}
                      <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-emerald-800/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-emerald-100/70">
                            {text.checkInRecord}
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-white">
                            {hasCheckedIn
                              ? formatDisplayTime(shiftLog.checkInTime)
                              : "--:--"}
                          </span>
                        </div>
                        {hasCheckedIn && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-emerald-100/70">
                              {text.checkInStatusLabel}
                            </span>
                            <span
                              className={`font-bold ${
                                shiftLog.checkInStatus === "On Time"
                                  ? "text-emerald-600 dark:text-emerald-300"
                                  : "text-rose-600 dark:text-rose-300"
                              }`}
                            >
                              {shiftLog.checkInStatus === "On Time"
                                ? text.onTimeText
                                : text.lateText}
                            </span>
                          </div>
                        )}
                        {shiftLog?.checkInComment && (
                          <div className="text-[11px] text-rose-600 dark:text-rose-300 italic bg-rose-50 dark:bg-rose-950/30 p-2 rounded-xl">
                            <strong>{text.lateReasonLabel}</strong>{" "}
                            {shiftLog.checkInComment}
                          </div>
                        )}

                        <div className="pt-1.5 border-t border-slate-200/50 dark:border-emerald-800/40 flex items-center justify-between">
                          <span className="text-slate-500 dark:text-emerald-100/70">
                            {text.checkOutRecord}
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-white">
                            {hasCheckedOut
                              ? formatDisplayTime(shiftLog.checkOutTime)
                              : "--:--"}
                          </span>
                        </div>
                        {hasCheckedOut && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-emerald-100/70">
                              {text.checkOutStatusLabel}
                            </span>
                            <span
                              className={`font-bold ${
                                shiftLog.checkOutStatus === "On Time"
                                  ? "text-emerald-600 dark:text-emerald-300"
                                  : "text-amber-600 dark:text-amber-300"
                              }`}
                            >
                              {shiftLog.checkOutStatus === "On Time"
                                ? text.onTimeExitText
                                : text.earlyExitText}
                            </span>
                          </div>
                        )}
                        {shiftLog?.checkOutComment && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-300 italic bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl">
                            <strong>{text.earlyReasonLabel}</strong>{" "}
                            {shiftLog.checkOutComment}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions for this Shift */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-800/40 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleShiftCheckIn(shiftKey)}
                        disabled={hasCheckedIn || isSubmitting}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          hasCheckedIn
                            ? "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#022014] to-emerald-800 dark:from-amber-400 dark:to-amber-500 text-amber-200 dark:text-slate-950 shadow-xs active:scale-[0.98]"
                        }`}
                      >
                        {isSubmitting ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : hasCheckedIn ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <LogIn className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {hasCheckedIn ? text.btnCheckedIn : text.btnCheckIn}
                        </span>
                      </button>

                      <button
                        onClick={() => handleShiftCheckOut(shiftKey)}
                        disabled={!hasCheckedIn || hasCheckedOut || isSubmitting}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          !hasCheckedIn || hasCheckedOut
                            ? "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-teal-800 to-emerald-900 dark:from-emerald-600 dark:to-teal-700 text-white shadow-xs active:scale-[0.98]"
                        }`}
                      >
                        {isSubmitting ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : hasCheckedOut ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <LogOut className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {hasCheckedOut
                            ? text.btnCheckedOut
                            : text.btnCheckOut}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CHECK-IN CARD */}
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/55 via-emerald-500/30 to-emerald-700/30 shadow-[0_18px_50px_-15px_rgba(2,32,20,0.14)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.1)]">
            <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#052619] dark:via-[#031810] dark:to-[#010a06] rounded-[22.5px] p-6 sm:p-7 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#022014] to-emerald-800 text-amber-300 ring-1 ring-amber-400/40">
                      <LogIn className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {text.singleCheckInTitle}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-100/75">
                    {text.singleCheckInSub}
                  </p>
                </div>

                {/* Check-In Status Badge */}
                {isCheckedIn ? (
                  <span
                    className={`px-3 py-1 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs ${
                      todayData?.checkInStatus === "On Time"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                    }`}
                  >
                    {todayData?.checkInStatus === "On Time" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                    )}
                    {todayData?.checkInStatus === "On Time"
                      ? text.badgeOnTime
                      : text.badgeLate}
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-emerald-100/75">
                    {text.badgeNotSubmitted}
                  </span>
                )}
              </div>

              <div className="my-6 p-4 rounded-2xl bg-[#f4f9f6] dark:bg-[#02140d] border border-emerald-800/10 dark:border-amber-400/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-emerald-100/70">
                    {text.recordedTime}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-amber-200 font-mono text-sm">
                    {isCheckedIn
                      ? formatDisplayTime(todayData.checkInTime)
                      : "--:--"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-emerald-100/70">
                    {text.statusField}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-white">
                    {isCheckedIn
                      ? todayData.checkInStatus === "On Time"
                        ? text.statusOnTimeArrival
                        : text.statusLateArrival
                      : text.statusPending}
                  </span>
                </div>
                {todayData?.checkInLocation && (
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-emerald-200/60 pt-1 border-t border-slate-200/50 dark:border-emerald-800/40">
                    <span>{text.coordinatesLabel}</span>
                    <span className="font-mono">
                      {todayData.checkInLocation.lat.toFixed(4)},{" "}
                      {todayData.checkInLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckIn}
                disabled={isCheckedIn || submittingCheckIn}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isCheckedIn
                    ? "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/10"
                    : "bg-gradient-to-r from-[#022014] via-emerald-900 to-emerald-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 text-amber-200 dark:text-slate-950 shadow-[0_10px_25px_rgba(2,32,20,0.25)] dark:shadow-[0_10px_30px_rgba(245,158,11,0.35)] active:scale-[0.98]"
                }`}
              >
                {submittingCheckIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{text.verifyingCheckIn}</span>
                  </>
                ) : isCheckedIn ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{text.doneCheckInBanner}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{text.confirmCheckInBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CHECK-OUT CARD */}
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/55 via-teal-500/30 to-emerald-700/30 shadow-[0_18px_50px_-15px_rgba(2,32,20,0.14)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.1)]">
            <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#042418] dark:via-[#02160f] dark:to-[#010906] rounded-[22.5px] p-6 sm:p-7 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-500/20 text-amber-600 dark:text-amber-300 ring-1 ring-amber-400/40">
                      <LogOut className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {text.singleCheckOutTitle}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-100/75">
                    {text.singleCheckOutSub}
                  </p>
                </div>

                {/* Check-Out Status Badge */}
                {isCheckedOut ? (
                  <span
                    className={`px-3 py-1 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs ${
                      todayData?.checkOutStatus === "On Time"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40"
                    }`}
                  >
                    {todayData?.checkOutStatus === "On Time" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                    )}
                    {todayData?.checkOutStatus === "On Time"
                      ? text.badgeOnTimeExit
                      : text.badgeEarlyExit}
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-emerald-100/75">
                    {text.badgeNotExited}
                  </span>
                )}
              </div>

              <div className="my-6 p-4 rounded-2xl bg-[#f4f9f6] dark:bg-[#02140d] border border-emerald-800/10 dark:border-amber-400/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-emerald-100/70">
                    {text.recordedTime}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-amber-200 font-mono text-sm">
                    {isCheckedOut
                      ? formatDisplayTime(todayData.checkOutTime)
                      : "--:--"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-emerald-100/70">
                    {text.statusField}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-white">
                    {isCheckedOut
                      ? todayData.checkOutStatus === "On Time"
                        ? text.statusOnTimeDeparture
                        : text.statusEarlyDeparture
                      : isCheckedIn
                        ? text.statusWorkOngoing
                        : text.statusNeedCheckIn}
                  </span>
                </div>
                {todayData?.checkOutLocation && (
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-emerald-200/60 pt-1 border-t border-slate-200/50 dark:border-emerald-800/40">
                    <span>{text.coordinatesLabel}</span>
                    <span className="font-mono">
                      {todayData.checkOutLocation.lat.toFixed(4)},{" "}
                      {todayData.checkOutLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckOut}
                disabled={!isCheckedIn || isCheckedOut || submittingCheckOut}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isCheckedIn || isCheckedOut
                    ? "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/10"
                    : "bg-gradient-to-r from-[#022014] via-teal-900 to-emerald-900 dark:from-emerald-500 dark:to-teal-600 text-amber-200 dark:text-white active:scale-[0.98]"
                }`}
              >
                {submittingCheckOut ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{text.verifyingCheckOut}</span>
                  </>
                ) : isCheckedOut ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{text.doneCheckOutBanner}</span>
                  </>
                ) : !isCheckedIn ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>{text.needCheckInFirstBtn}</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>{text.confirmCheckOutBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Office Hours & Attendance Rules Card */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-6 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {isMultiShift
                ? teacherCategory === "residential"
                  ? text.resRulesHeader
                  : text.hifzRulesHeader
                : text.regularRulesHeader}
            </h3>
          </div>

          {isMultiShift ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["shift1", "shift2", "shift3"].map((shiftKey) => {
                const rule = activeShiftRules?.[shiftKey];
                if (!rule) return null;
                return (
                  <div
                    key={shiftKey}
                    className="bg-[#f4f9f6] dark:bg-[#02140d] p-4 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {rule.name}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-amber-300">
                        {rule.nameEnglish}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 dark:text-emerald-100/80">
                      <p>
                        <strong>{text.checkInTimeWindow}</strong>{" "}
                        {rule.checkInWindowLabel}
                      </p>
                      <p>
                        <strong>{text.checkOutTimeWindow}</strong>{" "}
                        {rule.checkOutWindowLabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f4f9f6] dark:bg-[#02140d] p-4 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-amber-300">
                  {text.ruleCard1Tag}
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {text.ruleCard1Val}
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-100/65">
                  {text.ruleCard1Sub}
                </p>
              </div>

              <div className="bg-[#f4f9f6] dark:bg-[#02140d] p-4 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-amber-300">
                  {text.ruleCard2Tag}
                </span>
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {text.ruleCard2Val}
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-100/65">
                  {text.ruleCard2Sub}
                </p>
              </div>

              <div className="bg-[#f4f9f6] dark:bg-[#02140d] p-4 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-amber-300">
                  {text.ruleCard3Tag}
                </span>
                <p className="text-sm font-black text-teal-700 dark:text-teal-300">
                  {text.ruleCard3Val}
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-100/65">
                  {text.ruleCard3Sub}
                </p>
              </div>

              <div className="bg-[#f4f9f6] dark:bg-[#02140d] p-4 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-amber-300">
                  {text.ruleCard4Tag}
                </span>
                <p className="text-sm font-black text-amber-600 dark:text-amber-300">
                  {text.ruleCard4ValPrefix} {MADRASA_LOCATION.RADIUS_METERS}{" "}
                  {text.meterUnit}
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-100/65">
                  {text.ruleCard4Sub}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Personal Attendance History Table */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-6 sm:p-7 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {text.historyHeader}
              </h3>
            </div>
            <button
              onClick={fetchHistory}
              className="text-xs text-emerald-700 dark:text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {text.refreshBtn}
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-slate-400 dark:text-emerald-100/60 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              {text.loadingLogs}
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-emerald-100/60 text-sm">
              {text.emptyLogs}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="text-xs uppercase bg-[#f4f9f6] dark:bg-[#02140d] text-slate-600 dark:text-amber-300 border-b border-emerald-800/10 dark:border-amber-400/20">
                  <tr>
                    <th className="py-3.5 px-4 font-bold text-start">
                      {text.colDate}
                    </th>
                    <th className="py-3.5 px-4 font-bold text-start">
                      {text.colCheckInTime}
                    </th>
                    <th className="py-3.5 px-4 font-bold text-start">
                      {text.colCheckInStatus}
                    </th>
                    <th className="py-3.5 px-4 font-bold text-start">
                      {text.colCheckOutTime}
                    </th>
                    <th className="py-3.5 px-4 font-bold text-start">
                      {text.colCheckOutStatus}
                    </th>
                    <th className="py-3.5 px-4 font-bold text-start">
                      {text.colReason}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-emerald-800/30">
                  {historyList.map((item) => {
                    const isExpanded = expandedHistoryId === item._id;
                    const hasShifts =
                      item.shifts && Object.keys(item.shifts).length > 0;

                    const historyComments = [];
                    if (item.shifts) {
                      Object.values(item.shifts).forEach((s) => {
                        if (s?.checkInComment) {
                          historyComments.push({
                            type: "late",
                            label: `${s.name || s.shiftId} (${text.lateShort})`,
                            comment: s.checkInComment,
                          });
                        }
                        if (s?.checkOutComment) {
                          historyComments.push({
                            type: "early",
                            label: `${s.name || s.shiftId} (${text.earlyShort})`,
                            comment: s.checkOutComment,
                          });
                        }
                      });
                    }
                    if (historyComments.length === 0) {
                      if (item.checkInComment) {
                        historyComments.push({
                          type: "late",
                          label: text.lateShort,
                          comment: item.checkInComment,
                        });
                      }
                      if (item.checkOutComment) {
                        historyComments.push({
                          type: "early",
                          label: text.earlyShort,
                          comment: item.checkOutComment,
                        });
                      }
                    }

                    const completedCount = hasShifts
                      ? Object.values(item.shifts).filter(
                          (s) => !!s?.checkInTime
                        ).length
                      : 0;

                    return (
                      <React.Fragment key={item._id}>
                        <tr className="hover:bg-emerald-50/40 dark:hover:bg-white/[0.04] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                            <div>{item.date}</div>
                            {hasShifts && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedHistoryId(
                                    isExpanded ? null : item._id
                                  )
                                }
                                className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
                              >
                                <Layers className="w-3 h-3" />
                                <span>
                                  {text.shiftDetailsBtn} ({completedCount}/3)
                                </span>
                                <ChevronDown
                                  className={`w-3 h-3 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-emerald-100/80 whitespace-nowrap">
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
                              {item.checkInStatus === "On Time"
                                ? "On Time"
                                : "Late"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-emerald-100/80 whitespace-nowrap">
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
                                {item.checkOutStatus === "On Time"
                                  ? "On Time"
                                  : "Early"}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">
                                {text.statusPending}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-emerald-100/75 max-w-xs">
                            {historyComments.length > 0 ? (
                              <div className="flex flex-col gap-0.5">
                                {historyComments.map((hc, i) => (
                                  <span
                                    key={i}
                                    title={hc.comment}
                                    className="truncate"
                                  >
                                    <strong
                                      className={
                                        hc.type === "late"
                                          ? "text-rose-600 dark:text-rose-300 font-semibold"
                                          : "text-amber-600 dark:text-amber-300 font-semibold"
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
                          <tr className="bg-[#f4f9f6]/90 dark:bg-[#02120b]/90 border-y border-amber-300/50 dark:border-amber-400/25">
                            <td colSpan={6} className="p-4">
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 dark:text-amber-200 flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                                    <span>
                                      {item.date} — {text.threeShiftBreakdown}
                                    </span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedHistoryId(null)}
                                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 font-bold cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                  {["shift1", "shift2", "shift3"].map(
                                    (shiftKey, sIdx) => {
                                      const sRecord = item.shifts?.[shiftKey];
                                      const rules =
                                        item.category === "hifz"
                                          ? HIFZ_ATTENDANCE_RULES[shiftKey]
                                          : RESIDENTIAL_ATTENDANCE_RULES[
                                              shiftKey
                                            ];
                                      const hasIn = !!sRecord?.checkInTime;
                                      const hasOut = !!sRecord?.checkOutTime;

                                      return (
                                        <div
                                          key={shiftKey}
                                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                            hasIn
                                              ? "bg-white dark:bg-[#041e14] border-slate-200 dark:border-amber-400/25 shadow-xs"
                                              : "bg-slate-100/60 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/10 opacity-75"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/40 pb-1 font-bold text-slate-800 dark:text-white">
                                            <span>
                                              {rules?.name ||
                                                `Shift ${sIdx + 1}`}
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-amber-300/80">
                                              {rules?.nameEnglish}
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-500 dark:text-emerald-100/70">
                                              {text.checkInTimeWindow}
                                            </span>
                                            {hasIn ? (
                                              <span className="font-mono font-bold">
                                                {formatDisplayTime(
                                                  sRecord.checkInTime
                                                )}{" "}
                                                <span
                                                  className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                                    sRecord.checkInStatus ===
                                                    "On Time"
                                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                  }`}
                                                >
                                                  {sRecord.checkInStatus}
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="text-slate-400">
                                                {text.absentWord}
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-500 dark:text-emerald-100/70">
                                              {text.checkOutTimeWindow}
                                            </span>
                                            {hasOut ? (
                                              <span className="font-mono font-bold">
                                                {formatDisplayTime(
                                                  sRecord.checkOutTime
                                                )}{" "}
                                                <span
                                                  className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                                    sRecord.checkOutStatus ===
                                                    "On Time"
                                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                  }`}
                                                >
                                                  {sRecord.checkOutStatus}
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="text-slate-400">
                                                {text.statusPending}
                                              </span>
                                            )}
                                          </div>

                                          {(sRecord?.checkInComment ||
                                            sRecord?.checkOutComment) && (
                                            <div className="pt-1 border-t border-slate-100 dark:border-emerald-800/40 text-[10px] space-y-0.5">
                                              {sRecord.checkInComment && (
                                                <div className="text-rose-700 dark:text-rose-300 truncate">
                                                  <strong>
                                                    {text.lateShort}:
                                                  </strong>{" "}
                                                  {sRecord.checkInComment}
                                                </div>
                                              )}
                                              {sRecord.checkOutComment && (
                                                <div className="text-amber-700 dark:text-amber-300 truncate">
                                                  <strong>
                                                    {text.earlyShort}:
                                                  </strong>{" "}
                                                  {sRecord.checkOutComment}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
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
      </div>

      {/* 6. Late / Early Exit Comment Modal */}
      {commentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#031810] rounded-3xl max-w-md w-full shadow-2xl border border-emerald-800/15 dark:border-amber-400/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2.5 rounded-2xl ${
                    commentModalType === "late"
                      ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300"
                      : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {targetShiftId && activeShiftRules?.[targetShiftId]
                      ? `${activeShiftRules[targetShiftId].name}: ${
                          commentModalType === "late"
                            ? text.modalLateTitle
                            : text.modalEarlyTitle
                        }`
                      : commentModalType === "late"
                        ? text.modalLateTitle
                        : text.modalEarlyTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-100/70">
                    {targetShiftId && activeShiftRules?.[targetShiftId]
                      ? commentModalType === "late"
                        ? `${text.modalShiftLateSubPrefix}${activeShiftRules[targetShiftId].checkInWindowLabel}${text.modalShiftLateSubSuffix}`
                        : `${text.modalShiftEarlySubPrefix}${activeShiftRules[targetShiftId].checkOutWindowLabel}${text.modalShiftEarlySubSuffix}`
                      : commentModalType === "late"
                        ? text.modalRegLateSub
                        : text.modalRegEarlySub}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCommentModalOpen(false);
                  setTargetShiftId(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#f4f9f6] dark:bg-[#02120b] border border-emerald-800/15 dark:border-amber-400/20 text-xs text-slate-600 dark:text-emerald-100/80">
              {commentModalType === "late"
                ? text.modalLateNotice
                : text.modalEarlyNotice}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1.5">
                {text.modalInputLabel}
              </label>
              <textarea
                rows={3}
                value={attendanceComment}
                onChange={(e) => setAttendanceComment(e.target.value)}
                placeholder={
                  commentModalType === "late"
                    ? text.modalLatePlaceholder
                    : text.modalEarlyPlaceholder
                }
                className="w-full rounded-2xl border border-emerald-800/15 dark:border-amber-400/25 bg-[#f4f9f6] dark:bg-[#02120b] p-3.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCommentModalOpen(false);
                  setTargetShiftId(null);
                }}
                disabled={
                  submittingCheckIn || submittingCheckOut || !!submittingShiftId
                }
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
              >
                {text.cancelBtn}
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
                disabled={
                  submittingCheckIn || submittingCheckOut || !!submittingShiftId
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#022014] to-emerald-800 dark:from-amber-400 dark:to-amber-500 text-xs font-black text-amber-200 dark:text-slate-950 shadow-md active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
              >
                {submittingCheckIn ||
                submittingCheckOut ||
                !!submittingShiftId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{text.submittingBtn}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{text.submitConfirmBtn}</span>
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
