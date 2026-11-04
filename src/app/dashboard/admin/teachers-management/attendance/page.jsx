"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserCheck,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw,
  MapPin,
  ExternalLink,
  Shield,
  CheckCircle2,
  XCircle,
  Clock3,
  CreditCard,
  Printer,
  Download,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import TeacherMonthlyAttendancePdfDocument from "@/components/dashboard/teachers/attendance/TeacherMonthlyAttendancePdfDocument";
import {
  getDhakaTime,
  RESIDENTIAL_ATTENDANCE_RULES,
  HIFZ_ATTENDANCE_RULES,
  toBengaliNumber,
  formatMonthBangla as formatMonthBanglaUtil,
  formatDhakaTimeOnly as formatTime,
  calculateWorkDuration,
} from "@/lib/attendance-config";
import {
  AttendanceSummaryMetrics,
  AttendanceFilterBar,
} from "@/components/dashboard/attendance/AttendanceMetricsAndFilters";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const formatMonthBangla = (monthStr) => formatMonthBanglaUtil(monthStr, true);

const ADMIN_TEACHER_I18N = {
  bn: {
    tabIdCard: "শিক্ষক আইডি কার্ড তৈরি (ID Card)",
    tabAttendance: "শিক্ষক হাজিরা (Attendance)",
    headerBadge: "প্রশাসনিক শিক্ষক উপস্থিতি ও ব্যবস্থাপনা",
    headerTitle: "শিক্ষক হাজিরা সংক্ষিপ্ত বিবরণ",
    headerSub:
      "মাদরাসার সকল শিক্ষকের দৈনিক প্রবেশ ও প্রস্থান হাজিরা এবং পরিসংখ্যান পর্যবেক্ষণ করুন।",
    monthlyReportBtn: "মাসিক রিপোর্ট প্রিন্ট / ডাউনলোড",
    teacherPortalBtn: "শিক্ষক হাজিরা পেজ",
    refreshTitle: "রিফ্রেশ করুন",
    registerTitle: "হাজিরা রেজিস্টার তালিকা",
    totalShownPrefix: "মোট প্রদর্শিত:",
    personUnit: "জন",
    loadingText: "তথ্য লোড করা হচ্ছে...",
    errorPrefix: "ত্রুটি:",
    emptyText: "কোনো শিক্ষকের তথ্য বা হাজিরার রেকর্ড পাওয়া যায়নি।",
    noId: "আইডি নেই",
    autoIdBadge: "অটো আইডি",
    res3Shift: "আবাসিক (৩ শিফট)",
    hifz3Shift: "হিফজ (৩ শিফট)",
    threeShift: "৩ শিফট",
    shift1Label: "১ম শিফট",
    shift2Label: "২য় শিফট",
    shift3Label: "৩য় শিফট",
    lateShort: "দেরি",
    earlyShort: "আর্লি",
    colTeacherId: "শিক্ষক আইডি",
    colCheckIn: "প্রবেশ হাজিরা (Check-In)",
    colCheckInStatus: "প্রবেশ স্ট্যাটাস",
    colCheckOut: "প্রস্থান হাজিরা (Check-Out)",
    colCheckOutStatus: "প্রস্থান স্ট্যাটাস",
    colWorkHours: "কর্মঘণ্টা",
    colReasons: "দেরি/পূর্বে প্রস্থানের কারণ",
    colLocation: "অবস্থান",
    absentText: "অনুপস্থিত",
    pendingText: "অপেক্ষমান",
    shiftInfoBtn: "শিফট তথ্য",
    closeBtn: "বন্ধ করুন ✕",
    threeShiftDetailsSuffix: "— দৈনিক ৩ শিফট বিস্তারিত বিবরণ",
    resTeacherBadge: "আবাসিক শিক্ষক",
    hifzTeacherBadge: "হিফজ শিক্ষক",
    inLabel: "প্রবেশ (In):",
    outLabel: "প্রস্থান (Out):",
    lateReasonPrefix: "দেরির কারণ:",
    earlyReasonPrefix: "আর্লি কারণ:",
    monthlyModalTitle: "মাসিক শিক্ষক উপস্থিতি রিপোর্ট",
    monthlyModalSub: "প্রিন্ট বা পিডিএফ ডাউনলোডের পূর্বে প্রিভিউ যাচাই করুন",
    printViewBtn: "প্রিন্ট ভিউ",
    downloadBtn: "ডাউনলোড",
    loadingMonthlyText: "মাসিক উপস্থিতি রিপোর্ট লোড হচ্ছে...",
    noMonthlyData: "কোনো তথ্য পাওয়া যায়নি।",
    reportSheetTitle: "শিক্ষককদের মাসিক উপস্থিতি রিপোর্ট",
    totalWorkingDaysLabel: "মোট কার্যদিবস:",
    daysUnit: "দিন",
    totalTeachersLabel: "মোট শিক্ষক:",
    colSl: "ক্র.",
    colDesignation: "পদবি",
    colPresent: "উপস্থিত",
    colOnTime: "সময়মতো",
    colLate: "দেরিতে",
    colEarlyExit: "পূর্বে প্রস্থান",
    colAbsent: "অনুপস্থিত",
    colRate: "শতকরা হার",
    dateWord: "তারিখ",
    principalLabel: "প্রিন্সিপাল",
  },
  en: {
    tabIdCard: "Generate Teacher ID Card",
    tabAttendance: "Teacher Attendance",
    headerBadge: "Administrative Teacher Attendance & Management",
    headerTitle: "Teacher Attendance Overview",
    headerSub:
      "Monitor daily check-in, check-out, and attendance statistics for all Madrasah teachers.",
    monthlyReportBtn: "Print / Download Monthly Report",
    teacherPortalBtn: "Teacher Attendance Portal",
    refreshTitle: "Refresh",
    registerTitle: "Attendance Register List",
    totalShownPrefix: "Total Displayed:",
    personUnit: "teachers",
    loadingText: "Loading attendance data...",
    errorPrefix: "Error:",
    emptyText: "No teacher records or attendance logs found.",
    noId: "No ID",
    autoIdBadge: "Auto ID",
    res3Shift: "Residential (3 Shifts)",
    hifz3Shift: "Hifz (3 Shifts)",
    threeShift: "3 Shifts",
    shift1Label: "Shift 1",
    shift2Label: "Shift 2",
    shift3Label: "Shift 3",
    lateShort: "Late",
    earlyShort: "Early",
    colTeacherId: "Teacher ID",
    colCheckIn: "Check-In Time",
    colCheckInStatus: "Check-In Status",
    colCheckOut: "Check-Out Time",
    colCheckOutStatus: "Check-Out Status",
    colWorkHours: "Work Hours",
    colReasons: "Late / Early Exit Reason",
    colLocation: "Location",
    absentText: "Absent",
    pendingText: "Pending",
    shiftInfoBtn: "Shift Info",
    closeBtn: "Close ✕",
    threeShiftDetailsSuffix: "— Daily 3-Shift Breakdown",
    resTeacherBadge: "Residential Teacher",
    hifzTeacherBadge: "Hifz Teacher",
    inLabel: "Check-In:",
    outLabel: "Check-Out:",
    lateReasonPrefix: "Late Reason:",
    earlyReasonPrefix: "Early Reason:",
    monthlyModalTitle: "Monthly Teacher Attendance Report",
    monthlyModalSub: "Review the preview before printing or downloading PDF",
    printViewBtn: "Print View",
    downloadBtn: "Download PDF",
    loadingMonthlyText: "Loading monthly attendance report...",
    noMonthlyData: "No data found.",
    reportSheetTitle: "Teachers Monthly Attendance Report",
    totalWorkingDaysLabel: "Total Working Days:",
    daysUnit: "days",
    totalTeachersLabel: "Total Teachers:",
    colSl: "SL",
    colDesignation: "Designation",
    colPresent: "Present",
    colOnTime: "On Time",
    colLate: "Late",
    colEarlyExit: "Early Exit",
    colAbsent: "Absent",
    colRate: "Rate (%)",
    dateWord: "Date",
    principalLabel: "Principal",
  },
  ar: {
    tabIdCard: "إصدار بطاقة المعلم (ID Card)",
    tabAttendance: "حضور المعلمين (Attendance)",
    headerBadge: "الإدارة والإشراف على حضور المعلمين",
    headerTitle: "ملخص حضور المعلمين",
    headerSub:
      "متابعة سجلات الحضور والانصراف اليومية والإحصائيات لجميع معلمي المدرسة.",
    monthlyReportBtn: "طباعة / تحميل التقرير الشهري",
    teacherPortalBtn: "بوابة حضور المعلمين",
    refreshTitle: "تحديث",
    registerTitle: "قائمة سجل الحضور",
    totalShownPrefix: "إجمالي المعروض:",
    personUnit: "معلم",
    loadingText: "جاري تحميل البيانات...",
    errorPrefix: "خطأ:",
    emptyText: "لم يتم العثور على بيانات أو سجلات حضور للمعلمين.",
    noId: "بدون رقم",
    autoIdBadge: "رقم تلقائي",
    res3Shift: "داخلي (٣ فترات)",
    hifz3Shift: "تحفيظ (٣ فترات)",
    threeShift: "٣ فترات",
    shift1Label: "الفترة ١",
    shift2Label: "الفترة ٢",
    shift3Label: "الفترة ٣",
    lateShort: "تأخير",
    earlyShort: "مبكر",
    colTeacherId: "رقم المعلم",
    colCheckIn: "وقت الدخول (Check-In)",
    colCheckInStatus: "حالة الدخول",
    colCheckOut: "وقت الانصراف (Check-Out)",
    colCheckOutStatus: "حالة الانصراف",
    colWorkHours: "ساعات العمل",
    colReasons: "سبب التأخير / الانصراف المبكر",
    colLocation: "الموقع",
    absentText: "غائب",
    pendingText: "قيد الانتظار",
    shiftInfoBtn: "تفاصيل الفترات",
    closeBtn: "إغلاق ✕",
    threeShiftDetailsSuffix: "— تفاصيل ٣ فترات يومية",
    resTeacherBadge: "معلم داخلي",
    hifzTeacherBadge: "معلم تحفيظ",
    inLabel: "الدخول:",
    outLabel: "الانصراف:",
    lateReasonPrefix: "سبب التأخير:",
    earlyReasonPrefix: "سبب الانصراف المبكر:",
    monthlyModalTitle: "تقرير حضور المعلمين الشهري",
    monthlyModalSub: "راجع المعاينة قبل الطباعة أو تحميل ملف PDF",
    printViewBtn: "معاينة الطباعة",
    downloadBtn: "تحميل PDF",
    loadingMonthlyText: "جاري تحميل التقرير الشهري...",
    noMonthlyData: "لا توجد بيانات.",
    reportSheetTitle: "التقرير الشهري لحضور المعلمين",
    totalWorkingDaysLabel: "إجمالي أيام العمل:",
    daysUnit: "يوم",
    totalTeachersLabel: "إجمالي المعلمين:",
    colSl: "م",
    colDesignation: "المسمى الوظيفي",
    colPresent: "حاضر",
    colOnTime: "في الموعد",
    colLate: "متأخر",
    colEarlyExit: "انصراف مبكر",
    colAbsent: "غائب",
    colRate: "النسبة المئوية",
    dateWord: "تاريخ",
    principalLabel: "مدير المدرسة",
  },
};

