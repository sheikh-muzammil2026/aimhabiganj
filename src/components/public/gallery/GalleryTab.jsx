// components/public/gallery/GalleryTab.jsx
"use client";
import { useState } from "react";

export default function GalleryTab() {
  const [activeTab, setActiveTab] = useState("photos"); // 'photos' অথবা 'videos'

  // ডামি ডেটা (পরবর্তীতে আপনার API এর সাথে যুক্ত করতে পারবেন)
  const galleryData = {
    title: "মাদরাসা মিডিয়া গ্যালারি",
    subtitle: "আমাদের বিভিন্ন দ্বীনি মাহফিল, প্রতিযোগিতা, ক্যাম্পাস ও ভিডিওর সংকলন",
    photos: [
      { id: 1, title: "মাদরাসার প্রধান ফটক ও মূল ভবন", tag: "ক্যাম্পাস" },
      { id: 2, title: "বার্ষিক দাস্তারবন্দী ও দুআ মাহফিল", tag: "অনুষ্ঠান" },
      { id: 3, title: "পুরস্কার বিতরণী অনুষ্ঠান", tag: "প্রতিযোগিতা" },
      { id: 4, title: "স্মার্ট ক্লাসরুমে কিতাব পাঠদান", tag: "শিক্ষা" },
      { id: 5, title: "হিফজ সমাপনী ছাত্রদের দস্তার", tag: "অনুষ্ঠান" },
      { id: 6, title: "মাদরাসার মনোরম কেন্দ্রীয় লাইব্রেরি", tag: "ক্যাম্পাস" }
    ],
    videos: [
      { id: 1, title: "মাদরাসার বার্ষিক মাহফিলের সমাপনী বয়ান ও আখেরি মোনাজাত", length: "৪৫:২০", platform: "YouTube" },
      { id: 2, title: "হিফজ বিভাগের ছাত্রদের চমৎকার কুরআন তিলাওয়াত", length: "০৫:১৫", platform: "YouTube" },
      { id: 3, title: "নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম ও মাদরাসা পরিচিতি ভিডিও", length: "১০:৪০", platform: "Facebook" },
      { id: 4, title: "জাতীয় হিফজ প্রতিযোগিতায় আমাদের ছাত্রদের সাফল্য", length: "১২:৩০", platform: "YouTube" }
    ]
  };

  return (
    <div className="site-container py-12">
      {/* হেডার সেকশন */}
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {galleryData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{galleryData.subtitle}</p>
      </div>

      {/* ফটো ও ভিডিও সুইচিং ট্যাব বাটন */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-1.5 rounded-2xl flex gap-1 border border-[#90CAF9] shadow-xs">
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "photos"
                ? "bg-[#2196F3] text-white shadow-sm"
                : "text-[#1E293B] hover:text-[#0D47A1] hover:bg-[#E3F2FD]"
            }`}
          >
            🖼️ ফটো গ্যালারি ({galleryData.photos.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "videos"
                ? "bg-[#2196F3] text-white shadow-sm"
                : "text-[#1E293B] hover:text-[#0D47A1] hover:bg-[#E3F2FD]"
            }`}
          >
            🎥 ভিডিও গ্যালারি ({galleryData.videos.length})
          </button>
        </div>
      </div>

      {/* কন্টেন্ট ডিসপ্লে (শর্তসাপেক্ষে পরিবর্তন হবে) */}
      {activeTab === "photos" ? (
        /* ফটো গ্রিড লেআউট */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {galleryData.photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl p-3 border border-[#90CAF9] shadow-sm group hover:shadow-md transition-all">
              <div className="w-full h-52 bg-[#E3F2FD] rounded-xl flex flex-col items-center justify-center text-[#0D47A1] relative overflow-hidden border border-[#90CAF9]/40">
                <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">🕌</span>
                <span className="text-xs font-semibold opacity-75">ফটো প্লেসহোল্ডার</span>
                <span className="absolute top-3 left-3 bg-[#2196F3] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {photo.tag}
                </span>
              </div>
              <div className="pt-3 px-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#0D47A1] truncate">{photo.title}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ভিডিও গ্রিড লেআউট */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 animate-fadeIn">
          {galleryData.videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl p-4 border border-[#90CAF9] shadow-sm group hover:shadow-md transition-all flex flex-col justify-between">
              {/* ভিডিও প্লেয়ার প্লেসহোল্ডার */}
              <div className="w-full h-48 bg-[#0D47A1] rounded-xl flex flex-col items-center justify-center text-white relative group overflow-hidden cursor-pointer border border-[#90CAF9]/40">
                {/* লাল রঙের প্লে বাটন */}
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform z-10">
                  ▶
                </div>
                <span className="text-[10px] font-semibold tracking-wider opacity-60 mt-2 z-10 uppercase">{video.platform} PLAYER</span>
                
                {/* ভিডিওর ডিউরেশন বা দৈর্ঘ্য */}
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  ⏱️ {video.length}
                </span>
              </div>
              
              <div className="pt-4">
                <h4 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
