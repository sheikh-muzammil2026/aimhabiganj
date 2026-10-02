"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const MONTH_OPTIONS = [
  { id: "all", label: "সকল উপস্থিতির রেকর্ড" },
  { id: "2026-10", label: "অক্টোবর ২০২৬" },
  { id: "2026-09", label: "সেপ্টেম্বর ২০২৬" },
  { id: "2026-08", label: "আগস্ট ২০২৬" },
];

export default function ParentAttendancePage() {
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch children list
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

  // Fetch attendance report
  const fetchAttendance = async (studentId, month) => {
    try {
      setLoading(true);
      let url = `${API_BASE}/api/parent/attendance?`;
      if (studentId) url += `studentId=${studentId}&`;
      if (month && month !== "all") url += `month=${month}&`;

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.message || "হাজিরা ডাটা পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Attendance fetch error:", err);
      toast.error("হাজিরা তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchAttendance(selectedStudentId, selectedMonth);
  }, [selectedStudentId, selectedMonth]);

  const stats = data?.stats || {
    totalDays: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    rate: 100,
  };

  const student = data?.student;
  const records = data?.records || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* Top Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="space-y-1">
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>অভিভাবক ড্যাশবোর্ডে ফিরে যান</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <span>সন্তানের ডিজিটাল হাজিরা রিপোর্ট</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {student?.name ? `${student.name} (রোল: ${student.roll} | শ্রেণি: ${student.className})` : "ডিজিটাল উপস্থিতি রেকর্ড"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {children.length > 1 && (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {children.map((c) => (
                <option key={c.studentId} value={c.studentId}>
                  {c.studentNameBangla || c.studentNameEnglish}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchAttendance(selectedStudentId, selectedMonth)}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট রিপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Attendance Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">উপস্থিতির হার</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-emerald-600">{stats.rate}%</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.rate}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            {stats.rate >= 90 ? "সন্তোষজনক উপস্থিতি" : "উপস্থিতি বাড়ানো প্রয়োজন"}
          </span>
        </div>

        {/* Total Working Days */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">মোট ক্লাস দিবস</span>
          <div className="my-2">
            <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalDays}</p>
          </div>
          <span className="text-[11px] text-slate-400">রেকর্ডকৃত কর্মদিবস</span>
        </div>

        {/* Present Days */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">উপস্থিত দিন</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-emerald-600">{stats.presentCount}</p>
          </div>
          <span className="text-[11px] text-emerald-600/80 font-medium">নিয়মিত ক্লাসে অংশ নিয়েছে</span>
        </div>

        {/* Absent Days */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">অনুপস্থিত দিন</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-rose-600">{stats.absentCount}</p>
          </div>
          <span className="text-[11px] text-rose-500/80 font-medium">ছুটি বা অনুপস্থিতি</span>
        </div>

        {/* Late Days */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">বিলম্বে উপস্থিতি</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-amber-600">{stats.lateCount}</p>
          </div>
          <span className="text-[11px] text-amber-600/80 font-medium">নির্ধারিত সময়ের পর প্রবেশ</span>
        </div>
      </div>

      {/* Visual Monthly Calendar Matrix */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>মাসিক হাজিরা ভিজ্যুয়াল ক্যালেন্ডার</span>
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> উপস্থিত
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> অনুপস্থিত
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> বিলম্ব
            </span>
          </div>
        </div>

        {/* Day Badges Wrap */}
        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-14 gap-2 pt-2">
          {records.map((r, i) => {
            const isPresent = r.status === "present";
            const isAbsent = r.status === "absent";
            const isLate = r.status === "late";

            const dayNum = r.date ? r.date.split("-")[2] : i + 1;

            return (
              <div
                key={i}
                title={`${r.date} (${r.day}) - ${
                  isPresent ? "উপস্থিত" : isAbsent ? "অনুপস্থিত" : "বিলম্ব"
                }`}
                className={`p-2.5 rounded-2xl border text-center transition-transform hover:scale-105 cursor-pointer ${
                  isPresent
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300"
                    : isAbsent
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300"
                    : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300"
                }`}
              >
                <span className="block text-xs font-black">{dayNum}</span>
                <span className="block text-[10px] mt-0.5 opacity-80 truncate">
                  {isPresent ? "✓ উপস্থিত" : isAbsent ? "✗ ছুটি" : "⏱ বিলম্ব"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Chronological History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            দৈনিক হাজিরা লগ ও বিবরণ
          </h3>
          <span className="text-xs text-slate-400">সর্বমোট {records.length}টি এন্ট্রি</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-3" />
            <p>হাজিরা লগ লোড হচ্ছে...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            কোনো হাজিরার রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">তারিখ</th>
                  <th className="py-3.5 px-4">বার</th>
                  <th className="py-3.5 px-4">শ্রেণি / বিভাগ</th>
                  <th className="py-3.5 px-4">প্রবেশের সময়</th>
                  <th className="py-3.5 px-4 text-center">উপস্থিতি স্ট্যাটাস</th>
                  <th className="py-3.5 px-4">উস্তাদের মন্তব্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {records.map((row, idx) => {
                  const isPresent = row.status === "present";
                  const isAbsent = row.status === "absent";
                  const isLate = row.status === "late";

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {row.day}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {row.className || "হিফজ বিভাগ"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">
                        {row.inTime}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            isPresent
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : isAbsent
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {isPresent && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isAbsent && <XCircle className="w-3.5 h-3.5" />}
                          {isLate && <Clock className="w-3.5 h-3.5" />}
                          <span>
                            {isPresent ? "উপস্থিত" : isAbsent ? "অনুপস্থিত" : "বিলম্ব"}
                          </span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {row.remarks || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