export default function AdminTeachersAttendancePage() {
  const { language } = useLanguage();
  const text = ADMIN_TEACHER_I18N[language] || ADMIN_TEACHER_I18N.bn;

  const [selectedDate, setSelectedDate] = useState(() => {
    return getDhakaTime().dateStr;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTeacherId, setExpandedTeacherId] = useState(null);

  // Monthly summary modal & report states
  const [monthlyModalOpen, setMonthlyModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return getDhakaTime().dateStr.slice(0, 7);
  });
  const [monthlyData, setMonthlyData] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [generatingPdfPrint, setGeneratingPdfPrint] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [metrics, setMetrics] = useState({
    totalTeachers: 0,
    presentToday: 0,
    absentToday: 0,
    onTimeToday: 0,
    lateToday: 0,
  });

  const [attendanceList, setAttendanceList] = useState([]);
  const [isToday, setIsToday] = useState(true);

  // Fetch Monthly Attendance Summary
  const fetchMonthlyData = async (monthToFetch) => {
    const targetMonth = monthToFetch || selectedMonth;
    try {
      setLoadingMonthly(true);
      const res = await fetch(
        `${API_BASE}/api/admin/teachers-attendance/monthly?month=${targetMonth}`
      );
      const json = await res.json();
      if (json.success) {
        setMonthlyData(json);
      }
    } catch (err) {
      console.error("Failed to fetch monthly attendance:", err);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const handleOpenMonthlySummary = () => {
    setMonthlyModalOpen(true);
    fetchMonthlyData(selectedMonth);
  };

  const handlePrintMonthly = async () => {
    if (!monthlyData) return;
    try {
      setGeneratingPdfPrint(true);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const blob = await pdf(
        <TeacherMonthlyAttendancePdfDocument
          monthlyData={monthlyData}
          formattedMonth={formatMonthBangla(selectedMonth)}
          selectedMonth={selectedMonth}
          origin={origin}
        />
      ).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, "_blank");
      if (printWindow) {
        printWindow.focus();
      } else {
        window.print();
      }
    } catch (err) {
      console.error("Error generating PDF print view:", err);
      window.print();
    } finally {
      setGeneratingPdfPrint(false);
    }
  };

  const handleDownloadMonthlyPdf = async () => {
    if (!monthlyData) return;
    try {
      setDownloadingPdf(true);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const blob = await pdf(
        <TeacherMonthlyAttendancePdfDocument
          monthlyData={monthlyData}
          formattedMonth={formatMonthBangla(selectedMonth)}
          selectedMonth={selectedMonth}
          origin={origin}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Teachers-Monthly-Attendance-${selectedMonth}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading monthly attendance PDF:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Fetch Attendance & Metrics
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
        `${API_BASE}/api/admin/teachers-attendance?${query.toString()}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "তথ্য লোড করতে সমস্যা হয়েছে।");
      }

      setMetrics(data.metrics);
      setAttendanceList(data.attendanceList || []);
      setIsToday(data.isToday);
    } catch (err) {
      console.error("Admin attendance fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Tabs between ID Card and Attendance */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-[#031810] rounded-2xl w-fit border border-emerald-800/15 dark:border-amber-400/25 shadow-xs">
        <Link
          href="/dashboard/admin/teachers-management/teachers-id-card"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-emerald-100/80 hover:text-emerald-800 dark:hover:text-amber-300 hover:bg-emerald-50/70 dark:hover:bg-white/[0.06] transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span>{text.tabIdCard}</span>
        </Link>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-[#022014] via-emerald-900 to-emerald-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 text-amber-200 dark:text-slate-950 shadow-sm border border-amber-400/40">
          <UserCheck className="w-4 h-4" />
          <span>{text.tabAttendance}</span>
        </span>
      </div>

      {/* 1. Page Header & Actions */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-400/60 via-emerald-500/40 to-amber-500/50 shadow-[0_20px_60px_-15px_rgba(2,32,20,0.3)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.12)] overflow-hidden">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#021d12] via-[#04301f] to-[#021d12] dark:from-[#010906] dark:via-[#031b11] dark:to-[#010906] p-6 sm:p-8 rounded-[22.5px] text-white overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-amber-400/35 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{text.headerBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
              {text.headerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 mt-1">
              {text.headerSub}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenMonthlySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-amber-400/35 text-amber-200 text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{text.monthlyReportBtn}</span>
            </button>

            <Link
              href="/dashboard/teacher/teachers-attendance"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-[0_8px_25px_rgba(245,158,11,0.35)] transition-all active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>{text.teacherPortalBtn}</span>
            </Link>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 hover:border-amber-400/40 text-amber-300 hover:bg-white/[0.14] transition-all disabled:opacity-50 cursor-pointer"
              title={text.refreshTitle}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Summary Metrics Cards (5 Key Metrics) */}
      <AttendanceSummaryMetrics
        variant="teacher"
        metrics={metrics}
        isToday={isToday}
      />

      {/* 3. Controls & Filter Bar */}
      <AttendanceFilterBar
        variant="teacher"
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        metrics={metrics}
      />

      {/* 4. Full Attendance Table */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
              <span>{text.registerTitle}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 bg-emerald-50 dark:bg-amber-400/15 border border-emerald-200 dark:border-amber-400/30 rounded-lg text-emerald-800 dark:text-amber-300">
                {selectedDate}
              </span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-amber-300/80 font-bold">
              {text.totalShownPrefix} {attendanceList.length} {text.personUnit}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 dark:text-emerald-100/70 text-sm flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
              <span>{text.loadingText}</span>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-rose-500 text-sm">
              {text.errorPrefix} {error}
            </div>
          ) : attendanceList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-emerald-100/60 text-sm">
              {text.emptyText}
            </div>
          ) : (
            <>
              {/* Mobile & Tablet Responsive Card View (< lg) */}
              <div className="block lg:hidden divide-y divide-slate-100 dark:divide-emerald-800/30">
                {attendanceList.map((item) => {
                  const teacherKey = item.teacherId || item.teacherEmail;
                  const displayTeacherId = item.teacherId || text.noId;
                  const isExpanded = expandedTeacherId === teacherKey;
                  const isMultiShiftTeacher =
                    item.category === "residential" ||
                    item.category === "hifz" ||
                    (item.shifts && Object.keys(item.shifts).length > 0);

                  const allComments = [];
                  const shiftLabels = {
                    shift1: text.shift1Label,
                    shift2: text.shift2Label,
                    shift3: text.shift3Label,
                  };
                  if (item.shifts && typeof item.shifts === "object") {
                    const orderedKeys = [
                      "shift1",
                      "shift2",
                      "shift3",
                      ...Object.keys(item.shifts).filter(
                        (k) => !["shift1", "shift2", "shift3"].includes(k)
                      ),
                    ];
                    orderedKeys.forEach((sKey) => {
                      const s = item.shifts[sKey];
                      if (!s) return;
                      const sTitle =
                        s.name || shiftLabels[sKey] || s.shiftId || sKey;
                      if (s.checkInComment) {
                        allComments.push({
                          type: "late",
                          label: `${sTitle} (${text.lateShort})`,
                          comment: s.checkInComment,
                        });
                      }
                      if (s.checkOutComment) {
                        allComments.push({
                          type: "early",
                          label: `${sTitle} (${text.earlyShort})`,
                          comment: s.checkOutComment,
                        });
                      }
                    });
                  }
                  if (allComments.length === 0) {
                    if (item.checkInComment) {
                      allComments.push({
                        type: "late",
                        label: text.lateShort,
                        comment: item.checkInComment,
                      });
                    }
                    if (item.checkOutComment) {
                      allComments.push({
                        type: "early",
                        label: text.earlyShort,
                        comment: item.checkOutComment,
                      });
                    }
                  }

                  const completedShiftsCount = item.shifts
                    ? Object.values(item.shifts).filter((s) => !!s?.checkInTime)
                        .length
                    : 0;

                  return (
                    <div
                      key={teacherKey}
                      className="p-4 space-y-3 hover:bg-emerald-50/40 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Card Top: Identity & Overall Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#022014] to-emerald-800 text-amber-300 font-bold font-mono flex items-center justify-center flex-shrink-0 text-xs ring-1 ring-amber-400/40">
                            {item.profileImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.profileImage}
                                alt={displayTeacherId}
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            ) : (
                              "ID"
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="font-black font-mono text-sm text-slate-900 dark:text-white leading-snug break-all">
                                {displayTeacherId}
                              </p>
                              {!item.rawTeacherId && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-emerald-100/70 font-medium">
                                  {text.autoIdBadge}
                                </span>
                              )}
                            </div>
                            {item.teacherEmail && (
                              <p className="text-[11px] text-slate-500 dark:text-emerald-100/70 font-mono truncate">
                                {item.teacherEmail}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-amber-300 bg-emerald-50 dark:bg-amber-400/10 border border-emerald-200/60 dark:border-amber-400/25 px-2 py-0.5 rounded">
                                {item.designation}
                              </span>
                              {isMultiShiftTeacher && (
                                <span className="inline-block text-[10px] font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-300/80 dark:border-amber-400/40">
                                  {item.category === "residential"
                                    ? text.res3Shift
                                    : item.category === "hifz"
                                      ? text.hifz3Shift
                                      : text.threeShift}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Primary Attendance Badge */}
                        <div className="flex-shrink-0">
                          {item.hasCheckedIn ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                item.checkInStatus === "On Time"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                              }`}
                            >
                              {item.checkInStatus === "On Time" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {item.checkInStatus === "On Time"
                                ? "On Time"
                                : "Late"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-emerald-100/60 border border-slate-200 dark:border-white/10">
                              <XCircle className="w-3 h-3 text-slate-400" />
                              Absent
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Check-in / Check-out 2-Column Grid */}
                      <div className="grid grid-cols-2 gap-2.5 bg-[#f4f9f6] dark:bg-[#02140d] p-3 rounded-2xl border border-emerald-800/10 dark:border-amber-400/20 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-amber-300/70 block">
                            {text.colCheckIn}
                          </span>
                          {item.hasCheckedIn ? (
                            <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-100">
                              <Clock3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                              <span>{formatTime(item.checkInTime)}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">
                              {text.absentText}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 border-s border-slate-200/70 dark:border-emerald-800/50 ps-2.5">
                          <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-amber-300/70 block">
                            {text.colCheckOut}
                          </span>
                          {item.hasCheckedOut ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <div className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-100">
                                <Clock3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                                <span>{formatTime(item.checkOutTime)}</span>
                              </div>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  item.checkOutStatus === "On Time"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                                }`}
                              >
                                {item.checkOutStatus === "On Time"
                                  ? "On Time"
                                  : "Early"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">
                              {text.pendingText}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meta Row: Work Duration, Location & 3-Shift Toggle */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-emerald-100/80">
                          <span>
                            <strong className="text-slate-400 dark:text-amber-300/70 font-medium">
                              {text.colWorkHours}:
                            </strong>{" "}
                            <span className="font-semibold">
                              {calculateWorkDuration(
                                item.checkInTime,
                                item.checkOutTime
                              ) || "--"}
                            </span>
                          </span>

                          {item.checkInLocation && (
                            <a
                              href={`https://maps.google.com/?q=${item.checkInLocation.lat},${item.checkInLocation.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 dark:text-amber-300 hover:underline font-mono text-[11px]"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>
                                {item.checkInLocation.lat.toFixed(4)},{" "}
                                {item.checkInLocation.lng.toFixed(4)}
                              </span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>

                        {isMultiShiftTeacher && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedTeacherId(
                                isExpanded ? null : teacherKey
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-300/70 dark:border-amber-400/35 transition-colors cursor-pointer"
                          >
                            <Layers className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>
                              {text.shiftInfoBtn} ({completedShiftsCount}/3)
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Comments Box (Mobile) */}
                      {allComments.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-emerald-800/40 text-xs space-y-1">
                          <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-amber-300/80">
                            {text.colReasons}:
                          </p>
                          {allComments.map((c, i) => (
                            <div
                              key={i}
                              className="leading-snug break-words text-slate-700 dark:text-emerald-100/85"
                            >
                              <strong
                                className={
                                  c.type === "late"
                                    ? "text-rose-600 dark:text-rose-300 font-semibold"
                                    : "text-amber-600 dark:text-amber-300 font-semibold"
                                }
                              >
                                {c.label}:
                              </strong>{" "}
                              {c.comment}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expandable 3-Shift Breakdown inside Mobile Card */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-amber-200/60 dark:border-amber-400/25 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                                {text.colTeacherId}: {displayTeacherId}{" "}
                                {text.threeShiftDetailsSuffix}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExpandedTeacherId(null)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 font-bold cursor-pointer"
                            >
                              {text.closeBtn}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {["shift1", "shift2", "shift3"].map(
                              (shiftKey, sIdx) => {
                                const rules =
                                  item.category === "hifz"
                                    ? HIFZ_ATTENDANCE_RULES[shiftKey]
                                    : RESIDENTIAL_ATTENDANCE_RULES[shiftKey];
                                const sRecord = item.shifts?.[shiftKey];
                                const hasIn = !!sRecord?.checkInTime;
                                const hasOut = !!sRecord?.checkOutTime;

                                return (
                                  <div
                                    key={shiftKey}
                                    className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                                      hasIn
                                        ? "bg-white dark:bg-[#041e14] border-slate-200 dark:border-amber-400/25 shadow-xs"
                                        : "bg-slate-100/60 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/10 opacity-85"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/40 pb-1.5">
                                      <span className="font-bold text-slate-900 dark:text-white">
                                        {rules?.name || `Shift ${sIdx + 1}`}
                                      </span>
                                      <span className="text-[10px] font-medium text-slate-400 dark:text-amber-300/80">
                                        {rules?.nameEnglish}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-0.5">
                                      <span className="text-slate-500 dark:text-emerald-100/70">
                                        {text.inLabel}
                                      </span>
                                      {hasIn ? (
                                        <div className="flex items-center gap-1 font-mono font-bold">
                                          <span>
                                            {formatTime(sRecord.checkInTime)}
                                          </span>
                                          <span
                                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                              sRecord.checkInStatus ===
                                              "On Time"
                                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                            }`}
                                          >
                                            {sRecord.checkInStatus}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-slate-400">
                                          {text.absentText}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-500 dark:text-emerald-100/70">
                                        {text.outLabel}
                                      </span>
                                      {hasOut ? (
                                        <div className="flex items-center gap-1 font-mono font-bold">
                                          <span>
                                            {formatTime(sRecord.checkOutTime)}
                                          </span>
                                          <span
                                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                              sRecord.checkOutStatus ===
                                              "On Time"
                                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                            }`}
                                          >
                                            {sRecord.checkOutStatus}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-slate-400">
                                          {text.pendingText}
                                        </span>
                                      )}
                                    </div>
                                    {(sRecord?.checkInComment ||
                                      sRecord?.checkOutComment) && (
                                      <div className="pt-1.5 border-t border-slate-100 dark:border-emerald-800/40 space-y-1">
                                        {sRecord.checkInComment && (
                                          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-[11px] break-words">
                                            <span className="font-bold">
                                              {text.lateReasonPrefix}
                                            </span>{" "}
                                            {sRecord.checkInComment}
                                          </div>
                                        )}
                                        {sRecord.checkOutComment && (
                                          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] break-words">
                                            <span className="font-bold">
                                              {text.earlyReasonPrefix}
                                            </span>{" "}
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
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Scrollable Table View (>= lg) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[980px] text-start text-sm">
                  <thead className="text-[11px] uppercase tracking-wider bg-[#f4f9f6] dark:bg-[#02140d] text-slate-600 dark:text-amber-300 border-b border-emerald-800/10 dark:border-amber-400/20">
                    <tr>
                      <th className="py-3.5 px-5 font-bold text-start">
                        {text.colTeacherId}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colCheckIn}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colCheckInStatus}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colCheckOut}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colCheckOutStatus}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colWorkHours}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colReasons}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-start">
                        {text.colLocation}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-emerald-800/30">
                    {attendanceList.map((item) => {
                      const teacherKey = item.teacherId || item.teacherEmail;
                      const displayTeacherId = item.teacherId || text.noId;
                      const isExpanded = expandedTeacherId === teacherKey;
                      const isMultiShiftTeacher =
                        item.category === "residential" ||
                        item.category === "hifz" ||
                        (item.shifts && Object.keys(item.shifts).length > 0);

                      const allComments = [];
                      const shiftLabels = {
                        shift1: text.shift1Label,
                        shift2: text.shift2Label,
                        shift3: text.shift3Label,
                      };
                      if (item.shifts && typeof item.shifts === "object") {
                        const orderedKeys = [
                          "shift1",
                          "shift2",
                          "shift3",
                          ...Object.keys(item.shifts).filter(
                            (k) => !["shift1", "shift2", "shift3"].includes(k)
                          ),
                        ];
                        orderedKeys.forEach((sKey) => {
                          const s = item.shifts[sKey];
                          if (!s) return;
                          const sTitle =
                            s.name || shiftLabels[sKey] || s.shiftId || sKey;
                          if (s.checkInComment) {
                            allComments.push({
                              type: "late",
                              label: `${sTitle} (${text.lateShort})`,
                              comment: s.checkInComment,
                            });
                          }
                          if (s.checkOutComment) {
                            allComments.push({
                              type: "early",
                              label: `${sTitle} (${text.earlyShort})`,
                              comment: s.checkOutComment,
                            });
                          }
                        });
                      }
                      if (allComments.length === 0) {
                        if (item.checkInComment) {
                          allComments.push({
                            type: "late",
                            label: text.lateShort,
                            comment: item.checkInComment,
                          });
                        }
                        if (item.checkOutComment) {
                          allComments.push({
                            type: "early",
                            label: text.earlyShort,
                            comment: item.checkOutComment,
                          });
                        }
                      }

                      const completedShiftsCount = item.shifts
                        ? Object.values(item.shifts).filter(
                            (s) => !!s?.checkInTime
                          ).length
                        : 0;

                      return (
                        <React.Fragment key={teacherKey}>
                          <tr className="hover:bg-emerald-50/40 dark:hover:bg-white/[0.04] transition-colors">
                            {/* Teacher ID Column */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#022014] to-emerald-800 text-amber-300 font-bold font-mono flex items-center justify-center flex-shrink-0 text-xs ring-1 ring-amber-400/40">
                                  {item.profileImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={item.profileImage}
                                      alt={displayTeacherId}
                                      className="w-full h-full object-cover rounded-2xl"
                                    />
                                  ) : (
                                    "ID"
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-black font-mono text-slate-900 dark:text-white leading-snug">
                                      {displayTeacherId}
                                    </p>
                                    {!item.rawTeacherId && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-emerald-100/70 font-medium">
                                        {text.autoIdBadge}
                                      </span>
                                    )}
                                  </div>
                                  {item.teacherEmail && (
                                    <p className="text-xs text-slate-500 dark:text-emerald-100/70 font-mono">
                                      {item.teacherEmail}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                    <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-amber-300 bg-emerald-50 dark:bg-amber-400/10 border border-emerald-200/60 dark:border-amber-400/25 px-2 py-0.2 rounded">
                                      {item.designation}
                                    </span>
                                    {isMultiShiftTeacher && (
                                      <span className="inline-block text-[10px] font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.2 rounded-full border border-amber-300/80 dark:border-amber-400/40">
                                        {item.category === "residential"
                                          ? text.res3Shift
                                          : item.category === "hifz"
                                            ? text.hifz3Shift
                                            : text.threeShift}
                                      </span>
                                    )}
                                  </div>
                                  {isMultiShiftTeacher && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedTeacherId(
                                          isExpanded ? null : teacherKey
                                        )
                                      }
                                      className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-300/70 dark:border-amber-400/35 transition-colors cursor-pointer"
                                    >
                                      <Layers className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                      <span>
                                        {text.shiftInfoBtn} (
                                        {completedShiftsCount}/3)
                                      </span>
                                      <ChevronDown
                                        className={`w-3 h-3 transition-transform ${
                                          isExpanded ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Check-In Time */}
                            <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                              {item.hasCheckedIn ? (
                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                                  <Clock3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>{formatTime(item.checkInTime)}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400">
                                  {text.absentText}
                                </span>
                              )}
                            </td>

                            {/* Check-In Status Badge */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {item.hasCheckedIn ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                    item.checkInStatus === "On Time"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                                      : "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                                  }`}
                                >
                                  {item.checkInStatus === "On Time" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5" />
                                  )}
                                  {item.checkInStatus === "On Time"
                                    ? "On Time"
                                    : "Late"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-emerald-100/60 border border-slate-200 dark:border-white/10">
                                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                  Absent
                                </span>
                              )}
                            </td>

                            {/* Check-Out Time */}
                            <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                              {item.hasCheckedOut ? (
                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                                  <Clock3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                  <span>{formatTime(item.checkOutTime)}</span>
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
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40"
                                  }`}
                                >
                                  {item.checkOutStatus === "On Time" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5" />
                                  )}
                                  {item.checkOutStatus === "On Time"
                                    ? "On Time"
                                    : "Early"}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  {text.pendingText}
                                </span>
                              )}
                            </td>

                            {/* Duration */}
                            <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-emerald-100/85 whitespace-nowrap">
                              {calculateWorkDuration(
                                item.checkInTime,
                                item.checkOutTime
                              ) || <span className="text-slate-400">--</span>}
                            </td>

                            {/* Reason / Comments Column */}
                            <td className="py-4 px-4 text-xs text-slate-600 dark:text-emerald-100/80 max-w-xs">
                              {allComments.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {allComments.map((c, i) => (
                                    <span
                                      key={i}
                                      title={c.comment}
                                      className="leading-snug break-words"
                                    >
                                      <strong
                                        className={
                                          c.type === "late"
                                            ? "text-rose-600 dark:text-rose-300 font-semibold"
                                            : "text-amber-600 dark:text-amber-300 font-semibold"
                                        }
                                      >
                                        {c.label}:
                                      </strong>{" "}
                                      {c.comment}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400">--</span>
                              )}
                            </td>

                            {/* Location Link */}
                            <td className="py-4 px-4 whitespace-nowrap text-xs">
                              {item.checkInLocation ? (
                                <a
                                  href={`https://maps.google.com/?q=${item.checkInLocation.lat},${item.checkInLocation.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-700 dark:text-amber-300 hover:underline font-mono"
                                >
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>
                                    {item.checkInLocation.lat.toFixed(4)},{" "}
                                    {item.checkInLocation.lng.toFixed(4)}
                                  </span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400">--</span>
                              )}
                            </td>
                          </tr>

                          {/* Expandable 3-Shift Breakdown Sub-Row */}
                          {isExpanded && (
                            <tr className="bg-[#f4f9f6]/90 dark:bg-[#02120b]/95 border-y border-amber-300/60 dark:border-amber-400/30">
                              <td colSpan={8} className="p-4 sm:p-5">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white font-mono">
                                        {text.colTeacherId}: {displayTeacherId}{" "}
                                        {text.threeShiftDetailsSuffix}
                                      </h4>
                                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300">
                                        {item.category === "residential"
                                          ? text.resTeacherBadge
                                          : item.category === "hifz"
                                            ? text.hifzTeacherBadge
                                            : item.designation}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setExpandedTeacherId(null)}
                                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 font-bold cursor-pointer"
                                    >
                                      {text.closeBtn}
                                    </button>
                                  </div>

                                  {/* 3 Shifts Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {["shift1", "shift2", "shift3"].map(
                                      (shiftKey, sIdx) => {
                                        const rules =
                                          item.category === "hifz"
                                            ? HIFZ_ATTENDANCE_RULES[shiftKey]
                                            : RESIDENTIAL_ATTENDANCE_RULES[
                                                shiftKey
                                              ];
                                        const sRecord = item.shifts?.[shiftKey];
                                        const hasIn = !!sRecord?.checkInTime;
                                        const hasOut = !!sRecord?.checkOutTime;

                                        return (
                                          <div
                                            key={shiftKey}
                                            className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                                              hasIn
                                                ? "bg-white dark:bg-[#041e14] border-slate-200 dark:border-amber-400/25 shadow-xs"
                                                : "bg-slate-100/60 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/10 opacity-80"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/40 pb-2">
                                              <span className="font-bold text-slate-900 dark:text-white">
                                                {rules?.name ||
                                                  `Shift ${sIdx + 1}`}
                                              </span>
                                              <span className="text-[10px] font-medium text-slate-400 dark:text-amber-300/80">
                                                {rules?.nameEnglish}
                                              </span>
                                            </div>

                                            <div className="text-[11px] text-slate-500 dark:text-emerald-100/70 space-y-0.5">
                                              <p>
                                                {text.inLabel}{" "}
                                                {rules?.checkInWindowLabel ||
                                                  "--"}
                                              </p>
                                              <p>
                                                {text.outLabel}{" "}
                                                {rules?.checkOutWindowLabel ||
                                                  "--"}
                                              </p>
                                            </div>

                                            <div className="pt-1 border-t border-slate-100 dark:border-emerald-800/40 flex items-center justify-between">
                                              <span className="text-slate-500 dark:text-emerald-100/70">
                                                {text.inLabel}
                                              </span>
                                              {hasIn ? (
                                                <div className="flex items-center gap-1.5 font-mono font-bold">
                                                  <span>
                                                    {formatTime(
                                                      sRecord.checkInTime
                                                    )}
                                                  </span>
                                                  <span
                                                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                                      sRecord.checkInStatus ===
                                                      "On Time"
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                    }`}
                                                  >
                                                    {sRecord.checkInStatus}
                                                  </span>
                                                </div>
                                              ) : (
                                                <span className="text-slate-400">
                                                  {text.absentText}
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <span className="text-slate-500 dark:text-emerald-100/70">
                                                {text.outLabel}
                                              </span>
                                              {hasOut ? (
                                                <div className="flex items-center gap-1.5 font-mono font-bold">
                                                  <span>
                                                    {formatTime(
                                                      sRecord.checkOutTime
                                                    )}
                                                  </span>
                                                  <span
                                                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                                      sRecord.checkOutStatus ===
                                                      "On Time"
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                    }`}
                                                  >
                                                    {sRecord.checkOutStatus}
                                                  </span>
                                                </div>
                                              ) : (
                                                <span className="text-slate-400">
                                                  {text.pendingText}
                                                </span>
                                              )}
                                            </div>

                                            {(sRecord?.checkInComment ||
                                              sRecord?.checkOutComment) && (
                                              <div className="pt-2 border-t border-slate-100 dark:border-emerald-800/40 space-y-1">
                                                {sRecord.checkInComment && (
                                                  <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-[11px] break-words">
                                                    <span className="font-bold">
                                                      {text.lateReasonPrefix}
                                                    </span>{" "}
                                                    {sRecord.checkInComment}
                                                  </div>
                                                )}
                                                {sRecord.checkOutComment && (
                                                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] break-words">
                                                    <span className="font-bold">
                                                      {text.earlyReasonPrefix}
                                                    </span>{" "}
                                                    {sRecord.checkOutComment}
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {sRecord?.checkInLocation && (
                                              <div className="pt-1 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                                                <span>{text.colLocation}:</span>
                                                <a
                                                  href={`https://maps.google.com/?q=${sRecord.checkInLocation.lat},${sRecord.checkInLocation.lng}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-emerald-700 dark:text-amber-300 hover:underline inline-flex items-center gap-0.5"
                                                >
                                                  <MapPin className="w-3 h-3" />
                                                  <span>
                                                    {sRecord.checkInLocation.lat.toFixed(
                                                      4
                                                    )}
                                                    ,{" "}
                                                    {sRecord.checkInLocation.lng.toFixed(
                                                      4
                                                    )}
                                                  </span>
                                                </a>
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
            </>
          )}
        </div>
      </div>

      {/* Monthly Summary Modal (A4 Landscape Layout) */}
      {monthlyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#031810] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-800/15 dark:border-amber-400/30 overflow-hidden">
            {/* Non-Printable Header Bar */}
            <div className="p-4 sm:p-5 bg-[#f4f9f6] dark:bg-[#02120b] border-b border-emerald-800/15 dark:border-amber-400/25 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-emerald-700 dark:text-amber-300" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {text.monthlyModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-100/70">
                    {text.monthlyModalSub}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-white dark:bg-[#041e14] px-3 py-1.5 rounded-xl border border-emerald-800/15 dark:border-amber-400/30">
                  <Calendar className="w-4 h-4 text-emerald-700 dark:text-amber-300" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      fetchMonthlyData(e.target.value);
                    }}
                    className="text-xs font-bold bg-transparent text-slate-800 dark:text-amber-100 focus:outline-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={handlePrintMonthly}
                  disabled={
                    loadingMonthly || !monthlyData || generatingPdfPrint
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#022014] to-emerald-800 dark:from-amber-400 dark:to-amber-500 text-amber-200 dark:text-slate-950 text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {generatingPdfPrint ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Printer className="w-4 h-4" />
                  )}
                  <span>{text.printViewBtn}</span>
                </button>

                <button
                  onClick={handleDownloadMonthlyPdf}
                  disabled={loadingMonthly || !monthlyData || downloadingPdf}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] border border-transparent dark:border-amber-400/30 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {downloadingPdf ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{text.downloadBtn}</span>
                </button>

                <button
                  onClick={() => setMonthlyModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-amber-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Container */}
            <div
              className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white text-slate-900"
              id="printable-monthly-summary"
            >
              {loadingMonthly ? (
                <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                  <span>{text.loadingMonthlyText}</span>
                </div>
              ) : !monthlyData ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  {text.noMonthlyData}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-0 mb-2 border-b-4 border-double border-gray-800 pb-1 pl-2">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-3">
                      <Image
                        src="/aimlogo1.png"
                        alt="Institution Logo"
                        width={200}
                        height={200}
                        quality={100}
                        priority
                        unoptimized
                        className="w-full h-full object-cover scale-[1.05]"
                      />
                    </div>
                    <div className="flex-grow text-center">
                      <Image
                        src="/banner_routine.png"
                        alt="Institution Banner"
                        width={2000}
                        height={400}
                        quality={100}
                        priority
                        unoptimized
                        className="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                      />
                    </div>
                  </div>

                  {/* Title Header */}
                  <div className="text-center mb-3 space-y-0.5">
                    <h3 className="text-xs md:text-sm font-bold text-gray-800">
                      {text.reportSheetTitle}
                    </h3>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                      {formatMonthBangla(selectedMonth)}
                    </h2>
                    <p className="text-xs text-gray-600 font-semibold">
                      {text.totalWorkingDaysLabel}{" "}
                      {toBengaliNumber(monthlyData.totalWorkingDays)}{" "}
                      {text.daysUnit} | {text.totalTeachersLabel}{" "}
                      {toBengaliNumber(monthlyData.totalTeachers)}{" "}
                      {text.personUnit}
                    </p>
                  </div>

                  {/* Table Matrix */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-800 text-gray-900 text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-center font-bold">
                          <th className="border border-gray-800 py-2 px-1 w-10">
                            {text.colSl}
                          </th>
                          <th className="border border-gray-800 py-2 px-3 text-left">
                            {text.colTeacherId}
                          </th>
                          <th className="border border-gray-800 py-2 px-2 text-left">
                            {text.colDesignation}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {text.colPresent}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {text.colOnTime}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {text.colLate}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {text.colEarlyExit}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {text.colAbsent}
                          </th>
                          <th className="border border-gray-800 py-2 px-2">
                            {text.colRate}
                          </th>
                          <th className="border border-gray-800 py-2 px-3 text-left">
                            {text.colReasons}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.teachersSummary?.map((teacher, index) => (
                          <tr
                            key={teacher.teacherId || index}
                            className="text-center hover:bg-gray-50"
                          >
                            <td className="border border-gray-800 py-1.5 px-1 font-mono">
                              {toBengaliNumber(index + 1)}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-3 text-left font-bold font-mono">
                              {teacher.teacherId || text.noId}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 text-left text-gray-700">
                              {teacher.designation}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 font-bold text-emerald-800">
                              {toBengaliNumber(teacher.presentDays)}{" "}
                              {text.daysUnit}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 text-emerald-700">
                              {toBengaliNumber(teacher.onTimeDays)}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 text-rose-700 font-semibold">
                              {toBengaliNumber(teacher.lateDays)}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 text-amber-700">
                              {toBengaliNumber(teacher.earlyExitDays)}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 text-red-600 font-semibold">
                              {toBengaliNumber(teacher.absentDays)}{" "}
                              {text.daysUnit}
                            </td>
                            <td className="border border-gray-800 py-1.5 px-2 font-bold">
                              {toBengaliNumber(teacher.attendanceRate)}%
                            </td>
                            <td className="border border-gray-800 py-1.5 px-3 text-left text-[11px] text-gray-600">
                              {teacher.lateComments?.length > 0 ||
                              teacher.earlyComments?.length > 0 ? (
                                <div className="space-y-0.5">
                                  {teacher.lateComments?.map((c, i) => (
                                    <div
                                      key={`l-${i}`}
                                      className="leading-snug break-words"
                                    >
                                      <span className="font-semibold text-rose-700">
                                        [{toBengaliNumber(c.date?.slice(8))}{" "}
                                        {text.dateWord}]:
                                      </span>{" "}
                                      {c.comment}
                                    </div>
                                  ))}
                                  {teacher.earlyComments?.map((c, i) => (
                                    <div
                                      key={`e-${i}`}
                                      className="leading-snug break-words"
                                    >
                                      <span className="font-semibold text-amber-700">
                                        [{toBengaliNumber(c.date?.slice(8))}{" "}
                                        {text.dateWord} ({text.earlyShort})]:
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
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Principal Signature & Footer Section */}
                  <div className="mt-8 pt-4 flex justify-end items-end px-6 break-inside-avoid print:mt-6 print:px-2">
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
                        {text.principalLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
