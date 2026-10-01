"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { toast } from "react-toastify";
import {
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  RefreshCw,
  AlertCircle,
  Search,
  TrendingUp,
  BarChart3,
  FileCheck,
  Check,
  UserCheck,
  UserX,
  History,
  Sparkles,
  BookOpen,
} from "lucide-react";

// Standard Class List for Madrasah & Academy
const AVAILABLE_CLASSES = [
  "প্লে",
  "নার্সারি",
  "প্রথম",
  "দ্বিতীয়",
  "তৃতীয়",
  "চতুর্থ",
  "পঞ্চম",
  "ষষ্ঠ",
  "সপ্তম",
  "অষ্টম",
  "নবম",
  "দশম",
  "১১শ শ্রেণি",
  "১২শ শ্রেণি",
  "কায়দা/আমপারা",
  "নাজেরা",
  "সবক",
  "শুনানি",
];

function AttendanceReportContent() {
  // Navigation tab: 'entry' (Daily Marking) | 'report' (Analytics & History)
  const [activeTab, setActiveTab] = useState("entry");

  // Selection states
  const [selectedClass, setSelectedClass] = useState("ষষ্ঠ");
  const [selectedSession, setSelectedSession] = useState("২০২৬");
  const [selectedDate, setSelectedDate] = useState(() => {
    // Current date in YYYY-MM-DD
    const now = new Date();
    return now.toISOString().split("T")[0];
  });

  // Search within class
  const [studentSearch, setStudentSearch] = useState("");

  // Data states
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);

  // Attendance state: Map of studentId -> { status: 'present'|'absent'|'late', remarks: '' }
  const [attendanceMap, setAttendanceMap] = useState({});
  const [initialAttendanceMap, setInitialAttendanceMap] = useState({});
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // History & Report States
  const [reportData, setReportData] = useState({ metrics: null, history: [] });
  const [loadingReport, setLoadingReport] = useState(false);

  // Parse roll helper
  const parseRollNumber = (r) => {
    if (!r || r === "N/A") return Infinity;
    const bnToEn = {
      "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
      "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    };
    const enStr = String(r)
      .split("")
      .map((char) => bnToEn[char] || char)
      .join("");
    const num = parseInt(enStr, 10);
    return isNaN(num) ? Infinity : num;
  };

  // 1. Fetch Students for Selected Class
  const fetchStudentsForClass = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setLoadingStudents(true);
      setErrorStudents(null);

      const params = new URLSearchParams({
        class: selectedClass,
        sessionYear: selectedSession,
        status: "Approved",
        activity: "active",
        limit: "500",
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`
      );
      const data = await res.json();

      if (data.success || data.data) {
        const sorted = (data.data || []).sort((a, b) => {
          const diff = parseRollNumber(a.roll) - parseRollNumber(b.roll);
          if (diff !== 0) return diff;
          return String(a.studentId || "").localeCompare(String(b.studentId || ""), undefined, { numeric: true });
        });
        setStudents(sorted);
      } else {
        setErrorStudents(data.message || "শিক্ষার্থীদের তালিকা পাওয়া যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching class students:", err);
      setErrorStudents("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedClass, selectedSession]);

  // 2. Fetch Existing Attendance for Class on Selected Date
  const fetchDateAttendance = useCallback(async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      setLoadingAttendance(true);
      const params = new URLSearchParams({
        class: selectedClass,
        date: selectedDate,
        sessionYear: selectedSession,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students-attendance?${params.toString()}`
      );
      const json = await res.json();

      const newMap = {};
      if (json.success && json.data && Array.isArray(json.data.records)) {
        json.data.records.forEach((r) => {
          if (r.studentId) {
            newMap[r.studentId] = {
              status: r.status || "present",
              remarks: r.remarks || "",
            };
          }
        });
        setLastSavedTime(json.data.updatedAt || json.data.createdAt);
      } else {
        setLastSavedTime(null);
      }

      setAttendanceMap(newMap);
      setInitialAttendanceMap(newMap);
    } catch (err) {
      console.error("Error fetching date attendance:", err);
    } finally {
      setLoadingAttendance(false);
    }
  }, [selectedClass, selectedDate, selectedSession]);

  // 3. Fetch Class Attendance Report & History
  const fetchReport = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setLoadingReport(true);
      const params = new URLSearchParams({
        class: selectedClass,
        sessionYear: selectedSession,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students-attendance/report?${params.toString()}`
      );
      const json = await res.json();

      if (json.success) {
        setReportData({
          metrics: json.metrics,
          history: json.history || [],
        });
      }
    } catch (err) {
      console.error("Error fetching attendance report:", err);
    } finally {
      setLoadingReport(false);
    }
  }, [selectedClass, selectedSession]);

  // Trigger loads
  useEffect(() => {
    fetchStudentsForClass();
  }, [fetchStudentsForClass]);

  useEffect(() => {
    fetchDateAttendance();
  }, [fetchDateAttendance]);

  useEffect(() => {
    if (activeTab === "report") {
      fetchReport();
    }
  }, [activeTab, fetchReport]);

  // Set single student status
  const handleSetStatus = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status,
      },
    }));
  };

  // Bulk actions: Mark All
  const handleMarkAll = (status) => {
    const next = {};
    students.forEach((s) => {
      next[s.studentId] = {
        ...(attendanceMap[s.studentId] || {}),
        status,
      };
    });
    setAttendanceMap(next);
    toast.info(
      status === "present"
        ? "সকল শিক্ষার্থীকে 'উপস্থিত' হিসেবে চিহ্নিত করা হয়েছে।"
        : status === "absent"
        ? "সকল শিক্ষার্থীকে 'অনুপস্থিত' হিসেবে চিহ্নিত করা হয়েছে।"
        : "সকল শিক্ষার্থীকে 'বিলম্বিত' হিসেবে চিহ্নিত করা হয়েছে।"
    );
  };

  // Reset to saved state
  const handleResetToSaved = () => {
    setAttendanceMap(initialAttendanceMap);
    toast.info("সংরক্ষিত অবস্থায় ফিরিয়ে নেওয়া হয়েছে।");
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (students.length === 0) return false;
    for (const s of students) {
      const current = attendanceMap[s.studentId]?.status || "present";
      const initial = initialAttendanceMap[s.studentId]?.status || "present";
      if (current !== initial) return true;
    }
    return false;
  }, [students, attendanceMap, initialAttendanceMap]);

  // Current attendance counts for the class
  const classStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;

    students.forEach((s) => {
      const status = attendanceMap[s.studentId]?.status || "present";
      if (status === "present") present++;
      else if (status === "absent") absent++;
      else if (status === "late") late++;
    });

    const total = students.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { total, present, absent, late, rate };
  }, [students, attendanceMap]);

  // 4. Save/Submit Daily Attendance API
  const handleSaveAttendance = async () => {
    if (!selectedClass || students.length === 0) return;

    try {
      setSavingAttendance(true);

      const records = students.map((s) => ({
        studentId: s.studentId,
        studentName: s.studentNameBangla || s.studentNameEnglish,
        roll: s.roll || "",
        status: attendanceMap[s.studentId]?.status || "present",
        remarks: attendanceMap[s.studentId]?.remarks || "",
      }));

      const payload = {
        date: selectedDate,
        className: selectedClass,
        sessionYear: selectedSession,
        division:
          students[0]?.divisionAcademy?.active
            ? "একাডেমিক"
            : students[0]?.divisionPreHifz?.active
            ? "প্রি-হিফজ"
            : students[0]?.divisionHifz?.active
            ? "হিফজুল কুরআন"
            : "সাধারণ",
        records,
        recordedBy: "admin",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students-attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "হাজিরা সংরক্ষণ ব্যর্থ হয়েছে।");
      }

      toast.success(result.message || "হাজিরা সফলভাবে সংরক্ষিত হয়েছে!");
      setInitialAttendanceMap({ ...attendanceMap });
      setLastSavedTime(new Date().toISOString());

      // Refresh report data in background if needed
      fetchReport();
    } catch (err) {
      console.error("Save attendance error:", err);
      toast.error(err.message || "সার্ভারে হাজিরা সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSavingAttendance(false);
    }
  };

  // Filter students inside class by search term
  const displayedStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    const q = studentSearch.trim().toLowerCase();
    return students.filter((s) => {
      const name = (s.studentNameBangla || s.studentNameEnglish || "").toLowerCase();
      const id = (s.studentId || "").toLowerCase();
      const roll = (s.roll || "").toLowerCase();
      return name.includes(q) || id.includes(q) || roll.includes(q);
    });
  }, [students, studentSearch]);

  const sessionYears = [
    "২০২৬", "২০২৫", "২০২৪", "২০২৩", "২০২২", "২০২১", "২০২০", "২০১৯", "২০১৮"
  ];

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              দৈনিক শ্রেণি হাজিরা ও উপস্থিতি রিপোর্ট
            </span>
            <span className="text-xs text-slate-400 font-medium">AIM Attendance System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            শ্রেণিভিত্তিক শিক্ষার্থী হাজিরা ও রিপোর্ট
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            শ্রেণি নির্বাচন করে শিক্ষার্থীদের দৈনিক উপস্থিতি, অনুপস্থিতি ও বিলম্বিত হাজিরা সরাসরি এন্ট্রি ও রিপোর্ট পর্যবেক্ষণ করুন।
          </p>
        </div>

        {/* View Switcher Tabs: Daily Entry vs Report */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab("entry")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "entry"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>দৈনিক হাজিরা এন্ট্রি</span>
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "report"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>হাজিরা রিপোর্ট ও ইতিহাস</span>
          </button>
        </div>
      </div>

      {/* 2. Control Toolbar: Class Selector, Date Picker, Session Year */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class Selector Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              শ্রেণি নির্বাচন করুন:
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {AVAILABLE_CLASSES.map((cls, idx) => (
                  <option key={idx} value={cls}>
                    শ্রেণি: {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Session */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              শিক্ষাবর্ষ:
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {sessionYears.map((yr, idx) => (
                <option key={idx} value={yr}>
                  শিক্ষাবর্ষ {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              হাজিরার তারিখ:
            </label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Refresh Action */}
          <div className="flex items-end">
            <button
              onClick={() => {
                fetchStudentsForClass();
                fetchDateAttendance();
                if (activeTab === "report") fetchReport();
              }}
              disabled={loadingStudents || loadingAttendance}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loadingStudents || loadingAttendance ? "animate-spin" : ""
                }`}
              />
              <span>তথ্য রিফ্রেশ করুন</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Controls & Filter (Only on Entry tab) */}
        {activeTab === "entry" && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Quick Bulk Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                দ্রুত একশন:
              </span>
              <button
                onClick={() => handleMarkAll("present")}
                disabled={students.length === 0}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>সবাইকে উপস্থিত করুন</span>
              </button>

              <button
                onClick={() => handleMarkAll("absent")}
                disabled={students.length === 0}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>সবাইকে অনুপস্থিত করুন</span>
              </button>

              <button
                onClick={() => handleMarkAll("late")}
                disabled={students.length === 0}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>সবাইকে লেট করুন</span>
              </button>

              {hasUnsavedChanges && (
                <button
                  onClick={handleResetToSaved}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-medium transition-all"
                >
                  রিসেট
                </button>
              )}
            </div>

            {/* In-Class Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="রোল বা নাম দিয়ে খুঁজুন..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Real-Time Summary Metric Cards for Selected Class on Date */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Enrolled */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">মোট শিক্ষার্থী</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {classStats.total} জন
            </h3>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">উপস্থিত (Present)</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {classStats.present} জন
            </h3>
          </div>
        </div>

        {/* Absent Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">অনুপস্থিত (Absent)</p>
            <h3 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {classStats.absent} জন
            </h3>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">উপস্থিতি হার</p>
            <h3 className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5">
              {classStats.rate}%
            </h3>
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: TAB 1 (Daily Entry) vs TAB 2 (Report & History) */}
      {activeTab === "entry" ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Table Header & Save Floating Banner */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>হাজিরা রেজিস্টার: শ্রেণি {selectedClass}</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  {selectedDate}
                </span>
              </h2>
              {lastSavedTime && (
                <p className="text-[11px] text-slate-400">
                  সর্বশেষ সংরক্ষণ: {new Date(lastSavedTime).toLocaleTimeString("bn-BD")}
                </p>
              )}
            </div>

            {/* Save Attendance Button */}
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  অসংরক্ষিত পরিবর্তন
                </span>
              )}

              <button
                onClick={handleSaveAttendance}
                disabled={savingAttendance || students.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all disabled:opacity-50"
              >
                {savingAttendance ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>হাজিরা সংরক্ষণ করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loadingStudents || loadingAttendance ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                শ্রেণির শিক্ষার্থীদের হাজিরা লোড হচ্ছে...
              </p>
            </div>
          ) : errorStudents ? (
            <div className="py-16 text-center text-rose-500 text-sm px-4">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
              {errorStudents}
            </div>
          ) : displayedStudents.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm px-4 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p>এই শ্রেণিতে কোনো সক্রিয় শিক্ষার্থী পাওয়া যায়নি।</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-bold w-16 text-center">রোল</th>
                      <th className="py-3.5 px-4 font-bold">শিক্ষার্থীর নাম ও আইডি</th>
                      <th className="py-3.5 px-4 font-bold text-center">বর্তমান স্ট্যাটাস</th>
                      <th className="py-3.5 px-4 font-bold text-center">হাজিরা নির্ধারণ (Action)</th>
                      <th className="py-3.5 px-4 font-bold">মন্তব্য (ঐচ্ছিক)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {displayedStudents.map((student) => {
                      const currentStatus = attendanceMap[student.studentId]?.status || "present";
                      const currentRemarks = attendanceMap[student.studentId]?.remarks || "";

                      return (
                        <tr
                          key={student._id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {/* Roll Number */}
                          <td className="py-3.5 px-4 font-mono font-bold text-center text-slate-800 dark:text-slate-200">
                            {student.roll || "—"}
                          </td>

                          {/* Student Details */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 dark:border-emerald-800">
                                {student.studentImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={student.studentImage}
                                    alt={student.studentNameBangla}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  (student.studentNameBangla || student.studentNameEnglish || "S").charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                  {student.studentNameBangla || student.studentNameEnglish}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  আইডি: {student.studentId || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                currentStatus === "present"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300"
                                  : currentStatus === "absent"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300"
                              }`}
                            >
                              {currentStatus === "present" ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>উপস্থিত</span>
                                </>
                              ) : currentStatus === "absent" ? (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>অনুপস্থিত</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>বিলম্বিত</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* Interactive Action Buttons */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1">
                              {/* Present Button */}
                              <button
                                onClick={() => handleSetStatus(student.studentId, "present")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                  currentStatus === "present"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>হাজিরা</span>
                              </button>

                              {/* Absent Button */}
                              <button
                                onClick={() => handleSetStatus(student.studentId, "absent")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                  currentStatus === "absent"
                                    ? "bg-rose-600 text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>অনুপস্থিত</span>
                              </button>

                              {/* Late Button */}
                              <button
                                onClick={() => handleSetStatus(student.studentId, "late")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                  currentStatus === "late"
                                    ? "bg-amber-600 text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>লেট</span>
                              </button>
                            </div>
                          </td>

                          {/* Remarks */}
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              value={currentRemarks}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAttendanceMap((prev) => ({
                                  ...prev,
                                  [student.studentId]: {
                                    ...(prev[student.studentId] || {}),
                                    remarks: val,
                                  },
                                }));
                              }}
                              placeholder="মন্তব্য (ছুটি, অসুস্থ...)"
                              className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-600 dark:text-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE & TABLET RESPONSIVE CARDS */}
              <div className="md:hidden p-3 divide-y divide-slate-100 dark:divide-slate-800">
                {displayedStudents.map((student) => {
                  const currentStatus = attendanceMap[student.studentId]?.status || "present";

                  return (
                    <div key={student._id} className="py-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold flex items-center justify-center text-xs">
                            {student.roll || "—"}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">
                              {student.studentNameBangla || student.studentNameEnglish}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              আইডি: {student.studentId || "—"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            currentStatus === "present"
                              ? "bg-emerald-100 text-emerald-800"
                              : currentStatus === "absent"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {currentStatus === "present" ? "উপস্থিত" : currentStatus === "absent" ? "অনুপস্থিত" : "লেট"}
                        </span>
                      </div>

                      {/* Mobile Full-Width Button Group */}
                      <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                        <button
                          onClick={() => handleSetStatus(student.studentId, "present")}
                          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                            currentStatus === "present"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>হাজিরা</span>
                        </button>

                        <button
                          onClick={() => handleSetStatus(student.studentId, "absent")}
                          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                            currentStatus === "absent"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>অনুপস্থিত</span>
                        </button>

                        <button
                          onClick={() => handleSetStatus(student.studentId, "late")}
                          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                            currentStatus === "late"
                              ? "bg-amber-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>লেট</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Sticky Bottom Save Action Bar for Mobile */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              মোট শিক্ষার্থী: {displayedStudents.length} জন
            </span>

            <button
              onClick={handleSaveAttendance}
              disabled={savingAttendance || students.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {savingAttendance ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>হাজিরা সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* TAB 2: Attendance Report & Historical Logs */
        <div className="space-y-6">
          {/* Analytics Summary */}
          {reportData.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">রেকর্ডকৃত কার্যদিবস</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {reportData.metrics.totalSessions} দিন
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">গড় উপস্থিতি হার</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {reportData.metrics.overallRate}%
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">মোট উপস্থিত গণনা</p>
                <h3 className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                  {reportData.metrics.sumPresent} জন
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">মোট অনুপস্থিত গণনা</p>
                <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {reportData.metrics.sumAbsent} জন
                </h3>
              </div>
            </div>
          )}

          {/* Historical Log Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  শ্রেণি {selectedClass} এর অতীত হাজিরা রেকর্ড
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                মোট রেকর্ড: {reportData.history.length} দিন
              </span>
            </div>

            {loadingReport ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">হাজিরা রিপোর্ট লোড হচ্ছে...</p>
              </div>
            ) : reportData.history.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                এই শ্রেণির জন্য পূর্বে কোনো হাজিরার রেকর্ড সংরক্ষিত হয়নি।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[11px] uppercase bg-slate-50 dark:bg-slate-900/80 text-slate-500 border-b border-slate-200/60 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4 font-bold">তারিখ</th>
                      <th className="py-3 px-4 font-bold text-center">উপস্থিত</th>
                      <th className="py-3 px-4 font-bold text-center">অনুপস্থিত</th>
                      <th className="py-3 px-4 font-bold text-center">বিলম্বিত</th>
                      <th className="py-3 px-4 font-bold text-center">উপস্থিতি হার</th>
                      <th className="py-3 px-4 font-bold text-right">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reportData.history.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">
                          {record.date}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                          {record.presentCount || 0} জন
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-rose-600">
                          {record.absentCount || 0} জন
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-600">
                          {record.lateCount || 0} জন
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {record.attendanceRate || 0}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedDate(record.date);
                              setActiveTab("entry");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all"
                          >
                            হাজিরা এডিট করুন
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClassAttendanceReportPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">হাজিরা পোর্টাল লোড হচ্ছে...</p>
        </div>
      }
    >
      <AttendanceReportContent />
    </Suspense>
  );
}
