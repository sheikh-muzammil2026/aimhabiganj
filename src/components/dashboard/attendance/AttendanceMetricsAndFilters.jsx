"use client";

import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { getDhakaTime } from "@/lib/attendance-config";
import { useLanguage } from "@/context/LanguageContext";

const METRICS_TEXT = {
  bn: {
    totalStaff: "মোট স্টাফ",
    enrolledStaff: "নথিভুক্ত কর্মচারী",
    totalTeachers: "মোট শিক্ষক (Total)",
    enrolledTeachers: "ডাটাবেসে নথিভুক্ত",
    presentToday: "আজ উপস্থিত",
    present: "উপস্থিত (Present)",
    confirmedAttendance: "হাজিরা নিশ্চিত করেছেন",
    absentToday: "আজ অনুপস্থিত",
    absent: "অনুপস্থিত (Absent)",
    leaveOrAbsent: "ছুটি / অনুপস্থিত",
    noRecord: "হাজিরা রেকর্ড নেই",
    onTime: "সময়মতো (On Time)",
    enteredOnTime: "নির্ধারিত সময়ে প্রবেশ",
    late: "বিলম্বিত (Late)",
    enteredLate: "নির্ধারিত সময়ের পরে প্রবেশ",
    todayLabel: "আজকের তারিখ",
    searchStaffPlaceholder: "স্টাফের নাম বা পদবি দিয়ে খুঁজুন...",
    searchTeacherPlaceholder: "শিক্ষক আইডি, পদবি বা ইমেইল দিয়ে খুঁজুন...",
    filterLabel: "ফিল্টার:",
    tabAll: "সবাই",
    tabPresent: "উপস্থিত",
    tabAbsent: "অনুপস্থিত",
    tabOnTime: "সময়মতো",
    tabLate: "দেরিতে",
  },
  en: {
    totalStaff: "Total Staff",
    enrolledStaff: "Registered Staff",
    totalTeachers: "Total Teachers",
    enrolledTeachers: "Registered in Database",
    presentToday: "Present Today",
    present: "Present",
    confirmedAttendance: "Attendance Confirmed",
    absentToday: "Absent Today",
    absent: "Absent",
    leaveOrAbsent: "On Leave / Absent",
    noRecord: "No Attendance Record",
    onTime: "On Time",
    enteredOnTime: "Checked In On Time",
    late: "Late Entry",
    enteredLate: "Checked In After Deadline",
    todayLabel: "Today's Date",
    searchStaffPlaceholder: "Search by staff name or designation...",
    searchTeacherPlaceholder: "Search by Teacher ID, designation or email...",
    filterLabel: "Filter:",
    tabAll: "All",
    tabPresent: "Present",
    tabAbsent: "Absent",
    tabOnTime: "On Time",
    tabLate: "Late",
  },
  ar: {
    totalStaff: "إجمالي الموظفين",
    enrolledStaff: "الموظفون المسجلون",
    totalTeachers: "إجمالي المعلمين",
    enrolledTeachers: "مسجل في قاعدة البيانات",
    presentToday: "الحاضرون اليوم",
    present: "حاضر",
    confirmedAttendance: "تم تأكيد الحضور",
    absentToday: "الغائبون اليوم",
    absent: "غائب",
    leaveOrAbsent: "في إجازة / غائب",
    noRecord: "لا يوجد سجل حضور",
    onTime: "في الوقت المحدد",
    enteredOnTime: "دخول في الموعد",
    late: "متأخر",
    enteredLate: "دخول بعد الموعد المحدد",
    todayLabel: "تاريخ اليوم",
    searchStaffPlaceholder: "ابحث باسم الموظف أو المسمى الوظيفي...",
    searchTeacherPlaceholder: "ابحث برقم المعلم أو المسمى الوظيفي أو البريد...",
    filterLabel: "تصفية:",
    tabAll: "الكل",
    tabPresent: "حاضر",
    tabAbsent: "غائب",
    tabOnTime: "في الموعد",
    tabLate: "متأخر",
  },
};

