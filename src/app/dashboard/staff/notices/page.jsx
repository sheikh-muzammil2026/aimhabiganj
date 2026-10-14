"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function StaffNoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const notices = [
    {
      id: "st-not-01",
      title: "স্টাফদের দৈনিক ২ টার্ম হাজিরা সময়সূচী যথাযথ অনুসরণের নির্দেশ",
      category: "attendance",
      date: "১০ অক্টোবর ২০২৬",
      author: "অধ্যক্ষ মহোদয় কার্যালয়",
      urgent: true,
      content:
        "আস-সালাম আইডিয়াল মাদরাসার সকল সম্মানিত কর্মকর্তা ও কর্মচারীদের সদয় অবগতির জন্য জানানো যাচ্ছে যে, মাদরাসার ডিজিটাল হাজিরা সিস্টেম অনুযায়ী ১ম টার্মের প্রবেশ হাজিরা সকাল ৫:৩০ টার মধ্যে এবং ২য় টার্মের প্রস্থান হাজিরা রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে সম্পন্ন করা বাধ্যতামূলক। ব্যত্যয় ঘটলে স্বয়ংক্রিয়ভাবে বিলম্ব বা আর্লি এক্সিট লিপিবদ্ধ হবে।",
    },
    {
      id: "st-not-02",
      title: "সকল কর্মকর্তা ও কর্মচারীদের ডিজিটাল আইডি কার্ড বহন সংক্রান্ত বিজ্ঞপ্তি",
      category: "general",
      date: "০৫ অক্টোবর ২০২৬",
      author: "প্রশাসন বিভাগ",
      urgent: false,
      content:
        "মাদরাসা প্রাঙ্গণে সার্বক্ষণিক অবস্থানকালে সকল স্টাফ মেম্বারকে নিজস্ব ডিজিটাল পরিচয়পত্র দৃশ্যমান অবস্থায় পরিধান করতে নির্দেশ প্রদান করা হলো। আইডি কার্ড হারিয়ে গেলে অথবা নষ্ট হলে জরুরি ভিত্তিতে সংশ্লিষ্ট শাখায় নতুন কার্ডের জন্য আবেদন করুন।",
    },
    {
      id: "st-not-03",
      title: "ক্যাম্পাস নিরাপত্তা ও গেট লকিং প্রটোকল সংক্রান্ত নির্দেশনা",
      category: "security",
      date: "২৮ সেপ্টেম্বর ২০২৬",
      author: "নিরাপত্তা ও শৃঙ্খলা শাখা",
      urgent: true,
      content:
        "রাতের শিফটের নিরাপত্তা প্রহরী ও সহকারী স্টাফদের রাত ১০:০০ টার মধ্যে মাদরাসার মূল ফটক ও ভেতরের গেইটসমূহ বন্ধ করে তদারকি নিশ্চিত করার নির্দেশ দেওয়া হলো।",
    },
    {
      id: "st-not-04",
      title: "আসন্ন মাসিক বেতন ও বিশেষ ভাতা বিতরণ",
      category: "finance",
      date: "২৫ সেপ্টেম্বর ২০২৬",
      author: "হিসাব বিভাগ",
      urgent: false,
      content:
        "চলতি মাসের বেতন ও ভাতাদি আগামী ১লা তারিখের মধ্যে সংশ্লিষ্ট ব্যাংক হিসাব ও ক্যাশ শাখায় প্রস্তুত থাকবে। কারো কোনো তথ্যগত সংশোধন থাকলে হিসাব শাখায় যোগাযোগ করুন।",
    },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || n.category === category;
    return matchesSearch && matchesCategory;
  });

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
          {["all", "attendance", "security", "general", "finance"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                category === cat
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat === "all"
                ? "সকল নোটিশ"
                : cat === "attendance"
                ? "হাজিরা সংক্রান্ত"
                : cat === "security"
                ? "নিরাপত্তা"
                : cat === "finance"
                ? "হিসাব ও বেতন"
                : "সাধারণ"}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-12 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
            কোনো নোটিশ পাওয়া যায়নি।
          </div>
        ) : (
          filteredNotices.map((n) => (
            <div
              key={n.id}
              className={`bg-white dark:bg-[#0f172a] rounded-3xl p-6 border shadow-xs transition-all hover:shadow-md space-y-3 ${
                n.urgent
                  ? "border-amber-400/80 dark:border-amber-500/40"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.urgent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-black border border-amber-300">
                      জরুরি
                    </span>
                  )}
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                    {n.author}
                  </span>
                </div>

                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{n.date}</span>
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                {n.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {n.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
