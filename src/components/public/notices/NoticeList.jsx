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
    <div className="site-container py-12">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      {/* ক্যাটাগরি ফিল্টার ট্যাব */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {currentData.categories?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all border cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#2196F3] text-white border-[#2196F3] shadow-sm"
                : "bg-white text-[#1E293B] border-[#90CAF9] hover:bg-[#E3F2FD]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* নোটিশ তালিকা */}
      <div className="space-y-4">
        {filteredList?.map((notice) => (
          <div key={notice.id} className="bg-white border border-[#90CAF9] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex flex-col items-center justify-center text-[#0D47A1] flex-shrink-0 border border-[#90CAF9]/50">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#0D47A1] leading-snug">{notice.title}</h4>
                {notice.description && (
                  <p className="text-xs text-[#1E293B] mt-1 line-clamp-2">{notice.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-500">
                  <span>📅 প্রকাশিত: {notice.date}</span>
                  <span>💾 {notice.size}</span>
                </div>
              </div>
            </div>
            {notice.attachmentUrl ? (
              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4 self-end sm:self-center whitespace-nowrap"
              >
                📥 ডাউনলোড / দেখুন
              </a>
            ) : (
              <span className="text-xs text-[#0D47A1] self-end sm:self-center font-bold px-3 py-1 bg-[#E3F2FD] border border-[#90CAF9] rounded-full">
                বিজ্ঞপ্তি
              </span>
            )}
          </div>
        ))}
        {filteredList?.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">এই ক্যাটাগরিতে বর্তমানে কোনো নোটিশ নেই।</p>
        )}
      </div>
    </div>
  );
}
