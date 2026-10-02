"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  BookOpen,
  Award,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
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

  // Fetch parent overview
  const fetchOverview = async (studentId) => {
    try {
      setLoading(true);
      const url = studentId
        ? `${API_BASE}/api/parent/overview?studentId=${studentId}`
        : `${API_BASE}/api/parent/overview`;

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.message || "ডাটা লোড করা যায়নি");
      }
    } catch (err) {
      console.error("Parent overview error:", err);
      toast.error("সার্ভার থেকে অভিভাবক ড্যাশবোর্ড ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchOverview(selectedStudentId);
  }, [selectedStudentId]);

  const student = data?.student;
  const attendance = data?.attendance || {
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    percentage: 100,
  };
  const sabak = data?.sabak;
  const finance = data?.finance;
  const feedback = data?.teacherFeedback;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-md bg-emerald-800/50 flex-shrink-0">
              {student?.photo ? (
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-300 text-2xl font-bold">
                  👨‍🎓
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  অভিভাবক পোর্টাল
                </span>
                {children.length > 1 && (
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-black/40 text-white text-xs px-2.5 py-1 rounded-xl border border-white/20 focus:outline-none cursor-pointer"
                  >
                    {children.map((c) => (
                      <option key={c.studentId} value={c.studentId} className="text-slate-900">
                        {c.studentNameBangla || c.studentNameEnglish} ({c.previousClass || c.className})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {student?.name || "লোড হচ্ছে..."}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-200/90">
                <span>আইডি: <strong className="text-amber-300 font-mono">{student?.studentId}</strong></span>
                <span>শ্রেণি: <strong>{student?.className}</strong></span>
                <span>রোল: <strong>{student?.roll}</strong></span>
                <span>সেশন: <strong>{student?.sessionYear}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchOverview(selectedStudentId)}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors backdrop-blur-sm"
              title="রিফ্রেশ"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/dashboard/parent/payments"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all shadow-amber-900/20 whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4" />
              <span>অনলাইন ফি পেমেন্ট</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/dashboard/parent/attendance"
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm flex items-center gap-2.5 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">ডিজিটাল হাজিরা</p>
            <p className="text-[10px] text-slate-400 truncate">রিপোর্ট দেখুন</p>
          </div>
        </Link>

        <Link
          href="/dashboard/parent/payments"
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-sm flex items-center gap-2.5 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">ফি ও ভাউচার</p>
            <p className="text-[10px] text-slate-400 truncate">পেমেন্ট রসিদ</p>
          </div>
        </Link>

        <Link
          href="/dashboard/parent/routines"
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm flex items-center gap-2.5 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">ক্লাস ও পরীক্ষা</p>
            <p className="text-[10px] text-slate-400 truncate">একাডেমিক রুটিন</p>
          </div>
        </Link>

        <Link
          href="/dashboard/parent/child-profile"
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm flex items-center gap-2.5 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">সন্তানের তথ্য</p>
            <p className="text-[10px] text-slate-400 truncate">পূর্ণাঙ্গ প্রোফাইল</p>
          </div>
        </Link>

        <Link
          href="/dashboard/parent/notices"
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 shadow-sm flex items-center gap-2.5 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">উস্তাদের বার্তা</p>
            <p className="text-[10px] text-slate-400 truncate">ফিডব্যাক ও নোটিশ</p>
          </div>
        </Link>

        <Link
          href="/dashboard/parent/results"
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 shadow-sm flex items-center gap-2.5 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">পরীক্ষার ফলাফল</p>
            <p className="text-[10px] text-slate-400 truncate">মার্কশিট দেখুন</p>
          </div>
        </Link>
      </div>

      {/* Core Dynamic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Attendance Card (Mapped to students_attendance) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  সন্তানের ডিজিটাল উপস্থিতি
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                লাইভ ডাটা
              </span>
            </div>

            <div className="flex items-center gap-5 my-4">
              <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 flex-shrink-0">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {attendance.percentage}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">উপস্থিতির হার</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>উপস্থিত: <strong>{attendance.presentDays} দিন</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>অনুপস্থিত: <strong>{attendance.absentDays} দিন</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>বিলম্বে উপস্থিতি: <strong>{attendance.lateDays} দিন</strong></span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              {attendance.absentDays === 0
                ? "মাশাআল্লাহ! আপনার সন্তান এ মাসে ১০০% উপস্থিত ছিল।"
                : `এই মাসে শিক্ষার্থী মাত্র ${attendance.absentDays} দিন অনুপস্থিত ছিল। নিয়মিত ক্লাসে উপস্থিতি নিশ্চিত করায় ধন্যবাদ।`}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/dashboard/parent/attendance?studentId=${student?.studentId || ""}`}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>পূর্ণাঙ্গ হাজিরা রিপোর্ট দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Daily Sabak & Amol Report */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  দৈনিক সবক ও আমল রিপোর্ট
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                {sabak?.rating || "উত্তম"}
              </span>
            </div>

            <div className="space-y-3 my-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400">আজকের নতুন পাঠ (সবক)</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {sabak?.currentSabak || "প্যারা: ০৫, পৃষ্ঠা: ১৮"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400">পূর্বের পাঠ (সবকী)</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {sabak?.sabaki || "প্যারা: ০৪ (পূর্ণাঙ্গ রিভিশন)"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400">আমুখতা (পুরোনো মুখস্থ দওর)</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {sabak?.amukhta || "প্যারা ১ থেকে ৩"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>সর্বশেষ আপডেট: {sabak?.lastUpdated}</span>
            <span className="text-emerald-600 font-semibold">নিয়মিত আপডেট</span>
          </div>
        </div>

        {/* Dynamic Payment & Fee Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  মাসিক ফি ও পেমেন্ট স্ট্যাটাস
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                বকেয়া
              </span>
            </div>

            <div className="text-center py-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/50 my-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">চলতি মাসের প্রদেয় ফি ({finance?.dueMonth})</p>
              <p className="text-3xl font-black text-rose-600 mt-1">৳ {finance?.totalDue || "২,৫০০"}</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                পরিশোধের শেষ তারিখ: {finance?.dueDate}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3">
              <div className="flex justify-between">
                <span>পূর্ববর্তী পরিশোধ:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">৳ {finance?.lastPaymentAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>পরিশোধের তারিখ:</span>
                <span>{finance?.lastPaymentDate}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/dashboard/parent/payments"
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shadow-rose-900/20"
            >
              <span>অনলাইনে ফি পরিশোধ করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Teacher Note & Direct Feedback Card */}
      {feedback && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                উস্তাদের পর্যালোচনা ও পরামর্শ
              </span>
              <span className="text-[11px] text-slate-400">• {feedback.date}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-2xl border-l-4 border-amber-500">
              "{feedback.note}"
            </p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
              — {feedback.teacherName} ({feedback.designation})
            </p>
          </div>

          <Link
            href="/dashboard/parent/notices"
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors whitespace-nowrap self-start md:self-center"
          >
            সকল বার্তা দেখুন
          </Link>
        </div>
      )}
    </div>
  );
}
