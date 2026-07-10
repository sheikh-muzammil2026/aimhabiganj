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
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.list?.map((item, index) => (
          <div key={item.id || index} className="bg-white dark:bg-slate-800 border-l-4 border-emerald-700 p-5 rounded-r-xl shadow-sm">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
              শ্রেণী কক্ষ: {item.room}
            </span>
            <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-300 mt-2">{item.grade}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">👤 {item.teacher}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
