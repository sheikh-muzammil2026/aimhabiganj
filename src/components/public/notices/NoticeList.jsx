// components/public/notices/NoticeList.jsx
"use client";
import { useState } from "react";

export default function NoticeList({ data }) {
  const [activeTab, setActiveTab] = useState("all");

  const fallbackData = {
    title: "মাদরাসা নোটিশ বোর্ড",
    subtitle: "গুরুত্বপূর্ণ ঘোষণা, ভর্তি, পরীক্ষা ও ছুটি সংক্রান্ত সর্বশেষ আপডেট",
    categories: [
      { id: "all", label: "সকল নোটিশ" },
      { id: "exam", label: "পরীক্ষা সংক্রান্ত" },
      { id: "holiday", label: "ছুটির নোটিশ" },
      { id: "general", label: "সাধারণ" }
    ],
    list: [
      { id: 1, type: "exam", title: "১৪৪৭ হিজরী শিক্ষাবর্ষের সাময়িক পরীক্ষার সময়সূচী প্রকাশ", date: "১০ জুলাই, २०२৬", size: "১.২ MB" },
      { id: 2, type: "holiday", title: "আসন্ন পবিত্র আশুরা উপলক্ষে মাদরাসা বন্ধের বিজ্ঞপ্তি", date: "০৮ জুলাই, २०२৬", size: "৮৫০ KB" },
      { id: 3, type: "general", title: "নতুন শিক্ষাবর্ষে কিতাব বিভাগে ছাত্র ভর্তির নিয়মাবলী ও শর্তসমূহ", date: "০১ জুলাই, २०२৬", size: "২.৪ MB" }
    ]
  };

  const currentData = data || fallbackData;
  const filteredList = activeTab === "all" ? currentData.list : currentData.list?.filter(n => n.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>

      {/* ক্যাটাগরি ফিল্টার ট্যাব */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {currentData.categories?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all border ${
              activeTab === tab.id
                ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* নোটিশ তালিকা */}
      <div className="space-y-4">
        {filteredList?.map((notice) => (
          <div key={notice.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-200 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center text-emerald-800 dark:text-emerald-400 flex-shrink-0 border border-emerald-100/50">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 leading-snug">{notice.title}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-gray-400">
                  <span>📅 প্রকাশিত: {notice.date}</span>
                  <span>💾 সাইজ: {notice.size}</span>
                </div>
              </div>
            </div>
            <button className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 self-end sm:self-center">
              📥 ডাউনলোড
            </button>
          </div>
        ))}
        {filteredList?.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">এই ক্যাটাগরিতে বর্তমানে কোনো নোটিশ নেই।</p>
        )}
      </div>
    </div>
  );
}
