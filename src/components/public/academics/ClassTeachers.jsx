// components/public/academics/ClassTeachers.jsx
"use client";

export default function ClassTeachers({ data }) {
  const fallbackData = {
    title: "শ্রেণী শিক্ষকের তালিকা",
    subtitle: "চলতি শিক্ষাবর্ষে বিভিন্ন শ্রেণীর দায়িত্বপ্রাপ্ত সম্মানিত ওস্তাদবৃন্দ",
    list: [
      { id: 1, grade: "হিফজ বিভাগ (সবুজ শাখা)", teacher: "মাওলানা হাফেজ ওবায়দুল্লাহ", room: "১০২" },
      { id: 2, grade: "মিশকাত (স্নাতক ১ম বর্ষ)", teacher: "মুফতি তারিক জামিল", room: "২০৪" },
      { id: 3, grade: "নাহবেমীর (মাধ্যমিক)", teacher: "মাওলানা আব্দুল করিম", room: "৩০১" }
    ]
  };

  const currentData = data || fallbackData;

  return (
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.list?.map((item, index) => (
          <div key={item.id || index} className="bg-white border border-[#90CAF9] border-l-4 border-l-[#2196F3] p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-[#0D47A1] bg-[#E3F2FD] border border-[#90CAF9] px-2.5 py-1 rounded-md">
              শ্রেণী কক্ষ: {item.room}
            </span>
            <h4 className="text-base font-bold text-[#0D47A1] mt-3">{item.grade}</h4>
            <p className="text-sm text-[#1E293B] mt-1">👤 {item.teacher}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
