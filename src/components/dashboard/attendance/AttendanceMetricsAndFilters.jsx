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

/**
 * Reusable 5-card attendance summary metrics grid for Admin Teacher & Staff Attendance pages.
 * Preserves 100% of existing styling, colors, icons, and labels for each variant.
 */
export function AttendanceSummaryMetrics({
  variant = "teacher",
  metrics = {},
  isToday = true,
}) {
  const isStaff = variant === "staff";

  if (isStaff) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              মোট স্টাফ
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.totalStaff}
            </h3>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              নথিভুক্ত কর্মচারী
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              উপস্থিত (Present)
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.presentToday}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              হাজিরা নিশ্চিত
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              অনুপস্থিত (Absent)
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.absentToday}
            </h3>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              ছুটি / অনুপস্থিত
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              সময়মতো (On Time)
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.onTimeToday}
            </h3>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              সময়মতো প্রবেশ
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              দেরিতে (Late)
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.lateToday}
            </h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              দেরিতে উপস্থিতি
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* CARD 1: Total Teachers */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            মোট শিক্ষক (Total)
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {metrics.totalTeachers}
          </h3>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            ডাটাবেসে নথিভুক্ত
          </p>
        </div>
      </div>

      {/* CARD 2: Present Today */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isToday ? "আজ উপস্থিত" : "উপস্থিত"}
          </p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {metrics.presentToday}
          </h3>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            হাজিরা নিশ্চিত করেছেন
          </p>
        </div>
      </div>

      {/* CARD 3: Absent Today */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
          <UserX className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isToday ? "আজ অনুপস্থিত" : "অনুপস্থিত"}
          </p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {metrics.absentToday}
          </h3>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-medium">
            হাজিরা রেকর্ড নেই
          </p>
        </div>
      </div>

      {/* CARD 4: On Time Today */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            সময়মতো (On Time)
          </p>
          <h3 className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5">
            {metrics.onTimeToday}
          </h3>
          <p className="text-[11px] text-teal-600/80 dark:text-teal-400/80 font-medium">
            নির্ধারিত সময়ে প্রবেশ
          </p>
        </div>
      </div>

      {/* CARD 5: Late Today */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            বিলম্বিত (Late)
          </p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {metrics.lateToday}
          </h3>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">
            নির্ধারিত সময়ের পরে প্রবেশ
          </p>
        </div>
      </div>
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
  const isStaff = variant === "staff";
  const todayDateStr = getDhakaTime().dateStr;
  const totalCount = isStaff ? metrics.totalStaff : metrics.totalTeachers;

  const calendarIconClass = isStaff
    ? "w-4 h-4 text-teal-600"
    : "w-4 h-4 text-emerald-600";

  const todayButtonActiveClass = isStaff
    ? "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300"
    : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300";

  const searchFocusRingClass = isStaff
    ? "focus:ring-teal-500"
    : "focus:ring-emerald-500";

  const activeTabClass = isStaff
    ? "bg-teal-600 text-white shadow-xs"
    : "bg-emerald-600 text-white shadow-xs";

  const searchPlaceholder = isStaff
    ? "স্টাফের নাম বা পদবি দিয়ে খুঁজুন..."
    : "শিক্ষক আইডি, পদবি বা ইমেইল দিয়ে খুঁজুন...";

  const todayLabel = isStaff ? "আজকের তারিখ (Today)" : "আজকের তারিখ";

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Date Picker & Today Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl">
            <Calendar className={calendarIconClass} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => onDateChange(todayDateStr)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedDate === todayDateStr
                ? todayButtonActiveClass
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {todayLabel}
          </button>
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 ${searchFocusRingClass}`}
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          ফিল্টার:
        </span>
        {[
          { key: "all", label: `সবাই (${totalCount})` },
          { key: "present", label: `উপস্থিত (${metrics.presentToday})` },
          { key: "absent", label: `অনুপস্থিত (${metrics.absentToday})` },
          { key: "onTime", label: `সময়মতো (${metrics.onTimeToday})` },
          { key: "late", label: `দেরিতে (${metrics.lateToday})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onStatusFilterChange(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? activeTabClass
                : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
