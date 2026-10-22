"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  AlertCircle,
  FileText,
  Search,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Info,
  RefreshCw,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function StaffNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/notices?status=active&limit=100`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "নোটিশ লোড করতে সমস্যা হয়েছে।");
      }

      setNotices(Array.isArray(data.notices) ? data.notices : []);
    } catch (err) {
      console.error("Fetch staff notices error:", err);
      setError(err.message || "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotices();
  }, [fetchNotices]);

  const formatBanglaDate = (dateInput) => {
    if (!dateInput) return "";
    try {
      return new Intl.DateTimeFormat("bn-BD", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateInput));
    } catch {
      return String(dateInput);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const title = (n.title || "").toLowerCase();
    const content = (n.description || n.content || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = title.includes(q) || content.includes(q);
    const itemCat = (n.category || "general").toLowerCase();
    const matchesCategory = category === "all" || itemCat === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: "all", label: "সকল নোটিশ" },
    { key: "general", label: "সাধারণ" },
    { key: "academic", label: "একাডেমিক" },
    { key: "exam", label: "পরীক্ষা" },
    { key: "holiday", label: "ছুটি" },
    { key: "event", label: "ইভেন্ট" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/dashboard/staff"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-emerald-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ড্যাশবোর্ডে ফিরুন</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-amber-400" />
              <span>স্টাফ নোটিশ ও প্রাতিষ্ঠানিক সার্কুলার</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90">
              মাদরাসা প্রশাসনের পক্ষ থেকে কর্মকর্তা ও কর্মচারীদের জন্য জরুরি বিজ্ঞপ্তি
            </p>
          </div>

          <button
            onClick={fetchNotices}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নোটিশ অনুসন্ধান করুন..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                category === cat.key
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
            <span>নোটিশ লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 text-center text-xs text-rose-500 border border-slate-200 dark:border-slate-800">
            {error}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
            কোনো নোটিশ পাওয়া যায়নি।
          </div>
        ) : (
          filteredNotices.map((n) => {
            const isUrgent =
              n.urgent === true ||
              (n.priority && ["urgent", "high"].includes(String(n.priority).toLowerCase()));

            return (
              <div
                key={n._id || n.id}
                className={`bg-white dark:bg-[#0f172a] rounded-3xl p-6 border shadow-xs transition-all hover:shadow-md space-y-3 ${
                  isUrgent
                    ? "border-amber-400/80 dark:border-amber-500/40"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isUrgent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-black border border-amber-300">
                        জরুরি
                      </span>
                    )}
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                      {n.createdBy || n.author || "মাদরাসা প্রশাসন"}
                    </span>
                    {n.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                        {n.category}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatBanglaDate(n.publishDate || n.createdAt || n.date)}</span>
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  {n.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {n.description || n.content || ""}
                </p>

                {n.attachmentUrl && (
                  <div className="pt-2">
                    <a
                      href={n.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>সংযুক্ত ফাইল / বিজ্ঞপ্তি দেখুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
