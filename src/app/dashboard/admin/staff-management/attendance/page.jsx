"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  RefreshCw,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  CreditCard,
  X,
  Save,
  Printer,
  MapPin,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getDhakaTime,
  formatDhakaTimeOnly as formatTime,
  calculateWorkDuration,
  formatMonthBangla,
} from "@/lib/attendance-config";
import {
  AttendanceSummaryMetrics,
  AttendanceFilterBar,
} from "@/components/dashboard/attendance/AttendanceMetricsAndFilters";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const ADMIN_STAFF_I18N = {
  bn: {
    tabAllStaff: "সকল স্টাফ তালিকা",
    tabIdCard: "স্টাফ আইডি কার্ড তৈরি (ID Card)",
    tabAttendance: "স্টাফ হাজিরা (Attendance)",
    badgeTitle: "প্রশাসনিক কর্মচারী ব্যবস্থাপনা",
    pageTitle: "স্টাফ হাজিরা সংক্ষিপ্ত বিবরণ",
    pageSubtitle:
      "মাদরাসার সকল কর্মচারীর দৈনিক উপস্থিতি ও কাজের সময় পর্যবেক্ষণ করুন।",
    monthlyReportBtn: "মাসিক রিপোর্ট প্রিন্ট / ডাউনলোড",
    refreshTitle: "রিফ্রেশ করুন",
    scheduleTitle: "স্টাফদের দৈনিক ২ টার্ম হাজিরা সময়সূচী:",
    scheduleTerm1: "১ম টার্ম (সকালের চেক-ইন): শেষ সময়",
    scheduleTerm1Time: "ভোর ৫:৩০ টা",
    scheduleTerm1Note: "(এরপর লেট)",
    scheduleTerm2: "২য় টার্ম (রাতের চেক-আউট): সময়",
    scheduleTerm2Time: "রাত ১০:০০ টা থেকে ১০:১০ টা",
    scheduleTerm2Note: "(পূর্বে আর্লি, পরে ওভারটাইম)।",
    registerTitle: "স্টাফ হাজিরা রেজিস্টার",
    totalDisplayed: "মোট প্রদর্শিত:",
    personUnit: "জন",
    loadingText: "তথ্য লোড করা হচ্ছে...",
    errorPrefix: "ত্রুটি:",
    emptyText: "কোনো স্টাফের তথ্য পাওয়া যায়নি।",
    colStaffInfo: "স্টাফ পরিচিতি",
    colCheckIn: "প্রবেশ হাজিরা (Check-In)",
    colCheckInStatus: "প্রবেশ স্ট্যাটাস",
    colCheckOut: "প্রস্থান হাজিরা (Check-Out)",
    colCheckOutStatus: "প্রস্থান স্ট্যাটাস",
    colWorkHours: "কর্মঘণ্টা",
    colComments: "দেরি/পূর্বে প্রস্থানের কারণ",
    colAction: "হাজিরা পরিবর্তন",
    mapCheckInTitle: "ম্যাপে চেক-ইন লোকেশন দেখুন",
    mapCheckOutTitle: "ম্যাপে চেক-আউট লোকেশন দেখুন",
    absentText: "অনুপস্থিত",
    statusOnTime: "সময়মতো (On Time)",
    statusLate: "দেরিতে (Late)",
    statusAbsent: "অনুপস্থিত (Absent)",
    statusEarly: "পূর্বে প্রস্থান (Early)",
    statusOvertime: "ওভারটাইম (Overtime)",
    pendingText: "অপেক্ষমান",
    lateLabel: "দেরি:",
    earlyLabel: "আর্লি:",
    editBtn: "সম্পাদনা",
    markPresentBtn: "উপস্থিত করুন",
    modalTitlePrefix: "হাজিরা নথিভুক্ত করুন",
    dateLabel: "তারিখ",
    term1StatusLabel: "১ম টার্ম (প্রবেশ স্ট্যাটাস)",
    term2StatusLabel: "২য় টার্ম (প্রস্থান স্ট্যাটাস)",
    optPendingCheckout: "অপেক্ষমান (প্রস্থান হয়নি)",
    optOnTime: "সময়মতো (On Time)",
    optLate: "দেরিতে (Late)",
    optEarly: "পূর্বে প্রস্থান (Early)",
    optOvertime: "অতিরিক্ত সময় (Overtime)",
    term1CommentLabel: "১ম টার্ম দেরির কারণ (মন্তব্য)",
    term1CommentPlaceholder: "সকালের দেরির কারণ লিখুন...",
    term2CommentLabel: "২য় টার্ম প্রস্থান বা বিশেষ মন্তব্য",
    term2CommentPlaceholder: "রাতের প্রস্থান বা বিশেষ কারণ লিখুন...",
    cancelBtn: "বাতিল",
    confirmBtn: "নিশ্চিত করুন",
    monthlyModalTitle: "মাসিক কর্মচারী উপস্থিতি রিপোর্ট",
    monthlyModalSubtitle:
      "প্রিন্ট বা পিডিএফ ডাউনলোডের পূর্বে প্রিভিউ যাচাই করুন",
    printDownloadBtn: "প্রিন্ট / ডাউনলোড (Print)",
    loadingMonthlyText: "মাসিক রিপোর্ট লোড হচ্ছে...",
    noDataText: "কোনো তথ্য পাওয়া যায়নি।",
    reportHeaderTitle: "কর্মচারী (স্টাফ) মাসিক উপস্থিতি রিপোর্ট রেজিস্টার",
    totalWorkingDaysLabel: "মোট কার্যদিবস:",
    daysUnit: "দিন",
    totalStaffLabel: "মোট স্টাফ:",
    colSerial: "ক্র.",
    colStaffName: "স্টাফের নাম",
    colDesignation: "পদবি",
    colPresent: "উপস্থিত",
    colTerm1OnTime: "১ম টার্ম অন-টাইম",
    colTerm1Late: "১ম টার্ম লেট",
    colEarlyExit: "পূর্বে প্রস্থান",
    colAbsent: "অনুপস্থিত",
    colRate: "শতকরা হার",
    colReasons: "দেরি বা আগাম প্রস্থানের কারণসমূহ",
    dateTagSuffix: "তারিখ",
    lateTag: "লেট",
    earlyTag: "আর্লি",
    principalLabel: "প্রিন্সিপাল",
    fetchErrMsg: "স্টাফ হাজিরা লোড করতে সমস্যা হয়েছে।",
    saveSuccessMsg: "হাজিরা সফলভাবে সংরক্ষিত হয়েছে!",
    saveErrMsg: "হাজিরা সংরক্ষণে ব্যর্থ হয়েছে!",
  },
  en: {
    tabAllStaff: "All Staff Directory",
    tabIdCard: "Staff ID Card Generator",
    tabAttendance: "Staff Attendance",
    badgeTitle: "Administrative Staff Management",
    pageTitle: "Staff Attendance Overview",
    pageSubtitle:
      "Monitor daily attendance, shift punctuality, and working hours of all madrasa staff.",
    monthlyReportBtn: "Print / Download Monthly Report",
    refreshTitle: "Refresh Data",
    scheduleTitle: "Daily 2-Term Staff Attendance Schedule:",
    scheduleTerm1: "1st Term (Morning Check-In): Cutoff",
    scheduleTerm1Time: "5:30 AM",
    scheduleTerm1Note: "(Late thereafter)",
    scheduleTerm2: "2nd Term (Night Check-Out): Window",
    scheduleTerm2Time: "10:00 PM – 10:10 PM",
    scheduleTerm2Note: "(Early before, Overtime after).",
    registerTitle: "Staff Attendance Register",
    totalDisplayed: "Total Displayed:",
    personUnit: "Staff",
    loadingText: "Loading attendance records...",
    errorPrefix: "Error:",
    emptyText: "No staff attendance records found.",
    colStaffInfo: "Staff Profile",
    colCheckIn: "Check-In Time",
    colCheckInStatus: "Check-In Status",
    colCheckOut: "Check-Out Time",
    colCheckOutStatus: "Check-Out Status",
    colWorkHours: "Work Duration",
    colComments: "Late / Early Exit Remarks",
    colAction: "Update Record",
    mapCheckInTitle: "View Check-In Location on Map",
    mapCheckOutTitle: "View Check-Out Location on Map",
    absentText: "Absent",
    statusOnTime: "On Time",
    statusLate: "Late",
    statusAbsent: "Absent",
    statusEarly: "Early",
    statusOvertime: "Overtime",
    pendingText: "Pending",
    lateLabel: "Late:",
    earlyLabel: "Early:",
    editBtn: "Edit",
    markPresentBtn: "Mark Present",
    modalTitlePrefix: "Record Attendance",
    dateLabel: "Date",
    term1StatusLabel: "1st Term (Check-In Status)",
    term2StatusLabel: "2nd Term (Check-Out Status)",
    optPendingCheckout: "Pending (Not Checked Out)",
    optOnTime: "On Time",
    optLate: "Late",
    optEarly: "Early Exit (Early)",
    optOvertime: "Overtime",
    term1CommentLabel: "1st Term Late Reason (Comment)",
    term1CommentPlaceholder: "Enter reason for morning delay...",
    term2CommentLabel: "2nd Term Exit or Special Note",
    term2CommentPlaceholder: "Enter night exit or special remarks...",
    cancelBtn: "Cancel",
    confirmBtn: "Save Record",
    monthlyModalTitle: "Monthly Staff Attendance Report",
    monthlyModalSubtitle: "Review preview before printing or downloading PDF",
    printDownloadBtn: "Print / Download PDF",
    loadingMonthlyText: "Loading monthly report...",
    noDataText: "No report data available.",
    reportHeaderTitle: "Monthly Staff Attendance Register Report",
    totalWorkingDaysLabel: "Total Working Days:",
    daysUnit: "Days",
    totalStaffLabel: "Total Staff:",
    colSerial: "SL",
    colStaffName: "Staff Name",
    colDesignation: "Designation",
    colPresent: "Present",
    colTerm1OnTime: "1st Term On-Time",
    colTerm1Late: "1st Term Late",
    colEarlyExit: "Early Exit",
    colAbsent: "Absent",
    colRate: "Rate (%)",
    colReasons: "Reasons for Late / Early Exit",
    dateTagSuffix: "Date",
    lateTag: "Late",
    earlyTag: "Early",
    principalLabel: "Principal",
    fetchErrMsg: "Failed to load staff attendance.",
    saveSuccessMsg: "Attendance saved successfully!",
    saveErrMsg: "Failed to save attendance!",
  },
  ar: {
    tabAllStaff: "قائمة جميع الموظفين",
    tabIdCard: "إصدار بطاقة هوية الموظف",
    tabAttendance: "حضور الموظفين (Attendance)",
    badgeTitle: "إدارة الموظفين الإداريين",
    pageTitle: "ملخص حضور وانصراف الموظفين",
    pageSubtitle: "مراقبة الحضور اليومي وساعات العمل لجميع موظفي المدرسة.",
    monthlyReportBtn: "طباعة / تحميل التقرير الشهري",
    refreshTitle: "تحديث البيانات",
    scheduleTitle: "جدول حضور الموظفين اليومي (فترتان):",
    scheduleTerm1: "الفترة الأولى (تسجيل الدخول صباحاً): آخر موعد",
    scheduleTerm1Time: "5:30 فجراً",
    scheduleTerm1Note: "(يُعتبر متأخراً بعده)",
    scheduleTerm2: "الفترة الثانية (تسجيل الانصراف ليلاً): الوقت",
    scheduleTerm2Time: "10:00 مساءً إلى 10:10 مساءً",
    scheduleTerm2Note: "(مبكر قبله، عمل إضافي بعده).",
    registerTitle: "سجل حضور الموظفين",
    totalDisplayed: "إجمالي المعروض:",
    personUnit: "موظف",
    loadingText: "جاري تحميل البيانات...",
    errorPrefix: "خطأ:",
    emptyText: "لم يتم العثور على بيانات أي موظف.",
    colStaffInfo: "بيانات الموظف",
    colCheckIn: "وقت الدخول (Check-In)",
    colCheckInStatus: "حالة الدخول",
    colCheckOut: "وقت الانصراف (Check-Out)",
    colCheckOutStatus: "حالة الانصراف",
    colWorkHours: "ساعات العمل",
    colComments: "سبب التأخير / الانصراف المبكر",
    colAction: "تعديل الحضور",
    mapCheckInTitle: "عرض موقع الدخول على الخريطة",
    mapCheckOutTitle: "عرض موقع الانصراف على الخريطة",
    absentText: "غائب",
    statusOnTime: "في الوقت (On Time)",
    statusLate: "متأخر (Late)",
    statusAbsent: "غائب (Absent)",
    statusEarly: "انصراف مبكر (Early)",
    statusOvertime: "وقت إضافي (Overtime)",
    pendingText: "قيد الانتظار",
    lateLabel: "تأخير:",
    earlyLabel: "مبكر:",
    editBtn: "تعديل",
    markPresentBtn: "تسجيل حضور",
    modalTitlePrefix: "تسجيل حضور الموظف",
    dateLabel: "التاريخ",
    term1StatusLabel: "الفترة الأولى (حالة الدخول)",
    term2StatusLabel: "الفترة الثانية (حالة الانصراف)",
    optPendingCheckout: "قيد الانتظار (لم ينصرف بعد)",
    optOnTime: "في الوقت المحدد (On Time)",
    optLate: "متأخر (Late)",
    optEarly: "انصراف مبكر (Early)",
    optOvertime: "وقت إضافي (Overtime)",
    term1CommentLabel: "سبب تأخير الفترة الأولى (ملاحظة)",
    term1CommentPlaceholder: "اكتب سبب التأخير الصباحي...",
    term2CommentLabel: "ملاحظة انصراف الفترة الثانية",
    term2CommentPlaceholder: "اكتب سبب الانصراف الليلي أو ملاحظة خاصة...",
    cancelBtn: "إلغاء",
    confirmBtn: "تأكيد الحفظ",
    monthlyModalTitle: "تقرير حضور الموظفين الشهري",
    monthlyModalSubtitle: "يرجى مراجعة المعاينة قبل الطباعة أو تحميل ملف PDF",
    printDownloadBtn: "طباعة / تحميل (Print)",
    loadingMonthlyText: "جاري تحميل التقرير الشهري...",
    noDataText: "لا توجد بيانات متاحة.",
    reportHeaderTitle: "سجل التقرير الشهري لحضور الموظفين",
    totalWorkingDaysLabel: "إجمالي أيام العمل:",
    daysUnit: "يوم",
    totalStaffLabel: "إجمالي الموظفين:",
    colSerial: "م",
    colStaffName: "اسم الموظف",
    colDesignation: "المسمى الوظيفي",
    colPresent: "حاضر",
    colTerm1OnTime: "فترة ١ في الوقت",
    colTerm1Late: "فترة ١ متأخر",
    colEarlyExit: "انصراف مبكر",
    colAbsent: "غائب",
    colRate: "النسبة المئوية",
    colReasons: "أسباب التأخير أو الانصراف المبكر",
    dateTagSuffix: "يوم",
    lateTag: "تأخير",
    earlyTag: "مبكر",
    principalLabel: "مدير المدرسة (Principal)",
    fetchErrMsg: "حدثت مشكلة أثناء تحميل حضور الموظفين.",
    saveSuccessMsg: "تم حفظ الحضور بنجاح!",
    saveErrMsg: "فشل في حفظ الحضور!",
  },
};

