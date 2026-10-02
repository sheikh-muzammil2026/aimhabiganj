"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  Calendar,
  Clock,
  Printer,
  RefreshCw,
  ArrowLeft,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Eye,
  Check,
  Send,
  Plus,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileText,
  BadgeAlert,
  ChevronRight,
  ExternalLink,
  Volume2,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const NOTICE_CATEGORIES = [
  { id: "all", label: "সকল নোটিশ" },
  { id: "পরীক্ষা", label: "পরীক্ষা সংক্রান্ত" },
  { id: "ছুটি", label: "ছুটি ও অবকাশ" },
  { id: "ফি ও একাউন্টিং", label: "ফি ও একাউন্টিং" },
  { id: "একাডেমিক", label: "একাডেমিক নির্দেশনা" },
  { id: "সাধারণ", label: "সাধারণ নোটিশ" },
];

export default function ParentNoticesPage() {
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedbacks"); // "feedbacks" | "notices"

  // Search & Filter States
  const [noticeSearch, setNoticeSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [feedbackCategory, setFeedbackCategory] = useState("all");

  // Modals
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false);

  // New feedback form state (For teachers/admins or demonstration)
  const [newFeedback, setNewFeedback] = useState({
    teacherName: "মাওলানা মুফতি আব্দুল্লাহ",
    designation: "বিভাগীয় প্রধান, হিফজুল কুরআন",
    subject: "আল-কুরআন ও তাজবীদ",
    rating: "ممتاز (চমৎকার)",
    remark: "",
    advice: "",
    category: "quran",
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  // Fetch notices & feedbacks for selected child
  const fetchNoticesAndFeedbacks = async (studentId) => {
    try {
      setLoading(true);
      const url = studentId
        ? `${API_BASE}/api/parent/notices?studentId=${studentId}`
        : `${API_BASE}/api/parent/notices`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.message || "নোটিশ লোড করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error("Notices fetch error:", err);
      toast.error("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchNoticesAndFeedbacks(selectedStudentId);
  }, [selectedStudentId]);

  // Mark feedback as read / acknowledged
  const handleAcknowledgeFeedback = async (feedbackId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/parent/notices/feedback/${feedbackId}/read`,
        { method: "PATCH" }
      );
      const json = await res.json();
      if (json.success) {
        toast.success("উস্তাদের মন্তব্য অবগত হয়েছেন হিসেবে চিহ্নিত করা হয়েছে!");
        // Update local state
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            feedbacks: prev.feedbacks.map((f) =>
              f._id === feedbackId ? { ...f, isAcknowledged: true } : f
            ),
            unreadCount: Math.max(0, (prev.unreadCount || 1) - 1),
          };
        });
      }
    } catch (err) {
      console.error("Acknowledge error:", err);
      toast.error("স্ট্যাটাস হালনাগাদ করতে ব্যর্থ হয়েছে");
    }
  };

  // Submit new teacher feedback
  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.remark.trim()) {
      toast.warning("মন্তব্য পূরণ করুন!");
      return;
    }

    try {
      setSubmittingFeedback(true);
      const res = await fetch(`${API_BASE}/api/teacher/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFeedback,
          studentId: selectedStudentId || data?.student?.studentId || "04189",
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("উস্তাদ মূল্যায়ন সফলভাবে পোস্ট করা হয়েছে!");
        setShowAddFeedbackModal(false);
        setNewFeedback({
          teacherName: "মাওলানা মুফতি আব্দুল্লাহ",
          designation: "বিভাগীয় প্রধান, হিফজুল কুরআন",
          subject: "আল-কুরআন ও তাজবীদ",
          rating: "ممتاز (চমৎকার)",
          remark: "",
          advice: "",
          category: "quran",
        });
        fetchNoticesAndFeedbacks(selectedStudentId);
      } else {
        toast.error(json.message || "সংরক্ষণে ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Submit feedback error:", err);
      toast.error("সার্ভার ত্রুটি ঘটেছে");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const student = data?.student || {};
  const notices = data?.notices || [];
  const feedbacks = data?.feedbacks || [];
  const unreadCount = data?.unreadCount || 0;

  // Filtered notices
  const filteredNotices = notices.filter((n) => {
    const matchesCategory =
      selectedCategory === "all" ||
      n.category?.includes(selectedCategory) ||
      (selectedCategory === "ছুটি" && n.title?.includes("ছুটি"));
    const matchesSearch =
      noticeSearch.trim() === "" ||
      n.title?.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.description?.toLowerCase().includes(noticeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter((f) => {
    if (feedbackCategory === "all") return true;
    return f.category === feedbackCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 p-3 sm:p-5 md:p-8 font-shalda">
      {/* 🟢 PRINT STYLES FOR INSTITUTIONAL NOTICE MODAL */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-notice-modal,
          #printable-notice-modal * {
            visibility: visible;
          }
          #printable-notice-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Header & Child Switcher Bar */}
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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  <span>নোটিশ ও মূল্যায়ন</span>
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {unreadCount}টি নতুন অপঠিত
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
                নোটিশবোর্ড ও শিক্ষক মূল্যায়ন
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                মাদরাসার অফিশিয়াল বিজ্ঞপ্তি ও সন্তানের প্রতি উস্তাদগণের বিশেষ তারবিয়াত মন্তব্য
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
              onClick={() => fetchNoticesAndFeedbacks(selectedStudentId)}
              disabled={loading}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            <button
              onClick={() => setShowAddFeedbackModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>উস্তাদ মূল্যায়ন যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "feedbacks"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>উস্তাদ মূল্যায়ন ও তারবিয়াত মন্তব্য</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-neutral-950 font-extrabold">
                {unreadCount} নতুন
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "notices"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>মাদরাসা নোটিশবোর্ড</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold">
              {notices.length}
            </span>
          </button>
        </div>

        {/* 3. Tab Contents */}
        {loading ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
              নোটিশ ও মন্তব্য লোড করা হচ্ছে...
            </p>
          </div>
        ) : (
          <>
            {/* TAB 1: TEACHER FEEDBACKS & TARBIYAH */}
            {activeTab === "feedbacks" && (
              <div className="space-y-4">
                {/* Category Filter for Feedbacks */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setFeedbackCategory("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        feedbackCategory === "all"
                          ? "bg-emerald-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      সকল মূল্যায়ন ({feedbacks.length})
                    </button>
                    <button
                      onClick={() => setFeedbackCategory("quran")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        feedbackCategory === "quran"
                          ? "bg-emerald-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      কুরআন ও তাজবীদ
                    </button>
                    <button
                      onClick={() => setFeedbackCategory("arabic")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        feedbackCategory === "arabic"
                          ? "bg-emerald-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      আরবি ও ইসলামিক
                    </button>
                    <button
                      onClick={() => setFeedbackCategory("general")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        feedbackCategory === "general"
                          ? "bg-emerald-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      সাধারণ বিষয়
                    </button>
                    <button
                      onClick={() => setFeedbackCategory("character")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        feedbackCategory === "character"
                          ? "bg-emerald-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      আখলাক ও শিষ্টাচার
                    </button>
                  </div>

                  <div className="text-xs text-neutral-500 font-bold hidden sm:block">
                    শিক্ষার্থী: {student.name} | রোল: {student.roll}
                  </div>
                </div>

                {/* Feedback Cards List */}
                {filteredFeedbacks.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
                    <MessageSquare className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                      এই ক্যাটাগরিতে কোনো শিক্ষক মূল্যায়ন নেই
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      উস্তাদগণের নতুন মূল্যায়ন প্রদান করা হলে এখানে প্রদর্শিত হবে।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFeedbacks.map((f, idx) => (
                      <div
                        key={f._id || idx}
                        className={`bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border transition-all ${
                          !f.isAcknowledged
                            ? "border-amber-400/80 dark:border-amber-500/50 shadow-md ring-1 ring-amber-400/30"
                            : "border-neutral-200 dark:border-neutral-800 shadow-xs"
                        }`}
                      >
                        {/* Feedback Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black shrink-0 border border-emerald-300 dark:border-emerald-800">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-neutral-900 dark:text-white text-base">
                                  {f.teacherName}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                  {f.subject}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {f.designation} | তারিখ: {f.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-black shadow-2xs ${
                                f.rating?.includes("ممتاز")
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                                  : "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                              }`}
                            >
                              গ্রেড: {f.rating}
                            </span>

                            {f.isAcknowledged ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                <Check className="w-3.5 h-3.5" />
                                <span>অবগত হয়েছেন</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAcknowledgeFeedback(f._id)}
                                className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg shadow-xs transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>পড়েছি ও অবগত হয়েছি</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Remark Body */}
                        <div className="pt-3.5 space-y-3">
                          <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 leading-relaxed">
                            "{f.remark}"
                          </p>

                          {/* Advice for Parent Box */}
                          {f.advice && (
                            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3 flex items-start gap-2.5">
                              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <div className="text-xs text-amber-900 dark:text-amber-200">
                                <span className="font-black">অভিভাবকের করণীয় / পরামর্শ:</span>{" "}
                                {f.advice}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INSTITUTIONAL NOTICES */}
            {activeTab === "notices" && (
              <div className="space-y-4">
                {/* Search & Category Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 sm:p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                    {NOTICE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? "bg-emerald-800 text-white"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="নোটিশ খুঁজুন..."
                      value={noticeSearch}
                      onChange={(e) => setNoticeSearch(e.target.value)}
                      className="w-full bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-100 pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Notices Grid */}
                {filteredNotices.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
                    <Bell className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                      কোনো নোটিশ পাওয়া যায়নি
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন অথবা ক্যাটাগরি ফিল্টার পরিবর্তন করুন।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredNotices.map((n, idx) => (
                      <div
                        key={n._id || idx}
                        onClick={() => setSelectedNotice(n)}
                        className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                n.urgency === "জরুরি"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300"
                              }`}
                            >
                              {n.urgency || "সাধারণ"}
                            </span>
                            <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{n.date}</span>
                            </span>
                          </div>

                          <h3 className="font-black text-neutral-900 dark:text-white text-base leading-snug line-clamp-2">
                            {n.title}
                          </h3>

                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                            {n.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            {n.publisher || "দারুল উলুম প্রশাসন"}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 font-bold hover:underline">
                            <span>বিস্তারিত পড়ুন</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. NOTICE DETAIL MODAL (READ & PRINT) */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-neutral-900 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-lg">অফিসিয়াল বিজ্ঞপ্তি বিবরণ</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>বিজ্ঞপ্তি প্রিন্ট</span>
                </button>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-500 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Notice Paper */}
            <div id="printable-notice-modal" className="space-y-6">
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-emerald-800 pb-3">
                <div className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase">
                  বিসমিল্লাহির রাহমানির রাহিম
                </div>
                <h2 className="text-2xl font-black text-neutral-900 mt-0.5">
                  দারুল উলুম আল-ইসলামিয়া হাবিবগঞ্জ
                </h2>
                <p className="text-xs text-neutral-600">
                  মাদরাসা রোড, সদর, হাবিবগঞ্জ | ফোন: ০১৭৫০-২৩৯০০১ | ওয়েবসাইট: aimhabiganj.edu.bd
                </p>
                <div className="inline-block mt-2 px-4 py-0.5 bg-emerald-800 text-white text-xs font-black rounded-md">
                  অফিসিয়াল বিজ্ঞপ্তি / নোটিশ
                </div>
              </div>

              {/* Memo Info Row */}
              <div className="flex items-center justify-between text-xs font-bold text-neutral-600 border-b border-neutral-200 pb-2">
                <div>স্মারক নং: {selectedNotice.referenceNo || "AIM/NOT/2026/099"}</div>
                <div>তারিখ: {selectedNotice.date}</div>
              </div>

              {/* Notice Title */}
              <div className="text-center py-2">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-snug">
                  {selectedNotice.title}
                </h3>
              </div>

              {/* Notice Body */}
              <div className="text-sm font-medium text-neutral-800 leading-relaxed space-y-4 whitespace-pre-line text-justify">
                {selectedNotice.description}
              </div>

              {/* Signatures */}
              <div className="pt-16 flex justify-between items-end text-xs font-bold text-neutral-700">
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">
                    {selectedNotice.publisher || "প্রচার শাখা"}
                  </div>
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

      {/* 5. ADD TEACHER FEEDBACK MODAL */}
      {showAddFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative my-auto border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base">উস্তাদ মূল্যায়ন ও মন্তব্য যোগ করুন</h3>
              </div>
              <button
                onClick={() => setShowAddFeedbackModal(false)}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-neutral-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFeedback} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-600 dark:text-neutral-400">উস্তাদের নাম:</label>
                  <input
                    type="text"
                    value={newFeedback.teacherName}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, teacherName: e.target.value })
                    }
                    className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-600 dark:text-neutral-400">পদবি:</label>
                  <input
                    type="text"
                    value={newFeedback.designation}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, designation: e.target.value })
                    }
                    className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-600 dark:text-neutral-400">বিষয়:</label>
                  <input
                    type="text"
                    value={newFeedback.subject}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, subject: e.target.value })
                    }
                    className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-600 dark:text-neutral-400">মূল্যায়ন গ্রেড:</label>
                  <select
                    value={newFeedback.rating}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, rating: e.target.value })
                    }
                    className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 font-bold cursor-pointer"
                  >
                    <option value="ممتاز (চমৎকার)">ممتاز (চমৎকার)</option>
                    <option value="উত্তম (جيد جدا)">উত্তম (جيد جدا)</option>
                    <option value="ভালো (جيد)">ভালো (جيد)</option>
                    <option value="বিশেষ যত্ন প্রয়োজন">বিশেষ যত্ন প্রয়োজন</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400">ক্যাটাগরি:</label>
                <select
                  value={newFeedback.category}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, category: e.target.value })
                  }
                  className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 font-bold cursor-pointer"
                >
                  <option value="quran">আল-কুরআন ও তাজবীদ</option>
                  <option value="arabic">আরবি ও ইসলামিক পাঠ</option>
                  <option value="general">সাধারণ বিষয় (গণিত, বিজ্ঞান, ভাষা)</option>
                  <option value="character">আখলাক ও শিষ্টাচার</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400">
                  মূল মন্তব্য ও পর্যবেক্ষণ:
                </label>
                <textarea
                  rows={3}
                  value={newFeedback.remark}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, remark: e.target.value })
                  }
                  placeholder="শিক্ষার্থীর পাঠাভ্যাস, অগ্রগতি বা উন্নতির ক্ষেত্র লিখুন..."
                  className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400">
                  অভিভাবকের করণীয় / পরামর্শ:
                </label>
                <input
                  type="text"
                  value={newFeedback.advice}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, advice: e.target.value })
                  }
                  placeholder="বাসায় অনুশীলনের দিকনির্দেশনা..."
                  className="w-full bg-neutral-100 dark:bg-neutral-800 mt-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFeedbackModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingFeedback ? "সংরক্ষণ হচ্ছে..." : "পোস্ট করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
