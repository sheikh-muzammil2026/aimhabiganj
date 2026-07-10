// components/public/academics/EducationLevels.jsx
"use client";

export default function EducationLevels({ data }) {
  const fallbackData = {
    title: "আমাদের শিক্ষা স্তর",
    subtitle: "নূরানী ও হিফজ থেকে শুরু করে উচ্চতর দাওরায়ে হাদীস পর্যন্ত বিস্তৃত শিক্ষাক্রম",
    list: [
      { id: 1, name: "প্রাথমিক ও নূরানী", duration: "৩ বছর", desc: "কোরআন মাজীদ সহীহ তিলাওয়াত, বুনিয়াদী দ্বীনিয়াত ও সাধারণ শিক্ষার হাতেখড়ি।" },
      { id: 2, name: "হিফজুল কুরআন", duration: "৩-৪ বছর", desc: "তাজবীদসহ সম্পূর্ণ কুরআন মুখস্থকরণ এবং দৈনন্দিন মাসআলা-মাসায়েল শিক্ষা।" },
      { id: 3, name: "কিতাব বিভাগ (মাওলানা কোর্স)", duration: "৮ বছর", desc: "আরবী ভাষা, হাদীস, তাফসীর, ফিকহ ও উসূলে ফিকহের নিয়মতান্ত্রিক উচ্চশিক্ষা।" }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentData.list?.map((level, index) => (
          <div key={level.id || index} className="bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700/80 p-6 rounded-2xl relative shadow-md text-center group">
            <div className="w-12 h-12 bg-amber-500 text-white font-bold rounded-full flex items-center justify-center mx-auto -mt-12 shadow-md">
              {index + 1}
            </div>
            <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-300 mt-4">{level.name}</h4>
            <span className="text-xs font-semibold text-emerald-800 dark:text-amber-400/90 block mt-1">🕒 মেয়াদ: {level.duration}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">{level.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