export default function StaffAttendancePage() {
  const { lang } = useLanguage();
  const t = ADMIN_STAFF_I18N[lang] || ADMIN_STAFF_I18N.bn;
  const isAr = lang === "ar";

  const [selectedDate, setSelectedDate] = useState(() => {
    return getDhakaTime().dateStr;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monthly summary modal & report states
  const [monthlyModalOpen, setMonthlyModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return getDhakaTime().dateStr.slice(0, 7);
  });
  const [monthlyData, setMonthlyData] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  const [metrics, setMetrics] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    onTimeToday: 0,
    lateToday: 0,
  });

  const [attendanceList, setAttendanceList] = useState([]);
  const [isToday, setIsToday] = useState(true);

  // Manual Attendance Modal
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedStaffToRecord, setSelectedStaffToRecord] = useState(null);
  const [recordStatus, setRecordStatus] = useState("On Time");
  const [recordComment, setRecordComment] = useState("");
  const [recordCheckOutStatus, setRecordCheckOutStatus] = useState("On Time");
  const [recordCheckOutComment, setRecordCheckOutComment] = useState("");
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  // Fetch Staff Attendance
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams({
        date: selectedDate,
        search: searchQuery,
        status: statusFilter,
      });

      const res = await fetch(
        `${API_BASE}/api/admin/staff-attendance?${query.toString()}`,
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || t.fetchErrMsg);
      }

      setMetrics(data.metrics);
      setAttendanceList(data.attendanceList || []);
      setIsToday(data.isToday);
    } catch (err) {
      console.error("Staff attendance fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, searchQuery, statusFilter, t.fetchErrMsg]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Fetch Monthly Attendance Summary
  const fetchMonthlyData = async (monthToFetch) => {
    const targetMonth = monthToFetch || selectedMonth;
    try {
      setLoadingMonthly(true);
      const res = await fetch(
        `${API_BASE}/api/admin/staff-attendance?month=${targetMonth}`,
      );
      const json = await res.json();
      if (json.success) {
        setMonthlyData(json);
      }
    } catch (err) {
      console.error("Failed to fetch monthly staff attendance:", err);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const handleOpenMonthlySummary = () => {
    setMonthlyModalOpen(true);
    fetchMonthlyData(selectedMonth);
  };

  const handlePrintMonthly = () => {
    window.print();
  };

  // Open Record Modal
  const handleOpenRecord = (staff) => {
    setSelectedStaffToRecord(staff);
    setRecordStatus(staff.checkInStatus === "Late" ? "Late" : "On Time");
    setRecordComment(staff.checkInComment || "");
    setRecordCheckOutStatus(staff.checkOutStatus || "");
    setRecordCheckOutComment(staff.checkOutComment || "");
    setRecordModalOpen(true);
  };

  // Submit Manual Attendance
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!selectedStaffToRecord) return;

    try {
      setIsSavingRecord(true);
      const res = await fetch(`${API_BASE}/api/admin/staff-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedStaffToRecord.staffId,
          staffName: selectedStaffToRecord.fullName,
          staffEmail: selectedStaffToRecord.email,
          date: selectedDate,
          checkInStatus: recordStatus,
          checkInComment: recordComment.trim() || null,
          checkOutStatus: recordCheckOutStatus,
          checkOutComment: recordCheckOutComment.trim() || null,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);

      toast.success(result.message || t.saveSuccessMsg);
      setRecordModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || t.saveErrMsg);
    } finally {
      setIsSavingRecord(false);
    }
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="space-y-6 pb-12">
      {/* Luxury Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/90 dark:bg-[#02120c]/90 backdrop-blur-xl rounded-2xl w-fit border border-emerald-200/80 dark:border-amber-400/20 shadow-[0_8px_25px_-6px_rgba(6,78,59,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <Link
          href="/dashboard/admin/staff-management"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800/80 dark:text-emerald-200/80 hover:text-emerald-950 dark:hover:text-amber-300 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/60 transition-all"
        >
          <Users className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
          <span>{t.tabAllStaff}</span>
        </Link>
        <Link
          href="/dashboard/admin/staff-management/staff-id-card"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800/80 dark:text-emerald-200/80 hover:text-emerald-950 dark:hover:text-amber-300 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/60 transition-all"
        >
          <CreditCard className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
          <span>{t.tabIdCard}</span>
        </Link>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 dark:from-amber-500 dark:via-amber-400 dark:to-yellow-500 text-white dark:text-emerald-950 shadow-[0_6px_18px_rgba(6,78,59,0.25)] dark:shadow-[0_6px_18px_rgba(251,191,36,0.25)] border border-emerald-600/40 dark:border-amber-300/60">
          <UserCheck className="w-4 h-4 text-amber-300 dark:text-emerald-950" />
          <span>{t.tabAttendance}</span>
        </span>
      </div>

      {/* Royal Emerald & Obsidian Jade Hero Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] p-6 sm:p-8 rounded-3xl border border-amber-400/30 dark:border-amber-400/25 shadow-[0_20px_50px_-15px_rgba(6,78,59,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-amber-400/10 border border-amber-300/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.badgeTitle}</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-black text-white tracking-tight ${
              isAr ? "kufi-custom" : ""
            }`}
          >
            {t.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/85 dark:text-emerald-200/75 mt-1.5 max-w-2xl">
            {t.pageSubtitle}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenMonthlySummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 text-xs font-black shadow-[0_10px_25px_-5px_rgba(251,191,36,0.45)] transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-950" />
            <span>{t.monthlyReportBtn}</span>
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-amber-300 border border-amber-400/30 transition-all disabled:opacity-50 cursor-pointer"
            title={t.refreshTitle}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <AttendanceSummaryMetrics
        variant="staff"
        metrics={metrics}
        isToday={isToday}
      />

      {/* ২ টার্ম হাজিরা শিডিউল ব্যানার */}
      <div className="bg-gradient-to-r from-emerald-50/95 via-amber-50/70 to-teal-50/95 dark:from-[#041e14]/90 dark:via-[#02120c]/95 dark:to-[#041e14]/90 border border-emerald-300/60 dark:border-amber-400/25 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 dark:from-amber-400 dark:to-amber-500 text-white dark:text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-black text-emerald-950 dark:text-amber-300">
              {t.scheduleTitle}
            </span>{" "}
            <span className="text-emerald-900/85 dark:text-emerald-100/85">
              {t.scheduleTerm1}{" "}
              <strong className="text-emerald-800 dark:text-amber-300 font-black">
                {t.scheduleTerm1Time}
              </strong>{" "}
              {t.scheduleTerm1Note} • {t.scheduleTerm2}{" "}
              <strong className="text-teal-800 dark:text-emerald-300 font-black">
                {t.scheduleTerm2Time}
              </strong>{" "}
              {t.scheduleTerm2Note}
            </span>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <AttendanceFilterBar
        variant="staff"
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        metrics={metrics}
      />

      {/* Attendance Table */}
      <div className="bg-white/95 dark:bg-gradient-to-b dark:from-[#031710] dark:to-[#010a06] rounded-3xl border border-emerald-200/80 dark:border-amber-400/20 shadow-[0_15px_40px_-15px_rgba(6,78,59,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-emerald-100 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/60 via-white to-amber-50/40 dark:from-[#041e14] dark:via-[#02120c] dark:to-[#041e14]">
          <h2
            className={`text-base sm:text-lg font-black text-emerald-950 dark:text-white flex items-center gap-2.5 ${
              isAr ? "kufi-custom" : ""
            }`}
          >
            <span>{t.registerTitle}</span>
            <span className="text-xs px-2.5 py-0.5 bg-emerald-800 dark:bg-amber-400/20 border border-emerald-700 dark:border-amber-400/40 rounded-lg text-amber-200 dark:text-amber-300 font-bold">
              {selectedDate}
            </span>
          </h2>
          <span className="text-xs font-bold text-emerald-800 dark:text-amber-300/90 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-200 dark:border-amber-400/20">
            {t.totalDisplayed} {attendanceList.length} {t.personUnit}
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-emerald-700 dark:text-emerald-300 text-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-emerald-600 dark:text-amber-400" />
            <span className="font-bold">{t.loadingText}</span>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-rose-600 dark:text-rose-400 text-sm font-bold">
            {t.errorPrefix} {error}
          </div>
        ) : attendanceList.length === 0 ? (
          <div className="py-16 text-center text-emerald-700/60 dark:text-emerald-300/60 text-sm font-bold">
            {t.emptyText}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider bg-emerald-50/80 dark:bg-[#041e14]/90 text-emerald-900 dark:text-amber-300/90 border-b border-emerald-200/70 dark:border-amber-400/20">
                <tr>
                  <th className="py-3.5 px-5 font-black">{t.colStaffInfo}</th>
                  <th className="py-3.5 px-4 font-black">{t.colCheckIn}</th>
                  <th className="py-3.5 px-4 font-black">
                    {t.colCheckInStatus}
                  </th>
                  <th className="py-3.5 px-4 font-black">{t.colCheckOut}</th>
                  <th className="py-3.5 px-4 font-black">
                    {t.colCheckOutStatus}
                  </th>
                  <th className="py-3.5 px-4 font-black">{t.colWorkHours}</th>
                  <th className="py-3.5 px-4 font-black">{t.colComments}</th>
                  <th className="py-3.5 px-4 font-black text-center">
                    {t.colAction}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100/80 dark:divide-emerald-900/40">
                {attendanceList.map((item) => (
                  <tr
                    key={item.staffId}
                    className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 dark:from-amber-400/20 dark:to-emerald-900/60 border border-emerald-600/30 dark:border-amber-400/40 text-white dark:text-amber-300 font-black flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
                          {item.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-emerald-950 dark:text-white leading-snug">
                            {item.fullName}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-800 dark:text-amber-300 bg-emerald-100/80 dark:bg-amber-400/10 border border-emerald-200/80 dark:border-amber-400/25 px-2 py-0.5 rounded-md">
                            {item.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs whitespace-nowrap">
                      {item.hasCheckedIn ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-black text-emerald-950 dark:text-emerald-100">
                            <Clock3 className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400" />
                            <span>{formatTime(item.checkInTime)}</span>
                          </div>
                          {item.checkInLocation?.lat &&
                            item.checkInLocation?.lng && (
                              <a
                                href={`https://www.google.com/maps?q=${item.checkInLocation.lat},${item.checkInLocation.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-amber-300 hover:underline"
                                title={t.mapCheckInTitle}
                              >
                                <MapPin className="w-3 h-3" />
                                <span>
                                  GPS
                                  {item.checkInLocation.distance !== undefined
                                    ? ` (${item.checkInLocation.distance}m)`
                                    : ""}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 font-medium">
                          {t.absentText}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.hasCheckedIn ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.checkInStatus === "On Time"
                              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60"
                          }`}
                        >
                          {item.checkInStatus === "On Time" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {item.checkInStatus === "On Time"
                            ? t.statusOnTime
                            : t.statusLate}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          <XCircle className="w-3.5 h-3.5" />
                          {t.statusAbsent}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs whitespace-nowrap">
                      {item.hasCheckedOut ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-black text-emerald-950 dark:text-emerald-100">
                            <Clock3 className="w-3.5 h-3.5 text-teal-600 dark:text-amber-400" />
                            <span>{formatTime(item.checkOutTime)}</span>
                          </div>
                          {item.checkOutLocation?.lat &&
                            item.checkOutLocation?.lng && (
                              <a
                                href={`https://www.google.com/maps?q=${item.checkOutLocation.lat},${item.checkOutLocation.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-amber-300 hover:underline"
                                title={t.mapCheckOutTitle}
                              >
                                <MapPin className="w-3 h-3" />
                                <span>
                                  GPS
                                  {item.checkOutLocation.distance !== undefined
                                    ? ` (${item.checkOutLocation.distance}m)`
                                    : ""}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                        </div>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>

                    {/* Check-Out Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.hasCheckedOut ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.checkOutStatus === "On Time"
                              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60"
                              : item.checkOutStatus === "Early"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60"
                                : "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-600/60"
                          }`}
                        >
                          {item.checkOutStatus === "On Time" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {item.checkOutStatus === "On Time"
                            ? t.statusOnTime
                            : item.checkOutStatus === "Early"
                              ? t.statusEarly
                              : t.statusOvertime}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {t.pendingText}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs font-bold text-emerald-900 dark:text-amber-200 whitespace-nowrap">
                      {calculateWorkDuration(
                        item.checkInTime,
                        item.checkOutTime,
                      ) || <span className="text-slate-400">--</span>}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-emerald-100/80 max-w-xs">
                      {item.checkInComment || item.checkOutComment ? (
                        <div className="flex flex-col gap-1">
                          {item.checkInComment && (
                            <span
                              title={item.checkInComment}
                              className="truncate"
                            >
                              <strong className="text-rose-600 dark:text-rose-400 font-bold">
                                {t.lateLabel}
                              </strong>{" "}
                              {item.checkInComment}
                            </span>
                          )}
                          {item.checkOutComment && (
                            <span
                              title={item.checkOutComment}
                              className="truncate"
                            >
                              <strong className="text-amber-600 dark:text-amber-400 font-bold">
                                {t.earlyLabel}
                              </strong>{" "}
                              {item.checkOutComment}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleOpenRecord(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-700 dark:bg-emerald-950/90 dark:hover:bg-amber-400 text-xs font-bold text-emerald-900 hover:text-white dark:text-amber-300 dark:hover:text-emerald-950 border border-emerald-200/80 dark:border-amber-400/30 transition-all shadow-2xs cursor-pointer"
                      >
                        {item.hasCheckedIn ? t.editBtn : t.markPresentBtn}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Manual Attendance Modal */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#02120c] rounded-3xl max-w-md w-full shadow-2xl border border-emerald-200 dark:border-amber-400/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/60 pb-3">
              <h3
                className={`text-base font-black text-emerald-950 dark:text-amber-300 ${
                  isAr ? "kufi-custom" : ""
                }`}
              >
                {t.modalTitlePrefix} ({selectedStaffToRecord?.fullName})
              </h3>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-amber-300 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-amber-200/90 mb-1">
                  {t.dateLabel}
                </label>
                <input
                  type="date"
                  disabled
                  value={selectedDate}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 dark:text-amber-200/90 mb-1">
                    {t.term1StatusLabel}
                  </label>
                  <select
                    value={recordStatus}
                    onChange={(e) => setRecordStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 dark:border-amber-400/30 bg-white dark:bg-[#041e14] text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-amber-400 font-bold"
                  >
                    <option value="On Time">{t.optOnTime}</option>
                    <option value="Late">{t.optLate}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 dark:text-amber-200/90 mb-1">
                    {t.term2StatusLabel}
                  </label>
                  <select
                    value={recordCheckOutStatus}
                    onChange={(e) => setRecordCheckOutStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 dark:border-amber-400/30 bg-white dark:bg-[#041e14] text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-amber-400 font-bold"
                  >
                    <option value="">{t.optPendingCheckout}</option>
                    <option value="On Time">{t.optOnTime}</option>
                    <option value="Early">{t.optEarly}</option>
                    <option value="Overtime">{t.optOvertime}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-amber-200/90 mb-1">
                  {t.term1CommentLabel}
                </label>
                <textarea
                  rows={2}
                  value={recordComment}
                  onChange={(e) => setRecordComment(e.target.value)}
                  placeholder={t.term1CommentPlaceholder}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 dark:border-amber-400/30 bg-white dark:bg-[#041e14] text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-amber-200/90 mb-1">
                  {t.term2CommentLabel}
                </label>
                <textarea
                  rows={2}
                  value={recordCheckOutComment}
                  onChange={(e) => setRecordCheckOutComment(e.target.value)}
                  placeholder={t.term2CommentPlaceholder}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 dark:border-amber-400/30 bg-white dark:bg-[#041e14] text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSavingRecord}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 dark:from-amber-400 dark:to-amber-500 hover:from-emerald-700 hover:to-teal-600 text-white dark:text-emerald-950 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isSavingRecord ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{t.confirmBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monthly Summary Modal (A4 Landscape Layout) */}
      {monthlyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#02120c] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 dark:border-amber-400/30 overflow-hidden">
            {/* Non-Printable Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 dark:from-[#041e14] dark:via-[#02120c] dark:to-[#041e14] border-b border-amber-400/30 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3
                    className={`text-base font-black text-white ${
                      isAr ? "kufi-custom" : ""
                    }`}
                  >
                    {t.monthlyModalTitle}
                  </h3>
                  <p className="text-xs text-emerald-100/80">
                    {t.monthlyModalSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Month Selector */}
                <div className="flex items-center gap-2 bg-white/95 dark:bg-[#041e14] px-3 py-1.5 rounded-xl border border-amber-400/40">
                  <Calendar className="w-4 h-4 text-emerald-700 dark:text-amber-400" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      fetchMonthlyData(e.target.value);
                    }}
                    className="text-xs font-bold bg-transparent text-emerald-950 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={handlePrintMonthly}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.printDownloadBtn}</span>
                </button>

                <button
                  onClick={() => setMonthlyModalOpen(false)}
                  className="p-2 rounded-xl text-emerald-100 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Container */}
            <div
              className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white text-slate-900"
              id="printable-staff-monthly-summary"
            >
              {loadingMonthly ? (
                <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                  <span>{t.loadingMonthlyText}</span>
                </div>
              ) : !monthlyData ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  {t.noDataText}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header with separate Logo and Banner matching exam routine page */}
                  <div className="flex items-center justify-center gap-0 mb-2 border-b-4 border-double border-gray-800 pb-1 pl-2">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/aimlogo1.png"
                        alt="Institution Logo"
                        className="w-full h-full object-cover scale-[1.05]"
                      />
                    </div>
                    <div className="flex-grow text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/banner_routine.png"
                        alt="Institution Banner"
                        className="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                      />
                    </div>
                  </div>

                  {/* Title Header */}
                  <div className="text-center mb-3 space-y-0.5">
                    <h3 className="text-xs md:text-sm font-bold text-gray-800">
                      {t.reportHeaderTitle}
                    </h3>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                      {formatMonthBangla(selectedMonth)}
                    </h2>
                    <p className="text-xs text-gray-600 font-semibold">
                      {t.totalWorkingDaysLabel} {monthlyData.totalWorkingDays}{" "}
                      {t.daysUnit} | {t.totalStaffLabel}{" "}
                      {monthlyData.totalStaff} {t.personUnit}
                    </p>
                  </div>

                  {/* Table Matrix */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-800 text-gray-900 text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-center font-bold">
                          <th className="border border-gray-800 py-2 px-1 w-10">
                            {t.colSerial}
                          </th>
                          <th className="border border-gray-800 py-2 px-3 text-left">
                            {t.colStaffName}
                          </th>
                          <th className="border border-gray-800 py-2 px-2 text-left">
                            {t.colDesignation}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {t.colPresent}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {t.colTerm1OnTime}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {t.colTerm1Late}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {t.colEarlyExit}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {t.colAbsent}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {t.colRate}
                          </th>
                          <th className="border border-gray-800 py-2 px-3 text-left">
                            {t.colReasons}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(monthlyData.summary || monthlyData.staffSummary)?.map(
                          (staff, index) => (
                            <tr
                              key={staff.staffId || index}
                              className="text-center hover:bg-gray-50"
                            >
                              <td className="border border-gray-800 py-1.5 px-1">
                                {index + 1}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-3 text-left font-bold">
                                {staff.fullName}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 text-left text-gray-700">
                                {staff.designation}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 font-bold text-teal-800">
                                {staff.presentDays} {t.daysUnit}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 text-emerald-700">
                                {staff.onTimeDays}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 text-rose-700 font-semibold">
                                {staff.lateDays}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 text-amber-700">
                                {staff.earlyExitDays}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 text-red-600 font-semibold">
                                {staff.absentDays} {t.daysUnit}
                              </td>
                              <td className="border border-gray-800 py-1.5 px-2 font-bold">
                                {staff.attendanceRate}%
                              </td>
                              <td className="border border-gray-800 py-1.5 px-3 text-left text-[11px] text-gray-600">
                                {staff.lateComments?.length > 0 ||
                                staff.earlyComments?.length > 0 ? (
                                  <div className="space-y-0.5">
                                    {staff.lateComments
                                      ?.slice(0, 2)
                                      .map((c, i) => (
                                        <div
                                          key={`l-${i}`}
                                          className="truncate"
                                        >
                                          <span className="font-semibold text-rose-700">
                                            [{c.date.slice(8)} {t.dateTagSuffix}{" "}
                                            ({t.lateTag})]:
                                          </span>{" "}
                                          {c.comment}
                                        </div>
                                      ))}
                                    {staff.earlyComments
                                      ?.slice(0, 2)
                                      .map((c, i) => (
                                        <div
                                          key={`e-${i}`}
                                          className="truncate"
                                        >
                                          <span className="font-semibold text-amber-700">
                                            [{c.date.slice(8)} {t.dateTagSuffix}{" "}
                                            ({t.earlyTag})]:
                                          </span>{" "}
                                          {c.comment}
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Principal Signature & Footer Section */}
                  <div className="mt-8 pt-4 flex justify-end items-end px-6 break-inside-avoid print:mt-6 print:px-2">
                    {/* প্রিন্সিপাল এর স্বাক্ষর (Admit Card Styling Reused) */}
                    <div className="text-center flex flex-col items-center">
                      <div className="relative w-36 h-6 print:mt-auto">
                        <Image
                          src={"/principle's_signature.jpg"}
                          alt="Principal Signature"
                          width={100}
                          height={40}
                          unoptimized
                          className="absolute -top-1.5 right-8 h-7 w-14 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                        />
                      </div>
                      <div className="w-36 border-b border-gray-800 mb-1"></div>
                      <span className="text-xs font-bold text-gray-900">
                        {t.principalLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* A4 Landscape Print Styling */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm 10mm;
          }
          body * {
            visibility: hidden;
          }
          #printable-staff-monthly-summary,
          #printable-staff-monthly-summary * {
            visibility: visible;
          }
          #printable-staff-monthly-summary {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            min-height: 100vh;
            margin: 0;
            padding: 8mm 10mm;
            background: white !important;
            color: #111827 !important;
            z-index: 999999;
          }
        }
      `}</style>
    </div>
  );
}
