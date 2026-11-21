// components/about/Roster.jsx
"use client";

export default function Roster({ data }) {
  const fallbackData = {
    title: "কর্মক্ষেত্র ও দায়িত্ব (Roster)",
    subtitle: "মাদরাসার অভ্যন্তরীণ শৃঙ্খলা ও প্রশাসনিক দায়িত্ব বন্টন বিবরণী",
    headers: ["বিভাগ/কর্মক্ষেত্র", "প্রধান দায়িত্বপ্রাপ্ত", "সহকারী/সহযোগী", "মূল ফোকাস"],
    rows: [
      { dept: "শিক্ষা ও পাঠ্যক্রম", head: "মুফতি তারিক জামিল", assistant: "মাওলানা উবায়দুল্লাহ", focus: "সিলেবাস বাস্তবায়ন ও পরীক্ষা নিয়ন্ত্রণ" },
      { dept: "আবাসন ও শৃঙ্খলা", head: "মাওলানা আব্দুল করিম", assistant: "হাফেz নোমান", focus: "ছাত্রাবাস পরিচালনা ও খাবার তদারকি" },
      { dept: "স্মার্ট ক্লাসরুম ও আইটি", head: "জনাব আশরাফুল ইসলাম", assistant: "অফিস সহকারী", focus: "অনলাইন ক্লাস, এক্সাম ও ওয়েবসাইট আপডেট" }
    ]
  };

  const rosterData = data || fallbackData;

  return (
    <div className="site-container">
      <div className="text-center mb-12">
        <h2 className="heading-primary flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-[#2196F3]">❖</span>
          {rosterData.title}
          <span className="hidden sm:inline text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] mt-2">{rosterData.subtitle}</p>
        <div className="w-24 h-1 bg-[#2196F3] mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#0D47A1] rotate-45 border border-[#90CAF9]"></div>
        </div>
      </div>

      {/* রেসপনসিভ টেবিল কন্টেইনার */}
      <div className="overflow-x-auto rounded-2xl border border-[#90CAF9] shadow-md">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#0D47A1] text-white border-b border-[#90CAF9] text-right sm:text-left">
              {rosterData.headers?.map((header, idx) => (
                <th key={idx} className="p-4 font-bold text-[#90CAF9] tracking-wide text-xs sm:text-sm">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#90CAF9]/30 bg-white">
            {rosterData.rows?.map((row, index) => (
              <tr key={index} className="hover:bg-[#E3F2FD]/50 transition-colors">
                <td className="p-4 font-bold text-[#0D47A1]">{row.dept}</td>
                <td className="p-4 font-medium text-[#1E293B]">{row.head}</td>
                <td className="p-4 text-slate-600">{row.assistant}</td>
                <td className="p-4 text-xs font-semibold text-[#0D47A1] bg-[#E3F2FD]/50">{row.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
