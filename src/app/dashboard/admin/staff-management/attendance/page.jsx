"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  Shield,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  CreditCard,
  Plus,
  X,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { getDhakaTime } from "@/lib/attendance-config";

export default function StaffAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return getDhakaTime().dateStr;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      const res = await fetch(`/api/admin/staff-attendance?${query.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "স্টাফ হাজিরা লোড করতে সমস্যা হয়েছে।");
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
  }, [selectedDate, searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Format Time
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

  // Duration
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

  // Open Record Modal
  const handleOpenRecord = (staff) => {
    setSelectedStaffToRecord(staff);
    setRecordStatus(staff.checkInStatus === "Late" ? "Late" : "On Time");
    setRecordComment(staff.checkInComment || "");
    setRecordModalOpen(true);
  };

  // Submit Manual Attendance
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!selectedStaffToRecord) return;

    try {
      setIsSavingRecord(true);
      const res = await fetch("/api/admin/staff-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedStaffToRecord.staffId,
          staffName: selectedStaffToRecord.fullName,
          staffEmail: selectedStaffToRecord.email,
          date: selectedDate,
          checkInStatus: recordStatus,
          checkInComment: recordComment.trim() || null,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);

      toast.success(result.message || "হাজিরা সফলভাবে সংরক্ষিত হয়েছে!");
      setRecordModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "হাজিরা সংরক্ষণে ব্যর্থ হয়েছে!");
    } finally {
      setIsSavingRecord(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-700/60">
        <Link
          href="/dashboard/admin/staff-management/staff-id-card"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span>স্টাফ আইডি কার্ড তৈরি (ID Card)</span>
        </Link>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-600">
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span>স্টাফ হাজিরা (Attendance)</span>
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            প্রশাসনিক কর্মচারী ব্যবস্থাপনা
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            স্টাফ হাজিরা সংক্ষিপ্ত বিবরণ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            মাদরাসার সকল কর্মচারীর দৈনিক উপস্থিতি ও কাজের সময় পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Summary Metrics Cards */}
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

      {/* Controls & Filter Bar */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl">
              <Calendar className="w-4 h-4 text-teal-600" />
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
                  ? "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              আজকের তারিখ (Today)
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="স্টাফের নাম বা পদবি দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            { key: "all", label: `সবাই (${metrics.totalStaff})` },
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
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>স্টাফ হাজিরা রেজিস্টার</span>
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
            <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
            <span>তথ্য লোড করা হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-rose-500 text-sm">
            ত্রুটি: {error}
          </div>
        ) : attendanceList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            কোনো স্টাফের তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-700/40">
                <tr>
                  <th className="py-3.5 px-5 font-bold">স্টাফ পরিচিতি</th>
                  <th className="py-3.5 px-4 font-bold">প্রবেশ হাজিরা (Check-In)</th>
                  <th className="py-3.5 px-4 font-bold">প্রবেশ স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 font-bold">প্রস্থান হাজিরা (Check-Out)</th>
                  <th className="py-3.5 px-4 font-bold">কর্মঘণ্টা</th>
                  <th className="py-3.5 px-4 font-bold">দেরি/পূর্বে প্রস্থানের কারণ</th>
                  <th className="py-3.5 px-4 font-bold text-center">হাজিরা পরিবর্তন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {attendanceList.map((item) => (
                  <tr
                    key={item.staffId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                          {item.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">
                            {item.fullName}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.2 rounded">
                            {item.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                      {item.hasCheckedIn ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Clock3 className="w-3.5 h-3.5 text-teal-600" />
                          <span>{formatTime(item.checkInTime)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">অনুপস্থিত</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.hasCheckedIn ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.checkInStatus === "On Time"
                              ? "bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-300"
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                      {item.hasCheckedOut ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Clock3 className="w-3.5 h-3.5 text-slate-600" />
                          <span>{formatTime(item.checkOutTime)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {calculateWorkDuration(item.checkInTime, item.checkOutTime) || (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                      {item.checkInComment || item.checkOutComment ? (
                        <div className="flex flex-col gap-1">
                          {item.checkInComment && (
                            <span title={item.checkInComment} className="truncate">
                              <strong className="text-rose-600 font-semibold">দেরি:</strong> {item.checkInComment}
                            </span>
                          )}
                          {item.checkOutComment && (
                            <span title={item.checkOutComment} className="truncate">
                              <strong className="text-amber-600 font-semibold">আর্লি:</strong> {item.checkOutComment}
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
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-700 transition"
                      >
                        {item.hasCheckedIn ? "সম্পাদনা" : "উপস্থিত করুন"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                হাজিরা নথিভুক্ত করুন ({selectedStaffToRecord?.fullName})
              </h3>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  তারিখ
                </label>
                <input
                  type="date"
                  disabled
                  value={selectedDate}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রবেশ স্ট্যাটাস (Status)
                </label>
                <select
                  value={recordStatus}
                  onChange={(e) => setRecordStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                >
                  <option value="On Time">সময়মতো (On Time)</option>
                  <option value="Late">দেরিতে (Late)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  দেরি বা বিশেষ কারণ (মন্তব্য)
                </label>
                <textarea
                  rows={3}
                  value={recordComment}
                  onChange={(e) => setRecordComment(e.target.value)}
                  placeholder="দেরি বা ছুটির কারণ লিখুন..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSavingRecord}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition disabled:opacity-50"
                >
                  {isSavingRecord ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
