// components/public/hostel/HostelDirectors.jsx
"use client";

export default function HostelDirectors({ data }) {
  const fallbackData = {
    title: "আবাসিক হলের পরিচালকবৃন্দ",
    subtitle: "ছাত্রাবাসের সার্বিক শৃঙ্খলা ও ছাত্রদের দেখভালে নিয়োজিত জিম্মাদার ওস্তাদগণ",
    list: [
      { id: 1, name: "মাওলানা আব্দুল করিম", role: "প্রধান নাযেম (আবাসিক প্রধান)", room: "হাদিস হল, ১০১" },
      { id: 2, name: "হাফেজ মাওলানা নোমান", role: "সহকারী নাযেম (শৃঙ্খলা)", room: "কুরআন হল, ২০২" },
      { id: 3, name: "মুফতি সোলায়মান আহমেদ", role: "আবাসিক তত্ত্বাবধায়ক (খাদ্য ও পুষ্টি)", room: "নূরানী হল, ৩০৫" }
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
        {currentData.list?.map((director, index) => (
          <div key={director.id || index} className="bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm text-center relative overflow-hidden group">
            <div className="w-14 h-14 bg-emerald-900 dark:bg-slate-700 text-white font-bold rounded-full flex items-center justify-center mx-auto text-xl mb-3">
              🕌
            </div>
            <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-300">{director.name}</h4>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">{director.role}</p>
            <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900 py-1 px-3 rounded-full inline-block mt-3 border border-gray-100 dark:border-slate-800">
              📍 অফিস/কক্ষ: {director.room}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
