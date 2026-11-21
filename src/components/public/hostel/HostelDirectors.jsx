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
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.list?.map((director, index) => (
          <div key={director.id || index} className="bg-white border border-[#90CAF9] p-5 rounded-2xl shadow-sm text-center relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#0D47A1] text-white font-bold rounded-full flex items-center justify-center mx-auto text-xl mb-3 border-2 border-[#90CAF9]/50">
              🕌
            </div>
            <h4 className="text-base font-bold text-[#0D47A1]">{director.name}</h4>
            <p className="text-xs font-semibold text-[#2196F3] mt-1">{director.role}</p>
            <div className="text-[11px] font-medium text-[#1E293B] bg-[#E3F2FD] py-1 px-3 rounded-full inline-block mt-3 border border-[#90CAF9]">
              📍 অফিস/কক্ষ: {director.room}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
