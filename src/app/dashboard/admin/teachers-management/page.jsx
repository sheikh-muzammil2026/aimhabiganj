"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  Calendar,
  Search,
  RefreshCw,
  MapPin,
  ExternalLink,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { getDhakaTime } from "@/lib/attendance-config";

export default function AdminTeachersManagementPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return getDhakaTime().dateStr;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalTeachers: 0,
    presentToday: 0,
    absentToday: 0,
    onTimeToday: 0,
    lateToday: 0,
  });

  const [attendanceList, setAttendanceList] = useState([]);
  const [isToday, setIsToday] = useState(true);

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

      const res = await fetch(`/api/admin/teachers-attendance?${query.toString()}`);
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
    fetchData();
  }, [fetchData]);

  // Format Bangladesh time for display (e.g., "08:04 AM")
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return "--:--";
    }
  };

  // Calculate working hours between check-in and check-out
  const calculateWorkDuration = (checkInIso, checkOutIso) => {
    if (!checkInIso || !checkOutIso) return null;
    const diffMs = new Date(checkOutIso) - new Date(checkInIso);
    if (diffMs <= 0) return "০ মি.";
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins} মি.`;
    return `${hours} ঘণ্টা ${mins} মি.`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            প্রশাসনিক শিক্ষক উপস্থিতি ও ব্যবস্থাপনা
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            শিক্ষক হাজিরা সংক্ষিপ্ত বিবরণ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            মাদরাসার সকল শিক্ষকের দৈনিক প্রবেশ ও প্রস্থান হাজিরা এবং পরিসংখ্যান পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/attendance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Clock className="w-4 h-4" />
            <span>শিক্ষক হাজিরা পেজ</span>
          </Link>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Summary Metrics Cards (5 Key Metrics) */}
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
              ৮:০৫ এর পূর্বে প্রবেশ
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
              ৮:০৫ এর পরে প্রবেশ
            </p>
          </div>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Date Picker & Today Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => setSelectedDate(getDhakaTime().dateStr)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDate === getDhakaTime().dateStr
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              আজকের তারিখ (Today)
            </button>
          </div>

          {/* Right: Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষকের নাম বা ইমেইল দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            { key: "all", label: `সবাই (${metrics.totalTeachers})` },
            { key: "present", label: `উপস্থিত (${metrics.presentToday})` },
            { key: "absent", label: `অনুপস্থিত (${metrics.absentToday})` },
            { key: "onTime", label: `সময়মতো (${metrics.onTimeToday})` },
            { key: "late", label: `দেরিতে (${metrics.lateToday})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.key
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Full Attendance Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>হাজিরা রেজিস্টার তালিকা</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">
              {selectedDate}
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            মোট প্রদর্শিত: {attendanceList.length} জন
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span>তথ্য লোড করা হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-rose-500 text-sm">
            ত্রুটি: {error}
          </div>
        ) : attendanceList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            কোনো শিক্ষকের তথ্য বা হাজিরার রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-700/40">
                <tr>
                  <th className="py-3.5 px-5 font-bold">শিক্ষক পরিচিতি</th>
                  <th className="py-3.5 px-4 font-bold">প্রবেশ হাজিরা (Check-In)</th>
                  <th className="py-3.5 px-4 font-bold">প্রবেশ স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 font-bold">প্রস্থান হাজিরা (Check-Out)</th>
                  <th className="py-3.5 px-4 font-bold">প্রস্থান স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 font-bold">কর্মঘণ্টা</th>
                  <th className="py-3.5 px-4 font-bold">অবস্থান</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {attendanceList.map((item) => (
                  <tr
                    key={item.teacherId || item.teacherEmail}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors"
                  >
                    {/* Teacher Profile Column */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-emerald-200 dark:border-emerald-800">
                          {item.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.profileImage}
                              alt={item.teacherName}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            item.teacherName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">
                            {item.teacherName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {item.teacherEmail}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.2 rounded">
                            {item.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Check-In Time */}
                    <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                      {item.hasCheckedIn ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Clock3 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{formatTime(item.checkInTime)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">অনুপস্থিত</span>
                      )}
                    </td>

                    {/* Check-In Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.hasCheckedIn ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.checkInStatus === "On Time"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300"
                          }`}
                        >
                          {item.checkInStatus === "On Time" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {item.checkInStatus === "On Time" ? "On Time" : "Late"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          Absent
                        </span>
                      )}
                    </td>

                    {/* Check-Out Time */}
                    <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                      {item.hasCheckedOut ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Clock3 className="w-3.5 h-3.5 text-teal-600" />
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
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300"
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
                        <span className="text-xs text-slate-400">অপেক্ষমান</span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {calculateWorkDuration(item.checkInTime, item.checkOutTime) || (
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
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                          title="ম্যাপে অবস্থান দেখুন"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
