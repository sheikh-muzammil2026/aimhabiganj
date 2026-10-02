"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Printer,
  RefreshCw,
  ArrowLeft,
  User,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  MapPin,
  FileText,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  HeartHandshake,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const DAYS_OF_WEEK = [
  "শনিবার",
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
];

export default function ParentRoutinesPage() {
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("class"); // "class" | "exam" | "today" | "teachers"
  const [selectedDayFilter, setSelectedDayFilter] = useState("all");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState("both"); // "class" | "exam" | "both"

  const printRef = useRef(null);

  // Fetch children list for switching
  const fetchChildren = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/parent/children`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success && json.children && json.children.length > 0) {
        setChildren(json.children);
        if (!selectedStudentId) {
          setSelectedStudentId(json.children[0].studentId);
        }
      }
    } catch (err) {
      console.warn("Children fetch error:", err);
    }
  };

  // Fetch routines for selected child
  const fetchRoutines = async (studentId) => {
    try {
      setLoading(true);
      const url = studentId
        ? `${API_BASE}/api/parent/routines?studentId=${studentId}`
        : `${API_BASE}/api/parent/routines`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.message || "রুটিন লোড করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error("Routines fetch error:", err);
      toast.error("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchRoutines(selectedStudentId);
  }, [selectedStudentId]);

  const handlePrint = () => {
    window.print();
  };

  const student = data?.student || {};
  const periods = data?.periods || [];
  const weeklyMatrix = data?.weeklyMatrix || {};
  const examRoutines = data?.examRoutines || [];
  const todayInfo = data?.todayInfo || { dayName: "আজ", isWeekend: false, periods: [] };
  const teachersDirectory = data?.teachersDirectory || [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 p-3 sm:p-5 md:p-8 font-shalda">
      {/* 🟢 PRINT STYLES - INSTITUTIONAL WATERMARK & FORMAT */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #institutional-routine-print,
          #institutional-routine-print * {
            visibility: visible;
          }
          #institutional-routine-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 16px;
            background: white !important;
            color: black !important;
            font-size: 11pt;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Header & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/parent"
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-300"
              title="অভিভাবক ড্যাশবোর্ডে ফিরুন"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  একাডেমিক শিডিউল
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  সেশন {student.sessionYear || "২০২৬"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
                ক্লাস ও পরীক্ষার রুটিন
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                সন্তানের সাপ্তাহিক ক্লাসের সময়সূচি ও আসন্ন পরীক্ষার পূর্ণাঙ্গ বিবরণ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Child Switcher Dropdown */}
            {children.length > 0 && (
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                  শিক্ষার্থী:
                </span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-transparent text-xs font-black text-emerald-800 dark:text-emerald-300 focus:outline-none cursor-pointer"
                >
                  {children.map((ch) => (
                    <option
                      key={ch.studentId}
                      value={ch.studentId}
                      className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    >
                      {ch.studentNameBangla || ch.studentNameEnglish} (রোল: {ch.roll || "১"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => fetchRoutines(selectedStudentId)}
              disabled={loading}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>রুটিন প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        {/* 2. Active Student Badge & Quick Stats Strip */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 font-black text-xl shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {student.name || "শিক্ষার্থী"}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-neutral-900">
                  আইডি: {student.studentId}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                শ্রেণি: <span className="font-bold text-white">{student.className}</span> | শাখা: {student.section} | রোল: <span className="font-bold text-white">{student.roll}</span> | শিফট: {student.shift}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-xs">
            <Calendar className="w-4 h-4 text-amber-300" />
            <div>
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">
                আজকের সূচি ({todayInfo.dayName})
              </div>
              <div className="font-bold text-white">
                {todayInfo.isWeekend
                  ? "পবিত্র জুমার ছুটি"
                  : `${todayInfo.periods?.length || 6}টি একাডেমিক পিরিয়ড`}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab("class")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "class"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>সাপ্তাহিক ক্লাস রুটিন</span>
          </button>

          <button
            onClick={() => setActiveTab("exam")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "exam"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>পরীক্ষার রুটিন</span>
            {examRoutines.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-neutral-900 font-extrabold">
                নতুন
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("today")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "today"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>আজকের শিডিউল ({todayInfo.dayName})</span>
          </button>

          <button
            onClick={() => setActiveTab("teachers")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "teachers"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>বিষয় ও শিক্ষক তালিকা</span>
          </button>
        </div>

        {/* 4. Tab Contents */}
        {loading ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
              রুটিন তথ্য লোড করা হচ্ছে...
            </p>
          </div>
        ) : (
          <>
            {/* TAB 1: WEEKLY CLASS ROUTINE */}
            {activeTab === "class" && (
              <div className="space-y-4">
                {/* Day Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedDayFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedDayFilter === "all"
                          ? "bg-emerald-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      সম্পূর্ণ সপ্তাহ
                    </button>
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDayFilter(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedDayFilter === day
                            ? "bg-emerald-800 text-white"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold hidden sm:block">
                    মোট কর্মদিবস: ৬ দিন | ক্লাস শুরু: সকাল ০৮:০০
                  </div>
                </div>

                {/* Routine Table / Matrix */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 text-xs uppercase font-black border-b border-neutral-200 dark:border-neutral-700">
                          <th className="p-3.5 min-w-[110px] text-center">বার / দিন</th>
                          {periods.map((p) => (
                            <th
                              key={p.id}
                              className={`p-3 min-w-[160px] text-center border-l border-neutral-200 dark:border-neutral-700/60 ${
                                p.isBreak
                                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300"
                                  : ""
                              }`}
                            >
                              <div className="font-extrabold text-[13px]">{p.name}</div>
                              <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{p.time}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                        {DAYS_OF_WEEK.filter(
                          (day) => selectedDayFilter === "all" || selectedDayFilter === day
                        ).map((day) => {
                          const isToday = todayInfo.dayName === day;
                          const daySlots = weeklyMatrix[day] || {};

                          return (
                            <tr
                              key={day}
                              className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors ${
                                isToday ? "bg-emerald-50/60 dark:bg-emerald-950/20" : ""
                              }`}
                            >
                              {/* Day Label Cell */}
                              <td className="p-3.5 font-black text-neutral-900 dark:text-white text-center bg-neutral-50/70 dark:bg-neutral-800/40">
                                <div className="text-sm font-extrabold">{day}</div>
                                {isToday && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                                    আজ
                                  </span>
                                )}
                              </td>

                              {/* Period Cells */}
                              {periods.map((p) => {
                                const slot = daySlots[p.id];
                                if (p.isBreak) {
                                  return (
                                    <td
                                      key={p.id}
                                      className="p-3 text-center border-l border-neutral-200 dark:border-neutral-700/60 bg-amber-50/50 dark:bg-amber-950/20"
                                    >
                                      <div className="flex flex-col items-center justify-center py-1">
                                        <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
                                        <span className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                                          {slot?.subject || "নাস্তা ও বিশ্রাম"}
                                        </span>
                                      </div>
                                    </td>
                                  );
                                }

                                return (
                                  <td
                                    key={p.id}
                                    className="p-3 border-l border-neutral-200 dark:border-neutral-700/60 text-center"
                                  >
                                    {slot ? (
                                      <div className="space-y-1">
                                        <div className="font-black text-neutral-900 dark:text-white text-[13px] leading-tight">
                                          {slot.subject}
                                        </div>
                                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                          {slot.teacher}
                                        </div>
                                        {slot.room && (
                                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                                            <MapPin className="w-2.5 h-2.5" />
                                            <span>{slot.room}</span>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-neutral-400">—</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Important Madrasah Academic Rules & Guidelines */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 space-y-1">
                    <div className="font-black text-emerald-950 dark:text-emerald-100">
                      অভিভাবকদের প্রতি একাডেমিক নির্দেশনা:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-neutral-700 dark:text-neutral-300 text-xs">
                      <li>প্রতিদিন সকাল ০৭:৫৫ মিনিটের মধ্যে শিক্ষার্থীকে শ্রেণিকক্ষে উপস্থিত হতে হবে।</li>
                      <li>রুটিন অনুযায়ী নির্ধারিত কিতাব ও খাতা প্রতিদিন ব্যাগে প্রস্তুত রাখা আবশ্যক।</li>
                      <li>জোহরের নামাজের পর জামায়াতে নামাজ আদায় শেষে ছুটি প্রদান করা হবে।</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXAM ROUTINE */}
            {activeTab === "exam" && (
              <div className="space-y-6">
                {examRoutines.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
                    <Award className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                      বর্তমানে কোনো পরীক্ষার রুটিন প্রকাশিত হয়নি
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      পরীক্ষা শুরুর পূর্বেই নোটিশ ও রুটিন এই পাতায় হালনাগাদ করা হবে।
                    </p>
                  </div>
                ) : (
                  examRoutines.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm"
                    >
                      {/* Exam Header */}
                      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-neutral-900">
                              {ex.division || "সকল বিভাগ"}
                            </span>
                            <span className="text-xs text-emerald-200">
                              {ex.hijriYear}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                            {ex.examTitle} ({ex.gregorianYear})
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setPrintType("exam");
                              setShowPrintModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>পরীক্ষার রুটিন প্রিন্ট</span>
                          </button>
                        </div>
                      </div>

                      {/* Exam Notice / Timing banner */}
                      {ex.note && (
                        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 p-3 sm:px-5 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 font-bold">
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>বিশেষ নির্দেশনা: {ex.note}</span>
                        </div>
                      )}

                      {/* Exam Timetable Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 uppercase font-black border-b border-neutral-200 dark:border-neutral-700">
                              <th className="p-3.5 text-center min-w-[70px]">ক্রমিক</th>
                              <th className="p-3.5 min-w-[140px]">ইংরেজি তারিখ ও বার</th>
                              <th className="p-3.5 min-w-[110px]">হিজরী তারিখ</th>
                              <th className="p-3.5 min-w-[180px]">পরীক্ষার বিষয়</th>
                              <th className="p-3.5 min-w-[140px] text-center">সময়</th>
                              <th className="p-3.5 min-w-[120px] text-center">আসন / হল</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {ex.schedule.map((item, sIdx) => (
                              <tr
                                key={item.id || sIdx}
                                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                              >
                                <td className="p-3.5 text-center font-bold text-neutral-500">
                                  {sIdx + 1}
                                </td>
                                <td className="p-3.5">
                                  <div className="font-black text-neutral-900 dark:text-white">
                                    {item.date}
                                  </div>
                                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                    {item.day}
                                  </div>
                                </td>
                                <td className="p-3.5 font-bold text-neutral-600 dark:text-neutral-400">
                                  {item.hijri || "—"}
                                </td>
                                <td className="p-3.5">
                                  <span className="font-black text-neutral-900 dark:text-white text-sm">
                                    {item.subject}
                                  </span>
                                </td>
                                <td className="p-3.5 text-center font-bold text-neutral-800 dark:text-neutral-200">
                                  {item.time}
                                </td>
                                <td className="p-3.5 text-center font-bold text-neutral-700 dark:text-neutral-300">
                                  <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px]">
                                    {item.room || "হল-১"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: TODAY'S LIVE TRACKER */}
            {activeTab === "today" && (
              <div className="space-y-4">
                {todayInfo.isWeekend ? (
                  /* Friday Weekend Card */
                  <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-neutral-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/50 shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-900 flex items-center justify-center font-black">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-md">
                          আজকের দিন: {todayInfo.dayName}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                          পবিত্র জুমাতুল মুবারক (সাপ্তাহিক ছুটি)
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-emerald-200 leading-relaxed max-w-2xl">
                      {todayInfo.weekendNote ||
                        "আজ মাদরাসার সাপ্তাহিক ছুটির দিন। শিক্ষার্থীদের পরিবার-পরিজনের সাথে দ্বীনি পরিবেশ বজায় রাখা, জুমার নামাজ প্রস্তুতি এবং পূর্ববর্তী সবক রিভিশন করার অনুরোধ করা হচ্ছে।"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-amber-300 font-bold text-sm mb-1">
                          ১. সুন্নাত আমলসমূহ
                        </div>
                        <p className="text-xs text-emerald-100">
                          গোসল, মিসওয়াক, উত্তম পোশাক পরিধান, সুগন্ধি ব্যবহার ও সূরা কাহাফ তিলাওয়াত।
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-amber-300 font-bold text-sm mb-1">
                          ২. দরুদ শরিফ পাঠ
                        </div>
                        <p className="text-xs text-emerald-100">
                          জুমার দিনে প্রিয় নবীজি (সা.)-এর উপর অধিক পরিমাণে দরুদ ও সালাম প্রেরণ করা।
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-amber-300 font-bold text-sm mb-1">
                          ৩. আগামী সপ্তাহের প্রস্তুতি
                        </div>
                        <p className="text-xs text-emerald-100">
                          শনিবারের ক্লাসের জন্য নতুন সবক ইয়াদ ও কিতাবসমূহ গুছিয়ে রাখা।
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Today's Working Schedule */
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          আজকের দিনের পাঠদান
                        </div>
                        <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                          {todayInfo.dayName} এর ক্লাস তালিকা
                        </h3>
                      </div>
                      <div className="text-xs font-bold text-neutral-500">
                        মোট {todayInfo.periods?.length}টি পিরিয়ড
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {todayInfo.periods.map((p, idx) => (
                        <div
                          key={p.id}
                          className={`rounded-2xl p-4 border transition-all ${
                            p.isBreak
                              ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                              : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-emerald-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.isBreak
                                  ? "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {p.name}
                            </span>
                            <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{p.time}</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <h4 className="font-black text-neutral-900 dark:text-white text-base">
                              {p.subject}
                            </h4>
                            {!p.isBreak && (
                              <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                  {p.teacher}
                                </span>
                                <span className="text-neutral-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{p.room || "কক্ষ ২০২"}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TEACHERS & SUBJECT DIRECTORY */}
            {activeTab === "teachers" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                    {student.className} শ্রেণির সম্মানিত শিক্ষক ও বিষয়ভিত্তিক দায়িত্ব
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    সন্তানের পড়াশোনা ও অগ্রগতির বিষয়ে পরামর্শের জন্য নির্ধারিত শিক্ষকগণের সাথে যোগাযোগ করতে পারেন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachersDirectory.map((t, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          {t.subject}
                        </div>
                        <h4 className="font-black text-neutral-900 dark:text-white text-sm">
                          {t.teacher}
                        </h4>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {t.designation}
                        </div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1 pt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{t.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 5. PRINT MODAL / INSTITUTIONAL PRINT VIEW */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-neutral-900 w-full max-w-4xl rounded-2xl p-6 sm:p-8 shadow-2xl relative my-auto">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-lg text-neutral-900">
                  অফিসিয়াল রুটিন প্রিন্ট প্রিভিউ
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setPrintType("both")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      printType === "both" ? "bg-emerald-700 text-white" : "text-neutral-700"
                    }`}
                  >
                    উভয় রুটিন
                  </button>
                  <button
                    onClick={() => setPrintType("class")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      printType === "class" ? "bg-emerald-700 text-white" : "text-neutral-700"
                    }`}
                  >
                    ক্লাস রুটিন
                  </button>
                  <button
                    onClick={() => setPrintType("exam")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      printType === "exam" ? "bg-emerald-700 text-white" : "text-neutral-700"
                    }`}
                  >
                    পরীক্ষার রুটিন
                  </button>
                </div>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>এখনই প্রিন্ট করুন</span>
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-500 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Print Document Content */}
            <div id="institutional-routine-print" className="space-y-6">
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-emerald-800 pb-4">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  বিসমিল্লাহির রাহমানির রাহিম
                </div>
                <h2 className="text-2xl font-black text-neutral-900 mt-1">
                  দারুল উলুম আল-ইসলামিয়া হাবিবগঞ্জ
                </h2>
                <p className="text-xs text-neutral-600">
                  মাদরাসা রোড, সদর, হাবিবগঞ্জ | ফোন: ০১৭৫০-২৩৯০০১ | শিক্ষাবর্ষ: {student.sessionYear || "২০২৬"}
                </p>
                <div className="inline-block mt-2 px-4 py-1 bg-emerald-800 text-white text-xs font-black rounded-md">
                  {printType === "exam"
                    ? "পরীক্ষার সময়সূচি ও আসন বণ্টন"
                    : printType === "class"
                    ? "সাপ্তাহিক ক্লাস রুটিন"
                    : "একাডেমিক ক্লাস ও পরীক্ষার পূর্ণাঙ্গ রুটিন"}
                </div>
              </div>

              {/* Student Info Strip */}
              <div className="grid grid-cols-4 gap-2 text-xs bg-neutral-100 p-3 rounded-lg border border-neutral-300">
                <div>
                  <span className="text-neutral-500">শিক্ষার্থীর নাম:</span>{" "}
                  <span className="font-bold text-neutral-900">{student.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500">আইডি:</span>{" "}
                  <span className="font-bold text-neutral-900">{student.studentId}</span>
                </div>
                <div>
                  <span className="text-neutral-500">শ্রেণি:</span>{" "}
                  <span className="font-bold text-neutral-900">{student.className}</span>
                </div>
                <div>
                  <span className="text-neutral-500">রোল:</span>{" "}
                  <span className="font-bold text-neutral-900">{student.roll}</span>
                </div>
              </div>

              {/* Class Routine Print Section */}
              {(printType === "class" || printType === "both") && (
                <div className="space-y-2">
                  <div className="font-black text-sm text-neutral-900">
                    ১. সাপ্তাহিক ক্লাস সময়সূচি (শনিবার - বৃহস্পতিবার)
                  </div>
                  <table className="w-full text-xs border border-neutral-400 border-collapse">
                    <thead>
                      <tr className="bg-neutral-200 text-neutral-900 font-bold border-b border-neutral-400">
                        <th className="p-2 border-r border-neutral-400 text-center">বার</th>
                        {periods.map((p) => (
                          <th key={p.id} className="p-2 border-r border-neutral-400 text-center">
                            <div>{p.name}</div>
                            <div className="text-[10px] font-normal">{p.time}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS_OF_WEEK.map((day) => {
                        const slots = weeklyMatrix[day] || {};
                        return (
                          <tr key={day} className="border-b border-neutral-300">
                            <td className="p-2 border-r border-neutral-400 font-bold text-center bg-neutral-50">
                              {day}
                            </td>
                            {periods.map((p) => {
                              const s = slots[p.id];
                              if (p.isBreak) {
                                return (
                                  <td
                                    key={p.id}
                                    className="p-1.5 border-r border-neutral-400 text-center bg-amber-50 text-[10px] font-bold text-amber-900"
                                  >
                                    নাস্তা ও বিশ্রাম
                                  </td>
                                );
                              }
                              return (
                                <td
                                  key={p.id}
                                  className="p-1.5 border-r border-neutral-400 text-center"
                                >
                                  {s ? (
                                    <>
                                      <div className="font-bold">{s.subject}</div>
                                      <div className="text-[10px] text-neutral-600">
                                        {s.teacher}
                                      </div>
                                    </>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exam Routine Print Section */}
              {(printType === "exam" || printType === "both") && examRoutines.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="font-black text-sm text-neutral-900">
                    ২. পরীক্ষার সময়সূচি ({examRoutines[0].examTitle} - {examRoutines[0].gregorianYear})
                  </div>
                  <table className="w-full text-xs border border-neutral-400 border-collapse">
                    <thead>
                      <tr className="bg-neutral-200 text-neutral-900 font-bold border-b border-neutral-400">
                        <th className="p-2 border-r border-neutral-400 text-center w-12">ক্রমিক</th>
                        <th className="p-2 border-r border-neutral-400">ইংরেজি তারিখ ও বার</th>
                        <th className="p-2 border-r border-neutral-400">হিজরী তারিখ</th>
                        <th className="p-2 border-r border-neutral-400">বিষয়</th>
                        <th className="p-2 border-r border-neutral-400 text-center">সময়</th>
                        <th className="p-2 text-center">হল/কক্ষ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examRoutines[0].schedule.map((item, idx) => (
                        <tr key={idx} className="border-b border-neutral-300">
                          <td className="p-2 border-r border-neutral-400 text-center">{idx + 1}</td>
                          <td className="p-2 border-r border-neutral-400 font-bold">
                            {item.date} ({item.day})
                          </td>
                          <td className="p-2 border-r border-neutral-400">{item.hijri || "—"}</td>
                          <td className="p-2 border-r border-neutral-400 font-black">{item.subject}</td>
                          <td className="p-2 border-r border-neutral-400 text-center font-bold">
                            {item.time}
                          </td>
                          <td className="p-2 text-center">{item.room || "হল-১"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Signatures Strip */}
              <div className="pt-10 flex justify-between items-end text-xs font-bold text-neutral-700">
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">শ্রেণি শিক্ষক</div>
                </div>
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">নাজেমে তা'লীমাত</div>
                </div>
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">মুহতামিম / প্রিন্সিপাল</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