/**
 * Reusable 5-card attendance summary metrics grid for Admin Teacher & Staff Attendance pages.
 * Upgraded with Royal Emerald, Deep Obsidian Jade & Liquid Gold luxury aesthetic + 3-language support.
 */
export function AttendanceSummaryMetrics({
  variant = "teacher",
  metrics = {},
  isToday = true,
}) {
  const { language } = useLanguage();
  const text = METRICS_TEXT[language] || METRICS_TEXT.bn;
  const isStaff = variant === "staff";

  const cards = isStaff
    ? [
        {
          label: text.totalStaff,
          value: metrics.totalStaff ?? 0,
          sub: text.enrolledStaff,
          icon: Users,
          iconBg:
            "bg-gradient-to-br from-[#022014] to-emerald-800 dark:from-[#062d1e] dark:to-[#02120b] text-amber-300 ring-1 ring-amber-400/40",
          valueColor: "text-slate-900 dark:text-white",
          subColor: "text-emerald-700 dark:text-amber-300/90",
        },
        {
          label: isToday ? text.presentToday : text.present,
          value: metrics.presentToday ?? 0,
          sub: text.confirmedAttendance,
          icon: UserCheck,
          iconBg:
            "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30",
          valueColor: "text-emerald-700 dark:text-emerald-300",
          subColor: "text-emerald-600/85 dark:text-emerald-300/80",
        },
        {
          label: isToday ? text.absentToday : text.absent,
          value: metrics.absentToday ?? 0,
          sub: text.leaveOrAbsent,
          icon: XCircle,
          iconBg:
            "bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30",
          valueColor: "text-rose-600 dark:text-rose-300",
          subColor: "text-rose-600/85 dark:text-rose-300/80",
        },
        {
          label: text.onTime,
          value: metrics.onTimeToday ?? 0,
          sub: text.enteredOnTime,
          icon: CheckCircle2,
          iconBg:
            "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30",
          valueColor: "text-teal-700 dark:text-teal-300",
          subColor: "text-teal-600/85 dark:text-teal-300/80",
        },
        {
          label: text.late,
          value: metrics.lateToday ?? 0,
          sub: text.enteredLate,
          icon: Clock3,
          iconBg:
            "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-amber-400/35",
          valueColor: "text-amber-600 dark:text-amber-300",
          subColor: "text-amber-600/85 dark:text-amber-300/80",
        },
      ]
    : [
        {
          label: text.totalTeachers,
          value: metrics.totalTeachers ?? 0,
          sub: text.enrolledTeachers,
          icon: Users,
          iconBg:
            "bg-gradient-to-br from-[#022014] to-emerald-800 dark:from-[#062d1e] dark:to-[#02120b] text-amber-300 ring-1 ring-amber-400/40",
          valueColor: "text-slate-900 dark:text-white",
          subColor: "text-emerald-700 dark:text-amber-300/90",
        },
        {
          label: isToday ? text.presentToday : text.present,
          value: metrics.presentToday ?? 0,
          sub: text.confirmedAttendance,
          icon: UserCheck,
          iconBg:
            "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30",
          valueColor: "text-emerald-700 dark:text-emerald-300",
          subColor: "text-emerald-600/85 dark:text-emerald-300/80",
        },
        {
          label: isToday ? text.absentToday : text.absent,
          value: metrics.absentToday ?? 0,
          sub: text.noRecord,
          icon: UserX,
          iconBg:
            "bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30",
          valueColor: "text-rose-600 dark:text-rose-300",
          subColor: "text-rose-600/85 dark:text-rose-300/80",
        },
        {
          label: text.onTime,
          value: metrics.onTimeToday ?? 0,
          sub: text.enteredOnTime,
          icon: CheckCircle2,
          iconBg:
            "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30",
          valueColor: "text-teal-700 dark:text-teal-300",
          subColor: "text-teal-600/85 dark:text-teal-300/80",
        },
        {
          label: text.late,
          value: metrics.lateToday ?? 0,
          sub: text.enteredLate,
          icon: AlertCircle,
          iconBg:
            "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-amber-400/35",
          valueColor: "text-amber-600 dark:text-amber-300",
          subColor: "text-amber-600/85 dark:text-amber-300/80",
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <div
            key={idx}
            className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/50 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.08)] dark:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.85)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02130c] dark:to-[#010906] rounded-[22.5px] p-5 flex items-center gap-4 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
              <div className="hidden dark:block absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div
                className={`p-3.5 rounded-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${card.iconBg}`}
              >
                <IconComp className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 dark:text-emerald-100/75 truncate">
                  {card.label}
                </p>
                <h3
                  className={`text-2xl font-black mt-0.5 ${card.valueColor}`}
                >
                  {card.value}
                </h3>
                <p className={`text-[11px] font-semibold truncate ${card.subColor}`}>
                  {card.sub}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Reusable Attendance Date, Search & Status Filter Bar for Admin Teacher & Staff Attendance pages.
 */
export function AttendanceFilterBar({
  variant = "teacher",
  selectedDate,
  onDateChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  metrics = {},
}) {
  const { language } = useLanguage();
  const text = METRICS_TEXT[language] || METRICS_TEXT.bn;
  const isStaff = variant === "staff";
  const todayDateStr = getDhakaTime().dateStr;
  const totalCount = isStaff ? metrics.totalStaff : metrics.totalTeachers;

  const searchPlaceholder = isStaff
    ? text.searchStaffPlaceholder
    : text.searchTeacherPlaceholder;

  return (
    <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/40 via-emerald-600/15 to-slate-200 dark:from-amber-400/45 dark:via-emerald-500/20 dark:to-amber-500/25 shadow-[0_12px_35px_-12px_rgba(2,32,20,0.07)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
      <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] rounded-[22.5px] p-5 space-y-4 overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
        <div className="hidden dark:block absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Date Picker & Today Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-[#f4f9f6] dark:bg-[#02140d] border border-emerald-800/15 dark:border-amber-400/30 px-3.5 py-2 rounded-2xl shadow-xs">
              <Calendar className="w-4 h-4 text-emerald-700 dark:text-amber-300" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-100 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => onDateChange(todayDateStr)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedDate === todayDateStr
                  ? "bg-gradient-to-r from-[#022014] via-emerald-900 to-emerald-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 text-amber-200 dark:text-slate-950 border border-amber-400/40 shadow-sm"
                  : "bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/[0.12] border border-transparent dark:border-white/10"
              }`}
            >
              {text.todayLabel}
            </button>
          </div>

          {/* Right: Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-emerald-700/60 dark:text-amber-300/70 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full ltr:pl-9 ltr:pr-4 rtl:pr-9 rtl:pl-4 py-2.5 bg-[#f4f9f6] dark:bg-[#02140d] border border-emerald-800/15 dark:border-amber-400/25 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-emerald-800/40">
          <span className="text-xs font-bold text-slate-500 dark:text-amber-300/80 ltr:mr-2 rtl:ml-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            {text.filterLabel}
          </span>
          {[
            { key: "all", label: `${text.tabAll} (${totalCount ?? 0})` },
            {
              key: "present",
              label: `${text.tabPresent} (${metrics.presentToday ?? 0})`,
            },
            {
              key: "absent",
              label: `${text.tabAbsent} (${metrics.absentToday ?? 0})`,
            },
            {
              key: "onTime",
              label: `${text.tabOnTime} (${metrics.onTimeToday ?? 0})`,
            },
            {
              key: "late",
              label: `${text.tabLate} (${metrics.lateToday ?? 0})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onStatusFilterChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-gradient-to-r from-[#022014] via-emerald-900 to-emerald-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 text-amber-200 dark:text-slate-950 shadow-sm ring-1 ring-amber-400/40"
                  : "bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/[0.12] border border-transparent dark:border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
