"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
  MessageSquareQuote,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Calendar,
  ExternalLink,
  Eye,
  X,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AdminParentPortalPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [feedbacks, setFeedbacks] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [classSubjectsMap, setClassSubjectsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchQuery, setSearchQuery] = useState("");

  // Shareable Link State
  const [copiedLink, setCopiedLink] = useState(false);

  // Modal Detail View State
  const [activeFeedback, setActiveFeedback] = useState(null);

  const userRole = (session?.user?.role || "").toLowerCase();
  const isAdmin =
    userRole === "admin" ||
    userRole === "superadmin" ||
    userRole === "administrator";

  // Redirect non-admins immediately if session resolves to a non-admin role
  useEffect(() => {
    if (!sessionLoading && session?.user && !isAdmin) {
      router.replace("/dashboard/unauthorized");
    }
  }, [sessionLoading, session, isAdmin, router]);

  const fetchFeedbacks = useCallback(async () => {
    if (sessionLoading) return;
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedClass !== "all") params.set("className", selectedClass);
      if (selectedSubject !== "all") params.set("subject", selectedSubject);
      if (selectedYear !== "all") params.set("academicYear", selectedYear);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/parent-feedback?${params.toString()}`);
      const result = await res.json();

      if (res.status === 403) {
        setError("অ্যাক্সেস অনুমোদিত নয়। শুধুমাত্র অ্যাডমিন এই পেজটি দেখতে পারবেন।");
        return;
      }

      if (res.ok && result.success) {
        setFeedbacks(Array.isArray(result.data) ? result.data : []);
        if (Array.isArray(result.classes)) {
          setClassesList(result.classes);
        }
        if (result.classSubjects) {
          setClassSubjectsMap(result.classSubjects);
        }
      } else {
        setError(result.message || "অভিভাবক মতামত তালিকা লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching parent feedbacks:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, [
    sessionLoading,
    isAdmin,
    selectedClass,
    selectedSubject,
    selectedYear,
    searchQuery,
  ]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Dynamic Subjects Filter Options (from DB syllabus collection)
  const subjectOptions = useMemo(() => {
    const extractSubjectName = (s) =>
      typeof s === "string"
        ? s.trim()
        : String(s?.subject || s?.subjectName || s?.name || "").trim();

    if (selectedClass !== "all") {
      return (classSubjectsMap[selectedClass] || [])
        .map(extractSubjectName)
        .filter(Boolean);
    }
    const allSubjects = new Set();
    Object.values(classSubjectsMap).forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach((s) => {
          const name = extractSubjectName(s);
          if (name) allSubjects.add(name);
        });
      }
    });
    return Array.from(allSubjects);
  }, [selectedClass, classSubjectsMap]);

  // Summary Statistics
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const withSubjectComment = feedbacks.filter(
      (f) =>
        (f.q10_selectedSubject && f.q10_teacherComment) ||
        (Array.isArray(f.q10_subjectFeedbacks) &&
          f.q10_subjectFeedbacks.length > 0),
    ).length;
    const withSuggestions = feedbacks.filter(
      (f) =>
        f.q11_suggestionsOrComplaints &&
        f.q11_suggestionsOrComplaints.trim().length > 0,
    ).length;
    const highlySatisfied = feedbacks.filter(
      (f) => f.q8_overallSatisfaction === "অত্যন্ত সন্তুষ্ট",
    ).length;

    return {
      total,
      withSubjectComment,
      withSuggestions,
      highlySatisfied,
    };
  }, [feedbacks]);

  const handleCopyPublicLink = async () => {
    try {
      const publicUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/parent-feedback`
          : "https://aimhabiganj.vercel.app/parent-feedback";
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      toast.success("পাবলিক অভিভাবক মতামত ফরমের লিংক কপি করা হয়েছে!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (_) {
      toast.error("লিংক কপি করা যায়নি।");
    }
  };

  if (sessionLoading) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#00733a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-12 max-w-xl mx-auto text-center space-y-4 bg-white rounded-3xl border border-rose-200 shadow-sm mt-10">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-black text-slate-900">
          অ্যাক্সেস সংরক্ষিত
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          শুধুমাত্র অ্যাডমিন ব্যবহারকারীরা অভিভাবকদের মতামত ও মন্তব্য দেখতে পারবেন।
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen space-y-6 font-bornomala">
      {/* 1. Header Banner & Copy Public Feedback Link Toolbar */}
      <div className="bg-gradient-to-r from-[#022c1b] via-[#00733a] to-[#04472b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold">

              <span>Admin-Only Parent Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              অভিভাবক মতামত পোর্টাল
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl">
              সম্মানিত অভিভাবকদের প্রদত্ত মূল্যায়ন, বিষয়ভিত্তিক শিক্ষক সম্পর্কে মতামত
              এবং পরামর্শসমূহ (শুধুমাত্র অ্যাডমিনদের জন্য সংরক্ষিত)।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">


            <Link
              href="/parent-feedback"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
            >
              <span>ফরম দেখুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#00733a] dark:text-emerald-300 flex items-center justify-center shrink-0">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              মোট প্রাপ্ত মতামত
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total} টি
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              বিষয়ভিত্তিক মন্তব্য (প্রশ্ন ১০)
            </p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.withSubjectComment} টি
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              অত্যন্ত সন্তুষ্ট অভিভাবক
            </p>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.highlySatisfied} জন
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              পরামর্শ / অভিযোগ (প্রশ্ন ১১)
            </p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {stats.withSuggestions} টি
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Student Name / ID / Comment */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিক্ষার্থীর নাম, আইডি বা মন্তব্য খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00733a]"
            />
          </div>

          {/* Filter by Class (from DB syllabus) */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#00733a] shrink-0" />
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("all");
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00733a]"
            >
              <option value="all">সকল শ্রেণি (All Classes)</option>
              {classesList.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Subject (from DB syllabus) */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#00733a] shrink-0" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00733a]"
            >
              <option value="all">সকল বিষয় (All Subjects)</option>
              {subjectOptions.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Academic Year & Refresh */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00733a] shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00733a]"
            >
              <option value="2026">শিক্ষাবর্ষ ২০২৬ (2026)</option>
              <option value="all">সকল শিক্ষাবর্ষ</option>
            </select>

            <button
              type="button"
              onClick={fetchFeedbacks}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Submitted Parent Feedback List */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-14 text-center border border-emerald-900/10 space-y-3">
          <div className="w-9 h-9 border-4 border-[#00733a] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            অভিভাবকদের মতামত লোড হচ্ছে...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-rose-200 text-rose-600 space-y-3">
          <p className="text-sm font-bold">⚠️ {error}</p>
          <button
            type="button"
            onClick={fetchFeedbacks}
            className="px-4 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-14 text-center border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            কোনো অভিভাবক মতামত পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-400">
            উপরের কপি লিংক বাটনে ক্লিক করে অভিভাবকদের সাথে ফরমটি শেয়ার করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {feedbacks.map((item) => {
            const submittedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              : "—";

            return (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-emerald-900/10 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: Student Info, Class & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#00733a] text-white font-black flex items-center justify-center text-base shrink-0">
                      {item.studentName ? item.studentName.charAt(0) : "S"}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {item.studentName}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#00733a] dark:text-emerald-300 text-xs font-extrabold">
                          শ্রেণি: {item.className}
                        </span>
                        {item.studentId && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                            ID: {item.studentId}
                          </span>
                        )}
                        {item.studentRoll && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                            রোল: {item.studentRoll}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        জমা দেওয়ার তারিখ: {submittedDate} • শিক্ষাবর্ষ:{" "}
                        {item.academicYear || "2026"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveFeedback(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#00733a] dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all self-start sm:self-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>সম্পূর্ণ ১১টি উত্তর দেখুন</span>
                  </button>
                </div>

                {/* Quick MCQ Summary Pills (Q3 - Q8) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">
                      ৩. শিক্ষার অগ্রগতি
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.q3_overallProgress}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">
                      ৪. দ্বীনি শিক্ষার মান
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.q4_islamicEducation}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">
                      ৫. শিক্ষকদের যত্ন
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.q5_teachingCare}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">
                      ৬. শৃঙ্খলা ও পরিবেশ
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.q6_disciplineManagement}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">
                      ৭. নৈতিক পরিবর্তন
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.q7_moralBehavioralChange}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                      ৮. সার্বিক সন্তুষ্টি
                    </span>
                    <span className="font-extrabold text-[#00733a] dark:text-amber-300">
                      {item.q8_overallSatisfaction}
                    </span>
                  </div>
                </div>

                {/* Q9: Improvement Areas */}
                {Array.isArray(item.q9_improvementAreas) &&
                  item.q9_improvementAreas.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-500 mr-1">
                        ৯. উন্নয়ন প্রয়োজন:
                      </span>
                      {item.q9_improvementAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}

                {/* Q10 & Q11 Highlighted Written Comments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Q10 Subject-Wise Comment */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-800/40 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                        ১০. বিষয়ভিত্তিক শিক্ষক সম্পর্কে মতামত
                      </span>
                      {Array.isArray(item.q10_subjectFeedbacks) &&
                        item.q10_subjectFeedbacks.length > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-950 dark:text-amber-200 text-[11px] font-black">
                          {item.q10_subjectFeedbacks.length} টি বিষয়ে মতামত
                        </span>
                      ) : (
                        item.q10_selectedSubject && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-950 dark:text-amber-200 text-[11px] font-black">
                            বিষয়: {item.q10_selectedSubject}
                          </span>
                        )
                      )}
                    </div>

                    {Array.isArray(item.q10_subjectFeedbacks) &&
                      item.q10_subjectFeedbacks.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.q10_subjectFeedbacks.map((sf, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-200/50 dark:border-amber-800/30 text-xs"
                          >
                            <span className="font-bold text-amber-900 dark:text-amber-300">
                              {sf.subject}
                              {sf.teacherName ? ` (${sf.teacherName})` : ""}:{" "}
                            </span>
                            <span className="text-slate-700 dark:text-slate-200">
                              {sf.comment}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : item.q10_teacherComment ? (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {item.q10_teacherComment}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-400 italic">
                        কোনো বিষয়ভিত্তিক মন্তব্য প্রদান করা হয়নি
                      </p>
                    )}
                  </div>

                  {/* Q11 Suggestions / Complaints */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-800/40 space-y-1">
                    <span className="text-xs font-extrabold text-[#00733a] dark:text-emerald-300 block">
                      ১১. পরামর্শ, অভিযোগ বা প্রত্যাশা
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {item.q11_suggestionsOrComplaints ? (
                        item.q11_suggestionsOrComplaints
                      ) : (
                        <span className="text-slate-400 italic">
                          কোনো পরামর্শ বা অভিযোগ লেখা হয়নি
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Full 11-Question Response Modal */}
      {activeFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-900/20 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-[#00733a] dark:text-amber-300">
                  বার্ষিক অভিভাবক মতামত ফরম – ২০২৬
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  ১. শিক্ষার্থীর নাম: {activeFeedback.studentName}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  ২. শ্রেণি: {activeFeedback.className}{" "}
                  {activeFeedback.studentId &&
                    `• আইডি: ${activeFeedback.studentId}`}{" "}
                  {activeFeedback.studentRoll &&
                    `• রোল: ${activeFeedback.studentRoll}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFeedback(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  ৩. আপনার সন্তানের সার্বিক শিক্ষার অগ্রগতি কেমন হয়েছে?
                </span>
                <span className="font-black text-[#00733a] dark:text-amber-300 shrink-0">
                  {activeFeedback.q3_overallProgress}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  ৪. প্রতিষ্ঠানের দ্বীনি শিক্ষার মান সম্পর্কে আপনার মতামত কী?
                </span>
                <span className="font-black text-[#00733a] dark:text-amber-300 shrink-0">
                  {activeFeedback.q4_islamicEducation}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  ৫. শিক্ষকদের পাঠদান ও শিক্ষার্থীদের প্রতি যত্ন কেমন ছিল?
                </span>
                <span className="font-black text-[#00733a] dark:text-amber-300 shrink-0">
                  {activeFeedback.q5_teachingCare}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  ৬. প্রতিষ্ঠানের শৃঙ্খলা, পরিবেশ ও ব্যবস্থাপনা সম্পর্কে আপনি কতটুকু সন্তুষ্ট?
                </span>
                <span className="font-black text-[#00733a] dark:text-amber-300 shrink-0">
                  {activeFeedback.q6_disciplineManagement}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  ৭. আপনার সন্তানের আচার-আচরণ ও নৈতিকতায় ইতিবাচক পরিবর্তন লক্ষ্য করেছেন কি?
                </span>
                <span className="font-black text-[#00733a] dark:text-amber-300 shrink-0">
                  {activeFeedback.q7_moralBehavioralChange}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  ৮. সামগ্রিকভাবে AIM Habiganj-এর কার্যক্রমে আপনি কতটুকু সন্তুষ্ট?
                </span>
                <span className="font-black text-[#00733a] dark:text-amber-300 shrink-0">
                  {activeFeedback.q8_overallSatisfaction}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  ৯. আগামী শিক্ষাবর্ষে প্রতিষ্ঠানের কোন বিষয়গুলোর উন্নয়ন বেশি প্রয়োজন বলে মনে করেন?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(activeFeedback.q9_improvementAreas) &&
                    activeFeedback.q9_improvementAreas.length > 0 ? (
                    activeFeedback.q9_improvementAreas.map((area, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#00733a] dark:text-emerald-300 text-xs font-bold"
                      >
                        ✓ {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">নির্বাচন করা হয়নি</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 space-y-2">
                <span className="font-extrabold text-amber-900 dark:text-amber-300 block">
                  ১০. বিষয়ভিত্তিক শিক্ষক সম্পর্কে আপনার মতামত
                </span>
                {Array.isArray(activeFeedback.q10_subjectFeedbacks) &&
                  activeFeedback.q10_subjectFeedbacks.length > 0 ? (
                  <div className="space-y-2">
                    {activeFeedback.q10_subjectFeedbacks.map((sf, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-800/40"
                      >
                        <p className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                          বিষয়: {sf.subject}
                          {sf.teacherName ? ` (${sf.teacherName})` : ""}
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap mt-0.5">
                          {sf.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : activeFeedback.q10_teacherComment ? (
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {activeFeedback.q10_selectedSubject
                      ? `[${activeFeedback.q10_selectedSubject}] `
                      : ""}
                    {activeFeedback.q10_teacherComment}
                  </p>
                ) : (
                  <p className="text-slate-400">কোনো মন্তব্য লেখা হয়নি</p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 space-y-1">
                <span className="font-extrabold text-[#00733a] dark:text-emerald-300 block">
                  ১১. প্রতিষ্ঠানের প্রতি আপনার কোনো পরামর্শ, অভিযোগ বা প্রত্যাশা থাকলে লিখুন:
                </span>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {activeFeedback.q11_suggestionsOrComplaints ||
                    "কোনো পরামর্শ লেখা হয়নি"}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveFeedback(null)}
                className="px-6 py-2 rounded-xl bg-[#00733a] text-white font-bold text-xs sm:text-sm"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
