"use client";

import React from "react";
import {
  FEE_CATEGORIES,
  getClassOptions,
  SESSION_YEARS,
} from "@/lib/studentUtils";

export default function StudentFilterBar({
  variant = "card", // "card" | "labeled"
  theme = "emerald", // "emerald" | "rose"
  className = "",
  searchTerm = "",
  onSearchChange,
  searchPlaceholder,
  searchLabel = "খুঁজুন (নাম/আইডি/মোবাইল)",
  selectedSession = "all",
  onSessionChange,
  sessionYears = SESSION_YEARS,
  sessionLabel = "শিক্ষাবর্ষ",
  sessionAllLabel,
  selectedDivision = "all",
  onDivisionChange,
  divisionLabel = "বিভাগ",
  selectedAcademyType = "all",
  onAcademyTypeChange,
  academyTypeLabel = "একাডেমি টাইপ",
  selectedClass = "all",
  onClassChange,
  classLabel = "শ্রেণি",
  includeHigherSecondary = true,
  showActivity = false,
  selectedActivity = "all",
  onActivityChange,
  showType = false,
  selectedType = "all",
  onTypeChange,
  showFeeCategory = false,
  selectedFeeCategory = "all",
  onFeeCategoryChange,
  feeCategories = FEE_CATEGORIES,
  onResetPage,
}) {
  const triggerReset = () => {
    onResetPage?.();
  };

  if (variant === "labeled") {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 ${className}`}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {searchLabel}
          </label>
          <input
            type="text"
            placeholder={searchPlaceholder || "নাম, আইডি, রোল বা ফোন..."}
            value={searchTerm}
            onChange={(e) => {
              onSearchChange?.(e.target.value);
              triggerReset();
            }}
            className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {sessionLabel}
          </label>
          <select
            value={selectedSession}
            onChange={(e) => {
              onSessionChange?.(e.target.value);
              triggerReset();
            }}
            className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{sessionAllLabel || "সকল সেশন"}</option>
            {sessionYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {divisionLabel}
          </label>
          <select
            value={selectedDivision}
            onChange={(e) => {
              onDivisionChange?.(e.target.value);
              onAcademyTypeChange?.("all");
              onClassChange?.("all");
              triggerReset();
            }}
            className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">সকল বিভাগ</option>
            <option value="preHifz">প্রি-হিফজ</option>
            <option value="hifz">হিফজ</option>
            <option value="academy">একাডেমিক</option>
          </select>
        </div>

        {selectedDivision === "academy" && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {academyTypeLabel}
            </label>
            <select
              value={selectedAcademyType}
              onChange={(e) => {
                onAcademyTypeChange?.(e.target.value);
                onClassChange?.("all");
                triggerReset();
              }}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">সকল টাইপ</option>
              <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
              <option value="প্রাথমিক">প্রাথমিক</option>
              <option value="মাধ্যমিক">মাধ্যমিক</option>
              <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {classLabel}
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              onClassChange?.(e.target.value);
              triggerReset();
            }}
            disabled={selectedDivision === "all"}
            className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-slate-800/40 disabled:opacity-50"
          >
            <option value="all">সকল শ্রেণি</option>
            {getClassOptions(selectedDivision, selectedAcademyType, {
              includeHigherSecondary,
            }).map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const borderClass =
    theme === "rose" ? "border-rose-900/10" : "border-emerald-900/10";
  const focusBorderClass =
    theme === "rose" ? "focus:border-rose-600" : "focus:border-emerald-600";

  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-2xl border ${borderClass} shadow-xs space-y-3 ${className}`}
    >
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        খুঁজুন এবং ফিল্টার করুন:
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* নাম / আইডি / পিতা / জেলা সার্চ */}
        <div className="sm:col-span-2 lg:col-span-2 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder={
              searchPlaceholder ||
              "নাম, আইডি, পিতার নাম, মোবাইল বা জেলা..."
            }
            value={searchTerm}
            onChange={(e) => {
              onSearchChange?.(e.target.value);
              triggerReset();
            }}
            className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white transition-all`}
          />
        </div>

        {/* অ্যাক্টিভিটি স্ট্যাটাস ফিল্টার (শুধুমাত্র inactive পেজে) */}
        {showActivity && (
          <div>
            <select
              value={selectedActivity}
              onChange={(e) => {
                onActivityChange?.(e.target.value);
                triggerReset();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-rose-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white font-bold text-rose-900"
            >
              <option value="all">সকল শিক্ষার্থী (সকল স্ট্যাটাস)</option>
              <option value="active">শুধুমাত্র সক্রিয় (Active)</option>
              <option value="inactive">সকল নিষ্ক্রিয় (Inactive)</option>
              <option value="temporary_inactive">
                সাময়িক নিষ্ক্রিয় (Temporary)
              </option>
              <option value="permanent_inactive">
                স্থায়ী নিষ্ক্রিয় (Permanent)
              </option>
            </select>
          </div>
        )}

        {/* সেশন বছর ফিল্টার */}
        <div>
          <select
            value={selectedSession}
            onChange={(e) => {
              onSessionChange?.(e.target.value);
              triggerReset();
            }}
            className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white font-medium text-slate-700`}
          >
            <option value="all">
              {sessionAllLabel || "সকল শিক্ষাবর্ষ (২০১৮ - ২০২৬)"}
            </option>
            {sessionYears.map((year, idx) => (
              <option key={idx} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* বিভাগ ফিল্টার */}
        <div>
          <select
            value={selectedDivision}
            onChange={(e) => {
              onDivisionChange?.(e.target.value);
              onClassChange?.("all");
              onAcademyTypeChange?.("all");
              triggerReset();
            }}
            className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white font-medium text-slate-700`}
          >
            <option value="all">সকল বিভাগ</option>
            <option value="preHifz">প্রি-হিফজ</option>
            <option value="hifz">হিফজ</option>
            <option value="academy">একাডেমিক</option>
          </select>
        </div>

        {/* একাডেমি টাইপ ফিল্টার (শুধুমাত্র একাডেমি সিলেক্ট করলে দেখাবে) */}
        {selectedDivision === "academy" && (
          <div>
            <select
              value={selectedAcademyType}
              onChange={(e) => {
                onAcademyTypeChange?.(e.target.value);
                onClassChange?.("all");
                triggerReset();
              }}
              className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white font-medium text-slate-700`}
            >
              <option value="all">সকল একাডেমি লেভেল</option>
              <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
              <option value="প্রাথমিক">প্রাথমিক</option>
              <option value="মাধ্যমিক">মাধ্যমিক</option>
              <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
            </select>
          </div>
        )}

        {/* শ্রেণি ফিল্টার */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => {
              onClassChange?.(e.target.value);
              triggerReset();
            }}
            disabled={selectedDivision === "all"}
            className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="all">
              {selectedDivision === "all"
                ? "প্রথমে বিভাগ নির্বাচন করুন"
                : "সকল শ্রেণি"}
            </option>
            {getClassOptions(selectedDivision, selectedAcademyType, {
              includeHigherSecondary,
            }).map((cls, idx) => (
              <option key={idx} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* টাইপ ফিল্টার (আবাসিক/অনাবাসিক/ডে-কেয়ার) */}
        {showType && (
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                onTypeChange?.(e.target.value);
                triggerReset();
              }}
              className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white font-medium text-slate-700`}
            >
              <option value="all">সকল টাইপ (আবাসিক/অনাবাসিক)</option>
              <option value="আবাসিক">আবাসিক</option>
              <option value="অনাবাসিক">অনাবাসিক</option>
              <option value="ডে-কেয়ার">ডে-কেয়ার</option>
            </select>
          </div>
        )}

        {/* ফি ক্যাটাগরি ফিল্টার */}
        {showFeeCategory && (
          <div>
            <select
              value={selectedFeeCategory}
              onChange={(e) => {
                onFeeCategoryChange?.(e.target.value);
                triggerReset();
              }}
              className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none ${focusBorderClass} focus:bg-white font-medium text-slate-700`}
            >
              <option value="all">সকল ফি ক্যাটাগরি</option>
              {feeCategories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
